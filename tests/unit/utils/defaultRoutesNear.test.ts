import { describe, it, expect } from 'vitest';
import { routes, type RouteKey } from '../../../src/data/routes';
import { getAllStations } from '../../../src/utils/allStations';
import { isSameStation } from '../../../src/utils/sameStation';
import { defaultRoutesNear, MIN_DEFAULT_LINES } from '../../../src/utils/defaultRoutesNear';

const stations = getAllStations();
// 地図（RailwayMap の getRoutesForStation）と同じく、同じ駅（駅名＋座標）を通る路線
const routesOf = (s: { name: string; lat: number; lng: number }) =>
  (Object.entries(routes) as Array<[RouteKey, Array<{ name: string; lat: number; lng: number }>]>)
    .filter(([, list]) => list.some(x => isSameStation(x, s)))
    .map(([k]) => k);
const at = (name: string) => stations.find(s => s.name === name)!;

describe('現在地から最初に出す路線', () => {
  it('最寄り駅に路線が複数あれば、その路線をすべて出す（新宿）', () => {
    const s = at('新宿');
    expect(defaultRoutesNear(s.lat, s.lng, stations, routesOf)).toEqual(routesOf(s));
    expect(routesOf(s).length).toBeGreaterThan(1);
  });

  it('最寄り駅が1路線だけなら、近くの駅の路線を足して3路線にする（江ノ電の長谷）', () => {
    const s = stations.find(x => x.name === '長谷' && routesOf(x).includes('enoshimaElectricRailway'))!;
    expect(routesOf(s)).toEqual(['enoshimaElectricRailway']);
    const picked = defaultRoutesNear(s.lat, s.lng, stations, routesOf);
    expect(picked[0]).toBe('enoshimaElectricRailway');
    expect(picked).toHaveLength(MIN_DEFAULT_LINES);
    expect(new Set(picked).size).toBe(picked.length);
  });

  it('近くに他の路線が無ければ、見つかった分だけ出す（遠くの路線は足さない）', () => {
    const lone = [{ name: 'A', lat: 0, lng: 0 }, { name: 'B', lat: 1, lng: 1 }];
    const r = (s: { name: string }) => (s.name === 'A' ? ['yamanote'] : ['chuo']) as RouteKey[];
    expect(defaultRoutesNear(0, 0, lone, r)).toEqual(['yamanote']);
  });
});
