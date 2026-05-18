import type { Station } from './yamanote';

// JR両毛線: 小山〜新前橋
export const jrRyomoline: Station[] = [
  { name: "小山",       lat: 36.309560, lng: 139.796900, timeToNext: 8 },
  { name: "思川",       lat: 36.307450, lng: 139.757530, timeToNext: 5 },
  { name: "栃木",       lat: 36.379180, lng: 139.726610, timeToNext: 10 },
  { name: "大平下",     lat: 36.339230, lng: 139.716050, timeToNext: 8 },
  { name: "岩舟",       lat: 36.328560, lng: 139.680040, timeToNext: 8 },
  { name: "佐野",       lat: 36.314030, lng: 139.592750, timeToNext: 8 },
  { name: "富田",       lat: 36.326200, lng: 139.570580, timeToNext: 5 },
  { name: "足利",       lat: 36.340750, lng: 139.447870, timeToNext: 8 },
  { name: "山前",       lat: 36.343630, lng: 139.395840, timeToNext: 5 },
  { name: "小俣",       lat: 36.340340, lng: 139.371480, timeToNext: 5 },
  { name: "桐生",       lat: 36.404090, lng: 139.334770, timeToNext: 5 },
  { name: "岩宿",       lat: 36.420840, lng: 139.307280, timeToNext: 5 },
  { name: "国定",       lat: 36.407660, lng: 139.282060, timeToNext: 5 },
  { name: "伊勢崎",     lat: 36.311280, lng: 139.180330, timeToNext: 10 },
  { name: "駒形",       lat: 36.371290, lng: 139.109290, timeToNext: 8 },
  { name: "前橋大島",   lat: 36.380540, lng: 139.071940, timeToNext: 5 },
  { name: "前橋",       lat: 36.397250, lng: 139.063940, timeToNext: 5 },
  { name: "新前橋",     lat: 36.416520, lng: 139.043340, timeToNext: 0 },
];

// JR水戸線（延長部）: 水戸〜友部
export const jrMitoLineExt: Station[] = [
  { name: "友部",       lat: 36.347820, lng: 140.277500, timeToNext: 5 },
  { name: "内原",       lat: 36.341800, lng: 140.344700, timeToNext: 5 },
  { name: "赤塚",       lat: 36.376860, lng: 140.423300, timeToNext: 5 },
  { name: "偕楽園",     lat: 36.371150, lng: 140.457840, timeToNext: 3 },
  { name: "水戸",       lat: 36.371690, lng: 140.473100, timeToNext: 0 },
];

// JR烏山線: 宝積寺〜烏山
export const jrKarasuyamaLine: Station[] = [
  { name: "宝積寺",     lat: 36.668410, lng: 139.970220, timeToNext: 5 },
  { name: "下野花岡",   lat: 36.658550, lng: 139.951140, timeToNext: 5 },
  { name: "仁井田",     lat: 36.636420, lng: 139.930880, timeToNext: 5 },
  { name: "鴻野山",     lat: 36.631060, lng: 139.907820, timeToNext: 5 },
  { name: "大金",       lat: 36.614770, lng: 139.879680, timeToNext: 5 },
  { name: "小塙",       lat: 36.593640, lng: 139.867130, timeToNext: 5 },
  { name: "滝",         lat: 36.579780, lng: 139.848890, timeToNext: 5 },
  { name: "烏山",       lat: 36.661470, lng: 140.133090, timeToNext: 0 },
];

// JR久留里線: 木更津〜上総亀山
export const jrKururiLine: Station[] = [
  { name: "木更津",     lat: 35.373900, lng: 139.921180, timeToNext: 5 },
  { name: "祇園",       lat: 35.369350, lng: 139.905510, timeToNext: 5 },
  { name: "上総清川",   lat: 35.352580, lng: 139.869120, timeToNext: 5 },
  { name: "東清川",     lat: 35.334730, lng: 139.843060, timeToNext: 5 },
  { name: "横田",       lat: 35.332470, lng: 139.820960, timeToNext: 5 },
  { name: "東横田",     lat: 35.321760, lng: 139.802080, timeToNext: 5 },
  { name: "馬来田",     lat: 35.297320, lng: 139.781060, timeToNext: 5 },
  { name: "下郡",       lat: 35.302380, lng: 139.762070, timeToNext: 5 },
  { name: "久留里",     lat: 35.266070, lng: 140.139870, timeToNext: 10 },
  { name: "平山",       lat: 35.257160, lng: 140.154570, timeToNext: 5 },
  { name: "上総松丘",   lat: 35.254250, lng: 140.165400, timeToNext: 5 },
  { name: "上総亀山",   lat: 35.248990, lng: 140.175560, timeToNext: 0 },
];

// JR総武本線（千葉〜銚子）補完
export const jrSobuMainLine: Station[] = [
  { name: "千葉",       lat: 35.613760, lng: 140.113670, timeToNext: 5 },
  { name: "都賀",       lat: 35.671820, lng: 140.125070, timeToNext: 5 },
  { name: "四街道",     lat: 35.659930, lng: 140.168950, timeToNext: 5 },
  { name: "物井",       lat: 35.654710, lng: 140.199510, timeToNext: 5 },
  { name: "佐倉",       lat: 35.712340, lng: 140.225050, timeToNext: 8 },
  { name: "榎戸",       lat: 35.750580, lng: 140.337780, timeToNext: 10 },
  { name: "八街",       lat: 35.671370, lng: 140.320620, timeToNext: 8 },
  { name: "成東",       lat: 35.576560, lng: 140.378040, timeToNext: 10 },
  { name: "松尾",       lat: 35.590060, lng: 140.441470, timeToNext: 8 },
  { name: "横芝",       lat: 35.598530, lng: 140.522700, timeToNext: 8 },
  { name: "干潟",       lat: 35.678380, lng: 140.574470, timeToNext: 8 },
  { name: "旭",         lat: 35.714310, lng: 140.617220, timeToNext: 8 },
  { name: "飯岡",       lat: 35.721350, lng: 140.651100, timeToNext: 8 },
  { name: "倉橋",       lat: 35.724040, lng: 140.702600, timeToNext: 5 },
  { name: "銚子",       lat: 35.734230, lng: 140.831470, timeToNext: 0 },
];
