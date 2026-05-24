import type { Station } from './yamanote';

// JR阪和線: 天王寺〜和歌山
export const jrHanwaLine: Station[] = [
  { name: "天王寺",    lat: 34.645540, lng: 135.514560, timeToNext: 4 },
  { name: "美章園",    lat: 34.630460, lng: 135.514640, timeToNext: 3 },
  { name: "南田辺",    lat: 34.614950, lng: 135.513670, timeToNext: 3 },
  { name: "鶴ヶ丘",    lat: 34.606520, lng: 135.513200, timeToNext: 3 },
  { name: "長居",      lat: 34.598490, lng: 135.512910, timeToNext: 3 },
  { name: "我孫子町",   lat: 34.585060, lng: 135.512890, timeToNext: 4 },
  { name: "杉本町",    lat: 34.593023, lng: 135.503075, timeToNext: 4 },
  { name: "浅香",      lat: 34.585208, lng: 135.502380, timeToNext: 4 },
  { name: "堺市",      lat: 34.577824, lng: 135.498684, timeToNext: 4 },
  { name: "三国ヶ丘",   lat: 34.531220, lng: 135.482660, timeToNext: 4 },
  { name: "百舌鳥",    lat: 34.547000, lng: 135.475090, timeToNext: 4 },
  { name: "上野芝",    lat: 34.540690, lng: 135.472130, timeToNext: 4 },
  { name: "津久野",    lat: 34.527980, lng: 135.462070, timeToNext: 4 },
  { name: "鳳",        lat: 34.532007, lng: 135.458929, timeToNext: 5 },
  { name: "富木",      lat: 34.522811, lng: 135.451401, timeToNext: 5 },
  { name: "北信太",    lat: 34.510480, lng: 135.441360, timeToNext: 5 },
  { name: "信太山",    lat: 34.499771, lng: 135.432594, timeToNext: 5 },
  { name: "和泉府中",   lat: 34.487950, lng: 135.423878, timeToNext: 5 },
  { name: "久米田",    lat: 34.466035, lng: 135.405749, timeToNext: 5 },
  { name: "下松",      lat: 34.457499, lng: 135.396884, timeToNext: 5 },
  { name: "東岸和田",   lat: 34.449450, lng: 135.385971, timeToNext: 4 },
  { name: "東貝塚",    lat: 34.439737, lng: 135.372476, timeToNext: 4 },
  { name: "和泉橋本",   lat: 34.427551, lng: 135.358910, timeToNext: 4 },
  { name: "東佐野",    lat: 34.416509, lng: 135.349978, timeToNext: 4 },
  { name: "熊取",      lat: 34.406331, lng: 135.341221, timeToNext: 4 },
  { name: "日根野",    lat: 34.390860, lng: 135.331320, timeToNext: 5 },
  { name: "長滝",      lat: 34.381987, lng: 135.320077, timeToNext: 5 },
  { name: "新家",      lat: 34.372348, lng: 135.298963, timeToNext: 5 },
  { name: "和泉砂川",   lat: 34.360528, lng: 135.281478, timeToNext: 5 },
  { name: "和泉鳥取",   lat: 34.342562, lng: 135.263203, timeToNext: 5 },
  { name: "山中渓",    lat: 34.325789, lng: 135.269791, timeToNext: 8 },
  { name: "紀伊",      lat: 34.269295, lng: 135.246368, timeToNext: 5 },
  { name: "六十谷",    lat: 34.262420, lng: 135.207212, timeToNext: 4 },
  { name: "紀伊中ノ島",  lat: 34.239860, lng: 135.195770, timeToNext: 4 },
  { name: "和歌山",    lat: 34.231270, lng: 135.174500, timeToNext: 0 },
];

// JR奈良線: 京都〜奈良
export const jrNaraLine: Station[] = [
  { name: "京都",      lat: 34.985350, lng: 135.758766, timeToNext: 5 },
  { name: "東福寺",    lat: 34.975760, lng: 135.771530, timeToNext: 4 },
  { name: "稲荷",      lat: 34.967470, lng: 135.772720, timeToNext: 4 },
  { name: "JR藤森",    lat: 34.942950, lng: 135.777650, timeToNext: 4 },
  { name: "桃山",      lat: 34.934020, lng: 135.777020, timeToNext: 4 },
  { name: "六地蔵",    lat: 34.929890, lng: 135.794550, timeToNext: 4 },
  { name: "木幡",      lat: 34.908970, lng: 135.796540, timeToNext: 4 },
  { name: "黄檗",      lat: 34.895440, lng: 135.808480, timeToNext: 4 },
  { name: "宇治",      lat: 34.885610, lng: 135.805590, timeToNext: 5 },
  { name: "JR小倉",    lat: 34.889147, lng: 135.786292, timeToNext: 4 },
  { name: "新田",      lat: 34.874074, lng: 135.780661, timeToNext: 4 },
  { name: "城陽",      lat: 34.855490, lng: 135.784910, timeToNext: 5 },
  { name: "長池",      lat: 34.842416, lng: 135.789851, timeToNext: 4 },
  { name: "山城青谷",   lat: 34.808520, lng: 135.797090, timeToNext: 5 },
  { name: "山城多賀",   lat: 34.817381, lng: 135.806305, timeToNext: 5 },
  { name: "玉水",      lat: 34.800257, lng: 135.807031, timeToNext: 5 },
  { name: "棚倉",      lat: 34.774725, lng: 135.816107, timeToNext: 5 },
  { name: "上狛",      lat: 34.750434, lng: 135.821244, timeToNext: 5 },
  { name: "木津",      lat: 34.735888, lng: 135.824925, timeToNext: 5 },
  { name: "平城山",    lat: 34.707920, lng: 135.817100, timeToNext: 5 },
  { name: "奈良",      lat: 34.685280, lng: 135.800660, timeToNext: 0 },
];

// JR関西本線（大和路線を除く）大阪〜亀山: 加茂〜亀山
export const jrKansaiMainLine: Station[] = [
  { name: "加茂",      lat: 34.752715, lng: 135.869850, timeToNext: 5 },
  { name: "笠置",      lat: 34.765820, lng: 135.947240, timeToNext: 8 },
  { name: "大河原",    lat: 34.771677, lng: 135.987657, timeToNext: 5 },
  { name: "月ヶ瀬口",   lat: 34.736130, lng: 136.001020, timeToNext: 5 },
  { name: "島ヶ原",    lat: 34.767675, lng: 136.054182, timeToNext: 5 },
  { name: "伊賀上野",   lat: 34.788997, lng: 136.123510, timeToNext: 6 },
  { name: "佐那具",    lat: 34.804421, lng: 136.163937, timeToNext: 6 },
  { name: "丸山",      lat: 34.704653, lng: 136.157413, timeToNext: 5 },
  { name: "新堂",      lat: 34.821088, lng: 136.206699, timeToNext: 5 },
  { name: "河田",      lat: 34.793190, lng: 136.233320, timeToNext: 5 },
  { name: "柘植",      lat: 34.846881, lng: 136.255775, timeToNext: 8 },
  { name: "加太",      lat: 34.842469, lng: 136.340251, timeToNext: 8 },
  { name: "関",        lat: 34.849089, lng: 136.394795, timeToNext: 8 },
  { name: "亀山",      lat: 34.861340, lng: 136.446160, timeToNext: 0 },
];

// 和歌山電鐵貴志川線: 和歌山〜貴志
export const wakayamaDenwKishiLine: Station[] = [
  { name: "和歌山",         lat: 34.232608, lng: 135.191217, timeToNext: 3 },
  { name: "田中口",         lat: 34.227017, lng: 135.193134, timeToNext: 3 },
  { name: "日前宮",         lat: 34.226448, lng: 135.201818, timeToNext: 3 },
  { name: "神前",           lat: 34.213151, lng: 135.205128, timeToNext: 3 },
  { name: "竈山",           lat: 34.207289, lng: 135.207221, timeToNext: 4 },
  { name: "交通センター前", lat: 34.203824, lng: 135.218173, timeToNext: 3 },
  { name: "岡崎前",         lat: 34.203461, lng: 135.224996, timeToNext: 4 },
  { name: "吉礼",           lat: 34.203393, lng: 135.236127, timeToNext: 4 },
  { name: "伊太祁曽",       lat: 34.204210, lng: 135.251341, timeToNext: 5 },
  { name: "山東",           lat: 34.205866, lng: 135.262500, timeToNext: 5 },
  { name: "大池遊園",       lat: 34.204769, lng: 135.285577, timeToNext: 3 },
  { name: "西山口",         lat: 34.209784, lng: 135.291241, timeToNext: 4 },
  { name: "甘露寺前",       lat: 34.213321, lng: 135.301458, timeToNext: 4 },
  { name: "貴志",           lat: 34.209368, lng: 135.311980, timeToNext: 0 },
];

// 南海空港線: 泉佐野〜関西空港
export const nankaAirportLine: Station[] = [
  { name: "泉佐野",    lat: 34.402670, lng: 135.318960, timeToNext: 5 },
  { name: "りんくうタウン", lat: 34.400700, lng: 135.294560, timeToNext: 5 },
  { name: "関西空港",   lat: 34.435890, lng: 135.249890, timeToNext: 0 },
];
