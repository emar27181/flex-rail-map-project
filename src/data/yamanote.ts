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
    lat: 35.6814,
    lng: 139.7661,
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
    lat: 35.6987,
    lng: 139.7742,
    timeToNext: 2
  },
  {
    name: "御徒町",
    lat: 35.7074,
    lng: 139.7746,
    timeToNext: 2
  },
  {
    name: "上野",
    lat: 35.7138,
    lng: 139.7773,
    timeToNext: 2
  },
  {
    name: "鶯谷",
    lat: 35.7205,
    lng: 139.7788,
    timeToNext: 2
  },
  {
    name: "日暮里",
    lat: 35.7278,
    lng: 139.7710,
    timeToNext: 2
  },
  {
    name: "西日暮里",
    lat: 35.7321,
    lng: 139.7668,
    timeToNext: 2
  },
  {
    name: "田端",
    lat: 35.7381,
    lng: 139.7609,
    timeToNext: 3
  },
  {
    name: "駒込",
    lat: 35.7365,
    lng: 139.7469,
    timeToNext: 2
  },
  {
    name: "巣鴨",
    lat: 35.7335,
    lng: 139.7393,
    timeToNext: 2
  },
  {
    name: "大塚",
    lat: 35.7314,
    lng: 139.7287,
    timeToNext: 2
  },
  {
    name: "池袋",
    lat: 35.7289,
    lng: 139.7104,
    timeToNext: 2
  },
  {
    name: "目白",
    lat: 35.7212,
    lng: 139.7066,
    timeToNext: 2
  },
  {
    name: "高田馬場",
    lat: 35.7123,
    lng: 139.7038,
    timeToNext: 2
  },
  {
    name: "新大久保",
    lat: 35.7013,
    lng: 139.7000,
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
    lat: 35.6831,
    lng: 139.7020,
    timeToNext: 2
  },
  {
    name: "原宿",
    lat: 35.6702,
    lng: 139.7027,
    timeToNext: 3
  },
  {
    name: "渋谷",
    lat: 35.6585,
    lng: 139.7013,
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
    lat: 35.6340,
    lng: 139.7158,
    timeToNext: 3
  },
  {
    name: "五反田",
    lat: 35.6264,
    lng: 139.7234,
    timeToNext: 2
  },
  {
    name: "大崎",
    lat: 35.6197,
    lng: 139.7286,
    timeToNext: 3
  },
  {
    name: "品川",
    lat: 35.6302,
    lng: 139.7404,
    timeToNext: 2
  },
  {
    name: "高輪ゲートウェイ",
    lat: 35.6356,
    lng: 139.7407,
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
    lat: 35.6556,
    lng: 139.7567,
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
