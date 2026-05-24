import type { Station } from './yamanote';

// のと鉄道七尾線: 七尾〜穴水
export const notaRailway: Station[] = [
  { name: "七尾",       lat: 37.042820, lng: 136.965500, timeToNext: 5 },
  { name: "和倉温泉",   lat: 37.070460, lng: 136.993650, timeToNext: 8 },
  { name: "田鶴浜",     lat: 37.074530, lng: 137.015960, timeToNext: 5 },
  { name: "笠師保",     lat: 37.088650, lng: 137.025470, timeToNext: 5 },
  { name: "能登中島",   lat: 37.113460, lng: 137.047880, timeToNext: 8 },
  { name: "西岸",       lat: 37.143980, lng: 137.048770, timeToNext: 5 },
  { name: "能登鹿島",   lat: 37.163840, lng: 137.028330, timeToNext: 5 },
  { name: "穴水",       lat: 37.212760, lng: 136.909560, timeToNext: 0 },
];

// えちぜん鉄道三国芦原線: 福井口〜三国港
export const echizentetsudoMikuni: Station[] = [
  { name: "福井口",     lat: 36.069780, lng: 136.223860, timeToNext: 3 },
  { name: "新田塚",     lat: 36.083520, lng: 136.222030, timeToNext: 3 },
  { name: "中角",       lat: 36.098350, lng: 136.220870, timeToNext: 4 },
  { name: "鷲塚針原",   lat: 36.120460, lng: 136.220960, timeToNext: 4 },
  { name: "水居",       lat: 36.136850, lng: 136.225870, timeToNext: 3 },
  { name: "越前島橋",   lat: 36.151830, lng: 136.233650, timeToNext: 3 },
  { name: "観音町",     lat: 36.162590, lng: 136.247340, timeToNext: 3 },
  { name: "本荘",       lat: 36.169220, lng: 136.258130, timeToNext: 3 },
  { name: "西長田ゆりの里", lat: 36.183510, lng: 136.269470, timeToNext: 5 },
  { name: "大関",       lat: 36.198730, lng: 136.286410, timeToNext: 4 },
  { name: "下兵庫こうふく", lat: 36.209420, lng: 136.296050, timeToNext: 3 },
  { name: "番田",       lat: 36.220580, lng: 136.297460, timeToNext: 3 },
  { name: "あわら湯のまち", lat: 36.235930, lng: 136.237430, timeToNext: 5 },
  { name: "芦原温泉",   lat: 36.228720, lng: 136.235420, timeToNext: 4 },
  { name: "長畝",       lat: 36.220250, lng: 136.205700, timeToNext: 4 },
  { name: "上兵庫",     lat: 36.209350, lng: 136.191640, timeToNext: 3 },
  { name: "新保",       lat: 36.198440, lng: 136.185180, timeToNext: 4 },
  { name: "三国",       lat: 36.185830, lng: 136.164440, timeToNext: 4 },
  { name: "三国神社",   lat: 36.183490, lng: 136.148850, timeToNext: 3 },
  { name: "三国港",     lat: 36.181550, lng: 136.136920, timeToNext: 0 },
];

// 北陸鉄道浅野川線: 北鉄金沢〜内灘
export const hokutetsuAsanogawa: Station[] = [
  { name: "北鉄金沢",   lat: 36.576450, lng: 136.656180, timeToNext: 3 },
  { name: "七ツ屋",     lat: 36.590520, lng: 136.649580, timeToNext: 3 },
  { name: "上諸江",     lat: 36.603540, lng: 136.642080, timeToNext: 3 },
  { name: "磯部",       lat: 36.618150, lng: 136.633690, timeToNext: 3 },
  { name: "割出",       lat: 36.626780, lng: 136.621480, timeToNext: 4 },
  { name: "三ツ屋",     lat: 36.634290, lng: 136.614590, timeToNext: 4 },
  { name: "蚊爪",       lat: 36.648650, lng: 136.614310, timeToNext: 4 },
  { name: "粟ヶ崎",     lat: 36.661440, lng: 136.612340, timeToNext: 5 },
  { name: "内灘",       lat: 36.682200, lng: 136.618790, timeToNext: 0 },
];

// JR越美北線（九頭竜線）: 越前花堂〜九頭竜湖
export const jrKuzuryuLine: Station[] = [
  { name: "越前花堂",   lat: 36.046930, lng: 136.211250, timeToNext: 5 },
  { name: "六条",       lat: 36.059670, lng: 136.202860, timeToNext: 4 },
  { name: "足羽",       lat: 36.051590, lng: 136.218880, timeToNext: 5 },
  { name: "越前東郷",   lat: 36.032710, lng: 136.252130, timeToNext: 8 },
  { name: "志比堺",     lat: 36.011530, lng: 136.279620, timeToNext: 5 },
  { name: "永平寺口",   lat: 36.003610, lng: 136.299390, timeToNext: 8 },
  { name: "下志比",     lat: 35.992760, lng: 136.319480, timeToNext: 5 },
  { name: "越前野中",   lat: 35.975140, lng: 136.342360, timeToNext: 5 },
  { name: "勝山",       lat: 35.987040, lng: 136.498380, timeToNext: 30 },
  { name: "越前大野",   lat: 35.980060, lng: 136.683050, timeToNext: 25 },
  { name: "九頭竜湖",   lat: 35.843180, lng: 136.820260, timeToNext: 0 },
];

// 天竜浜名湖鉄道: 掛川〜新所原
export const tenryuHamanako: Station[] = [
  { name: "掛川",           lat: 34.769440, lng: 138.015200, timeToNext: 5 },
  { name: "掛川市役所前",   lat: 34.773940, lng: 138.006280, timeToNext: 3 },
  { name: "西掛川",         lat: 34.777320, lng: 137.999960, timeToNext: 4 },
  { name: "桜木",           lat: 34.784750, lng: 137.988010, timeToNext: 4 },
  { name: "いこいの広場",   lat: 34.787880, lng: 137.980010, timeToNext: 3 },
  { name: "細谷",           lat: 34.795110, lng: 137.969890, timeToNext: 5 },
  { name: "原田",           lat: 34.811570, lng: 137.945420, timeToNext: 6 },
  { name: "遠江一宮",       lat: 34.831750, lng: 137.915260, timeToNext: 5 },
  { name: "岩水寺",         lat: 34.843820, lng: 137.896870, timeToNext: 5 },
  { name: "宮口",           lat: 34.855390, lng: 137.877640, timeToNext: 5 },
  { name: "フルーツパーク", lat: 34.869310, lng: 137.866300, timeToNext: 5 },
  { name: "都田川",         lat: 34.879860, lng: 137.854240, timeToNext: 4 },
  { name: "都田",           lat: 34.890140, lng: 137.833680, timeToNext: 5 },
  { name: "金指",           lat: 34.891580, lng: 137.817190, timeToNext: 5 },
  { name: "岡地",           lat: 34.897420, lng: 137.803670, timeToNext: 4 },
  { name: "気賀",           lat: 34.812740, lng: 137.681390, timeToNext: 8 },
  { name: "西気賀",         lat: 34.827230, lng: 137.678580, timeToNext: 4 },
  { name: "寸座",           lat: 34.844140, lng: 137.671320, timeToNext: 4 },
  { name: "浜名湖佐久米",   lat: 34.854960, lng: 137.662690, timeToNext: 4 },
  { name: "東都筑",         lat: 34.841930, lng: 137.620950, timeToNext: 5 },
  { name: "都筑",           lat: 34.829290, lng: 137.602180, timeToNext: 5 },
  { name: "三ヶ日",         lat: 34.793960, lng: 137.556550, timeToNext: 8 },
  { name: "奥浜名湖",       lat: 34.780240, lng: 137.530020, timeToNext: 5 },
  { name: "尾奈",           lat: 34.760570, lng: 137.504980, timeToNext: 6 },
  { name: "知波田",         lat: 34.735620, lng: 137.494470, timeToNext: 5 },
  { name: "大森",           lat: 34.720140, lng: 137.479370, timeToNext: 4 },
  { name: "アスモ前",       lat: 34.711880, lng: 137.469340, timeToNext: 3 },
  { name: "常葉大学前",     lat: 34.706200, lng: 137.459920, timeToNext: 4 },
  { name: "豊岡",           lat: 34.706970, lng: 137.447250, timeToNext: 5 },
  { name: "金野",           lat: 34.713630, lng: 137.437140, timeToNext: 4 },
  { name: "天竜二俣",       lat: 34.720140, lng: 137.831200, timeToNext: 5 },
  { name: "新所原",         lat: 34.692600, lng: 137.413970, timeToNext: 0 },
];
