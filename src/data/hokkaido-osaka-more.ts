import type { Station } from './yamanote';

// JR大阪東線: 新大阪〜久宝寺
export const jrOsakaHigashiLine: Station[] = [
  { name: "新大阪",     lat: 34.733460, lng: 135.500440, timeToNext: 3 },
  { name: "南吹田",     lat: 34.762330, lng: 135.527060, timeToNext: 3 },
  { name: "JR淡路",    lat: 34.742460, lng: 135.527640, timeToNext: 3 },
  { name: "城北公園通", lat: 34.726240, lng: 135.531640, timeToNext: 3 },
  { name: "野江",       lat: 34.709120, lng: 135.541100, timeToNext: 2 },
  { name: "鴫野",       lat: 34.700380, lng: 135.547360, timeToNext: 3 },
  { name: "放出",       lat: 34.690060, lng: 135.571180, timeToNext: 4 },
  { name: "高井田中央", lat: 34.664920, lng: 135.579440, timeToNext: 3 },
  { name: "JR俊徳道",  lat: 34.650240, lng: 135.579840, timeToNext: 2 },
  { name: "JR長瀬",    lat: 34.636350, lng: 135.581160, timeToNext: 2 },
  { name: "衣摺加美北", lat: 34.627840, lng: 135.574790, timeToNext: 2 },
  { name: "新加美",     lat: 34.615100, lng: 135.565250, timeToNext: 2 },
  { name: "久宝寺",     lat: 34.607640, lng: 135.560690, timeToNext: 0 },
];

// JR学園都市線（札沼線）: 桑園〜北海道医療大学
export const jrGakuendaiLine: Station[] = [
  { name: "桑園",           lat: 43.067390, lng: 141.336290, timeToNext: 3 },
  { name: "八軒",           lat: 43.079060, lng: 141.315900, timeToNext: 3 },
  { name: "新川",           lat: 43.093180, lng: 141.301840, timeToNext: 3 },
  { name: "新琴似",         lat: 43.099270, lng: 141.297350, timeToNext: 3 },
  { name: "太平",           lat: 43.118030, lng: 141.292430, timeToNext: 3 },
  { name: "百合が原",       lat: 43.124420, lng: 141.307440, timeToNext: 3 },
  { name: "篠路",           lat: 43.133010, lng: 141.321430, timeToNext: 3 },
  { name: "拓北",           lat: 43.147140, lng: 141.330020, timeToNext: 3 },
  { name: "あいの里教育大", lat: 43.165420, lng: 141.341850, timeToNext: 3 },
  { name: "あいの里公園",   lat: 43.175220, lng: 141.360960, timeToNext: 5 },
  { name: "石狩太美",       lat: 43.219200, lng: 141.438540, timeToNext: 6 },
  { name: "石狩当別",       lat: 43.283870, lng: 141.543170, timeToNext: 6 },
  { name: "本中小屋",       lat: 43.328040, lng: 141.599710, timeToNext: 5 },
  { name: "中小屋",         lat: 43.349170, lng: 141.620860, timeToNext: 5 },
  { name: "北海道医療大学", lat: 43.347640, lng: 141.608180, timeToNext: 0 },
];
