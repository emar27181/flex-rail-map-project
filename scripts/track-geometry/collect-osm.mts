/**
 * 路線の線形（実際の線路に沿った座標列）を OpenStreetMap から集める。
 *
 * 使い方（Overpass API に接続できる環境で）:
 *   npx tsx scripts/track-geometry/collect-osm.mts --route odakyuLine --relation <OSMの route=train リレーションID>
 *   npx tsx scripts/track-geometry/collect-osm.mts --route odakyuLine --name "小田急小田原線"   # 名前で探す（候補を表示して止まる）
 * オプション: --endpoint <Overpass URL>（既定 https://overpass-api.de/api/interpreter）
 *            --input <保存済みの Overpass 応答 JSON>（ネットワークを使わずに処理だけやり直す）
 *
 * 出力:
 *   data/track-geometry/{route}.overpass.json   取得した応答そのもの（再処理・監査用）
 *   data/track-geometry/{route}.report.json     検証結果（駅と線の距離・途切れ・順番・構造の件数）
 *   src/data/trackGeometry/{route}.json         線形（検証に通ったときだけ書く）
 * 書き出した後、src/data/trackGeometry/index.ts に1行足す。手順と基準は docs/track-geometry.md。
 *
 * 守ること: OSM の bridge / tunnel / layer は構造・上下関係として残し、高さ(m)に変換しない。
 * 標高は出典が無いので書かない（欠損）。Overpass のエラー応答（remark）は失敗として止める。
 */
import { execFileSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { routes } from '../../src/data/routes';
import { splitAtStations, stitchWays, validateGeometry, type SourceWay } from '../../src/utils/trackGeometry';
import type { TrackGeometry } from '../../src/data/trackGeometry/types';

const args = process.argv.slice(2);
const arg = (k: string) => (args.includes(k) ? args[args.indexOf(k) + 1] : undefined);
const routeKey = arg('--route');
const relation = arg('--relation');
const name = arg('--name');
const input = arg('--input');
const endpoint = arg('--endpoint') ?? 'https://overpass-api.de/api/interpreter';
/** 駅と線の距離の上限（m）。駅の座標は駅舎・ホームの中心なので線路から少し離れる */
const MAX_STATION_DIST_M = 150;
/** 間引きの許容誤差（m） */
const SIMPLIFY_M = 3;
/** 連続する点の間の上限（m）。これを超えたら途切れ・誤りを疑う */
const MAX_JUMP_M = 3000;

if (!routeKey || !(routeKey in routes)) throw new Error(`--route に src/data/routes.ts のキーを指定する（${routeKey}）`);
const stations = (routes as Record<string, Array<{ name: string; lat: number; lng: number }>>)[routeKey];

function overpass(query: string): any {
  const out = execFileSync('curl', ['-sS', '-m', '180', '--data-urlencode', `data=${query}`, endpoint], { maxBuffer: 1 << 28 }).toString();
  const json = JSON.parse(out);
  if (json.remark && /error|timed out|out of memory/i.test(String(json.remark))) throw new Error(`Overpass の取得失敗: ${json.remark}`);
  return json;
}

if (name && !relation && !input) {
  const res = overpass(`[out:json][timeout:60];relation["type"="route"]["route"="train"]["name"~"${name}"];out tags;`);
  for (const r of res.elements) console.log(r.id, r.tags?.name, '|', r.tags?.from, '→', r.tags?.to, '|', r.tags?.operator ?? '');
  console.log('\n上から1つ選び、--relation <ID> で実行し直す（上り・下りで別のリレーションなら、どちらか一方）');
  process.exit(0);
}

mkdirSync('data/track-geometry', { recursive: true });
const rawPath = `data/track-geometry/${routeKey}.overpass.json`;
let raw: any;
if (input) {
  raw = JSON.parse(readFileSync(input, 'utf-8'));
} else {
  if (!relation) throw new Error('--relation か --name か --input を指定する');
  raw = overpass(`[out:json][timeout:180];relation(${relation});out body;way(r);out geom tags;`);
  writeFileSync(rawPath, JSON.stringify(raw));
}

const rel = raw.elements.find((e: any) => e.type === 'relation');
if (!rel) throw new Error('リレーションが応答に無い');
const wayById = new Map<number, any>(raw.elements.filter((e: any) => e.type === 'way').map((w: any) => [w.id, w]));
const kindOf = (t: Record<string, string> = {}): SourceWay['kind'] =>
  t.tunnel && t.tunnel !== 'no' ? 'tunnel' : t.bridge && t.bridge !== 'no' ? 'bridge' : 'untagged';
const layerOf = (t: Record<string, string> = {}) => (t.layer !== undefined && /^-?\d+$/.test(t.layer) ? Number(t.layer) : null);
const ways: SourceWay[] = rel.members
  .filter((m: any) => m.type === 'way' && !/platform|stop/.test(m.role ?? ''))
  .map((m: any) => wayById.get(m.ref))
  .filter((w: any) => w && Array.isArray(w.geometry) && w.tags?.railway && w.tags.railway !== 'platform')
  .map((w: any) => ({ id: String(w.id), coords: w.geometry.map((g: any) => [g.lat, g.lon]), kind: kindOf(w.tags), layer: layerOf(w.tags) }));

const line = stitchWays(ways);
const { sections, issues, stationDistM } = splitAtStations(line, stations, { maxStationDistM: MAX_STATION_DIST_M, simplifyM: SIMPLIFY_M });
const geometry: TrackGeometry = {
  routeKey,
  source: {
    name: 'OpenStreetMap',
    url: 'https://www.openstreetmap.org/copyright',
    license: 'ODbL 1.0 (c) OpenStreetMap contributors',
    retrievedAt: new Date().toISOString().slice(0, 10),
    crs: 'EPSG:4326',
    sourceIds: [`relation/${rel.id}`],
    note: `route=train リレーションの way をつなぎ、駅の位置で区切った。${SIMPLIFY_M}m の許容誤差で間引き。bridge/tunnel/layer は構造・上下関係として残し、高さには変換していない。標高は持たない。`,
  },
  sections,
};
const problems = [...issues.map(i => `${i.kind}: ${i.detail}`), ...validateGeometry(geometry, stations, { maxStationDistM: MAX_STATION_DIST_M, maxJumpM: MAX_JUMP_M })];
const report = {
  routeKey,
  relation: rel.id,
  relationName: rel.tags?.name,
  ways: ways.length,
  points: sections.reduce((n, s) => n + s.points.length, 0),
  sections: sections.length,
  expectedSections: stations.length - 1,
  stationDistanceM: Object.fromEntries(stations.map((s, i) => [s.name, stationDistM[i]])),
  structures: sections.flatMap(s => s.structures ?? []).reduce<Record<string, number>>((a, sp) => ({ ...a, [sp.kind]: (a[sp.kind] ?? 0) + 1 }), {}),
  problems,
};
writeFileSync(`data/track-geometry/${routeKey}.report.json`, JSON.stringify(report, null, 1) + '\n');
console.log(`ways=${report.ways} sections=${report.sections}/${report.expectedSections} points=${report.points} problems=${problems.length}`);
if (problems.length > 0 || sections.length !== stations.length - 1) {
  console.error('検証に通らなかったので線形は書き出さない。report.json の problems を見て、リレーションの選び直し・路線データの確認をする');
  problems.slice(0, 30).forEach(p => console.error(' -', p));
  process.exit(1);
}
writeFileSync(`src/data/trackGeometry/${routeKey}.json`, JSON.stringify(geometry));
console.log(`src/data/trackGeometry/${routeKey}.json を書き出した。src/data/trackGeometry/index.ts に登録する`);
