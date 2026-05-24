import type { Station } from './yamanote';

// 相鉄・JR直通線: 海老名→新宿
export const sotetsuJRLine: Station[] = [
  { name: '海老名', lat: 35.452948, lng: 139.391098, timeToNext: 3 },
  { name: 'かしわ台', lat: 35.466845, lng: 139.415885, timeToNext: 2 },
  { name: 'さがみ野', lat: 35.471510, lng: 139.428696, timeToNext: 3 },
  { name: '相模大塚', lat: 35.470540, lng: 139.441155, timeToNext: 3 },
  { name: '大和', lat: 35.4699, lng: 139.4614, timeToNext: 3 },
  { name: '瀬谷', lat: 35.470400, lng: 139.482590, timeToNext: 3 },
  { name: '三ツ境', lat: 35.467785, lng: 139.502570, timeToNext: 3 },
  { name: '希望ヶ丘', lat: 35.460540, lng: 139.513475, timeToNext: 3 },
  { name: '二俣川', lat: 35.463390, lng: 139.532370, timeToNext: 3 },
  { name: '西谷', lat: 35.478065, lng: 139.565521, timeToNext: 4 },
  { name: '羽沢横浜国大', lat: 35.481229, lng: 139.586135, timeToNext: 8 },
  { name: '武蔵小杉', lat: 35.576563, lng: 139.659807, timeToNext: 8 },
  { name: '西大井', lat: 35.601766, lng: 139.721636, timeToNext: 5 },
  { name: '大崎', lat: 35.619945, lng: 139.728245, timeToNext: 4 },
  { name: '恵比寿', lat: 35.646680, lng: 139.710125, timeToNext: 3 },
  { name: '渋谷', lat: 35.658082, lng: 139.701724, timeToNext: 4 },
  { name: '新宿', lat: 35.690110, lng: 139.700610 },
];
