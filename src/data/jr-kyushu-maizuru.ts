import type { Station } from './yamanote';

// JR筑豊本線（福北ゆたか線）: 折尾〜桂川
export const jrFukuhoLine: Station[] = [
  { name: "折尾",       lat: 33.874800, lng: 130.682000, timeToNext: 5 },
  { name: "中間",       lat: 33.823100, lng: 130.715200, timeToNext: 5 },
  { name: "筑前植木",   lat: 33.773200, lng: 130.717100, timeToNext: 4 },
  { name: "木屋瀬",     lat: 33.751100, lng: 130.725800, timeToNext: 4 },
  { name: "直方",       lat: 33.737100, lng: 130.728100, timeToNext: 4 },
  { name: "勝野",       lat: 33.718200, lng: 130.741200, timeToNext: 4 },
  { name: "下鴨生",     lat: 33.700100, lng: 130.733800, timeToNext: 4 },
  { name: "大隈",       lat: 33.680200, lng: 130.723100, timeToNext: 4 },
  { name: "筑前大分",   lat: 33.662100, lng: 130.718200, timeToNext: 4 },
  { name: "飯塚",       lat: 33.643200, lng: 130.690100, timeToNext: 4 },
  { name: "新飯塚",     lat: 33.629100, lng: 130.680200, timeToNext: 4 },
  { name: "鯰田",       lat: 33.613200, lng: 130.681100, timeToNext: 4 },
  { name: "浦田",       lat: 33.599100, lng: 130.684800, timeToNext: 5 },
  { name: "桂川",       lat: 33.561200, lng: 130.681100, timeToNext: 0 },
];

// JR舞鶴線: 綾部〜東舞鶴
export const jrMaizuruLine: Station[] = [
  { name: "綾部",     lat: 35.299100, lng: 135.258200, timeToNext: 5 },
  { name: "梅迫",     lat: 35.322200, lng: 135.282100, timeToNext: 5 },
  { name: "真倉",     lat: 35.354100, lng: 135.303200, timeToNext: 5 },
  { name: "淵垣",     lat: 35.381800, lng: 135.327800, timeToNext: 4 },
  { name: "石原",     lat: 35.404100, lng: 135.347200, timeToNext: 4 },
  { name: "丹波高浜", lat: 35.430200, lng: 135.367100, timeToNext: 4 },
  { name: "西舞鶴",   lat: 35.451200, lng: 135.382100, timeToNext: 3 },
  { name: "東舞鶴",   lat: 35.455200, lng: 135.392100, timeToNext: 0 },
];
