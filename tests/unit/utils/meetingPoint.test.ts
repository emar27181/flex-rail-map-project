import { describe, it, expect } from 'vitest';
import { rankMeetingStations } from '../../../src/utils/meetingPoint';
import { RouteFinder, TimeFilter } from '../../../src/utils/routeFinder';
import { routes } from '../../../src/data/routes';
import type { RouteKey } from '../../../src/data/routes';

const m = (o: Record<string, number>) => new Map(Object.entries(o));

describe('rankMeetingStations', () => {
  it('いちばん遅い人の所要時間が短い順に並べる（合計が小さくても偏る駅は後ろ）', () => {
    const r = rankMeetingStations(['A', 'B'], [
      m({ X: 10, Y: 20, Z: 15 }),
      m({ X: 40, Y: 25, Z: 15 }),
    ]);
    // Z: max15 / Y: max25 / X: max40（合計は X=50, Y=45, Z=30）
    expect(r.map(c => c.name)).toEqual(['Z', 'Y', 'X']);
    expect(r[0]).toMatchObject({ times: [15, 15], max: 15, sum: 30 });
  });

  it('最大が同じなら合計が短い順', () => {
    const r = rankMeetingStations(['A', 'B'], [m({ P: 10, Q: 5 }), m({ P: 20, Q: 20 })]);
    expect(r.map(c => c.name)).toEqual(['Q', 'P']);
  });

  it('全員が行ける駅だけを候補にする', () => {
    const r = rankMeetingStations(['A', 'B', 'C'], [
      m({ X: 10, Y: 10 }), m({ X: 10 }), m({ X: 5, Y: 5 }),
    ]);
    expect(r.map(c => c.name)).toEqual(['X']);
  });

  it('出発駅自身は 0 分として候補に入る', () => {
    const r = rankMeetingStations(['A', 'B'], [m({ B: 12 }), m({ A: 12 })]);
    expect(r.map(c => c.name).sort()).toEqual(['A', 'B']);
    expect(r[0].times).toContain(0);
  });

  it('出発駅が2つ未満なら候補を出さない', () => {
    expect(rankMeetingStations(['A'], [m({ A: 0 })])).toEqual([]);
  });
});

describe('実際の路線データでの集合駅', () => {
  const finder = new RouteFinder();
  const tf = new TimeFilter(finder);
  const all = new Set(Object.keys(routes) as RouteKey[]);
  const stationOf = (name: string) => {
    for (const stops of Object.values(routes)) {
      const s = stops.find(st => st.name === name);
      if (s) return s;
    }
    throw new Error(`${name} が無い`);
  };
  const timesFrom = (name: string) =>
    new Map(tf.findStationsWithinTime(stationOf(name), 120, all).map(r => [r.station.name, r.totalTime]));

  it('新宿と東京の集合駅の上位は、2駅の間にある駅で、遅い人の時間が最短になる', () => {
    const r = rankMeetingStations(['新宿', '東京'], [timesFrom('新宿'), timesFrom('東京')]);
    expect(r.length).toBeGreaterThan(3);
    const top = r[0];
    // 2駅の最短所要時間より、いちばん遅い人の時間は短い（途中の駅で会える）
    const direct = timesFrom('新宿').get('東京')!;
    expect(top.max).toBeLessThanOrEqual(Math.ceil(direct));
    expect(top.max).toBeLessThan(direct);
    // 並びは max の昇順
    for (let i = 1; i < r.length; i++) expect(r[i].max).toBeGreaterThanOrEqual(r[i - 1].max);
  });
});
