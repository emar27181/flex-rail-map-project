import type { Station } from './yamanote';

// 京都丹後鉄道宮福線: 福知山〜宮津
export const kyototangoMiyafuku: Station[] = [
  { name: "福知山",     lat: 35.295200, lng: 135.126520, timeToNext: 8 },
  { name: "荒河かしの木台", lat: 35.320450, lng: 135.146830, timeToNext: 5 },
  { name: "牧",         lat: 35.331610, lng: 135.163510, timeToNext: 5 },
  { name: "辛皮",       lat: 35.356440, lng: 135.166340, timeToNext: 6 },
  { name: "鍛冶屋",     lat: 35.375760, lng: 135.172310, timeToNext: 5 },
  { name: "大江山口内宮", lat: 35.403270, lng: 135.186270, timeToNext: 5 },
  { name: "二俣",       lat: 35.419620, lng: 135.194290, timeToNext: 6 },
  { name: "大町",       lat: 35.435800, lng: 135.185670, timeToNext: 5 },
  { name: "喜多",       lat: 35.451040, lng: 135.200870, timeToNext: 8 },
  { name: "宮津",       lat: 35.537360, lng: 135.196080, timeToNext: 0 },
];

// 京都丹後鉄道宮豊線: 宮津〜豊岡
export const kyototangoMiyatoyo: Station[] = [
  { name: "宮津",       lat: 35.537360, lng: 135.196080, timeToNext: 5 },
  { name: "天橋立",     lat: 35.568830, lng: 135.180450, timeToNext: 6 },
  { name: "岩滝口",     lat: 35.586570, lng: 135.140760, timeToNext: 8 },
  { name: "野田川",     lat: 35.607660, lng: 135.126410, timeToNext: 6 },
  { name: "京丹後大宮", lat: 35.609400, lng: 135.069100, timeToNext: 8 },
  { name: "峰山",       lat: 35.616350, lng: 135.060380, timeToNext: 5 },
  { name: "網野",       lat: 35.648860, lng: 135.004760, timeToNext: 8 },
  { name: "木津温泉",   lat: 35.657640, lng: 134.964310, timeToNext: 6 },
  { name: "夕日ヶ浦木津温泉", lat: 35.662180, lng: 134.950620, timeToNext: 5 },
  { name: "小天橋",     lat: 35.666050, lng: 134.926480, timeToNext: 5 },
  { name: "久美浜",     lat: 35.616640, lng: 134.853920, timeToNext: 10 },
  { name: "コウノトリの郷", lat: 35.607430, lng: 134.826550, timeToNext: 8 },
  { name: "豊岡",       lat: 35.540830, lng: 134.812110, timeToNext: 0 },
];

// 京都丹後鉄道宮舞線: 宮津〜西舞鶴
export const kyototangoMiyamai: Station[] = [
  { name: "宮津",       lat: 35.537360, lng: 135.196080, timeToNext: 5 },
  { name: "朝来",       lat: 35.487450, lng: 135.185640, timeToNext: 5 },
  { name: "丹後由良",   lat: 35.455810, lng: 135.201870, timeToNext: 8 },
  { name: "栗田",       lat: 35.480930, lng: 135.326800, timeToNext: 8 },
  { name: "丹後神崎",   lat: 35.472910, lng: 135.367600, timeToNext: 5 },
  { name: "丹後大宮",   lat: 35.463680, lng: 135.389220, timeToNext: 5 },
  { name: "東雲",       lat: 35.453490, lng: 135.406820, timeToNext: 5 },
  { name: "四所",       lat: 35.447430, lng: 135.427350, timeToNext: 4 },
  { name: "西舞鶴",     lat: 35.467110, lng: 135.385900, timeToNext: 0 },
];

// 近江鉄道本線: 米原〜貴生川（彦根・八日市経由）
export const omiRailwayMain: Station[] = [
  { name: "米原",       lat: 35.316330, lng: 136.284710, timeToNext: 5 },
  { name: "フジテック前", lat: 35.295040, lng: 136.267380, timeToNext: 5 },
  { name: "鳥居本",     lat: 35.282420, lng: 136.248930, timeToNext: 5 },
  { name: "彦根",       lat: 35.272790, lng: 136.252490, timeToNext: 4 },
  { name: "彦根口",     lat: 35.258160, lng: 136.245470, timeToNext: 4 },
  { name: "高宮",       lat: 35.247600, lng: 136.236830, timeToNext: 4 },
  { name: "武佐",       lat: 35.226660, lng: 136.208010, timeToNext: 5 },
  { name: "近江八幡",   lat: 35.175490, lng: 136.106200, timeToNext: 8 },
  { name: "八日市",     lat: 35.114490, lng: 136.152850, timeToNext: 8 },
  { name: "新八日市",   lat: 35.108930, lng: 136.159380, timeToNext: 4 },
  { name: "太郎坊宮前", lat: 35.099420, lng: 136.178440, timeToNext: 4 },
  { name: "市辺",       lat: 35.091270, lng: 136.193310, timeToNext: 4 },
  { name: "平田",       lat: 35.069280, lng: 136.205820, timeToNext: 4 },
  { name: "日野",       lat: 35.014820, lng: 136.256550, timeToNext: 10 },
  { name: "水口城南",   lat: 34.950370, lng: 136.164970, timeToNext: 5 },
  { name: "水口",       lat: 34.958060, lng: 136.167900, timeToNext: 4 },
  { name: "水口石橋",   lat: 34.966870, lng: 136.165340, timeToNext: 4 },
  { name: "貴生川",     lat: 34.962180, lng: 136.147500, timeToNext: 0 },
];

// 信楽高原鐵道: 貴生川〜信楽
export const shigarakiRailway: Station[] = [
  { name: "貴生川",     lat: 34.962180, lng: 136.147500, timeToNext: 5 },
  { name: "紫香楽宮跡", lat: 35.003220, lng: 136.117200, timeToNext: 5 },
  { name: "雲井",       lat: 35.020450, lng: 136.109280, timeToNext: 4 },
  { name: "勅旨",       lat: 35.049060, lng: 136.078720, timeToNext: 5 },
  { name: "玉桂寺前",   lat: 35.058620, lng: 136.059040, timeToNext: 4 },
  { name: "信楽",       lat: 34.888620, lng: 136.003300, timeToNext: 0 },
];
