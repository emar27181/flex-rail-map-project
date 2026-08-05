/**
 * デザイン基準の回帰テスト
 *
 * 過去に実ブラウザ計測で見つかった問題:
 * - 入力欄のフォントサイズが12pxで、iOS Safariがフォーカス時にページを
 *   自動拡大していた（16px未満が条件）
 * - ソートボタン(20px)・全表示/全非表示(22px)・フッターリンク(14px)が
 *   WCAG 2.2 AA 2.5.8「ターゲットサイズ(最小)」の24pxを下回っていた
 * - ToggleableItem の行が display:flex なのに縮小制御が無く、長い路線名が
 *   親の横スクロールコンテナ(overflowY指定のみ=x軸autoの罠)を横に押し広げ、
 *   路線選択パネルが横スライドできてしまっていた
 *
 * このテストはビルド済みの実DOMを計測して確認する。CSSの書き方を
 * 変えても「結果として基準を満たしているか」だけを見るため、
 * リファクタ耐性がある。
 */

import { test, expect, type Page } from '@playwright/test';

async function loadPage(page: Page) {
  // Cookie同意バナーがUIパネルのボタンを覆い計測を邪魔するため、
  // 事前に同意済み状態を仕込んでバナー自体を出さない。
  await page.addInitScript(() => {
    localStorage.setItem(
      'cookieConsent',
      JSON.stringify({ necessary: true, analytics: false, advertising: false })
    );
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.leaflet-container', { timeout: 15000 });
  await page.waitForTimeout(2000);
}

/** 地図(Leafletタイル・駅ラベル)を除外し、操作UIパネルだけを対象にする */
function inMap(el: Element) {
  return !!el.closest('.leaflet-container');
}

test.describe('WCAG 2.2 AA ターゲットサイズ (2.5.8)', () => {
  test('UIパネル内のインタラクティブ要素は最小24px四方を満たす', async ({ page }) => {
    await loadPage(page);

    // モバイル幅では詳細設定ポップオーバーを開いて中の要素も計測対象にする
    const detailBtn = page.locator('button[aria-expanded]').last();
    if (await detailBtn.count()) {
      await detailBtn.click();
      await page.waitForTimeout(1000);
    }

    const violations = await page.evaluate(() => {
      const inMap = (el: Element) => !!el.closest('.leaflet-container');
      const vis = (el: Element) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
      };
      const out: string[] = [];
      document.querySelectorAll('button, a, input, select, [role="button"]').forEach((el) => {
        if (!vis(el) || inMap(el)) return;
        const type = (el as HTMLInputElement).type;
        if (type === 'checkbox' || type === 'radio') return;
        const r = el.getBoundingClientRect();
        const min = Math.min(r.width, r.height);
        if (min < 24) {
          out.push(`${el.tagName} "${(el.textContent || '').trim().slice(0, 20)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      });
      return out;
    });

    expect(violations, violations.join('\n')).toEqual([]);
  });
});

test.describe('入力欄のフォントサイズ (iOS自動ズーム防止)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('テキスト・時刻入力欄は16px未満にならない', async ({ page }) => {
    await loadPage(page);

    const violations = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll('input').forEach((el) => {
        if (['checkbox', 'radio', 'range'].includes(el.type)) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 16) out.push(`input[type=${el.type}] fontSize=${fs}px`);
      });
      return out;
    });

    expect(violations, violations.join('\n')).toEqual([]);
  });
});

test.describe('路線選択パネルの横スクロール', () => {
  for (const [label, viewport] of [
    ['mobile', { width: 390, height: 844 }],
    ['desktop', { width: 1280, height: 800 }],
  ] as const) {
    test(`${label}: 横スクロール可能なコンテナが無い`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await loadPage(page);

      const detailBtn = page.locator('button[aria-expanded]').last();
      if (await detailBtn.count()) {
        await detailBtn.click();
        await page.waitForTimeout(1000);
      }

      const result = await page.evaluate(() => {
        const offenders: string[] = [];
        document.querySelectorAll('*').forEach((el) => {
          const s = getComputedStyle(el);
          if (!/(auto|scroll)/.test(s.overflowX)) return;
          const over = el.scrollWidth - el.clientWidth;
          if (over > 1 && el.clientWidth > 80) {
            offenders.push(`${el.tagName}.${(el.className || '').toString().slice(0, 30)} overflow=${over}px`);
          }
        });
        return {
          offenders,
          bodyOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      expect(result.offenders, result.offenders.join('\n')).toEqual([]);
      expect(result.bodyOverflow).toBeLessThanOrEqual(1);
    });
  }
});

test.describe('画面上の絵文字禁止', () => {
  test('レンダリング結果に絵文字が含まれない', async ({ page }) => {
    await loadPage(page);

    const detailBtn = page.locator('button[aria-expanded]').last();
    if (await detailBtn.count()) {
      await detailBtn.click();
      await page.waitForTimeout(1000);
    }

    const found = await page.evaluate(() => {
      const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/u;
      const bad: string[] = [];
      document.querySelectorAll('button, a, h1, h2, h3, span, div, label').forEach((el) => {
        const own = [...el.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent)
          .join('');
        if (emojiRe.test(own)) bad.push(own.trim().slice(0, 30));
      });
      return [...new Set(bad)];
    });

    expect(found, found.join('\n')).toEqual([]);
  });
});
