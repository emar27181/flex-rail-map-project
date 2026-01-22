export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const yurikamomeLine: Station[] = [
  {
    name: "新橋",
    lat: 35.6663,
    lng: 139.7583,
    timeToNext: 2
  },
  {
    name: "汐留",
    lat: 35.6656,
    lng: 139.7631,
    timeToNext: 2
  },
  {
    name: "竹芝",
    lat: 35.6578,
    lng: 139.7633,
    timeToNext: 2
  },
  {
    name: "日の出",
    lat: 35.6544,
    lng: 139.7711,
    timeToNext: 2
  },
  {
    name: "芝浦ふ頭",
    lat: 35.6497,
    lng: 139.7733,
    timeToNext: 2
  },
  {
    name: "お台場海浜公園",
    lat: 35.6289,
    lng: 139.7739,
    timeToNext: 2
  },
  {
    name: "台場",
    lat: 35.6264,
    lng: 139.7761,
    timeToNext: 2
  },
  {
    name: "テレコムセンター",
    lat: 35.6228,
    lng: 139.7875,
    timeToNext: 2
  },
  {
    name: "青海",
    lat: 35.6189,
    lng: 139.7931,
    timeToNext: 3
  },
  {
    name: "東京国際クルーズターミナル",
    lat: 35.6167,
    lng: 139.7981,
    timeToNext: 2
  },
  {
    name: "中央広場前",
    lat: 35.6181,
    lng: 139.8031,
    timeToNext: 2
  },
  {
    name: "有明",
    lat: 35.6208,
    lng: 139.8081,
    timeToNext: 2
  },
  {
    name: "有明テニスの森",
    lat: 35.6256,
    lng: 139.8128,
    timeToNext: 2
  },
  {
    name: "市場前",
    lat: 35.6367,
    lng: 139.8081,
    timeToNext: 2
  },
  {
    name: "新豊洲",
    lat: 35.6389,
    lng: 139.7983,
    timeToNext: 2
  },
  {
    name: "豊洲",
    lat: 35.6547,
    lng: 139.7967
  }
];