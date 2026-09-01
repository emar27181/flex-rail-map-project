import React from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation'
import type { Language } from '../../utils/translation';
import ToggleableItem from '../ui/ToggleableItem';
import RouteRecommendationItem from '../ui/RouteRecommendationItem';
import Button from '../ui/atoms/Button';

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
  /**
   * 見出しを出すか。既定は出す。
   * 呼び出し側（スマホの下部パネルなど）が既に同じ見出しを持つ場合だけ false にする。
   */
  showTitle?: boolean;
}

const LegendRouteRecommendations: React.FC<LegendRouteRecommendationsProps> = ({
  routeRecommendations,
  selectedRouteIndices,
  theme,
  language,
  onRouteToggle,
  onSelectAll,
  onDeselectAll,
  showTitle = true
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
      {showTitle && (
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: colors.text
        }}>
          {translateUI('routeSelection', language)}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '8px'
      }}>
        <Button theme={theme} variant="positive" size="sm" onClick={onSelectAll} styleOverride={{ flex: 1 }}>
          {translateUI('allShow', language)}
        </Button>
        <Button theme={theme} variant="danger" size="sm" onClick={onDeselectAll} styleOverride={{ flex: 1 }}>
          {translateUI('allHide', language)}
        </Button>
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
