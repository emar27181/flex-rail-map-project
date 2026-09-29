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
