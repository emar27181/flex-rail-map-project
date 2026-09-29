/**
 * 記事に載せる「実際の画面」のスクリーンショットを撮る（4言語分）。
 *
 * 記事の画像は作り物の図ではなく、このサイトを実際に操作した画面にする。
 * 撮るものは記事のデータ（src/data/articles/{slug}.ts の shots）に書く。地図の状態は URL
 * （mapDeepLink.ts の routes / from / to / metric / center / zoom / lang）で作るので、
 * 同じ手順で何度でも撮り直せる。地図や UI を変えたらこのスクリプトで撮り直すこと。
 *
 * 使い方（開発サーバーを起動した状態で）:
 *   npm run dev            # 別のターミナルで
 *   npx tsx scripts/capture-article-screenshots.mts [--only <slug>] [--id <shot>] [--base http://localhost:8080]
 *
 * 出力: public/images/articles/{slug}/{shot}-{lang}.webp（幅 1200px）
 * 撮影条件: 1000×640 表示・2倍密度・ライトテーマ・Cookie 同意済み・日本時間 8:30 固定
 * （時刻ラベルが撮るたびに変わらないように時計を固定する）
 */
import { chromium, type Page } from 'playwright';
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { buildMapHref } from '../src/utils/mapDeepLink';
import { translateUI, type Language } from '../src/utils/translation';
import { ARTICLE_SOURCES } from '../src/data/articles';
import type { ArticleMapState, ArticleShotSpec } from '../src/data/articles/types';
import { SEO_TEXT } from '../src/seo/pageText';

type Lang = 'ja' | 'en' | 'zh' | 'ko';
const LANGS: Lang[] = ['ja', 'en', 'zh', 'ko'];
const APP_LANG: Record<Lang, Language> = { ja: 'japanese', en: 'english', zh: 'chinese', ko: 'korean' };
const LOCALE: Record<Lang, string> = { ja: 'ja-JP', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR' };

interface Shot {
  slug: string;
  id: string;
  spec: ArticleShotSpec;
  maps: Record<string, ArticleMapState>;
}

/** 撮るものは記事のデータ（src/data/articles/{slug}.ts の shots）から読む。ここに書き足さない */
const SHOTS: Shot[] = ARTICLE_SOURCES.flatMap(a =>
  Object.entries(a.shots).map(([id, spec]) => ({ slug: a.slug, id, spec, maps: a.maps })),
);

function shotUrl(shot: Shot, lang: Lang): string {
  const { spec } = shot;
  if (spec.page) return lang === 'ja' ? spec.page : `/${lang}${spec.page}`;
  const map = typeof spec.map === 'string' ? shot.maps[spec.map] : spec.map;
  if (!map) throw new Error(`${shot.slug}/${shot.id}: map も page も無い`);
  return buildMapHref({ ...map, lang });
}

async function collapse(page: Page, lang: Lang) {
  for (const key of ['stationSelection', 'displayedRoutes']) {
    const text = translateUI(key, APP_LANG[lang]);
    const el = page.getByText(text, { exact: true }).first();
    if (await el.count()) await el.click({ timeout: 2000 }).catch(() => {});
  }
}

async function main() {
  const args = process.argv.slice(2);
  const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : undefined;
  const onlyId = args.includes('--id') ? args[args.indexOf('--id') + 1] : undefined;
  const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:8080';
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? '/opt/pw-browsers/chromium' });
  for (const shot of SHOTS.filter(s => (!only || s.slug === only) && (!onlyId || s.id === onlyId))) {
    for (const lang of LANGS) {
      const ctx = await browser.newContext({
        viewport: { width: 1000, height: 640 }, deviceScaleFactor: 2, locale: LOCALE[lang], timezoneId: 'Asia/Tokyo',
      });
      await ctx.clock.setFixedTime(new Date('2026-09-29T08:30:00+09:00'));
      await ctx.addInitScript(() => {
        localStorage.setItem('cookieConsent', JSON.stringify({ necessary: true, analytics: false, advertising: false }));
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        localStorage.setItem('theme', 'light');
        localStorage.setItem('frm-theme', 'light');
        // 開発サーバーが画面下に出すツールバー（Astro dev toolbar）は本番に無いので写さない
        document.addEventListener('DOMContentLoaded', () => {
          const style = document.createElement('style');
          style.textContent = 'astro-dev-toolbar{display:none!important}';
          document.head.appendChild(style);
        });
      });
      const page = await ctx.newPage();
      const url = shotUrl(shot, lang);
      await page.goto(base + url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2500);
      if (shot.spec.collapsePanels) await collapse(page, lang);
      for (const key of shot.spec.clickUi ?? []) {
        await page.getByText(translateUI(key, APP_LANG[lang]), { exact: true }).first().click({ timeout: 3000 }).catch(() => {});
      }
      if (shot.spec.scrollToHeading) {
        const heading = (SEO_TEXT[lang] as Record<string, unknown>)[shot.spec.scrollToHeading];
        if (typeof heading !== 'string') throw new Error(`${shot.slug}/${shot.id}: SEO_TEXT に ${shot.spec.scrollToHeading} が無い`);
        await page.getByRole('heading', { name: heading }).first()
          .evaluate(el => el.scrollIntoView({ block: 'start' })).catch(() => {});
      }
      await page.waitForTimeout(1200);
      const png = await page.screenshot();
      const dir = join('public/images/articles', shot.slug);
      mkdirSync(dir, { recursive: true });
      const out = join(dir, `${shot.id}-${lang}.webp`);
      await sharp(png).resize({ width: 1200 }).webp({ quality: 72 }).toFile(out);
      console.log(out);
      await ctx.close();
    }
  }
  await browser.close();
}

main();
