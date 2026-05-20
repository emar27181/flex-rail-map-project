import type { Station } from './yamanote';

// 西鉄太宰府線: 西鉄二日市〜太宰府
export const nishitetsuDazaifuLine: Station[] = [
  { name: "西鉄二日市", lat: 33.529140, lng: 130.494290, timeToNext: 3 },
  { name: "都府楼前",   lat: 33.527960, lng: 130.507330, timeToNext: 3 },
  { name: "太宰府",     lat: 33.513920, lng: 130.527410, timeToNext: 0 },
];

// 東武鬼怒川線: 下今市〜鬼怒川温泉
export const tobuKinugawaLine: Station[] = [
  { name: "下今市",     lat: 36.735380, lng: 139.668730, timeToNext: 5 },
  { name: "大谷向",     lat: 36.759920, lng: 139.663870, timeToNext: 4 },
  { name: "大桑",       lat: 36.788690, lng: 139.657570, timeToNext: 4 },
  { name: "新高徳",     lat: 36.820650, lng: 139.654780, timeToNext: 4 },
  { name: "小佐越",     lat: 36.843940, lng: 139.651710, timeToNext: 3 },
  { name: "鬼怒川公園", lat: 36.847110, lng: 139.657030, timeToNext: 3 },
  { name: "鬼怒川温泉", lat: 36.856190, lng: 139.667530, timeToNext: 0 },
];

// いすみ鉄道: 大原〜上総中野
export const isumiRailway: Station[] = [
  { name: "大原",         lat: 35.279090, lng: 140.388170, timeToNext: 5 },
  { name: "西大原",       lat: 35.260530, lng: 140.363320, timeToNext: 5 },
  { name: "東浪見",       lat: 35.250430, lng: 140.340650, timeToNext: 5 },
  { name: "太東",         lat: 35.247360, lng: 140.318600, timeToNext: 5 },
  { name: "城見ヶ丘",     lat: 35.251000, lng: 140.305250, timeToNext: 4 },
  { name: "大多喜",       lat: 35.253170, lng: 140.278840, timeToNext: 5 },
  { name: "新田野",       lat: 35.252810, lng: 140.251520, timeToNext: 5 },
  { name: "総元",         lat: 35.248970, lng: 140.228720, timeToNext: 5 },
  { name: "西畑",         lat: 35.238070, lng: 140.189090, timeToNext: 5 },
  { name: "上総中野",     lat: 35.219910, lng: 140.161770, timeToNext: 0 },
];

// 関東鉄道竜ヶ崎線: 龍ケ崎市〜竜ヶ崎
export const kantoRailwayRyugasaki: Station[] = [
  { name: "龍ケ崎市",   lat: 35.915280, lng: 140.136350, timeToNext: 3 },
  { name: "入地",       lat: 35.897450, lng: 140.138290, timeToNext: 3 },
  { name: "竜ヶ崎",     lat: 35.887490, lng: 140.139520, timeToNext: 0 },
];
