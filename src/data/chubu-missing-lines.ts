import type { Station } from './yamanote';

// 樽見鉄道: 大垣〜樽見
export const tarumiRailway: Station[] = [
  { name: "大垣",       lat: 35.368100, lng: 136.616200, timeToNext: 4 },
  { name: "東大垣",     lat: 35.386200, lng: 136.620100, timeToNext: 4 },
  { name: "横屋",       lat: 35.400100, lng: 136.618200, timeToNext: 4 },
  { name: "十九条",     lat: 35.418200, lng: 136.613100, timeToNext: 4 },
  { name: "美江寺",     lat: 35.432100, lng: 136.616200, timeToNext: 4 },
  { name: "南真桑",     lat: 35.449200, lng: 136.619100, timeToNext: 4 },
  { name: "北方真桑",   lat: 35.462100, lng: 136.614200, timeToNext: 4 },
  { name: "モレラ岐阜", lat: 35.472200, lng: 136.608100, timeToNext: 4 },
  { name: "糸貫",       lat: 35.487100, lng: 136.601200, timeToNext: 4 },
  { name: "本巣",       lat: 35.504200, lng: 136.594100, timeToNext: 5 },
  { name: "日当",       lat: 35.524100, lng: 136.591200, timeToNext: 5 },
  { name: "高科",       lat: 35.540200, lng: 136.588100, timeToNext: 4 },
  { name: "織部",       lat: 35.554100, lng: 136.585200, timeToNext: 4 },
  { name: "木知原",     lat: 35.569200, lng: 136.582100, timeToNext: 5 },
  { name: "谷汲口",     lat: 35.587100, lng: 136.580200, timeToNext: 5 },
  { name: "神海",       lat: 35.606200, lng: 136.581100, timeToNext: 5 },
  { name: "高尾",       lat: 35.628100, lng: 136.584200, timeToNext: 5 },
  { name: "水鳥",       lat: 35.644200, lng: 136.588100, timeToNext: 5 },
  { name: "樽見",       lat: 35.661100, lng: 136.591200, timeToNext: 0 },
];

// 長良川鉄道: 美濃太田〜北濃
export const nagaraRailway: Station[] = [
  { name: "美濃太田",       lat: 35.494200, lng: 137.009100, timeToNext: 4 },
  { name: "前平公園",       lat: 35.493100, lng: 136.997200, timeToNext: 4 },
  { name: "岐阜城北口",     lat: 35.492200, lng: 136.984100, timeToNext: 4 },
  { name: "加茂野",         lat: 35.493100, lng: 136.972200, timeToNext: 4 },
  { name: "富加",           lat: 35.496200, lng: 136.957100, timeToNext: 4 },
  { name: "関富岡",         lat: 35.499100, lng: 136.942200, timeToNext: 4 },
  { name: "関",             lat: 35.500200, lng: 136.918100, timeToNext: 5 },
  { name: "関口",           lat: 35.508100, lng: 136.908200, timeToNext: 4 },
  { name: "日野岩",         lat: 35.518200, lng: 136.898100, timeToNext: 4 },
  { name: "松森",           lat: 35.531100, lng: 136.891200, timeToNext: 4 },
  { name: "美濃市",         lat: 35.547200, lng: 136.882100, timeToNext: 5 },
  { name: "梅山",           lat: 35.562100, lng: 136.878200, timeToNext: 5 },
  { name: "湯の洞温泉口",   lat: 35.582200, lng: 136.884100, timeToNext: 5 },
  { name: "洲原",           lat: 35.604100, lng: 136.895200, timeToNext: 6 },
  { name: "白山長滝",       lat: 35.631200, lng: 136.915100, timeToNext: 6 },
  { name: "自然園前",       lat: 35.660100, lng: 136.935200, timeToNext: 6 },
  { name: "美濃白鳥",       lat: 35.699200, lng: 136.957100, timeToNext: 7 },
  { name: "郡上八幡",       lat: 35.741100, lng: 136.951200, timeToNext: 8 },
  { name: "山田",           lat: 35.779200, lng: 136.942100, timeToNext: 7 },
  { name: "北濃",           lat: 35.818100, lng: 136.930200, timeToNext: 0 },
];

// 明知鉄道: 恵那〜明智
export const meichiRailway: Station[] = [
  { name: "恵那",   lat: 35.449100, lng: 137.414200, timeToNext: 5 },
  { name: "東野",   lat: 35.445200, lng: 137.428100, timeToNext: 5 },
  { name: "飯沼",   lat: 35.440100, lng: 137.445200, timeToNext: 5 },
  { name: "阿木",   lat: 35.435200, lng: 137.458100, timeToNext: 5 },
  { name: "飯羽間", lat: 35.432100, lng: 137.472200, timeToNext: 5 },
  { name: "中野方", lat: 35.428200, lng: 137.484100, timeToNext: 5 },
  { name: "極楽",   lat: 35.423100, lng: 137.498200, timeToNext: 5 },
  { name: "山岡",   lat: 35.421200, lng: 137.509100, timeToNext: 5 },
  { name: "野志",   lat: 35.422100, lng: 137.519200, timeToNext: 5 },
  { name: "明智",   lat: 35.424200, lng: 137.537100, timeToNext: 0 },
];

// 伊勢鉄道（伊勢線）: 河原田〜津
export const iseTetsudo: Station[] = [
  { name: "河原田",         lat: 34.962100, lng: 136.600200, timeToNext: 6 },
  { name: "玉垣",           lat: 34.905200, lng: 136.577100, timeToNext: 5 },
  { name: "鈴鹿サーキット稲生", lat: 34.883100, lng: 136.574200, timeToNext: 4 },
  { name: "鈴鹿",           lat: 34.879200, lng: 136.576100, timeToNext: 5 },
  { name: "徳田",           lat: 34.851100, lng: 136.562200, timeToNext: 5 },
  { name: "中瀬古",         lat: 34.826200, lng: 136.548100, timeToNext: 5 },
  { name: "東一身田",       lat: 34.803100, lng: 136.532200, timeToNext: 6 },
  { name: "津",             lat: 34.730200, lng: 136.506100, timeToNext: 0 },
];
