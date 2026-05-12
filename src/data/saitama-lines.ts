import type { Station } from './yamanote';

// 埼玉高速鉄道: 赤羽岩淵→浦和美園
export const saitamaRailway: Station[] = [
  { name: '赤羽岩淵', lat: 35.783355, lng: 139.722110, timeToNext: 3 },
  { name: '川口元郷', lat: 35.799960, lng: 139.729863, timeToNext: 3 },
  { name: '南鳩ヶ谷', lat: 35.816080, lng: 139.736095, timeToNext: 3 },
  { name: '鳩ヶ谷', lat: 35.830800, lng: 139.736160, timeToNext: 3 },
  { name: '新井宿', lat: 35.842950, lng: 139.738115, timeToNext: 3 },
  { name: '戸塚安行', lat: 35.859070, lng: 139.753775, timeToNext: 3 },
  { name: '東川口', lat: 35.875137, lng: 139.743897, timeToNext: 4 },
  { name: '浦和美園', lat: 35.893675, lng: 139.727825 },
];

// ニューシャトル（埼玉新都市交通）: 大宮→内宿
export const newShuttle: Station[] = [
  { name: '大宮', lat: 35.906435, lng: 139.624370, timeToNext: 2 },
  { name: '鉄道博物館', lat: 35.920265, lng: 139.617825, timeToNext: 2 },
  { name: '加茂宮', lat: 35.935770, lng: 139.616935, timeToNext: 2 },
  { name: '東宮原', lat: 35.942685, lng: 139.618225, timeToNext: 2 },
  { name: '今羽', lat: 35.950005, lng: 139.619610, timeToNext: 2 },
  { name: '吉野原', lat: 35.957010, lng: 139.620905, timeToNext: 2 },
  { name: '原市', lat: 35.963840, lng: 139.622185, timeToNext: 2 },
  { name: '沼南', lat: 35.971025, lng: 139.623520, timeToNext: 2 },
  { name: '丸山', lat: 35.979600, lng: 139.624540, timeToNext: 2 },
  { name: '志久', lat: 35.991025, lng: 139.622200, timeToNext: 2 },
  { name: '伊奈中央', lat: 35.999455, lng: 139.617030, timeToNext: 2 },
  { name: '羽貫', lat: 36.007160, lng: 139.608520, timeToNext: 2 },
  { name: '内宿', lat: 36.013805, lng: 139.599980 },
];
