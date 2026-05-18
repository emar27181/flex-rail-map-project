import type { Station } from './yamanote';

// 名古屋鉄道名古屋本線（名古屋〜豊橋）: 既登録 meitetsuNagoyaMainLine と重複しないよう確認
// JR参宮線: 多気〜鳥羽
export const jrSanguLine: Station[] = [
  { name: "多気",      lat: 34.469340, lng: 136.543710, timeToNext: 5 },
  { name: "外城田",    lat: 34.437620, lng: 136.616470, timeToNext: 5 },
  { name: "田丸",      lat: 34.440210, lng: 136.637200, timeToNext: 5 },
  { name: "宮川",      lat: 34.444430, lng: 136.665400, timeToNext: 5 },
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
  { name: "七和",      lat: 35.090620, lng: 136.715110, timeToNext: 4 },
  { name: "穴太",      lat: 35.100580, lng: 136.714880, timeToNext: 4 },
  { name: "東員",      lat: 35.110260, lng: 136.694450, timeToNext: 4 },
  { name: "大泉",      lat: 35.122290, lng: 136.704360, timeToNext: 4 },
  { name: "楚原",      lat: 35.137220, lng: 136.715720, timeToNext: 4 },
  { name: "麻生田",    lat: 35.151540, lng: 136.754140, timeToNext: 4 },
  { name: "阿下喜",    lat: 35.166440, lng: 136.773270, timeToNext: 0 },
];

// 養老鉄道: 桑名〜揖斐
export const yoroRailway: Station[] = [
  { name: "桑名",      lat: 35.079100, lng: 136.697500, timeToNext: 4 },
  { name: "播磨",      lat: 35.108600, lng: 136.672640, timeToNext: 4 },
  { name: "下深谷",    lat: 35.131210, lng: 136.661870, timeToNext: 4 },
  { name: "下野代",    lat: 35.152490, lng: 136.661680, timeToNext: 4 },
  { name: "多度",      lat: 35.174600, lng: 136.618800, timeToNext: 4 },
  { name: "美濃松山",   lat: 35.189990, lng: 136.614990, timeToNext: 4 },
  { name: "石津",      lat: 35.217420, lng: 136.612050, timeToNext: 4 },
  { name: "美濃山崎",   lat: 35.224050, lng: 136.620010, timeToNext: 4 },
  { name: "駒野",      lat: 35.243040, lng: 136.625170, timeToNext: 4 },
  { name: "美濃津屋",   lat: 35.280530, lng: 136.620590, timeToNext: 4 },
  { name: "養老",      lat: 35.309880, lng: 136.568150, timeToNext: 4 },
  { name: "美濃高田",   lat: 35.335350, lng: 136.551850, timeToNext: 4 },
  { name: "烏江",      lat: 35.359670, lng: 136.536530, timeToNext: 4 },
  { name: "広神戸",    lat: 35.391590, lng: 136.530280, timeToNext: 4 },
  { name: "北神戸",    lat: 35.407890, lng: 136.539010, timeToNext: 4 },
  { name: "池野",      lat: 35.432750, lng: 136.538320, timeToNext: 4 },
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
  { name: "信州中野",   lat: 36.747420, lng: 138.177650, timeToNext: 5 },
  { name: "中野松川",   lat: 36.773980, lng: 138.174110, timeToNext: 5 },
  { name: "都住",      lat: 36.793290, lng: 138.169210, timeToNext: 5 },
  { name: "夜間瀬",    lat: 36.819740, lng: 138.265550, timeToNext: 5 },
  { name: "上条",      lat: 36.839890, lng: 138.294860, timeToNext: 5 },
  { name: "湯田中",    lat: 36.858000, lng: 138.431950, timeToNext: 0 },
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
  { name: "神畑",      lat: 36.396890, lng: 138.181510, timeToNext: 3 },
  { name: "大学前",    lat: 36.385360, lng: 138.176900, timeToNext: 3 },
  { name: "下之郷",    lat: 36.370690, lng: 138.184990, timeToNext: 3 },
  { name: "中塩田",    lat: 36.357740, lng: 138.195200, timeToNext: 3 },
  { name: "塩田町",    lat: 36.339680, lng: 138.208050, timeToNext: 3 },
  { name: "中野",      lat: 36.326870, lng: 138.224070, timeToNext: 3 },
  { name: "舞田",      lat: 36.313930, lng: 138.243840, timeToNext: 3 },
  { name: "別所温泉",   lat: 36.290580, lng: 138.238770, timeToNext: 0 },
];

// 松本電気鉄道上高地線: 松本〜新島々
export const matsumotoDentestu: Station[] = [
  { name: "松本",      lat: 36.215780, lng: 137.971980, timeToNext: 3 },
  { name: "西松本",    lat: 36.221980, lng: 137.954770, timeToNext: 3 },
  { name: "渚",        lat: 36.218010, lng: 137.940330, timeToNext: 3 },
  { name: "信濃荒井",   lat: 36.203120, lng: 137.924980, timeToNext: 3 },
  { name: "大庭",      lat: 36.188640, lng: 137.910260, timeToNext: 3 },
  { name: "下新",      lat: 36.175610, lng: 137.892650, timeToNext: 3 },
  { name: "北新・松本大学前", lat: 36.173820, lng: 137.875890, timeToNext: 3 },
  { name: "新村",      lat: 36.182870, lng: 137.862090, timeToNext: 3 },
  { name: "三溝",      lat: 36.178090, lng: 137.845630, timeToNext: 3 },
  { name: "上高地線渕東", lat: 36.173200, lng: 137.833810, timeToNext: 3 },
  { name: "新島々",    lat: 36.176090, lng: 137.825150, timeToNext: 0 },
];
