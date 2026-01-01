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
    lat: 35.6812,
    lng: 139.7671,
    timeToNext: 2
  },
  {
    name: "神田",
    lat: 35.6919,
    lng: 139.7708,
    timeToNext: 2
  },
  {
    name: "秋葉原",
    lat: 35.6983,
    lng: 139.7731,
    timeToNext: 2
  },
  {
    name: "御徒町",
    lat: 35.7074,
    lng: 139.7762,
    timeToNext: 2
  },
  {
    name: "上野",
    lat: 35.7138,
    lng: 139.7774,
    timeToNext: 2
  },
  {
    name: "鶯谷",
    lat: 35.7208,
    lng: 139.7784,
    timeToNext: 2
  },
  {
    name: "日暮里",
    lat: 35.7281,
    lng: 139.7713,
    timeToNext: 2
  },
  {
    name: "西日暮里",
    lat: 35.7323,
    lng: 139.7664,
    timeToNext: 2
  },
  {
    name: "田端",
    lat: 35.7376,
    lng: 139.7606,
    timeToNext: 3
  },
  {
    name: "駒込",
    lat: 35.7364,
    lng: 139.7470,
    timeToNext: 2
  },
  {
    name: "巣鴨",
    lat: 35.7336,
    lng: 139.7391,
    timeToNext: 2
  },
  {
    name: "大塚",
    lat: 35.7316,
    lng: 139.7288,
    timeToNext: 2
  },
  {
    name: "池袋",
    lat: 35.7295,
    lng: 139.7109,
    timeToNext: 2
  },
  {
    name: "目白",
    lat: 35.7214,
    lng: 139.7065,
    timeToNext: 2
  },
  {
    name: "高田馬場",
    lat: 35.7126,
    lng: 139.7036,
    timeToNext: 2
  },
  {
    name: "新大久保",
    lat: 35.7017,
    lng: 139.7003,
    timeToNext: 2
  },
  {
    name: "新宿",
    lat: 35.6896,
    lng: 139.7006,
    timeToNext: 2
  },
  {
    name: "代々木",
    lat: 35.6837,
    lng: 139.7020,
    timeToNext: 2
  },
  {
    name: "原宿",
    lat: 35.6702,
    lng: 139.7025,
    timeToNext: 3
  },
  {
    name: "渋谷",
    lat: 35.6580,
    lng: 139.7016,
    timeToNext: 3
  },
  {
    name: "恵比寿",
    lat: 35.6465,
    lng: 139.7100,
    timeToNext: 2
  },
  {
    name: "目黒",
    lat: 35.6333,
    lng: 139.7156,
    timeToNext: 3
  },
  {
    name: "五反田",
    lat: 35.6259,
    lng: 139.7238,
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
    lat: 35.6284,
    lng: 139.7387,
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
    lat: 35.6454,
    lng: 139.7475,
    timeToNext: 3
  },
  {
    name: "浜松町",
    lat: 35.6553,
    lng: 139.7570,
    timeToNext: 2
  },
  {
    name: "新橋",
    lat: 35.6663,
    lng: 139.7583,
    timeToNext: 2
  },
  {
    name: "有楽町",
    lat: 35.6751,
    lng: 139.7634,
    timeToNext: 2
  }
];