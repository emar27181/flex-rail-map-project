import type { Station } from './yamanote';

// 由利高原鉄道: 羽後本荘〜矢島
export const yuriHighlandRailway: Station[] = [
  { name: "羽後本荘",           lat: 39.386812, lng: 140.057467, timeToNext: 4 },
  { name: "川口",               lat: 39.360200, lng: 140.039600, timeToNext: 4 },
  { name: "羽後岩谷",           lat: 39.442041, lng: 140.090076, timeToNext: 4 },
  { name: "西滝沢",             lat: 39.278263, lng: 140.116386, timeToNext: 4 },
  { name: "子吉",               lat: 39.350735, lng: 140.059736, timeToNext: 4 },
  { name: "鮎川",               lat: 39.328379, lng: 140.071652, timeToNext: 4 },
  { name: "鶴舞台",             lat: 39.296700, lng: 140.053200, timeToNext: 4 },
  { name: "曲沢",               lat: 39.321049, lng: 140.102125, timeToNext: 4 },
  { name: "前郷",               lat: 39.312631, lng: 140.112781, timeToNext: 4 },
  { name: "後三年",             lat: 39.364550, lng: 140.538675, timeToNext: 4 },
  { name: "新水沢",             lat: 39.247100, lng: 140.087200, timeToNext: 4 },
  { name: "矢島",               lat: 39.230376, lng: 140.138755, timeToNext: 0 },
];

// 津軽鉄道: 津軽五所川原〜津軽中里
export const tsugaruRailway: Station[] = [
  { name: "津軽五所川原",       lat: 40.809895, lng: 140.448583, timeToNext: 4 },
  { name: "津軽飯詰",           lat: 40.829504, lng: 140.479389, timeToNext: 4 },
  { name: "毘沙門",             lat: 40.857961, lng: 140.477767, timeToNext: 4 },
  { name: "嘉瀬",               lat: 40.881316, lng: 140.469137, timeToNext: 4 },
  { name: "金木",               lat: 40.903152, lng: 140.459891, timeToNext: 4 },
  { name: "芦野公園",           lat: 40.91233, lng: 140.451378, timeToNext: 4 },
  { name: "川倉",               lat: 40.925997, lng: 140.443775, timeToNext: 5 },
  { name: "大沢内",             lat: 40.939644, lng: 140.437335, timeToNext: 5 },
  { name: "深郷田",             lat: 40.951035, lng: 140.440929, timeToNext: 5 },
  { name: "津軽中里",           lat: 40.964602, lng: 140.441093, timeToNext: 0 },
];

// 弘南鉄道弘南線: 弘前〜黒石
export const konanLineHirosaki: Station[] = [
  { name: "弘前",               lat: 40.598598, lng: 140.485769, timeToNext: 4 },
  { name: "津軽大沢",           lat: 40.557919, lng: 140.516318, timeToNext: 4 },
  { name: "松木平",             lat: 40.560568, lng: 140.497278, timeToNext: 4 },
  { name: "大円寺",             lat: 40.600800, lng: 140.513100, timeToNext: 4 },
  { name: "平賀",               lat: 40.585091, lng: 140.561063, timeToNext: 5 },
  { name: "柏農高校前",         lat: 40.602700, lng: 140.554700, timeToNext: 4 },
  { name: "津軽尾上",           lat: 40.610400, lng: 140.571800, timeToNext: 4 },
  { name: "尾上高校前",         lat: 40.617900, lng: 140.581600, timeToNext: 4 },
  { name: "小友",               lat: 40.626800, lng: 140.587900, timeToNext: 4 },
  { name: "黒石",               lat: 40.637900, lng: 140.591200, timeToNext: 0 },
];

// 弘南鉄道大鰐線: 中央弘前〜大鰐
export const konanLineOwani: Station[] = [
  { name: "中央弘前",           lat: 40.601800, lng: 140.457200, timeToNext: 4 },
  { name: "弘高下",             lat: 40.597400, lng: 140.450100, timeToNext: 3 },
  { name: "千年",               lat: 40.567112, lng: 140.480628, timeToNext: 3 },
  { name: "聖愛中高前",         lat: 40.576923, lng: 140.472782, timeToNext: 3 },
  { name: "運動公園前",         lat: 40.589475, lng: 140.503357, timeToNext: 4 },
  { name: "石川プール前",       lat: 40.543174, lng: 140.550435, timeToNext: 3 },
  { name: "義塾高校前",         lat: 40.555791, lng: 140.527629, timeToNext: 3 },
  { name: "津軽大沢",           lat: 40.557919, lng: 140.516318, timeToNext: 4 },
  { name: "松木平",             lat: 40.560568, lng: 140.497278, timeToNext: 3 },
  { name: "宿川原",             lat: 40.525061, lng: 140.557676, timeToNext: 3 },
  { name: "大鰐",               lat: 40.521833, lng: 140.567025, timeToNext: 0 },
];
