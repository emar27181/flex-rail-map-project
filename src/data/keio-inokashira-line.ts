export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const keioInokashiraLine: Station[] = [
  { name: "渋谷", lat: 35.659450, lng: 139.701035, timeToNext: 2 },
  { name: "神泉", lat: 35.657180, lng: 139.693252, timeToNext: 2 },
  { name: "駒場東大前", lat: 35.658670, lng: 139.684075, timeToNext: 2 },
  { name: "池ノ上", lat: 35.660402, lng: 139.67344, timeToNext: 2 },
  { name: "下北沢", lat: 35.661605, lng: 139.666570, timeToNext: 2 },
  { name: "新代田", lat: 35.662495, lng: 139.661390, timeToNext: 2 },
  { name: "東松原", lat: 35.662636, lng: 139.655758, timeToNext: 2 },
  { name: "明大前", lat: 35.669085, lng: 139.650380, timeToNext: 2 },
  { name: "永福町", lat: 35.67629, lng: 139.642733, timeToNext: 2 },
  { name: "西永福", lat: 35.678875, lng: 139.635155, timeToNext: 2 },
  { name: "浜田山", lat: 35.681603, lng: 139.627528, timeToNext: 2 },
  { name: "高井戸", lat: 35.683260, lng: 139.615230, timeToNext: 2 },
  { name: "富士見ヶ丘", lat: 35.684805, lng: 139.607233, timeToNext: 2 },
  { name: "久我山", lat: 35.688140, lng: 139.599325, timeToNext: 2 },
  { name: "三鷹台", lat: 35.692046, lng: 139.589298, timeToNext: 2 },
  { name: "井の頭公園", lat: 35.697304, lng: 139.583112, timeToNext: 2 },
  { name: "吉祥寺", lat: 35.703147, lng: 139.579990 }
];
