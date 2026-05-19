import type { Station } from './yamanote';

// 一畑電車北松江線: 電鉄出雲市〜松江しんじ湖温泉
export const ichibataKitamatsue: Station[] = [
  { name: "電鉄出雲市",         lat: 35.368900, lng: 132.763600, timeToNext: 4 },
  { name: "大津町",             lat: 35.369204, lng: 132.774413, timeToNext: 4 },
  { name: "武志",               lat: 35.388139, lng: 132.77325, timeToNext: 4 },
  { name: "川跡",               lat: 35.395069, lng: 132.776274, timeToNext: 5 },
  { name: "高ノ宮",             lat: 35.471900, lng: 132.930512, timeToNext: 4 },
  { name: "武蔵",               lat: 35.427200, lng: 132.858700, timeToNext: 4 },
  { name: "旅伏",               lat: 35.421381, lng: 132.807173, timeToNext: 5 },
  { name: "雲州平田",           lat: 35.432176, lng: 132.823728, timeToNext: 5 },
  { name: "布崎",               lat: 35.450228, lng: 132.85483, timeToNext: 5 },
  { name: "湖遊館新駅",         lat: 35.452459, lng: 132.861836, timeToNext: 4 },
  { name: "一畑口",             lat: 35.464488, lng: 132.882739, timeToNext: 5 },
  { name: "津ノ森",             lat: 35.466367, lng: 132.918716, timeToNext: 4 },
  { name: "松江フォーゲルパーク", lat: 35.47495, lng: 132.943726, timeToNext: 3 },
  { name: "浜乃木",             lat: 35.469300, lng: 133.037100, timeToNext: 3 },
  { name: "美談",               lat: 35.412637, lng: 132.798191, timeToNext: 3 },
  { name: "松江しんじ湖温泉",   lat: 35.472800, lng: 133.054600, timeToNext: 0 },
];

// 一畑電車大社線: 川跡〜出雲大社前
export const ichibataOyashiro: Station[] = [
  { name: "川跡",               lat: 35.395069, lng: 132.776274, timeToNext: 4 },
  { name: "遙堪",               lat: 35.397800, lng: 132.793200, timeToNext: 4 },
  { name: "浦",                 lat: 35.399100, lng: 132.760400, timeToNext: 4 },
  { name: "出雲大社前",         lat: 35.401600, lng: 132.690200, timeToNext: 0 },
];

// 水島臨海鉄道: 倉敷市〜三菱自工前
export const mizushimaLine: Station[] = [
  { name: "倉敷市",             lat: 34.592200, lng: 133.773100, timeToNext: 3 },
  { name: "球場前",             lat: 34.582700, lng: 133.766900, timeToNext: 3 },
  { name: "植松",               lat: 34.551333, lng: 133.827965, timeToNext: 3 },
  { name: "浦田",               lat: 34.556800, lng: 133.755100, timeToNext: 3 },
  { name: "西富井",             lat: 34.57757, lng: 133.743345, timeToNext: 3 },
  { name: "福井",               lat: 34.569769, lng: 133.744444, timeToNext: 3 },
  { name: "水島",               lat: 34.521300, lng: 133.760400, timeToNext: 3 },
  { name: "弥生",               lat: 34.543717, lng: 133.747404, timeToNext: 3 },
  { name: "栄",                 lat: 34.537766, lng: 133.744886, timeToNext: 3 },
  { name: "三菱自工前",         lat: 34.522958, lng: 133.733115, timeToNext: 0 },
];

// 井原鉄道: 総社〜神辺
export const ibaraRailway: Station[] = [
  { name: "総社",               lat: 34.673200, lng: 133.740100, timeToNext: 5 },
  { name: "清音",               lat: 34.643535, lng: 133.733471, timeToNext: 5 },
  { name: "川辺宿",             lat: 34.632404, lng: 133.71481, timeToNext: 5 },
  { name: "吉備真備",           lat: 34.626741, lng: 133.691913, timeToNext: 5 },
  { name: "日羽",               lat: 34.715892, lng: 133.689717, timeToNext: 5 },
  { name: "美袋",               lat: 34.720051, lng: 133.654363, timeToNext: 5 },
  { name: "備中広瀬",           lat: 34.758503, lng: 133.60682, timeToNext: 5 },
  { name: "備中呉妹",           lat: 34.62161, lng: 133.661917, timeToNext: 5 },
  { name: "三谷",               lat: 34.61643, lng: 133.619597, timeToNext: 5 },
  { name: "矢掛",               lat: 34.629342, lng: 133.590021, timeToNext: 5 },
  { name: "小田",               lat: 34.605994, lng: 133.542440, timeToNext: 5 },
  { name: "早雲の里荏原",       lat: 34.596785, lng: 133.507993, timeToNext: 5 },
  { name: "神辺",               lat: 34.537141, lng: 133.378713, timeToNext: 0 },
];
