/**
 * SEO関連メタデータの一元管理。
 *
 * サイト名・URL・OGP画像・GA4計測ID・Search Console確認コードは、
 * これまで index.astro / StaticPage.astro にそれぞれハードコードされていた。
 * ページを増やすたびに同じ値をコピーすると、hreflangのドメイン食い違い
 * （StaticPage.astroのコメント参照）と同じ不具合を繰り返す。
 * 新しいページ（将来の /lines/{line} 等）はここだけを参照する。
 *
 * GA4計測IDとSearch Console確認コードは秘密情報ではないが
 * （ビルド後のHTMLにそのまま出る）、環境ごとに値が変わるため
 * ソースにハードコードせず .env の環境変数から読む。
 */

/** 正式なサービス名。旧名 "Tokyo Flex Railway Map" は使わない */
export const SITE_NAME = 'Flex Railway Map';

/** 公開URL。末尾スラッシュなし */
export const SITE_URL = 'https://flex-railway-map.netlify.app';

/** OGP/Twitterカード用の既定画像 */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/icon_flex_rail_way_map.png`;

/**
 * GA4測定ID（例: "G-XXXXXXXXXX"）。
 * 未設定ならGA4は一切読み込まない（開発環境・プレビューでは通常未設定）。
 */
export const GA_MEASUREMENT_ID: string | undefined =
  import.meta.env.VITE_GA_MEASUREMENT_ID || undefined;

/**
 * Google Search Console のHTMLタグ確認用コード（content属性の値のみ）。
 * 未設定ならmetaタグ自体を出力しない。
 */
export const GOOGLE_SITE_VERIFICATION: string | undefined =
  import.meta.env.GOOGLE_SITE_VERIFICATION || undefined;

/** ページ単位のcanonical URLを組み立てる */
export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
