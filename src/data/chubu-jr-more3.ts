import type { Station } from './yamanote';

// JR東海道本線（名古屋〜豊橋）: 名古屋〜豊橋
export const jrTokaidoNagoyaToyohashi: Station[] = [
  { name: "名古屋",     lat: 35.170695, lng: 136.881582, timeToNext: 5 },
  { name: "熱田",       lat: 35.129886, lng: 136.910455, timeToNext: 5 },
  { name: "金山",       lat: 35.143440, lng: 136.899110, timeToNext: 5 },
  { name: "笠寺",       lat: 35.095579, lng: 136.926256, timeToNext: 5 },
  { name: "大高",       lat: 35.069224, lng: 136.940248, timeToNext: 5 },
  { name: "共和",       lat: 35.035237, lng: 136.954547, timeToNext: 5 },
  { name: "大府",       lat: 35.008769, lng: 136.96176, timeToNext: 5 },
  { name: "岡崎",       lat: 34.925583, lng: 137.157307, timeToNext: 10 },
  { name: "幸田",       lat: 34.860046, lng: 137.164333, timeToNext: 8 },
  { name: "蒲郡",       lat: 34.822990, lng: 137.216960, timeToNext: 8 },
  { name: "三河三谷",   lat: 34.818306, lng: 137.249286, timeToNext: 5 },
  { name: "豊橋",       lat: 34.763055, lng: 137.382176, timeToNext: 0 },
];

// 豊橋鉄道渥美線: 新豊橋〜三河田原
export const toyohashiAtsumiLine: Station[] = [
  { name: "新豊橋",     lat: 34.768340, lng: 137.386570, timeToNext: 4 },
  { name: "柳生橋",     lat: 34.754669, lng: 137.388568, timeToNext: 4 },
  { name: "小池",       lat: 34.769450, lng: 137.329180, timeToNext: 4 },
  { name: "愛知大学前", lat: 34.775050, lng: 137.314370, timeToNext: 4 },
  { name: "南栄",       lat: 34.760220, lng: 137.280480, timeToNext: 4 },
  { name: "高師",       lat: 34.748880, lng: 137.265380, timeToNext: 4 },
  { name: "芦原",       lat: 34.738040, lng: 137.249440, timeToNext: 4 },
  { name: "植田",       lat: 34.730360, lng: 137.225560, timeToNext: 4 },
  { name: "向ケ丘",     lat: 34.725750, lng: 137.210640, timeToNext: 4 },
  { name: "神戸",       lat: 34.720100, lng: 137.183890, timeToNext: 4 },
  { name: "大清水",     lat: 34.6960273, lng: 137.3590317, timeToNext: 4 },
  { name: "老津",       lat: 34.6922788, lng: 137.3347362, timeToNext: 4 },
  { name: "やぐま台",   lat: 34.673825, lng: 137.3095503, timeToNext: 4 },
  { name: "豊島",       lat: 34.6676186, lng: 137.2940089, timeToNext: 4 },
  { name: "神戸ノ森",   lat: 34.735090, lng: 137.053880, timeToNext: 4 },
  { name: "三河田原",   lat: 34.666858, lng: 137.2690362, timeToNext: 0 },
];

// 名古屋市営地下鉄名港線: 金山〜名古屋港
export const nagoyaMeikoLine: Station[] = [
  { name: "金山",       lat: 35.143440, lng: 136.899110, timeToNext: 3 },
  { name: "日比野",     lat: 35.130170, lng: 136.906530, timeToNext: 3 },
  { name: "六番町",     lat: 35.124074, lng: 136.888359, timeToNext: 3 },
  { name: "港区役所",   lat: 35.106110, lng: 136.893760, timeToNext: 3 },
  { name: "東海通",     lat: 35.113467, lng: 136.886004, timeToNext: 3 },
  { name: "港",         lat: 35.086470, lng: 136.871290, timeToNext: 3 },
  { name: "築地口",     lat: 35.100001, lng: 136.883164, timeToNext: 3 },
  { name: "名古屋港",   lat: 35.093099, lng: 136.881905, timeToNext: 0 },
];

// 名鉄豊田線: 梅坪〜赤池
export const meitetsuToyotaLine: Station[] = [
  { name: "梅坪",       lat: 35.09997, lng: 137.162414, timeToNext: 5 },
  { name: "上豊田",     lat: 35.116584, lng: 137.154651, timeToNext: 4 },
  { name: "浄水",       lat: 35.121365, lng: 137.137303, timeToNext: 4 },
  { name: "三好ケ丘",   lat: 35.084940, lng: 137.068310, timeToNext: 4 },
  { name: "黒笹",       lat: 35.127648, lng: 137.091444, timeToNext: 4 },
  { name: "米野木",     lat: 35.123911, lng: 137.066958, timeToNext: 4 },
  { name: "日進",       lat: 35.1184515, lng: 137.0488416, timeToNext: 4 },
  { name: "赤池",       lat: 35.1210641, lng: 137.0186404, timeToNext: 0 },
];

