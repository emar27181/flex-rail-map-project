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
 * 広告の出し方（2026-11 ユーザー決定）: **こちらで決めた位置にだけ出す。**
 *
 * - 自動広告（Google が位置を選んでページに差し込む広告）は使わない。全画面広告（Vignette）・
 *   画面下に貼り付くアンカー広告も使わない。どれも AdSense の管理画面でオフにする（docs/ads-operation.md）
 * - 広告スクリプト（ADSENSE_SCRIPT_SRC）は、そのページに有効な広告ユニット ID の枠があるときだけ読む
 *   （hasManualAdSlot）。スクリプトを読んだページでは、管理画面の自動広告の設定が効いてしまうため。
 *   サイトの所有確認は <meta name="google-adsense-account"> で行い、スクリプトには頼らない
 * - 広告ユニット ID は AdSense の管理画面「広告 → 広告ユニットごと」で作った広告の data-ad-slot。
 *   推測した値・仮の値を入れない。空のあいだは、その広告枠は本番に出さず、スクリプトも読まない
 */
export const ADSENSE_SLOTS = {
  /**
   * 記事の本文の間（utils/articleRender.ts）と記事一覧のジャンルの間（ArticleIndexCategories.astro）。
   * 同じユニットを1ページに何回置いてもよい（AdSense の決まり）
   */
  articleInline: '',
  /**
   * 地図の画面の下（StickyBottomAd.tsx。閉じるボタン付き・配信があるときだけ出る）。
   * 2026-10 まで実在を確かめられていない仮の値 `0987654321` が直接書かれていたため空に戻した
   */
  mapBottom: '',
} as const;

/** 広告ユニット ID が1つでも入っているか（広告スクリプトを読むかの判定） */
export function hasManualAdSlot(...slots: string[]): boolean {
  return slots.some(slot => slot.trim() !== '');
}

/** 記事の本文の間の広告の大きさ（ui/atoms/adSlot.ts） */
export const AD_PLACEMENT = {
  inlineMaxWidth: '600px',
  inlinePreviewMinHeight: '84px',
  inlineFormat: 'horizontal',
} as const;
