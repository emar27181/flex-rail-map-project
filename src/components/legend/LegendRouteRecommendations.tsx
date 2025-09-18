import React from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation';

interface RouteSegment {
  routeKey: string;
  startIndex: number;
  endIndex: number;
}

interface RouteRecommendation {
  segments: RouteSegment[];
  totalTime: number;
  transfers: number;
}

interface LegendRouteRecommendationsProps {
  routeRecommendations: RouteRecommendation[];
  selectedRoute: RouteRecommendation | null;
  theme: 'light' | 'dark';
  language: 'japanese' | 'english';
  onRouteSelect: (route: RouteRecommendation) => void;
  onShowAllRoutes: () => void;
}

const LegendRouteRecommendations: React.FC<LegendRouteRecommendationsProps> = ({
  routeRecommendations,
  selectedRoute,
  theme,
  language,
  onRouteSelect,
  onShowAllRoutes
}) => {
  const colors = getThemeColors(theme);

  if (routeRecommendations.length === 0) {
    return null;
  }

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
        {translateUI('routeSelection', language)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px',
          color: colors.text,
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '3px',
          backgroundColor: !selectedRoute ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
          border: !selectedRoute ? '1px solid #007bff' : '1px solid transparent'
        }}>
          <input
            type="radio"
            name="routeSelection"
            checked={!selectedRoute}
            onChange={() => onShowAllRoutes()}
            style={{
              marginRight: '8px',
              cursor: 'pointer'
            }}
          />
          {translateUI('showAllRoutesLabel', language)}
        </label>

        {routeRecommendations.map((route, index) => {
          const isSelected = selectedRoute &&
            route.segments.length === selectedRoute.segments.length &&
            route.segments.every((segment, segIndex) => {
              const selectedSegment = selectedRoute.segments[segIndex];
              return (
                segment.routeKey === selectedSegment.routeKey &&
                segment.startIndex === selectedSegment.startIndex &&
                segment.endIndex === selectedSegment.endIndex
              );
            });

          return (
            <label key={index} style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
              color: colors.text,
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '3px',
              backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.25)' : 'transparent',
              border: isSelected ? '2px solid #2196F3' : '1px solid transparent'
            }}>
              <input
                type="radio"
                name="routeSelection"
                checked={isSelected}
                onChange={() => onRouteSelect(route)}
                style={{
                  marginRight: '8px',
                  cursor: 'pointer'
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: isSelected ? 'bold' : 'normal',
                color: isSelected ? colors.primary : colors.text
              }}>
                <span>{translateUI('routeNumber', language, { number: (index + 1).toString() })}</span>
                <span style={{
                  color: '#4CAF50',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>→</span>
                <span>({translateUI('minutesShort', language, { time: Math.round(route.totalTime).toString() })}, {translateUI('transfersCount', language, { count: route.transfers.toString() })})</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default LegendRouteRecommendations;