import type { Station } from './yamanote';

// 名鉄蒲郡線: 吉良吉田〜蒲郡
export const meitetsuGamagoriLine: Station[] = [
  { name: "吉良吉田",   lat: 34.803510, lng: 137.046400, timeToNext: 5 },
  { name: "三河鳥羽",   lat: 34.793347, lng: 137.105182, timeToNext: 5 },
  { name: "形原",       lat: 34.798691, lng: 137.184560, timeToNext: 5 },
  { name: "西浦",       lat: 34.789838, lng: 137.178586, timeToNext: 5 },
  { name: "こどもの国", lat: 34.773720, lng: 137.138190, timeToNext: 5 },
  { name: "蒲郡",       lat: 34.822990, lng: 137.216960, timeToNext: 0 },
];

// 名鉄河和線: 太田川〜河和
export const meitetsuKowaLine: Station[] = [
  { name: "太田川",     lat: 35.020484, lng: 136.892722, timeToNext: 4 },
  { name: "巽ケ丘",     lat: 34.947550, lng: 136.922210, timeToNext: 4 },
  { name: "白沢",       lat: 34.935060, lng: 136.918160, timeToNext: 4 },
  { name: "富貴",       lat: 34.828639, lng: 136.917032, timeToNext: 8 },
  { name: "河和口",     lat: 34.797621, lng: 136.918740, timeToNext: 5 },
  { name: "河和",       lat: 34.778052, lng: 136.912105, timeToNext: 0 },
];

// JR武豊線: 大府〜武豊
export const jrTakehoyLine: Station[] = [
  { name: "大府",       lat: 35.008769, lng: 136.961760, timeToNext: 5 },
  { name: "尾張森岡",   lat: 34.994191, lng: 136.970139, timeToNext: 5 },
  { name: "緒川",       lat: 34.981817, lng: 136.971896, timeToNext: 5 },
  { name: "石浜",       lat: 34.968166, lng: 136.972851, timeToNext: 5 },
  { name: "東浦",       lat: 34.949266, lng: 136.970455, timeToNext: 5 },
  { name: "亀崎",       lat: 34.919040, lng: 136.960989, timeToNext: 5 },
  { name: "乙川",       lat: 34.903358, lng: 136.941217, timeToNext: 5 },
  { name: "半田",       lat: 34.891690, lng: 136.936560, timeToNext: 5 },
  { name: "成岩",       lat: 34.878080, lng: 136.937670, timeToNext: 5 },
  { name: "武豊",       lat: 34.844620, lng: 136.940260, timeToNext: 0 },
];

// 名鉄知多新線: 富貴〜内海
export const meitetsuChitaShinLine: Station[] = [
  { name: "富貴",       lat: 34.828639, lng: 136.917032, timeToNext: 5 },
  { name: "上野間",     lat: 34.807496, lng: 136.867084, timeToNext: 5 },
  { name: "美浜",       lat: 34.786070, lng: 136.872250, timeToNext: 5 },
  { name: "知多奥田",   lat: 34.760780, lng: 136.870540, timeToNext: 5 },
  { name: "野間",       lat: 34.750130, lng: 136.864380, timeToNext: 5 },
  { name: "内海",       lat: 34.727250, lng: 136.860790, timeToNext: 0 },
];

// 名鉄三河線（海線）: 碧南〜吉良吉田
export const meitetsuMikawaKaisen: Station[] = [
  { name: "碧南",       lat: 34.881470, lng: 136.998480, timeToNext: 5 },
  { name: "碧南中央",   lat: 34.875350, lng: 136.990400, timeToNext: 5 },
  { name: "新川町",     lat: 34.896590, lng: 136.990304, timeToNext: 5 },
  { name: "三河旭",     lat: 34.836480, lng: 136.987010, timeToNext: 5 },
  { name: "高浜港",     lat: 34.921223, lng: 136.989205, timeToNext: 5 },
  { name: "三河高浜",   lat: 34.930563, lng: 136.990048, timeToNext: 5 },
  { name: "吉浜",       lat: 34.946399, lng: 136.989057, timeToNext: 5 },
  { name: "吉良吉田",   lat: 34.803510, lng: 137.046400, timeToNext: 0 },
];

// 名鉄三河線（山線）: 猿投〜知立
export const meitetsuMikawaYamasen: Station[] = [
  { name: "猿投",       lat: 35.122282, lng: 137.178764, timeToNext: 8 },
  { name: "三河広瀬",   lat: 35.067340, lng: 137.107610, timeToNext: 5 },
  { name: "西中金",     lat: 35.058060, lng: 137.145810, timeToNext: 8 },
  { name: "枝下",       lat: 35.038600, lng: 137.155800, timeToNext: 5 },
  { name: "三河御船",   lat: 35.016520, lng: 137.149930, timeToNext: 5 },
  { name: "若林",       lat: 35.026521, lng: 137.096226, timeToNext: 5 },
  { name: "竹村",       lat: 35.040155, lng: 137.114946, timeToNext: 5 },
  { name: "土橋",       lat: 35.058213, lng: 137.129760, timeToNext: 5 },
  { name: "三河知立",   lat: 35.005657, lng: 137.054901, timeToNext: 5 },
  { name: "知立",       lat: 35.005811, lng: 137.039873, timeToNext: 0 },
];
