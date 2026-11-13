/**
 * 「到着予定時刻を表示」ボタン: 経路上の各駅の名前の下の時刻を、ボタン1つで出し入れできる。
 * ボタンは既存のボタン列（Button アトム）で、出発駅・到着駅がそろったときだけ出る。
 */
import { test, expect, collectErrors } from './helpers';

test('到着予定時刻を表示: 駅名の下の時刻をボタンで切り替えられる', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=tokyo');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();

  const button = page.getByRole('button', { name: '到着予定時刻を表示' });
  await expect(button).toBeVisible();
  const timeLabels = page.locator('.leaflet-marker-icon', { hasText: /\d{2}:\d{2}/ });

  // 既定は表示（押された状態）
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => timeLabels.count(), { timeout: 20_000 }).toBeGreaterThan(0);

  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(timeLabels).toHaveCount(0);

  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => timeLabels.count()).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('到着予定時刻を表示: 出発駅・到着駅がそろうまではボタンを出さない', async ({ page }) => {
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect(page.getByRole('button', { name: '到着予定時刻を表示' })).toHaveCount(0);
});
