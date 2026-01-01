import React from 'react';
import type { RouteKey } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation';
import RouteToggleItem from '../ui/RouteToggleItem';

interface RouteInfo {
  segments: Array<{
    routeKey: string;
  }>;
}

interface LegendRouteListProps {
  visibleRoutesData: Array<[string, any]>;
  visibleRoutes: Set<RouteKey>;
  availableRoutes: Set<RouteKey>;
  selectedRoute: RouteInfo | null;
  routeColors: Record<RouteKey, string>;
  routeNames: Record<RouteKey, string>;
  showTransferStationsOnly: boolean;
  showExpressStationsOnly: boolean;
  showTravelTimes: boolean;
  showStationNames: boolean;
  theme: 'light' | 'dark';
  language: 'japanese' | 'english';
  onToggleRoute: (routeKey: RouteKey) => void;
  onSelectAllRoutes: () => void;
  onDeselectAllRoutes: () => void;
  onShowTransferStationsOnlyChange: (value: boolean) => void;
  onShowExpressStationsOnlyChange: (value: boolean) => void;
  onShowTravelTimesChange: (value: boolean) => void;
  onShowStationNamesChange: (value: boolean) => void;
  adjustRouteColorForTheme: (color: string, theme: 'light' | 'dark') => string;
}

const LegendRouteList: React.FC<LegendRouteListProps> = ({
  visibleRoutesData,
  visibleRoutes,
  availableRoutes,
  selectedRoute,
  routeColors,
  routeNames,
  showTransferStationsOnly,
  showExpressStationsOnly,
  showTravelTimes,
  showStationNames,
  theme,
  language,
  onToggleRoute,
  onSelectAllRoutes,
  onDeselectAllRoutes,
  onShowTransferStationsOnlyChange,
  onShowExpressStationsOnlyChange,
  onShowTravelTimesChange,
  onShowStationNamesChange,
  adjustRouteColorForTheme
}) => {
  const colors = getThemeColors(theme);

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

      {visibleRoutesData.map(([routeKey]) => {
        const isVisible = visibleRoutes.has(routeKey as RouteKey);
        const isInSelectedRoute = selectedRoute && selectedRoute.segments.some(
          segment => segment.routeKey === routeKey && segment.routeKey !== 'walking'
        );

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

      {/* 表示オプション */}
      <div style={{ marginTop: '8px' }}>
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
          cursor: 'pointer'
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
      </div>
    </div>
  );
};

export default LegendRouteList;