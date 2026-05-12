export type Station = {
  name: string;
  lat: number;
  lng: number;
  timeToNext?: number;
};

export const todenArakawaLine: Station[] = [
  { name: "早稲田", lat: 35.705680, lng: 139.722190, timeToNext: 2 },
  { name: "面影橋", lat: 35.712855, lng: 139.714675, timeToNext: 2 },
  { name: "学習院下", lat: 35.715750, lng: 139.712310, timeToNext: 2 },
  { name: "鬼子母神前", lat: 35.720580, lng: 139.715155, timeToNext: 2 },
  { name: "都電雑司ヶ谷", lat: 35.724067, lng: 139.717817, timeToNext: 2 },
  { name: "東池袋四丁目", lat: 35.725500, lng: 139.720735, timeToNext: 2 },
  { name: "向原", lat: 35.728765, lng: 139.724805, timeToNext: 2 },
  { name: "大塚駅前", lat: 35.731620, lng: 139.729455, timeToNext: 2 },
  { name: "巣鴨新田", lat: 35.735160, lng: 139.727910, timeToNext: 2 },
  { name: "庚申塚", lat: 35.739125, lng: 139.729555, timeToNext: 2 },
  { name: "新庚申塚", lat: 35.741105, lng: 139.730350, timeToNext: 2 },
  { name: "西ヶ原四丁目", lat: 35.744235, lng: 139.732685, timeToNext: 2 },
  { name: "滝野川一丁目", lat: 35.747374, lng: 139.735376, timeToNext: 2 },
  { name: "飛鳥山", lat: 35.750065, lng: 139.737320, timeToNext: 2 },
  { name: "王子駅前", lat: 35.752730, lng: 139.738227, timeToNext: 2 },
  { name: "栄町", lat: 35.750840, lng: 139.742220, timeToNext: 2 },
  { name: "梶原", lat: 35.751070, lng: 139.747300, timeToNext: 2 },
  { name: "荒川車庫前", lat: 35.750860, lng: 139.752805, timeToNext: 2 },
  { name: "荒川遊園地前", lat: 35.750650, lng: 139.757453, timeToNext: 2 },
  { name: "小台", lat: 35.750579, lng: 139.761779, timeToNext: 2 },
  { name: "宮ノ前", lat: 35.749885, lng: 139.765765, timeToNext: 2 },
  { name: "熊野前", lat: 35.749212, lng: 139.769204, timeToNext: 2 },
  { name: "東尾久三丁目", lat: 35.745647, lng: 139.773817, timeToNext: 2 },
  { name: "町屋二丁目", lat: 35.743915, lng: 139.776425, timeToNext: 2 },
  { name: "町屋駅前", lat: 35.742775, lng: 139.780775, timeToNext: 2 },
  { name: "荒川七丁目", lat: 35.742000, lng: 139.784045, timeToNext: 2 },
  { name: "荒川二丁目", lat: 35.738623, lng: 139.784696, timeToNext: 2 },
  { name: "荒川区役所前", lat: 35.735365, lng: 139.786010, timeToNext: 2 },
  { name: "荒川一中前", lat: 35.733690, lng: 139.788805, timeToNext: 2 },
  { name: "三ノ輪橋", lat: 35.732248, lng: 139.791412 }
];
