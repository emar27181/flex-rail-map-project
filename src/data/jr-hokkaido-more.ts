import type { Station } from './yamanote';

// JR石勝線: 南千歳〜新得
export const jrSekishoLine: Station[] = [
  { name: "南千歳",    lat: 42.735530, lng: 141.695860, timeToNext: 5 },
  { name: "追分",      lat: 42.884570, lng: 141.847080, timeToNext: 10 },
  { name: "川端",      lat: 42.806990, lng: 142.153790, timeToNext: 10 },
  { name: "滝ノ上",    lat: 42.763960, lng: 142.260550, timeToNext: 10 },
  { name: "新夕張",    lat: 43.003540, lng: 142.159860, timeToNext: 10 },
  { name: "占冠",      lat: 43.116470, lng: 142.399240, timeToNext: 15 },
  { name: "トマム",    lat: 43.258780, lng: 142.626510, timeToNext: 12 },
  { name: "新得",      lat: 43.341690, lng: 142.843290, timeToNext: 0 },
];

// JR根室本線（滝川〜富良野〜新得）
export const jrNemuroMainLineWest: Station[] = [
  { name: "滝川",      lat: 43.557290, lng: 141.916490, timeToNext: 8 },
  { name: "東滝川",    lat: 43.534000, lng: 141.973360, timeToNext: 8 },
  { name: "赤平",      lat: 43.568150, lng: 142.025840, timeToNext: 8 },
  { name: "茂尻",      lat: 43.549310, lng: 142.072490, timeToNext: 8 },
  { name: "平岸",      lat: 43.541150, lng: 142.093730, timeToNext: 8 },
  { name: "芦別",      lat: 43.528900, lng: 142.216870, timeToNext: 10 },
  { name: "野花南",    lat: 43.464420, lng: 142.278810, timeToNext: 10 },
  { name: "島ノ下",    lat: 43.418340, lng: 142.307500, timeToNext: 8 },
  { name: "富良野",    lat: 43.341620, lng: 142.379130, timeToNext: 8 },
  { name: "布部",      lat: 43.290370, lng: 142.408220, timeToNext: 8 },
  { name: "山部",      lat: 43.269320, lng: 142.493280, timeToNext: 8 },
  { name: "下金山",    lat: 43.262190, lng: 142.545490, timeToNext: 8 },
  { name: "金山",      lat: 43.271220, lng: 142.606020, timeToNext: 8 },
  { name: "東鹿越",    lat: 43.307850, lng: 142.673240, timeToNext: 8 },
  { name: "落合",      lat: 43.316960, lng: 142.793850, timeToNext: 8 },
  { name: "新得",      lat: 43.341690, lng: 142.843290, timeToNext: 0 },
];

// JR宗谷本線（旭川〜名寄）
export const jrSoyaMainLineNorth: Station[] = [
  { name: "旭川",      lat: 43.770570, lng: 142.365090, timeToNext: 5 },
  { name: "旭川四条",   lat: 43.785850, lng: 142.358040, timeToNext: 5 },
  { name: "新旭川",    lat: 43.806300, lng: 142.361100, timeToNext: 5 },
  { name: "永山",      lat: 43.848060, lng: 142.378220, timeToNext: 5 },
  { name: "北永山",    lat: 43.866470, lng: 142.383590, timeToNext: 5 },
  { name: "南比布",    lat: 43.896190, lng: 142.413860, timeToNext: 5 },
  { name: "比布",      lat: 43.921380, lng: 142.435680, timeToNext: 8 },
  { name: "北比布",    lat: 43.953770, lng: 142.459570, timeToNext: 8 },
  { name: "蘭留",      lat: 43.986530, lng: 142.416770, timeToNext: 8 },
  { name: "塩狩",      lat: 44.030320, lng: 142.418800, timeToNext: 8 },
  { name: "和寒",      lat: 44.054370, lng: 142.421340, timeToNext: 8 },
  { name: "東六線",    lat: 44.091810, lng: 142.427200, timeToNext: 8 },
  { name: "剣淵",      lat: 44.112380, lng: 142.425600, timeToNext: 8 },
  { name: "北剣淵",    lat: 44.134520, lng: 142.428960, timeToNext: 8 },
  { name: "士別",      lat: 44.187980, lng: 142.413410, timeToNext: 8 },
  { name: "多寄",      lat: 44.236160, lng: 142.427840, timeToNext: 8 },
  { name: "瑞穂",      lat: 44.263870, lng: 142.414520, timeToNext: 8 },
  { name: "風連",      lat: 44.316060, lng: 142.447640, timeToNext: 8 },
  { name: "名寄",      lat: 44.357010, lng: 142.469090, timeToNext: 0 },
];

// JR釧網本線: 東釧路〜網走
export const jrSenmouMainLine: Station[] = [
  { name: "東釧路",    lat: 42.987490, lng: 144.418260, timeToNext: 5 },
  { name: "釧路湿原",   lat: 43.042590, lng: 144.413440, timeToNext: 8 },
  { name: "細岡",      lat: 43.071150, lng: 144.387680, timeToNext: 8 },
  { name: "塘路",      lat: 43.152680, lng: 144.345400, timeToNext: 10 },
  { name: "茅沼",      lat: 43.243350, lng: 144.345890, timeToNext: 10 },
  { name: "標茶",      lat: 43.304280, lng: 144.607500, timeToNext: 10 },
  { name: "磯分内",    lat: 43.375850, lng: 144.630060, timeToNext: 10 },
  { name: "摩周",      lat: 43.440700, lng: 144.507300, timeToNext: 12 },
  { name: "美留和",    lat: 43.529650, lng: 144.455600, timeToNext: 10 },
  { name: "川湯温泉",   lat: 43.606380, lng: 144.451850, timeToNext: 10 },
  { name: "緑",        lat: 43.700610, lng: 144.531020, timeToNext: 10 },
  { name: "美幌",      lat: 43.831830, lng: 144.106640, timeToNext: 10 },
  { name: "西女満別",   lat: 43.885110, lng: 144.078370, timeToNext: 8 },
  { name: "女満別",    lat: 43.908320, lng: 144.089300, timeToNext: 5 },
  { name: "網走",      lat: 44.019280, lng: 144.273990, timeToNext: 0 },
];
