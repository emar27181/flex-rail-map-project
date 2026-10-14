/**
 * 立体表示（three.js / WebGL）が描けているか。
 * jsdom のユニットテストでは WebGL が動かないので、真っ黒・点滅・駅名の重なり・ボタンの位置はここで確かめる。
 */
import { createHash } from 'node:crypto';
import { test, expect, type Page } from '@playwright/test';
import { collectErrors, overlaps, screenshotCanvasOnly, type Box } from './helpers';
import { pngStats } from './png';
import { FLOATING_ICON_BUTTON_SIZE } from '../../src/components/ui/atoms/controlSize';

const URL_3D = '/?from=shinjuku&to=tokyo&view=terrain3d';
const SETTINGS = '立体表示の設定';
/** WebGL の描画面（three.js が作る canvas。ラベル用の DOM は別の箱） */
const CANVAS = '[data-terrain3d] canvas';

async function open3d(page: Page) {
  await page.goto(URL_3D);
  const canvas = page.locator('[data-terrain3d] canvas').first();
  await expect(canvas).toBeVisible({ timeout: 20_000 });
  // 線・地面・駅を読み終えて駅名が並ぶまで待つ
  await expect.poll(() => page.locator('[data-terrain3d-station-labels] span:visible').count(), { timeout: 30_000 }).toBeGreaterThan(3);
  return canvas;
}

test('立体表示が描け（一色ではない）、実行時エラーが無い', async ({ page }) => {
  const errors = collectErrors(page);
  await open3d(page);
  const stats = pngStats(await screenshotCanvasOnly(page, CANVAS));
  expect(stats.distinctColors, '地面・線・駅が描かれていれば色の種類が多い').toBeGreaterThan(40);
  expect(stats.nonDominantRatio, '背景だけの画面ではない').toBeGreaterThan(0.2);
  expect(errors).toEqual([]);
});

test('駅名は重ならず、上限（40）以下', async ({ page }) => {
  await open3d(page);
  const boxes = await page.locator('[data-terrain3d-station-labels] span:visible').evaluateAll(els =>
    els.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, text: e.textContent }; }));
  expect(boxes.length).toBeLessThanOrEqual(40);
  const hits: string[] = [];
  boxes.forEach((a, i) => boxes.slice(i + 1).forEach(b => { if (overlaps(a as Box, b as Box)) hits.push(`${a.text} × ${b.text}`); }));
  expect(hits).toEqual([]);
});

test('設定はアイコンから開き、最初は閉じている。アイコンは浮かぶボタンの大きさ', async ({ page }) => {
  await open3d(page);
  const button = page.getByRole('button', { name: SETTINGS });
  await expect(button).toBeVisible();
  await expect(page.getByTestId('terrain3d-controls')).toHaveCount(0);
  const b = (await button.boundingBox())!;
  expect(Math.round(b.height)).toBe(FLOATING_ICON_BUTTON_SIZE.md);
  await button.click();
  await expect(page.getByTestId('terrain3d-controls')).toBeVisible();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
});

test('動かしている間も描けていて、描き直されている（何も描かれないコマ・固まったコマが無い）', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'マウスのドラッグで回すのは PC だけ');
  const canvas = await open3d(page);
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down({ button: 'right' });
  let prev = '';
  for (let i = 1; i <= 6; i++) {
    await page.mouse.move(box.x + box.width / 2 + i * 30, box.y + box.height / 2 + i * 10);
    const shot = await screenshotCanvasOnly(page, CANVAS);
    const stats = pngStats(shot);
    expect(stats.nonDominantRatio, `${i} コマ目が描けている`).toBeGreaterThan(0.2);
    // 動かしているのに同じ絵のままなら、描き直しが止まっている（固まった1コマだけが残っている）
    const hash = createHash('sha1').update(shot).digest('hex');
    expect(hash, `${i} コマ目が前のコマから変わっている`).not.toBe(prev);
    prev = hash;
  }
  await page.mouse.up({ button: 'right' });
});

test('スマホ全画面では、設定のアイコンが「表示切替」の右に並ぶ', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'スマホの配置');
  await open3d(page);
  const display = (await page.getByRole('button', { name: '表示切替' }).boundingBox())!;
  const settings = (await page.getByRole('button', { name: SETTINGS }).boundingBox())!;
  expect(settings.x).toBeGreaterThanOrEqual(display.x + display.width);
  expect(Math.abs((settings.y + settings.height / 2) - (display.y + display.height / 2))).toBeLessThan(4);
});
