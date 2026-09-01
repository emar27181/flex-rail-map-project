/**
 * オン・オフのスイッチ（アトム）。
 *
 * Cookie設定などで使う横長のトグル。同じ形が複数箇所で
 * 幅・高さ・つまみの位置とも手書きされていた。
 *
 * 大きさは1種類だけ持つ。ボタンの規格（controlSize）と違って
 * 高さを変えるとつまみの計算まで連動するため、段階を増やさない。
 * 外形は 44×24px で、タッチ領域は WCAG 2.2 AA の下限を満たす。
 */
import React from 'react';
import type { CSSProperties } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { SEMANTIC } from '../../../constants/ui';

/** 外形。つまみの大きさと移動量はここから計算する */
const TRACK_W = 44;
const TRACK_H = 24;
const PAD = 2;
const KNOB = TRACK_H - PAD * 2;

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** 読み上げ用の名前 */
  label: string;
  theme: 'light' | 'dark';
  disabled?: boolean;
  styleOverride?: CSSProperties;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  theme,
  disabled = false,
  styleOverride,
}) => {
  const colors = getThemeColors(theme);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        flexShrink: 0,
        width: `${TRACK_W}px`,
        height: `${TRACK_H}px`,
        padding: `${PAD}px`,
        border: 'none',
        // 丸みは高さの半分。角丸の規格ではなく形そのものが決める
        borderRadius: `${TRACK_H / 2}px`,
        // オンは主色で塗る。オフはテーマの控えめな色
        backgroundColor: checked ? SEMANTIC.primary : colors.textSecondary,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...styleOverride,
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: `${PAD}px`,
          left: checked ? `${TRACK_W - KNOB - PAD}px` : `${PAD}px`,
          width: `${KNOB}px`,
          height: `${KNOB}px`,
          borderRadius: '50%',
          backgroundColor: colors.onPrimary,
          transition: 'left 0.2s ease',
        }}
      />
    </button>
  );
};

export default Switch;
