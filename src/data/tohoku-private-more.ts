import type { Station } from './yamanote';

// 阿武隈急行: 槻木〜福島
export const abukumaKyuko: Station[] = [
  { name: "槻木",      lat: 38.078680, lng: 140.810046, timeToNext: 5 },
  { name: "東船岡",    lat: 38.050264, lng: 140.789863, timeToNext: 5 },
  { name: "船岡",      lat: 38.059414, lng: 140.768011, timeToNext: 5 },
  { name: "大河原",    lat: 38.047464, lng: 140.740428, timeToNext: 5 },
  { name: "北白川",    lat: 38.032423, lng: 140.692519, timeToNext: 5 },
  { name: "角田",      lat: 37.974440, lng: 140.777680, timeToNext: 5 },
  { name: "岡",        lat: 38.019139, lng: 140.780574, timeToNext: 5 },
  { name: "丸森",      lat: 37.930504, lng: 140.761559, timeToNext: 5 },
  { name: "川原子",    lat: 37.879490, lng: 140.740060, timeToNext: 5 },
  { name: "逢隈",      lat: 38.067217, lng: 140.854808, timeToNext: 5 },
  { name: "梁川",      lat: 37.845956, lng: 140.603167, timeToNext: 5 },
  { name: "やながわ希望の森公園前", lat: 37.857495, lng: 140.615519, timeToNext: 5 },
  { name: "富野",      lat: 37.874438, lng: 140.627291, timeToNext: 5 },
  { name: "兜",        lat: 37.895422, lng: 140.646611, timeToNext: 5 },
  { name: "保原",      lat: 37.814558, lng: 140.556496, timeToNext: 5 },
  { name: "大泉",      lat: 37.820059, lng: 140.566890, timeToNext: 5 },
  { name: "二井田",    lat: 37.827981, lng: 140.580481, timeToNext: 5 },
  { name: "新田",      lat: 37.837799, lng: 140.592989, timeToNext: 5 },
  { name: "福島",      lat: 37.754220, lng: 140.468200, timeToNext: 0 },
];

// 山形鉄道フラワー長井線: 赤湯〜荒砥
export const yamagataRailway: Station[] = [
  { name: "赤湯",      lat: 38.047377, lng: 140.148976, timeToNext: 5 },
  { name: "南陽市役所",  lat: 38.055374, lng: 140.149135, timeToNext: 5 },
  { name: "宮内",      lat: 38.070923, lng: 140.135100, timeToNext: 5 },
  { name: "おりはた",   lat: 38.066476, lng: 140.122535, timeToNext: 5 },
  { name: "梨郷",      lat: 38.057344, lng: 140.098520, timeToNext: 5 },
  { name: "西大塚",    lat: 38.055386, lng: 140.064310, timeToNext: 5 },
  { name: "大塚",      lat: 38.152670, lng: 140.050380, timeToNext: 5 },
  { name: "蚕桑",      lat: 38.176760, lng: 140.052290, timeToNext: 5 },
  { name: "鮎貝",      lat: 38.182609, lng: 140.071022, timeToNext: 5 },
  { name: "四季の郷",   lat: 38.185822, lng: 140.077631, timeToNext: 5 },
  { name: "荒砥",      lat: 38.187983, lng: 140.097582, timeToNext: 0 },
];

// JR花輪線: 好摩〜大館
export const jrHanawLine: Station[] = [
  { name: "好摩",      lat: 39.874000, lng: 141.173551, timeToNext: 8 },
  { name: "東大更",    lat: 39.902609, lng: 141.142477, timeToNext: 8 },
  { name: "大更",      lat: 39.913750, lng: 141.100849, timeToNext: 8 },
  { name: "平館",      lat: 39.950774, lng: 141.085570, timeToNext: 8 },
  { name: "北森",      lat: 39.956620, lng: 141.071875, timeToNext: 8 },
  { name: "松尾八幡平",  lat: 39.969343, lng: 141.043506, timeToNext: 8 },
  { name: "安比高原",   lat: 40.012395, lng: 140.997676, timeToNext: 8 },
  { name: "赤坂田",    lat: 40.048762, lng: 141.004289, timeToNext: 8 },
  { name: "小屋の畑",   lat: 40.076672, lng: 141.020660, timeToNext: 8 },
  { name: "荒屋新町",   lat: 40.097355, lng: 141.049191, timeToNext: 8 },
  { name: "横間",      lat: 40.107481, lng: 141.027568, timeToNext: 8 },
  { name: "田山",      lat: 40.139638, lng: 140.944252, timeToNext: 8 },
  { name: "兄畑",      lat: 40.116237, lng: 140.882236, timeToNext: 8 },
  { name: "湯瀬温泉",   lat: 40.122304, lng: 140.840377, timeToNext: 8 },
  { name: "八幡平",    lat: 40.143329, lng: 140.804420, timeToNext: 8 },
  { name: "安戸",      lat: 40.336110, lng: 140.679360, timeToNext: 8 },
  { name: "陸中大里",   lat: 40.158901, lng: 140.793291, timeToNext: 8 },
  { name: "鹿角花輪",   lat: 40.209040, lng: 140.781200, timeToNext: 8 },
  { name: "柴平",      lat: 40.230818, lng: 140.788021, timeToNext: 8 },
  { name: "十和田南",   lat: 40.255867, lng: 140.770653, timeToNext: 10 },
  { name: "末広",      lat: 40.229837, lng: 140.737383, timeToNext: 8 },
  { name: "陸中花輪",   lat: 40.207350, lng: 140.593820, timeToNext: 8 },
  { name: "大館",      lat: 40.274580, lng: 140.566560, timeToNext: 0 },
];

// JR大湊線: 野辺地〜大湊
export const jrOminateLine: Station[] = [
  { name: "野辺地",    lat: 40.855461, lng: 141.119728, timeToNext: 10 },
  { name: "有畑",      lat: 41.132216, lng: 141.276828, timeToNext: 10 },
  { name: "近川",      lat: 41.191606, lng: 141.279175, timeToNext: 10 },
  { name: "金谷沢",    lat: 41.229304, lng: 141.248172, timeToNext: 10 },
  { name: "赤川",      lat: 41.267946, lng: 141.209263, timeToNext: 10 },
  { name: "下北",      lat: 41.282977, lng: 141.189799, timeToNext: 8 },
  { name: "陸奥関根",   lat: 41.121800, lng: 141.325270, timeToNext: 8 },
  { name: "大湊",      lat: 41.280427, lng: 141.161529, timeToNext: 0 },
];

// 秋田内陸縦貫鉄道: 鷹巣〜角館
export const akitaNairikuLine: Station[] = [
  { name: "鷹巣",      lat: 40.213960, lng: 140.367380, timeToNext: 8 },
  { name: "西鷹巣",    lat: 40.214080, lng: 140.347980, timeToNext: 8 },
  { name: "縄文小ヶ田",  lat: 40.186860, lng: 140.345530, timeToNext: 8 },
  { name: "大野台",    lat: 40.187167, lng: 140.340908, timeToNext: 8 },
  { name: "合川",      lat: 40.161033, lng: 140.330432, timeToNext: 8 },
  { name: "上杉",      lat: 40.146154, lng: 140.350069, timeToNext: 8 },
  { name: "米内沢",    lat: 40.128304, lng: 140.373510, timeToNext: 10 },
  { name: "小渕",      lat: 40.033423, lng: 140.401101, timeToNext: 10 },
  { name: "阿仁合",    lat: 40.000471, lng: 140.401251, timeToNext: 12 },
  { name: "萱草",      lat: 39.958537, lng: 140.412431, timeToNext: 10 },
  { name: "笑内",      lat: 39.935116, lng: 140.413132, timeToNext: 10 },
  { name: "岩野目",    lat: 39.921189, lng: 140.430716, timeToNext: 10 },
  { name: "阿仁前田",   lat: 39.843420, lng: 140.509930, timeToNext: 10 },
  { name: "前田南",    lat: 40.050630, lng: 140.402536, timeToNext: 10 },
  { name: "内竪",      lat: 39.800760, lng: 140.524220, timeToNext: 10 },
  { name: "羽後中里",   lat: 39.771017, lng: 140.602729, timeToNext: 10 },
  { name: "松葉",      lat: 39.744296, lng: 140.590648, timeToNext: 10 },
  { name: "羽後太田",   lat: 39.627318, lng: 140.574335, timeToNext: 10 },
  { name: "角館",      lat: 39.594350, lng: 140.556650, timeToNext: 0 },
];
