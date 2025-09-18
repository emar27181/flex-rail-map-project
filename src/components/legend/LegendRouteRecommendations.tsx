import React from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation';
import ToggleableItem from '../ui/ToggleableItem';
import RouteRecommendationItem from '../ui/RouteRecommendationItem';

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
        <ToggleableItem
          id="show-all-routes"
          label={translateUI('showAllRoutesLabel', language)}
          isActive={!selectedRoute}
          isHighlighted={!selectedRoute}
          theme={theme}
          inputType="radio"
          inputName="routeSelection"
          onToggle={() => onShowAllRoutes()}
        />

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
            <RouteRecommendationItem
              key={index}
              route={route}
              index={index}
              isSelected={isSelected}
              theme={theme}
              language={language}
              onSelect={onRouteSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LegendRouteRecommendations;