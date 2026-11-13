/**
 * 地図の下に出す知らせの表示（オーガニズム）。出すのは常にこの1か所で、知らせは一度に1つ。
 * 種類ごとの見た目: 路線の切り替え → RouteToggleSnackbar（路線の色の点つき）／文だけの案内 → Snackbar。
 * どちらも帯そのもの（自動で消える・1行・読み上げ）は ui/molecules/Snackbar。位置は呼び出し側が決める。
 */
import React from 'react';
import Snackbar from '../ui/molecules/Snackbar';
import RouteToggleSnackbar from './RouteToggleSnackbar';
import type { MapNotice } from './mapNotice';
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
}

const MapNoticeSnackbar: React.FC<Props> = ({ notice, theme, language, bottom, routeName, routeColor, onClose }) => {
  if (!notice) return null;
  if (notice.kind === 'routeToggle') {
    return (
      <RouteToggleSnackbar
        notice={{ id: notice.id, routeKey: notice.routeKey, shown: notice.shown }}
        routeName={routeName(notice.routeKey)}
        routeColor={routeColor(notice.routeKey)}
        theme={theme}
        language={language}
        bottom={bottom}
        onClose={onClose}
      />
    );
  }
  return <Snackbar key={notice.id} theme={theme} bottom={bottom} message={notice.message} onClose={onClose} />;
};

export default MapNoticeSnackbar;
