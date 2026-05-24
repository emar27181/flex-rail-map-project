export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const tamaMonorail: Station[] = [
  { name: "上北台", lat: 35.745824, lng: 139.415822, timeToNext: 2 },
  { name: "桜街道", lat: 35.739035, lng: 139.416555, timeToNext: 2 },
  { name: "玉川上水", lat: 35.732123, lng: 139.417743, timeToNext: 2 },
  { name: "砂川七番", lat: 35.723319, lng: 139.418097, timeToNext: 2 },
  { name: "泉体育館", lat: 35.718775, lng: 139.419525, timeToNext: 2 },
  { name: "立飛", lat: 35.714270, lng: 139.417070, timeToNext: 2 },
  { name: "高松", lat: 35.710045, lng: 139.413275, timeToNext: 2 },
  { name: "立川北", lat: 35.699525, lng: 139.412665, timeToNext: 2 },
  { name: "立川南", lat: 35.696077, lng: 139.412546, timeToNext: 2 },
  { name: "柴崎体育館", lat: 35.689800, lng: 139.409280, timeToNext: 2 },
  { name: "甲州街道", lat: 35.678262, lng: 139.409191, timeToNext: 2 },
  { name: "万願寺", lat: 35.671315, lng: 139.419860, timeToNext: 2 },
  { name: "高幡不動", lat: 35.662275, lng: 139.413100, timeToNext: 2 },
  { name: "程久保", lat: 35.655230, lng: 139.410755, timeToNext: 2 },
  { name: "中央大学・明星大学", lat: 35.641885, lng: 139.408725, timeToNext: 2 },
  { name: "大塚・帝京大学", lat: 35.636878, lng: 139.416461, timeToNext: 2 },
  { name: "松が谷", lat: 35.631795, lng: 139.422035, timeToNext: 2 },
  { name: "多摩センター", lat: 35.623855, lng: 139.422785, timeToNext: 2 },
  { name: "多摩動物公園", lat: 35.648535, lng: 139.403815 }
];
