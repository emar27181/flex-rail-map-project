import React from 'react';
import { translateUI } from '../../utils/translation';
import ToggleableItem from './ToggleableItem';

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

interface RouteRecommendationItemProps {
  route: RouteRecommendation;
  index: number;
  isSelected: boolean;
  theme: 'light' | 'dark';
  language: 'japanese' | 'english';
  onSelect: (route: RouteRecommendation) => void;
}

const RouteRecommendationItem: React.FC<RouteRecommendationItemProps> = ({
  route,
  index,
  isSelected,
  theme,
  language,
  onSelect
}) => {
  const routeLabel = `${translateUI('routeNumber', language, { number: (index + 1).toString() })} → (${translateUI('minutesShort', language, { time: Math.round(route.totalTime).toString() })}, ${translateUI('transfersCount', language, { count: route.transfers.toString() })})`;

  return (
    <ToggleableItem
      id={`route-${index}`}
      label={routeLabel}
      isActive={isSelected}
      isHighlighted={isSelected}
      theme={theme}
      inputType="radio"
      inputName="routeSelection"
      colorIndicator={{
        color: '#4CAF50',
        opacity: 1
      }}
      badge={isSelected ? translateUI('selected', language) : undefined}
      onToggle={() => onSelect(route)}
    />
  );
};

export default RouteRecommendationItem;