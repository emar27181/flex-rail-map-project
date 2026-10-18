/**
 * 記事・駅/路線ページの Cookie の確認と、GA4 の計測の始まり方（components/consent/staticConsentBanner.ts,
 * GA4Loader.astro の consentBanner）。
 *
 * 確認と計測は本番のサイトでしか動かない。本番の URL への通信を手元のビルド（astro preview）に振り向けて、
 * 本番と同じ条件で確かめる。GA4 の外部スクリプトは読み込まず、送る予定の命令（dataLayer）を見る。
 */
import type { Page } from '@playwright/test';
import { test, expect } from './helpers';
import { PRODUCTION_ORIGIN } from '../../src/utils/siteHost';

const LOCAL = 'http://127.0.0.1:4321';

/** 本番の URL への通信を手元のビルドに振り向ける（ほかの外部への通信は helpers の test が止めたまま） */
async function serveProductionFromLocal(page: Page) {
  await page.route(`${PRODUCTION_ORIGIN}/**`, async route => {
    const url = new URL(route.request().url());
    try {
      const res = await page.request.fetch(`${LOCAL}${url.pathname}${url.search}`);
      await route.fulfill({ response: res });
    } catch {
      // テストが終わってページを閉じた後に、埋め込みの地図などの読み込みが残っていることがある（2026-10-16: これで落ちていた）
      await route.abort().catch(() => {});
    }
  });
}

// 終わったページに振り向けが残っていると、閉じるときに失敗する
test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});

/** GA4 に送る予定の命令のうち、閲覧の送信を始める config の数 */
const configCount = (page: Page) =>
  page.evaluate(() => ((window as unknown as { dataLayer?: IArguments[] }).dataLayer ?? [])
    .filter(a => a[0] === 'config').length);

test('本番の記事では Cookie の確認が出て、答えるまで GA4 の計測を始めない。許可すると1回だけ始まり、次からは聞かない', async ({ page }) => {
  await serveProductionFromLocal(page);
  await page.goto(`${PRODUCTION_ORIGIN}/en/articles/sapporo-namboku-line-map`);
  await page.waitForLoadState('load');

  const banner = page.locator('#flex-consent');
  await expect(banner).toBeVisible();
  await expect(banner.getByRole('button', { name: 'Accept All' })).toBeVisible();
  await expect(banner.getByRole('button', { name: 'Essential Only' })).toBeVisible();
  // 答える前は閲覧を送らない
  expect(await configCount(page)).toBe(0);

  await banner.getByRole('button', { name: 'Accept All' }).click();
  await expect(banner).toHaveCount(0);
  expect(await configCount(page)).toBe(1);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('cookieConsent') || 'null'));
  expect(saved).toEqual({ necessary: true, analytics: true, advertising: true });

  // 次のページでは聞かず、すぐ計測を始める（地図のバナーと同じ保存先）
  await page.goto(`${PRODUCTION_ORIGIN}/en/articles/how-to-read-station-numbers`);
  await page.waitForLoadState('load');
  await expect(page.locator('#flex-consent')).toHaveCount(0);
  expect(await configCount(page)).toBe(1);
});

test('「必要なもののみ」を選ぶと、Cookie を使わない形で閲覧を1回だけ送り、答えを残す', async ({ page }) => {
  await serveProductionFromLocal(page);
  await page.goto(`${PRODUCTION_ORIGIN}/lines/chiyoda-line`);
  await page.waitForLoadState('load');
  const banner = page.locator('#flex-consent');
  await expect(banner).toBeVisible();
  await banner.getByRole('button', { name: '必要なもののみ' }).click();
  await expect(banner).toHaveCount(0);
  expect(await configCount(page)).toBe(1);
  const consent = await page.evaluate(() => ((window as unknown as { dataLayer: IArguments[] }).dataLayer)
    .filter(a => a[0] === 'consent').map(a => [a[1], a[2]?.analytics_storage]));
  expect(consent.at(-1)).toEqual(['update', 'denied']);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('cookieConsent') || 'null')?.analytics)).toBe(false);
});

test('プレビュー・手元では Cookie の確認を出さない', async ({ page }) => {
  await page.goto('/en/articles/sapporo-namboku-line-map');
  await page.waitForLoadState('load');
  await expect(page.locator('#flex-consent')).toHaveCount(0);
  expect(await configCount(page)).toBe(0);
});

test('比較記事で地図を動かせる。操作は親記事で1回計測し、埋め込みは閲覧を送らない', async ({ page }, testInfo) => {
  await serveProductionFromLocal(page);
  await page.goto(`${PRODUCTION_ORIGIN}/articles/ueno-keisei-ueno-difference`);
  await page.locator('#flex-consent').getByRole('button', { name: 'すべて同意' }).click();
  const demo = page.locator('figure[data-demo-id]').first();
  await demo.scrollIntoViewIfNeeded();
  const frame = page.frameLocator('figure[data-demo-id] iframe').first();
  const map = frame.locator('.leaflet-container');
  await expect(map).toBeVisible();
  await expect(frame.locator('.app-loading')).toBeHidden({ timeout: 30000 });
  await expect(frame.getByText('京成上野', { exact: true }).first()).toBeVisible();
  expect(await map.evaluate(() => (window as unknown as { gtag?: unknown }).gtag === undefined)).toBe(true);

  const pane = frame.locator('.leaflet-map-pane');
  const before = await pane.getAttribute('style');
  await map.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => pane.getAttribute('style')).not.toBe(before);
  await page.keyboard.press('ArrowLeft');
  const interactions = () => page.evaluate(() => ((window as unknown as { dataLayer: IArguments[] }).dataLayer)
    .filter(a => a[0] === 'event' && a[1] === 'article_demo_interact').map(a => a[2]));
  await expect.poll(interactions).toEqual([{ article: 'ueno-keisei-ueno-difference', locale: 'ja', demo_id: 'ueno-keisei-ueno-difference/main' }]);
  expect(await configCount(page)).toBe(1);
  await demo.screenshot({ path: testInfo.outputPath('ueno-comparison.png') });

  // 遷移直前のイベントを残す。外部の Google へは送信しない。
  await page.evaluate(() => {
    const w = window as unknown as { gtag: (...args: unknown[]) => void };
    const original = w.gtag;
    w.gtag = (...args) => { sessionStorage.setItem('last-ga-command', JSON.stringify(args)); original(...args); };
  });
  const href = await demo.locator('[data-me-open]').getAttribute('href');
  await demo.locator('[data-me-open]').click();
  await page.waitForURL(url => url.pathname === '/');
  expect(new URL(page.url()).searchParams.get('embed')).toBeNull();
  expect(new URL(page.url()).searchParams.get('routes')).toBe(new URL(href!, PRODUCTION_ORIGIN).searchParams.get('routes'));
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('last-ga-command')!))).toEqual([
    'event', 'article_map_open', { article: 'ueno-keisei-ueno-difference', locale: 'ja', demo_id: 'ueno-keisei-ueno-difference/main', source: 'demo' },
  ]);
  await expect(page.locator('.leaflet-container')).toBeVisible();
  await expect(page.locator('.app-loading')).toBeHidden({ timeout: 30000 });
  await page.getByText('上野', { exact: true }).first().click();
  await page.getByRole('button', { name: '出発駅に設定', exact: true }).click();
  await page.getByText('鶯谷', { exact: true }).first().click();
  await page.getByRole('button', { name: '到着駅に設定', exact: true }).click();
  const searches = () => page.evaluate(() => ((window as unknown as { dataLayer: IArguments[] }).dataLayer)
    .filter(a => a[0] === 'event' && a[1] === 'map_route_search').map(a => a[2]));
  await expect.poll(searches).toEqual([expect.objectContaining({
    from_station: '上野', to_station: '鶯谷', result_count: expect.any(Number),
  })]);
  expect((await searches())[0].result_count).toBeGreaterThan(0);
});
