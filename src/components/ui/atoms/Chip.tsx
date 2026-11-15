/**
 * 色を持つ切り替えチップ（アトム）。
 *
 * 路線のように「それ自身の色」を持つものを、押して出し入れするための部品。
 * 表示中はその色で塗り、非表示では丸かアイコンで色を示す。
 *
 * 以前は路線切り替えのボードが独自に button を書いていて、
 * 隣の全表示ボタン(高さ24px・文字11px)に対してチップだけ
 * 高さ44px・文字13px・角丸8pxと、同じパネルの中で揃っていなかった。
 * 寸法は Button と同じ controlSize から取る。
 *
 * 色の決め方は自前で持たない。塗った上に載せる文字色は
 * filledLabelColors に任せる（コントラスト判定を2箇所に書かないため）。
 */
import React, { cloneElement, isValidElement } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { filledLabelColors } from '../../../utils/contrast';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from './controlSize';
import type { ControlSize } from './controlSize';

/** 2行目の文字の大きさ。12px が下限（FS.caption） */
const CHIP_SUB_LABEL_FONT_SIZE = FS.caption;

/** 色を示す丸の直径(px)。選択の有無で変えない */
const DOT_SIZE = 10;

export interface ChipProps {
  /** このチップが表すものの色（路線色など） */
  color: string;
  label: string;
  /** 2行目に小さく添える別名など（枠の中に入れる。枠の外にぶら下げない） */
  subLabel?: string;
  /** 指定すると色の丸をアイコンに置き換える */
  icon?: ReactNode;
  title?: string;
  disabled?: boolean;
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
  subLabel,
  icon,
  title,
  disabled,
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
  const indicatorColor = selected ? text : color;
  const sizedIcon = isValidElement<{ size?: number }>(icon)
    ? cloneElement(icon, { size: icon.props.size ?? dims.iconSize })
    : icon;

  return (
    <button
      {...dataAttr}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      title={title ?? (subLabel ? `${label}（${subLabel}）` : label)}
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
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : undefined,
        // 並びの幅を超えない。長い路線名（英語の "JR Kagoshima Main Line (Kumamoto - Kagoshima-Chuo)" など）は
        // 一覧の右端で切れていた（2026-10-15）。省略せず、語の切れ目で2行にする
        maxWidth: '100%',
        textAlign: 'start',
        ...styleOverride,
      }}
    >
      {sizedIcon ? (
        <span aria-hidden style={{ display: 'inline-flex', flexShrink: 0, color: indicatorColor }}>
          {sizedIcon}
        </span>
      ) : (
        <span
          aria-hidden
          style={{
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            borderRadius: '50%',
            flexShrink: 0,
            backgroundColor: indicatorColor,
          }}
        />
      )}
      {/* 幅が足りないときは語の切れ目で折り返す（省略すると路線を見分けられない） */}
      <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        {label}
        {subLabel && (
          <span style={{ display: 'block', fontSize: CHIP_SUB_LABEL_FONT_SIZE, lineHeight: 1.3, opacity: 0.85 }}>{subLabel}</span>
        )}
      </span>
    </button>
  );
};

export default Chip;
