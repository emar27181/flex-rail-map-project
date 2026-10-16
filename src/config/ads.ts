/**
 * 広告（Google AdSense）の設定。ここだけに書く。
 *
 * 以前はサイト運営者の ID（ca-pub-…）が地図・記事・静的ページ・広告の部品の6か所に直接書かれていた。
 * 書き換えるときに1か所だけ直し忘れると、その画面だけ広告が出なくなる。
 * 直書きは tests/unit/config/ads.test.ts が落とす。
 */

/** AdSense のサイト運営者 ID */
export const ADSENSE_CLIENT = 'ca-pub-2444529114040977';

/** AdSense の広告スクリプト（ページに1回だけ読む） */
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

/**
 * 広告ユニット ID（AdSense の管理画面「広告 → 広告ユニットごと」で作った広告の data-ad-slot）。
 *
 * 推測した値・仮の値を入れない（2026-10: 地図の下の固定広告の `0987654321` は管理画面で
 * 実在を確かめられていない仮の値のまま残っている）。空のあいだは、その広告枠は本番に出さない。
 *
 * - articleInline: 記事の本文の間と読み終わった後に置く「記事内広告」（ui/atoms/adSlot.ts）。
 *   同じユニットを1ページに何回置いてもよい（AdSense の決まり）
 */
export const ADSENSE_SLOTS = {
  articleInline: '',
} as const;
