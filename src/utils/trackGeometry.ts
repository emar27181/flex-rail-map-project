/**
 * 線形（実際の線路に沿った座標列, src/data/trackGeometry/）の計算。
 *
 * - 地図に描くとき: 駅の並びの間に線形の途中の点を差し込む（expandWithGeometry）
 * - 集めるとき: 出典の線（OSM の way の並び）をつなぎ、駅の位置で区切り、検証する
 *   （stitchWays / splitAtStations / validateGeometry。scripts/track-geometry/collect-osm.mts が使う）
 *
 * 計算はすべて純粋関数にして、テスト（tests/unit/utils/trackGeometry.test.ts）で確かめる。
 */
import type { LatLng, TrackGeometry, TrackSection, TrackStructureKind, TrackStructureSpan } from '../data/trackGeometry/types';

const R = 6371000;
const rad = Math.PI / 180;

/** 2点間の距離（m） */
export function distanceM(a: LatLng, b: LatLng): number {
  const x = (b[1] - a[1]) * rad * Math.cos(((a[0] + b[0]) / 2) * rad);
  const y = (b[0] - a[0]) * rad;
  return R * Math.hypot(x, y);
}

/** 点 p から線分 ab への最短点（t: 0〜1）と距離（m）。短い距離なので平面近似 */
function projectOnSegment(p: LatLng, a: LatLng, b: LatLng): { t: number; distM: number } {
  const k = Math.cos(a[0] * rad);
  const ax = a[1] * k, ay = a[0], bx = b[1] * k, by = b[0], px = p[1] * k, py = p[0];
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  const q: LatLng = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  return { t, distM: distanceM(p, q) };
}

/** 線上で点 p にいちばん近い位置。along は線の始点からの距離（m） */
export function locateOnLine(line: LatLng[], p: LatLng): { segment: number; t: number; distM: number; alongM: number } {
  let best = { segment: 0, t: 0, distM: Infinity, alongM: 0 };
  let acc = 0;
  for (let i = 0; i < line.length - 1; i++) {
    const segLen = distanceM(line[i], line[i + 1]);
    const { t, distM } = projectOnSegment(p, line[i], line[i + 1]);
    if (distM < best.distM) best = { segment: i, t, distM, alongM: acc + segLen * t };
    acc += segLen;
  }
  return best;
}

// ---------------------------------------------------------------- 描画

/**
 * 駅の並び（地図に描く順）の間に線形の点を差し込む。線形の無い区間は直線のまま。
 * 駅の並びが路線データと逆向きでも、区間を逆にたどって使う。
 */
export function expandWithGeometry(
  stations: Array<{ name: string; lat: number; lng: number }>,
  geometry: TrackGeometry | undefined,
): LatLng[] {
  if (!geometry || stations.length === 0) return stations.map(s => [s.lat, s.lng]);
  const forward = new Map<string, LatLng[]>();
  for (const sec of geometry.sections) {
    forward.set(`${sec.from}\u0000${sec.to}`, sec.points);
    forward.set(`${sec.to}\u0000${sec.from}`, [...sec.points].reverse());
  }
  const out: LatLng[] = [[stations[0].lat, stations[0].lng]];
  for (let i = 1; i < stations.length; i++) {
    const pts = forward.get(`${stations[i - 1].name}\u0000${stations[i].name}`);
    if (pts) out.push(...pts);
    out.push([stations[i].lat, stations[i].lng]);
  }
  return out;
}

// ---------------------------------------------------------------- 収集

export interface SourceWay {
  id: string;
  coords: LatLng[];
  kind: TrackStructureKind;
  layer: number | null;
}

export interface StitchedLine {
  points: LatLng[];
  /** 各点がどの構造の way に属するか（points と同じ長さ） */
  kinds: TrackStructureKind[];
  layers: (number | null)[];
  /** つながらなかった箇所（前の way の終点と次の way の始点の距離, m） */
  gaps: { afterWay: string; distM: number }[];
}

/**
 * way の並び（出典のリレーションの順）を1本の線につなぐ。向きが逆の way は反転する。
 * 端点が一致しない箇所は gaps に残す（ここで勝手に補わない。検証で止める）。
 */
export function stitchWays(ways: SourceWay[], joinToleranceM = 1): StitchedLine {
  const res: StitchedLine = { points: [], kinds: [], layers: [], gaps: [] };
  if (ways.length === 0) return res;
  const push = (w: SourceWay, coords: LatLng[], skipFirst: boolean) => {
    coords.forEach((c, i) => {
      if (skipFirst && i === 0) return;
      res.points.push(c); res.kinds.push(w.kind); res.layers.push(w.layer);
    });
  };
  // 最初の way の向きは、次の way につながる端で決める
  let first = ways[0].coords;
  if (ways.length > 1) {
    const next = ways[1].coords;
    const endToNext = Math.min(distanceM(first[first.length - 1], next[0]), distanceM(first[first.length - 1], next[next.length - 1]));
    const startToNext = Math.min(distanceM(first[0], next[0]), distanceM(first[0], next[next.length - 1]));
    if (startToNext < endToNext) first = [...first].reverse();
  }
  push(ways[0], first, false);
  for (let i = 1; i < ways.length; i++) {
    const end = res.points[res.points.length - 1];
    const c = ways[i].coords;
    const dStart = distanceM(end, c[0]);
    const dEnd = distanceM(end, c[c.length - 1]);
    const coords = dEnd < dStart ? [...c].reverse() : c;
    const d = Math.min(dStart, dEnd);
    if (d > joinToleranceM) res.gaps.push({ afterWay: ways[i - 1].id, distM: Math.round(d) });
    push(ways[i], coords, d <= joinToleranceM);
  }
  return res;
}

/** 線を間引く（Douglas-Peucker, 許容誤差 m）。端点と構造の切り替わりの点は残す */
export function simplify(points: LatLng[], keep: boolean[], toleranceM: number): number[] {
  const n = points.length;
  if (n <= 2) return points.map((_, i) => i);
  const mark = new Array<boolean>(n).fill(false);
  mark[0] = mark[n - 1] = true;
  keep.forEach((k, i) => { if (k) mark[i] = true; });
  const stack: [number, number][] = [];
  // 残す点で区切ってから、それぞれの区間を間引く
  let prev = 0;
  for (let i = 1; i < n; i++) if (mark[i]) { stack.push([prev, i]); prev = i; }
  while (stack.length) {
    const [a, b] = stack.pop()!;
    let far = -1, farD = 0;
    for (let i = a + 1; i < b; i++) {
      const d = projectOnSegment(points[i], points[a], points[b]).distM;
      if (d > farD) { farD = d; far = i; }
    }
    if (far >= 0 && farD > toleranceM) { mark[far] = true; stack.push([a, far], [far, b]); }
  }
  return mark.map((m, i) => (m ? i : -1)).filter(i => i >= 0);
}

export interface SplitIssue {
  kind: 'station-far' | 'order' | 'gap' | 'jump';
  detail: string;
}

/**
 * つないだ線を駅の位置で区切って、隣り合う駅の間の区間にする。
 * 駅の並び（路線データの順）に沿って線上の位置が単調に進まなければ order の問題として返す。
 */
export function splitAtStations(
  line: StitchedLine,
  stations: Array<{ name: string; lat: number; lng: number }>,
  opts: { maxStationDistM: number; simplifyM: number },
): { sections: TrackSection[]; issues: SplitIssue[]; stationDistM: number[] } {
  const issues: SplitIssue[] = [];
  const locs = stations.map(s => locateOnLine(line.points, [s.lat, s.lng]));
  const stationDistM = locs.map(l => Math.round(l.distM));
  locs.forEach((l, i) => {
    if (l.distM > opts.maxStationDistM) issues.push({ kind: 'station-far', detail: `${stations[i].name}: 線から ${Math.round(l.distM)}m` });
  });
  // 線の向きが駅の並びと逆なら、線を反転して数え直す
  if (locs.length >= 2 && locs[locs.length - 1].alongM < locs[0].alongM) {
    const rev: StitchedLine = { points: [...line.points].reverse(), kinds: [...line.kinds].reverse(), layers: [...line.layers].reverse(), gaps: line.gaps };
    return splitAtStations(rev, stations, opts);
  }
  for (let i = 1; i < locs.length; i++) {
    if (locs[i].alongM <= locs[i - 1].alongM) issues.push({ kind: 'order', detail: `${stations[i - 1].name}→${stations[i].name}: 線上の順番が逆` });
  }
  for (const g of line.gaps) issues.push({ kind: 'gap', detail: `way ${g.afterWay} の後で ${g.distM}m 途切れている` });

  const sections: TrackSection[] = [];
  for (let i = 1; i < stations.length; i++) {
    const a = locs[i - 1], b = locs[i];
    if (b.alongM <= a.alongM) continue;
    // a の次の頂点から b の頂点までが途中の点
    // 駅の座標と重なる点（1m 以内）は、描くときに駅の座標が入るので除く
    const ends: LatLng[] = [[stations[i - 1].lat, stations[i - 1].lng], [stations[i].lat, stations[i].lng]];
    const idx: number[] = [];
    for (let k = a.segment + 1; k <= b.segment; k++) {
      if (ends.every(e => distanceM(e, line.points[k]) > 1)) idx.push(k);
    }
    const pts = idx.map(k => line.points[k]);
    const kinds = idx.map(k => line.kinds[k]);
    const layers = idx.map(k => line.layers[k]);
    const change = kinds.map((kd, j) => j > 0 && (kd !== kinds[j - 1] || layers[j] !== layers[j - 1]));
    const keepIdx = simplify(pts, change.map((c, j) => c || (j + 1 < change.length && change[j + 1])), opts.simplifyM);
    const kept = keepIdx.map(j => pts[j]);
    const keptKinds = keepIdx.map(j => kinds[j]);
    const keptLayers = keepIdx.map(j => layers[j]);
    for (let j = 1; j < kept.length; j++) {
      const d = distanceM(kept[j - 1], kept[j]);
      if (d > 3000) issues.push({ kind: 'jump', detail: `${stations[i - 1].name}→${stations[i].name}: 点の間が ${Math.round(d)}m` });
    }
    const structures: TrackStructureSpan[] = [];
    keptKinds.forEach((kd, j) => {
      const last = structures[structures.length - 1];
      if (last && last.kind === kd && last.layer === keptLayers[j]) last.toIndex = j;
      else structures.push({ fromIndex: j, toIndex: j, kind: kd, layer: keptLayers[j] });
    });
    sections.push({
      from: stations[i - 1].name,
      to: stations[i].name,
      points: kept.map(([la, ln]) => [Math.round(la * 1e6) / 1e6, Math.round(ln * 1e6) / 1e6] as LatLng),
      ...(structures.length > 0 && !(structures.length === 1 && structures[0].kind === 'untagged' && structures[0].layer === null)
        ? { structures } : {}),
    });
  }
  return { sections, issues, stationDistM };
}

/**
 * 線形のデータを路線データと突き合わせる（データのテストと収集スクリプトが使う）。
 * 返すのは問題の一覧。空なら取り込んでよい。
 */
export function validateGeometry(
  geometry: TrackGeometry,
  stations: Array<{ name: string; lat: number; lng: number }>,
  opts: { maxStationDistM: number; maxJumpM: number },
): string[] {
  const problems: string[] = [];
  const names = stations.map(s => s.name);
  const at = new Map(stations.map(s => [s.name, [s.lat, s.lng] as LatLng]));
  for (const sec of geometry.sections) {
    const ia = names.indexOf(sec.from), ib = names.indexOf(sec.to);
    if (ia < 0 || ib < 0) { problems.push(`${sec.from}→${sec.to}: 路線データに無い駅`); continue; }
    if (Math.abs(ia - ib) !== 1) problems.push(`${sec.from}→${sec.to}: 隣り合う駅ではない`);
    const chain: LatLng[] = [at.get(sec.from)!, ...sec.points, at.get(sec.to)!];
    for (let j = 1; j < chain.length; j++) {
      const d = distanceM(chain[j - 1], chain[j]);
      if (d > opts.maxJumpM) problems.push(`${sec.from}→${sec.to}: 点の間が ${Math.round(d)}m 飛んでいる`);
    }
    if (sec.points.length > 0) {
      const dFirst = distanceM(at.get(sec.from)!, sec.points[0]);
      const dLast = distanceM(sec.points[sec.points.length - 1], at.get(sec.to)!);
      const seg = distanceM(at.get(sec.from)!, at.get(sec.to)!);
      if (dFirst > seg + opts.maxStationDistM || dLast > seg + opts.maxStationDistM) problems.push(`${sec.from}→${sec.to}: 線形が駅から離れた所から始まる/終わる`);
    }
    for (const [la, ln] of sec.points) if (!(Math.abs(la) <= 90 && Math.abs(ln) <= 180)) problems.push(`${sec.from}→${sec.to}: 座標が範囲外`);
    for (const key of ['trackElevationM', 'terrainElevationM'] as const) {
      const v = sec[key];
      if (v && v.length !== sec.points.length) problems.push(`${sec.from}→${sec.to}: ${key} の長さが points と違う`);
    }
    if ((sec.trackElevationM || sec.terrainElevationM) && !geometry.heightReference) problems.push(`${sec.from}→${sec.to}: 標高があるのに高さの基準が無い`);
  }
  return problems;
}
