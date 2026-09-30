import { describe, it, expect } from 'vitest';
import { routes } from '../../../src/data/routes';
import { PARAM_DATA_SOURCES, STAT_PARAMS } from '../../../src/data/stationStats';
import { TOURIST_SPOTS } from '../../../src/data/touristSpots';
import { SEO_CITIES, SEO_DATA_CITIES } from '../../../src/data/seoPages';
import { SEO_LINE_KEYS, getSeoModel, nearbyMajorStations, stationName, toSlug } from '../../../src/seo/pageModel';
import { SOURCE_TITLE_EN, STAT_SCOPE_EN, STAT_SCOPE_KO, STAT_SCOPE_ZH } from '../../../src/seo/pageText';
import { stationTranslationsKorean } from '../../../src/utils/stationTranslationsCJK';
import { buildMapHref } from '../../../src/utils/mapDeepLink';
import { decodeVisibleRoutesParam } from '../../../src/utils/routeUrlCodes';

const model = getSeoModel();
const byName = (name: string) => model.stations.find(s => s.name === name)!;

describe('観光地と最寄り駅のデータ', () => {
  it('指定した駅がその路線に実在する', () => {
    for (const spot of TOURIST_SPOTS) {
      for (const st of spot.stations) {
        const list = routes[st.route] as Array<{ name: string }> | undefined;
        expect(list, `${spot.id}: 路線 ${st.route} が無い`).toBeDefined();
        expect(list!.some(s => s.name === st.name), `${spot.id}: ${st.route} に ${st.name} が無い`).toBe(true);
      }
    }
  });

  it('観光地の最寄り駅には駅ページがあり、観光地が載る', () => {
    for (const spot of TOURIST_SPOTS) {
      for (const st of spot.stations) {
        expect(model.stations.some(s => s.name === st.name && s.touristSpots.includes(spot))).toBe(true);
      }
    }
  });

  it('路線データで重複登録された同じ路線は、駅ページで1本にまとめる', () => {
    expect(byName('天王寺').routes).toContain('osakaLoopLine');
    expect(byName('天王寺').routes).not.toContain('jrOsakaLoop');
    expect(byName('箱根湯本').routes).toEqual(['hakoneTozan']);
  });

  it('観光地はすべて都市の一覧に含まれる都市に属する', () => {
    const ids = new Set(SEO_CITIES.map(c => c.id));
    for (const spot of TOURIST_SPOTS) expect(ids.has(spot.city), spot.id).toBe(true);
  });

  it('同名の別駅を混ぜない（長谷〈江ノ電〉に JR播但線の長谷を含めない）', () => {
    const hase = byName('長谷');
    expect(hase.routes).toContain('enoshimaElectricRailway');
    expect(hase.routes).not.toContain('jrBantanLine');
  });
});

describe('ページのURL', () => {
  it('路線ページの路線は路線データに実在する', () => {
    for (const k of SEO_LINE_KEYS) expect(routes[k], k).toBeDefined();
  });

  it('駅・路線の slug は重複せず、英小文字・数字・ハイフンだけ', () => {
    for (const list of [model.stations.map(s => s.slug), model.lines.map(l => l.slug)]) {
      expect(new Set(list).size).toBe(list.length);
      for (const slug of list) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
    expect(toSlug('Meiji-jingumae')).toBe('meiji-jingumae');
    expect(toSlug('Ōtemachi')).toBe('otemachi');
  });
});

describe('index させるページの範囲', () => {
  it('index する駅ページは Tier A だけで、主要都市の大きな駅と観光地の駅（100駅以内）に限る', () => {
    const indexable = model.stations.filter(s => s.indexable);
    expect(indexable.every(s => s.tier === 'A')).toBe(true);
    // 基準（src/data/seoPages.ts）を緩めて数百ページを一度に index させないための歯止め
    expect(indexable.length).toBeGreaterThanOrEqual(40);
    expect(indexable.length).toBeLessThanOrEqual(100);
  });

  it('周辺統計を集めていない地域（関西・札幌など）の主要駅・観光地の駅も index する', () => {
    for (const name of ['天王寺', 'なんば', '京都', '稲荷', '大通', '博多']) expect(byName(name).indexable, name).toBe(true);
  });

  it('大きな乗換駅と観光地の最寄り駅は index、郊外の単線の駅は noindex', () => {
    expect(byName('新宿').indexable).toBe(true);
    expect(byName('元町・中華街').indexable).toBe(true);
    expect(byName('参宮橋').indexable).toBe(false);
  });
});

describe('ページを作る言語', () => {
  it('日本語・英語はすべての駅、中国語・韓国語は index する駅のうち駅名の訳がある駅だけ', () => {
    for (const s of model.stations) {
      expect(s.langs).toContain('ja');
      expect(s.langs).toContain('en');
      if (s.langs.includes('zh') || s.langs.includes('ko')) expect(s.indexable, s.name).toBe(true);
      expect(s.langs.includes('ko'), s.name).toBe(s.indexable && !!stationTranslationsKorean[s.name]);
    }
  });

  it('韓国語の駅名の訳が無い駅は、推測で訳さず英語名を出す', () => {
    const s = model.stations.find(x => !stationTranslationsKorean[x.name])!;
    expect(stationName(s, 'ko')).toBe(s.nameEn);
  });
});

describe('実データだけを使う', () => {
  it('駅ページの統計はすべて dataQuality: real', () => {
    for (const s of model.stations) {
      for (const st of s.stats) expect(st.meta.dataQuality, `${s.name} ${st.key}`).toBe('real');
    }
  });

  it('推定値の指標（乗降客数・家賃）はデータのページを作らない', () => {
    const slugs = model.dataPages.map(d => d.slug);
    expect(slugs).toContain('restaurant-count');
    for (const e of model.excludedDataMetrics) {
      expect(e.meta.dataQuality).toBe('estimated');
      expect(slugs).not.toContain(e.slug);
    }
  });

  it('データのページは値のある駅だけを並べ、無い駅は0にしない', () => {
    for (const page of model.dataPages) {
      const scope = model.stations.filter(s => s.cities.some(c => SEO_DATA_CITIES.includes(c)));
      expect(page.rows.length + page.missingCount).toBe(scope.length);
      for (const r of page.rows) expect(r.station.stats.some(s => s.key === page.key && s.value === r.value)).toBe(true);
    }
  });

  it('英語・中国語・韓国語ページに出す統計の範囲・時期に訳がある', () => {
    for (const p of STAT_PARAMS.filter(p => p.dataQuality === 'real')) {
      for (const x of [p.radius, p.period]) {
        if (!x) continue;
        for (const map of [STAT_SCOPE_EN, STAT_SCOPE_ZH, STAT_SCOPE_KO]) expect(map[x], x).toBeDefined();
      }
      const src = PARAM_DATA_SOURCES[p.key];
      if (src && p.key !== 'routeCount') expect(SOURCE_TITLE_EN[src.title], src.title).toBeDefined();
    }
  });
});

describe('内部リンク', () => {
  it('隣の駅のリンク先は実在する駅ページ', () => {
    const slugs = new Set(model.stations.map(s => s.slug));
    for (const s of model.stations) {
      for (const a of s.adjacent) {
        for (const ref of [a.prev, a.next]) if (ref?.slug) expect(slugs.has(ref.slug)).toBe(true);
      }
    }
  });

  it('近くの主要駅は index 対象の駅だけ', () => {
    for (const s of model.stations.slice(0, 50)) {
      for (const n of nearbyMajorStations(s)) expect(n.indexable).toBe(true);
      for (const n of nearbyMajorStations(s, 'ko')) expect(n.langs).toContain('ko');
    }
  });
});

describe('地図へのリンク', () => {
  it('路線はURLの略称コードにして、地図側で元の路線に戻せる', () => {
    const href = buildMapHref({ routes: ['yamanote', 'ginzaLine'], lang: 'en' });
    const params = new URL(href, 'https://example.test').searchParams;
    expect([...decodeVisibleRoutesParam(params.get('routes'))!]).toEqual(['yamanote', 'ginzaLine']);
    expect(params.get('lang')).toBe('en');
  });

  it('出発駅を指定できる駅は、地図が同じ駅名で同じ駅を引ける駅だけ', () => {
    expect(byName('新宿').mapFrom).toBe('新宿');
    expect(buildMapHref({ from: '新宿' })).toBe(`/?from=${encodeURIComponent('新宿')}`);
  });
});
