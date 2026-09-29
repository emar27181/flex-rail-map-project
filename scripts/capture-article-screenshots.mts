/**
 * 記事に載せる「実際の画面」のスクリーンショットを撮る（4言語分）。
 *
 * 記事の画像は作り物の図ではなく、このサイトを実際に操作した画面にする。
 * 地図の状態は URL（mapDeepLink.ts の routes / from / to / metric / lang）で作るので、
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
import type { RouteKey } from '../src/data/routes';
import type { StationStats } from '../src/data/stationStats';
import { SEO_TEXT } from '../src/seo/pageText';

type Lang = 'ja' | 'en' | 'zh' | 'ko';
const LANGS: Lang[] = ['ja', 'en', 'zh', 'ko'];
const APP_LANG: Record<Lang, Language> = { ja: 'japanese', en: 'english', zh: 'chinese', ko: 'korean' };
const LOCALE: Record<Lang, string> = { ja: 'ja-JP', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR' };

interface Shot {
  slug: string;
  id: string;
  /** 地図の状態 */
  map?: { routes?: RouteKey[]; from?: string; to?: string; metric?: keyof StationStats; center?: [number, number]; zoom?: number };
  /** 地図以外のページ（言語ごとのパス） */
  page?: Record<Lang, string>;
  /** 駅選択・路線切替のパネルを畳んで地図を広く見せる */
  collapsePanels?: boolean;
  /** 押すボタン（UI 文言のキー） */
  clickUi?: string[];
  /** ページ内で見せる要素（CSS セレクタ）までスクロール */
  scrollTo?: string;
  /** ページ内で見せる見出し（言語ごとの文言）までスクロール */
  scrollToHeading?: Record<Lang, string>;
}

/** 都心の主要15路線（「全部出ていると分かりにくい」ことを見せる） */
const CENTRAL: RouteKey[] = [
  'yamanote', 'chuo', 'keihinTohoku', 'jrSobuLine', 'ginzaLine', 'marunouchiLine', 'hibiyaLine', 'tozaiLine',
  'chiyodaLine', 'yurakuchoLine', 'hanzomonLine', 'nambokuLine', 'fukutoshinLine', 'toeiAsakusaLine', 'toeiOedoLine',
];

export const SHOTS: Shot[] = [
  { slug: 'flex-rail-map-introduction', id: 'all-lines', map: { routes: CENTRAL, center: [35.683, 139.745], zoom: 13 }, collapsePanels: true },
  { slug: 'flex-rail-map-introduction', id: 'route-only', map: { from: '新宿', to: '東京', center: [35.684, 139.735], zoom: 13 } },
  { slug: 'flex-rail-map-introduction', id: 'parallel', map: { from: '藤沢', to: '東京', center: [35.52, 139.6], zoom: 11 }, collapsePanels: true },

  { slug: 'tokyo-train-map-beginner', id: 'one-line', map: { routes: ['yamanote'], center: [35.69, 139.735], zoom: 12 }, collapsePanels: true },
  { slug: 'tokyo-train-map-beginner', id: 'three-lines', map: { routes: ['yamanote', 'chuo', 'marunouchiLine'], center: [35.69, 139.72], zoom: 12 }, collapsePanels: true },

  { slug: 'tokyo-sightseeing-routes', id: 'yamanote-ginza', map: { routes: ['yamanote', 'ginzaLine'], center: [35.69, 139.745], zoom: 12 }, collapsePanels: true },
  { slug: 'tokyo-sightseeing-routes', id: 'odaiba', map: { routes: ['yamanote', 'yurikamomeLine', 'rinkaiLine'], center: [35.645, 139.765], zoom: 13 }, collapsePanels: true },

  { slug: 'commute-30min-cheap-rent', id: 'from-work', map: { from: '東京', center: [35.68, 139.7], zoom: 11 } },
  { slug: 'commute-30min-cheap-rent', id: 'travel-times', map: { from: '東京', center: [35.68, 139.7], zoom: 11 }, clickUi: ['showTravelTimes'] },

  { slug: 'tokyo-safe-area-by-route', id: 'crime-heatmap', map: { routes: ['yamanote', 'chuo'], metric: 'crimeIndex', center: [35.69, 139.72], zoom: 12 }, collapsePanels: true },
  {
    slug: 'tokyo-safe-area-by-route', id: 'station-data',
    page: { ja: '/stations/shibuya', en: '/en/stations/shibuya', zh: '/zh/stations/shibuya', ko: '/ko/stations/shibuya' },
    scrollToHeading: { ja: SEO_TEXT.ja.aroundStats, en: SEO_TEXT.en.aroundStats, zh: SEO_TEXT.zh.aroundStats, ko: SEO_TEXT.ko.aroundStats },
  },

  { slug: 'tokyo-rent-by-route', id: 'from-shibuya', map: { from: '渋谷', center: [35.62, 139.67], zoom: 12 } },
  {
    slug: 'tokyo-rent-by-route', id: 'line-stations',
    page: { ja: '/lines/tokyu-toyoko-line', en: '/en/lines/tokyu-toyoko-line', zh: '/zh/lines/tokyu-toyoko-line', ko: '/ko/lines/tokyu-toyoko-line' },
    scrollToHeading: { ja: SEO_TEXT.ja.stationList, en: SEO_TEXT.en.stationList, zh: SEO_TEXT.zh.stationList, ko: SEO_TEXT.ko.stationList },
  },
];

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
      const url = shot.page ? shot.page[lang] : buildMapHref({ ...shot.map, lang });
      await page.goto(base + url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2500);
      if (shot.collapsePanels) await collapse(page, lang);
      for (const key of shot.clickUi ?? []) {
        await page.getByText(translateUI(key, APP_LANG[lang]), { exact: true }).first().click({ timeout: 3000 }).catch(() => {});
      }
      if (shot.scrollTo) await page.locator(shot.scrollTo).first().scrollIntoViewIfNeeded().catch(() => {});
      if (shot.scrollToHeading) {
        await page.getByRole('heading', { name: shot.scrollToHeading[lang] }).first()
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
