/**
 * スライド式の排他選択（アトム）。
 *
 * 「出発/到着」のような2〜数択を1本の枠の中に収め、選択位置を
 * 背景のスライドで示す。`SegmentedControl`（molecules）の
 * `variant="slide"` から使う実体はここに置く。生の`<button>`は
 * ui/atoms/ の中でしか書けない規約のため、molecules側には置けない。
 *
 * 大きさ・色は Button と同じ CONTROL_SIZE / SEMANTIC / getThemeColors
 * から取り、新しい規格を増やさない。
 */
import React from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { SEMANTIC } from '../../../constants/ui';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from './controlSize';
import type { ControlSize } from './controlSize';

export interface SlideSegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

export interface SlideSegmentedControlProps<T extends string> {
  options: SlideSegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  theme: 'light' | 'dark';
  size?: ControlSize;
  /** 読み上げ用の名前 */
  ariaLabel?: string;
}

function SlideSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  theme,
  size = 'sm',
  ariaLabel,
}: SlideSegmentedControlProps<T>) {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];
  const selectedIndex = Math.max(0, options.findIndex(opt => opt.value === value));
  const segmentPercent = 100 / options.length;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      style={{
        position: 'relative',
        // 項目はどれも同じ幅で、いちばん長い文字に合わせる（言語によって長さが違う。flex で等分すると
        // 英語の "Depart" が "De…" に切れていた, 2026-10-15）。文字を省略・折り返しせずに枠の方を広げる
        display: 'grid',
        gridTemplateColumns: `repeat(${options.length}, minmax(max-content, 1fr))`,
        minHeight: `${dims.minHeight}px`,
        border: `${CONTROL_BORDER_WIDTH}px solid ${colors.border}`,
        borderRadius: dims.radius,
        backgroundColor: colors.surface,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* 選択位置を示すスライド背景。項目のテキストより背面に置く */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${segmentPercent * selectedIndex}%`,
          width: `${segmentPercent}%`,
          backgroundColor: SEMANTIC.primary,
          transition: 'left 0.2s ease',
        }}
      />
      {options.map(opt => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(opt.value)}
            style={{
              position: 'relative',
              border: 'none',
              background: 'transparent',
              padding: dims.padding,
              fontSize: dims.fontSize,
              fontFamily: 'inherit',
              color: isSelected ? colors.onPrimary : colors.text,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default SlideSegmentedControl;
