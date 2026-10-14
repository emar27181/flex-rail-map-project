/**
 * 見出しの行と中身を1枚の箱にまとめた、開閉できるパネル（モレキュール）。
 *
 * 見出し（DisclosureHeader）と中身を同じ枠の中に入れ、開いているときは区切り線でつなぐ。
 * 見出しと中身を別々の箱にすると、どの見出しの中身なのかが分かりにくい
 * （凡例で見出しと一覧が離れていたのを、駅選択・表示路線の切替と同じ形にそろえた）。
 *
 * 地図の上に浮かせるので、地は floatingSurface.ts（閉じているときは透け、開くとほぼ不透明）。
 * 閉じているときは見出しの行だけになる。
 *
 * 見出しの高さ・文字は**常に** FLOATING_CONTROL（隣に浮かぶ「表示切替」・隅の丸いボタンと同じ）。
 * 以前は大きさを選べて既定がパネル用（FS.title）だったため、立体表示の箱だけ見出しが大きくなった（2026-10-14）。
 * 幅・高さの上限は FLOATING_PANEL から取る（width / maxHeight）。呼び出し側で px を書かない。
 */
import React, { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import DisclosureHeader from '../atoms/DisclosureHeader';
import { CONTROL_BORDER_WIDTH, FLOATING_PANEL, floatingPanelWidth, type FloatingPanelWidth } from '../atoms/controlSize';
import { floatingSurfaceStyle } from '../atoms/floatingSurface';

export interface CollapsiblePanelProps {
  title: ReactNode;
  expanded: boolean;
  onToggle?: () => void;
  theme: 'light' | 'dark';
  /** 幅の段階（FLOATING_PANEL.width）。狭い画面では地図の端との間を残して縮む */
  width: FloatingPanelWidth;
  /** 開いたときの中身の高さの上限を FLOATING_PANEL.maxHeight にする（中はスクロール）。既定は true */
  limitHeight?: boolean;
  /** 読み上げ用の名前（見出しが件数入りなど短いとき） */
  ariaLabel?: string;
  /** 中身の箱の指定（高さの上限・スクロールなど） */
  bodyStyle?: CSSProperties;
  /** パネルの位置（top / bottom / left / right）。幅は width で決める */
  style?: CSSProperties;
  children: ReactNode;
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title, expanded, onToggle, theme, width, limitHeight = true, ariaLabel, bodyStyle, style, children,
}) => {
  const bodyId = useId();
  return (
    <section
      aria-label={ariaLabel}
      style={{
        display: 'flex', flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...floatingSurfaceStyle(theme, expanded ? 'open' : 'idle'),
        ...style,
        width: floatingPanelWidth(width),
      }}
    >
      <DisclosureHeader
        title={title}
        expanded={expanded}
        onToggle={onToggle}
        theme={theme}
        size="floating"
        // 上下の枠線の分を引いて、閉じた箱全体の高さを丸いボタンとそろえる
        frameInset={CONTROL_BORDER_WIDTH * 2}
        controlsId={bodyId}
      />
      {expanded && (
        <div
          id={bodyId}
          style={{
            minHeight: 0,
            ...(limitHeight ? { maxHeight: FLOATING_PANEL.maxHeight, overflowY: 'auto', overscrollBehavior: 'contain' } : {}),
            ...bodyStyle,
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
};

export default CollapsiblePanel;
