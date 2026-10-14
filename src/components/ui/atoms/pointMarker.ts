import type { CSSProperties } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { L } from '../../legend/legendStyles';
import { CONTROL_BORDER_WIDTH } from './controlSize';

/** 非操作の位置の印。画面上の外径を固定し、色によって寸法を変えない。 */
export const POINT_MARKER = { diameterPx: 6, borderWidthPx: CONTROL_BORDER_WIDTH } as const;

export function pointMarkerStyle(color: string, theme: 'light' | 'dark'): CSSProperties {
  return {
    display: 'block', width: POINT_MARKER.diameterPx, height: POINT_MARKER.diameterPx,
    boxSizing: 'border-box', borderRadius: L.r.pill, backgroundColor: color,
    border: `${POINT_MARKER.borderWidthPx}px solid ${getThemeColors(theme).surface}`,
  };
}
