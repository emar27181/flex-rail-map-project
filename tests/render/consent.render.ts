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
    const res = await page.request.fetch(`${LOCAL}${url.pathname}${url.search}`);
    await route.fulfill({ response: res });
  });
}

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
});
