import type { Station } from './yamanote';

// JR気仙沼線（前谷地〜柳津）
export const jrKesennumaLine: Station[] = [
  { name: "前谷地",     lat: 38.512315, lng: 141.193870, timeToNext: 8 },
  { name: "陸前豊里",   lat: 38.582576, lng: 141.244414, timeToNext: 8 },
  { name: "御岳堂",     lat: 38.605694, lng: 141.264802, timeToNext: 8 },
  { name: "柳津",       lat: 38.611689, lng: 141.305904, timeToNext: 0 },
];

// 仙台空港鉄道: 名取〜仙台空港
export const sendaiAirportRailway: Station[] = [
  { name: "名取",       lat: 38.170140, lng: 140.885220, timeToNext: 5 },
  { name: "杜せきのした", lat: 38.147540, lng: 140.900530, timeToNext: 5 },
  { name: "美田園",     lat: 38.159668, lng: 140.917464, timeToNext: 4 },
  { name: "仙台空港",   lat: 38.136560, lng: 140.920670, timeToNext: 0 },
];

// JR大船渡線（一ノ関〜気仙沼）
export const jrOofunatoLine: Station[] = [
  { name: "一ノ関",     lat: 38.926881, lng: 141.138902, timeToNext: 8 },
  { name: "真滝",       lat: 38.908440, lng: 141.177926, timeToNext: 5 },
  { name: "陸中門崎",   lat: 38.917074, lng: 141.251257, timeToNext: 5 },
  { name: "柴宿",       lat: 38.996801, lng: 141.272437, timeToNext: 5 },
  { name: "摺沢",       lat: 38.995968, lng: 141.321428, timeToNext: 8 },
  { name: "千厩",       lat: 38.924595, lng: 141.345767, timeToNext: 10 },
  { name: "小梨",       lat: 38.932545, lng: 141.384421, timeToNext: 8 },
  { name: "矢越",       lat: 38.935262, lng: 141.429451, timeToNext: 8 },
  { name: "折壁",       lat: 38.939509, lng: 141.452398, timeToNext: 8 },
  { name: "新月",       lat: 38.915438, lng: 141.489317, timeToNext: 8 },
  { name: "気仙沼",     lat: 38.909850, lng: 141.573110, timeToNext: 0 },
];

// JR山田線（盛岡〜宮古）
export const jrYamadaLine: Station[] = [
  { name: "盛岡",       lat: 39.703480, lng: 141.153760, timeToNext: 5 },
  { name: "上米内",     lat: 39.743923, lng: 141.203835, timeToNext: 10 },
  { name: "大志田",     lat: 39.798860, lng: 141.170820, timeToNext: 12 },
  { name: "浅岸",       lat: 39.842360, lng: 141.184120, timeToNext: 10 },
  { name: "区界",       lat: 39.651760, lng: 141.351454, timeToNext: 15 },
  { name: "松草",       lat: 39.635725, lng: 141.437699, timeToNext: 12 },
  { name: "平津戸",     lat: 39.623521, lng: 141.511801, timeToNext: 10 },
  { name: "川内",       lat: 39.640706, lng: 141.597764, timeToNext: 10 },
  { name: "箱石",       lat: 39.617396, lng: 141.625553, timeToNext: 8 },
  { name: "陸中川井",   lat: 39.597222, lng: 141.681311, timeToNext: 10 },
  { name: "腹帯",       lat: 39.604520, lng: 141.767705, timeToNext: 8 },
  { name: "茂市",       lat: 39.620630, lng: 141.799003, timeToNext: 8 },
  { name: "蟇目",       lat: 39.629670, lng: 141.838804, timeToNext: 8 },
  { name: "千徳",       lat: 39.632314, lng: 141.912321, timeToNext: 5 },
  { name: "宮古",       lat: 39.641650, lng: 141.957440, timeToNext: 0 },
];

