export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const jrNanbuLine: Station[] = [
  {
    name: "立川",
    lat: 35.6983,
    lng: 139.4144,
    timeToNext: 5
  },
  {
    name: "西国立",
    lat: 35.6792,
    lng: 139.4292,
    timeToNext: 2
  },
  {
    name: "国立",
    lat: 35.6761,
    lng: 139.4403,
    timeToNext: 2
  },
  {
    name: "矢川",
    lat: 35.6731,
    lng: 139.4511,
    timeToNext: 3
  },
  {
    name: "谷保",
    lat: 35.6672,
    lng: 139.4619,
    timeToNext: 2
  },
  {
    name: "西府",
    lat: 35.668417,
    lng: 139.470597,
    timeToNext: 2
  },
  {
    name: "分倍河原",
    lat: 35.6656,
    lng: 139.4767,
    timeToNext: 3
  },
  {
    name: "府中本町",
    lat: 35.6761,
    lng: 139.4836,
    timeToNext: 3
  },
  {
    name: "南多摩",
    lat: 35.6847,
    lng: 139.4881,
    timeToNext: 2
  },
  {
    name: "矢野口",
    lat: 35.6356,
    lng: 139.5264,
    timeToNext: 2
  },
  {
    name: "稲城長沼",
    lat: 35.6292,
    lng: 139.5372,
    timeToNext: 3
  },
  {
    name: "登戸",
    lat: 35.6222,
    lng: 139.5528,
    timeToNext: 4
  },
  {
    name: "中野島",
    lat: 35.6139,
    lng: 139.5619,
    timeToNext: 2
  },
  {
    name: "稲田堤",
    lat: 35.6058,
    lng: 139.5689,
    timeToNext: 3
  },
  {
    name: "武蔵溝ノ口",
    lat: 35.5986,
    lng: 139.6067,
    timeToNext: 3
  },
  {
    name: "津田山",
    lat: 35.5917,
    lng: 139.6150,
    timeToNext: 2
  },
  {
    name: "久地",
    lat: 35.5856,
    lng: 139.6214,
    timeToNext: 2
  },
  {
    name: "宿河原",
    lat: 35.5775,
    lng: 139.6306,
    timeToNext: 2
  },
  {
    name: "平間",
    lat: 35.5633,
    lng: 139.6544,
    timeToNext: 3
  },
  {
    name: "向河原",
    lat: 35.5567,
    lng: 139.6639,
    timeToNext: 2
  },
  {
    name: "武蔵小杉",
    lat: 35.5781,
    lng: 139.6567,
    timeToNext: 2
  },
  {
    name: "川崎",
    lat: 35.5308,
    lng: 139.6981
  }
];