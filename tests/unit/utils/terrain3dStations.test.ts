/**
 * 立体表示の駅（点と駅名）を集める・駅名を重ならないように選ぶ計算のテスト。
 */
import { describe, it, expect } from 'vitest';
import { collectTerrainStations, placeLabels, estimateLabelWidth, SAME_STATION_KM } from '../../../src/utils/terrain3dStations';
import { routes, type RouteKey } from '../../../src/data/routes';

describe('立体表示の駅を集める', () => {
  it('同じ名前・近い位置の駅は1つにまとめ、通る路線の数を数える', () => {
    const data: Record<string, { name: string; lat: number; lng: number }[]> = {
      a: [{ name: '新宿', lat: 35.690, lng: 139.700 }, { name: '代々木', lat: 35.683, lng: 139.702 }],
      b: [{ name: '新宿', lat: 35.691, lng: 139.701 }],
    };
    const out = collectTerrainStations(['a', 'b'] as RouteKey[], k => data[k]);
    expect(out.find(s => s.name === '新宿')!.routeCount).toBe(2);
    expect(out.find(s => s.name === '代々木')!.routeCount).toBe(1);
    expect(out).toHaveLength(2);
  });

  it('同じ名前でも離れた駅は別の駅（同名別駅）。除く駅名は入れない', () => {
    const far = 0.01 * (SAME_STATION_KM + 1) / 1.1; // SAME_STATION_KM より遠い（緯度の差）
    const data: Record<string, { name: string; lat: number; lng: number }[]> = {
      a: [{ name: '大塚', lat: 35.731, lng: 139.728 }, { name: '東京', lat: 35.681, lng: 139.767 }],
      b: [{ name: '大塚', lat: 35.731 + far, lng: 139.728 }],
    };
    const out = collectTerrainStations(['a', 'b'] as RouteKey[], k => data[k], new Set(['東京']));
    expect(out.filter(s => s.name === '大塚')).toHaveLength(2);
    expect(out.some(s => s.name === '東京')).toBe(false);
  });

  it('同じ路線に同じ駅が2回あっても1路線として数える', () => {
    const out = collectTerrainStations(['yamanote'] as RouteKey[], k => routes[k]);
    expect(Math.max(...out.map(s => s.routeCount))).toBe(1);
  });
});

describe('駅名を重ならないように選ぶ', () => {
  it('通る路線が多い駅を先に置き、重なるものは出さない', () => {
    const picked = placeLabels([
      { x: 0, y: 0, w: 40, h: 10, priority: 1 },
      { x: 20, y: 0, w: 40, h: 10, priority: 3 }, // 1つ目と重なる。こちらが先
      { x: 100, y: 0, w: 40, h: 10, priority: 1 },
    ], 10);
    expect(picked).toEqual([1, 2]);
  });

  it('上限より多くは出さない', () => {
    const boxes = Array.from({ length: 5 }, (_, i) => ({ x: i * 100, y: 0, w: 10, h: 10, priority: 1 }));
    expect(placeLabels(boxes, 3)).toHaveLength(3);
  });

  it('駅名の幅は全角を1文字、半角を0.6文字として見積もる', () => {
    expect(estimateLabelWidth('新宿', 10)).toBe(20);
    expect(estimateLabelWidth('ab', 10)).toBeCloseTo(12);
  });
});
