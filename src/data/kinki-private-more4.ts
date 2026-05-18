import type { Station } from './yamanote';

// 阪急神戸線（支線）阪急甲陽線・阪急伊丹線
export const hankyuItamiLine: Station[] = [
  { name: "塚口",       lat: 34.761250, lng: 135.392680, timeToNext: 4 },
  { name: "稲野",       lat: 34.762720, lng: 135.398090, timeToNext: 4 },
  { name: "新伊丹",     lat: 34.769070, lng: 135.403120, timeToNext: 4 },
  { name: "伊丹",       lat: 34.777310, lng: 135.401050, timeToNext: 0 },
];

// 阪急箕面線: 石橋阪大前〜箕面
export const hankyuMinooLine: Station[] = [
  { name: "石橋阪大前", lat: 34.823050, lng: 135.467590, timeToNext: 4 },
  { name: "桜井",       lat: 34.833590, lng: 135.463220, timeToNext: 4 },
  { name: "牧落",       lat: 34.844770, lng: 135.461450, timeToNext: 4 },
  { name: "箕面",       lat: 34.831110, lng: 135.469920, timeToNext: 0 },
];

// 近鉄天理線: 平端〜天理
export const kintetsuTenriLine: Station[] = [
  { name: "平端",       lat: 34.567160, lng: 135.781740, timeToNext: 4 },
  { name: "二階堂",     lat: 34.577930, lng: 135.808440, timeToNext: 4 },
  { name: "前栽",       lat: 34.579310, lng: 135.820570, timeToNext: 4 },
  { name: "天理",       lat: 34.595590, lng: 135.840620, timeToNext: 0 },
];

// 近鉄道明寺線: 道明寺〜柏原南口
export const kintetsuDoumyojiLine: Station[] = [
  { name: "道明寺",     lat: 34.570900, lng: 135.624390, timeToNext: 5 },
  { name: "柏原南口",   lat: 34.556680, lng: 135.633100, timeToNext: 0 },
];

// 近鉄長野線: 古市〜河内長野
export const kintetsuNaganoLine: Station[] = [
  { name: "古市",       lat: 34.533470, lng: 135.594860, timeToNext: 4 },
  { name: "喜志",       lat: 34.509420, lng: 135.584060, timeToNext: 4 },
  { name: "富田林",     lat: 34.495240, lng: 135.586820, timeToNext: 4 },
  { name: "富田林西口", lat: 34.490580, lng: 135.577530, timeToNext: 4 },
  { name: "川西",       lat: 34.479570, lng: 135.572880, timeToNext: 4 },
  { name: "滝谷不動",   lat: 34.467960, lng: 135.566080, timeToNext: 4 },
  { name: "汐ノ宮",     lat: 34.456750, lng: 135.560790, timeToNext: 4 },
  { name: "河内長野",   lat: 34.456550, lng: 135.562460, timeToNext: 0 },
];

// 大阪メトロ御堂筋線（梅田〜天王寺）主要部
export const osakaMidosujiMain: Station[] = [
  { name: "江坂",       lat: 34.752950, lng: 135.512430, timeToNext: 3 },
  { name: "東三国",     lat: 34.741240, lng: 135.513440, timeToNext: 3 },
  { name: "新大阪",     lat: 34.732520, lng: 135.500410, timeToNext: 3 },
  { name: "西中島南方", lat: 34.723380, lng: 135.499880, timeToNext: 3 },
  { name: "中津",       lat: 34.710280, lng: 135.502730, timeToNext: 3 },
  { name: "梅田",       lat: 34.705010, lng: 135.498880, timeToNext: 3 },
  { name: "淀屋橋",     lat: 34.694780, lng: 135.502940, timeToNext: 3 },
  { name: "本町",       lat: 34.682500, lng: 135.501600, timeToNext: 3 },
  { name: "心斎橋",     lat: 34.673980, lng: 135.501580, timeToNext: 3 },
  { name: "難波",       lat: 34.665350, lng: 135.500760, timeToNext: 3 },
  { name: "天王寺",     lat: 34.646450, lng: 135.513930, timeToNext: 0 },
];
