import type { Station } from './yamanote';

// 東武越生線: 坂戸〜越生
export const tobuOgoseLine: Station[] = [
  { name: "坂戸",       lat: 35.957200, lng: 139.400910, timeToNext: 4 },
  { name: "一本松",     lat: 35.965050, lng: 139.384720, timeToNext: 4 },
  { name: "西大家",     lat: 35.972560, lng: 139.369250, timeToNext: 4 },
  { name: "川角",       lat: 35.981730, lng: 139.349490, timeToNext: 5 },
  { name: "武州長瀬",   lat: 35.980560, lng: 139.310870, timeToNext: 5 },
  { name: "東毛呂",     lat: 35.975270, lng: 139.290250, timeToNext: 5 },
  { name: "武州唐沢",   lat: 35.975060, lng: 139.270880, timeToNext: 5 },
  { name: "越生",       lat: 35.978960, lng: 139.291680, timeToNext: 0 },
];

// 西武秩父線: 吾野〜西武秩父
export const seibuChichibuLine: Station[] = [
  { name: "吾野",       lat: 35.898980, lng: 139.175060, timeToNext: 8 },
  { name: "東吾野",     lat: 35.918790, lng: 139.139060, timeToNext: 8 },
  { name: "正丸",       lat: 35.930810, lng: 139.108040, timeToNext: 10 },
  { name: "芦ケ久保",   lat: 35.959940, lng: 139.062660, timeToNext: 8 },
  { name: "横瀬",       lat: 35.986240, lng: 139.031460, timeToNext: 5 },
  { name: "西武秩父",   lat: 35.991100, lng: 139.013820, timeToNext: 0 },
];

// 上毛電気鉄道: 中央前橋〜西桐生
export const jomotetsudo: Station[] = [
  { name: "中央前橋",   lat: 36.390080, lng: 139.057230, timeToNext: 4 },
  { name: "城東",       lat: 36.388190, lng: 139.066420, timeToNext: 4 },
  { name: "三俣",       lat: 36.386300, lng: 139.079790, timeToNext: 4 },
  { name: "片貝",       lat: 36.386810, lng: 139.092280, timeToNext: 4 },
  { name: "赤城",       lat: 36.414540, lng: 139.174780, timeToNext: 15 },
  { name: "新里",       lat: 36.372520, lng: 139.229490, timeToNext: 8 },
  { name: "新桐生",     lat: 36.380380, lng: 139.312010, timeToNext: 8 },
  { name: "西桐生",     lat: 36.406630, lng: 139.331800, timeToNext: 0 },
];

// わたらせ渓谷鐵道: 桐生〜間藤
export const watarasekeikoku: Station[] = [
  { name: "桐生",       lat: 36.404090, lng: 139.334770, timeToNext: 5 },
  { name: "下新田",     lat: 36.395850, lng: 139.332380, timeToNext: 5 },
  { name: "相老",       lat: 36.388000, lng: 139.349700, timeToNext: 5 },
  { name: "運動公園",   lat: 36.371480, lng: 139.375540, timeToNext: 5 },
  { name: "大間々",     lat: 36.374700, lng: 139.394650, timeToNext: 8 },
  { name: "神戸",       lat: 36.434660, lng: 139.391280, timeToNext: 10 },
  { name: "沢入",       lat: 36.571010, lng: 139.434460, timeToNext: 12 },
  { name: "原向",       lat: 36.588430, lng: 139.416250, timeToNext: 8 },
  { name: "通洞",       lat: 36.601290, lng: 139.399370, timeToNext: 5 },
  { name: "足尾",       lat: 36.607710, lng: 139.398420, timeToNext: 5 },
  { name: "間藤",       lat: 36.618160, lng: 139.404900, timeToNext: 0 },
];

// 真岡鐵道（真岡線）: 下館〜茂木
export const mookaRailway: Station[] = [
  { name: "下館",       lat: 36.296820, lng: 139.978540, timeToNext: 8 },
  { name: "下館二高前", lat: 36.307620, lng: 139.971960, timeToNext: 5 },
  { name: "折本",       lat: 36.328450, lng: 139.958010, timeToNext: 5 },
  { name: "ひぐち",     lat: 36.351810, lng: 139.949810, timeToNext: 5 },
  { name: "ものおい",   lat: 36.371780, lng: 139.941120, timeToNext: 5 },
  { name: "大田郷",     lat: 36.390980, lng: 139.921830, timeToNext: 5 },
  { name: "真岡",       lat: 36.438190, lng: 140.018590, timeToNext: 10 },
  { name: "北真岡",     lat: 36.460310, lng: 140.023680, timeToNext: 5 },
  { name: "西田井",     lat: 36.483690, lng: 140.049550, timeToNext: 8 },
  { name: "益子",       lat: 36.476000, lng: 140.103250, timeToNext: 8 },
  { name: "七井",       lat: 36.487050, lng: 140.143970, timeToNext: 8 },
  { name: "多田羅",     lat: 36.505530, lng: 140.171800, timeToNext: 8 },
  { name: "市塙",       lat: 36.521770, lng: 140.199680, timeToNext: 8 },
  { name: "笹原田",     lat: 36.548480, lng: 140.218300, timeToNext: 8 },
  { name: "天矢場",     lat: 36.566060, lng: 140.218290, timeToNext: 8 },
  { name: "茂木",       lat: 36.529460, lng: 140.185310, timeToNext: 0 },
];
