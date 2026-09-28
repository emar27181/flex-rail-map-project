/**
 * ビルド結果（dist）に対する SEO 検証。`npm run build` の後に `npm run test:seo` で実行する。
 *
 * ビルド自体も同じ検証（src/integrations/seoSitemap.ts）を通るが、こちらは
 * 出来上がった dist を後から確かめ直すためのもの。
 *
 * 環境変数 SEO_LIVE_BASE_URL を渡すと、sitemap の全URLを実際にHTTPで取得し、
 * すべて200であることも確かめる（例: Deploy Preview や `npm run preview` のURL）。
 *   SEO_LIVE_BASE_URL=https://deploy-preview-26--flex-railway-map.netlify.app npm run test:seo
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_URL } from '../../src/config/seo';
import { parseSitemapLocs, verifySeo, isNoindex, pageUrl } from '../../src/seo/sitemapCore';
import { readBuiltPages } from '../../src/integrations/seoSitemap';

const DIST = join(process.cwd(), 'dist');
const built = existsSync(join(DIST, 'sitemap.xml'));
const LIVE = process.env.SEO_LIVE_BASE_URL?.replace(/\/$/, '');

describe.skipIf(!built)('ビルド結果の SEO 検証（dist）', () => {
  const pages = built ? readBuiltPages(DIST) : [];
  const locs = built ? parseSitemapLocs(readFileSync(join(DIST, 'sitemap.xml'), 'utf8')) : [];

  it('sitemap・canonical・hreflang・title・H1 に問題が無い', () => {
    expect(verifySeo(pages, locs, SITE_URL)).toEqual([]);
  });

  it('noindex のページは sitemap に1つも無い', () => {
    const noindex = new Set(pages.filter(isNoindex).map(p => pageUrl(SITE_URL, p.path)));
    expect(locs.filter(l => noindex.has(l))).toEqual([]);
  });

  it('robots.txt が sitemap を指し、主要ページのクロールを妨げていない', () => {
    const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    const disallows = [...robots.matchAll(/^Disallow:\s*(\S*)/gm)].map(m => m[1]).filter(Boolean);
    const blocked = locs.filter(l => disallows.some(d => new URL(l).pathname.startsWith(d)));
    expect(blocked).toEqual([]);
  });

  it.skipIf(!LIVE)('sitemap の全URLが HTTP 200 を返す（SEO_LIVE_BASE_URL 指定時）', async () => {
    const failures: string[] = [];
    for (const loc of locs) {
      const url = loc.replace(SITE_URL, LIVE!);
      const res = await fetch(url, { redirect: 'manual' });
      if (res.status !== 200) failures.push(`${res.status} ${url}`);
    }
    expect(failures).toEqual([]);
  }, 120_000);
});
