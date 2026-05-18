import type { Station } from './yamanote';

// 大井川鐡道大井川本線: 金谷〜千頭
export const oigawaRailway: Station[] = [
  { name: "金谷",               lat: 34.826800, lng: 138.126100, timeToNext: 5 },
  { name: "新金谷",             lat: 34.831200, lng: 138.125400, timeToNext: 5 },
  { name: "代官町",             lat: 34.847600, lng: 138.121800, timeToNext: 5 },
  { name: "日切",               lat: 34.858400, lng: 138.115200, timeToNext: 5 },
  { name: "五和",               lat: 34.870200, lng: 138.107600, timeToNext: 5 },
  { name: "神尾",               lat: 34.882100, lng: 138.099300, timeToNext: 5 },
  { name: "福用",               lat: 34.893700, lng: 138.089100, timeToNext: 5 },
  { name: "大和田",             lat: 34.901200, lng: 138.079400, timeToNext: 5 },
  { name: "家山",               lat: 34.918400, lng: 138.064200, timeToNext: 5 },
  { name: "抜里",               lat: 34.938800, lng: 138.049100, timeToNext: 5 },
  { name: "川根温泉笹間渡",     lat: 34.959400, lng: 138.040100, timeToNext: 5 },
  { name: "地名",               lat: 34.978200, lng: 138.028400, timeToNext: 5 },
  { name: "塩郷",               lat: 34.993600, lng: 138.019800, timeToNext: 5 },
  { name: "下泉",               lat: 35.007400, lng: 138.006200, timeToNext: 5 },
  { name: "田野口",             lat: 35.021800, lng: 137.993700, timeToNext: 5 },
  { name: "駿河徳山",           lat: 35.036400, lng: 137.978900, timeToNext: 5 },
  { name: "青部",               lat: 35.052100, lng: 137.963200, timeToNext: 5 },
  { name: "崎平",               lat: 35.063800, lng: 137.951400, timeToNext: 5 },
  { name: "千頭",               lat: 35.078400, lng: 137.932100, timeToNext: 0 },
];

// 岳南電車: 吉原〜岳南江尾
export const gakunanRailway: Station[] = [
  { name: "吉原",               lat: 35.162100, lng: 138.680900, timeToNext: 4 },
  { name: "ジヤトコ前",         lat: 35.162800, lng: 138.690400, timeToNext: 3 },
  { name: "吉原本町",           lat: 35.160200, lng: 138.700200, timeToNext: 3 },
  { name: "吉原市役所前",       lat: 35.153800, lng: 138.710400, timeToNext: 3 },
  { name: "本吉原",             lat: 35.149200, lng: 138.718600, timeToNext: 3 },
  { name: "比奈",               lat: 35.143600, lng: 138.727400, timeToNext: 3 },
  { name: "岳南富士岡",         lat: 35.138200, lng: 138.736800, timeToNext: 3 },
  { name: "須津",               lat: 35.132800, lng: 138.745300, timeToNext: 3 },
  { name: "神谷",               lat: 35.128400, lng: 138.754200, timeToNext: 3 },
  { name: "岳南原田",           lat: 35.123600, lng: 138.763800, timeToNext: 3 },
  { name: "岳南江尾",           lat: 35.119200, lng: 138.774100, timeToNext: 0 },
];

// 伊豆箱根鉄道大雄山線: 小田原〜大雄山
export const izuhakoneOyamazanLine: Station[] = [
  { name: "小田原",             lat: 35.265800, lng: 139.152700, timeToNext: 3 },
  { name: "緑町",               lat: 35.268400, lng: 139.143200, timeToNext: 2 },
  { name: "井細田",             lat: 35.276600, lng: 139.134800, timeToNext: 2 },
  { name: "五百羅漢",           lat: 35.286200, lng: 139.127400, timeToNext: 3 },
  { name: "穴部",               lat: 35.298400, lng: 139.115100, timeToNext: 3 },
  { name: "飯田岡",             lat: 35.311200, lng: 139.105900, timeToNext: 3 },
  { name: "相模沼田",           lat: 35.324800, lng: 139.096200, timeToNext: 3 },
  { name: "岩原",               lat: 35.337200, lng: 139.087400, timeToNext: 3 },
  { name: "塚原",               lat: 35.348800, lng: 139.077600, timeToNext: 3 },
  { name: "和田河原",           lat: 35.361200, lng: 139.067800, timeToNext: 3 },
  { name: "富士フイルム前",     lat: 35.370600, lng: 139.056200, timeToNext: 3 },
  { name: "大雄山",             lat: 35.378400, lng: 139.046100, timeToNext: 0 },
];
