export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

// 東武亀戸線（曳舟～亀戸）
export const tobuKameidoLine: Station[] = [
  { name: "曳舟", lat: 35.718510, lng: 139.816673, timeToNext: 2 },
  { name: "小村井", lat: 35.710320, lng: 139.827610, timeToNext: 2 },
  { name: "東あずま", lat: 35.707375, lng: 139.831595, timeToNext: 2 },
  { name: "亀戸水神", lat: 35.699945, lng: 139.833390, timeToNext: 2 },
  { name: "亀戸", lat: 35.697330, lng: 139.826330 }
];
