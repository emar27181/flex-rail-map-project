/*
 * 【必読】編集する前に docs/data-editing-guide.md を読むこと（共通ルール: 推測で書かない・出典を残す・
 *   値だけを書く・編集後に npm run test:data）。
 */
/**
 * 検索流入向けガイドページ（/guides/*, /en/guides/*）のコンテンツデータ。
 *
 * 「検索される→ページへ流入→Flex Railway Mapを実際に触る→地図へ回遊する」
 * という導線を作るための最初のSEOコンテンツ。ページ数を増やすことが目的
 * ではないため、今回は数ページに限定している。
 *
 * UIは `src/layouts/GuideLayout.astro` に共通化し、ここでは文章と
 * 「どの路線を見せるか（地図CTAのdeep link）」だけを持つ。
 * 将来 /lines/{line} 等に拡張するときも、このファイルの配列を
 * 増やす形にできるよう構造を揃えてある。
 */
import type { RouteKey } from './routes';
import type { SeoCityId } from './seoPages';

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  /**
   * この節の説明の直後に置く地図CTA（説明した路線だけを表示して開く）。
   * 記事冒頭・末尾のCTA（ctaLabel/ctaRoutes）とは別に、読んだ直後に地図で確かめられるようにする
   */
  cta?: { label: string; routes: RouteKey[] };
}

export interface GuideRelated {
  href: string;
  label: string;
}

export interface GuideFaqItem {
  question: string;
  answer: string;
}

export interface GuideDefinition {
  /** URLの末尾（/guides/{slug}, /en/guides/{slug}, /zh/guides/{slug}） */
  slug: string;
  /** 都市のガイドの場合の都市（src/data/seoPages.ts の SEO_CITIES。GA4 の city に送る） */
  city?: SeoCityId;
  lang: 'ja' | 'en' | 'zh' | 'ko';
  /** パンくず・一覧での短い表記 */
  breadcrumbLabel: string;
  /** <title>・OGPタイトル */
  title: string;
  /** meta description */
  description: string;
  /** ページのH1（titleと少し変えて自然な見出しにする） */
  h1: string;
  /** 検索意図への短い直接回答（H1の直下） */
  searchIntentAnswer: string;
  /** 補足セクション（最小限。文章量を稼ぐための水増しはしない） */
  sections: GuideSection[];
  /** 「Flex Railway Mapで見る」CTAのラベル */
  ctaLabel: string;
  /** CTAで地図に表示する路線（存在するデータのみ。無指定なら路線指定なしでトップを開く） */
  ctaRoutes?: RouteKey[];
  /** CTAリンクに ?lang=en を付けるか */
  ctaOpensEnglish?: boolean;
  /** CTA直下に添える小さな注記 */
  ctaNote: string;
  /** 関連ガイド（他ガイド・既存記事どちらも可） */
  related: GuideRelated[];
  /** ページ末尾のFAQ（2〜4問程度）。構造化データ(FAQPage)にもそのまま使うため、
   *  実装されていない機能について架空の回答を書かない */
  faq?: GuideFaqItem[];
  keywords?: string;
}

export const guides: GuideDefinition[] = [
  {
    slug: 'simple-tokyo-railway-map',
    lang: 'ja',
    breadcrumbLabel: '東京の路線図をシンプルに見る',
    title: '東京の路線図をシンプルに見る方法 | Flex Railway Map',
    description: '東京の路線図が見にくい・複雑すぎると感じたら、必要な路線だけを選んで表示できます。Flex Railway Mapで、自分に必要な路線だけのシンプルな路線図を実際に開いて確認できます。',
    h1: '東京の路線図をシンプルに見る',
    searchIntentAnswer:
      '東京の路線図は路線数・駅数が多く、全部を一度に見ようとすると情報量で迷いやすくなります。Flex Railway Mapでは、表示する路線を自分で選べるため、必要な路線だけに絞った見やすい路線図をその場で作れます。',
    sections: [
      {
        heading: 'なぜ東京の路線図は見にくいのか',
        paragraphs: [
          '東京は運営会社（JR・東京メトロ・都営地下鉄・私鉄各社）が多く、同じ駅を複数の路線が通ることも珍しくありません。一般的な路線図はこれら全てを一枚に収めるため、線が密集し、初めて見る人ほど「どこを見ればいいか」が分かりにくくなります。',
        ],
      },
      {
        heading: '必要な路線だけを選んで表示する',
        paragraphs: [
          'Flex Railway Mapでは、路線の一覧から表示したい路線だけをオン/オフできます。例えば「JR山手線・中央線・東京メトロ丸ノ内線」のように、自分が使う路線だけに絞り込めば、地図上の線が一気に減り、駅名も読みやすくなります。',
          '下のボタンから、実際にこの3路線だけを表示した地図をそのまま開けます。',
        ],
      },
    ],
    ctaLabel: 'この3路線だけの地図をFlex Railway Mapで開く',
    ctaRoutes: ['yamanote', 'chuo', 'marunouchiLine'],
    ctaNote: '山手線・中央線・東京メトロ丸ノ内線だけを表示した状態で地図が開きます。ほかの路線は地図上の一覧からいつでも追加・非表示にできます。',
    related: [
      { href: '/guides/odakyu-line-map', label: '小田急線の分岐・行き先をわかりやすく見る' },
      { href: '/articles/tokyo-train-map-beginner', label: '東京の路線図の読み方・乗り換え方【完全初心者ガイド】' },
      { href: '/articles/flex-rail-map-introduction', label: 'Flex Railway Mapを作っている理由' },
      { href: '/guide', label: 'Flex Railway Mapの使い方ガイド' },
      { href: '/zh/guides/simple-tokyo-railway-map', label: '东京地铁线路图太密集怎么看（中文）' },
      { href: '/ko/guides/simple-tokyo-railway-map', label: '도쿄 노선도 심플하게 보는 방법 (한국어)' },
    ],
    faq: [
      {
        question: '路線をすべて表示することもできますか？',
        answer: 'はい。地図上の路線一覧からいつでも全路線を表示できます。まず必要な路線だけに絞って見て、必要になったら他の路線を追加していく使い方がおすすめです。',
      },
      {
        question: '表示する路線は自分で自由に選べますか？',
        answer: 'はい。路線ごとに表示・非表示を切り替えられるほか、出発駅と到着駅を入力すると、その移動に関係する路線だけが自動的に選ばれます。',
      },
      {
        question: 'スマートフォンでも使えますか？',
        answer: 'はい、スマートフォン・タブレット・PCのいずれのブラウザでも無料で利用できます。アプリのインストールは不要です。',
      },
    ],
    keywords: '東京 路線図,東京 電車 路線図,東京 路線図 わかりやすい,東京 鉄道 地図,路線図 見にくい,路線図 シンプル,路線図 見やすい',
  },
  {
    slug: 'tokyo-train-map',
    lang: 'en',
    breadcrumbLabel: 'Tokyo Train Map for Tourists',
    title: 'Tokyo Train Map for Tourists (Simple, Interactive) | Flex Railway Map',
    description: "Tokyo's train map looks overwhelming at first. Flex Railway Map lets you show only the lines you need, so you can open a simple map for your trip in seconds.",
    h1: 'A Simple Tokyo Train Map for Tourists',
    searchIntentAnswer:
      "Tokyo's full railway map covers JR lines, Tokyo Metro, Toei Subway, and several private railways on one crowded diagram. Flex Railway Map lets you turn off the lines you don't need, so you can look at a map that only shows what matters for your trip.",
    sections: [
      {
        heading: "Why Tokyo's train map looks so complicated",
        paragraphs: [
          "Tokyo is served by many different operators, and many stations are shared by several lines. A standard map tries to show all of it at once, which is exactly why first-time visitors find it hard to read.",
        ],
      },
      {
        heading: 'Show only the lines you actually need',
        paragraphs: [
          "With Flex Railway Map, you choose which lines are visible. For a typical sightseeing trip, the JR Yamanote Line (the loop line connecting most major areas) and the Tokyo Metro Ginza Line (one of the oldest and most central subway lines) already cover a lot of ground.",
          'Use the button below to open a map with just those two lines shown.',
        ],
      },
      {
        heading: 'A map for understanding the network, not for step-by-step directions',
        paragraphs: [
          "Flex Railway Map isn't trying to replace a route-finding app that tells you which platform to stand on. It's built for a different moment: when you want to actually see how the lines relevant to your trip connect, before you start moving.",
        ],
      },
    ],
    ctaLabel: 'Open this simplified map in Flex Railway Map',
    ctaRoutes: ['yamanote', 'ginzaLine'],
    ctaOpensEnglish: true,
    ctaNote: 'Opens with only the JR Yamanote Line and Tokyo Metro Ginza Line shown, in English. You can add or hide other lines from the list on the map.',
    related: [
      { href: '/en/guides/tokyo-train-network', label: "How to Understand Tokyo's Train Network" },
      { href: '/guides/simple-tokyo-railway-map', label: '東京の路線図をシンプルに見る（日本語）' },
      { href: '/zh/guides/tokyo-train-map', label: '东京地铁线路图简化查看方法（中文）' },
      { href: '/ko/guides/tokyo-train-map', label: '도쿄 노선도 심플하게 보기 (한국어)' },
      { href: '/guide?lang=en', label: 'How to use Flex Railway Map' },
    ],
    faq: [
      {
        question: 'Can I show all the lines at once?',
        answer: 'Yes. You can turn every line back on from the line list on the map at any time. Starting with just a couple of lines and adding more as you need them is usually the easiest way to read the map.',
      },
      {
        question: 'Can I choose which lines are shown?',
        answer: "Yes. You can toggle each line on or off individually, or enter a departure and destination station and Flex Railway Map will select the lines relevant to that trip for you.",
      },
      {
        question: 'Does this work on my phone?',
        answer: 'Yes, Flex Railway Map works in any modern browser on phone, tablet, or desktop. No app install is required.',
      },
    ],
    keywords: 'Tokyo train map,Tokyo railway map,Tokyo train map tourist,Tokyo train map English,Tokyo subway map simple',
  },
  {
    slug: 'tokyo-train-network',
    lang: 'en',
    breadcrumbLabel: "How to Understand Tokyo's Train Network",
    title: "How to Understand Tokyo's Train Network | Flex Railway Map",
    description: "Tokyo trains confusing? Here's how to make sense of the network by focusing on one route at a time, and how to check your travel time between two stations.",
    h1: "How to Understand Tokyo's Confusing Train Network",
    searchIntentAnswer:
      "Tokyo's train network feels confusing mainly because you're looking at every line at once. It gets much easier once you focus on just the route between your departure and destination stations.",
    sections: [
      {
        heading: "Stop trying to read the whole map at once",
        paragraphs: [
          "You don't need to understand every line to get around Tokyo. Most trips only involve one or two lines and a transfer. Trying to memorize the entire network is unnecessary and is often what makes it feel confusing.",
        ],
      },
      {
        heading: 'Pick a departure and destination, see just that route',
        paragraphs: [
          'Flex Railway Map lets you enter a departure and destination station and see the relevant lines and transfer stations for that specific trip, along with an estimated travel time, instead of the entire network at once.',
        ],
      },
    ],
    ctaLabel: 'Open Flex Railway Map',
    ctaOpensEnglish: true,
    ctaNote: 'Opens Flex Railway Map in English. Enter your departure and destination station to see the route for your trip.',
    related: [
      { href: '/en/guides/tokyo-train-map', label: 'Tokyo Train Map for Tourists' },
      { href: '/guide?lang=en', label: 'How to use Flex Railway Map' },
      { href: '/about?lang=en', label: 'About Flex Railway Map' },
    ],
    keywords: 'Tokyo trains confusing,how to use Tokyo trains,Tokyo railway lines explained',
  },
  {
    slug: 'tokyo-train-map',
    lang: 'zh',
    breadcrumbLabel: '东京地铁线路图简化查看方法',
    title: '东京地铁线路图太复杂看不懂怎么办 | Flex Railway Map',
    description: '觉得东京地铁线路图太复杂、看不懂？用Flex Railway Map可以只显示你需要的线路，马上打开一张只有必要路线的简洁地图。',
    h1: '如何简化查看东京地铁线路图',
    searchIntentAnswer:
      '东京的地铁线路图之所以看起来复杂，是因为运营公司多、线路密集地画在同一张图上。Flex Railway Map可以让你自己选择要显示的线路，只保留需要的路线，地图会立刻变得清晰易读。',
    sections: [
      {
        heading: '为什么东京的地铁图这么复杂',
        paragraphs: [
          '东京由JR、东京Metro、都营地下铁、多家私铁公司共同运营，同一个车站常常有好几条线路经过。标准地铁图为了把所有线路都画在一张图上，线条非常密集，第一次看的人很难判断自己该看哪一条线。',
        ],
      },
      {
        heading: '只显示你需要的线路',
        paragraphs: [
          'Flex Railway Map可以自由开关每条线路的显示。例如只显示"JR山手线"和"东京Metro银座线"这两条线，就能覆盖东京市中心的大部分主要区域，地图上的线条数量会大幅减少，车站名称也更容易看清楚。',
          '点击下面的按钮，可以直接打开只显示这两条线路的地图。',
        ],
      },
    ],
    ctaLabel: '在Flex Railway Map中打开这张简化地图',
    ctaRoutes: ['yamanote', 'ginzaLine'],
    ctaNote: '地图会以中文界面打开，只显示JR山手线和东京Metro银座线。其他线路可以随时从地图上的列表中添加或隐藏。',
    related: [
      { href: '/en/guides/tokyo-train-map', label: 'Tokyo Train Map for Tourists（英语版）' },
      { href: '/guides/simple-tokyo-railway-map', label: '东京路线图简化查看方法（日语版）' },
      { href: '/ko/guides/tokyo-train-map', label: '도쿄 노선도 심플하게 보기（韩语版）' },
      { href: '/zh/guides/simple-tokyo-railway-map', label: '东京地铁线路图太密集怎么看（3条线路版）' },
    ],
    keywords: '东京地铁线路图,东京地铁图看不懂,东京地铁图太复杂,东京电车路线图,东京地铁图简化',
  },
  {
    slug: 'odakyu-line-map',
    lang: 'ja',
    breadcrumbLabel: '小田急線の分岐・行き先をわかりやすく見る',
    title: '小田急線の分岐・行き先をわかりやすく見る方法 | Flex Railway Map',
    description: '小田急線は新百合ヶ丘で多摩線、相模大野で江ノ島線に分かれるため、行き先が分かりにくいことがあります。Flex Railway Mapで、小田原線・多摩線・江ノ島線の分岐をまとめて地図に表示して確認できます。',
    h1: '小田急線の分岐・行き先をわかりやすく見る',
    searchIntentAnswer:
      '小田急線は新宿から小田原まで1本の路線に見えて、実際には新百合ヶ丘で多摩線、相模大野で江ノ島線が分かれる構造になっています。Flex Railway Mapでは、この3路線をまとめて地図に表示し、どこで分岐しているかをそのまま確認できます。',
    sections: [
      {
        heading: 'なぜ小田急線は行き先が分かりにくいのか',
        paragraphs: [
          '小田急線は新宿から小田原までを結ぶ「小田原線」を軸に、途中の新百合ヶ丘から唐木田までの「多摩線」、途中の相模大野から片瀬江ノ島までの「江ノ島線」の3路線で構成されています。同じ新宿始発でも、乗る列車によって行き先がこの3方向に分かれるため、初めて利用する人ほど「今乗っている電車がどこへ向かうのか」が分かりにくくなります。',
        ],
      },
      {
        heading: '新百合ヶ丘と相模大野、2つの分岐駅',
        paragraphs: [
          '小田原線を新宿から進むと、まず新百合ヶ丘で多摩線が分かれます。多摩線はここから小田急永山・小田急多摩センターを経て唐木田まで向かう路線です。',
          '小田原線をさらに進むと、町田を過ぎた先の相模大野で今度は江ノ島線が分かれます。江ノ島線はここから大和・藤沢を経て片瀬江ノ島まで向かう路線です。小田原線自体は相模大野から先も本厚木方面・小田原方面へ続きます。',
        ],
      },
    ],
    ctaLabel: '小田原線・多摩線・江ノ島線をまとめてFlex Railway Mapで開く',
    ctaRoutes: ['odakyuLine', 'odakyuTamaLine', 'odakyuEnoshimaLine'],
    ctaNote: '小田急小田原線・多摩線・江ノ島線の3路線を表示した状態で地図が開きます。新百合ヶ丘・相模大野の分岐がどちらも地図上で確認できます。',
    related: [
      { href: '/guides/simple-tokyo-railway-map', label: '東京の路線図をシンプルに見る' },
      { href: '/guide', label: 'Flex Railway Mapの使い方ガイド' },
    ],
    faq: [
      {
        question: '小田急線は何路線に分かれていますか？',
        answer: '新宿〜小田原を結ぶ「小田原線」、新百合ヶ丘〜唐木田を結ぶ「多摩線」、相模大野〜片瀬江ノ島を結ぶ「江ノ島線」の3路線です。',
      },
      {
        question: 'どの駅で路線が分岐しますか？',
        answer: '多摩線は新百合ヶ丘で、江ノ島線は相模大野で、それぞれ小田原線から分かれます。乗り換えが必要かどうかは乗車する列車の行き先によって異なります。',
      },
      {
        question: '3路線をまとめて地図で見られますか？',
        answer: 'はい。このページのボタンから、小田原線・多摩線・江ノ島線の3路線をまとめて表示した状態でFlex Railway Mapを開けます。',
      },
      {
        question: 'スマートフォンでも使えますか？',
        answer: 'はい、スマートフォン・タブレット・PCのいずれのブラウザでも無料で利用できます。アプリのインストールは不要です。',
      },
    ],
    keywords: '小田急線 路線図,小田急 路線図,小田急線 分岐,小田急 行き先 わからない,小田急線 わかりやすい',
  },
  {
    slug: 'simple-tokyo-railway-map',
    lang: 'zh',
    breadcrumbLabel: '东京地铁线路图太密集怎么办',
    title: '东京地铁线路图太密集怎么看 | Flex Railway Map',
    description: '东京的地铁线路图运营公司多、线路密集，想看懂并不容易。Flex Railway Map可以只勾选自己会用到的线路，实际打开一张只有3条线的简洁地图看看。',
    h1: '东京地铁线路图太密集怎么看',
    searchIntentAnswer:
      '东京的地铁线路图线路多、车站多，想一次看懂全部很容易看花眼。Flex Railway Map可以自己选择要显示的线路，只留下自己需要的部分，地图立刻变得清晰。',
    sections: [
      {
        heading: '为什么东京的地铁图线路那么密集',
        paragraphs: [
          '东京由JR、东京Metro、都营地下铁，以及多家私铁公司共同运营，同一个车站常常有好几条线路经过。标准地铁图为了把所有公司的线路都画在一张图上，线条密集地叠在一起，第一次看的人很难判断自己该看哪一条。',
        ],
      },
      {
        heading: '只勾选自己会用到的线路',
        paragraphs: [
          'Flex Railway Map可以对每条线路单独开关显示。例如只显示"JR山手线・中央线・东京Metro丸之内线"这3条线，地图上的线条数量会一下子减少，车站名称也更容易看清楚。',
          '点击下面的按钮，可以直接打开只显示这3条线的地图。',
        ],
      },
    ],
    ctaLabel: '在Flex Railway Map中打开只有这3条线的地图',
    ctaRoutes: ['yamanote', 'chuo', 'marunouchiLine'],
    ctaNote: '地图会以中文界面打开，只显示JR山手线・中央线・东京Metro丸之内线。其他线路可以随时从地图上的列表中添加或隐藏。',
    related: [
      { href: '/zh/guides/tokyo-train-map', label: '东京地铁线路图简化查看方法（面向游客）' },
      { href: '/guides/simple-tokyo-railway-map', label: '东京路线图简化查看方法（日语版）' },
      { href: '/ko/guides/simple-tokyo-railway-map', label: '도쿄 노선도 심플하게 보는 방법（韩语版）' },
    ],
    faq: [
      {
        question: '可以显示全部线路吗？',
        answer: '可以。随时可以从地图上的线路列表中重新显示所有线路。建议先从少数几条线路开始看，需要时再逐步添加。',
      },
      {
        question: '可以自己选择显示哪些线路吗？',
        answer: '可以。既可以对每条线路单独开关，也可以输入出发站和到达站，让Flex Railway Map自动选出与这次出行相关的线路。',
      },
      {
        question: '手机上也能用吗？',
        answer: '可以，手机、平板、电脑的浏览器都能免费使用，无需安装App。',
      },
    ],
    keywords: '东京地铁线路图,东京地铁图太密集,东京地铁图看不懂,东京电车路线图,东京地铁图简化',
  },
  {
    slug: 'simple-tokyo-railway-map',
    lang: 'ko',
    breadcrumbLabel: '도쿄 노선도 심플하게 보는 방법',
    title: '도쿄 노선도 심플하게 보는 방법 | Flex Railway Map',
    description: '도쿄 노선도는 운영 회사가 많고 노선이 빽빽해서 보기 어려울 때가 있습니다. Flex Railway Map에서는 필요한 노선만 골라서 표시할 수 있습니다. 3개 노선만 표시한 지도를 직접 열어 확인해보세요.',
    h1: '도쿄 노선도를 심플하게 보는 방법',
    searchIntentAnswer:
      '도쿄 노선도는 노선 수・역 수가 많아서 한 번에 다 보려고 하면 정보량 때문에 헷갈리기 쉽습니다. Flex Railway Map에서는 표시할 노선을 직접 선택할 수 있어서, 필요한 노선만 남긴 심플한 노선도를 바로 만들 수 있습니다.',
    sections: [
      {
        heading: '도쿄 노선도가 복잡해 보이는 이유',
        paragraphs: [
          '도쿄는 JR・도쿄메트로・도영지하철・여러 사철 회사가 함께 운영하고 있어서, 같은 역을 여러 노선이 지나는 경우도 많습니다. 일반적인 노선도는 이 모든 노선을 한 장에 담기 때문에 선이 빽빽해지고, 처음 보는 사람일수록 "어디를 봐야 할지" 헷갈리게 됩니다.',
        ],
      },
      {
        heading: '필요한 노선만 골라서 표시하기',
        paragraphs: [
          'Flex Railway Map에서는 노선 목록에서 표시하고 싶은 노선만 켜고 끌 수 있습니다. 예를 들어 "JR야마노테선・주오선・도쿄메트로 마루노우치선"처럼 자신이 이용하는 노선만 남기면, 지도 위 선의 개수가 확 줄어들고 역 이름도 훨씬 읽기 쉬워집니다.',
          '아래 버튼을 누르면 실제로 이 3개 노선만 표시된 지도를 바로 열 수 있습니다.',
        ],
      },
    ],
    ctaLabel: '이 3개 노선만 표시된 지도를 Flex Railway Map에서 열기',
    ctaRoutes: ['yamanote', 'chuo', 'marunouchiLine'],
    ctaNote: '야마노테선・주오선・도쿄메트로 마루노우치선만 표시된 상태로 지도가 열립니다. 다른 노선은 지도 위 목록에서 언제든 추가・숨김할 수 있습니다.',
    related: [
      { href: '/ko/guides/tokyo-train-map', label: '도쿄 노선도 심플하게 보기 (여행자용)' },
      { href: '/guides/simple-tokyo-railway-map', label: '도쿄 노선도 심플하게 보는 방법 (일본어판)' },
      { href: '/zh/guides/simple-tokyo-railway-map', label: '东京地铁线路图太密集怎么看 (중국어판)' },
    ],
    faq: [
      {
        question: '모든 노선을 다시 표시할 수도 있나요?',
        answer: '네. 지도 위 노선 목록에서 언제든지 모든 노선을 다시 표시할 수 있습니다. 우선 필요한 노선만 보고, 필요할 때 다른 노선을 추가하는 방식을 추천합니다.',
      },
      {
        question: '표시할 노선을 직접 선택할 수 있나요?',
        answer: '네. 노선별로 표시・숨김을 전환할 수 있고, 출발역과 도착역을 입력하면 해당 이동에 관련된 노선을 Flex Railway Map이 자동으로 선택해줍니다.',
      },
      {
        question: '스마트폰에서도 사용할 수 있나요?',
        answer: '네, 스마트폰・태블릿・PC 어떤 브라우저에서도 무료로 이용할 수 있습니다. 앱 설치는 필요하지 않습니다.',
      },
    ],
    keywords: '도쿄 노선도,도쿄 지하철 노선도,도쿄 노선도 심플,도쿄 노선도 보는 법,도쿄 지하철 노선도 복잡',
  },
  {
    slug: 'tokyo-train-map',
    lang: 'ko',
    breadcrumbLabel: '도쿄 노선도 심플하게 보기 (여행자용)',
    title: '도쿄 노선도 심플하게 보는 방법 (여행자용) | Flex Railway Map',
    description: '도쿄 노선도가 복잡해서 보기 힘드셨나요? Flex Railway Map에서는 필요한 노선만 표시할 수 있어서, 여행 일정에 맞는 심플한 지도를 몇 초 만에 열 수 있습니다.',
    h1: '여행자를 위한 심플한 도쿄 노선도',
    searchIntentAnswer:
      '도쿄의 전체 노선도에는 JR・도쿄메트로・도영지하철・여러 사철 노선이 한 장에 빽빽하게 그려져 있습니다. Flex Railway Map에서는 필요 없는 노선을 꺼둘 수 있어서, 이번 여행에 필요한 부분만 남긴 지도를 볼 수 있습니다.',
    sections: [
      {
        heading: '도쿄 노선도가 이렇게 복잡한 이유',
        paragraphs: [
          '도쿄는 여러 운영 회사가 함께 노선을 운행하고 있고, 여러 노선이 같은 역을 지나는 경우도 많습니다. 일반적인 노선도는 이 모든 것을 한 장에 담으려 하기 때문에, 처음 방문하는 여행자에게는 읽기 어려워 보이는 것입니다.',
        ],
      },
      {
        heading: '실제로 필요한 노선만 표시하기',
        paragraphs: [
          'Flex Railway Map에서는 어떤 노선을 표시할지 직접 선택할 수 있습니다. 일반적인 관광 일정이라면, 주요 지역을 순환하는 JR야마노테선과 가장 오래되고 중심가를 지나는 도쿄메트로 긴자선만으로도 상당 부분을 커버할 수 있습니다.',
          '아래 버튼을 누르면 이 2개 노선만 표시된 지도를 바로 열 수 있습니다.',
        ],
      },
      {
        heading: '경로 안내가 아닌, 노선 전체를 이해하기 위한 지도',
        paragraphs: [
          'Flex Railway Map은 몇 번 플랫폼으로 가야 하는지 알려주는 경로 안내 앱을 대신하려는 것이 아닙니다. 이동을 시작하기 전에, 이번 여행과 관련된 노선들이 어떻게 연결되어 있는지 직접 눈으로 확인하고 싶을 때를 위한 지도입니다.',
        ],
      },
    ],
    ctaLabel: '이 심플한 지도를 Flex Railway Map에서 열기',
    ctaRoutes: ['yamanote', 'ginzaLine'],
    ctaNote: '지도가 한국어 화면으로 열리며, JR야마노테선과 도쿄메트로 긴자선만 표시됩니다. 다른 노선은 지도 위 목록에서 언제든 추가・숨김할 수 있습니다.',
    related: [
      { href: '/en/guides/tokyo-train-map', label: 'Tokyo Train Map for Tourists (English)' },
      { href: '/zh/guides/tokyo-train-map', label: '东京地铁线路图简化查看方法（中文）' },
      { href: '/ko/guides/simple-tokyo-railway-map', label: '도쿄 노선도 심플하게 보는 방법 (3개 노선)' },
    ],
    faq: [
      {
        question: '모든 노선을 한 번에 표시할 수도 있나요?',
        answer: '네. 지도 위 노선 목록에서 언제든지 모든 노선을 다시 표시할 수 있습니다. 처음에는 몇 개 노선만 보고, 필요할 때 하나씩 추가하는 방식이 보기 편합니다.',
      },
      {
        question: '표시할 노선을 직접 고를 수 있나요?',
        answer: '네. 노선별로 표시・숨김을 전환할 수 있고, 출발역과 도착역을 입력하면 그 이동에 관련된 노선을 자동으로 선택해줍니다.',
      },
      {
        question: '스마트폰에서도 사용할 수 있나요?',
        answer: '네, 스마트폰・태블릿・PC 어떤 브라우저에서도 무료로 이용할 수 있습니다. 앱 설치는 필요하지 않습니다.',
      },
    ],
    keywords: '도쿄 노선도,도쿄 지하철 노선도,도쿄 여행 노선도,도쿄 노선도 보는 법,도쿄 지하철 심플',
  },
  // ── 大阪 ──
  {
    slug: 'osaka-train-map',
    city: 'osaka',
    lang: 'ja',
    breadcrumbLabel: '大阪の路線図をシンプルに見る',
    title: '大阪の路線図をシンプルに見る方法（環状線・御堂筋線・観光地の最寄り駅）| Flex Railway Map',
    description: '大阪の路線図はJR・Osaka Metro・私鉄が重なって見にくくなりがちです。大阪環状線と御堂筋線を軸に、必要な路線だけを表示した路線図をFlex Railway Mapで開けます。',
    h1: '大阪の路線図をシンプルに見る',
    searchIntentAnswer:
      '大阪の鉄道は、市内をぐるりと回るJR大阪環状線と、新大阪・梅田・なんば・天王寺を南北に結ぶOsaka Metro御堂筋線の2本を軸にすると全体像がつかみやすくなります。Flex Railway Mapでは、この2路線だけを表示した地図から始めて、必要な路線を足していけます。',
    sections: [
      {
        heading: '大阪環状線と御堂筋線を軸にする',
        paragraphs: [
          'JR大阪環状線は、大阪・京橋・天王寺・新今宮などを輪のように結ぶ路線です。Osaka Metro御堂筋線は、新幹線の新大阪から梅田・淀屋橋・本町・心斎橋・なんばを通って天王寺まで南北に走ります。まずこの2本の位置関係をつかむと、ほかの路線がどこで交わるかが見えやすくなります。',
        ],
        cta: { label: '大阪環状線と御堂筋線だけの地図を開く', routes: ['osakaLoopLine', 'midosujiLine'] },
      },
      {
        heading: '同じ場所でも会社によって駅名が違う',
        paragraphs: [
          'JRの「大阪」駅と、御堂筋線の「梅田」駅は、駅名は違いますが同じ一帯にあります。難波も、Osaka Metro・南海は「なんば」、近鉄・阪神は「大阪難波」、JRは「JR難波」と、会社ごとに駅名が異なります。路線図の上で駅名がそろっていないのはこのためです。',
        ],
      },
      {
        heading: '観光地の最寄り駅',
        paragraphs: [
          '道頓堀は「なんば」駅、心斎橋筋商店街は「心斎橋」駅が最寄りです。大阪城はJR大阪環状線の「大阪城公園」駅・「森ノ宮」駅、Osaka Metro谷町線の「谷町四丁目」駅が、通天閣はOsaka Metro堺筋線の「恵美須町」駅、御堂筋線の「動物園前」駅が最寄りです。',
        ],
        cta: {
          label: '観光地の最寄り駅を通る路線だけの地図を開く',
          routes: ['osakaLoopLine', 'midosujiLine', 'osakaSakaisuji', 'osakaTanimachi'],
        },
      },
      {
        heading: '関西空港から市内へ',
        paragraphs: [
          '関西空港駅には南海とJRが乗り入れています。南海は南海本線を通ってなんばへ、JRは天王寺・大阪方面へ向かいます。',
        ],
        cta: { label: '関西空港からなんばまでの南海線の地図を開く', routes: ['nankaAirportLine', 'nankaMainLine', 'midosujiLine'] },
      },
    ],
    ctaLabel: '大阪環状線と御堂筋線だけの地図をFlex Railway Mapで開く',
    ctaRoutes: ['osakaLoopLine', 'midosujiLine'],
    ctaNote: 'JR大阪環状線とOsaka Metro御堂筋線だけを表示した状態で地図が開きます。ほかの路線は地図上の一覧からいつでも追加・非表示にできます。',
    related: [
      { href: '/lines/osaka-loop-line', label: '大阪環状線の駅一覧' },
      { href: '/lines/midosuji-line', label: '御堂筋線の駅一覧' },
      { href: '/stations/namba', label: 'なんば駅の路線・乗り換え' },
      { href: '/stations/tennoji', label: '天王寺駅の路線・乗り換え' },
      { href: '/guides/kyoto-train-map', label: '京都の路線図をシンプルに見る' },
      { href: '/guides/simple-tokyo-railway-map', label: '東京の路線図をシンプルに見る' },
      { href: '/en/guides/osaka-train-map', label: 'A Simple Osaka Train Map (English)' },
      { href: '/zh/guides/osaka-train-map', label: '大阪线路图简化查看方法（中文）' },
      { href: '/ko/guides/osaka-train-map', label: '오사카 노선도 심플하게 보기 (한국어)' },
    ],
    faq: [
      {
        question: '大阪駅と梅田駅は同じ駅ですか？',
        answer: '駅名が違う別の駅ですが、同じ一帯にあり、歩いて行き来できます。JRは「大阪」、Osaka Metro御堂筋線は「梅田」という駅名です。',
      },
      {
        question: 'スマートフォンでも使えますか？',
        answer: 'はい、スマートフォン・タブレット・PCのいずれのブラウザでも無料で利用できます。アプリのインストールは不要です。',
      },
    ],
    keywords: '大阪 路線図,大阪 路線図 わかりやすい,大阪 地下鉄 路線図,大阪環状線 路線図,御堂筋線 路線図,大阪 観光 電車',
  },
  {
    slug: 'osaka-train-map',
    city: 'osaka',
    lang: 'en',
    breadcrumbLabel: 'A Simple Osaka Train Map',
    title: 'Osaka Train Map Made Simple (Loop Line, Midosuji Line, Sights) | Flex Railway Map',
    description: "Osaka's rail map mixes JR, Osaka Metro and private railways. Start from the JR Osaka Loop Line and the Midosuji Line, and open a map with only the lines you need.",
    h1: 'A Simple Osaka Train Map',
    searchIntentAnswer:
      "Osaka's rail network is easier to read if you start with two lines: the JR Osaka Loop Line, which circles central Osaka, and the Osaka Metro Midosuji Line, which runs north to south through Shin-Osaka, Umeda, Namba and Tennoji. Flex Railway Map lets you open a map with just these two lines and add others as you need them.",
    sections: [
      {
        heading: 'Start with the Loop Line and the Midosuji Line',
        paragraphs: [
          'The JR Osaka Loop Line links Osaka, Kyobashi, Tennoji, Shin-Imamiya and other stations in a circle. The Osaka Metro Midosuji Line runs from Shin-Osaka (the Shinkansen station) through Umeda, Yodoyabashi, Hommachi, Shinsaibashi and Namba to Tennoji. Once you know where these two lines run, it is much easier to see where the other lines cross them.',
        ],
        cta: { label: 'Open a map with only the Loop Line and the Midosuji Line', routes: ['osakaLoopLine', 'midosujiLine'] },
      },
      {
        heading: 'The same area can have different station names',
        paragraphs: [
          "JR's Osaka Station and the Midosuji Line's Umeda Station have different names but are in the same area. In Namba, Osaka Metro and Nankai use \"Namba\", Kintetsu and Hanshin use \"Osaka-Namba\", and JR uses \"JR Namba\". This is why station names on the map do not always match.",
        ],
      },
      {
        heading: 'Nearest stations to popular sights',
        paragraphs: [
          'Dotonbori is closest to Namba Station, and the Shinsaibashi-suji Shopping Street to Shinsaibashi Station. For Osaka Castle, use Osaka-jo-koen or Morinomiya on the JR Osaka Loop Line, or Tanimachi-yonchome on the Osaka Metro Tanimachi Line. For Tsutenkaku Tower, use Ebisucho on the Sakaisuji Line or Dobutsuen-mae on the Midosuji Line.',
        ],
        cta: {
          label: 'Open a map with the lines serving these sights',
          routes: ['osakaLoopLine', 'midosujiLine', 'osakaSakaisuji', 'osakaTanimachi'],
        },
      },
      {
        heading: 'From Kansai Airport to the city',
        paragraphs: [
          'Kansai-Airport Station is served by both Nankai and JR. Nankai trains run via the Nankai Main Line to Namba, and JR trains run toward Tennoji and Osaka.',
        ],
        cta: { label: 'Open the Nankai lines from Kansai Airport to Namba', routes: ['nankaAirportLine', 'nankaMainLine', 'midosujiLine'] },
      },
    ],
    ctaLabel: 'Open the Loop Line and Midosuji Line in Flex Railway Map',
    ctaRoutes: ['osakaLoopLine', 'midosujiLine'],
    ctaNote: 'Opens in English with only the JR Osaka Loop Line and the Osaka Metro Midosuji Line shown. You can add or hide other lines from the list on the map.',
    related: [
      { href: '/en/lines/osaka-loop-line', label: 'Osaka Loop Line: all stations' },
      { href: '/en/lines/midosuji-line', label: 'Midosuji Line: all stations' },
      { href: '/en/stations/namba', label: 'Namba Station: lines and transfers' },
      { href: '/en/stations/tennoji', label: 'Tennoji Station: lines and transfers' },
      { href: '/en/guides/kyoto-train-map', label: 'A Simple Kyoto Train Map' },
      { href: '/en/guides/tokyo-train-map', label: 'Tokyo Train Map for Tourists' },
      { href: '/guides/osaka-train-map', label: '大阪の路線図をシンプルに見る（日本語）' },
      { href: '/zh/guides/osaka-train-map', label: '大阪线路图简化查看方法（中文）' },
      { href: '/ko/guides/osaka-train-map', label: '오사카 노선도 심플하게 보기 (한국어)' },
    ],
    faq: [
      {
        question: 'Are Osaka Station and Umeda Station the same station?',
        answer: 'They are separate stations with different names, but they are in the same area and you can walk between them. JR uses the name "Osaka" and the Osaka Metro Midosuji Line uses "Umeda".',
      },
      {
        question: 'Does this work on my phone?',
        answer: 'Yes, Flex Railway Map works in any modern browser on phone, tablet, or desktop. No app install is required.',
      },
    ],
    keywords: 'Osaka train map,Osaka subway map,Osaka Loop Line map,Midosuji Line map,Osaka train map English',
  },
  {
    slug: 'osaka-train-map',
    city: 'osaka',
    lang: 'zh',
    breadcrumbLabel: '大阪线路图简化查看方法',
    title: '大阪地铁线路图太复杂怎么办（环状线・御堂筋线・景点最近车站）| Flex Railway Map',
    description: '大阪的线路图由JR、大阪Metro和多家私铁重叠在一起，不容易看懂。以JR大阪环状线和御堂筋线为主轴，用Flex Railway Map打开只显示必要线路的地图。',
    h1: '如何简化查看大阪线路图',
    searchIntentAnswer:
      '大阪的铁路，只要先抓住环绕市中心的JR大阪环状线，以及南北贯穿新大阪、梅田、难波、天王寺的大阪Metro御堂筋线这两条线，就能掌握整体结构。在Flex Railway Map中，可以先打开只显示这两条线路的地图，再按需要添加其他线路。',
    sections: [
      {
        heading: '以大阪环状线和御堂筋线为主轴',
        paragraphs: [
          'JR大阪环状线像一个圆环一样连接大阪、京桥、天王寺、新今宫等车站。大阪Metro御堂筋线从新干线车站新大阪出发，经过梅田、淀屋桥、本町、心斋桥、难波，南北方向一直通到天王寺。先弄清这两条线的位置关系，就容易看出其他线路在哪里与它们交会。',
        ],
        cta: { label: '打开只显示大阪环状线和御堂筋线的地图', routes: ['osakaLoopLine', 'midosujiLine'] },
      },
      {
        heading: '同一地区，不同公司的站名可能不同',
        paragraphs: [
          'JR的"大阪"站和御堂筋线的"梅田"站名字不同，但位于同一区域。难波一带也一样：大阪Metro和南海叫"难波（なんば）"，近铁和阪神叫"大阪难波"，JR叫"JR难波"。所以地图上的站名并不总是一致。',
        ],
      },
      {
        heading: '热门景点的最近车站',
        paragraphs: [
          '道顿堀的最近车站是难波站，心斋桥筋商店街是心斋桥站。大阪城可以利用JR大阪环状线的大阪城公园站、森之宫站，或大阪Metro谷町线的谷町四丁目站；通天阁可以利用大阪Metro堺筋线的惠美须町站或御堂筋线的动物园前站。',
        ],
        cta: {
          label: '打开只显示这些景点最近车站所在线路的地图',
          routes: ['osakaLoopLine', 'midosujiLine', 'osakaSakaisuji', 'osakaTanimachi'],
        },
      },
      {
        heading: '从关西机场到市区',
        paragraphs: [
          '关西空港站有南海和JR两家公司的列车。南海经南海本线开往难波，JR开往天王寺、大阪方向。',
        ],
        cta: { label: '打开从关西机场到难波的南海线路地图', routes: ['nankaAirportLine', 'nankaMainLine', 'midosujiLine'] },
      },
    ],
    ctaLabel: '在Flex Railway Map中打开大阪环状线和御堂筋线',
    ctaRoutes: ['osakaLoopLine', 'midosujiLine'],
    ctaNote: '地图会以中文界面打开，只显示JR大阪环状线和大阪Metro御堂筋线。其他线路可以随时从地图上的列表中添加或隐藏。',
    related: [
      { href: '/zh/lines/osaka-loop-line', label: '大阪环状线车站一览' },
      { href: '/zh/lines/midosuji-line', label: '御堂筋线车站一览' },
      { href: '/zh/stations/namba', label: '难波站的线路与换乘' },
      { href: '/zh/stations/tennoji', label: '天王寺站的线路与换乘' },
      { href: '/zh/guides/kyoto-train-map', label: '京都线路图简化查看方法' },
      { href: '/zh/guides/tokyo-train-map', label: '东京地铁线路图简化查看方法' },
      { href: '/en/guides/osaka-train-map', label: 'A Simple Osaka Train Map（英语版）' },
      { href: '/guides/osaka-train-map', label: '大阪の路線図をシンプルに見る（日语版）' },
      { href: '/ko/guides/osaka-train-map', label: '오사카 노선도 심플하게 보기（韩语版）' },
    ],
    faq: [
      {
        question: '大阪站和梅田站是同一个车站吗？',
        answer: '是名字不同的两个车站，但位于同一区域，可以步行往来。JR的站名是"大阪"，大阪Metro御堂筋线的站名是"梅田"。',
      },
      {
        question: '手机上可以使用吗？',
        answer: '可以。手机、平板、电脑的浏览器都能免费使用，不需要安装App。',
      },
    ],
    keywords: '大阪地铁线路图,大阪线路图,大阪环状线,御堂筋线,大阪地铁图看不懂,大阪旅游交通',
  },
  {
    slug: 'osaka-train-map',
    city: 'osaka',
    lang: 'ko',
    breadcrumbLabel: '오사카 노선도 심플하게 보기',
    title: '오사카 노선도 심플하게 보는 방법 (순환선・미도스지선・관광지 최근접 역) | Flex Railway Map',
    description: '오사카 노선도는 JR・오사카 메트로・사철이 겹쳐 있어 보기 어렵습니다. JR 오사카 순환선과 미도스지선을 중심으로, 필요한 노선만 표시한 지도를 Flex Railway Map에서 열 수 있습니다.',
    h1: '오사카 노선도 심플하게 보기',
    searchIntentAnswer:
      '오사카의 철도는 도심을 한 바퀴 도는 JR 오사카 순환선(Osaka Loop Line)과, 신오사카・우메다・난바・덴노지를 남북으로 잇는 오사카 메트로 미도스지선(Midosuji Line) 두 노선을 기준으로 보면 전체 구조를 파악하기 쉽습니다. Flex Railway Map에서는 이 두 노선만 표시한 지도에서 시작해 필요한 노선을 더해 갈 수 있습니다.',
    sections: [
      {
        heading: '오사카 순환선과 미도스지선을 기준으로',
        paragraphs: [
          'JR 오사카 순환선은 오사카・교바시・덴노지 등을 고리 모양으로 잇는 노선입니다. 오사카 메트로 미도스지선은 신칸센이 서는 신오사카에서 우메다・신사이바시・난바를 지나 덴노지까지 남북으로 달립니다. 먼저 이 두 노선의 위치 관계를 파악하면, 다른 노선이 어디에서 만나는지 보기 쉬워집니다.',
        ],
        cta: { label: '오사카 순환선과 미도스지선만 표시한 지도 열기', routes: ['osakaLoopLine', 'midosujiLine'] },
      },
      {
        heading: '같은 지역이라도 회사마다 역 이름이 다릅니다',
        paragraphs: [
          'JR의 "오사카"역과 미도스지선의 "우메다"역은 이름은 다르지만 같은 지역에 있습니다. 난바도 오사카 메트로・난카이는 "난바(なんば)", 긴테쓰・한신은 "Osaka-Namba(大阪難波)", JR은 "JR Namba(JR難波)"로 회사마다 역 이름이 다릅니다. 노선도에서 역 이름이 일치하지 않는 이유입니다.',
        ],
      },
      {
        heading: '인기 관광지의 가장 가까운 역',
        paragraphs: [
          '도톤보리는 난바역, 신사이바시스지 상점가는 신사이바시역이 가장 가깝습니다. 오사카성은 JR 오사카 순환선의 Osaka-jo-koen역・Morinomiya역, 오사카 메트로 다니마치선(Tanimachi Line)의 Tanimachi-yonchome역을, 쓰텐카쿠는 사카이스지선(Sakaisuji Line)의 Ebisucho역이나 미도스지선의 Dobutsuen-mae역을 이용합니다.',
        ],
        cta: {
          label: '관광지의 가장 가까운 역을 지나는 노선만 표시한 지도 열기',
          routes: ['osakaLoopLine', 'midosujiLine', 'osakaSakaisuji', 'osakaTanimachi'],
        },
      },
      {
        heading: '간사이 국제공항에서 시내로',
        paragraphs: [
          '간사이 국제공항의 Kansai-Airport역에는 난카이와 JR이 들어옵니다. 난카이는 난카이 본선(Nankai Main Line)을 거쳐 난바로, JR은 덴노지・오사카 방면으로 갑니다.',
        ],
        cta: { label: '간사이 국제공항에서 난바까지 난카이선 지도 열기', routes: ['nankaAirportLine', 'nankaMainLine', 'midosujiLine'] },
      },
    ],
    ctaLabel: '오사카 순환선과 미도스지선을 Flex Railway Map에서 열기',
    ctaRoutes: ['osakaLoopLine', 'midosujiLine'],
    ctaNote: '지도가 한국어 화면으로 열리며, JR 오사카 순환선과 오사카 메트로 미도스지선만 표시됩니다. 다른 노선은 지도 위 목록에서 언제든 추가・숨김할 수 있습니다.',
    related: [
      { href: '/ko/lines/osaka-loop-line', label: '오사카 순환선 역 목록' },
      { href: '/ko/lines/midosuji-line', label: '미도스지선 역 목록' },
      { href: '/ko/stations/namba', label: '난바역 노선・환승' },
      { href: '/ko/stations/tennoji', label: '덴노지역 노선・환승' },
      { href: '/ko/guides/kyoto-train-map', label: '교토 노선도 심플하게 보기' },
      { href: '/ko/guides/tokyo-train-map', label: '도쿄 노선도 심플하게 보기 (여행자용)' },
      { href: '/en/guides/osaka-train-map', label: 'A Simple Osaka Train Map (English)' },
      { href: '/guides/osaka-train-map', label: '大阪の路線図をシンプルに見る (일본어)' },
      { href: '/zh/guides/osaka-train-map', label: '大阪线路图简化查看方法 (중국어)' },
    ],
    faq: [
      {
        question: '오사카역과 우메다역은 같은 역인가요?',
        answer: '이름이 다른 별개의 역이지만 같은 지역에 있어 걸어서 오갈 수 있습니다. JR은 "오사카", 오사카 메트로 미도스지선은 "우메다"라는 역 이름을 씁니다.',
      },
      {
        question: '스마트폰에서도 사용할 수 있나요?',
        answer: '네, 스마트폰・태블릿・PC 어떤 브라우저에서도 무료로 이용할 수 있습니다. 앱 설치는 필요하지 않습니다.',
      },
    ],
    keywords: '오사카 노선도,오사카 지하철 노선도,오사카 순환선,미도스지선,오사카 여행 전철',
  },
  // ── 京都 ──
  {
    slug: 'kyoto-train-map',
    city: 'kyoto',
    lang: 'ja',
    breadcrumbLabel: '京都の路線図をシンプルに見る',
    title: '京都の路線図をシンプルに見る方法（地下鉄・京阪・嵐山・伏見稲荷）| Flex Railway Map',
    description: '京都は地下鉄2路線にJR・京阪・阪急・嵐電が組み合わさります。観光地の最寄り駅を通る路線だけを表示した路線図をFlex Railway Mapで開けます。',
    h1: '京都の路線図をシンプルに見る',
    searchIntentAnswer:
      '京都の鉄道は、京都駅から北へ延びる地下鉄烏丸線、東西に走る地下鉄東西線、鴨川沿いを走る京阪本線の3本を軸にすると分かりやすくなります。嵐山・伏見稲荷など少し離れた観光地へは、嵐電・阪急・JRの路線を足していきます。',
    sections: [
      {
        heading: '地下鉄烏丸線・東西線と京阪本線',
        paragraphs: [
          '地下鉄烏丸線は京都駅から四条・烏丸御池を通って北へ延び、地下鉄東西線は二条城前・京都市役所前・三条京阪などを東西に結びます。2つの地下鉄は烏丸御池駅で乗り換えられます。京阪本線は鴨川沿いを走り、祇園四条・清水五条・東福寺などに駅があります。',
        ],
        cta: { label: '地下鉄2路線と京阪本線だけの地図を開く', routes: ['kyotoSubwayKarasuma', 'kyotoSubwayTozai', 'keihanMainLine'] },
      },
      {
        heading: '伏見稲荷大社・東福寺へ',
        paragraphs: [
          '伏見稲荷大社はJR奈良線の稲荷駅が最寄りです。JR奈良線は京都駅から出ていて、東福寺駅で京阪本線と乗り換えられます。',
        ],
        cta: { label: 'JR奈良線と京阪本線の地図を開く', routes: ['jrNaraLine', 'keihanMainLine'] },
      },
      {
        heading: '嵐山には別々の駅が3つある',
        paragraphs: [
          '嵐山には、嵐電（京福電気鉄道）の嵐山駅、阪急嵐山線の嵐山駅、JR嵯峨野線（山陰本線）の嵯峨嵐山駅があり、それぞれ別の駅です。京都駅からはJR嵯峨野線、四条大宮からは嵐電、阪急京都線の桂からは阪急嵐山線で向かいます。',
        ],
        cta: { label: '嵐山へ向かう3路線の地図を開く', routes: ['keifukuArashiyama', 'hankyuArashiyamaLine', 'jrSaninMainLine'] },
      },
      {
        heading: '鉄道の駅から離れた観光地もある',
        paragraphs: [
          '金閣寺や銀閣寺のように、近くに鉄道の駅が無く、バスで向かうのが一般的な観光地もあります。清水寺も、最寄りの京阪 清水五条駅からは歩いて距離があります。Flex Railway Mapは鉄道の路線図のため、バスの路線は表示しません。',
        ],
      },
    ],
    ctaLabel: '京都の地下鉄・京阪・JR奈良線だけの地図をFlex Railway Mapで開く',
    ctaRoutes: ['kyotoSubwayKarasuma', 'kyotoSubwayTozai', 'keihanMainLine', 'jrNaraLine'],
    ctaNote: '京都市営地下鉄の烏丸線・東西線、京阪本線、JR奈良線だけを表示した状態で地図が開きます。ほかの路線は地図上の一覧からいつでも追加・非表示にできます。',
    related: [
      { href: '/lines/kyoto-subway-karasuma-line', label: '京都市営地下鉄烏丸線の駅一覧' },
      { href: '/lines/keihan-main-line', label: '京阪本線の駅一覧' },
      { href: '/stations/kyoto', label: '京都駅の路線・乗り換え' },
      { href: '/stations/inari', label: '稲荷駅（伏見稲荷大社の最寄り駅）' },
      { href: '/stations/arashiyama', label: '嵐山駅' },
      { href: '/guides/osaka-train-map', label: '大阪の路線図をシンプルに見る' },
      { href: '/en/guides/kyoto-train-map', label: 'A Simple Kyoto Train Map (English)' },
      { href: '/zh/guides/kyoto-train-map', label: '京都线路图简化查看方法（中文）' },
      { href: '/ko/guides/kyoto-train-map', label: '교토 노선도 심플하게 보기 (한국어)' },
    ],
    faq: [
      {
        question: '京都駅から嵐山へはどの路線で行けますか？',
        answer: '京都駅からはJR嵯峨野線（山陰本線）で嵯峨嵐山駅へ向かうのが乗り換えなしの方法です。嵐電の嵐山駅は四条大宮から、阪急の嵐山駅は桂から乗り換えて向かいます。',
      },
      {
        question: 'バスの路線も表示できますか？',
        answer: 'いいえ。Flex Railway Mapは鉄道の路線図で、バスの路線は表示しません。',
      },
    ],
    keywords: '京都 路線図,京都 路線図 わかりやすい,京都 地下鉄 路線図,京都 観光 電車,嵐山 行き方 電車,伏見稲荷 最寄り駅',
  },
  {
    slug: 'kyoto-train-map',
    city: 'kyoto',
    lang: 'en',
    breadcrumbLabel: 'A Simple Kyoto Train Map',
    title: 'Kyoto Train Map Made Simple (Subway, Keihan, Arashiyama, Fushimi Inari) | Flex Railway Map',
    description: "Kyoto combines two subway lines with JR, Keihan, Hankyu and Randen. Open a map with only the lines that serve the sights you want to visit.",
    h1: 'A Simple Kyoto Train Map',
    searchIntentAnswer:
      'Kyoto is easier to read if you start with three lines: the Karasuma Line subway running north from Kyoto Station, the Tozai Line subway running east to west, and the Keihan Main Line along the Kamo River. For sights a little further out, such as Arashiyama and Fushimi Inari, add the Randen, Hankyu and JR lines.',
    sections: [
      {
        heading: 'The two subway lines and the Keihan Main Line',
        paragraphs: [
          'The Kyoto Subway Karasuma Line runs north from Kyoto Station through Shijo and Karasuma-Oike, and the Tozai Line links Nijojo-mae, Kyoto-Shiyakusho-mae and Sanjo-Keihan from west to east. You can change between the two subway lines at Karasuma-Oike. The Keihan Main Line runs along the Kamo River with stations such as Gion-Shijo, Kiyomizu-Gojo and Tofukuji.',
        ],
        cta: { label: 'Open a map with the two subway lines and the Keihan Main Line', routes: ['kyotoSubwayKarasuma', 'kyotoSubwayTozai', 'keihanMainLine'] },
      },
      {
        heading: 'Fushimi Inari Taisha and Tofuku-ji',
        paragraphs: [
          'The nearest station to Fushimi Inari Taisha is Inari on the JR Nara Line. The JR Nara Line starts at Kyoto Station, and at Tofukuji Station you can change to the Keihan Main Line.',
        ],
        cta: { label: 'Open the JR Nara Line and the Keihan Main Line', routes: ['jrNaraLine', 'keihanMainLine'] },
      },
      {
        heading: 'Arashiyama has three separate stations',
        paragraphs: [
          'Arashiyama has three different stations: Arashiyama on the Randen (Keifuku Electric Railroad), Arashiyama on the Hankyu Arashiyama Line, and Saga-Arashiyama on the JR Sagano Line (San-in Main Line). From Kyoto Station take the JR Sagano Line, from Shijo-Omiya take the Randen, and from Katsura on the Hankyu Kyoto Line take the Hankyu Arashiyama Line.',
        ],
        cta: { label: 'Open the three lines to Arashiyama', routes: ['keifukuArashiyama', 'hankyuArashiyamaLine', 'jrSaninMainLine'] },
      },
      {
        heading: 'Some sights are far from any station',
        paragraphs: [
          'Some sights, such as Kinkaku-ji and Ginkaku-ji, have no railway station nearby and are usually reached by bus. Kiyomizu-dera is also a fair walk from the nearest station, Kiyomizu-Gojo on the Keihan Main Line. Flex Railway Map is a railway map and does not show bus routes.',
        ],
      },
    ],
    ctaLabel: "Open Kyoto's subway, Keihan and JR Nara Line in Flex Railway Map",
    ctaRoutes: ['kyotoSubwayKarasuma', 'kyotoSubwayTozai', 'keihanMainLine', 'jrNaraLine'],
    ctaNote: 'Opens in English with only the Kyoto Subway Karasuma and Tozai Lines, the Keihan Main Line and the JR Nara Line shown. You can add or hide other lines from the list on the map.',
    related: [
      { href: '/en/lines/kyoto-subway-karasuma-line', label: 'Kyoto Subway Karasuma Line: all stations' },
      { href: '/en/lines/keihan-main-line', label: 'Keihan Main Line: all stations' },
      { href: '/en/stations/kyoto', label: 'Kyoto Station: lines and transfers' },
      { href: '/en/stations/inari', label: 'Inari Station (for Fushimi Inari Taisha)' },
      { href: '/en/stations/arashiyama', label: 'Arashiyama Station' },
      { href: '/en/guides/osaka-train-map', label: 'A Simple Osaka Train Map' },
      { href: '/guides/kyoto-train-map', label: '京都の路線図をシンプルに見る（日本語）' },
      { href: '/zh/guides/kyoto-train-map', label: '京都线路图简化查看方法（中文）' },
      { href: '/ko/guides/kyoto-train-map', label: '교토 노선도 심플하게 보기 (한국어)' },
    ],
    faq: [
      {
        question: 'Which line goes from Kyoto Station to Arashiyama?',
        answer: 'From Kyoto Station, the JR Sagano Line (San-in Main Line) takes you to Saga-Arashiyama without changing trains. The Randen Arashiyama Station is reached from Shijo-Omiya, and the Hankyu Arashiyama Station by changing at Katsura.',
      },
      {
        question: 'Can I see bus routes?',
        answer: 'No. Flex Railway Map is a railway map and does not show bus routes.',
      },
    ],
    keywords: 'Kyoto train map,Kyoto subway map,Kyoto train map English,Arashiyama by train,Fushimi Inari nearest station',
  },
  {
    slug: 'kyoto-train-map',
    city: 'kyoto',
    lang: 'zh',
    breadcrumbLabel: '京都线路图简化查看方法',
    title: '京都电车线路图怎么看（地铁・京阪・岚山・伏见稻荷）| Flex Railway Map',
    description: '京都的铁路由两条地铁线加上JR、京阪、阪急、岚电组成。用Flex Railway Map打开只显示前往景点所需线路的地图。',
    h1: '如何简化查看京都线路图',
    searchIntentAnswer:
      '京都的铁路，可以先以三条线为主轴：从京都站向北延伸的地铁乌丸线、东西向的地铁东西线，以及沿鸭川行驶的京阪本线。前往岚山、伏见稻荷大社等稍远的景点时，再加上岚电、阪急和JR的线路即可。',
    sections: [
      {
        heading: '地铁乌丸线・东西线与京阪本线',
        paragraphs: [
          '京都市营地铁乌丸线从京都站出发，经四条、乌丸御池向北延伸；地铁东西线东西向连接二条城前、京都市役所前、三条京阪等车站。两条地铁线可以在乌丸御池站换乘。京阪本线沿鸭川行驶，设有祇园四条、清水五条、东福寺等车站。',
        ],
        cta: { label: '打开只显示两条地铁线和京阪本线的地图', routes: ['kyotoSubwayKarasuma', 'kyotoSubwayTozai', 'keihanMainLine'] },
      },
      {
        heading: '前往伏见稻荷大社・东福寺',
        paragraphs: [
          '伏见稻荷大社的最近车站是JR奈良线的稻荷站。JR奈良线从京都站发车，在东福寺站可以换乘京阪本线。',
        ],
        cta: { label: '打开JR奈良线和京阪本线的地图', routes: ['jrNaraLine', 'keihanMainLine'] },
      },
      {
        heading: '岚山有三个不同的车站',
        paragraphs: [
          '岚山有岚电（京福电气铁道）的岚山站、阪急岚山线的岚山站，以及JR嵯峨野线（山阴本线）的嵯峨岚山站，这是三个不同的车站。从京都站可乘JR嵯峨野线，从四条大宫可乘岚电，从阪急京都线的桂站可换乘阪急岚山线。',
        ],
        cta: { label: '打开前往岚山的三条线路地图', routes: ['keifukuArashiyama', 'hankyuArashiyamaLine', 'jrSaninMainLine'] },
      },
      {
        heading: '有些景点离铁路车站较远',
        paragraphs: [
          '像金阁寺、银阁寺这样的景点，附近没有铁路车站，一般乘坐巴士前往。清水寺离最近的京阪清水五条站也有一段步行距离。Flex Railway Map是铁路线路图，不显示巴士路线。',
        ],
      },
    ],
    ctaLabel: '在Flex Railway Map中打开京都的地铁・京阪・JR奈良线',
    ctaRoutes: ['kyotoSubwayKarasuma', 'kyotoSubwayTozai', 'keihanMainLine', 'jrNaraLine'],
    ctaNote: '地图会以中文界面打开，只显示京都市营地铁乌丸线・东西线、京阪本线和JR奈良线。其他线路可以随时从地图上的列表中添加或隐藏。',
    related: [
      { href: '/zh/lines/kyoto-subway-karasuma-line', label: '京都市营地铁乌丸线车站一览' },
      { href: '/zh/lines/keihan-main-line', label: '京阪本线车站一览' },
      { href: '/zh/stations/kyoto', label: '京都站的线路与换乘' },
      { href: '/zh/stations/inari', label: '稻荷站（伏见稻荷大社最近车站）' },
      { href: '/zh/stations/arashiyama', label: '岚山站' },
      { href: '/zh/guides/osaka-train-map', label: '大阪线路图简化查看方法' },
      { href: '/en/guides/kyoto-train-map', label: 'A Simple Kyoto Train Map（英语版）' },
      { href: '/guides/kyoto-train-map', label: '京都の路線図をシンプルに見る（日语版）' },
      { href: '/ko/guides/kyoto-train-map', label: '교토 노선도 심플하게 보기（韩语版）' },
    ],
    faq: [
      {
        question: '从京都站去岚山坐哪条线？',
        answer: '从京都站乘JR嵯峨野线（山阴本线）可以不换乘直达嵯峨岚山站。岚电的岚山站从四条大宫出发，阪急的岚山站需要在桂站换乘。',
      },
      {
        question: '可以显示巴士路线吗？',
        answer: '不可以。Flex Railway Map是铁路线路图，不显示巴士路线。',
      },
    ],
    keywords: '京都地铁线路图,京都电车路线图,京都旅游交通,岚山怎么去,伏见稻荷大社最近车站',
  },
  {
    slug: 'kyoto-train-map',
    city: 'kyoto',
    lang: 'ko',
    breadcrumbLabel: '교토 노선도 심플하게 보기',
    title: '교토 노선도 심플하게 보는 방법 (지하철・게이한・아라시야마・후시미 이나리) | Flex Railway Map',
    description: '교토는 지하철 2개 노선에 JR・게이한・한큐・란덴이 더해집니다. 가고 싶은 관광지로 가는 노선만 표시한 지도를 Flex Railway Map에서 열 수 있습니다.',
    h1: '교토 노선도 심플하게 보기',
    searchIntentAnswer:
      '교토의 철도는 교토역에서 북쪽으로 뻗는 지하철 가라스마선(Karasuma Line), 동서로 달리는 지하철 도자이선(Tozai Line), 가모강을 따라 달리는 게이한 본선(Keihan Main Line) 세 노선을 기준으로 보면 이해하기 쉽습니다. 아라시야마・후시미 이나리 타이샤처럼 조금 떨어진 관광지는 란덴・한큐・JR 노선을 더해서 봅니다.',
    sections: [
      {
        heading: '지하철 가라스마선・도자이선과 게이한 본선',
        paragraphs: [
          '교토 시영 지하철 가라스마선은 교토역에서 Shijo・Karasuma-Oike를 지나 북쪽으로 뻗어 있고, 도자이선은 Nijojo-mae・Kyoto-Shiyakusho-mae・Sanjo-Keihan 등을 동서로 잇습니다. 두 지하철은 Karasuma-Oike역에서 갈아탈 수 있습니다. 게이한 본선은 가모강을 따라 달리며 Gion-Shijo・Kiyomizu-Gojo・Tofukuji 등에 역이 있습니다.',
        ],
        cta: { label: '지하철 2개 노선과 게이한 본선만 표시한 지도 열기', routes: ['kyotoSubwayKarasuma', 'kyotoSubwayTozai', 'keihanMainLine'] },
      },
      {
        heading: '후시미 이나리 타이샤・도후쿠지로',
        paragraphs: [
          '후시미 이나리 타이샤는 JR 나라선(JR Nara Line)의 Inari역이 가장 가깝습니다. JR 나라선은 교토역에서 출발하며, Tofukuji역에서 게이한 본선으로 갈아탈 수 있습니다.',
        ],
        cta: { label: 'JR 나라선과 게이한 본선 지도 열기', routes: ['jrNaraLine', 'keihanMainLine'] },
      },
      {
        heading: '아라시야마에는 서로 다른 역이 3개 있습니다',
        paragraphs: [
          '아라시야마에는 란덴(Randen, 게이후쿠 전기철도)의 Arashiyama역, 한큐 아라시야마선의 Arashiyama역, JR 사가노선(산인 본선)의 Saga-Arashiyama역이 있으며, 모두 다른 역입니다. 교토역에서는 JR 사가노선, Shijo-Omiya에서는 란덴, 한큐 교토선의 Katsura역에서는 한큐 아라시야마선을 이용합니다.',
        ],
        cta: { label: '아라시야마로 가는 3개 노선 지도 열기', routes: ['keifukuArashiyama', 'hankyuArashiyamaLine', 'jrSaninMainLine'] },
      },
      {
        heading: '철도역에서 떨어진 관광지도 있습니다',
        paragraphs: [
          '금각사・은각사처럼 근처에 철도역이 없어 버스로 가는 것이 일반적인 관광지도 있습니다. 기요미즈데라도 가장 가까운 게이한 Kiyomizu-Gojo역에서 걸어서 꽤 거리가 있습니다. Flex Railway Map은 철도 노선도이므로 버스 노선은 표시하지 않습니다.',
        ],
      },
    ],
    ctaLabel: '교토 지하철・게이한・JR 나라선을 Flex Railway Map에서 열기',
    ctaRoutes: ['kyotoSubwayKarasuma', 'kyotoSubwayTozai', 'keihanMainLine', 'jrNaraLine'],
    ctaNote: '지도가 한국어 화면으로 열리며, 교토 시영 지하철 가라스마선・도자이선, 게이한 본선, JR 나라선만 표시됩니다. 다른 노선은 지도 위 목록에서 언제든 추가・숨김할 수 있습니다.',
    related: [
      { href: '/ko/lines/kyoto-subway-karasuma-line', label: '교토 시영 지하철 가라스마선 역 목록' },
      { href: '/ko/lines/keihan-main-line', label: '게이한 본선 역 목록' },
      { href: '/ko/stations/kyoto', label: '교토역 노선・환승' },
      { href: '/ko/guides/osaka-train-map', label: '오사카 노선도 심플하게 보기' },
      { href: '/en/guides/kyoto-train-map', label: 'A Simple Kyoto Train Map (English)' },
      { href: '/guides/kyoto-train-map', label: '京都の路線図をシンプルに見る (일본어)' },
      { href: '/zh/guides/kyoto-train-map', label: '京都线路图简化查看方法 (중국어)' },
    ],
    faq: [
      {
        question: '교토역에서 아라시야마까지는 어떤 노선으로 가나요?',
        answer: '교토역에서는 JR 사가노선(산인 본선)으로 갈아타지 않고 Saga-Arashiyama역까지 갈 수 있습니다. 란덴의 Arashiyama역은 Shijo-Omiya에서, 한큐의 Arashiyama역은 Katsura역에서 갈아타고 갑니다.',
      },
      {
        question: '버스 노선도 표시할 수 있나요?',
        answer: '아니요. Flex Railway Map은 철도 노선도이며 버스 노선은 표시하지 않습니다.',
      },
    ],
    keywords: '교토 노선도,교토 지하철 노선도,교토 여행 전철,아라시야마 가는 법,후시미 이나리 가는 법',
  },
  // ── 札幌 ──
  {
    slug: 'sapporo-train-map',
    city: 'hokkaido',
    lang: 'ja',
    breadcrumbLabel: '札幌の路線図をシンプルに見る',
    title: '札幌の地下鉄・路線図をシンプルに見る方法（大通・すすきの・新千歳空港）| Flex Railway Map',
    description: '札幌の地下鉄は南北線・東西線・東豊線の3路線で、3路線とも大通駅で乗り換えられます。新千歳空港・小樽へのJRも含め、必要な路線だけの路線図をFlex Railway Mapで開けます。',
    h1: '札幌の路線図をシンプルに見る',
    searchIntentAnswer:
      '札幌の地下鉄は南北線・東西線・東豊線の3路線で、3路線とも大通駅で乗り換えられます。まず大通を中心に3路線の向きをつかみ、新千歳空港や小樽へ向かうときはJRの路線を足すと、全体が分かりやすくなります。',
    sections: [
      {
        heading: '地下鉄3路線は大通で交わる',
        paragraphs: [
          '南北線は麻生〜真駒内、東西線は宮の沢〜新さっぽろ、東豊線は栄町〜福住を結びます。南北線と東豊線は、JR札幌駅に接続する「さっぽろ」駅も通ります（地下鉄の駅名はひらがなの「さっぽろ」、JRは漢字の「札幌」です）。',
        ],
        cta: { label: '札幌の地下鉄3路線だけの地図を開く', routes: ['sapporoNambokuLine', 'sapporoTozaiLine', 'sapporoTohoLine'] },
      },
      {
        heading: 'すすきのと市電',
        paragraphs: [
          'すすきのは南北線のすすきの駅が最寄りです。東豊線の近くの駅は「豊水すすきの」という別の駅名です。札幌市電は、すすきの電停などを通る環状の路面電車です。',
        ],
        cta: { label: '南北線・東豊線と札幌市電の地図を開く', routes: ['sapporoNambokuLine', 'sapporoTohoLine', 'sapporoShiden'] },
      },
      {
        heading: '新千歳空港・小樽へはJR',
        paragraphs: [
          '新千歳空港駅はJR千歳線の駅で、札幌駅と結ばれています。小樽へは札幌駅からJR函館本線で向かいます。',
        ],
        cta: { label: 'JR千歳線・函館本線の地図を開く', routes: ['jrChitoseLine', 'jrHakodateMainLine'] },
      },
    ],
    ctaLabel: '札幌の地下鉄3路線とJR千歳線をFlex Railway Mapで開く',
    ctaRoutes: ['sapporoNambokuLine', 'sapporoTozaiLine', 'sapporoTohoLine', 'jrChitoseLine'],
    ctaNote: '札幌市営地下鉄の南北線・東西線・東豊線とJR千歳線だけを表示した状態で地図が開きます。ほかの路線は地図上の一覧からいつでも追加・非表示にできます。',
    related: [
      { href: '/lines/sapporo-subway-namboku-line', label: '札幌市営地下鉄南北線の駅一覧' },
      { href: '/lines/sapporo-subway-tozai-line', label: '札幌市営地下鉄東西線の駅一覧' },
      { href: '/lines/jr-chitose-line', label: 'JR千歳線の駅一覧' },
      { href: '/stations/odori', label: '大通駅の路線・乗り換え' },
      { href: '/stations/new-chitose-airport', label: '新千歳空港駅' },
      { href: '/guides/simple-tokyo-railway-map', label: '東京の路線図をシンプルに見る' },
      { href: '/en/guides/sapporo-train-map', label: 'A Simple Sapporo Train Map (English)' },
      { href: '/zh/guides/sapporo-train-map', label: '札幌线路图简化查看方法（中文）' },
      { href: '/ko/guides/sapporo-train-map', label: '삿포로 노선도 심플하게 보기 (한국어)' },
    ],
    faq: [
      {
        question: '大通駅で乗り換えられる地下鉄は？',
        answer: '南北線・東西線・東豊線の3路線すべてです。',
      },
      {
        question: 'さっぽろ駅と札幌駅は同じ駅ですか？',
        answer: '地下鉄の「さっぽろ」駅とJRの「札幌」駅は別の駅ですが、つながっていて乗り換えられます。',
      },
    ],
    keywords: '札幌 路線図,札幌 地下鉄 路線図,札幌 地下鉄 わかりやすい,新千歳空港 札幌 電車,札幌 観光 電車',
  },
  {
    slug: 'sapporo-train-map',
    city: 'hokkaido',
    lang: 'en',
    breadcrumbLabel: 'A Simple Sapporo Train Map',
    title: 'Sapporo Subway and Train Map Made Simple (Odori, Susukino, New Chitose Airport) | Flex Railway Map',
    description: "Sapporo's subway has three lines, the Namboku, Tozai and Toho Lines, and all three meet at Odori. Open a map with only the lines you need, including JR to New Chitose Airport and Otaru.",
    h1: 'A Simple Sapporo Train Map',
    searchIntentAnswer:
      "Sapporo's subway has three lines, the Namboku, Tozai and Toho Lines, and you can change between all three at Odori Station. Start by getting the direction of the three lines around Odori, then add the JR lines when you head to New Chitose Airport or Otaru.",
    sections: [
      {
        heading: 'The three subway lines meet at Odori',
        paragraphs: [
          'The Namboku Line runs between Asabu and Makomanai, the Tozai Line between Miyanosawa and Shin-Sapporo, and the Toho Line between Sakae-cho and Fukuzumi. The Namboku and Toho Lines also stop at Sapporo Station, which connects to JR Sapporo Station (the subway station name is written in hiragana, the JR one in kanji).',
        ],
        cta: { label: "Open a map with only Sapporo's three subway lines", routes: ['sapporoNambokuLine', 'sapporoTozaiLine', 'sapporoTohoLine'] },
      },
      {
        heading: 'Susukino and the streetcar',
        paragraphs: [
          'The nearest station to Susukino is Susukino on the Namboku Line. The nearby station on the Toho Line has a different name, Hosui-Susukino. The Sapporo Streetcar is a loop tram line that also stops at Susukino.',
        ],
        cta: { label: 'Open the Namboku and Toho Lines and the streetcar', routes: ['sapporoNambokuLine', 'sapporoTohoLine', 'sapporoShiden'] },
      },
      {
        heading: 'JR to New Chitose Airport and Otaru',
        paragraphs: [
          'New Chitose Airport Station is on the JR Chitose Line, which connects it with Sapporo Station. For Otaru, take the JR Hakodate Main Line from Sapporo Station.',
        ],
        cta: { label: 'Open the JR Chitose Line and Hakodate Main Line', routes: ['jrChitoseLine', 'jrHakodateMainLine'] },
      },
    ],
    ctaLabel: "Open Sapporo's subway and the JR Chitose Line in Flex Railway Map",
    ctaRoutes: ['sapporoNambokuLine', 'sapporoTozaiLine', 'sapporoTohoLine', 'jrChitoseLine'],
    ctaNote: 'Opens in English with only the Sapporo Subway Namboku, Tozai and Toho Lines and the JR Chitose Line shown. You can add or hide other lines from the list on the map.',
    related: [
      { href: '/en/lines/sapporo-subway-namboku-line', label: 'Sapporo Subway Namboku Line: all stations' },
      { href: '/en/lines/sapporo-subway-tozai-line', label: 'Sapporo Subway Tozai Line: all stations' },
      { href: '/en/lines/jr-chitose-line', label: 'JR Chitose Line: all stations' },
      { href: '/en/stations/odori', label: 'Odori Station: lines and transfers' },
      { href: '/en/stations/new-chitose-airport', label: 'New Chitose Airport Station' },
      { href: '/en/guides/tokyo-train-map', label: 'Tokyo Train Map for Tourists' },
      { href: '/guides/sapporo-train-map', label: '札幌の路線図をシンプルに見る（日本語）' },
      { href: '/zh/guides/sapporo-train-map', label: '札幌线路图简化查看方法（中文）' },
      { href: '/ko/guides/sapporo-train-map', label: '삿포로 노선도 심플하게 보기 (한국어)' },
    ],
    faq: [
      {
        question: 'Which subway lines can I change between at Odori?',
        answer: 'All three: the Namboku, Tozai and Toho Lines.',
      },
      {
        question: 'Is the subway Sapporo Station the same as JR Sapporo Station?',
        answer: 'They are separate stations, but they are connected and you can transfer between them.',
      },
    ],
    keywords: 'Sapporo subway map,Sapporo train map,Sapporo subway map English,New Chitose Airport to Sapporo train,Sapporo tram',
  },
  {
    slug: 'sapporo-train-map',
    city: 'hokkaido',
    lang: 'zh',
    breadcrumbLabel: '札幌线路图简化查看方法',
    title: '札幌地铁线路图怎么看（大通・薄野・新千岁机场）| Flex Railway Map',
    description: '札幌地铁有南北线、东西线、东丰线三条线路，三条线都可以在大通站换乘。包括前往新千岁机场和小樽的JR在内，用Flex Railway Map打开只显示必要线路的地图。',
    h1: '如何简化查看札幌线路图',
    searchIntentAnswer:
      '札幌地铁共有南北线、东西线、东丰线三条线路，三条线都可以在大通站换乘。先以大通为中心弄清三条线的走向，前往新千岁机场或小樽时再加上JR线路，整体就一目了然了。',
    sections: [
      {
        heading: '三条地铁线在大通交会',
        paragraphs: [
          '南北线连接麻生与真驹内，东西线连接宫之泽与新札幌，东丰线连接荣町与福住。南北线和东丰线还经过与JR札幌站相连的地铁"札幌（さっぽろ）"站（地铁站名写作平假名"さっぽろ"，JR站名写作汉字"札幌"）。',
        ],
        cta: { label: '打开只显示札幌三条地铁线的地图', routes: ['sapporoNambokuLine', 'sapporoTozaiLine', 'sapporoTohoLine'] },
      },
      {
        heading: '薄野与札幌市电',
        paragraphs: [
          '前往薄野，最近的是南北线的薄野站。东丰线附近的车站是另一个名字的"丰水薄野"站。札幌市电是一条环状的路面电车，也经过薄野电停。',
        ],
        cta: { label: '打开南北线・东丰线和札幌市电的地图', routes: ['sapporoNambokuLine', 'sapporoTohoLine', 'sapporoShiden'] },
      },
      {
        heading: '前往新千岁机场・小樽乘JR',
        paragraphs: [
          '新千岁空港站是JR千岁线的车站，与札幌站相连。前往小樽，从札幌站乘JR函馆本线。',
        ],
        cta: { label: '打开JR千岁线・函馆本线的地图', routes: ['jrChitoseLine', 'jrHakodateMainLine'] },
      },
    ],
    ctaLabel: '在Flex Railway Map中打开札幌地铁和JR千岁线',
    ctaRoutes: ['sapporoNambokuLine', 'sapporoTozaiLine', 'sapporoTohoLine', 'jrChitoseLine'],
    ctaNote: '地图会以中文界面打开，只显示札幌市营地铁南北线・东西线・东丰线和JR千岁线。其他线路可以随时从地图上的列表中添加或隐藏。',
    related: [
      { href: '/zh/lines/sapporo-subway-namboku-line', label: '札幌市营地铁南北线车站一览' },
      { href: '/zh/lines/sapporo-subway-tozai-line', label: '札幌市营地铁东西线车站一览' },
      { href: '/zh/lines/jr-chitose-line', label: 'JR千岁线车站一览' },
      { href: '/zh/stations/odori', label: '大通站的线路与换乘' },
      { href: '/zh/stations/new-chitose-airport', label: '新千岁空港站' },
      { href: '/zh/guides/tokyo-train-map', label: '东京地铁线路图简化查看方法' },
      { href: '/en/guides/sapporo-train-map', label: 'A Simple Sapporo Train Map（英语版）' },
      { href: '/guides/sapporo-train-map', label: '札幌の路線図をシンプルに見る（日语版）' },
      { href: '/ko/guides/sapporo-train-map', label: '삿포로 노선도 심플하게 보기（韩语版）' },
    ],
    faq: [
      {
        question: '在大通站可以换乘哪些地铁线？',
        answer: '南北线、东西线、东丰线三条线路都可以。',
      },
      {
        question: '地铁的札幌站和JR札幌站是同一个车站吗？',
        answer: '是两个不同的车站，但彼此相连，可以换乘。',
      },
    ],
    keywords: '札幌地铁线路图,札幌线路图,新千岁机场到札幌,札幌旅游交通,札幌市电',
  },
  {
    slug: 'sapporo-train-map',
    city: 'hokkaido',
    lang: 'ko',
    breadcrumbLabel: '삿포로 노선도 심플하게 보기',
    title: '삿포로 지하철 노선도 심플하게 보는 방법 (오도리・스스키노・신치토세 공항) | Flex Railway Map',
    description: '삿포로 지하철은 난보쿠선・도자이선・도호선 3개 노선이며, 세 노선 모두 오도리역에서 갈아탈 수 있습니다. 신치토세 공항・오타루로 가는 JR까지, 필요한 노선만 표시한 지도를 Flex Railway Map에서 열 수 있습니다.',
    h1: '삿포로 노선도 심플하게 보기',
    searchIntentAnswer:
      '삿포로 지하철은 난보쿠선(Namboku Line)・도자이선(Tozai Line)・도호선(Toho Line) 3개 노선이며, 세 노선 모두 Odori역에서 갈아탈 수 있습니다. 먼저 Odori역을 중심으로 세 노선의 방향을 파악하고, 신치토세 공항이나 오타루로 갈 때는 JR 노선을 더하면 전체를 이해하기 쉽습니다.',
    sections: [
      {
        heading: '지하철 3개 노선은 Odori역에서 만납니다',
        paragraphs: [
          '난보쿠선은 Asabu~Makomanai, 도자이선은 Miyanosawa~Shin-Sapporo, 도호선은 사카에초~Fukuzumi를 잇습니다. 난보쿠선과 도호선은 JR 삿포로역과 연결된 지하철 "さっぽろ"역도 지납니다(지하철 역 이름은 히라가나 "さっぽろ", JR은 한자 "札幌"입니다).',
        ],
        cta: { label: '삿포로 지하철 3개 노선만 표시한 지도 열기', routes: ['sapporoNambokuLine', 'sapporoTozaiLine', 'sapporoTohoLine'] },
      },
      {
        heading: '스스키노와 노면전차',
        paragraphs: [
          '스스키노는 난보쿠선의 Susukino역이 가장 가깝습니다. 도호선의 가까운 역은 Hosui-Susukino라는 다른 이름의 역입니다. 삿포로 시전(Sapporo Streetcar)은 Susukino 정류장 등을 지나는 순환형 노면전차입니다.',
        ],
        cta: { label: '난보쿠선・도호선과 삿포로 시전 지도 열기', routes: ['sapporoNambokuLine', 'sapporoTohoLine', 'sapporoShiden'] },
      },
      {
        heading: '신치토세 공항・오타루는 JR로',
        paragraphs: [
          'New Chitose Airport역은 JR 지토세선(JR Chitose Line)의 역으로, 삿포로역과 연결되어 있습니다. 오타루는 삿포로역에서 JR 하코다테 본선(JR Hakodate Main Line)으로 갑니다.',
        ],
        cta: { label: 'JR 지토세선・하코다테 본선 지도 열기', routes: ['jrChitoseLine', 'jrHakodateMainLine'] },
      },
    ],
    ctaLabel: '삿포로 지하철과 JR 지토세선을 Flex Railway Map에서 열기',
    ctaRoutes: ['sapporoNambokuLine', 'sapporoTozaiLine', 'sapporoTohoLine', 'jrChitoseLine'],
    ctaNote: '지도가 한국어 화면으로 열리며, 삿포로 시영 지하철 난보쿠선・도자이선・도호선과 JR 지토세선만 표시됩니다. 다른 노선은 지도 위 목록에서 언제든 추가・숨김할 수 있습니다.',
    related: [
      { href: '/ko/lines/sapporo-subway-namboku-line', label: '삿포로 지하철 난보쿠선 역 목록' },
      { href: '/ko/lines/sapporo-subway-tozai-line', label: '삿포로 지하철 도자이선 역 목록' },
      { href: '/ko/lines/jr-chitose-line', label: 'JR 지토세선 역 목록' },
      { href: '/ko/guides/tokyo-train-map', label: '도쿄 노선도 심플하게 보기 (여행자용)' },
      { href: '/en/guides/sapporo-train-map', label: 'A Simple Sapporo Train Map (English)' },
      { href: '/guides/sapporo-train-map', label: '札幌の路線図をシンプルに見る (일본어)' },
      { href: '/zh/guides/sapporo-train-map', label: '札幌线路图简化查看方法 (중국어)' },
    ],
    faq: [
      {
        question: 'Odori역에서 갈아탈 수 있는 지하철은?',
        answer: '난보쿠선・도자이선・도호선 3개 노선 모두입니다.',
      },
      {
        question: '지하철 삿포로역과 JR 삿포로역은 같은 역인가요?',
        answer: '서로 다른 역이지만 연결되어 있어 갈아탈 수 있습니다.',
      },
    ],
    keywords: '삿포로 노선도,삿포로 지하철 노선도,신치토세 공항 삿포로 전철,삿포로 여행 교통,삿포로 노면전차',
  },
];

/** ガイド一覧ページのパス（/guides, /en/guides, /zh/guides, /ko/guides） */
export function guideIndexPath(lang: GuideDefinition['lang']): string {
  return lang === 'ja' ? '/guides' : `/${lang}/guides`;
}

/** ガイドのパス */
export function guidePath(guide: Pick<GuideDefinition, 'lang' | 'slug'>): string {
  return `${guideIndexPath(guide.lang)}/${guide.slug}`;
}

/**
 * 同じ内容の各言語版（hreflang の相手）。
 * **同じ slug のガイドは互いの翻訳として扱う。** 翻訳ではない別内容のガイドを
 * 追加するときは、既存と違う slug にすること（同じ slug だと対訳として紐付く）。
 */
export function getGuideTranslations(guide: Pick<GuideDefinition, 'slug'>): GuideDefinition[] {
  return guides.filter(g => g.slug === guide.slug);
}

/** ガイドがある言語（一覧ページが存在する言語） */
export function guideLanguages(): GuideDefinition['lang'][] {
  return [...new Set(guides.map(g => g.lang))];
}

export function getGuide(lang: 'ja' | 'en' | 'zh' | 'ko', slug: string): GuideDefinition | undefined {
  return guides.find(g => g.lang === lang && g.slug === slug);
}

export function getGuidesByLang(lang: 'ja' | 'en' | 'zh' | 'ko'): GuideDefinition[] {
  return guides.filter(g => g.lang === lang);
}
