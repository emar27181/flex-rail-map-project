import { describe, it, expect } from 'vitest';
import {
  buildSitemapEntries, buildSitemapXml, extractPageSeo, isSitemapEligible, parseSitemapLocs, verifySeo, type PageSeo,
} from '../../../src/seo/sitemapCore';

const SITE = 'https://example.test';

/** テスト用のページHTML */
function html(opts: { canonical?: string; robots?: string; hreflang?: Array<[string, string]>; title?: string; h1?: number }) {
  const links = [
    opts.canonical ? `<link rel="canonical" href="${opts.canonical}" />` : '',
    ...(opts.hreflang ?? []).map(([l, h]) => `<link rel="alternate" hreflang="${l}" href="${h}" />`),
  ].join('');
  const robots = opts.robots ? `<meta name="robots" content="${opts.robots}" />` : '';
  const h1 = '<h1>見出し</h1>'.repeat(opts.h1 ?? 1);
  return `<html><head><title>${opts.title ?? 'T'}</title>${robots}${links}</head><body>${h1}</body></html>`;
}

const page = (path: string, o: Parameters<typeof html>[0]): PageSeo => extractPageSeo(path, html(o));

describe('ページのSEO要素の取り出し', () => {
  it('robots・canonical・hreflang・title・H1数を読む', () => {
    const p = page('/a', { canonical: `${SITE}/a`, robots: 'index, follow', hreflang: [['ja', `${SITE}/a`]], title: 'A', h1: 1 });
    expect(p).toMatchObject({ path: '/a', robots: 'index, follow', canonical: `${SITE}/a`, title: 'A', h1Count: 1 });
    expect(p.hreflang).toEqual([{ hreflang: 'ja', href: `${SITE}/a` }]);
  });
});

describe('sitemap に載せるページ', () => {
  it('noindex・canonical無し・他URLを指す canonical・クエリ付き canonical は載せない', () => {
    expect(isSitemapEligible(page('/a', { canonical: `${SITE}/a` }), SITE)).toBe(true);
    expect(isSitemapEligible(page('/a', { canonical: `${SITE}/a`, robots: 'noindex, follow' }), SITE)).toBe(false);
    expect(isSitemapEligible(page('/a', {}), SITE)).toBe(false);
    expect(isSitemapEligible(page('/a', { canonical: `${SITE}/` }), SITE)).toBe(false);
    expect(isSitemapEligible(page('/a', { canonical: `${SITE}/a?lang=en` }), SITE)).toBe(false);
  });

  it('生成した sitemap には対象ページだけが1回ずつ、lastmod と hreflang 付きで入る', () => {
    const pages = [
      page('/', { canonical: `${SITE}/`, title: 'Top' }),
      page('/b', { canonical: `${SITE}/b`, title: 'B', hreflang: [['ja', `${SITE}/b`], ['en', `${SITE}/en/b`]] }),
      page('/en/b', { canonical: `${SITE}/en/b`, title: 'B en', hreflang: [['ja', `${SITE}/b`], ['en', `${SITE}/en/b`]] }),
      page('/demo', { robots: 'noindex' }),
    ];
    const entries = buildSitemapEntries(pages, SITE, p => (p === '/b' ? '2026-01-02' : undefined));
    const xml = buildSitemapXml(entries);
    expect(parseSitemapLocs(xml)).toEqual([`${SITE}/`, `${SITE}/b`, `${SITE}/en/b`]);
    expect(xml).toContain('<lastmod>2026-01-02</lastmod>');
    expect(xml).toContain('hreflang="en" href="https://example.test/en/b"');
    expect(verifySeo(pages, parseSitemapLocs(xml), SITE)).toEqual([]);
  });
});

describe('SEO 検証が問題を見つける', () => {
  const ok = page('/a', { canonical: `${SITE}/a`, title: 'A' });

  it('sitemap のURLに対応するページが無い（404）', () => {
    expect(verifySeo([ok], [`${SITE}/a`, `${SITE}/missing`], SITE).join()).toContain('対応するページが無い');
  });

  it('noindex のページが sitemap にある', () => {
    const p = page('/n', { canonical: `${SITE}/n`, robots: 'noindex', title: 'N' });
    expect(verifySeo([ok, p], [`${SITE}/a`, `${SITE}/n`], SITE).join()).toContain('noindex のページが sitemap にある');
  });

  it('canonical が sitemap のURLと違う', () => {
    const p = page('/c', { canonical: `${SITE}/other`, title: 'C' });
    expect(verifySeo([ok, p], [`${SITE}/a`, `${SITE}/c`], SITE).join()).toContain('canonical が sitemap のURLと違う');
  });

  it('sitemap に重複URL', () => {
    expect(verifySeo([ok], [`${SITE}/a`, `${SITE}/a`], SITE).join()).toContain('重複URL');
  });

  it('index 対象なのに sitemap に無い', () => {
    expect(verifySeo([ok], [], SITE).join()).toContain('sitemap に無い');
  });

  it('hreflang が相互になっていない（日本語→英語だけ張って、英語から張り返していない）', () => {
    const ja = page('/b', { canonical: `${SITE}/b`, title: 'B', hreflang: [['ja', `${SITE}/b`], ['en', `${SITE}/en/b`]] });
    const en = page('/en/b', { canonical: `${SITE}/en/b`, title: 'B en' });
    expect(verifySeo([ja, en], [`${SITE}/b`, `${SITE}/en/b`], SITE).join()).toContain('相互になっていない');
  });

  it('hreflang の相手がクエリ付きURL（?lang=）', () => {
    const p = page('/a', { canonical: `${SITE}/a`, title: 'A', hreflang: [['ja', `${SITE}/a`], ['en', `${SITE}/a?lang=en`]] });
    expect(verifySeo([p], [`${SITE}/a`], SITE).join()).toContain('クエリ付きURL');
  });

  it('title の重複と H1 の数', () => {
    const a = page('/a', { canonical: `${SITE}/a`, title: 'Same', h1: 0 });
    const b = page('/b', { canonical: `${SITE}/b`, title: 'Same', h1: 2 });
    const errs = verifySeo([a, b], [`${SITE}/a`, `${SITE}/b`], SITE).join('\n');
    expect(errs).toContain('title が重複');
    expect(errs).toContain('H1 が0個');
    expect(errs).toContain('H1 が2個');
  });
});
