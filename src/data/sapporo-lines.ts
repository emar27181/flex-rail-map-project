import type { Station } from './yamanote';

// 札幌市営地下鉄 南北線: 麻生〜真駒内
export const sapporoNambokuLine: Station[] = [
  { name: "麻生",     lat: 43.104490, lng: 141.340570, timeToNext: 2 },
  { name: "北34条",   lat: 43.096730, lng: 141.340810, timeToNext: 2 },
  { name: "北24条",   lat: 43.087100, lng: 141.340920, timeToNext: 2 },
  { name: "北18条",   lat: 43.079790, lng: 141.340980, timeToNext: 2 },
  { name: "北12条",   lat: 43.072370, lng: 141.340510, timeToNext: 2 },
  { name: "さっぽろ",  lat: 43.068590, lng: 141.350800, timeToNext: 2 },
  { name: "大通",     lat: 43.061580, lng: 141.351040, timeToNext: 2 },
  { name: "すすきの",  lat: 43.055520, lng: 141.354430, timeToNext: 2 },
  { name: "中島公園",  lat: 43.046740, lng: 141.355120, timeToNext: 2 },
  { name: "幌平橋",   lat: 43.038920, lng: 141.355720, timeToNext: 2 },
  { name: "中の島",   lat: 43.028790, lng: 141.355200, timeToNext: 2 },
  { name: "平岸",     lat: 43.020160, lng: 141.355930, timeToNext: 2 },
  { name: "南平岸",   lat: 43.012420, lng: 141.358250, timeToNext: 2 },
  { name: "澄川",     lat: 43.003570, lng: 141.355120, timeToNext: 2 },
  { name: "自衛隊前",  lat: 42.994800, lng: 141.349240, timeToNext: 2 },
  { name: "真駒内",   lat: 42.987190, lng: 141.338820, timeToNext: 0 },
];

// 札幌市営地下鉄 東西線: 宮の沢〜新さっぽろ
export const sapporoTozaiLine: Station[] = [
  { name: "宮の沢",   lat: 43.064040, lng: 141.253270, timeToNext: 2 },
  { name: "発寒南",   lat: 43.068620, lng: 141.272550, timeToNext: 2 },
  { name: "琴似",     lat: 43.071980, lng: 141.301470, timeToNext: 2 },
  { name: "二十四軒",  lat: 43.073270, lng: 141.320250, timeToNext: 2 },
  { name: "西28丁目",  lat: 43.068710, lng: 141.328760, timeToNext: 2 },
  { name: "円山公園",  lat: 43.062900, lng: 141.327060, timeToNext: 2 },
  { name: "西18丁目",  lat: 43.062950, lng: 141.337990, timeToNext: 2 },
  { name: "西11丁目",  lat: 43.062070, lng: 141.344970, timeToNext: 2 },
  { name: "大通",     lat: 43.061580, lng: 141.351040, timeToNext: 2 },
  { name: "バスセンター前", lat: 43.061760, lng: 141.357550, timeToNext: 2 },
  { name: "菊水",     lat: 43.060100, lng: 141.374050, timeToNext: 2 },
  { name: "東札幌",   lat: 43.058160, lng: 141.386200, timeToNext: 2 },
  { name: "白石",     lat: 43.058960, lng: 141.397540, timeToNext: 2 },
  { name: "南郷7丁目", lat: 43.055050, lng: 141.411880, timeToNext: 2 },
  { name: "南郷13丁目", lat: 43.053830, lng: 141.425440, timeToNext: 2 },
  { name: "南郷18丁目", lat: 43.051650, lng: 141.435660, timeToNext: 2 },
  { name: "大谷地",   lat: 43.046910, lng: 141.445560, timeToNext: 2 },
  { name: "ひばりが丘", lat: 43.040960, lng: 141.455300, timeToNext: 2 },
  { name: "新さっぽろ", lat: 43.035010, lng: 141.468830, timeToNext: 0 },
];

// 札幌市営地下鉄 東豊線: 栄町〜福住
export const sapporoTohoLine: Station[] = [
  { name: "栄町",     lat: 43.096240, lng: 141.374330, timeToNext: 2 },
  { name: "新道東",   lat: 43.087610, lng: 141.374530, timeToNext: 2 },
  { name: "元町",     lat: 43.079530, lng: 141.373750, timeToNext: 2 },
  { name: "環状通東",  lat: 43.070680, lng: 141.373680, timeToNext: 2 },
  { name: "東区役所前", lat: 43.073920, lng: 141.363290, timeToNext: 2 },
  { name: "北13条東",  lat: 43.073790, lng: 141.355850, timeToNext: 2 },
  { name: "さっぽろ",  lat: 43.068590, lng: 141.350800, timeToNext: 2 },
  { name: "大通",     lat: 43.061580, lng: 141.351040, timeToNext: 2 },
  { name: "豊水すすきの", lat: 43.054990, lng: 141.352680, timeToNext: 2 },
  { name: "学園前",   lat: 43.046710, lng: 141.356200, timeToNext: 2 },
  { name: "豊平公園",  lat: 43.038020, lng: 141.365610, timeToNext: 2 },
  { name: "美園",     lat: 43.030040, lng: 141.376660, timeToNext: 2 },
  { name: "月寒中央",  lat: 43.022200, lng: 141.379050, timeToNext: 2 },
  { name: "福住",     lat: 43.015110, lng: 141.373900, timeToNext: 0 },
];

// JR函館本線（札幌〜旭川）
export const jrHakodateMainLine: Station[] = [
  { name: "札幌",     lat: 43.068620, lng: 141.350577, timeToNext: 5 },
  { name: "桑園",     lat: 43.070736, lng: 141.331986, timeToNext: 3 },
  { name: "琴似",     lat: 43.081535, lng: 141.307433, timeToNext: 4 },
  { name: "発寒中央",  lat: 43.089477, lng: 141.294237, timeToNext: 3 },
  { name: "発寒",     lat: 43.099802, lng: 141.277292, timeToNext: 4 },
  { name: "稲積公園",  lat: 43.112257, lng: 141.256798, timeToNext: 4 },
  { name: "手稲",     lat: 43.120263, lng: 141.243613, timeToNext: 5 },
  { name: "星置",     lat: 43.132339, lng: 141.210970, timeToNext: 4 },
  { name: "ほしみ",   lat: 43.133523, lng: 141.192141, timeToNext: 20 },
  { name: "小樽",     lat: 43.197576, lng: 140.993375, timeToNext: 12 },
  { name: "南小樽",   lat: 43.186858, lng: 141.007326, timeToNext: 7 },
  { name: "小樽築港",  lat: 43.180814, lng: 141.027758, timeToNext: 15 },
  { name: "余市",     lat: 43.186905, lng: 140.794788, timeToNext: 25 },
  { name: "仁木",     lat: 43.153282, lng: 140.769792, timeToNext: 15 },
  { name: "然別",     lat: 43.125619, lng: 140.737036, timeToNext: 20 },
  { name: "岩見沢",   lat: 43.204215, lng: 141.759511, timeToNext: 25 },
  { name: "美唄",     lat: 43.331055, lng: 141.862084, timeToNext: 15 },
  { name: "砂川",     lat: 43.492895, lng: 141.909304, timeToNext: 12 },
  { name: "滝川",     lat: 43.555265, lng: 141.900778, timeToNext: 18 },
  { name: "深川",     lat: 43.721312, lng: 142.041595, timeToNext: 15 },
  { name: "旭川",     lat: 43.762750, lng: 142.357926, timeToNext: 0 },
];

// JR千歳線（新千歳空港〜札幌）
export const jrChitoseLine: Station[] = [
  { name: "新千歳空港", lat: 42.774780, lng: 141.693490, timeToNext: 5 },
  { name: "南千歳",   lat: 42.801180, lng: 141.658550, timeToNext: 5 },
  { name: "千歳",     lat: 42.825640, lng: 141.652370, timeToNext: 7 },
  { name: "恵庭",     lat: 42.876000, lng: 141.577070, timeToNext: 6 },
  { name: "恵み野",   lat: 42.895120, lng: 141.554200, timeToNext: 5 },
  { name: "島松",     lat: 42.948620, lng: 141.538820, timeToNext: 7 },
  { name: "北広島",   lat: 42.986820, lng: 141.562450, timeToNext: 8 },
  { name: "上野幌",   lat: 43.019190, lng: 141.511210, timeToNext: 5 },
  { name: "新札幌",   lat: 43.033130, lng: 141.469760, timeToNext: 6 },
  { name: "平和",     lat: 43.048420, lng: 141.427930, timeToNext: 4 },
  { name: "白石",     lat: 43.060020, lng: 141.401900, timeToNext: 5 },
  { name: "苗穂",     lat: 43.063380, lng: 141.382040, timeToNext: 3 },
  { name: "札幌",     lat: 43.068620, lng: 141.350577, timeToNext: 0 },
];
