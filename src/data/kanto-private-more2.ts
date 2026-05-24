import type { Station } from './yamanote';

// 東武越生線: 坂戸〜越生
export const tobuOgoseLine: Station[] = [
  { name: "坂戸",       lat: 35.957200, lng: 139.400910, timeToNext: 4 },
  { name: "一本松",     lat: 35.965050, lng: 139.384720, timeToNext: 4 },
  { name: "西大家",     lat: 35.931661, lng: 139.356282, timeToNext: 4 },
  { name: "川角",       lat: 35.937490, lng: 139.346849, timeToNext: 5 },
  { name: "武州長瀬",   lat: 35.941922, lng: 139.326014, timeToNext: 5 },
  { name: "東毛呂",     lat: 35.975270, lng: 139.290250, timeToNext: 5 },
  { name: "武州唐沢",   lat: 35.951950, lng: 139.309302, timeToNext: 5 },
  { name: "越生",       lat: 35.978960, lng: 139.291680, timeToNext: 0 },
];

// 西武秩父線: 吾野〜西武秩父
export const seibuChichibuLine: Station[] = [
  { name: "吾野",       lat: 35.908491, lng: 139.226734, timeToNext: 8 },
  { name: "東吾野",     lat: 35.892103, lng: 139.260522, timeToNext: 8 },
  { name: "正丸",       lat: 35.938315, lng: 139.182097, timeToNext: 10 },
  { name: "芦ケ久保",   lat: 35.959940, lng: 139.062660, timeToNext: 8 },
  { name: "横瀬",       lat: 35.985277, lng: 139.097790, timeToNext: 5 },
  { name: "西武秩父",   lat: 35.990212, lng: 139.083122, timeToNext: 0 },
];

// 上毛電気鉄道: 中央前橋〜西桐生
export const jomotetsudo: Station[] = [
  { name: "中央前橋",   lat: 36.390080, lng: 139.057230, timeToNext: 4 },
  { name: "城東",       lat: 36.388190, lng: 139.066420, timeToNext: 4 },
  { name: "三俣",       lat: 36.386300, lng: 139.079790, timeToNext: 4 },
  { name: "片貝",       lat: 36.386810, lng: 139.092280, timeToNext: 4 },
  { name: "赤城",       lat: 36.425775, lng: 139.276290, timeToNext: 15 },
  { name: "新里",       lat: 36.418591, lng: 139.237704, timeToNext: 8 },
  { name: "新桐生",     lat: 36.380380, lng: 139.312010, timeToNext: 8 },
  { name: "西桐生",     lat: 36.406630, lng: 139.331800, timeToNext: 0 },
];

// わたらせ渓谷鐵道: 桐生〜間藤
export const watarasekeikoku: Station[] = [
  { name: "桐生",       lat: 36.404090, lng: 139.334770, timeToNext: 5 },
  { name: "下新田",     lat: 36.395850, lng: 139.332380, timeToNext: 5 },
  { name: "相老",       lat: 36.410467, lng: 139.304463, timeToNext: 5 },
  { name: "運動公園",   lat: 36.371480, lng: 139.375540, timeToNext: 5 },
  { name: "大間々",     lat: 36.434609, lng: 139.277432, timeToNext: 8 },
  { name: "神戸",       lat: 36.537417, lng: 139.356344, timeToNext: 10 },
  { name: "沢入",       lat: 36.580754, lng: 139.396243, timeToNext: 12 },
  { name: "原向",       lat: 36.588430, lng: 139.416250, timeToNext: 8 },
  { name: "通洞",       lat: 36.637041, lng: 139.439974, timeToNext: 5 },
  { name: "足尾",       lat: 36.641727, lng: 139.447978, timeToNext: 5 },
  { name: "間藤",       lat: 36.653119, lng: 139.449877, timeToNext: 0 },
];

// 真岡鐵道（真岡線）: 下館〜茂木
export const mookaRailway: Station[] = [
  { name: "下館",       lat: 36.296820, lng: 139.978540, timeToNext: 8 },
  { name: "下館二高前", lat: 36.307620, lng: 139.971960, timeToNext: 5 },
  { name: "折本",       lat: 36.328450, lng: 139.958010, timeToNext: 5 },
  { name: "ひぐち",     lat: 36.358481, lng: 139.970447, timeToNext: 5 },
  { name: "ものおい",   lat: 36.371780, lng: 139.941120, timeToNext: 5 },
  { name: "大田郷",     lat: 36.278214, lng: 139.959641, timeToNext: 5 },
  { name: "真岡",       lat: 36.438190, lng: 140.018590, timeToNext: 10 },
  { name: "北真岡",     lat: 36.460310, lng: 140.023680, timeToNext: 5 },
  { name: "西田井",     lat: 36.453393, lng: 140.048719, timeToNext: 8 },
  { name: "益子",       lat: 36.476000, lng: 140.103250, timeToNext: 8 },
  { name: "七井",       lat: 36.492204, lng: 140.094414, timeToNext: 8 },
  { name: "多田羅",     lat: 36.515895, lng: 140.089906, timeToNext: 8 },
  { name: "市塙",       lat: 36.538155, lng: 140.110359, timeToNext: 8 },
  { name: "笹原田",     lat: 36.533671, lng: 140.145415, timeToNext: 8 },
  { name: "天矢場",     lat: 36.529284, lng: 140.155950, timeToNext: 8 },
  { name: "茂木",       lat: 36.529460, lng: 140.185310, timeToNext: 0 },
];
