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
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
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

  /** dist の全 HTML（パスと中身）。内部リンク・description の検査に使う */
  const htmlFiles = (() => {
    const out: Array<{ path: string; html: string }> = [];
    if (!built) return out;
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const abs = join(dir, name);
        if (statSync(abs).isDirectory()) { if (name !== '_astro') walk(abs); }
        else if (name === 'index.html') out.push({ path: abs.slice(DIST.length).replace(/\/index\.html$/, '') || '/', html: readFileSync(abs, 'utf8') });
      }
    };
    walk(DIST);
    return out;
  })();
  const description = (html: string) => html.split(/<\/head>/i)[0].match(/<meta name="description" content="([^"]*)"/)?.[1];

  it('サイト内のリンク（<a href="/...">）の行き先がすべて dist にある（リンク切れが無い）', () => {
    const exists = (pathname: string) => {
      const p = decodeURIComponent(pathname).replace(/\/$/, '');
      return existsSync(join(DIST, p, 'index.html')) || existsSync(join(DIST, p)) || p === '';
    };
    const broken = new Set<string>();
    for (const f of htmlFiles) {
      for (const m of f.html.matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)[^"]*"/g)) {
        if (m[1].startsWith('//')) continue;
        if (!exists(m[1])) broken.add(`${f.path} → ${m[1]}`);
      }
    }
    expect([...broken]).toEqual([]);
  });

  it('sitemap に載せるページはすべて description があり、互いに重複していない', () => {
    const indexed = new Set(locs);
    const byDesc = new Map<string, string[]>();
    const missing: string[] = [];
    for (const f of htmlFiles) {
      if (!indexed.has(pageUrl(SITE_URL, f.path))) continue;
      const d = description(f.html);
      if (!d) { missing.push(f.path); continue; }
      byDesc.set(d, [...(byDesc.get(d) ?? []), f.path]);
    }
    expect(missing).toEqual([]);
    expect([...byDesc.values()].filter(ps => ps.length > 1)).toEqual([]);
  });

  it('og:image・埋め込み地図の画像（/og/...）が dist にある（壊れた画像を検索結果・ページに出さない）', () => {
    const broken = new Set<string>();
    for (const f of htmlFiles) {
      const refs = [
        ...[...f.html.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="([^"]+)"/g)].map(m => m[1].replace(SITE_URL, '')),
        ...[...f.html.matchAll(/<img class="map-embed-poster" src="([^"]+)"/g)].map(m => m[1]),
      ];
      for (const r of refs) if (r.startsWith('/') && !existsSync(join(DIST, r))) broken.add(`${f.path} → ${r}`);
    }
    expect([...broken]).toEqual([]);
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
