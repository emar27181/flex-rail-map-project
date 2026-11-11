/**
 * 言語メニュー（components/LanguagePicker.tsx）が、実際の画面で使えるか（2026-11）。
 *
 * 以前は押すたびに次の言語へ進む巡回ボタンで、押す前にどの言語になるか分からなかった。
 * 今は、押すと4言語が並び、選んだ言語へ直接切り替わる。確かめること:
 * - 一覧が画面からはみ出さず、各行が指で押せる大きさ（44px）
 * - 一覧は4言語すべてを「その言語自身の文字」で並べ、押した言語へ直接切り替わり、覚えられる
 * - スマホでヘッダー（全画面でないとき）・地図の隅（全画面のとき）のどちらでも開ける
 * 文字が枠に収まっているかは textFit.render.ts が（開いた状態も含めて）4言語で見る。
 */
import type { Page } from '@playwright/test';
import { test, expect } from './helpers';

const TOUCH_MIN = 44;

/** 言語メニューのボタン（今の言語が名前に入る。例「言語: 日本語」） */
const picker = (page: Page) => page.getByRole('button', { name: /^(言語|Language|语言|언어): / }).first();

async function openMenu(page: Page) {
  const trigger = picker(page);
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  return menu;
}

test('言語メニューを開くと、4言語がそのままの文字で並び、画面からはみ出さない', async ({ page, isMobile }) => {
  await page.goto('/?lang=ja');
  const menu = await openMenu(page);
  const items = menu.getByRole('menuitemradio');
  await expect(items).toHaveText(['日本語', 'English', '简体中文', '한국어']);
  await expect(items.nth(0)).toHaveAttribute('aria-checked', 'true');

  const viewport = page.viewportSize()!;
  const box = (await menu.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);

  if (isMobile) {
    for (let i = 0; i < 4; i++) expect((await items.nth(i).boundingBox())!.height).toBeGreaterThanOrEqual(TOUCH_MIN);
  }
});

test('押した言語へ直接切り替わり、覚えられる。外を押すと閉じる', async ({ page }) => {
  await page.goto('/?lang=ja');
  let menu = await openMenu(page);
  await menu.getByRole('menuitemradio', { name: '한국어' }).click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '언어: 한국어' }).first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('frm-language'))).toBe('korean');

  // 今度は English へ（巡回なら次は中国語になる）
  menu = await openMenu(page);
  await menu.getByRole('menuitemradio', { name: 'English' }).click();
  await expect(page.getByRole('button', { name: 'Language: English' }).first()).toBeVisible();

  // 外を押して閉じる
  await openMenu(page);
  await page.mouse.click(2, page.viewportSize()!.height / 2);
  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('スマホで全画面を解除したときのヘッダーの言語メニューも、開いて切り替えられる', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'ヘッダーに言語メニューが出るのはスマホ（PC は地図の隅）');
  await page.goto('/?lang=ja');
  const header = page.locator('nav [aria-haspopup="menu"]');
  // 全画面のときは地図の隅にあり、ヘッダーには出ない。解除するとヘッダーに出る
  await expect(picker(page)).toBeVisible({ timeout: 30_000 });
  await expect(header).toHaveCount(0);
  await page.getByRole('button', { name: '縮小表示' }).click();
  await expect(header).toBeVisible();
  const menu = await openMenu(page);
  const viewport = page.viewportSize()!;
  const box = (await menu.boundingBox())!;
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  await menu.getByRole('menuitemradio', { name: '简体中文' }).click();
  await expect(page.getByRole('button', { name: '语言: 简体中文' }).first()).toBeVisible();
});
