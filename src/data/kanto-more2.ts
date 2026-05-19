import type { Station } from './yamanote';

// ひたちなか海浜鉄道: 勝田〜阿字ヶ浦
export const hitachinakaSeaRailway: Station[] = [
  { name: "勝田",               lat: 36.394870, lng: 140.534460, timeToNext: 4 },
  { name: "工機前",             lat: 36.387952, lng: 140.524735, timeToNext: 3 },
  { name: "金上",               lat: 36.382576, lng: 140.533786, timeToNext: 3 },
  { name: "中根",               lat: 36.36739, lng: 140.562374, timeToNext: 3 },
  { name: "那珂湊",             lat: 36.345082, lng: 140.588117, timeToNext: 5 },
  { name: "殿山",               lat: 36.349956, lng: 140.601984, timeToNext: 3 },
  { name: "平磯",               lat: 36.357766, lng: 140.607668, timeToNext: 3 },
  { name: "磯崎",               lat: 36.378011, lng: 140.617963, timeToNext: 3 },
  { name: "阿字ヶ浦",           lat: 36.383617, lng: 140.612368, timeToNext: 0 },
];


// JR水郡線（水戸〜常陸大宮区間）: 水戸〜常陸大宮
export const jrSuigunLineMain: Station[] = [
  { name: "水戸",               lat: 36.371690, lng: 140.473100, timeToNext: 5 },
  { name: "常陸青柳",           lat: 36.384134, lng: 140.484499, timeToNext: 5 },
  { name: "常陸津田",           lat: 36.404382, lng: 140.482969, timeToNext: 4 },
  { name: "後台",               lat: 36.423801, lng: 140.489971, timeToNext: 4 },
  { name: "下菅谷",             lat: 36.435349, lng: 140.494061, timeToNext: 4 },
  { name: "中菅谷",             lat: 36.445865, lng: 140.492636, timeToNext: 4 },
  { name: "上菅谷",             lat: 36.455406, lng: 140.492441, timeToNext: 5 },
  { name: "南酒出",             lat: 36.47737, lng: 140.498494, timeToNext: 4 },
  { name: "額田",               lat: 36.485712, lng: 140.503414, timeToNext: 5 },
  { name: "河合",               lat: 36.508251, lng: 140.517136, timeToNext: 5 },
  { name: "瓜連",               lat: 36.498127, lng: 140.449723, timeToNext: 5 },
  { name: "静",                 lat: 36.506037, lng: 140.438164, timeToNext: 4 },
  { name: "常陸大宮",           lat: 36.543200, lng: 140.407400, timeToNext: 0 },
];

// 小湊鉄道: 五井〜上総中野
export const kominatoRailway: Station[] = [
  { name: "五井",               lat: 35.519400, lng: 140.117300, timeToNext: 8 },
  { name: "上総村上",           lat: 35.497800, lng: 140.097400, timeToNext: 5 },
  { name: "海士有木",           lat: 35.481707, lng: 140.12411, timeToNext: 5 },
  { name: "上総三又",           lat: 35.466033, lng: 140.126766, timeToNext: 5 },
  { name: "上総山田",           lat: 35.454201, lng: 140.126182, timeToNext: 5 },
  { name: "光風台",             lat: 35.440354, lng: 140.114206, timeToNext: 5 },
  { name: "馬立",               lat: 35.423673, lng: 140.114878, timeToNext: 5 },
  { name: "上総牛久",           lat: 35.400141, lng: 140.1421, timeToNext: 5 },
  { name: "城見ヶ丘",           lat: 35.291696, lng: 140.252551, timeToNext: 5 },
  { name: "飯給",               lat: 35.320793, lng: 140.142182, timeToNext: 5 },
  { name: "月崎",               lat: 35.302196, lng: 140.139392, timeToNext: 5 },
  { name: "上総大久保",         lat: 35.283508, lng: 140.145858, timeToNext: 5 },
  { name: "養老渓谷",           lat: 35.266436, lng: 140.159604, timeToNext: 8 },
  { name: "上総中野",           lat: 35.250069, lng: 140.1999, timeToNext: 0 },
];
