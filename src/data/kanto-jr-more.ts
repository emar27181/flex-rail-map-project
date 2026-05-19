import type { Station } from './yamanote';

// JR両毛線: 小山〜新前橋
export const jrRyomoline: Station[] = [
  { name: "小山",       lat: 36.309560, lng: 139.796900, timeToNext: 8 },
  { name: "思川",       lat: 36.350728, lng: 139.78165, timeToNext: 5 },
  { name: "栃木",       lat: 36.379180, lng: 139.726610, timeToNext: 10 },
  { name: "大平下",     lat: 36.344351, lng: 139.697542, timeToNext: 8 },
  { name: "岩舟",       lat: 36.328560, lng: 139.680040, timeToNext: 8 },
  { name: "佐野",       lat: 36.316675, lng: 139.578973, timeToNext: 8 },
  { name: "富田",       lat: 36.316161, lng: 139.528807, timeToNext: 5 },
  { name: "足利",       lat: 36.340750, lng: 139.447870, timeToNext: 8 },
  { name: "山前",       lat: 36.343630, lng: 139.395840, timeToNext: 5 },
  { name: "小俣",       lat: 36.375177, lng: 139.374167, timeToNext: 5 },
  { name: "桐生",       lat: 36.404090, lng: 139.334770, timeToNext: 5 },
  { name: "岩宿",       lat: 36.395809, lng: 139.296768, timeToNext: 5 },
  { name: "国定",       lat: 36.358744, lng: 139.242107, timeToNext: 5 },
  { name: "伊勢崎",     lat: 36.326839, lng: 139.19427, timeToNext: 10 },
  { name: "駒形",       lat: 36.354117, lng: 139.139766, timeToNext: 8 },
  { name: "前橋大島",   lat: 36.370551, lng: 139.109672, timeToNext: 5 },
  { name: "前橋",       lat: 36.383212, lng: 139.072641, timeToNext: 5 },
  { name: "新前橋",     lat: 36.378849, lng: 139.047141, timeToNext: 0 },
];

// JR水戸線（延長部）: 水戸〜友部
export const jrMitoLineExt: Station[] = [
  { name: "友部",       lat: 36.347820, lng: 140.277500, timeToNext: 5 },
  { name: "内原",       lat: 36.370404, lng: 140.353315, timeToNext: 5 },
  { name: "赤塚",       lat: 36.376860, lng: 140.423300, timeToNext: 5 },
  { name: "偕楽園",     lat: 36.371150, lng: 140.457840, timeToNext: 3 },
  { name: "水戸",       lat: 36.371690, lng: 140.473100, timeToNext: 0 },
];

// JR烏山線: 宝積寺〜烏山
export const jrKarasuyamaLine: Station[] = [
  { name: "宝積寺",     lat: 36.631491, lng: 139.979591, timeToNext: 5 },
  { name: "下野花岡",   lat: 36.649959, lng: 140.008567, timeToNext: 5 },
  { name: "仁井田",     lat: 36.657213, lng: 140.029858, timeToNext: 5 },
  { name: "鴻野山",     lat: 36.631060, lng: 139.907820, timeToNext: 5 },
  { name: "大金",       lat: 36.614770, lng: 139.879680, timeToNext: 5 },
  { name: "小塙",       lat: 36.593640, lng: 139.867130, timeToNext: 5 },
  { name: "滝",         lat: 36.579780, lng: 139.848890, timeToNext: 5 },
  { name: "烏山",       lat: 36.650454, lng: 140.155037, timeToNext: 0 },
];

// JR久留里線: 木更津〜上総亀山
export const jrKururiLine: Station[] = [
  { name: "木更津",     lat: 35.373900, lng: 139.921180, timeToNext: 5 },
  { name: "祇園",       lat: 35.391524, lng: 139.948304, timeToNext: 5 },
  { name: "上総清川",   lat: 35.352580, lng: 139.869120, timeToNext: 5 },
  { name: "東清川",     lat: 35.334730, lng: 139.843060, timeToNext: 5 },
  { name: "横田",       lat: 35.332470, lng: 139.820960, timeToNext: 5 },
  { name: "東横田",     lat: 35.321760, lng: 139.802080, timeToNext: 5 },
  { name: "馬来田",     lat: 35.297320, lng: 139.781060, timeToNext: 5 },
  { name: "下郡",       lat: 35.302380, lng: 139.762070, timeToNext: 5 },
  { name: "久留里",     lat: 35.295846, lng: 140.07575, timeToNext: 10 },
  { name: "平山",       lat: 35.274359, lng: 140.064867, timeToNext: 5 },
  { name: "上総松丘",   lat: 35.254250, lng: 140.165400, timeToNext: 5 },
  { name: "上総亀山",   lat: 35.233083, lng: 140.089839, timeToNext: 0 },
];

// JR総武本線（千葉〜銚子）補完
export const jrSobuMainLine: Station[] = [
  { name: "千葉",       lat: 35.613760, lng: 140.113670, timeToNext: 5 },
  { name: "都賀",       lat: 35.636082, lng: 140.149235, timeToNext: 5 },
  { name: "四街道",     lat: 35.659930, lng: 140.168950, timeToNext: 5 },
  { name: "物井",       lat: 35.685674, lng: 140.200294, timeToNext: 5 },
  { name: "佐倉",       lat: 35.712340, lng: 140.225050, timeToNext: 8 },
  { name: "榎戸",       lat: 35.750580, lng: 140.337780, timeToNext: 10 },
  { name: "八街",       lat: 35.671370, lng: 140.320620, timeToNext: 8 },
  { name: "成東",       lat: 35.608453, lng: 140.410814, timeToNext: 10 },
  { name: "松尾",       lat: 35.636016, lng: 140.457661, timeToNext: 8 },
  { name: "横芝",       lat: 35.661863, lng: 140.491109, timeToNext: 8 },
  { name: "干潟",       lat: 35.718295, lng: 140.602861, timeToNext: 8 },
  { name: "旭",         lat: 35.721822, lng: 140.655092, timeToNext: 8 },
  { name: "飯岡",       lat: 35.729327, lng: 140.683679, timeToNext: 8 },
  { name: "倉橋",       lat: 35.738071, lng: 140.714446, timeToNext: 5 },
  { name: "銚子",       lat: 35.734230, lng: 140.831470, timeToNext: 0 },
];
