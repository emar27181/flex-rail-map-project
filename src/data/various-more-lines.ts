import type { Station } from './yamanote';

// 福島交通飯坂線: 福島〜飯坂温泉
export const fukushimaIizakaLine: Station[] = [
  { name: "福島",           lat: 37.754220, lng: 140.468200, timeToNext: 3 },
  { name: "曽根田",         lat: 37.755870, lng: 140.483540, timeToNext: 2 },
  { name: "美術館図書館前", lat: 37.757360, lng: 140.490200, timeToNext: 2 },
  { name: "岩代清水",       lat: 37.763760, lng: 140.503940, timeToNext: 2 },
  { name: "泉",             lat: 37.775350, lng: 140.510330, timeToNext: 2 },
  { name: "上松川",         lat: 37.788980, lng: 140.516420, timeToNext: 2 },
  { name: "笹谷",           lat: 37.799450, lng: 140.516210, timeToNext: 2 },
  { name: "桜水",           lat: 37.808500, lng: 140.519720, timeToNext: 2 },
  { name: "平野",           lat: 37.817560, lng: 140.522480, timeToNext: 2 },
  { name: "医王寺前",       lat: 37.827690, lng: 140.528020, timeToNext: 2 },
  { name: "花水坂",         lat: 37.832490, lng: 140.527560, timeToNext: 2 },
  { name: "飯坂温泉",       lat: 37.840590, lng: 140.524690, timeToNext: 0 },
];

// JR石巻線: 小牛田〜女川
export const jrIshinomakiLine: Station[] = [
  { name: "小牛田",   lat: 38.565900, lng: 141.049730, timeToNext: 5 },
  { name: "上涌谷",   lat: 38.556490, lng: 141.064810, timeToNext: 4 },
  { name: "涌谷",     lat: 38.530430, lng: 141.093270, timeToNext: 4 },
  { name: "前谷地",   lat: 38.507920, lng: 141.127310, timeToNext: 5 },
  { name: "佳景山",   lat: 38.514880, lng: 141.148720, timeToNext: 3 },
  { name: "沢田",     lat: 38.502890, lng: 141.158200, timeToNext: 3 },
  { name: "鹿又",     lat: 38.490160, lng: 141.180300, timeToNext: 3 },
  { name: "陸前豊里", lat: 38.474830, lng: 141.218920, timeToNext: 4 },
  { name: "曽波神",   lat: 38.453510, lng: 141.255440, timeToNext: 4 },
  { name: "石巻",     lat: 38.434630, lng: 141.302560, timeToNext: 4 },
  { name: "渡波",     lat: 38.422970, lng: 141.332260, timeToNext: 3 },
  { name: "万石浦",   lat: 38.413100, lng: 141.358210, timeToNext: 3 },
  { name: "沢田",     lat: 38.399030, lng: 141.386360, timeToNext: 4 },
  { name: "浦宿",     lat: 38.408360, lng: 141.409870, timeToNext: 3 },
  { name: "女川",     lat: 38.444690, lng: 141.441760, timeToNext: 0 },
];

// 近江鉄道多賀線: 高宮〜多賀大社前
export const omiTagaLine: Station[] = [
  { name: "高宮",       lat: 35.198010, lng: 136.311150, timeToNext: 5 },
  { name: "多賀大社前", lat: 35.220680, lng: 136.282290, timeToNext: 0 },
];

// 近江鉄道八日市線: 八日市〜近江八幡
export const omiYokaichLine: Station[] = [
  { name: "八日市",     lat: 35.117020, lng: 136.197470, timeToNext: 3 },
  { name: "新八日市",   lat: 35.117920, lng: 136.188180, timeToNext: 3 },
  { name: "太郎坊宮前", lat: 35.115940, lng: 136.173350, timeToNext: 3 },
  { name: "市辺",       lat: 35.114340, lng: 136.148640, timeToNext: 3 },
  { name: "平田",       lat: 35.124390, lng: 136.128200, timeToNext: 3 },
  { name: "武佐",       lat: 35.124290, lng: 136.104490, timeToNext: 3 },
  { name: "近江八幡",   lat: 35.122640, lng: 136.098070, timeToNext: 0 },
];
