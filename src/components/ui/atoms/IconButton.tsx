/**
 * アイコンだけのボタン（アトム）。
 *
 * 閉じる✕、テーマ切替、全画面切替、地図上の丸いボタンなど、
 * 文字を持たず正方形で置くもの。以前は 36×36 / 34px / 18px などが
 * 各所で手書きされていて、同じ画面に別々の大きさが並んでいた。
 *
 * 大きさは Button と同じ controlSize の段階を使う。正方形なので
 * 高さと同じ値を幅にも使い、タッチ領域が縦横とも規格を満たす。
 */
import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { SEMANTIC } from '../../../constants/ui';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from './controlSize';
import type { ControlSize } from './controlSize';

export type IconButtonVariant =
  /** 主操作。青で塗る */
  | 'primary'
  /** 補助操作。枠線だけ */
  | 'outline'
  /** 地図やパネルの上に重ねる。枠線も塗りもなし */
  | 'ghost';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** 読み上げ用の名前。アイコンだけなので必須にする */
  label: string;
  icon: ReactNode;
  theme: 'light' | 'dark';
  variant?: IconButtonVariant;
  size?: ControlSize;
  /** 押した状態を保持するボタン。true のとき塗りに変わる */
  pressed?: boolean;
  styleOverride?: CSSProperties;
}

const IconButton: React.FC<IconButtonProps> = ({
  label,
  icon,
  theme,
  variant = 'ghost',
  size = 'md',
  pressed,
  styleOverride,
  disabled,
  ...rest
}) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];
  const fill = variant === 'primary' ? SEMANTIC.primary : undefined;
  const isFilled = fill !== undefined && (pressed === undefined || pressed);

  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        // 正方形。幅も高さの規格に合わせる
        width: `${dims.minHeight}px`,
        height: `${dims.minHeight}px`,
        padding: 0,
        // 太さは状態で変えない。変えると押すたびに外形が動いて並びがずれる
        border: `${CONTROL_BORDER_WIDTH}px solid ${
          variant === 'ghost' ? 'transparent' : (isFilled ? (fill as string) : colors.border)
        }`,
        boxSizing: 'border-box',
        borderRadius: dims.radius,
        backgroundColor: isFilled
          ? (fill as string)
          : (variant === 'ghost' ? 'transparent' : colors.surface),
        color: isFilled ? colors.onPrimary : colors.text,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...styleOverride,
      }}
    >
      {icon}
    </button>
  );
};

export default IconButton;
