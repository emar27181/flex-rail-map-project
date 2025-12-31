export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

// 東武大師線（西新井～大師前）
export const tobuDaishiLine: Station[] = [
  { name: "西新井", lat: 35.779308, lng: 139.847825, timeToNext: 1 },
  { name: "大師前", lat: 35.775719, lng: 139.851189 }
];
