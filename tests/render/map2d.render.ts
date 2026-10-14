/**
 * 通常の地図（2D）が描けているか。
 */
import { test, expect } from '@playwright/test';
import { collectErrors } from './helpers';
import { pngStats } from './png';

test('出発・到着を指定して開くと、地図・路線・駅が描かれ、実行時エラーが無い', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=tokyo');
  const map = page.locator('.leaflet-container').first();
  await expect(map).toBeVisible();
  // 路線（SVG の線）と駅（マーカー）が描かれている
  await expect.poll(() => page.locator('.leaflet-container path').count(), { timeout: 15_000 }).toBeGreaterThan(5);
  await expect.poll(() => page.locator('.leaflet-marker-icon').count(), { timeout: 15_000 }).toBeGreaterThan(5);
  // 画面が一色ではない（下地だけ・真っ白で止まっていない）
  const stats = pngStats(await map.screenshot());
  expect(stats.distinctColors).toBeGreaterThan(20);
  expect(errors).toEqual([]);
});
