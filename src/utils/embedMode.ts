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

/**
 * 埋め込んだページの中で開く位置（節の id）。`#id` を iframe のURLに付けると、
 * ブラウザが記事のページごとその位置までスクロールしてしまい、記事が途中から表示されていた
 * （冒頭の地図デモが見えない）。埋め込まれたページが自分の中だけをスクロールする（embedSectionScript）。
 */
export const EMBED_SECTION_PARAM = 'section';

/** 埋め込まれたページで、?section=id の節まで自分の中だけをスクロールするスクリプト（<script is:inline> 用） */
export const EMBED_SECTION_SCRIPT = `(function(){
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('${EMBED_PARAM}') !== '1') return;
    var id = q.get('${EMBED_SECTION_PARAM}');
    if (!id) return;
    var go = function () {
      var el = document.getElementById(id);
      // scrollIntoView は親（記事）のページまで動かすので使わない。window.scrollTo はこの iframe の中だけ
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    };
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
  } catch (e) {}
})();`;

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
