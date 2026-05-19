import type { Station } from './yamanote';

// 会津鉄道会津線: 西若松〜会津高原尾瀬口
export const aizuRailway: Station[] = [
  { name: "西若松",           lat: 37.487510, lng: 139.912620, timeToNext: 4 },
  { name: "南若松",           lat: 37.474240, lng: 139.912720, timeToNext: 5 },
  { name: "門田",             lat: 37.457640, lng: 139.918570, timeToNext: 4 },
  { name: "武蔵塚",           lat: 37.445230, lng: 139.919440, timeToNext: 5 },
  { name: "東長原",           lat: 37.428760, lng: 139.924280, timeToNext: 6 },
  { name: "鶴沼",             lat: 37.413650, lng: 139.933060, timeToNext: 8 },
  { name: "芦ノ牧温泉",       lat: 37.397730, lng: 139.941570, timeToNext: 8 },
  { name: "大川ダム公園",     lat: 37.347152, lng: 139.920871, timeToNext: 7 },
  { name: "七ヶ岳登山口",     lat: 37.359480, lng: 139.933020, timeToNext: 5 },
  { name: "芦ノ牧温泉南",     lat: 37.341040, lng: 139.925330, timeToNext: 8 },
  { name: "会津下郷",         lat: 37.255139, lng: 139.864949, timeToNext: 10 },
  { name: "塔のへつり",       lat: 37.279180, lng: 139.903570, timeToNext: 8 },
  { name: "弥五島",           lat: 37.251530, lng: 139.889290, timeToNext: 10 },
  { name: "養鱒公園",         lat: 37.224521, lng: 139.841818, timeToNext: 8 },
  { name: "南会津",           lat: 37.190100, lng: 139.855270, timeToNext: 5 },
  { name: "田島高校前",       lat: 37.209577, lng: 139.800714, timeToNext: 4 },
  { name: "会津田島",         lat: 37.203326, lng: 139.773761, timeToNext: 8 },
  { name: "中荒井",           lat: 37.180277, lng: 139.750986, timeToNext: 7 },
  { name: "会津長野",         lat: 37.215282, lng: 139.823829, timeToNext: 8 },
  { name: "大桃",             lat: 37.107820, lng: 139.799740, timeToNext: 8 },
  { name: "会津山村道場",     lat: 37.144614, lng: 139.731828, timeToNext: 8 },
  { name: "会津高原尾瀬口",   lat: 37.089784, lng: 139.705028, timeToNext: 0 },
];

// 野岩鉄道会津鬼怒川線: 新藤原〜会津高原尾瀬口
export const yaganRailway: Station[] = [
  { name: "新藤原",           lat: 36.852834, lng: 139.732771, timeToNext: 8 },
  { name: "龍王峡",           lat: 36.861105, lng: 139.718554, timeToNext: 7 },
  { name: "川治温泉",         lat: 36.884462, lng: 139.703883, timeToNext: 5 },
  { name: "川治湯元",         lat: 36.895309, lng: 139.702778, timeToNext: 8 },
  { name: "湯西川温泉",       lat: 36.929503, lng: 139.688291, timeToNext: 10 },
  { name: "中三依温泉",       lat: 36.985280, lng: 139.699282, timeToNext: 10 },
  { name: "上三依塩原温泉口", lat: 37.013896, lng: 139.727529, timeToNext: 12 },
  { name: "男鹿高原",         lat: 37.047611, lng: 139.724245, timeToNext: 20 },
  { name: "会津高原尾瀬口",   lat: 37.089784, lng: 139.705028, timeToNext: 0 },
];

// 東武佐野線: 館林〜葛生
export const tobuSanoLine: Station[] = [
  { name: "館林",     lat: 36.248820, lng: 139.542800, timeToNext: 5 },
  { name: "渡瀬",     lat: 36.228780, lng: 139.519660, timeToNext: 5 },
  { name: "田島",     lat: 36.207640, lng: 139.501020, timeToNext: 5 },
  { name: "佐野市",   lat: 36.228520, lng: 139.590110, timeToNext: 5 },
  { name: "佐野",     lat: 36.224430, lng: 139.603270, timeToNext: 5 },
  { name: "堀米",     lat: 36.217800, lng: 139.619720, timeToNext: 4 },
  { name: "吉水",     lat: 36.213100, lng: 139.634230, timeToNext: 5 },
  { name: "田沼",     lat: 36.205380, lng: 139.654720, timeToNext: 8 },
  { name: "多田",     lat: 36.213640, lng: 139.700420, timeToNext: 7 },
  { name: "葛生",     lat: 36.220820, lng: 139.726590, timeToNext: 0 },
];

// 東武桐生線: 太田〜赤城
export const tobuKiryuLine: Station[] = [
  { name: "太田",     lat: 36.291150, lng: 139.375430, timeToNext: 5 },
  { name: "三枚橋",   lat: 36.312420, lng: 139.380870, timeToNext: 4 },
  { name: "治良門橋", lat: 36.328720, lng: 139.384320, timeToNext: 5 },
  { name: "天王宿",   lat: 36.343800, lng: 139.390570, timeToNext: 4 },
  { name: "藪塚",     lat: 36.356770, lng: 139.408790, timeToNext: 5 },
  { name: "新桐生",   lat: 36.375750, lng: 139.340600, timeToNext: 5 },
  { name: "相老",     lat: 36.395020, lng: 139.330990, timeToNext: 5 },
  { name: "赤城",     lat: 36.413540, lng: 139.283660, timeToNext: 0 },
];
