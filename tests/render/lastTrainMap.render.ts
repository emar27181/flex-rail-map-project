/** 既存の駅検索UIから終電モードをONにしたときだけ既存のLeafletレイヤーに絞り込む。 */
import { test, expect, collectErrors } from './helpers';

test('到着駅・現在時刻・終電モードボタンは通常のUIと共通', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?experiment=last-train&to=shibuya');
  const map = page.locator('.leaflet-container').first();
  await expect(map).toBeVisible();
  await expect.poll(() => page.locator('.leaflet-container path').count(), { timeout: 20_000 }).toBeGreaterThan(5);
  await expect(page.locator('input.station-input-filled')).toHaveCount(2);

  // 初期値は現在時刻。試作ボタンを押すまでは通常地図を描画する。
  const timeInput = page.locator('input[type="time"]').first();
  await expect(timeInput).toHaveValue(/^\d{2}:\d{2}$/);
  const currentTime = await timeInput.inputValue();
  await expect(page.getByText('実際の終電検索には使えません。')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '終電モード' })).toBeEnabled();
  await page.getByRole('button', { name: '終電モード' }).click();

  // 同じLeaflet/StationSelectorを保ち、モードON時だけ架空の終電をフィルタ。
  await expect(page.getByText('実際の終電検索には使えません。')).toBeVisible();
  await expect(page.getByText('終電到達ネットワーク')).toBeVisible();
  await expect(page.locator('input.station-input-filled')).toHaveCount(2);
  const slider = page.getByRole('slider', { name: '仮想現在時刻を変更' });
  await expect(slider).toBeVisible();
  const minute = Number(currentTime.slice(0, 2)) * 60 + Number(currentTime.slice(3, 5));
  await expect(slider).toHaveValue(String(minute < 300 ? minute + 1440 : minute));
  await expect.poll(() => page.locator('.leaflet-marker-icon').count()).toBeGreaterThan(10);

  await slider.focus();
  await slider.press('End');
  await expect(timeInput).toHaveValue('01:30');
  await expect(slider).toHaveValue('1530');
  await page.getByRole('button', { name: '終電モード' }).click();
  await expect(slider).toHaveCount(0);
  await expect(page.getByText('実際の終電検索には使えません。')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('到着駅が未指定の場合、終電モードを押せない', async ({ page }) => {
  await page.goto('/?experiment=last-train');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect(page.locator('input[type="time"]').first()).toHaveValue(/^\d{2}:\d{2}$/);
  await expect(page.getByRole('button', { name: '終電モード' })).toBeDisabled();
});
