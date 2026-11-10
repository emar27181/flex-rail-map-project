/**
 * スマホの2本指の操作（拡大・縮小・回転）が滑らかに動くか（2026-11）。
 *
 * 2本指で操作すると地図が止まる・カクつくと報告された。原因は2つあった。
 * - 回転を使えるようにしてあるだけで（北向きのままでも）、ピンチの毎フレームに全路線を再投影していた
 *   （utils/leafletRotatePatch.ts）
 * - 拡大しようとしただけで指の向きが少し変わり、そのたびに地図が回って全路線を描き直していた（utils/mapGestures.ts）
 *
 * ここでは、北向きのピンチ中に「路線を描き直さない（CSS の拡大縮小で動かす）」「それでも路線と駅がずれない」、
 * 小さなひねりでは回らず、大きくひねれば回ることを確かめる。指の操作は CDP の Input.dispatchTouchEvent で送る。
 */
import type { CDPSession, Page } from '@playwright/test';
import { test, expect } from './helpers';

/**
 * 地図（L.Map）を window.__map で触れるようにする。leaflet-rotate のために window.L へ渡される Leaflet に、
 * 地図が作られたときの処理を足す
 */
async function captureMap(page: Page) {
  await page.addInitScript(() => {
    let L: any;
    Object.defineProperty(window, 'L', {
      configurable: true,
      get: () => L,
      set: (v) => { L = v; v.Map.addInitHook(function (this: unknown) { (window as any).__map = this; }); },
    });
  });
}

async function setup(page: Page) {
  await captureMap(page);
  await page.goto('/?from=shinjuku&to=tokyo&lang=ja');
  await expect.poll(() => page.evaluate(() => !!(window as any).__map), { timeout: 30_000 }).toBe(true);
  await expect(page.locator('.leaflet-overlay-pane path').first()).toBeAttached({ timeout: 30_000 });
  await expect(page.locator('.leaflet-marker-icon').first()).toBeAttached({ timeout: 30_000 });
  // 経路の計算が終わって描き直しが落ち着くまで待つ
  await page.waitForTimeout(3000);
  const box = (await page.locator('.leaflet-container').boundingBox())!;
  return { cx: box.x + box.width / 2, cy: box.y + box.height / 2 };
}

const fingers = (c: { cx: number; cy: number }, dist: number, angleRad: number) => [
  { x: c.cx - dist * Math.cos(angleRad), y: c.cy - dist * Math.sin(angleRad), id: 0 },
  { x: c.cx + dist * Math.cos(angleRad), y: c.cy + dist * Math.sin(angleRad), id: 1 },
];

const touch = (cdp: CDPSession, type: 'touchStart' | 'touchMove' | 'touchEnd', pts: { x: number; y: number; id: number }[]) =>
  cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });

const nextFrames = (page: Page) => page.evaluate(() => new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r()))));

/**
 * 路線と同じ描き方（SVG）の小さな点を画面の中ほどに置き、点が描かれている位置と、
 * 地図の上で本来あるべき位置（駅マーカーと同じ計算）の差を測る。差が大きいと路線と駅がずれて見える
 */
const addProbes = (page: Page) => page.evaluate(() => {
  const map = (window as any).__map;
  const L = (window as any).L;
  const size = map.getSize();
  (window as any).__probes = [[0.35, 0.4], [0.65, 0.55], [0.5, 0.7]].map(([fx, fy]) => {
    const ll = map.containerPointToLatLng([size.x * fx, size.y * fy]);
    return L.circleMarker(ll, { radius: 4, interactive: false }).addTo(map);
  });
});

const probeOffsets = (page: Page) => page.evaluate(() => {
  const map = (window as any).__map;
  const box = map.getContainer().getBoundingClientRect();
  return ((window as any).__probes as any[]).map(probe => {
    const r = probe._path.getBoundingClientRect();
    const want = map.latLngToContainerPoint(probe.getLatLng());
    return Math.hypot(r.left + r.width / 2 - (box.left + want.x), r.top + r.height / 2 - (box.top + want.y));
  });
});

const zoomOf = (page: Page) => page.evaluate(() => (window as any).__map.getZoom() as number);

const rotatePaneTransform = (page: Page) =>
  page.evaluate(() => (document.querySelector('.leaflet-rotate-pane') as HTMLElement | null)?.style.transform ?? '');

test.describe('2本指の操作', () => {
  test.skip(({ isMobile }) => !isMobile, '指の操作はスマホだけ');

  test('北向きのピンチ中は路線を描き直さず、路線と駅がずれない', async ({ page, context }) => {
    const c = await setup(page);
    const cdp = await context.newCDPSession(page);
    await addProbes(page);
    const zoom0 = await zoomOf(page);

    // ピンチの間に路線の形（d 属性）が書き換わった回数を数える
    await page.evaluate(() => {
      (window as any).__pathRewrites = 0;
      const pane = document.querySelector('.leaflet-overlay-pane')!;
      (window as any).__pathObserver = new MutationObserver(list => {
        (window as any).__pathRewrites += list.filter(m => m.attributeName === 'd').length;
      });
      (window as any).__pathObserver.observe(pane, { subtree: true, attributes: true, attributeFilter: ['d'] });
    });

    await touch(cdp, 'touchStart', fingers(c, 60, 0.3));
    const worst: number[] = [];
    for (let i = 1; i <= 12; i++) {
      await touch(cdp, 'touchMove', fingers(c, 60 + i * 4, 0.3));
      await nextFrames(page);
      worst.push(Math.max(...await probeOffsets(page)));
    }
    const zoomMid = await zoomOf(page);
    const rewrites = await page.evaluate(() => { (window as any).__pathObserver.disconnect(); return (window as any).__pathRewrites as number; });
    await touch(cdp, 'touchEnd', []);
    await nextFrames(page);
    const after = await probeOffsets(page);

    expect(zoomMid - zoom0, 'ピンチで拡大されていない').toBeGreaterThan(0.3);
    expect(rewrites, 'ピンチ中に路線を描き直している（毎フレーム全路線の再投影は重い）').toBe(0);
    // 点の位置は整数に丸めて描かれ、それが拡大されるので 3px までは許す（ずれていたときは数十 px ずれる）
    expect(Math.max(...worst), `ピンチ中に路線と駅がずれている（px）: ${worst.map(o => o.toFixed(1)).join(', ')}`).toBeLessThan(3);
    expect(Math.max(...after), `指を離したあとに路線と駅がずれている（px）: ${after.map(o => o.toFixed(1)).join(', ')}`).toBeLessThan(3);
  });

  test('回した地図でピンチしても、路線と駅がずれない', async ({ page, context }) => {
    const c = await setup(page);
    const cdp = await context.newCDPSession(page);
    await page.evaluate(() => (window as any).__map.setBearing(30));
    await nextFrames(page);
    await addProbes(page);

    await touch(cdp, 'touchStart', fingers(c, 60, 0.3));
    const worst: number[] = [];
    for (let i = 1; i <= 12; i++) {
      await touch(cdp, 'touchMove', fingers(c, 60 + i * 4, 0.3));
      await nextFrames(page);
      worst.push(Math.max(...await probeOffsets(page)));
    }
    await touch(cdp, 'touchEnd', []);
    expect(Math.max(...worst), `回した地図のピンチ中に路線と駅がずれている（px）: ${worst.map(o => o.toFixed(1)).join(', ')}`).toBeLessThan(3);
  });

  test('拡大しようとして指の向きが少し変わっても地図は回らず、大きくひねると回る', async ({ page, context }) => {
    const c = await setup(page);
    const cdp = await context.newCDPSession(page);
    const start = await rotatePaneTransform(page);

    // 8 度だけひねりながら広げる
    await touch(cdp, 'touchStart', fingers(c, 60, 0.3));
    for (let i = 1; i <= 8; i++) await touch(cdp, 'touchMove', fingers(c, 60 + i * 4, 0.3 + (i / 8) * (8 * Math.PI / 180)));
    await touch(cdp, 'touchEnd', []);
    await nextFrames(page);
    expect(await rotatePaneTransform(page)).not.toMatch(/rotate\((?!0deg)/);
    expect(start).not.toMatch(/rotate\((?!0deg)/);

    // 60 度ひねる
    await touch(cdp, 'touchStart', fingers(c, 80, 0.3));
    for (let i = 1; i <= 20; i++) await touch(cdp, 'touchMove', fingers(c, 80, 0.3 + (i / 20) * (60 * Math.PI / 180)));
    await touch(cdp, 'touchEnd', []);
    await nextFrames(page);
    expect(await rotatePaneTransform(page)).toMatch(/rotate\((?!0deg)/);
  });
});
