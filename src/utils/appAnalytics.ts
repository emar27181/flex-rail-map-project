/**
 * 地図アプリの中の操作を GA4 に送るイベントの唯一の定義。
 *
 * 以前は地図の中の操作（出発駅・到着駅の選択、経路検索）を何も送っておらず、
 * GA4 ではページの閲覧数しか分からなかった。イベント名とパラメータはここだけに書き、
 * 送信は gtagConsent.ts の trackEvent を通す（同意が無ければ gtag 側で抑制される）。
 * 名前・パラメータを足したら docs/seo.md の「GA4 イベント」に追記する。
 */
import { trackEvent } from './gtagConsent';

export const APP_EVENTS = {
  /** 出発駅を選んだ（手で選んだ / URL で開いた / 現在地から自動で選んだ） */
  departureSelect: 'map_departure_select',
  /** 到着駅を選んだ */
  arrivalSelect: 'map_arrival_select',
  /** 出発駅と到着駅がそろい、経路候補を出した */
  routeSearch: 'map_route_search',
} as const;

/** GA4 のパラメータ値の上限（文字数） */
const MAX_PARAM_LENGTH = 100;
const clip = (s: string) => s.slice(0, MAX_PARAM_LENGTH);

export type StationSelectSource = 'manual' | 'auto';

export function trackStationSelect(role: 'departure' | 'arrival', station: string, source: StationSelectSource): void {
  trackEvent(role === 'departure' ? APP_EVENTS.departureSelect : APP_EVENTS.arrivalSelect, {
    station: clip(station),
    source,
  });
}

/** 経路候補のうち、イベントに載せる値 */
export interface RouteSearchSummary {
  totalTime: number;
  transfers: number;
  segments: { through?: boolean }[];
}

/** 経路検索の結果を送る。best_* は先頭（いちばんおすすめ）の候補 */
export function routeSearchParams(from: string, to: string, results: RouteSearchSummary[], waypoints: number) {
  const best = results[0];
  return {
    from_station: clip(from),
    to_station: clip(to),
    result_count: results.length,
    waypoints,
    best_minutes: best ? Math.round(best.totalTime) : -1,
    best_transfers: best ? best.transfers : -1,
    // 直通運転（乗り換えずに別の路線へ入る）を使う候補があるか
    has_through: results.some(r => r.segments.some(s => s.through)),
  };
}

export function trackRouteSearch(from: string, to: string, results: RouteSearchSummary[], waypoints: number): void {
  trackEvent(APP_EVENTS.routeSearch, routeSearchParams(from, to, results, waypoints));
}
