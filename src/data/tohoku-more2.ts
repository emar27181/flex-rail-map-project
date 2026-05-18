import type { Station } from './yamanote';

// JR気仙沼線（前谷地〜柳津）
export const jrKesennumaLine: Station[] = [
  { name: "前谷地",     lat: 38.628280, lng: 141.316700, timeToNext: 8 },
  { name: "陸前豊里",   lat: 38.640190, lng: 141.333300, timeToNext: 8 },
  { name: "御岳堂",     lat: 38.660380, lng: 141.381710, timeToNext: 8 },
  { name: "柳津",       lat: 38.686500, lng: 141.408990, timeToNext: 0 },
];

// 仙台空港鉄道: 名取〜仙台空港
export const sendaiAirportRailway: Station[] = [
  { name: "名取",       lat: 38.170140, lng: 140.885220, timeToNext: 5 },
  { name: "杜せきのした", lat: 38.147540, lng: 140.900530, timeToNext: 5 },
  { name: "美田園",     lat: 38.130350, lng: 140.907860, timeToNext: 4 },
  { name: "仙台空港",   lat: 38.136560, lng: 140.920670, timeToNext: 0 },
];

// JR大船渡線（一ノ関〜気仙沼）
export const jrOofunatoLine: Station[] = [
  { name: "一ノ関",     lat: 38.883440, lng: 141.127740, timeToNext: 8 },
  { name: "真滝",       lat: 38.856350, lng: 141.129190, timeToNext: 5 },
  { name: "陸中門崎",   lat: 38.826890, lng: 141.130460, timeToNext: 5 },
  { name: "柴宿",       lat: 38.806940, lng: 141.126410, timeToNext: 5 },
  { name: "摺沢",       lat: 38.786030, lng: 141.148760, timeToNext: 8 },
  { name: "千厩",       lat: 38.720920, lng: 141.207520, timeToNext: 10 },
  { name: "小梨",       lat: 38.725900, lng: 141.252770, timeToNext: 8 },
  { name: "矢越",       lat: 38.748060, lng: 141.268820, timeToNext: 8 },
  { name: "折壁",       lat: 38.783350, lng: 141.305710, timeToNext: 8 },
  { name: "新月",       lat: 38.825870, lng: 141.338610, timeToNext: 8 },
  { name: "気仙沼",     lat: 38.909850, lng: 141.573110, timeToNext: 0 },
];

// JR山田線（盛岡〜宮古）
export const jrYamadaLine: Station[] = [
  { name: "盛岡",       lat: 39.703480, lng: 141.153760, timeToNext: 5 },
  { name: "上米内",     lat: 39.745630, lng: 141.144590, timeToNext: 10 },
  { name: "大志田",     lat: 39.798860, lng: 141.170820, timeToNext: 12 },
  { name: "浅岸",       lat: 39.842360, lng: 141.184120, timeToNext: 10 },
  { name: "区界",       lat: 39.876360, lng: 141.220310, timeToNext: 15 },
  { name: "松草",       lat: 39.823850, lng: 141.376620, timeToNext: 12 },
  { name: "平津戸",     lat: 39.721280, lng: 141.474040, timeToNext: 10 },
  { name: "川内",       lat: 39.680100, lng: 141.540630, timeToNext: 10 },
  { name: "箱石",       lat: 39.660660, lng: 141.584790, timeToNext: 8 },
  { name: "陸中川井",   lat: 39.648960, lng: 141.615180, timeToNext: 10 },
  { name: "腹帯",       lat: 39.651940, lng: 141.691010, timeToNext: 8 },
  { name: "茂市",       lat: 39.655970, lng: 141.730260, timeToNext: 8 },
  { name: "蟇目",       lat: 39.654280, lng: 141.787510, timeToNext: 8 },
  { name: "千徳",       lat: 39.643010, lng: 141.843200, timeToNext: 5 },
  { name: "宮古",       lat: 39.641650, lng: 141.957440, timeToNext: 0 },
];

