/**
 * 見出しの行と中身を1枚の箱にまとめた、開閉できるパネル（モレキュール）。
 *
 * 見出し（DisclosureHeader）と中身を同じ枠の中に入れ、開いているときは区切り線でつなぐ。
 * 見出しと中身を別々の箱にすると、どの見出しの中身なのかが分かりにくい
 * （凡例で見出しと一覧が離れていたのを、駅選択・表示路線の切替と同じ形にそろえた）。
 *
 * 地図の上に浮かせるので、背景は下の地図が透けるガラス調（駅選択パネルと同じ）。
 * 閉じているときは見出しの行だけになり、高さは `headerHeight` になる。
 */
import React, { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { L } from '../../legend/legendStyles';
import DisclosureHeader from '../atoms/DisclosureHeader';
import { CONTROL_BORDER_WIDTH } from '../atoms/controlSize';

export interface CollapsiblePanelProps {
  title: ReactNode;
  expanded: boolean;
  onToggle?: () => void;
  theme: 'light' | 'dark';
  /** 見出しの行の高さ(px)。地図の上では丸いボタンと同じ高さを渡す */
  headerHeight?: number;
  /** 読み上げ用の名前（見出しが件数入りなど短いとき） */
  ariaLabel?: string;
  /** 中身の箱の指定（高さの上限・スクロールなど） */
  bodyStyle?: CSSProperties;
  /** パネル全体の位置・幅 */
  style?: CSSProperties;
  children: ReactNode;
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title, expanded, onToggle, theme, headerHeight, ariaLabel, bodyStyle, style, children,
}) => {
  const colors = getThemeColors(theme);
  const bodyId = useId();
  return (
    <section
      aria-label={ariaLabel}
      style={{
        display: 'flex', flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
        border: `${CONTROL_BORDER_WIDTH}px solid ${colors.border}`,
        borderRadius: L.r.card,
        backgroundColor: expanded ? colors.glassOpen : colors.glassCollapsed,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: `0 2px 8px ${colors.shadow}`,
        ...style,
      }}
    >
      <DisclosureHeader
        title={title}
        expanded={expanded}
        onToggle={onToggle}
        theme={theme}
        // 上下の枠線の分を引いて、箱全体の高さを丸いボタンとそろえる
        height={headerHeight !== undefined ? headerHeight - CONTROL_BORDER_WIDTH * 2 : undefined}
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
