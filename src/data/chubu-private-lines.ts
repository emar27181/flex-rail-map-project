import type { Station } from './yamanote';

// 富山地方鉄道市内電車（環状線）
export const toyamaTramLoop: Station[] = [
  { name: "富山駅",    lat: 36.696680, lng: 137.211540, timeToNext: 2 },
  { name: "大手モール",  lat: 36.693570, lng: 137.208200, timeToNext: 2 },
  { name: "国際会議場前", lat: 36.694570, lng: 137.204300, timeToNext: 2 },
  { name: "市役所前",   lat: 36.696110, lng: 137.200390, timeToNext: 2 },
  { name: "桜橋",      lat: 36.701260, lng: 137.199070, timeToNext: 2 },
  { name: "電気ビル前",  lat: 36.706090, lng: 137.207390, timeToNext: 2 },
  { name: "丸の内",    lat: 36.706270, lng: 137.212200, timeToNext: 2 },
  { name: "富山駅",    lat: 36.696680, lng: 137.211540, timeToNext: 0 },
];

// 万葉線: 高岡〜越ノ潟
export const manyoLine: Station[] = [
  { name: "高岡",      lat: 36.754750, lng: 136.991230, timeToNext: 2 },
  { name: "末広町",    lat: 36.757610, lng: 136.988300, timeToNext: 2 },
  { name: "急患医療センター前", lat: 36.758950, lng: 136.981130, timeToNext: 2 },
  { name: "志貴野中学校前", lat: 36.758200, lng: 136.977200, timeToNext: 2 },
  { name: "江尻",      lat: 36.756650, lng: 136.970130, timeToNext: 2 },
  { name: "旭ヶ丘",    lat: 36.751480, lng: 136.960230, timeToNext: 2 },
  { name: "荻布",      lat: 36.737780, lng: 136.950920, timeToNext: 2 },
  { name: "新能町",    lat: 36.726220, lng: 136.944740, timeToNext: 2 },
  { name: "米島口",    lat: 36.720770, lng: 136.940820, timeToNext: 2 },
  { name: "能町口",    lat: 36.716790, lng: 136.942640, timeToNext: 2 },
  { name: "新吉久",    lat: 36.710220, lng: 136.936620, timeToNext: 2 },
  { name: "吉久",      lat: 36.703360, lng: 136.934550, timeToNext: 2 },
  { name: "中新湊",    lat: 36.764340, lng: 137.080030, timeToNext: 2 },
  { name: "東新湊",    lat: 36.768090, lng: 137.090300, timeToNext: 2 },
  { name: "海王丸",    lat: 36.774490, lng: 137.094970, timeToNext: 2 },
  { name: "越ノ潟",    lat: 36.784050, lng: 137.101560, timeToNext: 0 },
];

// 豊橋鉄道東田本線（路面電車）: 駅前〜赤岩口・運動公園前
export const toyohashiTramLine: Station[] = [
  { name: "駅前",      lat: 34.769060, lng: 137.391970, timeToNext: 2 },
  { name: "新川",      lat: 34.772200, lng: 137.388670, timeToNext: 2 },
  { name: "市役所前",   lat: 34.776810, lng: 137.384830, timeToNext: 2 },
  { name: "豊橋公園前",  lat: 34.778980, lng: 137.379410, timeToNext: 2 },
  { name: "東八町",    lat: 34.775970, lng: 137.376430, timeToNext: 2 },
  { name: "札木",      lat: 34.770960, lng: 137.375060, timeToNext: 2 },
  { name: "豊橋",      lat: 34.769060, lng: 137.391970, timeToNext: 2 },
  { name: "競輪場前",   lat: 34.766900, lng: 137.376580, timeToNext: 2 },
  { name: "前畑",      lat: 34.762640, lng: 137.378030, timeToNext: 2 },
  { name: "井原",      lat: 34.755080, lng: 137.377280, timeToNext: 2 },
  { name: "運動公園前",  lat: 34.750430, lng: 137.373040, timeToNext: 2 },
  { name: "赤岩口",    lat: 34.757840, lng: 137.397610, timeToNext: 0 },
];

// 名鉄常滑線: 神宮前〜常滑
export const meitetsuTokonameLine: Station[] = [
  { name: "神宮前",    lat: 35.124780, lng: 136.912780, timeToNext: 3 },
  { name: "豊田本町",   lat: 35.113030, lng: 136.917010, timeToNext: 3 },
  { name: "道徳",      lat: 35.097760, lng: 136.913980, timeToNext: 3 },
  { name: "大江",      lat: 35.083590, lng: 136.923380, timeToNext: 3 },
  { name: "大同町",    lat: 35.072080, lng: 136.928970, timeToNext: 3 },
  { name: "柴田",      lat: 35.050420, lng: 136.922130, timeToNext: 4 },
  { name: "名和",      lat: 35.060741, lng: 136.911818, timeToNext: 4 },
  { name: "聚楽園",    lat: 35.042690, lng: 136.903017, timeToNext: 4 },
  { name: "新舞子",    lat: 34.949485, lng: 136.828671, timeToNext: 4 },
  { name: "大野町",    lat: 34.935267, lng: 136.827418, timeToNext: 4 },
  { name: "西ノ口",    lat: 34.924447, lng: 136.826861, timeToNext: 4 },
  { name: "蒲池",      lat: 34.906490, lng: 136.851450, timeToNext: 4 },
  { name: "常滑",      lat: 34.886340, lng: 136.834480, timeToNext: 0 },
];

// 名鉄犬山線: 枇杷島〜犬山
export const meitetsuInuyamaLine: Station[] = [
  { name: "枇杷島",    lat: 35.180840, lng: 136.866210, timeToNext: 3 },
  { name: "下小田井",   lat: 35.184280, lng: 136.849720, timeToNext: 3 },
  { name: "中小田井",   lat: 35.214806, lng: 136.876850, timeToNext: 3 },
  { name: "上小田井",   lat: 35.223542, lng: 136.876892, timeToNext: 3 },
  { name: "西春",      lat: 35.222820, lng: 136.844430, timeToNext: 3 },
  { name: "徳重・名古屋芸大", lat: 35.256061, lng: 136.873395, timeToNext: 3 },
  { name: "大山寺",    lat: 35.263257, lng: 136.874748, timeToNext: 4 },
  { name: "岩倉",      lat: 35.279950, lng: 136.872150, timeToNext: 5 },
  { name: "石仏",      lat: 35.296274, lng: 136.871208, timeToNext: 4 },
  { name: "布袋",      lat: 35.319050, lng: 136.895390, timeToNext: 4 },
  { name: "江南",      lat: 35.333240, lng: 136.872010, timeToNext: 4 },
  { name: "柏森",      lat: 35.344857, lng: 136.900404, timeToNext: 4 },
  { name: "扶桑",      lat: 35.359626, lng: 136.916017, timeToNext: 4 },
  { name: "木津用水",   lat: 35.366980, lng: 136.926103, timeToNext: 4 },
  { name: "犬山口",    lat: 35.394540, lng: 136.937920, timeToNext: 4 },
  { name: "犬山",      lat: 35.387180, lng: 136.943170, timeToNext: 0 },
];

// 近鉄名古屋線: 近鉄名古屋〜伊勢中川
export const kintetsuNagoyaLine: Station[] = [
  { name: "近鉄名古屋",  lat: 35.170900, lng: 136.882680, timeToNext: 3 },
  { name: "米野",      lat: 35.169800, lng: 136.867820, timeToNext: 3 },
  { name: "黄金",      lat: 35.160160, lng: 136.861270, timeToNext: 3 },
  { name: "烏森",      lat: 35.148560, lng: 136.843190, timeToNext: 3 },
  { name: "近鉄八田",   lat: 35.152370, lng: 136.824990, timeToNext: 3 },
  { name: "伏屋",      lat: 35.135320, lng: 136.817670, timeToNext: 4 },
  { name: "戸田",      lat: 35.113080, lng: 136.799580, timeToNext: 4 },
  { name: "近鉄弥富",   lat: 35.113656, lng: 136.727565, timeToNext: 5 },
  { name: "佐古木",    lat: 35.113510, lng: 136.736070, timeToNext: 5 },
  { name: "近鉄長島",   lat: 35.097879, lng: 136.696610, timeToNext: 5 },
  { name: "桑名",      lat: 35.079100, lng: 136.697500, timeToNext: 5 },
  { name: "伊勢朝日",   lat: 35.047720, lng: 136.693080, timeToNext: 5 },
  { name: "川越富洲原",  lat: 35.008760, lng: 136.682310, timeToNext: 5 },
  { name: "近鉄四日市",  lat: 34.966350, lng: 136.622450, timeToNext: 8 },
  { name: "川原町",    lat: 34.976952, lng: 136.623044, timeToNext: 5 },
  { name: "塩浜",      lat: 34.920990, lng: 136.618610, timeToNext: 5 },
  { name: "北楠",      lat: 34.910610, lng: 136.625420, timeToNext: 5 },
  { name: "楠",        lat: 34.904690, lng: 136.628870, timeToNext: 5 },
  { name: "長太ノ浦",   lat: 34.886870, lng: 136.645580, timeToNext: 5 },
  { name: "千代崎",    lat: 34.854855, lng: 136.608373, timeToNext: 5 },
  { name: "白子",      lat: 34.833972, lng: 136.589751, timeToNext: 5 },
  { name: "鼓ヶ浦",    lat: 34.826165, lng: 136.581190, timeToNext: 5 },
  { name: "磯山",      lat: 34.812548, lng: 136.568768, timeToNext: 5 },
  { name: "伊勢若松",   lat: 34.869627, lng: 136.616827, timeToNext: 5 },
  { name: "玉垣",      lat: 34.855337, lng: 136.570132, timeToNext: 5 },
  { name: "高茶屋",    lat: 34.667434, lng: 136.512547, timeToNext: 5 },
  { name: "六軒",      lat: 34.617450, lng: 136.507479, timeToNext: 5 },
  { name: "伊勢中川",   lat: 34.635291, lng: 136.478100, timeToNext: 0 },
];
