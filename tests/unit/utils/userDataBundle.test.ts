// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { collectUserData, parseUserData, persistUserData } from '../../../src/utils/userDataBundle';
import { STATION_MEMO_KEY } from '../../../src/utils/stationMemo';
import { STATION_HISTORY_STORAGE_KEY } from '../../../src/utils/stationHistory';
import type { RideLogEntry } from '../../../src/utils/rideLog';

const memo = { id: 'm1', name: '田中', stationName: '藤沢', createdAt: 1 };
const history = { name: '新宿', count: 3, lastUsedAt: 10 };
const ride: RideLogEntry = { id: 'a:0', routeKey: 'yamanote', stations: ['新宿', '渋谷'] };

describe('設定ファイルに入れる利用者のデータ（乗車ログ・駅のメモ・駅の選択履歴）', () => {
  beforeEach(() => window.localStorage.clear());

  it('書き出し → 読み込みで、3種類とも同じ内容に戻る（localStorage を空にしても復元できる）', () => {
    window.localStorage.setItem(STATION_MEMO_KEY, JSON.stringify([memo]));
    window.localStorage.setItem(STATION_HISTORY_STORAGE_KEY, JSON.stringify([history]));
    const exported = JSON.parse(JSON.stringify(collectUserData([ride])));
    expect(exported).toEqual({ rideLog: [ride], stationMemos: [memo], stationHistory: [history] });

    window.localStorage.clear();
    const parsed = parseUserData(exported);
    persistUserData(parsed);
    expect(parsed.rideLog).toEqual([ride]);
    expect(JSON.parse(window.localStorage.getItem(STATION_MEMO_KEY)!)).toEqual([memo]);
    expect(JSON.parse(window.localStorage.getItem(STATION_HISTORY_STORAGE_KEY)!)).toEqual([history]);
  });

  it('壊れた要素・知らない種類は捨てる。含まれていない項目は undefined のまま（置き換えない）', () => {
    const parsed = parseUserData({
      rideLog: [ride, { id: 'x', routeKey: 'y', stations: ['一駅'] }, { id: 'z', kind: 'weird', routeKey: 'y', stations: ['a', 'b'] }, null],
      stationMemos: [memo, { id: 1 }],
    });
    expect(parsed.rideLog).toEqual([ride]);
    expect(parsed.stationMemos).toEqual([memo]);
    expect(parsed.stationHistory).toBeUndefined();
    expect(parseUserData(null)).toEqual({});
    expect(parseUserData('x')).toEqual({});
  });

  it('含まれていない項目は、いまの保存内容に触らない', () => {
    window.localStorage.setItem(STATION_MEMO_KEY, JSON.stringify([memo]));
    persistUserData(parseUserData({ stationHistory: [history] }));
    expect(JSON.parse(window.localStorage.getItem(STATION_MEMO_KEY)!)).toEqual([memo]);
    expect(JSON.parse(window.localStorage.getItem(STATION_HISTORY_STORAGE_KEY)!)).toEqual([history]);
  });
});
