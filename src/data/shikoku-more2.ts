import type { Station } from './yamanote';

// 高松琴平電鉄長尾線: 高松築港〜長尾
export const kotohiraLongLine: Station[] = [
  { name: "高松築港",   lat: 34.349310, lng: 134.048180, timeToNext: 3 },
  { name: "片原町",     lat: 34.350420, lng: 134.051480, timeToNext: 3 },
  { name: "瓦町",       lat: 34.347820, lng: 134.050740, timeToNext: 3 },
  { name: "林道",       lat: 34.328390, lng: 134.060790, timeToNext: 4 },
  { name: "木太町",     lat: 34.327400, lng: 134.075160, timeToNext: 4 },
  { name: "元山",       lat: 34.321650, lng: 134.091440, timeToNext: 4 },
  { name: "水田",       lat: 34.319310, lng: 134.104190, timeToNext: 4 },
  { name: "西前田",     lat: 34.329800, lng: 134.117080, timeToNext: 4 },
  { name: "高田",       lat: 34.338560, lng: 134.129400, timeToNext: 4 },
  { name: "農学部前",   lat: 34.341690, lng: 134.149540, timeToNext: 4 },
  { name: "平木",       lat: 34.349820, lng: 134.172510, timeToNext: 4 },
  { name: "池戸",       lat: 34.323900, lng: 134.188680, timeToNext: 5 },
  { name: "長尾",       lat: 34.300480, lng: 134.201000, timeToNext: 0 },
];

// 高松琴平電鉄志度線: 瓦町〜志度
export const kotohiraShidoLine: Station[] = [
  { name: "瓦町",       lat: 34.347820, lng: 134.050740, timeToNext: 3 },
  { name: "今橋",       lat: 34.347460, lng: 134.059200, timeToNext: 3 },
  { name: "松島二丁目", lat: 34.343130, lng: 134.070620, timeToNext: 3 },
  { name: "沖松島",     lat: 34.341530, lng: 134.082440, timeToNext: 3 },
  { name: "春日川",     lat: 34.341630, lng: 134.093050, timeToNext: 3 },
  { name: "潟元",       lat: 34.348010, lng: 134.113480, timeToNext: 4 },
  { name: "琴電屋島",   lat: 34.367800, lng: 134.106160, timeToNext: 4 },
  { name: "古高松南",   lat: 34.372150, lng: 134.116770, timeToNext: 4 },
  { name: "八栗",       lat: 34.385970, lng: 134.126010, timeToNext: 4 },
  { name: "八栗新道",   lat: 34.388280, lng: 134.143890, timeToNext: 4 },
  { name: "塩屋",       lat: 34.386460, lng: 134.159430, timeToNext: 4 },
  { name: "房前",       lat: 34.382790, lng: 134.172920, timeToNext: 4 },
  { name: "原",         lat: 34.382140, lng: 134.195790, timeToNext: 4 },
  { name: "琴電志度",   lat: 34.322820, lng: 134.175140, timeToNext: 0 },
];

// 土佐くろしお鉄道宿毛線: 窪川〜宿毛
export const tosaCuroshioSukumo: Station[] = [
  { name: "窪川",       lat: 33.205140, lng: 132.953710, timeToNext: 10 },
  { name: "若井",       lat: 33.195850, lng: 132.966440, timeToNext: 8 },
  { name: "荷稲",       lat: 33.136240, lng: 132.975410, timeToNext: 10 },
  { name: "伊与喜",     lat: 33.069430, lng: 132.924010, timeToNext: 8 },
  { name: "土佐佐賀",   lat: 33.059760, lng: 132.883760, timeToNext: 8 },
  { name: "打井川",     lat: 33.023660, lng: 132.850560, timeToNext: 8 },
  { name: "土佐上川口", lat: 32.979970, lng: 132.822560, timeToNext: 8 },
  { name: "有岡",       lat: 32.943730, lng: 132.808200, timeToNext: 8 },
  { name: "東宿毛",     lat: 32.944890, lng: 132.752330, timeToNext: 5 },
  { name: "宿毛",       lat: 32.936350, lng: 132.727620, timeToNext: 0 },
];

// JR牟岐線南部（阿南〜海部）
export const jrMugiLineSouth: Station[] = [
  { name: "阿南",       lat: 33.916470, lng: 134.659590, timeToNext: 8 },
  { name: "見能林",     lat: 33.878990, lng: 134.664930, timeToNext: 5 },
  { name: "中田",       lat: 33.835040, lng: 134.640000, timeToNext: 8 },
  { name: "阿波橘",     lat: 33.788640, lng: 134.614690, timeToNext: 8 },
  { name: "桑野",       lat: 33.756750, lng: 134.583870, timeToNext: 8 },
  { name: "新野",       lat: 33.719050, lng: 134.577050, timeToNext: 8 },
  { name: "阿波福井",   lat: 33.661100, lng: 134.570780, timeToNext: 8 },
  { name: "由岐",       lat: 33.624790, lng: 134.549890, timeToNext: 8 },
  { name: "田井ノ浜",   lat: 33.604080, lng: 134.538300, timeToNext: 5 },
  { name: "牟岐",       lat: 33.567570, lng: 134.460620, timeToNext: 10 },
  { name: "鯖瀬",       lat: 33.543180, lng: 134.375800, timeToNext: 8 },
  { name: "浅川",       lat: 33.534090, lng: 134.351980, timeToNext: 5 },
  { name: "阿波海南",   lat: 33.518150, lng: 134.354150, timeToNext: 5 },
  { name: "海部",       lat: 33.519150, lng: 134.335460, timeToNext: 0 },
];

// JR徳島線（阿波池田〜鴨島）西部
export const jrTokushimaLineWest: Station[] = [
  { name: "阿波池田",   lat: 34.046360, lng: 133.812420, timeToNext: 8 },
  { name: "三縄",       lat: 34.018580, lng: 133.847880, timeToNext: 8 },
  { name: "祖谷口",     lat: 33.994580, lng: 133.851400, timeToNext: 8 },
  { name: "阿波川口",   lat: 33.972960, lng: 133.871570, timeToNext: 8 },
  { name: "本山",       lat: 33.978810, lng: 133.887160, timeToNext: 5 },
  { name: "阿波山川",   lat: 33.975110, lng: 133.919460, timeToNext: 5 },
  { name: "山瀬",       lat: 33.967250, lng: 133.943670, timeToNext: 5 },
  { name: "貞光",       lat: 33.964780, lng: 133.966860, timeToNext: 5 },
  { name: "小島",       lat: 33.966830, lng: 133.979810, timeToNext: 5 },
  { name: "穴吹",       lat: 33.973400, lng: 134.016020, timeToNext: 5 },
  { name: "阿波川島",   lat: 33.994820, lng: 134.046970, timeToNext: 5 },
  { name: "西麻植",     lat: 34.009480, lng: 134.070640, timeToNext: 5 },
  { name: "麻植塚",     lat: 34.029560, lng: 134.092290, timeToNext: 5 },
  { name: "鴨島",       lat: 34.065930, lng: 134.129390, timeToNext: 0 },
];
