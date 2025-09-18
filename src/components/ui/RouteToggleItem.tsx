import React from 'react';
import type { RouteKey } from '../../data/routes';
import { translateRoute, translateUI } from '../../utils/translation';
import ToggleableItem from './ToggleableItem';

interface RouteToggleItemProps {
  routeKey: string;
  routeName: string;
  routeColor: string;
  isVisible: boolean;
  isInSelectedRoute: boolean;
  theme: 'light' | 'dark';
  language: 'japanese' | 'english';
  onToggle: (routeKey: RouteKey) => void;
  adjustRouteColorForTheme: (color: string, theme: 'light' | 'dark') => string;
}

const RouteToggleItem: React.FC<RouteToggleItemProps> = ({
  routeKey,
  routeName,
  routeColor,
  isVisible,
  isInSelectedRoute,
  theme,
  language,
  onToggle,
  adjustRouteColorForTheme
}) => {
  return (
    <ToggleableItem
      id={routeKey}
      label={translateRoute(routeName, language)}
      isActive={isVisible}
      isHighlighted={isInSelectedRoute}
      theme={theme}
      colorIndicator={{
        color: routeColor,
        opacity: 1
      }}
      badge={isInSelectedRoute ? translateUI('selected', language) : undefined}
      onToggle={(id) => onToggle(id as RouteKey)}
      adjustColorForTheme={adjustRouteColorForTheme}
    />
  );
};

export default RouteToggleItem;