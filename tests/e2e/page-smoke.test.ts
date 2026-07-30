/**
 * 全ページスモークテスト
 *
 * 背景:
 * - 本番環境（Netlify）で "Page not found" が表示される事故が発生
 * - コード側のビルドは正常でも、デプロイ設定やページ側の実行時エラーで
 *   本番だけ壊れるケースを早期に検知したい
 *
 * テスト内容:
 * - 全静的ページが 200 で返り、Netlifyの404文言や React ErrorBoundary の
 *   エラー表示が出ていないことを確認する
 */

import { test, expect } from '@playwright/test';

const STATIC_PAGES = [
  '/',
  '/about/',
  '/contact/',
  '/demo/',
  '/diagram/',
  '/faq/',
  '/fullscreen/',
  '/privacy/',
  '/terms/',
  '/articles/',
  '/articles/commute-30min-cheap-rent/',
  '/articles/flex-rail-map-introduction/',
  '/articles/tokyo-rent-by-route/',
  '/articles/tokyo-safe-area-by-route/',
  '/articles/tokyo-sightseeing-routes/',
  '/articles/tokyo-train-map-beginner/',
];

// Netlifyのデフォルト404ページやReact ErrorBoundaryが表示する文言
const ERROR_INDICATORS = [
  'Page not found',
  'ページが見つかりません',
];

for (const path of STATIC_PAGES) {
  test(`${path} が200で表示され、404/エラー表示が出ない`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });

    expect(response, `${path} へのリクエストがレスポンスを返さなかった`).not.toBeNull();
    expect(response!.ok(), `${path} が ${response!.status()} を返した`).toBe(true);

    // <title> が空でないこと（Astroの各ページは必ずtitleを設定している）
    const title = await page.title();
    expect(title.trim().length, `${path} のtitleが空`).toBeGreaterThan(0);

    // 404/エラー文言が本文に含まれていないこと
    const bodyText = await page.locator('body').innerText();
    for (const indicator of ERROR_INDICATORS) {
      expect(bodyText, `${path} に "${indicator}" が含まれている`).not.toContain(indicator);
    }
  });
}

test('存在しないパスはNetlifyの404扱いになる（ステータス確認）', async ({ page }) => {
  const response = await page.goto('/this-path-should-not-exist-xyz/', {
    waitUntil: 'domcontentloaded',
  });
  expect(response).not.toBeNull();
  // astro devサーバー/Netlify双方とも存在しないパスは 404 を返すべき
  expect(response!.status()).toBe(404);
});
