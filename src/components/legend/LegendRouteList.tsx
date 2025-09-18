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
  selectedRoute: RouteInfo | null;
  routeColors: Record<RouteKey, string>;
  routeNames: Record<RouteKey, string>;
  theme: 'light' | 'dark';
  language: 'japanese' | 'english';
  onToggleRoute: (routeKey: RouteKey) => void;
  onSelectAllRoutes: () => void;
  onDeselectAllRoutes: () => void;
  adjustRouteColorForTheme: (color: string, theme: 'light' | 'dark') => string;
}

const LegendRouteList: React.FC<LegendRouteListProps> = ({
  visibleRoutesData,
  visibleRoutes,
  selectedRoute,
  routeColors,
  routeNames,
  theme,
  language,
  onToggleRoute,
  onSelectAllRoutes,
  onDeselectAllRoutes,
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
    </div>
  );
};

export default LegendRouteList;