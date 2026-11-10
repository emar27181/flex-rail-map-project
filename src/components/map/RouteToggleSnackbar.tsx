/**
 * 地図の線をタップして路線の表示を切り替えたときに、どの路線をどうしたかを画面の下に出す（オーガニズム）。
 * 「山手線を非表示にしました ［元に戻す］」。押し間違えたら「元に戻す」で戻せる。
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
  onUndo: () => void;
  onClose: () => void;
}

const RouteToggleSnackbar: React.FC<RouteToggleSnackbarProps> = ({
  notice, routeName, routeColor, theme, language, bottom, onUndo, onClose,
}) => {
  const route = translateRoute(routeName, language);
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
      message={translateUI(notice.shown ? 'routeToggledShown' : 'routeToggledHidden', language, { route })}
      actionLabel={translateUI('undo', language)}
      onAction={onUndo}
      onClose={onClose}
      closeLabel={translateUI('close', language)}
    />
  );
};

export default RouteToggleSnackbar;
