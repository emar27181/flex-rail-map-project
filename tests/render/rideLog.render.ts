/**
 * 乗車ログ（試作）: 既存の駅選択パネルのボタン列に1つ足したON/OFFと、同じパネルの中の絞り込み・記録だけで完結する
 * （別パネル・別の入力欄を増やさない）。地図は元のLeaflet・路線色・駅マーカーのまま、3段階で見せる。
 */
import { test, expect, collectErrors } from './helpers';

const LOG_BUTTON = '乗車ログ（試作）';

test('乗車ログ: 選んだ経路を記録すると、乗った区間は色つき・降りた駅は濃く・通っただけの駅は薄く出て、段階で絞り込める', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=shibuya');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  const toggle = page.getByRole('button', { name: LOG_BUTTON });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');

  const panel = page.locator('[data-ride-log]');
  await expect(panel).toBeVisible();
  // 出発駅・到着駅の入力欄は既存の1組だけ（乗車ログ用の欄は増えない）
  await expect(page.locator('input.station-input-filled')).toHaveCount(2);
  // 記録前: 全部「全く通っていない」
  const chip = (level: number) => panel.locator(`[data-ride-level="${level}"]`);
  await expect(chip(1)).toContainText('0');
  await expect(chip(2)).toContainText('0');
  await expect(panel.getByRole('button', { name: '直前を取り消す' })).toBeDisabled();

  // 記録する
  const record = panel.locator('[data-ride-log-record]');
  await expect(record).toBeEnabled();
  await record.click();
  await expect(panel).toContainText('路線');
  await expect(panel.getByRole('button', { name: '直前を取り消す' })).toBeEnabled();
  // 降りた（乗り降りした）駅は少なくとも出発・到着の2駅
  const alighted = Number((await chip(2).innerText()).match(/(\d+)\s*$/)![1]);
  expect(alighted).toBeGreaterThanOrEqual(2);

  // 地図: 降りた駅の札が出る
  await expect.poll(() => page.locator('.leaflet-marker-icon', { hasText: '新宿' }).count(), { timeout: 20_000 }).toBeGreaterThan(0);
  await expect.poll(() => page.locator('.leaflet-marker-icon', { hasText: '渋谷' }).count()).toBeGreaterThan(0);

  // 「通って降りた」を外すと、その駅の札が消える
  await chip(2).click();
  await expect.poll(() => page.locator('.leaflet-marker-icon', { hasText: '渋谷' }).count()).toBe(0);
  await chip(2).click();
  await expect.poll(() => page.locator('.leaflet-marker-icon', { hasText: '渋谷' }).count()).toBeGreaterThan(0);

  // リロードしても記録は残る（この端末のブラウザに保存）
  await page.reload();
  await page.getByRole('button', { name: LOG_BUTTON }).click();
  await expect(page.locator('[data-ride-log]')).toContainText('路線');

  // 消去
  await page.locator('[data-ride-log]').getByRole('button', { name: 'ログを消去' }).click();
  await expect(page.locator('[data-ride-log] [data-ride-level="2"]')).toContainText('0');
  expect(errors).toEqual([]);
});

test('乗車ログ: 終電・集合駅のモードとは同時に使わない', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=shibuya');
  const log = page.getByRole('button', { name: LOG_BUTTON });
  const meeting = page.getByRole('button', { name: '集合駅を探す' });
  await log.click();
  await expect(log).toHaveAttribute('aria-pressed', 'true');
  await meeting.click();
  await expect(meeting).toHaveAttribute('aria-pressed', 'true');
  await expect(log).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-ride-log]')).toHaveCount(0);
  await log.click();
  await expect(meeting).toHaveAttribute('aria-pressed', 'false');
  expect(errors).toEqual([]);
});
