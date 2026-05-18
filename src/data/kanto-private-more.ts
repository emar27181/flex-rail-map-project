import type { Station } from './yamanote';

// 東武野田線（アーバンパークライン）支線・追加区間は既登録
// 箱根登山鉄道: 小田原〜強羅
export const hakoneTozan2: Station[] = [
  { name: "小田原",    lat: 35.255590, lng: 139.160110, timeToNext: 3 },
  { name: "箱根板橋",   lat: 35.256730, lng: 139.141330, timeToNext: 3 },
  { name: "風祭",      lat: 35.246630, lng: 139.126640, timeToNext: 3 },
  { name: "入生田",    lat: 35.245380, lng: 139.110540, timeToNext: 3 },
  { name: "箱根湯本",   lat: 35.235540, lng: 139.104140, timeToNext: 5 },
  { name: "塔ノ沢",    lat: 35.226020, lng: 139.094240, timeToNext: 5 },
  { name: "大平台",    lat: 35.218870, lng: 139.072690, timeToNext: 5 },
  { name: "宮ノ下",    lat: 35.233110, lng: 139.060950, timeToNext: 5 },
  { name: "小涌谷",    lat: 35.247750, lng: 139.043720, timeToNext: 5 },
  { name: "彫刻の森",   lat: 35.240430, lng: 139.028750, timeToNext: 4 },
  { name: "強羅",      lat: 35.237600, lng: 139.024350, timeToNext: 0 },
];

// 京王相模原線（既登録 keioSagamiharaLine と重複しないよう確認済み）
// 多摩都市モノレール（既登録 tamaMonorail と重複しないよう確認済み）

// 新京成電鉄: 松戸〜京成津田沼
export const shinkeisei2: Station[] = [
  { name: "松戸",      lat: 35.787540, lng: 139.903740, timeToNext: 3 },
  { name: "上本郷",    lat: 35.790260, lng: 139.913560, timeToNext: 3 },
  { name: "松戸新田",   lat: 35.791080, lng: 139.925550, timeToNext: 3 },
  { name: "みのり台",   lat: 35.797490, lng: 139.939260, timeToNext: 3 },
  { name: "八柱",      lat: 35.802470, lng: 139.951270, timeToNext: 3 },
  { name: "常盤平",    lat: 35.801350, lng: 139.967420, timeToNext: 3 },
  { name: "五香",      lat: 35.787250, lng: 139.975070, timeToNext: 3 },
  { name: "元山",      lat: 35.778680, lng: 139.987840, timeToNext: 3 },
  { name: "くぬぎ山",   lat: 35.765380, lng: 139.992690, timeToNext: 3 },
  { name: "北初富",    lat: 35.753290, lng: 139.998240, timeToNext: 3 },
  { name: "新鎌ヶ谷",   lat: 35.783380, lng: 140.003070, timeToNext: 3 },
  { name: "鎌ヶ谷大仏",  lat: 35.750050, lng: 140.011830, timeToNext: 3 },
  { name: "二和向台",   lat: 35.739320, lng: 140.014340, timeToNext: 3 },
  { name: "三咲",      lat: 35.726760, lng: 140.003830, timeToNext: 3 },
  { name: "滝不動",    lat: 35.715540, lng: 140.003140, timeToNext: 3 },
  { name: "高根公団",   lat: 35.706370, lng: 140.003160, timeToNext: 3 },
  { name: "高根木戸",   lat: 35.698280, lng: 140.008720, timeToNext: 3 },
  { name: "北習志野",   lat: 35.693390, lng: 140.020880, timeToNext: 3 },
  { name: "習志野",    lat: 35.687900, lng: 140.027270, timeToNext: 3 },
  { name: "薬園台",    lat: 35.677100, lng: 140.025960, timeToNext: 3 },
  { name: "前原",      lat: 35.663720, lng: 140.025160, timeToNext: 3 },
  { name: "京成津田沼",  lat: 35.671780, lng: 140.018720, timeToNext: 0 },
];

// 東京メトロ有楽町線 延伸（豊洲〜有明）
// 江ノ島電鉄（既登録 enoshimaElectricRailway）

// 流鉄流山線: 馬橋〜流山
export const ryutetsuLine: Station[] = [
  { name: "馬橋",      lat: 35.794790, lng: 139.892700, timeToNext: 3 },
  { name: "幸谷",      lat: 35.800030, lng: 139.884620, timeToNext: 3 },
  { name: "小金城趾",   lat: 35.806020, lng: 139.876100, timeToNext: 3 },
  { name: "鰭ヶ崎",    lat: 35.813400, lng: 139.864780, timeToNext: 3 },
  { name: "平和台",    lat: 35.817310, lng: 139.855860, timeToNext: 3 },
  { name: "流山",      lat: 35.828380, lng: 139.900100, timeToNext: 0 },
];

// 銚子電気鉄道: 銚子〜外川
export const choshiDenki: Station[] = [
  { name: "銚子",      lat: 35.730090, lng: 140.825200, timeToNext: 3 },
  { name: "仲ノ町",    lat: 35.727320, lng: 140.824040, timeToNext: 3 },
  { name: "観音",      lat: 35.722300, lng: 140.827480, timeToNext: 3 },
  { name: "本銚子",    lat: 35.715940, lng: 140.825500, timeToNext: 3 },
  { name: "笠上黒生",   lat: 35.704960, lng: 140.814990, timeToNext: 3 },
  { name: "西海鹿島",   lat: 35.693560, lng: 140.805680, timeToNext: 3 },
  { name: "海鹿島",    lat: 35.682360, lng: 140.794660, timeToNext: 3 },
  { name: "君ヶ浜",    lat: 35.672690, lng: 140.783520, timeToNext: 3 },
  { name: "犬吠",      lat: 35.707620, lng: 140.870080, timeToNext: 3 },
  { name: "外川",      lat: 35.699290, lng: 140.878010, timeToNext: 0 },
];

// JR横須賀線（大船〜久里浜）: 既登録 yokosukaLine と重複
// 横浜高速鉄道みなとみらい線: 横浜〜元町・中華街
export const minatomirai: Station[] = [
  { name: "横浜",      lat: 35.465703, lng: 139.622041, timeToNext: 3 },
  { name: "新高島",    lat: 35.465230, lng: 139.636820, timeToNext: 3 },
  { name: "みなとみらい", lat: 35.460960, lng: 139.638340, timeToNext: 3 },
  { name: "馬車道",    lat: 35.451670, lng: 139.641290, timeToNext: 3 },
  { name: "日本大通り",  lat: 35.444600, lng: 139.641910, timeToNext: 3 },
  { name: "元町・中華街", lat: 35.443070, lng: 139.649390, timeToNext: 0 },
];
