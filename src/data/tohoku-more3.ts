import type { Station } from './yamanote';

// 由利高原鉄道: 羽後本荘〜矢島
export const yuriHighlandRailway: Station[] = [
  { name: "羽後本荘",           lat: 39.368700, lng: 140.047800, timeToNext: 4 },
  { name: "川口",               lat: 39.360200, lng: 140.039600, timeToNext: 4 },
  { name: "羽後岩谷",           lat: 39.345100, lng: 140.028900, timeToNext: 4 },
  { name: "西滝沢",             lat: 39.330400, lng: 140.020100, timeToNext: 4 },
  { name: "子吉",               lat: 39.319200, lng: 140.022800, timeToNext: 4 },
  { name: "鮎川",               lat: 39.307800, lng: 140.038700, timeToNext: 4 },
  { name: "鶴舞台",             lat: 39.296700, lng: 140.053200, timeToNext: 4 },
  { name: "曲沢",               lat: 39.283900, lng: 140.060100, timeToNext: 4 },
  { name: "前郷",               lat: 39.269600, lng: 140.067800, timeToNext: 4 },
  { name: "後三年",             lat: 39.255900, lng: 140.075400, timeToNext: 4 },
  { name: "新水沢",             lat: 39.247100, lng: 140.087200, timeToNext: 4 },
  { name: "矢島",               lat: 39.240700, lng: 140.098900, timeToNext: 0 },
];

// 津軽鉄道: 津軽五所川原〜津軽中里
export const tsugaruRailway: Station[] = [
  { name: "津軽五所川原",       lat: 40.767800, lng: 140.439200, timeToNext: 4 },
  { name: "津軽飯詰",           lat: 40.783200, lng: 140.431400, timeToNext: 4 },
  { name: "毘沙門",             lat: 40.803100, lng: 140.427900, timeToNext: 4 },
  { name: "嘉瀬",               lat: 40.821400, lng: 140.428700, timeToNext: 4 },
  { name: "金木",               lat: 40.840800, lng: 140.426600, timeToNext: 4 },
  { name: "芦野公園",           lat: 40.862100, lng: 140.423800, timeToNext: 4 },
  { name: "川倉",               lat: 40.887400, lng: 140.415100, timeToNext: 5 },
  { name: "大沢内",             lat: 40.913700, lng: 140.401200, timeToNext: 5 },
  { name: "深郷田",             lat: 40.940200, lng: 140.391800, timeToNext: 5 },
  { name: "津軽中里",           lat: 40.964800, lng: 140.379600, timeToNext: 0 },
];

// 弘南鉄道弘南線: 弘前〜黒石
export const konanLineHirosaki: Station[] = [
  { name: "弘前",               lat: 40.602900, lng: 140.463600, timeToNext: 4 },
  { name: "津軽大沢",           lat: 40.601200, lng: 140.480900, timeToNext: 4 },
  { name: "松木平",             lat: 40.599800, lng: 140.497300, timeToNext: 4 },
  { name: "大円寺",             lat: 40.600800, lng: 140.513100, timeToNext: 4 },
  { name: "平賀",               lat: 40.599600, lng: 140.534800, timeToNext: 5 },
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
  { name: "千年",               lat: 40.589200, lng: 140.442800, timeToNext: 3 },
  { name: "聖愛中高前",         lat: 40.580600, lng: 140.435300, timeToNext: 3 },
  { name: "運動公園前",         lat: 40.572100, lng: 140.427100, timeToNext: 4 },
  { name: "石川プール前",       lat: 40.559400, lng: 140.421800, timeToNext: 3 },
  { name: "義塾高校前",         lat: 40.548200, lng: 140.416300, timeToNext: 3 },
  { name: "津軽大沢",           lat: 40.535900, lng: 140.412700, timeToNext: 4 },
  { name: "松木平",             lat: 40.526100, lng: 140.411200, timeToNext: 3 },
  { name: "宿川原",             lat: 40.516400, lng: 140.404800, timeToNext: 3 },
  { name: "大鰐",               lat: 40.509200, lng: 140.389300, timeToNext: 0 },
];
