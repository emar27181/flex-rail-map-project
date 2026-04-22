import React, { useState } from 'react';
import type { RouteKey } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation';
import RouteToggleItem from '../ui/RouteToggleItem';

type SortMode = 'name' | 'color' | 'default';

interface LegendRouteListProps {
  visibleRoutesData: Array<[string, any]>;
  visibleRoutes: Set<RouteKey>;
  availableRoutes: Set<RouteKey>;
  highlightedRouteKeys?: Set<RouteKey> | null;
  routeColors: Record<RouteKey, string>;
  routeNames: Record<RouteKey, string>;
  showTransferStationsOnly: boolean;
  showExpressStationsOnly: boolean;
  showTravelTimes: boolean;
  showStationNames: boolean;
  showFurigana: boolean;
  theme: 'light' | 'dark';
  language: 'japanese' | 'english';
  onToggleRoute: (routeKey: RouteKey) => void;
  onSelectAllRoutes: () => void;
  onDeselectAllRoutes: () => void;
  onShowTransferStationsOnlyChange: (value: boolean) => void;
  onShowExpressStationsOnlyChange: (value: boolean) => void;
  onShowTravelTimesChange: (value: boolean) => void;
  onShowStationNamesChange: (value: boolean) => void;
  onShowFuriganaChange: (value: boolean) => void;
  adjustRouteColorForTheme: (color: string, theme: 'light' | 'dark') => string;
}

const LegendRouteList: React.FC<LegendRouteListProps> = ({
  visibleRoutesData,
  visibleRoutes,
  availableRoutes,
  highlightedRouteKeys,
  routeColors,
  routeNames,
  showTransferStationsOnly,
  showExpressStationsOnly,
  showTravelTimes,
  showStationNames,
  showFurigana,
  theme,
  language,
  onToggleRoute,
  onSelectAllRoutes,
  onDeselectAllRoutes,
  onShowTransferStationsOnlyChange,
  onShowExpressStationsOnlyChange,
  onShowTravelTimesChange,
  onShowStationNamesChange,
  onShowFuriganaChange,
  adjustRouteColorForTheme
}) => {
  const colors = getThemeColors(theme);
  const [sortMode, setSortMode] = useState<SortMode>('name');

  // HEX色をHue値(0-360)に変換
  const hexToHue = (hex: string): number => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return 0;
    const d = max - min;
    let h = 0;
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return h * 60;
  };

  const sortedVisibleRoutesData = [...visibleRoutesData].sort(([keyA], [keyB]) => {
    if (sortMode === 'name') {
      const nameA = routeNames[keyA as RouteKey] || '';
      const nameB = routeNames[keyB as RouteKey] || '';
      return nameA.localeCompare(nameB, language === 'japanese' ? 'ja' : 'en');
    }
    if (sortMode === 'color') {
      const colorA = routeColors[keyA as RouteKey] ?? '#888';
      const colorB = routeColors[keyB as RouteKey] ?? '#888';
      return hexToHue(colorA.padEnd(7, '0')) - hexToHue(colorB.padEnd(7, '0'));
    }
    return 0; // default: 登録順のまま
  });

  return (
    <div style={{
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: colors.surface,
      borderRadius: '4px',
      border: `1px solid ${colors.borderLight}`
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: colors.text
      }}>
        {translateUI('routeDisplayToggle', language)}
      </div>

      {/* 表示オプション */}
      <div style={{ marginBottom: '8px' }}> {/* Removed marginTop to prevent double spacing */}
        {/* 乗換駅のみ表示オプション */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px',
          color: colors.text,
          cursor: 'pointer',
          marginBottom: '4px'
        }}>
          <input
            type="checkbox"
            checked={showTransferStationsOnly}
            onChange={(e) => onShowTransferStationsOnlyChange(e.target.checked)}
            style={{
              marginRight: '6px',
              cursor: 'pointer'
            }}
          />
          {translateUI('showOnlyTransferStations', language)}
        </label>

        {/* 急行駅のみ表示オプション */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px',
          color: colors.text,
          cursor: 'pointer',
          marginBottom: '4px'
        }}>
          <input
            type="checkbox"
            checked={showExpressStationsOnly}
            onChange={(e) => onShowExpressStationsOnlyChange(e.target.checked)}
            style={{
              marginRight: '6px',
              cursor: 'pointer'
            }}
          />
          {translateUI('showOnlyExpressStations', language)}
        </label>

        {/* 所要時間表示オプション */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px',
          color: colors.text,
          cursor: 'pointer',
          marginBottom: '4px'
        }}>
          <input
            type="checkbox"
            checked={showTravelTimes}
            onChange={(e) => onShowTravelTimesChange(e.target.checked)}
            style={{
              marginRight: '6px',
              cursor: 'pointer'
            }}
          />
          {translateUI('showTravelTimes', language)}
        </label>

        {/* 駅名表示オプション */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px',
          color: colors.text,
          cursor: 'pointer',
          marginBottom: '4px'
        }}>
          <input
            type="checkbox"
            checked={showStationNames}
            onChange={(e) => onShowStationNamesChange(e.target.checked)}
            style={{
              marginRight: '6px',
              cursor: 'pointer'
            }}
          />
          {translateUI('showStationNames', language)}
        </label>

        {/* ふりがな表示オプション（日本語モードのみ） */}
        {language === 'japanese' && (
          <label style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            color: colors.text,
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={showFurigana}
              onChange={(e) => onShowFuriganaChange(e.target.checked)}
              style={{
                marginRight: '6px',
                cursor: 'pointer'
              }}
            />
            {translateUI('showFurigana', language)}
          </label>
        )}
      </div>

      {/* ソート選択 */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', color: colors.textSecondary, whiteSpace: 'nowrap' }}>並順:</span>
        {(['name', 'color', 'default'] as SortMode[]).map(mode => {
          const label = mode === 'name' ? 'あいうえお' : mode === 'color' ? '色' : '登録順';
          return (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              style={{
                padding: '2px 6px',
                fontSize: '10px',
                border: `1px solid ${sortMode === mode ? colors.primary : colors.borderLight}`,
                borderRadius: '3px',
                backgroundColor: sortMode === mode ? colors.primary : 'transparent',
                color: sortMode === mode ? '#fff' : colors.textSecondary,
                cursor: 'pointer',
              }}
            >{label}</button>
          );
        })}
      </div>

      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '8px'
      }}>
        <button
          onClick={onSelectAllRoutes}
          style={{
            flex: 1,
            padding: '4px 8px',
            fontSize: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          {translateUI('allShow', language)}
        </button>
        <button
          onClick={onDeselectAllRoutes}
          style={{
            flex: 1,
            padding: '4px 8px',
            fontSize: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          {translateUI('allHide', language)}
        </button>
      </div>

      {sortedVisibleRoutesData.map(([routeKey]) => {
        const isVisible = visibleRoutes.has(routeKey as RouteKey);
        const isInSelectedRoute = !!(highlightedRouteKeys && highlightedRouteKeys.has(routeKey as RouteKey));

        return (
          <RouteToggleItem
            key={routeKey}
            routeKey={routeKey}
            routeName={routeNames[routeKey as RouteKey]}
            routeColor={routeColors[routeKey as RouteKey]}
            isVisible={isVisible}
            isInSelectedRoute={isInSelectedRoute}
            theme={theme}
            language={language}
            onToggle={onToggleRoute}
            adjustRouteColorForTheme={adjustRouteColorForTheme}
          />
        );
      })}
    </div>
  );
};

export default LegendRouteList;