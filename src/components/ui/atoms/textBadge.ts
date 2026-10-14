import type { CSSProperties } from 'react';
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import { filledLabelColors } from '../../../utils/contrast';
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
