export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const keioInokashiraLine: Station[] = [
  { name: "渋谷", lat: 35.658871, lng: 139.701238, timeToNext: 2 },
  { name: "神泉", lat: 35.657244, lng: 139.693579, timeToNext: 2 },
  { name: "駒場東大前", lat: 35.65868, lng: 139.684308, timeToNext: 2 },
  { name: "池ノ上", lat: 35.660402, lng: 139.67344, timeToNext: 2 },
  { name: "下北沢", lat: 35.661539, lng: 139.66691, timeToNext: 2 },
  { name: "新代田", lat: 35.662593, lng: 139.660524, timeToNext: 2 },
  { name: "東松原", lat: 35.662634, lng: 139.655535, timeToNext: 2 },
  { name: "明大前", lat: 35.668758, lng: 139.650352, timeToNext: 2 },
  { name: "永福町", lat: 35.67629, lng: 139.642733, timeToNext: 2 },
  { name: "西永福", lat: 35.678918, lng: 139.634936, timeToNext: 2 },
  { name: "浜田山", lat: 35.681603, lng: 139.627528, timeToNext: 2 },
  { name: "高井戸", lat: 35.683253, lng: 139.615115, timeToNext: 2 },
  { name: "富士見ヶ丘", lat: 35.684805, lng: 139.607072, timeToNext: 2 },
  { name: "久我山", lat: 35.688138, lng: 139.599211, timeToNext: 2 },
  { name: "三鷹台", lat: 35.692046, lng: 139.589298, timeToNext: 2 },
  { name: "井の頭公園", lat: 35.697304, lng: 139.583112, timeToNext: 2 },
  { name: "吉祥寺", lat: 35.703119, lng: 139.579765 }
];
