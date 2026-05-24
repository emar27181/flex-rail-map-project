export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

// JR八高線（東京都内区間：八王子～箱根ヶ崎）
export const jrHachikoLine: Station[] = [
  { name: "八王子", lat: 35.655493, lng: 139.338880, timeToNext: 2 },
  { name: "北八王子", lat: 35.669275, lng: 139.363400, timeToNext: 2 },
  { name: "小宮", lat: 35.685865, lng: 139.368477, timeToNext: 2 },
  { name: "拝島", lat: 35.721278, lng: 139.343468, timeToNext: 3 },
  { name: "東福生", lat: 35.745748, lng: 139.335888, timeToNext: 2 },
  { name: "箱根ヶ崎", lat: 35.771695, lng: 139.346735, timeToNext: 3 }
];
