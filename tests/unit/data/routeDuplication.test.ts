/**
 * 路線データの重複検出テスト
 *
 * 過去に起きた問題:
 * - 根岸線(横浜〜大船)が京浜東北線(大宮〜大船)に完全に内包されているのに
 *   別路線として登録されていた
 * - 色も同一(#00B5E2)だったため、凡例で京浜東北線をオフにしても
 *   根岸線が同じ区間を同じ色で描き続け「1回の切り替えでオンオフできない」状態だった
 */

import { describe, it, expect } from 'vitest';
import { routes, type RouteKey } from '../../../src/data/routes';

const stationNamesOf = (key: RouteKey) => routes[key].map((s) => s.name);

describe('路線データの重複', () => {
  it('京浜東北線が大宮〜大船の全区間を含む', () => {
    const names = stationNamesOf('keihinTohoku');
    expect(names[0]).toBe('大宮');
    expect(names[names.length - 1]).toBe('大船');
    // 根岸線区間の駅も含まれていること
    for (const s of ['横浜', '桜木町', '関内', '根岸', '磯子', '本郷台']) {
      expect(names).toContain(s);
    }
  });

  it('根岸線が独立した路線として登録されていない（京浜東北線と重複するため）', () => {
    expect(Object.keys(routes)).not.toContain('jrNegishiLine');
  });

  // 根岸線と同種の重複（ある路線の全駅が他路線に完全に内包される）が他にも残っている。
  // 京浜東北線の修正時に発見されたが、どちらを正とするかは路線ごとに判断が要るため未着手。
  // このテストは「既知の重複が増えていないこと」を保証し、新規の重複混入を防ぐ。
  const KNOWN_DUPLICATES = [
    'jrKyotoLine は jrBiwako に完全に内包されている',
    'jrKamaishiLine は jrKamaishiLine2 に完全に内包されている',
    'shinkeisei2 は shinkeisei に完全に内包されている',
    'hankyuKobeLine2 は hankyuKobeLine に完全に内包されている',
    'kintetsuOsakaLine2 は kintetsuOsakaLine に完全に内包されている',
    'jrKosaiLineNorth は jrKosaiLine に完全に内包されている',
    'irIshikawaRailway は jrHokurikuKanazawaToToyama に完全に内包されている',
    'jrMitoLineExt は jrJobanLineMain に完全に内包されている',
    'omiYokaichLine は omiRailwayMain に完全に内包されている',
  ];

  it('既知のもの以外に、路線が完全に内包される重複が存在しない', () => {
    const keys = Object.keys(routes) as RouteKey[];
    const nameSets = new Map(keys.map((k) => [k, stationNamesOf(k)]));

    const duplicates: string[] = [];
    for (const a of keys) {
      const aNames = nameSets.get(a)!;
      // 駅数が少なすぎる路線は誤検出しやすいので除外
      if (aNames.length < 5) continue;

      for (const b of keys) {
        if (a === b) continue;
        const bNames = new Set(nameSets.get(b)!);
        if (bNames.size <= aNames.length) continue;
        if (aNames.every((n) => bNames.has(n))) {
          duplicates.push(`${a} は ${b} に完全に内包されている`);
        }
      }
    }

    const unexpected = duplicates.filter((d) => !KNOWN_DUPLICATES.includes(d));
    expect(unexpected).toEqual([]);

    // 既知の重複が解消されたらこのリストからも消すこと
    expect(duplicates.length).toBeLessThanOrEqual(KNOWN_DUPLICATES.length);
  });
});
