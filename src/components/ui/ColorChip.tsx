/**
 * 色付きの小さなラベル（チップ）。
 *
 * 路線色やヒートマップ色を使った小片は、これまで箇所ごとに
 * 「枠線＋色文字」「塗りつぶし＋白字」がばらばらに書かれていて、
 * 片方を直してももう片方が古いままになりやすかった。
 * 見た目の規則をこのコンポーネントに集約し、色は
 * filledLabelColors（utils/contrast.ts）に一本化する。
 */
import type { CSSProperties, ReactNode } from 'react';
import { filledLabelColors } from '../../utils/contrast';
import { FS } from '../../constants/ui';
import { L } from '../legend/legendStyles';

export type ColorChipProps = {
  /** 元になる色（路線色・ヒートマップ色など） */
  color: string;
  theme: 'light' | 'dark';
  children: ReactNode;
  /** 文字サイズ（FS の値を渡す）。既定は補助テキスト相当 */
  fontSize?: string;
  /** 太字にするか */
  bold?: boolean;
  title?: string;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
};

export default function ColorChip({
  color,
  theme,
  children,
  fontSize = FS.helper,
  bold = false,
  title,
  style,
  onClick,
}: ColorChipProps) {
  const { background, text, needsHalo } = filledLabelColors(color, theme);
  return (
    <span
      title={title}
      onClick={onClick}
      style={{
        display: 'inline-block',
        backgroundColor: background,
        color: text,
        // 4.5:1 に届かない明るい色は縁取りで読めるようにする
        textShadow: needsHalo ? '0 0 2px rgba(0,0,0,0.95),0 1px 2px rgba(0,0,0,0.9)' : undefined,
        fontSize,
        fontWeight: bold ? 'bold' : 'normal',
        borderRadius: L.r.sm,
        padding: '1px 5px',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
