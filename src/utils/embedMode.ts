/**
 * 地図を記事などに埋め込む表示（`?embed=1`）。
 *
 * 記事の中に「その記事の内容に絞った地図」を iframe で見せるための表示。
 * 地図ページ（/）と同じものを、URL の指定だけで埋め込み向けにする
 * （別のページを作ると、地図ページの CSS・設定を2か所で持つことになるため）。
 *
 * 埋め込み表示では、ナビゲーション・フッター・広告・Cookie の案内を出さず、
 * 駅選択と路線の凡例のパネルを閉じた状態で始める（小さな枠で地図を広く見せるため）。
 * 開いたときに1回だけ読む。
 */
export const EMBED_PARAM = 'embed';

export function isEmbedValue(value: string | null | undefined): boolean {
  return value === '1';
}

export function isEmbedMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return isEmbedValue(new URLSearchParams(window.location.search).get(EMBED_PARAM));
  } catch {
    return false;
  }
}
