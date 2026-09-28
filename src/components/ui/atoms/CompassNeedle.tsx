/**
 * 方位磁針の針（北=赤、南=白）。
 *
 * lucide-react には「北が赤い磁針」が無い（Compass / Navigation は単色で、
 * どちらが北か色で判別できない）ため、この形だけ自前のSVGで描く。
 * 色はデザイントークンから取る（赤=SEMANTIC.arrival、白=NEUTRAL.white）。
 * 白い半分はライトテーマの白背景に溶けるので、テーマの補助文字色で縁取る。
 */
import { SEMANTIC, NEUTRAL } from '../../../constants/ui';
import { getThemeColors } from '../../../contexts/ThemeContext';

export interface CompassNeedleProps {
  /** 針を回す角度（度、時計回り）。0 で北が真上 */
  rotationDeg: number;
  size: number;
  theme: 'light' | 'dark';
}

export default function CompassNeedle({ rotationDeg, size, theme }: CompassNeedleProps) {
  const outline = getThemeColors(theme).textSecondary;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      style={{ transform: `rotate(${rotationDeg}deg)`, transition: 'transform 0.15s linear' }}
    >
      <polygon points="12,2 17,12 7,12" fill={SEMANTIC.arrival} stroke={outline} strokeWidth={1} strokeLinejoin="round" />
      <polygon points="12,22 17,12 7,12" fill={NEUTRAL.white} stroke={outline} strokeWidth={1} strokeLinejoin="round" />
    </svg>
  );
}
