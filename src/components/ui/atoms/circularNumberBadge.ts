import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import { shadow, type ShadowRole } from './shadow';

/** 汎用の円形数値バッジ。駅・路線・時間・Leafletには依存しない。 */
export const CIRCULAR_NUMBER_BADGE = {
  fontSizePx: parseFloat(FS.caption),
  lineHeight: 1.2,
  paddingXPx: parseFloat(L.sp.xxs),
  paddingYPx: 0,
  fontWeight: 700,
  borderWidthPx: 1,
  digitWidthEm: 0.65,
  radius: L.r.pill,
} as const;

export function circularNumberBadgeLayout(value: number) {
  const text = String(Math.round(value));
  const t = CIRCULAR_NUMBER_BADGE;
  const diameter = Math.max(
    Math.ceil(t.fontSizePx * t.lineHeight) + 2 * (t.paddingYPx + t.borderWidthPx),
    Math.ceil(text.length * t.fontSizePx * t.digitWidthEm) + 2 * (t.paddingXPx + t.borderWidthPx),
  );
  return { text, width: diameter, height: diameter, anchor: [diameter / 2, diameter / 2] as [number, number] };
}

/** HTMLを受け取る描画先向け。寸法とHTMLを同じアトムから取る。 */
export function circularNumberBadgeHtml(
  layout: ReturnType<typeof circularNumberBadgeLayout>,
  colors: { background: string; text: string; border: string },
  theme: 'light' | 'dark', role: ShadowRole = 'marker',
) {
  const t = CIRCULAR_NUMBER_BADGE;
  return `<div style="width:${layout.width}px;height:${layout.height}px;box-sizing:border-box;
    padding:${t.paddingYPx}px ${t.paddingXPx}px;border-radius:${t.radius};
    border:${t.borderWidthPx}px solid ${colors.border};background:${colors.background};
    display:flex;align-items:center;justify-content:center;box-shadow:${shadow(role, theme)};
    font-family:inherit;font-weight:${t.fontWeight};line-height:${t.lineHeight};white-space:nowrap;">
    <span style="font-size:${t.fontSizePx}px;color:${colors.text};">${layout.text}</span></div>`;
}
