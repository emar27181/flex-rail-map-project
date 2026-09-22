/**
 * 駅名検索の候補ドロップダウン。
 *
 * 出発駅・到着駅・経由駅の3箇所で同じ形の候補リストが必要だったが、
 * 出発駅・到着駅は`createPortal`で`document.body`直下に描画する一方、
 * 経由駅だけ簡易版としてパネル内に`position: absolute`で描画していた。
 * パネル自体がスクロール領域（`overflow`つき）を持つため、経由駅の候補は
 * パネルの外にはみ出す分が見切れていた。
 *
 * 見た目・位置決めの仕組み（portal・fixed位置・寸法・スクロール挙動）を
 * ここ1箇所にまとめ、呼び出し側は「どの駅を渡すか」「選んだら何をするか」
 * だけを持つ。フォーカス確定時の挙動（blurで確定する／しない等）は
 * 呼び出し側ごとに異なるため、ここでは扱わずpropsで受け取る。
 */
import React from 'react';
import { createPortal } from 'react-dom';
import type { Station } from '../../data/yamanote';
import { translateStation, translateUI } from '../../utils/translation';
import type { Language } from '../../utils/translation';
import { getThemeColors } from '../../contexts/ThemeContext';
import { FS } from '../../constants/ui';
import { L } from '../legend/legendStyles';

export interface StationSearchDropdownPosition {
  top: number;
  left: number;
  width: number;
}

export interface StationSearchDropdownProps {
  position: StationSearchDropdownPosition;
  stations: Station[];
  onSelect: (station: Station) => void;
  theme: 'light' | 'dark';
  language: Language;
  /** 検索欄に文字が入っているか。空なら「よく使う駅」系のヒント文言を出す */
  hasQuery: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
}

const StationSearchDropdown = React.forwardRef<HTMLDivElement, StationSearchDropdownProps>(({
  position,
  stations,
  onSelect,
  theme,
  language,
  hasQuery,
  onMouseDown,
  onTouchStart,
  onTouchMove,
}, ref) => {
  const colors = getThemeColors(theme);

  return createPortal(
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        backgroundColor: colors.surfaceElevated,
        border: `1px solid ${colors.border}`,
        borderRadius: L.r.control,
        boxShadow: `0 4px 12px ${colors.shadow}`,
        maxHeight: '240px',
        overflowY: 'auto',
        // iOSで候補内をスクロールしたとき、端に達しても地図やページ側へ
        // スクロールが伝播しないようにする
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        // body に touch-action: manipulation が掛かっており、
        // 指定しないと縦スワイプがスクロールとして扱われない端末がある
        touchAction: 'pan-y',
        zIndex: 99999,
      }}
    >
      {stations.map((station, index) => (
        <div
          key={`${station.name}-${index}`}
          onClick={() => onSelect(station)}
          style={{
            padding: `${L.sp.md} ${L.sp.xl}`,
            cursor: 'pointer',
            borderBottom: index < stations.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
            fontSize: FS.body,
            wordBreak: language === 'english' ? 'break-word' : 'normal',
            lineHeight: '1.3',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surface}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.surfaceElevated}
        >
          {translateStation(station.name, language)}
        </div>
      ))}
      {stations.length === 0 && (
        <div style={{ padding: `${L.sp.md} ${L.sp.xl}`, color: colors.textSecondary, fontSize: FS.body }}>
          {hasQuery ? translateUI('noStationFound', language) : translateUI('majorStationsHint', language)}
        </div>
      )}
    </div>,
    document.body
  );
});

StationSearchDropdown.displayName = 'StationSearchDropdown';

export default StationSearchDropdown;
