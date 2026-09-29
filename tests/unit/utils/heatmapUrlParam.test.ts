import { describe, it, expect } from 'vitest';
import { STAT_PARAMS } from '../../../src/data/stationStats';
import { isUrlHeatmapMetric } from '../../../src/utils/heatmapUrlParam';
import { buildMapHref } from '../../../src/utils/mapDeepLink';

describe('ヒートマップの指標のURLパラメータ', () => {
  it('実データの指標だけを受け付け、推定値・知らないキーは無視する', () => {
    expect(isUrlHeatmapMetric('restaurantCount')).toBe(true);
    const estimated = STAT_PARAMS.find(p => p.dataQuality === 'estimated')!;
    expect(isUrlHeatmapMetric(estimated.key)).toBe(false);
    expect(isUrlHeatmapMetric('unknownKey')).toBe(false);
    expect(isUrlHeatmapMetric(null)).toBe(false);
  });

  it('地図へのリンクに metric を付けられる（推定値の指標は付けない）', () => {
    expect(buildMapHref({ metric: 'restaurantCount' })).toBe('/?metric=restaurantCount');
    const estimated = STAT_PARAMS.find(p => p.dataQuality === 'estimated')!;
    expect(buildMapHref({ metric: estimated.key })).toBe('/');
  });
});

import { parseMapView } from '../../../src/utils/mapViewUrlParam';

describe('地図の表示位置のURLパラメータ', () => {
  it('中心と拡大率を読み、範囲外・不正な値は無視する', () => {
    expect(parseMapView('35.68,139.76', '13')).toEqual({ center: [35.68, 139.76], zoom: 13 });
    expect(parseMapView('35.68,139.76', '40')).toEqual({ center: [35.68, 139.76], zoom: undefined });
    expect(parseMapView('abc', '13')).toBeNull();
    expect(parseMapView(null, '13')).toBeNull();
  });

  it('地図へのリンクに center / zoom を付けられる', () => {
    expect(buildMapHref({ center: [35.68, 139.76], zoom: 13 })).toBe('/?center=35.68%2C139.76&zoom=13');
  });
});
