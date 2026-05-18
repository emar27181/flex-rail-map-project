import type { Station } from './yamanote';

// JR鹿児島本線（熊本〜鹿児島中央）
export const jrKagoshimaMainLineSouth: Station[] = [
  { name: "熊本",     lat: 32.796670, lng: 130.724670, timeToNext: 8 },
  { name: "川尻",     lat: 32.692820, lng: 130.686260, timeToNext: 7 },
  { name: "富合",     lat: 32.663810, lng: 130.663720, timeToNext: 5 },
  { name: "宇土",     lat: 32.687150, lng: 130.656730, timeToNext: 8 },
  { name: "松橋",     lat: 32.627390, lng: 130.647270, timeToNext: 8 },
  { name: "小川",     lat: 32.601110, lng: 130.641470, timeToNext: 5 },
  { name: "有佐",     lat: 32.562390, lng: 130.624460, timeToNext: 5 },
  { name: "千丁",     lat: 32.536190, lng: 130.619980, timeToNext: 5 },
  { name: "新八代",   lat: 32.501100, lng: 130.618870, timeToNext: 5 },
  { name: "八代",     lat: 32.503420, lng: 130.591140, timeToNext: 8 },
  { name: "肥後高田",  lat: 32.494340, lng: 130.556050, timeToNext: 6 },
  { name: "瀬戸石",   lat: 32.422050, lng: 130.564600, timeToNext: 8 },
  { name: "吉尾",     lat: 32.411890, lng: 130.564100, timeToNext: 5 },
  { name: "海路",     lat: 32.387840, lng: 130.570200, timeToNext: 5 },
  { name: "那智",     lat: 32.365000, lng: 130.565210, timeToNext: 5 },
  { name: "水俣",     lat: 32.212200, lng: 130.407520, timeToNext: 10 },
  { name: "袋",       lat: 32.189750, lng: 130.410810, timeToNext: 7 },
  { name: "米ノ津",   lat: 32.128790, lng: 130.365140, timeToNext: 6 },
  { name: "出水",     lat: 32.089060, lng: 130.356950, timeToNext: 7 },
  { name: "西出水",   lat: 32.076500, lng: 130.325800, timeToNext: 6 },
  { name: "高尾野",   lat: 32.035890, lng: 130.307380, timeToNext: 7 },
  { name: "野田郷",   lat: 31.997430, lng: 130.373340, timeToNext: 7 },
  { name: "折口",     lat: 31.974770, lng: 130.369320, timeToNext: 5 },
  { name: "阿久根",   lat: 31.991020, lng: 130.189200, timeToNext: 10 },
  { name: "牛ノ浜",   lat: 31.940330, lng: 130.175800, timeToNext: 7 },
  { name: "薩摩大川",  lat: 31.919370, lng: 130.251780, timeToNext: 8 },
  { name: "西方",     lat: 31.900050, lng: 130.271360, timeToNext: 6 },
  { name: "薩摩高城",  lat: 31.877250, lng: 130.285210, timeToNext: 5 },
  { name: "上川内",   lat: 31.847590, lng: 130.294900, timeToNext: 5 },
  { name: "川内",     lat: 31.827620, lng: 130.300100, timeToNext: 8 },
  { name: "木場茶屋",  lat: 31.773780, lng: 130.311640, timeToNext: 7 },
  { name: "串木野",   lat: 31.730730, lng: 130.290590, timeToNext: 5 },
  { name: "市来",     lat: 31.696640, lng: 130.258440, timeToNext: 7 },
  { name: "湯之元",   lat: 31.675270, lng: 130.272190, timeToNext: 5 },
  { name: "東市来",   lat: 31.659010, lng: 130.333880, timeToNext: 7 },
  { name: "伊集院",   lat: 31.615380, lng: 130.418500, timeToNext: 8 },
  { name: "薩摩松元",  lat: 31.617980, lng: 130.447360, timeToNext: 6 },
  { name: "上伊集院",  lat: 31.604970, lng: 130.471510, timeToNext: 6 },
  { name: "広木",     lat: 31.599890, lng: 130.497310, timeToNext: 5 },
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
  { name: "谷山",     lat: 31.517920, lng: 130.549400, timeToNext: 0 },
];

// JR指宿枕崎線: 鹿児島中央〜指宿
export const jrIbusukinMakurazakiLine: Station[] = [
  { name: "鹿児島中央", lat: 31.590690, lng: 130.543250, timeToNext: 3 },
  { name: "南鹿児島",  lat: 31.567380, lng: 130.546710, timeToNext: 3 },
  { name: "谷山",     lat: 31.517920, lng: 130.549400, timeToNext: 5 },
  { name: "慈眼寺",   lat: 31.503800, lng: 130.548890, timeToNext: 4 },
  { name: "坂之上",   lat: 31.490040, lng: 130.543620, timeToNext: 4 },
  { name: "五位野",   lat: 31.470840, lng: 130.549010, timeToNext: 5 },
  { name: "平川",     lat: 31.456320, lng: 130.555210, timeToNext: 5 },
  { name: "瀬々串",   lat: 31.430340, lng: 130.566530, timeToNext: 5 },
  { name: "中名",     lat: 31.405010, lng: 130.572540, timeToNext: 5 },
  { name: "喜入",     lat: 31.393690, lng: 130.568820, timeToNext: 5 },
  { name: "前之浜",   lat: 31.361790, lng: 130.560440, timeToNext: 7 },
  { name: "生見",     lat: 31.332190, lng: 130.558190, timeToNext: 7 },
  { name: "薩摩今和泉", lat: 31.307630, lng: 130.558140, timeToNext: 7 },
  { name: "宮ヶ浜",   lat: 31.286060, lng: 130.558110, timeToNext: 5 },
  { name: "西大山",   lat: 31.254340, lng: 130.551200, timeToNext: 5 },
  { name: "大山",     lat: 31.244090, lng: 130.557010, timeToNext: 5 },
  { name: "山川",     lat: 31.225890, lng: 130.651100, timeToNext: 5 },
  { name: "指宿",     lat: 31.252300, lng: 130.636820, timeToNext: 0 },
];

// JR長崎本線（新幹線並行区間を除く諫早〜佐世保方面）: JR佐世保線
export const jrSaseboLine: Station[] = [
  { name: "肥前山口",  lat: 33.189820, lng: 130.175980, timeToNext: 8 },
  { name: "武雄温泉",  lat: 33.216760, lng: 130.005590, timeToNext: 8 },
  { name: "高橋",     lat: 33.222430, lng: 129.985490, timeToNext: 6 },
  { name: "永尾",     lat: 33.213440, lng: 129.966510, timeToNext: 5 },
  { name: "三間坂",   lat: 33.232510, lng: 129.943790, timeToNext: 5 },
  { name: "上有田",   lat: 33.218040, lng: 129.903540, timeToNext: 5 },
  { name: "有田",     lat: 33.196250, lng: 129.885920, timeToNext: 8 },
  { name: "三河内",   lat: 33.222440, lng: 129.810790, timeToNext: 8 },
  { name: "早岐",     lat: 33.291120, lng: 129.784940, timeToNext: 5 },
  { name: "大塔",     lat: 33.316080, lng: 129.755330, timeToNext: 4 },
  { name: "日宇",     lat: 33.327550, lng: 129.745490, timeToNext: 3 },
  { name: "佐世保",   lat: 33.173800, lng: 129.718190, timeToNext: 0 },
];

// 西鉄貝塚線: 貝塚〜西鉄新宮
export const nishitetsuKaizukaLine: Station[] = [
  { name: "貝塚",     lat: 33.637820, lng: 130.432050, timeToNext: 3 },
  { name: "名島",     lat: 33.637250, lng: 130.454470, timeToNext: 3 },
  { name: "西鉄千早",  lat: 33.631650, lng: 130.473220, timeToNext: 3 },
  { name: "香椎宮前",  lat: 33.625000, lng: 130.482820, timeToNext: 3 },
  { name: "西鉄香椎",  lat: 33.617850, lng: 130.487340, timeToNext: 3 },
  { name: "和白",     lat: 33.624360, lng: 130.497180, timeToNext: 3 },
  { name: "唐の原",   lat: 33.620450, lng: 130.511670, timeToNext: 3 },
  { name: "三苫",     lat: 33.617480, lng: 130.524940, timeToNext: 3 },
  { name: "西鉄新宮",  lat: 33.612670, lng: 130.536840, timeToNext: 0 },
];

// 熊本電気鉄道（熊本電鉄）: 北熊本〜上熊本
export const kumamotoElecRailway: Station[] = [
  { name: "北熊本",   lat: 32.819420, lng: 130.705640, timeToNext: 2 },
  { name: "亀井",     lat: 32.818230, lng: 130.696920, timeToNext: 2 },
  { name: "黒髪町",   lat: 32.812490, lng: 130.693880, timeToNext: 2 },
  { name: "上熊本",   lat: 32.819000, lng: 130.726830, timeToNext: 0 },
];
