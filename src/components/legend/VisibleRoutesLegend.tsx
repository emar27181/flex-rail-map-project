/**
 * 地図の右下に出す「表示中の路線」の凡例（オーガニズム: 路線を知っている）。
 *
 * どの色の線がどの路線かを、表示路線の切替パネルを開かずに確かめ、その場で出し入れできる。
 * - 見出しは地図の上に浮かぶボタン（FloatingButton）。右上の丸いボタン・「表示切替」と同じ高さ
 * - 路線は「表示路線の切替」パネルと同じチップ（Chip）。表示中は路線色で塗り、
 *   押すと非表示の見た目（塗らずに丸で色を示す）になり、もう一度押すと表示に戻る
 * - 押したときの処理は呼び出し側の既存の切り替え（toggleRoute）を使う。ここでは状態を持たない
 *
 * 見出しを押すと開閉する（開閉の状態は呼び出し側が持ち、保存する）。
 * 開いた一覧は見出しの上に出し、多いときは一覧の中でスクロールする。
 */
import React from 'react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI, type Language } from '../../utils/translation';
import FloatingButton from '../ui/atoms/FloatingButton';
import Chip from '../ui/atoms/Chip';
import { CONTROL_SIZE } from '../ui/atoms/controlSize';
import { L } from './legendStyles';

export interface LegendRouteItem {
  key: string;
  name: string;
  /** 地図の線と同じ色（テーマ補正済み） */
  color: string;
  /** いま地図に出しているか（false は凡例から非表示にしたもの） */
  visible: boolean;
}

interface VisibleRoutesLegendProps {
  items: LegendRouteItem[];
  theme: 'light' | 'dark';
  language: Language;
  /** 路線のチップを押したとき（表示・非表示の切り替え） */
  onToggleRoute: (key: string) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  style?: React.CSSProperties;
}

/** チップの大きさ。「表示路線の切替」パネルのチップと同じ段階 */
const CHIP_SIZE = 'sm' as const;
/** 開いた一覧の高さの上限。地図を覆いすぎないよう、多いときは中でスクロールする */
const LIST_MAX_HEIGHT = '40vh';
/** 路線名が長いときに一覧が地図を覆いすぎない幅 */
const LIST_MAX_WIDTH = '220px';

export default function VisibleRoutesLegend({ items, theme, language, onToggleRoute, collapsed = false, onToggleCollapsed, style }: VisibleRoutesLegendProps) {
  if (items.length === 0) return null;
  const colors = getThemeColors(theme);
  const visibleCount = items.filter(i => i.visible).length;
  const title = translateUI('visibleRoutesLegendTitle', language);
  const count = language === 'japanese' ? `（${visibleCount}）` : ` (${visibleCount})`;
  const glyph = CONTROL_SIZE.md.iconSize;

  return (
    <div
      aria-label={title}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: L.sp.xs,
        // 一覧と見出しの間の隙間で地図の操作を止めない
        pointerEvents: 'none',
        ...style,
      }}
    >
      {!collapsed && (
        <div
          role="group"
          aria-label={title}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: L.sp.xs,
            maxHeight: LIST_MAX_HEIGHT, maxWidth: LIST_MAX_WIDTH, overflowY: 'auto',
            padding: L.sp.sm,
            backgroundColor: colors.glassOpen,
            border: `1px solid ${colors.border}`,
            borderRadius: L.r.card,
            boxShadow: `0 2px 8px ${colors.shadow}`,
            pointerEvents: 'auto',
          }}
        >
          {items.map(item => (
            <Chip
              key={item.key}
              color={item.color}
              label={item.name}
              selected={item.visible}
              theme={theme}
              size={CHIP_SIZE}
              onClick={() => onToggleRoute(item.key)}
              dataAttr={{ 'data-legend-route': item.key }}
              styleOverride={{ justifyContent: 'flex-start', overflow: 'hidden', textOverflow: 'ellipsis' }}
            />
          ))}
        </div>
      )}
      <div style={{ pointerEvents: 'auto' }}>
        <FloatingButton
          theme={theme}
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          icon={<Layers size={glyph} />}
          trailing={collapsed ? <ChevronUp size={glyph} aria-hidden /> : <ChevronDown size={glyph} aria-hidden />}
        >
          {title}{count}
        </FloatingButton>
      </div>
    </div>
  );
}
