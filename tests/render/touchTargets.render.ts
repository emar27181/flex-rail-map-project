/**
 * 指で押す主な操作が、スマホで押しやすい大きさになっているか（2026-11, docs/app/ui-review-2026-11.md の A1・A2）。
 *
 * スマホで出発駅・到着駅の入力欄と入れ替えボタンが 24px しかなく、iOS 44pt / Android 48dp の推奨の半分だった。
 * 指で操作する端末（hover が無い）では 44px、マウスの PC ではこれまでどおり 24px にする（StationSelector の stationFieldSize）。
 */
import { test, expect } from './helpers';

const TOUCH_MIN = 44;
const MOUSE_SIZE = 24;

test('出発駅・到着駅の入力欄と入れ替えボタンは、スマホでは 44px 以上、PC では 24px', async ({ page, isMobile }) => {
  await page.goto('/?lang=ja');
  const inputs = page.locator('input.station-input-filled');
  const swap = page.getByRole('button', { name: '出発駅と到着駅を入れ替え' });
  await expect(inputs).toHaveCount(2, { timeout: 20_000 });
  await expect(swap).toBeVisible();

  const heights = await Promise.all([inputs.nth(0), inputs.nth(1), swap].map(async l => Math.round((await l.boundingBox())!.height)));
  const swapBox = (await swap.boundingBox())!;
  if (isMobile) {
    for (const h of heights) expect(h).toBeGreaterThanOrEqual(TOUCH_MIN);
    expect(Math.round(swapBox.width)).toBeGreaterThanOrEqual(TOUCH_MIN);
  } else {
    expect(heights).toEqual([MOUSE_SIZE, MOUSE_SIZE, MOUSE_SIZE]);
  }
});
