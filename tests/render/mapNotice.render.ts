/**
 * 地図の下の知らせ（Snackbar）: 文は切らずに出る。文が長いときは2行まで折り返し、画面の端からはみ出さず、
 * 下に並ぶ浮かぶボタンに重ならない。
 * （2026-11-13: スマホで「終電モードを使用するには、到着駅を設定してくださ」と文末が切れていた）
 */
import { test, expect } from './helpers';

const TOGGLE: Record<'ja' | 'en' | 'zh' | 'ko', string> = {
  ja: '終電モード（試作）', en: 'Last train mode (beta)', zh: '末班车模式（测试）', ko: '막차 모드(시험)',
};

for (const lang of ['ja', 'en', 'zh', 'ko'] as const) {
  for (const width of [360, 390]) {
    test(`知らせの文は切れず、2行までで、画面の端に収まる（${lang}・${width}px）`, async ({ page }) => {
      await page.setViewportSize({ width, height: 780 });
      await page.goto(`/?lang=${lang}`);
      await expect(page.locator('.leaflet-container').first()).toBeVisible();
      await page.getByRole('button', { name: TOGGLE[lang] }).click();
      const bar = page.locator('[data-snackbar]');
      await expect(bar).toBeVisible();

      const m = await page.evaluate(() => {
        const bar = document.querySelector('[data-snackbar]') as HTMLElement;
        const msg = bar.querySelector('[data-snackbar-message]') as HTMLElement;
        const barBox = bar.getBoundingClientRect();
        const lineHeight = parseFloat(getComputedStyle(msg).lineHeight);
        return {
          text: msg.textContent ?? '',
          clippedX: msg.scrollWidth > msg.clientWidth + 1,
          clippedY: msg.scrollHeight > msg.clientHeight + 1,
          lines: Math.round(msg.getBoundingClientRect().height / lineHeight),
          left: barBox.left, right: barBox.right, viewport: window.innerWidth,
        };
      });
      expect(m.text.length).toBeGreaterThan(5);
      expect(m.clippedX, '横に切れている').toBe(false);
      expect(m.clippedY, '縦に切れている').toBe(false);
      expect(m.lines, '3行以上になっている').toBeLessThanOrEqual(2);
      // 画面の左右の端に張り付かない（地図の端との間を残す）
      expect(m.left).toBeGreaterThanOrEqual(8);
      expect(m.viewport - m.right).toBeGreaterThanOrEqual(8);
    });
  }
}

test('知らせは下に並ぶ浮かぶボタン（表示切替など）に重ならず、そのすぐ上に出る', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await page.getByRole('button', { name: '終電モード（試作）' }).click();
  const bar = page.locator('[data-snackbar]');
  await expect(bar).toBeVisible();
  const r = await page.evaluate(() => {
    const barBox = (document.querySelector('[data-snackbar]') as HTMLElement).getBoundingClientRect();
    const buttons = [...document.querySelectorAll('button')]
      .filter(b => /表示切替/.test(b.textContent ?? ''))
      .map(b => b.getBoundingClientRect())
      .filter(b => b.width > 0);
    return { barBottom: barBox.bottom, barTop: barBox.top, buttonTops: buttons.map(b => b.top), viewportHeight: window.innerHeight };
  });
  expect(r.barTop).toBeGreaterThanOrEqual(0);
  for (const top of r.buttonTops) expect(r.barBottom, '浮かぶボタンに重なっている').toBeLessThanOrEqual(top + 1);
});
