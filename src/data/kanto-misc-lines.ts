import type { Station } from './yamanote';

// 東武宇都宮線: 栃木〜東武宇都宮
export const tobuUtsunomiyaLine: Station[] = [
  { name: "栃木",         lat: 36.379000, lng: 139.733400, timeToNext: 5 },
  { name: "新栃木",       lat: 36.394600, lng: 139.734800, timeToNext: 4 },
  { name: "野州平川",     lat: 36.416300, lng: 139.744300, timeToNext: 4 },
  { name: "野州大塚",     lat: 36.437800, lng: 139.759800, timeToNext: 5 },
  { name: "壬生",         lat: 36.463200, lng: 139.799600, timeToNext: 5 },
  { name: "おもちゃのまち", lat: 36.485800, lng: 139.819000, timeToNext: 4 },
  { name: "安塚",         lat: 36.502400, lng: 139.828600, timeToNext: 4 },
  { name: "西川田",       lat: 36.524900, lng: 139.852600, timeToNext: 4 },
  { name: "江曽島",       lat: 36.543200, lng: 139.868200, timeToNext: 3 },
  { name: "南宇都宮",     lat: 36.549200, lng: 139.875100, timeToNext: 3 },
  { name: "東武宇都宮",   lat: 36.555600, lng: 139.889400, timeToNext: 0 },
];

// 京急逗子線: 金沢八景〜逗子・葉山
export const keikyuZushiLine: Station[] = [
  { name: "金沢八景",   lat: 35.342100, lng: 139.632600, timeToNext: 4 },
  { name: "六浦",       lat: 35.332100, lng: 139.614100, timeToNext: 4 },
  { name: "神武寺",     lat: 35.313000, lng: 139.595200, timeToNext: 4 },
  { name: "逗子・葉山", lat: 35.297800, lng: 139.578600, timeToNext: 0 },
];

// 東急こどもの国線: 長津田〜こどもの国
export const tokyuKodomoLine: Station[] = [
  { name: "長津田",     lat: 35.537300, lng: 139.493600, timeToNext: 6 },
  { name: "恩田",       lat: 35.538100, lng: 139.510800, timeToNext: 6 },
  { name: "こどもの国", lat: 35.536800, lng: 139.527700, timeToNext: 0 },
];
