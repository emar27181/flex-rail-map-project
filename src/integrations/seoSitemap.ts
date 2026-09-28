/**
 * ビルド後に sitemap.xml を自動生成し、SEO の整合性を検証する Astro インテグレーション。
 *
 * - 出来上がった dist の全HTMLを読み、index 対象（noindex でない・自己参照 canonical）
 *   のページだけを sitemap に載せる（src/seo/sitemapCore.ts）
 * - lastmod は git の履歴から（src/seo/gitLastModified.ts）。確かめられない日付は書かない
 * - 検証（sitemap のURLが実在する・noindex が無い・canonical 一致・重複なし・
 *   hreflang が相互・title 重複なし・H1 が1つ）に失敗したらビルドを止める
 *
 * public/sitemap.xml（手書き）は廃止した。手で編集しないこと。
 */
import type { AstroIntegration } from 'astro';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from '../config/seo';
import { buildSitemapEntries, buildSitemapXml, extractPageSeo, parseSitemapLocs, verifySeo, type PageSeo } from '../seo/sitemapCore';
import { createLastModified } from '../seo/gitLastModified';

/** dist 以下の HTML を読み、PageSeo の一覧にする */
export function readBuiltPages(distDir: string): PageSeo[] {
  const pages: PageSeo[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name);
      if (statSync(abs).isDirectory()) {
        if (name !== '_astro') walk(abs);
      } else if (name === 'index.html') {
        const rel = abs.slice(distDir.length).replace(/\\/g, '/').replace(/\/?index\.html$/, '');
        const path = rel === '' ? '/' : (rel.startsWith('/') ? rel : `/${rel}`);
        pages.push(extractPageSeo(path, readFileSync(abs, 'utf8')));
      }
    }
  };
  walk(distDir);
  return pages;
}

export default function seoSitemap(): AstroIntegration {
  return {
    name: 'flex-seo-sitemap',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const distDir = fileURLToPath(dir).replace(/\/$/, '');
        const root = process.cwd();
        const pages = readBuiltPages(distDir);
        const lastmod = createLastModified(root);
        const entries = buildSitemapEntries(pages, SITE_URL, lastmod);
        const xml = buildSitemapXml(entries);
        writeFileSync(join(distDir, 'sitemap.xml'), xml);

        const errors = verifySeo(pages, parseSitemapLocs(xml), SITE_URL);
        const withLastmod = entries.filter(e => e.lastmod).length;
        logger.info(`sitemap.xml: ${entries.length} URL（lastmod あり ${withLastmod}）/ 全 ${pages.length} ページ`);
        if (errors.length > 0) {
          for (const e of errors) logger.error(e);
          throw new Error(`SEO 検証に失敗しました（${errors.length}件）。上のエラーを直してください`);
        }
      },
    },
  };
}
