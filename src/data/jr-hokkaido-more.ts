import type { Station } from './yamanote';

// JR石勝線: 南千歳〜新得
export const jrSekishoLine: Station[] = [
  { name: "南千歳",    lat: 42.808531, lng: 141.674951, timeToNext: 5 },
  { name: "追分",      lat: 42.873766, lng: 141.810557, timeToNext: 10 },
  { name: "川端",      lat: 42.914826, lng: 141.895563, timeToNext: 10 },
  { name: "滝ノ上",    lat: 42.763960, lng: 142.260550, timeToNext: 10 },
  { name: "新夕張",    lat: 42.936699, lng: 142.036478, timeToNext: 10 },
  { name: "占冠",      lat: 42.992682, lng: 142.399868, timeToNext: 15 },
  { name: "トマム",    lat: 43.056021, lng: 142.611316, timeToNext: 12 },
  { name: "新得",      lat: 43.081993, lng: 142.832539, timeToNext: 0 },
];

// JR根室本線（滝川〜富良野〜新得）
export const jrNemuroMainLineWest: Station[] = [
  { name: "滝川",      lat: 43.557290, lng: 141.916490, timeToNext: 8 },
  { name: "東滝川",    lat: 43.534000, lng: 141.973360, timeToNext: 8 },
  { name: "赤平",      lat: 43.555008, lng: 142.048377, timeToNext: 8 },
  { name: "茂尻",      lat: 43.549310, lng: 142.072490, timeToNext: 8 },
  { name: "平岸",      lat: 43.541331, lng: 142.124088, timeToNext: 8 },
  { name: "芦別",      lat: 43.516532, lng: 142.184406, timeToNext: 10 },
  { name: "野花南",    lat: 43.464420, lng: 142.278810, timeToNext: 10 },
  { name: "島ノ下",    lat: 43.418340, lng: 142.307500, timeToNext: 8 },
  { name: "富良野",    lat: 43.341620, lng: 142.379130, timeToNext: 8 },
  { name: "布部",      lat: 43.290370, lng: 142.408220, timeToNext: 8 },
  { name: "山部",      lat: 43.269320, lng: 142.493280, timeToNext: 8 },
  { name: "下金山",    lat: 43.262190, lng: 142.545490, timeToNext: 8 },
  { name: "金山",      lat: 43.271220, lng: 142.606020, timeToNext: 8 },
  { name: "東鹿越",    lat: 43.307850, lng: 142.673240, timeToNext: 8 },
  { name: "落合",      lat: 43.316960, lng: 142.793850, timeToNext: 8 },
  { name: "新得",      lat: 43.081993, lng: 142.832539, timeToNext: 0 },
];

// JR宗谷本線（旭川〜名寄）
export const jrSoyaMainLineNorth: Station[] = [
  { name: "旭川",      lat: 43.770570, lng: 142.365090, timeToNext: 5 },
  { name: "旭川四条",   lat: 43.763924, lng: 142.375835, timeToNext: 5 },
  { name: "新旭川",    lat: 43.780067, lng: 142.384795, timeToNext: 5 },
  { name: "永山",      lat: 43.814199, lng: 142.434411, timeToNext: 5 },
  { name: "北永山",    lat: 43.826704, lng: 142.454441, timeToNext: 5 },
  { name: "南比布",    lat: 43.896190, lng: 142.413860, timeToNext: 5 },
  { name: "比布",      lat: 43.874882, lng: 142.471427, timeToNext: 8 },
  { name: "北比布",    lat: 43.953770, lng: 142.459570, timeToNext: 8 },
  { name: "蘭留",      lat: 43.925117, lng: 142.473418, timeToNext: 8 },
  { name: "塩狩",      lat: 43.968089, lng: 142.454871, timeToNext: 8 },
  { name: "和寒",      lat: 44.026602, lng: 142.415774, timeToNext: 8 },
  { name: "東六線",    lat: 44.091810, lng: 142.427200, timeToNext: 8 },
  { name: "剣淵",      lat: 44.096108, lng: 142.364500, timeToNext: 8 },
  { name: "北剣淵",    lat: 44.134520, lng: 142.428960, timeToNext: 8 },
  { name: "士別",      lat: 44.171963, lng: 142.387856, timeToNext: 8 },
  { name: "多寄",      lat: 44.240525, lng: 142.396382, timeToNext: 8 },
  { name: "瑞穂",      lat: 44.263870, lng: 142.414520, timeToNext: 8 },
  { name: "風連",      lat: 44.292176, lng: 142.421441, timeToNext: 8 },
  { name: "名寄",      lat: 44.357010, lng: 142.469090, timeToNext: 0 },
];

// JR釧網本線: 東釧路〜網走
export const jrSenmouMainLine: Station[] = [
  { name: "東釧路",    lat: 42.987490, lng: 144.418260, timeToNext: 5 },
  { name: "釧路湿原",   lat: 43.100771, lng: 144.447765, timeToNext: 8 },
  { name: "細岡",      lat: 43.105054, lng: 144.469555, timeToNext: 8 },
  { name: "塘路",      lat: 43.151793, lng: 144.497215, timeToNext: 10 },
  { name: "茅沼",      lat: 43.202129, lng: 144.503784, timeToNext: 10 },
  { name: "標茶",      lat: 43.304280, lng: 144.607500, timeToNext: 10 },
  { name: "磯分内",    lat: 43.379376, lng: 144.554225, timeToNext: 10 },
  { name: "摩周",      lat: 43.487334, lng: 144.463841, timeToNext: 12 },
  { name: "美留和",    lat: 43.555372, lng: 144.437616, timeToNext: 10 },
  { name: "川湯温泉",   lat: 43.606380, lng: 144.451850, timeToNext: 10 },
  { name: "緑",        lat: 43.718339, lng: 144.505503, timeToNext: 10 },
  { name: "美幌",      lat: 43.831830, lng: 144.106640, timeToNext: 10 },
  { name: "西女満別",   lat: 43.880113, lng: 144.148127, timeToNext: 8 },
  { name: "女満別",    lat: 43.916178, lng: 144.171300, timeToNext: 5 },
  { name: "網走",      lat: 44.019280, lng: 144.273990, timeToNext: 0 },
];
