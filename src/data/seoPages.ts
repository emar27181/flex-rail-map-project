/*
 * 【必読】編集する前に docs/seo.md の「駅・路線・データのページ」を読むこと（確認は npm run build）。
 */
/**
 * 検索向けに自動生成するページ（/lines/*, /stations/*, /data/*）の範囲と、
 * index させるかどうかの基準。ページの中身はすべて路線データ・駅統計から
 * 自動で作る（src/seo/pageModel.ts）。ここに書くのは「どこまで作るか」だけ。
 *
 * - 路線を足せば、その路線の全駅の駅ページも自動でできる
 * - 情報量が基準に届かないページは作るが noindex にし、sitemap にも載せない
 *   （何千もの薄いページを検索エンジンに出さないため）
 * - 推定値（stationStats.ts の dataQuality: 'estimated'）の指標はページを作らない
 */
import type { RouteKey } from './routes';
import type { StationStats } from './stationStats';

/** 都市（地域）の名前。zh は簡体字、ko はハングル */
export interface SeoCityName {
  ja: string;
  en: string;
  zh: string;
  ko: string;
}

export type SeoCityId =
  | 'tokyo' | 'kanagawa' | 'osaka' | 'kyoto' | 'nara' | 'hokkaido' | 'nagoya' | 'fukuoka' | 'hiroshima';

/**
 * 路線ページを作る路線を、都市（地域）ごとに並べたもの。
 * - 駅・路線の一覧ページはこの順・このまとまりで並ぶ
 * - 路線を足すと、その路線の全駅の駅ページも自動でできる（index されるのは Tier A だけ）
 * - 同じ路線が路線データに2つのキーで登録されているもの（大阪環状線 osakaLoopLine /
 *   jrOsakaLoop、御堂筋線 midosujiLine / osakaMidosujiMain など）は、駅の多い方だけを書く
 */
export const SEO_CITIES: Array<{ id: SeoCityId; name: SeoCityName; lines: RouteKey[] }> = [
  {
    id: 'tokyo',
    name: { ja: '東京・首都圏', en: 'Tokyo area', zh: '东京及周边', ko: '도쿄・수도권' },
    lines: [
      'yamanote',
      'chuo',
      'keihinTohoku',
      'jrSobuLine',
      'jrSaikyoLine',
      'jrKeiyo',
      'ginzaLine',
      'marunouchiLine',
      'hibiyaLine',
      'tozaiLine',
      'chiyodaLine',
      'yurakuchoLine',
      'hanzomonLine',
      'nambokuLine',
      'fukutoshinLine',
      'toeiAsakusaLine',
      'toeiOedoLine',
      'tokyuToyokoLine',
      'odakyuLine',
      'keikyuLine',
      'keikyuAirportLine',
      'tokyoMonorail',
      'keiseiMainLine',
      'yurikamomeLine',
      'rinkaiLine',
    ],
  },
  {
    id: 'kanagawa',
    name: { ja: '横浜・鎌倉・箱根', en: 'Yokohama, Kamakura & Hakone', zh: '横滨・镰仓・箱根', ko: '요코하마・가마쿠라・하코네' },
    lines: [
      'yokosukaLine',
      'minatomirai',
      'yokohamaBlueLine',
      'enoshimaElectricRailway',
      'odakyuEnoshimaLine',
      'hakoneTozan',
    ],
  },
  {
    id: 'osaka',
    name: { ja: '大阪', en: 'Osaka', zh: '大阪', ko: '오사카' },
    lines: [
      'osakaLoopLine',
      'midosujiLine',
      'osakaTanimachi',
      'osakaYotsubashi',
      'osakaSakaisuji',
      'osakaChangbori',
      'nankaMainLine',
      'nankaAirportLine',
      'hanshinMainLine',
      'hankyuKobeLine',
    ],
  },
  {
    id: 'kyoto',
    name: { ja: '京都', en: 'Kyoto', zh: '京都', ko: '교토' },
    lines: [
      'jrKyotoLine',
      'keihanMainLine',
      'hankyuKyotoLine',
      'hankyuArashiyamaLine',
      'kyotoSubwayKarasuma',
      'kyotoSubwayTozai',
      'keifukuArashiyama',
      'jrNaraLine',
    ],
  },
  {
    id: 'nara',
    name: { ja: '奈良', en: 'Nara', zh: '奈良', ko: '나라' },
    lines: [
      'kintetsuNaraLine',
    ],
  },
  {
    id: 'hokkaido',
    name: { ja: '札幌・北海道', en: 'Sapporo & Hokkaido', zh: '札幌・北海道', ko: '삿포로・홋카이도' },
    lines: [
      'sapporoNambokuLine',
      'sapporoTozaiLine',
      'sapporoTohoLine',
      'sapporoShiden',
      'jrChitoseLine',
      'jrHakodateMainLine',
    ],
  },
  {
    id: 'nagoya',
    name: { ja: '名古屋', en: 'Nagoya', zh: '名古屋', ko: '나고야' },
    lines: [
      'nagoyaHigashiyamaLine',
      'nagoyaMeijoline',
      'nagoyaTsurumai',
      'nagoyaSakuradori',
    ],
  },
  {
    id: 'fukuoka',
    name: { ja: '福岡', en: 'Fukuoka', zh: '福冈', ko: '후쿠오카' },
    lines: [
      'fukuokaAirportLine',
      'fukuokaHakozakiLine',
      'fukuokaShichikumaLine',
      'nishitetsuTenjinOmutaLine',
      'nishitetsuDazaifuLine',
    ],
  },
  {
    id: 'hiroshima',
    name: { ja: '広島', en: 'Hiroshima', zh: '广岛', ko: '히로시마' },
    lines: [
      'hiroshimaTram',
    ],
  },
];

/**
 * 路線データに同じ路線が2つのキーで登録されているもの（データの重複）。
 * 駅ページの「この駅を通る路線」に同じ路線が2回並ばないよう、左のキーを右のキーにまとめる。
 * 路線データ側の重複を解消したら、ここから消す。
 */
export const SEO_ROUTE_ALIASES: Partial<Record<RouteKey, RouteKey>> = {
  jrOsakaLoop: 'osakaLoopLine',
  osakaMidosujiMain: 'midosujiLine',
  hakoneTozan2: 'hakoneTozan',
  kintetsuNaraLine2: 'kintetsuNaraLine',
  kintetsuOsakaLine2: 'kintetsuOsakaLine',
  nankaKoyaLine2: 'nankaKoyaLine',
  hankyuKobeLine2: 'hankyuKobeLine',
  shinkeisei2: 'shinkeisei',
};

/**
 * 駅ページの段階（Tier）の基準。
 * - A: 「観光地の最寄り駅」、または「大きな乗換駅（実質の路線数が minLines 以上）」で
 *      実データの周辺統計が minRealStats 項目以上ある駅 → index（sitemap に載る）
 *      周辺統計は首都圏でしか集めていないため、統計が1項目も無い駅（関西・札幌など、
 *      集めていない地域）は統計の条件を問わない。統計が一部だけの駅（取得に失敗した
 *      疑いがある駅）は乗換駅でも A にしない
 *      3路線だと首都圏だけで64駅になり、同じ型のページを一度に出しすぎるので、
 *      5路線以上（＋観光地の最寄り駅）に絞る
 * - B: 乗換駅、または周辺統計がある駅 → noindex, follow
 * - C: それ以外（駅名・路線・隣の駅しか書けない）→ noindex, follow
 */
export const STATION_TIER_RULES = {
  minLines: 5,
  minRealStats: 5,
};

/**
 * 駅周辺データ（stationStats）を集めている都市。データのページはこの都市の駅だけを対象にする
 * （集めていない地域の駅を「データなし」として数えない）
 */
export const SEO_DATA_CITIES: SeoCityId[] = ['tokyo', 'kanagawa'];

/** データのページ（/data/{slug}）。推定値の指標は自動で除外される */
export interface SeoDataMetric {
  slug: string;
  statKey: keyof StationStats;
}

export const SEO_DATA_METRICS: SeoDataMetric[] = [
  { slug: 'restaurant-count', statKey: 'restaurantCount' },
  // 乗降客数・家賃は現状すべて推定値のためページを作らない（実データに置き換えたら自動で作られる）
  { slug: 'passengers', statKey: 'dailyPassengers' },
  { slug: 'rent', statKey: 'avgRent1K' },
];

/** データのページを index させるのに必要な、値のある駅の数 */
export const MIN_STATIONS_FOR_DATA_PAGE = 20;
