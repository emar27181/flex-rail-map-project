import type { Station } from './yamanote';

// えちごトキめき鉄道日本海ひすいライン: 市振〜直江津
export const echigotokimekiHisui: Station[] = [
  { name: "市振",       lat: 36.921120, lng: 137.633590, timeToNext: 10 },
  { name: "親不知",     lat: 36.896640, lng: 137.685490, timeToNext: 8 },
  { name: "青海",       lat: 36.897890, lng: 137.744360, timeToNext: 5 },
  { name: "糸魚川",     lat: 36.878690, lng: 137.858820, timeToNext: 5 },
  { name: "能生",       lat: 37.038750, lng: 138.052260, timeToNext: 15 },
  { name: "筒石",       lat: 37.090380, lng: 138.104140, timeToNext: 8 },
  { name: "名立",       lat: 37.109270, lng: 138.131410, timeToNext: 8 },
  { name: "有間川",     lat: 37.130410, lng: 138.157960, timeToNext: 8 },
  { name: "谷浜",       lat: 37.137990, lng: 138.176280, timeToNext: 8 },
  { name: "直江津",     lat: 37.142410, lng: 138.235630, timeToNext: 0 },
];

// えちごトキめき鉄道妙高はねうまライン: 妙高高原〜直江津
export const echigotokimekiMyoko: Station[] = [
  { name: "妙高高原",   lat: 36.893090, lng: 138.222360, timeToNext: 15 },
  { name: "関山",       lat: 36.951580, lng: 138.178320, timeToNext: 10 },
  { name: "二本木",     lat: 37.046030, lng: 138.129880, timeToNext: 8 },
  { name: "新井",       lat: 37.104680, lng: 138.103580, timeToNext: 8 },
  { name: "北新井",     lat: 37.122820, lng: 138.098850, timeToNext: 5 },
  { name: "上越妙高",   lat: 37.137380, lng: 138.174260, timeToNext: 10 },
  { name: "春日山",     lat: 37.136240, lng: 138.196540, timeToNext: 5 },
  { name: "直江津",     lat: 37.142410, lng: 138.235630, timeToNext: 0 },
];

// あいの風とやま鉄道: 倶利伽羅〜市振
export const ainokaze: Station[] = [
  { name: "倶利伽羅",   lat: 36.745370, lng: 136.714480, timeToNext: 8 },
  { name: "石動",       lat: 36.739670, lng: 136.748310, timeToNext: 5 },
  { name: "福岡",       lat: 36.744960, lng: 136.817590, timeToNext: 5 },
  { name: "西高岡",     lat: 36.757580, lng: 136.969100, timeToNext: 8 },
  { name: "高岡",       lat: 36.753490, lng: 137.025630, timeToNext: 5 },
  { name: "越中大門",   lat: 36.746720, lng: 137.059800, timeToNext: 5 },
  { name: "小杉",       lat: 36.721640, lng: 137.093890, timeToNext: 5 },
  { name: "呉羽",       lat: 36.702470, lng: 137.168550, timeToNext: 5 },
  { name: "富山",       lat: 36.701620, lng: 137.215640, timeToNext: 5 },
  { name: "東富山",     lat: 36.720880, lng: 137.280310, timeToNext: 5 },
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
  { name: "市振",       lat: 36.921120, lng: 137.633590, timeToNext: 0 },
];

// IR いしかわ鉄道: 金沢〜倶利伽羅
export const irIshikawaRailway: Station[] = [
  { name: "金沢",       lat: 36.578600, lng: 136.648570, timeToNext: 5 },
  { name: "東金沢",     lat: 36.582470, lng: 136.676310, timeToNext: 5 },
  { name: "森本",       lat: 36.598320, lng: 136.700150, timeToNext: 5 },
  { name: "津幡",       lat: 36.665060, lng: 136.722390, timeToNext: 5 },
  { name: "倶利伽羅",   lat: 36.745370, lng: 136.714480, timeToNext: 0 },
];


// 黒部峡谷鉄道（トロッコ）: 宇奈月〜欅平
export const kurobe: Station[] = [
  { name: "宇奈月",     lat: 36.851850, lng: 137.561560, timeToNext: 15 },
  { name: "柳橋",       lat: 36.862300, lng: 137.599850, timeToNext: 8 },
  { name: "森石",       lat: 36.878330, lng: 137.627840, timeToNext: 8 },
  { name: "猫又",       lat: 36.884820, lng: 137.650080, timeToNext: 8 },
  { name: "鐘釣",       lat: 36.875830, lng: 137.684400, timeToNext: 8 },
  { name: "小屋平",     lat: 36.864790, lng: 137.694340, timeToNext: 5 },
  { name: "欅平",       lat: 36.858920, lng: 137.714760, timeToNext: 0 },
];
