export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const tobuIsesakiLine: Station[] = [
  { name: "浅草", lat: 35.712056, lng: 139.798333, timeToNext: 3 },
  { name: "とうきょうスカイツリー", lat: 35.71043, lng: 139.809332, timeToNext: 2 },
  { name: "曳舟", lat: 35.717147, lng: 139.817456, timeToNext: 2 },
  { name: "東向島", lat: 35.722844, lng: 139.821089, timeToNext: 2 },
  { name: "鐘ヶ淵", lat: 35.729358, lng: 139.821458, timeToNext: 2 },
  { name: "堀切", lat: 35.74442, lng: 139.825478, timeToNext: 2 },
  { name: "牛田", lat: 35.75094, lng: 139.828525, timeToNext: 2 },
  { name: "北千住", lat: 35.749273, lng: 139.804645, timeToNext: 2 },
  { name: "小菅", lat: 35.757175, lng: 139.837544, timeToNext: 2 },
  { name: "五反野", lat: 35.767944, lng: 139.842567, timeToNext: 2 },
  { name: "梅島", lat: 35.774514, lng: 139.845367, timeToNext: 2 },
  { name: "西新井", lat: 35.779308, lng: 139.847825, timeToNext: 2 },
  { name: "竹ノ塚", lat: 35.795364, lng: 139.793289, timeToNext: 3 }
];
