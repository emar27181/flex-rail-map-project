/**
 * 色を持つ切り替えチップ（アトム）。
 *
 * 路線のように「それ自身の色」を持つものを、押して出し入れするための部品。
 * 表示中はその色で塗り、非表示は塗らずに丸で色を示す。
 *
 * 以前は路線切り替えのボードが独自に button を書いていて、
 * 隣の全表示ボタン(高さ24px・文字11px)に対してチップだけ
 * 高さ44px・文字13px・角丸8pxと、同じパネルの中で揃っていなかった。
 * 寸法は Button と同じ controlSize から取る。
 *
 * 色の決め方は自前で持たない。塗った上に載せる文字色は
 * filledLabelColors に任せる（コントラスト判定を2箇所に書かないため）。
 */
import React from 'react';
import type { CSSProperties } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { filledLabelColors } from '../../../utils/contrast';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from './controlSize';
import type { ControlSize } from './controlSize';

/** 色を示す丸の直径(px)。選択の有無で変えない */
const DOT_SIZE = 10;

export interface ChipProps {
  /** このチップが表すものの色（路線色など） */
  color: string;
  label: string;
  selected: boolean;
  theme: 'light' | 'dark';
  size?: ControlSize;
  onClick: () => void;
  /** E2E やテストで拾うための目印 */
  dataAttr?: Record<string, string>;
  styleOverride?: CSSProperties;
}

const Chip: React.FC<ChipProps> = ({
  color,
  label,
  selected,
  theme,
  size = 'md',
  onClick,
  dataAttr,
  styleOverride,
}) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];
  const { background, text } = filledLabelColors(color, theme);

  return (
    <button
      {...dataAttr}
      onClick={onClick}
      aria-pressed={selected}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dims.gap,
        // 太さは状態で変えない。変えるとチップの外形がずれて並びが動く
        border: `${CONTROL_BORDER_WIDTH}px solid ${selected ? background : colors.border}`,
        boxSizing: 'border-box',
        borderRadius: dims.radius,
        padding: dims.padding,
        minHeight: `${dims.minHeight}px`,
        backgroundColor: selected ? background : colors.surfaceElevated,
        color: selected ? text : colors.text,
        fontSize: dims.fontSize,
        // 太さを変えると幅が変わって並びが動くので、状態で変えない
        fontWeight: 'normal',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        ...styleOverride,
      }}
    >
      {/*
        * 非選択のときは背景に色が出ないので、この丸で色を示す。
        * 選択中は背景がすでにその色なので、丸は文字色で塗って
        * 「入っている」印として読ませる。大きさは状態で変えない。
        */}
      <span
        aria-hidden
        style={{
          width: `${DOT_SIZE}px`,
          height: `${DOT_SIZE}px`,
          borderRadius: '50%',
          flexShrink: 0,
          backgroundColor: selected ? text : color,
        }}
      />
      {label}
    </button>
  );
};

export default Chip;
