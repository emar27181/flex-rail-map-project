import type { Station } from './yamanote';

// 埼玉高速鉄道: 赤羽岩淵→浦和美園
export const saitamaRailway: Station[] = [
  { name: '赤羽岩淵', lat: 35.7856, lng: 139.7192, timeToNext: 3 },
  { name: '川口元郷', lat: 35.8003, lng: 139.7328, timeToNext: 3 },
  { name: '南鳩ヶ谷', lat: 35.8186, lng: 139.7369, timeToNext: 3 },
  { name: '鳩ヶ谷', lat: 35.8322, lng: 139.7419, timeToNext: 3 },
  { name: '新井宿', lat: 35.8456, lng: 139.7542, timeToNext: 3 },
  { name: '戸塚安行', lat: 35.8583, lng: 139.7669, timeToNext: 3 },
  { name: '東川口', lat: 35.8694, lng: 139.7558, timeToNext: 4 },
  { name: '浦和美園', lat: 35.8781, lng: 139.7206 },
];

// ニューシャトル（埼玉新都市交通）: 大宮→内宿
export const newShuttle: Station[] = [
  { name: '大宮', lat: 35.9063, lng: 139.6244, timeToNext: 2 },
  { name: '鉄道博物館', lat: 35.9167, lng: 139.6178, timeToNext: 2 },
  { name: '加茂宮', lat: 35.9253, lng: 139.6119, timeToNext: 2 },
  { name: '東宮原', lat: 35.9331, lng: 139.6078, timeToNext: 2 },
  { name: '今羽', lat: 35.9403, lng: 139.6053, timeToNext: 2 },
  { name: '吉野原', lat: 35.9478, lng: 139.6033, timeToNext: 2 },
  { name: '原市', lat: 35.9558, lng: 139.6003, timeToNext: 2 },
  { name: '沼南', lat: 35.9633, lng: 139.5983, timeToNext: 2 },
  { name: '丸山', lat: 35.9717, lng: 139.5939, timeToNext: 2 },
  { name: '志久', lat: 35.9800, lng: 139.5903, timeToNext: 2 },
  { name: '伊奈中央', lat: 35.9878, lng: 139.5872, timeToNext: 2 },
  { name: '羽貫', lat: 35.9956, lng: 139.5842, timeToNext: 2 },
  { name: '内宿', lat: 36.0042, lng: 139.5814 },
];
