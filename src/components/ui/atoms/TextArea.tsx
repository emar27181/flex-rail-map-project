/**
 * 複数行の入力欄（アトム）。
 *
 * 設定の読み込みで使う。枠線・角丸・色は他の入力欄と同じ規格から取る。
 * 高さだけは行数で決まるので minHeight を使わない。
 */
import React from 'react';
import type { CSSProperties } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from './controlSize';
import type { ControlSize } from './controlSize';

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  theme: 'light' | 'dark';
  size?: ControlSize;
  styleOverride?: CSSProperties;
}

const TextArea: React.FC<TextAreaProps> = ({ theme, size = 'md', styleOverride, ...rest }) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];

  return (
    <textarea
      {...rest}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: dims.padding,
        border: `${CONTROL_BORDER_WIDTH}px solid ${colors.border}`,
        borderRadius: dims.radius,
        backgroundColor: colors.surfaceElevated,
        color: colors.text,
        // iOS Safari の自動ズームを防ぐため入力欄は16pxを下回らせない
        fontSize: FS.input,
        resize: 'vertical',
        ...styleOverride,
      }}
    />
  );
};

export default TextArea;
