/**
 * 地図の上に浮かせて置く、文字つきのボタン（アトム）。
 *
 * 「表示切替」（スマホ全画面の左下）・「表示中の路線」（凡例の見出し）のように、
 * 地図の上に単体で浮かぶボタンの見た目をここ1箇所で決める。
 * 以前はボタンごとに高さ・背景・影を書いていて、右上の丸いボタン（36px）と
 * 「表示切替」「表示中の路線」の高さがそろっていなかった。
 *
 * - 高さ・文字の大きさは `FLOATING_CONTROL`（丸いボタン・凡例の見出しと共通）
 * - 背景は下の地図が透けるガラス調。押している（開いている）間は Button の塗り
 * - 文字・余白・角丸は Button（`CONTROL_SIZE.md`）のまま
 *
 * 丸いアイコンだけのボタン（IconButton）にも同じ背景・影を付けるときは
 * `floatingSurfaceStyle` を styleOverride に渡す。
 */
import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import Button from './Button';
import type { ButtonProps } from './Button';
import { FLOATING_CONTROL } from './controlSize';

/** 地図の上に浮かぶボタンの高さ(px)。丸いアイコンボタンと同じ */
export const FLOATING_BUTTON_HEIGHT = FLOATING_CONTROL.height;

/** 地図の上に浮かぶ操作部品の共通の背景・影（押していないとき） */
export function floatingSurfaceStyle(theme: 'light' | 'dark'): CSSProperties {
  const colors = getThemeColors(theme);
  return {
    backgroundColor: colors.glassButton,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxShadow: `0 2px 8px ${colors.shadow}`,
  };
}

export interface FloatingButtonProps extends Omit<ButtonProps, 'variant' | 'size' | 'styleOverride' | 'children'> {
  /** 文字の後ろに置くもの（開閉の向きを示す印など） */
  trailing?: ReactNode;
  children: ReactNode;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ theme, pressed, trailing, children, ...rest }) => {
  const colors = getThemeColors(theme);
  return (
    <Button
      {...rest}
      theme={theme}
      variant="primary"
      size="md"
      pressed={pressed}
      styleOverride={{
        // 押している間は Button の塗りをそのまま使う（ここで背景を上書きすると塗りが消える）
        ...(pressed ? { boxShadow: `0 2px 8px ${colors.shadow}` } : floatingSurfaceStyle(theme)),
        minHeight: FLOATING_BUTTON_HEIGHT,
        height: FLOATING_BUTTON_HEIGHT,
        fontSize: FLOATING_CONTROL.fontSize,
        fontWeight: 'bold',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
      {trailing}
    </Button>
  );
};

export default FloatingButton;
