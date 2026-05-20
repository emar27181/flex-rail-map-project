import type { Station } from './yamanote';

// 京阪交野線: 枚方市〜私市
export const keihanKatanoLine: Station[] = [
  { name: "枚方市",   lat: 34.815200, lng: 135.663100, timeToNext: 3 },
  { name: "宮之阪",   lat: 34.816100, lng: 135.674200, timeToNext: 3 },
  { name: "星ヶ丘",   lat: 34.817200, lng: 135.681100, timeToNext: 3 },
  { name: "村野",     lat: 34.817100, lng: 135.694200, timeToNext: 3 },
  { name: "郡津",     lat: 34.820200, lng: 135.701100, timeToNext: 3 },
  { name: "交野市",   lat: 34.826100, lng: 135.707200, timeToNext: 3 },
  { name: "河内磐船", lat: 34.837200, lng: 135.713100, timeToNext: 3 },
  { name: "星田",     lat: 34.847100, lng: 135.719200, timeToNext: 3 },
  { name: "私市",     lat: 34.854200, lng: 135.724100, timeToNext: 0 },
];

// 京阪鴨東線: 三条〜出町柳
export const keihanKamotoline: Station[] = [
  { name: "三条",     lat: 35.009100, lng: 135.772900, timeToNext: 3 },
  { name: "神宮丸太町", lat: 35.020200, lng: 135.770100, timeToNext: 3 },
  { name: "出町柳",   lat: 35.030100, lng: 135.771800, timeToNext: 0 },
];

// 阪神武庫川線: 武庫川〜武庫川団地前
export const hanshinMukogawaLine: Station[] = [
  { name: "武庫川",       lat: 34.726200, lng: 135.372100, timeToNext: 3 },
  { name: "洲先",         lat: 34.736100, lng: 135.371200, timeToNext: 3 },
  { name: "東鳴尾",       lat: 34.747200, lng: 135.371100, timeToNext: 3 },
  { name: "武庫川団地前", lat: 34.758100, lng: 135.372200, timeToNext: 0 },
];

// JR和田岬線: 兵庫〜和田岬
export const jrWadamisakiLine: Station[] = [
  { name: "兵庫",   lat: 34.672100, lng: 135.165200, timeToNext: 5 },
  { name: "和田岬", lat: 34.663200, lng: 135.158100, timeToNext: 0 },
];

// 近鉄信貴線: 河内山本〜信貴山口
export const kintetsuShigiLine: Station[] = [
  { name: "河内山本", lat: 34.620100, lng: 135.601200, timeToNext: 5 },
  { name: "服部川",   lat: 34.625200, lng: 135.608100, timeToNext: 4 },
  { name: "信貴山口", lat: 34.638100, lng: 135.619200, timeToNext: 0 },
];

// 能勢電鉄日生線: 山下〜日生中央
export const noseDentetsuNisshoLine: Station[] = [
  { name: "山下",     lat: 34.914100, lng: 135.428200, timeToNext: 4 },
  { name: "光風台",   lat: 34.913200, lng: 135.441100, timeToNext: 4 },
  { name: "ときわ台", lat: 34.912100, lng: 135.453200, timeToNext: 4 },
  { name: "日生中央", lat: 34.911200, lng: 135.461100, timeToNext: 0 },
];
