/**
 * 地図の下の知らせ（スナックバー）の状態を1か所で持つ。
 * 路線の切り替え・モードの案内など、すべての知らせはここを通す（種類は components/map/mapNotice.ts）。
 * 表示は components/map/MapNoticeSnackbar.tsx。
 */
import { useCallback, useState } from 'react';
import { nextMapNotice, type MapNotice, type MapNoticeContent } from '../components/map/mapNotice';

export function useMapNotice() {
  const [notice, setNotice] = useState<MapNotice | null>(null);
  const notify = useCallback((content: MapNoticeContent) => {
    setNotice(prev => nextMapNotice(prev, content));
  }, []);
  const notifyRouteToggle = useCallback((routeKey: string, shown: boolean, removeFromAvailable = false) => notify({ kind: 'routeToggle', routeKey, shown, removeFromAvailable }), [notify]);
  const notifyMessage = useCallback((message: string, tone: 'info' | 'warning' = 'info') => notify({ kind: 'message', message, tone }), [notify]);
  const clearNotice = useCallback(() => setNotice(null), []);
  return { notice, notifyRouteToggle, notifyMessage, clearNotice };
}
