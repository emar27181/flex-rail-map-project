/**
 * テーマ（ライト/ダーク）の保存先と、埋め込み表示でのテーマの受け渡し。
 *
 * 以前は地図・静的ページが localStorage の `theme`、記事が `frm-theme` と別々のキーに保存しており、
 * 記事で選んだテーマが地図に伝わらなかった。保存先はこのキー1つにする。
 * Astro の `<script is:inline>` から使うときは、この定数を `define:vars` や `set:html` で渡す（文字列を直書きしない）。
 *
 * 埋め込み表示（`?embed=1`, embedMode.ts）は、閲覧者が地図ページで選んだテーマではなく
 * 埋め込んだページのテーマに合わせる（明るい記事の中に暗い地図が出ないように）。
 * - 開くとき: URL の `theme`（ui/atoms/mapEmbed.ts のスクリプトがページのテーマを付ける）
 * - ページでテーマを切り替えたとき: `postMessage({ type: THEME_MESSAGE, theme })`
 * 埋め込み表示はテーマを保存しない（閲覧者の設定を上書きしない）。
 */
export type ThemeName = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';
/** 記事が以前使っていたキー。読むだけ（移行用） */
export const LEGACY_THEME_STORAGE_KEY = 'frm-theme';
/** 埋め込み表示に渡す URL パラメータ */
export const THEME_PARAM = 'theme';
/** 埋め込み表示へテーマの切り替えを伝えるメッセージの type */
export const THEME_MESSAGE = 'frm:theme';

export function isThemeName(value: unknown): value is ThemeName {
  return value === 'light' || value === 'dark';
}

/** 保存されたテーマ（無ければ null） */
export function readSavedTheme(): ThemeName | null {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeName(saved)) return saved;
    const legacy = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    return isThemeName(legacy) ? legacy : null;
  } catch {
    return null;
  }
}

export function saveTheme(theme: ThemeName): void {
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* 保存できなくても表示は続ける */ }
}

/** URL の `theme`（埋め込み表示で使う）。無ければ null */
export function getThemeFromUrl(search: string = typeof window === 'undefined' ? '' : window.location.search): ThemeName | null {
  try {
    const value = new URLSearchParams(search).get(THEME_PARAM);
    return isThemeName(value) ? value : null;
  } catch {
    return null;
  }
}
