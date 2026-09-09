/**
 * LegendRouteList コンポーネントのレンダリングテスト
 *
 * 目的:
 * - 必須 props が渡されているか検証（過去に stationSizeScale 未渡しで
 *   モバイルフルスクリーン時に TypeError クラッシュが発生した）
 * - stationSizeScale.toFixed(1) が undefined で呼ばれないことを確認
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
  translateRoute: (name: string) => name,
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
  routeOrder: [] as any[],
  onRouteOrderChange: noop,
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
  bubbleMaxRadiusM: 5000,
  onBubbleMaxRadiusMChange: noop,
  routeLineWidth: 3,
  onRouteLineWidthChange: noop,
  showStationTierBadges: true,
  onShowStationTierBadgesChange: noopBool,
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
  travelTimeStyle: {},
  onTravelTimeStyleChange: noop,
  stationIconStyle: {},
  onStationIconStyleChange: noop,
};

describe('LegendRouteList', () => {
  it('必須 props が揃っていればクラッシュせずレンダリングできる', () => {
    expect(() => render(<LegendRouteList {...minimalProps} />)).not.toThrow();
  });

  it('stationSizeScale が数値のとき toFixed(1) でクラッシュしない', () => {
    // stationSizeScale=1.0 で正常にレンダリングできることを確認（アイコンサイズは地図表示グループ内=閉じ状態のため表示されない）
    const { container } = render(<LegendRouteList {...minimalProps} stationSizeScale={1.0} />);
    expect(container).toBeTruthy();
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

describe('路線一覧の表示方式（ボード / 従来の一覧）と並び順', () => {
  const twoRouteProps = {
    ...minimalProps,
    visibleRoutesData: [
      ['routeB', [{ lat: 35.0, lng: 139.0 }]],
      ['routeA', [{ lat: 36.0, lng: 140.0 }]],
    ] as Array<[string, any]>,
    routeOrder: ['routeB', 'routeA'] as RouteKey[],
    routeNames: { routeA: 'あ路線', routeB: 'ん路線' } as Record<RouteKey, string>,
    routeColors: { routeA: '#ff0000', routeB: '#00ff00' } as Record<RouteKey, string>,
    viewCenter: [35.0, 139.0] as [number, number], // routeB のほうが画面中心に近い
  };

  it('従来の一覧への切り替えボタンは出さず、ボード表示のみになる', () => {
    render(<LegendRouteList {...twoRouteProps} />);
    expect(screen.queryByText('routeViewBoard')).not.toBeInTheDocument();
    expect(screen.queryByText('routeViewClassic')).not.toBeInTheDocument();
  });

  it('並び順の切り替えは表示方式によらず出る', () => {
    render(<LegendRouteList {...twoRouteProps} />);
    expect(screen.getByText('sortAlpha')).toBeInTheDocument();
    expect(screen.getByText('sortColor')).toBeInTheDocument();
    expect(screen.getByText('sortDefault')).toBeInTheDocument();
    expect(screen.getByText('sortNearby')).toBeInTheDocument();
  });

  it('並び順（あいうえお順）に切り替えるとボード表示のチップ順が変わる', () => {
    const { container } = render(<LegendRouteList {...twoRouteProps} />);
    const chipOrder = () =>
      Array.from(container.querySelectorAll('[data-route-chip]')).map(el => el.getAttribute('data-route-chip'));

    // 既定は近い順（distance）: 画面中心に近い routeB が先
    expect(chipOrder()).toEqual(['routeB', 'routeA']);

    fireEvent.click(screen.getByText('sortAlpha'));

    // あいうえお順: 「あ路線」(routeA) が「ん路線」(routeB) より先
    expect(chipOrder()).toEqual(['routeA', 'routeB']);
  });
});

describe('詳細設定（所要時間・駅アイコンの配色カスタム）', () => {
  it('見出しを開くと文字色・背景色・枠線色のスウォッチが両方の対象に出る', () => {
    const { container } = render(<LegendRouteList {...minimalProps} />);
    fireEvent.click(screen.getByText('settingsGroupDetail'));

    expect(screen.getByText('travelTimeStyleTitle')).toBeInTheDocument();
    expect(screen.getByText('stationIconStyleTitle')).toBeInTheDocument();
    expect(screen.getAllByText('styleTextColor')).toHaveLength(2);
    expect(screen.getAllByText('styleBgColor')).toHaveLength(2);
    expect(screen.getAllByText('styleBorderColor')).toHaveLength(2);

    const colorInputs = container.querySelectorAll('input[type="color"]');
    expect(colorInputs).toHaveLength(6); // 2対象 × (文字色・背景色・枠線色)
  });

  it('未設定のときはリセットボタンを出さない', () => {
    render(<LegendRouteList {...minimalProps} travelTimeStyle={{}} stationIconStyle={{}} />);
    fireEvent.click(screen.getByText('settingsGroupDetail'));
    expect(screen.queryByText('styleReset')).not.toBeInTheDocument();
  });

  it('1項目でも設定しているとその対象だけリセットボタンが出る', () => {
    render(<LegendRouteList {...minimalProps} travelTimeStyle={{ textColor: '#ff0000' }} stationIconStyle={{}} />);
    fireEvent.click(screen.getByText('settingsGroupDetail'));
    expect(screen.getAllByText('styleReset')).toHaveLength(1);
  });

  it('色スウォッチを変更すると、その項目だけを含むオブジェクトでコールバックが呼ばれる', () => {
    const onTravelTimeStyleChange = vi.fn();
    render(
      <LegendRouteList
        {...minimalProps}
        travelTimeStyle={{ bgColor: '#000000' }}
        onTravelTimeStyleChange={onTravelTimeStyleChange}
      />
    );
    fireEvent.click(screen.getByText('settingsGroupDetail'));
    const [textColorInput] = screen.getAllByText('styleTextColor').map(
      (label) => label.parentElement!.querySelector('input[type="color"]')!,
    );
    fireEvent.change(textColorInput, { target: { value: '#123456' } });
    expect(onTravelTimeStyleChange).toHaveBeenCalledWith({ bgColor: '#000000', textColor: '#123456' });
  });

  it('リセットボタンを押すと空オブジェクトでコールバックが呼ばれる（自動配色に戻る）', () => {
    const onStationIconStyleChange = vi.fn();
    render(
      <LegendRouteList
        {...minimalProps}
        stationIconStyle={{ textColor: '#ff0000', borderColor: '#00ff00' }}
        onStationIconStyleChange={onStationIconStyleChange}
      />
    );
    fireEvent.click(screen.getByText('settingsGroupDetail'));
    fireEvent.click(screen.getByText('styleReset'));
    expect(onStationIconStyleChange).toHaveBeenCalledWith({});
  });
});
