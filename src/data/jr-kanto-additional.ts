import type { Station } from './yamanote';

// JR宇都宮線: 上野→宇都宮（東京上野ラインの一部、大宮以北を中心に）
export const jrUtsunomiyaLine: Station[] = [
  { name: '上野', lat: 35.7130, lng: 139.7772, timeToNext: 5 },
  { name: '赤羽', lat: 35.7773, lng: 139.7217, timeToNext: 6 },
  { name: '浦和', lat: 35.8581, lng: 139.6566, timeToNext: 4 },
  { name: 'さいたま新都心', lat: 35.8943, lng: 139.6306, timeToNext: 2 },
  { name: '大宮', lat: 35.9063, lng: 139.6244, timeToNext: 4 },
  { name: '土呂', lat: 35.9250, lng: 139.6281, timeToNext: 3 },
  { name: '東大宮', lat: 35.9453, lng: 139.6331, timeToNext: 4 },
  { name: '蓮田', lat: 35.9683, lng: 139.6558, timeToNext: 4 },
  { name: '白岡', lat: 35.9903, lng: 139.6789, timeToNext: 4 },
  { name: '新白岡', lat: 36.0003, lng: 139.6856, timeToNext: 3 },
  { name: '久喜', lat: 36.0614, lng: 139.6667, timeToNext: 4 },
  { name: '東鷲宮', lat: 36.0803, lng: 139.6453, timeToNext: 3 },
  { name: '栗橋', lat: 36.1308, lng: 139.6978, timeToNext: 5 },
  { name: '古河', lat: 36.1803, lng: 139.7028, timeToNext: 7 },
  { name: '野木', lat: 36.2161, lng: 139.7289, timeToNext: 4 },
  { name: '間々田', lat: 36.2378, lng: 139.7389, timeToNext: 4 },
  { name: '小山', lat: 36.3144, lng: 139.8003, timeToNext: 6 },
  { name: '小金井', lat: 36.3789, lng: 139.8256, timeToNext: 5 },
  { name: '自治医大', lat: 36.3989, lng: 139.8389, timeToNext: 4 },
  { name: '石橋', lat: 36.4228, lng: 139.8436, timeToNext: 5 },
  { name: '雀宮', lat: 36.5033, lng: 139.8656, timeToNext: 5 },
  { name: '宇都宮', lat: 36.5597, lng: 139.8981 },
];

// JR根岸線: 横浜→大船
export const jrNegishiLine: Station[] = [
  { name: '横浜', lat: 35.4657, lng: 139.6227, timeToNext: 3 },
  { name: '桜木町', lat: 35.4508, lng: 139.6311, timeToNext: 2 },
  { name: '関内', lat: 35.4433, lng: 139.6367, timeToNext: 2 },
  { name: '石川町', lat: 35.4378, lng: 139.6428, timeToNext: 2 },
  { name: '山手', lat: 35.4297, lng: 139.6506, timeToNext: 3 },
  { name: '根岸', lat: 35.4172, lng: 139.6464, timeToNext: 3 },
  { name: '磯子', lat: 35.4017, lng: 139.6261, timeToNext: 3 },
  { name: '新杉田', lat: 35.3933, lng: 139.6175, timeToNext: 3 },
  { name: '洋光台', lat: 35.3789, lng: 139.5914, timeToNext: 3 },
  { name: '港南台', lat: 35.3650, lng: 139.5706, timeToNext: 3 },
  { name: '本郷台', lat: 35.3564, lng: 139.5547, timeToNext: 3 },
  { name: '大船', lat: 35.3531, lng: 139.5328 },
];
