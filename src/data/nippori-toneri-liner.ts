export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const nipporiToneriLiner: Station[] = [
  { name: "日暮里", lat: 35.727908, lng: 139.771287, timeToNext: 2 },
  { name: "西日暮里", lat: 35.731954, lng: 139.766857, timeToNext: 2 },
  { name: "赤土小学校前", lat: 35.742454, lng: 139.768989, timeToNext: 2 },
  { name: "熊野前", lat: 35.749212, lng: 139.769204, timeToNext: 2 },
  { name: "足立小台", lat: 35.754658, lng: 139.770381, timeToNext: 2 },
  { name: "扇大橋", lat: 35.763897, lng: 139.770808, timeToNext: 2 },
  { name: "高野", lat: 35.768359, lng: 139.770679, timeToNext: 2 },
  { name: "江北", lat: 35.774021, lng: 139.770306, timeToNext: 2 },
  { name: "西新井大師西", lat: 35.781505, lng: 139.770094, timeToNext: 2 },
  { name: "谷在家", lat: 35.788774, lng: 139.770043, timeToNext: 2 },
  { name: "舎人公園", lat: 35.79623, lng: 139.770183, timeToNext: 2 },
  { name: "舎人", lat: 35.8057, lng: 139.770108, timeToNext: 2 },
  { name: "見沼代親水公園", lat: 35.814544, lng: 139.770719 }
];
