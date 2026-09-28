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
  label: Record<NavLang, string>;
}

export const SITE_FOOTER_LINKS: SiteNavLink[] = [
  { path: '/', label: { ja: '路線図を開く', en: 'Open the map', zh: '打开线路图', ko: '노선도 열기' } },
  { path: '/guide', label: { ja: '使い方', en: 'How to use', zh: '使用方法', ko: '사용법' } },
  { path: '/guides', label: { ja: 'ガイド', en: 'Guides (JA)', zh: '日文指南', ko: '일본어 가이드' } },
  { path: '/en/guides', label: { ja: 'English guides', en: 'Guides', zh: '英文指南', ko: '영어 가이드' } },
  { path: '/articles', label: { ja: '記事一覧', en: 'Articles (JA)', zh: '文章（日文）', ko: '기사（일본어）' } },
  { path: '/faq', label: { ja: 'よくある質問', en: 'FAQ', zh: '常见问题', ko: '자주 묻는 질문' } },
  { path: '/about', label: { ja: 'このサイトについて', en: 'About', zh: '关于本站', ko: '사이트 소개' } },
  { path: '/contact', label: { ja: 'お問い合わせ', en: 'Contact', zh: '联系我们', ko: '문의' } },
  { path: '/privacy', label: { ja: 'プライバシーポリシー', en: 'Privacy Policy', zh: '隐私政策', ko: '개인정보 처리방침' } },
  { path: '/terms', label: { ja: '利用規約', en: 'Terms of Service', zh: '使用条款', ko: '이용약관' } },
];
