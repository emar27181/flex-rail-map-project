import type { Station } from './yamanote';

// 神戸新交通ポートライナー: 三宮〜神戸空港
export const kobePortLiner: Station[] = [
  { name: "三宮",           lat: 34.694080, lng: 135.196560, timeToNext: 3 },
  { name: "貿易センター",   lat: 34.687430, lng: 135.196890, timeToNext: 2 },
  { name: "ポートターミナル", lat: 34.680500, lng: 135.201430, timeToNext: 3 },
  { name: "中公園",         lat: 34.677350, lng: 135.218570, timeToNext: 3 },
  { name: "みなとじま",     lat: 34.677180, lng: 135.232020, timeToNext: 2 },
  { name: "市民広場",       lat: 34.668990, lng: 135.232860, timeToNext: 2 },
  { name: "医療センター",   lat: 34.663380, lng: 135.230200, timeToNext: 3 },
  { name: "神戸空港",       lat: 34.633800, lng: 135.226060, timeToNext: 0 },
];

// 神戸新交通六甲ライナー: 住吉〜マリンパーク
export const kobeRokkouLiner: Station[] = [
  { name: "住吉",       lat: 34.721630, lng: 135.267820, timeToNext: 4 },
  { name: "魚崎",       lat: 34.716420, lng: 135.271100, timeToNext: 3 },
  { name: "南魚崎",     lat: 34.706990, lng: 135.270870, timeToNext: 3 },
  { name: "アイランド北口", lat: 34.700610, lng: 135.272040, timeToNext: 3 },
  { name: "六甲アイランド", lat: 34.692840, lng: 135.272640, timeToNext: 2 },
  { name: "マリンパーク", lat: 34.685790, lng: 135.272750, timeToNext: 0 },
];

// 広島高速交通アストラムライン: 本通〜広域公園前
export const hiroshimaAstramLine: Station[] = [
  { name: "本通",           lat: 34.396530, lng: 132.456660, timeToNext: 3 },
  { name: "県庁前",         lat: 34.399090, lng: 132.463490, timeToNext: 2 },
  { name: "城北",           lat: 34.406780, lng: 132.465820, timeToNext: 3 },
  { name: "新白島",         lat: 34.413530, lng: 132.462370, timeToNext: 3 },
  { name: "白島",           lat: 34.419320, lng: 132.456920, timeToNext: 3 },
  { name: "牛田",           lat: 34.419620, lng: 132.448220, timeToNext: 3 },
  { name: "不動院前",       lat: 34.426130, lng: 132.438960, timeToNext: 3 },
  { name: "祇園新橋北",     lat: 34.432790, lng: 132.428670, timeToNext: 3 },
  { name: "西原",           lat: 34.443200, lng: 132.422730, timeToNext: 3 },
  { name: "中筋",           lat: 34.455860, lng: 132.417380, timeToNext: 3 },
  { name: "古市",           lat: 34.473240, lng: 132.413760, timeToNext: 3 },
  { name: "大塚",           lat: 34.487680, lng: 132.432430, timeToNext: 4 },
  { name: "毘沙門台",       lat: 34.497240, lng: 132.444610, timeToNext: 3 },
  { name: "安東",           lat: 34.495380, lng: 132.466830, timeToNext: 3 },
  { name: "上安",           lat: 34.491830, lng: 132.483640, timeToNext: 3 },
  { name: "高取団地",       lat: 34.481290, lng: 132.495250, timeToNext: 3 },
  { name: "長楽寺",         lat: 34.464820, lng: 132.509820, timeToNext: 3 },
  { name: "伴",             lat: 34.455560, lng: 132.519730, timeToNext: 3 },
  { name: "伴中央",         lat: 34.444720, lng: 132.527560, timeToNext: 3 },
  { name: "大原",           lat: 34.438320, lng: 132.543920, timeToNext: 4 },
  { name: "広域公園前",     lat: 34.430470, lng: 132.557200, timeToNext: 0 },
];

// 大阪モノレール彩都線: 万博記念公園〜彩都西
export const osakaMonorailSaito: Station[] = [
  { name: "万博記念公園", lat: 34.806290, lng: 135.531380, timeToNext: 4 },
  { name: "公園東口",   lat: 34.802020, lng: 135.548290, timeToNext: 4 },
  { name: "阪大病院前", lat: 34.829710, lng: 135.525270, timeToNext: 5 },
  { name: "豊川",       lat: 34.842290, lng: 135.541500, timeToNext: 5 },
  { name: "彩都西",     lat: 34.862900, lng: 135.568080, timeToNext: 0 },
];

// 京阪中之島線: 天満橋〜中之島
export const keihanNakanoshima: Station[] = [
  { name: "天満橋",     lat: 34.688870, lng: 135.511940, timeToNext: 3 },
  { name: "なにわ橋",   lat: 34.691990, lng: 135.503050, timeToNext: 3 },
  { name: "大江橋",     lat: 34.693310, lng: 135.495810, timeToNext: 2 },
  { name: "渡辺橋",     lat: 34.693780, lng: 135.490050, timeToNext: 3 },
  { name: "中之島",     lat: 34.693660, lng: 135.483360, timeToNext: 0 },
];

// 能勢電鉄妙見線（多田〜山下〜妙見口）
export const noseDentetsuMyoken: Station[] = [
  { name: "川西能勢口", lat: 34.841060, lng: 135.407020, timeToNext: 3 },
  { name: "絹延橋",     lat: 34.854260, lng: 135.413490, timeToNext: 4 },
  { name: "滝山",       lat: 34.870690, lng: 135.421950, timeToNext: 4 },
  { name: "鶯の森",     lat: 34.887720, lng: 135.426540, timeToNext: 3 },
  { name: "ときわ台",   lat: 34.900880, lng: 135.430240, timeToNext: 3 },
  { name: "花屋敷",     lat: 34.910730, lng: 135.430470, timeToNext: 4 },
  { name: "多田",       lat: 34.925590, lng: 135.442550, timeToNext: 4 },
  { name: "平野",       lat: 34.929760, lng: 135.457690, timeToNext: 4 },
  { name: "一の鳥居",   lat: 34.942550, lng: 135.473610, timeToNext: 4 },
  { name: "畦野",       lat: 34.961520, lng: 135.487240, timeToNext: 4 },
  { name: "山下",       lat: 34.974380, lng: 135.495440, timeToNext: 5 },
  { name: "笹部",       lat: 34.981270, lng: 135.520150, timeToNext: 5 },
  { name: "光風台",     lat: 34.983420, lng: 135.535860, timeToNext: 4 },
  { name: "ときわ台（妙見線）", lat: 34.985640, lng: 135.546760, timeToNext: 5 },
  { name: "妙見口",     lat: 34.992780, lng: 135.556390, timeToNext: 0 },
];

// 神戸電鉄粟生線: 鈴蘭台〜粟生
export const kobeDentetsuAwoline: Station[] = [
  { name: "鈴蘭台",     lat: 34.735560, lng: 135.107400, timeToNext: 4 },
  { name: "西鈴蘭台",   lat: 34.734920, lng: 135.089670, timeToNext: 3 },
  { name: "藍那",       lat: 34.744320, lng: 135.068280, timeToNext: 5 },
  { name: "木津",       lat: 34.756830, lng: 135.040550, timeToNext: 5 },
  { name: "木幡",       lat: 34.763520, lng: 135.023050, timeToNext: 4 },
  { name: "志染",       lat: 34.779320, lng: 135.010440, timeToNext: 5 },
  { name: "恵比須",     lat: 34.809790, lng: 134.978820, timeToNext: 5 },
  { name: "緑が丘",     lat: 34.843480, lng: 134.959060, timeToNext: 4 },
  { name: "広野ゴルフ場前", lat: 34.859110, lng: 134.947540, timeToNext: 5 },
  { name: "小野",       lat: 34.916620, lng: 134.932530, timeToNext: 10 },
  { name: "葉多",       lat: 34.929220, lng: 134.966270, timeToNext: 6 },
  { name: "粟生",       lat: 34.915620, lng: 134.964960, timeToNext: 0 },
];
