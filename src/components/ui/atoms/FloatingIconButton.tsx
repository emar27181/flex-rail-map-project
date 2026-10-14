/**
 * 地図の上に浮かせて置く、アイコンだけの丸いボタン（アトム）。
 *
 * 地図の隅の「縮小・言語・テーマ」や、立体表示の設定を開くボタンのように、単体で浮かぶアイコンボタンの
 * 見た目をここ1箇所で決める。以前は RailwayMap の中に寸法と地の組み立て（renderCornerButton）があり、
 * 新しく浮かぶボタンを足すたびに同じ指定を書き写す必要があった。
 *
 * - 大きさは FLOATING_ICON_BUTTON_SIZE（既定 md = 36px。「表示切替」・凡例の見出しと同じ高さ）
 * - アイコンの大きさは FLOATING_ICON_GLYPH_SIZE
 * - 地は floatingSurface.ts。pressed を渡すと開閉ボタンになり、開いている間は主操作の塗り
 */
import React, { cloneElement, isValidElement } from 'react';
import type { ReactNode } from 'react';
import IconButton from './IconButton';
import { FLOATING_CONTROL, FLOATING_ICON_BUTTON_SIZE, FLOATING_ICON_GLYPH_SIZE, type FloatingIconButtonSize } from './controlSize';
import { floatingSurfaceStyle } from './floatingSurface';

export interface FloatingIconButtonProps {
  theme: 'light' | 'dark';
  /** 読み上げ用の名前（title にも出る） */
  label: string;
  icon: ReactNode;
  onClick: () => void;
  /** 開閉するボタンのとき、開いているか。渡さなければふつうのボタン */
  pressed?: boolean;
  size?: FloatingIconButtonSize;
  /** 開閉するボタンが開く箱の id */
  controls?: string;
}

const FloatingIconButton: React.FC<FloatingIconButtonProps> = ({ theme, label, icon, onClick, pressed, size = 'md', controls }) => {
  const px = FLOATING_ICON_BUTTON_SIZE[size];
  const sizedIcon = isValidElement<{ size?: number }>(icon)
    ? cloneElement(icon, { size: icon.props.size ?? FLOATING_ICON_GLYPH_SIZE })
    : icon;
  return (
    <IconButton
      theme={theme}
      size="sm"
      variant={pressed === undefined ? 'outline' : 'primary'}
      pressed={pressed}
      onClick={onClick}
      label={label}
      icon={sizedIcon}
      aria-expanded={pressed}
      aria-controls={controls}
      styleOverride={{
        width: px,
        height: px,
        // 開いている間は IconButton の塗りのまま（ここで地を上書きすると塗りが消える）
        ...(pressed ? { borderRadius: FLOATING_CONTROL.radius } : floatingSurfaceStyle(theme)),
      }}
    />
  );
};

export default FloatingIconButton;
