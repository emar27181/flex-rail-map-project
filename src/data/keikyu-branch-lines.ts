import type { Station } from './yamanote';

// 京急久里浜線: 堀ノ内→三崎口
export const keikyuKurihamaLine: Station[] = [
  { name: '堀ノ内', lat: 35.2528, lng: 139.6736, timeToNext: 2 },
  { name: '新大津', lat: 35.2461, lng: 139.6819, timeToNext: 2 },
  { name: '北久里浜', lat: 35.2394, lng: 139.6906, timeToNext: 3 },
  { name: '京急久里浜', lat: 35.2289, lng: 139.7019, timeToNext: 3 },
  { name: 'YRP野比', lat: 35.2142, lng: 139.6997, timeToNext: 3 },
  { name: '京急長沢', lat: 35.2036, lng: 139.6931, timeToNext: 2 },
  { name: '津久井浜', lat: 35.1967, lng: 139.6833, timeToNext: 3 },
  { name: '三浦海岸', lat: 35.1844, lng: 139.6756, timeToNext: 3 },
  { name: '三崎口', lat: 35.1778, lng: 139.6569 },
];

// 京急空港線: 京急蒲田→羽田空港
export const keikyuAirportLine: Station[] = [
  { name: '京急蒲田', lat: 35.5622, lng: 139.7107, timeToNext: 2 },
  { name: '糀谷', lat: 35.5558, lng: 139.7219, timeToNext: 2 },
  { name: '大鳥居', lat: 35.5497, lng: 139.7322, timeToNext: 2 },
  { name: '穴守稲荷', lat: 35.5497, lng: 139.7444, timeToNext: 2 },
  { name: '天空橋', lat: 35.5489, lng: 139.7531, timeToNext: 3 },
  { name: '羽田空港第3ターミナル', lat: 35.5494, lng: 139.7675, timeToNext: 2 },
  { name: '羽田空港第1・第2ターミナル', lat: 35.5439, lng: 139.7672 },
];
