import type { Station } from './yamanote';

// 平成筑豊鉄道伊田線: 直方〜行橋
export const heitatsuIdaLine: Station[] = [
  { name: "直方",       lat: 33.739130, lng: 130.736490, timeToNext: 5 },
  { name: "感田",       lat: 33.751470, lng: 130.734360, timeToNext: 5 },
  { name: "新飯塚",     lat: 33.646780, lng: 130.698070, timeToNext: 15 },
  { name: "飯塚",       lat: 33.647040, lng: 130.688610, timeToNext: 5 },
  { name: "天道",       lat: 33.605338, lng: 130.677922, timeToNext: 8 },
  { name: "三輪",       lat: 33.712900, lng: 130.659590, timeToNext: 8 },
  { name: "田川伊田",   lat: 33.638180, lng: 130.808030, timeToNext: 15 },
  { name: "田川後藤寺", lat: 33.639470, lng: 130.820060, timeToNext: 8 },
  { name: "金田",       lat: 33.683093, lng: 130.776221, timeToNext: 5 },
  { name: "勾金",       lat: 33.651671, lng: 130.842661, timeToNext: 8 },
  { name: "行橋",       lat: 33.726600, lng: 130.989640, timeToNext: 0 },
];

// 甘木鉄道: 基山〜甘木
export const amakiRailway: Station[] = [
  { name: "基山",       lat: 33.421890, lng: 130.518380, timeToNext: 5 },
  { name: "小郡",       lat: 33.393470, lng: 130.543500, timeToNext: 5 },
  { name: "大板井",     lat: 33.398604, lng: 130.561041, timeToNext: 5 },
  { name: "山隈",       lat: 33.414121, lng: 130.610232, timeToNext: 5 },
  { name: "甘木",       lat: 33.399900, lng: 130.654760, timeToNext: 0 },
];

// JR宮崎空港線: 田吉〜宮崎空港
export const jrMiyazakiAirportLine: Station[] = [
  { name: "田吉",       lat: 31.879203, lng: 131.430381, timeToNext: 3 },
  { name: "宮崎空港",   lat: 31.876400, lng: 131.441920, timeToNext: 0 },
];

// JR日田彦山線: 小倉〜添田
export const jrHitaHikosan: Station[] = [
  { name: "小倉",       lat: 33.884160, lng: 130.874780, timeToNext: 5 },
  { name: "西小倉",     lat: 33.889690, lng: 130.862560, timeToNext: 4 },
  { name: "石田",       lat: 33.831963, lng: 130.888941, timeToNext: 5 },
  { name: "呼野",       lat: 33.754526, lng: 130.861518, timeToNext: 8 },
  { name: "採銅所",     lat: 33.707156, lng: 130.853292, timeToNext: 8 },
  { name: "香春",       lat: 33.666131, lng: 130.846916, timeToNext: 12 },
  { name: "田川後藤寺", lat: 33.639470, lng: 130.820060, timeToNext: 5 },
  { name: "田川伊田",   lat: 33.638180, lng: 130.808030, timeToNext: 5 },
  { name: "豊前川崎",   lat: 33.597090, lng: 130.821334, timeToNext: 8 },
  { name: "西添田",     lat: 33.572960, lng: 130.847433, timeToNext: 5 },
  { name: "添田",       lat: 33.567023, lng: 130.856427, timeToNext: 0 },
];

// JR後藤寺線: 新飯塚〜田川後藤寺
export const jrGotojLine: Station[] = [
  { name: "新飯塚",     lat: 33.646780, lng: 130.698070, timeToNext: 5 },
  { name: "上三緒",     lat: 33.622975, lng: 130.713414, timeToNext: 5 },
  { name: "下鴨生",     lat: 33.614673, lng: 130.728602, timeToNext: 5 },
  { name: "筑前大熊",   lat: 33.641520, lng: 130.773100, timeToNext: 5 },
  { name: "船尾",       lat: 33.630086, lng: 130.767128, timeToNext: 5 },
  { name: "田川後藤寺", lat: 33.639470, lng: 130.820060, timeToNext: 0 },
];

// 西鉄甘木線: 宮の陣〜甘木
export const nishitetsuAmakiLine: Station[] = [
  { name: "宮の陣",     lat: 33.329404, lng: 130.530820, timeToNext: 4 },
  { name: "三沢",       lat: 33.405550, lng: 130.572890, timeToNext: 4 },
  { name: "北野",       lat: 33.345402, lng: 130.582864, timeToNext: 4 },
  { name: "大城",       lat: 33.350951, lng: 130.608105, timeToNext: 4 },
  { name: "今隈",       lat: 33.403951, lng: 130.594169, timeToNext: 4 },
  { name: "甘木",       lat: 33.399900, lng: 130.654760, timeToNext: 0 },
];

// JR唐津線: 久保田〜西唐津
export const jrKaratsuLine: Station[] = [
  { name: "久保田",     lat: 33.255603, lng: 130.228870, timeToNext: 8 },
  { name: "小城",       lat: 33.285631, lng: 130.198653, timeToNext: 8 },
  { name: "多久",       lat: 33.288089, lng: 130.096141, timeToNext: 15 },
  { name: "唐津",       lat: 33.449780, lng: 129.969420, timeToNext: 5 },
  { name: "西唐津",     lat: 33.445790, lng: 129.962090, timeToNext: 0 },
];
