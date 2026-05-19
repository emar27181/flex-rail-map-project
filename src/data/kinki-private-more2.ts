import type { Station } from './yamanote';

// 近鉄奈良線: 大阪難波〜近鉄奈良
export const kintetsuNaraLine2: Station[] = [
  { name: "大阪難波",   lat: 34.659750, lng: 135.502730, timeToNext: 3 },
  { name: "近鉄日本橋",  lat: 34.661530, lng: 135.508870, timeToNext: 3 },
  { name: "大阪上本町",  lat: 34.670920, lng: 135.517440, timeToNext: 3 },
  { name: "鶴橋",      lat: 34.664390, lng: 135.537430, timeToNext: 3 },
  { name: "今里",      lat: 34.665960, lng: 135.546210, timeToNext: 3 },
  { name: "布施",      lat: 34.667200, lng: 135.570380, timeToNext: 4 },
  { name: "河内永和",   lat: 34.668130, lng: 135.577430, timeToNext: 3 },
  { name: "河内小阪",   lat: 34.668780, lng: 135.583250, timeToNext: 3 },
  { name: "八戸ノ里",   lat: 34.667010, lng: 135.597490, timeToNext: 3 },
  { name: "若江岩田",   lat: 34.667300, lng: 135.614980, timeToNext: 3 },
  { name: "河内花園",   lat: 34.667040, lng: 135.627770, timeToNext: 3 },
  { name: "東花園",    lat: 34.662521, lng: 135.626465, timeToNext: 3 },
  { name: "瓢箪山",    lat: 34.662061, lng: 135.639022, timeToNext: 3 },
  { name: "枚岡",      lat: 34.669800, lng: 135.648170, timeToNext: 3 },
  { name: "額田",      lat: 34.675343, lng: 135.651161, timeToNext: 3 },
  { name: "石切",      lat: 34.685228, lng: 135.655444, timeToNext: 4 },
  { name: "生駒",      lat: 34.697060, lng: 135.693410, timeToNext: 4 },
  { name: "菜畑",      lat: 34.698360, lng: 135.707700, timeToNext: 3 },
  { name: "富雄",      lat: 34.700430, lng: 135.723860, timeToNext: 3 },
  { name: "学園前",    lat: 34.698060, lng: 135.755560, timeToNext: 3 },
  { name: "大和西大寺",  lat: 34.694880, lng: 135.784990, timeToNext: 4 },
  { name: "新大宮",    lat: 34.690010, lng: 135.796650, timeToNext: 3 },
  { name: "近鉄奈良",   lat: 34.685450, lng: 135.808600, timeToNext: 0 },
];

// 近鉄志摩線: 鵜方〜賢島
export const kintetsuShimaLine: Station[] = [
  { name: "鵜方",      lat: 34.348250, lng: 136.828080, timeToNext: 3 },
  { name: "志摩磯部",   lat: 34.368010, lng: 136.830300, timeToNext: 3 },
  { name: "穴川",      lat: 34.358986, lng: 136.815982, timeToNext: 3 },
  { name: "上之郷",    lat: 34.379615, lng: 136.811459, timeToNext: 3 },
  { name: "志摩神明",   lat: 34.316004, lng: 136.829844, timeToNext: 3 },
  { name: "賢島",      lat: 34.318340, lng: 136.844880, timeToNext: 0 },
];

// 近鉄山田線: 伊勢中川〜宇治山田
export const kintetsuYamadaLine: Station[] = [
  { name: "伊勢中川",   lat: 34.635291, lng: 136.478100, timeToNext: 5 },
  { name: "松阪",      lat: 34.577630, lng: 136.527730, timeToNext: 5 },
  { name: "徳和",      lat: 34.558010, lng: 136.565220, timeToNext: 5 },
  { name: "多気",      lat: 34.516396, lng: 136.572770, timeToNext: 5 },
  { name: "外城田",    lat: 34.497660, lng: 136.596924, timeToNext: 5 },
  { name: "田丸",      lat: 34.488462, lng: 136.634098, timeToNext: 5 },
  { name: "宮川",      lat: 34.503180, lng: 136.672508, timeToNext: 5 },
  { name: "山田上口",   lat: 34.478510, lng: 136.712340, timeToNext: 5 },
  { name: "宇治山田",   lat: 34.488050, lng: 136.706360, timeToNext: 0 },
];

// 水間鉄道: 貝塚〜水間観音
export const mizumaRailway: Station[] = [
  { name: "貝塚",      lat: 34.456500, lng: 135.358870, timeToNext: 3 },
  { name: "貝塚市役所前", lat: 34.455590, lng: 135.362920, timeToNext: 3 },
  { name: "近義の里",   lat: 34.456950, lng: 135.371110, timeToNext: 3 },
  { name: "石才",      lat: 34.449260, lng: 135.382140, timeToNext: 3 },
  { name: "清児",      lat: 34.424870, lng: 135.372233, timeToNext: 3 },
  { name: "森",        lat: 34.414334, lng: 135.381808, timeToNext: 3 },
  { name: "三ヶ山口",   lat: 34.407245, lng: 135.384985, timeToNext: 3 },
  { name: "水間観音",   lat: 34.403339, lng: 135.385527, timeToNext: 0 },
];

// 神戸電鉄有馬線: 湊川〜有馬温泉
export const kobeElecArimaLine: Station[] = [
  { name: "湊川",      lat: 34.682880, lng: 135.167270, timeToNext: 3 },
  { name: "新開地",    lat: 34.690410, lng: 135.172690, timeToNext: 3 },
  { name: "丸山",      lat: 34.685798, lng: 135.144156, timeToNext: 3 },
  { name: "鵯越",      lat: 34.692869, lng: 135.142488, timeToNext: 4 },
  { name: "鈴蘭台",    lat: 34.723838, lng: 135.145876, timeToNext: 4 },
  { name: "北鈴蘭台",   lat: 34.739182, lng: 135.151952, timeToNext: 4 },
  { name: "山の街",    lat: 34.746367, lng: 135.153130, timeToNext: 4 },
  { name: "箕谷",      lat: 34.757000, lng: 135.155777, timeToNext: 4 },
  { name: "谷上",      lat: 34.761850, lng: 135.171388, timeToNext: 4 },
  { name: "有馬口",    lat: 34.796450, lng: 135.220770, timeToNext: 4 },
  { name: "有馬温泉",   lat: 34.798900, lng: 135.247420, timeToNext: 0 },
];

// 叡山電鉄叡山本線: 出町柳〜八瀬比叡山口
export const eizanMainLine: Station[] = [
  { name: "出町柳",    lat: 35.028260, lng: 135.774680, timeToNext: 3 },
  { name: "元田中",    lat: 35.035500, lng: 135.773790, timeToNext: 3 },
  { name: "茶山",      lat: 35.047640, lng: 135.770900, timeToNext: 3 },
  { name: "一乗寺",    lat: 35.055700, lng: 135.770720, timeToNext: 3 },
  { name: "修学院",    lat: 35.065110, lng: 135.775090, timeToNext: 3 },
  { name: "宝ヶ池",    lat: 35.074180, lng: 135.784800, timeToNext: 3 },
  { name: "三宅八幡",   lat: 35.062441, lng: 135.796189, timeToNext: 3 },
  { name: "八幡前",    lat: 35.066440, lng: 135.792389, timeToNext: 3 },
  { name: "岩倉",      lat: 35.071234, lng: 135.786592, timeToNext: 3 },
  { name: "木野",      lat: 35.071086, lng: 135.776431, timeToNext: 3 },
  { name: "二軒茶屋",   lat: 35.077828, lng: 135.765890, timeToNext: 4 },
  { name: "八瀬比叡山口", lat: 35.065222, lng: 135.808489, timeToNext: 0 },
];
