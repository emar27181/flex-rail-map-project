/**
 * 見出しの行と中身を1枚の箱にまとめた、開閉できるパネル（モレキュール）。
 *
 * 見出し（DisclosureHeader）と中身を同じ枠の中に入れ、開いているときは区切り線でつなぐ。
 * 見出しと中身を別々の箱にすると、どの見出しの中身なのかが分かりにくい
 * （凡例で見出しと一覧が離れていたのを、駅選択・表示路線の切替と同じ形にそろえた）。
 *
 * 地図の上に浮かせるので、地は floatingSurface.ts（閉じているときは透け、開くとほぼ不透明）。
 * 閉じているときは見出しの行だけになる。size="floating" なら高さ・文字は FLOATING_CONTROL。
 */
import React, { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import DisclosureHeader from '../atoms/DisclosureHeader';
import type { DisclosureHeaderSize } from '../atoms/DisclosureHeader';
import { CONTROL_BORDER_WIDTH } from '../atoms/controlSize';
import { floatingSurfaceStyle } from '../atoms/floatingSurface';

export interface CollapsiblePanelProps {
  title: ReactNode;
  expanded: boolean;
  onToggle?: () => void;
  theme: 'light' | 'dark';
  /** 見出しの大きさ（DisclosureHeader の size）。地図の上に浮かべるときは floating */
  size?: DisclosureHeaderSize;
  /** 読み上げ用の名前（見出しが件数入りなど短いとき） */
  ariaLabel?: string;
  /** 中身の箱の指定（高さの上限・スクロールなど） */
  bodyStyle?: CSSProperties;
  /** パネル全体の位置・幅 */
  style?: CSSProperties;
  children: ReactNode;
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title, expanded, onToggle, theme, size = 'panel', ariaLabel, bodyStyle, style, children,
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
      }}
    >
      <DisclosureHeader
        title={title}
        expanded={expanded}
        onToggle={onToggle}
        theme={theme}
        size={size}
        // 上下の枠線の分を引いて、閉じた箱全体の高さを丸いボタンとそろえる
        frameInset={CONTROL_BORDER_WIDTH * 2}
        controlsId={bodyId}
      />
      {expanded && (
        <div id={bodyId} style={{ minHeight: 0, ...bodyStyle }}>
          {children}
        </div>
      )}
    </section>
  );
};

export default CollapsiblePanel;
