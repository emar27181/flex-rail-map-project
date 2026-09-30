/**
 * 地図の右下に出す「表示中の路線」の凡例（オーガニズム: 路線を知っている）。
 *
 * どの色の線がどの路線かを、表示路線の切替パネルを開かずに確かめられるようにする。
 * 地図を隠さないよう小さく、先頭 maxItems 件だけ並べて残りは「…ほかN路線」にまとめる。
 * 色・文字サイズ・余白・角丸はデザイントークンから取り、路線色は呼び出し側で
 * テーマに合わせて補正したものを受け取る（地図の線と同じ色になるように）。
 * 見出しを押すと折りたためる（開閉の状態は呼び出し側が持ち、保存する）。
 * 折りたたみ中は「表示中の路線（N）」の1行だけになる。
 */
import React from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { FS } from '../../constants/ui';
import { translateUI, type Language } from '../../utils/translation';
import { L } from './legendStyles';

export interface LegendRouteItem {
  key: string;
  name: string;
  /** 地図の線と同じ色（テーマ補正済み） */
  color: string;
}

interface VisibleRoutesLegendProps {
  items: LegendRouteItem[];
  theme: 'light' | 'dark';
  language: Language;
  /** これを超えた分は「…ほかN路線」にまとめる */
  maxItems?: number;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  style?: React.CSSProperties;
}

/** 路線色の丸の直径 */
const SWATCH_SIZE = '8px';
/** 路線名が長いときに凡例が地図を覆いすぎない幅 */
const MAX_WIDTH = '180px';

export default function VisibleRoutesLegend({ items, theme, language, maxItems = 10, collapsed = false, onToggleCollapsed, style }: VisibleRoutesLegendProps) {
  if (items.length === 0) return null;
  const colors = getThemeColors(theme);
  const shown = items.slice(0, maxItems);
  const rest = items.length - shown.length;

  return (
    <div
      aria-label={translateUI('visibleRoutesLegendTitle', language)}
      style={{
        maxWidth: MAX_WIDTH,
        padding: `${L.sp.xs} ${L.sp.md}`,
        backgroundColor: colors.surfaceElevated,
        border: `1px solid ${colors.border}`,
        borderRadius: L.r.card,
        boxShadow: `0 1px 4px ${colors.shadow}`,
        opacity: 0.94,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* 見出し（押すと開閉）。カード全体は地図の操作を邪魔しないよう pointer-events:none にし、
          見出しだけ押せるようにする */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        onClick={onToggleCollapsed}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleCollapsed?.(); } }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: L.sp.md,
          fontSize: FS.caption, color: colors.textSecondary,
          marginBottom: collapsed ? 0 : L.sp.xxs,
          cursor: onToggleCollapsed ? 'pointer' : 'default',
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
      >
        <span>{translateUI('visibleRoutesLegendTitle', language)}{collapsed ? (language === 'japanese' ? `（${items.length}）` : ` (${items.length})`) : ''}</span>
        {onToggleCollapsed && <span aria-hidden>{collapsed ? '▲' : '▼'}</span>}
      </div>
      {!collapsed && shown.map(item => (
        <div
          key={item.key}
          style={{ display: 'flex', alignItems: 'center', gap: L.sp.xs, fontSize: FS.caption, color: colors.text, lineHeight: 1.5 }}
        >
          <span
            aria-hidden
            style={{ width: SWATCH_SIZE, height: SWATCH_SIZE, borderRadius: L.r.pill, backgroundColor: item.color, flexShrink: 0 }}
          />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{item.name}</span>
        </div>
      ))}
      {!collapsed && rest > 0 && (
        <div style={{ fontSize: FS.caption, color: colors.textSecondary, lineHeight: 1.5 }}>
          {translateUI('moreRoutesCount', language, { count: rest })}
        </div>
      )}
    </div>
  );
}
