/**
 * 選択欄（アトム）。
 *
 * 経路推薦数・時間フィルター・通知タイミングなどの `<select>` が
 * 各所で高さも文字サイズも別々に書かれていた。
 * 寸法はボタン・入力欄と同じ controlSize から取る。
 *
 * 入力欄と同じく文字サイズだけは規格から外して16px固定にする。
 * iOS Safari は16px未満の選択欄でもフォーカス時にページを拡大する。
 */
import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from './controlSize';
import type { ControlSize } from './controlSize';

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'style' | 'size'> {
  theme: 'light' | 'dark';
  size?: ControlSize;
  fullWidth?: boolean;
  children: ReactNode;
  styleOverride?: CSSProperties;
}

const Select: React.FC<SelectProps> = ({
  theme,
  size = 'md',
  fullWidth = false,
  children,
  styleOverride,
  ...rest
}) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];

  return (
    <select
      {...rest}
      style={{
        width: fullWidth ? '100%' : undefined,
        boxSizing: 'border-box',
        minHeight: `${dims.minHeight}px`,
        padding: dims.padding,
        border: `${CONTROL_BORDER_WIDTH}px solid ${colors.border}`,
        borderRadius: dims.radius,
        backgroundColor: colors.surfaceElevated,
        color: colors.text,
        cursor: 'pointer',
        // iOS Safari の自動ズームを防ぐため16pxを下回らせない
        fontSize: FS.input,
        ...styleOverride,
      }}
    >
      {children}
    </select>
  );
};

export default Select;
