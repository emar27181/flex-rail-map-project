/**
 * 線形（実際の線路の形）を、表示設定と旧プレビューURLの両方から開ける。
 * 通常の画面（パラメータなし）は今までどおり駅と駅を直線で結ぶ。
 */
import { test, expect, collectErrors, modeTag } from './helpers';
import type { Page } from '@playwright/test';
import { getRouteCode } from '../../src/utils/routeUrlCodes';

/** 地図に描かれた線（SVG path）の頂点の数の合計。直線は駅の数、線形ありは駅の間にも点が入るので増える */
async function vertexCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    let n = 0;
    document.querySelectorAll('.leaflet-overlay-pane path').forEach(p => {
      const d = p.getAttribute('d') ?? '';
      n += (d.match(/[ML]/g) ?? []).length;
    });
    return n;
  });
}

const URL = '/?from=shinjuku&to=tokyo&routes=chuo';
const TOKAIDO_URL = `/?lang=ja&routes=${getRouteCode('jrTokaidoMainLine')}`;
const MODE = '実際の線路の形';

test('表示設定で東海道線の線形を切り替え、収録率と出典を確認できる', async ({ page }) => {
  await page.goto(TOKAIDO_URL);
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect.poll(() => vertexCount(page)).toBeGreaterThan(5);
  const plain = await vertexCount(page);

  const options = await modeTag(page, 'ほかの表示モード');
  await options.click();
  const trackMode = page.getByRole('button', { name: MODE, exact: true }).first();
  await trackMode.click();
  await expect(trackMode).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/view=track-geometry/);
  await expect(page.getByRole('status').filter({ hasText: '選択中の路線' })).toContainText(/1\/1路線.*20\/20区間/);
  await expect(page.getByRole('status').filter({ hasText: '選択中の路線' })).toContainText('全国');
  await expect(page.locator('.leaflet-control-attribution').getByRole('link', { name: 'OpenStreetMap' })).toBeVisible();
  await expect.poll(() => vertexCount(page)).toBeGreaterThan(plain);

  await trackMode.click();
  await expect(trackMode).toHaveAttribute('aria-pressed', 'false');
  await expect(page).not.toHaveURL(/view=track-geometry/);
  await expect(page.getByRole('status').filter({ hasText: '選択中の路線' })).toHaveCount(0);
});

test('線形の試作: パラメータがあるときだけ、線の頂点が増える（線路の形で描く）', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(URL);
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect.poll(() => vertexCount(page), { timeout: 20_000 }).toBeGreaterThan(5);
  const plain = await vertexCount(page);

  await page.goto(`${URL}&experiment=track-geometry`);
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  // 試作データを読み込んだあと、線の頂点が直線のときより増える
  await expect.poll(() => vertexCount(page), { timeout: 20_000 }).toBeGreaterThan(plain * 1.3);
  expect(errors).toEqual([]);
});

test('線形の試作: 既存の形状ファイルが読めなくても地図が描ける', async ({ page }) => {
  await page.route('**/data/track-geometry-prototype.json', route => route.fulfill({ status: 404, body: '' }));
  await page.goto(`${URL}&experiment=track-geometry`);
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect.poll(() => vertexCount(page), { timeout: 20_000 }).toBeGreaterThan(5);
});
