export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

// 東武大師線（西新井～大師前）
export const tobuDaishiLine: Station[] = [
  { name: "西新井", lat: 35.777280, lng: 139.790365, timeToNext: 1 },
  { name: "大師前", lat: 35.778950, lng: 139.781655 }
];
