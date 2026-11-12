/**
 * 「現在地から」は、押した時点の位置を取り直してから最寄り駅を出発駅にする。
 * 最後の更新から時間が空いていれば取り直す（utils/freshLocation.ts）。ここでは配線（押す→出発駅が変わる）を確かめる。
 */
import { test, expect, collectErrors } from './helpers';

test('現在地から: 時間を空けて押すと、その時点の位置の最寄り駅になる', async ({ page, context }) => {
  const errors = collectErrors(page);
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 35.6896, longitude: 139.7006 }); // 新宿駅
  await page.goto('/');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();

  const button = page.getByRole('button', { name: '現在地から' });
  await expect(button).toBeEnabled({ timeout: 20_000 });
  await button.click();
  const departure = page.locator('input.station-input-filled').first();
  await expect(departure).toHaveValue('新宿');

  // 位置が動いた（東京駅）。押すと新しい位置の最寄り駅になる（古さの判断は freshLocation.test.ts で固定）
  await context.setGeolocation({ latitude: 35.6812, longitude: 139.7671 });
  await button.click();
  await expect(departure).toHaveValue('東京');
  expect(errors).toEqual([]);
});
