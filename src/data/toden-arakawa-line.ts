export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const todenArakawaLine: Station[] = [
  { name: "早稲田", lat: 35.705723, lng: 139.721319, timeToNext: 2 },
  { name: "面影橋", lat: 35.712981, lng: 139.714444, timeToNext: 2 },
  { name: "学習院下", lat: 35.716248, lng: 139.71247, timeToNext: 2 },
  { name: "鬼子母神前", lat: 35.720403, lng: 139.714916, timeToNext: 2 },
  { name: "都電雑司ヶ谷", lat: 35.724261, lng: 139.718006, timeToNext: 2 },
  { name: "東池袋四丁目", lat: 35.72528, lng: 139.720012, timeToNext: 2 },
  { name: "向原", lat: 35.728938, lng: 139.724894, timeToNext: 2 },
  { name: "大塚駅前", lat: 35.732082, lng: 139.729593, timeToNext: 2 },
  { name: "巣鴨新田", lat: 35.735488, lng: 139.727769, timeToNext: 2 },
  { name: "庚申塚", lat: 35.739563, lng: 139.729743, timeToNext: 2 },
  { name: "新庚申塚", lat: 35.741348, lng: 139.730451, timeToNext: 2 },
  { name: "西ヶ原四丁目", lat: 35.744501, lng: 139.732779, timeToNext: 2 },
  { name: "滝野川一丁目", lat: 35.747374, lng: 139.735376, timeToNext: 2 },
  { name: "飛鳥山", lat: 35.750248, lng: 139.737382, timeToNext: 2 },
  { name: "王子駅前", lat: 35.753199, lng: 139.737661, timeToNext: 2 },
  { name: "栄町", lat: 35.750909, lng: 139.742124, timeToNext: 2 },
  { name: "梶原", lat: 35.751162, lng: 139.747403, timeToNext: 2 },
  { name: "荒川車庫前", lat: 35.750909, lng: 139.752617, timeToNext: 2 },
  { name: "荒川遊園地前", lat: 35.750744, lng: 139.757767, timeToNext: 2 },
  { name: "小台", lat: 35.750579, lng: 139.761779, timeToNext: 2 },
  { name: "宮ノ前", lat: 35.750135, lng: 139.764955, timeToNext: 2 },
  { name: "熊野前", lat: 35.749212, lng: 139.769204, timeToNext: 2 },
  { name: "東尾久三丁目", lat: 35.745398, lng: 139.774386, timeToNext: 2 },
  { name: "町屋二丁目", lat: 35.743837, lng: 139.776625, timeToNext: 2 },
  { name: "町屋駅前", lat: 35.74275, lng: 139.781145, timeToNext: 2 },
  { name: "荒川七丁目", lat: 35.741975, lng: 139.78417, timeToNext: 2 },
  { name: "荒川二丁目", lat: 35.738623, lng: 139.784696, timeToNext: 2 },
  { name: "荒川区役所前", lat: 35.73493, lng: 139.786456, timeToNext: 2 },
  { name: "荒川一中前", lat: 35.733659, lng: 139.788988, timeToNext: 2 },
  { name: "三ノ輪橋", lat: 35.732248, lng: 139.791412 }
];
