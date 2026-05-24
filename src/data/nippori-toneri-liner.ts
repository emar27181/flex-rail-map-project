export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const nipporiToneriLiner: Station[] = [
  { name: "日暮里", lat: 35.727987, lng: 139.771190, timeToNext: 2 },
  { name: "西日暮里", lat: 35.732175, lng: 139.766715, timeToNext: 2 },
  { name: "赤土小学校前", lat: 35.743060, lng: 139.769130, timeToNext: 2 },
  { name: "熊野前", lat: 35.749212, lng: 139.769204, timeToNext: 2 },
  { name: "足立小台", lat: 35.754635, lng: 139.770205, timeToNext: 2 },
  { name: "扇大橋", lat: 35.764135, lng: 139.770850, timeToNext: 2 },
  { name: "高野", lat: 35.768255, lng: 139.770720, timeToNext: 2 },
  { name: "江北", lat: 35.773785, lng: 139.770345, timeToNext: 2 },
  { name: "西新井大師西", lat: 35.781160, lng: 139.770140, timeToNext: 2 },
  { name: "谷在家", lat: 35.788680, lng: 139.770100, timeToNext: 2 },
  { name: "舎人公園", lat: 35.796665, lng: 139.770120, timeToNext: 2 },
  { name: "舎人", lat: 35.8057, lng: 139.770108, timeToNext: 2 },
  { name: "見沼代親水公園", lat: 35.814544, lng: 139.770719 }
];
