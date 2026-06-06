import React from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation'
import type { Language } from '../../utils/translation';
import ToggleableItem from '../ui/ToggleableItem';
import RouteRecommendationItem from '../ui/RouteRecommendationItem';

interface RouteSegment {
  routeKey: string;
  startIndex: number;
  endIndex: number;
  time: number;
  stations?: { name: string }[];
  isWalkingTransfer?: boolean;
  walkingTime?: number;
}

interface RouteRecommendation {
  segments: RouteSegment[];
  totalTime: number;
  transfers: number;
}

interface LegendRouteRecommendationsProps {
  routeRecommendations: RouteRecommendation[];
  selectedRouteIndices: Set<number> | null;
  theme: 'light' | 'dark';
  language: Language;
  onRouteToggle: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const LegendRouteRecommendations: React.FC<LegendRouteRecommendationsProps> = ({
  routeRecommendations,
  selectedRouteIndices,
  theme,
  language,
  onRouteToggle,
  onSelectAll,
  onDeselectAll
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

      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '8px'
      }}>
        <button
          onClick={onSelectAll}
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
          onClick={onDeselectAll}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {routeRecommendations.map((route, index) => {
          const isSelected = selectedRouteIndices === null || selectedRouteIndices.has(index);

          return (
            <RouteRecommendationItem
              key={index}
              route={route}
              index={index}
              isSelected={isSelected}
              theme={theme}
              language={language}
              onToggle={onRouteToggle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LegendRouteRecommendations;
