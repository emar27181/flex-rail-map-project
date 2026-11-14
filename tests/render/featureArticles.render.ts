/**
 * 新しい機能（終電モード・集合駅を探す）を操作する記事。
 * 試作・架空のデータ・推定を含むことが、最初の地図デモの直後に見え、デモの地図がそのモードで開く。
 */
import { test, expect, collectErrors } from './helpers';

test('終電モードの記事: 試作・架空の注意書きがデモの直後に出て、デモの地図は終電モードで開く', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/articles/last-train-mode-guide');
  const prototype = page.locator('[data-notice="prototype"]');
  const fictional = page.locator('[data-notice="fictional"]');
  await expect(prototype).toBeVisible();
  await expect(fictional).toBeVisible();
  await expect(prototype).toContainText('試作');
  await expect(fictional).toContainText('架空');
  // 注意書きは最初の見出しより前（地図デモの直後）にある
  const order = await page.evaluate(() => {
    const demo = document.querySelector('iframe')!;
    const notice = document.querySelector('[data-notice="prototype"]')!;
    const h2 = document.querySelector('h2')!;
    const pos = (a: Element, b: Element) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    return { demoBeforeNotice: pos(demo, notice), noticeBeforeH2: pos(notice, h2), src: demo.getAttribute('src') ?? '' };
  });
  expect(order.demoBeforeNotice).toBe(true);
  expect(order.noticeBeforeH2).toBe(true);
  expect(order.src).toContain('mode=last-train');
  expect(order.src).toContain('to=shibuya');
  expect(errors).toEqual([]);
});

test('終電モードの記事のデモ: 開いたときから終電モードで、最終時刻（*）が出る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?mode=last-train&to=shibuya&embed=1&center=35.66,139.72&zoom=11');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect.poll(() => page.locator('.leaflet-marker-icon', { hasText: /\d{2}:\d{2} \*/ }).count(), { timeout: 20_000 }).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('集合駅の記事: 推定を含む注意書きがデモの直後に出て、デモの地図は集合駅モードで開く', async ({ page }) => {
  await page.goto('/articles/meeting-station-finder');
  const estimated = page.locator('[data-notice="estimated"]');
  await expect(estimated).toBeVisible();
  await expect(estimated).toContainText('目安');
  // 試作ではないので、試作の注意書きは出さない
  await expect(page.locator('[data-notice="prototype"]')).toHaveCount(0);
  const src = await page.locator('iframe').first().getAttribute('src');
  expect(src).toContain('mode=meeting');
  expect(src).toContain('with=tokyo%2Cyokohama');
});

test('集合駅の記事のデモ: 開いたときから集合駅モードで、全員が着くまでの最大時間が駅に出る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?mode=meeting&from=shinjuku&with=tokyo,yokohama&embed=1&center=35.64,139.72&zoom=11');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await expect.poll(() => page.locator('.leaflet-marker-icon', { hasText: /\d+分/ }).count(), { timeout: 20_000 }).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('集合駅モードのURL（埋め込みでない）: 追加分の出発駅が緑の欄で並び、候補が出る', async ({ page }) => {
  await page.goto('/?mode=meeting&from=shinjuku&with=tokyo,yokohama');
  await expect(page.getByRole('button', { name: '集合駅を探す' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-meeting-extra]')).toHaveCount(2);
  // 追加の入力欄も、ボタンなしで最初から出ている
  await expect(page.locator('[data-meeting-add]')).toBeVisible();
  // 候補は上位3つだけ見せ、残りは折りたたみ（候補3つ + 「さらに表示」1つ）
  await expect(page.locator('[data-meeting-results]').getByRole('button')).toHaveCount(4);
});
