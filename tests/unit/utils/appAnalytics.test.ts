/**
 * 地図アプリの中の操作を GA4 に送るイベント（utils/appAnalytics.ts）のテスト。
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { APP_EVENTS, routeSearchParams, trackRouteSearch, trackStationSelect } from '../../../src/utils/appAnalytics';

describe('経路検索のイベントの値', () => {
  it('先頭の候補の所要時間・乗換回数と、直通を使う候補があるかを載せる', () => {
    const params = routeSearchParams('藤沢', '宇都宮', [
      { totalTime: 127.6, transfers: 0, segments: [{}, { through: true }] },
      { totalTime: 125, transfers: 1, segments: [{}, {}] },
    ], 0);
    expect(params).toEqual({
      from_station: '藤沢', to_station: '宇都宮', result_count: 2, waypoints: 0,
      best_minutes: 128, best_transfers: 0, has_through: true,
    });
  });

  it('候補が無いときは -1、文字列は GA4 の上限（100文字）で切る', () => {
    const params = routeSearchParams('あ'.repeat(150), '駅', [], 1);
    expect(params.from_station.length).toBe(100);
    expect(params.best_minutes).toBe(-1);
    expect(params.best_transfers).toBe(-1);
    expect(params.has_through).toBe(false);
  });
});

describe('送信', () => {
  const gtag = vi.fn();
  beforeEach(() => { gtag.mockClear(); (window as unknown as { gtag: typeof gtag }).gtag = gtag; });

  it('出発駅・到着駅の選択は別の名前で送る', () => {
    trackStationSelect('departure', '藤沢', 'manual');
    trackStationSelect('arrival', '宇都宮', 'manual');
    expect(gtag).toHaveBeenNthCalledWith(1, 'event', APP_EVENTS.departureSelect, { station: '藤沢', source: 'manual' });
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', APP_EVENTS.arrivalSelect, { station: '宇都宮', source: 'manual' });
  });

  it('経路検索は map_route_search で送る', () => {
    trackRouteSearch('藤沢', '大宮', [{ totalTime: 52, transfers: 0, segments: [{}] }], 0);
    expect(gtag).toHaveBeenCalledWith('event', 'map_route_search', expect.objectContaining({ from_station: '藤沢', to_station: '大宮' }));
  });

  it('GA4 が無い環境（gtag 未読み込み）でも落ちない', () => {
    delete (window as unknown as { gtag?: unknown }).gtag;
    expect(() => trackStationSelect('departure', '藤沢', 'auto')).not.toThrow();
  });
});
