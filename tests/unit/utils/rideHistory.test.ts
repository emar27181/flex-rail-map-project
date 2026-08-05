/**
 * 乗車履歴プレースホルダのテスト
 *
 * 現時点ではどの画面からも呼ばれていない機能だが、将来の実装が
 * 依拠するストレージ層の契約（記録・集計・削除）が壊れないことを保証する。
 *
 * localStorage を使うため jsdom 環境で実行する
 * （デフォルトの node 環境には localStorage が無い）。
 */
// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordBoarding,
  recordAlighting,
  getEntries,
  getStats,
  clearHistory,
} from '../../../src/utils/rideHistory';

describe('rideHistory', () => {
  beforeEach(() => {
    clearHistory();
  });

  it('乗車を記録すると getEntries に反映される', () => {
    recordBoarding({ routeKey: 'yamanote', routeName: '山手線', boardingStation: '新宿' });
    const entries = getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].boardingStation).toBe('新宿');
    expect(entries[0].alightingStation).toBeNull();
  });

  it('降車を記録すると該当エントリの alightingStation が確定する', () => {
    const entry = recordBoarding({ routeKey: 'yamanote', routeName: '山手線', boardingStation: '新宿' });
    recordAlighting(entry.id, '渋谷');
    const [updated] = getEntries();
    expect(updated.alightingStation).toBe('渋谷');
    expect(updated.alightedAt).not.toBeNull();
  });

  it('getStats が乗車数・路線数・訪問駅数を正しく集計する', () => {
    const a = recordBoarding({ routeKey: 'yamanote', routeName: '山手線', boardingStation: '新宿' });
    recordAlighting(a.id, '渋谷');
    recordBoarding({ routeKey: 'chuo', routeName: '中央線', boardingStation: '新宿' });

    const stats = getStats();
    expect(stats.totalRides).toBe(2);
    expect(stats.uniqueRoutesUsed).toBe(2);
    // 新宿(2回) / 渋谷(1回) の2駅
    expect(stats.uniqueStationsVisited).toBe(2);

    const shinjuku = stats.stationVisits.find(s => s.stationName === '新宿');
    expect(shinjuku?.visitCount).toBe(2);
  });

  it('clearHistory で記録が全て消える', () => {
    recordBoarding({ routeKey: 'yamanote', routeName: '山手線', boardingStation: '新宿' });
    clearHistory();
    expect(getEntries()).toHaveLength(0);
    expect(getStats().totalRides).toBe(0);
  });

  it('存在しないIDへの降車記録は何もしない（クラッシュしない）', () => {
    expect(() => recordAlighting('not-exist', '渋谷')).not.toThrow();
  });
});
