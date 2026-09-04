/**
 * ボタン（アトム）。
 *
 * このアプリには `<button>` が93個あり、うち91個が padding・角丸・色・文字サイズを
 * その場で手書きしていた。結果、同じ役割のボタンでも高さも色も少しずつ違い、
 * 「塗った色の上の文字」を `white` / `#fff` / `#ffffff` の3通りで書いていた。
 *
 * 見た目の決定をここ1箇所に集め、呼び出し側は「何のためのボタンか」
 * （variant）と「大きさ」（size）だけを指定する。
 *
 * アトミックデザインでの位置づけ:
 *   atoms      … これ。単独で意味を持つ最小の部品
 *   molecules  … アトムを組み合わせた部品（SegmentedControl など）
 *   organisms  … 画面の一区画（RouteSwitchBoard、LegendRouteList など）
 */
import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { SEMANTIC } from '../../../constants/ui';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from './controlSize';
import type { ControlSize } from './controlSize';

export type ButtonVariant =
  /** 主操作。青で塗る */
  | 'primary'
  /** 肯定・出発側。緑で塗る */
  | 'positive'
  /** 否定・到着側・削除。赤で塗る */
  | 'danger'
  /** 補助操作。枠線だけ */
  | 'outline'
  /** 目立たせない操作。枠線も塗りもなし */
  | 'ghost';

export type ButtonSize = ControlSize;

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  theme: 'light' | 'dark';
  /** 横幅いっぱいに広げる */
  fullWidth?: boolean;
  /** 押した状態を保持するボタン（トグル）。true のとき塗りに変わる */
  pressed?: boolean;
  /** 文字の前に置くアイコン。lucide-react のコンポーネントを渡す（絵文字は使わない） */
  icon?: ReactNode;
  children?: ReactNode;
  /** どうしても個別に足したい指定だけをここへ。色・寸法は variant / size で決めること */
  styleOverride?: CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'outline',
  size = 'md',
  theme,
  fullWidth = false,
  pressed,
  icon,
  children,
  styleOverride,
  disabled,
  ...rest
}) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];

  /** 塗りつぶす色。枠線だけの variant では undefined */
  const fill =
    variant === 'primary' ? SEMANTIC.primary
    : variant === 'positive' ? SEMANTIC.departure
    : variant === 'danger' ? SEMANTIC.arrival
    : undefined;

  // トグルとして使う場合、押されていない間は塗らない
  const isFilled = fill !== undefined && (pressed === undefined || pressed);

  return (
    <button
      {...rest}
      disabled={disabled}
      aria-pressed={pressed}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: dims.gap,
        width: fullWidth ? '100%' : undefined,
        minHeight: `${dims.minHeight}px`,
        padding: dims.padding,
        fontSize: dims.fontSize,
        // 太さは状態で変えない。変えると押すたびに外形が動いて並びがずれる
        border: `${CONTROL_BORDER_WIDTH}px solid ${
          variant === 'ghost' ? 'transparent' : (isFilled ? (fill as string) : colors.border)
        }`,
        boxSizing: 'border-box',
        borderRadius: dims.radius,
        backgroundColor: isFilled ? (fill as string) : (variant === 'ghost' ? 'transparent' : colors.surface),
        // 塗った色の上の文字はテーマではなく下の色で決まる
        color: isFilled ? colors.onPrimary : colors.text,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        ...styleOverride,
      }}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
