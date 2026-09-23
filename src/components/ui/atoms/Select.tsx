/**
 * 選択欄（アトム）。
 *
 * 経路推薦数・時間フィルター・通知タイミングなどの `<select>` が
 * 各所で高さも文字サイズも別々に書かれていた。
 * 寸法はボタン・入力欄と同じ controlSize から取る。
 *
 * 入力欄と同じく文字サイズだけは規格から外して16px固定にする。
 * iOS Safari は16px未満の選択欄でもフォーカス時にページを拡大する。
 *
 * 開閉の矢印はブラウザ既定のものを使うと、OSのネイティブ描画
 * （ダークモードでも黒いまま、大きさもばらつく）になり浮いて見える。
 * `appearance: none` で既定の矢印を消し、他のアイコンと同じ
 * lucide-react の ChevronDown を自前で重ねる（大きさ・色は
 * Button/IconButtonと同じ CONTROL_SIZE.iconSize / getThemeColors から取る）。
 */
import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from './controlSize';
import type { ControlSize } from './controlSize';

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'style' | 'size'> {
  theme: 'light' | 'dark';
  size?: ControlSize;
  fullWidth?: boolean;
  children: ReactNode;
  styleOverride?: CSSProperties;
}

const Select: React.FC<SelectProps> = ({
  theme,
  size = 'md',
  fullWidth = false,
  children,
  styleOverride,
  ...rest
}) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];
  // 矢印ぶんの右余白を確保しつつ、既存の左右パディングは変えない
  const [padV, padH] = dims.padding.split(' ');

  return (
    <div style={{ position: 'relative', display: fullWidth ? 'block' : 'inline-block' }}>
      <select
        {...rest}
        style={{
          width: fullWidth ? '100%' : undefined,
          boxSizing: 'border-box',
          minHeight: `${dims.minHeight}px`,
          padding: `${padV} calc(${padH} + ${dims.iconSize}px + ${dims.gap}) ${padV} ${padH}`,
          border: `${CONTROL_BORDER_WIDTH}px solid ${colors.border}`,
          borderRadius: dims.radius,
          backgroundColor: colors.surfaceElevated,
          color: colors.text,
          cursor: 'pointer',
          // ブラウザ既定の矢印を消し、下の自前のChevronDownに置き換える
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          // iOS Safari の自動ズームを防ぐため16pxを下回らせない
          fontSize: FS.input,
          ...styleOverride,
        }}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        size={dims.iconSize}
        style={{
          position: 'absolute',
          right: padH,
          top: '50%',
          transform: 'translateY(-50%)',
          color: colors.textSecondary,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default Select;
