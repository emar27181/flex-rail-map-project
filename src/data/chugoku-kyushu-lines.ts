import type { Station } from './yamanote';

// JR山陰本線（島根〜山口）: 出雲市〜下関
export const jrSaninMainLineWest: Station[] = [
  { name: "出雲市",   lat: 35.367980, lng: 132.758590, timeToNext: 10 },
  { name: "西出雲",   lat: 35.394790, lng: 132.692060, timeToNext: 8 },
  { name: "出雲神西",  lat: 35.378230, lng: 132.648330, timeToNext: 8 },
  { name: "江南",     lat: 35.352680, lng: 132.603750, timeToNext: 8 },
  { name: "直江",     lat: 35.375760, lng: 132.548920, timeToNext: 8 },
  { name: "大田市",   lat: 35.194980, lng: 132.498600, timeToNext: 25 },
  { name: "石見銀山",  lat: 35.100500, lng: 132.459200, timeToNext: 20 },
  { name: "江津",     lat: 34.980280, lng: 132.221700, timeToNext: 20 },
  { name: "浜田",     lat: 34.901250, lng: 132.070360, timeToNext: 25 },
  { name: "益田",     lat: 34.677940, lng: 131.843150, timeToNext: 35 },
  { name: "東萩",     lat: 34.413440, lng: 131.404160, timeToNext: 15 },
  { name: "萩",       lat: 34.408590, lng: 131.390300, timeToNext: 20 },
  { name: "長門市",   lat: 34.372160, lng: 131.187210, timeToNext: 25 },
  { name: "小串",     lat: 34.133980, lng: 130.966420, timeToNext: 15 },
  { name: "下関",     lat: 33.951470, lng: 130.937640, timeToNext: 0 },
];

// JR山口線: 新山口〜津和野〜益田
export const jrYamaguchiLine: Station[] = [
  { name: "新山口",   lat: 34.163760, lng: 131.488610, timeToNext: 3 },
  { name: "周防下郷",  lat: 34.170130, lng: 131.459940, timeToNext: 4 },
  { name: "大歳",     lat: 34.183430, lng: 131.449230, timeToNext: 4 },
  { name: "矢原",     lat: 34.207240, lng: 131.441990, timeToNext: 4 },
  { name: "湯田温泉",  lat: 34.178680, lng: 131.468060, timeToNext: 4 },
  { name: "山口",     lat: 34.186120, lng: 131.473630, timeToNext: 5 },
  { name: "上山口",   lat: 34.197980, lng: 131.480430, timeToNext: 4 },
  { name: "宮野",     lat: 34.217250, lng: 131.492620, timeToNext: 7 },
  { name: "仁保津",   lat: 34.249060, lng: 131.521730, timeToNext: 6 },
  { name: "篠目",     lat: 34.289780, lng: 131.569520, timeToNext: 8 },
  { name: "長門峡",   lat: 34.332580, lng: 131.573730, timeToNext: 8 },
  { name: "渡川",     lat: 34.362250, lng: 131.584640, timeToNext: 7 },
  { name: "本俣賀",   lat: 34.392560, lng: 131.590970, timeToNext: 7 },
  { name: "津和野",   lat: 34.468660, lng: 131.775300, timeToNext: 15 },
  { name: "青野山",   lat: 34.484580, lng: 131.800030, timeToNext: 8 },
  { name: "日原",     lat: 34.514580, lng: 131.805400, timeToNext: 10 },
  { name: "益田",     lat: 34.677940, lng: 131.843150, timeToNext: 0 },
];

// 広島電鉄（路面電車）: 広島駅〜宮島口
export const hiroshimaTram: Station[] = [
  { name: "広島",     lat: 34.397060, lng: 132.475790, timeToNext: 2 },
  { name: "銀山町",   lat: 34.397200, lng: 132.462180, timeToNext: 2 },
  { name: "胡町",     lat: 34.392300, lng: 132.456870, timeToNext: 2 },
  { name: "八丁堀",   lat: 34.393760, lng: 132.452580, timeToNext: 2 },
  { name: "立町",     lat: 34.394090, lng: 132.444950, timeToNext: 2 },
  { name: "紙屋町東",  lat: 34.393300, lng: 132.455980, timeToNext: 2 },
  { name: "紙屋町西",  lat: 34.393550, lng: 132.452050, timeToNext: 2 },
  { name: "原爆ドーム前", lat: 34.394740, lng: 132.452670, timeToNext: 2 },
  { name: "本川町",   lat: 34.396420, lng: 132.444320, timeToNext: 2 },
  { name: "十日市町",  lat: 34.397450, lng: 132.441290, timeToNext: 2 },
  { name: "横川駅",   lat: 34.407350, lng: 132.426980, timeToNext: 2 },
  { name: "西広島",   lat: 34.392340, lng: 132.411440, timeToNext: 3 },
  { name: "己斐",     lat: 34.393900, lng: 132.404680, timeToNext: 2 },
  { name: "広電宮島口", lat: 34.296450, lng: 132.290070, timeToNext: 0 },
];

// JR可部線: 広島〜あき亀山
export const jrKabeLine: Station[] = [
  { name: "広島",     lat: 34.397060, lng: 132.475790, timeToNext: 3 },
  { name: "横川",     lat: 34.407350, lng: 132.426980, timeToNext: 3 },
  { name: "三滝",     lat: 34.418100, lng: 132.430050, timeToNext: 3 },
  { name: "安芸長束",  lat: 34.429520, lng: 132.440000, timeToNext: 3 },
  { name: "下祇園",   lat: 34.438470, lng: 132.443090, timeToNext: 3 },
  { name: "古市橋",   lat: 34.443190, lng: 132.454460, timeToNext: 3 },
  { name: "大町",     lat: 34.453110, lng: 132.467750, timeToNext: 3 },
  { name: "緑井",     lat: 34.470640, lng: 132.467540, timeToNext: 3 },
  { name: "七軒茶屋",  lat: 34.485360, lng: 132.457700, timeToNext: 3 },
  { name: "梅林",     lat: 34.507210, lng: 132.447940, timeToNext: 4 },
  { name: "上八木",   lat: 34.529940, lng: 132.433810, timeToNext: 4 },
  { name: "中島",     lat: 34.543550, lng: 132.424260, timeToNext: 4 },
  { name: "可部",     lat: 34.556300, lng: 132.415600, timeToNext: 5 },
  { name: "河戸帆待川", lat: 34.573640, lng: 132.409480, timeToNext: 4 },
  { name: "あき亀山",  lat: 34.586190, lng: 132.398870, timeToNext: 0 },
];

// JR宇野線（瀬戸大橋線）: 岡山〜宇野・児島
export const jrUnoline: Station[] = [
  { name: "岡山",     lat: 34.665330, lng: 133.918710, timeToNext: 5 },
  { name: "大元",     lat: 34.647450, lng: 133.912680, timeToNext: 3 },
  { name: "備前西市",  lat: 34.620760, lng: 133.897570, timeToNext: 4 },
  { name: "妹尾",     lat: 34.606670, lng: 133.905090, timeToNext: 4 },
  { name: "備中箕島",  lat: 34.596580, lng: 133.911040, timeToNext: 4 },
  { name: "早島",     lat: 34.573590, lng: 133.866180, timeToNext: 4 },
  { name: "久々原",   lat: 34.565240, lng: 133.854300, timeToNext: 3 },
  { name: "茶屋町",   lat: 34.544610, lng: 133.860370, timeToNext: 5 },
  { name: "植松",     lat: 34.503580, lng: 133.830170, timeToNext: 6 },
  { name: "木見",     lat: 34.468190, lng: 133.846050, timeToNext: 6 },
  { name: "彦崎",     lat: 34.460650, lng: 133.861390, timeToNext: 5 },
  { name: "備前片岡",  lat: 34.444020, lng: 133.856520, timeToNext: 5 },
  { name: "八浜",     lat: 34.428860, lng: 133.866780, timeToNext: 5 },
  { name: "常山",     lat: 34.412680, lng: 133.888670, timeToNext: 5 },
  { name: "宇野",     lat: 34.369440, lng: 133.942090, timeToNext: 0 },
];

// JR呉線: 広島〜三原
export const jrKureLine: Station[] = [
  { name: "広島",     lat: 34.397060, lng: 132.475790, timeToNext: 8 },
  { name: "海田市",   lat: 34.367360, lng: 132.541080, timeToNext: 5 },
  { name: "安芸中野",  lat: 34.351880, lng: 132.564550, timeToNext: 5 },
  { name: "瀬野",     lat: 34.363480, lng: 132.607770, timeToNext: 5 },
  { name: "八本松",   lat: 34.387560, lng: 132.658180, timeToNext: 5 },
  { name: "西条",     lat: 34.431790, lng: 132.715250, timeToNext: 8 },
  { name: "寺家",     lat: 34.378070, lng: 132.759870, timeToNext: 8 },
  { name: "中野東",   lat: 34.352480, lng: 132.517020, timeToNext: 5 },
  { name: "矢野",     lat: 34.350220, lng: 132.508080, timeToNext: 4 },
  { name: "坂",       lat: 34.334390, lng: 132.526900, timeToNext: 5 },
  { name: "呉",       lat: 34.248830, lng: 132.564900, timeToNext: 15 },
  { name: "広",       lat: 34.229120, lng: 132.618940, timeToNext: 10 },
  { name: "安芸川尻",  lat: 34.194870, lng: 132.731910, timeToNext: 10 },
  { name: "忠海",     lat: 34.340490, lng: 132.884200, timeToNext: 12 },
  { name: "竹原",     lat: 34.343730, lng: 132.919530, timeToNext: 15 },
  { name: "三原",     lat: 34.397600, lng: 133.077970, timeToNext: 0 },
];

// 岡山電気軌道（路面電車）: 岡山駅前〜東山
export const okayamaTram: Station[] = [
  { name: "岡山駅前",  lat: 34.665330, lng: 133.918710, timeToNext: 2 },
  { name: "西川緑道公園", lat: 34.666380, lng: 133.925310, timeToNext: 2 },
  { name: "柳川",     lat: 34.667450, lng: 133.931530, timeToNext: 2 },
  { name: "郵便局前",  lat: 34.667830, lng: 133.937070, timeToNext: 2 },
  { name: "城下",     lat: 34.663510, lng: 133.944750, timeToNext: 2 },
  { name: "県庁通り",  lat: 34.657910, lng: 133.952070, timeToNext: 2 },
  { name: "東山・おかでんミュージアム駅", lat: 34.651520, lng: 133.963380, timeToNext: 0 },
];

// JR土讃線（高知〜窪川）南部
export const jrMurotozakiLine: Station[] = [
  { name: "高知",     lat: 33.561210, lng: 133.531470, timeToNext: 8 },
  { name: "入明",     lat: 33.566310, lng: 133.528210, timeToNext: 5 },
  { name: "円行寺口",  lat: 33.573620, lng: 133.512480, timeToNext: 5 },
  { name: "旭",       lat: 33.570070, lng: 133.510170, timeToNext: 5 },
  { name: "高知商業前", lat: 33.574080, lng: 133.493890, timeToNext: 5 },
  { name: "朝倉",     lat: 33.567870, lng: 133.484080, timeToNext: 5 },
  { name: "枝川",     lat: 33.592210, lng: 133.481680, timeToNext: 5 },
  { name: "伊野",     lat: 33.553220, lng: 133.447220, timeToNext: 10 },
  { name: "波川",     lat: 33.547380, lng: 133.420850, timeToNext: 8 },
  { name: "日下",     lat: 33.534340, lng: 133.384280, timeToNext: 8 },
  { name: "岡花",     lat: 33.520490, lng: 133.357400, timeToNext: 8 },
  { name: "土佐加茂",  lat: 33.508840, lng: 133.329950, timeToNext: 8 },
  { name: "佐川",     lat: 33.500860, lng: 133.291020, timeToNext: 10 },
  { name: "斗賀野",   lat: 33.467690, lng: 133.278460, timeToNext: 8 },
  { name: "吾桑",     lat: 33.446700, lng: 133.284920, timeToNext: 7 },
  { name: "多ノ郷",   lat: 33.418440, lng: 133.283560, timeToNext: 6 },
  { name: "須崎",     lat: 33.398990, lng: 133.283940, timeToNext: 0 },
];
