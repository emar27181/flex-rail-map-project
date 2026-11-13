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

test('入力が足りない知らせは、操作した駅選択パネルのすぐ下に、注意の印つきで出る（画面の下の端ではない）', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await page.getByRole('button', { name: '終電モード（試作）' }).click();
  const bar = page.locator('[data-snackbar]');
  await expect(bar).toBeVisible();
  const r = await page.evaluate(() => {
    const bar = (document.querySelector('[data-snackbar]') as HTMLElement).getBoundingClientRect();
    const panel = (document.querySelector('[data-station-selector]') as HTMLElement).getBoundingClientRect();
    const icon = document.querySelector('[data-snackbar] svg');
    return {
      barTop: bar.top, barBottom: bar.bottom, barLeft: bar.left, barRight: bar.right,
      panelBottom: panel.bottom, panelLeft: panel.left, panelRight: panel.right,
      viewport: window.innerHeight, hasIcon: !!icon,
    };
  });
  // パネルのすぐ下（隙間は数px〜16px）。パネルに重ならない
  expect(r.barTop).toBeGreaterThanOrEqual(r.panelBottom);
  expect(r.barTop - r.panelBottom).toBeLessThanOrEqual(16);
  // パネルの左端にそろい、パネルの幅を超えない
  expect(Math.abs(r.barLeft - r.panelLeft)).toBeLessThanOrEqual(1);
  expect(r.barRight).toBeLessThanOrEqual(Math.max(r.panelRight, r.panelLeft + 240) + 1);
  // 目に入る高さ（画面の上半分）に出る。画面の下の端には出さない
  expect(r.barBottom).toBeLessThan(r.viewport * 0.7);
  // 注意の印（アイコン）がある
  expect(r.hasIcon).toBe(true);
});
