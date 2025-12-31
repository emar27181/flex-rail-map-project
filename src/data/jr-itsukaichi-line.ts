export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

// JR五日市線（拝島～武蔵五日市）
export const jrItsukaichiLine: Station[] = [
  { name: "拝島", lat: 35.721278, lng: 139.343468, timeToNext: 3 },
  { name: "熊川", lat: 35.732089, lng: 139.362428, timeToNext: 2 },
  { name: "東秋留", lat: 35.729353, lng: 139.382331, timeToNext: 2 },
  { name: "秋川", lat: 35.729556, lng: 139.394111, timeToNext: 2 },
  { name: "武蔵引田", lat: 35.727886, lng: 139.410308, timeToNext: 2 },
  { name: "武蔵増戸", lat: 35.728169, lng: 139.426392, timeToNext: 2 },
  { name: "武蔵五日市", lat: 35.730144, lng: 139.441614 }
];
