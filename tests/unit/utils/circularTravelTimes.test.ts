import { describe, expect, it } from 'vitest';
import { RouteFinder } from '../../../src/utils/routeFinder';
import { routes } from '../../../src/data/routes';
import { adjacentRouteStations } from '../../../src/utils/routeAdjacency';

describe('環状線の最短累積時間', () => {
  const finder = new RouteFinder();
  const timesFrom = (name: string, limit = Infinity) => new Map(
    finder.findStationsWithinTime(routes.yamanote.find(s => s.name === name)!, limit, new Set(['yamanote']))
      .map(result => [result.station.name, result.totalTime]),
  );

  it('東京から有楽町へ一周せず2分、新橋へ4分で到達する', () => {
    const times = timesFrom('東京');
    expect(times.get('東京')).toBe(0);
    expect(times.get('神田')).toBe(2);
    expect(times.get('有楽町')).toBe(2);
    expect(times.get('新橋')).toBe(4);
  });

  it('逆方向も閉じる区間を通り、有楽町から東京へ2分で到達する', () => {
    expect(timesFrom('有楽町').get('東京')).toBe(2);
    expect(timesFrom('有楽町').get('神田')).toBe(4);
  });

  it('全駅で内回り・外回りの短い側と一致する', () => {
    const stations = routes.yamanote;
    const total = stations.reduce((sum, s) => sum + s.timeToNext!, 0);
    for (const departureIndex of [0, 10, stations.length - 1]) {
      const times = timesFrom(stations[departureIndex].name);
      let forward = 0;
      for (let step = 0; step < stations.length; step++) {
        const index = (departureIndex + step) % stations.length;
        expect(times.get(stations[index].name)).toBe(Math.min(forward, total - forward));
        forward += stations[index].timeToNext!;
      }
    }
  });

  it('時間フィルターも閉じる区間を含み、上限を超える駅を返さない', () => {
    const times = timesFrom('東京', 2);
    expect([...times.keys()].sort()).toEqual(['有楽町', '東京', '神田'].sort());
  });

  it('非環状線の端は接続せず、逆方向は同じ駅間時間を使う', () => {
    const stations = routes.yamanote.slice(0, 3);
    expect(adjacentRouteStations(stations, 0, 'chuo')).toEqual([{ index: 1, time: stations[0].timeToNext }]);
    expect(adjacentRouteStations(stations, 2, 'chuo')).toEqual([{ index: 1, time: stations[1].timeToNext }]);
  });
});
