/**
 * 最近傍駅の取得のテスト
 *
 * 出発駅の入力候補で「近くの駅」を出すのに使う。
 * 並び順が壊れると、遠い駅が先頭に出て候補として役に立たなくなる。
 */
import { describe, it, expect } from 'vitest';
import { findNearestStations } from '../../../src/utils/nearestStations';
import type { Station } from '../../../src/data/yamanote';

const st = (name: string, lat: number, lng: number): Station =>
  ({ name, lat, lng, timeToNext: 0 }) as Station;

// 藤沢付近を基準に、東へ順に離れていく並び
const FUJISAWA: [number, number] = [35.3389, 139.4899];
const stations: Station[] = [
  st('遠い', 35.3389, 139.6),
  st('近い', 35.3389, 139.4905),
  st('中くらい', 35.3389, 139.52),
];

describe('findNearestStations', () => {
  it('距離の近い順に返す', () => {
    const result = findNearestStations(stations, FUJISAWA[0], FUJISAWA[1], 3);
    expect(result.map(s => s.name)).toEqual(['近い', '中くらい', '遠い']);
  });

  it('指定した件数だけ返す', () => {
    expect(findNearestStations(stations, FUJISAWA[0], FUJISAWA[1], 2)).toHaveLength(2);
  });

  it('駅数より多い件数を求めても全件までしか返さない', () => {
    expect(findNearestStations(stations, FUJISAWA[0], FUJISAWA[1], 99)).toHaveLength(3);
  });

  it('入力の配列を破壊しない（並び替えが呼び出し元に漏れない）', () => {
    // 共有の stations を使うと、先に走ったテストが並び替え済みの状態を作ってしまい
    // 破壊されていても気付けない。このテスト専用に未ソートの配列を用意する。
    const input = [
      st('遠い', 35.3389, 139.6),
      st('近い', 35.3389, 139.4905),
      st('中くらい', 35.3389, 139.52),
    ];
    findNearestStations(input, FUJISAWA[0], FUJISAWA[1], 3);
    expect(input.map(s => s.name)).toEqual(['遠い', '近い', '中くらい']);
  });

  it('駅が無い場合は空配列を返す', () => {
    expect(findNearestStations([], FUJISAWA[0], FUJISAWA[1], 5)).toEqual([]);
  });

  it('緯度方向の差も距離として扱う', () => {
    const northSouth = [
      st('北', 35.5, 139.4899),
      st('すぐ北', 35.34, 139.4899),
    ];
    const result = findNearestStations(northSouth, FUJISAWA[0], FUJISAWA[1], 2);
    expect(result[0]!.name).toBe('すぐ北');
  });
});
