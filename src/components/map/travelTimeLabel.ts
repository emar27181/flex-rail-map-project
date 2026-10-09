import { FS } from '../../constants/ui';
import { L } from '../legend/legendStyles';

/** 地図の所要時間。最小文字サイズを維持し、通常ウェイトの数字を円に収める。 */
export const TRAVEL_TIME_LABEL = {
  fontSizePx: parseFloat(FS.caption),
  lineHeight: 1.2,
  paddingXPx: parseFloat(L.sp.xxs),
  paddingYPx: 0,
  fontWeight: 400,
  borderWidthPx: 1,
  /** 通常ウェイトの等幅数字を余裕を持って見積もる。 */
  digitWidthEm: 0.6,
  radius: L.r.pill,
} as const;

export function travelTimeLabelLayout(time: number) {
  const text = String(Math.round(time));
  const token = TRAVEL_TIME_LABEL;
  const height = Math.ceil(token.fontSizePx * token.lineHeight)
    + 2 * (token.paddingYPx + token.borderWidthPx);
  const width = Math.max(height, Math.ceil(text.length * token.fontSizePx * token.digitWidthEm)
    + 2 * (token.paddingXPx + token.borderWidthPx));
  const diameter = Math.max(width, height);
  return { text, width: diameter, height: diameter, anchor: [diameter / 2, diameter / 2] as [number, number] };
}
