import { ARTICLE_SOURCES } from "./articles";

export const ARTICLE_LANGUAGES = ["ja", "en", "zh", "ko"] as const;
export type ArticleLanguage = typeof ARTICLE_LANGUAGES[number];

export const ARTICLE_LANG_LABELS: Record<ArticleLanguage, string> = {
  ja: "日",
  en: "En",
  zh: "中",
  ko: "한",
};

/**
 * 記事の一覧（並び順＝記事一覧ページの順）。中身は src/data/articles/{slug}.ts に1記事1ファイルで書く。
 * 各記事は日本語 /articles/{slug} と、英語・中国語・韓国語 /{lang}/articles/{slug} の別URLで出す。
 */
export const ARTICLES: Array<{ slug: string; publishedDate: string; modifiedDate?: string; related: string[] }> =
  ARTICLE_SOURCES.map(({ slug, publishedDate, modifiedDate, related }) => ({ slug, publishedDate, modifiedDate, related }));

export const ARTICLE_SHELL_TRANSLATIONS = {
  ja: {
    brand: "{siteName}",
    top: "← {siteName} トップ",
    articles: "記事一覧",
    articlesBack: "記事一覧へ戻る",
    openApp: "インタラクティブ路線図を開く →",
    footerCopy: "{siteName} ／ 東京の鉄道を、必要な情報だけで。",
    switchLanguage: "言語を切り替え",
    switchTheme: "ダークモード切り替え",
    readAll: "全記事",
    relatedArticles: "関連記事",
  },
  en: {
    brand: "{siteName}",
    top: "← {siteName} Home",
    articles: "Articles",
    articlesBack: "Back to Articles",
    openApp: "Open Interactive Map →",
    footerCopy: "{siteName} / Tokyo railways, only the information you need.",
    switchLanguage: "Switch language",
    switchTheme: "Toggle dark mode",
    readAll: "All articles",
    relatedArticles: "Related articles",
  },
  zh: {
    brand: "{siteName}",
    top: "← {siteName} 首页",
    articles: "文章列表",
    articlesBack: "返回文章列表",
    openApp: "打开交互式路线图 →",
    footerCopy: "{siteName} / 东京铁路，只显示你需要的信息。",
    switchLanguage: "切换语言",
    switchTheme: "切换深色模式",
    readAll: "全部文章",
    relatedArticles: "相关文章",
  },
  ko: {
    brand: "{siteName}",
    top: "← {siteName} 홈",
    articles: "기사 목록",
    articlesBack: "기사 목록으로 돌아가기",
    openApp: "인터랙티브 노선도 열기 →",
    footerCopy: "{siteName} / 도쿄 철도에서 필요한 정보만.",
    switchLanguage: "언어 전환",
    switchTheme: "다크 모드 전환",
    readAll: "전체 기사",
    relatedArticles: "관련 글",
  },
} satisfies Record<ArticleLanguage, Record<string, string>>;

export interface ArticleTranslation {
  title: string;
  description: string;
  category: string;
  kicker: string;
  readTime: string;
  tag: string;
}

export const ARTICLE_PAGE_KEYWORDS: Record<string, string> =
  Object.fromEntries(ARTICLE_SOURCES.map(a => [a.slug, a.keywordsJa]));

/** 記事一覧ページのタイトルなど（各記事のものは src/data/articles/{slug}.ts の meta） */
const ARTICLE_INDEX_TRANSLATIONS: Record<ArticleLanguage, ArticleTranslation> = {
  ja: {
    title: "記事一覧",
    description: "{siteName}の路線図や駅データを活用した、東京の観光、通勤、引っ越しに関するお役立ち記事一覧です。",
    category: "記事一覧",
    kicker: "記事一覧",
    readTime: "全記事",
    tag: "記事",
  },
  en: {
    title: "Articles",
    description: "Guides for Tokyo sightseeing, commuting, and moving, built around {siteName} route and station data.",
    category: "Articles",
    kicker: "Articles",
    readTime: "All articles",
    tag: "Articles",
  },
  zh: {
    title: "文章列表",
    description: "基于 {siteName} 的路线图和车站数据，整理东京观光、通勤和搬家相关指南。",
    category: "文章列表",
    kicker: "文章列表",
    readTime: "全部文章",
    tag: "文章",
  },
  ko: {
    title: "기사 목록",
    description: "{siteName}의 노선도와 역 데이터를 바탕으로 도쿄 관광, 통근, 이사 정보를 정리한 글입니다.",
    category: "기사 목록",
    kicker: "기사 목록",
    readTime: "전체 기사",
    tag: "기사",
  },
};

export const ARTICLE_PAGE_TRANSLATIONS: Record<string, Record<ArticleLanguage, ArticleTranslation>> = {
  articles: ARTICLE_INDEX_TRANSLATIONS,
  ...Object.fromEntries(ARTICLE_SOURCES.map(a => [a.slug, {
    ja: a.content.ja.meta, en: a.content.en.meta, zh: a.content.zh.meta, ko: a.content.ko.meta,
  }])),
};
