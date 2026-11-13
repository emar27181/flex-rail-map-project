/**
 * 「時刻を表示」ボタン: 駅名の下の時刻をボタン1つで出し入れできる。時刻の意味はモードで変わる
 * （通常は到着予定時刻、終電モードはその駅を出発できる最終時刻）ので、ボタン名は変えず、※の注記で説明する。
 * 終電モードでも駅の絞り込み（乗換駅のみ表示）が効き、既定で時刻が出る。
 */
import { test, expect, collectErrors } from './helpers';

const timeLabels = (page: import('@playwright/test').Page) =>
  page.locator('.leaflet-marker-icon', { hasText: /\d{2}:\d{2}/ });

test('時刻を表示: 駅名の下の時刻をボタンで切り替えられ、意味を※で説明する', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=tokyo');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();

  const button = page.getByRole('button', { name: '時刻を表示', exact: true });
  await expect(button).toBeVisible();
  // 既定は表示（押された状態）。意味（到着予定時刻）を※で小さく添える
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-time-label-note]')).toContainText('※');
  await expect(page.locator('[data-time-label-note]')).toContainText('到着予定時刻');
  await expect.poll(() => timeLabels(page).count(), { timeout: 20_000 }).toBeGreaterThan(0);

  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(timeLabels(page)).toHaveCount(0);
  await expect(page.locator('[data-time-label-note]')).toHaveCount(0);

  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => timeLabels(page).count()).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('時刻を表示: 出発駅・到着駅がそろうまではボタンを出さない', async ({ page }) => {
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect(page.getByRole('button', { name: '時刻を表示', exact: true })).toHaveCount(0);
});

test('終電モード: 「時刻を表示」は既定でオン。時刻は最終時刻で、※で意味と試作であることを説明する', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?to=shibuya');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  // 到着駅だけでは、ボタンはまだ出ない（出発駅が無い通常の画面）
  await expect(page.getByRole('button', { name: '時刻を表示', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: '終電モード（試作）' }).click();
  const button = page.getByRole('button', { name: '時刻を表示', exact: true });
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  // 駅名の下に最終時刻（* は架空の試験ダイヤ）が出る
  await expect.poll(() => page.locator('.leaflet-marker-icon', { hasText: /\d{2}:\d{2} \*/ }).count(), { timeout: 20_000 }).toBeGreaterThan(0);
  const note = page.locator('[data-time-label-note]');
  await expect(note).toContainText('最終時刻');
  await expect(note).toContainText('架空');

  await button.click();
  await expect(page.locator('.leaflet-marker-icon', { hasText: /\d{2}:\d{2} \*/ })).toHaveCount(0);
  await expect(note).toHaveCount(0);
  await button.click();
  await expect.poll(() => page.locator('.leaflet-marker-icon', { hasText: /\d{2}:\d{2} \*/ }).count()).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('終電モード: 乗換駅のみ表示が効き、戻すと元に戻る（到着駅は残る）', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?to=shibuya');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await page.getByRole('button', { name: '終電モード（試作）' }).click();
  const markers = page.locator('.leaflet-marker-icon');
  await expect.poll(() => markers.count(), { timeout: 20_000 }).toBeGreaterThan(20);
  const all = await markers.count();

  const transferOnly = page.getByRole('button', { name: '乗換駅のみ表示' });
  await transferOnly.click();
  await expect(transferOnly).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => markers.count()).toBeLessThan(all);
  // 到着駅（渋谷）は絞り込んでも残る
  await expect(page.locator('.leaflet-marker-icon', { hasText: '渋谷' }).first()).toBeVisible();

  await transferOnly.click();
  await expect.poll(() => markers.count()).toBe(all);
  expect(errors).toEqual([]);
});

test('終電モード: 意味のない操作（所要時間・集合駅）は押せず、理由を title で示す', async ({ page }) => {
  await page.goto('/?to=shibuya');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await page.getByRole('button', { name: '終電モード（試作）' }).click();
  for (const name of ['所要時間を表示', '集合駅を探す']) {
    const b = page.getByRole('button', { name });
    await expect(b).toBeDisabled();
    await expect(b).toHaveAttribute('title', '終電モードでは使えません');
  }
  // OFFで戻る
  await page.getByRole('button', { name: '終電モード（試作）' }).click();
  await expect(page.getByRole('button', { name: '所要時間を表示' })).toBeEnabled();
  await expect(page.getByRole('button', { name: '集合駅を探す' })).toBeEnabled();
});
