/**
 * スライダー（アトム）。
 *
 * つまみの当たり判定はブラウザ任せだが、行の高さは他の操作部品と
 * 同じ規格に合わせて、隣に並ぶ数値や見出しと高さが揃うようにする。
 */
import React from 'react';
import type { CSSProperties } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { L } from '../../legend/legendStyles';
import './slider.css';
import { SEMANTIC } from '../../../constants/ui';
import { CONTROL_SIZE } from './controlSize';
import type { ControlSize } from './controlSize';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'type' | 'size'> {
  size?: ControlSize;
  styleOverride?: CSSProperties;
  /** 均等な目盛りがある設定に、角丸の印とつまみを表示する。 */
  stops?: { count: number; theme: 'light' | 'dark' };
}

const Slider: React.FC<SliderProps> = ({ size = 'sm', styleOverride, stops, className, ...rest }) => {
  const input = (style: CSSProperties, cssClass?: string) => (
    <input {...rest} type="range" className={cssClass} style={{
      flex: 1,
      minHeight: `${CONTROL_SIZE[size].minHeight}px`,
      accentColor: SEMANTIC.primary,
      cursor: 'pointer',
      ...style,
      ...styleOverride,
    }} />
  );
  if (!stops) return input({}, className);

  const colors = getThemeColors(stops.theme);
  const thumbSize = CONTROL_SIZE.md.iconSize;
  const stopSize = L.sp.md;
  const trackInset = thumbSize / 2;
  const stopPosition = (index: number) => `${100 * index / Math.max(1, stops.count - 1)}%`;
  const progress = stopPosition(Number(rest.value));
  return (
    <span style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: 0 }}>
      <span aria-hidden="true" style={{ position: 'absolute', insetInline: trackInset, insetBlock: 0, pointerEvents: 'none' }}>
        <span style={{
          position: 'absolute', insetInline: 0, top: '50%', transform: 'translateY(-50%)',
          height: L.sp.xxs, borderRadius: L.r.control,
          background: `linear-gradient(to right, ${colors.primary} ${progress}, ${colors.textMuted} ${progress})`,
        }} />
        {Array.from({ length: stops.count }, (_, index) => (
          <span key={index} data-slider-stop style={{
            position: 'absolute', left: stopPosition(index), top: '50%', transform: 'translate(-50%, -50%)',
            width: stopSize, height: stopSize, boxSizing: 'border-box', borderRadius: L.r.control,
            backgroundColor: colors.surface,
            border: `${L.sp.xxs} solid ${index <= Number(rest.value) ? colors.primary : colors.textMuted}`,
          }} />
        ))}
      </span>
      {input({
        '--slider-thumb-size': `${thumbSize}px`,
        '--slider-thumb-radius': L.r.control,
        '--slider-thumb-color': colors.primary,
        '--slider-thumb-border': colors.surface,
        '--slider-thumb-border-width': L.sp.xxs,
      } as CSSProperties, ['stepped-slider', className].filter(Boolean).join(' '))}
    </span>
  );
};

export default Slider;
