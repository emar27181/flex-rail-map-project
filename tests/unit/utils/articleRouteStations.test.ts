import { describe, expect, it } from 'vitest';
import { ARTICLE_SOURCES } from '../../../src/data/articles';
import { routes } from '../../../src/data/routes';
import { renderArticleBody } from '../../../src/utils/articleRender';

const sapporo = ARTICLE_SOURCES.find(article => article.slug === 'sapporo-namboku-line-map');

describe('札幌南北線の記事内の駅一覧', () => {
  it('4言語すべてで共通の路線データを使う', () => {
    expect(sapporo).toBeDefined();
    for (const lang of ['ja', 'en', 'zh', 'ko'] as const) {
      const blocks = sapporo!.content[lang].blocks;
      expect(blocks.filter(b => b.type === 'routeStations')).toEqual([
        { type: 'routeStations', route: 'sapporoNambokuLine' },
      ]);
      const html = renderArticleBody(sapporo!, lang);
      expect(html).toContain('<table class="rtable">');
    }
  });

  it('日本語ページの駅一覧は、地図の路線データと同じ16駅・同じ順序', () => {
    const stations = routes.sapporoNambokuLine;
    expect(stations).toHaveLength(16);
    const html = renderArticleBody(sapporo!, 'ja');
    const table = html.match(/<table class="rtable">[\s\S]*?<\/table>/)?.[0];
    expect(table).toBeDefined();
    const rows = [...table!.matchAll(/<tbody>[\s\S]*?<\/tbody>/g)][0]?.[0] ?? '';
    expect((rows.match(/<tr>/g) ?? [])).toHaveLength(stations.length);
    let prev = -1;
    for (const station of stations) {
      const index = rows.indexOf(station.name);
      expect(index, station.name).toBeGreaterThan(prev);
      prev = index;
    }
  });
});
