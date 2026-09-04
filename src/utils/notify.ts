/**
 * ブラウザ通知の送出。
 *
 * 画面を見ていないときに気づけることが目的なので OS 通知を第一に使うが、
 * 通知が使えない環境（許可されていない、iOS でホーム画面に追加していない等）でも
 * 機能が死なないよう、呼び出し側が画面内バナーにフォールバックできる形で結果を返す。
 */

export type NotifyPermission = 'granted' | 'denied' | 'default' | 'unsupported';

/** この端末・ブラウザで OS 通知が使えるか */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/** 現在の許可状態 */
export function getNotifyPermission(): NotifyPermission {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission as NotifyPermission;
}

/**
 * 通知の許可を求める。
 *
 * iOS Safari はホーム画面に追加した PWA でしか通知を出せず、
 * ブラウザのタブから呼ぶと unsupported / denied になる。
 * その場合も例外にせず状態だけ返し、呼び出し側で案内する。
 */
export async function requestNotifyPermission(): Promise<NotifyPermission> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    return (await Notification.requestPermission()) as NotifyPermission;
  } catch {
    // 古い Safari は Promise を返さない実装があるため握りつぶす
    return getNotifyPermission();
  }
}

/**
 * 通知を出す。出せた場合のみ true を返す。
 * false のときは呼び出し側が画面内バナーなどで代替する。
 */
export function sendNotification(title: string, body: string, tag?: string): boolean {
  if (getNotifyPermission() !== 'granted') return false;
  try {
    const n = new Notification(title, {
      body,
      tag,
      // 同じ tag の通知は差し替える。到着が近づくたびに積み上がらないようにする
      renotify: false,
      silent: false,
    } as NotificationOptions);
    // クリックで元のタブに戻れるようにする
    n.onclick = () => {
      try { window.focus(); } catch { /* 失敗しても通知自体は成立している */ }
      n.close();
    };
    return true;
  } catch {
    return false;
  }
}

/**
 * 端末を短く振動させる。通知音を切っている人向けの補助。
 * 対応していない端末では何も起きない。
 */
export function vibrate(pattern: number | number[] = [200, 100, 200]): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // 対応外の端末では何もしない
  }
}
