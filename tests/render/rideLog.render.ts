/**
 * 乗車ログ（試作）: 既存の駅選択パネルのボタン列に1つ足したON/OFFだけで完結する（別パネル・別の入力欄を増やさない）。
 * 地図は元のLeaflet・路線色・駅マーカーのまま。乗っていない路線は灰色、乗った路線は色つきで常に出し、
 * 駅名は乗った路線の駅だけ（降りていない駅は半透明）。灰色の線のタップ判定は、地図の薄い線を切り替えるときと同じ。
 */
import { test, expect, collectErrors, clickMode, modeIsOn, closeSettingsSheet } from './helpers';
import type { Page } from '@playwright/test';

const LOG_BUTTON = '乗車ログ（試作）';

/** 地図の緯度経度を、画面の座標にする */
async function screenPoint(page: Page, lat: number, lng: number) {
  return page.evaluate(([la, ln]) => {
    const c = document.querySelector('.leaflet-container') as unknown as HTMLElement & { _leaflet_map: { latLngToContainerPoint: (p: [number, number]) => { x: number; y: number } } };
    const p = c._leaflet_map.latLngToContainerPoint([la, ln]);
    const r = c.getBoundingClientRect();
    return { x: r.left + p.x, y: r.top + p.y };
  }, [lat, lng]);
}

test('乗車ログ: 灰色の線をタップすると乗った路線として記録され、色つきになって駅名が出る。もう一度タップで外れる', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  // 中野と高円寺の間（駅から離れた所）を、駅選択パネルに隠れない位置（真ん中より下）に出す
  await page.evaluate(() => {
    const c = document.querySelector('.leaflet-container') as unknown as { _leaflet_map: { setView: (p: [number, number], z: number, o: object) => void; panBy: (o: [number, number], opt: object) => void } };
    c._leaflet_map.setView([35.7055, 139.6578], 13, { animate: false });
    c._leaflet_map.panBy([0, -220], { animate: false });
  });
  await clickMode(page, LOG_BUTTON);
  const panel = page.locator('[data-ride-log]');
  await expect(panel).toBeVisible();
  // 絞り込みのチップは無い（灰色は灰色、乗った路線は色つきで常に出す）
  await expect(panel.locator('[data-ride-level]')).toHaveCount(0);
  await expect(panel.getByRole('button', { name: '直前を取り消す' })).toBeDisabled();
  // 記録前は駅名が出ない
  await page.waitForTimeout(1500);
  const labelsBefore = await page.locator('.leaflet-marker-icon').count();

  // 灰色の線（地図の真ん中）をタップ
  const pt = await screenPoint(page, 35.7055, 139.6578);
  await page.mouse.click(pt.x, pt.y);
  await expect(panel).toContainText('1路線');
  await expect(panel.getByRole('button', { name: '直前を取り消す' })).toBeEnabled();
  // 乗った路線の駅名が出る
  await expect.poll(() => page.locator('.leaflet-marker-icon').count(), { timeout: 20_000 }).toBeGreaterThan(labelsBefore);

  // もう一度タップすると外れる
  await page.mouse.click(pt.x, pt.y);
  await expect(panel).not.toContainText('1路線');
  await expect(panel.getByRole('button', { name: '直前を取り消す' })).toBeDisabled();
  expect(errors).toEqual([]);
});

test('乗車ログ: 駅のツールチップで「降りた駅に記録」でき、外せる。リロードしても記録は残り、消去できる', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=ofuna');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await clickMode(page, LOG_BUTTON);
  const panel = page.locator('[data-ride-log]');
  // 経路の記録（出発駅・到着駅は既存の欄。乗車ログ用の欄は増えない）
  await expect(page.locator('input.station-input-filled')).toHaveCount(2);
  await panel.locator('[data-ride-log-record]').click();
  await expect(panel).toContainText('路線');
  await expect.poll(() => page.locator('.leaflet-marker-icon', { hasText: '大船' }).count(), { timeout: 20_000 }).toBeGreaterThan(0);

  // 通っただけの駅（途中駅）のツールチップで、降りた駅に記録 → 外す
  const mid = page.locator('.leaflet-marker-icon', { hasText: /./ }).filter({ hasNotText: /新宿|大船/ }).first();
  await expect(mid).toBeVisible({ timeout: 20_000 });
  await mid.click({ force: true });
  // 降りていない駅は、ヒートマップの「データなし」と同じ非活性の灰色（半透明ではない）
  const bg = await mid.locator('div').first().evaluate(el => getComputedStyle(el).backgroundColor);
  const [r, g, b] = bg.match(/\d+/g)!.map(Number);
  expect(Math.abs(r - g) < 12 && Math.abs(g - b) < 12, `灰色のはず: ${bg}`).toBe(true);
  expect(await mid.evaluate(el => getComputedStyle(el.firstElementChild as Element).opacity)).toBe('1');
  const alight = page.locator('[data-ride-log-alight]');
  await expect(alight).toHaveText('降りた駅に記録');
  await alight.click();
  await expect(alight).toHaveText('降りた駅の記録を外す');
  await alight.click();
  await expect(alight).toHaveText('降りた駅に記録');

  // リロードしても記録は残る（この端末のブラウザに保存）
  await page.reload();
  await clickMode(page, LOG_BUTTON);
  await expect(page.locator('[data-ride-log]')).toContainText('路線');
  // 消去
  await page.locator('[data-ride-log]').getByRole('button', { name: 'ログを消去' }).click();
  await expect(page.locator('[data-ride-log]')).not.toContainText('1路線');
  await expect(page.locator('[data-ride-log]').getByRole('button', { name: 'ログを消去' })).toBeDisabled();
  expect(errors).toEqual([]);
});

test('乗車ログ: 終電・集合駅のモードとは同時に使わない', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku&to=shibuya');
  await clickMode(page, LOG_BUTTON);
  expect(await modeIsOn(page, LOG_BUTTON)).toBe(true);
  await clickMode(page, '集合駅を探す');
  expect(await modeIsOn(page, '集合駅を探す')).toBe(true);
  expect(await modeIsOn(page, LOG_BUTTON)).toBe(false);
  await expect(page.locator('[data-ride-log]')).toHaveCount(0);
  await clickMode(page, LOG_BUTTON);
  expect(await modeIsOn(page, '集合駅を探す')).toBe(false);
  expect(errors).toEqual([]);
});

test('乗車ログ: 「表示路線の切替」のチップでも、乗った路線を切り替えられる（同じチップ・地図の灰色タップと同じ結果）', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await clickMode(page, LOG_BUTTON);
  // スマホはモードを切り替えるとシートが閉じるので、開き直す（PCは開いたまま）
  if (!(await page.locator('[data-route-board-mode]').isVisible())) await page.getByText(/^(表示路線の切替|表示切替)$/).first().click();
  // 乗車ログの間は、チップは乗った路線を表す。全表示・全非表示のボタンは出ない
  await expect(page.locator('[data-route-board-mode="rideLog"]')).toBeVisible();
  await expect(page.getByRole('button', { name: '全表示' })).toHaveCount(0);
  await page.getByPlaceholder('路線名を検索').fill('山手線');
  const chip = page.locator('[data-route-chip="yamanote"]').first();
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-ride-log]')).toContainText('1路線');
  // 駅名が出る（乗った路線の駅）
  await expect.poll(() => page.locator('.leaflet-marker-icon', { hasText: '渋谷' }).count(), { timeout: 20_000 }).toBeGreaterThan(0);
  // もう一度押すと外れる
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-ride-log]')).not.toContainText('1路線');
  expect(errors).toEqual([]);
});

test('設定の保存・読込: 乗車ログ（乗った路線）も設定ファイルで読み込める（書き出しに含まれ、読み込むと復元される）', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await page.getByText(/^(表示路線の切替|表示切替)$/).first().click();
  await page.getByText('設定の保存・読込').click();
  const file = {
    version: 1,
    userData: { rideLog: [{ id: 'z:0', kind: 'line', routeKey: 'yamanote', stations: ['新宿', '渋谷', '恵比寿'] }] },
  };
  await page.getByPlaceholder(/JSON|貼り付け/).fill(JSON.stringify(file));
  await page.getByRole('button', { name: 'テキストから適用' }).click();
  await expect(page.getByText('適用済み').first()).toBeVisible();
  // 乗車ログを開くと、読み込んだ路線が乗った路線になっている
  await clickMode(page, LOG_BUTTON);
  await expect(page.locator('[data-ride-log]')).toContainText('1路線');
  expect(errors).toEqual([]);
});
