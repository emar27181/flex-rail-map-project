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
 * related は記事の最後に出す関連記事（3本。1記事1テーマにして、ほかのテーマはここから案内する）。
 */
export const ARTICLES: Array<{ slug: string; publishedDate: string; modifiedDate?: string; related: string[] }> = [
  { slug: "tokyo-rent-by-route", publishedDate: "2025-06-06", modifiedDate: "2026-09-29", related: ["commute-30min-cheap-rent", "tokyo-safe-area-by-route", "tokyo-train-map-beginner"] },
  { slug: "flex-rail-map-introduction", publishedDate: "2025-06-06", modifiedDate: "2026-09-29", related: ["tokyo-train-map-beginner", "tokyo-sightseeing-routes", "commute-30min-cheap-rent"] },
  { slug: "tokyo-train-map-beginner", publishedDate: "2025-06-06", modifiedDate: "2026-09-29", related: ["flex-rail-map-introduction", "tokyo-sightseeing-routes", "commute-30min-cheap-rent"] },
  { slug: "tokyo-sightseeing-routes", publishedDate: "2025-06-06", modifiedDate: "2026-09-29", related: ["tokyo-train-map-beginner", "flex-rail-map-introduction", "commute-30min-cheap-rent"] },
  { slug: "commute-30min-cheap-rent", publishedDate: "2025-06-06", modifiedDate: "2026-09-29", related: ["tokyo-rent-by-route", "tokyo-safe-area-by-route", "tokyo-train-map-beginner"] },
  { slug: "tokyo-safe-area-by-route", publishedDate: "2025-06-06", modifiedDate: "2026-09-29", related: ["tokyo-rent-by-route", "commute-30min-cheap-rent", "tokyo-train-map-beginner"] },
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
      title: "{siteName}とは｜必要な路線だけを表示する路線図",
      description: "東京の路線図は線が多すぎて、自分に関係する線を探すだけで疲れます。{siteName}は出発駅と到着駅を選ぶと、その移動に関係する路線だけを残す路線図です。実際の画面で、できることと使いどころを紹介します。",
      category: "サービス紹介",
      kicker: "サービス紹介",
      readTime: "読了 約4分",
      tag: "サービス紹介",
    },
    en: {
      title: "What Is {siteName}? A Rail Map That Shows Only the Lines You Need",
      description: "Tokyo rail maps show so many lines that finding yours is tiring. {siteName} keeps only the lines related to your trip once you pick a departure and arrival station. Real screenshots show what it does and when it helps.",
      category: "Product Intro",
      kicker: "Product Intro",
      readTime: "About 4 min read",
      tag: "Product Intro",
    },
    zh: {
      title: "{siteName}是什么：只显示需要线路的路线图",
      description: "东京路线图的线路太多，光是找到和自己有关的线路就很累。{siteName}在选择出发站和到达站后，只保留与这次移动有关的线路。本文用实际画面介绍它能做什么、什么时候好用。",
      category: "服务介绍",
      kicker: "服务介绍",
      readTime: "约 4 分钟阅读",
      tag: "服务介绍",
    },
    ko: {
      title: "{siteName}란? 필요한 노선만 보여 주는 노선도",
      description: "도쿄 노선도는 선이 너무 많아서 내게 필요한 선을 찾는 것만으로도 지칩니다. {siteName}은 출발역과 도착역을 고르면 그 이동에 관련된 노선만 남겨 줍니다. 실제 화면으로 할 수 있는 일과 쓰기 좋은 상황을 소개합니다.",
      category: "서비스 소개",
      kicker: "서비스 소개",
      readTime: "약 4분 읽기",
      tag: "서비스 소개",
    },
  },
  "tokyo-train-map-beginner": {
    ja: {
      title: "東京の路線図の読み方｜初めてでも迷わない3つのコツ",
      description: "東京の路線図が複雑に見えるのは、複数の会社の路線が1枚に重なっているからです。1本の色だけを追う、駅ナンバリングを見る、乗換駅で方面を確かめる。この3つのコツを実際の画面で説明します。",
      category: "初心者ガイド",
      kicker: "はじめての東京の電車",
      readTime: "読了 約5分",
      tag: "初心者ガイド",
    },
    en: {
      title: "How to Read a Tokyo Train Map: 3 Tips for First-Time Riders",
      description: "Tokyo rail maps look complex because lines from several companies are drawn on one sheet. Follow one color, read station numbers, and check the direction at transfer stations. Real screenshots explain each tip.",
      category: "Beginner Guide",
      kicker: "Tokyo Trains for Beginners",
      readTime: "About 5 min read",
      tag: "Beginner Guide",
    },
    zh: {
      title: "东京路线图怎么看：第一次坐也不迷路的3个诀窍",
      description: "东京路线图看起来复杂，是因为多家公司的线路重叠在一张图上。只追一条线的颜色、看车站编号、在换乘站确认方向。本文用实际画面说明这3个诀窍。",
      category: "新手指南",
      kicker: "第一次坐东京电车",
      readTime: "约 5 分钟阅读",
      tag: "新手指南",
    },
    ko: {
      title: "도쿄 노선도 읽는 법: 처음이어도 헤매지 않는 3가지 요령",
      description: "도쿄 노선도가 복잡해 보이는 이유는 여러 회사의 노선이 한 장에 겹쳐 있기 때문입니다. 한 노선의 색만 따라가기, 역 번호 보기, 환승역에서 방면 확인하기. 이 3가지 요령을 실제 화면으로 설명합니다.",
      category: "초보자 가이드",
      kicker: "처음 만나는 도쿄 전철",
      readTime: "약 5분 읽기",
      tag: "초보자 가이드",
    },
  },
  "tokyo-sightseeing-routes": {
    ja: {
      title: "東京観光の電車は山手線が軸｜浅草・お台場だけ路線を足す",
      description: "東京観光で使う電車は多くありません。原宿・渋谷・秋葉原・上野は山手線で回れ、足りないのは浅草とお台場くらいです。山手線に銀座線、ゆりかもめ・りんかい線を足す考え方を、実際の地図で紹介します。",
      category: "観光ガイド",
      kicker: "観光ガイド",
      readTime: "読了 約5分",
      tag: "観光ガイド",
    },
    en: {
      title: "Getting Around Tokyo by Train: Start with the Yamanote Line, Add Lines for Asakusa and Odaiba",
      description: "You need fewer train lines for Tokyo sightseeing than you think. Harajuku, Shibuya, Akihabara and Ueno are on the Yamanote Line; Asakusa and Odaiba are the main exceptions. See on real maps how to add the Ginza Line, Yurikamome and Rinkai Line.",
      category: "Travel Guide",
      kicker: "Travel Guide",
      readTime: "About 5 min read",
      tag: "Travel Guide",
    },
    zh: {
      title: "东京观光坐电车以山手线为主：只为浅草和台场加线路",
      description: "东京观光需要用到的线路并不多。原宿、涩谷、秋叶原、上野可以坐山手线到达，需要补充的主要是浅草和台场。本文用实际地图介绍在山手线上加上银座线、百合海鸥号和临海线的思路。",
      category: "观光指南",
      kicker: "观光指南",
      readTime: "约 5 分钟阅读",
      tag: "观光指南",
    },
    ko: {
      title: "도쿄 관광 전철은 야마노테선이 중심: 아사쿠사·오다이바만 노선을 더한다",
      description: "도쿄 관광에 쓰는 전철은 많지 않습니다. 하라주쿠·시부야·아키하바라·우에노는 야마노테선으로 돌 수 있고, 부족한 곳은 아사쿠사와 오다이바 정도입니다. 야마노테선에 긴자선, 유리카모메·린카이선을 더하는 방법을 실제 지도로 소개합니다.",
      category: "관광 가이드",
      kicker: "관광 가이드",
      readTime: "약 5분 읽기",
      tag: "관광 가이드",
    },
  },
  "commute-30min-cheap-rent": {
    ja: {
      title: "通勤時間から住む駅を探す｜職場の駅から逆算する方法",
      description: "住む駅は、家賃や街の印象より先に「職場まで何分か」で絞ると決めやすくなります。職場の最寄り駅を出発駅にして、地図で駅ごとの所要時間を見る手順と、時刻表で確かめるときの注意点を紹介します。",
      category: "引っ越し・住まい",
      kicker: "住まいガイド",
      readTime: "読了 約5分",
      tag: "通勤ガイド",
    },
    en: {
      title: "Find Where to Live by Commute Time: Work Backward from Your Office Station",
      description: "Choosing a station is easier if you narrow it down by minutes to work before rent or neighborhood image. Set your office station as the departure, read travel times on the map, then confirm them in timetables.",
      category: "Moving / Living",
      kicker: "Living Guide",
      readTime: "About 5 min read",
      tag: "Commute Guide",
    },
    zh: {
      title: "从通勤时间找住的车站：从公司所在车站反推",
      description: "选住的车站时，先按“到公司要几分钟”来缩小范围，比先看租金或街区印象更容易决定。本文介绍把公司最近的车站设为出发站、在地图上看各站所需时间的步骤，以及用时刻表确认时的注意点。",
      category: "搬家・居住",
      kicker: "居住指南",
      readTime: "约 5 分钟阅读",
      tag: "通勤指南",
    },
    ko: {
      title: "통근 시간으로 살 역 찾기: 회사 역에서 거꾸로 계산하는 방법",
      description: "살 역은 월세나 동네 이미지보다 먼저 “회사까지 몇 분인지”로 좁히면 정하기 쉽습니다. 회사 가까운 역을 출발역으로 두고 지도에서 역마다 소요 시간을 보는 순서와, 시간표로 확인할 때의 주의점을 소개합니다.",
      category: "이사・주거",
      kicker: "주거 가이드",
      readTime: "약 5분 읽기",
      tag: "통근 가이드",
    },
  },
  "tokyo-safe-area-by-route": {
    ja: {
      title: "住む駅の周辺環境を確かめる方法｜犯罪件数データの見方と現地確認",
      description: "「治安のいい沿線」は、イメージだけでは決められません。{siteName}で見られる東京都内の犯罪認知件数（警視庁・令和5年）の読み方と、その数字だけでは分からないことを、駅から家まで歩いて確かめる手順とあわせて紹介します。",
      category: "引っ越し・住まい",
      kicker: "住まいガイド",
      readTime: "読了 約5分",
      tag: "治安ガイド",
    },
    en: {
      title: "How to Check the Area Around a Station Before Moving: Reading Crime Data and Walking It Yourself",
      description: "A line's reputation cannot tell you if an area is safe. Learn how to read the Tokyo crime counts (Tokyo Metropolitan Police, 2023) shown in {siteName}, what the numbers cannot tell you, and how to check the walk from the station to your home.",
      category: "Moving / Living",
      kicker: "Living Guide",
      readTime: "About 5 min read",
      tag: "Safety Guide",
    },
    zh: {
      title: "如何确认要住的车站周边环境：犯罪件数数据的读法与实地确认",
      description: "“治安好的沿线”不能只凭印象决定。本文介绍{siteName}中东京都内犯罪认知件数（警视厅・2023年）的读法、这些数字无法说明的地方，以及从车站走到住处实地确认的步骤。",
      category: "搬家・居住",
      kicker: "居住指南",
      readTime: "约 5 分钟阅读",
      tag: "治安指南",
    },
    ko: {
      title: "살 역의 주변 환경 확인하는 법: 범죄 건수 데이터 읽는 법과 현장 확인",
      description: "“치안 좋은 노선”은 이미지만으로 정할 수 없습니다. {siteName}에서 볼 수 있는 도쿄도 내 범죄 인지 건수(경시청·2023년) 읽는 법과 그 숫자만으로는 알 수 없는 점을, 역에서 집까지 걸어서 확인하는 순서와 함께 소개합니다.",
      category: "이사・주거",
      kicker: "주거 가이드",
      readTime: "약 5분 읽기",
      tag: "치안 가이드",
    },
  },
  "tokyo-rent-by-route": {
    ja: {
      title: "家賃を沿線で比べる方法｜候補駅を絞って条件をそろえる",
      description: "「◯◯線は家賃が安い」といった沿線単位の比較では、住む駅は決まりません。通える駅を地図で絞り、沿線の駅を順に並べ、同じ条件の募集物件で比べる手順を紹介します。",
      category: "引っ越し・沿線比較",
      kicker: "住まいガイド",
      readTime: "読了 約5分",
      tag: "家賃ガイド",
    },
    en: {
      title: "How to Compare Rent Along Rail Lines: Shortlist Stations and Match the Conditions",
      description: "Saying \"this line has cheap rent\" will not pick a station for you. Shortlist stations you can commute from on the map, list the stations along each line in order, and compare listings with matching conditions.",
      category: "Moving / Line Comparison",
      kicker: "Living Guide",
      readTime: "About 5 min read",
      tag: "Rent Guide",
    },
    zh: {
      title: "按沿线比较租金的方法：先缩小候选车站，再统一条件",
      description: "“某某线租金便宜”这种按沿线的比较，无法决定要住的车站。本文介绍在地图上筛选能通勤的车站、按顺序列出沿线车站、再用相同条件的房源比较的步骤。",
      category: "搬家・沿线比较",
      kicker: "居住指南",
      readTime: "约 5 分钟阅读",
      tag: "租金指南",
    },
    ko: {
      title: "노선별로 월세 비교하는 법: 후보 역을 좁히고 조건을 맞춘다",
      description: "“○○선은 월세가 싸다” 같은 노선 단위 비교로는 살 역이 정해지지 않습니다. 지도에서 통근 가능한 역을 좁히고, 노선의 역을 순서대로 늘어놓고, 같은 조건의 매물로 비교하는 순서를 소개합니다.",
      category: "이사・노선 비교",
      kicker: "주거 가이드",
      readTime: "약 5분 읽기",
      tag: "월세 가이드",
    },
  },
};
