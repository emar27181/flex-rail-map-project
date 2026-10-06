/**
 * 地図の上に浮かぶ箱・ボタンの「地」（背景の透け具合・ぼかし・枠線・影・角の丸み）の規格。
 *
 * 凡例「N路線」・隅の丸いボタン（縮小・言語・方位）・「表示切替」・駅選択・表示路線の切替・
 * 下から開くパネル・ヒートマップの凡例は、すべてここから地を取る。
 * 以前は場所ごとに透け具合（0.72 / 0.82 / 0.96 や直書きの rgba）・ぼかし（8 / 10 / 12px）・
 * 影の有無がばらばらで、隣り合う部品の見た目がそろっていなかった。
 *
 * - 透け具合: ThemeContext の FLOATING_OPACITY（idle / open）
 * - 角の丸み: controlSize.ts の FLOATING_CONTROL.radius
 * - ぼかし・影: このファイルの FLOATING_SURFACE
 * 見た目を変えるときは、この3か所のどれか1か所だけを直す。
 */
import type { CSSProperties } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { CONTROL_BORDER_WIDTH, FLOATING_CONTROL } from './controlSize';

/** 背景のぼかし(px)と影の広がり(px) */
/** ぼかしは、開いた箱も透かしたまま文字を読めるよう強めにする（iOS のすりガラスと同程度） */
export const FLOATING_SURFACE = { blurPx: 16, shadowOffsetPx: 2, shadowBlurPx: 8 } as const;

/**
 * - idle: 閉じている箱・ボタン（地図が透ける）
 * - open: 開いて中身を読む箱（少し濃いすりガラス）
 */
export type FloatingSurfaceState = 'idle' | 'open';

export function floatingSurfaceStyle(theme: 'light' | 'dark', state: FloatingSurfaceState = 'idle'): CSSProperties {
  const colors = getThemeColors(theme);
  const blur = `blur(${FLOATING_SURFACE.blurPx}px)`;
  return {
    backgroundColor: state === 'open' ? colors.glassOpen : colors.glassCollapsed,
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
    border: `${CONTROL_BORDER_WIDTH}px solid ${colors.border}`,
    borderRadius: FLOATING_CONTROL.radius,
    boxShadow: floatingShadow(theme),
  };
}

/** 浮かぶものの影（押している・塗っているときも同じ影を付ける） */
export function floatingShadow(theme: 'light' | 'dark'): string {
  return `0 ${FLOATING_SURFACE.shadowOffsetPx}px ${FLOATING_SURFACE.shadowBlurPx}px ${getThemeColors(theme).shadow}`;
}
