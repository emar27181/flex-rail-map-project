/**
 * 駅・路線のページに埋め込む地図の範囲（src/utils/fitMapView.ts）のテスト。
 * 路線全体が枠に収まる拡大率と中心になることを確かめる。
 */
import { describe, it, expect } from 'vitest';
import { fitMapView } from '../../../src/utils/fitMapView';

const box = { width: 720, height: 440 };

describe('fitMapView', () => {
  it('中心は点の範囲の真ん中', () => {
    const v = fitMapView([{ lat: 35.6, lng: 139.6 }, { lat: 35.7, lng: 139.8 }], box);
    expect(v.center).toEqual([35.65, 139.7]);
  });

  it('範囲が広いほど拡大率は小さい', () => {
    const near = fitMapView([{ lat: 35.65, lng: 139.69 }, { lat: 35.66, lng: 139.71 }], box);
    const far = fitMapView([{ lat: 35.4, lng: 139.4 }, { lat: 35.9, lng: 139.9 }], box);
    expect(far.zoom).toBeLessThan(near.zoom);
  });

  it('枠に収まる（Web メルカトルで横幅が余白を除いた幅以下）', () => {
    const pts = [{ lat: 35.4657, lng: 139.6223 }, { lat: 35.6580, lng: 139.7016 }]; // 横浜〜渋谷
    const { zoom } = fitMapView(pts, box);
    const px = (256 * Math.pow(2, zoom) * (139.7016 - 139.6223)) / 360;
    expect(px).toBeLessThanOrEqual(box.width * 0.7);
  });

  it('1駅だけでも最大の拡大率で止まる', () => {
    expect(fitMapView([{ lat: 35.68, lng: 139.76 }], box).zoom).toBe(14);
  });
});
