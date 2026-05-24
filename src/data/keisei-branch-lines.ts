import type { Station } from './yamanote';

// 京成押上線: 押上→青砥
export const keiseiOshiageLine: Station[] = [
  { name: '押上', lat: 35.710220, lng: 139.812410, timeToNext: 2 },
  { name: '京成曳舟', lat: 35.718640, lng: 139.820280, timeToNext: 2 },
  { name: '八広', lat: 35.727197, lng: 139.828317, timeToNext: 2 },
  { name: '四ツ木', lat: 35.731715, lng: 139.834655, timeToNext: 2 },
  { name: '立石', lat: 35.738190, lng: 139.848160, timeToNext: 3 },
  { name: '青砥', lat: 35.745870, lng: 139.856270 },
];

// 北総鉄道: 京成高砂→印旛日本医大
export const hokusouLine: Station[] = [
  { name: '京成高砂', lat: 35.750870, lng: 139.866590, timeToNext: 4 },
  { name: '新柴又', lat: 35.751350, lng: 139.879820, timeToNext: 3 },
  { name: '矢切', lat: 35.757505, lng: 139.900555, timeToNext: 3 },
  { name: '北国分', lat: 35.762860, lng: 139.914220, timeToNext: 3 },
  { name: '秋山', lat: 35.765440, lng: 139.931443, timeToNext: 3 },
  { name: '東松戸', lat: 35.769810, lng: 139.942775, timeToNext: 3 },
  { name: '松飛台', lat: 35.775332, lng: 139.957570, timeToNext: 3 },
  { name: '大町', lat: 35.775150, lng: 139.973340, timeToNext: 3 },
  { name: '新鎌ヶ谷', lat: 35.779610, lng: 139.998355, timeToNext: 4 },
  { name: '西白井', lat: 35.784440, lng: 140.031745, timeToNext: 4 },
  { name: '白井', lat: 35.784750, lng: 140.054075, timeToNext: 4 },
  { name: '小室', lat: 35.787037, lng: 140.076063, timeToNext: 4 },
  { name: '千葉ニュータウン中央', lat: 35.800220, lng: 140.116263, timeToNext: 5 },
  { name: '印西牧の原', lat: 35.803628, lng: 140.167134, timeToNext: 5 },
  { name: '印旛日本医大', lat: 35.787815, lng: 140.202759 },
];
