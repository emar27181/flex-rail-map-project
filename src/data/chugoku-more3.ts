import type { Station } from './yamanote';

// 若桜鉄道若桜線: 郡家〜若桜
export const wakasaRailway: Station[] = [
  { name: "郡家",       lat: 35.445780, lng: 134.182540, timeToNext: 5 },
  { name: "八頭高校前", lat: 35.451640, lng: 134.197810, timeToNext: 4 },
  { name: "因幡船岡",   lat: 35.453240, lng: 134.217420, timeToNext: 5 },
  { name: "徳丸",       lat: 35.450080, lng: 134.237530, timeToNext: 5 },
  { name: "丹比",       lat: 35.448340, lng: 134.258760, timeToNext: 5 },
  { name: "安部",       lat: 35.453260, lng: 134.277380, timeToNext: 5 },
  { name: "八東",       lat: 35.462150, lng: 134.300270, timeToNext: 5 },
  { name: "フラワー長井線", lat: 35.465370, lng: 134.323680, timeToNext: 5 },
  { name: "隼",         lat: 35.464340, lng: 134.351680, timeToNext: 6 },
  { name: "坂野",       lat: 35.464820, lng: 134.373870, timeToNext: 5 },
  { name: "若桜",       lat: 35.472530, lng: 134.399930, timeToNext: 0 },
];

// 錦川鉄道錦川清流線: 川西〜錦町
export const nishikigawaRailway: Station[] = [
  { name: "川西",       lat: 34.171460, lng: 132.028740, timeToNext: 5 },
  { name: "清流新岩国", lat: 34.135890, lng: 132.014290, timeToNext: 8 },
  { name: "守内かさ神", lat: 34.113080, lng: 132.012780, timeToNext: 5 },
  { name: "南河内",     lat: 34.099280, lng: 132.020900, timeToNext: 5 },
  { name: "行波",       lat: 34.094760, lng: 132.028740, timeToNext: 6 },
  { name: "北河内",     lat: 34.087400, lng: 132.041590, timeToNext: 5 },
  { name: "椋野",       lat: 34.069230, lng: 132.048700, timeToNext: 6 },
  { name: "根笠",       lat: 34.053780, lng: 132.062840, timeToNext: 6 },
  { name: "河山",       lat: 34.041140, lng: 132.068850, timeToNext: 8 },
  { name: "柴野",       lat: 34.018590, lng: 132.076780, timeToNext: 8 },
  { name: "錦町",       lat: 34.001480, lng: 132.126680, timeToNext: 0 },
];

// JR岩徳線: 岩国〜徳山
export const jrGantokuLine: Station[] = [
  { name: "岩国",       lat: 34.162190, lng: 132.215690, timeToNext: 5 },
  { name: "西岩国",     lat: 34.164900, lng: 132.196050, timeToNext: 5 },
  { name: "柱野",       lat: 34.186660, lng: 132.180360, timeToNext: 5 },
  { name: "欽明路",     lat: 34.213900, lng: 132.165590, timeToNext: 5 },
  { name: "玖珂",       lat: 34.228490, lng: 132.169280, timeToNext: 5 },
  { name: "周防高森",   lat: 34.256140, lng: 132.178300, timeToNext: 5 },
  { name: "高照寺山",   lat: 34.279640, lng: 132.195860, timeToNext: 8 },
  { name: "通津",       lat: 34.072680, lng: 132.099310, timeToNext: 8 },
  { name: "由宇",       lat: 34.051060, lng: 132.122880, timeToNext: 8 },
  { name: "神代",       lat: 34.039220, lng: 132.157350, timeToNext: 5 },
  { name: "大畠",       lat: 33.966040, lng: 132.116670, timeToNext: 8 },
  { name: "周防花岡",   lat: 33.975780, lng: 131.882890, timeToNext: 15 },
  { name: "戸田",       lat: 33.994780, lng: 131.817580, timeToNext: 8 },
  { name: "櫛ヶ浜",     lat: 34.009560, lng: 131.828200, timeToNext: 5 },
  { name: "徳山",       lat: 34.047440, lng: 131.809280, timeToNext: 0 },
];

// 広島電鉄宮島線: 広電西広島〜広電宮島口
export const hiroshimadentetsuMiyajima: Station[] = [
  { name: "広電西広島", lat: 34.388300, lng: 132.431550, timeToNext: 3 },
  { name: "商工センター入口", lat: 34.385520, lng: 132.414700, timeToNext: 3 },
  { name: "広電五日市", lat: 34.373220, lng: 132.395080, timeToNext: 4 },
  { name: "佐伯区役所前", lat: 34.363840, lng: 132.384010, timeToNext: 3 },
  { name: "楽々園",     lat: 34.354190, lng: 132.372530, timeToNext: 4 },
  { name: "廿日市市役所前", lat: 34.348870, lng: 132.347850, timeToNext: 4 },
  { name: "廿日市",     lat: 34.348280, lng: 132.333000, timeToNext: 3 },
  { name: "宮内串戸",   lat: 34.347920, lng: 132.318200, timeToNext: 5 },
  { name: "阿品東",     lat: 34.344450, lng: 132.296400, timeToNext: 4 },
  { name: "広電阿品",   lat: 34.342700, lng: 132.285140, timeToNext: 4 },
  { name: "広電廿日市", lat: 34.339490, lng: 132.271510, timeToNext: 4 },
  { name: "地御前",     lat: 34.328420, lng: 132.251160, timeToNext: 5 },
  { name: "前空",       lat: 34.318290, lng: 132.235100, timeToNext: 8 },
  { name: "広電宮島口", lat: 34.295200, lng: 132.298600, timeToNext: 0 },
];
