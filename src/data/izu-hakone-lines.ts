import type { Station } from './yamanote';

// JR伊東線: 熱海→伊東
export const jrItoLine: Station[] = [
  { name: '熱海', lat: 35.1042, lng: 139.0775, timeToNext: 4 },
  { name: '来宮', lat: 35.1044, lng: 139.0686, timeToNext: 3 },
  { name: '伊豆多賀', lat: 35.0853, lng: 139.0553, timeToNext: 3 },
  { name: '網代', lat: 35.0683, lng: 139.0494, timeToNext: 4 },
  { name: '宇佐美', lat: 35.0289, lng: 139.0569, timeToNext: 5 },
  { name: '伊東', lat: 34.9672, lng: 139.0978 },
];

// 伊豆急行線: 伊東→伊豆急下田
export const izukyuLine: Station[] = [
  { name: '伊東', lat: 34.9672, lng: 139.0978, timeToNext: 3 },
  { name: '南伊東', lat: 34.9522, lng: 139.0903, timeToNext: 3 },
  { name: '川奈', lat: 34.9283, lng: 139.1056, timeToNext: 4 },
  { name: '富戸', lat: 34.9106, lng: 139.1122, timeToNext: 4 },
  { name: '城ヶ崎海岸', lat: 34.9011, lng: 139.1181, timeToNext: 3 },
  { name: '伊豆高原', lat: 34.8894, lng: 139.1053, timeToNext: 4 },
  { name: '伊豆大川', lat: 34.8647, lng: 139.0958, timeToNext: 3 },
  { name: '伊豆北川', lat: 34.8531, lng: 139.0939, timeToNext: 3 },
  { name: '伊豆熱川', lat: 34.8383, lng: 139.0756, timeToNext: 3 },
  { name: '片瀬白田', lat: 34.8228, lng: 139.0639, timeToNext: 3 },
  { name: '伊豆稲取', lat: 34.8008, lng: 139.0508, timeToNext: 4 },
  { name: '今井浜海岸', lat: 34.7803, lng: 139.0239, timeToNext: 3 },
  { name: '河津', lat: 34.7678, lng: 139.0044, timeToNext: 4 },
  { name: '稲梓', lat: 34.7375, lng: 138.9781, timeToNext: 4 },
  { name: '蓮台寺', lat: 34.6864, lng: 138.9519, timeToNext: 3 },
  { name: '伊豆急下田', lat: 34.6792, lng: 138.9483 },
];

// 箱根登山鉄道: 小田原→強羅
export const hakoneTozan: Station[] = [
  { name: '小田原', lat: 35.2564, lng: 139.1547, timeToNext: 5 },
  { name: '箱根板橋', lat: 35.2433, lng: 139.1436, timeToNext: 3 },
  { name: '風祭', lat: 35.2378, lng: 139.1303, timeToNext: 3 },
  { name: '入生田', lat: 35.2342, lng: 139.1169, timeToNext: 3 },
  { name: '箱根湯本', lat: 35.2322, lng: 139.1058, timeToNext: 7 },
  { name: '塔ノ沢', lat: 35.2372, lng: 139.0953, timeToNext: 5 },
  { name: '大平台', lat: 35.2378, lng: 139.0756, timeToNext: 5 },
  { name: '宮ノ下', lat: 35.2411, lng: 139.0592, timeToNext: 4 },
  { name: '小涌谷', lat: 35.2431, lng: 139.0489, timeToNext: 4 },
  { name: '彫刻の森', lat: 35.2472, lng: 139.0408, timeToNext: 3 },
  { name: '強羅', lat: 35.2478, lng: 139.0369 },
];

// 伊豆箱根鉄道駿豆線: 三島→修善寺
export const izuHakoneSunzu: Station[] = [
  { name: '三島', lat: 35.1264, lng: 138.9114, timeToNext: 2 },
  { name: '三島広小路', lat: 35.1178, lng: 138.9156, timeToNext: 2 },
  { name: '三島田町', lat: 35.1103, lng: 138.9183, timeToNext: 3 },
  { name: '三島二日町', lat: 35.0939, lng: 138.9289, timeToNext: 3 },
  { name: '大場', lat: 35.0839, lng: 138.9439, timeToNext: 3 },
  { name: '伊豆仁田', lat: 35.0714, lng: 138.9519, timeToNext: 2 },
  { name: '原木', lat: 35.0642, lng: 138.9569, timeToNext: 3 },
  { name: '韮山', lat: 35.0478, lng: 138.9631, timeToNext: 2 },
  { name: '伊豆長岡', lat: 35.0331, lng: 138.9636, timeToNext: 3 },
  { name: '田京', lat: 35.0164, lng: 138.9639, timeToNext: 3 },
  { name: '大仁', lat: 35.0003, lng: 138.9597, timeToNext: 4 },
  { name: '牧之郷', lat: 34.9853, lng: 138.9503, timeToNext: 3 },
  { name: '修善寺', lat: 34.9728, lng: 138.9339 },
];
