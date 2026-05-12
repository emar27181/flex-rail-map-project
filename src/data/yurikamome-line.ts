export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const yurikamomeLine: Station[] = [
  {
    name: "新橋",
    lat: 35.666390,
    lng: 139.758200,
    timeToNext: 2
  },
  {
    name: "汐留",
    lat: 35.664990,
    lng: 139.761332,
    timeToNext: 2
  },
  {
    name: "竹芝",
    lat: 35.654065,
    lng: 139.762015,
    timeToNext: 2
  },
  {
    name: "日の出",
    lat: 35.649260,
    lng: 139.759160,
    timeToNext: 2
  },
  {
    name: "芝浦ふ頭",
    lat: 35.642220,
    lng: 139.757870,
    timeToNext: 2
  },
  {
    name: "お台場海浜公園",
    lat: 35.629805,
    lng: 139.778530,
    timeToNext: 2
  },
  {
    name: "台場",
    lat: 35.625870,
    lng: 139.771375,
    timeToNext: 2
  },
  {
    name: "テレコムセンター",
    lat: 35.617725,
    lng: 139.779665,
    timeToNext: 2
  },
  {
    name: "青海",
    lat: 35.624800,
    lng: 139.781315,
    timeToNext: 3
  },
  {
    name: "東京国際クルーズターミナル",
    lat: 35.621357,
    lng: 139.773103,
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
    lat: 35.634550,
    lng: 139.793340,
    timeToNext: 2
  },
  {
    name: "有明テニスの森",
    lat: 35.639980,
    lng: 139.788895,
    timeToNext: 2
  },
  {
    name: "市場前",
    lat: 35.645690,
    lng: 139.785650,
    timeToNext: 2
  },
  {
    name: "新豊洲",
    lat: 35.648710,
    lng: 139.790115,
    timeToNext: 2
  },
  {
    name: "豊洲",
    lat: 35.655128,
    lng: 139.796020
  }
];