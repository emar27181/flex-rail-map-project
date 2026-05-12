export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const tsukubaExpress: Station[] = [
  {
    name: "秋葉原",
    lat: 35.698320,
    lng: 139.773215,
    timeToNext: 8
  },
  {
    name: "新御徒町",
    lat: 35.706880,
    lng: 139.782340,
    timeToNext: 5
  },
  {
    name: "浅草",
    lat: 35.711980,
    lng: 139.798315,
    timeToNext: 7
  },
  {
    name: "南千住",
    lat: 35.732310,
    lng: 139.798780,
    timeToNext: 6
  },
  {
    name: "北千住",
    lat: 35.749127,
    lng: 139.804387,
    timeToNext: 8
  },
  {
    name: "青井",
    lat: 35.772000,
    lng: 139.820245,
    timeToNext: 5
  },
  {
    name: "六町",
    lat: 35.784780,
    lng: 139.821805,
    timeToNext: 4
  },
  {
    name: "八潮",
    lat: 35.807765,
    lng: 139.844735,
    timeToNext: 5
  },
  {
    name: "三郷中央",
    lat: 35.824485,
    lng: 139.878370,
    timeToNext: 6
  },
  {
    name: "南流山",
    lat: 35.838430,
    lng: 139.902795,
    timeToNext: 4
  },
  {
    name: "流山セントラルパーク",
    lat: 35.854590,
    lng: 139.915180,
    timeToNext: 3
  },
  {
    name: "流山おおたかの森",
    lat: 35.872085,
    lng: 139.925760,
    timeToNext: 5
  },
  {
    name: "柏の葉キャンパス",
    lat: 35.893315,
    lng: 139.952525,
    timeToNext: 4
  },
  {
    name: "柏たなか",
    lat: 35.910860,
    lng: 139.957515,
    timeToNext: 4
  },
  {
    name: "守谷",
    lat: 35.950015,
    lng: 139.992010,
    timeToNext: 8
  },
  {
    name: "みらい平",
    lat: 35.994405,
    lng: 140.038345,
    timeToNext: 6
  },
  {
    name: "みどりの",
    lat: 36.029920,
    lng: 140.056205,
    timeToNext: 5
  },
  {
    name: "万博記念公園",
    lat: 36.058400,
    lng: 140.059375,
    timeToNext: 4
  },
  {
    name: "研究学園",
    lat: 36.082165,
    lng: 140.082280,
    timeToNext: 3
  },
  {
    name: "つくば",
    lat: 36.082425,
    lng: 140.110545
  }
];