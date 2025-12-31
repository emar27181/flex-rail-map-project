export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

// 京成本線の東京都内区間（京成上野～京成高砂）
export const keiseiMainLineTokyo: Station[] = [
  { name: "京成上野", lat: 35.707878, lng: 139.774437, timeToNext: 3 },
  { name: "日暮里", lat: 35.727908, lng: 139.771287, timeToNext: 2 },
  { name: "新三河島", lat: 35.735081, lng: 139.782951, timeToNext: 2 },
  { name: "町屋", lat: 35.74275, lng: 139.781145, timeToNext: 2 },
  { name: "千住大橋", lat: 35.747726, lng: 139.792694, timeToNext: 2 },
  { name: "京成関屋", lat: 35.750033, lng: 139.800653, timeToNext: 2 },
  { name: "堀切菖蒲園", lat: 35.750553, lng: 139.818317, timeToNext: 2 },
  { name: "お花茶屋", lat: 35.749433, lng: 139.831939, timeToNext: 2 },
  { name: "青砥", lat: 35.752014, lng: 139.847794, timeToNext: 2 },
  { name: "京成高砂", lat: 35.758578, lng: 139.864069, timeToNext: 3 }
];
