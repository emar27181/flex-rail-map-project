export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const tokyuSetagayaLine: Station[] = [
  { name: "三軒茶屋", lat: 35.644105, lng: 139.669185, timeToNext: 2 },
  { name: "西太子堂", lat: 35.644545, lng: 139.666382, timeToNext: 2 },
  { name: "若林", lat: 35.645933, lng: 139.659911, timeToNext: 2 },
  { name: "松陰神社前", lat: 35.643885, lng: 139.654990, timeToNext: 2 },
  { name: "世田谷", lat: 35.643495, lng: 139.650840, timeToNext: 2 },
  { name: "上町", lat: 35.643600, lng: 139.646377, timeToNext: 2 },
  { name: "宮の坂", lat: 35.647508, lng: 139.64494, timeToNext: 2 },
  { name: "山下", lat: 35.654246, lng: 139.646437, timeToNext: 2 },
  { name: "松原", lat: 35.660200, lng: 139.641895, timeToNext: 2 },
  { name: "下高井戸", lat: 35.665855, lng: 139.641560 }
];
