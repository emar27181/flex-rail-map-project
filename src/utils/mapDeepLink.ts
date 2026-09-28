/**
 * 地図アプリ（/）を特定の状態で開くURLを組み立てる。
 *
 * 地図側が読むURLパラメータ（routes: routeUrlCodes.ts, from: stationUrlParams.ts）と
 * 同じ定数・同じ変換を使う。ガイドのCTA・駅/路線/データのページから地図へ
 * 飛ぶリンクは、すべてここで作る（パラメータ名を各所に書かない）。
 */
import type { RouteKey } from '../data/routes';
import { getRouteCode, MAX_URL_VISIBLE_ROUTES, VISIBLE_ROUTES_PARAM } from './routeUrlCodes';
import { DEPARTURE_PARAM } from './stationUrlParams';

export interface MapLinkOptions {
  /** 表示しておく路線（上限を超える分は付けない。地図側も上限超えは読まない） */
  routes?: RouteKey[];
  /** 出発駅にする駅名（地図側が駅名で引ける駅だけを渡すこと） */
  from?: string;
  /** 地図の表示言語。日本語は既定なので付けない */
  lang?: 'ja' | 'en' | 'zh' | 'ko';
}

export function buildMapHref({ routes, from, lang = 'ja' }: MapLinkOptions): string {
  const params = new URLSearchParams();
  if (from) params.set(DEPARTURE_PARAM, from);
  if (routes && routes.length > 0) {
    const codes = routes.slice(0, MAX_URL_VISIBLE_ROUTES).map(getRouteCode).filter((c): c is string => !!c);
    if (codes.length > 0) params.set(VISIBLE_ROUTES_PARAM, codes.join(','));
  }
  if (lang !== 'ja') params.set('lang', lang);
  const query = params.toString();
  return `/${query ? `?${query}` : ''}`;
}
