export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const rinkaiLine: Station[] = [
  {
    name: "大崎",
    lat: 35.619945,
    lng: 139.728245,
    timeToNext: 3
  },
  {
    name: "大井町",
    lat: 35.607070,
    lng: 139.735013,
    timeToNext: 4
  },
  {
    name: "品川シーサイド",
    lat: 35.609790,
    lng: 139.749795,
    timeToNext: 4
  },
  {
    name: "天王洲アイル",
    lat: 35.622870,
    lng: 139.750905,
    timeToNext: 3
  },
  {
    name: "東京テレポート",
    lat: 35.627085,
    lng: 139.778060,
    timeToNext: 3
  },
  {
    name: "国際展示場",
    lat: 35.634410,
    lng: 139.791695,
    timeToNext: 4
  },
  {
    name: "東雲",
    lat: 35.640820,
    lng: 139.804160,
    timeToNext: 2
  },
  {
    name: "新木場",
    lat: 35.6458,
    lng: 139.8267
  }
];