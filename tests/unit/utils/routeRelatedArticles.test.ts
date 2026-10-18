import { describe, expect, it } from 'vitest';
import { articlesForRoute } from '../../../src/utils/routeRelatedArticles';
import { ARTICLE_LANGUAGES } from '../../../src/data/articleI18n';

describe('路線ページと記事の相互リンク', () => {
  it('札幌南北線に関係する記事だけが入り、言語別URLが正しい', () => {
    for (const lang of ARTICLE_LANGUAGES) {
      const items = articlesForRoute('sapporoNambokuLine', lang);
      const direct = items.find(i => i.slug === 'sapporo-namboku-line-map');
      expect(direct).toBeDefined();
      expect(direct!.href).toBe(`${lang === 'ja' ? '' : '/' + lang}/articles/sapporo-namboku-line-map`);
      expect(direct!.title).toBeTruthy();
    }
  });
  it('同一記事の重複・架空のリンクを出さず、件数制限する', () => {
    const rows = articlesForRoute('midosujiLine', 'en', 2);
    expect(rows.length).toBeLessThanOrEqual(2);
    expect(new Set(rows.map(x => x.slug)).size).toBe(rows.length);
    expect(rows.every(x => x.href.startsWith('/en/articles/'))).toBe(true);
    expect(articlesForRoute('midosujiLine', 'ja', 0)).toEqual([]);
  });
});
