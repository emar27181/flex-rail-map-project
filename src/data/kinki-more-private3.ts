import type { Station } from './yamanote';

// 近鉄吉野線: 橿原神宮前〜吉野
export const kintetsuYoshinoLine: Station[] = [
  { name: "橿原神宮前",  lat: 34.490710, lng: 135.785400, timeToNext: 4 },
  { name: "岡寺",      lat: 34.473530, lng: 135.789990, timeToNext: 4 },
  { name: "飛鳥",      lat: 34.460740, lng: 135.809190, timeToNext: 4 },
  { name: "壺阪山",    lat: 34.449900, lng: 135.802190, timeToNext: 4 },
  { name: "市尾",      lat: 34.419300, lng: 135.819140, timeToNext: 5 },
  { name: "葛",        lat: 34.394650, lng: 135.828640, timeToNext: 5 },
  { name: "吉野口",    lat: 34.393400, lng: 135.829420, timeToNext: 5 },
  { name: "越部",      lat: 34.373830, lng: 135.845280, timeToNext: 5 },
  { name: "下市口",    lat: 34.358310, lng: 135.854320, timeToNext: 8 },
  { name: "大和上市",   lat: 34.362740, lng: 135.856490, timeToNext: 8 },
  { name: "薬水",      lat: 34.340520, lng: 135.874360, timeToNext: 8 },
  { name: "吉野神宮",   lat: 34.369900, lng: 135.861500, timeToNext: 5 },
  { name: "吉野",      lat: 34.371990, lng: 135.859840, timeToNext: 0 },
];

// 近鉄鳥羽線: 宇治山田〜鳥羽
export const kintetsuTobaLine: Station[] = [
  { name: "宇治山田",   lat: 34.488050, lng: 136.706360, timeToNext: 5 },
  { name: "朝熊",      lat: 34.449170, lng: 136.743420, timeToNext: 5 },
  { name: "池の浦",    lat: 34.426720, lng: 136.761840, timeToNext: 5 },
  { name: "鳥羽",      lat: 34.478340, lng: 136.843250, timeToNext: 0 },
];

// 近鉄湯の山線: 近鉄四日市〜湯の山温泉
export const kintetsuYunoyamaLine: Station[] = [
  { name: "近鉄四日市",  lat: 34.973200, lng: 136.623100, timeToNext: 4 },
  { name: "中川原",    lat: 34.971270, lng: 136.646890, timeToNext: 4 },
  { name: "伊勢松本",   lat: 34.970060, lng: 136.667640, timeToNext: 4 },
  { name: "伊勢川島",   lat: 34.978400, lng: 136.690430, timeToNext: 4 },
  { name: "高角",      lat: 34.988340, lng: 136.703600, timeToNext: 5 },
  { name: "桜",        lat: 34.983260, lng: 136.742810, timeToNext: 5 },
  { name: "菰野",      lat: 34.970240, lng: 136.747520, timeToNext: 5 },
  { name: "中菰野",    lat: 34.973930, lng: 136.773700, timeToNext: 5 },
  { name: "大羽根園",   lat: 34.975470, lng: 136.789340, timeToNext: 5 },
  { name: "湯の山温泉",  lat: 34.979000, lng: 136.814920, timeToNext: 0 },
];

// 京阪宇治線: 中書島〜宇治
export const keihanUjiLine: Station[] = [
  { name: "中書島",    lat: 34.924840, lng: 135.749160, timeToNext: 4 },
  { name: "観月橋",    lat: 34.914680, lng: 135.749500, timeToNext: 4 },
  { name: "桃山南口",   lat: 34.906290, lng: 135.753630, timeToNext: 4 },
  { name: "六地蔵",    lat: 34.899650, lng: 135.762190, timeToNext: 4 },
  { name: "木幡",      lat: 34.897570, lng: 135.772790, timeToNext: 4 },
  { name: "黄檗",      lat: 34.890780, lng: 135.797680, timeToNext: 4 },
  { name: "三室戸",    lat: 34.879780, lng: 135.825510, timeToNext: 4 },
  { name: "宇治",      lat: 34.883790, lng: 135.799850, timeToNext: 0 },
];

// 近鉄鈴鹿線: 伊勢若松〜平田町
export const kintetsuSuzukaLine: Station[] = [
  { name: "伊勢若松",   lat: 34.877120, lng: 136.565480, timeToNext: 4 },
  { name: "柳",        lat: 34.876080, lng: 136.554470, timeToNext: 4 },
  { name: "鈴鹿市",    lat: 34.876860, lng: 136.535570, timeToNext: 4 },
  { name: "三日市",    lat: 34.882650, lng: 136.513800, timeToNext: 4 },
  { name: "白子",      lat: 34.882780, lng: 136.503550, timeToNext: 4 },
  { name: "玉垣",      lat: 34.898050, lng: 136.494100, timeToNext: 4 },
  { name: "江島",      lat: 34.909470, lng: 136.481520, timeToNext: 4 },
  { name: "平田町",    lat: 34.932430, lng: 136.468130, timeToNext: 0 },
];

// 阪急今津線: 西宮北口〜宝塚
export const hankyuImazu: Station[] = [
  { name: "西宮北口",   lat: 34.737300, lng: 135.340140, timeToNext: 4 },
  { name: "阪急西宮",   lat: 34.726180, lng: 135.345430, timeToNext: 4 },
  { name: "甲東園",    lat: 34.742840, lng: 135.364950, timeToNext: 4 },
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
  { name: "我孫子前",   lat: 34.579620, lng: 135.518210, timeToNext: 4 },
  { name: "浅香山",    lat: 34.573780, lng: 135.524190, timeToNext: 4 },
  { name: "堺東",      lat: 34.570230, lng: 135.529280, timeToNext: 4 },
  { name: "中百舌鳥",   lat: 34.542520, lng: 135.494010, timeToNext: 8 },
  { name: "河内長野",   lat: 34.456550, lng: 135.562460, timeToNext: 10 },
  { name: "三日市町",   lat: 34.417810, lng: 135.549760, timeToNext: 8 },
  { name: "美加の台",   lat: 34.403080, lng: 135.527240, timeToNext: 8 },
  { name: "千早口",    lat: 34.359660, lng: 135.530780, timeToNext: 8 },
  { name: "天見",      lat: 34.337240, lng: 135.527760, timeToNext: 8 },
  { name: "橋本",      lat: 34.310150, lng: 135.604450, timeToNext: 0 },
];
