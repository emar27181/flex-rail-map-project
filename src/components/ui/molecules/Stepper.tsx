/**
 * −／＋で数値を増減する行（モレキュール）。
 *
 * 駅の大きさ・線の太さの調整で同じ形が2組あり、どちらも
 * 18×18px の button を手書きしていた。18pxは WCAG 2.2 AA の
 * ターゲットサイズ下限(24px)を下回っている。
 *
 * IconButton を並べるだけの部品なので、大きさも当たり判定も
 * 規格どおりになる。
 */
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import IconButton from '../atoms/IconButton';
import type { ControlSize } from '../atoms/controlSize';

/** −／＋のアイコンの大きさ */
const ICON = 12;

export interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** 数値の見せ方（"0.8x" "3.0px" など） */
  format: (value: number) => string;
  theme: 'light' | 'dark';
  size?: ControlSize;
  /** 読み上げ用。「小さくする」「大きくする」に相当する語 */
  decreaseLabel: string;
  increaseLabel: string;
}

/** 浮動小数の誤差で 0.7000000000000001 のような値にならないよう丸める */
const round = (v: number, step: number) => {
  const digits = (String(step).split('.')[1] ?? '').length;
  return Number(v.toFixed(digits));
};

const Stepper: React.FC<StepperProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  theme,
  size = 'sm',
  decreaseLabel,
  increaseLabel,
}) => {
  const colors = getThemeColors(theme);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: L.sp.xs,
      fontSize: FS.helper,
      color: colors.text,
      padding: `${L.sp.xs} 0`,
    }}>
      <span style={{ flex: 1, color: colors.textSecondary }}>{label}</span>
      <IconButton
        theme={theme}
        size={size}
        variant="outline"
        onClick={() => onChange(round(Math.max(min, value - step), step))}
        disabled={value <= min}
        label={decreaseLabel}
        icon={<Minus size={ICON} />}
      />
      <span style={{ minWidth: '30px', textAlign: 'center' }}>{format(value)}</span>
      <IconButton
        theme={theme}
        size={size}
        variant="outline"
        onClick={() => onChange(round(Math.min(max, value + step), step))}
        disabled={value >= max}
        label={increaseLabel}
        icon={<Plus size={ICON} />}
      />
    </div>
  );
};

export default Stepper;
