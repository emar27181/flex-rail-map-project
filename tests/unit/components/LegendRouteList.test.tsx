/**
 * LegendRouteList コンポーネントのレンダリングテスト
 *
 * 目的:
 * - 必須 props が渡されているか検証（過去に stationSizeScale 未渡しで
 *   モバイルフルスクリーン時に TypeError クラッシュが発生した）
 * - stationSizeScale.toFixed(1) が undefined で呼ばれないことを確認
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LegendRouteList from '../../../src/components/legend/LegendRouteList';
import type { RouteKey } from '../../../src/data/routes';
import type { MapConfig } from '../../../src/components/legend/MapConfigPanel';

// Leaflet 非依存コンポーネントなのでモック不要
// ただし ThemeContext だけ必要

vi.mock('../../../src/contexts/ThemeContext', () => ({
  getThemeColors: () => ({
    background: '#fff', surface: '#f5f5f5', surfaceElevated: '#fff',
    surfaceHover: '#eee', border: '#ddd', borderLight: '#eee',
    text: '#333', textSecondary: '#666', textMuted: '#999',
    primary: '#4CAF50', success: '#4CAF50', warning: '#ff9800',
    error: '#f44336', info: '#2196f3', shadow: 'rgba(0,0,0,0.1)',
    mapBackground: '#f0f0f0', glassButton: 'rgba(255,255,255,0.9)',
  }),
}));

vi.mock('../../../src/utils/translation', () => ({
  translateUI: (key: string) => key,
  translateStation: (name: string) => name,
}));

vi.mock('../../../src/components/ui/RouteToggleItem', () => ({
  default: ({ routeKey }: { routeKey: string }) => <div data-testid={`route-${routeKey}`} />,
}));

vi.mock('../../../src/components/legend/MapConfigPanel', () => ({
  default: () => <div data-testid="map-config-panel" />,
}));

const noop = () => {};
const noopNum = (_v: number) => {};
const noopBool = (_v: boolean) => {};
const noopStr = (_v: string) => {};

const minimalProps = {
  visibleRoutesData: [] as Array<[string, any]>,
  visibleRoutes: new Set<RouteKey>(),
  availableRoutes: new Set<RouteKey>(),
  highlightedRouteKeys: null,
  routeColors: {} as Record<RouteKey, string>,
  routeNames: {} as Record<RouteKey, string>,
  showTransferStationsOnly: false,
  showExpressStationsOnly: false,
  showTravelTimes: false,
  showStationNames: true,
  showStationNumbers: false,
  showFurigana: false,
  showOsmTiles: true,
  theme: 'light' as const,
  language: 'japanese' as const,
  onToggleRoute: noop,
  onSelectAllRoutes: noop,
  onDeselectAllRoutes: noop,
  showDimmedRoutes: false,
  onShowDimmedRoutesChange: noopBool,
  onShowTransferStationsOnlyChange: noopBool,
  onShowExpressStationsOnlyChange: noopBool,
  onShowTravelTimesChange: noopBool,
  onShowStationNamesChange: noopBool,
  onShowStationNumbersChange: noopBool,
  onShowFuriganaChange: noopBool,
  onShowOsmTilesChange: noopBool,
  adjustRouteColorForTheme: (color: string) => color,
  viewCenter: [35.6812, 139.7671] as [number, number],
  showTrainDemo: false,
  onTrainDemoToggle: noop,
  mapViewMode: 'realistic' as const,
  onMapViewModeChange: noop,
  heatmapEnabled: false,
  heatmapParam: 'avgRent1K' as const,
  onHeatmapEnabledChange: noopBool,
  onHeatmapParamChange: noop,
  bubbleShape: 'circle' as const,
  onBubbleShapeChange: noop,
  showStationTooltip: false,
  onShowStationTooltipChange: noopBool,
  showFullRouteStations: true,
  onShowFullRouteStationsChange: noopBool,
  showRouteLine: true,
  onShowRouteLineChange: noopBool,
  mapConfig: {} as MapConfig,
  onImportConfig: noop,
  stationLabelFontSize: 11,
  onStationLabelFontSizeChange: noopNum,
  stationIconScale: 1.0,
  onStationIconScaleChange: noopNum,
  // ↓ これが今回のモバイルバグの原因: 未渡しだと stationSizeScale.toFixed(1) でクラッシュ
  stationSizeScale: 1.0,
  onStationSizeScaleChange: noopNum,
  travelTimeLabelMode: 'interval' as const,
  onTravelTimeLabelModeChange: noop,
};

describe('LegendRouteList', () => {
  it('必須 props が揃っていればクラッシュせずレンダリングできる', () => {
    expect(() => render(<LegendRouteList {...minimalProps} />)).not.toThrow();
  });

  it('stationSizeScale が数値のとき toFixed(1) でクラッシュしない', () => {
    // stationSizeScale=1.0 で正常にレンダリングできることを確認
    const { container } = render(<LegendRouteList {...minimalProps} stationSizeScale={1.0} />);
    expect(container).toBeTruthy();
    // "1.0x" というテキストが表示されている
    expect(container.textContent).toContain('1.0x');
  });

  it('stationSizeScale=0.5 の境界値でもクラッシュしない', () => {
    expect(() =>
      render(<LegendRouteList {...minimalProps} stationSizeScale={0.5} />)
    ).not.toThrow();
  });

  it('stationSizeScale=2.0 の境界値でもクラッシュしない', () => {
    expect(() =>
      render(<LegendRouteList {...minimalProps} stationSizeScale={2.0} />)
    ).not.toThrow();
  });
});
