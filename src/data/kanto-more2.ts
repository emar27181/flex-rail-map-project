import type { Station } from './yamanote';

// ひたちなか海浜鉄道: 勝田〜阿字ヶ浦
export const hitachinakaSeaRailway: Station[] = [
  { name: "勝田",               lat: 36.394870, lng: 140.534460, timeToNext: 4 },
  { name: "工機前",             lat: 36.400200, lng: 140.524100, timeToNext: 3 },
  { name: "金上",               lat: 36.406800, lng: 140.517300, timeToNext: 3 },
  { name: "中根",               lat: 36.421400, lng: 140.516800, timeToNext: 3 },
  { name: "那珂湊",             lat: 36.437500, lng: 140.523400, timeToNext: 5 },
  { name: "殿山",               lat: 36.452200, lng: 140.522900, timeToNext: 3 },
  { name: "平磯",               lat: 36.463400, lng: 140.517200, timeToNext: 3 },
  { name: "磯崎",               lat: 36.480100, lng: 140.514600, timeToNext: 3 },
  { name: "阿字ヶ浦",           lat: 36.491200, lng: 140.517800, timeToNext: 0 },
];


// JR水郡線（水戸〜常陸大宮区間）: 水戸〜常陸大宮
export const jrSuigunLineMain: Station[] = [
  { name: "水戸",               lat: 36.371690, lng: 140.473100, timeToNext: 5 },
  { name: "常陸青柳",           lat: 36.385100, lng: 140.459200, timeToNext: 5 },
  { name: "常陸津田",           lat: 36.397800, lng: 140.447100, timeToNext: 4 },
  { name: "後台",               lat: 36.409300, lng: 140.437400, timeToNext: 4 },
  { name: "下菅谷",             lat: 36.421600, lng: 140.429800, timeToNext: 4 },
  { name: "中菅谷",             lat: 36.431800, lng: 140.422300, timeToNext: 4 },
  { name: "上菅谷",             lat: 36.443900, lng: 140.417100, timeToNext: 5 },
  { name: "南酒出",             lat: 36.455200, lng: 140.414200, timeToNext: 4 },
  { name: "額田",               lat: 36.470400, lng: 140.413100, timeToNext: 5 },
  { name: "河合",               lat: 36.487800, lng: 140.411800, timeToNext: 5 },
  { name: "瓜連",               lat: 36.507300, lng: 140.410200, timeToNext: 5 },
  { name: "静",                 lat: 36.522100, lng: 140.409100, timeToNext: 4 },
  { name: "常陸大宮",           lat: 36.543200, lng: 140.407400, timeToNext: 0 },
];

// 小湊鉄道: 五井〜上総中野
export const kominatoRailway: Station[] = [
  { name: "五井",               lat: 35.519400, lng: 140.117300, timeToNext: 8 },
  { name: "上総村上",           lat: 35.497800, lng: 140.097400, timeToNext: 5 },
  { name: "海士有木",           lat: 35.480200, lng: 140.083700, timeToNext: 5 },
  { name: "上総三又",           lat: 35.462400, lng: 140.068200, timeToNext: 5 },
  { name: "上総山田",           lat: 35.445700, lng: 140.064900, timeToNext: 5 },
  { name: "光風台",             lat: 35.431900, lng: 140.061800, timeToNext: 5 },
  { name: "馬立",               lat: 35.411200, lng: 140.061600, timeToNext: 5 },
  { name: "上総牛久",           lat: 35.391600, lng: 140.068400, timeToNext: 5 },
  { name: "城見ヶ丘",           lat: 35.367300, lng: 140.075200, timeToNext: 5 },
  { name: "飯給",               lat: 35.348100, lng: 140.080700, timeToNext: 5 },
  { name: "月崎",               lat: 35.327400, lng: 140.094700, timeToNext: 5 },
  { name: "上総大久保",         lat: 35.310200, lng: 140.108600, timeToNext: 5 },
  { name: "養老渓谷",           lat: 35.290800, lng: 140.121900, timeToNext: 8 },
  { name: "上総中野",           lat: 35.277400, lng: 140.162100, timeToNext: 0 },
];
