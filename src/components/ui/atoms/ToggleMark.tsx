/**
 * チェックの印だけ（アトム）。
 *
 * ラベル付きの行は Checkbox / Radio を使う。こちらは
 * 「行の見た目は呼び出し側が持っていて、印だけ欲しい」場合に使う。
 * 路線一覧の行のように、色の帯や件数など独自の中身を並べる行がそれにあたる。
 *
 * 大きさは指定しない。WCAG 2.2 AA 2.5.8 が測るのは「タップできる範囲」で、
 * この印は必ずクリック可能な行の中に置く運用のため、
 * 印そのものを大きくしても得がない（白い四角が目立つだけ）。
 * 行の外に単独で置く場合は、置く側で24px以上の当たり判定を用意すること。
 */
import React from 'react';
import type { CSSProperties } from 'react';
import { SEMANTIC } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';

export interface ToggleMarkProps {
  type?: 'checkbox' | 'radio';
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** ラジオのグループ名 */
  name?: string;
  disabled?: boolean;
  styleOverride?: CSSProperties;
}

const ToggleMark: React.FC<ToggleMarkProps> = ({
  type = 'checkbox',
  checked,
  onChange,
  name,
  disabled = false,
  styleOverride,
}) => (
  <input
    type={type}
    name={name}
    checked={checked}
    disabled={disabled}
    onChange={onChange}
    style={{
      marginRight: L.sp.sm,
      cursor: disabled ? 'not-allowed' : 'pointer',
      accentColor: SEMANTIC.primary,
      // 長いラベルに押されて潰れないようにする
      flexShrink: 0,
      ...styleOverride,
    }}
  />
);

export default ToggleMark;
