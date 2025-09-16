export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const jrNegishiLine: Station[] = [
  {
    name: "大船",
    lat: 35.3531,
    lng: 139.5322,
    timeToNext: 6
  },
  {
    name: "本郷台",
    lat: 35.3731,
    lng: 139.5583,
    timeToNext: 4
  },
  {
    name: "港南台",
    lat: 35.3961,
    lng: 139.5731,
    timeToNext: 4
  },
  {
    name: "洋光台",
    lat: 35.4072,
    lng: 139.5906,
    timeToNext: 3
  },
  {
    name: "磯子",
    lat: 35.4067,
    lng: 139.6175,
    timeToNext: 3
  },
  {
    name: "新杉田",
    lat: 35.4142,
    lng: 139.6383,
    timeToNext: 3
  },
  {
    name: "石川町",
    lat: 35.4319,
    lng: 139.6475,
    timeToNext: 2
  },
  {
    name: "関内",
    lat: 35.4431,
    lng: 139.6350,
    timeToNext: 2
  },
  {
    name: "桜木町",
    lat: 35.4503,
    lng: 139.6306,
    timeToNext: 2
  },
  {
    name: "横浜",
    lat: 35.4656,
    lng: 139.6220
  }
];