import type { Station } from './yamanote';

// 名古屋鉄道名古屋本線（名古屋〜豊橋）: 既登録 meitetsuNagoyaMainLine と重複しないよう確認
// JR参宮線: 多気〜鳥羽
export const jrSanguLine: Station[] = [
  { name: "多気",      lat: 34.516396, lng: 136.572770, timeToNext: 5 },
  { name: "外城田",    lat: 34.497660, lng: 136.596924, timeToNext: 5 },
  { name: "田丸",      lat: 34.488462, lng: 136.634098, timeToNext: 5 },
  { name: "宮川",      lat: 34.503180, lng: 136.672508, timeToNext: 5 },
  { name: "山田上口",   lat: 34.478510, lng: 136.712340, timeToNext: 5 },
  { name: "伊勢市",    lat: 34.487740, lng: 136.717060, timeToNext: 5 },
  { name: "五十鈴ヶ丘",  lat: 34.477810, lng: 136.742090, timeToNext: 5 },
  { name: "五十鈴川",   lat: 34.468880, lng: 136.739280, timeToNext: 5 },
  { name: "朝熊",      lat: 34.449170, lng: 136.743420, timeToNext: 5 },
  { name: "池の浦シーサイド", lat: 34.426720, lng: 136.761840, timeToNext: 5 },
  { name: "鳥羽",      lat: 34.478340, lng: 136.843250, timeToNext: 0 },
];

// 三岐鉄道北勢線: 西桑名〜阿下喜
export const sangiNokuseLine: Station[] = [
  { name: "西桑名",    lat: 35.069320, lng: 136.689950, timeToNext: 4 },
  { name: "馬道",      lat: 35.078750, lng: 136.700010, timeToNext: 4 },
  { name: "七和",      lat: 35.069005, lng: 136.615766, timeToNext: 4 },
  { name: "穴太",      lat: 35.072857, lng: 136.605293, timeToNext: 4 },
  { name: "東員",      lat: 35.077941, lng: 136.587562, timeToNext: 4 },
  { name: "大泉",      lat: 35.095481, lng: 136.570098, timeToNext: 4 },
  { name: "楚原",      lat: 35.110895, lng: 136.560301, timeToNext: 4 },
  { name: "麻生田",    lat: 35.133744, lng: 136.535599, timeToNext: 4 },
  { name: "阿下喜",    lat: 35.146330, lng: 136.519200, timeToNext: 0 },
];

// 養老鉄道: 桑名〜揖斐
export const yoroRailway: Station[] = [
  { name: "桑名",      lat: 35.079100, lng: 136.697500, timeToNext: 4 },
  { name: "播磨",      lat: 35.078173, lng: 136.674788, timeToNext: 4 },
  { name: "下深谷",    lat: 35.096454, lng: 136.661488, timeToNext: 4 },
  { name: "下野代",    lat: 35.115922, lng: 136.647167, timeToNext: 4 },
  { name: "多度",      lat: 35.133540, lng: 136.640694, timeToNext: 4 },
  { name: "美濃松山",   lat: 35.189990, lng: 136.614990, timeToNext: 4 },
  { name: "石津",      lat: 35.180790, lng: 136.627538, timeToNext: 4 },
  { name: "美濃山崎",   lat: 35.224050, lng: 136.620010, timeToNext: 4 },
  { name: "駒野",      lat: 35.243040, lng: 136.625170, timeToNext: 4 },
  { name: "美濃津屋",   lat: 35.251386, lng: 136.566732, timeToNext: 4 },
  { name: "養老",      lat: 35.309880, lng: 136.568150, timeToNext: 4 },
  { name: "美濃高田",   lat: 35.335350, lng: 136.551850, timeToNext: 4 },
  { name: "烏江",      lat: 35.305560, lng: 136.591517, timeToNext: 4 },
  { name: "広神戸",    lat: 35.419684, lng: 136.602054, timeToNext: 4 },
  { name: "北神戸",    lat: 35.429971, lng: 136.594555, timeToNext: 4 },
  { name: "池野",      lat: 35.436578, lng: 136.578542, timeToNext: 4 },
  { name: "北池野",    lat: 35.456030, lng: 136.547770, timeToNext: 4 },
  { name: "美濃本郷",   lat: 35.469790, lng: 136.556690, timeToNext: 4 },
  { name: "揖斐",      lat: 35.489050, lng: 136.568450, timeToNext: 0 },
];

// 長野電鉄長野線: 長野〜湯田中
export const naganoDentetsuLine: Station[] = [
  { name: "長野",      lat: 36.644510, lng: 138.188570, timeToNext: 3 },
  { name: "市役所前",   lat: 36.640920, lng: 138.192350, timeToNext: 3 },
  { name: "権堂",      lat: 36.645660, lng: 138.196460, timeToNext: 3 },
  { name: "善光寺下",   lat: 36.660030, lng: 138.191420, timeToNext: 3 },
  { name: "本郷",      lat: 36.668120, lng: 138.199990, timeToNext: 3 },
  { name: "桐原",      lat: 36.680770, lng: 138.211540, timeToNext: 3 },
  { name: "信州中野",   lat: 36.744478, lng: 138.364905, timeToNext: 5 },
  { name: "中野松川",   lat: 36.750528, lng: 138.374298, timeToNext: 5 },
  { name: "都住",      lat: 36.704019, lng: 138.321962, timeToNext: 5 },
  { name: "夜間瀬",    lat: 36.759968, lng: 138.403290, timeToNext: 5 },
  { name: "上条",      lat: 36.749472, lng: 138.407534, timeToNext: 5 },
  { name: "湯田中",    lat: 36.741730, lng: 138.414614, timeToNext: 0 },
];

// JR飛騨小坂〜猪谷間（高山本線の一部、既登録 jrTakayamaMainLine の補完）

// 上田電鉄別所線: 上田〜別所温泉
export const uedaDentetsuLine: Station[] = [
  { name: "上田",      lat: 36.402200, lng: 138.249140, timeToNext: 3 },
  { name: "城下",      lat: 36.402940, lng: 138.238580, timeToNext: 3 },
  { name: "三好町",    lat: 36.411010, lng: 138.229300, timeToNext: 3 },
  { name: "赤坂上",    lat: 36.407760, lng: 138.217010, timeToNext: 3 },
  { name: "上田原",    lat: 36.398490, lng: 138.202960, timeToNext: 3 },
  { name: "寺下",      lat: 36.400080, lng: 138.192380, timeToNext: 3 },
  { name: "神畑",      lat: 36.377716, lng: 138.216857, timeToNext: 3 },
  { name: "大学前",    lat: 36.371007, lng: 138.215173, timeToNext: 3 },
  { name: "下之郷",    lat: 36.363197, lng: 138.217184, timeToNext: 3 },
  { name: "中塩田",    lat: 36.357740, lng: 138.195200, timeToNext: 3 },
  { name: "塩田町",    lat: 36.339680, lng: 138.208050, timeToNext: 3 },
  { name: "中野",      lat: 36.360660, lng: 138.193347, timeToNext: 3 },
  { name: "舞田",      lat: 36.359771, lng: 138.183162, timeToNext: 3 },
  { name: "別所温泉",   lat: 36.353012, lng: 138.161736, timeToNext: 0 },
];

// 松本電気鉄道上高地線: 松本〜新島々
export const matsumotoDentestu: Station[] = [
  { name: "松本",      lat: 36.215780, lng: 137.971980, timeToNext: 3 },
  { name: "西松本",    lat: 36.221980, lng: 137.954770, timeToNext: 3 },
  { name: "渚",        lat: 36.218010, lng: 137.940330, timeToNext: 3 },
  { name: "信濃荒井",   lat: 36.203120, lng: 137.924980, timeToNext: 3 },
  { name: "大庭",      lat: 36.227019, lng: 137.941674, timeToNext: 3 },
  { name: "下新",      lat: 36.225105, lng: 137.922251, timeToNext: 3 },
  { name: "北新・松本大学前", lat: 36.219711, lng: 137.913884, timeToNext: 3 },
  { name: "新村",      lat: 36.216533, lng: 137.905349, timeToNext: 3 },
  { name: "三溝",      lat: 36.212842, lng: 137.891421, timeToNext: 3 },
  { name: "上高地線渕東", lat: 36.173200, lng: 137.833810, timeToNext: 3 },
  { name: "新島々",    lat: 36.176090, lng: 137.825150, timeToNext: 0 },
];
