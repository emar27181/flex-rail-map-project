import type { Station } from './yamanote';

// JR津山線: 岡山〜津山
export const jrTsuyamaLine: Station[] = [
  { name: "岡山",     lat: 34.655200, lng: 133.918100, timeToNext: 4 },
  { name: "法界院",   lat: 34.671100, lng: 133.909200, timeToNext: 5 },
  { name: "玉柏",     lat: 34.721200, lng: 133.877100, timeToNext: 7 },
  { name: "牧山",     lat: 34.757100, lng: 133.869200, timeToNext: 5 },
  { name: "野々口",   lat: 34.787200, lng: 133.862100, timeToNext: 5 },
  { name: "金川",     lat: 34.822100, lng: 133.837200, timeToNext: 7 },
  { name: "建部",     lat: 34.867200, lng: 133.816100, timeToNext: 7 },
  { name: "福渡",     lat: 34.912100, lng: 133.805200, timeToNext: 6 },
  { name: "神目",     lat: 34.942200, lng: 133.796100, timeToNext: 5 },
  { name: "弓削",     lat: 34.982100, lng: 133.786200, timeToNext: 6 },
  { name: "誕生寺",   lat: 35.017200, lng: 133.776100, timeToNext: 5 },
  { name: "亀甲",     lat: 35.047100, lng: 133.782200, timeToNext: 4 },
  { name: "佐良山",   lat: 35.059200, lng: 133.775100, timeToNext: 4 },
  { name: "津山",     lat: 35.068100, lng: 133.777200, timeToNext: 0 },
];

// 近鉄生駒線: 王寺〜生駒
export const kintetsuIkomaLine: Station[] = [
  { name: "王寺",     lat: 34.594100, lng: 135.700800, timeToNext: 4 },
  { name: "大輪田",   lat: 34.606200, lng: 135.703100, timeToNext: 4 },
  { name: "三室",     lat: 34.619100, lng: 135.700200, timeToNext: 4 },
  { name: "勢野北口", lat: 34.630200, lng: 135.694100, timeToNext: 4 },
  { name: "信貴山下", lat: 34.641100, lng: 135.688200, timeToNext: 4 },
  { name: "荻の台",   lat: 34.652200, lng: 135.684100, timeToNext: 4 },
  { name: "東山",     lat: 34.663100, lng: 135.684200, timeToNext: 4 },
  { name: "生駒",     lat: 34.679200, lng: 135.683100, timeToNext: 0 },
];

// 近鉄田原本線: 新王寺〜西田原本
export const kintetsuTawaramoto: Station[] = [
  { name: "新王寺",   lat: 34.594200, lng: 135.702100, timeToNext: 4 },
  { name: "大輪田",   lat: 34.596100, lng: 135.712200, timeToNext: 4 },
  { name: "伊与戸",   lat: 34.589200, lng: 135.730100, timeToNext: 4 },
  { name: "但馬",     lat: 34.582100, lng: 135.751200, timeToNext: 4 },
  { name: "箸尾",     lat: 34.574200, lng: 135.769100, timeToNext: 4 },
  { name: "池部",     lat: 34.567100, lng: 135.782200, timeToNext: 4 },
  { name: "佐味田川", lat: 34.560200, lng: 135.793100, timeToNext: 4 },
  { name: "西田原本", lat: 34.554100, lng: 135.802200, timeToNext: 0 },
];

// 南海汐見橋線: 汐見橋〜岸里玉出
export const nankaShiomibashiLine: Station[] = [
  { name: "汐見橋",     lat: 34.660100, lng: 135.488200, timeToNext: 4 },
  { name: "芦原町",     lat: 34.655200, lng: 135.498100, timeToNext: 4 },
  { name: "木津川",     lat: 34.644100, lng: 135.507200, timeToNext: 4 },
  { name: "津守",       lat: 34.639200, lng: 135.510100, timeToNext: 4 },
  { name: "西天下茶屋", lat: 34.630100, lng: 135.511200, timeToNext: 4 },
  { name: "岸里玉出",   lat: 34.624200, lng: 135.511100, timeToNext: 0 },
];

// 南海多奈川線: みさき公園〜多奈川
export const nankaTanagawaLine: Station[] = [
  { name: "みさき公園", lat: 34.310100, lng: 135.166200, timeToNext: 5 },
  { name: "深日町",     lat: 34.302200, lng: 135.161100, timeToNext: 4 },
  { name: "深日港",     lat: 34.295100, lng: 135.158200, timeToNext: 4 },
  { name: "多奈川",     lat: 34.285200, lng: 135.152100, timeToNext: 0 },
];
