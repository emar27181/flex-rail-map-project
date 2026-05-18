import type { Station } from './yamanote';

// 名鉄蒲郡線: 吉良吉田〜蒲郡
export const meitetsuGamagoriLine: Station[] = [
  { name: "吉良吉田",   lat: 34.803510, lng: 137.046400, timeToNext: 5 },
  { name: "三河鳥羽",   lat: 34.793090, lng: 137.069380, timeToNext: 5 },
  { name: "形原",       lat: 34.787000, lng: 137.104020, timeToNext: 5 },
  { name: "西浦",       lat: 34.773400, lng: 137.118090, timeToNext: 5 },
  { name: "こどもの国", lat: 34.773720, lng: 137.138190, timeToNext: 5 },
  { name: "蒲郡",       lat: 34.822990, lng: 137.216960, timeToNext: 0 },
];

// 名鉄河和線: 太田川〜河和
export const meitetsuKowaLine: Station[] = [
  { name: "太田川",     lat: 34.969890, lng: 136.920850, timeToNext: 4 },
  { name: "巽ケ丘",     lat: 34.947550, lng: 136.922210, timeToNext: 4 },
  { name: "白沢",       lat: 34.935060, lng: 136.918160, timeToNext: 4 },
  { name: "富貴",       lat: 34.871300, lng: 136.921190, timeToNext: 8 },
  { name: "河和口",     lat: 34.848600, lng: 136.937230, timeToNext: 5 },
  { name: "河和",       lat: 34.836430, lng: 136.959640, timeToNext: 0 },
];

// JR武豊線: 大府〜武豊
export const jrTakehoyLine: Station[] = [
  { name: "大府",       lat: 34.972100, lng: 137.070110, timeToNext: 5 },
  { name: "尾張森岡",   lat: 34.961100, lng: 137.024940, timeToNext: 5 },
  { name: "緒川",       lat: 34.927870, lng: 137.000610, timeToNext: 5 },
  { name: "石浜",       lat: 34.918350, lng: 136.994440, timeToNext: 5 },
  { name: "東浦",       lat: 34.980890, lng: 137.009010, timeToNext: 5 },
  { name: "亀崎",       lat: 34.873670, lng: 136.971640, timeToNext: 5 },
  { name: "乙川",       lat: 34.861860, lng: 136.965750, timeToNext: 5 },
  { name: "半田",       lat: 34.891690, lng: 136.936560, timeToNext: 5 },
  { name: "成岩",       lat: 34.878080, lng: 136.937670, timeToNext: 5 },
  { name: "武豊",       lat: 34.844620, lng: 136.940260, timeToNext: 0 },
];

// 名鉄知多新線: 富貴〜内海
export const meitetsuChitaShinLine: Station[] = [
  { name: "富貴",       lat: 34.871300, lng: 136.921190, timeToNext: 5 },
  { name: "上野間",     lat: 34.851250, lng: 136.891220, timeToNext: 5 },
  { name: "美浜",       lat: 34.786070, lng: 136.872250, timeToNext: 5 },
  { name: "知多奥田",   lat: 34.760780, lng: 136.870540, timeToNext: 5 },
  { name: "野間",       lat: 34.750130, lng: 136.864380, timeToNext: 5 },
  { name: "内海",       lat: 34.727250, lng: 136.860790, timeToNext: 0 },
];

// 名鉄三河線（海線）: 碧南〜吉良吉田
export const meitetsuMikawaKaisen: Station[] = [
  { name: "碧南",       lat: 34.881470, lng: 136.998480, timeToNext: 5 },
  { name: "碧南中央",   lat: 34.875350, lng: 136.990400, timeToNext: 5 },
  { name: "新川町",     lat: 34.853130, lng: 136.987290, timeToNext: 5 },
  { name: "三河旭",     lat: 34.836480, lng: 136.987010, timeToNext: 5 },
  { name: "高浜港",     lat: 34.814790, lng: 137.000770, timeToNext: 5 },
  { name: "三河高浜",   lat: 34.811810, lng: 137.011240, timeToNext: 5 },
  { name: "吉浜",       lat: 34.806460, lng: 137.026960, timeToNext: 5 },
  { name: "吉良吉田",   lat: 34.803510, lng: 137.046400, timeToNext: 0 },
];

// 名鉄三河線（山線）: 猿投〜知立
export const meitetsuMikawaYamasen: Station[] = [
  { name: "猿投",       lat: 35.102070, lng: 137.093300, timeToNext: 8 },
  { name: "三河広瀬",   lat: 35.067340, lng: 137.107610, timeToNext: 5 },
  { name: "西中金",     lat: 35.058060, lng: 137.145810, timeToNext: 8 },
  { name: "枝下",       lat: 35.038600, lng: 137.155800, timeToNext: 5 },
  { name: "三河御船",   lat: 35.016520, lng: 137.149930, timeToNext: 5 },
  { name: "若林",       lat: 34.990810, lng: 137.142350, timeToNext: 5 },
  { name: "竹村",       lat: 34.975390, lng: 137.141280, timeToNext: 5 },
  { name: "土橋",       lat: 34.945340, lng: 137.133120, timeToNext: 5 },
  { name: "三河知立",   lat: 34.935790, lng: 137.118390, timeToNext: 5 },
  { name: "知立",       lat: 34.924520, lng: 137.098930, timeToNext: 0 },
];
