export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

// 東武亀戸線（曳舟～亀戸）
export const tobuKameidoLine: Station[] = [
  { name: "曳舟", lat: 35.717147, lng: 139.817456, timeToNext: 2 },
  { name: "小村井", lat: 35.711886, lng: 139.825433, timeToNext: 2 },
  { name: "東あずま", lat: 35.706928, lng: 139.831733, timeToNext: 2 },
  { name: "亀戸水神", lat: 35.701572, lng: 139.835797, timeToNext: 2 },
  { name: "亀戸", lat: 35.697267, lng: 139.825564 }
];
