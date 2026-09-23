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

export interface GuideSection {
  heading: string;
  paragraphs: string[];
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
  lang: 'ja' | 'en' | 'zh';
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
      { href: '/zh/guides/tokyo-train-map', label: '东京地铁线路图简化查看方法（中文）' },
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
];

export function getGuide(lang: 'ja' | 'en' | 'zh', slug: string): GuideDefinition | undefined {
  return guides.find(g => g.lang === lang && g.slug === slug);
}

export function getGuidesByLang(lang: 'ja' | 'en' | 'zh'): GuideDefinition[] {
  return guides.filter(g => g.lang === lang);
}
