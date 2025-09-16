export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const tsukubaExpress: Station[] = [
  {
    name: "秋葉原",
    lat: 35.6983,
    lng: 139.7731,
    timeToNext: 8
  },
  {
    name: "新御徒町",
    lat: 35.7056,
    lng: 139.7831,
    timeToNext: 5
  },
  {
    name: "浅草",
    lat: 35.7117,
    lng: 139.7981,
    timeToNext: 7
  },
  {
    name: "南千住",
    lat: 35.7264,
    lng: 139.7939,
    timeToNext: 6
  },
  {
    name: "北千住",
    lat: 35.7494,
    lng: 139.8047,
    timeToNext: 8
  },
  {
    name: "青井",
    lat: 35.7831,
    lng: 139.8236,
    timeToNext: 5
  },
  {
    name: "六町",
    lat: 35.7981,
    lng: 139.8381,
    timeToNext: 4
  },
  {
    name: "八潮",
    lat: 35.8225,
    lng: 139.8444,
    timeToNext: 5
  },
  {
    name: "三郷中央",
    lat: 35.8447,
    lng: 139.8722,
    timeToNext: 6
  },
  {
    name: "南流山",
    lat: 35.8556,
    lng: 139.9069,
    timeToNext: 4
  },
  {
    name: "流山セントラルパーク",
    lat: 35.8633,
    lng: 139.9194,
    timeToNext: 3
  },
  {
    name: "流山おおたかの森",
    lat: 35.8789,
    lng: 139.9292,
    timeToNext: 5
  },
  {
    name: "柏の葉キャンパス",
    lat: 35.9069,
    lng: 139.9353,
    timeToNext: 4
  },
  {
    name: "柏たなか",
    lat: 35.9183,
    lng: 139.9597,
    timeToNext: 4
  },
  {
    name: "守谷",
    lat: 35.9511,
    lng: 139.9747,
    timeToNext: 8
  },
  {
    name: "みらい平",
    lat: 36.0069,
    lng: 139.9731,
    timeToNext: 6
  },
  {
    name: "みどりの",
    lat: 36.0464,
    lng: 140.0303,
    timeToNext: 5
  },
  {
    name: "万博記念公園",
    lat: 36.0733,
    lng: 140.0764,
    timeToNext: 4
  },
  {
    name: "研究学園",
    lat: 36.0853,
    lng: 140.0947,
    timeToNext: 3
  },
  {
    name: "つくば",
    lat: 36.0833,
    lng: 140.1167
  }
];