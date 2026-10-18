import { describe, it, expect } from 'vitest';
import { decodeVisibleRoutesParam } from '../../../src/utils/routeUrlCodes';
import { ARTICLE_SOURCES } from '../../../src/data/articles';
import { articleMapHref, shotEmbedSrc, shotOpenHref } from '../../../src/utils/articleRender';
import type { ArticleLang } from '../../../src/data/articles/types';

// Editorial regression cases: railways promised by each comparison/transfer topic.
const cases = {
  "haneda-keikyu-monorail-map": [
    "keikyuAirportLine",
    "keikyuLine",
    "tokyoMonorail"
  ],
  "odaiba-yurikamome-rinkai": [
    "yurikamomeLine",
    "rinkaiLine"
  ],
  "nikko-tobu-vs-jr": [
    "tobuNikkoLine",
    "jrNikkoLine"
  ],
  "enoshima-three-station-names": [
    "enoshimaElectricRailway",
    "odakyuEnoshimaLine",
    "shonanMonorail"
  ],
  "asakusa-multiple-stations": [
    "ginzaLine",
    "toeiAsakusaLine",
    "tobuIsesakiLine",
    "tsukubaExpress"
  ],
  "akihabara-lines-transfer": [
    "yamanote",
    "keihinTohoku",
    "hibiyaLine",
    "tsukubaExpress"
  ],
  "ueno-keisei-ueno-difference": [
    "keiseiMainLine",
    "yamanote",
    "ginzaLine",
    "hibiyaLine"
  ],
  "shibuya-harajuku-omotesando-map": [
    "yamanote",
    "ginzaLine",
    "hanzomonLine",
    "chiyodaLine"
  ],
  "through-service-line-name-change": [
    "tokyuToyokoLine",
    "fukutoshinLine",
    "minatomirai"
  ],
  "hakone-odakyu-transfer": [
    "odakyuLine",
    "hakoneTozan"
  ],
  "shinjuku-station-line-first": [
    "yamanote",
    "chuo",
    "jrSaikyoLine",
    "odakyuLine",
    "keioLine",
    "marunouchiLine",
    "toeiShinjukuLine",
    "toeiOedoLine"
  ],
  "tokyo-station-otemachi-difference": [
    "marunouchiLine",
    "yamanote",
    "chiyodaLine",
    "hanzomonLine",
    "tozaiLine",
    "toeiMitaLine"
  ],
  "airport-terminal-train-station-names": [
    "tokyoMonorail",
    "keikyuAirportLine"
  ]
} as const;
const routesOf = (href: string) => Array.from(decodeVisibleRoutesParam(new URL(href, 'https://example.test').searchParams.get('routes')) ?? []);
describe('比較記事で片方の路線が欠落しない', () => {
  for (const [slug, expected] of Object.entries(cases)) {
    it.each<ArticleLang>(['ja', 'en', 'zh', 'ko'])(`${slug}: %s のデモと遷移先は比較対象を維持する`, lang => {
      const article = ARTICLE_SOURCES.find(a => a.slug === slug)!;
      for (const block of article.content[lang].blocks) {
        if (block.type === 'embed' || block.type === 'cta') {
          for (const embed of [false, true]) {
            const href = articleMapHref(article.maps[block.map], lang, embed);
            expect(routesOf(href)).toEqual(expected);
            expect(new URL(href, 'https://example.test').searchParams.get('lang') ?? 'ja').toBe(lang);
          }
        }
      }
      expect(routesOf(shotEmbedSrc(article.shots.detail, article, lang))).toEqual(expected);
      expect(routesOf(shotOpenHref(article.shots.detail, article, lang))).toEqual(expected);
    });
  }
});
