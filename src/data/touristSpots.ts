/*
 * 【必読】編集する前に docs/seo.md の「観光地と最寄り駅」を読むこと（確認は npm run test:unit）。
 */
/**
 * 観光地 → 最寄り駅の対応（駅ページ・観光地の内部リンクに使う）。
 *
 * - 駅は「駅名＋その駅がある路線キー」で指定する。駅名だけだと
 *   長谷（江ノ電）と長谷（JR播但線）のような同名の別駅を取り違えるため
 * - 載せるのは「その観光地の最寄り駅として一般に案内されている駅」だけ。
 *   徒歩分数・距離などは確かめた出典が無いので書かない
 * - 駅名・路線キーが路線データに無いとテストが落ちる
 *   （tests/unit/seo/pageModel.test.ts）
 */
import type { RouteKey } from './routes';
import type { SeoCityId } from './seoPages';

export interface TouristSpotStation {
  /** 路線データ上の駅名（表記を一字一句合わせる） */
  name: string;
  /** その駅がある路線（同名の別駅と区別するため） */
  route: RouteKey;
}

export interface TouristSpot {
  /** URLや識別に使う英小文字の名前 */
  id: string;
  /** 一覧で観光地をまとめる都市（src/data/seoPages.ts の SEO_CITIES） */
  city: SeoCityId;
  /**
   * 観光地の名前。zh（簡体字）・ko は、定着した表記（観光案内で広く使われている名前）が
   * 分かるものだけ書き、自信が無いものは空ける（空なら英語名を出す。推測で訳さない）
   */
  name: { ja: string; en: string; zh?: string; ko?: string };
  stations: TouristSpotStation[];
}

export const TOURIST_SPOTS: TouristSpot[] = [
  // ── 東京・首都圏 ──
  {
    id: 'sensoji',
    city: 'tokyo',
    name: { ja: '浅草寺', en: 'Senso-ji Temple', zh: '浅草寺', ko: '센소지' },
    stations: [{ name: '浅草', route: 'ginzaLine' }],
  },
  {
    id: 'tokyo-skytree',
    city: 'tokyo',
    name: { ja: '東京スカイツリー', en: 'Tokyo Skytree', zh: '东京晴空塔', ko: '도쿄 스카이트리' },
    stations: [
      { name: 'とうきょうスカイツリー', route: 'tobuIsesakiLine' },
      { name: '押上', route: 'hanzomonLine' },
    ],
  },
  {
    id: 'tokyo-tower',
    city: 'tokyo',
    name: { ja: '東京タワー', en: 'Tokyo Tower', zh: '东京塔', ko: '도쿄 타워' },
    stations: [
      { name: '赤羽橋', route: 'toeiOedoLine' },
      { name: '神谷町', route: 'hibiyaLine' },
    ],
  },
  {
    id: 'meiji-jingu',
    city: 'tokyo',
    name: { ja: '明治神宮', en: 'Meiji Jingu Shrine', zh: '明治神宫', ko: '메이지 신궁' },
    stations: [
      { name: '原宿', route: 'yamanote' },
      { name: '明治神宮前', route: 'chiyodaLine' },
    ],
  },
  {
    id: 'shibuya-crossing',
    city: 'tokyo',
    name: { ja: '渋谷スクランブル交差点', en: 'Shibuya Scramble Crossing', zh: '涩谷十字路口', ko: '시부야 스크램블 교차로' },
    stations: [{ name: '渋谷', route: 'yamanote' }],
  },
  {
    id: 'ueno-park',
    city: 'tokyo',
    name: { ja: '上野恩賜公園', en: 'Ueno Park', zh: '上野恩赐公园', ko: '우에노 공원' },
    stations: [{ name: '上野', route: 'yamanote' }],
  },
  {
    id: 'akihabara',
    city: 'tokyo',
    name: { ja: '秋葉原電気街', en: 'Akihabara Electric Town', zh: '秋叶原电器街', ko: '아키하바라 전자상가' },
    stations: [{ name: '秋葉原', route: 'yamanote' }],
  },
  {
    id: 'tsukiji-outer-market',
    city: 'tokyo',
    name: { ja: '築地場外市場', en: 'Tsukiji Outer Market', zh: '筑地场外市场', ko: '쓰키지 장외시장' },
    stations: [
      { name: '築地', route: 'hibiyaLine' },
      { name: '築地市場', route: 'toeiOedoLine' },
    ],
  },
  {
    id: 'odaiba',
    city: 'tokyo',
    name: { ja: 'お台場', en: 'Odaiba', zh: '台场', ko: '오다이바' },
    stations: [
      { name: 'お台場海浜公園', route: 'yurikamomeLine' },
      { name: '台場', route: 'yurikamomeLine' },
      { name: '東京テレポート', route: 'rinkaiLine' },
    ],
  },
  {
    id: 'imperial-palace',
    city: 'tokyo',
    name: { ja: '皇居外苑', en: 'Kokyo Gaien National Garden (Imperial Palace)', zh: '皇居外苑' },
    stations: [{ name: '二重橋前', route: 'chiyodaLine' }],
  },
  {
    id: 'haneda-airport',
    city: 'tokyo',
    name: { ja: '羽田空港', en: 'Haneda Airport', zh: '羽田机场', ko: '하네다 공항' },
    stations: [
      { name: '羽田空港第3ターミナル', route: 'keikyuAirportLine' },
      { name: '羽田空港第1・第2ターミナル', route: 'keikyuAirportLine' },
    ],
  },
  {
    id: 'narita-airport',
    city: 'tokyo',
    name: { ja: '成田空港', en: 'Narita Airport', zh: '成田机场', ko: '나리타 공항' },
    stations: [{ name: '成田空港', route: 'keiseiMainLine' }],
  },
  {
    id: 'tokyo-disney-resort',
    city: 'tokyo',
    name: { ja: '東京ディズニーリゾート', en: 'Tokyo Disney Resort', zh: '东京迪士尼度假区', ko: '도쿄 디즈니 리조트' },
    stations: [{ name: '舞浜', route: 'jrKeiyo' }],
  },
  // ── 横浜・鎌倉・箱根 ──
  {
    id: 'yokohama-chinatown',
    city: 'kanagawa',
    name: { ja: '横浜中華街', en: 'Yokohama Chinatown', zh: '横滨中华街' },
    stations: [{ name: '元町・中華街', route: 'minatomirai' }],
  },
  {
    id: 'minato-mirai',
    city: 'kanagawa',
    name: { ja: 'みなとみらい21', en: 'Minato Mirai 21', zh: '港未来21', ko: '미나토미라이 21' },
    stations: [
      { name: 'みなとみらい', route: 'minatomirai' },
      { name: '桜木町', route: 'keihinTohoku' },
    ],
  },
  {
    id: 'tsurugaoka-hachimangu',
    city: 'kanagawa',
    name: { ja: '鶴岡八幡宮', en: 'Tsurugaoka Hachimangu Shrine', zh: '鹤冈八幡宫', ko: '쓰루가오카 하치만구' },
    stations: [{ name: '鎌倉', route: 'yokosukaLine' }],
  },
  {
    id: 'kamakura-daibutsu',
    city: 'kanagawa',
    name: { ja: '鎌倉大仏（高徳院）', en: 'Great Buddha of Kamakura (Kotoku-in)', zh: '镰仓大佛（高德院）', ko: '가마쿠라 대불(고토쿠인)' },
    stations: [{ name: '長谷', route: 'enoshimaElectricRailway' }],
  },
  {
    id: 'enoshima',
    city: 'kanagawa',
    name: { ja: '江の島', en: 'Enoshima Island', zh: '江之岛', ko: '에노시마' },
    stations: [
      { name: '片瀬江ノ島', route: 'odakyuEnoshimaLine' },
      { name: '江ノ島', route: 'enoshimaElectricRailway' },
      { name: '湘南江の島', route: 'shonanMonorail' },
    ],
  },
  {
    id: 'hakone-yumoto',
    city: 'kanagawa',
    name: { ja: '箱根湯本温泉', en: 'Hakone-Yumoto Onsen', zh: '箱根汤本温泉', ko: '하코네유모토 온천' },
    stations: [{ name: '箱根湯本', route: 'hakoneTozan' }],
  },
  // ── 大阪 ──
  {
    id: 'dotonbori',
    city: 'osaka',
    name: { ja: '道頓堀', en: 'Dotonbori', zh: '道顿堀', ko: '도톤보리' },
    stations: [{ name: 'なんば', route: 'midosujiLine' }],
  },
  {
    id: 'shinsaibashi',
    city: 'osaka',
    name: { ja: '心斎橋筋商店街', en: 'Shinsaibashi-suji Shopping Street', zh: '心斋桥筋商店街', ko: '신사이바시스지 상점가' },
    stations: [{ name: '心斎橋', route: 'midosujiLine' }],
  },
  {
    id: 'osaka-castle',
    city: 'osaka',
    name: { ja: '大阪城', en: 'Osaka Castle', zh: '大阪城', ko: '오사카성' },
    stations: [
      { name: '大阪城公園', route: 'osakaLoopLine' },
      { name: '森ノ宮', route: 'osakaLoopLine' },
      { name: '谷町四丁目', route: 'osakaTanimachi' },
    ],
  },
  {
    id: 'tsutenkaku',
    city: 'osaka',
    name: { ja: '通天閣', en: 'Tsutenkaku Tower', zh: '通天阁', ko: '쓰텐카쿠' },
    stations: [
      { name: '恵美須町', route: 'osakaSakaisuji' },
      { name: '動物園前', route: 'midosujiLine' },
    ],
  },
  {
    id: 'kansai-airport',
    city: 'osaka',
    name: { ja: '関西国際空港', en: 'Kansai International Airport', zh: '关西国际机场', ko: '간사이 국제공항' },
    stations: [{ name: '関西空港', route: 'nankaAirportLine' }],
  },
  // ── 京都 ──
  {
    id: 'fushimi-inari',
    city: 'kyoto',
    name: { ja: '伏見稲荷大社', en: 'Fushimi Inari Taisha', zh: '伏见稻荷大社', ko: '후시미 이나리 타이샤' },
    stations: [{ name: '稲荷', route: 'jrNaraLine' }],
  },
  {
    id: 'kiyomizu-dera',
    city: 'kyoto',
    name: { ja: '清水寺', en: 'Kiyomizu-dera Temple', zh: '清水寺', ko: '기요미즈데라' },
    stations: [{ name: '清水五条', route: 'keihanMainLine' }],
  },
  {
    id: 'yasaka-shrine',
    city: 'kyoto',
    name: { ja: '八坂神社', en: 'Yasaka Shrine', zh: '八坂神社', ko: '야사카 신사' },
    stations: [{ name: '祇園四条', route: 'keihanMainLine' }],
  },
  {
    id: 'arashiyama',
    city: 'kyoto',
    name: { ja: '嵐山', en: 'Arashiyama', zh: '岚山', ko: '아라시야마' },
    stations: [
      { name: '嵐山', route: 'keifukuArashiyama' },
      { name: '嵐山', route: 'hankyuArashiyamaLine' },
      { name: '嵯峨嵐山', route: 'jrSaninMainLine' },
    ],
  },
  {
    id: 'nijo-castle',
    city: 'kyoto',
    name: { ja: '二条城', en: 'Nijo Castle', zh: '二条城', ko: '니조성' },
    stations: [{ name: '二条城前', route: 'kyotoSubwayTozai' }],
  },
  {
    id: 'tofukuji',
    city: 'kyoto',
    name: { ja: '東福寺', en: 'Tofuku-ji Temple', zh: '东福寺', ko: '도후쿠지' },
    stations: [{ name: '東福寺', route: 'keihanMainLine' }],
  },
  // ── 奈良 ──
  {
    id: 'nara-park',
    city: 'nara',
    name: { ja: '奈良公園', en: 'Nara Park', zh: '奈良公园', ko: '나라 공원' },
    stations: [{ name: '近鉄奈良', route: 'kintetsuNaraLine' }],
  },
  // ── 札幌・北海道 ──
  {
    id: 'odori-park',
    city: 'hokkaido',
    name: { ja: '大通公園', en: 'Odori Park', zh: '大通公园', ko: '오도리 공원' },
    stations: [{ name: '大通', route: 'sapporoNambokuLine' }],
  },
  {
    id: 'susukino',
    city: 'hokkaido',
    name: { ja: 'すすきの', en: 'Susukino', ko: '스스키노' },
    stations: [{ name: 'すすきの', route: 'sapporoNambokuLine' }],
  },
  {
    id: 'new-chitose-airport',
    city: 'hokkaido',
    name: { ja: '新千歳空港', en: 'New Chitose Airport', zh: '新千岁机场', ko: '신치토세 공항' },
    stations: [{ name: '新千歳空港', route: 'jrChitoseLine' }],
  },
  {
    id: 'otaru-canal',
    city: 'hokkaido',
    name: { ja: '小樽運河', en: 'Otaru Canal', zh: '小樽运河', ko: '오타루 운하' },
    stations: [{ name: '小樽', route: 'jrHakodateMainLine' }],
  },
  // ── 福岡 ──
  {
    id: 'dazaifu-tenmangu',
    city: 'fukuoka',
    name: { ja: '太宰府天満宮', en: 'Dazaifu Tenmangu Shrine', zh: '太宰府天满宫', ko: '다자이후 텐만구' },
    stations: [{ name: '太宰府', route: 'nishitetsuDazaifuLine' }],
  },
  {
    id: 'fukuoka-airport',
    city: 'fukuoka',
    name: { ja: '福岡空港', en: 'Fukuoka Airport', zh: '福冈机场', ko: '후쿠오카 공항' },
    stations: [{ name: '福岡空港', route: 'fukuokaAirportLine' }],
  },
  // ── 広島 ──
  {
    id: 'atomic-bomb-dome',
    city: 'hiroshima',
    name: { ja: '原爆ドーム', en: 'Atomic Bomb Dome', zh: '原爆圆顶', ko: '원폭 돔' },
    stations: [{ name: '原爆ドーム前', route: 'hiroshimaTram' }],
  },
];
