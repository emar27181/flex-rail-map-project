import React from 'react';
import type { CSSProperties } from 'react';
import type { RouteKey } from '../../data/routes';
import { translateRoute } from '../../utils/translation';
import type { Language } from '../../utils/translation';
import Chip from '../ui/atoms/Chip';

interface RouteToggleChipProps {
  routeKey: RouteKey;
  routeName: string;
  routeColor: string;
  isVisible: boolean;
  theme: 'light' | 'dark';
  language: Language;
  onToggle: (routeKey: RouteKey) => void;
  adjustRouteColorForTheme: (color: string, theme: 'light' | 'dark') => string;
  size?: 'sm' | 'md' | 'lg';
  styleOverride?: CSSProperties;
  dataAttr?: Record<string, string>;
}

/**
 * 路線の表示/非表示を切り替える共通チップ（organism）。
 *
 * 路線（RouteKey・路線名の翻訳）を知っているので ui/molecules ではなくここに置く
 * （「路線」という語を部品から消せないなら organism。CLAUDE.md の層の分け方）。
 * 見た目は Chip アトムのまま。
 *
 * 路線名の翻訳、テーマに応じた路線色補正、表示状態の見た目をここへ集約し、
 * 表示路線切替ボードと駅ツールチップで同じ部品を使う。
 */
const RouteToggleChip: React.FC<RouteToggleChipProps> = ({
  routeKey,
  routeName,
  routeColor,
  isVisible,
  theme,
  language,
  onToggle,
  adjustRouteColorForTheme,
  size = 'sm',
  styleOverride,
  dataAttr,
}) => (
  <Chip
    color={adjustRouteColorForTheme(routeColor, theme)}
    label={translateRoute(routeName, language)}
    selected={isVisible}
    theme={theme}
    size={size}
    onClick={() => onToggle(routeKey)}
    dataAttr={dataAttr}
    styleOverride={styleOverride}
  />
);

export default RouteToggleChip;
