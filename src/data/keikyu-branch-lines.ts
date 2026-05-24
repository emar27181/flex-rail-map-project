import type { Station } from './yamanote';

// 京急久里浜線: 堀ノ内→三崎口
export const keikyuKurihamaLine: Station[] = [
  { name: '堀ノ内', lat: 35.263150, lng: 139.687035, timeToNext: 2 },
  { name: '新大津', lat: 35.256970, lng: 139.690197, timeToNext: 2 },
  { name: '北久里浜', lat: 35.249162, lng: 139.686390, timeToNext: 3 },
  { name: '京急久里浜', lat: 35.231470, lng: 139.702215, timeToNext: 3 },
  { name: 'YRP野比', lat: 35.2142, lng: 139.6997, timeToNext: 3 },
  { name: '京急長沢', lat: 35.205445, lng: 139.674125, timeToNext: 2 },
  { name: '津久井浜', lat: 35.198120, lng: 139.664850, timeToNext: 3 },
  { name: '三浦海岸', lat: 35.188285, lng: 139.653375, timeToNext: 3 },
  { name: '三崎口', lat: 35.178218, lng: 139.633358 },
];

// 京急空港線: 京急蒲田→羽田空港
export const keikyuAirportLine: Station[] = [
  { name: '京急蒲田', lat: 35.561699, lng: 139.724329, timeToNext: 2 },
  { name: '糀谷', lat: 35.554450, lng: 139.729590, timeToNext: 2 },
  { name: '大鳥居', lat: 35.552320, lng: 139.740225, timeToNext: 2 },
  { name: '穴守稲荷', lat: 35.550333, lng: 139.746717, timeToNext: 2 },
  { name: '天空橋', lat: 35.548355, lng: 139.754600, timeToNext: 3 },
  { name: '羽田空港第3ターミナル', lat: 35.544980, lng: 139.767066, timeToNext: 2 },
  { name: '羽田空港第1・第2ターミナル', lat: 35.549800, lng: 139.786025 },
];
