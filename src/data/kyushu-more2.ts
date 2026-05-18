import type { Station } from './yamanote';

// 平成筑豊鉄道伊田線: 直方〜行橋
export const heitatsuIdaLine: Station[] = [
  { name: "直方",       lat: 33.739130, lng: 130.736490, timeToNext: 5 },
  { name: "感田",       lat: 33.751470, lng: 130.734360, timeToNext: 5 },
  { name: "新飯塚",     lat: 33.646780, lng: 130.698070, timeToNext: 15 },
  { name: "飯塚",       lat: 33.647040, lng: 130.688610, timeToNext: 5 },
  { name: "天道",       lat: 33.680990, lng: 130.683260, timeToNext: 8 },
  { name: "三輪",       lat: 33.712900, lng: 130.659590, timeToNext: 8 },
  { name: "田川伊田",   lat: 33.638180, lng: 130.808030, timeToNext: 15 },
  { name: "田川後藤寺", lat: 33.639470, lng: 130.820060, timeToNext: 8 },
  { name: "金田",       lat: 33.669430, lng: 130.823410, timeToNext: 5 },
  { name: "勾金",       lat: 33.701500, lng: 130.817720, timeToNext: 8 },
  { name: "行橋",       lat: 33.726600, lng: 130.989640, timeToNext: 0 },
];

// 甘木鉄道: 基山〜甘木
export const amakiRailway: Station[] = [
  { name: "基山",       lat: 33.421890, lng: 130.518380, timeToNext: 5 },
  { name: "小郡",       lat: 33.393470, lng: 130.543500, timeToNext: 5 },
  { name: "大板井",     lat: 33.374820, lng: 130.562100, timeToNext: 5 },
  { name: "山隈",       lat: 33.368460, lng: 130.587750, timeToNext: 5 },
  { name: "甘木",       lat: 33.399900, lng: 130.654760, timeToNext: 0 },
];

// JR宮崎空港線: 田吉〜宮崎空港
export const jrMiyazakiAirportLine: Station[] = [
  { name: "田吉",       lat: 31.830770, lng: 131.430160, timeToNext: 3 },
  { name: "宮崎空港",   lat: 31.876400, lng: 131.441920, timeToNext: 0 },
];

// JR日田彦山線: 小倉〜添田
export const jrHitaHikosan: Station[] = [
  { name: "小倉",       lat: 33.884160, lng: 130.874780, timeToNext: 5 },
  { name: "西小倉",     lat: 33.889690, lng: 130.862560, timeToNext: 4 },
  { name: "石田",       lat: 33.879640, lng: 130.834990, timeToNext: 5 },
  { name: "呼野",       lat: 33.864140, lng: 130.804770, timeToNext: 8 },
  { name: "採銅所",     lat: 33.845730, lng: 130.795270, timeToNext: 8 },
  { name: "香春",       lat: 33.712320, lng: 130.842450, timeToNext: 12 },
  { name: "田川後藤寺", lat: 33.639470, lng: 130.820060, timeToNext: 5 },
  { name: "田川伊田",   lat: 33.638180, lng: 130.808030, timeToNext: 5 },
  { name: "豊前川崎",   lat: 33.565520, lng: 130.813560, timeToNext: 8 },
  { name: "西添田",     lat: 33.550410, lng: 130.813180, timeToNext: 5 },
  { name: "添田",       lat: 33.535060, lng: 130.816690, timeToNext: 0 },
];

// JR後藤寺線: 新飯塚〜田川後藤寺
export const jrGotojLine: Station[] = [
  { name: "新飯塚",     lat: 33.646780, lng: 130.698070, timeToNext: 5 },
  { name: "上三緒",     lat: 33.649690, lng: 130.726140, timeToNext: 5 },
  { name: "下鴨生",     lat: 33.643760, lng: 130.752380, timeToNext: 5 },
  { name: "筑前大熊",   lat: 33.641520, lng: 130.773100, timeToNext: 5 },
  { name: "船尾",       lat: 33.641450, lng: 130.789390, timeToNext: 5 },
  { name: "田川後藤寺", lat: 33.639470, lng: 130.820060, timeToNext: 0 },
];

// 西鉄甘木線: 宮の陣〜甘木
export const nishitetsuAmakiLine: Station[] = [
  { name: "宮の陣",     lat: 33.398520, lng: 130.547190, timeToNext: 4 },
  { name: "三沢",       lat: 33.405550, lng: 130.572890, timeToNext: 4 },
  { name: "北野",       lat: 33.417810, lng: 130.595160, timeToNext: 4 },
  { name: "大城",       lat: 33.399820, lng: 130.618980, timeToNext: 4 },
  { name: "今隈",       lat: 33.405420, lng: 130.636840, timeToNext: 4 },
  { name: "甘木",       lat: 33.399900, lng: 130.654760, timeToNext: 0 },
];

// JR唐津線: 久保田〜西唐津
export const jrKaratsuLine: Station[] = [
  { name: "久保田",     lat: 33.327210, lng: 130.302710, timeToNext: 8 },
  { name: "小城",       lat: 33.349410, lng: 130.249780, timeToNext: 8 },
  { name: "多久",       lat: 33.291210, lng: 130.125920, timeToNext: 15 },
  { name: "唐津",       lat: 33.449780, lng: 129.969420, timeToNext: 5 },
  { name: "西唐津",     lat: 33.445790, lng: 129.962090, timeToNext: 0 },
];
