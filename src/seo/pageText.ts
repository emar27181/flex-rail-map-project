/**
 * 駅・路線・データのページの文言（日本語・英語）。
 *
 * 値（駅名・路線数・統計値など）は pageModel.ts から受け取り、ここでは
 * 文の形だけを持つ。言語を足すときはこのオブジェクトに1言語分を足し、
 * SEO_LANGS（pageModel.ts）に加える。
 */
import type { SeoLang } from './pageModel';

const fmt = (n: number, lang: SeoLang) => n.toLocaleString(lang === 'ja' ? 'ja-JP' : 'en-US');

/**
 * 駅統計の範囲・時期（stationStats.ts の STAT_PARAMS の radius / period）の英語。
 * 実データの指標の radius / period はすべてここに無いとテストが落ちる
 * （英語ページに日本語が混ざらないように）
 */
export const STAT_SCOPE_EN: Record<string, string> = {
  '駅出口から半径500m以内': 'within 500 m of station exits',
  '駅代表点から半径800m以内': 'within 800 m of the station center point',
  '2026年6月収集': 'collected June 2026',
  '2026年9月収集（首都圏277駅のみ）': 'collected September 2026 (277 Greater Tokyo stations only)',
  '令和5年（2023年）': '2023',
  '路線データ更新時点': 'as of the current line data',
};

/**
 * 出典名（stationStats.ts の PARAM_DATA_SOURCES の title）の英語。
 * 実データの指標の出典名はすべてここに無いとテストが落ちる
 */
export const SOURCE_TITLE_EN: Record<string, string> = {
  'OpenStreetMap / Overpass API': 'OpenStreetMap / Overpass API',
  'OpenStreetMap / Overpass API（maps.mail.ru ミラー）': 'OpenStreetMap / Overpass API (maps.mail.ru mirror)',
  'OpenStreetMap / Overpass API（首都圏駅周辺データセット）': 'OpenStreetMap / Overpass API (Greater Tokyo station dataset)',
  'OpenStreetMap（parkAreaM2から算出）': 'OpenStreetMap (derived from park area)',
  '警視庁 区市町村の町丁別認知件数 令和5年': 'Tokyo Metropolitan Police Department, reported crimes by town block, 2023',
};

export const SEO_TEXT = {
  ja: {
    home: 'Flex Railway Map',
    hubs: { stations: '駅', lines: '路線', data: '駅周辺データ' },
    otherLang: { label: 'English', lang: 'en' as SeoLang },
    openMap: '路線図で見る',

    stationsHubTitle: '駅の一覧（首都圏の主要路線）| Flex Railway Map',
    stationsHubH1: '駅の一覧',
    stationsHubLede: (n: number) => `首都圏の主要路線の${fmt(n, 'ja')}駅について、通る路線・隣の駅・周辺の統計をまとめています。`,
    majorStations: '主な駅',
    touristSpots: '観光地と最寄り駅',
    stationsByLine: '路線ごとの駅',

    stationTitle: (name: string, lines: number) =>
      `${name}駅の路線・乗り換え（${lines}路線）と周辺データ | Flex Railway Map`,
    stationDescription: (name: string, lineNames: string[], stats: number) =>
      `${name}駅を通る${lineNames.slice(0, 4).join('・')}${lineNames.length > 4 ? 'など' : ''}の路線、隣の駅、` +
      `周辺の飲食店数など${stats}項目の統計を出典付きでまとめています。`,
    stationH1: (name: string) => `${name}駅`,
    stationLede: (name: string, routes: number, effective: number) =>
      effective >= 2
        ? `${name}駅には${routes}系統の列車が発着し、同じ線路を走る系統をまとめると実質${effective}路線が乗り入れる乗換駅です。`
        : `${name}駅を通る路線は${routes}系統です（別の路線への乗り換えはありません）。`,
    linesAtStation: 'この駅を通る路線',
    adjacent: '隣の駅',
    prev: '前',
    next: '次',
    terminal: '（終点）',
    nearbySpots: '最寄りの観光地',
    nearbySpotLine: (spot: string) => `${spot}の最寄り駅の一つです。`,
    nearbyStations: '近くの主要駅',
    aroundStats: '駅周辺のデータ',
    statsNote: '値は公開データ・OpenStreetMap から集計した実測値です。推定値は載せていません。',
    colItem: '項目', colValue: '値', colScope: '範囲・時期',
    sources: '出典',
    retrievedAt: (d: string) => `（取得日 ${d}）`,
    paren: (x: string) => `（${x}）`,
    sourceTitle: (title: string) => title,
    relatedGuides: '関連ガイド',
    lineDetails: 'このガイドの路線の駅一覧',
    openMapFrom: (name: string) => `${name}駅を出発駅にして路線図を開く`,
    openMapRoutes: (name: string) => `${name}駅を通る路線を路線図で開く`,

    linesHubTitle: '路線の一覧（首都圏の主要路線）| Flex Railway Map',
    linesHubH1: '路線の一覧',
    linesHubLede: (n: number) => `首都圏の主要${n}路線の駅一覧・乗換駅・直通運転をまとめています。`,

    lineTitle: (name: string, n: number) => `${name}の駅一覧（${n}駅）・乗換駅・直通運転 | Flex Railway Map`,
    lineDescription: (name: string, n: number, from: string, to: string, transfers: number) =>
      `${name}（${from}〜${to}）の全${n}駅を順に一覧。乗り換えできる駅${transfers}駅と、直通運転している路線をまとめています。`,
    lineH1: (name: string) => `${name}の駅一覧`,
    lineLede: (name: string, n: number, from: string, to: string, transfers: number) =>
      `${name}は${from}から${to}までの${n}駅です。そのうち${transfers}駅で他の路線に乗り換えられます。`,
    stationList: '駅一覧',
    colNo: '順', colStation: '駅', colTransfers: '乗り換え',
    section: (from: string, to: string) => `${from}〜${to}`,
    listSep: '・',
    throughService: '直通運転',
    throughLine: (partners: string) => `${partners}と直通運転しています。`,
    noThrough: '路線データ上、直通運転の登録はありません。',
    openMapLine: (name: string) => `${name}だけを表示して路線図を開く`,

    dataHubTitle: '駅周辺データの一覧 | Flex Railway Map',
    dataHubH1: '駅周辺データ',
    dataHubLede: '駅ごとの周辺統計を、実データがある指標だけ一覧にしています。',
    excluded: '掲載していない指標',
    excludedEstimated: (label: string) => `${label}: 現在のデータが推定値のため掲載していません（実データが揃い次第追加します）。`,

    dataTitle: (label: string) => `駅周辺の${label}ランキング（首都圏の主要駅）| Flex Railway Map`,
    dataDescription: (label: string, n: number, scope: string) =>
      `首都圏の主要路線${n}駅の${label}（${scope}）を多い順に並べ、路線ごとの中央値も比べています。出典付き。`,
    dataH1: (label: string) => `駅周辺の${label}`,
    dataLede: (label: string, n: number, top: string, topValue: string) =>
      `対象${n}駅のうち、${label}が最も多いのは${top}駅（${topValue}）です。`,
    ranking: '駅ごとの値',
    byLine: '路線ごとの比較',
    colRank: '順位', colLine: '路線', colMedian: '中央値', colMax: '最大の駅', colCount: '駅数',
    missing: (n: number) => `対象のうち${n}駅はデータがありません（0件として扱っていません）。`,
    scope: (radius?: string, period?: string) => [radius, period].filter(Boolean).join('・'),
  },
  en: {
    home: 'Flex Railway Map',
    hubs: { stations: 'Stations', lines: 'Lines', data: 'Station Area Data' },
    otherLang: { label: '日本語', lang: 'ja' as SeoLang },
    openMap: 'View on the map',

    stationsHubTitle: 'Stations on Major Tokyo-Area Lines | Flex Railway Map',
    stationsHubH1: 'Stations',
    stationsHubLede: (n: number) => `Lines, neighboring stations and area statistics for ${fmt(n, 'en')} stations on major lines in the Tokyo area.`,
    majorStations: 'Major stations',
    touristSpots: 'Sights and their nearest stations',
    stationsByLine: 'Stations by line',

    stationTitle: (name: string, lines: number) =>
      `${name} Station: ${lines} Lines, Transfers and Area Data | Flex Railway Map`,
    stationDescription: (name: string, lineNames: string[], stats: number) =>
      `Lines serving ${name} Station (${lineNames.slice(0, 3).join(', ')}${lineNames.length > 3 ? ' and more' : ''}), ` +
      `neighboring stations, and ${stats} area statistics such as restaurant counts, with sources.`,
    stationH1: (name: string) => `${name} Station`,
    stationLede: (name: string, routes: number, effective: number) =>
      effective >= 2
        ? `${routes} services stop at ${name} Station. Counting services on the same tracks once, it is a transfer station for ${effective} lines.`
        : `${routes === 1 ? '1 service stops' : `${routes} services stop`} at ${name} Station (no transfer to another line).`,
    linesAtStation: 'Lines at this station',
    adjacent: 'Neighboring stations',
    prev: 'Previous',
    next: 'Next',
    terminal: '(terminus)',
    nearbySpots: 'Nearby sights',
    nearbySpotLine: (spot: string) => `One of the nearest stations to ${spot}.`,
    nearbyStations: 'Major stations nearby',
    aroundStats: 'Around the station',
    statsNote: 'Values are counted from public data and OpenStreetMap. Estimated values are not shown.',
    colItem: 'Item', colValue: 'Value', colScope: 'Area / period',
    sources: 'Sources',
    retrievedAt: (d: string) => ` (retrieved ${d})`,
    paren: (x: string) => ` (${x})`,
    sourceTitle: (title: string) => SOURCE_TITLE_EN[title] ?? title,
    relatedGuides: 'Related guides',
    lineDetails: 'Stations of the lines in this guide',
    openMapFrom: (name: string) => `Open the map from ${name} Station`,
    openMapRoutes: (name: string) => `Open the lines of ${name} Station on the map`,

    linesHubTitle: 'Major Tokyo-Area Train Lines | Flex Railway Map',
    linesHubH1: 'Lines',
    linesHubLede: (n: number) => `Station lists, transfer stations and through services for ${n} major lines in the Tokyo area.`,

    lineTitle: (name: string, n: number) => `${name}: All ${n} Stations, Transfers and Through Services | Flex Railway Map`,
    lineDescription: (name: string, n: number, from: string, to: string, transfers: number) =>
      `All ${n} stations of the ${name} (${from} to ${to}) in order, ${transfers} transfer stations, and lines it runs through to.`,
    lineH1: (name: string) => `${name} Stations`,
    lineLede: (name: string, n: number, from: string, to: string, transfers: number) =>
      `The ${name} has ${n} stations from ${from} to ${to}. You can transfer to other lines at ${transfers} of them.`,
    stationList: 'Stations',
    colNo: 'No.', colStation: 'Station', colTransfers: 'Transfers',
    section: (from: string, to: string) => `${from} - ${to}`,
    listSep: ', ',
    throughService: 'Through services',
    throughLine: (partners: string) => `Through services run to the ${partners}.`,
    noThrough: 'No through services are registered in the line data.',
    openMapLine: (name: string) => `Open the map with only the ${name}`,

    dataHubTitle: 'Station Area Data | Flex Railway Map',
    dataHubH1: 'Station Area Data',
    dataHubLede: 'Statistics around stations, listed only for metrics backed by real data.',
    excluded: 'Metrics not published',
    excludedEstimated: (label: string) => `${label}: not published because the current values are estimates.`,

    dataTitle: (label: string) => `${label} Around Major Tokyo-Area Stations (Ranking) | Flex Railway Map`,
    dataDescription: (label: string, n: number, scope: string) =>
      `${label} (${scope}) for ${n} stations on major Tokyo-area lines, ranked, with medians by line and sources.`,
    dataH1: (label: string) => `${label} Around Stations`,
    dataLede: (label: string, n: number, top: string, topValue: string) =>
      `Of the ${n} stations covered, ${top} Station has the highest ${label.toLowerCase()} (${topValue}).`,
    ranking: 'Values by station',
    byLine: 'Comparison by line',
    colRank: 'Rank', colLine: 'Line', colMedian: 'Median', colMax: 'Highest station', colCount: 'Stations',
    missing: (n: number) => `${n} of the stations covered have no data (not counted as zero).`,
    scope: (radius?: string, period?: string) =>
      [radius, period].filter((x): x is string => !!x).map(x => STAT_SCOPE_EN[x] ?? x).join(', '),
  },
} satisfies Record<SeoLang, unknown>;

export const formatNumber = fmt;
