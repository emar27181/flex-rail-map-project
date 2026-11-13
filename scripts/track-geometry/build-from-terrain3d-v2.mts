/**
 * 立体表示用の線形（public/data/terrain3d-lines-v2.json, OSM 由来）を、2D の地図で駅の間を線路の形で描くための
 * 線形（TrackGeometry の区間）に変換する。試作用（?experiment=track-geometry で読む）。
 *
 *   npx tsx scripts/track-geometry/build-from-terrain3d-v2.mts
 *   → public/data/track-geometry-prototype.json
 *
 * - 駅の位置で区切る・検証するのは utils/trackGeometry.ts の splitAtStations（収集スクリプトと同じ基準）。
 *   検証に1つでも失敗した路線は書き出さない（直線のまま）。理由は meta.skipped に残す
 * - 構造の対応: 地上 g → untagged（地上とは限らない）／高架 e → bridge／地下 u → tunnel。高さ（m）には変換しない
 * - 出典: © OpenStreetMap contributors（ODbL-1.0）。元データは data/kanto-line-geometry-v2-2026-10/README.md
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { routes, type RouteKey } from '../../src/data/routes';
import { splitAtStations, type StitchedLine } from '../../src/utils/trackGeometry';
import type { LatLng, TrackSection, TrackStructureKind } from '../../src/data/trackGeometry/types';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'public/data/terrain3d-lines-v2.json');
const OUT = join(ROOT, 'public/data/track-geometry-prototype.json');

/** 駅と線の距離の上限（m）。本番の基準は150m（docs/track-geometry.md）だが、試作では大きな駅（駅舎の中心と線路が離れる）を通すため300mにしている */
export const MAX_STATION_DIST_M = 300;

const KIND: Record<string, TrackStructureKind> = { g: 'untagged', e: 'bridge', u: 'tunnel' };

interface Run { s: string; p: [number, number][] }
interface SrcRoute { key: string; osmRelId: number; osmName: string; runs: Run[] }

/** runs（構造ごとの点の並び。隣の run は端点を共有）を1本の線にする */
export function lineFromRuns(runs: Run[]): StitchedLine {
  const points: LatLng[] = [];
  const kinds: TrackStructureKind[] = [];
  runs.forEach((run, ri) => {
    run.p.forEach((pt, i) => {
      if (ri > 0 && i === 0) return; // 前の run の終点と同じ点
      points.push([pt[0], pt[1]]);
      kinds.push(KIND[run.s] ?? 'untagged');
    });
  });
  return { points, kinds, layers: points.map(() => null), gaps: [] };
}

export interface BuiltRoute { key: string; sections: TrackSection[]; relId: number; stationDistMaxM: number }

export function build(src: { routes: SrcRoute[] }): { built: BuiltRoute[]; skipped: Array<{ key: string; reason: string }> } {
  const built: BuiltRoute[] = [];
  const skipped: Array<{ key: string; reason: string }> = [];
  for (const r of src.routes) {
    const stations = routes[r.key as RouteKey];
    if (!stations) { skipped.push({ key: r.key, reason: '路線データに無い' }); continue; }
    const { sections, issues, stationDistM } = splitAtStations(lineFromRuns(r.runs), stations, {
      maxStationDistM: MAX_STATION_DIST_M,
      simplifyM: 0, // 元データが 8m で間引き済み。さらに間引かない
    });
    if (issues.length > 0) { skipped.push({ key: r.key, reason: `${issues[0].kind}: ${issues[0].detail}${issues.length > 1 ? `（ほか${issues.length - 1}件）` : ''}` }); continue; }
    if (sections.length !== stations.length - 1) { skipped.push({ key: r.key, reason: `区間数 ${sections.length} ≠ 駅数-1 ${stations.length - 1}` }); continue; }
    built.push({ key: r.key, sections, relId: r.osmRelId, stationDistMaxM: Math.max(...stationDistM) });
  }
  return { built, skipped };
}

if (process.argv[1] && process.argv[1].endsWith('build-from-terrain3d-v2.mts')) {
  const src = JSON.parse(readFileSync(SRC, 'utf8'));
  const { built, skipped } = build(src);
  const out = {
    meta: {
      note: '試作。立体表示用の線形 v2 を駅で区切ったもの。検証に通った路線だけ。高さ（m）は持たない',
      source: { name: 'OpenStreetMap（Geofabrik 関東抽出）', url: 'https://www.openstreetmap.org/copyright', license: 'ODbL-1.0 © OpenStreetMap contributors', retrievedAt: '2026-10-14', crs: 'EPSG:4326' },
      maxStationDistM: MAX_STATION_DIST_M,
      routeCount: built.length,
      skipped,
    },
    routes: Object.fromEntries(built.map(b => [b.key, { relId: b.relId, sections: b.sections }])),
  };
  writeFileSync(OUT, JSON.stringify(out));
  console.log(`書き出し: ${built.length}路線 / 除外: ${skipped.length}路線 → ${OUT}`);
  for (const s of skipped) console.log(`  除外 ${s.key}: ${s.reason}`);
}
