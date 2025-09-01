export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const yamanote: Station[] = [
  {
    name: "東京",
    lat: 35.6812,
    lng: 139.7671,
    timeToNext: 2
  },
  {
    name: "神田",
    lat: 35.6919,
    lng: 139.7708,
    timeToNext: 2
  },
  {
    name: "秋葉原",
    lat: 35.6983,
    lng: 139.7731,
    timeToNext: 2
  },
  {
    name: "御徒町",
    lat: 35.7074,
    lng: 139.7762,
    timeToNext: 2
  },
  {
    name: "上野",
    lat: 35.7138,
    lng: 139.7774,
    timeToNext: 2
  },
  {
    name: "鶯谷",
    lat: 35.7208,
    lng: 139.7784,
    timeToNext: 2
  },
  {
    name: "日暮里",
    lat: 35.7281,
    lng: 139.7713,
    timeToNext: 2
  },
  {
    name: "西日暮里",
    lat: 35.7323,
    lng: 139.7664,
    timeToNext: 2
  },
  {
    name: "田端",
    lat: 35.7376,
    lng: 139.7606,
    timeToNext: 3
  },
  {
    name: "駒込",
    lat: 35.7364,
    lng: 139.7470,
    timeToNext: 2
  },
  {
    name: "巣鴨",
    lat: 35.7336,
    lng: 139.7391,
    timeToNext: 2
  },
  {
    name: "大塚",
    lat: 35.7316,
    lng: 139.7288,
    timeToNext: 2
  },
  {
    name: "池袋",
    lat: 35.7295,
    lng: 139.7109,
    timeToNext: 2
  },
  {
    name: "目白",
    lat: 35.7214,
    lng: 139.7065,
    timeToNext: 2
  },
  {
    name: "高田馬場",
    lat: 35.7126,
    lng: 139.7036,
    timeToNext: 2
  },
  {
    name: "新大久保",
    lat: 35.7017,
    lng: 139.7003,
    timeToNext: 2
  },
  {
    name: "新宿",
    lat: 35.6896,
    lng: 139.7006
  }
];