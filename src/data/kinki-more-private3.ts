import type { Station } from './yamanote';

// 近鉄吉野線: 橿原神宮前〜吉野
export const kintetsuYoshinoLine: Station[] = [
  { name: "橿原神宮前",  lat: 34.490710, lng: 135.785400, timeToNext: 4 },
  { name: "岡寺",      lat: 34.473530, lng: 135.789990, timeToNext: 4 },
  { name: "飛鳥",      lat: 34.460740, lng: 135.809190, timeToNext: 4 },
  { name: "壺阪山",    lat: 34.449900, lng: 135.802190, timeToNext: 4 },
  { name: "市尾",      lat: 34.441702, lng: 135.776192, timeToNext: 5 },
  { name: "葛",        lat: 34.431385, lng: 135.759834, timeToNext: 5 },
  { name: "吉野口",    lat: 34.420682, lng: 135.750514, timeToNext: 5 },
  { name: "越部",      lat: 34.386067, lng: 135.802851, timeToNext: 5 },
  { name: "下市口",    lat: 34.383986, lng: 135.786996, timeToNext: 8 },
  { name: "大和上市",   lat: 34.395594, lng: 135.845532, timeToNext: 8 },
  { name: "薬水",      lat: 34.407338, lng: 135.743049, timeToNext: 8 },
  { name: "吉野神宮",   lat: 34.390542, lng: 135.848045, timeToNext: 5 },
  { name: "吉野",      lat: 34.371990, lng: 135.859840, timeToNext: 0 },
];

// 近鉄鳥羽線: 宇治山田〜鳥羽
export const kintetsuTobaLine: Station[] = [
  { name: "宇治山田",   lat: 34.488050, lng: 136.706360, timeToNext: 5 },
  { name: "朝熊",      lat: 34.449170, lng: 136.743420, timeToNext: 5 },
  { name: "池の浦",    lat: 34.479216, lng: 136.818660, timeToNext: 5 },
  { name: "鳥羽",      lat: 34.478340, lng: 136.843250, timeToNext: 0 },
];

// 近鉄湯の山線: 近鉄四日市〜湯の山温泉
export const kintetsuYunoyamaLine: Station[] = [
  { name: "近鉄四日市",  lat: 34.973200, lng: 136.623100, timeToNext: 4 },
  { name: "中川原",    lat: 34.969351, lng: 136.603227, timeToNext: 4 },
  { name: "伊勢松本",   lat: 34.969792, lng: 136.590575, timeToNext: 4 },
  { name: "伊勢川島",   lat: 34.977609, lng: 136.566736, timeToNext: 4 },
  { name: "高角",      lat: 34.983691, lng: 136.554176, timeToNext: 5 },
  { name: "桜",        lat: 34.996561, lng: 136.541635, timeToNext: 5 },
  { name: "菰野",      lat: 35.008612, lng: 136.517744, timeToNext: 5 },
  { name: "中菰野",    lat: 35.012270, lng: 136.504321, timeToNext: 5 },
  { name: "大羽根園",   lat: 35.012614, lng: 136.494444, timeToNext: 5 },
  { name: "湯の山温泉",  lat: 35.011844, lng: 136.474005, timeToNext: 0 },
];

// 京阪宇治線: 中書島〜宇治
export const keihanUjiLine: Station[] = [
  { name: "中書島",    lat: 34.924840, lng: 135.749160, timeToNext: 4 },
  { name: "観月橋",    lat: 34.914680, lng: 135.749500, timeToNext: 4 },
  { name: "桃山南口",   lat: 34.931049, lng: 135.783724, timeToNext: 4 },
  { name: "六地蔵",    lat: 34.931953, lng: 135.793342, timeToNext: 4 },
  { name: "木幡",      lat: 34.926007, lng: 135.796069, timeToNext: 4 },
  { name: "黄檗",      lat: 34.912706, lng: 135.803663, timeToNext: 4 },
  { name: "三室戸",    lat: 34.879780, lng: 135.825510, timeToNext: 4 },
  { name: "宇治",      lat: 34.883790, lng: 135.799850, timeToNext: 0 },
];

// 近鉄鈴鹿線: 伊勢若松〜平田町
export const kintetsuSuzukaLine: Station[] = [
  { name: "伊勢若松",   lat: 34.869627, lng: 136.616827, timeToNext: 4 },
  { name: "柳",        lat: 34.871641, lng: 136.595859, timeToNext: 4 },
  { name: "鈴鹿市",    lat: 34.884129, lng: 136.582517, timeToNext: 4 },
  { name: "三日市",    lat: 34.880196, lng: 136.562031, timeToNext: 4 },
  { name: "白子",      lat: 34.834110, lng: 136.589570, timeToNext: 4 },
  { name: "玉垣",      lat: 34.855337, lng: 136.570132, timeToNext: 4 },
  { name: "江島",      lat: 34.909470, lng: 136.481520, timeToNext: 4 },
  { name: "平田町",    lat: 34.874918, lng: 136.541913, timeToNext: 0 },
];

// 阪急今津線: 西宮北口〜宝塚
export const hankyuImazu: Station[] = [
  { name: "西宮北口",   lat: 34.737300, lng: 135.340140, timeToNext: 4 },
  { name: "阪急西宮",   lat: 34.726180, lng: 135.345430, timeToNext: 4 },
  { name: "甲東園",    lat: 34.766878, lng: 135.359769, timeToNext: 4 },
  { name: "仁川",      lat: 34.757840, lng: 135.367520, timeToNext: 4 },
  { name: "小林",      lat: 34.771580, lng: 135.367250, timeToNext: 4 },
  { name: "逆瀬川",    lat: 34.788060, lng: 135.365360, timeToNext: 4 },
  { name: "宝塚南口",   lat: 34.800230, lng: 135.360880, timeToNext: 4 },
  { name: "宝塚",      lat: 34.806440, lng: 135.357490, timeToNext: 0 },
];

// 南海高野線: 難波〜橋本（汐見橋線を除く）
export const nankaKoyaLine2: Station[] = [
  { name: "難波",      lat: 34.661160, lng: 135.498790, timeToNext: 4 },
  { name: "今宮戎",    lat: 34.648110, lng: 135.499830, timeToNext: 3 },
  { name: "萩ノ茶屋",   lat: 34.638350, lng: 135.500460, timeToNext: 3 },
  { name: "天下茶屋",   lat: 34.626750, lng: 135.502220, timeToNext: 4 },
  { name: "岸里玉出",   lat: 34.617060, lng: 135.496580, timeToNext: 4 },
  { name: "帝塚山",    lat: 34.607080, lng: 135.494310, timeToNext: 4 },
  { name: "住吉東",    lat: 34.598370, lng: 135.504390, timeToNext: 4 },
  { name: "沢ノ町",    lat: 34.589520, lng: 135.505280, timeToNext: 4 },
  { name: "我孫子前",   lat: 34.600438, lng: 135.496943, timeToNext: 4 },
  { name: "浅香山",    lat: 34.589055, lng: 135.490869, timeToNext: 4 },
  { name: "堺東",      lat: 34.575513, lng: 135.484958, timeToNext: 4 },
  { name: "中百舌鳥",   lat: 34.542520, lng: 135.494010, timeToNext: 8 },
  { name: "河内長野",   lat: 34.456550, lng: 135.562460, timeToNext: 10 },
  { name: "三日市町",   lat: 34.436620, lng: 135.571303, timeToNext: 8 },
  { name: "美加の台",   lat: 34.424369, lng: 135.577595, timeToNext: 8 },
  { name: "千早口",    lat: 34.411722, lng: 135.590105, timeToNext: 8 },
  { name: "天見",      lat: 34.397172, lng: 135.595534, timeToNext: 8 },
  { name: "橋本",      lat: 34.310150, lng: 135.604450, timeToNext: 0 },
];
