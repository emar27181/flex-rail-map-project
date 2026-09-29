/**
 * sitemap.xml の自動生成と、SEO の整合性検証（ビルド後のHTMLが入力）。
 *
 * 以前は public/sitemap.xml を手で書いていて、ページを足すたびに書き忘れや
 * 古い情報（?lang= の hreflang、更新されない lastmod）が残った。
 * ビルドで出来上がった全HTMLを読み、次の条件を満たすページだけを載せる:
 *   - robots に noindex が無い
 *   - canonical があり、それが自分自身のURL（クエリ無し）
 * 新しいガイド・記事・英語ページを足せば、何もしなくても載る。
 *
 * ここはファイルアクセスをしない純粋な関数だけにして、テストで確かめられるようにする。
 * ファイルの読み書き・git は src/integrations/seoSitemap.ts が行う。
 */

export interface PageSeo {
  /** サイト内パス（"/", "/about", "/guides/x"）。末尾スラッシュ無し */
  path: string;
  robots?: string;
  canonical?: string;
  hreflang: Array<{ hreflang: string; href: string }>;
  title?: string;
  h1Count: number;
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  alternates: Array<{ hreflang: string; href: string }>;
}

const attr = (tag: string, name: string): string | undefined =>
  tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

/** ビルド後のHTMLから SEO に関わる要素を取り出す */
export function extractPageSeo(path: string, html: string): PageSeo {
  const head = html.split(/<\/head>/i)[0] ?? html;
  const metaTags = head.match(/<meta\b[^>]*>/gi) ?? [];
  const linkTags = head.match(/<link\b[^>]*>/gi) ?? [];
  const robotsTag = metaTags.find(t => attr(t, 'name') === 'robots');
  const canonicalTag = linkTags.find(t => attr(t, 'rel') === 'canonical');
  const hreflang = linkTags
    .filter(t => attr(t, 'rel') === 'alternate' && attr(t, 'hreflang'))
    .map(t => ({ hreflang: attr(t, 'hreflang')!, href: attr(t, 'href') ?? '' }));
  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  return {
    path,
    robots: robotsTag ? attr(robotsTag, 'content') : undefined,
    canonical: canonicalTag ? attr(canonicalTag, 'href') : undefined,
    hreflang,
    title,
    h1Count,
  };
}

export const isNoindex = (p: PageSeo): boolean => /\bnoindex\b/i.test(p.robots ?? '');

/** sitemap に載せてよいページか（noindex でない・自己参照 canonical・クエリ無し） */
export function isSitemapEligible(p: PageSeo, siteUrl: string): boolean {
  if (isNoindex(p)) return false;
  if (!p.canonical) return false;
  if (p.canonical.includes('?') || p.canonical.includes('#')) return false;
  return p.canonical === pageUrl(siteUrl, p.path);
}

/** パスから公開URL（canonical と同じ形: ルートは末尾スラッシュ、それ以外は無し） */
export function pageUrl(siteUrl: string, path: string): string {
  return path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`;
}

export function buildSitemapEntries(
  pages: PageSeo[],
  siteUrl: string,
  lastmodOf: (path: string) => string | undefined,
): SitemapEntry[] {
  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];
  for (const p of [...pages].sort((a, b) => a.path.localeCompare(b.path))) {
    if (!isSitemapEligible(p, siteUrl)) continue;
    const loc = p.canonical!;
    if (seen.has(loc)) continue;
    seen.add(loc);
    entries.push({ loc, lastmod: lastmodOf(p.path), alternates: p.hreflang });
  }
  return entries;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const hasAlternates = entries.some(e => e.alternates.length > 0);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- ビルド時に自動生成（src/integrations/seoSitemap.ts）。手で編集しないこと -->',
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${hasAlternates ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' : ''}>`,
  ];
  for (const e of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${esc(e.loc)}</loc>`);
    if (e.lastmod) lines.push(`    <lastmod>${esc(e.lastmod)}</lastmod>`);
    for (const a of e.alternates) {
      lines.push(`    <xhtml:link rel="alternate" hreflang="${esc(a.hreflang)}" href="${esc(a.href)}"/>`);
    }
    lines.push('  </url>');
  }
  lines.push('</urlset>', '');
  return lines.join('\n');
}

/** sitemap.xml の <loc> を読む（検証・テスト用） */
export function parseSitemapLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
}

/**
 * SEO の整合性を検証する。問題が無ければ空配列。
 *
 * 1. sitemap のURLはすべて実在するページ（ビルド結果にHTMLがある = 静的配信で200）
 * 2. noindex のページが sitemap に無い
 * 3. sitemap のURLとそのページの canonical が一致する
 * 4. sitemap に重複URL・クエリ付きURLが無い
 * 5. hreflang の相手は sitemap に載っているページで、相手からも自分へ張り返している
 *    （x-default 以外）。自分自身も hreflang に含まれている
 * 6. index 対象のページは title がありページ間で重複せず、H1 がちょうど1つ
 */
export function verifySeo(pages: PageSeo[], sitemapLocs: string[], siteUrl: string): string[] {
  const errors: string[] = [];
  const byUrl = new Map(pages.map(p => [pageUrl(siteUrl, p.path), p]));

  const seen = new Set<string>();
  for (const loc of sitemapLocs) {
    if (seen.has(loc)) errors.push(`sitemap に重複URL: ${loc}`);
    seen.add(loc);
    if (loc.includes('?')) errors.push(`sitemap にクエリ付きURL: ${loc}`);
    const page = byUrl.get(loc);
    if (!page) { errors.push(`sitemap のURLに対応するページが無い（404になる）: ${loc}`); continue; }
    if (isNoindex(page)) errors.push(`noindex のページが sitemap にある: ${loc}`);
    if (page.canonical !== loc) errors.push(`canonical が sitemap のURLと違う: ${loc}（canonical: ${page.canonical ?? 'なし'}）`);
  }

  const inSitemap = new Set(sitemapLocs);
  const indexable = pages.filter(p => isSitemapEligible(p, siteUrl));
  for (const p of indexable) {
    const self = pageUrl(siteUrl, p.path);
    if (!inSitemap.has(self)) errors.push(`index 対象なのに sitemap に無い: ${self}`);
  }

  for (const p of indexable) {
    const self = pageUrl(siteUrl, p.path);
    const langLinks = p.hreflang.filter(h => h.hreflang !== 'x-default');
    if (p.hreflang.length === 0) continue;
    if (!langLinks.some(h => h.href === self)) errors.push(`hreflang に自分自身が無い: ${self}`);
    for (const h of p.hreflang) {
      if (h.href.includes('?')) errors.push(`hreflang の相手がクエリ付きURL: ${self} → ${h.href}`);
      if (!inSitemap.has(h.href)) { errors.push(`hreflang の相手が sitemap に無い: ${self} → ${h.href}`); continue; }
      if (h.hreflang === 'x-default' || h.href === self) continue;
      const other = byUrl.get(h.href);
      if (!other?.hreflang.some(back => back.href === self)) {
        errors.push(`hreflang が相互になっていない: ${self} → ${h.href}（相手から張り返していない）`);
      }
    }
  }

  const titles = new Map<string, string>();
  for (const p of indexable) {
    const self = pageUrl(siteUrl, p.path);
    if (!p.title) errors.push(`title が無い: ${self}`);
    else if (titles.has(p.title)) errors.push(`title が重複: ${self} と ${titles.get(p.title)}`);
    else titles.set(p.title, self);
    if (p.h1Count !== 1) errors.push(`H1 が${p.h1Count}個（1つにする）: ${self}`);
  }
  return errors;
}
