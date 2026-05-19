import type { Station } from './yamanote';

// JR播但線: 姫路〜和田山
export const jrBantanLine: Station[] = [
  { name: "姫路",       lat: 34.826450, lng: 134.693800, timeToNext: 5 },
  { name: "京口",       lat: 34.845980, lng: 134.695040, timeToNext: 3 },
  { name: "野里",       lat: 34.861350, lng: 134.692220, timeToNext: 4 },
  { name: "砥堀",       lat: 34.881710, lng: 134.681560, timeToNext: 4 },
  { name: "仁豊野",     lat: 34.900520, lng: 134.678390, timeToNext: 5 },
  { name: "溝口",       lat: 34.924530, lng: 134.676330, timeToNext: 5 },
  { name: "福崎",       lat: 34.950280, lng: 134.679630, timeToNext: 5 },
  { name: "甘地",       lat: 34.972800, lng: 134.695400, timeToNext: 5 },
  { name: "鶴居",       lat: 34.993210, lng: 134.709650, timeToNext: 5 },
  { name: "新野",       lat: 35.017840, lng: 134.730280, timeToNext: 5 },
  { name: "寺前",       lat: 35.043380, lng: 134.756710, timeToNext: 8 },
  { name: "長谷",       lat: 35.069850, lng: 134.796680, timeToNext: 8 },
  { name: "生野",       lat: 35.093470, lng: 134.820780, timeToNext: 10 },
  { name: "新井",       lat: 35.127140, lng: 134.840260, timeToNext: 8 },
  { name: "青倉",       lat: 35.175360, lng: 134.870050, timeToNext: 8 },
  { name: "竹田",       lat: 35.273100, lng: 134.888780, timeToNext: 10 },
  { name: "和田山",     lat: 35.332180, lng: 134.873140, timeToNext: 0 },
];

// JR加古川線: 加古川〜谷川
export const jrKakogawaLine: Station[] = [
  { name: "加古川",     lat: 34.757170, lng: 134.840850, timeToNext: 5 },
  { name: "日岡",       lat: 34.786680, lng: 134.847310, timeToNext: 4 },
  { name: "神野",       lat: 34.803230, lng: 134.864240, timeToNext: 5 },
  { name: "厄神",       lat: 34.841070, lng: 134.895150, timeToNext: 6 },
  { name: "市場",       lat: 34.875420, lng: 134.914870, timeToNext: 5 },
  { name: "小野町",     lat: 34.904630, lng: 134.924020, timeToNext: 4 },
  { name: "粟生",       lat: 34.915620, lng: 134.964960, timeToNext: 8 },
  { name: "河合西",     lat: 34.966350, lng: 134.989230, timeToNext: 5 },
  { name: "青野ヶ原",   lat: 34.992060, lng: 135.009700, timeToNext: 5 },
  { name: "社町",       lat: 34.986360, lng: 135.040490, timeToNext: 6 },
  { name: "滝野",       lat: 34.960880, lng: 135.024100, timeToNext: 6 },
  { name: "西脇市",     lat: 34.992060, lng: 135.009700, timeToNext: 5 },
  { name: "新西脇",     lat: 35.007460, lng: 135.026370, timeToNext: 5 },
  { name: "比延",       lat: 35.041830, lng: 135.028910, timeToNext: 5 },
  { name: "日本へそ公園", lat: 35.067410, lng: 135.038870, timeToNext: 5 },
  { name: "黒田庄",     lat: 35.094270, lng: 135.042550, timeToNext: 8 },
  { name: "本黒田",     lat: 35.119360, lng: 135.070980, timeToNext: 5 },
  { name: "久下村",     lat: 35.148410, lng: 135.092370, timeToNext: 5 },
  { name: "谷川",       lat: 35.136450, lng: 135.091800, timeToNext: 0 },
];

// 智頭急行智頭線: 上郡〜智頭
export const chizuExpressLine: Station[] = [
  { name: "上郡",       lat: 34.864580, lng: 134.341580, timeToNext: 8 },
  { name: "苔縄",       lat: 35.025420, lng: 134.393020, timeToNext: 10 },
  { name: "久崎",       lat: 35.057380, lng: 134.408710, timeToNext: 8 },
  { name: "佐用",       lat: 34.997510, lng: 134.362110, timeToNext: 10 },
  { name: "平福",       lat: 34.938170, lng: 134.390470, timeToNext: 8 },
  { name: "石井",       lat: 35.016720, lng: 134.441970, timeToNext: 8 },
  { name: "宮本武蔵",   lat: 35.045870, lng: 134.464840, timeToNext: 8 },
  { name: "大原",       lat: 35.067560, lng: 134.488220, timeToNext: 10 },
  { name: "西粟倉",     lat: 35.104710, lng: 134.491510, timeToNext: 8 },
  { name: "あわくら温泉", lat: 35.125380, lng: 134.506820, timeToNext: 8 },
  { name: "山郷",       lat: 35.151820, lng: 134.528540, timeToNext: 8 },
  { name: "恋山形",     lat: 35.185510, lng: 134.541060, timeToNext: 6 },
  { name: "土師",       lat: 35.188740, lng: 134.561770, timeToNext: 5 },
  { name: "智頭",       lat: 35.219070, lng: 134.210530, timeToNext: 0 },
];

// 三岐鉄道本線: 富田〜西藤原
export const sangiBonsen: Station[] = [
  { name: "富田",       lat: 35.000380, lng: 136.532380, timeToNext: 4 },
  { name: "近鉄富田",   lat: 34.995040, lng: 136.534340, timeToNext: 4 },
  { name: "大矢知",     lat: 34.989060, lng: 136.549550, timeToNext: 4 },
  { name: "保々",       lat: 34.990840, lng: 136.572450, timeToNext: 4 },
  { name: "北勢中央公園口", lat: 35.000820, lng: 136.590340, timeToNext: 4 },
  { name: "山城",       lat: 35.014080, lng: 136.599840, timeToNext: 5 },
  { name: "いなべ",     lat: 35.037000, lng: 136.608640, timeToNext: 5 },
  { name: "大安",       lat: 35.060960, lng: 136.602580, timeToNext: 5 },
  { name: "丹生川",     lat: 35.088120, lng: 136.591820, timeToNext: 5 },
  { name: "伊勢治田",   lat: 35.101430, lng: 136.578640, timeToNext: 5 },
  { name: "East西藤原", lat: 35.125380, lng: 136.554900, timeToNext: 5 },
  { name: "西藤原",     lat: 35.145900, lng: 136.525870, timeToNext: 0 },
];

// 伊賀鉄道伊賀線: 伊賀上野〜伊賀神戸
export const igaRailway: Station[] = [
  { name: "伊賀上野",   lat: 34.773520, lng: 136.128810, timeToNext: 5 },
  { name: "西大手",     lat: 34.768720, lng: 136.136220, timeToNext: 3 },
  { name: "上野市",     lat: 34.767230, lng: 136.139450, timeToNext: 4 },
  { name: "広小路",     lat: 34.763520, lng: 136.145290, timeToNext: 3 },
  { name: "上野新都市", lat: 34.757820, lng: 136.150820, timeToNext: 4 },
  { name: "市部",       lat: 34.746370, lng: 136.159040, timeToNext: 5 },
  { name: "依那古",     lat: 34.733780, lng: 136.163910, timeToNext: 5 },
  { name: "蛍池",       lat: 34.721440, lng: 136.170600, timeToNext: 4 },
  { name: "比土",       lat: 34.706060, lng: 136.179560, timeToNext: 5 },
  { name: "丸山",       lat: 34.690780, lng: 136.193840, timeToNext: 5 },
  { name: "茅町",       lat: 34.676540, lng: 136.217890, timeToNext: 5 },
  { name: "伊賀神戸",   lat: 34.682630, lng: 136.200200, timeToNext: 0 },
];
