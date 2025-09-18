import React from 'react';
import type { RouteKey } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateRoute, translateUI } from '../../utils/translation';

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
          <div
            key={routeKey}
            onClick={() => onToggleRoute(routeKey as RouteKey)}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '3px',
              backgroundColor: isInSelectedRoute
                ? 'rgba(33, 150, 243, 0.25)'
                : isVisible
                  ? 'rgba(0, 123, 255, 0.1)'
                  : 'rgba(108, 117, 125, 0.1)',
              border: isInSelectedRoute
                ? '2px solid #2196F3'
                : `1px solid ${isVisible ? '#007bff' : '#6c757d'}`,
              transition: 'all 0.2s ease'
            }}
          >
            <input
              type="checkbox"
              checked={visibleRoutes.has(routeKey as RouteKey)}
              onChange={(e) => {
                e.stopPropagation();
                onToggleRoute(routeKey as RouteKey);
              }}
              style={{
                marginRight: '8px',
                cursor: 'pointer'
              }}
            />
            <div style={{
              width: '20px',
              height: '3px',
              backgroundColor: adjustRouteColorForTheme(routeColors[routeKey as RouteKey], theme),
              marginRight: '8px',
              borderRadius: '1px',
              flexShrink: 0,
              opacity: visibleRoutes.has(routeKey as RouteKey) ? 1 : 0.3
            }} />
            <span style={{
              color: isInSelectedRoute
                ? '#2196F3'
                : isVisible
                  ? colors.text
                  : colors.textMuted,
              lineHeight: '1.2',
              fontWeight: isInSelectedRoute ? 'bold' : 'normal'
            }}>
              {translateRoute(routeNames[routeKey as RouteKey], language)}
              {isInSelectedRoute && (
                <span style={{
                  fontSize: '10px',
                  marginLeft: '4px',
                  color: '#2196F3',
                  fontWeight: 'normal'
                }}>
                  ({translateUI('selected', language)})
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default LegendRouteList;