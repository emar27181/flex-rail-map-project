import type { Station } from './yamanote';

// JR東海道線（横浜〜小田原）
export const jrTokaidoKanagawa: Station[] = [
  { name: "横浜", lat: 35.4657, lng: 139.6227, timeToNext: 4 },
  { name: "保土ケ谷", lat: 35.4378, lng: 139.6025, timeToNext: 5 },
  { name: "東戸塚", lat: 35.4053, lng: 139.5458, timeToNext: 4 },
  { name: "戸塚", lat: 35.3998, lng: 139.5333, timeToNext: 6 },
  { name: "大船", lat: 35.3531, lng: 139.5328, timeToNext: 5 },
  { name: "藤沢", lat: 35.3389, lng: 139.4903, timeToNext: 4 },
  { name: "辻堂", lat: 35.3374, lng: 139.4571, timeToNext: 3 },
  { name: "茅ケ崎", lat: 35.3297, lng: 139.4067, timeToNext: 4 },
  { name: "平塚", lat: 35.3276, lng: 139.3477, timeToNext: 4 },
  { name: "大磯", lat: 35.3083, lng: 139.3119, timeToNext: 3 },
  { name: "二宮", lat: 35.2975, lng: 139.2531, timeToNext: 4 },
  { name: "国府津", lat: 35.2969, lng: 139.1681, timeToNext: 3 },
  { name: "鴨宮", lat: 35.3092, lng: 139.1639, timeToNext: 3 },
  { name: "小田原", lat: 35.2564, lng: 139.1547, timeToNext: 0 }
];

// JR鶴見線
export const jrTsurumi: Station[] = [
  { name: "鶴見", lat: 35.5077, lng: 139.6768 },
  { name: "国道", lat: 35.5039, lng: 139.6934 },
  { name: "鶴見小野", lat: 35.4981, lng: 139.7089 },
  { name: "弁天橋", lat: 35.4931, lng: 139.7187 },
  { name: "浅野", lat: 35.4889, lng: 139.7267 },
  { name: "安善", lat: 35.4831, lng: 139.7389 },
  { name: "武蔵白石", lat: 35.4789, lng: 139.7456 },
  { name: "鶴見線支線扇町", lat: 35.4756, lng: 139.7534 },
  { name: "大川", lat: 35.4723, lng: 139.7612 },
  { name: "海芝浦", lat: 35.4698, lng: 139.7723 }
];