/**
 * 地図の上に浮かせて置く、文字つきのボタン（アトム）。
 *
 * 「表示切替」（スマホ全画面の左下）・「表示中の路線」（凡例の見出し）のように、
 * 地図の上に単体で浮かぶボタンの見た目をここ1箇所で決める。
 * 以前はボタンごとに高さ・背景・影を書いていて、右上の丸いボタン（36px）と
 * 「表示切替」「表示中の路線」の高さがそろっていなかった。
 *
 * - 高さ・文字の大きさ・角の丸みは `FLOATING_CONTROL`（丸いボタン・凡例・駅選択と共通）
 * - 地（透け具合・ぼかし・枠線・影・角の丸み）は floatingSurface.ts。押している（開いている）間は Button の塗り
 * - 文字・余白・角丸は Button（`CONTROL_SIZE.md`）のまま
 *
 * 丸いアイコンだけのボタン（IconButton）にも同じ地を付けるときは
 * `floatingSurfaceStyle`（floatingSurface.ts）を styleOverride に渡す。
 */
import React from 'react';
import type { ReactNode } from 'react';
import Button from './Button';
import type { ButtonProps } from './Button';
import { FLOATING_CONTROL } from './controlSize';
import { floatingSurfaceStyle, floatingShadow } from './floatingSurface';

/** 地図の上に浮かぶボタンの高さ(px)。丸いアイコンボタンと同じ */
export const FLOATING_BUTTON_HEIGHT = FLOATING_CONTROL.height;

/** 地の規格は floatingSurface.ts（ここから使う所のために再公開する） */
export { floatingSurfaceStyle } from './floatingSurface';

export interface FloatingButtonProps extends Omit<ButtonProps, 'variant' | 'size' | 'styleOverride' | 'children'> {
  /** 文字の後ろに置くもの（開閉の向きを示す印など） */
  trailing?: ReactNode;
  children: ReactNode;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ theme, pressed, trailing, children, ...rest }) => {
  return (
    <Button
      {...rest}
      theme={theme}
      variant="primary"
      size="md"
      pressed={pressed}
      styleOverride={{
        // 押している間は Button の塗りをそのまま使う（ここで背景を上書きすると塗りが消える）
        ...(pressed ? { boxShadow: floatingShadow(theme), borderRadius: FLOATING_CONTROL.radius } : floatingSurfaceStyle(theme)),
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
