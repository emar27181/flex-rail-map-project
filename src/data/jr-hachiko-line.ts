export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

// JR八高線（東京都内区間：八王子～箱根ヶ崎）
export const jrHachikoLine: Station[] = [
  { name: "八王子", lat: 35.655846, lng: 139.338974, timeToNext: 2 },
  { name: "北八王子", lat: 35.672525, lng: 139.331253, timeToNext: 2 },
  { name: "小宮", lat: 35.689758, lng: 139.332489, timeToNext: 2 },
  { name: "拝島", lat: 35.721278, lng: 139.343468, timeToNext: 3 },
  { name: "東福生", lat: 35.730908, lng: 139.337311, timeToNext: 2 },
  { name: "箱根ヶ崎", lat: 35.756344, lng: 139.330261, timeToNext: 3 }
];
