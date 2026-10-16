/** Optional initial display settings; invalid values are ignored. */
import type { MapViewMode } from '../constants/mapViewMode';
import { STAT_PARAMS, type StationStats } from '../data/stationStats';
import type { Terrain3DVersion } from './terrain3d';
import type { Terrain3DGroundStyle } from './terrain3dAppearance';

// Reuse the application's canonical selectable statistics; do not maintain a second list.
export const HEATMAP_URL_KEYS = STAT_PARAMS.map(param => param.key);

/** 駅名の前に駅番号を出すか（記事の地図デモ・共有リンク）。1 / 0 */
export const STATION_NUMBERS_PARAM = 'numbers';
/** 表示方式（realistic / schematic / bubble / terrain3d） */
export const VIEW_PARAM = 'view';

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
  const view = params.get(VIEW_PARAM);
  if (view === 'realistic' || view === 'schematic' || view === 'bubble' || view === 'terrain3d') result.view = view;
  const numbers = params.get(STATION_NUMBERS_PARAM);
  if (numbers === '1' || numbers === 'true') result.stationNumbers = true;
  if (numbers === '0' || numbers === 'false') result.stationNumbers = false;
  const heatmap = params.get('heatmap');
  if (heatmap === '1' || heatmap === 'true') result.heatmap = true;
  if (heatmap === '0' || heatmap === 'false') result.heatmap = false;
  const field = params.get('heatmapParam');
  if (field && (HEATMAP_URL_KEYS as readonly string[]).includes(field)) result.heatmapParam = field as keyof StationStats;
  const version = params.get('terrainVersion');
  if (version === 'v1' || version === 'v2') result.terrainVersion = version;
  const ground = params.get('ground');
  if (ground === '1' || ground === 'true') result.ground = true;
  if (ground === '0' || ground === 'false') result.ground = false;
  const style = params.get('groundStyle');
  if (style === 'simple' || style === 'elevation') result.groundStyle = style;
  return result;
}
export function initialDisplayUrlOptions(): DisplayUrlOptions {
  return typeof window === 'undefined' ? {} : parseDisplayUrlParams(window.location.search);
}
