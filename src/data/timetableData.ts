/**
 * 時刻表データ（テスト実装 - 主要10路線）
 *
 * ⚠️ 注意: このデータは運行頻度パターンに基づく概算値です。
 * 正確な時刻は各鉄道会社の公式サイト・駅掲示物をご確認ください。
 * 参考ダイヤ改正: 2025年3月15日（JR東日本・各私鉄 春ダイヤ改正）
 */

export interface Departure {
  time: string;        // "HH:MM"
  type: string;        // "各停", "急行", "快特", "普通", etc.
  destination: string;
  platform?: string;   // 番線 (例: "3番線")
}

/** "HH:MM" に minutes 分を加算して返す */
export function addMinutes(timeStr: string, minutes: number): string {
  const [h, mm] = timeStr.split(':').map(Number);
  const total = h * 60 + mm + minutes;
  const norm  = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(norm / 60)).padStart(2, '0')}:${String(norm % 60).padStart(2, '0')}`;
}

interface StationEntry {
  name: string;
  offset: number; // 始発駅からの累計所要時間（分）
}

interface Pattern {
  fromMin: number;
  toMin: number;
  intervalMin: number;
  type: string;
  destination: string;
}

interface DirectionData {
  label: string;
  stations: StationEntry[];
  patterns: Pattern[];
}

export interface LineTimetableData {
  key: string;
  name: string;
  updatedAt: string;   // "YYYY-MM-DD"
  dataVersion: string;
  directions: DirectionData[];
}

// ── 番線データ (lineKey_directionIndex_stationName → 番線) ──────
const platformMap: Record<string, string> = {
  // 山手線 内回り (0) / 外回り (1)
  'yamanote_0_東京': '1番線', 'yamanote_0_品川': '1番線', 'yamanote_0_渋谷': '1番線',
  'yamanote_0_新宿': '1番線', 'yamanote_0_池袋': '1番線', 'yamanote_0_上野': '1番線',
  'yamanote_1_東京': '2番線', 'yamanote_1_品川': '2番線', 'yamanote_1_渋谷': '2番線',
  'yamanote_1_新宿': '2番線', 'yamanote_1_池袋': '2番線', 'yamanote_1_上野': '2番線',
  // 東海道線 下り (0) 東京→小田原 / 上り (1) 小田原→東京
  'jrTokaidoMainLine_0_東京': '9番線', 'jrTokaidoMainLine_0_品川': '7番線',
  'jrTokaidoMainLine_0_横浜': '6番線', 'jrTokaidoMainLine_0_藤沢': '3番線',
  'jrTokaidoMainLine_1_横浜': '8番線', 'jrTokaidoMainLine_1_品川': '8番線',
  'jrTokaidoMainLine_1_東京': '8番線', 'jrTokaidoMainLine_1_藤沢': '4番線',
  // 京浜東北線 南行 (0) / 北行 (1)
  'keihinTohoku_0_東京': '3番線', 'keihinTohoku_0_品川': '3番線',
  'keihinTohoku_0_川崎': '3番線', 'keihinTohoku_0_横浜': '3番線',
  'keihinTohoku_1_横浜': '4番線', 'keihinTohoku_1_川崎': '4番線',
  'keihinTohoku_1_品川': '4番線', 'keihinTohoku_1_東京': '4番線',
  // 京急 下り (0) / 上り (1)
  'keikyuLine_0_品川': '1番線', 'keikyuLine_0_京急川崎': '2番線', 'keikyuLine_0_横浜': '1番線',
  'keikyuLine_1_横浜': '2番線', 'keikyuLine_1_京急川崎': '1番線', 'keikyuLine_1_品川': '2番線',
  // 小田急 下り (0) 新宿→小田原 / 上り (1)
  'odakyuLine_0_新宿': '3番線', 'odakyuLine_0_下北沢': '2番線', 'odakyuLine_0_相模大野': '2番線',
  'odakyuLine_1_新宿': '3番線', 'odakyuLine_1_下北沢': '1番線', 'odakyuLine_1_相模大野': '1番線',
  // 東急東横線 下り (0) / 上り (1)
  'tokyuToyokoLine_0_渋谷': '1番線', 'tokyuToyokoLine_0_武蔵小杉': '2番線', 'tokyuToyokoLine_0_横浜': '3番線',
  'tokyuToyokoLine_1_横浜': '4番線', 'tokyuToyokoLine_1_武蔵小杉': '1番線', 'tokyuToyokoLine_1_渋谷': '2番線',
  // 東急田園都市線 下り (0) / 上り (1)
  'tokyuDenEnToshiLine_0_渋谷': '3番線', 'tokyuDenEnToshiLine_0_二子玉川': '3番線',
  'tokyuDenEnToshiLine_1_渋谷': '4番線', 'tokyuDenEnToshiLine_1_二子玉川': '4番線',
  // 銀座線 渋谷方面 (0) / 浅草方面 (1)
  'ginzaLine_0_浅草': '1番線', 'ginzaLine_0_上野': '1番線', 'ginzaLine_0_銀座': '1番線', 'ginzaLine_0_渋谷': '1番線',
  'ginzaLine_1_渋谷': '2番線', 'ginzaLine_1_銀座': '2番線', 'ginzaLine_1_上野': '2番線', 'ginzaLine_1_浅草': '2番線',
  // 丸ノ内線 荻窪方面 (0) / 池袋方面 (1)
  'marunouchiLine_0_池袋': '1番線', 'marunouchiLine_0_新宿': '1番線', 'marunouchiLine_0_銀座': '1番線',
  'marunouchiLine_1_銀座': '2番線', 'marunouchiLine_1_新宿': '2番線', 'marunouchiLine_1_池袋': '2番線',
};

function getPlatform(lineKey: string, dirIdx: number, stationName: string): string | undefined {
  return platformMap[`${lineKey}_${dirIdx}_${stationName}`];
}

// ── ヘルパー ─────────────────────────────────────────
function m(h: number, min = 0): number { return h * 60 + min; }

function toTime(totalMin: number): string {
  const t = ((totalMin % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

function genBase(patterns: Pattern[]): Departure[] {
  const deps: Departure[] = [];
  for (const p of patterns) {
    for (let t = p.fromMin; t < p.toMin; t += p.intervalMin) {
      deps.push({ time: toTime(t), type: p.type, destination: p.destination });
    }
  }
  return deps.sort((a, b) => a.time.localeCompare(b.time));
}

function shiftDeps(base: Departure[], offsetMin: number): Departure[] {
  return base
    .map(d => {
      const [h, mm] = d.time.split(':').map(Number);
      return { ...d, time: toTime(h * 60 + mm + offsetMin) };
    })
    .sort((a, b) => a.time.localeCompare(b.time));
}

// ── 路線データ ────────────────────────────────────────

const yamanoteData: LineTimetableData = {
  key: 'yamanote',
  name: '山手線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年3月ダイヤ改正版（概算）',
  directions: [
    {
      label: '内回り（上野・池袋・新宿・渋谷方面）',
      stations: [
        { name: '東京', offset: 0 }, { name: '神田', offset: 2 }, { name: '秋葉原', offset: 4 },
        { name: '御徒町', offset: 6 }, { name: '上野', offset: 8 }, { name: '鶯谷', offset: 10 },
        { name: '日暮里', offset: 12 }, { name: '西日暮里', offset: 14 }, { name: '田端', offset: 16 },
        { name: '駒込', offset: 18 }, { name: '巣鴨', offset: 20 }, { name: '大塚', offset: 22 },
        { name: '池袋', offset: 24 }, { name: '目白', offset: 26 }, { name: '高田馬場', offset: 28 },
        { name: '新大久保', offset: 30 }, { name: '新宿', offset: 32 }, { name: '代々木', offset: 34 },
        { name: '原宿', offset: 36 }, { name: '渋谷', offset: 38 }, { name: '恵比寿', offset: 40 },
        { name: '目黒', offset: 42 }, { name: '五反田', offset: 44 }, { name: '大崎', offset: 46 },
        { name: '品川', offset: 48 }, { name: '高輪ゲートウェイ', offset: 50 }, { name: '田町', offset: 51 },
        { name: '浜松町', offset: 53 }, { name: '新橋', offset: 55 }, { name: '有楽町', offset: 57 },
      ],
      patterns: [
        { fromMin: m(4,45), toMin: m(7),    intervalMin: 6, type: '各停', destination: '内回り全線' },
        { fromMin: m(7),    toMin: m(10),   intervalMin: 3, type: '各停', destination: '内回り全線' },
        { fromMin: m(10),   toMin: m(17),   intervalMin: 5, type: '各停', destination: '内回り全線' },
        { fromMin: m(17),   toMin: m(20,30),intervalMin: 3, type: '各停', destination: '内回り全線' },
        { fromMin: m(20,30),toMin: m(23,30),intervalMin: 6, type: '各停', destination: '内回り全線' },
        { fromMin: m(23,30),toMin: m(25,30),intervalMin: 9, type: '各停', destination: '内回り全線' },
      ],
    },
    {
      label: '外回り（品川・渋谷・新宿・池袋方面）',
      stations: [
        { name: '東京', offset: 0 }, { name: '有楽町', offset: 2 }, { name: '新橋', offset: 4 },
        { name: '浜松町', offset: 6 }, { name: '田町', offset: 8 }, { name: '高輪ゲートウェイ', offset: 10 },
        { name: '品川', offset: 11 }, { name: '大崎', offset: 13 }, { name: '五反田', offset: 15 },
        { name: '目黒', offset: 17 }, { name: '恵比寿', offset: 19 }, { name: '渋谷', offset: 21 },
        { name: '原宿', offset: 23 }, { name: '代々木', offset: 25 }, { name: '新宿', offset: 27 },
        { name: '新大久保', offset: 29 }, { name: '高田馬場', offset: 31 }, { name: '目白', offset: 33 },
        { name: '池袋', offset: 35 }, { name: '大塚', offset: 37 }, { name: '巣鴨', offset: 39 },
        { name: '駒込', offset: 41 }, { name: '田端', offset: 43 }, { name: '西日暮里', offset: 45 },
        { name: '日暮里', offset: 47 }, { name: '鶯谷', offset: 49 }, { name: '上野', offset: 51 },
        { name: '御徒町', offset: 53 }, { name: '秋葉原', offset: 55 }, { name: '神田', offset: 57 },
      ],
      patterns: [
        { fromMin: m(4,45), toMin: m(7),    intervalMin: 6, type: '各停', destination: '外回り全線' },
        { fromMin: m(7),    toMin: m(10),   intervalMin: 3, type: '各停', destination: '外回り全線' },
        { fromMin: m(10),   toMin: m(17),   intervalMin: 5, type: '各停', destination: '外回り全線' },
        { fromMin: m(17),   toMin: m(20,30),intervalMin: 3, type: '各停', destination: '外回り全線' },
        { fromMin: m(20,30),toMin: m(23,30),intervalMin: 6, type: '各停', destination: '外回り全線' },
        { fromMin: m(23,30),toMin: m(25,30),intervalMin: 9, type: '各停', destination: '外回り全線' },
      ],
    },
  ],
};

const tokaidoData: LineTimetableData = {
  key: 'jrTokaidoMainLine',
  name: '東海道線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年3月ダイヤ改正版（概算）',
  directions: [
    {
      label: '下り（横浜・小田原方面）',
      stations: [
        { name: '東京', offset: 0 },   { name: '新橋', offset: 3 },   { name: '品川', offset: 6 },
        { name: '川崎', offset: 10 },  { name: '横浜', offset: 14 },  { name: '保土ケ谷', offset: 19 },
        { name: '東戸塚', offset: 22 }, { name: '戸塚', offset: 26 },  { name: '大船', offset: 32 },
        { name: '藤沢', offset: 38 },  { name: '辻堂', offset: 42 },  { name: '茅ケ崎', offset: 45 },
        { name: '平塚', offset: 49 },  { name: '大磯', offset: 53 },  { name: '二宮', offset: 56 },
        { name: '国府津', offset: 59 }, { name: '鴨宮', offset: 63 },  { name: '小田原', offset: 66 },
      ],
      patterns: [
        { fromMin: m(5,20),  toMin: m(7),    intervalMin: 20, type: '普通',       destination: '小田原行き' },
        { fromMin: m(5,30),  toMin: m(7),    intervalMin: 30, type: '快速アクティー', destination: '小田原行き' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 10, type: '普通',       destination: '小田原・熱海方面' },
        { fromMin: m(7,5),   toMin: m(9,30), intervalMin: 20, type: '快速アクティー', destination: '小田原行き' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 15, type: '普通',       destination: '小田原・熱海方面' },
        { fromMin: m(9,40),  toMin: m(17),   intervalMin: 30, type: '快速アクティー', destination: '小田原行き' },
        { fromMin: m(17),    toMin: m(21),   intervalMin: 10, type: '普通',       destination: '小田原・熱海方面' },
        { fromMin: m(17,5),  toMin: m(21),   intervalMin: 20, type: '快速アクティー', destination: '小田原行き' },
        { fromMin: m(21),    toMin: m(24,30),intervalMin: 20, type: '普通',       destination: '小田原行き' },
      ],
    },
    {
      label: '上り（品川・東京方面）',
      stations: [
        { name: '小田原', offset: 0 },  { name: '鴨宮', offset: 3 },   { name: '国府津', offset: 7 },
        { name: '二宮', offset: 10 },   { name: '大磯', offset: 13 },  { name: '平塚', offset: 17 },
        { name: '茅ケ崎', offset: 21 }, { name: '辻堂', offset: 24 },  { name: '藤沢', offset: 28 },
        { name: '大船', offset: 34 },   { name: '戸塚', offset: 40 },  { name: '東戸塚', offset: 44 },
        { name: '保土ケ谷', offset: 47 },{ name: '横浜', offset: 52 }, { name: '川崎', offset: 56 },
        { name: '品川', offset: 60 },   { name: '新橋', offset: 63 },  { name: '東京', offset: 66 },
      ],
      patterns: [
        { fromMin: m(4,30),  toMin: m(7),    intervalMin: 20, type: '普通',       destination: '東京方面' },
        { fromMin: m(5),     toMin: m(7),    intervalMin: 30, type: '快速アクティー', destination: '東京行き' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 10, type: '普通',       destination: '東京・上野方面' },
        { fromMin: m(7,10),  toMin: m(9,30), intervalMin: 20, type: '快速アクティー', destination: '東京行き' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 15, type: '普通',       destination: '東京・上野方面' },
        { fromMin: m(17),    toMin: m(21),   intervalMin: 10, type: '普通',       destination: '東京・上野方面' },
        { fromMin: m(17,10), toMin: m(21),   intervalMin: 20, type: '快速アクティー', destination: '東京行き' },
        { fromMin: m(21),    toMin: m(24,30),intervalMin: 20, type: '普通',       destination: '東京行き' },
      ],
    },
  ],
};

const chuoData: LineTimetableData = {
  key: 'chuo',
  name: '中央・総武線（各停）',
  updatedAt: '2025-03-15',
  dataVersion: '2025年3月ダイヤ改正版（概算）',
  directions: [
    {
      label: '西行き（中野・三鷹・立川方面）',
      stations: [
        { name: '東京', offset: 0 },   { name: '神田', offset: 2 },    { name: '御茶ノ水', offset: 4 },
        { name: '水道橋', offset: 6 }, { name: '飯田橋', offset: 8 },  { name: '市ケ谷', offset: 10 },
        { name: '四ツ谷', offset: 12 }, { name: '信濃町', offset: 14 }, { name: '千駄ケ谷', offset: 16 },
        { name: '代々木', offset: 18 }, { name: '新宿', offset: 20 },   { name: '大久保', offset: 22 },
        { name: '東中野', offset: 24 }, { name: '中野', offset: 26 },   { name: '高円寺', offset: 29 },
        { name: '阿佐ケ谷', offset: 31 },{ name: '荻窪', offset: 33 }, { name: '西荻窪', offset: 36 },
        { name: '吉祥寺', offset: 38 }, { name: '三鷹', offset: 40 },   { name: '武蔵境', offset: 42 },
        { name: '東小金井', offset: 44 },{ name: '武蔵小金井', offset: 46 },{ name: '国分寺', offset: 48 },
        { name: '西国分寺', offset: 50 },{ name: '国立', offset: 52 },  { name: '立川', offset: 54 },
      ],
      patterns: [
        { fromMin: m(5),     toMin: m(7),    intervalMin: 8, type: '各停', destination: '三鷹・立川方面' },
        { fromMin: m(7),     toMin: m(10),   intervalMin: 5, type: '各停', destination: '三鷹・立川方面' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 8, type: '各停', destination: '三鷹・立川方面' },
        { fromMin: m(17),    toMin: m(20),   intervalMin: 5, type: '各停', destination: '三鷹・立川方面' },
        { fromMin: m(20),    toMin: m(24,30),intervalMin: 10,type: '各停', destination: '三鷹方面' },
      ],
    },
    {
      label: '東行き（新宿・御茶ノ水・東京方面）',
      stations: [
        { name: '立川', offset: 0 },   { name: '国立', offset: 2 },    { name: '西国分寺', offset: 4 },
        { name: '国分寺', offset: 6 }, { name: '武蔵小金井', offset: 8 },{ name: '東小金井', offset: 10 },
        { name: '武蔵境', offset: 12 }, { name: '三鷹', offset: 14 },   { name: '吉祥寺', offset: 16 },
        { name: '西荻窪', offset: 18 }, { name: '荻窪', offset: 21 },   { name: '阿佐ケ谷', offset: 23 },
        { name: '高円寺', offset: 25 }, { name: '中野', offset: 27 },   { name: '東中野', offset: 30 },
        { name: '大久保', offset: 32 }, { name: '新宿', offset: 34 },   { name: '代々木', offset: 36 },
        { name: '千駄ケ谷', offset: 38 },{ name: '信濃町', offset: 40 },{ name: '四ツ谷', offset: 42 },
        { name: '市ケ谷', offset: 44 }, { name: '飯田橋', offset: 46 }, { name: '水道橋', offset: 48 },
        { name: '御茶ノ水', offset: 50 },{ name: '神田', offset: 52 },  { name: '東京', offset: 54 },
      ],
      patterns: [
        { fromMin: m(5),     toMin: m(7),    intervalMin: 8, type: '各停', destination: '新宿・東京方面' },
        { fromMin: m(7),     toMin: m(10),   intervalMin: 5, type: '各停', destination: '新宿・東京方面' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 8, type: '各停', destination: '新宿・東京方面' },
        { fromMin: m(17),    toMin: m(20),   intervalMin: 5, type: '各停', destination: '新宿・東京方面' },
        { fromMin: m(20),    toMin: m(24,30),intervalMin: 10,type: '各停', destination: '新宿・東京方面' },
      ],
    },
  ],
};

const ginzaData: LineTimetableData = {
  key: 'ginzaLine',
  name: '東京メトロ銀座線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年3月ダイヤ改正版（概算）',
  directions: [
    {
      label: '渋谷方面',
      stations: [
        { name: '浅草', offset: 0 },    { name: '田原町', offset: 2 },  { name: '稲荷町', offset: 4 },
        { name: '上野', offset: 6 },    { name: '上野広小路', offset: 9 },{ name: '末広町', offset: 10 },
        { name: '神田', offset: 11 },   { name: '三越前', offset: 13 },  { name: '日本橋', offset: 14 },
        { name: '京橋', offset: 16 },   { name: '銀座', offset: 18 },   { name: '新橋', offset: 20 },
        { name: '虎ノ門', offset: 22 }, { name: '溜池山王', offset: 24 },{ name: '赤坂見附', offset: 26 },
        { name: '青山一丁目', offset: 28 },{ name: '外苑前', offset: 30 },{ name: '表参道', offset: 32 },
        { name: '渋谷', offset: 34 },
      ],
      patterns: [
        { fromMin: m(5,10),  toMin: m(7,30), intervalMin: 6, type: '各停', destination: '渋谷行き' },
        { fromMin: m(7,30),  toMin: m(9,30), intervalMin: 3, type: '各停', destination: '渋谷行き' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 4, type: '各停', destination: '渋谷行き' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 3, type: '各停', destination: '渋谷行き' },
        { fromMin: m(20,30), toMin: m(24,10),intervalMin: 5, type: '各停', destination: '渋谷行き' },
      ],
    },
    {
      label: '浅草方面',
      stations: [
        { name: '渋谷', offset: 0 },    { name: '表参道', offset: 2 },  { name: '外苑前', offset: 4 },
        { name: '青山一丁目', offset: 6 },{ name: '赤坂見附', offset: 8 },{ name: '溜池山王', offset: 10 },
        { name: '虎ノ門', offset: 12 }, { name: '新橋', offset: 14 },   { name: '銀座', offset: 16 },
        { name: '京橋', offset: 18 },   { name: '日本橋', offset: 20 }, { name: '三越前', offset: 21 },
        { name: '神田', offset: 23 },   { name: '末広町', offset: 24 }, { name: '上野広小路', offset: 25 },
        { name: '上野', offset: 28 },   { name: '稲荷町', offset: 31 }, { name: '田原町', offset: 33 },
        { name: '浅草', offset: 35 },
      ],
      patterns: [
        { fromMin: m(5,10),  toMin: m(7,30), intervalMin: 6, type: '各停', destination: '浅草行き' },
        { fromMin: m(7,30),  toMin: m(9,30), intervalMin: 3, type: '各停', destination: '浅草行き' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 4, type: '各停', destination: '浅草行き' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 3, type: '各停', destination: '浅草行き' },
        { fromMin: m(20,30), toMin: m(24,10),intervalMin: 5, type: '各停', destination: '浅草行き' },
      ],
    },
  ],
};

const marunouchi: LineTimetableData = {
  key: 'marunouchiLine',
  name: '東京メトロ丸ノ内線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年3月ダイヤ改正版（概算）',
  directions: [
    {
      label: '荻窪方面',
      stations: [
        { name: '池袋', offset: 0 },     { name: '新大塚', offset: 2 },   { name: '茗荷谷', offset: 4 },
        { name: '後楽園', offset: 6 },   { name: '本郷三丁目', offset: 7 },{ name: '御茶ノ水', offset: 8 },
        { name: '淡路町', offset: 9 },   { name: '大手町', offset: 10 },  { name: '東京', offset: 11 },
        { name: '銀座', offset: 12 },    { name: '霞ケ関', offset: 14 },  { name: '国会議事堂前', offset: 15 },
        { name: '赤坂見附', offset: 16 },{ name: '四ツ谷', offset: 17 },  { name: '四谷三丁目', offset: 19 },
        { name: '新宿御苑前', offset: 21 },{ name: '新宿三丁目', offset: 22 },{ name: '新宿', offset: 23 },
        { name: '西新宿', offset: 25 },  { name: '中野坂上', offset: 26 }, { name: '新中野', offset: 28 },
        { name: '東高円寺', offset: 29 },{ name: '新高円寺', offset: 31 }, { name: '南阿佐ケ谷', offset: 32 },
        { name: '荻窪', offset: 33 },
      ],
      patterns: [
        { fromMin: m(5,10),  toMin: m(7,30), intervalMin: 5, type: '各停', destination: '荻窪行き' },
        { fromMin: m(7,30),  toMin: m(9,30), intervalMin: 3, type: '各停', destination: '荻窪行き' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 4, type: '各停', destination: '荻窪行き' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 3, type: '各停', destination: '荻窪行き' },
        { fromMin: m(20,30), toMin: m(24,10),intervalMin: 5, type: '各停', destination: '荻窪行き' },
      ],
    },
    {
      label: '池袋方面',
      stations: [
        { name: '荻窪', offset: 0 },     { name: '南阿佐ケ谷', offset: 1 },{ name: '新高円寺', offset: 2 },
        { name: '東高円寺', offset: 4 }, { name: '新中野', offset: 5 },   { name: '中野坂上', offset: 7 },
        { name: '西新宿', offset: 8 },   { name: '新宿', offset: 9 },     { name: '新宿三丁目', offset: 11 },
        { name: '新宿御苑前', offset: 12 },{ name: '四谷三丁目', offset: 13 },{ name: '四ツ谷', offset: 15 },
        { name: '赤坂見附', offset: 17 },{ name: '国会議事堂前', offset: 18 },{ name: '霞ケ関', offset: 19 },
        { name: '銀座', offset: 21 },    { name: '東京', offset: 22 },    { name: '大手町', offset: 23 },
        { name: '淡路町', offset: 24 },  { name: '御茶ノ水', offset: 25 }, { name: '本郷三丁目', offset: 26 },
        { name: '後楽園', offset: 27 },  { name: '茗荷谷', offset: 29 },  { name: '新大塚', offset: 31 },
        { name: '池袋', offset: 33 },
      ],
      patterns: [
        { fromMin: m(5,10),  toMin: m(7,30), intervalMin: 5, type: '各停', destination: '池袋行き' },
        { fromMin: m(7,30),  toMin: m(9,30), intervalMin: 3, type: '各停', destination: '池袋行き' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 4, type: '各停', destination: '池袋行き' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 3, type: '各停', destination: '池袋行き' },
        { fromMin: m(20,30), toMin: m(24,10),intervalMin: 5, type: '各停', destination: '池袋行き' },
      ],
    },
  ],
};

const toyokoData: LineTimetableData = {
  key: 'tokyuToyokoLine',
  name: '東急東横線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年3月ダイヤ改正版（概算）',
  directions: [
    {
      label: '横浜・元町・中華街方面',
      stations: [
        { name: '渋谷', offset: 0 },    { name: '代官山', offset: 2 },  { name: '中目黒', offset: 3 },
        { name: '祐天寺', offset: 5 },  { name: '学芸大学', offset: 7 }, { name: '都立大学', offset: 8 },
        { name: '自由が丘', offset: 9 }, { name: '田園調布', offset: 11 },{ name: '多摩川', offset: 13 },
        { name: '新丸子', offset: 16 }, { name: '武蔵小杉', offset: 17 },{ name: '元住吉', offset: 19 },
        { name: '日吉', offset: 21 },   { name: '綱島', offset: 24 },   { name: '大倉山', offset: 27 },
        { name: '菊名', offset: 29 },   { name: '妙蓮寺', offset: 31 }, { name: '白楽', offset: 32 },
        { name: '東白楽', offset: 33 }, { name: '反町', offset: 35 },   { name: '横浜', offset: 37 },
      ],
      patterns: [
        { fromMin: m(5),     toMin: m(7,30), intervalMin: 7, type: '各停', destination: '横浜方面' },
        { fromMin: m(5,30),  toMin: m(7,30), intervalMin: 10,type: '急行', destination: '横浜・元町・中華街方面' },
        { fromMin: m(7,30),  toMin: m(9,30), intervalMin: 5, type: '各停', destination: '横浜方面' },
        { fromMin: m(7,35),  toMin: m(9,30), intervalMin: 5, type: '急行', destination: '横浜・元町・中華街方面' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 7, type: '各停', destination: '横浜方面' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 7, type: '急行', destination: '横浜・元町・中華街方面' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 5, type: '各停', destination: '横浜方面' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 5, type: '急行', destination: '横浜・元町・中華街方面' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 8, type: '各停', destination: '横浜方面' },
        { fromMin: m(20,35), toMin: m(24,30),intervalMin: 10,type: '急行', destination: '横浜方面' },
      ],
    },
    {
      label: '渋谷・新宿三丁目方面',
      stations: [
        { name: '横浜', offset: 0 },    { name: '反町', offset: 2 },    { name: '東白楽', offset: 4 },
        { name: '白楽', offset: 5 },    { name: '妙蓮寺', offset: 6 },  { name: '菊名', offset: 8 },
        { name: '大倉山', offset: 10 }, { name: '綱島', offset: 13 },   { name: '日吉', offset: 16 },
        { name: '元住吉', offset: 18 }, { name: '武蔵小杉', offset: 20 },{ name: '新丸子', offset: 21 },
        { name: '多摩川', offset: 24 }, { name: '田園調布', offset: 26 },{ name: '自由が丘', offset: 28 },
        { name: '都立大学', offset: 29 },{ name: '学芸大学', offset: 30 },{ name: '祐天寺', offset: 32 },
        { name: '中目黒', offset: 34 }, { name: '代官山', offset: 35 }, { name: '渋谷', offset: 37 },
      ],
      patterns: [
        { fromMin: m(5),     toMin: m(7,30), intervalMin: 7, type: '各停', destination: '渋谷方面' },
        { fromMin: m(5,30),  toMin: m(7,30), intervalMin: 10,type: '急行', destination: '渋谷・新宿三丁目方面' },
        { fromMin: m(7,30),  toMin: m(9,30), intervalMin: 5, type: '各停', destination: '渋谷方面' },
        { fromMin: m(7,35),  toMin: m(9,30), intervalMin: 5, type: '急行', destination: '渋谷・新宿三丁目方面' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 7, type: '各停', destination: '渋谷方面' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 7, type: '急行', destination: '渋谷・新宿三丁目方面' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 5, type: '各停', destination: '渋谷方面' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 5, type: '急行', destination: '渋谷・新宿三丁目方面' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 8, type: '各停', destination: '渋谷方面' },
      ],
    },
  ],
};

const denEnToshiData: LineTimetableData = {
  key: 'tokyuDenEnToshiLine',
  name: '東急田園都市線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年3月ダイヤ改正版（概算）',
  directions: [
    {
      label: '中央林間・長津田方面',
      stations: [
        { name: '渋谷', offset: 0 },     { name: '池尻大橋', offset: 3 }, { name: '三軒茶屋', offset: 5 },
        { name: '駒沢大学', offset: 7 }, { name: '桜新町', offset: 9 },   { name: '用賀', offset: 11 },
        { name: '二子玉川', offset: 13 },{ name: '二子新地', offset: 15 },{ name: '高津', offset: 16 },
        { name: '溝の口', offset: 17 },  { name: '梶が谷', offset: 19 },  { name: '宮崎台', offset: 21 },
        { name: '宮前平', offset: 22 },  { name: '鷺沼', offset: 24 },    { name: 'たまプラーザ', offset: 26 },
        { name: 'あざみ野', offset: 29 },{ name: '江田', offset: 31 },    { name: '市が尾', offset: 33 },
        { name: '藤が丘', offset: 35 },  { name: '青葉台', offset: 37 },  { name: '田奈', offset: 39 },
        { name: '長津田', offset: 41 },  { name: 'つくし野', offset: 43 },{ name: 'すずかけ台', offset: 45 },
        { name: '南町田グランベリーパーク', offset: 47 },{ name: 'つきみ野', offset: 49 },
        { name: '中央林間', offset: 52 },
      ],
      patterns: [
        { fromMin: m(5),     toMin: m(7),    intervalMin: 7, type: '各停', destination: '中央林間方面' },
        { fromMin: m(5,30),  toMin: m(7),    intervalMin: 10,type: '急行', destination: '中央林間方面' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 4, type: '各停', destination: '中央林間方面' },
        { fromMin: m(7,5),   toMin: m(9,30), intervalMin: 5, type: '急行', destination: '中央林間方面' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 6, type: '各停', destination: '中央林間方面' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 8, type: '急行', destination: '中央林間方面' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 4, type: '各停', destination: '中央林間方面' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 5, type: '急行', destination: '中央林間方面' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 7, type: '各停', destination: '中央林間方面' },
      ],
    },
    {
      label: '渋谷方面',
      stations: [
        { name: '中央林間', offset: 0 }, { name: 'つきみ野', offset: 3 },
        { name: '南町田グランベリーパーク', offset: 5 },{ name: 'すずかけ台', offset: 7 },
        { name: 'つくし野', offset: 9 }, { name: '長津田', offset: 11 },  { name: '田奈', offset: 13 },
        { name: '青葉台', offset: 15 },  { name: '藤が丘', offset: 17 },  { name: '市が尾', offset: 19 },
        { name: '江田', offset: 21 },    { name: 'あざみ野', offset: 23 },{ name: 'たまプラーザ', offset: 26 },
        { name: '鷺沼', offset: 28 },    { name: '宮前平', offset: 30 },  { name: '宮崎台', offset: 31 },
        { name: '梶が谷', offset: 33 },  { name: '溝の口', offset: 35 },  { name: '高津', offset: 37 },
        { name: '二子新地', offset: 38 },{ name: '二子玉川', offset: 39 },{ name: '用賀', offset: 41 },
        { name: '桜新町', offset: 43 },  { name: '駒沢大学', offset: 45 },{ name: '三軒茶屋', offset: 47 },
        { name: '池尻大橋', offset: 49 },{ name: '渋谷', offset: 52 },
      ],
      patterns: [
        { fromMin: m(5),     toMin: m(7),    intervalMin: 7, type: '各停', destination: '渋谷方面' },
        { fromMin: m(5,30),  toMin: m(7),    intervalMin: 10,type: '急行', destination: '渋谷方面' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 4, type: '各停', destination: '渋谷方面' },
        { fromMin: m(7,5),   toMin: m(9,30), intervalMin: 5, type: '急行', destination: '渋谷方面' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 6, type: '各停', destination: '渋谷方面' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 8, type: '急行', destination: '渋谷方面' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 4, type: '各停', destination: '渋谷方面' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 5, type: '急行', destination: '渋谷方面' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 7, type: '各停', destination: '渋谷方面' },
      ],
    },
  ],
};

const odakyuData: LineTimetableData = {
  key: 'odakyuLine',
  name: '小田急小田原線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年3月ダイヤ改正版（概算）',
  directions: [
    {
      label: '小田原方面',
      stations: [
        { name: '新宿', offset: 0 },     { name: '南新宿', offset: 2 },   { name: '参宮橋', offset: 4 },
        { name: '代々木八幡', offset: 6 },{ name: '代々木上原', offset: 8 },{ name: '東北沢', offset: 10 },
        { name: '下北沢', offset: 11 },  { name: '世田谷代田', offset: 13 },{ name: '梅ヶ丘', offset: 14 },
        { name: '豪徳寺', offset: 15 },  { name: '経堂', offset: 16 },    { name: '千歳船橋', offset: 18 },
        { name: '祖師ヶ谷大蔵', offset: 20 },{ name: '成城学園前', offset: 22 },{ name: '喜多見', offset: 24 },
        { name: '狛江', offset: 26 },    { name: '和泉多摩川', offset: 28 },{ name: '登戸', offset: 30 },
        { name: '向ヶ丘遊園', offset: 33 },{ name: '生田', offset: 35 },  { name: '読売ランド前', offset: 37 },
        { name: '百合ヶ丘', offset: 39 },{ name: '新百合ヶ丘', offset: 41 },{ name: '柿生', offset: 44 },
        { name: '鶴川', offset: 46 },    { name: '玉川学園前', offset: 48 },{ name: '町田', offset: 50 },
        { name: '相模大野', offset: 54 },{ name: '小田急相模原', offset: 57 },{ name: '相武台前', offset: 59 },
        { name: '座間', offset: 61 },    { name: '海老名', offset: 64 },  { name: '厚木', offset: 67 },
        { name: '本厚木', offset: 69 },  { name: '愛甲石田', offset: 72 },{ name: '伊勢原', offset: 75 },
        { name: '鶴巻温泉', offset: 79 },{ name: '東海大学前', offset: 81 },{ name: '秦野', offset: 83 },
        { name: '渋沢', offset: 86 },    { name: '新松田', offset: 89 },  { name: '開成', offset: 91 },
        { name: '小田原', offset: 100 },
      ],
      patterns: [
        { fromMin: m(5),     toMin: m(7),    intervalMin: 10, type: '各停', destination: '小田原方面' },
        { fromMin: m(5,20),  toMin: m(7),    intervalMin: 20, type: '急行', destination: '小田原行き' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 6,  type: '各停', destination: '小田原方面' },
        { fromMin: m(7,10),  toMin: m(9,30), intervalMin: 10, type: '急行', destination: '小田原行き' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 8,  type: '各停', destination: '小田原方面' },
        { fromMin: m(9,40),  toMin: m(17),   intervalMin: 15, type: '急行', destination: '小田原行き' },
        { fromMin: m(9,45),  toMin: m(17),   intervalMin: 30, type: '特急ロマンスカー', destination: '小田原行き' },
        { fromMin: m(17),    toMin: m(21),   intervalMin: 6,  type: '各停', destination: '小田原方面' },
        { fromMin: m(17,10), toMin: m(21),   intervalMin: 10, type: '急行', destination: '小田原行き' },
        { fromMin: m(21),    toMin: m(24,30),intervalMin: 10, type: '各停', destination: '小田原方面' },
        { fromMin: m(21,15), toMin: m(23),   intervalMin: 20, type: '急行', destination: '小田原行き' },
      ],
    },
    {
      label: '新宿方面',
      stations: [
        { name: '小田原', offset: 0 },   { name: '開成', offset: 9 },    { name: '新松田', offset: 11 },
        { name: '渋沢', offset: 14 },    { name: '秦野', offset: 17 },    { name: '東海大学前', offset: 19 },
        { name: '鶴巻温泉', offset: 21 },{ name: '伊勢原', offset: 25 },  { name: '愛甲石田', offset: 28 },
        { name: '本厚木', offset: 31 },  { name: '厚木', offset: 33 },    { name: '海老名', offset: 36 },
        { name: '座間', offset: 39 },    { name: '相武台前', offset: 41 },{ name: '小田急相模原', offset: 43 },
        { name: '相模大野', offset: 46 },{ name: '町田', offset: 50 },    { name: '玉川学園前', offset: 52 },
        { name: '鶴川', offset: 54 },    { name: '柿生', offset: 56 },    { name: '新百合ヶ丘', offset: 59 },
        { name: '百合ヶ丘', offset: 62 },{ name: '読売ランド前', offset: 63 },{ name: '生田', offset: 65 },
        { name: '向ヶ丘遊園', offset: 67 },{ name: '登戸', offset: 70 },  { name: '和泉多摩川', offset: 72 },
        { name: '狛江', offset: 74 },    { name: '喜多見', offset: 76 },  { name: '成城学園前', offset: 78 },
        { name: '祖師ヶ谷大蔵', offset: 80 },{ name: '千歳船橋', offset: 82 },{ name: '経堂', offset: 84 },
        { name: '豪徳寺', offset: 85 },  { name: '梅ヶ丘', offset: 86 },  { name: '世田谷代田', offset: 87 },
        { name: '下北沢', offset: 89 },  { name: '東北沢', offset: 90 },  { name: '代々木上原', offset: 92 },
        { name: '代々木八幡', offset: 94 },{ name: '参宮橋', offset: 96 },{ name: '南新宿', offset: 98 },
        { name: '新宿', offset: 100 },
      ],
      patterns: [
        { fromMin: m(5),     toMin: m(7),    intervalMin: 10, type: '各停', destination: '新宿方面' },
        { fromMin: m(5,20),  toMin: m(7),    intervalMin: 20, type: '急行', destination: '新宿行き' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 6,  type: '各停', destination: '新宿方面' },
        { fromMin: m(7,10),  toMin: m(9,30), intervalMin: 10, type: '急行', destination: '新宿行き' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 8,  type: '各停', destination: '新宿方面' },
        { fromMin: m(9,40),  toMin: m(17),   intervalMin: 15, type: '急行', destination: '新宿行き' },
        { fromMin: m(17),    toMin: m(21),   intervalMin: 6,  type: '各停', destination: '新宿方面' },
        { fromMin: m(17,10), toMin: m(21),   intervalMin: 10, type: '急行', destination: '新宿行き' },
        { fromMin: m(21),    toMin: m(24,30),intervalMin: 10, type: '各停', destination: '新宿方面' },
      ],
    },
  ],
};

const keikyuData: LineTimetableData = {
  key: 'keikyuLine',
  name: '京急本線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年3月ダイヤ改正版（概算）',
  directions: [
    {
      label: '横浜・三浦海岸方面',
      stations: [
        { name: '泉岳寺', offset: 0 },   { name: '品川', offset: 2 },    { name: '北品川', offset: 4 },
        { name: '新馬場', offset: 6 },   { name: '青物横丁', offset: 8 },{ name: '鮫洲', offset: 10 },
        { name: '立会川', offset: 12 },  { name: '大森海岸', offset: 14 },{ name: '平和島', offset: 16 },
        { name: '大森町', offset: 18 },  { name: '梅屋敷', offset: 20 }, { name: '京急蒲田', offset: 22 },
        { name: '雑色', offset: 25 },    { name: '六郷土手', offset: 27 },{ name: '京急川崎', offset: 29 },
        { name: '港町', offset: 30 },    { name: '鶴見市場', offset: 32 },{ name: '京急鶴見', offset: 34 },
        { name: '花月園前', offset: 35 },{ name: '生麦', offset: 37 },   { name: '京急新子安', offset: 39 },
        { name: '子安', offset: 41 },    { name: '神奈川新町', offset: 42 },{ name: '仲木戸', offset: 43 },
        { name: '神奈川', offset: 44 },  { name: '横浜', offset: 46 },
      ],
      patterns: [
        { fromMin: m(5),     toMin: m(7),    intervalMin: 7,  type: '普通', destination: '横浜方面' },
        { fromMin: m(5,10),  toMin: m(7),    intervalMin: 15, type: '急行', destination: '横浜方面' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 5,  type: '普通', destination: '横浜方面' },
        { fromMin: m(7,5),   toMin: m(9,30), intervalMin: 8,  type: '急行', destination: '横浜・三崎口方面' },
        { fromMin: m(7,10),  toMin: m(9,30), intervalMin: 10, type: '快特', destination: '三崎口行き' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 7,  type: '普通', destination: '横浜方面' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 10, type: '急行', destination: '横浜方面' },
        { fromMin: m(9,40),  toMin: m(17),   intervalMin: 15, type: '快特', destination: '三崎口方面' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 5,  type: '普通', destination: '横浜方面' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 8,  type: '急行', destination: '横浜方面' },
        { fromMin: m(17,10), toMin: m(20,30),intervalMin: 10, type: '快特', destination: '三崎口方面' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 8,  type: '普通', destination: '横浜方面' },
        { fromMin: m(20,35), toMin: m(24,30),intervalMin: 12, type: '急行', destination: '横浜方面' },
      ],
    },
    {
      label: '品川・都心方面',
      stations: [
        { name: '横浜', offset: 0 },    { name: '神奈川', offset: 2 },   { name: '仲木戸', offset: 3 },
        { name: '神奈川新町', offset: 4 },{ name: '子安', offset: 5 },   { name: '京急新子安', offset: 7 },
        { name: '生麦', offset: 9 },    { name: '花月園前', offset: 11 }, { name: '京急鶴見', offset: 12 },
        { name: '鶴見市場', offset: 14 },{ name: '港町', offset: 16 },   { name: '京急川崎', offset: 17 },
        { name: '六郷土手', offset: 19 },{ name: '雑色', offset: 21 },   { name: '京急蒲田', offset: 24 },
        { name: '梅屋敷', offset: 26 }, { name: '大森町', offset: 28 },  { name: '平和島', offset: 30 },
        { name: '大森海岸', offset: 32 },{ name: '立会川', offset: 34 }, { name: '鮫洲', offset: 36 },
        { name: '青物横丁', offset: 38 },{ name: '新馬場', offset: 40 }, { name: '北品川', offset: 42 },
        { name: '品川', offset: 44 },   { name: '泉岳寺', offset: 46 },
      ],
      patterns: [
        { fromMin: m(5),     toMin: m(7),    intervalMin: 7,  type: '普通', destination: '品川方面' },
        { fromMin: m(5,10),  toMin: m(7),    intervalMin: 15, type: '急行', destination: '品川・都心方面' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 5,  type: '普通', destination: '品川方面' },
        { fromMin: m(7,5),   toMin: m(9,30), intervalMin: 8,  type: '急行', destination: '品川・都心方面' },
        { fromMin: m(7,10),  toMin: m(9,30), intervalMin: 10, type: '快特', destination: '都心方面' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 7,  type: '普通', destination: '品川方面' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 10, type: '急行', destination: '品川方面' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 5,  type: '普通', destination: '品川方面' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 8,  type: '急行', destination: '品川方面' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 8,  type: '普通', destination: '品川方面' },
      ],
    },
  ],
};

const keihinData: LineTimetableData = {
  key: 'keihinTohoku',
  name: '京浜東北線・根岸線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年3月ダイヤ改正版（概算）',
  directions: [
    {
      label: '南行き（品川・横浜・大船方面）',
      stations: [
        { name: '大宮', offset: 0 },      { name: 'さいたま新都心', offset: 4 },{ name: '与野', offset: 7 },
        { name: '北浦和', offset: 9 },    { name: '浦和', offset: 11 },  { name: '南浦和', offset: 14 },
        { name: '蕨', offset: 17 },       { name: '西川口', offset: 20 }, { name: '川口', offset: 22 },
        { name: '赤羽', offset: 26 },     { name: '東十条', offset: 29 }, { name: '王子', offset: 31 },
        { name: '上中里', offset: 33 },   { name: '田端', offset: 35 },   { name: '西日暮里', offset: 37 },
        { name: '日暮里', offset: 39 },   { name: '鶯谷', offset: 41 },   { name: '上野', offset: 44 },
        { name: '御徒町', offset: 46 },   { name: '秋葉原', offset: 49 }, { name: '神田', offset: 52 },
        { name: '東京', offset: 55 },     { name: '有楽町', offset: 57 }, { name: '新橋', offset: 59 },
        { name: '浜松町', offset: 61 },   { name: '田町', offset: 63 },   { name: '高輪ゲートウェイ', offset: 65 },
        { name: '品川', offset: 67 },     { name: '大井町', offset: 70 }, { name: '大森', offset: 73 },
        { name: '蒲田', offset: 76 },     { name: '川崎', offset: 80 },   { name: '鶴見', offset: 83 },
        { name: '新子安', offset: 85 },   { name: '東神奈川', offset: 87 },{ name: '横浜', offset: 90 },
        { name: '桜木町', offset: 92 },   { name: '関内', offset: 94 },   { name: '石川町', offset: 96 },
        { name: '山手', offset: 99 },     { name: '根岸', offset: 102 },  { name: '磯子', offset: 105 },
        { name: '新杉田', offset: 108 },  { name: '洋光台', offset: 111 },{ name: '港南台', offset: 114 },
        { name: '本郷台', offset: 118 },  { name: '大船', offset: 124 },
      ],
      patterns: [
        { fromMin: m(4,30),  toMin: m(7),    intervalMin: 7,  type: '各停', destination: '横浜・大船方面' },
        { fromMin: m(7),     toMin: m(10),   intervalMin: 3,  type: '各停', destination: '横浜・大船方面' },
        { fromMin: m(7,30),  toMin: m(10),   intervalMin: 10, type: '快速', destination: '大船行き' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 5,  type: '各停', destination: '横浜・大船方面' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 10, type: '快速', destination: '大船行き' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 3,  type: '各停', destination: '横浜・大船方面' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 6,  type: '各停', destination: '横浜・大船方面' },
      ],
    },
    {
      label: '北行き（東京・上野・大宮方面）',
      stations: [
        { name: '大船', offset: 0 },      { name: '本郷台', offset: 6 },  { name: '港南台', offset: 10 },
        { name: '洋光台', offset: 13 },   { name: '新杉田', offset: 16 }, { name: '磯子', offset: 19 },
        { name: '根岸', offset: 22 },     { name: '山手', offset: 25 },   { name: '石川町', offset: 28 },
        { name: '関内', offset: 30 },     { name: '桜木町', offset: 32 }, { name: '横浜', offset: 34 },
        { name: '東神奈川', offset: 37 }, { name: '新子安', offset: 39 }, { name: '鶴見', offset: 41 },
        { name: '川崎', offset: 44 },     { name: '蒲田', offset: 48 },   { name: '大森', offset: 51 },
        { name: '大井町', offset: 54 },   { name: '品川', offset: 57 },   { name: '高輪ゲートウェイ', offset: 59 },
        { name: '田町', offset: 61 },     { name: '浜松町', offset: 63 }, { name: '新橋', offset: 65 },
        { name: '有楽町', offset: 67 },   { name: '東京', offset: 69 },   { name: '神田', offset: 72 },
        { name: '秋葉原', offset: 75 },   { name: '御徒町', offset: 78 }, { name: '上野', offset: 80 },
        { name: '鶯谷', offset: 83 },     { name: '日暮里', offset: 85 }, { name: '西日暮里', offset: 87 },
        { name: '田端', offset: 89 },     { name: '上中里', offset: 91 }, { name: '王子', offset: 93 },
        { name: '東十条', offset: 95 },   { name: '赤羽', offset: 99 },   { name: '川口', offset: 102 },
        { name: '西川口', offset: 104 },  { name: '蕨', offset: 107 },    { name: '南浦和', offset: 110 },
        { name: '浦和', offset: 113 },    { name: '北浦和', offset: 115 },{ name: '与野', offset: 117 },
        { name: 'さいたま新都心', offset: 119 },{ name: '大宮', offset: 124 },
      ],
      patterns: [
        { fromMin: m(4,30),  toMin: m(7),    intervalMin: 7,  type: '各停', destination: '上野・大宮方面' },
        { fromMin: m(7),     toMin: m(10),   intervalMin: 3,  type: '各停', destination: '上野・大宮方面' },
        { fromMin: m(7,30),  toMin: m(10),   intervalMin: 10, type: '快速', destination: '大宮行き' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 5,  type: '各停', destination: '上野・大宮方面' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 10, type: '快速', destination: '大宮行き' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 3,  type: '各停', destination: '上野・大宮方面' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 6,  type: '各停', destination: '上野・大宮方面' },
      ],
    },
  ],
};

// ── 全路線データ一覧 ──────────────────────────────────
export const timetableLines: LineTimetableData[] = [
  yamanoteData,
  tokaidoData,
  chuoData,
  ginzaData,
  marunouchi,
  toyokoData,
  denEnToshiData,
  odakyuData,
  keikyuData,
  keihinData,
];

// ── 公開API ──────────────────────────────────────────

/** 路線キーから時刻表データを取得 */
export function getLineTimetable(lineKey: string): LineTimetableData | null {
  return timetableLines.find(l => l.key === lineKey) ?? null;
}

/** 対応路線かどうか確認 */
export function hasTimetableData(lineKey: string): boolean {
  return timetableLines.some(l => l.key === lineKey);
}

/**
 * 指定駅・方向・時刻以降の次の発車列車を取得
 * @param lineKey  路線キー
 * @param stationName 駅名
 * @param directionIndex 方向インデックス (0 or 1)
 * @param afterTime  "HH:MM" 形式の時刻
 * @param count   取得件数
 */
export function getNextDepartures(
  lineKey: string,
  stationName: string,
  directionIndex: number,
  afterTime: string,
  count: number
): Departure[] {
  const lineData = getLineTimetable(lineKey);
  if (!lineData || directionIndex >= lineData.directions.length) return [];

  const direction = lineData.directions[directionIndex];
  const stationEntry = direction.stations.find(s => s.name === stationName);
  if (!stationEntry) return [];

  const platform = getPlatform(lineKey, directionIndex, stationName);
  const baseDepartures = genBase(direction.patterns);
  const stationDepartures = shiftDeps(baseDepartures, stationEntry.offset)
    .map(d => ({ ...d, platform }));

  const [ah, am] = afterTime.split(':').map(Number);
  const afterMin = ah * 60 + am;

  const filtered = stationDepartures.filter(d => {
    const [h, mm] = d.time.split(':').map(Number);
    return h * 60 + mm >= afterMin;
  });

  if (filtered.length >= count) return filtered.slice(0, count);

  // 終電を過ぎた場合は翌日始発から補完
  const nextDay = stationDepartures.slice(0, count - filtered.length);
  return [...filtered, ...nextDay].slice(0, count);
}

/**
 * 指定時刻の前後の列車を取得
 * @param prevCount  centerTime より前の列車数
 * @param nextCount  centerTime 以降の列車数
 */
export function getDeparturesAround(
  lineKey: string,
  stationName: string,
  directionIndex: number,
  centerTime: string,
  prevCount: number,
  nextCount: number
): { prev: Departure[], next: Departure[] } {
  const lineData = getLineTimetable(lineKey);
  if (!lineData || directionIndex >= lineData.directions.length) return { prev: [], next: [] };

  const direction = lineData.directions[directionIndex];
  const stationEntry = direction.stations.find(s => s.name === stationName);
  if (!stationEntry) return { prev: [], next: [] };

  const platform = getPlatform(lineKey, directionIndex, stationName);
  const baseDepartures = genBase(direction.patterns);
  // 2日分生成して前後を確実に取れるようにする
  const dayShift = 1440;
  const allDeps = [
    ...shiftDeps(baseDepartures, stationEntry.offset - dayShift),
    ...shiftDeps(baseDepartures, stationEntry.offset),
    ...shiftDeps(baseDepartures, stationEntry.offset + dayShift),
  ].map(d => ({ ...d, platform }));

  const [ch, cm] = centerTime.split(':').map(Number);
  const centerMin = ch * 60 + cm;

  // centerTime の実際の総分数（日をまたぐ判定のため正規化しない）
  // 全体を時刻文字列の "HH:MM" で比較するのではなく totalMin で比較
  // allDeps は shiftDeps で生成されており時刻は 00:00〜47:59 の範囲になる場合がある
  // そこで元の totalMin ベースで比較できるよう変換
  const toTotalMin = (time: string): number => {
    const [h, mm] = time.split(':').map(Number);
    return h * 60 + mm;
  };

  const prevDeps = allDeps
    .filter(d => toTotalMin(d.time) < centerMin)
    .slice(-prevCount);
  const nextDeps = allDeps
    .filter(d => toTotalMin(d.time) >= centerMin)
    .slice(0, nextCount);

  return { prev: prevDeps, next: nextDeps };
}

/**
 * ルートセグメントの方向インデックスを判定
 * fromStation → toStation の方向に合う direction を返す
 */
export function getDirectionIndex(
  lineKey: string,
  fromStation: string,
  toStation: string
): number {
  const lineData = getLineTimetable(lineKey);
  if (!lineData) return 0;

  const dir0 = lineData.directions[0];
  const fromIdx = dir0.stations.findIndex(s => s.name === fromStation);
  const toIdx   = dir0.stations.findIndex(s => s.name === toStation);

  if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) return 0;
  if (fromIdx !== -1 && toIdx !== -1 && fromIdx > toIdx) return 1;

  // どちらかが見つからない場合は direction 1 も確認
  const dir1 = lineData.directions[1];
  if (!dir1) return 0;
  const fromIdx1 = dir1.stations.findIndex(s => s.name === fromStation);
  const toIdx1   = dir1.stations.findIndex(s => s.name === toStation);
  if (fromIdx1 !== -1 && toIdx1 !== -1 && fromIdx1 < toIdx1) return 1;

  return 0;
}
