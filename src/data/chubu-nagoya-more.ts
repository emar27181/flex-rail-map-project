import type { Station } from './yamanote';

// 名鉄瀬戸線: 栄町〜尾張瀬戸
export const meitetsuSetoLine: Station[] = [
  { name: "栄町",               lat: 35.170200, lng: 136.908200, timeToNext: 3 },
  { name: "東大手",             lat: 35.174800, lng: 136.917100, timeToNext: 2 },
  { name: "清水",               lat: 35.181300, lng: 136.922800, timeToNext: 2 },
  { name: "尼ヶ坂",             lat: 35.186700, lng: 136.931800, timeToNext: 2 },
  { name: "森下",               lat: 35.192100, lng: 136.942300, timeToNext: 2 },
  { name: "大曽根",             lat: 35.196400, lng: 136.952000, timeToNext: 3 },
  { name: "ナゴヤドーム前矢田", lat: 35.196000, lng: 136.962900, timeToNext: 2 },
  { name: "矢田",               lat: 35.197800, lng: 136.970700, timeToNext: 2 },
  { name: "瓢箪山",             lat: 35.202800, lng: 136.982600, timeToNext: 3 },
  { name: "守山自衛隊前",       lat: 35.205800, lng: 136.991200, timeToNext: 2 },
  { name: "喜多山",             lat: 35.210900, lng: 137.004600, timeToNext: 3 },
  { name: "大森・金城学院前",   lat: 35.215100, lng: 137.020100, timeToNext: 3 },
  { name: "印場",               lat: 35.217700, lng: 137.035600, timeToNext: 3 },
  { name: "旭前",               lat: 35.219500, lng: 137.047300, timeToNext: 3 },
  { name: "三郷",               lat: 35.220100, lng: 137.060400, timeToNext: 3 },
  { name: "水野",               lat: 35.223800, lng: 137.069700, timeToNext: 2 },
  { name: "新瀬戸",             lat: 35.225100, lng: 137.075200, timeToNext: 2 },
  { name: "瀬戸市役所前",       lat: 35.226100, lng: 137.078600, timeToNext: 2 },
  { name: "尾張瀬戸",           lat: 35.227000, lng: 137.084100, timeToNext: 0 },
];

// リニモ (愛知高速交通東部丘陵線): 藤が丘〜八草
export const linimo: Station[] = [
  { name: "藤が丘",             lat: 35.170200, lng: 137.018000, timeToNext: 3 },
  { name: "はなみずき通",       lat: 35.173200, lng: 137.031600, timeToNext: 3 },
  { name: "杁ヶ池公園",         lat: 35.175000, lng: 137.045200, timeToNext: 3 },
  { name: "長久手古戦場",       lat: 35.179500, lng: 137.062000, timeToNext: 3 },
  { name: "公園西",             lat: 35.186700, lng: 137.079500, timeToNext: 3 },
  { name: "愛・地球博記念公園", lat: 35.193200, lng: 137.092000, timeToNext: 3 },
  { name: "芸大通",             lat: 35.199500, lng: 137.104500, timeToNext: 3 },
  { name: "陶磁資料館南",       lat: 35.206100, lng: 137.115700, timeToNext: 3 },
  { name: "八草",               lat: 35.215800, lng: 137.134500, timeToNext: 0 },
];

// 名古屋市営地下鉄上飯田線: 上飯田〜平安通
export const nagoyaKamiidaLine: Station[] = [
  { name: "上飯田",             lat: 35.197600, lng: 136.905200, timeToNext: 2 },
  { name: "平安通",             lat: 35.187100, lng: 136.907800, timeToNext: 0 },
];

// 名鉄尾西線: 弥富〜玉ノ井
export const meitetsuBisaiLine: Station[] = [
  { name: "弥富",               lat: 35.082800, lng: 136.728400, timeToNext: 5 },
  { name: "五ノ三",             lat: 35.095500, lng: 136.755000, timeToNext: 5 },
  { name: "佐屋",               lat: 35.107400, lng: 136.765800, timeToNext: 8 },
  { name: "日比野",             lat: 35.142200, lng: 136.778300, timeToNext: 8 },
  { name: "津島",               lat: 35.178900, lng: 136.767200, timeToNext: 8 },
  { name: "勝幡",               lat: 35.210400, lng: 136.786700, timeToNext: 5 },
  { name: "藤浪",               lat: 35.224100, lng: 136.795500, timeToNext: 4 },
  { name: "木田",               lat: 35.237800, lng: 136.805200, timeToNext: 4 },
  { name: "青塚",               lat: 35.247800, lng: 136.815700, timeToNext: 3 },
  { name: "稲沢市役所前",       lat: 35.251300, lng: 136.827900, timeToNext: 3 },
  { name: "奥町",               lat: 35.257800, lng: 136.833200, timeToNext: 3 },
  { name: "玉ノ井",             lat: 35.270300, lng: 136.840100, timeToNext: 0 },
];
