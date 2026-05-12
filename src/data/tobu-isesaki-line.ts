export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const tobuIsesakiLine: Station[] = [
  { name: "浅草", lat: 35.712056, lng: 139.798333, timeToNext: 3 },
  { name: "とうきょうスカイツリー", lat: 35.71043, lng: 139.809332, timeToNext: 2 },
  { name: "押上", lat: 35.710220, lng: 139.812410, timeToNext: 1 },
  { name: "曳舟", lat: 35.718510, lng: 139.816673, timeToNext: 2 },
  { name: "東向島", lat: 35.724355, lng: 139.819335, timeToNext: 2 },
  { name: "鐘ヶ淵", lat: 35.733760, lng: 139.820370, timeToNext: 2 },
  { name: "堀切", lat: 35.743345, lng: 139.817380, timeToNext: 2 },
  { name: "牛田", lat: 35.744545, lng: 139.811770, timeToNext: 2 },
  { name: "北千住", lat: 35.749127, lng: 139.804387, timeToNext: 2 },
  { name: "小菅", lat: 35.758685, lng: 139.812650, timeToNext: 2 },
  { name: "五反野", lat: 35.765905, lng: 139.809630, timeToNext: 2 },
  { name: "梅島", lat: 35.772345, lng: 139.798075, timeToNext: 2 },
  { name: "西新井", lat: 35.777280, lng: 139.790365, timeToNext: 2 },
  { name: "竹ノ塚", lat: 35.794370, lng: 139.790720, timeToNext: 3 }
];
