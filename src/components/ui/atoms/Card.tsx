import type { HTMLAttributes } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { L } from '../../legend/legendStyles';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'li' | 'article';
  theme: 'light' | 'dark';
  tone?: 'raised' | 'neutral';
}

/** 枠線を使わず、背景と余白でまとまりを示すカード。 */
export default function Card({ as: Element = 'div', theme, tone = 'raised', style, ...props }: CardProps) {
  const colors = getThemeColors(theme);
  return (
    <Element
      {...props}
      style={{
        backgroundColor: tone === 'raised' ? colors.surfaceElevated : colors.surfaceHover,
        borderRadius: L.r.card,
        padding: L.sp.md,
        ...style,
      }}
    />
  );
}
