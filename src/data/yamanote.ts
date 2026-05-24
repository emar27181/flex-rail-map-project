export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
  isExpress?: boolean; // 急行停車駅フラグ（true: 急行が停車, false/undefined: 各駅停車のみ）
};

export const yamanote: Station[] = [
  {
    name: "東京",
    lat: 35.680965,
    lng: 139.766685,
    timeToNext: 2
  },
  {
    name: "神田",
    lat: 35.6917,
    lng: 139.7709,
    timeToNext: 2
  },
  {
    name: "秋葉原",
    lat: 35.698970,
    lng: 139.774283,
    timeToNext: 2
  },
  {
    name: "御徒町",
    lat: 35.707195,
    lng: 139.774715,
    timeToNext: 2
  },
  {
    name: "上野",
    lat: 35.713865,
    lng: 139.777510,
    timeToNext: 2
  },
  {
    name: "鶯谷",
    lat: 35.721455,
    lng: 139.778030,
    timeToNext: 2
  },
  {
    name: "日暮里",
    lat: 35.727987,
    lng: 139.771190,
    timeToNext: 2
  },
  {
    name: "西日暮里",
    lat: 35.732175,
    lng: 139.766715,
    timeToNext: 2
  },
  {
    name: "田端",
    lat: 35.737475,
    lng: 139.761575,
    timeToNext: 3
  },
  {
    name: "駒込",
    lat: 35.736010,
    lng: 139.746853,
    timeToNext: 2
  },
  {
    name: "巣鴨",
    lat: 35.733720,
    lng: 139.740350,
    timeToNext: 2
  },
  {
    name: "大塚",
    lat: 35.731785,
    lng: 139.727940,
    timeToNext: 2
  },
  {
    name: "池袋",
    lat: 35.729185,
    lng: 139.710885,
    timeToNext: 2
  },
  {
    name: "目白",
    lat: 35.720390,
    lng: 139.706280,
    timeToNext: 2
  },
  {
    name: "高田馬場",
    lat: 35.712483,
    lng: 139.704000,
    timeToNext: 2
  },
  {
    name: "新大久保",
    lat: 35.700930,
    lng: 139.700255,
    timeToNext: 2
  },
  {
    name: "新宿",
    lat: 35.6909,
    lng: 139.7003,
    timeToNext: 2
  },
  {
    name: "代々木",
    lat: 35.683795,
    lng: 139.702210,
    timeToNext: 2
  },
  {
    name: "原宿",
    lat: 35.671320,
    lng: 139.702712,
    timeToNext: 3
  },
  {
    name: "渋谷",
    lat: 35.658082,
    lng: 139.701724,
    timeToNext: 3
  },
  {
    name: "恵比寿",
    lat: 35.6467,
    lng: 139.7101,
    timeToNext: 2
  },
  {
    name: "目黒",
    lat: 35.633406,
    lng: 139.715727,
    timeToNext: 3
  },
  {
    name: "五反田",
    lat: 35.626060,
    lng: 139.723696,
    timeToNext: 2
  },
  {
    name: "大崎",
    lat: 35.619945,
    lng: 139.728245,
    timeToNext: 3
  },
  {
    name: "品川",
    lat: 35.629564,
    lng: 139.740069,
    timeToNext: 2
  },
  {
    name: "高輪ゲートウェイ",
    lat: 35.635379,
    lng: 139.740644,
    timeToNext: 2
  },
  {
    name: "田町",
    lat: 35.6457,
    lng: 139.7476,
    timeToNext: 3
  },
  {
    name: "浜松町",
    lat: 35.655410,
    lng: 139.757125,
    timeToNext: 2
  },
  {
    name: "新橋",
    lat: 35.6655,
    lng: 139.7596,
    timeToNext: 2
  },
  {
    name: "有楽町",
    lat: 35.6751,
    lng: 139.7633,
    timeToNext: 2
  }
];
