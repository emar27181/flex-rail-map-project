/**
 * 標高つきの線形データ（data/kanto-line-geometry-2026-10/kanto-lines-3d_*.json）から、
 * 地図の「立体（標高）」表示で読む軽いファイル（public/data/terrain3d-lines.json）を作る。
 *
 *   npx tsx scripts/line-geometry/build-terrain3d.mts
 *
 * - アプリの路線（src/data/routes）と OSM の路線は、名前ではなく**駅の位置**で対応付ける。
 *   元データの appRouteKeys は名前の部分一致で作られていて、湘南新宿ラインの系統の取り違えや
 *   小田急小田原線などの付け漏れがあったため使わない
 * - 路線の駅の多く（MIN_COVERAGE 以上）が線形のすぐ近く（MATCH_M 以内）にある OSM 路線を選び、
 *   その路線の駅の範囲だけを切り出す（直通運転の relation が他社線まで続いていても、その路線の区間だけ）
 * - 3次元の Douglas-Peucker で間引く（SIMPLIFY_M）。標高は元データの値のまま（推測で埋めない）
 * - 対応付けの結果は data/kanto-line-geometry-2026-10/terrain3d-match-report.json に残す
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { routes, type RouteKey } from '../../src/data/routes';
import type { Station } from '../../src/data/yamanote';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DATA_DIR = join(ROOT, 'data/kanto-line-geometry-2026-10');
const OUT = join(ROOT, 'public/data/terrain3d-lines.json');
const REPORT = join(DATA_DIR, 'terrain3d-match-report.json');

/** 駅が線形の「すぐ近く」とみなす距離（m）。路線データの駅座標はホームの中心とは限らないので広めに取る */
export const MATCH_M = 200;
/** 路線の駅のうち、この割合以上が線形の近くにあれば対応付ける */
export const MIN_COVERAGE = 0.9;
/** 間引きの許容誤差（m）。水平・標高の両方に効く */
export const SIMPLIFY_M = 8;
/** 端どうしがこの距離（m）以内のチェーンはつなげる（OSM では終点駅の構内だけ別の way になっていることがある） */
export const JOIN_M = 50;
/** 駅を1つしか含まないチェーンは、この長さ（km）以下なら丸ごと使う（終点駅の構内だけの短い way） */
export const STATION_STUB_KM = 2;

type P3 = [number, number, number];
interface SourceLine {
  relId: number;
  lineName: string;
  operator?: string;
  routeType?: string;
  totalKm?: number;
  paths3d: P3[][];
}

const latestFile = (prefix: string) => {
  const files = readdirSync(DATA_DIR).filter(f => f.startsWith(prefix) && f.endsWith('.json')).sort();
  if (files.length === 0) throw new Error(`${DATA_DIR} に ${prefix}*.json が無い`);
  return join(DATA_DIR, files[files.length - 1]);
};

/** 2点間の距離（m）。数百km以内なので正距円筒近似で足りる */
function distM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const k = Math.cos(((lat1 + lat2) / 2) * Math.PI / 180);
  return Math.hypot((lat1 - lat2) * 110_540, (lon1 - lon2) * 111_320 * k);
}

interface ChainHit { chain: number; index: number; d: number }

/** 駅ごとに、線のどの頂点が一番近いか（MATCH_M 以内のときだけ） */
function stationHits(stations: Station[], line: SourceLine): (ChainHit | null)[] {
  return stations.map(st => {
    let best: ChainHit | null = null;
    line.paths3d.forEach((path, chain) => {
      for (let i = 0; i < path.length; i++) {
        const d = distM(st.lat, st.lng, path[i][0], path[i][1]);
        if (d <= MATCH_M && (!best || d < best.d)) best = { chain, index: i, d };
      }
    });
    return best;
  });
}

function bbox(points: { lat: number; lng: number }[]) {
  let s = 90, n = -90, w = 180, e = -180;
  for (const p of points) { s = Math.min(s, p.lat); n = Math.max(n, p.lat); w = Math.min(w, p.lng); e = Math.max(e, p.lng); }
  return { s, n, w, e };
}
const overlaps = (a: ReturnType<typeof bbox>, b: ReturnType<typeof bbox>, padDeg = 0.01) =>
  a.s <= b.n + padDeg && b.s <= a.n + padDeg && a.w <= b.e + padDeg && b.w <= a.e + padDeg;

/** 3次元の Douglas-Peucker（水平は m に直し、標高も m のまま同じ許容誤差で見る） */
export function simplify3d(points: P3[], tolM: number): P3[] {
  if (points.length <= 2) return points;
  const lat0 = points[0][0];
  const k = Math.cos(lat0 * Math.PI / 180);
  const xyz = points.map(p => [p[1] * 111_320 * k, p[0] * 110_540, p[2]] as const);
  const keep = new Uint8Array(points.length);
  keep[0] = 1; keep[points.length - 1] = 1;
  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay, az] = xyz[a]; const [bx, by, bz] = xyz[b];
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const len2 = dx * dx + dy * dy + dz * dz;
    let maxD = -1, maxI = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py, pz] = xyz[i];
      let t = len2 > 0 ? ((px - ax) * dx + (py - ay) * dy + (pz - az) * dz) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy), pz - (az + t * dz));
      if (d > maxD) { maxD = d; maxI = i; }
    }
    if (maxD > tolM) { keep[maxI] = 1; stack.push([a, maxI], [maxI, b]); }
  }
  return points.filter((_, i) => keep[i]);
}

/**
 * 端が接しているチェーンをつなげる。高崎線の高崎・空港線の京急蒲田のように、
 * 終点の駅だけが数点の別チェーンになっていると、その駅を含む区間を切り出せないため
 */
export function joinTouchingChains(chains: P3[][], joinM = JOIN_M): P3[][] {
  const out = chains.filter(c => c.length >= 1).map(c => [...c]);
  const near = (a: P3, b: P3) => distM(a[0], a[1], b[0], b[1]) <= joinM;
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < out.length; i++) {
      for (let j = 0; j < out.length; j++) {
        if (i === j) continue;
        const a = out[i], b = out[j];
        let joined: P3[] | null = null;
        if (near(a[a.length - 1], b[0])) joined = [...a, ...b];
        else if (near(a[a.length - 1], b[b.length - 1])) joined = [...a, ...[...b].reverse()];
        if (!joined) continue;
        out[i] = joined;
        out.splice(j, 1);
        merged = true;
        break outer;
      }
    }
  }
  return out;
}

const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;
const pathKm = (p: P3[]) => p.reduce((s, pt, i) => (i ? s + distM(p[i - 1][0], p[i - 1][1], pt[0], pt[1]) : 0), 0) / 1000;

function main() {
  const srcFile = latestFile('kanto-lines-3d_');
  const src = JSON.parse(readFileSync(srcFile, 'utf8')) as { meta: Record<string, unknown>; lines: SourceLine[] };
  const lines = src.lines
    .filter(l => l.paths3d?.some(p => p.length >= 2))
    .map(l => ({ ...l, paths3d: joinTouchingChains(l.paths3d) }));
  const lineBoxes = lines.map(l => bbox(l.paths3d.flat().map(p => ({ lat: p[0], lng: p[1] }))));
  const lineKm = lines.map(l => l.paths3d.reduce((s, p) => s + pathKm(p), 0));

  const out: Record<string, unknown>[] = [];
  const report: Record<string, unknown>[] = [];
  for (const rk of Object.keys(routes) as RouteKey[]) {
    // 同じ駅名が2回入っている路線データがあるため、名前で重複を除く
    const seen = new Set<string>();
    const stations = (routes[rk] ?? []).filter(s => (seen.has(s.name) ? false : (seen.add(s.name), true)));
    if (stations.length < 2) continue;
    const rb = bbox(stations);

    let best: { li: number; hits: (ChainHit | null)[]; coverage: number } | null = null;
    lines.forEach((line, li) => {
      if (!overlaps(rb, lineBoxes[li])) return;
      const hits = stationHits(stations, line);
      const coverage = hits.filter(Boolean).length / stations.length;
      if (coverage < MIN_COVERAGE) return;
      // 駅の対応が同じくらいなら、短い（その路線に近い）relation を選ぶ（直通運転の長い relation より）
      if (!best || coverage > best.coverage + 0.02 || (Math.abs(coverage - best.coverage) <= 0.02 && lineKm[li] < lineKm[best.li])) {
        best = { li, hits, coverage };
      }
    });
    if (!best) continue;
    const { li, hits, coverage } = best as { li: number; hits: (ChainHit | null)[]; coverage: number };
    const line = lines[li];

    // 駅を多く含むチェーンから順に、まだ覆っていない駅を含むものだけ使い、駅の範囲で切り出す
    const byChain = new Map<number, number[]>();
    hits.forEach((h, si) => { if (h) byChain.set(h.chain, [...(byChain.get(h.chain) ?? []), si]); });
    const chains = [...byChain.entries()].sort((a, b) => b[1].length - a[1].length);
    const covered = new Set<number>();
    const paths: P3[][] = [];
    for (const [chain, stIdx] of chains) {
      if (stIdx.every(si => covered.has(si))) continue;
      const whole = line.paths3d[chain];
      let slice: P3[];
      if (stIdx.length >= 2) {
        const idx = stIdx.map(si => hits[si]!.index);
        slice = whole.slice(Math.min(...idx), Math.max(...idx) + 1);
      } else if (pathKm(whole) <= STATION_STUB_KM) {
        slice = whole;
      } else continue;
      if (slice.length < 2) continue;
      if (slice.some(p => typeof p[2] !== 'number' || !Number.isFinite(p[2]))) continue; // 標高の無い点は描かない
      paths.push(simplify3d(slice, SIMPLIFY_M).map(p => [round(p[0], 5), round(p[1], 5), round(p[2], 1)] as P3));
      stIdx.forEach(si => covered.add(si));
    }
    if (paths.length === 0) continue;

    out.push({ key: rk, osmRelId: line.relId, osmName: line.lineName, paths });
    report.push({
      key: rk, osmRelId: line.relId, osmName: line.lineName,
      coverage: round(coverage, 3), stations: stations.length, coveredStations: covered.size,
      km: round(paths.reduce((s, p) => s + pathKm(p), 0), 1), points: paths.reduce((s, p) => s + p.length, 0),
    });
  }

  const meta = src.meta as Record<string, any>;
  const asset = {
    meta: {
      generatedFrom: srcFile.slice(ROOT.length + 1),
      lineSource: { sourceName: meta.sourceName, sourceUrl: meta.sourceUrl, license: meta.license, retrievedAt: meta.retrievedAt },
      elevationSource: meta.elevationSource,
      /** 高さは線路の下の地面の標高（線路自体の高さではない）。地下鉄は地下を、高架は地面より上を走る */
      heightMeaning: 'terrain',
      heightReference: 'Copernicus DEM GLO-90（EGM2008 ジオイド基準の標高, m）',
      matchRule: { matchM: MATCH_M, minCoverage: MIN_COVERAGE, simplifyM: SIMPLIFY_M, joinM: JOIN_M, stationStubKm: STATION_STUB_KM },
    },
    routes: out,
  };
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(asset));
  writeFileSync(REPORT, JSON.stringify({ generatedFrom: asset.meta.generatedFrom, matchRule: asset.meta.matchRule, matched: report }, null, 2) + '\n');
  console.log(`routes=${out.length} points=${report.reduce((s, r) => s + (r.points as number), 0)} → ${OUT.slice(ROOT.length + 1)}`);
}

main();
