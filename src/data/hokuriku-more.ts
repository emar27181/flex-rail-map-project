import type { Station } from './yamanote';

// えちごトキめき鉄道日本海ひすいライン: 市振〜直江津
export const echigotokimekiHisui: Station[] = [
  { name: "市振",       lat: 36.980409, lng: 137.650214, timeToNext: 10 },
  { name: "親不知",     lat: 37.006801, lng: 137.738211, timeToNext: 8 },
  { name: "青海",       lat: 37.022618, lng: 137.794997, timeToNext: 5 },
  { name: "糸魚川",     lat: 37.043306, lng: 137.861753, timeToNext: 5 },
  { name: "能生",       lat: 37.096104, lng: 137.988538, timeToNext: 15 },
  { name: "筒石",       lat: 37.127474, lng: 138.060708, timeToNext: 8 },
  { name: "名立",       lat: 37.155687, lng: 138.092268, timeToNext: 8 },
  { name: "有間川",     lat: 37.163568, lng: 138.137879, timeToNext: 8 },
  { name: "谷浜",       lat: 37.137990, lng: 138.176280, timeToNext: 8 },
  { name: "直江津",     lat: 37.142410, lng: 138.235630, timeToNext: 0 },
];

// えちごトキめき鉄道妙高はねうまライン: 妙高高原〜直江津
export const echigotokimekiMyoko: Station[] = [
  { name: "妙高高原",   lat: 36.893090, lng: 138.222360, timeToNext: 15 },
  { name: "関山",       lat: 36.933010, lng: 138.226434, timeToNext: 10 },
  { name: "二本木",     lat: 36.989713, lng: 138.232661, timeToNext: 8 },
  { name: "新井",       lat: 37.026815, lng: 138.255485, timeToNext: 8 },
  { name: "北新井",     lat: 37.053114, lng: 138.257656, timeToNext: 5 },
  { name: "上越妙高",   lat: 37.081376, lng: 138.248016, timeToNext: 10 },
  { name: "春日山",     lat: 37.148059, lng: 138.234932, timeToNext: 5 },
  { name: "直江津",     lat: 37.142410, lng: 138.235630, timeToNext: 0 },
];

// あいの風とやま鉄道: 倶利伽羅〜市振
export const ainokaze: Station[] = [
  { name: "倶利伽羅",   lat: 36.672509, lng: 136.791622, timeToNext: 8 },
  { name: "石動",       lat: 36.672607, lng: 136.865429, timeToNext: 5 },
  { name: "福岡",       lat: 36.708110, lng: 136.931742, timeToNext: 5 },
  { name: "西高岡",     lat: 36.757580, lng: 136.969100, timeToNext: 8 },
  { name: "高岡",       lat: 36.753490, lng: 137.025630, timeToNext: 5 },
  { name: "越中大門",   lat: 36.746720, lng: 137.059800, timeToNext: 5 },
  { name: "小杉",       lat: 36.721640, lng: 137.093890, timeToNext: 5 },
  { name: "呉羽",       lat: 36.702470, lng: 137.168550, timeToNext: 5 },
  { name: "富山",       lat: 36.701620, lng: 137.215640, timeToNext: 5 },
  { name: "東富山",     lat: 36.741292, lng: 137.249021, timeToNext: 5 },
  { name: "水橋",       lat: 36.741510, lng: 137.357210, timeToNext: 5 },
  { name: "滑川",       lat: 36.757780, lng: 137.339850, timeToNext: 5 },
  { name: "東滑川",     lat: 36.771640, lng: 137.370020, timeToNext: 5 },
  { name: "魚津",       lat: 36.818090, lng: 137.414980, timeToNext: 5 },
  { name: "黒部",       lat: 36.870870, lng: 137.455770, timeToNext: 5 },
  { name: "生地",       lat: 36.886230, lng: 137.492500, timeToNext: 5 },
  { name: "西入善",     lat: 36.908720, lng: 137.518530, timeToNext: 5 },
  { name: "入善",       lat: 36.929680, lng: 137.520960, timeToNext: 5 },
  { name: "泊",         lat: 36.947200, lng: 137.538870, timeToNext: 5 },
  { name: "越中宮崎",   lat: 36.934410, lng: 137.577910, timeToNext: 8 },
  { name: "市振",       lat: 36.980409, lng: 137.650214, timeToNext: 0 },
];

// IR いしかわ鉄道: 金沢〜倶利伽羅
export const irIshikawaRailway: Station[] = [
  { name: "金沢",       lat: 36.578600, lng: 136.648570, timeToNext: 5 },
  { name: "東金沢",     lat: 36.582470, lng: 136.676310, timeToNext: 5 },
  { name: "森本",       lat: 36.598320, lng: 136.700150, timeToNext: 5 },
  { name: "津幡",       lat: 36.665060, lng: 136.722390, timeToNext: 5 },
  { name: "倶利伽羅",   lat: 36.672509, lng: 136.791622, timeToNext: 0 },
];


// 黒部峡谷鉄道（トロッコ）: 宇奈月〜欅平
export const kurobe: Station[] = [
  { name: "宇奈月",     lat: 36.815416, lng: 137.585187, timeToNext: 15 },
  { name: "柳橋",       lat: 36.803186, lng: 137.591671, timeToNext: 8 },
  { name: "森石",       lat: 36.791879, lng: 137.612984, timeToNext: 8 },
  { name: "猫又",       lat: 36.749038, lng: 137.641489, timeToNext: 8 },
  { name: "鐘釣",       lat: 36.734323, lng: 137.651564, timeToNext: 8 },
  { name: "小屋平",     lat: 36.710819, lng: 137.646912, timeToNext: 5 },
  { name: "欅平",       lat: 36.696875, lng: 137.658106, timeToNext: 0 },
];
