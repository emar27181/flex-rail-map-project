/**
 * 線形の試作データ（public/data/track-geometry-prototype.json）を、地図が読む TrackGeometry にする。
 * 試作は `?experiment=track-geometry` のときだけ読み込む（通常の画面は変えない）。
 * データは scripts/track-geometry/build-from-terrain3d-v2.mts が作る。何を作るか・出典はそちらと docs/track-geometry.md。
 */
import type { TrackGeometry, TrackGeometrySource, TrackSection } from '../data/trackGeometry/types';

export const TRACK_GEOMETRY_PROTOTYPE_URL = '/data/track-geometry-prototype.json';
export const TRACK_GEOMETRY_EXPERIMENT = 'track-geometry';

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

/** 試作のURLパラメータが付いているか */
export function isTrackGeometryExperiment(search: string): boolean {
  return new URLSearchParams(search).get('experiment') === TRACK_GEOMETRY_EXPERIMENT;
}
