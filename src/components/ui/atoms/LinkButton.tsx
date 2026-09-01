/**
 * ボタンの見た目をしたリンク（アトム）。
 *
 * 記事一覧やフッターの導線が `<a>` にボタン風のスタイルを手書きしていて、
 * 隣に並ぶボタンと高さも角丸も揃っていなかった。
 *
 * 押すと画面が変わる（遷移する）ものは button ではなく a で書くべきなので、
 * 要素は a のまま、見た目だけ Button と同じ規格から取る。
 */
import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from './controlSize';
import type { ControlSize } from './controlSize';

export interface LinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'style'> {
  href: string;
  theme: 'light' | 'dark';
  size?: ControlSize;
  /** 文字を持たずアイコンだけのとき true。正方形になる */
  iconOnly?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  styleOverride?: CSSProperties;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  theme,
  size = 'md',
  iconOnly = false,
  icon,
  children,
  styleOverride,
  ...rest
}) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];

  return (
    <a
      {...rest}
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: dims.gap,
        minHeight: `${dims.minHeight}px`,
        width: iconOnly ? `${dims.minHeight}px` : undefined,
        padding: iconOnly ? 0 : dims.padding,
        border: `${CONTROL_BORDER_WIDTH}px solid ${colors.border}`,
        boxSizing: 'border-box',
        borderRadius: dims.radius,
        backgroundColor: colors.surface,
        color: colors.text,
        fontSize: dims.fontSize,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        ...styleOverride,
      }}
    >
      {icon}
      {children}
    </a>
  );
};

export default LinkButton;
