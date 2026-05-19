import type { Station } from './yamanote';

// JR肥薩線: 八代〜隼人（人吉・吉松経由）
export const jrHisatsuLine: Station[] = [
  { name: "八代",       lat: 32.508780, lng: 130.607640, timeToNext: 8 },
  { name: "坂本",       lat: 32.434883, lng: 130.657949, timeToNext: 8 },
  { name: "葉木",       lat: 32.410620, lng: 130.645164, timeToNext: 6 },
  { name: "鎌瀬",       lat: 32.390907, lng: 130.654700, timeToNext: 6 },
  { name: "瀬戸石",     lat: 32.371647, lng: 130.646370, timeToNext: 8 },
  { name: "海路",       lat: 32.349210, lng: 130.619089, timeToNext: 6 },
  { name: "吉尾",       lat: 32.330562, lng: 130.600125, timeToNext: 6 },
  { name: "白石",       lat: 32.305994, lng: 130.608664, timeToNext: 6 },
  { name: "球泉洞",     lat: 32.267991, lng: 130.608165, timeToNext: 8 },
  { name: "一勝地",     lat: 32.250141, lng: 130.652170, timeToNext: 10 },
  { name: "那良口",     lat: 32.243659, lng: 130.667475, timeToNext: 8 },
  { name: "渡",         lat: 32.236914, lng: 130.694757, timeToNext: 8 },
  { name: "西人吉",     lat: 32.234770, lng: 130.743980, timeToNext: 10 },
  { name: "人吉",       lat: 32.211980, lng: 130.764550, timeToNext: 15 },
  { name: "大畑",       lat: 32.254500, lng: 130.826540, timeToNext: 12 },
  { name: "矢岳",       lat: 32.263920, lng: 130.880320, timeToNext: 12 },
  { name: "真幸",       lat: 32.161620, lng: 130.905080, timeToNext: 15 },
  { name: "吉松",       lat: 31.998400, lng: 130.670790, timeToNext: 10 },
  { name: "栗野",       lat: 31.950216, lng: 130.722583, timeToNext: 8 },
  { name: "大隅横川",   lat: 31.905749, lng: 130.703254, timeToNext: 8 },
  { name: "植村",       lat: 31.889913, lng: 130.724304, timeToNext: 6 },
  { name: "霧島温泉",   lat: 31.868439, lng: 130.734309, timeToNext: 10 },
  { name: "嘉例川",     lat: 31.826766, lng: 130.722724, timeToNext: 8 },
  { name: "中福良",     lat: 31.813907, lng: 130.732934, timeToNext: 6 },
  { name: "表木山",     lat: 31.796446, lng: 130.745265, timeToNext: 8 },
  { name: "日当山",     lat: 31.763490, lng: 130.749903, timeToNext: 6 },
  { name: "重富",       lat: 31.758230, lng: 130.745000, timeToNext: 8 },
  { name: "隼人",       lat: 31.784490, lng: 130.709000, timeToNext: 0 },
];

// JR吉都線: 吉松〜都城
export const jrKittoLine: Station[] = [
  { name: "吉松",       lat: 31.998400, lng: 130.670790, timeToNext: 8 },
  { name: "鶴丸",       lat: 31.986280, lng: 130.700060, timeToNext: 6 },
  { name: "京町温泉",   lat: 31.951320, lng: 130.749960, timeToNext: 8 },
  { name: "えびの上江", lat: 32.035610, lng: 130.850008, timeToNext: 8 },
  { name: "えびの",     lat: 32.044060, lng: 130.818720, timeToNext: 8 },
  { name: "えびの飯野", lat: 32.030452, lng: 130.870668, timeToNext: 6 },
  { name: "赤山",       lat: 32.099450, lng: 130.864190, timeToNext: 6 },
  { name: "小林",       lat: 31.998440, lng: 130.969520, timeToNext: 10 },
  { name: "西小林",     lat: 32.009541, lng: 130.921728, timeToNext: 6 },
  { name: "野尻",       lat: 31.967230, lng: 131.018380, timeToNext: 6 },
  { name: "東高崎",     lat: 31.840847, lng: 131.065159, timeToNext: 6 },
  { name: "高崎新田",   lat: 31.876274, lng: 131.062472, timeToNext: 5 },
  { name: "万ヶ塚",     lat: 31.817389, lng: 131.064069, timeToNext: 5 },
  { name: "都城",       lat: 31.721620, lng: 131.068290, timeToNext: 0 },
];

// 松浦鉄道西九州線（詳細版）: 有田〜佐世保
export const matsuuraRailwayDetail: Station[] = [
  { name: "有田",       lat: 33.207850, lng: 129.859280, timeToNext: 5 },
  { name: "三代橋",     lat: 33.221870, lng: 129.851690, timeToNext: 4 },
  { name: "黒川",       lat: 33.219330, lng: 129.831380, timeToNext: 4 },
  { name: "蔵宿",       lat: 33.221440, lng: 129.808180, timeToNext: 5 },
  { name: "伊万里",     lat: 33.271280, lng: 129.883660, timeToNext: 8 },
  { name: "里",         lat: 33.314240, lng: 129.882130, timeToNext: 6 },
  { name: "東山代",     lat: 33.337090, lng: 129.898850, timeToNext: 5 },
  { name: "山代栄",     lat: 33.339980, lng: 129.915620, timeToNext: 4 },
  { name: "楠久",       lat: 33.371380, lng: 129.938640, timeToNext: 4 },
  { name: "岩松",       lat: 33.407570, lng: 129.961840, timeToNext: 5 },
  { name: "佐々",       lat: 33.432540, lng: 129.990530, timeToNext: 5 },
  { name: "中佐世保",   lat: 33.157470, lng: 129.715420, timeToNext: 3 },
  { name: "佐世保",     lat: 33.156440, lng: 129.722610, timeToNext: 0 },
];

// 島原鉄道（詳細版）: 諫早〜島原港
export const shimabara_detail: Station[] = [
  { name: "諫早",       lat: 32.843530, lng: 130.053710, timeToNext: 5 },
  { name: "本諫早",     lat: 32.844350, lng: 130.063980, timeToNext: 4 },
  { name: "幸",         lat: 32.848150, lng: 130.083820, timeToNext: 5 },
  { name: "愛野",       lat: 32.780440, lng: 130.228660, timeToNext: 15 },
  { name: "吾妻",       lat: 32.769880, lng: 130.273330, timeToNext: 8 },
  { name: "古部",       lat: 32.762070, lng: 130.293430, timeToNext: 5 },
  { name: "有明",       lat: 32.750890, lng: 130.308560, timeToNext: 5 },
  { name: "大三東",     lat: 32.741760, lng: 130.323850, timeToNext: 4 },
  { name: "松岡",       lat: 32.730540, lng: 130.338540, timeToNext: 4 },
  { name: "島原船津",   lat: 32.719820, lng: 130.357130, timeToNext: 4 },
  { name: "島原",       lat: 32.703120, lng: 130.368620, timeToNext: 4 },
  { name: "島原港",     lat: 32.691250, lng: 130.370980, timeToNext: 0 },
];
