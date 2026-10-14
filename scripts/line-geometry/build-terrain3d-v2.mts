/**
 * 線形データ v2（構造つき: 地上・高架・地下）から、立体表示で読むファイルを作る。
 *
 *   npx tsx scripts/line-geometry/build-terrain3d-v2.mts [--src <v2 の data フォルダ>]
 *
 * v2 は OSM（Geofabrik の関東抽出）の路線 relation を、`tunnel` / `bridge` などのタグで
 * 地上（at_grade）・高架（elevated）・地下（underground）の区間に分けたもの。標高は持たない（すべて null）。
 *
 * - アプリの路線との対応は v1（build-terrain3d.mts）と同じく**駅の位置**で決める。
 *   v2 に付いている route-mapping.csv の対応は v1 の名前による対応をそのまま写したもの（100件）なので使わない
 * - その路線の駅の範囲だけを切り出し、構造が同じ区間ごとに 2 次元の Douglas-Peucker（SIMPLIFY_M）で間引く
 *   （区間の境目＝トンネルの出入口・高架の端は残す）
 * - 高さはここでは付けない。画面で地面（Copernicus DEM の格子）の高さに載せる。地下の深さは推測しない
 * - 対応付けの結果は <src の親>/terrain3d-v2-match-report.json に残す
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { routes, type RouteKey } from '../../src/data/routes';
import type { Station } from '../../src/data/yamanote';
import { distM, bbox, overlaps, simplify3d, round, type P3 } from './geo.mts';
import { MATCH_M, MIN_COVERAGE, SIMPLIFY_M, JOIN_M, STATION_STUB_KM } from './build-terrain3d.mts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DEFAULT_SRC = join(ROOT, 'data/kanto-line-geometry-v2-2026-10/data');
const OUT = join(ROOT, 'public/data/terrain3d-lines-v2.json');

/** 構造の略号（ファイルを小さくするため1文字） */
export const STRUCTURE_CODE = { at_grade: 'g', elevated: 'e', underground: 'u' } as const;
type StructureType = keyof typeof STRUCTURE_CODE;
type Code = (typeof STRUCTURE_CODE)[StructureType];

/** 点の並びと、点 i → i+1 の区間の構造 */
interface Chain { pts: [number, number][]; edges: Code[] }
interface V2Line { relId: number; name: string; routeType: string; chains: Chain[]; km: number }

function argSrc(): string {
  const i = process.argv.indexOf('--src');
  return i >= 0 ? resolve(process.argv[i + 1]) : DEFAULT_SRC;
}

const samePt = (a: [number, number], b: [number, number]) => a[0] === b[0] && a[1] === b[1];

/** relation の GeoJSON（区間ごとの LineString）を、チェーンごとの点列＋区間の構造にする */
function readLine(src: string, file: string): V2Line {
  const g = JSON.parse(readFileSync(join(src, file), 'utf8'));
  const byChain = new Map<number, { seg: number; type: StructureType; coords: [number, number][] }[]>();
  for (const f of g.features) {
    const p = f.properties;
    if (f.geometry?.type !== 'LineString') continue;
    if (!(p.structureType in STRUCTURE_CODE)) throw new Error(`${file}: 不明な structureType ${p.structureType}`);
    const list = byChain.get(p.chainIndex) ?? [];
    list.push({ seg: p.segmentIndex, type: p.structureType, coords: f.geometry.coordinates.map(([lng, lat]: number[]) => [lat, lng]) });
    byChain.set(p.chainIndex, list);
  }
  const chains: Chain[] = [];
  let km = 0;
  for (const [, segs] of [...byChain.entries()].sort((a, b) => a[0] - b[0])) {
    segs.sort((a, b) => a.seg - b.seg);
    const pts: [number, number][] = [];
    const edges: Code[] = [];
    for (const s of segs) {
      const code = STRUCTURE_CODE[s.type];
      s.coords.forEach(c => {
        if (pts.length && samePt(pts[pts.length - 1], c)) return; // 前の区間の終点と同じ点
        if (pts.length) edges.push(code);
        pts.push(c);
      });
    }
    if (pts.length >= 2) {
      chains.push({ pts, edges });
      for (let i = 1; i < pts.length; i++) km += distM(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]) / 1000;
    }
  }
  return { relId: g.metadata.osmRelationId, name: g.metadata.routeName, routeType: g.metadata.routeType, chains, km };
}

/** 端が接しているチェーンをつなぐ（v1 の joinTouchingChains と同じ。区間の構造も一緒に並べ替える） */
function joinTouching(chains: Chain[]): Chain[] {
  const out = chains.map(c => ({ pts: [...c.pts], edges: [...c.edges] }));
  const near = (a: [number, number], b: [number, number]) => distM(a[0], a[1], b[0], b[1]) <= JOIN_M;
  const rev = (c: Chain): Chain => ({ pts: [...c.pts].reverse(), edges: [...c.edges].reverse() });
  const link = (a: Chain, b: Chain): Chain => {
    const gap = samePt(a.pts[a.pts.length - 1], b.pts[0]);
    return {
      pts: [...a.pts, ...(gap ? b.pts.slice(1) : b.pts)],
      // つなぎ目の短い区間は、つないだ先の最初の区間と同じ構造とみなす
      edges: [...a.edges, ...(gap ? [] : [b.edges[0] ?? a.edges[a.edges.length - 1]]), ...b.edges],
    };
  };
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < out.length; i++) for (let j = 0; j < out.length; j++) {
      if (i === j) continue;
      const a = out[i], b = out[j];
      let joined: Chain | null = null;
      if (near(a.pts[a.pts.length - 1], b.pts[0])) joined = link(a, b);
      else if (near(a.pts[a.pts.length - 1], b.pts[b.pts.length - 1])) joined = link(a, rev(b));
      if (!joined) continue;
      out[i] = joined; out.splice(j, 1); merged = true;
      break outer;
    }
  }
  return out;
}

interface Hit { chain: number; index: number; d: number }
function stationHits(stations: Station[], chains: Chain[]): (Hit | null)[] {
  return stations.map(st => {
    let best: Hit | null = null;
    chains.forEach((c, chain) => {
      for (let i = 0; i < c.pts.length; i++) {
        const d = distM(st.lat, st.lng, c.pts[i][0], c.pts[i][1]);
        if (d <= MATCH_M && (!best || d < best.d)) best = { chain, index: i, d };
      }
    });
    return best;
  });
}

const chainKm = (c: Chain) => c.pts.reduce((s, p, i) => (i ? s + distM(c.pts[i - 1][0], c.pts[i - 1][1], p[0], p[1]) : s), 0) / 1000;

/** 点の範囲 [a, b] を、構造が同じ区間ごとの線に分けて間引く */
export function runsOf(c: Chain, a: number, b: number): { s: Code; p: [number, number][] }[] {
  const out: { s: Code; p: [number, number][] }[] = [];
  let start = a;
  for (let i = a; i < b; i++) {
    const last = i === b - 1;
    if (last || c.edges[i + 1] !== c.edges[i]) {
      const seg = c.pts.slice(start, i + 2).map(([lat, lng]) => [lat, lng, 0] as P3);
      out.push({ s: c.edges[i], p: simplify3d(seg, SIMPLIFY_M).map(([lat, lng]) => [round(lat, 5), round(lng, 5)]) });
      start = i + 1;
    }
  }
  return out;
}

function main() {
  const src = argSrc();
  const index = JSON.parse(readFileSync(join(src, 'routes-index.json'), 'utf8'));
  // リポジトリには対応付けに使った relation のファイルだけを置いている（全669本は約55MB）。
  // 無いファイルは飛ばす。全部を見直すときは、受け取った ZIP を展開して --src で渡す
  const present = index.routes.filter((r: { file: string }) => existsSync(join(src, r.file)));
  if (present.length < index.routes.length) console.log(`routes-index の ${index.routes.length} 本のうち ${present.length} 本のファイルがある`);
  const lines: V2Line[] = present.map((r: { file: string }) => readLine(src, r.file))
    .map((l: V2Line) => ({ ...l, chains: joinTouching(l.chains) }))
    .filter((l: V2Line) => l.chains.length > 0);
  const boxes = lines.map(l => bbox(l.chains.flatMap(c => c.pts.map(([lat, lng]) => ({ lat, lng })))));

  const out: Record<string, unknown>[] = [];
  const report: Record<string, unknown>[] = [];
  for (const rk of Object.keys(routes) as RouteKey[]) {
    const seen = new Set<string>();
    const stations = (routes[rk] ?? []).filter(s => (seen.has(s.name) ? false : (seen.add(s.name), true)));
    if (stations.length < 2) continue;
    const rb = bbox(stations);

    let best: { li: number; hits: (Hit | null)[]; coverage: number } | null = null;
    lines.forEach((line, li) => {
      if (!overlaps(rb, boxes[li])) return;
      const hits = stationHits(stations, line.chains);
      const coverage = hits.filter(Boolean).length / stations.length;
      if (coverage < MIN_COVERAGE) return;
      // 駅の対応が同じくらいなら、短い（その路線に近い）relation を選ぶ（直通運転の長い relation より）
      if (!best || coverage > best.coverage + 0.02 || (Math.abs(coverage - best.coverage) <= 0.02 && line.km < lines[best.li].km)) {
        best = { li, hits, coverage };
      }
    });
    if (!best) continue;
    const { li, hits, coverage } = best as { li: number; hits: (Hit | null)[]; coverage: number };
    const line = lines[li];

    const byChain = new Map<number, number[]>();
    hits.forEach((h, si) => { if (h) byChain.set(h.chain, [...(byChain.get(h.chain) ?? []), si]); });
    const covered = new Set<number>();
    const runs: { s: Code; p: [number, number][] }[] = [];
    for (const [chain, stIdx] of [...byChain.entries()].sort((a, b) => b[1].length - a[1].length)) {
      if (stIdx.every(si => covered.has(si))) continue;
      const c = line.chains[chain];
      let a: number, b: number;
      if (stIdx.length >= 2) {
        const idx = stIdx.map(si => hits[si]!.index);
        a = Math.min(...idx); b = Math.max(...idx);
      } else if (chainKm(c) <= STATION_STUB_KM) {
        a = 0; b = c.pts.length - 1;
      } else continue;
      if (b - a < 1) continue;
      runs.push(...runsOf(c, a, b));
      stIdx.forEach(si => covered.add(si));
    }
    if (runs.length === 0) continue;

    const lenBy: Record<string, number> = { g: 0, e: 0, u: 0 };
    for (const r of runs) for (let i = 1; i < r.p.length; i++) lenBy[r.s] += distM(r.p[i - 1][0], r.p[i - 1][1], r.p[i][0], r.p[i][1]) / 1000;
    out.push({ key: rk, osmRelId: line.relId, osmName: line.name, runs });
    report.push({
      key: rk, osmRelId: line.relId, osmName: line.name, routeType: line.routeType,
      coverage: round(coverage, 3), stations: stations.length, coveredStations: covered.size,
      km: { atGrade: round(lenBy.g, 1), elevated: round(lenBy.e, 1), underground: round(lenBy.u, 1) },
      points: runs.reduce((s, r) => s + r.p.length, 0),
    });
  }

  const asset = {
    meta: {
      version: 2,
      generatedFrom: `flex3d-data-kanto（routes-index.json generatedAt ${index.generatedAt}）`,
      lineSource: { sourceName: 'OpenStreetMap (Geofabrik kanto extract)', sourceUrl: index.sourceUrl, license: 'ODbL-1.0', retrievedAt: index.sourceDate },
      structure: 'OSM の tunnel / bridge などのタグによる区間の種類（地上・高架・地下）。深さ・高さ（m）ではない',
      heightMeaning: 'none',
      matchRule: { matchM: MATCH_M, minCoverage: MIN_COVERAGE, simplifyM: SIMPLIFY_M, joinM: JOIN_M, stationStubKm: STATION_STUB_KM },
    },
    routes: out,
  };
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(asset));
  const reportPath = join(dirname(src), 'terrain3d-v2-match-report.json');
  writeFileSync(reportPath, JSON.stringify({ generatedFrom: asset.meta.generatedFrom, matchRule: asset.meta.matchRule, matched: report }, null, 2) + '\n');
  const u = report.reduce((s, r) => s + (r.km as { underground: number }).underground, 0);
  console.log(`routes=${out.length} points=${report.reduce((s, r) => s + (r.points as number), 0)} underground=${round(u, 1)}km → ${OUT.slice(ROOT.length + 1)}`);
}

main();
