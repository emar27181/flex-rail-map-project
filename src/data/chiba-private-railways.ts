import type { Station } from './yamanote';

// 新京成電鉄
export const shinkeisei: Station[] = [
  { name: "松戸", lat: 35.784730, lng: 139.900827 },
  { name: "上本郷", lat: 35.789380, lng: 139.915835 },
  { name: "松戸新田", lat: 35.790655, lng: 139.922330 },
  { name: "みのり台", lat: 35.789345, lng: 139.928785 },
  { name: "八柱", lat: 35.791417, lng: 139.937497 },
  { name: "常盤平", lat: 35.803150, lng: 139.949435 },
  { name: "五香", lat: 35.797285, lng: 139.965770 },
  { name: "元山", lat: 35.790325, lng: 139.975675 },
  { name: "くぬぎ山", lat: 35.782330, lng: 139.975675 },
  { name: "北初富", lat: 35.776555, lng: 139.989805 },
  { name: "新鎌ヶ谷", lat: 35.779610, lng: 139.998355 },
  { name: "初富", lat: 35.771975, lng: 140.000460 },
  { name: "鎌ヶ谷大仏", lat: 35.757855, lng: 140.013940 },
  { name: "二和向台", lat: 35.753885, lng: 140.023730 },
  { name: "三咲", lat: 35.749180, lng: 140.028540 },
  { name: "滝不動", lat: 35.738010, lng: 140.026285 },
  { name: "高根木戸", lat: 35.726605, lng: 140.034985 },
  { name: "高根公団", lat: 35.730420, lng: 140.029435 },
  { name: "北習志野", lat: 35.721325, lng: 140.042175 },
  { name: "習志野", lat: 35.715375, lng: 140.042795, timeToNext: 2 },
  { name: "薬園台", lat: 35.709100, lng: 140.036705, timeToNext: 2 },
  { name: "前原", lat: 35.700655, lng: 140.027520, timeToNext: 2 },
  { name: "新津田沼", lat: 35.690185, lng: 140.023728, timeToNext: 1 },
  { name: "京成津田沼", lat: 35.683640, lng: 140.024845 }
];

// 東葉高速鉄道
export const toyoRapid: Station[] = [
  { name: "西船橋", lat: 35.707985, lng: 139.958045 },
  { name: "東海神", lat: 35.705960, lng: 139.980555 },
  { name: "飯山満", lat: 35.714000, lng: 140.022300 },
  { name: "北習志野", lat: 35.721325, lng: 140.042175 },
  { name: "船橋日大前", lat: 35.727245, lng: 140.060075 },
  { name: "八千代緑が丘", lat: 35.728940, lng: 140.073205 },
  { name: "八千代中央", lat: 35.727875, lng: 140.103305 },
  { name: "村上", lat: 35.723780, lng: 140.118635 },
  { name: "東葉勝田台", lat: 35.716413, lng: 140.125843 }
];

// 京成電鉄本線（拡張）
export const keiseiExtended: Station[] = [
  { name: "京成上野", lat: 35.711310, lng: 139.773510, timeToNext: 3 },
  { name: "日暮里", lat: 35.7281, lng: 139.7714, timeToNext: 2 },
  { name: "新三河島", lat: 35.737342, lng: 139.774168, timeToNext: 2 },
  { name: "町屋", lat: 35.742162, lng: 139.780108, timeToNext: 2 },
  { name: "千住大橋", lat: 35.742410, lng: 139.797050, timeToNext: 2 },
  { name: "京成関屋", lat: 35.743965, lng: 139.811850, timeToNext: 2 },
  { name: "堀切菖蒲園", lat: 35.747650, lng: 139.827540, timeToNext: 2 },
  { name: "お花茶屋", lat: 35.747615, lng: 139.839885, timeToNext: 2 },
  { name: "青砥", lat: 35.745870, lng: 139.856270, timeToNext: 2 },
  { name: "京成高砂", lat: 35.750870, lng: 139.866590, timeToNext: 2 },
  { name: "京成小岩", lat: 35.742215, lng: 139.883615, timeToNext: 2 },
  { name: "江戸川", lat: 35.737835, lng: 139.895872, timeToNext: 2 },
  { name: "国府台", lat: 35.736310, lng: 139.903540, timeToNext: 2 },
  { name: "市川真間", lat: 35.731268, lng: 139.911780, timeToNext: 2 },
  { name: "菅野", lat: 35.728275, lng: 139.919395, timeToNext: 2 },
  { name: "京成八幡", lat: 35.723860, lng: 139.928170, timeToNext: 2 },
  { name: "鬼越", lat: 35.719765, lng: 139.937865, timeToNext: 2 },
  { name: "京成中山", lat: 35.716950, lng: 139.944380, timeToNext: 2 },
  { name: "東中山", lat: 35.714420, lng: 139.952635, timeToNext: 2 },
  { name: "京成西船", lat: 35.711690, lng: 139.958845, timeToNext: 2 },
  { name: "海神", lat: 35.705925, lng: 139.971785, timeToNext: 2 },
  { name: "京成船橋", lat: 35.699963, lng: 139.984937, timeToNext: 2 },
  { name: "大久保", lat: 35.700635, lng: 139.697445, timeToNext: 2 },
  { name: "実籾", lat: 35.686850, lng: 140.068080, timeToNext: 2 },
  { name: "八千代台", lat: 35.701355, lng: 140.090770, timeToNext: 2 },
  { name: "京成大和田", lat: 35.712360, lng: 140.108630, timeToNext: 2 },
  { name: "勝田台", lat: 35.715390, lng: 140.126045, timeToNext: 2 },
  { name: "志津", lat: 35.7174556, lng: 140.1449944, timeToNext: 2 },
  { name: "ユーカリが丘", lat: 35.721830, lng: 140.156385, timeToNext: 2 },
  { name: "京成臼井", lat: 35.730025, lng: 140.180805, timeToNext: 3 },
  { name: "京成佐倉", lat: 35.725205, lng: 140.229865, timeToNext: 3 },
  { name: "大佐倉", lat: 35.729930, lng: 140.250720, timeToNext: 2 },
  { name: "京成酒々井", lat: 35.736877, lng: 140.270157, timeToNext: 2 },
  { name: "宗吾参道", lat: 35.752350, lng: 140.280705, timeToNext: 2 },
  { name: "公津の杜", lat: 35.760210, lng: 140.294445, timeToNext: 3 },
  { name: "京成成田", lat: 35.776270, lng: 140.315465, timeToNext: 2 },
  { name: "東成田", lat: 35.769685, lng: 140.387250, timeToNext: 5 },
  { name: "成田空港", lat: 35.765725, lng: 140.386305 }
];