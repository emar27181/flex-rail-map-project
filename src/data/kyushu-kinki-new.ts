import type { Station } from './yamanote';

// JR若松線: 折尾〜若松
export const jrWakamatsuLine: Station[] = [
  { name: "折尾",   lat: 33.874800, lng: 130.682000, timeToNext: 4 },
  { name: "奥洞海", lat: 33.880200, lng: 130.697800, timeToNext: 4 },
  { name: "二島",   lat: 33.885600, lng: 130.723200, timeToNext: 4 },
  { name: "本城",   lat: 33.891200, lng: 130.740300, timeToNext: 4 },
  { name: "藤ノ木", lat: 33.897000, lng: 130.768200, timeToNext: 4 },
  { name: "若松",   lat: 33.904800, lng: 130.803800, timeToNext: 0 },
];

// JR香椎線: 西戸崎〜宇美
export const jrKashiiLine: Station[] = [
  { name: "西戸崎",     lat: 33.625800, lng: 130.455100, timeToNext: 4 },
  { name: "海ノ中道",   lat: 33.631000, lng: 130.437800, timeToNext: 4 },
  { name: "雁ノ巣",     lat: 33.625200, lng: 130.418600, timeToNext: 3 },
  { name: "香椎海岸",   lat: 33.617000, lng: 130.406200, timeToNext: 3 },
  { name: "香椎",       lat: 33.610200, lng: 130.413000, timeToNext: 3 },
  { name: "舞松原",     lat: 33.601200, lng: 130.421300, timeToNext: 3 },
  { name: "土井",       lat: 33.591800, lng: 130.435200, timeToNext: 3 },
  { name: "伊賀",       lat: 33.578200, lng: 130.449200, timeToNext: 3 },
  { name: "長者原",     lat: 33.568000, lng: 130.453200, timeToNext: 4 },
  { name: "酒殿",       lat: 33.554200, lng: 130.463100, timeToNext: 4 },
  { name: "須惠",       lat: 33.539800, lng: 130.468200, timeToNext: 3 },
  { name: "須惠中央",   lat: 33.528800, lng: 130.468600, timeToNext: 3 },
  { name: "宇美",       lat: 33.518800, lng: 130.477200, timeToNext: 0 },
];

// JR原田線（筑豊本線）: 桂川〜原田
export const jrHaradaLine: Station[] = [
  { name: "桂川",       lat: 33.561200, lng: 130.681100, timeToNext: 6 },
  { name: "筑前内野",   lat: 33.529800, lng: 130.659200, timeToNext: 5 },
  { name: "上穂波",     lat: 33.507200, lng: 130.640800, timeToNext: 5 },
  { name: "筑前山家",   lat: 33.482100, lng: 130.634800, timeToNext: 5 },
  { name: "九郎原",     lat: 33.457200, lng: 130.620800, timeToNext: 5 },
  { name: "城戸南蔵院前", lat: 33.437200, lng: 130.607100, timeToNext: 5 },
  { name: "筑前夜須",   lat: 33.419800, lng: 130.590800, timeToNext: 4 },
  { name: "今隈",       lat: 33.410100, lng: 130.583200, timeToNext: 4 },
  { name: "筑前池田",   lat: 33.399100, lng: 130.581200, timeToNext: 4 },
  { name: "天拝山",     lat: 33.388200, lng: 130.578100, timeToNext: 4 },
  { name: "原田",       lat: 33.380100, lng: 130.575200, timeToNext: 0 },
];

// 嵐電北野線: 北野白梅町〜帷子ノ辻
export const keifukuKitanoLine: Station[] = [
  { name: "北野白梅町",   lat: 35.026200, lng: 135.734000, timeToNext: 4 },
  { name: "等持院",       lat: 35.023100, lng: 135.741200, timeToNext: 4 },
  { name: "龍安寺",       lat: 35.029100, lng: 135.751800, timeToNext: 3 },
  { name: "御室仁和寺",   lat: 35.029200, lng: 135.759300, timeToNext: 5 },
  { name: "宇多野",       lat: 35.022200, lng: 135.729800, timeToNext: 4 },
  { name: "帷子ノ辻",     lat: 35.015800, lng: 135.717200, timeToNext: 0 },
];
