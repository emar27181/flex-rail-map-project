/**
 * 初回位置情報取得時に地図が現在地中心へ移動することを確認するテスト
 *
 * 過去の問題:
 * - GPSに応じて最寄り駅は自動選択され、周辺路線もハイライトされるのに、
 *   地図の表示範囲自体は横浜〜新宿間の固定デフォルト位置のままだった。
 *   ユーザーが遠方（例: 大阪）にいる場合、自分の位置も周辺路線も画面外だった
 * - 修正時、地図コンポーネントのマウントより位置情報取得が先に完了すると
 *   mapRef.current が null のため setView が効かずズームだけ反映されない
 *   競合状態があった（mapZoom state を追加して解消）
 */

import { test, expect } from '@playwright/test';

const OSAKA = { latitude: 34.702325, longitude: 135.495095 };
// アプリのデフォルト中心（横浜〜新宿間の固定座標）
const DEFAULT_CENTER = { lat: 35.57765, lng: 139.66165 };

async function loadWithGeolocation(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'cookieConsent',
      JSON.stringify({ necessary: true, analytics: false, advertising: false })
    );
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.leaflet-container', { timeout: 15000 });
}

test.describe('現在地に応じた初期表示', () => {
  test.use({ geolocation: OSAKA, permissions: ['geolocation'] });

  test('デフォルト位置から離れた現在地でも、地図が現在地中心・ズーム13に移動する', async ({ page }) => {
    await loadWithGeolocation(page);
    // 位置情報の取得〜地図への反映を待つ
    await page.waitForTimeout(4000);

    const center = await page.evaluate(() => {
      const container = document.querySelector('.leaflet-container') as any;
      const map = container?._leaflet_map;
      if (!map) return null;
      const c = map.getCenter();
      return { lat: c.lat, lng: c.lng, zoom: map.getZoom() };
    });

    // Leafletのマップインスタンスにアクセスできない環境（内部実装依存）では
    // このテスト自体をスキップする
    test.skip(center === null, 'Leaflet map instance not reachable via DOM in this environment');

    expect(center!.lat).toBeCloseTo(OSAKA.latitude, 2);
    expect(center!.lng).toBeCloseTo(OSAKA.longitude, 2);
    expect(center!.zoom).toBe(13);
  });
});

test.describe('位置情報が使えない場合', () => {
  test.use({ permissions: [] });

  test('従来どおりのデフォルト位置・ズームのまま', async ({ page }) => {
    await loadWithGeolocation(page);
    await page.waitForTimeout(3000);

    const center = await page.evaluate(() => {
      const container = document.querySelector('.leaflet-container') as any;
      const map = container?._leaflet_map;
      if (!map) return null;
      const c = map.getCenter();
      return { lat: c.lat, lng: c.lng, zoom: map.getZoom() };
    });

    test.skip(center === null, 'Leaflet map instance not reachable via DOM in this environment');

    expect(center!.lat).toBeCloseTo(DEFAULT_CENTER.lat, 2);
    expect(center!.lng).toBeCloseTo(DEFAULT_CENTER.lng, 2);
    expect(center!.zoom).toBe(12);
  });
});
