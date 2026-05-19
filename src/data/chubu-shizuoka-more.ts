import type { Station } from './yamanote';

// 大井川鐡道大井川本線: 金谷〜千頭
export const oigawaRailway: Station[] = [
  { name: "金谷",               lat: 34.826800, lng: 138.126100, timeToNext: 5 },
  { name: "新金谷",             lat: 34.825713, lng: 138.137766, timeToNext: 5 },
  { name: "代官町",             lat: 34.835508, lng: 138.126051, timeToNext: 5 },
  { name: "日切",               lat: 34.83914, lng: 138.12238, timeToNext: 5 },
  { name: "五和",               lat: 34.870200, lng: 138.107600, timeToNext: 5 },
  { name: "神尾",               lat: 34.882100, lng: 138.099300, timeToNext: 5 },
  { name: "福用",               lat: 34.893700, lng: 138.089100, timeToNext: 5 },
  { name: "大和田",             lat: 34.901200, lng: 138.079400, timeToNext: 5 },
  { name: "家山",               lat: 34.940232, lng: 138.077772, timeToNext: 5 },
  { name: "抜里",               lat: 34.953134, lng: 138.087769, timeToNext: 5 },
  { name: "川根温泉笹間渡",     lat: 34.96226, lng: 138.086239, timeToNext: 5 },
  { name: "地名",               lat: 34.98612, lng: 138.087239, timeToNext: 5 },
  { name: "塩郷",               lat: 34.997267, lng: 138.090698, timeToNext: 5 },
  { name: "下泉",               lat: 35.021977, lng: 138.090049, timeToNext: 5 },
  { name: "田野口",             lat: 35.051423, lng: 138.095437, timeToNext: 5 },
  { name: "駿河徳山",           lat: 35.074368, lng: 138.110571, timeToNext: 5 },
  { name: "青部",               lat: 35.089592, lng: 138.115746, timeToNext: 5 },
  { name: "崎平",               lat: 35.091587, lng: 138.127241, timeToNext: 5 },
  { name: "千頭",               lat: 35.108124, lng: 138.137781, timeToNext: 0 },
];

// 岳南電車: 吉原〜岳南江尾
export const gakunanRailway: Station[] = [
  { name: "吉原",               lat: 35.143905, lng: 138.702337, timeToNext: 4 },
  { name: "ジヤトコ前",         lat: 35.162800, lng: 138.690400, timeToNext: 3 },
  { name: "吉原本町",           lat: 35.160200, lng: 138.700200, timeToNext: 3 },
  { name: "吉原市役所前",       lat: 35.153800, lng: 138.710400, timeToNext: 3 },
  { name: "本吉原",             lat: 35.161976, lng: 138.692647, timeToNext: 3 },
  { name: "比奈",               lat: 35.161488, lng: 138.713555, timeToNext: 3 },
  { name: "岳南富士岡",         lat: 35.160973, lng: 138.723229, timeToNext: 3 },
  { name: "須津",               lat: 35.160467, lng: 138.734145, timeToNext: 3 },
  { name: "神谷",               lat: 35.161059, lng: 138.743069, timeToNext: 3 },
  { name: "岳南原田",           lat: 35.165936, lng: 138.705633, timeToNext: 3 },
  { name: "岳南江尾",           lat: 35.155412, lng: 138.751921, timeToNext: 0 },
];

// 伊豆箱根鉄道大雄山線: 小田原〜大雄山
export const izuhakoneOyamazanLine: Station[] = [
  { name: "小田原",             lat: 35.265800, lng: 139.152700, timeToNext: 3 },
  { name: "緑町",               lat: 35.259603, lng: 139.158983, timeToNext: 2 },
  { name: "井細田",             lat: 35.268519, lng: 139.157298, timeToNext: 2 },
  { name: "五百羅漢",           lat: 35.275262, lng: 139.155702, timeToNext: 3 },
  { name: "穴部",               lat: 35.280107, lng: 139.148471, timeToNext: 3 },
  { name: "飯田岡",             lat: 35.288028, lng: 139.139099, timeToNext: 3 },
  { name: "相模沼田",           lat: 35.292111, lng: 139.133992, timeToNext: 3 },
  { name: "岩原",               lat: 35.299127, lng: 139.12849, timeToNext: 3 },
  { name: "塚原",               lat: 35.301726, lng: 139.126332, timeToNext: 3 },
  { name: "和田河原",           lat: 35.315852, lng: 139.118089, timeToNext: 3 },
  { name: "富士フイルム前",     lat: 35.317655, lng: 139.108894, timeToNext: 3 },
  { name: "大雄山",             lat: 35.319186, lng: 139.10317, timeToNext: 0 },
];
