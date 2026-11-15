/**
 * 地図の下に出す知らせの表示（オーガニズム）。出すのは常にこの1か所で、知らせは一度に1つ。
 * 種類ごとの見た目: 路線の切り替え → RouteToggleSnackbar（路線の色の点つき）／文だけの案内 → Snackbar（文末を切らず2行まで折り返す）。
 * どちらも帯そのもの（自動で消える・読み上げ）は ui/molecules/Snackbar。
 *
 * **出す場所は知らせの種類で決める**（mapNotice.ts の noticePlacement）。入力が足りないなど、駅選択パネルでの操作の結果は、
 * 操作した場所の近く（パネルのすぐ下）に、注意の印（アイコン）つきで出す。画面の下の端だと目に入らなかった（2026-11-13）。
 * パネルが見つからない（畳んである・埋め込み）ときは、従来どおり地図の下に出す。
 */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Info, TriangleAlert } from 'lucide-react';
import Snackbar from '../ui/molecules/Snackbar';
import RouteToggleSnackbar from './RouteToggleSnackbar';
import { MESSAGE_NOTICE_DURATION_MS, noticePlacement, type MapNotice } from './mapNotice';
import { placeBelow, type NoticePosition } from './mapNoticePlacement';
import { FLOATING_PANEL } from '../ui/atoms/controlSize';
import { SEMANTIC } from '../../constants/ui';
import { getThemeColors } from '../../contexts/ThemeContext';
import { CONTROL_SIZE } from '../ui/atoms/controlSize';
import type { Language } from '../../utils/translation';

interface Props {
  notice: MapNotice | null;
  theme: 'light' | 'dark';
  language: Language;
  bottom: string;
  /** 路線名（日本語）と、テーマに合わせた路線色。路線の切り替えの知らせで使う */
  routeName: (routeKey: string) => string;
  routeColor: (routeKey: string) => string;
  onClose: () => void;
  /** 路線の切り替えを元に戻す（切り替えた路線と、切り替えたあとの状態を渡す） */
  onUndoRouteToggle?: (notice: { routeKey: string; shown: boolean; removeFromAvailable?: boolean }) => void;
}

/** 駅選択パネルの下に出すときの、パネルとの隙間と、最小の幅（px。狭いパネルでも文が読める幅） */
const NEAR_INPUT_GAP_PX = parseFloat(FLOATING_PANEL.gap);
const NEAR_INPUT_MIN_WIDTH_PX = 240;

const MapNoticeSnackbar: React.FC<Props> = ({ notice, theme, language: _language, bottom, routeName, routeColor, onClose, onUndoRouteToggle }) => {
  const sentinel = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<{ id: number; pos: NoticePosition | null } | null>(null);
  const colors = getThemeColors(theme);
  const near = notice ? noticePlacement(notice) === 'near-input' : false;

  // 駅選択パネルの位置を、知らせを出す直前に測る（パネルの高さは中身で変わる）。親要素（地図）の座標に直す
  useLayoutEffect(() => {
    if (!notice || !near) { setPosition(null); return; }
    const anchor = document.querySelector('[data-station-selector]') as HTMLElement | null;
    const container = sentinel.current?.offsetParent as HTMLElement | null;
    if (!anchor || !container) { setPosition({ id: notice.id, pos: null }); return; }
    const a = anchor.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    setPosition({ id: notice.id, pos: placeBelow(a, c, NEAR_INPUT_GAP_PX, NEAR_INPUT_MIN_WIDTH_PX) });
  }, [notice, near]);

  return (
    <>
      {/* 置き先（親要素）の座標を知るための目印。大きさは持たない */}
      <span ref={sentinel} aria-hidden style={{ position: 'absolute', width: 0, height: 0, visibility: 'hidden' }} />
      {renderNotice()}
    </>
  );

  function renderNotice() {
    if (!notice) return null;
    if (notice.kind === 'routeToggle') {
      return (
        <RouteToggleSnackbar
          notice={{ id: notice.id, routeKey: notice.routeKey, shown: notice.shown }}
          routeName={routeName(notice.routeKey)}
          routeColor={routeColor(notice.routeKey)}
          theme={theme}
          language={_language}
          bottom={bottom}
          onClose={onClose}
          onUndo={onUndoRouteToggle ? () => onUndoRouteToggle({ routeKey: notice.routeKey, shown: notice.shown, removeFromAvailable: notice.removeFromAvailable }) : undefined}
        />
      );
    }
    // 測り終わるまで出さない（位置が飛ぶのを避ける）
    if (position?.id !== notice.id) return null;
    const warning = notice.tone === 'warning';
    const Icon = warning ? TriangleAlert : Info;
    const pos = position.pos;
    return (
      <Snackbar
        key={notice.id}
        theme={theme}
        bottom={bottom}
        message={notice.message}
        onClose={onClose}
        duration={MESSAGE_NOTICE_DURATION_MS}
        // 注意の印。色は意味で選ぶ（注意=橙）。目に止まるよう、文の前に置く
        leading={<Icon aria-hidden size={CONTROL_SIZE.md.iconSize} style={{ flexShrink: 0, color: warning ? SEMANTIC.warning : colors.textSecondary }} />}
        // 文は切らずに2行まで折り返す（Snackbar の multiline）
        multiline
        style={pos ? { left: pos.left, top: pos.top, bottom: 'auto', transform: 'none', maxWidth: pos.maxWidth } : undefined}
      />
    );
  }
};

export default MapNoticeSnackbar;
