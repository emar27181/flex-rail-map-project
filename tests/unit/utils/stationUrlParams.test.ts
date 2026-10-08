/**
 * 出発駅・到着駅・経由駅をURLで共有する機能のテスト。
 *
 * - 駅名は英語slugのURLパラメータ（from/to/via）として読み書きできること
 * - 存在しない駅名は黙って無視すること
 * - 経由駅は上限（MAX_URL_WAYPOINTS）で切り詰めること
 * - 他のクエリパラメータ（言語設定など）を壊さないこと
 *
 * `window.location`/`history` を使うため jsdom 環境で実行する。
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { getAllStations } from '../../../src/utils/allStations';
import {
  DEPARTURE_PARAM,
  ARRIVAL_PARAM,
  WAYPOINTS_PARAM,
  MAX_URL_WAYPOINTS,
  getInitialDepartureFromUrl,
  getInitialArrivalFromUrl,
  getInitialWaypointsFromUrl,
  syncStationsToUrl,
  encodeStationParam,
} from '../../../src/utils/stationUrlParams';

const stations = getAllStations();
const [s0, s1, s2, s3, s4, s5, s6] = stations;

describe('URLからの初回読み取り', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('パラメータが無ければ全てnull/空', () => {
    expect(getInitialDepartureFromUrl()).toBeNull();
    expect(getInitialArrivalFromUrl()).toBeNull();
    expect(getInitialWaypointsFromUrl()).toEqual([]);
  });

  it('英語slugのfrom/to/viaから駅を復元できる', () => {
    const c0 = encodeStationParam(s0.name)!;
    const c1 = encodeStationParam(s1.name)!;
    const c2 = encodeStationParam(s2.name)!;
    const c3 = encodeStationParam(s3.name)!;
    window.history.replaceState(
      {},
      '',
      `/?${DEPARTURE_PARAM}=${c0}&${ARRIVAL_PARAM}=${c1}&${WAYPOINTS_PARAM}=${c2},${c3}`
    );
    expect(getInitialDepartureFromUrl()).toEqual(s0);
    expect(getInitialArrivalFromUrl()).toEqual(s1);
    expect(getInitialWaypointsFromUrl()).toEqual([s2, s3]);
  });

  it('旧URLの日本語駅名も後方互換で読める', () => {
    window.history.replaceState({}, '', `/?${DEPARTURE_PARAM}=${encodeURIComponent(s0.name)}`);
    expect(getInitialDepartureFromUrl()).toEqual(s0);
  });

  it('存在しない駅名は無視される', () => {
    window.history.replaceState({}, '', `/?${DEPARTURE_PARAM}=存在しない架空駅XYZ`);
    expect(getInitialDepartureFromUrl()).toBeNull();
  });

  it(`経由駅は上限（${MAX_URL_WAYPOINTS}件）で切り詰められる`, () => {
    const names = [s0, s1, s2, s3, s4, s5, s6].map(s => encodeStationParam(s.name)!).join(',');
    window.history.replaceState({}, '', `/?${WAYPOINTS_PARAM}=${names}`);
    const result = getInitialWaypointsFromUrl();
    expect(result.length).toBe(MAX_URL_WAYPOINTS);
    expect(result).toEqual([s0, s1, s2, s3, s4]);
  });
});

describe('syncStationsToUrl', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('出発・到着・経由駅を英語slugでURLへ書き込み、読み戻せる', () => {
    syncStationsToUrl(s0, s1, [s2, s3]);
    expect(window.location.search).toContain(DEPARTURE_PARAM);
    expect(window.location.search).toContain(ARRIVAL_PARAM);
    expect(window.location.search).toContain(WAYPOINTS_PARAM);
    expect(window.location.search).not.toContain(encodeURIComponent(s0.name));
    expect(window.location.search).not.toContain(encodeURIComponent(s1.name));
    expect(window.location.search).toContain(encodeStationParam(s0.name)!);
    expect(window.location.search).toContain(encodeStationParam(s1.name)!);
    expect(getInitialDepartureFromUrl()).toEqual(s0);
    expect(getInitialArrivalFromUrl()).toEqual(s1);
    expect(getInitialWaypointsFromUrl()).toEqual([s2, s3]);
  });

  it('代表駅は人が読める英語slugになる', () => {
    expect(encodeStationParam('渋谷')).toBe('shibuya');
    expect(encodeStationParam('武蔵小杉')).toBe('musashi-kosugi');
    expect(encodeStationParam('東京')).toBe('tokyo');
  });

  it('未選択（null/空配列）のときはパラメータ自体を消す', () => {
    syncStationsToUrl(s0, s1, [s2]);
    expect(window.location.search).toContain(DEPARTURE_PARAM);
    syncStationsToUrl(null, null, []);
    expect(window.location.search).not.toContain(DEPARTURE_PARAM);
    expect(window.location.search).not.toContain(ARRIVAL_PARAM);
    expect(window.location.search).not.toContain(WAYPOINTS_PARAM);
  });

  it('他のクエリパラメータ（言語設定など）は保持したまま書き換える', () => {
    window.history.replaceState({}, '', '/?lang=english');
    syncStationsToUrl(s0, s1, []);
    expect(window.location.search).toContain('lang=english');
    expect(window.location.search).toContain(DEPARTURE_PARAM);
  });
});
