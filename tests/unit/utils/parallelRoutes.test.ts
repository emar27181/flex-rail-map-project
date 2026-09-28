import { describe, it, expect } from 'vitest';
import { routes, type RouteKey } from '../../../src/data/routes';
import { findParallelSections } from '../../../src/utils/parallelRoutes';

type S = { name: string; lat: number; lng: number };
const entries = Object.entries(routes) as Array<[RouteKey, S[]]>;

/** 路線データから「路線 route の from〜to」の区間を切り出す */
function segment(route: RouteKey, from: string, to: string) {
  const list = routes[route] as S[];
  const a = list.findIndex(s => s.name === from);
  const b = list.findIndex(s => s.name === to);
  const stations = a <= b ? list.slice(a, b + 1) : list.slice(b, a + 1).reverse();
  return { routeKey: route, stations };
}

describe('並行ルート（別の路線で行く道）', () => {
  const par = findParallelSections([segment('jrTokaidoMainLine', '藤沢', '東京')], entries);
  const ends = (k: RouteKey) => (par.get(k) ?? []).map(sec => `${sec[0].name}-${sec[sec.length - 1].name}`);

  it('藤沢→東京の東海道線に対して、京浜東北線と横須賀線の大船〜東京を出す', () => {
    expect(ends('keihinTohoku')).toEqual(['大船-東京']);
    expect(ends('yokosukaLine')).toEqual(['大船-東京']);
  });

  it('同じ駅だけを通る系統（湘南新宿ライン・常磐線の品川〜東京）は線を増やすだけなので出さない', () => {
    expect(par.has('jrShonanShinjukuTakasakiTokaido')).toBe(false);
    expect(par.has('jrJobanLine')).toBe(false);
  });

  it('経路と同じ路線や、既に出した並行ルートの駅しか通らない路線（山手線）は出さない', () => {
    expect(par.has('jrTokaidoMainLine')).toBe(false);
    expect(par.has('yamanote')).toBe(false);
  });

  it('遠回りの区間は出さない（環状線の反対回りなど）', () => {
    const loop: S[] = [
      { name: 'A', lat: 0, lng: 0 }, { name: 'X', lat: 0.5, lng: 0.5 }, { name: 'Y', lat: 1, lng: 0 },
      { name: 'B', lat: 0, lng: 0.01 }, { name: 'C', lat: 0, lng: 0.02 },
    ];
    const main = { routeKey: 'm', stations: [loop[0], loop[3], loop[4]] };
    expect(findParallelSections([main], [['m', main.stations], ['loop', loop]]).has('loop')).toBe(false);
  });
});
