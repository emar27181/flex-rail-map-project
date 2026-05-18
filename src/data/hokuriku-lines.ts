import type { Station } from './yamanote';

// 富山地方鉄道本線: 電鉄富山〜宇奈月温泉
export const toyamaChihoMainLine: Station[] = [
  { name: "電鉄富山",   lat: 36.696680, lng: 137.211540, timeToNext: 3 },
  { name: "稲荷町",    lat: 36.697390, lng: 137.222080, timeToNext: 3 },
  { name: "新庄田中",   lat: 36.703750, lng: 137.237760, timeToNext: 3 },
  { name: "不二越",    lat: 36.698010, lng: 137.214420, timeToNext: 3 },
  { name: "大泉",      lat: 36.692880, lng: 137.228810, timeToNext: 3 },
  { name: "上市",      lat: 36.690980, lng: 137.350220, timeToNext: 6 },
  { name: "新宮川",    lat: 36.695340, lng: 137.395510, timeToNext: 4 },
  { name: "中加積",    lat: 36.707870, lng: 137.408520, timeToNext: 3 },
  { name: "西加積",    lat: 36.718980, lng: 137.415970, timeToNext: 3 },
  { name: "越中中村",   lat: 36.734620, lng: 137.419090, timeToNext: 3 },
  { name: "榎町",      lat: 36.752010, lng: 137.408790, timeToNext: 3 },
  { name: "下立口",    lat: 36.765480, lng: 137.390140, timeToNext: 3 },
  { name: "下立",      lat: 36.779780, lng: 137.376870, timeToNext: 4 },
  { name: "愛本",      lat: 36.797800, lng: 137.387800, timeToNext: 4 },
  { name: "内山",      lat: 36.817890, lng: 137.381970, timeToNext: 4 },
  { name: "舌山",      lat: 36.840620, lng: 137.376080, timeToNext: 4 },
  { name: "若栗",      lat: 36.846590, lng: 137.367550, timeToNext: 3 },
  { name: "栃屋",      lat: 36.849890, lng: 137.357510, timeToNext: 3 },
  { name: "浦山",      lat: 36.852800, lng: 137.346050, timeToNext: 3 },
  { name: "宇奈月",    lat: 36.862890, lng: 137.346750, timeToNext: 3 },
  { name: "宇奈月温泉", lat: 36.869490, lng: 137.345230, timeToNext: 0 },
];

// えちぜん鉄道勝山永平寺線: 福井〜勝山
export const echizentetsudoKatsuyamaLine: Station[] = [
  { name: "福井",      lat: 36.063830, lng: 136.218870, timeToNext: 3 },
  { name: "新福井",    lat: 36.063090, lng: 136.219720, timeToNext: 3 },
  { name: "福井口",    lat: 36.072340, lng: 136.219720, timeToNext: 3 },
  { name: "越前開田",   lat: 36.079580, lng: 136.220050, timeToNext: 3 },
  { name: "三郎丸",    lat: 36.094190, lng: 136.218010, timeToNext: 3 },
  { name: "鷲塚針原",   lat: 36.102750, lng: 136.218100, timeToNext: 4 },
  { name: "田原町",    lat: 36.075730, lng: 136.199590, timeToNext: 4 },
  { name: "西長田ゆりの里", lat: 36.115210, lng: 136.196790, timeToNext: 4 },
  { name: "東藤島",    lat: 36.130160, lng: 136.203480, timeToNext: 4 },
  { name: "越前島橋",   lat: 36.151760, lng: 136.204020, timeToNext: 4 },
  { name: "観音町",    lat: 36.162490, lng: 136.204470, timeToNext: 3 },
  { name: "松岡",      lat: 36.186670, lng: 136.220840, timeToNext: 4 },
  { name: "志比堺",    lat: 36.200590, lng: 136.228900, timeToNext: 4 },
  { name: "永平寺口",   lat: 36.218770, lng: 136.248080, timeToNext: 5 },
  { name: "東古市",    lat: 36.231010, lng: 136.252510, timeToNext: 4 },
  { name: "山王",      lat: 36.244380, lng: 136.237470, timeToNext: 4 },
  { name: "発坂",      lat: 36.257930, lng: 136.224290, timeToNext: 4 },
  { name: "比島",      lat: 36.272190, lng: 136.226830, timeToNext: 4 },
  { name: "勝山",      lat: 36.361340, lng: 136.499780, timeToNext: 0 },
];

// 福井鉄道福武線: 越前武生〜田原町
export const fukuiRailwayFukubuLine: Station[] = [
  { name: "越前武生",   lat: 35.908030, lng: 136.148180, timeToNext: 3 },
  { name: "北府",      lat: 35.907790, lng: 136.141690, timeToNext: 3 },
  { name: "家久",      lat: 35.921300, lng: 136.119830, timeToNext: 4 },
  { name: "サンドーム西", lat: 35.932370, lng: 136.094780, timeToNext: 4 },
  { name: "鯖浦",      lat: 35.945380, lng: 136.082700, timeToNext: 4 },
  { name: "水落",      lat: 35.956250, lng: 136.079280, timeToNext: 3 },
  { name: "たけふ新",   lat: 35.967810, lng: 136.072380, timeToNext: 4 },
  { name: "三十八社",   lat: 35.989260, lng: 136.067940, timeToNext: 4 },
  { name: "泰澄の里",   lat: 36.008850, lng: 136.069730, timeToNext: 3 },
  { name: "清明",      lat: 36.019990, lng: 136.075630, timeToNext: 3 },
  { name: "経田",      lat: 36.032010, lng: 136.085360, timeToNext: 3 },
  { name: "花堂",      lat: 36.043930, lng: 136.097760, timeToNext: 3 },
  { name: "江端",      lat: 36.055220, lng: 136.126920, timeToNext: 3 },
  { name: "ベル前",    lat: 36.059070, lng: 136.148350, timeToNext: 3 },
  { name: "赤十字前",   lat: 36.060660, lng: 136.171590, timeToNext: 3 },
  { name: "福井城址大名町", lat: 36.063010, lng: 136.218290, timeToNext: 3 },
  { name: "田原町",    lat: 36.075730, lng: 136.199590, timeToNext: 0 },
];

// 北陸鉄道石川線: 野町〜鶴来
export const hokurikuTetsudoIshikawaLine: Station[] = [
  { name: "野町",      lat: 36.551050, lng: 136.621170, timeToNext: 3 },
  { name: "西泉",      lat: 36.556960, lng: 136.598420, timeToNext: 3 },
  { name: "押野",      lat: 36.564470, lng: 136.583450, timeToNext: 3 },
  { name: "野々市",    lat: 36.553540, lng: 136.565090, timeToNext: 3 },
  { name: "三納",      lat: 36.546710, lng: 136.542080, timeToNext: 3 },
  { name: "四十万",    lat: 36.531990, lng: 136.528680, timeToNext: 3 },
  { name: "乙丸",      lat: 36.515000, lng: 136.505990, timeToNext: 3 },
  { name: "陽羽里",    lat: 36.509830, lng: 136.493660, timeToNext: 3 },
  { name: "小柳",      lat: 36.494530, lng: 136.490610, timeToNext: 3 },
  { name: "道法寺",    lat: 36.489310, lng: 136.475820, timeToNext: 3 },
  { name: "鶴来",      lat: 36.487660, lng: 136.467380, timeToNext: 0 },
];

// JR北陸本線（金沢〜富山）: 金沢〜富山
export const jrHokurikuKanazawaToToyama: Station[] = [
  { name: "金沢",      lat: 36.578130, lng: 136.648290, timeToNext: 5 },
  { name: "東金沢",    lat: 36.582650, lng: 136.662240, timeToNext: 4 },
  { name: "森本",      lat: 36.605480, lng: 136.682870, timeToNext: 5 },
  { name: "津幡",      lat: 36.651290, lng: 136.735190, timeToNext: 5 },
  { name: "倶利伽羅",   lat: 36.680940, lng: 136.817770, timeToNext: 8 },
  { name: "石動",      lat: 36.725840, lng: 136.864060, timeToNext: 5 },
  { name: "福岡",      lat: 36.720050, lng: 136.905970, timeToNext: 5 },
  { name: "西高岡",    lat: 36.731250, lng: 136.944310, timeToNext: 4 },
  { name: "高岡",      lat: 36.754750, lng: 136.991230, timeToNext: 5 },
  { name: "越中大門",   lat: 36.740190, lng: 137.024490, timeToNext: 5 },
  { name: "小杉",      lat: 36.737860, lng: 137.063370, timeToNext: 4 },
  { name: "呉羽",      lat: 36.712890, lng: 137.155830, timeToNext: 5 },
  { name: "富山",      lat: 36.696010, lng: 137.213840, timeToNext: 0 },
];

// 富山ライトレール（富山港線）: 富山駅〜岩瀬浜
export const toyamaLightRail: Station[] = [
  { name: "富山駅北",   lat: 36.698010, lng: 137.213270, timeToNext: 3 },
  { name: "インテック本社前", lat: 36.706340, lng: 137.210800, timeToNext: 2 },
  { name: "奥田中学校前", lat: 36.717680, lng: 137.212010, timeToNext: 2 },
  { name: "下奥井",    lat: 36.728990, lng: 137.201480, timeToNext: 2 },
  { name: "粟島（大阪屋ショップ前）", lat: 36.741040, lng: 137.196590, timeToNext: 2 },
  { name: "越中中島",   lat: 36.753760, lng: 137.196930, timeToNext: 2 },
  { name: "城川原",    lat: 36.762780, lng: 137.195670, timeToNext: 2 },
  { name: "犬島新町",   lat: 36.773180, lng: 137.197820, timeToNext: 2 },
  { name: "蓮町（馬場記念公園前）", lat: 36.784040, lng: 137.198520, timeToNext: 2 },
  { name: "大広田",    lat: 36.795010, lng: 137.203890, timeToNext: 2 },
  { name: "東岩瀬",    lat: 36.812080, lng: 137.214190, timeToNext: 3 },
  { name: "競輪場前",   lat: 36.828590, lng: 137.218230, timeToNext: 2 },
  { name: "岩瀬カナル会館前", lat: 36.840770, lng: 137.218980, timeToNext: 2 },
  { name: "岩瀬浜",    lat: 36.845810, lng: 137.221930, timeToNext: 0 },
];
