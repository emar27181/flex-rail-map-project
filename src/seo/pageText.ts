/**
 * 駅・路線・データのページの文言（日本語・英語・中国語〈簡体字〉・韓国語）。
 *
 * 値（駅名・路線数・統計値など）は pageModel.ts から受け取り、ここでは
 * 文の形だけを持つ。言語を足すときはこのオブジェクトに1言語分を足し、
 * SEO_LANGS（pageModel.ts）に加える。
 *
 * 固有名詞（駅名・路線名・観光地名）はここで訳さない。駅名は translation.ts /
 * stationTranslationsCJK.ts、観光地名は touristSpots.ts にある表記だけを使う。
 */
import type { SeoLang } from './pageModel';
import type { TouristSpot } from '../data/touristSpots';
import { translateStatParamLabel, translateStatUnit, type Language } from '../utils/translation';
import { SITE_NAME } from '../config/seo';

const LOCALE: Record<SeoLang, string> = { ja: 'ja-JP', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR' };
const fmt = (n: number, lang: SeoLang) => n.toLocaleString(LOCALE[lang]);

/** 言語の切り替えリンクに出す名前（その言語自身での表記） */
export const LANG_LABEL: Record<SeoLang, string> = { ja: '日本語', en: 'English', zh: '简体中文', ko: '한국어' };

/** 地図アプリの翻訳関数（translation.ts）の言語名 */
export const APP_LANGUAGE: Record<SeoLang, Language> = { ja: 'japanese', en: 'english', zh: 'chinese', ko: 'korean' };

/** 駅統計の項目名・単位（translation.ts の対訳を使う） */
export const statLabel = (label: string, lang: SeoLang) => translateStatParamLabel(label, APP_LANGUAGE[lang]);
export const statValue = (n: number, unit: string, lang: SeoLang) => {
  const u = translateStatUnit(unit, APP_LANGUAGE[lang]);
  return `${fmt(n, lang)}${lang === 'en' && u ? ' ' : ''}${u}`;
};

/**
 * 駅統計の範囲・時期（stationStats.ts の STAT_PARAMS の radius / period）の英語。
 * 実データの指標の radius / period はすべてここに無いとテストが落ちる
 * （英語ページに日本語が混ざらないように）
 */
export const STAT_SCOPE_EN: Record<string, string> = {
  '駅出口から半径500m以内': 'within 500 m of station exits',
  '駅代表点から半径800m以内': 'within 800 m of the station center point',
  '2026年6月収集': 'collected June 2026',
  '2026年9月収集（首都圏10駅のみ）': 'collected September 2026 (10 stations only)',
  '令和5年（2023年）': '2023',
  '路線データ更新時点': 'as of the current line data',
};

/** 駅統計の範囲・時期の中国語（簡体字）。実データの指標の分はすべて必要（テストで確かめる） */
export const STAT_SCOPE_ZH: Record<string, string> = {
  '駅出口から半径500m以内': '车站出口半径500米以内',
  '駅代表点から半径800m以内': '车站代表点半径800米以内',
  '2026年6月収集': '2026年6月收集',
  '2026年9月収集（首都圏10駅のみ）': '2026年9月收集（仅东京都市圈10个车站）',
  '令和5年（2023年）': '2023年',
  '路線データ更新時点': '截至线路数据更新时',
};

/** 駅統計の範囲・時期の韓国語。実データの指標の分はすべて必要（テストで確かめる） */
export const STAT_SCOPE_KO: Record<string, string> = {
  '駅出口から半径500m以内': '역 출구 반경 500m 이내',
  '駅代表点から半径800m以内': '역 대표 지점 반경 800m 이내',
  '2026年6月収集': '2026년 6월 수집',
  '2026年9月収集（首都圏10駅のみ）': '2026년 9월 수집(수도권 10개 역만)',
  '令和5年（2023年）': '2023년',
  '路線データ更新時点': '노선 데이터 갱신 시점',
};

/**
 * 出典名（stationStats.ts の PARAM_DATA_SOURCES の title）の英語。
 * 実データの指標の出典名はすべてここに無いとテストが落ちる
 */
export const SOURCE_TITLE_EN: Record<string, string> = {
  'OpenStreetMap / Overpass API': 'OpenStreetMap / Overpass API',
  'OpenStreetMap / Overpass API（maps.mail.ru ミラー）': 'OpenStreetMap / Overpass API (maps.mail.ru mirror)',
  'OpenStreetMap / Overpass API（首都圏駅周辺データセットPoC）': 'OpenStreetMap / Overpass API (Tokyo-area station dataset PoC)',
  'OpenStreetMap（parkAreaM2から算出）': 'OpenStreetMap (derived from park area)',
  '警視庁 区市町村の町丁別認知件数 令和5年': 'Tokyo Metropolitan Police Department, reported crimes by town block, 2023',
};

export const SEO_TEXT = {
  ja: {
    home: SITE_NAME,
    hubs: { stations: '駅', lines: '路線', data: '駅周辺データ' },
    openMap: '路線図で見る',

    stationsHubTitle: `駅の一覧（東京・横浜・大阪・京都・札幌などの主要路線）| ${SITE_NAME}`,
    stationsHubH1: '駅の一覧',
    stationsHubLede: (n: number) => `東京・横浜・大阪・京都・札幌などの主要路線の${fmt(n, 'ja')}駅について、通る路線・隣の駅・観光地の最寄り駅をまとめています。`,
    cities: '都市',
    spotName: (spot: TouristSpot) => spot.name.ja,
    majorStations: '主な駅',
    touristSpots: '観光地と最寄り駅',
    stationsByLine: '路線ごとの駅',

    stationTitle: (name: string, lines: number, stats: number, spots: string[]) =>
      `${name}駅${spots.length > 0 ? `（${spots[0]}の最寄り駅）` : ''}の` +
      `${lines >= 2 ? `路線・乗り換え（${lines}路線）` : '路線と隣の駅'}` +
      `${stats > 0 && spots.length === 0 ? 'と周辺データ' : ''} | ${SITE_NAME}`,
    stationDescription: (name: string, lineNames: string[], stats: number, spots: string[]) =>
      `${name}駅を通る${lineNames.slice(0, 4).join('・')}${lineNames.length > 4 ? 'など' : ''}の路線、隣の駅` +
      `${spots.length > 0 ? `、最寄りの観光地（${spots.join('・')}）` : ''}` +
      `${stats > 0 ? `、周辺の飲食店数など${stats}項目の統計（出典付き）` : ''}をまとめています。`,
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
    openMapSpot: (spot: string, station: string) => `${spot}の最寄り駅（${station}駅）を出発駅にして路線図を開く`,

    linesHubTitle: `路線の一覧（東京・大阪・京都・札幌などの主要路線）| ${SITE_NAME}`,
    linesHubH1: '路線の一覧',
    linesHubLede: (n: number) => `東京・横浜・大阪・京都・札幌などの主要${n}路線の駅一覧・乗換駅・直通運転を、都市ごとにまとめています。`,

    lineTitle: (name: string, n: number) => `${name}の駅一覧（${n}駅）・乗換駅・直通運転 | ${SITE_NAME}`,
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

    openMapData: (label: string) => `${label}のヒートマップで路線図を開く`,
    dataHubTitle: `駅周辺データの一覧 | ${SITE_NAME}`,
    dataHubH1: '駅周辺データ',
    dataHubLede: '駅ごとの周辺統計を、実データがある指標だけ一覧にしています。',
    excluded: '掲載していない指標',
    excludedEstimated: (label: string) => `${label}: 現在のデータが推定値のため掲載していません（実データが揃い次第追加します）。`,

    dataTitle: (label: string) => `駅周辺の${label}ランキング（首都圏の主要駅）| ${SITE_NAME}`,
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
    home: SITE_NAME,
    hubs: { stations: 'Stations', lines: 'Lines', data: 'Station Area Data' },
    openMap: 'View on the map',

    stationsHubTitle: `Stations in Tokyo, Yokohama, Osaka, Kyoto, Sapporo and More | ${SITE_NAME}`,
    stationsHubH1: 'Stations',
    stationsHubLede: (n: number) => `Lines, neighboring stations and nearby sights for ${fmt(n, 'en')} stations on major lines in Tokyo, Yokohama, Osaka, Kyoto, Sapporo and other cities.`,
    cities: 'Cities',
    spotName: (spot: TouristSpot) => spot.name.en,
    majorStations: 'Major stations',
    touristSpots: 'Sights and their nearest stations',
    stationsByLine: 'Stations by line',

    stationTitle: (name: string, lines: number, stats: number, spots: string[]) =>
      `${name} Station${spots.length > 0 ? ` (for ${spots[0]})` : ''}: ` +
      `${lines >= 2 ? `${lines} Lines and Transfers` : 'Lines and Neighboring Stations'}` +
      `${stats > 0 && spots.length === 0 ? ' and Area Data' : ''} | ${SITE_NAME}`,
    stationDescription: (name: string, lineNames: string[], stats: number, spots: string[]) =>
      `Lines serving ${name} Station (${lineNames.slice(0, 3).join(', ')}${lineNames.length > 3 ? ' and more' : ''}), ` +
      `neighboring stations${spots.length > 0 ? `, nearby sights (${spots.join(', ')})` : ''}` +
      `${stats > 0 ? `, and ${stats} area statistics such as restaurant counts, with sources` : ''}.`,
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
    openMapSpot: (spot: string, station: string) => `Open the map from ${station} Station, nearest to ${spot}`,

    linesHubTitle: `Train Lines in Tokyo, Osaka, Kyoto, Sapporo and More | ${SITE_NAME}`,
    linesHubH1: 'Lines',
    linesHubLede: (n: number) => `Station lists, transfer stations and through services for ${n} major lines in Tokyo, Yokohama, Osaka, Kyoto, Sapporo and other cities, grouped by city.`,

    lineTitle: (name: string, n: number) => `${name}: All ${n} Stations, Transfers and Through Services | ${SITE_NAME}`,
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

    openMapData: (label: string) => `Open the map with a ${label.toLowerCase()} heatmap`,
    dataHubTitle: `Station Area Data | ${SITE_NAME}`,
    dataHubH1: 'Station Area Data',
    dataHubLede: 'Statistics around stations, listed only for metrics backed by real data.',
    excluded: 'Metrics not published',
    excludedEstimated: (label: string) => `${label}: not published because the current values are estimates.`,

    dataTitle: (label: string) => `${label} Around Major Tokyo-Area Stations (Ranking) | ${SITE_NAME}`,
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
  zh: {
    home: SITE_NAME,
    hubs: { stations: '车站', lines: '线路', data: '车站周边数据' },
    openMap: '在线路图中查看',

    stationsHubTitle: `车站一览（东京・横滨・大阪・京都・札幌等主要线路）| ${SITE_NAME}`,
    stationsHubH1: '车站一览',
    stationsHubLede: (n: number) => `整理了东京、横滨、大阪、京都、札幌等城市主要线路上${fmt(n, 'zh')}个车站的途经线路、相邻车站和附近景点。`,
    cities: '城市',
    spotName: (spot: TouristSpot) => spot.name.zh ?? spot.name.en,
    majorStations: '主要车站',
    touristSpots: '景点与最近车站',
    stationsByLine: '按线路查看车站',

    stationTitle: (name: string, lines: number, stats: number, spots: string[]) =>
      `${name}站${spots.length > 0 ? `（${spots[0]}最近车站）` : ''}：` +
      `${lines >= 2 ? `${lines}条线路与换乘` : '线路与相邻车站'}` +
      `${stats > 0 && spots.length === 0 ? '及周边数据' : ''} | ${SITE_NAME}`,
    stationDescription: (name: string, lineNames: string[], stats: number, spots: string[]) =>
      `汇总经过${name}站的线路（${lineNames.slice(0, 3).join('、')}${lineNames.length > 3 ? '等' : ''}）、相邻车站` +
      `${spots.length > 0 ? `、附近景点（${spots.join('、')}）` : ''}` +
      `${stats > 0 ? `，以及餐饮店数量等${stats}项周边统计（附出处）` : ''}。`,
    stationH1: (name: string) => `${name}站`,
    stationLede: (name: string, routes: number, effective: number) =>
      effective >= 2
        ? `${name}站有${routes}个运行系统停靠，将同一轨道上的系统合并计算，实际上是${effective}条线路的换乘站。`
        : `经过${name}站的运行系统有${routes}个（无法换乘其他线路）。`,
    linesAtStation: '经过本站的线路',
    adjacent: '相邻车站',
    prev: '上一站',
    next: '下一站',
    terminal: '（终点）',
    nearbySpots: '附近景点',
    nearbySpotLine: (spot: string) => `本站是${spot}的最近车站之一。`,
    nearbyStations: '附近的主要车站',
    aroundStats: '车站周边数据',
    statsNote: '数值根据公开数据和 OpenStreetMap 统计得出，不含估算值。',
    colItem: '项目', colValue: '数值', colScope: '范围・时期',
    sources: '出处',
    retrievedAt: (d: string) => `（获取日期 ${d}）`,
    paren: (x: string) => `（${x}）`,
    sourceTitle: (title: string) => SOURCE_TITLE_EN[title] ?? title,
    relatedGuides: '相关指南',
    lineDetails: '本指南涉及线路的车站一览',
    openMapFrom: (name: string) => `以${name}站为出发站打开线路图`,
    openMapRoutes: (name: string) => `在线路图中显示经过${name}站的线路`,
    openMapSpot: (spot: string, station: string) => `以${spot}的最近车站（${station}站）为出发站打开线路图`,

    linesHubTitle: `线路一览（东京・大阪・京都・札幌等主要线路）| ${SITE_NAME}`,
    linesHubH1: '线路一览',
    linesHubLede: (n: number) => `按城市整理东京、横滨、大阪、京都、札幌等地${n}条主要线路的车站一览、换乘站和直通运行。`,

    lineTitle: (name: string, n: number) => `${name}全${n}站一览・换乘站・直通运行 | ${SITE_NAME}`,
    lineDescription: (name: string, n: number, from: string, to: string, transfers: number) =>
      `按顺序列出${name}（${from}～${to}）的全部${n}个车站，以及${transfers}个换乘站和直通运行的线路。`,
    lineH1: (name: string) => `${name}车站一览`,
    lineLede: (name: string, n: number, from: string, to: string, transfers: number) =>
      `${name}从${from}到${to}共有${n}个车站，其中${transfers}个车站可以换乘其他线路。`,
    stationList: '车站一览',
    colNo: '序号', colStation: '车站', colTransfers: '换乘',
    section: (from: string, to: string) => `${from}～${to}`,
    listSep: '、',
    throughService: '直通运行',
    throughLine: (partners: string) => `与${partners}直通运行。`,
    noThrough: '线路数据中没有登记直通运行。',
    openMapLine: (name: string) => `只显示${name}并打开线路图`,

    openMapData: (label: string) => `以${label}热力图打开线路图`,
    dataHubTitle: `车站周边数据一览 | ${SITE_NAME}`,
    dataHubH1: '车站周边数据',
    dataHubLede: '只列出有实测数据的车站周边统计指标。',
    excluded: '未刊载的指标',
    excludedEstimated: (label: string) => `${label}：目前的数据是估算值，因此不予刊载。`,

    dataTitle: (label: string) => `车站周边${label}排名（东京都市圈主要车站）| ${SITE_NAME}`,
    dataDescription: (label: string, n: number, scope: string) =>
      `按数量排列东京都市圈主要线路${n}个车站的${label}（${scope}），并比较各线路的中位数。附出处。`,
    dataH1: (label: string) => `车站周边的${label}`,
    dataLede: (label: string, n: number, top: string, topValue: string) =>
      `在${n}个对象车站中，${label}最多的是${top}站（${topValue}）。`,
    ranking: '各车站数值',
    byLine: '按线路比较',
    colRank: '排名', colLine: '线路', colMedian: '中位数', colMax: '最高车站', colCount: '车站数',
    missing: (n: number) => `对象车站中有${n}个车站没有数据（未按0计算）。`,
    scope: (radius?: string, period?: string) =>
      [radius, period].filter((x): x is string => !!x).map(x => STAT_SCOPE_ZH[x] ?? x).join('・'),
  },
  ko: {
    home: SITE_NAME,
    hubs: { stations: '역', lines: '노선', data: '역 주변 데이터' },
    openMap: '노선도에서 보기',

    stationsHubTitle: `역 목록 (도쿄・요코하마・오사카・교토・삿포로 등 주요 노선) | ${SITE_NAME}`,
    stationsHubH1: '역 목록',
    stationsHubLede: (n: number) => `도쿄, 요코하마, 오사카, 교토, 삿포로 등 주요 노선의 역 ${fmt(n, 'ko')}곳에 대해 지나는 노선, 인접역, 주변 관광지를 정리했습니다.`,
    cities: '도시',
    spotName: (spot: TouristSpot) => spot.name.ko ?? spot.name.en,
    majorStations: '주요 역',
    touristSpots: '관광지와 가장 가까운 역',
    stationsByLine: '노선별 역',

    stationTitle: (name: string, lines: number, stats: number, spots: string[]) =>
      `${name}역${spots.length > 0 ? ` (${spots[0]} 최근접 역)` : ''}: ` +
      `${lines >= 2 ? `${lines}개 노선과 환승` : '노선과 인접역'}` +
      `${stats > 0 && spots.length === 0 ? ' 및 주변 데이터' : ''} | ${SITE_NAME}`,
    stationDescription: (name: string, lineNames: string[], stats: number, spots: string[]) =>
      `${name}역을 지나는 노선(${lineNames.slice(0, 3).join(', ')}${lineNames.length > 3 ? ' 등' : ''}), 인접역` +
      `${spots.length > 0 ? `, 주변 관광지(${spots.join(', ')})` : ''}` +
      `${stats > 0 ? `, 음식점 수 등 주변 통계 ${stats}개 항목(출처 포함)` : ''} 정보를 정리했습니다.`,
    stationH1: (name: string) => `${name}역`,
    stationLede: (name: string, routes: number, effective: number) =>
      effective >= 2
        ? `${name}역에는 ${routes}개 운행 계통이 정차하며, 같은 선로를 달리는 계통을 하나로 세면 실질적으로 ${effective}개 노선이 지나는 환승역입니다.`
        : `${name}역을 지나는 운행 계통은 ${routes}개입니다(다른 노선으로 환승할 수 없습니다).`,
    linesAtStation: '이 역을 지나는 노선',
    adjacent: '인접역',
    prev: '이전 역',
    next: '다음 역',
    terminal: '(종점)',
    nearbySpots: '주변 관광지',
    nearbySpotLine: (spot: string) => `${spot}에서 가장 가까운 역 중 하나입니다.`,
    nearbyStations: '근처의 주요 역',
    aroundStats: '역 주변 데이터',
    statsNote: '값은 공개 데이터와 OpenStreetMap에서 집계한 실측값입니다. 추정값은 싣지 않았습니다.',
    colItem: '항목', colValue: '값', colScope: '범위・시기',
    sources: '출처',
    retrievedAt: (d: string) => ` (취득일 ${d})`,
    paren: (x: string) => ` (${x})`,
    sourceTitle: (title: string) => SOURCE_TITLE_EN[title] ?? title,
    relatedGuides: '관련 가이드',
    lineDetails: '이 가이드에 나오는 노선의 역 목록',
    openMapFrom: (name: string) => `${name}역을 출발역으로 노선도 열기`,
    openMapRoutes: (name: string) => `${name}역을 지나는 노선을 노선도에서 열기`,
    openMapSpot: (spot: string, station: string) => `${spot}에서 가장 가까운 ${station}역을 출발역으로 노선도 열기`,

    linesHubTitle: `노선 목록 (도쿄・오사카・교토・삿포로 등 주요 노선) | ${SITE_NAME}`,
    linesHubH1: '노선 목록',
    linesHubLede: (n: number) => `도쿄, 요코하마, 오사카, 교토, 삿포로 등 주요 노선 ${n}개의 역 목록, 환승역, 직통 운행을 도시별로 정리했습니다.`,

    lineTitle: (name: string, n: number) => `${name} 전체 ${n}개 역・환승역・직통 운행 | ${SITE_NAME}`,
    lineDescription: (name: string, n: number, from: string, to: string, transfers: number) =>
      `${name}(${from}~${to})의 전체 ${n}개 역을 순서대로 정리하고, 환승할 수 있는 역 ${transfers}곳과 직통 운행 노선을 소개합니다.`,
    lineH1: (name: string) => `${name} 역 목록`,
    lineLede: (name: string, n: number, from: string, to: string, transfers: number) =>
      `${name}: ${from}부터 ${to}까지 ${n}개 역이 있으며, 그중 ${transfers}개 역에서 다른 노선으로 환승할 수 있습니다.`,
    stationList: '역 목록',
    colNo: '순서', colStation: '역', colTransfers: '환승',
    section: (from: string, to: string) => `${from}~${to}`,
    listSep: ', ',
    throughService: '직통 운행',
    throughLine: (partners: string) => `직통 운행 노선: ${partners}`,
    noThrough: '노선 데이터에 직통 운행이 등록되어 있지 않습니다.',
    openMapLine: (name: string) => `${name}만 표시해 노선도 열기`,

    openMapData: (label: string) => `${label} 히트맵으로 노선도 열기`,
    dataHubTitle: `역 주변 데이터 목록 | ${SITE_NAME}`,
    dataHubH1: '역 주변 데이터',
    dataHubLede: '실측 데이터가 있는 지표만 역 주변 통계를 정리했습니다.',
    excluded: '싣지 않은 지표',
    excludedEstimated: (label: string) => `${label}: 현재 데이터가 추정값이라 싣지 않았습니다.`,

    dataTitle: (label: string) => `역 주변 ${label} 순위 (도쿄 수도권 주요 역) | ${SITE_NAME}`,
    dataDescription: (label: string, n: number, scope: string) =>
      `도쿄 수도권 주요 노선 ${n}개 역의 ${label}(${scope}) 순위와 노선별 중앙값을 출처와 함께 정리했습니다.`,
    dataH1: (label: string) => `역 주변 ${label}`,
    dataLede: (label: string, n: number, top: string, topValue: string) =>
      `대상 ${n}개 역 중 ${label} 1위는 ${top}역(${topValue})입니다.`,
    ranking: '역별 값',
    byLine: '노선별 비교',
    colRank: '순위', colLine: '노선', colMedian: '중앙값', colMax: '가장 높은 역', colCount: '역 수',
    missing: (n: number) => `대상 중 ${n}개 역은 데이터가 없습니다(0으로 계산하지 않았습니다).`,
    scope: (radius?: string, period?: string) =>
      [radius, period].filter((x): x is string => !!x).map(x => STAT_SCOPE_KO[x] ?? x).join('・'),
  },
} satisfies Record<SeoLang, unknown>;

export const formatNumber = fmt;
