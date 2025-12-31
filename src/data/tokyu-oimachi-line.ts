export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const tokyuOimachiLine: Station[] = [
  { name: "大井町", lat: 35.606257, lng: 139.73485, timeToNext: 2 },
  { name: "下神明", lat: 35.608704, lng: 139.726256, timeToNext: 2 },
  { name: "戸越公園", lat: 35.608856, lng: 139.718159, timeToNext: 2 },
  { name: "中延", lat: 35.60571, lng: 139.712526, timeToNext: 2 },
  { name: "荏原町", lat: 35.60382, lng: 139.707571, timeToNext: 2 },
  { name: "旗の台", lat: 35.604923, lng: 139.702286, timeToNext: 2 },
  { name: "北千束", lat: 35.606311, lng: 139.693303, timeToNext: 2 },
  { name: "大岡山", lat: 35.607456, lng: 139.685909, timeToNext: 2 },
  { name: "緑が丘", lat: 35.60638, lng: 139.679482, timeToNext: 2 },
  { name: "自由が丘", lat: 35.607224, lng: 139.668664, timeToNext: 2 },
  { name: "九品仏", lat: 35.60538, lng: 139.660992, timeToNext: 2 },
  { name: "尾山台", lat: 35.606971, lng: 139.653862, timeToNext: 2 },
  { name: "等々力", lat: 35.608369, lng: 139.647938, timeToNext: 2 },
  { name: "上野毛", lat: 35.611957, lng: 139.638917, timeToNext: 2 },
  { name: "二子玉川", lat: 35.611788, lng: 139.626685 }
];
