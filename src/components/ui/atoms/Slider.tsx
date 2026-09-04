/**
 * スライダー（アトム）。
 *
 * つまみの当たり判定はブラウザ任せだが、行の高さは他の操作部品と
 * 同じ規格に合わせて、隣に並ぶ数値や見出しと高さが揃うようにする。
 */
import React from 'react';
import type { CSSProperties } from 'react';
import { SEMANTIC } from '../../../constants/ui';
import { CONTROL_SIZE } from './controlSize';
import type { ControlSize } from './controlSize';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'type' | 'size'> {
  size?: ControlSize;
  styleOverride?: CSSProperties;
}

const Slider: React.FC<SliderProps> = ({ size = 'sm', styleOverride, ...rest }) => (
  <input
    {...rest}
    type="range"
    style={{
      flex: 1,
      minHeight: `${CONTROL_SIZE[size].minHeight}px`,
      accentColor: SEMANTIC.primary,
      cursor: 'pointer',
      ...styleOverride,
    }}
  />
);

export default Slider;
