/**
 * 知らせ（Snackbar）を「操作した場所のすぐ下」に出すときの位置の計算（純粋関数。測るのは MapNoticeSnackbar）。
 *
 * 基準の箱（駅選択パネル）の左端にそろえ、その下に隙間（gap）を空けて置く。幅は基準の箱を超えない。
 * 置く先の地図（知らせの親要素）の座標に直して返す。
 */
export interface Box { left: number; top: number; right: number; bottom: number }

export interface NoticePosition {
  /** 親の左端からの距離 */
  left: number;
  /** 親の上端からの距離 */
  top: number;
  /** 知らせの最大の幅（基準の箱の幅。狭いときも minWidth までは取る） */
  maxWidth: number;
}

export function placeBelow(anchor: Box, container: Box, gap: number, minWidth: number): NoticePosition {
  const anchorWidth = anchor.right - anchor.left;
  const containerWidth = container.right - container.left;
  const maxWidth = Math.min(Math.max(anchorWidth, minWidth), containerWidth);
  // 地図の右端からはみ出さないよう、左端を内側に寄せる
  const rawLeft = anchor.left - container.left;
  const left = Math.max(0, Math.min(rawLeft, containerWidth - maxWidth));
  return { left, top: anchor.bottom - container.top + gap, maxWidth };
}
