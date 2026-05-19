import type { Station } from './yamanote';

// 富山地方鉄道本線: 電鉄富山〜宇奈月温泉
export const toyamaChihoMainLine: Station[] = [
  { name: "電鉄富山",   lat: 36.696680, lng: 137.211540, timeToNext: 3 },
  { name: "稲荷町",    lat: 36.697390, lng: 137.222080, timeToNext: 3 },
  { name: "新庄田中",   lat: 36.703750, lng: 137.237760, timeToNext: 3 },
  { name: "不二越",    lat: 36.698010, lng: 137.214420, timeToNext: 3 },
  { name: "大泉",      lat: 36.692880, lng: 137.228810, timeToNext: 3 },
  { name: "上市",      lat: 36.690980, lng: 137.350220, timeToNext: 6 },
  { name: "新宮川",    lat: 36.717666, lng: 137.351016, timeToNext: 4 },
  { name: "中加積",    lat: 36.735097, lng: 137.350913, timeToNext: 3 },
  { name: "西加積",    lat: 36.746688, lng: 137.340083, timeToNext: 3 },
  { name: "越中中村",   lat: 36.790576, lng: 137.382434, timeToNext: 3 },
  { name: "榎町",      lat: 36.657587, lng: 137.316800, timeToNext: 3 },
  { name: "下立口",    lat: 36.859417, lng: 137.533361, timeToNext: 3 },
  { name: "下立",      lat: 36.857816, lng: 137.541332, timeToNext: 4 },
  { name: "愛本",      lat: 36.855366, lng: 137.553871, timeToNext: 4 },
  { name: "内山",      lat: 36.846463, lng: 137.556868, timeToNext: 4 },
  { name: "舌山",      lat: 36.872202, lng: 137.485582, timeToNext: 4 },
  { name: "若栗",      lat: 36.871138, lng: 137.492823, timeToNext: 3 },
  { name: "栃屋",      lat: 36.869863, lng: 137.505681, timeToNext: 3 },
  { name: "浦山",      lat: 36.863589, lng: 137.519188, timeToNext: 3 },
  { name: "宇奈月",    lat: 36.815416, lng: 137.585187, timeToNext: 3 },
  { name: "宇奈月温泉", lat: 36.815569, lng: 137.584142, timeToNext: 0 },
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
  { name: "西長田ゆりの里", lat: 36.153819, lng: 136.206503, timeToNext: 4 },
  { name: "東藤島",    lat: 36.086615, lng: 136.269886, timeToNext: 4 },
  { name: "越前島橋",   lat: 36.090061, lng: 136.277181, timeToNext: 4 },
  { name: "観音町",    lat: 36.091759, lng: 136.290081, timeToNext: 3 },
  { name: "松岡",      lat: 36.093979, lng: 136.301845, timeToNext: 4 },
  { name: "志比堺",    lat: 36.097984, lng: 136.311266, timeToNext: 4 },
  { name: "永平寺口",   lat: 36.095880, lng: 136.326665, timeToNext: 5 },
  { name: "東古市",    lat: 36.231010, lng: 136.252510, timeToNext: 4 },
  { name: "山王",      lat: 36.079211, lng: 136.392493, timeToNext: 4 },
  { name: "発坂",      lat: 36.072619, lng: 136.465759, timeToNext: 4 },
  { name: "比島",      lat: 36.065994, lng: 136.483569, timeToNext: 4 },
  { name: "勝山",      lat: 36.056190, lng: 136.492053, timeToNext: 0 },
];

// 福井鉄道福武線: 越前武生〜田原町
export const fukuiRailwayFukubuLine: Station[] = [
  { name: "越前武生",   lat: 35.908030, lng: 136.148180, timeToNext: 3 },
  { name: "北府",      lat: 35.907790, lng: 136.141690, timeToNext: 3 },
  { name: "家久",      lat: 35.925794, lng: 136.170345, timeToNext: 4 },
  { name: "サンドーム西", lat: 35.936406, lng: 136.180535, timeToNext: 4 },
  { name: "鯖浦",      lat: 35.945380, lng: 136.082700, timeToNext: 4 },
  { name: "水落",      lat: 35.962455, lng: 136.183142, timeToNext: 3 },
  { name: "たけふ新",   lat: 35.906122, lng: 136.170258, timeToNext: 4 },
  { name: "三十八社",   lat: 35.989079, lng: 136.193767, timeToNext: 4 },
  { name: "泰澄の里",   lat: 35.999244, lng: 136.198358, timeToNext: 3 },
  { name: "清明",      lat: 36.022219, lng: 136.209501, timeToNext: 3 },
  { name: "経田",      lat: 36.032010, lng: 136.085360, timeToNext: 3 },
  { name: "花堂",      lat: 36.040881, lng: 136.215220, timeToNext: 3 },
  { name: "江端",      lat: 36.028123, lng: 136.212321, timeToNext: 3 },
  { name: "ベル前",    lat: 36.033831, lng: 136.213914, timeToNext: 3 },
  { name: "赤十字前",   lat: 36.048607, lng: 136.216665, timeToNext: 3 },
  { name: "福井城址大名町", lat: 36.063010, lng: 136.218290, timeToNext: 3 },
  { name: "田原町",    lat: 36.075730, lng: 136.199590, timeToNext: 0 },
];

// 北陸鉄道石川線: 野町〜鶴来
export const hokurikuTetsudoIshikawaLine: Station[] = [
  { name: "野町",      lat: 36.551050, lng: 136.621170, timeToNext: 3 },
  { name: "西泉",      lat: 36.553449, lng: 136.633470, timeToNext: 3 },
  { name: "押野",      lat: 36.542489, lng: 136.622060, timeToNext: 3 },
  { name: "野々市",    lat: 36.541954, lng: 136.598166, timeToNext: 3 },
  { name: "三納",      lat: 36.546710, lng: 136.542080, timeToNext: 3 },
  { name: "四十万",    lat: 36.498863, lng: 136.615691, timeToNext: 3 },
  { name: "乙丸",      lat: 36.511936, lng: 136.617681, timeToNext: 3 },
  { name: "陽羽里",    lat: 36.493702, lng: 136.614905, timeToNext: 3 },
  { name: "小柳",      lat: 36.470968, lng: 136.611468, timeToNext: 3 },
  { name: "道法寺",    lat: 36.484248, lng: 136.613493, timeToNext: 3 },
  { name: "鶴来",      lat: 36.452217, lng: 136.623981, timeToNext: 0 },
];

// JR北陸本線（金沢〜富山）: 金沢〜富山
export const jrHokurikuKanazawaToToyama: Station[] = [
  { name: "金沢",      lat: 36.578130, lng: 136.648290, timeToNext: 5 },
  { name: "東金沢",    lat: 36.582650, lng: 136.662240, timeToNext: 4 },
  { name: "森本",      lat: 36.605480, lng: 136.682870, timeToNext: 5 },
  { name: "津幡",      lat: 36.651290, lng: 136.735190, timeToNext: 5 },
  { name: "倶利伽羅",   lat: 36.680940, lng: 136.817770, timeToNext: 8 },
  { name: "石動",      lat: 36.672607, lng: 136.865429, timeToNext: 5 },
  { name: "福岡",      lat: 36.720050, lng: 136.905970, timeToNext: 5 },
  { name: "西高岡",    lat: 36.731250, lng: 136.944310, timeToNext: 4 },
  { name: "高岡",      lat: 36.754750, lng: 136.991230, timeToNext: 5 },
  { name: "越中大門",   lat: 36.734459, lng: 137.054763, timeToNext: 5 },
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
  { name: "越中中島",   lat: 36.722525, lng: 137.224891, timeToNext: 2 },
  { name: "城川原",    lat: 36.731195, lng: 137.226080, timeToNext: 2 },
  { name: "犬島新町",   lat: 36.735287, lng: 137.226617, timeToNext: 2 },
  { name: "蓮町（馬場記念公園前）", lat: 36.742442, lng: 137.227592, timeToNext: 2 },
  { name: "大広田",    lat: 36.795010, lng: 137.203890, timeToNext: 2 },
  { name: "東岩瀬",    lat: 36.752447, lng: 137.230710, timeToNext: 3 },
  { name: "競輪場前",   lat: 36.757450, lng: 137.233917, timeToNext: 2 },
  { name: "岩瀬カナル会館前", lat: 36.840770, lng: 137.218980, timeToNext: 2 },
  { name: "岩瀬浜",    lat: 36.761499, lng: 137.233981, timeToNext: 0 },
];
