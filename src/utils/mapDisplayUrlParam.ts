/** Optional initial display settings; invalid values are ignored. */
import { MAP_VIEW_MODES, TRACK_GEOMETRY_VIEW, type MapViewMode } from '../constants/mapViewMode';
import { STAT_PARAMS, type StationStats } from '../data/stationStats';
import type { Terrain3DVersion } from './terrain3d';
import type { Terrain3DGroundStyle } from './terrain3dAppearance';

// Reuse the application's canonical selectable statistics; do not maintain a second list.
export const HEATMAP_URL_KEYS = STAT_PARAMS.map(param => param.key);

/** 駅名の前に駅番号を出すか（記事の地図デモ・共有リンク）。1 / 0 */
export const STATION_NUMBERS_PARAM = 'numbers';
/** 表示方式 */
export const VIEW_PARAM = 'view';

const HEATMAP_PARAM = 'heatmap';

const HEATMAP_FIELD_PARAM = 'heatmapParam';

const TERRAIN_VERSION_PARAM = 'terrainVersion';

const GROUND_PARAM = 'ground';

const GROUND_STYLE_PARAM = 'groundStyle';

export interface DisplayUrlOptions {
  view?: MapViewMode;
  stationNumbers?: boolean;
  heatmap?: boolean;
  heatmapParam?: keyof StationStats;
  terrainVersion?: Terrain3DVersion;
  ground?: boolean;
  groundStyle?: Terrain3DGroundStyle;
}
export function parseDisplayUrlParams(search: string): DisplayUrlOptions {
  const params = new URLSearchParams(search);
  const result: DisplayUrlOptions = {};
  const view = MAP_VIEW_MODES.find(mode => mode === params.get(VIEW_PARAM));
  if (view) result.view = view;
  else if (params.get('experiment') === TRACK_GEOMETRY_VIEW) result.view = TRACK_GEOMETRY_VIEW;
  const numbers = params.get(STATION_NUMBERS_PARAM);
  if (numbers === '1' || numbers === 'true') result.stationNumbers = true;
  if (numbers === '0' || numbers === 'false') result.stationNumbers = false;
  const heatmap = params.get(HEATMAP_PARAM);
  if (heatmap === '1' || heatmap === 'true') result.heatmap = true;
  if (heatmap === '0' || heatmap === 'false') result.heatmap = false;
  const field = params.get(HEATMAP_FIELD_PARAM);
  if (field && (HEATMAP_URL_KEYS as readonly string[]).includes(field)) result.heatmapParam = field as keyof StationStats;
  const version = params.get(TERRAIN_VERSION_PARAM);
  if (version === 'v1' || version === 'v2') result.terrainVersion = version;
  const ground = params.get(GROUND_PARAM);
  if (ground === '1' || ground === 'true') result.ground = true;
  if (ground === '0' || ground === 'false') result.ground = false;
  const style = params.get(GROUND_STYLE_PARAM);
  if (style === 'simple' || style === 'elevation') result.groundStyle = style;
  return result;
}
export function initialDisplayUrlOptions(): DisplayUrlOptions {
  return typeof window === 'undefined' ? {} : parseDisplayUrlParams(window.location.search);
}

/** 旧プレビューリンクも正規の表示方式に変換し、共有URLに反映する。 */
export function syncTrackGeometryViewToUrl(view: MapViewMode): void {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const oldExperiment = params.get('experiment') === TRACK_GEOMETRY_VIEW;
  if (view !== TRACK_GEOMETRY_VIEW && params.get(VIEW_PARAM) !== TRACK_GEOMETRY_VIEW && !oldExperiment) return;
  if (oldExperiment) params.delete('experiment');
  if (view === 'realistic') params.delete(VIEW_PARAM);
  else params.set(VIEW_PARAM, view);
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
}

/** 共有URLの表示用上書きだけを外し、次回もリセット後の既定で開く。 */
export function clearDisplayUrlOptions() {
  const url = new URL(window.location.href);
  const before = url.search;
  for (const key of [VIEW_PARAM, STATION_NUMBERS_PARAM, HEATMAP_PARAM, HEATMAP_FIELD_PARAM, TERRAIN_VERSION_PARAM, GROUND_PARAM, GROUND_STYLE_PARAM]) {
    url.searchParams.delete(key);
  }
  if (url.searchParams.get('experiment') === TRACK_GEOMETRY_VIEW) url.searchParams.delete('experiment');
  if (url.search !== before) window.history.replaceState(window.history.state, '', url);
}
