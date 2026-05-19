import type { Station } from './yamanote';

// 京都市営地下鉄烏丸線: 国際会館〜竹田
export const kyotoSubwayKarasuma: Station[] = [
  { name: "国際会館",           lat: 35.061900, lng: 135.780400, timeToNext: 3 },
  { name: "松ヶ崎",             lat: 35.047200, lng: 135.778800, timeToNext: 3 },
  { name: "北山",               lat: 35.0512426, lng: 135.7652088, timeToNext: 3 },
  { name: "北大路",             lat: 35.044573, lng: 135.758709, timeToNext: 3 },
  { name: "鞍馬口",             lat: 35.037182, lng: 135.759303, timeToNext: 2 },
  { name: "今出川",             lat: 35.029394, lng: 135.759369, timeToNext: 2 },
  { name: "丸太町",             lat: 35.010900, lng: 135.756600, timeToNext: 2 },
  { name: "烏丸御池",           lat: 35.004400, lng: 135.757000, timeToNext: 2 },
  { name: "四条",               lat: 34.997900, lng: 135.758900, timeToNext: 2 },
  { name: "五条",               lat: 34.991700, lng: 135.761200, timeToNext: 2 },
  { name: "京都",               lat: 34.985300, lng: 135.754700, timeToNext: 3 },
  { name: "九条",               lat: 34.978400, lng: 135.758200, timeToNext: 3 },
  { name: "十条",               lat: 34.971900, lng: 135.760200, timeToNext: 3 },
  { name: "くいな橋",           lat: 34.965300, lng: 135.762400, timeToNext: 3 },
  { name: "竹田",               lat: 34.957100, lng: 135.764900, timeToNext: 0 },
];

// 京都市営地下鉄東西線: 太秦天神川〜六地蔵
export const kyotoSubwayTozai: Station[] = [
  { name: "太秦天神川",         lat: 35.013800, lng: 135.709800, timeToNext: 3 },
  { name: "嵐電天神川",         lat: 35.012600, lng: 135.716400, timeToNext: 2 },
  { name: "西大路御池",         lat: 35.009600, lng: 135.730400, timeToNext: 2 },
  { name: "二条城前",           lat: 35.009300, lng: 135.741200, timeToNext: 2 },
  { name: "二条",               lat: 35.009400, lng: 135.749400, timeToNext: 2 },
  { name: "烏丸御池",           lat: 35.004400, lng: 135.757000, timeToNext: 2 },
  { name: "京都市役所前",       lat: 35.007800, lng: 135.768200, timeToNext: 2 },
  { name: "三条京阪",           lat: 35.009900, lng: 135.773200, timeToNext: 2 },
  { name: "東山",               lat: 35.008600, lng: 135.780400, timeToNext: 2 },
  { name: "蹴上",               lat: 35.008100, lng: 135.790200, timeToNext: 3 },
  { name: "御陵",               lat: 34.992400, lng: 135.806900, timeToNext: 3 },
  { name: "山科",               lat: 34.988600, lng: 135.820200, timeToNext: 3 },
  { name: "東野",               lat: 34.9819568, lng: 135.8166753, timeToNext: 3 },
  { name: "椥辻",               lat: 34.972709, lng: 135.814901, timeToNext: 3 },
  { name: "小野",               lat: 34.9611448, lng: 135.8126889, timeToNext: 3 },
  { name: "醍醐",               lat: 34.9506686, lng: 135.8106505, timeToNext: 3 },
  { name: "石田",               lat: 34.9406255, lng: 135.8040057, timeToNext: 3 },
  { name: "六地蔵",             lat: 34.9335726, lng: 135.7963125, timeToNext: 0 },
];

// 嵐電（京福電気鉄道嵐山本線）: 四条大宮〜嵐山
export const keifukuArashiyama: Station[] = [
  { name: "四条大宮",           lat: 34.997200, lng: 135.748100, timeToNext: 3 },
  { name: "西院",               lat: 35.000400, lng: 135.735200, timeToNext: 3 },
  { name: "西大路三条",         lat: 35.007800, lng: 135.730800, timeToNext: 2 },
  { name: "山ノ内",             lat: 35.0083176, lng: 135.7231517, timeToNext: 2 },
  { name: "嵐電天神川",         lat: 35.012600, lng: 135.716400, timeToNext: 3 },
  { name: "蚕ノ社",             lat: 35.012200, lng: 135.706200, timeToNext: 2 },
  { name: "太秦広隆寺",         lat: 35.011800, lng: 135.699600, timeToNext: 2 },
  { name: "帷子ノ辻",           lat: 35.013600, lng: 135.694400, timeToNext: 2 },
  { name: "有栖川",             lat: 35.017400, lng: 135.688200, timeToNext: 3 },
  { name: "車折神社",           lat: 35.019200, lng: 135.681200, timeToNext: 2 },
  { name: "鹿王院",             lat: 35.020800, lng: 135.676400, timeToNext: 2 },
  { name: "嵐電嵯峨",           lat: 35.016445, lng: 135.681443, timeToNext: 3 },
  { name: "嵐山",               lat: 35.012600, lng: 135.673100, timeToNext: 0 },
];
