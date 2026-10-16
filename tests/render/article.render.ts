/**
 * 記事 × 地図デモ（記事の基盤の確認。最初の記事「駅番号の読み方」で確かめる）。
 * 本文が HTML で読め、地図デモがその場で動き（駅番号つき）、地図のページへ同じ状態で移れること。
 */
import { test, expect, collectErrors } from './helpers';
import { getStationNumber } from '../../src/data/stationNumbers';

const SHIBUYA_JY = getStationNumber('yamanote', '渋谷')!;

test('英語の記事: 目次・出典が出て、冒頭の地図デモに駅番号が出て、「地図を大きく開く」で同じ状態の地図に移る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/en/articles/how-to-read-station-numbers');
  await expect(page.locator('h1')).toHaveText('How to Read Japanese Train Station Numbers: A Practical Guide');
  // 本文は HTML にある（検索エンジンが読める）。差し込みは路線データの値になっている
  await expect(page.locator('.article-body')).toContainText(SHIBUYA_JY);
  await expect(page.locator('.article-body')).not.toContainText('{stationNumber:');
  await expect(page.locator('.toc li')).toHaveCount(4);
  expect(await page.locator('.sources li').count()).toBeGreaterThan(0);

  // 冒頭のデモ（埋め込み）の中に、駅番号つきの駅名が出る
  const demo = page.locator('figure[data-demo-id]').first();
  await demo.scrollIntoViewIfNeeded();
  await expect(page.frameLocator('figure[data-demo-id] iframe').first().getByText(new RegExp(`${SHIBUYA_JY}\\s*Shibuya`)).first())
    .toBeVisible({ timeout: 30_000 });

  await demo.locator('[data-me-open]').click();
  await page.waitForURL(url => url.pathname === '/');
  const url = new URL(page.url());
  expect(url.searchParams.get('numbers')).toBe('1');
  expect(url.searchParams.get('lang')).toBe('en');
  await expect(page.getByText(new RegExp(`${SHIBUYA_JY}\\s*Shibuya`)).first()).toBeVisible({ timeout: 30_000 });
  expect(errors).toEqual([]);
});

test('日本語の記事: 日本語の地図でも、指定したデモには駅番号が出る', async ({ page }) => {
  await page.goto('/articles/how-to-read-station-numbers');
  await page.locator('figure[data-demo-id]').first().scrollIntoViewIfNeeded();
  await expect(page.frameLocator('figure[data-demo-id] iframe').first().getByText(new RegExp(`${SHIBUYA_JY}\\s*渋谷`)).first())
    .toBeVisible({ timeout: 30_000 });
});

test('記事の広告枠: 手元（本番以外）では広告を読み込まず、本文の3つ目の見出しの前に「広告枠」の箱が1つだけ出る', async ({ page }) => {
  await page.goto('/en/articles/sapporo-namboku-line-map');
  const slots = page.locator('aside.ad-slot');
  await expect(slots).toHaveCount(1);
  await expect(slots.nth(0)).toHaveAttribute('data-ad-position', 'inline-1');
  for (const slot of await slots.all()) {
    await expect(slot).toBeVisible();
    await expect(slot).toHaveClass(/is-preview/);
    await expect(slot.locator('.ad-slot-label')).toHaveText('Advertisement');
  }
  // 広告のタグは残さない（本番以外で広告を表示・計上させない）
  await expect(page.locator('ins.adsbygoogle')).toHaveCount(0);
  // 本文の広告は3つ目の見出しのすぐ前
  expect(await slots.nth(0).evaluate(el => el.nextElementSibling?.id)).toBe('section-3');
});
