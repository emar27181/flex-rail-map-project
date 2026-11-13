/**
 * 地図の下に出す知らせ（スナックバー）の種類と、次の知らせの作り方。
 *
 * 知らせは**一度に1つ**で、新しいものが前のものを置き換える（Material Design のスナックバーと同じ）。
 * これまでは路線の切り替えの知らせと、終電モードの案内が別々の状態・別々の表示になっていて、
 * 「ほかの知らせと一元管理」できていなかった（2026-11 ユーザー指示）。
 * 新しい知らせを足すときは、ここに種類を足し、`MapNoticeSnackbar` の表示を足す（状態は増やさない）。
 *
 * 知らせの置き場所と使い方: hooks/useMapNotice.ts
 */

/** 知らせの中身（どの種類か） */
export type MapNoticeContent =
  /** 地図の線をタップして路線を切り替えた（どの路線を表示・非表示にしたか） */
  | { kind: 'routeToggle'; routeKey: string; shown: boolean }
  /** 文だけの案内（例: 到着駅を決めてから使うモード）。文言は言語に合わせて呼び出し側が渡す */
  | { kind: 'message'; message: string };

/** 画面に出している知らせ。id は作り直す鍵（同じ知らせを続けて起こしても、そのたびに時間を数え直す） */
export type MapNotice = MapNoticeContent & { id: number };

/** 次の知らせ。前のものを置き換え、id を進める */
export function nextMapNotice(prev: MapNotice | null, content: MapNoticeContent): MapNotice {
  return { ...content, id: (prev?.id ?? 0) + 1 };
}
