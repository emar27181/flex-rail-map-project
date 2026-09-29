/**
 * 線形（実際の線路に沿った座標列）のある路線の一覧。
 *
 * 線形は scripts/track-geometry/collect-osm.mts で集めて、このフォルダに {routeKey}.json で置き、ここに1行足す。
 * JSON は値だけ（手で座標を書かない）。手順・検証の基準は docs/track-geometry.md。
 */
import type { TrackGeometry } from './types';

export const TRACK_GEOMETRY: Record<string, TrackGeometry> = {};
