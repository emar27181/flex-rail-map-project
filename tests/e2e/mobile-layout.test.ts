/**
 * モバイルレイアウトテスト
 *
 * 過去に起きた問題:
 * - MobileBottomPanel が Leaflet レイヤーの下に埋もれて見えなくなる
 * - 地図が拡大されすぎる
 *
 * テスト対象:
 * 1. z-index / 表示優先度 (カテゴリ1)
 * 3. 位置・配置        (カテゴリ3)
 */

import { test, expect, type Page } from '@playwright/test';

// ページ読み込みとReactハイドレーション完了を待つ共通処理
async function loadPage(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // ハイドレーション完了の目安: aria-expanded ボタンが出現するまで待つ
  await page.waitForSelector('button[aria-expanded]', { timeout: 10000 });
  // Leaflet地図の初期化を待つ
  await page.waitForSelector('.leaflet-container', { timeout: 10000 });
}

// ───────────────────────────────────────────────
// カテゴリ 1: z-index / 表示優先度テスト
// ───────────────────────────────────────────────
test.describe('カテゴリ1: z-index / 表示優先度', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone 12 相当

  test('MobileBottomPanel ボタンが Leaflet コントロール(z:1000)より手前にある', async ({ page }) => {
    await loadPage(page);

    const buttons = page.locator('button[aria-expanded]');
    await expect(buttons.first()).toBeVisible();

    // ボタングループ要素の z-index を確認
    const btnGroup = page.locator('button[aria-expanded]').first().locator('..');
    const zIndex = await btnGroup.evaluate(
      (el) => parseInt(window.getComputedStyle(el).zIndex, 10)
    );
    expect(zIndex).toBeGreaterThan(1000); // Leaflet .leaflet-bottom の z-index 1000 を超えること
  });

  test('ポップオーバーが開いたときボタンより高い z-index を持つ', async ({ page }) => {
    await loadPage(page);

    const firstBtn = page.locator('button[aria-expanded]').first();
    await firstBtn.tap();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const popoverZ = await dialog.evaluate(
      (el) => parseInt(window.getComputedStyle(el).zIndex, 10)
    );
    expect(popoverZ).toBeGreaterThan(10000); // Z_POPOVER = 10002
  });

  test('ボタン上に pointer-events:none 以外の透明オーバーレイがない', async ({ page }) => {
    await loadPage(page);

    const firstBtn = page.locator('button[aria-expanded]').first();
    const box = await firstBtn.boundingBox();
    expect(box).not.toBeNull();

    // ボタン中心座標でクリックできるか（見えない要素に遮られていないか）
    await firstBtn.tap();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('ポップオーバーが position:fixed を使用している', async ({ page }) => {
    await loadPage(page);
    await page.locator('button[aria-expanded]').first().tap();

    const dialog = page.locator('[role="dialog"]');
    const position = await dialog.evaluate(
      (el) => window.getComputedStyle(el).position
    );
    expect(position).toBe('fixed');
  });
});

// ───────────────────────────────────────────────
// カテゴリ 2: コンポーネントの出現条件テスト
// ───────────────────────────────────────────────
test.describe('カテゴリ2: コンポーネント出現条件', () => {
  test('モバイル幅(375px)でMobileBottomPanelボタンが表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loadPage(page);

    const buttons = page.locator('button[aria-expanded]');
    await expect(buttons).toHaveCount(2); // 駅設定・詳細設定
    await expect(buttons.first()).toBeVisible();
  });

  test('デスクトップ幅(1280px)でMobileBottomPanelボタンが表示されない', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loadPage(page);

    const buttons = page.locator('button[aria-expanded]');
    await expect(buttons).toHaveCount(0);
  });

  test('モバイル時に凡例パネルが非表示になる', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loadPage(page);

    // モバイルフルスクリーン時は凡例が MobileBottomPanel に移動するため、
    // 独立した凡例パネルは画面上にないこと（or 非表示）
    const legend = page.locator('[data-testid="legend-panel"]');
    const count = await legend.count();
    if (count > 0) {
      await expect(legend).not.toBeVisible();
    }
  });
});

// ───────────────────────────────────────────────
// カテゴリ 3: 位置・配置テスト
// ───────────────────────────────────────────────
test.describe('カテゴリ3: 位置・配置', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('下部フローティングボタンが画面左下に配置されている', async ({ page }) => {
    await loadPage(page);

    const btnGroup = page.locator('button[aria-expanded]').first();
    const box = await btnGroup.boundingBox();
    expect(box).not.toBeNull();

    const vw = 375;
    const vh = 812;

    // 左寄り: 画面左端から半分未満の位置
    expect(box!.x).toBeLessThan(vw / 2);

    // 下寄り: 画面下半分にある
    expect(box!.y).toBeGreaterThan(vh / 2);
  });

  test('下部ボタンが画面下端から十分な余白を持つ（広告・ホームインジケータ分）', async ({ page }) => {
    await loadPage(page);

    const lastBtn = page.locator('button[aria-expanded]').last();
    const box = await lastBtn.boundingBox();
    expect(box).not.toBeNull();

    const vh = 812;
    const bottomEdge = box!.y + box!.height;
    const bottomMargin = vh - bottomEdge;

    // 最低 60px の余白があること（safeAreaBottom=60 + 10px = 70px から計算）
    expect(bottomMargin).toBeGreaterThanOrEqual(60);
  });

  test('どのボタンも画面外にはみ出していない', async ({ page }) => {
    await loadPage(page);

    const vw = 375;
    const vh = 812;
    const buttons = page.locator('button[aria-expanded]');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(vw);
      expect(box!.y + box!.height).toBeLessThanOrEqual(vh);
    }
  });
});

// ───────────────────────────────────────────────
// カテゴリ 4: 地図ズームレベルテスト
// ───────────────────────────────────────────────
test.describe('カテゴリ4: 地図ズームレベル', () => {
  test('初期ズームが適切な範囲内（10〜14）である', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loadPage(page);

    // Leaflet の内部状態からズームレベルを取得
    const zoom = await page.evaluate(() => {
      const container = document.querySelector('.leaflet-container') as any;
      return container?._leaflet_map?.getZoom() ?? null;
    });

    expect(zoom).not.toBeNull();
    expect(zoom).toBeGreaterThanOrEqual(10);
    expect(zoom).toBeLessThanOrEqual(14);
  });

  test('デスクトップでも初期ズームが適切な範囲内（10〜14）である', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loadPage(page);

    const zoom = await page.evaluate(() => {
      const container = document.querySelector('.leaflet-container') as any;
      return container?._leaflet_map?.getZoom() ?? null;
    });

    expect(zoom).not.toBeNull();
    expect(zoom).toBeGreaterThanOrEqual(10);
    expect(zoom).toBeLessThanOrEqual(14);
  });
});

// ───────────────────────────────────────────────
// カテゴリ 5: レスポンシブ境界テスト
// ───────────────────────────────────────────────
test.describe('カテゴリ5: レスポンシブ境界値', () => {
  for (const { label, width, expectMobilePanel } of [
    { label: '375px (iPhone SE)', width: 375, expectMobilePanel: true },
    { label: '767px (モバイル上限)', width: 767, expectMobilePanel: true },
    { label: '768px (デスクトップ下限)', width: 768, expectMobilePanel: false },
    { label: '1280px (一般PC)', width: 1280, expectMobilePanel: false },
  ]) {
    test(`${label}: MobileBottomPanel が ${expectMobilePanel ? '表示' : '非表示'}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await loadPage(page);

      const buttons = page.locator('button[aria-expanded]');
      if (expectMobilePanel) {
        await expect(buttons.first()).toBeVisible();
      } else {
        await expect(buttons).toHaveCount(0);
      }
    });
  }
});

// ───────────────────────────────────────────────
// カテゴリ 6: 初期フルスクリーン状態テスト
// ───────────────────────────────────────────────
test.describe('カテゴリ6: モバイル初期フルスクリーン', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('モバイルで読み込み直後からフルスクリーンUIが表示される', async ({ page }) => {
    await loadPage(page);

    // MobileBottomPanel が最初から表示されていること（フルスクリーンが初期状態）
    const buttons = page.locator('button[aria-expanded]');
    await expect(buttons.first()).toBeVisible();

    // fullscreen-map クラスが body に付いていること
    await expect(page.locator('body')).toHaveClass(/fullscreen-map/);
  });

  test('モバイルで地図が画面全体を覆っている（position:fixed）', async ({ page }) => {
    await loadPage(page);

    // 地図コンテナが画面全体を覆う position:fixed 要素であること
    const mapWrapper = page.locator('.leaflet-container').locator('..');
    const position = await mapWrapper.evaluate(
      (el) => window.getComputedStyle(el).position
    );
    // フルスクリーン時の外側コンテナが fixed であること
    const outerContainer = page.locator('body > div').first();
    const outerPos = await outerContainer.evaluate(
      (el) => {
        // position:fixed のコンテナを探す
        let node: Element | null = el;
        while (node) {
          if (window.getComputedStyle(node).position === 'fixed') return 'fixed';
          node = node.parentElement;
        }
        return 'not-fixed';
      }
    );
    expect(outerPos).toBe('fixed');
  });

  test('フルスクリーン解除ボタンが右上に存在する', async ({ page }) => {
    await loadPage(page);

    // Minimize2 アイコンのボタン（フルスクリーン解除）が存在すること
    const exitBtn = page.locator('button[aria-label="Exit fullscreen"]');
    await expect(exitBtn).toBeVisible();

    const box = await exitBtn.boundingBox();
    expect(box).not.toBeNull();

    // 右上にある: 画面右半分 かつ 上半分
    expect(box!.x).toBeGreaterThan(375 / 2);
    expect(box!.y).toBeLessThan(812 / 2);
  });
});

// ───────────────────────────────────────────────
// カテゴリ 7: インタラクションテスト
// ───────────────────────────────────────────────
test.describe('カテゴリ7: インタラクション', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('駅設定ボタンをタップするとポップオーバーが開く', async ({ page }) => {
    await loadPage(page);

    const stationBtn = page.locator('button[aria-expanded]').first();
    await expect(stationBtn).toHaveAttribute('aria-expanded', 'false');

    await stationBtn.tap();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(stationBtn).toHaveAttribute('aria-expanded', 'true');
  });

  test('ポップオーバーを開いた後バックドロップをタップすると閉じる', async ({ page }) => {
    await loadPage(page);

    await page.locator('button[aria-expanded]').first().tap();
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // バックドロップ（inset:0 の透明レイヤー）をタップして閉じる
    await page.mouse.click(370, 100); // 右上（ボタン・ポップオーバー外）
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('詳細設定ボタンをタップするとポップオーバーが切り替わる', async ({ page }) => {
    await loadPage(page);

    const buttons = page.locator('button[aria-expanded]');
    await buttons.first().tap(); // 駅設定を開く
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    await buttons.last().tap(); // 詳細設定に切り替え
    await expect(page.locator('[role="dialog"]')).toBeVisible(); // まだ開いている
    await expect(buttons.last()).toHaveAttribute('aria-expanded', 'true');
    await expect(buttons.first()).toHaveAttribute('aria-expanded', 'false');
  });

  test('ボタンサイズが文字に対して適切（過大でない）', async ({ page }) => {
    await loadPage(page);

    const btn = page.locator('button[aria-expanded]').first();
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();

    // 高さが 50px 以下（以前の 44px から縮小済み）
    expect(box!.height).toBeLessThanOrEqual(50);
    // 幅が 120px 以下（テキストに対して過大でない）
    expect(box!.width).toBeLessThanOrEqual(120);
  });
});
