import type { Station } from './yamanote';

// 高松琴平電気鉄道（琴電）琴平線: 高松築港〜琴電琴平
export const kotohiraLine: Station[] = [
  { name: "高松築港",   lat: 34.350500, lng: 134.045440, timeToNext: 3 },
  { name: "片原町",    lat: 34.347090, lng: 134.048960, timeToNext: 3 },
  { name: "瓦町",      lat: 34.344540, lng: 134.052870, timeToNext: 3 },
  { name: "栗林公園北口", lat: 34.339090, lng: 134.056350, timeToNext: 3 },
  { name: "栗林",      lat: 34.332500, lng: 134.059160, timeToNext: 3 },
  { name: "三条",      lat: 34.325400, lng: 134.062320, timeToNext: 3 },
  { name: "太田",      lat: 34.317220, lng: 134.067110, timeToNext: 3 },
  { name: "仏生山",    lat: 34.308540, lng: 134.068730, timeToNext: 3 },
  { name: "空港通り",   lat: 34.284290, lng: 134.047640, timeToNext: 3 },
  { name: "一宮",      lat: 34.274920, lng: 134.036460, timeToNext: 3 },
  { name: "円座",      lat: 34.260050, lng: 134.020740, timeToNext: 3 },
  { name: "岡本",      lat: 34.247800, lng: 134.012440, timeToNext: 4 },
  { name: "挿頭丘",    lat: 34.228310, lng: 133.994750, timeToNext: 4 },
  { name: "畑田",      lat: 34.214890, lng: 133.962110, timeToNext: 4 },
  { name: "陶",        lat: 34.200000, lng: 133.940160, timeToNext: 4 },
  { name: "綾川",      lat: 34.213130, lng: 133.918430, timeToNext: 4 },
  { name: "羽床",      lat: 34.208260, lng: 133.887770, timeToNext: 5 },
  { name: "羽床上",    lat: 34.213340, lng: 133.866700, timeToNext: 4 },
  { name: "川島",      lat: 34.200270, lng: 133.837560, timeToNext: 5 },
  { name: "国分寺",    lat: 34.188010, lng: 133.820600, timeToNext: 5 },
  { name: "水田",      lat: 34.183400, lng: 133.799510, timeToNext: 5 },
  { name: "岡田",      lat: 34.193570, lng: 133.780950, timeToNext: 5 },
  { name: "金蔵寺",    lat: 34.200210, lng: 133.759680, timeToNext: 5 },
  { name: "琴電琴平",   lat: 34.183450, lng: 133.724790, timeToNext: 0 },
];

// JR牟岐線: 徳島〜海部
export const jrMugiLine: Station[] = [
  { name: "徳島",      lat: 34.074840, lng: 134.557690, timeToNext: 5 },
  { name: "阿波富田",   lat: 34.062740, lng: 134.552380, timeToNext: 4 },
  { name: "二軒屋",    lat: 34.051080, lng: 134.545740, timeToNext: 4 },
  { name: "文化の森",   lat: 34.036440, lng: 134.551410, timeToNext: 4 },
  { name: "地蔵橋",    lat: 34.023870, lng: 134.559280, timeToNext: 4 },
  { name: "南小松島",   lat: 34.000660, lng: 134.578610, timeToNext: 4 },
  { name: "中田",      lat: 33.985400, lng: 134.579070, timeToNext: 4 },
  { name: "阿南",      lat: 33.921850, lng: 134.658540, timeToNext: 8 },
  { name: "見能林",    lat: 33.888060, lng: 134.671510, timeToNext: 5 },
  { name: "阿波中島",   lat: 33.876260, lng: 134.673490, timeToNext: 5 },
  { name: "西原",      lat: 33.848160, lng: 134.649070, timeToNext: 5 },
  { name: "羽ノ浦",    lat: 33.855510, lng: 134.616780, timeToNext: 5 },
  { name: "阿波桑野",   lat: 33.826200, lng: 134.601010, timeToNext: 5 },
  { name: "阿波福井",   lat: 33.804750, lng: 134.562520, timeToNext: 8 },
  { name: "由岐",      lat: 33.795020, lng: 134.517540, timeToNext: 8 },
  { name: "木岐",      lat: 33.752710, lng: 134.486670, timeToNext: 8 },
  { name: "日和佐",    lat: 33.721640, lng: 134.537600, timeToNext: 10 },
  { name: "山河内",    lat: 33.621680, lng: 134.498450, timeToNext: 10 },
  { name: "辺川",      lat: 33.591440, lng: 134.508310, timeToNext: 10 },
  { name: "牟岐",      lat: 33.664480, lng: 134.418860, timeToNext: 10 },
  { name: "鯖瀬",      lat: 33.593190, lng: 134.369970, timeToNext: 10 },
  { name: "浅川",      lat: 33.577200, lng: 134.371150, timeToNext: 8 },
  { name: "阿波海南",   lat: 33.556140, lng: 134.343090, timeToNext: 8 },
  { name: "海部",      lat: 33.560230, lng: 134.338140, timeToNext: 0 },
];

// 土佐くろしお鉄道阿佐線: 海部〜甲浦
export const tosaCuroshioAsaLine: Station[] = [
  { name: "海部",      lat: 33.560230, lng: 134.338140, timeToNext: 5 },
  { name: "宍喰",      lat: 33.535320, lng: 134.303420, timeToNext: 5 },
  { name: "甲浦",      lat: 33.505580, lng: 134.285200, timeToNext: 0 },
];

// 土佐くろしお鉄道ごめん・なはり線: 後免〜奈半利
export const tosaCuroshioNahariLine: Station[] = [
  { name: "後免",      lat: 33.554620, lng: 133.598700, timeToNext: 5 },
  { name: "後免西",    lat: 33.559120, lng: 133.582310, timeToNext: 4 },
  { name: "後免中",    lat: 33.567180, lng: 133.568280, timeToNext: 4 },
  { name: "後免東",    lat: 33.572290, lng: 133.553910, timeToNext: 4 },
  { name: "のいち",    lat: 33.563630, lng: 133.547710, timeToNext: 4 },
  { name: "よしかわ",   lat: 33.553880, lng: 133.540260, timeToNext: 4 },
  { name: "あかおか",   lat: 33.549350, lng: 133.528040, timeToNext: 4 },
  { name: "香我美",    lat: 33.553160, lng: 133.504950, timeToNext: 5 },
  { name: "夜須",      lat: 33.554810, lng: 133.479360, timeToNext: 5 },
  { name: "西分",      lat: 33.545550, lng: 133.449970, timeToNext: 5 },
  { name: "和食",      lat: 33.524520, lng: 133.404060, timeToNext: 5 },
  { name: "赤野",      lat: 33.524630, lng: 133.373600, timeToNext: 5 },
  { name: "穴内",      lat: 33.542430, lng: 133.330650, timeToNext: 5 },
  { name: "球場前",    lat: 33.552290, lng: 133.302150, timeToNext: 4 },
  { name: "あき総合病院前", lat: 33.498500, lng: 133.905000, timeToNext: 4 },
  { name: "安芸",      lat: 33.498340, lng: 133.905310, timeToNext: 5 },
  { name: "伊尾木",    lat: 33.495670, lng: 133.961230, timeToNext: 5 },
  { name: "下山",      lat: 33.484510, lng: 133.988470, timeToNext: 5 },
  { name: "唐浜",      lat: 33.461740, lng: 134.016230, timeToNext: 5 },
  { name: "田野",      lat: 33.450180, lng: 134.033460, timeToNext: 5 },
  { name: "奈半利",    lat: 33.451060, lng: 134.007010, timeToNext: 0 },
];

// JR予土線: 若井〜北宇和島
export const jrYodoLine: Station[] = [
  { name: "若井",      lat: 33.171700, lng: 132.976400, timeToNext: 8 },
  { name: "川奥信号場",  lat: 33.158700, lng: 132.998000, timeToNext: 8 },
  { name: "黒岩",      lat: 33.152200, lng: 133.002600, timeToNext: 8 },
  { name: "家地川",    lat: 33.138700, lng: 132.997600, timeToNext: 8 },
  { name: "打井川",    lat: 33.130600, lng: 132.983400, timeToNext: 8 },
  { name: "土佐大正",   lat: 33.137700, lng: 132.952100, timeToNext: 8 },
  { name: "十川",      lat: 33.165500, lng: 132.927700, timeToNext: 8 },
  { name: "半家",      lat: 33.190800, lng: 132.883300, timeToNext: 8 },
  { name: "江川崎",    lat: 33.062700, lng: 132.820300, timeToNext: 10 },
  { name: "西ヶ方",    lat: 33.078700, lng: 132.786600, timeToNext: 8 },
  { name: "真土",      lat: 33.098200, lng: 132.763100, timeToNext: 8 },
  { name: "吉野生",    lat: 33.155600, lng: 132.709400, timeToNext: 8 },
  { name: "松丸",      lat: 33.249900, lng: 132.671600, timeToNext: 8 },
  { name: "出目",      lat: 33.279800, lng: 132.667400, timeToNext: 8 },
  { name: "北宇和島",   lat: 33.222400, lng: 132.577500, timeToNext: 0 },
];
