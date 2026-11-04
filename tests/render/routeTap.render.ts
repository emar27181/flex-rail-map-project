/**
 * 地図の線をタップ（クリック）して路線の表示を切り替えられるか。
 *
 * 2026-11: スマホで地図の線をタップしても路線の表示が切り替わらないことがあった。
 * - 線の上に並ぶ所要時間のラベル（出発駅を選ぶと既定で出る）がタップを受け取る設定になっていて、
 *   指のタップを吸い取って何もしなかった（スマホのブラウザは指のずれを近くの押せる要素に合わせる）。
 *   ラベルは見せるだけにする（interactive={false}）
 * - iPhone の Safari は、ホバーで中身が変わる要素の1回目のタップをホバー扱いにする。指で操作する端末では
 *   線にホバーの処理（強調・路線名の吹き出し）を付けない（hooks/useCanHover.ts）。この描画テストのブラウザ
 *   （Chromium）は Safari のその挙動を持たないため、吹き出しが出ないことだけを確かめる
 */
import type { Page } from '@playwright/test';
import { test, expect } from './helpers';

const routesParam = (page: Page) =>
  page.evaluate(() => (new URLSearchParams(location.search).get('routes') || '').split(',').filter(Boolean));

/** 経路の計算が終わり、表示中の路線が落ち着くまで待つ（読み込みの途中は経路の路線で表示が置き換わる） */
async function waitForStableRoutes(page: Page) {
  let last = '';
  let stableSince = Date.now();
  await expect.poll(async () => {
    const now = (await routesParam(page)).join(',');
    if (now !== last) { last = now; stableSince = Date.now(); }
    return now.split(',').length > 1 && Date.now() - stableSince >= 2000;
  }, { timeout: 30_000, intervals: [250] }).toBe(true);
}

/**
 * 押せる駅のマーカーから離れた点か。スマホのブラウザは指のずれを近くの押せる要素に合わせるため、
 * 駅のすぐ近くを押すと駅（押すと駅の情報が出る）に吸われる。それは正しい動きなので、テストでは駅から離れた点を押す
 */
const FAR_FROM_MARKERS_PX = 16;

/** 表示中の路線の当たり判定の線（すぐ前に濃い線がある太い透明な線）の上で、画面の中ほどにあり駅から離れた1点 */
const visibleRouteHitPoint = (page: Page) => page.evaluate((far) => {
  const markers = [...document.querySelectorAll('.leaflet-marker-icon.leaflet-interactive')].map(m => m.getBoundingClientRect());
  const farFromMarkers = (x: number, y: number) => markers.every(r =>
    Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom)) > far);
  const isVisibleHit = (el: Element) => {
    const prev = el.previousElementSibling;
    return !!prev && prev.getAttribute('stroke-width') !== '36' && Number(prev.getAttribute('stroke-opacity')) >= 0.5;
  };
  const hits = [...document.querySelectorAll('.leaflet-overlay-pane path')]
    .filter(el => el.getAttribute('stroke-width') === '36' && isVisibleHit(el)) as SVGPathElement[];
  for (const el of hits) {
    const len = el.getTotalLength();
    for (let i = 1; i < 40; i++) {
      const q = el.getPointAtLength(len * i / 40);
      const m = el.getScreenCTM();
      if (!m) continue;
      const x = q.x * m.a + m.e, y = q.y * m.d + m.f;
      if (x > 40 && x < innerWidth - 40 && y > innerHeight * 0.4 && y < innerHeight - 160
        && document.elementFromPoint(x, y) === el && farFromMarkers(x, y)) {
        return { x, y };
      }
    }
  }
  return null;
}, FAR_FROM_MARKERS_PX);

test('地図の線を押すと路線の表示が切り替わる。指で操作する端末では路線名の吹き出し（ホバー）を出さない', async ({ page, isMobile }) => {
  // 経路を出さずに、山手線と中央線だけを表示し、駅と駅の間が空いている所（田町〜高輪ゲートウェイ）を拡大して開く。
  // 縮小した地図では表示中の線が駅名のラベルの下に隠れ、線を押すと駅を押すことになる（それは駅の情報を出す正しい動き）
  await page.goto('/?routes=yama,chuo&center=35.6406,139.7440&zoom=16&lang=ja');
  await expect.poll(async () => (await routesParam(page)).length, { timeout: 20_000 }).toBe(2);
  await expect.poll(() => visibleRouteHitPoint(page), { timeout: 15_000 }).not.toBeNull();

  const pt = (await visibleRouteHitPoint(page))!;
  if (isMobile) await page.touchscreen.tap(pt.x, pt.y);
  else await page.mouse.click(pt.x, pt.y);

  // 押した路線が非表示になる（1つ減る）
  await expect.poll(async () => (await routesParam(page)).length).toBe(1);

  if (isMobile) {
    // 指の端末ではホバーが無いと判定され、線に吹き出しを付けない
    expect(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)).toBe(false);
    await expect(page.locator('.leaflet-tooltip-pane .leaflet-tooltip')).toHaveCount(0);
  }
});

test('所要時間の数字（線の上に並ぶ）はタップを受け取らない（指のタップを吸って何もしなかった）', async ({ page }) => {
  await page.goto('/?from=shibuya&to=tokyo&lang=ja');
  await waitForStableRoutes(page);
  const labels = page.locator('.leaflet-travelTime-pane .leaflet-marker-icon');
  await expect.poll(() => labels.count(), { timeout: 15_000 }).toBeGreaterThan(0);
  const states = await labels.evaluateAll(els => els.map(el => ({
    interactive: el.classList.contains('leaflet-interactive'),
    pointerEvents: getComputedStyle(el).pointerEvents,
  })));
  expect(states.filter(s => s.interactive || s.pointerEvents !== 'none')).toEqual([]);
});
