import type { Station } from './yamanote';

// JR東海道本線（名古屋〜豊橋）: 名古屋〜豊橋
export const jrTokaidoNagoyaToyohashi: Station[] = [
  { name: "名古屋",     lat: 35.170695, lng: 136.881582, timeToNext: 5 },
  { name: "熱田",       lat: 35.124200, lng: 136.893680, timeToNext: 5 },
  { name: "金山",       lat: 35.143440, lng: 136.899110, timeToNext: 5 },
  { name: "笠寺",       lat: 35.094990, lng: 136.909790, timeToNext: 5 },
  { name: "大高",       lat: 35.059820, lng: 136.952150, timeToNext: 5 },
  { name: "共和",       lat: 35.047220, lng: 136.981970, timeToNext: 5 },
  { name: "大府",       lat: 34.972100, lng: 137.070110, timeToNext: 5 },
  { name: "岡崎",       lat: 34.955110, lng: 137.176800, timeToNext: 10 },
  { name: "幸田",       lat: 34.897330, lng: 137.205550, timeToNext: 8 },
  { name: "蒲郡",       lat: 34.822990, lng: 137.216960, timeToNext: 8 },
  { name: "三河三谷",   lat: 34.804530, lng: 137.278940, timeToNext: 5 },
  { name: "豊橋",       lat: 34.769710, lng: 137.392310, timeToNext: 0 },
];

// 豊橋鉄道渥美線: 新豊橋〜三河田原
export const toyohashiAtsumiLine: Station[] = [
  { name: "新豊橋",     lat: 34.768340, lng: 137.386570, timeToNext: 4 },
  { name: "柳生橋",     lat: 34.760870, lng: 137.366240, timeToNext: 4 },
  { name: "小池",       lat: 34.769450, lng: 137.329180, timeToNext: 4 },
  { name: "愛知大学前", lat: 34.775050, lng: 137.314370, timeToNext: 4 },
  { name: "南栄",       lat: 34.760220, lng: 137.280480, timeToNext: 4 },
  { name: "高師",       lat: 34.748880, lng: 137.265380, timeToNext: 4 },
  { name: "芦原",       lat: 34.738040, lng: 137.249440, timeToNext: 4 },
  { name: "植田",       lat: 34.730360, lng: 137.225560, timeToNext: 4 },
  { name: "向ケ丘",     lat: 34.725750, lng: 137.210640, timeToNext: 4 },
  { name: "神戸",       lat: 34.720100, lng: 137.183890, timeToNext: 4 },
  { name: "大清水",     lat: 34.713790, lng: 137.153280, timeToNext: 4 },
  { name: "老津",       lat: 34.710500, lng: 137.109030, timeToNext: 4 },
  { name: "やぐま台",   lat: 34.707640, lng: 137.073720, timeToNext: 4 },
  { name: "豊島",       lat: 34.715110, lng: 137.063710, timeToNext: 4 },
  { name: "神戸ノ森",   lat: 34.735090, lng: 137.053880, timeToNext: 4 },
  { name: "三河田原",   lat: 34.759590, lng: 137.038510, timeToNext: 0 },
];

// 名古屋市営地下鉄名港線: 金山〜名古屋港
export const nagoyaMeikoLine: Station[] = [
  { name: "金山",       lat: 35.143440, lng: 136.899110, timeToNext: 3 },
  { name: "日比野",     lat: 35.130170, lng: 136.906530, timeToNext: 3 },
  { name: "六番町",     lat: 35.118410, lng: 136.904940, timeToNext: 3 },
  { name: "港区役所",   lat: 35.106110, lng: 136.893760, timeToNext: 3 },
  { name: "東海通",     lat: 35.095280, lng: 136.882550, timeToNext: 3 },
  { name: "港",         lat: 35.086470, lng: 136.871290, timeToNext: 3 },
  { name: "築地口",     lat: 35.080100, lng: 136.862820, timeToNext: 3 },
  { name: "名古屋港",   lat: 35.075810, lng: 136.856380, timeToNext: 0 },
];

// 名鉄豊田線: 梅坪〜赤池
export const meitetsuToyotaLine: Station[] = [
  { name: "梅坪",       lat: 35.103250, lng: 137.146430, timeToNext: 5 },
  { name: "上豊田",     lat: 35.094230, lng: 137.132020, timeToNext: 4 },
  { name: "浄水",       lat: 35.087640, lng: 137.103570, timeToNext: 4 },
  { name: "三好ケ丘",   lat: 35.084940, lng: 137.068310, timeToNext: 4 },
  { name: "黒笹",       lat: 35.084090, lng: 137.047610, timeToNext: 4 },
  { name: "米野木",     lat: 35.082550, lng: 137.023070, timeToNext: 4 },
  { name: "日進",       lat: 35.085080, lng: 136.980380, timeToNext: 4 },
  { name: "赤池",       lat: 35.087220, lng: 136.962850, timeToNext: 0 },
];

