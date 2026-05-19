import type { Station } from './yamanote';

// 高松琴平電気鉄道（琴電）琴平線: 高松築港〜琴電琴平
export const kotohiraLine: Station[] = [
  { name: "高松築港",   lat: 34.350500, lng: 134.045440, timeToNext: 3 },
  { name: "片原町",    lat: 34.347090, lng: 134.048960, timeToNext: 3 },
  { name: "瓦町",      lat: 34.344540, lng: 134.052870, timeToNext: 3 },
  { name: "栗林公園北口", lat: 34.339090, lng: 134.056350, timeToNext: 3 },
  { name: "栗林",      lat: 34.332500, lng: 134.059160, timeToNext: 3 },
  { name: "三条",      lat: 34.325400, lng: 134.062320, timeToNext: 3 },
  { name: "太田",      lat: 34.299070, lng: 134.045930, timeToNext: 3 },
  { name: "仏生山",    lat: 34.283744, lng: 134.042694, timeToNext: 3 },
  { name: "空港通り",   lat: 34.284290, lng: 134.047640, timeToNext: 3 },
  { name: "一宮",      lat: 34.274920, lng: 134.036460, timeToNext: 3 },
  { name: "円座",      lat: 34.284499, lng: 134.009398, timeToNext: 3 },
  { name: "岡本",      lat: 34.270109, lng: 133.989303, timeToNext: 4 },
  { name: "挿頭丘",    lat: 34.262102, lng: 133.979633, timeToNext: 4 },
  { name: "畑田",      lat: 34.259236, lng: 133.972104, timeToNext: 4 },
  { name: "陶",        lat: 34.250273, lng: 133.947351, timeToNext: 4 },
  { name: "綾川",      lat: 34.249500, lng: 133.931680, timeToNext: 4 },
  { name: "羽床",      lat: 34.241135, lng: 133.902047, timeToNext: 5 },
  { name: "羽床上",    lat: 34.213340, lng: 133.866700, timeToNext: 4 },
  { name: "川島",      lat: 34.200270, lng: 133.837560, timeToNext: 5 },
  { name: "国分寺",    lat: 34.188010, lng: 133.820600, timeToNext: 5 },
  { name: "水田",      lat: 34.302924, lng: 134.092771, timeToNext: 5 },
  { name: "岡田",      lat: 34.221219, lng: 133.861572, timeToNext: 5 },
  { name: "金蔵寺",    lat: 34.247948, lng: 133.777627, timeToNext: 5 },
  { name: "琴電琴平",   lat: 34.191164, lng: 133.818958, timeToNext: 0 },
];

// JR牟岐線: 徳島〜海部
export const jrMugiLine: Station[] = [
  { name: "徳島",      lat: 34.074840, lng: 134.557690, timeToNext: 5 },
  { name: "阿波富田",   lat: 34.062740, lng: 134.552380, timeToNext: 4 },
  { name: "二軒屋",    lat: 34.051080, lng: 134.545740, timeToNext: 4 },
  { name: "文化の森",   lat: 34.036440, lng: 134.551410, timeToNext: 4 },
  { name: "地蔵橋",    lat: 34.023870, lng: 134.559280, timeToNext: 4 },
  { name: "南小松島",   lat: 34.000660, lng: 134.578610, timeToNext: 4 },
  { name: "中田",      lat: 34.010385, lng: 134.569601, timeToNext: 4 },
  { name: "阿南",      lat: 33.921850, lng: 134.658540, timeToNext: 8 },
  { name: "見能林",    lat: 33.888060, lng: 134.671510, timeToNext: 5 },
  { name: "阿波中島",   lat: 33.941196, lng: 134.664986, timeToNext: 5 },
  { name: "西原",      lat: 33.948319, lng: 134.644836, timeToNext: 5 },
  { name: "羽ノ浦",    lat: 33.957892, lng: 134.625416, timeToNext: 5 },
  { name: "阿波桑野",   lat: 33.826200, lng: 134.601010, timeToNext: 5 },
  { name: "阿波福井",   lat: 33.824062, lng: 134.605366, timeToNext: 8 },
  { name: "由岐",      lat: 33.775804, lng: 134.591636, timeToNext: 8 },
  { name: "木岐",      lat: 33.766516, lng: 134.569447, timeToNext: 8 },
  { name: "日和佐",    lat: 33.721640, lng: 134.537600, timeToNext: 10 },
  { name: "山河内",    lat: 33.715059, lng: 134.485096, timeToNext: 10 },
  { name: "辺川",      lat: 33.694962, lng: 134.434902, timeToNext: 10 },
  { name: "牟岐",      lat: 33.664480, lng: 134.418860, timeToNext: 10 },
  { name: "鯖瀬",      lat: 33.645953, lng: 134.385259, timeToNext: 10 },
  { name: "浅川",      lat: 33.626537, lng: 134.358660, timeToNext: 8 },
  { name: "阿波海南",   lat: 33.606753, lng: 134.351018, timeToNext: 8 },
  { name: "海部",      lat: 33.593773, lng: 134.352086, timeToNext: 0 },
];

// 土佐くろしお鉄道阿佐線: 海部〜甲浦
export const tosaCuroshioAsaLine: Station[] = [
  { name: "海部",      lat: 33.593773, lng: 134.352086, timeToNext: 5 },
  { name: "宍喰",      lat: 33.566853, lng: 134.300717, timeToNext: 5 },
  { name: "甲浦",      lat: 33.505580, lng: 134.285200, timeToNext: 0 },
];

// 土佐くろしお鉄道ごめん・なはり線: 後免〜奈半利
export const tosaCuroshioNahariLine: Station[] = [
  { name: "後免",      lat: 33.579233, lng: 133.645326, timeToNext: 5 },
  { name: "後免西",    lat: 33.559120, lng: 133.582310, timeToNext: 4 },
  { name: "後免中",    lat: 33.567180, lng: 133.568280, timeToNext: 4 },
  { name: "後免東",    lat: 33.572290, lng: 133.553910, timeToNext: 4 },
  { name: "のいち",    lat: 33.561909, lng: 133.697987, timeToNext: 4 },
  { name: "よしかわ",   lat: 33.546115, lng: 133.710127, timeToNext: 4 },
  { name: "あかおか",   lat: 33.539866, lng: 133.722103, timeToNext: 4 },
  { name: "香我美",    lat: 33.539314, lng: 133.737432, timeToNext: 5 },
  { name: "夜須",      lat: 33.534449, lng: 133.754260, timeToNext: 5 },
  { name: "西分",      lat: 33.517718, lng: 133.790302, timeToNext: 5 },
  { name: "和食",      lat: 33.517899, lng: 133.809213, timeToNext: 5 },
  { name: "赤野",      lat: 33.516015, lng: 133.825034, timeToNext: 5 },
  { name: "穴内",      lat: 33.542430, lng: 133.330650, timeToNext: 5 },
  { name: "球場前",    lat: 33.552290, lng: 133.302150, timeToNext: 4 },
  { name: "あき総合病院前", lat: 33.498500, lng: 133.905000, timeToNext: 4 },
  { name: "安芸",      lat: 33.498340, lng: 133.905310, timeToNext: 5 },
  { name: "伊尾木",    lat: 33.490946, lng: 133.929092, timeToNext: 5 },
  { name: "下山",      lat: 33.458293, lng: 133.948102, timeToNext: 5 },
  { name: "唐浜",      lat: 33.446063, lng: 133.965708, timeToNext: 5 },
  { name: "田野",      lat: 33.430284, lng: 134.008172, timeToNext: 5 },
  { name: "奈半利",    lat: 33.425059, lng: 134.018112, timeToNext: 0 },
];

// JR予土線: 若井〜北宇和島
export const jrYodoLine: Station[] = [
  { name: "若井",      lat: 33.188057, lng: 133.105997, timeToNext: 8 },
  { name: "川奥信号場",  lat: 33.158700, lng: 132.998000, timeToNext: 8 },
  { name: "黒岩",      lat: 33.152200, lng: 133.002600, timeToNext: 8 },
  { name: "家地川",    lat: 33.161476, lng: 133.074695, timeToNext: 8 },
  { name: "打井川",    lat: 33.175552, lng: 133.029459, timeToNext: 8 },
  { name: "土佐大正",   lat: 33.194622, lng: 132.975377, timeToNext: 8 },
  { name: "十川",      lat: 33.234740, lng: 132.855783, timeToNext: 8 },
  { name: "半家",      lat: 33.201536, lng: 132.791531, timeToNext: 8 },
  { name: "江川崎",    lat: 33.178334, lng: 132.783079, timeToNext: 10 },
  { name: "西ヶ方",    lat: 33.187233, lng: 132.767244, timeToNext: 8 },
  { name: "真土",      lat: 33.224086, lng: 132.745337, timeToNext: 8 },
  { name: "吉野生",    lat: 33.224572, lng: 132.729061, timeToNext: 8 },
  { name: "松丸",      lat: 33.228436, lng: 132.708574, timeToNext: 8 },
  { name: "出目",      lat: 33.251959, lng: 132.691701, timeToNext: 8 },
  { name: "北宇和島",   lat: 33.222400, lng: 132.577500, timeToNext: 0 },
];
