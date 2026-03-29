import type { Station } from './yamanote';

// 相鉄・JR直通線: 海老名→新宿
export const sotetsuJRLine: Station[] = [
  { name: '海老名', lat: 35.4528, lng: 139.3913, timeToNext: 3 },
  { name: 'かしわ台', lat: 35.4540, lng: 139.4200, timeToNext: 2 },
  { name: 'さがみ野', lat: 35.4560, lng: 139.4350, timeToNext: 3 },
  { name: '相模大塚', lat: 35.4600, lng: 139.4480, timeToNext: 3 },
  { name: '大和', lat: 35.4699, lng: 139.4614, timeToNext: 3 },
  { name: '瀬谷', lat: 35.4656, lng: 139.4712, timeToNext: 3 },
  { name: '三ツ境', lat: 35.4634, lng: 139.4856, timeToNext: 3 },
  { name: '希望ヶ丘', lat: 35.4612, lng: 139.5012, timeToNext: 3 },
  { name: '二俣川', lat: 35.4589, lng: 139.5178, timeToNext: 3 },
  { name: '西谷', lat: 35.4376, lng: 139.5515, timeToNext: 4 },
  { name: '羽沢横浜国大', lat: 35.4653, lng: 139.5722, timeToNext: 8 },
  { name: '武蔵小杉', lat: 35.5781, lng: 139.6567, timeToNext: 8 },
  { name: '西大井', lat: 35.6018, lng: 139.7218, timeToNext: 5 },
  { name: '大崎', lat: 35.6197, lng: 139.7283, timeToNext: 4 },
  { name: '恵比寿', lat: 35.6467, lng: 139.7103, timeToNext: 3 },
  { name: '渋谷', lat: 35.6580, lng: 139.7016, timeToNext: 4 },
  { name: '新宿', lat: 35.6896, lng: 139.7006 },
];
