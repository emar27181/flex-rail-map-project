/**
 * マウスで操作する端末か（ホバーできる・ポインターが細い。src/constants/breakpoints.ts の MEDIA.mouse）。
 *
 * ホバーで何かを出す・見た目を変える処理は、これが true のときだけ付ける。
 * iPhone の Safari は、タップした要素にホバーで中身が変わる処理（吹き出しを出す・強調する）があると、
 * 1回目のタップをホバーとして扱い、クリックを送らない。2026-11: 地図の線をタップしても路線の表示が
 * 切り替わらず、路線名の吹き出しが出るだけになっていた。
 * サーバー描画・初回は false（指で操作する側）として扱い、描画後に実際の端末で決め直す。
 */
import { useEffect, useState } from 'react';
import { MEDIA } from '../constants/breakpoints';

export function useCanHover(): boolean {
  const [canHover, setCanHover] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(MEDIA.mouse).matches);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(MEDIA.mouse);
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return canHover;
}
