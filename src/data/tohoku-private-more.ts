import type { Station } from './yamanote';

// 阿武隈急行: 槻木〜福島
export const abukumaKyuko: Station[] = [
  { name: "槻木",      lat: 38.065380, lng: 140.869150, timeToNext: 5 },
  { name: "東船岡",    lat: 38.053900, lng: 140.868860, timeToNext: 5 },
  { name: "船岡",      lat: 38.041480, lng: 140.870010, timeToNext: 5 },
  { name: "大河原",    lat: 38.013860, lng: 140.869370, timeToNext: 5 },
  { name: "北白川",    lat: 37.990610, lng: 140.867130, timeToNext: 5 },
  { name: "角田",      lat: 37.974440, lng: 140.777680, timeToNext: 5 },
  { name: "岡",        lat: 37.949060, lng: 140.751340, timeToNext: 5 },
  { name: "丸森",      lat: 37.901820, lng: 140.773760, timeToNext: 5 },
  { name: "川原子",    lat: 37.879490, lng: 140.740060, timeToNext: 5 },
  { name: "逢隈",      lat: 37.843290, lng: 140.690150, timeToNext: 5 },
  { name: "梁川",      lat: 37.812200, lng: 140.615270, timeToNext: 5 },
  { name: "やながわ希望の森公園前", lat: 37.804560, lng: 140.604880, timeToNext: 5 },
  { name: "富野",      lat: 37.790980, lng: 140.567590, timeToNext: 5 },
  { name: "兜",        lat: 37.775930, lng: 140.541270, timeToNext: 5 },
  { name: "保原",      lat: 37.762220, lng: 140.523170, timeToNext: 5 },
  { name: "大泉",      lat: 37.761810, lng: 140.516460, timeToNext: 5 },
  { name: "二井田",    lat: 37.764810, lng: 140.497900, timeToNext: 5 },
  { name: "新田",      lat: 37.769860, lng: 140.486220, timeToNext: 5 },
  { name: "福島",      lat: 37.754220, lng: 140.468200, timeToNext: 0 },
];

// 山形鉄道フラワー長井線: 赤湯〜荒砥
export const yamagataRailway: Station[] = [
  { name: "赤湯",      lat: 38.046730, lng: 140.072730, timeToNext: 5 },
  { name: "南陽市役所",  lat: 38.065750, lng: 140.062880, timeToNext: 5 },
  { name: "宮内",      lat: 38.088520, lng: 140.069030, timeToNext: 5 },
  { name: "おりはた",   lat: 38.108830, lng: 140.063060, timeToNext: 5 },
  { name: "梨郷",      lat: 38.119380, lng: 140.049700, timeToNext: 5 },
  { name: "西大塚",    lat: 38.133020, lng: 140.048540, timeToNext: 5 },
  { name: "大塚",      lat: 38.152670, lng: 140.050380, timeToNext: 5 },
  { name: "蚕桑",      lat: 38.176760, lng: 140.052290, timeToNext: 5 },
  { name: "鮎貝",      lat: 38.198770, lng: 140.048060, timeToNext: 5 },
  { name: "四季の郷",   lat: 38.209680, lng: 140.038960, timeToNext: 5 },
  { name: "荒砥",      lat: 38.231800, lng: 140.032030, timeToNext: 0 },
];

// JR花輪線: 好摩〜大館
export const jrHanawLine: Station[] = [
  { name: "好摩",      lat: 39.890820, lng: 141.121240, timeToNext: 8 },
  { name: "東大更",    lat: 39.919280, lng: 141.073640, timeToNext: 8 },
  { name: "大更",      lat: 39.953460, lng: 141.053200, timeToNext: 8 },
  { name: "平館",      lat: 39.992860, lng: 141.053020, timeToNext: 8 },
  { name: "北森",      lat: 40.021870, lng: 141.042350, timeToNext: 8 },
  { name: "松尾八幡平",  lat: 40.043030, lng: 141.015640, timeToNext: 8 },
  { name: "安比高原",   lat: 40.073390, lng: 141.010030, timeToNext: 8 },
  { name: "赤坂田",    lat: 40.095670, lng: 140.991170, timeToNext: 8 },
  { name: "小屋の畑",   lat: 40.124960, lng: 140.979310, timeToNext: 8 },
  { name: "荒屋新町",   lat: 40.155600, lng: 140.923540, timeToNext: 8 },
  { name: "横間",      lat: 40.174780, lng: 140.896520, timeToNext: 8 },
  { name: "田山",      lat: 40.214010, lng: 140.847350, timeToNext: 8 },
  { name: "兄畑",      lat: 40.261320, lng: 140.772320, timeToNext: 8 },
  { name: "湯瀬温泉",   lat: 40.282600, lng: 140.756810, timeToNext: 8 },
  { name: "八幡平",    lat: 40.319020, lng: 140.715830, timeToNext: 8 },
  { name: "安戸",      lat: 40.336110, lng: 140.679360, timeToNext: 8 },
  { name: "陸中大里",   lat: 40.349720, lng: 140.659620, timeToNext: 8 },
  { name: "鹿角花輪",   lat: 40.209040, lng: 140.781200, timeToNext: 8 },
  { name: "柴平",      lat: 40.257230, lng: 140.682890, timeToNext: 8 },
  { name: "十和田南",   lat: 40.254020, lng: 140.728610, timeToNext: 10 },
  { name: "末広",      lat: 40.267580, lng: 140.592600, timeToNext: 8 },
  { name: "陸中花輪",   lat: 40.207350, lng: 140.593820, timeToNext: 8 },
  { name: "大館",      lat: 40.274580, lng: 140.566560, timeToNext: 0 },
];

// JR大湊線: 野辺地〜大湊
export const jrOminateLine: Station[] = [
  { name: "野辺地",    lat: 40.752130, lng: 141.122840, timeToNext: 10 },
  { name: "有畑",      lat: 40.768570, lng: 141.184260, timeToNext: 10 },
  { name: "近川",      lat: 40.795260, lng: 141.246240, timeToNext: 10 },
  { name: "金谷沢",    lat: 40.834890, lng: 141.299450, timeToNext: 10 },
  { name: "赤川",      lat: 40.853650, lng: 141.347530, timeToNext: 10 },
  { name: "下北",      lat: 41.113120, lng: 141.330580, timeToNext: 8 },
  { name: "陸奥関根",   lat: 41.121800, lng: 141.325270, timeToNext: 8 },
  { name: "大湊",      lat: 41.295360, lng: 141.218490, timeToNext: 0 },
];

// 秋田内陸縦貫鉄道: 鷹巣〜角館
export const akitaNairikuLine: Station[] = [
  { name: "鷹巣",      lat: 40.213960, lng: 140.367380, timeToNext: 8 },
  { name: "西鷹巣",    lat: 40.214080, lng: 140.347980, timeToNext: 8 },
  { name: "縄文小ヶ田",  lat: 40.186860, lng: 140.345530, timeToNext: 8 },
  { name: "大野台",    lat: 40.162220, lng: 140.349090, timeToNext: 8 },
  { name: "合川",      lat: 40.141590, lng: 140.373550, timeToNext: 8 },
  { name: "上杉",      lat: 40.118820, lng: 140.426530, timeToNext: 8 },
  { name: "米内沢",    lat: 40.102650, lng: 140.475760, timeToNext: 10 },
  { name: "小渕",      lat: 40.066840, lng: 140.483950, timeToNext: 10 },
  { name: "阿仁合",    lat: 39.994920, lng: 140.549630, timeToNext: 12 },
  { name: "萱草",      lat: 39.945490, lng: 140.541540, timeToNext: 10 },
  { name: "笑内",      lat: 39.896430, lng: 140.527480, timeToNext: 10 },
  { name: "岩野目",    lat: 39.862130, lng: 140.510480, timeToNext: 10 },
  { name: "阿仁前田",   lat: 39.843420, lng: 140.509930, timeToNext: 10 },
  { name: "前田南",    lat: 39.826940, lng: 140.511020, timeToNext: 10 },
  { name: "内竪",      lat: 39.800760, lng: 140.524220, timeToNext: 10 },
  { name: "羽後中里",   lat: 39.766680, lng: 140.528580, timeToNext: 10 },
  { name: "松葉",      lat: 39.744800, lng: 140.527490, timeToNext: 10 },
  { name: "羽後太田",   lat: 39.735280, lng: 140.510680, timeToNext: 10 },
  { name: "角館",      lat: 39.594350, lng: 140.556650, timeToNext: 0 },
];
