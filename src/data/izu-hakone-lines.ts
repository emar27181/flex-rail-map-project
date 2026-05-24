import type { Station } from './yamanote';

// JR伊東線: 熱海→伊東
export const jrItoLine: Station[] = [
  { name: '熱海', lat: 35.103790, lng: 139.077805, timeToNext: 4 },
  { name: '来宮', lat: 35.098720, lng: 139.065570, timeToNext: 3 },
  { name: '伊豆多賀', lat: 35.059483, lng: 139.066910, timeToNext: 3 },
  { name: '網代', lat: 35.043510, lng: 139.081069, timeToNext: 4 },
  { name: '宇佐美', lat: 35.005635, lng: 139.079785, timeToNext: 5 },
  { name: '伊東', lat: 34.974835, lng: 139.092105 },
];

// 伊豆急行線: 伊東→伊豆急下田
export const izukyuLine: Station[] = [
  { name: '伊東', lat: 34.974835, lng: 139.092105, timeToNext: 3 },
  { name: '南伊東', lat: 34.957755, lng: 139.088035, timeToNext: 3 },
  { name: '川奈', lat: 34.950885, lng: 139.124835, timeToNext: 4 },
  { name: '富戸', lat: 34.910040, lng: 139.131685, timeToNext: 4 },
  { name: '城ヶ崎海岸', lat: 34.890185, lng: 139.121927, timeToNext: 3 },
  { name: '伊豆高原', lat: 34.877460, lng: 139.108175, timeToNext: 4 },
  { name: '伊豆大川', lat: 34.843350, lng: 139.074070, timeToNext: 3 },
  { name: '伊豆北川', lat: 34.827275, lng: 139.075725, timeToNext: 3 },
  { name: '伊豆熱川', lat: 34.817213, lng: 139.069453, timeToNext: 3 },
  { name: '片瀬白田', lat: 34.801850, lng: 139.061220, timeToNext: 3 },
  { name: '伊豆稲取', lat: 34.774555, lng: 139.037370, timeToNext: 4 },
  { name: '今井浜海岸', lat: 34.753715, lng: 139.004670, timeToNext: 3 },
  { name: '河津', lat: 34.747437, lng: 138.995913, timeToNext: 4 },
  { name: '稲梓', lat: 34.722060, lng: 138.949400, timeToNext: 4 },
  { name: '蓮台寺', lat: 34.699467, lng: 138.941290, timeToNext: 3 },
  { name: '伊豆急下田', lat: 34.679690, lng: 138.944285 },
];

// 箱根登山鉄道: 小田原→強羅
export const hakoneTozan: Station[] = [
  { name: '小田原', lat: 35.256210, lng: 139.154765, timeToNext: 5 },
  { name: '箱根板橋', lat: 35.245155, lng: 139.145185, timeToNext: 3 },
  { name: '風祭', lat: 35.246240, lng: 139.129160, timeToNext: 3 },
  { name: '入生田', lat: 35.240780, lng: 139.121060, timeToNext: 3 },
  { name: '箱根湯本', lat: 35.233540, lng: 139.103950, timeToNext: 7 },
  { name: '塔ノ沢', lat: 35.234460, lng: 139.094025, timeToNext: 5 },
  { name: '大平台', lat: 35.239065, lng: 139.073860, timeToNext: 5 },
  { name: '宮ノ下', lat: 35.241990, lng: 139.063025, timeToNext: 4 },
  { name: '小涌谷', lat: 35.240345, lng: 139.053185, timeToNext: 4 },
  { name: '彫刻の森', lat: 35.246650, lng: 139.050760, timeToNext: 3 },
  { name: '強羅', lat: 35.250735, lng: 139.047940 },
];

// 伊豆箱根鉄道駿豆線: 三島→修善寺
export const izuHakoneSunzu: Station[] = [
  { name: '三島', lat: 35.126153, lng: 138.910603, timeToNext: 2 },
  { name: '三島広小路', lat: 35.119345, lng: 138.911215, timeToNext: 2 },
  { name: '三島田町', lat: 35.116202, lng: 138.918563, timeToNext: 3 },
  { name: '三島二日町', lat: 35.111030, lng: 138.925935, timeToNext: 3 },
  { name: '大場', lat: 35.092200, lng: 138.939380, timeToNext: 3 },
  { name: '伊豆仁田', lat: 35.078755, lng: 138.941565, timeToNext: 2 },
  { name: '原木', lat: 35.065490, lng: 138.943705, timeToNext: 3 },
  { name: '韮山', lat: 35.053285, lng: 138.945520, timeToNext: 2 },
  { name: '伊豆長岡', lat: 35.039805, lng: 138.947510, timeToNext: 3 },
  { name: '田京', lat: 35.014565, lng: 138.945775, timeToNext: 3 },
  { name: '大仁', lat: 34.994365, lng: 138.937460, timeToNext: 4 },
  { name: '牧之郷', lat: 34.988855, lng: 138.954420, timeToNext: 3 },
  { name: '修善寺', lat: 34.979270, lng: 138.950970 },
];
