import type { Station } from './yamanote';

// 東北新幹線: 東京〜新青森
export const tohokuShinkansen: Station[] = [
  { name: "東京",     lat: 35.681382, lng: 139.766084, timeToNext: 25 },
  { name: "上野",     lat: 35.713768, lng: 139.777254, timeToNext: 15 },
  { name: "大宮",     lat: 35.906642, lng: 139.623960, timeToNext: 27 },
  { name: "小山",     lat: 36.309490, lng: 139.797780, timeToNext: 16 },
  { name: "宇都宮",   lat: 36.553650, lng: 139.882980, timeToNext: 20 },
  { name: "那須塩原", lat: 36.931533, lng: 140.021069, timeToNext: 26 },
  { name: "新白河",   lat: 37.123091, lng: 140.188446, timeToNext: 22 },
  { name: "郡山",     lat: 37.396650, lng: 140.382030, timeToNext: 17 },
  { name: "福島",     lat: 37.751640, lng: 140.467330, timeToNext: 17 },
  { name: "白石蔵王", lat: 38.005560, lng: 140.618050, timeToNext: 26 },
  { name: "仙台",     lat: 38.260454, lng: 140.882078, timeToNext: 20 },
  { name: "古川",     lat: 38.574600, lng: 140.954170, timeToNext: 15 },
  { name: "くりこま高原", lat: 38.748740, lng: 141.071609, timeToNext: 12 },
  { name: "一ノ関",   lat: 38.933750, lng: 141.127540, timeToNext: 15 },
  { name: "水沢江刺", lat: 39.131870, lng: 141.173440, timeToNext: 12 },
  { name: "北上",     lat: 39.296540, lng: 141.114820, timeToNext: 10 },
  { name: "新花巻",   lat: 39.400750, lng: 141.193100, timeToNext: 14 },
  { name: "盛岡",     lat: 39.701550, lng: 141.134140, timeToNext: 28 },
  { name: "いわて沼宮内", lat: 39.960584, lng: 141.217284, timeToNext: 13 },
  { name: "二戸",     lat: 40.278670, lng: 141.302270, timeToNext: 22 },
  { name: "八戸",     lat: 40.509157, lng: 141.431498, timeToNext: 27 },
  { name: "七戸十和田", lat: 40.703020, lng: 141.162370, timeToNext: 17 },
  { name: "新青森",   lat: 40.822330, lng: 140.685290, timeToNext: 0 },
];

// 山陽新幹線: 新大阪〜博多
export const sanyoShinkansen: Station[] = [
  { name: "新大阪",   lat: 34.733493, lng: 135.500054, timeToNext: 15 },
  { name: "新神戸",   lat: 34.700100, lng: 135.194880, timeToNext: 22 },
  { name: "西明石",   lat: 34.666905, lng: 134.960417, timeToNext: 14 },
  { name: "姫路",     lat: 34.820930, lng: 134.685340, timeToNext: 17 },
  { name: "相生",     lat: 34.804350, lng: 134.468570, timeToNext: 24 },
  { name: "岡山",     lat: 34.665330, lng: 133.918710, timeToNext: 17 },
  { name: "新倉敷",   lat: 34.565258, lng: 133.678460, timeToNext: 12 },
  { name: "福山",     lat: 34.491450, lng: 133.362060, timeToNext: 18 },
  { name: "新尾道",   lat: 34.430063, lng: 133.190328, timeToNext: 10 },
  { name: "三原",     lat: 34.397600, lng: 133.077970, timeToNext: 10 },
  { name: "東広島",   lat: 34.388899, lng: 132.758879, timeToNext: 18 },
  { name: "広島",     lat: 34.397060, lng: 132.475790, timeToNext: 22 },
  { name: "新岩国",   lat: 34.164574, lng: 132.149513, timeToNext: 13 },
  { name: "徳山",     lat: 34.053450, lng: 131.805900, timeToNext: 17 },
  { name: "新山口",   lat: 34.093769, lng: 131.396365, timeToNext: 18 },
  { name: "厚狭",     lat: 34.060640, lng: 131.161360, timeToNext: 14 },
  { name: "新下関",   lat: 34.005687, lng: 130.948118, timeToNext: 16 },
  { name: "小倉",     lat: 33.882500, lng: 130.874300, timeToNext: 15 },
  { name: "博多",     lat: 33.590560, lng: 130.420590, timeToNext: 0 },
];

// 九州新幹線: 博多〜鹿児島中央
export const kyushuShinkansen: Station[] = [
  { name: "博多",     lat: 33.590560, lng: 130.420590, timeToNext: 15 },
  { name: "新鳥栖",   lat: 33.369250, lng: 130.511000, timeToNext: 14 },
  { name: "久留米",   lat: 33.315460, lng: 130.508680, timeToNext: 10 },
  { name: "筑後船小屋", lat: 33.178155, lng: 130.492436, timeToNext: 12 },
  { name: "新大牟田",  lat: 33.071199, lng: 130.488760, timeToNext: 14 },
  { name: "新玉名",   lat: 32.942387, lng: 130.573776, timeToNext: 16 },
  { name: "熊本",     lat: 32.790317, lng: 130.688974, timeToNext: 20 },
  { name: "新八代",   lat: 32.501100, lng: 130.618870, timeToNext: 24 },
  { name: "新水俣",   lat: 32.210578, lng: 130.428667, timeToNext: 16 },
  { name: "出水",     lat: 32.089060, lng: 130.356950, timeToNext: 18 },
  { name: "川内",     lat: 31.827620, lng: 130.300100, timeToNext: 21 },
  { name: "鹿児島中央", lat: 31.590690, lng: 130.543250, timeToNext: 0 },
];

// 北陸新幹線: 東京〜敦賀
export const hokurikuShinkansen: Station[] = [
  { name: "東京",     lat: 35.681382, lng: 139.766084, timeToNext: 25 },
  { name: "上野",     lat: 35.713768, lng: 139.777254, timeToNext: 15 },
  { name: "大宮",     lat: 35.906642, lng: 139.623960, timeToNext: 50 },
  { name: "熊谷",     lat: 36.147150, lng: 139.388760, timeToNext: 11 },
  { name: "本庄早稲田", lat: 36.198750, lng: 139.175010, timeToNext: 14 },
  { name: "高崎",     lat: 36.322930, lng: 139.013300, timeToNext: 30 },
  { name: "安中榛名",  lat: 36.362579, lng: 138.849396, timeToNext: 20 },
  { name: "軽井沢",   lat: 36.344840, lng: 138.631290, timeToNext: 15 },
  { name: "佐久平",   lat: 36.257160, lng: 138.444640, timeToNext: 18 },
  { name: "上田",     lat: 36.406680, lng: 138.249740, timeToNext: 18 },
  { name: "長野",     lat: 36.644770, lng: 138.188530, timeToNext: 23 },
  { name: "飯山",     lat: 36.845880, lng: 138.365480, timeToNext: 24 },
  { name: "上越妙高",  lat: 37.081376, lng: 138.248016, timeToNext: 20 },
  { name: "糸魚川",   lat: 37.043306, lng: 137.861753, timeToNext: 25 },
  { name: "黒部宇奈月温泉", lat: 36.870390, lng: 137.489040, timeToNext: 18 },
  { name: "富山",     lat: 36.705670, lng: 137.213160, timeToNext: 18 },
  { name: "新高岡",   lat: 36.726967, lng: 137.011990, timeToNext: 12 },
  { name: "金沢",     lat: 36.578530, lng: 136.648450, timeToNext: 35 },
  { name: "小松",     lat: 36.418670, lng: 136.445840, timeToNext: 12 },
  { name: "加賀温泉",  lat: 36.320388, lng: 136.350500, timeToNext: 13 },
  { name: "芦原温泉",  lat: 36.214602, lng: 136.235057, timeToNext: 10 },
  { name: "福井",     lat: 36.060430, lng: 136.219160, timeToNext: 12 },
  { name: "越前たけふ", lat: 35.895514, lng: 136.198905, timeToNext: 20 },
  { name: "敦賀",     lat: 35.645850, lng: 136.073830, timeToNext: 0 },
];

// 上越新幹線: 大宮〜新潟
export const joetsuShinkansen: Station[] = [
  { name: "大宮",     lat: 35.906642, lng: 139.623960, timeToNext: 30 },
  { name: "熊谷",     lat: 36.147150, lng: 139.388760, timeToNext: 11 },
  { name: "本庄早稲田", lat: 36.198750, lng: 139.175010, timeToNext: 14 },
  { name: "高崎",     lat: 36.322930, lng: 139.013300, timeToNext: 25 },
  { name: "上毛高原",  lat: 36.693165, lng: 138.977597, timeToNext: 20 },
  { name: "越後湯沢",  lat: 36.930900, lng: 138.818950, timeToNext: 35 },
  { name: "浦佐",     lat: 37.167224, lng: 138.922841, timeToNext: 14 },
  { name: "長岡",     lat: 37.447880, lng: 138.851560, timeToNext: 18 },
  { name: "燕三条",   lat: 37.668970, lng: 138.879990, timeToNext: 14 },
  { name: "新潟",     lat: 37.913270, lng: 139.061840, timeToNext: 0 },
];
