/**
 * 両端に言葉を添えた段階つきのスライダー（モレキュール）。
 *
 * 「全員が同じくらい ──●── 多い人に寄せる」のように、2つの考え方の間を段階で選ぶ設定に使う。
 * 数字は出さず、つまみの位置と両端の言葉で意味が分かるようにする（できるだけシンプルに）。
 * つまみは `Slider` アトム、文字は `FS` / `getThemeColors` から取る。何の設定か（駅など）は知らない。
 */
import React from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import Slider from '../atoms/Slider';

export interface EndLabeledSliderProps {
  theme: 'light' | 'dark';
  /** 設定の名前（読み上げ用と、上の小さな見出し） */
  label: string;
  /** 0 〜 steps-1 */
  value: number;
  steps: number;
  onChange: (value: number) => void;
  /** 左端（値 0）の言葉 */
  startLabel: string;
  /** 右端（値 steps-1）の言葉 */
  endLabel: string;
}

const EndLabeledSlider: React.FC<EndLabeledSliderProps> = ({ theme, label, value, steps, onChange, startLabel, endLabel }) => {
  const colors = getThemeColors(theme);
  return (
    <div data-end-labeled-slider style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xxs }}>
      <div style={{ fontSize: FS.caption, color: colors.textSecondary }}>{label}</div>
      <Slider
        min={0}
        max={steps - 1}
        step={1}
        value={value}
        aria-label={label}
        aria-valuetext={value === 0 ? startLabel : value === steps - 1 ? endLabel : `${value + 1} / ${steps}`}
        onChange={e => onChange(Number(e.target.value))}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: L.sp.sm, fontSize: FS.caption, color: colors.textSecondary }}>
        <span>{startLabel}</span>
        <span style={{ textAlign: 'right' }}>{endLabel}</span>
      </div>
    </div>
  );
};

export default EndLabeledSlider;
