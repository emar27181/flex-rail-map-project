import type { Station } from './yamanote';

// 新京成電鉄
export const shinkeisei: Station[] = [
  { name: "松戸", lat: 35.7878, lng: 139.9017 },
  { name: "上本郷", lat: 35.7823, lng: 139.8934 },
  { name: "松戸新田", lat: 35.7767, lng: 139.8856 },
  { name: "みのり台", lat: 35.7712, lng: 139.8778 },
  { name: "八柱", lat: 35.7656, lng: 139.8701 },
  { name: "常盤平", lat: 35.7601, lng: 139.8623 },
  { name: "五香", lat: 35.7545, lng: 139.8545 },
  { name: "元山", lat: 35.7489, lng: 139.8467 },
  { name: "くぬぎ山", lat: 35.7434, lng: 139.8389 },
  { name: "北初富", lat: 35.7378, lng: 139.8312 },
  { name: "新鎌ヶ谷", lat: 35.7323, lng: 139.8234 },
  { name: "初富", lat: 35.7267, lng: 139.8156 },
  { name: "鎌ヶ谷大仏", lat: 35.7212, lng: 139.8078 },
  { name: "二和向台", lat: 35.7156, lng: 139.8001 },
  { name: "三咲", lat: 35.7101, lng: 139.7923 },
  { name: "滝不動", lat: 35.7045, lng: 139.7845 },
  { name: "高根木戸", lat: 35.6989, lng: 139.7767 },
  { name: "高根公団", lat: 35.6934, lng: 139.7689 },
  { name: "北習志野", lat: 35.6878, lng: 139.7612 },
  { name: "習志野", lat: 35.6823, lng: 139.7534, timeToNext: 2 },
  { name: "薬園台", lat: 35.6767, lng: 139.7456, timeToNext: 2 },
  { name: "前原", lat: 35.6712, lng: 139.7378, timeToNext: 2 },
  { name: "新津田沼", lat: 35.690219, lng: 140.023616, timeToNext: 1 },
  { name: "京成津田沼", lat: 35.68361, lng: 140.02444 }
];

// 東葉高速鉄道
export const toyoRapid: Station[] = [
  { name: "西船橋", lat: 35.7061, lng: 139.9537 },
  { name: "東海神", lat: 35.7023, lng: 139.9456 },
  { name: "飯山満", lat: 35.6989, lng: 139.9378 },
  { name: "北習志野", lat: 35.6878, lng: 139.7612 },
  { name: "船橋日大前", lat: 35.6823, lng: 139.9234 },
  { name: "八千代緑が丘", lat: 35.6767, lng: 139.9156 },
  { name: "八千代中央", lat: 35.6712, lng: 139.9078 },
  { name: "村上", lat: 35.6656, lng: 139.9001 },
  { name: "東葉勝田台", lat: 35.6601, lng: 139.8923 }
];

// 京成電鉄本線（拡張）
export const keiseiExtended: Station[] = [
  { name: "京成上野", lat: 35.7103, lng: 139.7733, timeToNext: 3 },
  { name: "日暮里", lat: 35.7281, lng: 139.7714, timeToNext: 2 },
  { name: "新三河島", lat: 35.7356, lng: 139.7689, timeToNext: 2 },
  { name: "町屋", lat: 35.7423, lng: 139.7667, timeToNext: 2 },
  { name: "千住大橋", lat: 35.7489, lng: 139.7645, timeToNext: 2 },
  { name: "京成関屋", lat: 35.7556, lng: 139.7623, timeToNext: 2 },
  { name: "堀切菖蒲園", lat: 35.7623, lng: 139.7601, timeToNext: 2 },
  { name: "お花茶屋", lat: 35.7689, lng: 139.7578, timeToNext: 2 },
  { name: "青砥", lat: 35.7756, lng: 139.7556, timeToNext: 2 },
  { name: "京成高砂", lat: 35.7823, lng: 139.7534, timeToNext: 2 },
  { name: "京成小岩", lat: 35.7889, lng: 139.7512, timeToNext: 2 },
  { name: "江戸川", lat: 35.7956, lng: 139.7489, timeToNext: 2 },
  { name: "国府台", lat: 35.8023, lng: 139.7467, timeToNext: 2 },
  { name: "市川真間", lat: 35.8089, lng: 139.7445, timeToNext: 2 },
  { name: "菅野", lat: 35.8156, lng: 139.7423, timeToNext: 2 },
  { name: "京成八幡", lat: 35.8223, lng: 139.7401, timeToNext: 2 },
  { name: "鬼越", lat: 35.8289, lng: 139.7378, timeToNext: 2 },
  { name: "京成中山", lat: 35.8356, lng: 139.7356, timeToNext: 2 },
  { name: "東中山", lat: 35.8423, lng: 139.7334, timeToNext: 2 },
  { name: "京成西船", lat: 35.8489, lng: 139.7312, timeToNext: 2 },
  { name: "海神", lat: 35.8556, lng: 139.7289, timeToNext: 2 },
  { name: "京成船橋", lat: 35.700161, lng: 139.985518, timeToNext: 2 },
  { name: "大久保", lat: 35.6983, lng: 140.0945, timeToNext: 2 },
  { name: "実籾", lat: 35.686889, lng: 140.068444, timeToNext: 2 },
  { name: "八千代台", lat: 35.701420, lng: 140.090870, timeToNext: 2 },
  { name: "京成大和田", lat: 35.7125, lng: 140.1087, timeToNext: 2 },
  { name: "勝田台", lat: 35.715350, lng: 140.126324, timeToNext: 2 },
  { name: "志津", lat: 35.7174556, lng: 140.1449944, timeToNext: 2 },
  { name: "ユーカリが丘", lat: 35.721719, lng: 140.156309, timeToNext: 2 },
  { name: "京成臼井", lat: 35.729917, lng: 140.180722, timeToNext: 3 },
  { name: "京成佐倉", lat: 35.725172, lng: 140.229703, timeToNext: 3 },
  { name: "大佐倉", lat: 35.73012, lng: 140.251067, timeToNext: 2 },
  { name: "京成酒々井", lat: 35.736877, lng: 140.270157, timeToNext: 2 },
  { name: "宗吾参道", lat: 35.752656, lng: 140.280993, timeToNext: 2 },
  { name: "公津の杜", lat: 35.760472, lng: 140.295128, timeToNext: 3 },
  { name: "京成成田", lat: 35.779083, lng: 140.319861, timeToNext: 2 },
  { name: "東成田", lat: 35.770083, lng: 140.38722, timeToNext: 5 },
  { name: "成田空港", lat: 35.7659394, lng: 140.3864676 }
];