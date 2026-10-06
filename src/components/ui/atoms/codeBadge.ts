/**
 * 駅番号（TY01 など）の小さな札。地図の駅ラベルと同じ配色規則（filledLabelColors: 路線色の地に白字）。
 * 駅・路線のページの表で、駅名の前に付ける。Astro では CodeBadge.astro を使う。
 */
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import { filledLabelColors } from '../../../utils/contrast';
import { textHaloCss } from './shadow';

export const CODE_BADGE_CLASS = 'code-badge';

/** 札の色（地図の駅ラベルと同じ）。読めない明るい色は縁取りを付ける */
export function codeBadgeStyle(color: string): string {
  const { background, text, needsHalo } = filledLabelColors(color, 'light');
  return `background-color: ${background}; color: ${text};${needsHalo ? ` ${textHaloCss('soft')}` : ''}`;
}

export const CODE_BADGE_CSS = `
.${CODE_BADGE_CLASS} {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0 ${L.sp.xs}; margin-right: ${L.sp.sm};
  border-radius: ${L.r.control};
  font-size: ${FS.caption}; font-weight: bold; line-height: 1.6;
  font-variant-numeric: tabular-nums; letter-spacing: 0.02em; white-space: nowrap;
  vertical-align: baseline;
}
`;
