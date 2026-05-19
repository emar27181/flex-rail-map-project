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
  { name: "小樽築港",   lat: 43.180814, lng: 141.027758, timeToNext: 5 },
  { name: "朝里",      lat: 43.176900, lng: 141.063700, timeToNext: 5 },
  { name: "銭函",      lat: 43.143500, lng: 141.159700, timeToNext: 8 },
  { name: "星置",      lat: 43.132339, lng: 141.210970, timeToNext: 5 },
  { name: "ほしみ",    lat: 43.133523, lng: 141.192141, timeToNext: 5 },
  { name: "手稲",      lat: 43.120263, lng: 141.243613, timeToNext: 5 },
  { name: "稲積公園",   lat: 43.112257, lng: 141.256798, timeToNext: 5 },
  { name: "発寒",      lat: 43.099802, lng: 141.277292, timeToNext: 5 },
  { name: "発寒中央",   lat: 43.089477, lng: 141.294237, timeToNext: 5 },
  { name: "琴似",      lat: 43.075520, lng: 141.304440, timeToNext: 5 },
  { name: "桑園",      lat: 43.067390, lng: 141.336290, timeToNext: 4 },
  { name: "札幌",      lat: 43.068820, lng: 141.350640, timeToNext: 10 },
  { name: "倶知安",    lat: 42.900510, lng: 140.758230, timeToNext: 15 },
  { name: "黒松内",    lat: 42.671990, lng: 140.318960, timeToNext: 15 },
  { name: "長万部",    lat: 42.512775, lng: 140.375213, timeToNext: 0 },
];

// JR函館本線（旭川〜岩見沢）
export const jrHakodateMainLineNorth: Station[] = [
  { name: "旭川",      lat: 43.770570, lng: 142.365090, timeToNext: 8 },
  { name: "近文",      lat: 43.789300, lng: 142.325600, timeToNext: 5 },
  { name: "伊納",      lat: 43.705560, lng: 142.285700, timeToNext: 8 },
  { name: "納内",      lat: 43.732500, lng: 142.131100, timeToNext: 8 },
  { name: "深川",      lat: 43.720640, lng: 142.051420, timeToNext: 10 },
  { name: "滝川",      lat: 43.557290, lng: 141.916490, timeToNext: 8 },
  { name: "江部乙",    lat: 43.627600, lng: 141.935800, timeToNext: 8 },
  { name: "砂川",      lat: 43.480350, lng: 141.904740, timeToNext: 8 },
  { name: "奈井江",    lat: 43.425340, lng: 141.880650, timeToNext: 8 },
  { name: "美唄",      lat: 43.331055, lng: 141.862084, timeToNext: 8 },
  { name: "光珠内",    lat: 43.303900, lng: 141.830100, timeToNext: 8 },
  { name: "岩見沢",    lat: 43.204215, lng: 141.759511, timeToNext: 0 },
];

// 道南いさりび鉄道: 木古内〜五稜郭
export const dosanIsaribi: Station[] = [
  { name: "木古内",    lat: 41.676980, lng: 140.443350, timeToNext: 8 },
  { name: "札苅",      lat: 41.695090, lng: 140.476130, timeToNext: 8 },
  { name: "泉沢",      lat: 41.714970, lng: 140.523240, timeToNext: 8 },
  { name: "釜谷",      lat: 41.712085, lng: 140.536991, timeToNext: 8 },
  { name: "渡島当別",   lat: 41.737503, lng: 140.579363, timeToNext: 8 },
  { name: "茂辺地",    lat: 41.766144, lng: 140.600908, timeToNext: 8 },
  { name: "上磯",      lat: 41.819497, lng: 140.640639, timeToNext: 5 },
  { name: "清川口",    lat: 41.824655, lng: 140.653309, timeToNext: 5 },
  { name: "久根別",    lat: 41.826641, lng: 140.666417, timeToNext: 5 },
  { name: "東久根別",   lat: 41.826017, lng: 140.680274, timeToNext: 5 },
  { name: "七重浜",    lat: 41.817442, lng: 140.708640, timeToNext: 5 },
  { name: "五稜郭",    lat: 41.803429, lng: 140.733643, timeToNext: 0 },
];
