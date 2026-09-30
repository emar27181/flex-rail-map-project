import { describe, it, expect } from 'vitest';
import { routes, routeNames, type RouteKey } from '../../../src/data/routes';
import { SERVICE_SYSTEMS, SERVICE_BRAND_LABEL_KEY, getServiceSystem } from '../../../src/data/serviceSystems';
import { routeTranslations, translateUI, type Language } from '../../../src/utils/translation';
import { timetableLines } from '../../../src/data/timetableData';

/**
 * 路線データに駅が無いため検証できない始発・行先（理由を必ず書く）。
 * 路線データ側を直したらここから消す。
 */
const KNOWN_MISSING_TERMINI: Record<string, string> = {
  籠原: '高崎線データ（jrTakasakiLine）に籠原駅が無い（熊谷〜深谷間が欠落）',
  成田空港: 'JR成田線データ（jrNaritaLine, 千葉〜銚子）に空港支線（成田〜成田空港）が無い',
};

const LANGS: Language[] = ['japanese', 'english', 'chinese', 'korean'];

describe('運行系統（始発・行先）データ', () => {
  it('系統は路線ごとに1つだけ', () => {
    const keys = SERVICE_SYSTEMS.map(s => s.route);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('始発・行先の駅は、直通先の路線（無ければその路線）に実在する', () => {
    const missing: string[] = [];
    for (const sys of SERVICE_SYSTEMS) {
      for (const end of [...sys.head, ...sys.tail]) {
        const onRoute: RouteKey = end.via ?? sys.route;
        expect(routes[onRoute], `${sys.route}: 路線 ${onRoute}`).toBeDefined();
        for (const st of end.stations) {
          if (KNOWN_MISSING_TERMINI[st]) continue;
          if (!routes[onRoute].some(s => s.name === st)) missing.push(`${sys.route}: ${st}（${onRoute}）`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('各系統に出典がある', () => {
    for (const sys of SERVICE_SYSTEMS) expect(sys.sources.length, sys.route).toBeGreaterThan(0);
  });

  it('系統名は4言語すべてで翻訳されている（キーがそのまま出ない）', () => {
    for (const key of Object.values(SERVICE_BRAND_LABEL_KEY)) {
      for (const lang of LANGS) expect(translateUI(key, lang), `${key} / ${lang}`).not.toBe(key);
    }
  });

  it('藤沢には上野東京ラインと湘南新宿ラインの2系統が来る', () => {
    const brandsAtFujisawa = new Set(
      (Object.keys(routes) as RouteKey[])
        .filter(rk => routes[rk].some(s => s.name === '藤沢'))
        .map(rk => getServiceSystem(rk)?.brand)
        .filter(Boolean),
    );
    expect(brandsAtFujisawa).toEqual(new Set(['uenoTokyoLine', 'shonanShinjukuLine']));
  });

  it('湘南新宿ラインの高崎線系統は籠原・高崎方面⇔小田原方面（宇都宮・逗子とは交差しない）', () => {
    const takasaki = getServiceSystem('jrShonanShinjukuTakasakiTokaido')!;
    const stations = [...takasaki.head, ...takasaki.tail].flatMap(e => e.stations);
    expect(stations).toContain('籠原');
    expect(stations).toContain('小田原');
    expect(stations).not.toContain('宇都宮');
    expect(stations).not.toContain('逗子');
  });
});

describe('運行系統の路線名は「系統名（路線名）」で揃える', () => {
  // 上野東京ライン・湘南新宿ラインは、地図の1本の線が「系統のどの路線を走る部分か」を括弧で示す。
  // 以前は「東海道本線」の下に系統名を添える形と「湘南新宿ライン（高崎線・東海道線）」が混ざっていた
  const BRANDS_IN_NAME = ['uenoTokyoLine', 'shonanShinjukuLine'] as const;

  for (const sys of SERVICE_SYSTEMS.filter(s => (BRANDS_IN_NAME as readonly string[]).includes(s.brand))) {
    it(`${sys.route}`, () => {
      const brand = translateUI(SERVICE_BRAND_LABEL_KEY[sys.brand], 'japanese');
      const name = routeNames[sys.route as keyof typeof routeNames];
      expect(name).toMatch(new RegExp(`^${brand}（.+）$`));
      expect(routeTranslations[name], `${name} の英語名が無い`).toBeDefined();
      const tt = timetableLines.find(l => l.key === sys.route);
      if (tt) expect(tt.name).toBe(name);
    });
  }
});
