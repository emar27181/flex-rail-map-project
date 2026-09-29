export const ARTICLE_LANGUAGES = ["ja", "en", "zh", "ko"] as const;
export type ArticleLanguage = typeof ARTICLE_LANGUAGES[number];

export const ARTICLE_LANG_LABELS: Record<ArticleLanguage, string> = {
  ja: "日",
  en: "En",
  zh: "中",
  ko: "한",
};

/**
 * 記事の一覧（並び順＝記事一覧ページの順）。
 * 各記事は日本語 /articles/{slug} と、英語・中国語・韓国語 /{lang}/articles/{slug} の別URLで出す。
 * 翻訳（ARTICLE_PAGE_TRANSLATIONS / articleBodyI18n.ts）が4言語そろっていないとテストが落ちる。
 * modifiedDate は本文を実際に直した日だけ書く（無ければ構造化データの dateModified を出さない）。
 */
export const ARTICLES: Array<{ slug: string; publishedDate: string; modifiedDate?: string }> = [
  { slug: "tokyo-rent-by-route", publishedDate: "2025-06-06", modifiedDate: "2026-09-28" },
  { slug: "flex-rail-map-introduction", publishedDate: "2025-06-06" },
  { slug: "tokyo-train-map-beginner", publishedDate: "2025-06-06" },
  { slug: "tokyo-sightseeing-routes", publishedDate: "2025-06-06" },
  { slug: "commute-30min-cheap-rent", publishedDate: "2025-06-06", modifiedDate: "2026-09-28" },
  { slug: "tokyo-safe-area-by-route", publishedDate: "2025-06-06", modifiedDate: "2026-09-28" },
];

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

export const ARTICLE_PAGE_KEYWORDS: Record<string, string> = {
  "flex-rail-map-introduction": "フレックス路線図, 路線図 見にくい, 路線図 複雑, 必要な路線だけ, インタラクティブ路線図, 乗り換え 分かりやすい",
  "tokyo-train-map-beginner": "東京 路線図 読み方, 乗り換え 初めて, 駅ナンバリング, 上京 電車, 訪日 電車, {siteName}",
  "tokyo-sightseeing-routes": "東京, 観光, 電車, 路線図, 浅草, 秋葉原, お台場",
  "commute-30min-cheap-rent": "通勤, 30分, 家賃, 安い, 駅, 引っ越し, 路線",
  "tokyo-safe-area-by-route": "東京, 治安, 良い, 沿線, 一人暮らし, 女性, 路線",
  "tokyo-rent-by-route": "東京 家賃 沿線 比較,首都圏 住みやすい 路線,1K 家賃 安い 駅,東京 引っ越し 路線,沿線 家賃 比較条件,路線図 見にくい,路線図 不安,東京 電車 わかりやすい,路線図 複雑 解説",
};

export const ARTICLE_PAGE_TRANSLATIONS: Record<string, Record<ArticleLanguage, ArticleTranslation>> = {
  articles: {
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
  },
  "flex-rail-map-introduction": {
    ja: {
      title: "東京の路線図を「理解しやすく」するための路線図UIを作っています",
      description: "東京の路線図って、正直かなり難しいと思う。情報量が多く、分岐も多く、初めて見る人には「結局どこを見ればいいのか分からない」状態になりやすい。そんなモヤモヤを、ひとつずつ減らしていくために作っているのが {siteName} です。",
      category: "開発ノート・サービス紹介",
      kicker: "開発ノート",
      readTime: "読了 約5分",
      tag: "開発ノート",
    },
    en: {
      title: "Building a Rail Map UI That Makes Tokyo Easier to Understand",
      description: "Tokyo's rail map can feel overwhelming. {siteName} is an interface that reduces visual noise and helps you understand the route, direction, and current context.",
      category: "Development Notes / Product Intro",
      kicker: "Development Notes",
      readTime: "About 5 min read",
      tag: "Dev Notes",
    },
    zh: {
      title: "正在制作让东京路线图更容易理解的 UI",
      description: "东京路线图信息量很大，初次使用时很容易不知道该看哪里。{siteName} 通过减少不必要的信息，帮助你理解路线、方向和当前位置。",
      category: "开发笔记・服务介绍",
      kicker: "开发笔记",
      readTime: "约 5 分钟阅读",
      tag: "开发笔记",
    },
    ko: {
      title: "도쿄 노선도를 더 쉽게 이해하기 위한 UI를 만들고 있습니다",
      description: "도쿄 노선도는 정보량이 많아 처음 보면 어디를 봐야 할지 헷갈리기 쉽습니다. {siteName}은 필요한 정보만 남겨 경로와 방향, 현재 상황을 이해하기 쉽게 합니다.",
      category: "개발 노트・서비스 소개",
      kicker: "개발 노트",
      readTime: "약 5분 읽기",
      tag: "개발 노트",
    },
  },
  "tokyo-train-map-beginner": {
    ja: {
      title: "東京の路線図の読み方・乗り換え方【完全初心者ガイド】",
      description: "東京の電車が初めてでも迷いにくくするために、路線図の見方、色分け、駅名、乗り換えの考え方をやさしく解説します。",
      category: "初心者ガイド",
      kicker: "はじめての東京の電車",
      readTime: "読了 約6分",
      tag: "初心者ガイド",
    },
    en: {
      title: "How to Read Tokyo Train Maps and Transfer Lines: Beginner Guide",
      description: "A simple guide to Tokyo rail maps, line colors, station names, and transfer logic for first-time riders.",
      category: "Beginner Guide",
      kicker: "Tokyo Trains for Beginners",
      readTime: "About 6 min read",
      tag: "Beginner Guide",
    },
    zh: {
      title: "东京路线图怎么看、怎么换乘：新手完整指南",
      description: "面向第一次乘坐东京电车的人，简单说明路线图、线路颜色、车站名和换乘思路。",
      category: "新手指南",
      kicker: "第一次坐东京电车",
      readTime: "约 6 分钟阅读",
      tag: "新手指南",
    },
    ko: {
      title: "도쿄 노선도 읽는 법과 환승 방법: 초보자 가이드",
      description: "도쿄 전철이 처음인 사람을 위해 노선도, 색상, 역 이름, 환승 방식을 쉽게 설명합니다.",
      category: "초보자 가이드",
      kicker: "처음 만나는 도쿄 전철",
      readTime: "약 6분 읽기",
      tag: "초보자 가이드",
    },
  },
  "tokyo-sightseeing-routes": {
    ja: {
      title: "東京観光で使える路線ガイド（浅草・秋葉原・原宿・お台場）",
      description: "東京観光をスムーズにするための路線ガイド。浅草、秋葉原、原宿、お台場などの主要観光スポットへアクセスしやすい路線と乗り換えのコツを解説します。",
      category: "観光ガイド",
      kicker: "観光ガイド",
      readTime: "読了 約4分",
      tag: "観光ガイド",
    },
    en: {
      title: "Tokyo Sightseeing Route Guide: Asakusa, Akihabara, Harajuku, and Odaiba",
      description: "Rail routes and transfer tips for reaching Tokyo's popular sightseeing areas smoothly.",
      category: "Travel Guide",
      kicker: "Travel Guide",
      readTime: "About 4 min read",
      tag: "Travel Guide",
    },
    zh: {
      title: "东京观光路线指南：浅草、秋叶原、原宿、台场",
      description: "介绍前往东京主要观光地时好用的线路和换乘技巧。",
      category: "观光指南",
      kicker: "观光指南",
      readTime: "约 4 分钟阅读",
      tag: "观光指南",
    },
    ko: {
      title: "도쿄 관광 노선 가이드: 아사쿠사, 아키하바라, 하라주쿠, 오다이바",
      description: "도쿄 주요 관광지로 쉽게 이동하기 위한 노선과 환승 팁을 소개합니다.",
      category: "관광 가이드",
      kicker: "관광 가이드",
      readTime: "약 4분 읽기",
      tag: "관광 가이드",
    },
  },
  "commute-30min-cheap-rent": {
    ja: {
      title: "通勤30分を目安に住む駅を探す｜路線と家賃の比較手順",
      description: "通勤時間の条件を決め、路線図で候補駅を整理し、同じ条件の募集物件を比較する手順を紹介します。",
      category: "引っ越し・住まい",
      kicker: "住まいガイド",
      readTime: "読了 約4分",
      tag: "住まいガイド",
    },
    en: {
      title: "Find Stations for a 30-Minute Commute: Compare Routes and Rent",
      description: "Define your commute budget, shortlist stations on a map, and compare rental listings using consistent criteria.",
      category: "Moving / Living",
      kicker: "Living Guide",
      readTime: "About 4 min read",
      tag: "Living Guide",
    },
    zh: {
      title: "以通勤30分钟为目标找车站：线路与租金比较步骤",
      description: "先明确通勤时间的范围，再用路线图整理候选车站，并在相同条件下比较出租房源。",
      category: "搬家・居住",
      kicker: "居住指南",
      readTime: "约 4 分钟阅读",
      tag: "居住指南",
    },
    ko: {
      title: "통근 30분을 목표로 역 찾기: 노선과 월세 비교 순서",
      description: "통근 시간의 범위를 정하고 노선도로 후보 역을 정리한 뒤 같은 조건의 임대 매물을 비교하세요.",
      category: "이사・주거",
      kicker: "주거 가이드",
      readTime: "약 4분 읽기",
      tag: "주거 가이드",
    },
  },
  "tokyo-safe-area-by-route": {
    ja: {
      title: "東京で住む沿線を選ぶとき、駅周辺の環境をどう確認する？",
      description: "駅名や沿線の評判だけで判断せず、公的情報と駅から家までの実際の道を確認するためのチェックリスト。",
      category: "引っ越し・住まい",
      kicker: "住まいガイド",
      readTime: "読了 約4分",
      tag: "治安ガイド",
    },
    en: {
      title: "Choosing Where to Live in Tokyo: Check the Streets Around the Station",
      description: "A checklist for checking public information and the actual walk home instead of relying on a rail line's reputation.",
      category: "Moving / Living",
      kicker: "Living Guide",
      readTime: "About 4 min read",
      tag: "Safety Guide",
    },
    zh: {
      title: "在东京选择居住沿线：如何确认车站周边环境",
      description: "不只看线路口碑，通过公开信息和实际回家路线检查居住环境。",
      category: "搬家・居住",
      kicker: "居住指南",
      readTime: "约 4 分钟阅读",
      tag: "治安指南",
    },
    ko: {
      title: "도쿄에서 살 노선 고르기: 역 주변 환경 확인 방법",
      description: "노선의 평판에만 의존하지 않고 공공 정보와 실제 귀가 동선을 확인하는 체크리스트입니다.",
      category: "이사・주거",
      kicker: "주거 가이드",
      readTime: "약 4분 읽기",
      tag: "치안 가이드",
    },
  },
  "tokyo-rent-by-route": {
    ja: {
      title: "東京・首都圏で家賃と沿線を比較するには｜駅選びの手順",
      description: "通勤できる候補駅を整理し、面積・築年数・駅徒歩・管理費などの条件をそろえて家賃を比較する方法。",
      category: "引っ越し・沿線比較",
      kicker: "住まいガイド",
      readTime: "読了 約4分",
      tag: "家賃ガイド",
    },
    en: {
      title: "Compare Rent and Rail Lines in Greater Tokyo: A Station Shortlisting Guide",
      description: "Shortlist commutable stations, then compare listings with matching size, age, walking distance and fees.",
      category: "Moving / Line Comparison",
      kicker: "Living Guide",
      readTime: "About 4 min read",
      tag: "Rent Guide",
    },
    zh: {
      title: "东京及首都圈的租金与沿线比较：车站筛选步骤",
      description: "先筛选适合通勤的车站，再统一面积、楼龄、步行距离和管理费等条件比较房源。",
      category: "搬家・沿线比较",
      kicker: "居住指南",
      readTime: "约 4 分钟阅读",
      tag: "租金指南",
    },
    ko: {
      title: "도쿄·수도권 월세와 노선 비교: 후보 역 고르는 순서",
      description: "통근 가능한 역을 고른 뒤 면적, 연식, 도보 거리와 관리비 조건을 맞춰 매물을 비교하세요.",
      category: "이사・노선 비교",
      kicker: "주거 가이드",
      readTime: "약 4분 읽기",
      tag: "월세 가이드",
    },
  },
};
