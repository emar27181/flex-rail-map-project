import type { Station } from './yamanote';

// JR城端線: 高岡〜城端
export const jrJohanaLine: Station[] = [
  { name: "高岡",     lat: 36.754300, lng: 137.025800, timeToNext: 4 },
  { name: "新高岡",   lat: 36.748100, lng: 136.990500, timeToNext: 4 },
  { name: "二塚",     lat: 36.733200, lng: 137.022200, timeToNext: 4 },
  { name: "林",       lat: 36.718000, lng: 137.027100, timeToNext: 3 },
  { name: "戸出",     lat: 36.695000, lng: 137.033300, timeToNext: 4 },
  { name: "油田",     lat: 36.667000, lng: 137.024500, timeToNext: 4 },
  { name: "砺波",     lat: 36.652500, lng: 136.999300, timeToNext: 4 },
  { name: "東野尻",   lat: 36.627100, lng: 136.991000, timeToNext: 3 },
  { name: "野尻",     lat: 36.618300, lng: 136.988200, timeToNext: 5 },
  { name: "福野",     lat: 36.567600, lng: 136.929200, timeToNext: 5 },
  { name: "高儀",     lat: 36.546800, lng: 136.900000, timeToNext: 4 },
  { name: "福光",     lat: 36.543500, lng: 136.879300, timeToNext: 4 },
  { name: "越中山田", lat: 36.530400, lng: 136.869900, timeToNext: 4 },
  { name: "城端",     lat: 36.511900, lng: 136.863800, timeToNext: 0 },
];

// JR氷見線: 高岡〜氷見
export const jrHimiLine: Station[] = [
  { name: "高岡",     lat: 36.754300, lng: 137.025800, timeToNext: 4 },
  { name: "越中中川", lat: 36.769000, lng: 137.009000, timeToNext: 4 },
  { name: "能町",     lat: 36.786000, lng: 136.996000, timeToNext: 4 },
  { name: "伏木",     lat: 36.815000, lng: 136.982000, timeToNext: 4 },
  { name: "越中国分", lat: 36.828000, lng: 136.979000, timeToNext: 4 },
  { name: "雨晴",     lat: 36.845000, lng: 136.969000, timeToNext: 4 },
  { name: "島尾",     lat: 36.852000, lng: 136.979000, timeToNext: 4 },
  { name: "氷見",     lat: 36.860000, lng: 136.987000, timeToNext: 0 },
];

// 叡山電鉄鞍馬線: 出町柳〜鞍馬
export const eizanKuramaLine: Station[] = [
  { name: "出町柳",   lat: 35.028260, lng: 135.774680, timeToNext: 3 },
  { name: "元田中",   lat: 35.035500, lng: 135.773790, timeToNext: 3 },
  { name: "茶山",     lat: 35.047640, lng: 135.770900, timeToNext: 3 },
  { name: "一乗寺",   lat: 35.055700, lng: 135.770720, timeToNext: 3 },
  { name: "修学院",   lat: 35.065110, lng: 135.775090, timeToNext: 3 },
  { name: "宝ヶ池",   lat: 35.072000, lng: 135.789000, timeToNext: 3 },
  { name: "三宅八幡", lat: 35.082000, lng: 135.797000, timeToNext: 3 },
  { name: "八幡前",   lat: 35.090000, lng: 135.806000, timeToNext: 3 },
  { name: "岩倉",     lat: 35.101000, lng: 135.817000, timeToNext: 4 },
  { name: "木野",     lat: 35.117000, lng: 135.810000, timeToNext: 4 },
  { name: "市原",     lat: 35.131000, lng: 135.800000, timeToNext: 4 },
  { name: "二ノ瀬",   lat: 35.138000, lng: 135.789000, timeToNext: 4 },
  { name: "貴船口",   lat: 35.143000, lng: 135.756000, timeToNext: 5 },
  { name: "鞍馬",     lat: 35.115000, lng: 135.768000, timeToNext: 0 },
];

// 南海加太線: 紀ノ川〜加太
export const nankaKadaLine: Station[] = [
  { name: "紀ノ川",   lat: 34.248800, lng: 135.182200, timeToNext: 5 },
  { name: "東松江",   lat: 34.244100, lng: 135.165500, timeToNext: 4 },
  { name: "中松江",   lat: 34.244500, lng: 135.148800, timeToNext: 4 },
  { name: "八幡前",   lat: 34.249300, lng: 135.130800, timeToNext: 4 },
  { name: "西ノ庄",   lat: 34.255100, lng: 135.113800, timeToNext: 4 },
  { name: "磯ノ浦",   lat: 34.250300, lng: 135.097200, timeToNext: 4 },
  { name: "加太",     lat: 34.260000, lng: 135.082200, timeToNext: 0 },
];

// JR境線: 米子〜境港
export const jrSakaiLine: Station[] = [
  { name: "米子",     lat: 35.428200, lng: 133.338200, timeToNext: 4 },
  { name: "博労町",   lat: 35.432200, lng: 133.327000, timeToNext: 3 },
  { name: "富士見町", lat: 35.437800, lng: 133.317800, timeToNext: 3 },
  { name: "三本松口", lat: 35.443500, lng: 133.306400, timeToNext: 3 },
  { name: "河崎口",   lat: 35.449200, lng: 133.293600, timeToNext: 3 },
  { name: "弓ヶ浜",   lat: 35.462800, lng: 133.278300, timeToNext: 3 },
  { name: "和田浜",   lat: 35.478500, lng: 133.267500, timeToNext: 3 },
  { name: "大篠津町", lat: 35.494200, lng: 133.256000, timeToNext: 3 },
  { name: "米子空港", lat: 35.505300, lng: 133.245500, timeToNext: 3 },
  { name: "中浜",     lat: 35.514000, lng: 133.236000, timeToNext: 3 },
  { name: "高松町",   lat: 35.522800, lng: 133.228500, timeToNext: 3 },
  { name: "余子",     lat: 35.530500, lng: 133.222500, timeToNext: 3 },
  { name: "上道",     lat: 35.537800, lng: 133.219000, timeToNext: 3 },
  { name: "馬場崎町", lat: 35.543500, lng: 133.217500, timeToNext: 3 },
  { name: "境港",     lat: 35.547800, lng: 133.225000, timeToNext: 0 },
];
