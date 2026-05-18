import type { Station } from './yamanote';

// JR阪和線: 天王寺〜和歌山
export const jrHanwaLine: Station[] = [
  { name: "天王寺",    lat: 34.645540, lng: 135.514560, timeToNext: 4 },
  { name: "美章園",    lat: 34.630460, lng: 135.514640, timeToNext: 3 },
  { name: "南田辺",    lat: 34.614950, lng: 135.513670, timeToNext: 3 },
  { name: "鶴ヶ丘",    lat: 34.606520, lng: 135.513200, timeToNext: 3 },
  { name: "長居",      lat: 34.598490, lng: 135.512910, timeToNext: 3 },
  { name: "我孫子町",   lat: 34.585060, lng: 135.512890, timeToNext: 4 },
  { name: "杉本町",    lat: 34.570530, lng: 135.507910, timeToNext: 4 },
  { name: "浅香",      lat: 34.553130, lng: 135.498580, timeToNext: 4 },
  { name: "堺市",      lat: 34.540700, lng: 135.491380, timeToNext: 4 },
  { name: "三国ヶ丘",   lat: 34.531220, lng: 135.482660, timeToNext: 4 },
  { name: "百舌鳥",    lat: 34.566590, lng: 135.475090, timeToNext: 4 },
  { name: "上野芝",    lat: 34.540690, lng: 135.472130, timeToNext: 4 },
  { name: "津久野",    lat: 34.527980, lng: 135.462070, timeToNext: 4 },
  { name: "鳳",        lat: 34.508450, lng: 135.463650, timeToNext: 5 },
  { name: "富木",      lat: 34.466430, lng: 135.444250, timeToNext: 5 },
  { name: "北信太",    lat: 34.442930, lng: 135.434740, timeToNext: 5 },
  { name: "信太山",    lat: 34.427960, lng: 135.422630, timeToNext: 5 },
  { name: "和泉府中",   lat: 34.449320, lng: 135.408210, timeToNext: 5 },
  { name: "久米田",    lat: 34.419160, lng: 135.400110, timeToNext: 5 },
  { name: "下松",      lat: 34.394730, lng: 135.390190, timeToNext: 5 },
  { name: "東岸和田",   lat: 34.373400, lng: 135.373570, timeToNext: 4 },
  { name: "東貝塚",    lat: 34.348640, lng: 135.354310, timeToNext: 4 },
  { name: "和泉橋本",   lat: 34.337730, lng: 135.350810, timeToNext: 4 },
  { name: "東佐野",    lat: 34.317670, lng: 135.347590, timeToNext: 4 },
  { name: "熊取",      lat: 34.303400, lng: 135.347330, timeToNext: 4 },
  { name: "日根野",    lat: 34.276490, lng: 135.322090, timeToNext: 5 },
  { name: "長滝",      lat: 34.260310, lng: 135.296290, timeToNext: 5 },
  { name: "新家",      lat: 34.243140, lng: 135.291950, timeToNext: 5 },
  { name: "和泉砂川",   lat: 34.228980, lng: 135.288570, timeToNext: 5 },
  { name: "和泉鳥取",   lat: 34.193740, lng: 135.261690, timeToNext: 5 },
  { name: "山中渓",    lat: 34.162580, lng: 135.243090, timeToNext: 8 },
  { name: "紀伊",      lat: 34.222520, lng: 135.178250, timeToNext: 5 },
  { name: "六十谷",    lat: 34.235140, lng: 135.183420, timeToNext: 4 },
  { name: "紀伊中ノ島",  lat: 34.239860, lng: 135.195770, timeToNext: 4 },
  { name: "和歌山",    lat: 34.231270, lng: 135.174500, timeToNext: 0 },
];

// JR奈良線: 京都〜奈良
export const jrNaraLine: Station[] = [
  { name: "京都",      lat: 35.011570, lng: 135.752200, timeToNext: 5 },
  { name: "東福寺",    lat: 34.975760, lng: 135.771530, timeToNext: 4 },
  { name: "稲荷",      lat: 34.967470, lng: 135.772720, timeToNext: 4 },
  { name: "JR藤森",    lat: 34.942950, lng: 135.777650, timeToNext: 4 },
  { name: "桃山",      lat: 34.934020, lng: 135.777020, timeToNext: 4 },
  { name: "六地蔵",    lat: 34.929890, lng: 135.794550, timeToNext: 4 },
  { name: "木幡",      lat: 34.908970, lng: 135.796540, timeToNext: 4 },
  { name: "黄檗",      lat: 34.895440, lng: 135.808480, timeToNext: 4 },
  { name: "宇治",      lat: 34.885610, lng: 135.805590, timeToNext: 5 },
  { name: "JR小倉",    lat: 34.892370, lng: 135.814620, timeToNext: 4 },
  { name: "新田",      lat: 34.878560, lng: 135.817840, timeToNext: 4 },
  { name: "城陽",      lat: 34.855490, lng: 135.784910, timeToNext: 5 },
  { name: "長池",      lat: 34.833970, lng: 135.768090, timeToNext: 4 },
  { name: "山城青谷",   lat: 34.808520, lng: 135.797090, timeToNext: 5 },
  { name: "山城多賀",   lat: 34.782760, lng: 135.828020, timeToNext: 5 },
  { name: "玉水",      lat: 34.773280, lng: 135.849200, timeToNext: 5 },
  { name: "棚倉",      lat: 34.745990, lng: 135.862080, timeToNext: 5 },
  { name: "上狛",      lat: 34.731840, lng: 135.855590, timeToNext: 5 },
  { name: "木津",      lat: 34.738420, lng: 135.847490, timeToNext: 5 },
  { name: "平城山",    lat: 34.707920, lng: 135.817100, timeToNext: 5 },
  { name: "奈良",      lat: 34.685280, lng: 135.800660, timeToNext: 0 },
];

// JR関西本線（大和路線を除く）大阪〜亀山: 加茂〜亀山
export const jrKansaiMainLine: Station[] = [
  { name: "加茂",      lat: 34.749750, lng: 135.830260, timeToNext: 5 },
  { name: "笠置",      lat: 34.765820, lng: 135.947240, timeToNext: 8 },
  { name: "大河原",    lat: 34.759920, lng: 135.967620, timeToNext: 5 },
  { name: "月ヶ瀬口",   lat: 34.736130, lng: 136.001020, timeToNext: 5 },
  { name: "島ヶ原",    lat: 34.730920, lng: 136.065840, timeToNext: 5 },
  { name: "伊賀上野",   lat: 34.761940, lng: 136.122940, timeToNext: 6 },
  { name: "佐那具",    lat: 34.762640, lng: 136.136620, timeToNext: 6 },
  { name: "丸山",      lat: 34.779500, lng: 136.175310, timeToNext: 5 },
  { name: "新堂",      lat: 34.791290, lng: 136.181080, timeToNext: 5 },
  { name: "河田",      lat: 34.793190, lng: 136.233320, timeToNext: 5 },
  { name: "柘植",      lat: 34.813200, lng: 136.006050, timeToNext: 8 },
  { name: "油日",      lat: 34.882350, lng: 136.136950, timeToNext: 8 },
  { name: "甲賀",      lat: 34.869430, lng: 136.126820, timeToNext: 8 },
  { name: "三雲",      lat: 34.942100, lng: 136.048360, timeToNext: 8 },
  { name: "亀山",      lat: 34.861340, lng: 136.446160, timeToNext: 0 },
];

// 和歌山電鐵貴志川線: 和歌山〜貴志
export const wakayamaDenwKishiLine: Station[] = [
  { name: "和歌山",    lat: 34.231270, lng: 135.174500, timeToNext: 3 },
  { name: "田中口",    lat: 34.236720, lng: 135.178970, timeToNext: 3 },
  { name: "日前宮",    lat: 34.237040, lng: 135.185270, timeToNext: 3 },
  { name: "県前",      lat: 34.235830, lng: 135.192190, timeToNext: 3 },
  { name: "岡崎前",    lat: 34.228790, lng: 135.199010, timeToNext: 3 },
  { name: "吉礼",      lat: 34.226890, lng: 135.221380, timeToNext: 3 },
  { name: "伊太祁曽",   lat: 34.214190, lng: 135.260760, timeToNext: 3 },
  { name: "山東",      lat: 34.210920, lng: 135.283700, timeToNext: 3 },
  { name: "大池遊園",   lat: 34.200560, lng: 135.304130, timeToNext: 3 },
  { name: "西山口",    lat: 34.191640, lng: 135.323890, timeToNext: 3 },
  { name: "甘露寺前",   lat: 34.186420, lng: 135.349450, timeToNext: 3 },
  { name: "貴志",      lat: 34.178630, lng: 135.394380, timeToNext: 0 },
];

// 南海空港線: 泉佐野〜関西空港
export const nankaAirportLine: Station[] = [
  { name: "泉佐野",    lat: 34.402670, lng: 135.318960, timeToNext: 5 },
  { name: "りんくうタウン", lat: 34.400700, lng: 135.294560, timeToNext: 5 },
  { name: "関西空港",   lat: 34.435890, lng: 135.249890, timeToNext: 0 },
];
