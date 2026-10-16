import { describe, expect, it } from 'vitest';
import { resolveInitialMapView } from '../../../src/utils/mapViewUrlParam';
import { getRouteCode } from '../../../src/utils/routeUrlCodes';

describe('URLのroutes指定による地図の初期表示', () => {
  const encode = (...keys: Parameters<typeof getRouteCode>[0][]) =>
    new URLSearchParams({ routes: keys.map(k => getRouteCode(k)).join(',') });

  it('路線だけのURLでも、東京都心固定ではなく指定路線を表示する', () => {
    const view = resolveInitialMapView(encode('enoshimaElectricRailway'));
    expect(view).not.toBeNull();
    expect(view!.center[0]).toBeGreaterThan(35.2);
    expect(view!.center[0]).toBeLessThan(35.4);
    expect(view!.center[1]).toBeLessThan(139.7);
    expect(view!.zoom).toBeGreaterThan(3);
  });

  it('複数路線の範囲をまとめて計算する', () => {
    const a = resolveInitialMapView(encode('enoshimaElectricRailway'))!;
    const combined = resolveInitialMapView(encode('enoshimaElectricRailway', 'yamanote'))!;
    expect(combined.center[1]).toBeGreaterThan(a.center[1]);
    expect(combined.zoom!).toBeLessThan(a.zoom!);
  });

  it('明示的な中心とズームは路線の自動フィットより優先する', () => {
    const params = encode('enoshimaElectricRailway');
    params.set('center', '35.68,139.76');
    params.set('zoom', '12');
    expect(resolveInitialMapView(params)).toEqual({ center: [35.68, 139.76], zoom: 12 });
  });

  it('無効な路線指定では従来の初期位置へフォールバックする', () => {
    expect(resolveInitialMapView(new URLSearchParams('routes=unknown'))).toBeNull();
  });
});
