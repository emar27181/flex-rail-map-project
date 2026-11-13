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
  // 駅の入力欄が増えるのは、追加した出発駅の行（1つ）だけ。別のパネル・入力欄は作らない
  expect(await stationInputs.count()).toBe(inputsBefore + 1);
  await expect(page.locator('[data-meeting-origin-rows] input.station-input-filled')).toHaveCount(1);

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

test('集合駅モード: 出発駅の行は「追加」を押すたびに増え、✕で減らせる', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await page.getByRole('button', { name: '集合駅を探す' }).click();

  const rows = page.locator('[data-meeting-origin-rows] input.station-input-filled');
  await expect(rows).toHaveCount(0);
  for (const name of ['東京', '横浜', '渋谷']) {
    await page.getByRole('button', { name: '出発駅を追加' }).click();
    await page.getByPlaceholder('出発駅を追加').fill(name);
    await page.locator(`[data-station-option="${name}"]`).first().click();
  }
  // 出発駅欄と同じ見た目の行が、追加した数だけ縦に並ぶ（出発駅2・3・4）
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toHaveValue('東京');
  await expect(rows.nth(2)).toHaveValue('渋谷');
  const widths = await rows.evaluateAll(els => els.map(e => Math.round(e.getBoundingClientRect().width)));
  const departureWidth = await page.locator('input.station-input-filled').first().evaluate(e => Math.round(e.getBoundingClientRect().width));
  for (const w of widths) expect(Math.abs(w - departureWidth)).toBeLessThanOrEqual(2);
  // 4人分の所要時間が候補に並ぶ
  await expect(page.locator('[data-meeting-results]')).toContainText('新宿');
  await expect(page.locator('[data-meeting-results]')).toContainText('渋谷');

  // ✕で行が減る
  await page.locator('[data-meeting-origin-rows] button[aria-label]').first().click();
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toHaveValue('横浜');
  expect(errors).toEqual([]);
});
