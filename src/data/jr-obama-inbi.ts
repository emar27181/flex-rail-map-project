import type { Station } from './yamanote';

// JR小浜線: 東舞鶴〜敦賀
export const jrObamaLine: Station[] = [
  { name: "東舞鶴",   lat: 35.455200, lng: 135.392100, timeToNext: 5 },
  { name: "松尾寺",   lat: 35.477100, lng: 135.413800, timeToNext: 5 },
  { name: "青郷",     lat: 35.480100, lng: 135.461200, timeToNext: 6 },
  { name: "若狭高浜", lat: 35.512300, lng: 135.519300, timeToNext: 5 },
  { name: "大飯高浜", lat: 35.495200, lng: 135.558800, timeToNext: 5 },
  { name: "若狭本郷", lat: 35.505100, lng: 135.623200, timeToNext: 5 },
  { name: "十村",     lat: 35.487200, lng: 135.651200, timeToNext: 4 },
  { name: "小浜西",   lat: 35.484100, lng: 135.692800, timeToNext: 4 },
  { name: "小浜",     lat: 35.487100, lng: 135.752100, timeToNext: 5 },
  { name: "東小浜",   lat: 35.488300, lng: 135.789200, timeToNext: 4 },
  { name: "加斗",     lat: 35.498200, lng: 135.826800, timeToNext: 4 },
  { name: "大鳥羽",   lat: 35.513100, lng: 135.862800, timeToNext: 4 },
  { name: "若狭有田", lat: 35.529000, lng: 135.901000, timeToNext: 5 },
  { name: "上中",     lat: 35.527800, lng: 135.941800, timeToNext: 5 },
  { name: "三方",     lat: 35.553800, lng: 135.932000, timeToNext: 4 },
  { name: "気山",     lat: 35.568200, lng: 135.966100, timeToNext: 5 },
  { name: "美浜",     lat: 35.596100, lng: 136.003200, timeToNext: 4 },
  { name: "東美浜",   lat: 35.614200, lng: 136.015100, timeToNext: 4 },
  { name: "十分一",   lat: 35.628100, lng: 136.031800, timeToNext: 4 },
  { name: "敦賀",     lat: 35.641800, lng: 136.055700, timeToNext: 0 },
];

// JR因美線: 東津山〜鳥取
export const jrInbiLine: Station[] = [
  { name: "東津山",   lat: 35.058200, lng: 134.020100, timeToNext: 6 },
  { name: "高野",     lat: 35.094200, lng: 134.028200, timeToNext: 6 },
  { name: "美作加茂", lat: 35.132100, lng: 134.041200, timeToNext: 7 },
  { name: "三浦",     lat: 35.178200, lng: 134.065800, timeToNext: 7 },
  { name: "美作河井", lat: 35.227100, lng: 134.076800, timeToNext: 7 },
  { name: "那岐",     lat: 35.253800, lng: 134.117100, timeToNext: 6 },
  { name: "智頭",     lat: 35.282200, lng: 134.219200, timeToNext: 6 },
  { name: "土師",     lat: 35.315800, lng: 134.232100, timeToNext: 5 },
  { name: "那波",     lat: 35.358100, lng: 134.247200, timeToNext: 5 },
  { name: "用瀬",     lat: 35.393200, lng: 134.261100, timeToNext: 5 },
  { name: "郡家",     lat: 35.413800, lng: 134.234200, timeToNext: 7 },
  { name: "鳥取",     lat: 35.501200, lng: 134.234100, timeToNext: 0 },
];
