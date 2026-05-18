import type { Station } from './yamanote';

// 一畑電車北松江線: 電鉄出雲市〜松江しんじ湖温泉
export const ichibataKitamatsue: Station[] = [
  { name: "電鉄出雲市",         lat: 35.368900, lng: 132.763600, timeToNext: 4 },
  { name: "大津町",             lat: 35.380200, lng: 132.781500, timeToNext: 4 },
  { name: "武志",               lat: 35.395100, lng: 132.799300, timeToNext: 4 },
  { name: "川跡",               lat: 35.408300, lng: 132.821400, timeToNext: 5 },
  { name: "高ノ宮",             lat: 35.418600, lng: 132.843100, timeToNext: 4 },
  { name: "武蔵",               lat: 35.427200, lng: 132.858700, timeToNext: 4 },
  { name: "旅伏",               lat: 35.438100, lng: 132.882600, timeToNext: 5 },
  { name: "雲州平田",           lat: 35.450300, lng: 132.899400, timeToNext: 5 },
  { name: "布崎",               lat: 35.463100, lng: 132.921200, timeToNext: 5 },
  { name: "湖遊館新駅",         lat: 35.471200, lng: 132.951800, timeToNext: 4 },
  { name: "一畑口",             lat: 35.458400, lng: 132.977600, timeToNext: 5 },
  { name: "津ノ森",             lat: 35.465800, lng: 133.016200, timeToNext: 4 },
  { name: "松江フォーゲルパーク", lat: 35.468100, lng: 133.023900, timeToNext: 3 },
  { name: "浜乃木",             lat: 35.469300, lng: 133.037100, timeToNext: 3 },
  { name: "美談",               lat: 35.471000, lng: 133.046300, timeToNext: 3 },
  { name: "松江しんじ湖温泉",   lat: 35.472800, lng: 133.054600, timeToNext: 0 },
];

// 一畑電車大社線: 川跡〜出雲大社前
export const ichibataOyashiro: Station[] = [
  { name: "川跡",               lat: 35.408300, lng: 132.821400, timeToNext: 4 },
  { name: "遙堪",               lat: 35.397800, lng: 132.793200, timeToNext: 4 },
  { name: "浦",                 lat: 35.399100, lng: 132.760400, timeToNext: 4 },
  { name: "出雲大社前",         lat: 35.401600, lng: 132.690200, timeToNext: 0 },
];

// 水島臨海鉄道: 倉敷市〜三菱自工前
export const mizushimaLine: Station[] = [
  { name: "倉敷市",             lat: 34.592200, lng: 133.773100, timeToNext: 3 },
  { name: "球場前",             lat: 34.582700, lng: 133.766900, timeToNext: 3 },
  { name: "植松",               lat: 34.571400, lng: 133.757300, timeToNext: 3 },
  { name: "浦田",               lat: 34.556800, lng: 133.755100, timeToNext: 3 },
  { name: "西富井",             lat: 34.544900, lng: 133.754200, timeToNext: 3 },
  { name: "福井",               lat: 34.534100, lng: 133.752100, timeToNext: 3 },
  { name: "水島",               lat: 34.521300, lng: 133.760400, timeToNext: 3 },
  { name: "弥生",               lat: 34.512100, lng: 133.768200, timeToNext: 3 },
  { name: "栄",                 lat: 34.504600, lng: 133.773100, timeToNext: 3 },
  { name: "三菱自工前",         lat: 34.497300, lng: 133.770400, timeToNext: 0 },
];

// 井原鉄道: 総社〜神辺
export const ibaraRailway: Station[] = [
  { name: "総社",               lat: 34.673200, lng: 133.740100, timeToNext: 5 },
  { name: "清音",               lat: 34.659800, lng: 133.690900, timeToNext: 5 },
  { name: "川辺宿",             lat: 34.654700, lng: 133.649600, timeToNext: 5 },
  { name: "吉備真備",           lat: 34.645900, lng: 133.616800, timeToNext: 5 },
  { name: "日羽",               lat: 34.631600, lng: 133.577100, timeToNext: 5 },
  { name: "美袋",               lat: 34.620800, lng: 133.545200, timeToNext: 5 },
  { name: "備中広瀬",           lat: 34.612700, lng: 133.513800, timeToNext: 5 },
  { name: "備中呉妹",           lat: 34.604500, lng: 133.481900, timeToNext: 5 },
  { name: "三谷",               lat: 34.592800, lng: 133.455200, timeToNext: 5 },
  { name: "矢掛",               lat: 34.577100, lng: 133.420300, timeToNext: 5 },
  { name: "小田",               lat: 34.562600, lng: 133.399100, timeToNext: 5 },
  { name: "早雲の里荏原",       lat: 34.551800, lng: 133.383400, timeToNext: 5 },
  { name: "神辺",               lat: 34.559800, lng: 133.375900, timeToNext: 0 },
];
