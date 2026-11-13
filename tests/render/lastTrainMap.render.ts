/** 終電モードは独立UIを使わず、既存駅・時刻欄 + モードボタンだけ。 */
import { test, expect, collectErrors } from './helpers';

test('終電モード切替時に余分なパネル・スライダー・駅選択欄を増やさない', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?experiment=last-train&to=shibuya');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect.poll(() => page.locator('.leaflet-container path').count(), { timeout: 20_000 }).toBeGreaterThan(5);
  const stations = page.locator('input.station-input-filled');
  await expect(stations).toHaveCount(2);
  const timeField = page.locator('input[type="time"]').first();
  await expect(timeField).toHaveValue(/^\d{2}:\d{2}$/);
  const toggle = page.getByRole('button', { name: '終電モード' });
  await expect(toggle).toBeEnabled();
  await toggle.click();

  await expect(stations).toHaveCount(2);
  await expect(page.locator('input[type="time"]')).toHaveCount(1);
  await expect(page.getByRole('slider', { name: '仮想現在時刻を変更' })).toHaveCount(0);
  await expect(page.getByText('終電到達ネットワーク')).toHaveCount(0);
  await expect(page.locator('#lt-inspected-station')).toHaveCount(0);
  await expect.poll(() => page.locator('.leaflet-marker-icon').count()).toBeGreaterThan(10);

  // 既存時刻欄を操作するだけで基準時刻が変わる。
  await timeField.fill('23:55');
  await expect(timeField).toHaveValue('23:55');
  await timeField.fill('01:30');
  await expect(timeField).toHaveValue('01:30');
  await toggle.click();
  await expect(timeField).toHaveValue('01:30');
  await expect(page.getByRole('slider', { name: '仮想現在時刻を変更' })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('到着駅未選択で押すと路線切替と共通のSnackbarで案内し、入力欄にはカーソルを移さない', async ({ page }) => {
  await page.goto('/?experiment=last-train');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  const toggle = page.getByRole('button', { name: '終電モード' });
  await expect(toggle).toBeEnabled();
  await toggle.click();
  await expect(page.locator('[data-snackbar]')).toHaveCount(1);
  await expect(page.locator('[data-snackbar]')).toContainText('終電モードを使用するには、到着駅を設定してください。');
  // 入力欄へカーソルは移らず、駅の候補も開かない（案内は下の帯だけ）
  await expect(page.locator('input.station-input-filled').nth(1)).not.toBeFocused();
  await expect(page.locator('[data-station-option]')).toHaveCount(0);
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('slider', { name: '仮想現在時刻を変更' })).toHaveCount(0);
});

test('固定3路線外の駅でも既存の終電モードボタンを押せる', async ({ page }) => {
  await page.goto('/?experiment=last-train&to=fujisawa');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  const toggle = page.getByRole('button', { name: '終電モード' });
  await expect(toggle).toBeEnabled();
  await toggle.click();
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect(page.getByRole('slider', { name: '仮想現在時刻を変更' })).toHaveCount(0);
});
