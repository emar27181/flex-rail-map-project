/**
 * 地図の右下に出す「表示中の路線」の凡例（オーガニズム: 路線を知っている）。
 *
 * どの色の線がどの路線かを、表示路線の切替パネルを開かずに確かめ、その場で出し入れできる。
 * - 見出しと一覧は1枚の箱（CollapsiblePanel）。駅選択・表示路線の切替と同じ開閉の形で、
 *   見出しの行の高さは右上の丸いボタン・「表示切替」と同じ
 * - 路線は「表示路線の切替」パネルと同じチップ（Chip）。表示中は路線色で塗り、
 *   押すと非表示の見た目（塗らずに丸で色を示す）になり、もう一度押すと表示に戻る
 * - 押したときの処理は呼び出し側の既存の切り替え（toggleRoute）を使う。ここでは状態を持たない
 *
 * 見出しを押すと開閉する（開閉の状態は呼び出し側が持ち、保存する）。
 * 見出し「表示路線N件」の下に一覧を出し、5件を超える分は一覧の中でスクロールする。
 * 地図を覆いすぎないよう幅は狭く固定し、長い路線名・見出しは見切らせる（開閉の印は必ず見せる）。
 */
import React from 'react';
import { translateUI, type Language } from '../../utils/translation';
import CollapsiblePanel from '../ui/molecules/CollapsiblePanel';
import { FLOATING_BUTTON_HEIGHT } from '../ui/atoms/FloatingButton';
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
/** 開いた一覧に一度に見せる路線の数。これより多いときは一覧の中でスクロールする */
const VISIBLE_ROWS = 5;
/** 凡例の幅。地図を覆いすぎないよう狭くし、長い路線名・見出しは見切らせる */
const LEGEND_WIDTH = '168px';
/** 一覧の高さ: VISIBLE_ROWS 件ぶんのチップ＋間の隙間＋上下の余白 */
const LIST_MAX_HEIGHT = `calc(${VISIBLE_ROWS} * ${CONTROL_SIZE[CHIP_SIZE].minHeight}px + ${VISIBLE_ROWS - 1} * ${L.sp.xs} + 2 * ${L.sp.sm})`;

export default function VisibleRoutesLegend({ items, theme, language, onToggleRoute, collapsed = false, onToggleCollapsed, style }: VisibleRoutesLegendProps) {
  if (items.length === 0) return null;
  const visibleCount = items.filter(i => i.visible).length;

  return (
    <CollapsiblePanel
      theme={theme}
      title={translateUI('visibleRoutesLegendCount', language, { count: visibleCount })}
      ariaLabel={translateUI('visibleRoutesLegendTitle', language)}
      expanded={!collapsed}
      onToggle={onToggleCollapsed}
      headerHeight={FLOATING_BUTTON_HEIGHT}
      style={{ width: LEGEND_WIDTH, ...style }}
      bodyStyle={{
        display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: L.sp.xs,
        maxHeight: LIST_MAX_HEIGHT, overflowY: 'auto', overscrollBehavior: 'contain',
        padding: L.sp.sm,
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
          styleOverride={{ justifyContent: 'flex-start', flexShrink: 0, maxWidth: '100%' }}
        />
      ))}
    </CollapsiblePanel>
  );
}
