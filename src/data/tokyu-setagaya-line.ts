export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const tokyuSetagayaLine: Station[] = [
  { name: "三軒茶屋", lat: 35.643716, lng: 139.670156, timeToNext: 2 },
  { name: "西太子堂", lat: 35.644545, lng: 139.666382, timeToNext: 2 },
  { name: "若林", lat: 35.645933, lng: 139.659911, timeToNext: 2 },
  { name: "松陰神社前", lat: 35.643947, lng: 139.655211, timeToNext: 2 },
  { name: "世田谷", lat: 35.643564, lng: 139.650945, timeToNext: 2 },
  { name: "上町", lat: 35.643656, lng: 139.646276, timeToNext: 2 },
  { name: "宮の坂", lat: 35.647508, lng: 139.64494, timeToNext: 2 },
  { name: "山下", lat: 35.653844, lng: 139.646509, timeToNext: 2 },
  { name: "松原", lat: 35.660048, lng: 139.642, timeToNext: 2 },
  { name: "下高井戸", lat: 35.66615, lng: 139.641372 }
];
