/**
 * 所要時間探索のテスト。
 *
 * 以前の実装は「全駅について経路探索を1回ずつ回す」もので、駅が6,000ある今は
 * 所要時間表示をONにすると画面が数分固まって操作できなくなっていた。
 * 単一始点最短路1回に置き換えたので、速度と結果の妥当性の両方を固定する。
 */
import { describe, it, expect } from 'vitest';
import { RouteFinder, TimeFilter } from '../../../src/utils/routeFinder';
import { routes, type RouteKey } from '../../../src/data/routes';

const rf = new RouteFinder();
const timeFilter = new TimeFilter(rf);
const allRoutes = new Set(Object.keys(routes) as RouteKey[]);
const station = (name: string) => {
  for (const list of Object.values(routes)) {
    const hit = list.find(s => s.name === name);
    if (hit) return hit;
  }
  throw new Error(`駅が見つからない: ${name}`);
};

describe('findStationsWithinTime', () => {
  it('全路線を対象にしても実用的な速度で返る', () => {
    // 以前の実装はここで数分かかっていた。UIを固めない上限として1秒を置く
    const t0 = Date.now();
    timeFilter.findStationsWithinTime(station('東京'), 120, allRoutes);
    expect(Date.now() - t0).toBeLessThan(1000);
  });

  it('基準駅自身は0分で含まれる', () => {
    const results = timeFilter.findStationsWithinTime(station('新宿'), 30, allRoutes);
    const self = results.find(r => r.station.name === '新宿');
    expect(self?.totalTime).toBe(0);
  });

  it('しきい値を超える駅は含まれない', () => {
    const results = timeFilter.findStationsWithinTime(station('新宿'), 20, allRoutes);
    expect(results.every(r => r.totalTime <= 20)).toBe(true);
  });

  it('しきい値を広げると対象駅は減らない', () => {
    const narrow = timeFilter.findStationsWithinTime(station('新宿'), 20, allRoutes);
    const wide = timeFilter.findStationsWithinTime(station('新宿'), 60, allRoutes);
    expect(wide.length).toBeGreaterThanOrEqual(narrow.length);
  });

  it('所要時間の昇順で返る', () => {
    const results = timeFilter.findStationsWithinTime(station('渋谷'), 30, allRoutes);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].totalTime).toBeGreaterThanOrEqual(results[i - 1].totalTime);
    }
  });

  it('隣の駅は乗換なしの短時間で出る', () => {
    // 新宿の隣（山手線）は代々木。乗換ペナルティ(8分以上)を挟まない値になるはず
    const results = timeFilter.findStationsWithinTime(station('新宿'), 30, allRoutes);
    const yoyogi = results.find(r => r.station.name === '代々木');
    expect(yoyogi).toBeDefined();
    expect(yoyogi!.totalTime).toBeLessThan(8);
  });

  it('表示路線を絞ると、その路線だけで到達できる駅に限られる', () => {
    const onlyYamanote = new Set<RouteKey>(['yamanote'] as RouteKey[]);
    const results = timeFilter.findStationsWithinTime(station('新宿'), 60, onlyYamanote);
    const yamanoteNames = new Set(routes.yamanote.map(s => s.name));
    expect(results.every(r => yamanoteNames.has(r.station.name))).toBe(true);
    expect(results.length).toBeGreaterThan(1);
  });

  it('同じ駅が重複して返らない', () => {
    const results = timeFilter.findStationsWithinTime(station('東京'), 60, allRoutes);
    const names = results.map(r => r.station.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
