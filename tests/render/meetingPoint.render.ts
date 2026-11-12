/**
 * 集合駅を探すモード: 既存の駅選択パネルの中だけで完結する（別パネル・別の入力欄を増やさない）。
 * 出発駅 + 「出発駅を追加」で2駅以上そろうと候補が出て、選ぶと既存の到着駅に入る。
 */
import { test, expect, collectErrors } from './helpers';

test('集合駅モード: 出発駅を追加すると候補が出て、選ぶと既存の到着駅に入る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  const stationInputs = page.locator('input.station-input-filled');
  const inputsBefore = await stationInputs.count();

  const toggle = page.getByRole('button', { name: '集合駅を探す' });
  await expect(toggle).toBeEnabled();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  // 出発駅が1つのうちは案内だけ
  await expect(page.locator('[data-meeting-results]')).toContainText('出発駅を2つ以上');

  // 既存の「経由駅を追加」と同じ欄を「出発駅を追加」として使う
  await page.getByRole('button', { name: '出発駅を追加' }).click();
  const add = page.getByPlaceholder('出発駅を追加');
  await add.fill('東京');
  await page.locator('[data-station-option="東京"]').first().click();

  const results = page.locator('[data-meeting-results]');
  await expect(results.getByRole('button')).toHaveCount(5);
  await expect(results).toContainText('最大');
  await expect(results).toContainText('新宿');
  await expect(results).toContainText('東京');
  // 入力欄（駅選択）は増えていない
  expect(await stationInputs.count()).toBeLessThanOrEqual(inputsBefore);

  // 候補を押すと到着駅に入る
  const first = results.getByRole('button').first();
  const name = (await first.innerText()).replace(/^1\.\s*/, '').split(' · ')[0];
  await first.click();
  await expect(stationInputs.nth(1)).toHaveValue(name);
  // 時刻欄は元からある1つだけ（集合駅用の時刻欄は作らない）
  await expect(page.locator('input[type="time"]')).toHaveCount(1);

  // OFFで通常表示に戻る（候補の欄が消える）
  await toggle.click();
  await expect(page.locator('[data-meeting-results]')).toHaveCount(0);
  expect(errors).toEqual([]);
});
