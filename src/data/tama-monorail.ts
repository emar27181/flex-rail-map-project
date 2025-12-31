export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const tamaMonorail: Station[] = [
  { name: "上北台", lat: 35.745824, lng: 139.415822, timeToNext: 2 },
  { name: "桜街道", lat: 35.739, lng: 139.416653, timeToNext: 2 },
  { name: "玉川上水", lat: 35.73223, lng: 139.417866, timeToNext: 2 },
  { name: "砂川七番", lat: 35.723319, lng: 139.418097, timeToNext: 2 },
  { name: "泉体育館", lat: 35.718775, lng: 139.419525, timeToNext: 2 },
  { name: "立飛", lat: 35.714717, lng: 139.417387, timeToNext: 2 },
  { name: "高松", lat: 35.710158, lng: 139.413242, timeToNext: 2 },
  { name: "立川北", lat: 35.699502, lng: 139.41254, timeToNext: 2 },
  { name: "立川南", lat: 35.696077, lng: 139.412546, timeToNext: 2 },
  { name: "柴崎体育館", lat: 35.689475, lng: 139.409191, timeToNext: 2 },
  { name: "甲州街道", lat: 35.678262, lng: 139.409191, timeToNext: 2 },
  { name: "万願寺", lat: 35.671249, lng: 139.420079, timeToNext: 2 },
  { name: "高幡不動", lat: 35.662361, lng: 139.412953, timeToNext: 2 },
  { name: "程久保", lat: 35.655093, lng: 139.410698, timeToNext: 2 },
  { name: "中央大学・明星大学", lat: 35.64197, lng: 139.408672, timeToNext: 2 },
  { name: "大塚・帝京大学", lat: 35.636878, lng: 139.416461, timeToNext: 2 },
  { name: "松が谷", lat: 35.63169, lng: 139.422201, timeToNext: 2 },
  { name: "多摩センター", lat: 35.623724, lng: 139.422782, timeToNext: 2 },
  { name: "多摩動物公園", lat: 35.649215, lng: 139.404627 }
];
