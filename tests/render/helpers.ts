import { test as base, type Page } from '@playwright/test';

/**
 * 描画テストでは、手元のサーバー（astro preview）以外への通信を止める。
 * 広告（AdSense）・計測（GA4）・地図タイルの外部スクリプトは、CI では読み込まれ、手元では読み込まれず、
 * 読み込まれると承認されていないドメイン（127.0.0.1）で例外（`pageerror: Y` など）を出していた（2026-10-14）。
 * 外の都合で結果が変わらないよう、どこで動かしても同じ条件（外部なし）にそろえる
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', route => {
      const host = new URL(route.request().url()).hostname;
      return host === '127.0.0.1' || host === 'localhost' ? route.continue() : route.abort();
    });
    await use(page);
  },
});
export { expect } from '@playwright/test';

/** ページの実行時エラー（例外・console.error）を集める。外部への通信の失敗（ネットワーク制限）は除く */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  // 縮められたスクリプトの例外は message だけでは出どころが分からないので、最初の呼び出し元も残す
  page.on('pageerror', e => errors.push(`pageerror: ${e.message} @ ${e.stack?.split('\n').slice(1, 2).join('').trim() ?? ''}`));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/Failed to load resource|net::ERR_|ERR_CERT|tile\.openstreetmap|googletagmanager|google-analytics/.test(t)) return;
    errors.push(`console.error: ${t}`);
  });
  return errors;
}

export interface Box { x: number; y: number; width: number; height: number }
export const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

/**
 * WebGL の描画面だけを撮る。駅名・ボタン・パネルなど、上に重なる DOM が写ると
 * 描画が止まっていても「色がある」ことになってしまう（2026-10-14、描かない変更でも通ってしまったのを確認）
 */
export async function screenshotCanvasOnly(page: Page, canvasSelector: string): Promise<Buffer> {
  const style = await page.addStyleTag({
    content: `body * { visibility: hidden !important; } ${canvasSelector} { visibility: visible !important; }`,
  });
  try {
    return await page.locator(canvasSelector).first().screenshot();
  } finally {
    await style.evaluate(el => (el as Element).remove());
  }
}

/**
 * 表示モード（集合駅・終電・乗車ログ）の切り替えタグ。「表示切替」パネルの表示設定の上にある（2026-11-15）。
 * パネルが閉じていれば開いてから、タグを返す。PCの浮かぶパネルは開いたままにする（駅選択パネルをふさがない）
 */
export async function modeTag(page: Page, name: string, opener: RegExp = SETTINGS_OPENER) {
  const tag = page.getByRole('button', { name });
  if (!(await tag.first().isVisible().catch(() => false))) {
    await page.getByText(opener).first().click();
  }
  return tag.first();
}

/** 「表示切替」パネルを開くボタンの文言（日本語。PCは「表示路線の切替」、スマホは「表示切替」） */
export const SETTINGS_OPENER = /^(表示路線の切替|表示切替)$/;
/** 言語ごとの、スマホの「表示切替」ボタンの文言 */
export const SETTINGS_OPENER_MOBILE: Record<'ja' | 'en' | 'zh' | 'ko', RegExp> = {
  ja: /^表示切替$/, en: /^Display Toggles$/, zh: /^显示切换$/, ko: /^표시 전환$/,
};

/** スマホの下から出る「表示切替」のシートを閉じる（駅選択パネルをふさぐので、操作のあとに閉じる）。PCでは何もしない */
export async function closeSettingsSheet(page: Page) {
  const dialog = page.getByRole('dialog');
  if (await dialog.count()) await dialog.getByRole('button', { name: '閉じる' }).click();
}

/** モードのタグを押して、スマホならシートを閉じる */
export async function clickMode(page: Page, name: string, opener: RegExp = SETTINGS_OPENER) {
  await (await modeTag(page, name, opener)).click();
  await closeSettingsSheet(page);
}

/** モードのタグが押されている（ON）かを確かめる。スマホならシートを閉じる */
export async function modeIsOn(page: Page, name: string): Promise<boolean> {
  const tag = await modeTag(page, name);
  const on = (await tag.getAttribute('aria-pressed')) === 'true';
  await closeSettingsSheet(page);
  return on;
}
