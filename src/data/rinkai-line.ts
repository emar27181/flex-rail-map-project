export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const rinkaiLine: Station[] = [
  {
    name: "大崎",
    lat: 35.6197,
    lng: 139.7286,
    timeToNext: 4
  },
  {
    name: "品川シーサイド",
    lat: 35.6089,
    lng: 139.7367,
    timeToNext: 3
  },
  {
    name: "大井町",
    lat: 35.6058,
    lng: 139.7342,
    timeToNext: 7
  },
  {
    name: "品川埠頭",
    lat: 35.5944,
    lng: 139.7528,
    timeToNext: 5
  },
  {
    name: "天王洲アイル",
    lat: 35.6228,
    lng: 139.7436,
    timeToNext: 3
  },
  {
    name: "東京テレポート",
    lat: 35.6297,
    lng: 139.7761,
    timeToNext: 3
  },
  {
    name: "国際展示場",
    lat: 35.6306,
    lng: 139.7947,
    timeToNext: 4
  },
  {
    name: "東雲",
    lat: 35.6364,
    lng: 139.8081,
    timeToNext: 2
  },
  {
    name: "新木場",
    lat: 35.6458,
    lng: 139.8267
  }
];