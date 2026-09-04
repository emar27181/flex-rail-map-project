/**
 * チェックボックスの行（アトム）。
 *
 * 設定パネルの「◯◯を表示」が20箇所あり、いずれも
 * `<label style={checkboxLabel(colors)}><input type="checkbox" style={checkboxInput(colors)} />文言</label>`
 * を毎回手書きしていた。囲みを付け忘れた箇所は当たり判定が
 * ブラウザ既定の13pxしかなくなる。
 *
 * 行そのものがクリック対象なので、高さは controlSize の規格に合わせる。
 * 入力欄の大きさは指定しない（WCAG 2.2 AA 2.5.8 が測るのは
 * 「タップできる範囲」＝この行であり、四角を大きくしても得がない）。
 */
import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { SEMANTIC } from '../../../constants/ui';
import { CONTROL_SIZE } from './controlSize';
import type { ControlSize } from './controlSize';
import { L } from '../../legend/legendStyles';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  theme: 'light' | 'dark';
  size?: ControlSize;
  disabled?: boolean;
  styleOverride?: CSSProperties;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  children,
  theme,
  size = 'md',
  disabled = false,
  styleOverride,
}) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        // 行そのものがタップ対象。高さは他の操作部品と同じ規格から取る
        minHeight: `${dims.minHeight}px`,
        fontSize: dims.fontSize,
        color: colors.text,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        ...styleOverride,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          marginRight: L.sp.sm,
          cursor: disabled ? 'not-allowed' : 'pointer',
          accentColor: SEMANTIC.primary,
          // 長いラベルに押されて潰れないようにする
          flexShrink: 0,
        }}
      />
      {children}
    </label>
  );
};

export default Checkbox;
