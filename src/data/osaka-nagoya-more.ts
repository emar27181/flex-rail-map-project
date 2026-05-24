import type { Station } from './yamanote';

// JR東西線（大阪）: 京橋〜尼崎
export const jrOsakaTozaiLine: Station[] = [
  { name: "京橋",       lat: 34.694380, lng: 135.530290, timeToNext: 3 },
  { name: "大阪城北詰", lat: 34.687620, lng: 135.527140, timeToNext: 2 },
  { name: "大阪天満宮", lat: 34.693010, lng: 135.513870, timeToNext: 2 },
  { name: "北新地",     lat: 34.696870, lng: 135.498610, timeToNext: 2 },
  { name: "新福島",     lat: 34.699450, lng: 135.487100, timeToNext: 2 },
  { name: "海老江",     lat: 34.700940, lng: 135.474760, timeToNext: 2 },
  { name: "御幣島",     lat: 34.703060, lng: 135.459790, timeToNext: 2 },
  { name: "加島",       lat: 34.712150, lng: 135.441480, timeToNext: 3 },
  { name: "尼崎",       lat: 34.718550, lng: 135.415960, timeToNext: 0 },
];

// 名古屋臨海高速鉄道あおなみ線: 名古屋〜金城ふ頭
export const nagoyaAonamiLine: Station[] = [
  { name: "名古屋",         lat: 35.170470, lng: 136.881730, timeToNext: 3 },
  { name: "ささしまライブ",  lat: 35.159840, lng: 136.876750, timeToNext: 3 },
  { name: "小本",           lat: 35.146640, lng: 136.857860, timeToNext: 3 },
  { name: "荒子",           lat: 35.139710, lng: 136.849780, timeToNext: 2 },
  { name: "南荒子",         lat: 35.134760, lng: 136.851920, timeToNext: 2 },
  { name: "中島",           lat: 35.118570, lng: 136.851020, timeToNext: 2 },
  { name: "名古屋競馬場前", lat: 35.110940, lng: 136.849260, timeToNext: 3 },
  { name: "中川",           lat: 35.099820, lng: 136.848500, timeToNext: 2 },
  { name: "黄金",           lat: 35.091570, lng: 136.844160, timeToNext: 3 },
  { name: "荒子川公園",     lat: 35.081640, lng: 136.843260, timeToNext: 3 },
  { name: "稲永",           lat: 35.073390, lng: 136.842480, timeToNext: 3 },
  { name: "野跡",           lat: 35.077440, lng: 136.847680, timeToNext: 3 },
  { name: "金城ふ頭",       lat: 35.073680, lng: 136.851050, timeToNext: 0 },
];
