import { FS } from '../../constants/ui';
import { L } from '../legend/legendStyles';

/** 地図の所要時間。本文下限の文字サイズを維持し、桁数に合わせて横に広げる。 */
export const TRAVEL_TIME_LABEL = {
  fontSizePx: parseFloat(FS.caption),
  lineHeight: 1.2,
  paddingXPx: parseFloat(L.sp.xs),
  paddingYPx: parseFloat(L.sp.xxs),
  borderWidthPx: 1,
  /** 太字の等幅数字を余裕を持って見積もる。 */
  digitWidthEm: 0.7,
  radius: L.r.pill,
} as const;

export function travelTimeLabelLayout(time: number) {
  const text = String(Math.round(time));
  const token = TRAVEL_TIME_LABEL;
  const height = Math.ceil(token.fontSizePx * token.lineHeight)
    + 2 * (token.paddingYPx + token.borderWidthPx);
  const width = Math.max(height, Math.ceil(text.length * token.fontSizePx * token.digitWidthEm)
    + 2 * (token.paddingXPx + token.borderWidthPx));
  return { text, width, height, anchor: [width / 2, height / 2] as [number, number] };
}
