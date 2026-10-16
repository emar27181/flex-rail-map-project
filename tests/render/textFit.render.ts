/**
 * どの言語でも、画面の文字が枠に収まっているか（切れていないか）。
 *
 * 英語など文字数の多い言語で「Enter static」「De…」のように文字が途中で切れていた（2026-10-15）。
 * 言語ごとに主な画面を開き、開閉できる箱も順に開いて、切れている文字が無いことを確かめる（textFit.ts）。
 * 直すときは、文字を縮める・変な所で折り返す・枠からはみ出させる、のような無理な直し方をしない
 * （docs/render-tests.md の「文字が切れていたとき」）。
 */
import type { Page } from '@playwright/test';
import { test, expect } from './helpers';
import { findClippedText, type ClippedText } from './textFit';

const LANGS = ['ja', 'en', 'zh', 'ko'] as const;
/** 主な画面（地図・経路を出した地図・埋め込み・路線ページ） */
const pages = (lang: string) => [
  `/?lang=${lang}`,
  `/?from=shinjuku&to=tokyo&lang=${lang}`,
  `/?routes=jrnar&lang=${lang}&embed=1`,
  `${lang === 'ja' ? '' : `/${lang}`}/lines/jr-nara-line`,
];
/** スマホの幅（mobile は 390px）。小さめの Android でも確かめる */
const NARROW = { width: 360, height: 740 };

async function clippedOn(page: Page, path: string): Promise<string[]> {
  const found: ClippedText[] = [];
  await page.goto(path);
  await page.waitForSelector('.app-loading', { state: 'hidden', timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(1500);
  found.push(...await findClippedText(page));
  // 開閉できる箱（駅選択・表示切替・設定の各項目）を順に開いて、そのたびに確かめる
  for (let i = 0; i < 8; i++) {
    const closed = page.locator('[aria-expanded="false"]:visible').first();
    if (!(await closed.count())) break;
    await closed.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(400);
    found.push(...await findClippedText(page));
  }
  return [...new Set(found.map(f => `${path}: "${f.text}" (${f.where}) ${f.overflowPx}px`))];
}

for (const lang of LANGS) {
  test(`${lang}: 文字が切れていない`, async ({ page }) => {
    test.setTimeout(180_000);
    const problems: string[] = [];
    for (const p of pages(lang)) problems.push(...await clippedOn(page, p));
    expect(problems).toEqual([]);
  });

  test(`${lang}: 狭いスマホ（360px）でも文字が切れていない`, async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'スマホの端末設定で確かめる');
    test.setTimeout(180_000);
    await page.setViewportSize(NARROW);
    const problems: string[] = [];
    for (const p of pages(lang)) problems.push(...await clippedOn(page, p));
    expect(problems).toEqual([]);
  });
}
