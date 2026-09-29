/**
 * サイト共通のフッターナビ（静的HTMLに出る内部リンク）の唯一の定義。
 *
 * 地図アプリ本体（/）のメニューはJSで描かれるため、静的HTMLだけを見ると
 * /faq・/contact・/privacy・/terms などにどこからもリンクが無い「孤立ページ」
 * になっていた。固定ページ・ガイド・記事の各レイアウトの末尾に同じリンク列を
 * 出す（SiteFooterNav.astro）。リンクを増やすときはここだけを直す。
 */
export type NavLang = 'ja' | 'en' | 'zh' | 'ko';

export interface SiteNavLink {
  path: string;
  /** 別の言語版が別URLにあるページ（ガイド・駅・路線の一覧など）は、その言語のページからそちらへ */
  localized?: Partial<Record<NavLang, string>>;
  label: Record<NavLang, string>;
}

export const SITE_FOOTER_LINKS: SiteNavLink[] = [
  { path: '/', label: { ja: '路線図を開く', en: 'Open the map', zh: '打开线路图', ko: '노선도 열기' } },
  { path: '/guide', label: { ja: '使い方', en: 'How to use', zh: '使用方法', ko: '사용법' } },
  { path: '/guides', localized: { en: '/en/guides', zh: '/zh/guides', ko: '/ko/guides' }, label: { ja: 'ガイド', en: 'Guides', zh: '指南', ko: '가이드' } },
  { path: '/en/guides', label: { ja: 'English guides', en: 'Guides', zh: '英文指南', ko: '영어 가이드' } },
  { path: '/stations', localized: { en: '/en/stations', zh: '/zh/stations', ko: '/ko/stations' }, label: { ja: '駅', en: 'Stations', zh: '车站', ko: '역' } },
  { path: '/lines', localized: { en: '/en/lines', zh: '/zh/lines', ko: '/ko/lines' }, label: { ja: '路線', en: 'Lines', zh: '线路', ko: '노선' } },
  { path: '/data', localized: { en: '/en/data' }, label: { ja: '駅周辺データ', en: 'Station area data', zh: '车站周边数据（日文）', ko: '역 주변 데이터(일본어)' } },
  { path: '/articles', localized: { en: '/en/articles', zh: '/zh/articles', ko: '/ko/articles' }, label: { ja: '記事一覧', en: 'Articles', zh: '文章', ko: '기사' } },
  { path: '/faq', label: { ja: 'よくある質問', en: 'FAQ', zh: '常见问题', ko: '자주 묻는 질문' } },
  { path: '/about', label: { ja: 'このサイトについて', en: 'About', zh: '关于本站', ko: '사이트 소개' } },
  { path: '/contact', label: { ja: 'お問い合わせ', en: 'Contact', zh: '联系我们', ko: '문의' } },
  { path: '/privacy', label: { ja: 'プライバシーポリシー', en: 'Privacy Policy', zh: '隐私政策', ko: '개인정보 처리방침' } },
  { path: '/terms', label: { ja: '利用規約', en: 'Terms of Service', zh: '使用条款', ko: '이용약관' } },
];
