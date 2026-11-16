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
  | { kind: 'routeToggle'; routeKey: string; shown: boolean; /** 「元に戻す」で、一覧（表示できる路線）からも外すか。もともと一覧に無かった路線を足したとき true */ removeFromAvailable?: boolean }
  /** 文だけの案内（例: 到着駅を決めてから使うモード）。文言は言語に合わせて呼び出し側が渡す */
  | { kind: 'message'; message: string; /** 注意（足りない入力など）は warning。既定は info */ tone?: 'info' | 'warning' };

/**
 * 知らせを出す場所。**操作した場所の近く**に出す（ベストプラクティス: フィードバックは、操作・入力の近くに出す。
 * 画面の下の端は目に入らない。2026-11-13 ユーザー指摘「下すぎてポップアップが目に止まらない」）。
 * - message（入力が足りない・モードが使えない、など駅選択パネルでの操作の結果）→ 駅選択パネルのすぐ下（near-input）
 * - routeToggle（地図の線をタップした結果）→ 地図の下（bottom）。タップした線は地図の上で、指の下にあるため
 */
export type MapNoticePlacement = 'near-input' | 'bottom';
export function noticePlacement(notice: MapNoticeContent): MapNoticePlacement {
  return notice.kind === 'message' ? 'near-input' : 'bottom';
}

/** 行動が必要な文の知らせを出しておく時間。短い知らせ（4秒）より長く、読み終えて動けるようにする */
export const MESSAGE_NOTICE_DURATION_MS = 6000;

/** 画面に出している知らせ。id は作り直す鍵（同じ知らせを続けて起こしても、そのたびに時間を数え直す） */
export type MapNotice = MapNoticeContent & { id: number };

/** 次の知らせ。前のものを置き換え、id を進める */
export function nextMapNotice(prev: MapNotice | null, content: MapNoticeContent): MapNotice {
  return { ...content, id: (prev?.id ?? 0) + 1 };
}
