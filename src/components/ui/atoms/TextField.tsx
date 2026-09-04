/**
 * 1行入力欄（アトム）。
 *
 * 入力欄も操作部品なので、高さ・余白・角丸はボタンやチップと
 * 同じ規格（controlSize）から取る。以前は絞り込み欄だけ独自に
 * 書いていて、隣のボタンと高さが揃っていなかった。
 *
 * ただし文字サイズだけは規格の値を使わない。iOS Safari は
 * 16px 未満の入力欄にフォーカスするとページを自動拡大するため、
 * 入力欄は必ず FS.input(16px) にする。
 */
import React from 'react';
import type { CSSProperties } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from './controlSize';
import type { ControlSize } from './controlSize';

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'size'> {
  theme: 'light' | 'dark';
  size?: ControlSize;
  fullWidth?: boolean;
  styleOverride?: CSSProperties;
}

/**
 * ref を通す。呼び出し側が focus() や scrollIntoView() を使うため
 * （キーボード表示時の位置調整など）、ここで止めてはいけない。
 */
const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(({
  theme,
  size = 'md',
  fullWidth = true,
  styleOverride,
  ...rest
}, ref) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];

  return (
    <input
      {...rest}
      ref={ref}
      style={{
        width: fullWidth ? '100%' : undefined,
        boxSizing: 'border-box',
        minHeight: `${dims.minHeight}px`,
        padding: dims.padding,
        border: `${CONTROL_BORDER_WIDTH}px solid ${colors.border}`,
        borderRadius: dims.radius,
        backgroundColor: colors.surfaceElevated,
        color: colors.text,
        // iOS Safari の自動ズームを防ぐため入力欄だけは16pxを下回らせない
        fontSize: FS.input,
        ...styleOverride,
      }}
    />
  );
});

TextField.displayName = 'TextField';

export default TextField;
