import type { Station } from './yamanote';

// 平成筑豊鉄道伊田線: 直方〜田川伊田
export const heiseiChikuhoIdaLine: Station[] = [
  { name: "直方",               lat: 33.740800, lng: 130.729400, timeToNext: 5 },
  { name: "藤棚",               lat: 33.727600, lng: 130.748200, timeToNext: 4 },
  { name: "市場",               lat: 33.718200, lng: 130.754800, timeToNext: 3 },
  { name: "崎山",               lat: 33.636289, lng: 130.917943, timeToNext: 3 },
  { name: "金田",               lat: 33.683093, lng: 130.776221, timeToNext: 3 },
  { name: "上金田",             lat: 33.672367, lng: 130.789728, timeToNext: 3 },
  { name: "漆生",               lat: 33.671200, lng: 130.789100, timeToNext: 3 },
  { name: "下山田",             lat: 33.658800, lng: 130.798700, timeToNext: 3 },
  { name: "田川伊田",           lat: 33.640900, lng: 130.809800, timeToNext: 0 },
];

// 平成筑豊鉄道田川線: 行橋〜田川伊田
export const heiseiChikuhoTagawaLine: Station[] = [
  { name: "行橋",               lat: 33.728706, lng: 130.970129, timeToNext: 5 },
  { name: "令和コスタ行橋",     lat: 33.714600, lng: 130.980100, timeToNext: 4 },
  { name: "椎地",               lat: 33.709800, lng: 130.960700, timeToNext: 5 },
  { name: "源じいの森",         lat: 33.616061, lng: 130.895664, timeToNext: 5 },
  { name: "油須原",             lat: 33.612601, lng: 130.884075, timeToNext: 5 },
  { name: "赤",                 lat: 33.618373, lng: 130.871656, timeToNext: 5 },
  { name: "呼野",               lat: 33.754526, lng: 130.861518, timeToNext: 5 },
  { name: "採銅所",             lat: 33.707156, lng: 130.853292, timeToNext: 5 },
  { name: "柿下温泉口",         lat: 33.651489, lng: 130.854424, timeToNext: 4 },
  { name: "豊前川崎",           lat: 33.597090, lng: 130.821334, timeToNext: 3 },
  { name: "田川伊田",           lat: 33.640900, lng: 130.809800, timeToNext: 0 },
];

// 南阿蘇鉄道: 立野〜高森
export const minamiAsoRailway: Station[] = [
  { name: "立野",               lat: 32.877493, lng: 130.965533, timeToNext: 5 },
  { name: "長陽",               lat: 32.854197, lng: 131.003961, timeToNext: 4 },
  { name: "南阿蘇水の生まれる里白水高原", lat: 32.834173, lng: 131.040164, timeToNext: 4 },
  { name: "阿蘇下田城ふれあい温泉", lat: 32.844346, lng: 131.024594, timeToNext: 4 },
  { name: "中松",               lat: 32.827432, lng: 131.053506, timeToNext: 4 },
  { name: "加勢",               lat: 32.847476, lng: 131.010223, timeToNext: 4 },
  { name: "見晴台",             lat: 32.817519, lng: 131.109796, timeToNext: 3 },
  { name: "高森",               lat: 32.819329, lng: 131.122535, timeToNext: 0 },
];
