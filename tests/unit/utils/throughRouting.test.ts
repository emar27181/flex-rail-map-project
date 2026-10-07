/**
 * 直通運転を経路検索に使う（utils/throughRouting.ts）のテスト。
 *
 * 経路検索は路線データ単位で乗り換えを数えるため、藤沢 → 宇都宮で上野東京ライン（東海道線 → 宇都宮線の
 * 直通）が出ず、藤沢 → 大宮の「東海道線 → 東京で高崎線」も乗換1回と数えていた。
 */
import { describe, it, expect } from 'vitest';
import { routes, type RouteKey } from '../../../src/data/routes';
import { RouteFinder, type RouteResult } from '../../../src/utils/routeFinder';
import { resolveServices, findThroughTrips } from '../../../src/utils/throughRouting';
import { getThroughReachableSections } from '../../../src/utils/throughService';

const station = (route: RouteKey, name: string) => {
  const s = routes[route]!.find(x => x.name === name);
  if (!s) throw new Error(`${route} に ${name} が無い`);
  return s;
};
const finder = new RouteFinder();
const describeRoute = (r: RouteResult) =>
  r.segments.map(s => `${s.through ? '直通:' : ''}${s.routeKey}[${s.stations[0].name}→${s.stations[s.stations.length - 1].name}]`).join(' > ');

describe('経路検索で直通運転を1本の列車として扱う', () => {
  it('藤沢 → 宇都宮: 上野東京ライン（東海道線 → 宇都宮線）が乗換なしの経路として出る', () => {
    const results = finder.findRoutes(station('jrTokaidoMainLine', '藤沢'), station('jrUtsunomiyaLine', '宇都宮'), 5);
    const through = results.find(r => r.transfers === 0);
    expect(through, results.map(describeRoute).join('\n')).toBeDefined();
    expect(through!.segments.map(s => s.routeKey)).toEqual(['jrTokaidoMainLine', 'jrTakasakiLine', 'jrUtsunomiyaLine']);
    // 東京〜上野は路線データに宇都宮線が無いので、高崎線データで橋渡しする
    expect(through!.segments[1].stations.map(s => s.name)).toEqual(['東京', '神田', '秋葉原', '御徒町', '上野'].filter(n => through!.segments[1].stations.some(s => s.name === n)));
    expect(through!.segments.map(s => !!s.through)).toEqual([false, true, true]);
  });

  it('藤沢 → 高崎: 東京で高崎線へ入るのは乗り換えではない（直通）', () => {
    const results = finder.findRoutes(station('jrTokaidoMainLine', '藤沢'), station('jrTakasakiLine', '高崎'), 5);
    const viaTokyo = results.find(r => r.segments.length === 2 && r.segments[1].routeKey === 'jrTakasakiLine' && r.segments[1].stations[0].name === '東京');
    expect(viaTokyo, results.map(describeRoute).join('\n')).toBeDefined();
    expect(viaTokyo!.transfers).toBe(0);
    expect(viaTokyo!.segments[1].through).toBe(true);
  });

  it('渋谷 → 川越: 副都心線から和光市で東上線へ直通する経路は乗換なし', () => {
    const results = finder.findRoutes(station('fukutoshinLine', '渋谷'), station('tobuTojoLine', '川越'), 5);
    expect(results[0].transfers).toBe(0);
    expect(results[0].segments.map(s => s.routeKey)).toEqual(['fukutoshinLine', 'tobuTojoLine']);
  });

  it('都営新宿線 → 京王相模原線: 新宿〜笹塚は京王線データで橋渡しして1本で行ける', () => {
    const trips = findThroughTrips(station('toeiShinjukuLine', '本八幡'), station('keioSagamiharaLine', '橋本'));
    expect(trips.map(t => t.serviceId)).toContain('shinjuku-keio');
  });

  it('宇都宮 → 高崎: 宇都宮線と高崎線の直通列車は無いので、乗換なしにはならない', () => {
    const results = finder.findRoutes(station('jrUtsunomiyaLine', '宇都宮'), station('jrTakasakiLine', '高崎'), 5);
    expect(results.every(r => r.transfers >= 1), results.map(describeRoute).join('\n')).toBe(true);
  });

  it('連鎖は推論しない: 江ノ島線 → 小田原線 → 千代田線は、代々木上原で乗り換えになる', () => {
    const results = finder.findRoutes(station('odakyuEnoshimaLine', '片瀬江ノ島'), station('chiyodaLine', '北千住'), 5);
    const viaOdakyu = results.find(r => r.segments.some(s => s.routeKey === 'chiyodaLine') && r.segments[0].routeKey === 'odakyuEnoshimaLine' && r.segments[1]?.routeKey === 'odakyuLine');
    expect(viaOdakyu, results.map(describeRoute).join('\n')).toBeDefined();
    expect(viaOdakyu!.transfers).toBe(1);
    expect(viaOdakyu!.segments.map(s => !!s.through)).toEqual([false, true, false]);
  });
});

/**
 * 路線データに間の線が無く、橋渡しもできない直通（docs/through-services.md「路線データ側の制約」）。
 * 路線データを足して直ったら、ここから消す。ここに無い区間の組がつながらなければテストが落ちる
 */
const KNOWN_GAPS: Record<string, string> = {
  'toyoko-fukutoshin-seibu': '西武有楽町線（小竹向原〜練馬）の路線データが無い',
  'yurakucho-seibu': '西武有楽町線（小竹向原〜練馬）の路線データが無い',
  'seibu-chichibu': '西武池袋線データが入間市まで（吾野まで無い）',
  'keikyu-kurihama': '京急本線データが横浜まで（堀ノ内まで無い）',
  'keikyu-airport-zushi': '京急本線データが横浜まで（金沢八景まで無い）',
  'jrw-special-rapid': 'JR神戸線データが住吉まで（神戸まで無い）',
  'jrw-tozai-gakken': 'JR神戸線データが住吉まで（神戸まで無い）',
  'jrw-yamatoji-rapid': '大阪環状線の重複登録（osakaLoopLine）の区間が天王寺1駅だけ。jrOsakaLoop 側はつながる',
  'jrw-kanku-kishuji-rapid': '大阪環状線の重複登録（osakaLoopLine）の区間が天王寺1駅だけ。jrOsakaLoop 側はつながる',
  'meitetsu-inuyama-tokoname': '名鉄犬山線データの枇杷島と名古屋本線データの東枇杷島が別の駅名',
  'meitetsu-kowa-chita': '名鉄常滑線データに太田川が無い',
  'marine-liner': '本四備讃線（茶屋町〜宇多津）の路線データが無い',
};

describe('すべての直通系統が経路検索でつながる', () => {
  it('系統の中の路線の組は、すべて1本の列車でつながる（既知の欠けを除く）', () => {
    const broken: string[] = [];
    for (const sv of resolveServices()) {
      if (KNOWN_GAPS[sv.id]) continue;
      for (let i = 0; i < sv.sections.length; i++) {
        for (let j = 0; j < sv.sections.length; j++) {
          const a = sv.sections[i];
          const b = sv.sections[j];
          if (i === j || a.route === b.route) continue;
          const sa = routes[a.route]!;
          const sb = routes[b.route]!;
          const ok = [a.range[0], a.range[1]].some(x =>
            [b.range[0], b.range[1]].some(y => findThroughTrips(sa[x], sb[y], [sv]).length > 0));
          if (!ok) broken.push(`${sv.id}: ${a.route} → ${b.route}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('既知の欠けとして挙げた系統は実在する（消し忘れを防ぐ）', () => {
    const ids = new Set(resolveServices().map(s => s.id));
    expect(Object.keys(KNOWN_GAPS).filter(id => !ids.has(id))).toEqual([]);
  });
});

describe('出発駅だけを選んだときの「1本で行ける範囲」', () => {
  it('橋渡しの区間も描く（都営新宿線の駅から、京王線の新宿〜笹塚〜調布がつながって出る）', () => {
    const reach = getThroughReachableSections(station('toeiShinjukuLine', '本八幡'));
    const keio = reach.get('keioLine') ?? [];
    expect(keio.length).toBe(1);
    const names = keio[0].map(s => s.name);
    expect(names[0]).toBe('新宿');
    expect(names[names.length - 1]).toBe('調布');
  });

  it('上野東京ラインを2系統に分けたので、宇都宮線の駅から高崎方面は「1本で行ける」に入らない', () => {
    const reach = getThroughReachableSections(station('jrUtsunomiyaLine', '宇都宮'));
    expect(reach.has('jrTokaidoMainLine')).toBe(true);
    // 高崎線データは東京〜上野の橋渡しだけ（高崎方面へは延びない）
    const takasaki = (reach.get('jrTakasakiLine') ?? []).flat().map(s => s.name);
    expect(takasaki[0]).toBe('東京');
    expect(takasaki[takasaki.length - 1]).toBe('上野');
  });
});
