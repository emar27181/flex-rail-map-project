import type { Station } from './yamanote';

// JR宇都宮線: 上野→宇都宮（東京上野ラインの一部、大宮以北を中心に）
export const jrUtsunomiyaLine: Station[] = [
  { name: '上野', lat: 35.713315, lng: 139.777385, timeToNext: 5 },
  { name: '赤羽', lat: 35.777524, lng: 139.721260, timeToNext: 6 },
  { name: '浦和', lat: 35.858565, lng: 139.657145, timeToNext: 4 },
  { name: 'さいたま新都心', lat: 35.893595, lng: 139.633900, timeToNext: 2 },
  { name: '大宮', lat: 35.906435, lng: 139.624370, timeToNext: 4 },
  { name: '土呂', lat: 35.931915, lng: 139.632195, timeToNext: 3 },
  { name: '東大宮', lat: 35.948360, lng: 139.640260, timeToNext: 4 },
  { name: '蓮田', lat: 35.981165, lng: 139.652965, timeToNext: 4 },
  { name: '白岡', lat: 36.017780, lng: 139.666880, timeToNext: 4 },
  { name: '新白岡', lat: 36.038250, lng: 139.671890, timeToNext: 3 },
  { name: '久喜', lat: 36.065810, lng: 139.677375, timeToNext: 4 },
  { name: '東鷲宮', lat: 36.089635, lng: 139.679695, timeToNext: 3 },
  { name: '栗橋', lat: 36.135715, lng: 139.694035, timeToNext: 5 },
  { name: '古河', lat: 36.194415, lng: 139.709715, timeToNext: 7 },
  { name: '野木', lat: 36.229905, lng: 139.734795, timeToNext: 4 },
  { name: '間々田', lat: 36.257910, lng: 139.761115, timeToNext: 4 },
  { name: '小山', lat: 36.313545, lng: 139.806355, timeToNext: 6 },
  { name: '小金井', lat: 36.374485, lng: 139.842280, timeToNext: 5 },
  { name: '自治医大', lat: 36.395380, lng: 139.854515, timeToNext: 4 },
  { name: '石橋', lat: 36.436240, lng: 139.866510, timeToNext: 5 },
  { name: '雀宮', lat: 36.493725, lng: 139.877043, timeToNext: 5 },
  { name: '宇都宮', lat: 36.559807, lng: 139.898743 },
];

// JR根岸線: 横浜→大船
export const jrNegishiLine: Station[] = [
  { name: '横浜', lat: 35.465407, lng: 139.622253, timeToNext: 3 },
  { name: '桜木町', lat: 35.451100, lng: 139.630880, timeToNext: 2 },
  { name: '関内', lat: 35.444220, lng: 139.635987, timeToNext: 2 },
  { name: '石川町', lat: 35.438907, lng: 139.642917, timeToNext: 2 },
  { name: '山手', lat: 35.426800, lng: 139.646470, timeToNext: 3 },
  { name: '根岸', lat: 35.415860, lng: 139.636095, timeToNext: 3 },
  { name: '磯子', lat: 35.400575, lng: 139.618470, timeToNext: 3 },
  { name: '新杉田', lat: 35.386800, lng: 139.619435, timeToNext: 3 },
  { name: '洋光台', lat: 35.378810, lng: 139.596937, timeToNext: 3 },
  { name: '港南台', lat: 35.375147, lng: 139.576177, timeToNext: 3 },
  { name: '本郷台', lat: 35.367855, lng: 139.550115, timeToNext: 3 },
  { name: '大船', lat: 35.352520, lng: 139.531393 },
];
