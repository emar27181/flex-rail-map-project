/**
 * 押すと中身を開閉する見出しの行（アトム）。
 *
 * 左に見出し、右端に開閉の印（DisclosureIndicator）。行のどこを押しても開閉する。
 * 見出しが長いときは文字を見切らせ、印は必ず見せる。
 * 読み上げでは「開閉するボタン」として扱う（role="button" と aria-expanded）。
 *
 * 見出しの行と中身を1枚の箱にまとめるときは molecules/CollapsiblePanel を使う。
 */
import React from 'react';
import type { ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import DisclosureIndicator from './DisclosureIndicator';

export interface DisclosureHeaderProps {
  title: ReactNode;
  expanded: boolean;
  onToggle?: () => void;
  theme: 'light' | 'dark';
  /** 行の高さ(px)。地図の上に浮かぶ箱では丸いボタンと同じ高さを渡す。省略時は中身に合わせる */
  height?: number;
  /** 開いているとき、中身との間に区切り線を引く */
  divider?: boolean;
  /** 開いた中身の id（aria-controls） */
  controlsId?: string;
}

const DisclosureHeader: React.FC<DisclosureHeaderProps> = ({ title, expanded, onToggle, theme, height, divider = true, controlsId }) => {
  const colors = getThemeColors(theme);
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle?.(); } }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: L.sp.sm,
        boxSizing: 'border-box',
        flexShrink: 0,
        ...(height !== undefined ? { height: `${height}px` } : { paddingTop: L.sp.md, paddingBottom: L.sp.md }),
        paddingLeft: L.sp.md, paddingRight: L.sp.md,
        borderBottom: expanded && divider ? `1px solid ${colors.borderLight}` : 'none',
        cursor: onToggle ? 'pointer' : 'default',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{
        flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontSize: FS.title, fontWeight: 'bold', color: colors.text,
      }}>
        {title}
      </span>
      <DisclosureIndicator expanded={expanded} theme={theme} />
    </div>
  );
};

export default DisclosureHeader;
