/**
 * ラジオボタンの行（アトム）。
 *
 * 見た目・当たり判定の規則はチェックボックスと同じ。
 * 違うのは「同じ name のうち1つだけ選べる」ところだけなので、
 * 寸法は Checkbox と同じ controlSize から取る。
 */
import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { SEMANTIC } from '../../../constants/ui';
import { CONTROL_SIZE } from './controlSize';
import type { ControlSize } from './controlSize';
import { L } from '../../legend/legendStyles';

export interface RadioProps {
  /** 同じ選択肢グループを表す名前 */
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  theme: 'light' | 'dark';
  size?: ControlSize;
  disabled?: boolean;
  styleOverride?: CSSProperties;
}

const Radio: React.FC<RadioProps> = ({
  name,
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
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        style={{
          marginRight: L.sp.sm,
          cursor: disabled ? 'not-allowed' : 'pointer',
          accentColor: SEMANTIC.primary,
          flexShrink: 0,
        }}
      />
      {children}
    </label>
  );
};

export default Radio;
