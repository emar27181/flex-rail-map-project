/**
 * 駅ナンバリングと路線データの整合性テスト
 *
 * 過去に起きた問題:
 * - 東海道線は保土ケ谷・東戸塚を通過する（両駅は横須賀線の駅）が、
 *   駅ナンバリングだけに両駅が JT06/JT07 として残っていた
 * - その結果、戸塚以降の番号が実際のJR東日本の付番より2つずれていた
 *   （正しくは 横浜JT05 → 戸塚JT06 → 大船JT07）
 */

import { describe, it, expect } from 'vitest';
import { routes, type RouteKey } from '../../../src/data/routes';
import { stationNumbers, getStationNumber } from '../../../src/data/stationNumbers';

describe('東海道線の駅ナンバリング', () => {
  it('通過駅である保土ケ谷・東戸塚を含まない', () => {
    expect(getStationNumber('jrTokaidoMainLine', '保土ケ谷')).toBeUndefined();
    expect(getStationNumber('jrTokaidoMainLine', '東戸塚')).toBeUndefined();
  });

  it('横浜JT05の次が戸塚JT06、その次が大船JT07になっている', () => {
    expect(getStationNumber('jrTokaidoMainLine', '横浜')).toBe('JT05');
    expect(getStationNumber('jrTokaidoMainLine', '戸塚')).toBe('JT06');
    expect(getStationNumber('jrTokaidoMainLine', '大船')).toBe('JT07');
    expect(getStationNumber('jrTokaidoMainLine', '熱海')).toBe('JT21');
  });
});

describe('駅ナンバリング全体の整合性', () => {
  // 路線データ側に該当駅が無いまま番号だけ残っているもの。
  // いずれも直通運転先の駅で、実際の付番としては正しい可能性があるため
  // 路線データ側を直すべきか番号を消すべきか判断が要る。未解決として記録し、
  // このテストでは「新たな不整合が増えないこと」を保証する。
  const KNOWN_INCONSISTENCIES = [
    'tokyuOimachiLine: 溝の口 は路線データに存在しない',
    'hokusouLine: 押上 は路線データに存在しない',
    'hokusouLine: 京成曳舟 は路線データに存在しない',
    'hokusouLine: 八広 は路線データに存在しない',
    'hokusouLine: 四ツ木 は路線データに存在しない',
    'hokusouLine: 立石 は路線データに存在しない',
    'hokusouLine: 青砥 は路線データに存在しない',
  ];

  it('既知のもの以外に、路線データに存在しない駅へ番号を振っていない', () => {
    const violations: string[] = [];

    for (const [routeKey, numbering] of Object.entries(stationNumbers)) {
      const stations = routes[routeKey as RouteKey];
      // routes に無い路線キーの番号定義は検出対象外（別テストで担保）
      if (!stations) continue;

      const names = new Set(stations.map((s) => s.name));
      for (const stationName of Object.keys(numbering)) {
        if (!names.has(stationName)) {
          violations.push(`${routeKey}: ${stationName} は路線データに存在しない`);
        }
      }
    }

    const unexpected = violations.filter((v) => !KNOWN_INCONSISTENCIES.includes(v));
    expect(unexpected).toEqual([]);

    // 既知の不整合が解消されたらこのリストからも消すこと
    expect(violations.length).toBeLessThanOrEqual(KNOWN_INCONSISTENCIES.length);
  });
});
