export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

// JR五日市線（拝島～武蔵五日市）
export const jrItsukaichiLine: Station[] = [
  { name: "拝島", lat: 35.721278, lng: 139.343468, timeToNext: 3 },
  { name: "熊川", lat: 35.728290, lng: 139.335730, timeToNext: 2 },
  { name: "東秋留", lat: 35.725935, lng: 139.311675, timeToNext: 2 },
  { name: "秋川", lat: 35.728050, lng: 139.286750, timeToNext: 2 },
  { name: "武蔵引田", lat: 35.729690, lng: 139.270085, timeToNext: 2 },
  { name: "武蔵増戸", lat: 35.730955, lng: 139.256305, timeToNext: 2 },
  { name: "武蔵五日市", lat: 35.732145, lng: 139.228120 }
];
