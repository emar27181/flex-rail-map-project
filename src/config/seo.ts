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

/** hreflang の1件（href は絶対URL） */
export interface HreflangLink {
  hreflang: string;
  href: string;
}

/**
 * 対応する各言語版のページ（別URLで実在するもの）から hreflang を組み立てる。
 *
 * - 対応ページが自分だけ（1言語しか無い）なら何も出さない
 *   （自己参照だけの hreflang は意味が無い）
 * - `?lang=` のようなクエリ付きURLは渡さないこと。canonical が別URLを指す
 *   ページを hreflang の相手にすると、検索エンジンは矛盾として無視する
 *   （以前の固定ページ・トップページがこの状態だった）
 * - x-default は defaultLang の版（無ければ先頭）
 */
export function buildHreflangLinks(
  versions: Array<{ lang: string; path: string }>,
  defaultLang: string,
): HreflangLink[] {
  if (versions.length < 2) return [];
  const def = versions.find(v => v.lang === defaultLang) ?? versions[0];
  return [
    ...versions.map(v => ({ hreflang: v.lang, href: canonicalUrl(v.path) })),
    { hreflang: 'x-default', href: canonicalUrl(def.path) },
  ];
}

/** パンくずの1段（path はサイト内のパス） */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * BreadcrumbList の構造化データ。画面に出すパンくずと同じ並びを渡すこと
 * （見えていない階層を構造化データにだけ書かない）。
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: canonicalUrl(it.path),
    })),
  };
}

/** Open Graph の og:locale（言語コード → ロケール） */
export const OG_LOCALE: Record<'ja' | 'en' | 'zh' | 'ko', string> = {
  ja: 'ja_JP',
  en: 'en_US',
  zh: 'zh_CN',
  ko: 'ko_KR',
};
