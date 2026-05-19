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
  { name: "長尾",       lat: 34.266707, lng: 134.169508, timeToNext: 0 },
];

// 高松琴平電鉄志度線: 瓦町〜志度
export const kotohiraShidoLine: Station[] = [
  { name: "瓦町",       lat: 34.347820, lng: 134.050740, timeToNext: 3 },
  { name: "今橋",       lat: 34.347460, lng: 134.059200, timeToNext: 3 },
  { name: "松島二丁目", lat: 34.343130, lng: 134.070620, timeToNext: 3 },
  { name: "沖松島",     lat: 34.341530, lng: 134.082440, timeToNext: 3 },
  { name: "春日川",     lat: 34.341630, lng: 134.093050, timeToNext: 3 },
  { name: "潟元",       lat: 34.348010, lng: 134.113480, timeToNext: 4 },
  { name: "琴電屋島",   lat: 34.341489, lng: 134.105832, timeToNext: 4 },
  { name: "古高松南",   lat: 34.341164, lng: 134.121240, timeToNext: 4 },
  { name: "八栗",       lat: 34.344611, lng: 134.122552, timeToNext: 4 },
  { name: "八栗新道",   lat: 34.336659, lng: 134.147603, timeToNext: 4 },
  { name: "塩屋",       lat: 34.335605, lng: 134.155103, timeToNext: 4 },
  { name: "房前",       lat: 34.332480, lng: 134.158437, timeToNext: 4 },
  { name: "原",         lat: 34.326516, lng: 134.163589, timeToNext: 4 },
  { name: "琴電志度",   lat: 34.322820, lng: 134.175140, timeToNext: 0 },
];

// 土佐くろしお鉄道宿毛線: 窪川〜宿毛
export const tosaCuroshioSukumo: Station[] = [
  { name: "窪川",       lat: 33.212426, lng: 133.137357, timeToNext: 10 },
  { name: "若井",       lat: 33.188057, lng: 133.105997, timeToNext: 8 },
  { name: "荷稲",       lat: 33.133115, lng: 133.116204, timeToNext: 10 },
  { name: "伊与喜",     lat: 33.105175, lng: 133.098589, timeToNext: 8 },
  { name: "土佐佐賀",   lat: 33.080901, lng: 133.101498, timeToNext: 8 },
  { name: "打井川",     lat: 33.175552, lng: 133.029459, timeToNext: 8 },
  { name: "土佐上川口", lat: 33.042996, lng: 133.056095, timeToNext: 8 },
  { name: "有岡",       lat: 32.943730, lng: 132.808200, timeToNext: 8 },
  { name: "東宿毛",     lat: 32.944890, lng: 132.752330, timeToNext: 5 },
  { name: "宿毛",       lat: 32.936350, lng: 132.727620, timeToNext: 0 },
];

// JR牟岐線南部（阿南〜海部）
export const jrMugiLineSouth: Station[] = [
  { name: "阿南",       lat: 33.916470, lng: 134.659590, timeToNext: 8 },
  { name: "見能林",     lat: 33.903365, lng: 134.667226, timeToNext: 5 },
  { name: "中田",       lat: 34.010385, lng: 134.569601, timeToNext: 8 },
  { name: "阿波橘",     lat: 33.888605, lng: 134.651568, timeToNext: 8 },
  { name: "桑野",       lat: 33.874709, lng: 134.613182, timeToNext: 8 },
  { name: "新野",       lat: 33.846813, lng: 134.600155, timeToNext: 8 },
  { name: "阿波福井",   lat: 33.824062, lng: 134.605366, timeToNext: 8 },
  { name: "由岐",       lat: 33.775804, lng: 134.591636, timeToNext: 8 },
  { name: "田井ノ浜",   lat: 33.772771, lng: 134.583838, timeToNext: 5 },
  { name: "牟岐",       lat: 33.671947, lng: 134.418064, timeToNext: 10 },
  { name: "鯖瀬",       lat: 33.645953, lng: 134.385259, timeToNext: 8 },
  { name: "浅川",       lat: 33.626537, lng: 134.358660, timeToNext: 5 },
  { name: "阿波海南",   lat: 33.606753, lng: 134.351018, timeToNext: 5 },
  { name: "海部",       lat: 33.593773, lng: 134.352086, timeToNext: 0 },
];

// JR徳島線（阿波池田〜鴨島）西部
export const jrTokushimaLineWest: Station[] = [
  { name: "阿波池田",   lat: 34.046360, lng: 133.812420, timeToNext: 8 },
  { name: "三縄",       lat: 34.006991, lng: 133.787368, timeToNext: 8 },
  { name: "祖谷口",     lat: 33.972503, lng: 133.780354, timeToNext: 8 },
  { name: "阿波川口",   lat: 33.963724, lng: 133.754715, timeToNext: 8 },
  { name: "本山",       lat: 34.146048, lng: 133.686308, timeToNext: 5 },
  { name: "阿波山川",   lat: 34.055191, lng: 134.234018, timeToNext: 5 },
  { name: "山瀬",       lat: 34.060131, lng: 134.256292, timeToNext: 5 },
  { name: "貞光",       lat: 34.039480, lng: 134.058911, timeToNext: 5 },
  { name: "小島",       lat: 34.050377, lng: 134.106827, timeToNext: 5 },
  { name: "穴吹",       lat: 34.056010, lng: 134.163482, timeToNext: 5 },
  { name: "阿波川島",   lat: 34.061777, lng: 134.320899, timeToNext: 5 },
  { name: "西麻植",     lat: 34.009480, lng: 134.070640, timeToNext: 5 },
  { name: "麻植塚",     lat: 34.029560, lng: 134.092290, timeToNext: 5 },
  { name: "鴨島",       lat: 34.073705, lng: 134.356530, timeToNext: 0 },
];
