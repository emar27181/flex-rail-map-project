import { describe, it, expect } from 'vitest';
import { routes, type RouteKey } from '../../../src/data/routes';
import { findParallelSections, sectionMinutes } from '../../../src/utils/parallelRoutes';

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

describe('並行ルートの所要時間（時刻ラベル用）', () => {
  const list = [
    { name: 'A', lat: 0, lng: 0, timeToNext: 2 },
    { name: 'B', lat: 0, lng: 0.01, timeToNext: 3 },
    { name: 'C', lat: 0, lng: 0.02 },
  ];

  it('路線データと同じ向きなら各駅の timeToNext を足していく', () => {
    expect(sectionMinutes([list[0], list[1], list[2]], list)).toEqual([0, 2, 5]);
  });

  it('逆向きの区間では1つ手前（路線データ上の前の駅）の値を使う', () => {
    expect(sectionMinutes([list[2], list[1], list[0]], list)).toEqual([0, 3, 5]);
  });

  it('藤沢→東京の並行ルート（京浜東北線 大船〜東京）の所要時間は正の値で増えていく', () => {
    const sec = findParallelSections([segment('jrTokaidoMainLine', '藤沢', '東京')], entries).get('keihinTohoku')![0];
    const mins = sectionMinutes(sec, routes.keihinTohoku as S[]);
    expect(mins[0]).toBe(0);
    for (let i = 1; i < mins.length; i++) expect(mins[i]).toBeGreaterThan(mins[i - 1]);
  });
});
