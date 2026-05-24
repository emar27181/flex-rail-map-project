import type { Station } from './yamanote';

// JR鹿児島本線（熊本〜鹿児島中央）
export const jrKagoshimaMainLineSouth: Station[] = [
  { name: "熊本",     lat: 32.790317, lng: 130.688974, timeToNext: 8 },
  { name: "川尻",     lat: 32.743765, lng: 130.679914, timeToNext: 7 },
  { name: "富合",     lat: 32.713511, lng: 130.672750, timeToNext: 5 },
  { name: "宇土",     lat: 32.687150, lng: 130.656730, timeToNext: 8 },
  { name: "松橋",     lat: 32.652302, lng: 130.670542, timeToNext: 8 },
  { name: "小川",     lat: 32.600980, lng: 130.694210, timeToNext: 5 },
  { name: "有佐",     lat: 32.562781, lng: 130.670281, timeToNext: 5 },
  { name: "千丁",     lat: 32.532746, lng: 130.645797, timeToNext: 5 },
  { name: "新八代",   lat: 32.501100, lng: 130.618870, timeToNext: 5 },
  { name: "八代",     lat: 32.504005, lng: 130.621742, timeToNext: 8 },
  { name: "肥後高田",  lat: 32.475489, lng: 130.612681, timeToNext: 6 },
  { name: "瀬戸石",   lat: 32.371647, lng: 130.646370, timeToNext: 8 },
  { name: "吉尾",     lat: 32.330562, lng: 130.600125, timeToNext: 5 },
  { name: "海路",     lat: 32.349210, lng: 130.619089, timeToNext: 5 },
  { name: "那智",     lat: 32.365000, lng: 130.565210, timeToNext: 5 },
  { name: "水俣",     lat: 32.212200, lng: 130.407520, timeToNext: 10 },
  { name: "袋",       lat: 32.165290, lng: 130.374189, timeToNext: 7 },
  { name: "米ノ津",   lat: 32.122119, lng: 130.342005, timeToNext: 6 },
  { name: "出水",     lat: 32.089060, lng: 130.356950, timeToNext: 7 },
  { name: "西出水",   lat: 32.076500, lng: 130.325800, timeToNext: 6 },
  { name: "高尾野",   lat: 32.062503, lng: 130.301803, timeToNext: 7 },
  { name: "野田郷",   lat: 32.063193, lng: 130.267709, timeToNext: 7 },
  { name: "折口",     lat: 32.061087, lng: 130.217473, timeToNext: 5 },
  { name: "阿久根",   lat: 32.022980, lng: 130.196378, timeToNext: 10 },
  { name: "牛ノ浜",   lat: 31.974198, lng: 130.206896, timeToNext: 7 },
  { name: "薩摩大川",  lat: 31.949480, lng: 130.219090, timeToNext: 8 },
  { name: "西方",     lat: 31.916224, lng: 130.223741, timeToNext: 6 },
  { name: "薩摩高城",  lat: 31.892657, lng: 130.220511, timeToNext: 5 },
  { name: "上川内",   lat: 31.847590, lng: 130.294900, timeToNext: 5 },
  { name: "川内",     lat: 31.827620, lng: 130.300100, timeToNext: 8 },
  { name: "木場茶屋",  lat: 31.773780, lng: 130.311640, timeToNext: 7 },
  { name: "串木野",   lat: 31.730730, lng: 130.290590, timeToNext: 5 },
  { name: "市来",     lat: 31.689371, lng: 130.303311, timeToNext: 7 },
  { name: "湯之元",   lat: 31.673877, lng: 130.336712, timeToNext: 5 },
  { name: "東市来",   lat: 31.659010, lng: 130.333880, timeToNext: 7 },
  { name: "伊集院",   lat: 31.630086, lng: 130.396478, timeToNext: 8 },
  { name: "薩摩松元",  lat: 31.617980, lng: 130.447360, timeToNext: 6 },
  { name: "上伊集院",  lat: 31.604970, lng: 130.471510, timeToNext: 6 },
  { name: "広木",     lat: 31.576666, lng: 130.504516, timeToNext: 5 },
  { name: "鹿児島中央", lat: 31.590690, lng: 130.543250, timeToNext: 0 },
];

// 鹿児島市電（路面電車）
export const kagoshimaTram: Station[] = [
  { name: "鹿児島中央駅前", lat: 31.589180, lng: 130.539640, timeToNext: 2 },
  { name: "都通",     lat: 31.596530, lng: 130.550790, timeToNext: 2 },
  { name: "朝日通",   lat: 31.597150, lng: 130.556260, timeToNext: 2 },
  { name: "市役所前",  lat: 31.600130, lng: 130.555790, timeToNext: 2 },
  { name: "天文館通",  lat: 31.590080, lng: 130.558080, timeToNext: 2 },
  { name: "高見馬場",  lat: 31.580720, lng: 130.560090, timeToNext: 2 },
  { name: "武之橋",   lat: 31.573120, lng: 130.556280, timeToNext: 2 },
  { name: "二中通",   lat: 31.563420, lng: 130.558040, timeToNext: 2 },
  { name: "鴨池",     lat: 31.555880, lng: 130.561230, timeToNext: 2 },
  { name: "騎射場",   lat: 31.547330, lng: 130.557830, timeToNext: 2 },
  { name: "郡元（南国分病院前）", lat: 31.539980, lng: 130.557470, timeToNext: 2 },
  { name: "工学部前",  lat: 31.533860, lng: 130.558110, timeToNext: 2 },
  { name: "谷山",     lat: 31.526879, lng: 130.518496, timeToNext: 0 },
];

// JR指宿枕崎線: 鹿児島中央〜指宿
export const jrIbusukinMakurazakiLine: Station[] = [
  { name: "鹿児島中央", lat: 31.590690, lng: 130.543250, timeToNext: 3 },
  { name: "南鹿児島",  lat: 31.567380, lng: 130.546710, timeToNext: 3 },
  { name: "谷山",     lat: 31.526879, lng: 130.518496, timeToNext: 5 },
  { name: "慈眼寺",   lat: 31.517241, lng: 130.506149, timeToNext: 4 },
  { name: "坂之上",   lat: 31.500050, lng: 130.507610, timeToNext: 4 },
  { name: "五位野",   lat: 31.475192, lng: 130.504072, timeToNext: 5 },
  { name: "平川",     lat: 31.450015, lng: 130.513719, timeToNext: 5 },
  { name: "瀬々串",   lat: 31.421801, lng: 130.522834, timeToNext: 5 },
  { name: "中名",     lat: 31.393738, lng: 130.535036, timeToNext: 5 },
  { name: "喜入",     lat: 31.371339, lng: 130.538913, timeToNext: 5 },
  { name: "前之浜",   lat: 31.361790, lng: 130.560440, timeToNext: 7 },
  { name: "生見",     lat: 31.307193, lng: 130.577843, timeToNext: 7 },
  { name: "薩摩今和泉", lat: 31.290689, lng: 130.599119, timeToNext: 7 },
  { name: "宮ヶ浜",   lat: 31.277106, lng: 130.619910, timeToNext: 5 },
  { name: "西大山",   lat: 31.190301, lng: 130.576458, timeToNext: 5 },
  { name: "大山",     lat: 31.194942, lng: 130.599178, timeToNext: 5 },
  { name: "山川",     lat: 31.211361, lng: 130.629791, timeToNext: 5 },
  { name: "指宿",     lat: 31.252300, lng: 130.636820, timeToNext: 0 },
];

// JR長崎本線（新幹線並行区間を除く諫早〜佐世保方面）: JR佐世保線
export const jrSaseboLine: Station[] = [
  { name: "肥前山口",  lat: 33.189820, lng: 130.175980, timeToNext: 8 },
  { name: "武雄温泉",  lat: 33.196479, lng: 130.023066, timeToNext: 8 },
  { name: "高橋",     lat: 33.207889, lng: 130.041807, timeToNext: 6 },
  { name: "永尾",     lat: 33.193193, lng: 129.980631, timeToNext: 5 },
  { name: "三間坂",   lat: 33.194725, lng: 129.947693, timeToNext: 5 },
  { name: "上有田",   lat: 33.190280, lng: 129.905377, timeToNext: 5 },
  { name: "有田",     lat: 33.196250, lng: 129.885920, timeToNext: 8 },
  { name: "三河内",   lat: 33.150469, lng: 129.829434, timeToNext: 8 },
  { name: "早岐",     lat: 33.133701, lng: 129.799291, timeToNext: 5 },
  { name: "大塔",     lat: 33.148978, lng: 129.782044, timeToNext: 4 },
  { name: "日宇",     lat: 33.157268, lng: 129.758008, timeToNext: 3 },
  { name: "佐世保",   lat: 33.173800, lng: 129.718190, timeToNext: 0 },
];

// 西鉄貝塚線: 貝塚〜西鉄新宮
export const nishitetsuKaizukaLine: Station[] = [
  { name: "貝塚",     lat: 33.637820, lng: 130.432050, timeToNext: 3 },
  { name: "名島",     lat: 33.642789, lng: 130.432180, timeToNext: 3 },
  { name: "西鉄千早",  lat: 33.649431, lng: 130.440256, timeToNext: 3 },
  { name: "香椎宮前",  lat: 33.654571, lng: 130.442486, timeToNext: 3 },
  { name: "西鉄香椎",  lat: 33.659494, lng: 130.441731, timeToNext: 3 },
  { name: "和白",     lat: 33.688524, lng: 130.429979, timeToNext: 3 },
  { name: "唐の原",   lat: 33.680269, lng: 130.434552, timeToNext: 3 },
  { name: "三苫",     lat: 33.702197, lng: 130.422560, timeToNext: 3 },
  { name: "西鉄新宮",  lat: 33.714128, lng: 130.436913, timeToNext: 0 },
];

// 熊本電気鉄道（熊本電鉄）: 北熊本〜上熊本
export const kumamotoElecRailway: Station[] = [
  { name: "北熊本",   lat: 32.819420, lng: 130.705640, timeToNext: 2 },
  { name: "亀井",     lat: 32.837468, lng: 130.722217, timeToNext: 2 },
  { name: "黒髪町",   lat: 32.818350, lng: 130.717232, timeToNext: 2 },
  { name: "上熊本",   lat: 32.818408, lng: 130.699887, timeToNext: 0 },
];
