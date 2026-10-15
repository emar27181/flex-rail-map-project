import { describe, expect, it } from 'vitest';
import { averageStationRouteColor } from '../../../src/utils/stationRouteColor';
import type { RouteKey } from '../../../src/data/routes';

describe('route-based 3D station color', () => {
  it('one route retains the source color without washing out to grey', () => {
    expect(averageStationRouteColor(['yamanote'] as RouteKey[], () => '#008000').getHexString()).toBe('008000');
  });
  it('multiple routes are averaged from black, not white', () => {
    const color = averageStationRouteColor(['yamanote', 'chuo'] as RouteKey[], key => key === 'yamanote' ? '#ff0000' : '#0000ff');
    expect(color.getHexString()).not.toBe('ffffff');
    expect(color.r).toBeCloseTo(0.5);
    expect(color.g).toBeCloseTo(0);
    expect(color.b).toBeCloseTo(0.5);
  });
});
