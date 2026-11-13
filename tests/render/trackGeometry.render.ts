/**
 * 線形（実際の線路の形）の試作: ?experiment=track-geometry のときだけ、駅の間を線路の形で描く。
 * 通常の画面（パラメータなし）は今までどおり駅と駅を直線で結ぶ。
 */
import { test, expect, collectErrors } from './helpers';
import type { Page } from '@playwright/test';

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

test('線形の試作: 試作データが読めなくても今までどおり描ける（直線のまま）', async ({ page }) => {
  await page.route('**/data/track-geometry-prototype.json', route => route.fulfill({ status: 404, body: '' }));
  await page.goto(`${URL}&experiment=track-geometry`);
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect.poll(() => vertexCount(page), { timeout: 20_000 }).toBeGreaterThan(5);
});
