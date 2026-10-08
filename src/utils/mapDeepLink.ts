/**
 * 地図アプリ（/）を特定の状態で開くURLを組み立てる。
 *
 * 地図側が読むURLパラメータ（routes: routeUrlCodes.ts, from: stationUrlParams.ts,
 * metric: heatmapUrlParam.ts, center/zoom: mapViewUrlParam.ts, embed: embedMode.ts）と
 * 同じ定数・同じ変換を使う。ガイドのCTA・駅/路線/データのページから地図へ
 * 飛ぶリンクは、すべてここで作る（パラメータ名を各所に書かない）。
 */
import type { RouteKey } from '../data/routes';
import { getRouteCode, MAX_URL_VISIBLE_ROUTES, VISIBLE_ROUTES_PARAM } from './routeUrlCodes';
import { ARRIVAL_PARAM, DEPARTURE_PARAM, encodeStationParam } from './stationUrlParams';
import { HEATMAP_METRIC_PARAM, isUrlHeatmapMetric } from './heatmapUrlParam';
import { MAP_CENTER_PARAM, MAP_ZOOM_PARAM, TRAVEL_TIMES_PARAM } from './mapViewUrlParam';
import { EMBED_PARAM } from './embedMode';
import type { StationStats } from '../data/stationStats';

export interface MapLinkOptions {
  /** 表示しておく路線（上限を超える分は付けない。地図側も上限超えは読まない） */
  routes?: RouteKey[];
  /** 出発駅にする駅名（地図側が駅名で引ける駅だけを渡すこと） */
  from?: string;
  /** 到着駅にする駅名（同上） */
  to?: string;
  /** ヒートマップで表示する指標（実データの指標だけ。推定値は付けない） */
  metric?: keyof StationStats;
  /** 開いたときの地図の中心 [緯度, 経度] と拡大率 */
  center?: [number, number];
  zoom?: number;
  /** 駅間の所要時間を開いたときから出す */
  travelTimes?: boolean;
  /** 地図の表示言語。日本語は既定なので付けない */
  lang?: 'ja' | 'en' | 'zh' | 'ko';
  /** 記事などに iframe で埋め込む表示（embedMode.ts） */
  embed?: boolean;
}

export function buildMapHref({ routes, from, to, metric, center, zoom, travelTimes = false, lang = 'ja', embed = false }: MapLinkOptions): string {
  const params = new URLSearchParams();
  if (from) {
    const code = encodeStationParam(from);
    if (code) params.set(DEPARTURE_PARAM, code);
  }
  if (to) {
    const code = encodeStationParam(to);
    if (code) params.set(ARRIVAL_PARAM, code);
  }
  if (routes && routes.length > 0) {
    const codes = routes.slice(0, MAX_URL_VISIBLE_ROUTES).map(getRouteCode).filter((c): c is string => !!c);
    if (codes.length > 0) params.set(VISIBLE_ROUTES_PARAM, codes.join(','));
  }
  if (metric && isUrlHeatmapMetric(metric)) params.set(HEATMAP_METRIC_PARAM, metric);
  if (center) {
    params.set(MAP_CENTER_PARAM, center.join(','));
    if (zoom !== undefined) params.set(MAP_ZOOM_PARAM, String(zoom));
  }
  if (travelTimes) params.set(TRAVEL_TIMES_PARAM, '1');
  // 日本語は既定なので付けない。ただし埋め込みは閲覧者のブラウザの言語で開かないよう、記事の言語を必ず付ける
  if (lang !== 'ja' || embed) params.set('lang', lang);
  if (embed) params.set(EMBED_PARAM, '1');
  const query = params.toString();
  return `/${query ? `?${query}` : ''}`;
}
