import type { Station } from './yamanote';

// 京成押上線: 押上→青砥
export const keiseiOshiageLine: Station[] = [
  { name: '押上', lat: 35.7100, lng: 139.8131, timeToNext: 2 },
  { name: '京成曳舟', lat: 35.7183, lng: 139.8181, timeToNext: 2 },
  { name: '八広', lat: 35.7256, lng: 139.8278, timeToNext: 2 },
  { name: '四ツ木', lat: 35.7372, lng: 139.8397, timeToNext: 2 },
  { name: '立石', lat: 35.7456, lng: 139.8453, timeToNext: 3 },
  { name: '青砥', lat: 35.7733, lng: 139.8297 },
];

// 北総鉄道: 京成高砂→印旛日本医大
export const hokusouLine: Station[] = [
  { name: '京成高砂', lat: 35.7581, lng: 139.8597, timeToNext: 4 },
  { name: '新柴又', lat: 35.7619, lng: 139.8800, timeToNext: 3 },
  { name: '矢切', lat: 35.7536, lng: 139.8969, timeToNext: 3 },
  { name: '北国分', lat: 35.7522, lng: 139.9114, timeToNext: 3 },
  { name: '秋山', lat: 35.7508, lng: 139.9281, timeToNext: 3 },
  { name: '東松戸', lat: 35.7603, lng: 139.9186, timeToNext: 3 },
  { name: '松飛台', lat: 35.7656, lng: 139.9397, timeToNext: 3 },
  { name: '大町', lat: 35.7714, lng: 139.9533, timeToNext: 3 },
  { name: '新鎌ヶ谷', lat: 35.7831, lng: 139.9764, timeToNext: 4 },
  { name: '西白井', lat: 35.7906, lng: 140.0172, timeToNext: 4 },
  { name: '白井', lat: 35.7964, lng: 140.0475, timeToNext: 4 },
  { name: '小室', lat: 35.7947, lng: 140.0769, timeToNext: 4 },
  { name: '千葉ニュータウン中央', lat: 35.7881, lng: 140.1086, timeToNext: 5 },
  { name: '印西牧の原', lat: 35.7858, lng: 140.1478, timeToNext: 5 },
  { name: '印旛日本医大', lat: 35.7892, lng: 140.1808 },
];
