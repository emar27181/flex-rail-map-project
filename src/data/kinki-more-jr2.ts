import type { Station } from './yamanote';

// JR桜井線（万葉まほろば線）: 奈良〜高田
export const jrSakuraiLine: Station[] = [
  { name: "奈良",       lat: 34.685070, lng: 135.832180, timeToNext: 5 },
  { name: "京終",       lat: 34.668050, lng: 135.837680, timeToNext: 5 },
  { name: "帯解",       lat: 34.646240, lng: 135.842560, timeToNext: 5 },
  { name: "櫟本",       lat: 34.616350, lng: 135.845520, timeToNext: 5 },
  { name: "天理",       lat: 34.595590, lng: 135.840620, timeToNext: 5 },
  { name: "長柄",       lat: 34.567760, lng: 135.845150, timeToNext: 5 },
  { name: "柳本",       lat: 34.554820, lng: 135.847830, timeToNext: 5 },
  { name: "巻向",       lat: 34.543880, lng: 135.841990, timeToNext: 5 },
  { name: "三輪",       lat: 34.529350, lng: 135.853650, timeToNext: 5 },
  { name: "玄番",       lat: 34.517580, lng: 135.852580, timeToNext: 5 },
  { name: "桜井",       lat: 34.513770, lng: 135.843500, timeToNext: 5 },
  { name: "金橋",       lat: 34.509612, lng: 135.765302, timeToNext: 5 },
  { name: "香久山",     lat: 34.497830, lng: 135.808320, timeToNext: 5 },
  { name: "畝傍",       lat: 34.494600, lng: 135.800120, timeToNext: 5 },
  { name: "耳成",       lat: 34.512399, lng: 135.814748, timeToNext: 5 },
  { name: "大和八木",   lat: 34.505890, lng: 135.797020, timeToNext: 5 },
  { name: "金田",       lat: 34.508960, lng: 135.749460, timeToNext: 5 },
  { name: "二上",       lat: 34.546528, lng: 135.688197, timeToNext: 5 },
  { name: "高田",       lat: 34.516288, lng: 135.744823, timeToNext: 0 },
];

// 阪急甲陽線: 夙川〜甲陽園
export const hankyuKoyoLine: Station[] = [
  { name: "夙川",       lat: 34.742920, lng: 135.327920, timeToNext: 4 },
  { name: "苦楽園口",   lat: 34.755280, lng: 135.332400, timeToNext: 4 },
  { name: "甲陽園",     lat: 34.764310, lng: 135.340970, timeToNext: 0 },
];

// 近鉄けいはんな線: 長田〜学研奈良登美ヶ丘
export const kintetsuKeihanna: Station[] = [
  { name: "長田",       lat: 34.663280, lng: 135.574970, timeToNext: 4 },
  { name: "荒本",       lat: 34.672380, lng: 135.600570, timeToNext: 4 },
  { name: "吉田",       lat: 34.666350, lng: 135.620590, timeToNext: 4 },
  { name: "新石切",     lat: 34.672920, lng: 135.647130, timeToNext: 5 },
  { name: "石切",       lat: 34.681500, lng: 135.657340, timeToNext: 5 },
  { name: "額田",       lat: 34.688210, lng: 135.667850, timeToNext: 5 },
  { name: "枚岡",       lat: 34.669800, lng: 135.648170, timeToNext: 5 },
  { name: "瓢箪山",     lat: 34.662061, lng: 135.639022, timeToNext: 5 },
  { name: "河内花園",   lat: 34.662839, lng: 135.617991, timeToNext: 5 },
  { name: "東花園",     lat: 34.662521, lng: 135.626465, timeToNext: 8 },
  { name: "学研奈良登美ヶ丘", lat: 34.726559, lng: 135.752194, timeToNext: 0 },
];

// 北大阪急行: 江坂〜箕面萱野
export const kitaosakaKyuko: Station[] = [
  { name: "江坂",       lat: 34.752950, lng: 135.512430, timeToNext: 3 },
  { name: "緑地公園",   lat: 34.784510, lng: 135.503830, timeToNext: 3 },
  { name: "桃山台",     lat: 34.803200, lng: 135.497390, timeToNext: 3 },
  { name: "千里中央",   lat: 34.817570, lng: 135.494250, timeToNext: 5 },
  { name: "箕面船場阪大前", lat: 34.836830, lng: 135.490530, timeToNext: 4 },
  { name: "箕面萱野",   lat: 34.848020, lng: 135.478600, timeToNext: 0 },
];

// 阪急千里線: 天神橋筋六丁目〜北千里
export const hankyuSenriLine: Station[] = [
  { name: "天神橋筋六丁目", lat: 34.710070, lng: 135.519310, timeToNext: 3 },
  { name: "柴島",       lat: 34.723800, lng: 135.513340, timeToNext: 3 },
  { name: "淡路",       lat: 34.729800, lng: 135.514530, timeToNext: 3 },
  { name: "崇禅寺",     lat: 34.740350, lng: 135.510260, timeToNext: 3 },
  { name: "南方",       lat: 34.725665, lng: 135.499708, timeToNext: 3 },
  { name: "山田",       lat: 34.816800, lng: 135.507630, timeToNext: 8 },
  { name: "北千里",     lat: 34.820032, lng: 135.511056, timeToNext: 0 },
];

// 阪急嵐山線: 桂〜嵐山
export const hankyuArashiyamaLine: Station[] = [
  { name: "桂",         lat: 34.991940, lng: 135.700440, timeToNext: 4 },
  { name: "上桂",       lat: 35.007540, lng: 135.694310, timeToNext: 4 },
  { name: "松尾大社",   lat: 35.009500, lng: 135.684730, timeToNext: 4 },
  { name: "嵐山",       lat: 35.011570, lng: 135.674770, timeToNext: 0 },
];

// JR湖西線（北部）: 近江塩津〜近江舞子
export const jrKosaiLineNorth: Station[] = [
  { name: "近江塩津",   lat: 35.539119, lng: 136.151485, timeToNext: 8 },
  { name: "永原",       lat: 35.499003, lng: 136.122668, timeToNext: 5 },
  { name: "マキノ",     lat: 35.461374, lng: 136.059801, timeToNext: 5 },
  { name: "近江中庄",   lat: 35.441369, lng: 136.038547, timeToNext: 5 },
  { name: "新旭",       lat: 35.355295, lng: 136.035532, timeToNext: 5 },
  { name: "安曇川",     lat: 35.328438, lng: 136.019975, timeToNext: 5 },
  { name: "近江高島",   lat: 35.292640, lng: 136.010307, timeToNext: 5 },
  { name: "北小松",     lat: 35.253738, lng: 135.970582, timeToNext: 8 },
  { name: "近江舞子",   lat: 35.235822, lng: 135.959030, timeToNext: 0 },
];
