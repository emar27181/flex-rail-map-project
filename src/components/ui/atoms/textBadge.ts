import type { CSSProperties } from 'react';
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import { filledLabelColors } from '../../../utils/contrast';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { textHalo } from './shadow';

/** 色と文字だけを受け取る小ラベル。用途・翻訳・描画エンジンには依存しない。 */
export function textBadgeStyle(color: string, theme: 'light' | 'dark'): CSSProperties {
  const colors = filledLabelColors(color, theme);
  return {
    backgroundColor: colors.background, color: colors.text,
    fontSize: FS.caption, fontWeight: 700, fontFamily: 'inherit', lineHeight: 1.2,
    padding: `${L.sp.xxs} ${L.sp.xs}`, borderRadius: L.r.control, whiteSpace: 'nowrap',
    textShadow: colors.needsHalo ? textHalo('soft') : undefined,
  };
}

/**
 * 塗りの無い小さな文字ラベル（地図・立体表示の駅名など、数が多くて塗りの箱だと地図を埋めてしまうもの）。
 * 文字色は地の上で読める色、ダークでは縁取りを付ける。大きさは呼び出し側の地図の文字の大きさ（MAP_LABEL）を渡す
 */
export function plainTextLabelStyle(theme: 'light' | 'dark', fontPx: number): CSSProperties {
  const colors = getThemeColors(theme);
  return {
    color: colors.text,
    fontSize: `${fontPx}px`, fontWeight: 600, fontFamily: 'inherit', lineHeight: 1.2,
    whiteSpace: 'nowrap',
    textShadow: theme === 'dark' ? textHalo('strong') : undefined,
  };
}
