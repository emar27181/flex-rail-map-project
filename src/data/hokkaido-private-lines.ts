import type { Station } from './yamanote';

// 函館市電（路面電車）: 湯の川〜函館駅前〜谷地頭
export const hakodateShiden: Station[] = [
  { name: "湯の川",    lat: 41.800300, lng: 140.798980, timeToNext: 2 },
  { name: "湯の川温泉",  lat: 41.797800, lng: 140.792120, timeToNext: 2 },
  { name: "新川町",    lat: 41.795700, lng: 140.783440, timeToNext: 2 },
  { name: "駒場車庫前",  lat: 41.793640, lng: 140.778540, timeToNext: 2 },
  { name: "杉並町",    lat: 41.791940, lng: 140.773730, timeToNext: 2 },
  { name: "柏木町",    lat: 41.788060, lng: 140.763770, timeToNext: 2 },
  { name: "千代台",    lat: 41.784480, lng: 140.753300, timeToNext: 2 },
  { name: "五稜郭公園前", lat: 41.780920, lng: 140.742750, timeToNext: 2 },
  { name: "深堀町",    lat: 41.775320, lng: 140.733160, timeToNext: 2 },
  { name: "本通",      lat: 41.773400, lng: 140.727290, timeToNext: 2 },
  { name: "昭和橋",    lat: 41.769800, lng: 140.721340, timeToNext: 2 },
  { name: "中央病院前",  lat: 41.770050, lng: 140.716800, timeToNext: 2 },
  { name: "函館アリーナ前", lat: 41.768350, lng: 140.713220, timeToNext: 2 },
  { name: "市民会館前",  lat: 41.762730, lng: 140.713560, timeToNext: 2 },
  { name: "函館駅前",   lat: 41.773880, lng: 140.727060, timeToNext: 2 },
  { name: "松風町",    lat: 41.767810, lng: 140.726680, timeToNext: 2 },
  { name: "十字街",    lat: 41.768850, lng: 140.720100, timeToNext: 2 },
  { name: "大町",      lat: 41.772270, lng: 140.716480, timeToNext: 2 },
  { name: "末広町",    lat: 41.775140, lng: 140.715890, timeToNext: 2 },
  { name: "豊川町",    lat: 41.780220, lng: 140.713310, timeToNext: 2 },
  { name: "谷地頭",    lat: 41.784440, lng: 140.712940, timeToNext: 0 },
];

// JR函館本線（小樽〜長万部）: 小樽〜長万部
export const jrHakodateMainLineSouth: Station[] = [
  { name: "小樽",      lat: 43.190690, lng: 141.002030, timeToNext: 8 },
  { name: "南小樽",    lat: 43.175820, lng: 140.999250, timeToNext: 5 },
  { name: "小樽築港",   lat: 43.176570, lng: 140.990230, timeToNext: 5 },
  { name: "朝里",      lat: 43.155700, lng: 141.001950, timeToNext: 5 },
  { name: "銭函",      lat: 43.111120, lng: 141.172690, timeToNext: 8 },
  { name: "星置",      lat: 43.082330, lng: 141.213740, timeToNext: 5 },
  { name: "ほしみ",    lat: 43.076890, lng: 141.226920, timeToNext: 5 },
  { name: "手稲",      lat: 43.106640, lng: 141.266170, timeToNext: 5 },
  { name: "稲積公園",   lat: 43.096280, lng: 141.295780, timeToNext: 5 },
  { name: "発寒",      lat: 43.105530, lng: 141.315790, timeToNext: 5 },
  { name: "発寒中央",   lat: 43.087930, lng: 141.316800, timeToNext: 5 },
  { name: "琴似",      lat: 43.067740, lng: 141.323340, timeToNext: 5 },
  { name: "桑園",      lat: 43.067390, lng: 141.336290, timeToNext: 4 },
  { name: "札幌",      lat: 43.068820, lng: 141.350640, timeToNext: 10 },
  { name: "倶知安",    lat: 42.900510, lng: 140.758230, timeToNext: 15 },
  { name: "黒松内",    lat: 42.671990, lng: 140.318960, timeToNext: 15 },
  { name: "長万部",    lat: 42.539410, lng: 140.370660, timeToNext: 0 },
];

// JR函館本線（旭川〜岩見沢）
export const jrHakodateMainLineNorth: Station[] = [
  { name: "旭川",      lat: 43.770570, lng: 142.365090, timeToNext: 8 },
  { name: "近文",      lat: 43.750210, lng: 142.344120, timeToNext: 5 },
  { name: "伊納",      lat: 43.705560, lng: 142.285700, timeToNext: 8 },
  { name: "納内",      lat: 43.658540, lng: 142.265120, timeToNext: 8 },
  { name: "深川",      lat: 43.720640, lng: 142.051420, timeToNext: 10 },
  { name: "北一已",    lat: 43.730580, lng: 141.995180, timeToNext: 8 },
  { name: "妹背牛",    lat: 43.719300, lng: 141.947800, timeToNext: 8 },
  { name: "秩父別",    lat: 43.693980, lng: 141.886280, timeToNext: 8 },
  { name: "北秩父別",   lat: 43.662350, lng: 141.813220, timeToNext: 8 },
  { name: "石狩沼田",   lat: 43.647480, lng: 141.769350, timeToNext: 8 },
  { name: "真布",      lat: 43.603340, lng: 141.757280, timeToNext: 8 },
  { name: "恵比島",    lat: 43.548820, lng: 141.736150, timeToNext: 8 },
  { name: "幌糠",      lat: 43.510000, lng: 141.770710, timeToNext: 8 },
  { name: "留萌",      lat: 43.592010, lng: 141.639730, timeToNext: 10 },
  { name: "滝川",      lat: 43.557290, lng: 141.916490, timeToNext: 8 },
  { name: "江部乙",    lat: 43.490930, lng: 141.942710, timeToNext: 8 },
  { name: "砂川",      lat: 43.480350, lng: 141.904740, timeToNext: 8 },
  { name: "奈井江",    lat: 43.425340, lng: 141.880650, timeToNext: 8 },
  { name: "美唄",      lat: 43.354650, lng: 141.854530, timeToNext: 8 },
  { name: "光珠内",    lat: 43.303900, lng: 141.830100, timeToNext: 8 },
  { name: "岩見沢",    lat: 43.196140, lng: 141.776440, timeToNext: 0 },
];

// 道南いさりび鉄道: 木古内〜五稜郭
export const dosanIsaribi: Station[] = [
  { name: "木古内",    lat: 41.676980, lng: 140.443350, timeToNext: 8 },
  { name: "札苅",      lat: 41.695090, lng: 140.476130, timeToNext: 8 },
  { name: "泉沢",      lat: 41.714970, lng: 140.523240, timeToNext: 8 },
  { name: "釜谷",      lat: 41.721510, lng: 140.567760, timeToNext: 8 },
  { name: "渡島当別",   lat: 41.730600, lng: 140.615460, timeToNext: 8 },
  { name: "茂辺地",    lat: 41.729350, lng: 140.638870, timeToNext: 8 },
  { name: "上磯",      lat: 41.741020, lng: 140.666150, timeToNext: 5 },
  { name: "清川口",    lat: 41.747220, lng: 140.684330, timeToNext: 5 },
  { name: "久根別",    lat: 41.756850, lng: 140.699710, timeToNext: 5 },
  { name: "東久根別",   lat: 41.760850, lng: 140.715580, timeToNext: 5 },
  { name: "七重浜",    lat: 41.770270, lng: 140.722830, timeToNext: 5 },
  { name: "五稜郭",    lat: 41.778810, lng: 140.737200, timeToNext: 0 },
];
