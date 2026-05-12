export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const jrNanbuLine: Station[] = [
  {
    name: "立川",
    lat: 35.698280,
    lng: 139.414155,
    timeToNext: 5
  },
  {
    name: "西国立",
    lat: 35.693790,
    lng: 139.423905,
    timeToNext: 2
  },
  {
    name: "国立",
    lat: 35.699195,
    lng: 139.446415,
    timeToNext: 2
  },
  {
    name: "矢川",
    lat: 35.685075,
    lng: 139.431590,
    timeToNext: 3
  },
  {
    name: "谷保",
    lat: 35.681380,
    lng: 139.446780,
    timeToNext: 2
  },
  {
    name: "西府",
    lat: 35.670935,
    lng: 139.457390,
    timeToNext: 2
  },
  {
    name: "分倍河原",
    lat: 35.668420,
    lng: 139.468915,
    timeToNext: 3
  },
  {
    name: "府中本町",
    lat: 35.665847,
    lng: 139.477263,
    timeToNext: 3
  },
  {
    name: "南多摩",
    lat: 35.649215,
    lng: 139.489545,
    timeToNext: 2
  },
  {
    name: "矢野口",
    lat: 35.641735,
    lng: 139.520435,
    timeToNext: 2
  },
  {
    name: "稲城長沼",
    lat: 35.644275,
    lng: 139.502610,
    timeToNext: 3
  },
  {
    name: "登戸",
    lat: 35.620883,
    lng: 139.569392,
    timeToNext: 4
  },
  {
    name: "中野島",
    lat: 35.630020,
    lng: 139.551075,
    timeToNext: 2
  },
  {
    name: "稲田堤",
    lat: 35.633410,
    lng: 139.535935,
    timeToNext: 3
  },
  {
    name: "武蔵溝ノ口",
    lat: 35.598815,
    lng: 139.611375,
    timeToNext: 3
  },
  {
    name: "津田山",
    lat: 35.603650,
    lng: 139.600720,
    timeToNext: 2
  },
  {
    name: "久地",
    lat: 35.610105,
    lng: 139.593075,
    timeToNext: 2
  },
  {
    name: "宿河原",
    lat: 35.615420,
    lng: 139.579545,
    timeToNext: 2
  },
  {
    name: "平間",
    lat: 35.560565,
    lng: 139.671095,
    timeToNext: 3
  },
  {
    name: "向河原",
    lat: 35.572175,
    lng: 139.667295,
    timeToNext: 2
  },
  {
    name: "武蔵小杉",
    lat: 35.576563,
    lng: 139.659807,
    timeToNext: 2
  },
  {
    name: "川崎",
    lat: 35.531365,
    lng: 139.696810
  }
];