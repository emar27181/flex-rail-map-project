/**
 * 地図の線をタップして路線の表示を切り替えたときに、どの路線をどうしたかを画面の下に1行で出す（オーガニズム）。
 * 「● 山手線を非表示にしました　［元に戻す］」。押し間違えたときにすぐ戻せるよう、**「元に戻す」を付ける**（2026-11-14 ユーザー指示。
 * 2026-11 に一度「同じ線をもう一度押せば戻る」として外したが、帯から戻せるほうが分かりやすい）。
 * 長い路線名（「東武伊勢崎線（スカイツリーライン）」など）は路線名だけを「…」で省略し、「を非表示にしました」は残す
 * （文の終わりが切れると、表示したのか消したのか分からなくなるため）。
 *
 * 2026-11: 指の端末では線に路線名の吹き出し（ホバー）を出さない（hooks/useCanHover.ts）ため、
 * タップで切り替えても、どの路線が消えた・出たのか分からなかった。
 * 帯そのもの（自動で消える・操作1つ・読み上げ）は ui/molecules/Snackbar。ここは路線名と色を決めるだけ。
 */
import React from 'react';
import Snackbar from '../ui/molecules/Snackbar';
import { translateRoute, translateUI } from '../../utils/translation';
import type { Language } from '../../utils/translation';
import { L } from '../legend/legendStyles';

export interface RouteToggleNotice {
  /** 知らせを作り直す鍵（同じ路線を続けて押しても、そのたびに時間を数え直す） */
  id: number;
  routeKey: string;
  /** 切り替えたあと表示中か */
  shown: boolean;
  /** 「元に戻す」で一覧からも外すか（RailwayMap が使う。ここでは見た目に使わない） */
  removeFromAvailable?: boolean;
}

interface RouteToggleSnackbarProps {
  notice: RouteToggleNotice;
  /** 路線名（日本語。表示する言語へは中で訳す） */
  routeName: string;
  /** 路線の色（テーマに合わせたもの） */
  routeColor: string;
  theme: 'light' | 'dark';
  language: Language;
  bottom: string;
  onClose: () => void;
  /** 「元に戻す」を押したとき（切り替える前の状態に戻す）。渡さなければボタンを出さない */
  onUndo?: () => void;
}

/** 文言の {route} の位置で前後に分ける（言語ごとに路線名の位置が違う: 「{route}を表示しました」「Showing {route}」） */
const ROUTE_SLOT = '\u0000';

const RouteToggleSnackbar: React.FC<RouteToggleSnackbarProps> = ({
  notice, routeName, routeColor, theme, language, bottom, onClose, onUndo,
}) => {
  const route = translateRoute(routeName, language);
  const [before = '', after = ''] = translateUI(notice.shown ? 'routeToggledShown' : 'routeToggledHidden', language, { route: ROUTE_SLOT }).split(ROUTE_SLOT);
  return (
    <Snackbar
      key={notice.id}
      theme={theme}
      bottom={bottom}
      leading={(
        <span
          aria-hidden
          data-route-color
          style={{ width: L.sp.md, height: L.sp.md, borderRadius: L.r.pill, backgroundColor: routeColor, flexShrink: 0 }}
        />
      )}
      message={(
        <>
          {before && <span style={{ flexShrink: 0 }}>{before}</span>}
          <span data-route-name style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{route}</span>
          {after && <span style={{ flexShrink: 0 }}>{after}</span>}
        </>
      )}
      actionLabel={onUndo ? translateUI('undoAction', language) : undefined}
      onAction={onUndo}
      onClose={onClose}
    />
  );
};

export default RouteToggleSnackbar;
