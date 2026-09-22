/**
 * 削除ボタン付きの小さなタグ（アトム）。
 *
 * 「選んだものを一覧で見せて、個別に外せる」UI（経由駅の選択済み一覧など）
 * で使う。これまで経由駅チップは呼び出し側（StationSelector.tsx）が
 * padding・角丸・枠線・背景色を直接手書きしていた。寸法は他の操作部品と
 * 同じ`CONTROL_SIZE`から取り、この1箇所に集約する。
 */
import React from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { L } from '../../legend/legendStyles';
import { CONTROL_SIZE } from './controlSize';
import type { ControlSize } from './controlSize';
import IconButton from './IconButton';
import { X } from 'lucide-react';

export interface RemovableTagProps {
  label: React.ReactNode;
  onRemove: () => void;
  /** 削除ボタンの読み上げ用ラベル */
  removeLabel: string;
  theme: 'light' | 'dark';
  size?: ControlSize;
}

const RemovableTag: React.FC<RemovableTagProps> = ({
  label,
  onRemove,
  removeLabel,
  theme,
  size = 'sm',
}) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: L.sp.xxs,
        paddingLeft: L.sp.sm,
        paddingRight: L.sp.xxs,
        minHeight: `${dims.minHeight}px`,
        borderRadius: L.r.pill,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.surfaceElevated,
        fontSize: dims.fontSize,
        color: colors.text,
      }}
    >
      <span>{label}</span>
      <IconButton
        theme={theme}
        size={size}
        onClick={onRemove}
        label={removeLabel}
        icon={<X size={12} />}
      />
    </span>
  );
};

export default RemovableTag;
