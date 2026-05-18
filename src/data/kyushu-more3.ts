import type { Station } from './yamanote';

// 平成筑豊鉄道伊田線: 直方〜田川伊田
export const heiseiChikuhoIdaLine: Station[] = [
  { name: "直方",               lat: 33.740800, lng: 130.729400, timeToNext: 5 },
  { name: "藤棚",               lat: 33.727600, lng: 130.748200, timeToNext: 4 },
  { name: "市場",               lat: 33.718200, lng: 130.754800, timeToNext: 3 },
  { name: "崎山",               lat: 33.705100, lng: 130.762300, timeToNext: 3 },
  { name: "金田",               lat: 33.694700, lng: 130.769800, timeToNext: 3 },
  { name: "上金田",             lat: 33.682900, lng: 130.779200, timeToNext: 3 },
  { name: "漆生",               lat: 33.671200, lng: 130.789100, timeToNext: 3 },
  { name: "下山田",             lat: 33.658800, lng: 130.798700, timeToNext: 3 },
  { name: "田川伊田",           lat: 33.640900, lng: 130.809800, timeToNext: 0 },
];

// 平成筑豊鉄道田川線: 行橋〜田川伊田
export const heiseiChikuhoTagawaLine: Station[] = [
  { name: "行橋",               lat: 33.717800, lng: 130.993800, timeToNext: 5 },
  { name: "令和コスタ行橋",     lat: 33.714600, lng: 130.980100, timeToNext: 4 },
  { name: "椎地",               lat: 33.709800, lng: 130.960700, timeToNext: 5 },
  { name: "源じいの森",         lat: 33.702600, lng: 130.935800, timeToNext: 5 },
  { name: "油須原",             lat: 33.693800, lng: 130.913200, timeToNext: 5 },
  { name: "赤",                 lat: 33.682500, lng: 130.890900, timeToNext: 5 },
  { name: "呼野",               lat: 33.671200, lng: 130.869700, timeToNext: 5 },
  { name: "採銅所",             lat: 33.659700, lng: 130.850800, timeToNext: 5 },
  { name: "柿下温泉口",         lat: 33.649800, lng: 130.832400, timeToNext: 4 },
  { name: "豊前川崎",           lat: 33.641200, lng: 130.817100, timeToNext: 3 },
  { name: "田川伊田",           lat: 33.640900, lng: 130.809800, timeToNext: 0 },
];

// 南阿蘇鉄道: 立野〜高森
export const minamiAsoRailway: Station[] = [
  { name: "立野",               lat: 32.853200, lng: 131.082100, timeToNext: 5 },
  { name: "長陽",               lat: 32.874800, lng: 131.063200, timeToNext: 4 },
  { name: "南阿蘇水の生まれる里白水高原", lat: 32.891300, lng: 131.044600, timeToNext: 4 },
  { name: "阿蘇下田城ふれあい温泉", lat: 32.911100, lng: 131.013900, timeToNext: 4 },
  { name: "中松",               lat: 32.927400, lng: 130.999200, timeToNext: 4 },
  { name: "加勢",               lat: 32.936800, lng: 130.984500, timeToNext: 4 },
  { name: "見晴台",             lat: 32.944200, lng: 130.971300, timeToNext: 3 },
  { name: "高森",               lat: 32.961800, lng: 130.953700, timeToNext: 0 },
];
