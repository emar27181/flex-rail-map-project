/**
 * 線形の試作データ（public/data/track-geometry-prototype.json）を、地図が読む TrackGeometry にする。
 * 「実際の線路の形」が選ばれたときに読み込む。
 * データは scripts/track-geometry/build-from-terrain3d-v2.mts が作る。何を作るか・出典はそちらと docs/track-geometry.md。
 */
import type { TrackGeometry, TrackGeometrySource, TrackSection } from '../data/trackGeometry/types';
import { isCircularRoute } from './routeAdjacency';

export const TRACK_GEOMETRY_PROTOTYPE_URL = '/data/track-geometry-prototype.json';

export interface TrackGeometryPrototypeFile {
  meta: { source: TrackGeometrySource; routeCount: number; maxStationDistM: number };
  routes: Record<string, { relId: number; sections: TrackSection[] }>;
}

export function toTrackGeometries(file: TrackGeometryPrototypeFile): Record<string, TrackGeometry> {
  const out: Record<string, TrackGeometry> = {};
  for (const [routeKey, r] of Object.entries(file.routes)) {
    out[routeKey] = { routeKey, source: { ...file.meta.source, sourceIds: [`relation/${r.relId}`] }, sections: r.sections };
  }
  return out;
}

export interface TrackCoverage {
  routeCount: number;
  coveredRoutes: number;
  sectionCount: number;
  coveredSections: number;
}

export function trackCoverage(
  routeEntries: ReadonlyArray<readonly [string, readonly { name: string }[]]>,
  geometries: Readonly<Record<string, TrackGeometry>>,
  selected?: ReadonlySet<string>,
): TrackCoverage {
  const coverage: TrackCoverage = { routeCount: 0, coveredRoutes: 0, sectionCount: 0, coveredSections: 0 };
  const pairKey = (from: string, to: string) => from < to ? `${from}\0${to}` : `${to}\0${from}`;
  for (const [key, stations] of routeEntries) {
    if (selected && !selected.has(key)) continue;
    coverage.routeCount++;
    const first = stations[0];
    const last = stations[stations.length - 1];
    const closingEdge = stations.length > 1 && isCircularRoute(key) && first.name !== last.name;
    coverage.sectionCount += Math.max(0, stations.length - 1) + Number(closingEdge);
    const sections = geometries[key]?.sections;
    if (!sections?.length) continue;
    const covered = new Set(sections.map(({ from, to }) => pairKey(from, to)));
    let coveredInRoute = 0;
    for (let i = 1; i < stations.length; i++) {
      if (covered.has(pairKey(stations[i - 1].name, stations[i].name))) coveredInRoute++;
    }
    if (closingEdge && covered.has(pairKey(first.name, last.name))) coveredInRoute++;
    coverage.coveredSections += coveredInRoute;
    if (coveredInRoute > 0) coverage.coveredRoutes++;
  }
  return coverage;
}
