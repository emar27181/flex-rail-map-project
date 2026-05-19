import type { Station } from './yamanote';

// JR鶴見線（本線: 鶴見〜扇町）
export const jrTsurumiLine: Station[] = [
  { name: "鶴見",     lat: 35.508705, lng: 139.679270, timeToNext: 2 },
  { name: "国道",     lat: 35.505140, lng: 139.686750, timeToNext: 2 },
  { name: "鶴見小野", lat: 35.497080, lng: 139.694110, timeToNext: 2 },
  { name: "弁天橋",   lat: 35.490660, lng: 139.697130, timeToNext: 2 },
  { name: "浜川崎",   lat: 35.509928, lng: 139.713861, timeToNext: 3 },
  { name: "昭和",     lat: 35.506469, lng: 139.724051, timeToNext: 3 },
  { name: "扇町",     lat: 35.473790, lng: 139.741940, timeToNext: 0 },
];

// JR鶴見線（海芝浦支線）
export const jrTsurumiUmiShiba: Station[] = [
  { name: "浜川崎",   lat: 35.509928, lng: 139.713861, timeToNext: 4 },
  { name: "安善",     lat: 35.483370, lng: 139.714660, timeToNext: 2 },
  { name: "武蔵白石", lat: 35.483080, lng: 139.726520, timeToNext: 3 },
  { name: "海芝浦",   lat: 35.485904, lng: 139.700285, timeToNext: 0 },
];
