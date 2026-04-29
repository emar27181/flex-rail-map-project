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
  toward?: string;     // 方面 (例: "小田原方面") — 行き先の括弧内に表示
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
  toward?: string;  // 方面 (例: "小田原方面")
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
// 出典: OpenStreetMap Overpass API + 各鉄道会社公式情報（2025年）
const platformMap: Record<string, string> = {
  // ── 山手線 内回り(0): 品川→渋谷→新宿→池袋→上野→東京 / 外回り(1): 逆方向 ──
  'yamanote_0_東京': '1番線',    'yamanote_1_東京': '2番線',
  'yamanote_0_神田': '1番線',    'yamanote_1_神田': '2番線',
  'yamanote_0_秋葉原': '4番線',  'yamanote_1_秋葉原': '3番線',
  'yamanote_0_御徒町': '1番線',  'yamanote_1_御徒町': '2番線',
  'yamanote_0_上野': '3番線',    'yamanote_1_上野': '2番線',
  'yamanote_0_鶯谷': '1番線',    'yamanote_1_鶯谷': '2番線',
  'yamanote_0_日暮里': '2番線',  'yamanote_1_日暮里': '1番線',
  'yamanote_0_西日暮里': '2番線','yamanote_1_西日暮里': '1番線',
  'yamanote_0_田端': '2番線',    'yamanote_1_田端': '1番線',
  'yamanote_0_駒込': '1番線',    'yamanote_1_駒込': '2番線',
  'yamanote_0_巣鴨': '1番線',    'yamanote_1_巣鴨': '2番線',
  'yamanote_0_大塚': '1番線',    'yamanote_1_大塚': '2番線',
  'yamanote_0_池袋': '6番線',    'yamanote_1_池袋': '5番線',
  'yamanote_0_目白': '1番線',    'yamanote_1_目白': '2番線',
  'yamanote_0_高田馬場': '2番線','yamanote_1_高田馬場': '1番線',
  'yamanote_0_新大久保': '1番線','yamanote_1_新大久保': '2番線',
  'yamanote_0_新宿': '15番線',   'yamanote_1_新宿': '14番線',
  'yamanote_0_代々木': '1番線',  'yamanote_1_代々木': '2番線',
  'yamanote_0_原宿': '2番線',    'yamanote_1_原宿': '1番線',
  'yamanote_0_渋谷': '1番線',    'yamanote_1_渋谷': '2番線',
  'yamanote_0_恵比寿': '2番線',  'yamanote_1_恵比寿': '1番線',
  'yamanote_0_目黒': '2番線',    'yamanote_1_目黒': '1番線',
  'yamanote_0_五反田': '2番線',  'yamanote_1_五反田': '1番線',
  'yamanote_0_大崎': '2番線',    'yamanote_1_大崎': '1番線',
  'yamanote_0_品川': '1番線',    'yamanote_1_品川': '3番線',
  'yamanote_0_田町': '1番線',    'yamanote_1_田町': '2番線',
  'yamanote_0_浜松町': '1番線',  'yamanote_1_浜松町': '2番線',
  'yamanote_0_新橋': '1番線',    'yamanote_1_新橋': '2番線',
  'yamanote_0_有楽町': '1番線',  'yamanote_1_有楽町': '2番線',

  // ── 東海道線 下り(0): 東京→小田原 / 上り(1): 小田原→東京 ──
  'jrTokaidoMainLine_0_東京': '9番線',   'jrTokaidoMainLine_1_東京': '8番線',
  'jrTokaidoMainLine_0_新橋': '4番線',   'jrTokaidoMainLine_1_新橋': '3番線',
  'jrTokaidoMainLine_0_品川': '7番線',   'jrTokaidoMainLine_1_品川': '8番線',
  'jrTokaidoMainLine_0_川崎': '1番線',   'jrTokaidoMainLine_1_川崎': '2番線',
  'jrTokaidoMainLine_0_横浜': '6番線',   'jrTokaidoMainLine_1_横浜': '5番線',
  'jrTokaidoMainLine_0_戸塚': '3番線',   'jrTokaidoMainLine_1_戸塚': '4番線',
  'jrTokaidoMainLine_0_大船': '2番線',   'jrTokaidoMainLine_1_大船': '3番線',
  'jrTokaidoMainLine_0_藤沢': '3番線',   'jrTokaidoMainLine_1_藤沢': '4番線',
  'jrTokaidoMainLine_0_辻堂': '1番線',   'jrTokaidoMainLine_1_辻堂': '2番線',
  'jrTokaidoMainLine_0_茅ヶ崎': '1番線', 'jrTokaidoMainLine_1_茅ヶ崎': '2番線',
  'jrTokaidoMainLine_0_平塚': '1番線',   'jrTokaidoMainLine_1_平塚': '2番線',
  'jrTokaidoMainLine_0_二宮': '1番線',   'jrTokaidoMainLine_1_二宮': '2番線',
  'jrTokaidoMainLine_0_国府津': '1番線', 'jrTokaidoMainLine_1_国府津': '2番線',
  'jrTokaidoMainLine_0_鴨宮': '1番線',   'jrTokaidoMainLine_1_鴨宮': '2番線',
  'jrTokaidoMainLine_0_小田原': '3番線', 'jrTokaidoMainLine_1_小田原': '4番線',

  // ── 京浜東北線 南行(0): 大宮→大船 / 北行(1): 大船→大宮 ──
  'keihinTohoku_0_東京': '3番線',   'keihinTohoku_1_東京': '4番線',
  'keihinTohoku_0_有楽町': '3番線', 'keihinTohoku_1_有楽町': '4番線',
  'keihinTohoku_0_新橋': '2番線',   'keihinTohoku_1_新橋': '1番線',
  'keihinTohoku_0_浜松町': '3番線', 'keihinTohoku_1_浜松町': '4番線',
  'keihinTohoku_0_田町': '3番線',   'keihinTohoku_1_田町': '4番線',
  'keihinTohoku_0_品川': '4番線',   'keihinTohoku_1_品川': '5番線',
  'keihinTohoku_0_大井町': '1番線', 'keihinTohoku_1_大井町': '2番線',
  'keihinTohoku_0_大森': '1番線',   'keihinTohoku_1_大森': '2番線',
  'keihinTohoku_0_蒲田': '3番線',   'keihinTohoku_1_蒲田': '4番線',
  'keihinTohoku_0_川崎': '3番線',   'keihinTohoku_1_川崎': '4番線',
  'keihinTohoku_0_鶴見': '1番線',   'keihinTohoku_1_鶴見': '2番線',
  'keihinTohoku_0_横浜': '3番線',   'keihinTohoku_1_横浜': '4番線',
  'keihinTohoku_0_桜木町': '1番線', 'keihinTohoku_1_桜木町': '2番線',
  'keihinTohoku_0_関内': '1番線',   'keihinTohoku_1_関内': '2番線',
  'keihinTohoku_0_石川町': '1番線', 'keihinTohoku_1_石川町': '2番線',
  'keihinTohoku_0_山手': '1番線',   'keihinTohoku_1_山手': '2番線',
  'keihinTohoku_0_根岸': '1番線',   'keihinTohoku_1_根岸': '2番線',
  'keihinTohoku_0_磯子': '1番線',   'keihinTohoku_1_磯子': '2番線',
  'keihinTohoku_0_新杉田': '1番線', 'keihinTohoku_1_新杉田': '2番線',
  'keihinTohoku_0_洋光台': '1番線', 'keihinTohoku_1_洋光台': '2番線',
  'keihinTohoku_0_港南台': '1番線', 'keihinTohoku_1_港南台': '2番線',
  'keihinTohoku_0_本郷台': '1番線', 'keihinTohoku_1_本郷台': '2番線',
  'keihinTohoku_0_大船': '5番線',   'keihinTohoku_1_大船': '6番線',
  // 北側
  'keihinTohoku_0_秋葉原': '1番線', 'keihinTohoku_1_秋葉原': '2番線',
  'keihinTohoku_0_神田': '1番線',   'keihinTohoku_1_神田': '2番線',
  'keihinTohoku_0_上野': '1番線',   'keihinTohoku_1_上野': '2番線',
  'keihinTohoku_0_尾久': '1番線',   'keihinTohoku_1_尾久': '2番線',
  'keihinTohoku_0_赤羽': '3番線',   'keihinTohoku_1_赤羽': '4番線',

  // ── 中央・総武線 下り(0): 東京→高尾 / 上り(1): 高尾→東京 ──
  'chuo_0_東京': '1番線',    'chuo_1_東京': '2番線',
  'chuo_0_神田': '1番線',    'chuo_1_神田': '2番線',
  'chuo_0_御茶ノ水': '1番線','chuo_1_御茶ノ水': '2番線',
  'chuo_0_四ツ谷': '1番線',  'chuo_1_四ツ谷': '2番線',
  'chuo_0_新宿': '8番線',    'chuo_1_新宿': '7番線',
  'chuo_0_中野': '3番線',    'chuo_1_中野': '4番線',
  'chuo_0_荻窪': '3番線',    'chuo_1_荻窪': '4番線',
  'chuo_0_吉祥寺': '3番線',  'chuo_1_吉祥寺': '4番線',
  'chuo_0_三鷹': '5番線',    'chuo_1_三鷹': '6番線',
  'chuo_0_武蔵境': '1番線',  'chuo_1_武蔵境': '2番線',
  'chuo_0_東小金井': '1番線','chuo_1_東小金井': '2番線',
  'chuo_0_武蔵小金井': '1番線','chuo_1_武蔵小金井': '2番線',
  'chuo_0_国分寺': '3番線',  'chuo_1_国分寺': '4番線',
  'chuo_0_西国分寺': '1番線','chuo_1_西国分寺': '2番線',
  'chuo_0_国立': '1番線',    'chuo_1_国立': '2番線',
  'chuo_0_立川': '4番線',    'chuo_1_立川': '5番線',
  'chuo_0_日野': '1番線',    'chuo_1_日野': '2番線',
  'chuo_0_豊田': '1番線',    'chuo_1_豊田': '2番線',
  'chuo_0_八王子': '4番線',  'chuo_1_八王子': '3番線',
  'chuo_0_西八王子': '1番線','chuo_1_西八王子': '2番線',
  'chuo_0_高尾': '1番線',    'chuo_1_高尾': '2番線',
  // 総武線区間
  'chuo_0_秋葉原': '3番線',  'chuo_1_秋葉原': '4番線',
  'chuo_0_浅草橋': '1番線',  'chuo_1_浅草橋': '2番線',
  'chuo_0_両国': '1番線',    'chuo_1_両国': '2番線',
  'chuo_0_錦糸町': '1番線',  'chuo_1_錦糸町': '2番線',

  // ── 銀座線 浅草→渋谷方向(0) / 渋谷→浅草方向(1) ──
  'ginzaLine_0_浅草': '1番線',   'ginzaLine_1_浅草': '2番線',
  'ginzaLine_0_田原町': '1番線', 'ginzaLine_1_田原町': '2番線',
  'ginzaLine_0_稲荷町': '1番線', 'ginzaLine_1_稲荷町': '2番線',
  'ginzaLine_0_上野': '1番線',   'ginzaLine_1_上野': '2番線',
  'ginzaLine_0_上野広小路': '1番線','ginzaLine_1_上野広小路': '2番線',
  'ginzaLine_0_末広町': '1番線', 'ginzaLine_1_末広町': '2番線',
  'ginzaLine_0_神田': '1番線',   'ginzaLine_1_神田': '2番線',
  'ginzaLine_0_三越前': '1番線', 'ginzaLine_1_三越前': '2番線',
  'ginzaLine_0_日本橋': '1番線', 'ginzaLine_1_日本橋': '2番線',
  'ginzaLine_0_京橋': '1番線',   'ginzaLine_1_京橋': '2番線',
  'ginzaLine_0_銀座': '1番線',   'ginzaLine_1_銀座': '2番線',
  'ginzaLine_0_新橋': '1番線',   'ginzaLine_1_新橋': '2番線',
  'ginzaLine_0_虎ノ門': '1番線', 'ginzaLine_1_虎ノ門': '2番線',
  'ginzaLine_0_溜池山王': '1番線','ginzaLine_1_溜池山王': '2番線',
  'ginzaLine_0_赤坂見附': '1番線','ginzaLine_1_赤坂見附': '2番線',
  'ginzaLine_0_青山一丁目': '1番線','ginzaLine_1_青山一丁目': '2番線',
  'ginzaLine_0_外苑前': '1番線', 'ginzaLine_1_外苑前': '2番線',
  'ginzaLine_0_表参道': '1番線', 'ginzaLine_1_表参道': '2番線',
  'ginzaLine_0_渋谷': '1番線',   'ginzaLine_1_渋谷': '2番線',

  // ── 丸ノ内線 池袋→荻窪方向(0) / 荻窪→池袋方向(1) ──
  'marunouchiLine_0_池袋': '1番線',    'marunouchiLine_1_池袋': '2番線',
  'marunouchiLine_0_新大塚': '1番線',  'marunouchiLine_1_新大塚': '2番線',
  'marunouchiLine_0_茗荷谷': '1番線',  'marunouchiLine_1_茗荷谷': '2番線',
  'marunouchiLine_0_後楽園': '1番線',  'marunouchiLine_1_後楽園': '2番線',
  'marunouchiLine_0_本郷三丁目': '1番線','marunouchiLine_1_本郷三丁目': '2番線',
  'marunouchiLine_0_御茶ノ水': '1番線','marunouchiLine_1_御茶ノ水': '2番線',
  'marunouchiLine_0_淡路町': '1番線',  'marunouchiLine_1_淡路町': '2番線',
  'marunouchiLine_0_大手町': '1番線',  'marunouchiLine_1_大手町': '2番線',
  'marunouchiLine_0_東京': '1番線',    'marunouchiLine_1_東京': '2番線',
  'marunouchiLine_0_銀座': '1番線',    'marunouchiLine_1_銀座': '2番線',
  'marunouchiLine_0_霞ヶ関': '1番線',  'marunouchiLine_1_霞ヶ関': '2番線',
  'marunouchiLine_0_国会議事堂前': '1番線','marunouchiLine_1_国会議事堂前': '2番線',
  'marunouchiLine_0_赤坂見附': '1番線','marunouchiLine_1_赤坂見附': '2番線',
  'marunouchiLine_0_四ツ谷': '1番線',  'marunouchiLine_1_四ツ谷': '2番線',
  'marunouchiLine_0_四谷三丁目': '1番線','marunouchiLine_1_四谷三丁目': '2番線',
  'marunouchiLine_0_新宿御苑前': '1番線','marunouchiLine_1_新宿御苑前': '2番線',
  'marunouchiLine_0_新宿三丁目': '1番線','marunouchiLine_1_新宿三丁目': '2番線',
  'marunouchiLine_0_新宿': '4番線',    'marunouchiLine_1_新宿': '3番線',
  'marunouchiLine_0_西新宿': '1番線',  'marunouchiLine_1_西新宿': '2番線',
  'marunouchiLine_0_中野坂上': '1番線','marunouchiLine_1_中野坂上': '2番線',
  'marunouchiLine_0_新中野': '1番線',  'marunouchiLine_1_新中野': '2番線',
  'marunouchiLine_0_東高円寺': '1番線','marunouchiLine_1_東高円寺': '2番線',
  'marunouchiLine_0_新高円寺': '1番線','marunouchiLine_1_新高円寺': '2番線',
  'marunouchiLine_0_南阿佐ヶ谷': '1番線','marunouchiLine_1_南阿佐ヶ谷': '2番線',
  'marunouchiLine_0_荻窪': '1番線',    'marunouchiLine_1_荻窪': '2番線',

  // ── 東急東横線 渋谷→横浜方向(0) / 横浜→渋谷方向(1) ──
  'tokyuToyokoLine_0_渋谷': '1番線',    'tokyuToyokoLine_1_渋谷': '2番線',
  'tokyuToyokoLine_0_代官山': '1番線',  'tokyuToyokoLine_1_代官山': '2番線',
  'tokyuToyokoLine_0_中目黒': '1番線',  'tokyuToyokoLine_1_中目黒': '2番線',
  'tokyuToyokoLine_0_祐天寺': '1番線',  'tokyuToyokoLine_1_祐天寺': '2番線',
  'tokyuToyokoLine_0_学芸大学': '1番線','tokyuToyokoLine_1_学芸大学': '2番線',
  'tokyuToyokoLine_0_都立大学': '1番線','tokyuToyokoLine_1_都立大学': '2番線',
  'tokyuToyokoLine_0_自由が丘': '1番線','tokyuToyokoLine_1_自由が丘': '2番線',
  'tokyuToyokoLine_0_田園調布': '3番線','tokyuToyokoLine_1_田園調布': '4番線',
  'tokyuToyokoLine_0_多摩川': '3番線',  'tokyuToyokoLine_1_多摩川': '4番線',
  'tokyuToyokoLine_0_新丸子': '1番線',  'tokyuToyokoLine_1_新丸子': '2番線',
  'tokyuToyokoLine_0_武蔵小杉': '3番線','tokyuToyokoLine_1_武蔵小杉': '4番線',
  'tokyuToyokoLine_0_元住吉': '1番線',  'tokyuToyokoLine_1_元住吉': '2番線',
  'tokyuToyokoLine_0_日吉': '3番線',    'tokyuToyokoLine_1_日吉': '4番線',
  'tokyuToyokoLine_0_綱島': '1番線',    'tokyuToyokoLine_1_綱島': '2番線',
  'tokyuToyokoLine_0_大倉山': '1番線',  'tokyuToyokoLine_1_大倉山': '2番線',
  'tokyuToyokoLine_0_菊名': '1番線',    'tokyuToyokoLine_1_菊名': '2番線',
  'tokyuToyokoLine_0_妙蓮寺': '1番線',  'tokyuToyokoLine_1_妙蓮寺': '2番線',
  'tokyuToyokoLine_0_白楽': '1番線',    'tokyuToyokoLine_1_白楽': '2番線',
  'tokyuToyokoLine_0_東白楽': '1番線',  'tokyuToyokoLine_1_東白楽': '2番線',
  'tokyuToyokoLine_0_反町': '1番線',    'tokyuToyokoLine_1_反町': '2番線',
  'tokyuToyokoLine_0_横浜': '3番線',    'tokyuToyokoLine_1_横浜': '4番線',

  // ── 東急田園都市線 渋谷→中央林間方向(0) / 中央林間→渋谷方向(1) ──
  'tokyuDenEnToshiLine_0_渋谷': '3番線',    'tokyuDenEnToshiLine_1_渋谷': '4番線',
  'tokyuDenEnToshiLine_0_池尻大橋': '1番線','tokyuDenEnToshiLine_1_池尻大橋': '2番線',
  'tokyuDenEnToshiLine_0_三軒茶屋': '3番線','tokyuDenEnToshiLine_1_三軒茶屋': '4番線',
  'tokyuDenEnToshiLine_0_駒沢大学': '1番線','tokyuDenEnToshiLine_1_駒沢大学': '2番線',
  'tokyuDenEnToshiLine_0_桜新町': '1番線',  'tokyuDenEnToshiLine_1_桜新町': '2番線',
  'tokyuDenEnToshiLine_0_用賀': '1番線',    'tokyuDenEnToshiLine_1_用賀': '2番線',
  'tokyuDenEnToshiLine_0_二子玉川': '3番線','tokyuDenEnToshiLine_1_二子玉川': '4番線',
  'tokyuDenEnToshiLine_0_二子新地': '1番線','tokyuDenEnToshiLine_1_二子新地': '2番線',
  'tokyuDenEnToshiLine_0_高津': '1番線',    'tokyuDenEnToshiLine_1_高津': '2番線',
  'tokyuDenEnToshiLine_0_溝の口': '3番線',  'tokyuDenEnToshiLine_1_溝の口': '4番線',
  'tokyuDenEnToshiLine_0_梶が谷': '1番線',  'tokyuDenEnToshiLine_1_梶が谷': '2番線',
  'tokyuDenEnToshiLine_0_宮崎台': '1番線',  'tokyuDenEnToshiLine_1_宮崎台': '2番線',
  'tokyuDenEnToshiLine_0_宮前平': '1番線',  'tokyuDenEnToshiLine_1_宮前平': '2番線',
  'tokyuDenEnToshiLine_0_鷺沼': '1番線',    'tokyuDenEnToshiLine_1_鷺沼': '2番線',
  'tokyuDenEnToshiLine_0_たまプラーザ': '1番線','tokyuDenEnToshiLine_1_たまプラーザ': '2番線',
  'tokyuDenEnToshiLine_0_あざみ野': '1番線', 'tokyuDenEnToshiLine_1_あざみ野': '2番線',
  'tokyuDenEnToshiLine_0_江田': '1番線',    'tokyuDenEnToshiLine_1_江田': '2番線',
  'tokyuDenEnToshiLine_0_市が尾': '1番線',  'tokyuDenEnToshiLine_1_市が尾': '2番線',
  'tokyuDenEnToshiLine_0_藤が丘': '1番線',  'tokyuDenEnToshiLine_1_藤が丘': '2番線',
  'tokyuDenEnToshiLine_0_青葉台': '1番線',  'tokyuDenEnToshiLine_1_青葉台': '2番線',
  'tokyuDenEnToshiLine_0_田奈': '1番線',    'tokyuDenEnToshiLine_1_田奈': '2番線',
  'tokyuDenEnToshiLine_0_長津田': '3番線',  'tokyuDenEnToshiLine_1_長津田': '4番線',
  'tokyuDenEnToshiLine_0_つくし野': '1番線','tokyuDenEnToshiLine_1_つくし野': '2番線',
  'tokyuDenEnToshiLine_0_すずかけ台': '1番線','tokyuDenEnToshiLine_1_すずかけ台': '2番線',
  'tokyuDenEnToshiLine_0_南町田グランベリーパーク': '1番線','tokyuDenEnToshiLine_1_南町田グランベリーパーク': '2番線',
  'tokyuDenEnToshiLine_0_つきみ野': '1番線','tokyuDenEnToshiLine_1_つきみ野': '2番線',
  'tokyuDenEnToshiLine_0_中央林間': '1番線','tokyuDenEnToshiLine_1_中央林間': '2番線',

  // ── 小田急小田原線 下り(0): 新宿→小田原 / 上り(1): 小田原→新宿 ──
  'odakyuLine_0_新宿': '3番線',      'odakyuLine_1_新宿': '4番線',
  'odakyuLine_0_南新宿': '1番線',    'odakyuLine_1_南新宿': '2番線',
  'odakyuLine_0_参宮橋': '1番線',    'odakyuLine_1_参宮橋': '2番線',
  'odakyuLine_0_代々木八幡': '1番線','odakyuLine_1_代々木八幡': '2番線',
  'odakyuLine_0_代々木上原': '1番線','odakyuLine_1_代々木上原': '2番線',
  'odakyuLine_0_東北沢': '1番線',    'odakyuLine_1_東北沢': '2番線',
  'odakyuLine_0_下北沢': '2番線',    'odakyuLine_1_下北沢': '1番線',
  'odakyuLine_0_世田谷代田': '1番線','odakyuLine_1_世田谷代田': '2番線',
  'odakyuLine_0_梅ヶ丘': '1番線',    'odakyuLine_1_梅ヶ丘': '2番線',
  'odakyuLine_0_豪徳寺': '1番線',    'odakyuLine_1_豪徳寺': '2番線',
  'odakyuLine_0_経堂': '2番線',      'odakyuLine_1_経堂': '1番線',
  'odakyuLine_0_千歳船橋': '1番線',  'odakyuLine_1_千歳船橋': '2番線',
  'odakyuLine_0_祖師ヶ谷大蔵': '1番線','odakyuLine_1_祖師ヶ谷大蔵': '2番線',
  'odakyuLine_0_成城学園前': '2番線','odakyuLine_1_成城学園前': '1番線',
  'odakyuLine_0_喜多見': '1番線',    'odakyuLine_1_喜多見': '2番線',
  'odakyuLine_0_狛江': '1番線',      'odakyuLine_1_狛江': '2番線',
  'odakyuLine_0_和泉多摩川': '1番線','odakyuLine_1_和泉多摩川': '2番線',
  'odakyuLine_0_登戸': '3番線',      'odakyuLine_1_登戸': '4番線',
  'odakyuLine_0_向ヶ丘遊園': '1番線','odakyuLine_1_向ヶ丘遊園': '2番線',
  'odakyuLine_0_生田': '1番線',      'odakyuLine_1_生田': '2番線',
  'odakyuLine_0_読売ランド前': '1番線','odakyuLine_1_読売ランド前': '2番線',
  'odakyuLine_0_百合ヶ丘': '1番線',  'odakyuLine_1_百合ヶ丘': '2番線',
  'odakyuLine_0_新百合ヶ丘': '2番線','odakyuLine_1_新百合ヶ丘': '1番線',
  'odakyuLine_0_柿生': '1番線',      'odakyuLine_1_柿生': '2番線',
  'odakyuLine_0_鶴川': '1番線',      'odakyuLine_1_鶴川': '2番線',
  'odakyuLine_0_玉川学園前': '1番線','odakyuLine_1_玉川学園前': '2番線',
  'odakyuLine_0_町田': '2番線',      'odakyuLine_1_町田': '1番線',
  'odakyuLine_0_相模大野': '2番線',  'odakyuLine_1_相模大野': '1番線',
  'odakyuLine_0_小田急相模原': '1番線','odakyuLine_1_小田急相模原': '2番線',
  'odakyuLine_0_相武台前': '1番線',  'odakyuLine_1_相武台前': '2番線',
  'odakyuLine_0_座間': '1番線',      'odakyuLine_1_座間': '2番線',
  'odakyuLine_0_海老名': '3番線',    'odakyuLine_1_海老名': '4番線',
  'odakyuLine_0_厚木': '1番線',      'odakyuLine_1_厚木': '2番線',
  'odakyuLine_0_本厚木': '3番線',    'odakyuLine_1_本厚木': '4番線',
  'odakyuLine_0_愛甲石田': '1番線',  'odakyuLine_1_愛甲石田': '2番線',
  'odakyuLine_0_伊勢原': '1番線',    'odakyuLine_1_伊勢原': '2番線',
  'odakyuLine_0_鶴巻温泉': '1番線',  'odakyuLine_1_鶴巻温泉': '2番線',
  'odakyuLine_0_東海大学前': '1番線','odakyuLine_1_東海大学前': '2番線',
  'odakyuLine_0_秦野': '1番線',      'odakyuLine_1_秦野': '2番線',
  'odakyuLine_0_渋沢': '1番線',      'odakyuLine_1_渋沢': '2番線',
  'odakyuLine_0_新松田': '1番線',    'odakyuLine_1_新松田': '2番線',
  'odakyuLine_0_開成': '1番線',      'odakyuLine_1_開成': '2番線',
  'odakyuLine_0_栢山': '1番線',      'odakyuLine_1_栢山': '2番線',
  'odakyuLine_0_富水': '1番線',      'odakyuLine_1_富水': '2番線',
  'odakyuLine_0_螢田': '1番線',      'odakyuLine_1_螢田': '2番線',
  'odakyuLine_0_足柄': '1番線',      'odakyuLine_1_足柄': '2番線',
  'odakyuLine_0_小田原': '3番線',    'odakyuLine_1_小田原': '4番線',

  // ── 京急線 下り(0): 品川→浦賀 / 上り(1): 浦賀→品川 ──
  'keikyuLine_0_品川': '1番線',      'keikyuLine_1_品川': '2番線',
  'keikyuLine_0_北品川': '1番線',    'keikyuLine_1_北品川': '2番線',
  'keikyuLine_0_新馬場': '1番線',    'keikyuLine_1_新馬場': '2番線',
  'keikyuLine_0_青物横丁': '1番線',  'keikyuLine_1_青物横丁': '2番線',
  'keikyuLine_0_鮫洲': '1番線',      'keikyuLine_1_鮫洲': '2番線',
  'keikyuLine_0_立会川': '1番線',    'keikyuLine_1_立会川': '2番線',
  'keikyuLine_0_大森海岸': '1番線',  'keikyuLine_1_大森海岸': '2番線',
  'keikyuLine_0_平和島': '3番線',    'keikyuLine_1_平和島': '4番線',
  'keikyuLine_0_大森町': '1番線',    'keikyuLine_1_大森町': '2番線',
  'keikyuLine_0_梅屋敷': '1番線',    'keikyuLine_1_梅屋敷': '2番線',
  'keikyuLine_0_京急蒲田': '3番線',  'keikyuLine_1_京急蒲田': '4番線',
  'keikyuLine_0_雑色': '1番線',      'keikyuLine_1_雑色': '2番線',
  'keikyuLine_0_六郷土手': '1番線',  'keikyuLine_1_六郷土手': '2番線',
  'keikyuLine_0_京急川崎': '3番線',  'keikyuLine_1_京急川崎': '2番線',
  'keikyuLine_0_八丁畷': '1番線',    'keikyuLine_1_八丁畷': '2番線',
  'keikyuLine_0_鶴見市場': '1番線',  'keikyuLine_1_鶴見市場': '2番線',
  'keikyuLine_0_京急鶴見': '1番線',  'keikyuLine_1_京急鶴見': '2番線',
  'keikyuLine_0_花月総持寺': '1番線','keikyuLine_1_花月総持寺': '2番線',
  'keikyuLine_0_生麦': '1番線',      'keikyuLine_1_生麦': '2番線',
  'keikyuLine_0_京急新子安': '1番線','keikyuLine_1_京急新子安': '2番線',
  'keikyuLine_0_子安': '1番線',      'keikyuLine_1_子安': '2番線',
  'keikyuLine_0_神奈川新町': '3番線','keikyuLine_1_神奈川新町': '4番線',
  'keikyuLine_0_仲木戸': '1番線',    'keikyuLine_1_仲木戸': '2番線',
  'keikyuLine_0_神奈川': '1番線',    'keikyuLine_1_神奈川': '2番線',
  'keikyuLine_0_横浜': '1番線',      'keikyuLine_1_横浜': '2番線',
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
      deps.push({ time: toTime(t), type: p.type, destination: p.destination, toward: p.toward });
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
        { fromMin: m(4,45), toMin: m(7),    intervalMin: 6, type: '各停', destination: '品川・渋谷方面' },
        { fromMin: m(7),    toMin: m(10),   intervalMin: 3, type: '各停', destination: '品川・渋谷方面' },
        { fromMin: m(10),   toMin: m(17),   intervalMin: 5, type: '各停', destination: '品川・渋谷方面' },
        { fromMin: m(17),   toMin: m(20,30),intervalMin: 3, type: '各停', destination: '品川・渋谷方面' },
        { fromMin: m(20,30),toMin: m(23,30),intervalMin: 6, type: '各停', destination: '品川・渋谷方面' },
        { fromMin: m(23,30),toMin: m(25,30),intervalMin: 9, type: '各停', destination: '品川・渋谷方面' },
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
        { fromMin: m(4,45), toMin: m(7),    intervalMin: 6, type: '各停', destination: '上野・池袋方面' },
        { fromMin: m(7),    toMin: m(10),   intervalMin: 3, type: '各停', destination: '上野・池袋方面' },
        { fromMin: m(10),   toMin: m(17),   intervalMin: 5, type: '各停', destination: '上野・池袋方面' },
        { fromMin: m(17),   toMin: m(20,30),intervalMin: 3, type: '各停', destination: '上野・池袋方面' },
        { fromMin: m(20,30),toMin: m(23,30),intervalMin: 6, type: '各停', destination: '上野・池袋方面' },
        { fromMin: m(23,30),toMin: m(25,30),intervalMin: 9, type: '各停', destination: '上野・池袋方面' },
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
        { fromMin: m(5,20),  toMin: m(7),    intervalMin: 20, type: '普通',       destination: '小田原行き', toward: '熱海' },
        { fromMin: m(5,30),  toMin: m(7),    intervalMin: 30, type: '快速アクティー', destination: '小田原行き', toward: '熱海' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 10, type: '普通',       destination: '小田原行き', toward: '熱海' },
        { fromMin: m(7,5),   toMin: m(9,30), intervalMin: 20, type: '快速アクティー', destination: '小田原行き', toward: '熱海' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 15, type: '普通',       destination: '小田原行き', toward: '熱海' },
        { fromMin: m(9,40),  toMin: m(17),   intervalMin: 30, type: '快速アクティー', destination: '小田原行き', toward: '熱海' },
        { fromMin: m(17),    toMin: m(21),   intervalMin: 10, type: '普通',       destination: '小田原行き', toward: '熱海' },
        { fromMin: m(17,5),  toMin: m(21),   intervalMin: 20, type: '快速アクティー', destination: '小田原行き', toward: '熱海' },
        { fromMin: m(21),    toMin: m(24,30),intervalMin: 20, type: '普通',       destination: '小田原行き', toward: '熱海' },
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
        { fromMin: m(4,30),  toMin: m(7),    intervalMin: 20, type: '普通',       destination: '東京行き', toward: '上野' },
        { fromMin: m(5),     toMin: m(7),    intervalMin: 30, type: '快速アクティー', destination: '東京行き', toward: '上野' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 10, type: '普通',       destination: '東京行き', toward: '上野' },
        { fromMin: m(7,10),  toMin: m(9,30), intervalMin: 20, type: '快速アクティー', destination: '東京行き', toward: '上野' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 15, type: '普通',       destination: '東京行き', toward: '上野' },
        { fromMin: m(17),    toMin: m(21),   intervalMin: 10, type: '普通',       destination: '東京行き', toward: '上野' },
        { fromMin: m(17,10), toMin: m(21),   intervalMin: 20, type: '快速アクティー', destination: '東京行き', toward: '上野' },
        { fromMin: m(21),    toMin: m(24,30),intervalMin: 20, type: '普通',       destination: '東京行き', toward: '上野' },
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
        { fromMin: m(5),     toMin: m(7),    intervalMin: 8, type: '各停', destination: '三鷹行き', toward: '立川' },
        { fromMin: m(7),     toMin: m(10),   intervalMin: 5, type: '各停', destination: '三鷹行き', toward: '立川' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 8, type: '各停', destination: '三鷹行き', toward: '立川' },
        { fromMin: m(17),    toMin: m(20),   intervalMin: 5, type: '各停', destination: '三鷹行き', toward: '立川' },
        { fromMin: m(20),    toMin: m(24,30),intervalMin: 10,type: '各停', destination: '三鷹行き', toward: '立川' },
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
        { fromMin: m(5),     toMin: m(7),    intervalMin: 8, type: '各停', destination: '千葉行き', toward: '東京・千葉' },
        { fromMin: m(7),     toMin: m(10),   intervalMin: 5, type: '各停', destination: '千葉行き', toward: '東京・千葉' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 8, type: '各停', destination: '千葉行き', toward: '東京・千葉' },
        { fromMin: m(17),    toMin: m(20),   intervalMin: 5, type: '各停', destination: '千葉行き', toward: '東京・千葉' },
        { fromMin: m(20),    toMin: m(24,30),intervalMin: 10,type: '各停', destination: '千葉行き', toward: '東京・千葉' },
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
        { fromMin: m(5),     toMin: m(7,30), intervalMin: 7, type: '各停', destination: '元町・中華街行き', toward: '横浜' },
        { fromMin: m(5,30),  toMin: m(7,30), intervalMin: 10,type: '急行', destination: '元町・中華街行き', toward: '横浜' },
        { fromMin: m(7,30),  toMin: m(9,30), intervalMin: 5, type: '各停', destination: '元町・中華街行き', toward: '横浜' },
        { fromMin: m(7,35),  toMin: m(9,30), intervalMin: 5, type: '急行', destination: '元町・中華街行き', toward: '横浜' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 7, type: '各停', destination: '元町・中華街行き', toward: '横浜' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 7, type: '急行', destination: '元町・中華街行き', toward: '横浜' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 5, type: '各停', destination: '元町・中華街行き', toward: '横浜' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 5, type: '急行', destination: '元町・中華街行き', toward: '横浜' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 8, type: '各停', destination: '元町・中華街行き', toward: '横浜' },
        { fromMin: m(20,35), toMin: m(24,30),intervalMin: 10,type: '急行', destination: '元町・中華街行き', toward: '横浜' },
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
        { fromMin: m(5),     toMin: m(7,30), intervalMin: 7, type: '各停', destination: '渋谷行き', toward: '渋谷・新宿三丁目' },
        { fromMin: m(5,30),  toMin: m(7,30), intervalMin: 10,type: '急行', destination: '和光市行き', toward: '渋谷・新宿三丁目' },
        { fromMin: m(7,30),  toMin: m(9,30), intervalMin: 5, type: '各停', destination: '渋谷行き', toward: '渋谷・新宿三丁目' },
        { fromMin: m(7,35),  toMin: m(9,30), intervalMin: 5, type: '急行', destination: '和光市行き', toward: '渋谷・新宿三丁目' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 7, type: '各停', destination: '渋谷行き', toward: '渋谷・新宿三丁目' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 7, type: '急行', destination: '和光市行き', toward: '渋谷・新宿三丁目' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 5, type: '各停', destination: '渋谷行き', toward: '渋谷・新宿三丁目' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 5, type: '急行', destination: '和光市行き', toward: '渋谷・新宿三丁目' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 8, type: '各停', destination: '渋谷行き', toward: '渋谷・新宿三丁目' },
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
        { fromMin: m(5),     toMin: m(7),    intervalMin: 7, type: '各停', destination: '中央林間行き', toward: '長津田・中央林間' },
        { fromMin: m(5,30),  toMin: m(7),    intervalMin: 10,type: '急行', destination: '中央林間行き', toward: '長津田・中央林間' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 4, type: '各停', destination: '中央林間行き', toward: '長津田・中央林間' },
        { fromMin: m(7,5),   toMin: m(9,30), intervalMin: 5, type: '急行', destination: '中央林間行き', toward: '長津田・中央林間' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 6, type: '各停', destination: '中央林間行き', toward: '長津田・中央林間' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 8, type: '急行', destination: '中央林間行き', toward: '長津田・中央林間' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 4, type: '各停', destination: '中央林間行き', toward: '長津田・中央林間' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 5, type: '急行', destination: '中央林間行き', toward: '長津田・中央林間' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 7, type: '各停', destination: '中央林間行き', toward: '長津田・中央林間' },
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
        { fromMin: m(5),     toMin: m(7),    intervalMin: 7, type: '各停', destination: '渋谷行き', toward: '渋谷・半蔵門線' },
        { fromMin: m(5,30),  toMin: m(7),    intervalMin: 10,type: '急行', destination: '渋谷行き', toward: '渋谷・半蔵門線' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 4, type: '各停', destination: '渋谷行き', toward: '渋谷・半蔵門線' },
        { fromMin: m(7,5),   toMin: m(9,30), intervalMin: 5, type: '急行', destination: '渋谷行き', toward: '渋谷・半蔵門線' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 6, type: '各停', destination: '渋谷行き', toward: '渋谷・半蔵門線' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 8, type: '急行', destination: '渋谷行き', toward: '渋谷・半蔵門線' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 4, type: '各停', destination: '渋谷行き', toward: '渋谷・半蔵門線' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 5, type: '急行', destination: '渋谷行き', toward: '渋谷・半蔵門線' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 7, type: '各停', destination: '渋谷行き', toward: '渋谷・半蔵門線' },
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
        { fromMin: m(5),     toMin: m(7),    intervalMin: 10, type: '各停', destination: '本厚木行き', toward: '小田原' },
        { fromMin: m(5,20),  toMin: m(7),    intervalMin: 20, type: '急行', destination: '小田原行き', toward: '小田原・箱根' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 6,  type: '各停', destination: '本厚木行き', toward: '小田原' },
        { fromMin: m(7,10),  toMin: m(9,30), intervalMin: 10, type: '急行', destination: '小田原行き', toward: '小田原・箱根' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 8,  type: '各停', destination: '本厚木行き', toward: '小田原' },
        { fromMin: m(9,40),  toMin: m(17),   intervalMin: 15, type: '急行', destination: '小田原行き', toward: '小田原・箱根' },
        { fromMin: m(9,45),  toMin: m(17),   intervalMin: 30, type: '特急ロマンスカー', destination: '小田原行き', toward: '箱根' },
        { fromMin: m(17),    toMin: m(21),   intervalMin: 6,  type: '各停', destination: '本厚木行き', toward: '小田原' },
        { fromMin: m(17,10), toMin: m(21),   intervalMin: 10, type: '急行', destination: '小田原行き', toward: '小田原・箱根' },
        { fromMin: m(21),    toMin: m(24,30),intervalMin: 10, type: '各停', destination: '本厚木行き', toward: '小田原' },
        { fromMin: m(21,15), toMin: m(23),   intervalMin: 20, type: '急行', destination: '小田原行き', toward: '小田原' },
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
        { fromMin: m(5),     toMin: m(7),    intervalMin: 10, type: '各停', destination: '新宿行き', toward: '新宿・千代田線' },
        { fromMin: m(5,20),  toMin: m(7),    intervalMin: 20, type: '急行', destination: '新宿行き', toward: '新宿・千代田線' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 6,  type: '各停', destination: '新宿行き', toward: '新宿・千代田線' },
        { fromMin: m(7,10),  toMin: m(9,30), intervalMin: 10, type: '急行', destination: '新宿行き', toward: '新宿・千代田線' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 8,  type: '各停', destination: '新宿行き', toward: '新宿・千代田線' },
        { fromMin: m(9,40),  toMin: m(17),   intervalMin: 15, type: '急行', destination: '新宿行き', toward: '新宿・千代田線' },
        { fromMin: m(17),    toMin: m(21),   intervalMin: 6,  type: '各停', destination: '新宿行き', toward: '新宿・千代田線' },
        { fromMin: m(17,10), toMin: m(21),   intervalMin: 10, type: '急行', destination: '新宿行き', toward: '新宿・千代田線' },
        { fromMin: m(21),    toMin: m(24,30),intervalMin: 10, type: '各停', destination: '新宿行き', toward: '新宿・千代田線' },
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
        { fromMin: m(5),     toMin: m(7),    intervalMin: 7,  type: '普通', destination: '横浜行き', toward: '三浦海岸' },
        { fromMin: m(5,10),  toMin: m(7),    intervalMin: 15, type: '急行', destination: '横浜行き', toward: '三浦海岸' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 5,  type: '普通', destination: '横浜行き', toward: '三浦海岸' },
        { fromMin: m(7,5),   toMin: m(9,30), intervalMin: 8,  type: '急行', destination: '三崎口行き', toward: '三浦' },
        { fromMin: m(7,10),  toMin: m(9,30), intervalMin: 10, type: '快特', destination: '三崎口行き', toward: '三浦' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 7,  type: '普通', destination: '横浜行き', toward: '三浦海岸' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 10, type: '急行', destination: '横浜行き', toward: '三浦海岸' },
        { fromMin: m(9,40),  toMin: m(17),   intervalMin: 15, type: '快特', destination: '三崎口行き', toward: '三浦' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 5,  type: '普通', destination: '横浜行き', toward: '三浦海岸' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 8,  type: '急行', destination: '横浜行き', toward: '三浦海岸' },
        { fromMin: m(17,10), toMin: m(20,30),intervalMin: 10, type: '快特', destination: '三崎口行き', toward: '三浦' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 8,  type: '普通', destination: '横浜行き', toward: '三浦海岸' },
        { fromMin: m(20,35), toMin: m(24,30),intervalMin: 12, type: '急行', destination: '横浜行き', toward: '三浦海岸' },
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
        { fromMin: m(5),     toMin: m(7),    intervalMin: 7,  type: '普通', destination: '品川行き', toward: '都心' },
        { fromMin: m(5,10),  toMin: m(7),    intervalMin: 15, type: '急行', destination: '泉岳寺行き', toward: '都心' },
        { fromMin: m(7),     toMin: m(9,30), intervalMin: 5,  type: '普通', destination: '品川行き', toward: '都心' },
        { fromMin: m(7,5),   toMin: m(9,30), intervalMin: 8,  type: '急行', destination: '泉岳寺行き', toward: '都心' },
        { fromMin: m(7,10),  toMin: m(9,30), intervalMin: 10, type: '快特', destination: '泉岳寺行き', toward: '都心' },
        { fromMin: m(9,30),  toMin: m(17),   intervalMin: 7,  type: '普通', destination: '品川行き', toward: '都心' },
        { fromMin: m(9,35),  toMin: m(17),   intervalMin: 10, type: '急行', destination: '品川行き', toward: '都心' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 5,  type: '普通', destination: '品川行き', toward: '都心' },
        { fromMin: m(17,5),  toMin: m(20,30),intervalMin: 8,  type: '急行', destination: '品川行き', toward: '都心' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 8,  type: '普通', destination: '品川行き', toward: '都心' },
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
        { fromMin: m(4,30),  toMin: m(7),    intervalMin: 7,  type: '各停', destination: '大船行き' },
        { fromMin: m(7),     toMin: m(10),   intervalMin: 3,  type: '各停', destination: '大船行き' },
        { fromMin: m(7,30),  toMin: m(10),   intervalMin: 10, type: '快速', destination: '大船行き' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 5,  type: '各停', destination: '大船行き' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 10, type: '快速', destination: '大船行き' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 3,  type: '各停', destination: '大船行き' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 6,  type: '各停', destination: '大船行き' },
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
        { fromMin: m(4,30),  toMin: m(7),    intervalMin: 7,  type: '各停', destination: '大宮行き' },
        { fromMin: m(7),     toMin: m(10),   intervalMin: 3,  type: '各停', destination: '大宮行き' },
        { fromMin: m(7,30),  toMin: m(10),   intervalMin: 10, type: '快速', destination: '大宮行き' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 5,  type: '各停', destination: '大宮行き' },
        { fromMin: m(10),    toMin: m(17),   intervalMin: 10, type: '快速', destination: '大宮行き' },
        { fromMin: m(17),    toMin: m(20,30),intervalMin: 3,  type: '各停', destination: '大宮行き' },
        { fromMin: m(20,30), toMin: m(24,30),intervalMin: 6,  type: '各停', destination: '大宮行き' },
      ],
    },
  ],
};

// ── 追加路線データ ────────────────────────────────────

const hibiyaData: LineTimetableData = {
  key: 'hibiyaLine', name: '日比谷線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '北千住→中目黒',
      stations: [
        { name: '北千住', offset: 0 }, { name: '南千住', offset: 3 }, { name: '三ノ輪', offset: 5 },
        { name: '入谷', offset: 7 }, { name: '上野', offset: 10 }, { name: '仲御徒町', offset: 12 },
        { name: '秋葉原', offset: 14 }, { name: '小伝馬町', offset: 16 }, { name: '人形町', offset: 18 },
        { name: '茅場町', offset: 20 }, { name: '八丁堀', offset: 22 }, { name: '築地', offset: 24 },
        { name: '東銀座', offset: 26 }, { name: '銀座', offset: 27 }, { name: '日比谷', offset: 29 },
        { name: '霞ケ関', offset: 31 }, { name: '虎ノ門ヒルズ', offset: 33 }, { name: '神谷町', offset: 35 },
        { name: '六本木', offset: 37 }, { name: '広尾', offset: 39 }, { name: '恵比寿', offset: 42 },
        { name: '中目黒', offset: 44 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '中目黒行き' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 3, type: '各停', destination: '中目黒行き' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '中目黒行き' },
        { fromMin: m(17), toMin: m(20), intervalMin: 3, type: '各停', destination: '中目黒行き' },
        { fromMin: m(20), toMin: m(23,30), intervalMin: 6, type: '各停', destination: '中目黒行き' },
        { fromMin: m(23,30), toMin: m(25), intervalMin: 10, type: '各停', destination: '中目黒行き' },
      ],
    },
    {
      label: '中目黒→北千住',
      stations: [
        { name: '中目黒', offset: 0 }, { name: '恵比寿', offset: 2 }, { name: '広尾', offset: 5 },
        { name: '六本木', offset: 7 }, { name: '神谷町', offset: 9 }, { name: '虎ノ門ヒルズ', offset: 11 },
        { name: '霞ケ関', offset: 13 }, { name: '日比谷', offset: 15 }, { name: '銀座', offset: 17 },
        { name: '東銀座', offset: 18 }, { name: '築地', offset: 20 }, { name: '八丁堀', offset: 22 },
        { name: '茅場町', offset: 24 }, { name: '人形町', offset: 26 }, { name: '小伝馬町', offset: 28 },
        { name: '秋葉原', offset: 30 }, { name: '仲御徒町', offset: 32 }, { name: '上野', offset: 34 },
        { name: '入谷', offset: 37 }, { name: '三ノ輪', offset: 39 }, { name: '南千住', offset: 41 },
        { name: '北千住', offset: 44 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '北千住行き' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 3, type: '各停', destination: '北千住行き' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '北千住行き' },
        { fromMin: m(17), toMin: m(20), intervalMin: 3, type: '各停', destination: '北千住行き' },
        { fromMin: m(20), toMin: m(23,30), intervalMin: 6, type: '各停', destination: '北千住行き' },
        { fromMin: m(23,30), toMin: m(25), intervalMin: 10, type: '各停', destination: '北千住行き' },
      ],
    },
  ],
};

const tozaiData: LineTimetableData = {
  key: 'tozaiLine', name: '東西線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '西船橋→中野',
      stations: [
        { name: '西船橋', offset: 0 }, { name: '原木中山', offset: 3 }, { name: '妙典', offset: 5 },
        { name: '行徳', offset: 7 }, { name: '南行徳', offset: 9 }, { name: '浦安', offset: 11 },
        { name: '葛西', offset: 13 }, { name: '西葛西', offset: 15 }, { name: '南砂町', offset: 17 },
        { name: '東陽町', offset: 20 }, { name: '木場', offset: 22 }, { name: '門前仲町', offset: 25 },
        { name: '茅場町', offset: 27 }, { name: '日本橋', offset: 29 }, { name: '大手町', offset: 31 },
        { name: '竹橋', offset: 33 }, { name: '九段下', offset: 35 }, { name: '飯田橋', offset: 37 },
        { name: '神楽坂', offset: 39 }, { name: '早稲田', offset: 41 }, { name: '高田馬場', offset: 43 },
        { name: '落合', offset: 46 }, { name: '中野', offset: 48 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 7, type: '各停', destination: '中野行き' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 3, type: '各停', destination: '中野行き' },
        { fromMin: m(7,30), toMin: m(9), intervalMin: 6, type: '快速', destination: '中野行き' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '中野行き' },
        { fromMin: m(17), toMin: m(20), intervalMin: 3, type: '各停', destination: '中野行き' },
        { fromMin: m(20), toMin: m(24), intervalMin: 6, type: '各停', destination: '中野行き' },
      ],
    },
    {
      label: '中野→西船橋',
      stations: [
        { name: '中野', offset: 0 }, { name: '落合', offset: 2 }, { name: '高田馬場', offset: 5 },
        { name: '早稲田', offset: 7 }, { name: '神楽坂', offset: 9 }, { name: '飯田橋', offset: 11 },
        { name: '九段下', offset: 13 }, { name: '竹橋', offset: 15 }, { name: '大手町', offset: 17 },
        { name: '日本橋', offset: 19 }, { name: '茅場町', offset: 21 }, { name: '門前仲町', offset: 23 },
        { name: '木場', offset: 26 }, { name: '東陽町', offset: 28 }, { name: '南砂町', offset: 31 },
        { name: '西葛西', offset: 33 }, { name: '葛西', offset: 35 }, { name: '浦安', offset: 37 },
        { name: '南行徳', offset: 39 }, { name: '行徳', offset: 41 }, { name: '妙典', offset: 43 },
        { name: '原木中山', offset: 45 }, { name: '西船橋', offset: 48 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 7, type: '各停', destination: '西船橋行き' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 3, type: '各停', destination: '西船橋行き' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '西船橋行き' },
        { fromMin: m(17), toMin: m(20), intervalMin: 3, type: '各停', destination: '西船橋行き' },
        { fromMin: m(20), toMin: m(24), intervalMin: 6, type: '各停', destination: '西船橋行き' },
      ],
    },
  ],
};

const chiyodaData: LineTimetableData = {
  key: 'chiyodaLine', name: '千代田線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '代々木上原→金町',
      stations: [
        { name: '代々木上原', offset: 0 }, { name: '代々木公園', offset: 2 }, { name: '明治神宮前', offset: 4 },
        { name: '表参道', offset: 6 }, { name: '乃木坂', offset: 8 }, { name: '赤坂', offset: 10 },
        { name: '国会議事堂前', offset: 12 }, { name: '霞ケ関', offset: 14 }, { name: '日比谷', offset: 16 },
        { name: '二重橋前', offset: 18 }, { name: '大手町', offset: 20 }, { name: '新御茶ノ水', offset: 22 },
        { name: '湯島', offset: 24 }, { name: '根津', offset: 26 }, { name: '千駄木', offset: 28 },
        { name: '西日暮里', offset: 30 }, { name: '町屋', offset: 32 }, { name: '北千住', offset: 34 },
        { name: '綾瀬', offset: 37 }, { name: '北綾瀬', offset: 40 }, { name: '亀有', offset: 43 },
        { name: '金町', offset: 46 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 7, type: '各停', destination: '金町方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 3, type: '各停', destination: '金町方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '金町方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 3, type: '各停', destination: '金町方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 6, type: '各停', destination: '金町方面' },
      ],
    },
    {
      label: '金町→代々木上原',
      stations: [
        { name: '金町', offset: 0 }, { name: '亀有', offset: 3 }, { name: '北綾瀬', offset: 6 },
        { name: '綾瀬', offset: 9 }, { name: '北千住', offset: 12 }, { name: '町屋', offset: 14 },
        { name: '西日暮里', offset: 16 }, { name: '千駄木', offset: 18 }, { name: '根津', offset: 20 },
        { name: '湯島', offset: 22 }, { name: '新御茶ノ水', offset: 24 }, { name: '大手町', offset: 26 },
        { name: '二重橋前', offset: 28 }, { name: '日比谷', offset: 30 }, { name: '霞ケ関', offset: 32 },
        { name: '国会議事堂前', offset: 34 }, { name: '赤坂', offset: 36 }, { name: '乃木坂', offset: 38 },
        { name: '表参道', offset: 40 }, { name: '明治神宮前', offset: 42 }, { name: '代々木公園', offset: 44 },
        { name: '代々木上原', offset: 46 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 7, type: '各停', destination: '代々木上原方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 3, type: '各停', destination: '代々木上原方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '代々木上原方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 3, type: '各停', destination: '代々木上原方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 6, type: '各停', destination: '代々木上原方面' },
      ],
    },
  ],
};

const yurakuchoData: LineTimetableData = {
  key: 'yurakuchoLine', name: '有楽町線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '和光市→新木場',
      stations: [
        { name: '和光市', offset: 0 }, { name: '地下鉄成増', offset: 3 }, { name: '地下鉄赤塚', offset: 5 },
        { name: '平和台', offset: 7 }, { name: '氷川台', offset: 9 }, { name: '小竹向原', offset: 11 },
        { name: '千川', offset: 13 }, { name: '要町', offset: 15 }, { name: '池袋', offset: 17 },
        { name: '東池袋', offset: 19 }, { name: '護国寺', offset: 21 }, { name: '江戸川橋', offset: 23 },
        { name: '飯田橋', offset: 25 }, { name: '市ケ谷', offset: 27 }, { name: '麹町', offset: 29 },
        { name: '永田町', offset: 31 }, { name: '桜田門', offset: 33 }, { name: '有楽町', offset: 35 },
        { name: '銀座一丁目', offset: 37 }, { name: '新富町', offset: 39 }, { name: '月島', offset: 41 },
        { name: '豊洲', offset: 43 }, { name: '辰巳', offset: 46 }, { name: '新木場', offset: 48 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 7, type: '各停', destination: '新木場方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '新木場方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '新木場方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '新木場方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '新木場方面' },
      ],
    },
    {
      label: '新木場→和光市',
      stations: [
        { name: '新木場', offset: 0 }, { name: '辰巳', offset: 2 }, { name: '豊洲', offset: 5 },
        { name: '月島', offset: 7 }, { name: '新富町', offset: 9 }, { name: '銀座一丁目', offset: 11 },
        { name: '有楽町', offset: 13 }, { name: '桜田門', offset: 15 }, { name: '永田町', offset: 17 },
        { name: '麹町', offset: 19 }, { name: '市ケ谷', offset: 21 }, { name: '飯田橋', offset: 23 },
        { name: '江戸川橋', offset: 25 }, { name: '護国寺', offset: 27 }, { name: '東池袋', offset: 29 },
        { name: '池袋', offset: 31 }, { name: '要町', offset: 33 }, { name: '千川', offset: 35 },
        { name: '小竹向原', offset: 37 }, { name: '氷川台', offset: 39 }, { name: '平和台', offset: 41 },
        { name: '地下鉄赤塚', offset: 43 }, { name: '地下鉄成増', offset: 45 }, { name: '和光市', offset: 48 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 7, type: '各停', destination: '和光市方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '和光市方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '和光市方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '和光市方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '和光市方面' },
      ],
    },
  ],
};

const hanzomonData: LineTimetableData = {
  key: 'hanzomonLine', name: '半蔵門線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '押上→中央林間',
      stations: [
        { name: '押上', offset: 0 }, { name: '錦糸町', offset: 3 }, { name: '住吉', offset: 5 },
        { name: '清澄白河', offset: 7 }, { name: '水天宮前', offset: 9 }, { name: '三越前', offset: 11 },
        { name: '大手町', offset: 13 }, { name: '神保町', offset: 15 }, { name: '九段下', offset: 17 },
        { name: '半蔵門', offset: 19 }, { name: '永田町', offset: 21 }, { name: '青山一丁目', offset: 23 },
        { name: '表参道', offset: 25 }, { name: '渋谷', offset: 27 }, { name: '三軒茶屋', offset: 31 },
        { name: '駒沢大学', offset: 33 }, { name: '桜新町', offset: 35 }, { name: '用賀', offset: 37 },
        { name: '二子玉川', offset: 39 }, { name: '溝の口', offset: 43 }, { name: '梶が谷', offset: 45 },
        { name: '宮崎台', offset: 47 }, { name: '宮前平', offset: 49 }, { name: '鷺沼', offset: 51 },
        { name: 'たまプラーザ', offset: 53 }, { name: 'あざみ野', offset: 55 }, { name: '江田', offset: 57 },
        { name: '市が尾', offset: 59 }, { name: '藤が丘', offset: 61 }, { name: '青葉台', offset: 63 },
        { name: '田奈', offset: 65 }, { name: '長津田', offset: 67 }, { name: 'すずかけ台', offset: 70 },
        { name: 'つくし野', offset: 72 }, { name: '南町田グランベリーパーク', offset: 74 }, { name: 'つきみ野', offset: 76 },
        { name: '中央林間', offset: 78 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '中央林間方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '中央林間方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '中央林間方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '中央林間方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 6, type: '各停', destination: '中央林間方面' },
      ],
    },
    {
      label: '中央林間→押上',
      stations: [
        { name: '中央林間', offset: 0 }, { name: 'つきみ野', offset: 2 }, { name: '南町田グランベリーパーク', offset: 4 },
        { name: 'つくし野', offset: 6 }, { name: 'すずかけ台', offset: 8 }, { name: '長津田', offset: 11 },
        { name: '田奈', offset: 13 }, { name: '青葉台', offset: 15 }, { name: '藤が丘', offset: 17 },
        { name: '市が尾', offset: 19 }, { name: '江田', offset: 21 }, { name: 'あざみ野', offset: 23 },
        { name: 'たまプラーザ', offset: 25 }, { name: '鷺沼', offset: 27 }, { name: '宮前平', offset: 29 },
        { name: '宮崎台', offset: 31 }, { name: '溝の口', offset: 33 }, { name: '梶が谷', offset: 35 },
        { name: '二子玉川', offset: 39 }, { name: '用賀', offset: 41 }, { name: '桜新町', offset: 43 },
        { name: '駒沢大学', offset: 45 }, { name: '三軒茶屋', offset: 47 }, { name: '渋谷', offset: 51 },
        { name: '表参道', offset: 53 }, { name: '青山一丁目', offset: 55 }, { name: '永田町', offset: 57 },
        { name: '半蔵門', offset: 59 }, { name: '九段下', offset: 61 }, { name: '神保町', offset: 63 },
        { name: '大手町', offset: 65 }, { name: '三越前', offset: 67 }, { name: '水天宮前', offset: 69 },
        { name: '清澄白河', offset: 71 }, { name: '住吉', offset: 73 }, { name: '錦糸町', offset: 75 },
        { name: '押上', offset: 78 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '押上方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '押上方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '押上方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '押上方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 6, type: '各停', destination: '押上方面' },
      ],
    },
  ],
};

const nambokuData: LineTimetableData = {
  key: 'nambokuLine', name: '南北線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '目黒→赤羽岩淵',
      stations: [
        { name: '目黒', offset: 0 }, { name: '白金台', offset: 2 }, { name: '白金高輪', offset: 4 },
        { name: '麻布十番', offset: 6 }, { name: '六本木一丁目', offset: 8 }, { name: '溜池山王', offset: 10 },
        { name: '永田町', offset: 12 }, { name: '四ツ谷', offset: 14 }, { name: '市ケ谷', offset: 16 },
        { name: '飯田橋', offset: 18 }, { name: '後楽園', offset: 20 }, { name: '東大前', offset: 22 },
        { name: '本駒込', offset: 24 }, { name: '駒込', offset: 26 }, { name: '西ケ原', offset: 28 },
        { name: '王子', offset: 30 }, { name: '王子神谷', offset: 32 }, { name: '志茂', offset: 34 },
        { name: '赤羽岩淵', offset: 36 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '赤羽岩淵方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '赤羽岩淵方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '赤羽岩淵方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '赤羽岩淵方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '赤羽岩淵方面' },
      ],
    },
    {
      label: '赤羽岩淵→目黒',
      stations: [
        { name: '赤羽岩淵', offset: 0 }, { name: '志茂', offset: 2 }, { name: '王子神谷', offset: 4 },
        { name: '王子', offset: 6 }, { name: '西ケ原', offset: 8 }, { name: '駒込', offset: 10 },
        { name: '本駒込', offset: 12 }, { name: '東大前', offset: 14 }, { name: '後楽園', offset: 16 },
        { name: '飯田橋', offset: 18 }, { name: '市ケ谷', offset: 20 }, { name: '四ツ谷', offset: 22 },
        { name: '永田町', offset: 24 }, { name: '溜池山王', offset: 26 }, { name: '六本木一丁目', offset: 28 },
        { name: '麻布十番', offset: 30 }, { name: '白金高輪', offset: 32 }, { name: '白金台', offset: 34 },
        { name: '目黒', offset: 36 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '目黒方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '目黒方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '目黒方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '目黒方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '目黒方面' },
      ],
    },
  ],
};

const fukutoshinData: LineTimetableData = {
  key: 'fukutoshinLine', name: '副都心線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '和光市→渋谷',
      stations: [
        { name: '和光市', offset: 0 }, { name: '地下鉄成増', offset: 3 }, { name: '地下鉄赤塚', offset: 5 },
        { name: '平和台', offset: 7 }, { name: '氷川台', offset: 9 }, { name: '小竹向原', offset: 11 },
        { name: '千川', offset: 13 }, { name: '要町', offset: 15 }, { name: '池袋', offset: 17 },
        { name: '雑司が谷', offset: 19 }, { name: '西早稲田', offset: 21 }, { name: '東新宿', offset: 23 },
        { name: '新宿三丁目', offset: 25 }, { name: '北参道', offset: 27 }, { name: '明治神宮前', offset: 29 },
        { name: '渋谷', offset: 31 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '渋谷方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '渋谷方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '渋谷方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '渋谷方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '渋谷方面' },
      ],
    },
    {
      label: '渋谷→和光市',
      stations: [
        { name: '渋谷', offset: 0 }, { name: '明治神宮前', offset: 2 }, { name: '北参道', offset: 4 },
        { name: '新宿三丁目', offset: 6 }, { name: '東新宿', offset: 8 }, { name: '西早稲田', offset: 10 },
        { name: '雑司が谷', offset: 12 }, { name: '池袋', offset: 14 }, { name: '要町', offset: 16 },
        { name: '千川', offset: 18 }, { name: '小竹向原', offset: 20 }, { name: '氷川台', offset: 22 },
        { name: '平和台', offset: 24 }, { name: '地下鉄赤塚', offset: 26 }, { name: '地下鉄成増', offset: 28 },
        { name: '和光市', offset: 31 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '和光市方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '和光市方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '和光市方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '和光市方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '和光市方面' },
      ],
    },
  ],
};

const toeiAsakusaData: LineTimetableData = {
  key: 'toeiAsakusaLine', name: '都営浅草線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '押上→西馬込',
      stations: [
        { name: '押上', offset: 0 }, { name: '本所吾妻橋', offset: 2 }, { name: '浅草', offset: 4 },
        { name: '蔵前', offset: 6 }, { name: '浅草橋', offset: 8 }, { name: '人形町', offset: 10 },
        { name: '東日本橋', offset: 12 }, { name: '宝町', offset: 14 }, { name: '東銀座', offset: 16 },
        { name: '新橋', offset: 18 }, { name: '大門', offset: 20 }, { name: '三田', offset: 23 },
        { name: '泉岳寺', offset: 26 }, { name: '高輪台', offset: 28 }, { name: '五反田', offset: 31 },
        { name: '戸越', offset: 33 }, { name: '中延', offset: 35 }, { name: '馬込', offset: 37 },
        { name: '西馬込', offset: 39 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '西馬込方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '西馬込方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '西馬込方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '西馬込方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '西馬込方面' },
      ],
    },
    {
      label: '西馬込→押上',
      stations: [
        { name: '西馬込', offset: 0 }, { name: '馬込', offset: 2 }, { name: '中延', offset: 4 },
        { name: '戸越', offset: 6 }, { name: '五反田', offset: 8 }, { name: '高輪台', offset: 11 },
        { name: '泉岳寺', offset: 13 }, { name: '三田', offset: 16 }, { name: '大門', offset: 19 },
        { name: '新橋', offset: 21 }, { name: '東銀座', offset: 23 }, { name: '宝町', offset: 25 },
        { name: '東日本橋', offset: 27 }, { name: '人形町', offset: 29 }, { name: '浅草橋', offset: 31 },
        { name: '蔵前', offset: 33 }, { name: '浅草', offset: 35 }, { name: '本所吾妻橋', offset: 37 },
        { name: '押上', offset: 39 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '押上方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '押上方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '押上方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '押上方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '押上方面' },
      ],
    },
  ],
};

const toeiMitaData: LineTimetableData = {
  key: 'toeiMitaLine', name: '都営三田線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '目黒→西高島平',
      stations: [
        { name: '目黒', offset: 0 }, { name: '白金台', offset: 2 }, { name: '白金高輪', offset: 4 },
        { name: '三田', offset: 7 }, { name: '芝公園', offset: 9 }, { name: '御成門', offset: 11 },
        { name: '内幸町', offset: 13 }, { name: '日比谷', offset: 15 }, { name: '大手町', offset: 17 },
        { name: '神保町', offset: 19 }, { name: '水道橋', offset: 21 }, { name: '春日', offset: 23 },
        { name: '白山', offset: 25 }, { name: '千石', offset: 27 }, { name: '巣鴨', offset: 29 },
        { name: '西巣鴨', offset: 31 }, { name: '新板橋', offset: 33 }, { name: '板橋区役所前', offset: 35 },
        { name: '板橋本町', offset: 37 }, { name: '本蓮沼', offset: 39 }, { name: '志村坂上', offset: 41 },
        { name: '志村三丁目', offset: 43 }, { name: '蓮根', offset: 45 }, { name: '西台', offset: 47 },
        { name: '高島平', offset: 49 }, { name: '新高島平', offset: 51 }, { name: '西高島平', offset: 53 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '西高島平方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '西高島平方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '西高島平方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '西高島平方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '西高島平方面' },
      ],
    },
    {
      label: '西高島平→目黒',
      stations: [
        { name: '西高島平', offset: 0 }, { name: '新高島平', offset: 2 }, { name: '高島平', offset: 4 },
        { name: '西台', offset: 6 }, { name: '蓮根', offset: 8 }, { name: '志村三丁目', offset: 10 },
        { name: '志村坂上', offset: 12 }, { name: '本蓮沼', offset: 14 }, { name: '板橋本町', offset: 16 },
        { name: '板橋区役所前', offset: 18 }, { name: '新板橋', offset: 20 }, { name: '西巣鴨', offset: 22 },
        { name: '巣鴨', offset: 24 }, { name: '千石', offset: 26 }, { name: '白山', offset: 28 },
        { name: '春日', offset: 30 }, { name: '水道橋', offset: 32 }, { name: '神保町', offset: 34 },
        { name: '大手町', offset: 36 }, { name: '日比谷', offset: 38 }, { name: '内幸町', offset: 40 },
        { name: '御成門', offset: 42 }, { name: '芝公園', offset: 44 }, { name: '三田', offset: 46 },
        { name: '白金高輪', offset: 49 }, { name: '白金台', offset: 51 }, { name: '目黒', offset: 53 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '目黒方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '目黒方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '目黒方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '目黒方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '目黒方面' },
      ],
    },
  ],
};

const toeiShinjukuData: LineTimetableData = {
  key: 'toeiShinjukuLine', name: '都営新宿線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '新宿→本八幡',
      stations: [
        { name: '新宿', offset: 0 }, { name: '曙橋', offset: 3 }, { name: '市ケ谷', offset: 5 },
        { name: '九段下', offset: 8 }, { name: '神保町', offset: 10 }, { name: '小川町', offset: 12 },
        { name: '岩本町', offset: 14 }, { name: '馬喰横山', offset: 16 }, { name: '浜町', offset: 18 },
        { name: '森下', offset: 21 }, { name: '菊川', offset: 23 }, { name: '住吉', offset: 25 },
        { name: '西大島', offset: 27 }, { name: '大島', offset: 29 }, { name: '東大島', offset: 32 },
        { name: '船堀', offset: 35 }, { name: '一之江', offset: 37 }, { name: '瑞江', offset: 39 },
        { name: '篠崎', offset: 41 }, { name: '本八幡', offset: 44 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '本八幡方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '本八幡方面' },
        { fromMin: m(7,30), toMin: m(9), intervalMin: 8, type: '急行', destination: '本八幡方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '本八幡方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '本八幡方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '本八幡方面' },
      ],
    },
    {
      label: '本八幡→新宿',
      stations: [
        { name: '本八幡', offset: 0 }, { name: '篠崎', offset: 3 }, { name: '瑞江', offset: 5 },
        { name: '一之江', offset: 7 }, { name: '船堀', offset: 9 }, { name: '東大島', offset: 12 },
        { name: '大島', offset: 15 }, { name: '西大島', offset: 17 }, { name: '住吉', offset: 19 },
        { name: '菊川', offset: 21 }, { name: '森下', offset: 23 }, { name: '浜町', offset: 26 },
        { name: '馬喰横山', offset: 28 }, { name: '岩本町', offset: 30 }, { name: '小川町', offset: 32 },
        { name: '神保町', offset: 34 }, { name: '九段下', offset: 36 }, { name: '市ケ谷', offset: 39 },
        { name: '曙橋', offset: 41 }, { name: '新宿', offset: 44 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '新宿方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '新宿方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '新宿方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '新宿方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '新宿方面' },
      ],
    },
  ],
};

const toeiOedoData: LineTimetableData = {
  key: 'toeiOedoLine', name: '都営大江戸線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '都庁前→光が丘',
      stations: [
        { name: '都庁前', offset: 0 }, { name: '新宿西口', offset: 2 }, { name: '東新宿', offset: 4 },
        { name: '若松河田', offset: 6 }, { name: '牛込柳町', offset: 8 }, { name: '牛込神楽坂', offset: 10 },
        { name: '飯田橋', offset: 12 }, { name: '春日', offset: 14 }, { name: '本郷三丁目', offset: 16 },
        { name: '上野御徒町', offset: 18 }, { name: '新御徒町', offset: 20 }, { name: '蔵前', offset: 22 },
        { name: '両国', offset: 24 }, { name: '森下', offset: 26 }, { name: '清澄白河', offset: 28 },
        { name: '門前仲町', offset: 30 }, { name: '月島', offset: 32 }, { name: '勝どき', offset: 34 },
        { name: '築地市場', offset: 36 }, { name: '汐留', offset: 38 }, { name: '大門', offset: 40 },
        { name: '赤羽橋', offset: 42 }, { name: '麻布十番', offset: 44 }, { name: '六本木', offset: 46 },
        { name: '青山一丁目', offset: 48 }, { name: '国立競技場', offset: 50 }, { name: '代々木', offset: 52 },
        { name: '新宿', offset: 54 }, { name: '新宿西口', offset: 56 }, { name: '中野坂上', offset: 58 },
        { name: '西新宿五丁目', offset: 60 }, { name: '中井', offset: 62 }, { name: '落合南長崎', offset: 64 },
        { name: '新江古田', offset: 66 }, { name: '練馬', offset: 68 }, { name: '豊島園', offset: 70 },
        { name: '練馬春日町', offset: 72 }, { name: '光が丘', offset: 74 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '光が丘方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '光が丘方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '光が丘方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '光が丘方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '光が丘方面' },
      ],
    },
    {
      label: '光が丘→都庁前',
      stations: [
        { name: '光が丘', offset: 0 }, { name: '練馬春日町', offset: 2 }, { name: '豊島園', offset: 4 },
        { name: '練馬', offset: 6 }, { name: '新江古田', offset: 8 }, { name: '落合南長崎', offset: 10 },
        { name: '中井', offset: 12 }, { name: '西新宿五丁目', offset: 14 }, { name: '中野坂上', offset: 16 },
        { name: '新宿西口', offset: 18 }, { name: '新宿', offset: 20 }, { name: '代々木', offset: 22 },
        { name: '国立競技場', offset: 24 }, { name: '青山一丁目', offset: 26 }, { name: '六本木', offset: 28 },
        { name: '麻布十番', offset: 30 }, { name: '赤羽橋', offset: 32 }, { name: '大門', offset: 34 },
        { name: '汐留', offset: 36 }, { name: '築地市場', offset: 38 }, { name: '勝どき', offset: 40 },
        { name: '月島', offset: 42 }, { name: '門前仲町', offset: 44 }, { name: '清澄白河', offset: 46 },
        { name: '森下', offset: 48 }, { name: '両国', offset: 50 }, { name: '蔵前', offset: 52 },
        { name: '新御徒町', offset: 54 }, { name: '上野御徒町', offset: 56 }, { name: '本郷三丁目', offset: 58 },
        { name: '春日', offset: 60 }, { name: '飯田橋', offset: 62 }, { name: '牛込神楽坂', offset: 64 },
        { name: '牛込柳町', offset: 66 }, { name: '若松河田', offset: 68 }, { name: '東新宿', offset: 70 },
        { name: '新宿西口', offset: 72 }, { name: '都庁前', offset: 74 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 8, type: '各停', destination: '都庁前方面' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '都庁前方面' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '都庁前方面' },
        { fromMin: m(17), toMin: m(20), intervalMin: 4, type: '各停', destination: '都庁前方面' },
        { fromMin: m(20), toMin: m(24), intervalMin: 7, type: '各停', destination: '都庁前方面' },
      ],
    },
  ],
};

const saikyoData: LineTimetableData = {
  key: 'jrSaikyoLine', name: '埼京線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '大崎→大宮',
      stations: [
        { name: '大崎', offset: 0 }, { name: '恵比寿', offset: 3 }, { name: '渋谷', offset: 5 },
        { name: '新宿', offset: 8 }, { name: '池袋', offset: 11 }, { name: '板橋', offset: 14 },
        { name: '十条', offset: 16 }, { name: '赤羽', offset: 19 }, { name: '北赤羽', offset: 21 },
        { name: '浮間舟渡', offset: 23 }, { name: '戸田公園', offset: 26 }, { name: '戸田', offset: 28 },
        { name: '北戸田', offset: 30 }, { name: '武蔵浦和', offset: 33 }, { name: '中浦和', offset: 35 },
        { name: '南与野', offset: 37 }, { name: '与野本町', offset: 39 }, { name: '北与野', offset: 41 },
        { name: '大宮', offset: 43 },
      ],
      patterns: [
        { fromMin: m(4,30), toMin: m(7), intervalMin: 9, type: '各停', destination: '大宮行き' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '大宮行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 8, type: '通勤快速', destination: '大宮行き' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '大宮行き' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 4, type: '各停', destination: '大宮行き' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 8, type: '各停', destination: '大宮行き' },
      ],
    },
    {
      label: '大宮→大崎',
      stations: [
        { name: '大宮', offset: 0 }, { name: '北与野', offset: 2 }, { name: '与野本町', offset: 4 },
        { name: '南与野', offset: 6 }, { name: '中浦和', offset: 8 }, { name: '武蔵浦和', offset: 10 },
        { name: '北戸田', offset: 13 }, { name: '戸田', offset: 15 }, { name: '戸田公園', offset: 17 },
        { name: '浮間舟渡', offset: 20 }, { name: '北赤羽', offset: 22 }, { name: '赤羽', offset: 24 },
        { name: '十条', offset: 27 }, { name: '板橋', offset: 29 }, { name: '池袋', offset: 32 },
        { name: '新宿', offset: 35 }, { name: '渋谷', offset: 38 }, { name: '恵比寿', offset: 40 },
        { name: '大崎', offset: 43 },
      ],
      patterns: [
        { fromMin: m(4,30), toMin: m(7), intervalMin: 9, type: '各停', destination: '大崎行き' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 4, type: '各停', destination: '大崎行き' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 6, type: '各停', destination: '大崎行き' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 4, type: '各停', destination: '大崎行き' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 8, type: '各停', destination: '大崎行き' },
      ],
    },
  ],
};

const jobanData: LineTimetableData = {
  key: 'jrJobanLine', name: '常磐線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '品川→取手',
      stations: [
        { name: '品川', offset: 0 }, { name: '田町', offset: 3 }, { name: '浜松町', offset: 5 },
        { name: '新橋', offset: 7 }, { name: '東京', offset: 10 }, { name: '上野', offset: 13 },
        { name: '日暮里', offset: 16 }, { name: '三河島', offset: 18 }, { name: '南千住', offset: 20 },
        { name: '北千住', offset: 23 }, { name: '松戸', offset: 30 }, { name: '柏', offset: 38 },
        { name: '我孫子', offset: 43 }, { name: '天王台', offset: 46 }, { name: '取手', offset: 50 },
      ],
      patterns: [
        { fromMin: m(4,30), toMin: m(7), intervalMin: 10, type: '普通', destination: '取手行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 5, type: '普通', destination: '取手行き' },
        { fromMin: m(7,30), toMin: m(9), intervalMin: 10, type: '快速', destination: '土浦行き', toward: '土浦' },
        { fromMin: m(9), toMin: m(17), intervalMin: 10, type: '普通', destination: '取手行き' },
        { fromMin: m(17), toMin: m(20), intervalMin: 5, type: '普通', destination: '取手行き' },
        { fromMin: m(20), toMin: m(24), intervalMin: 10, type: '普通', destination: '取手行き' },
      ],
    },
    {
      label: '取手→品川',
      stations: [
        { name: '取手', offset: 0 }, { name: '天王台', offset: 4 }, { name: '我孫子', offset: 7 },
        { name: '柏', offset: 12 }, { name: '松戸', offset: 20 }, { name: '北千住', offset: 27 },
        { name: '南千住', offset: 30 }, { name: '三河島', offset: 32 }, { name: '日暮里', offset: 34 },
        { name: '上野', offset: 37 }, { name: '東京', offset: 40 }, { name: '新橋', offset: 43 },
        { name: '浜松町', offset: 45 }, { name: '田町', offset: 47 }, { name: '品川', offset: 50 },
      ],
      patterns: [
        { fromMin: m(4,30), toMin: m(7), intervalMin: 10, type: '普通', destination: '品川行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 5, type: '普通', destination: '品川行き' },
        { fromMin: m(9), toMin: m(17), intervalMin: 10, type: '普通', destination: '品川行き' },
        { fromMin: m(17), toMin: m(20), intervalMin: 5, type: '普通', destination: '品川行き' },
        { fromMin: m(20), toMin: m(24), intervalMin: 10, type: '普通', destination: '品川行き' },
      ],
    },
  ],
};

const keioData: LineTimetableData = {
  key: 'keioLine', name: '京王線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '新宿→高尾山口',
      stations: [
        { name: '新宿', offset: 0 }, { name: '笹塚', offset: 4 }, { name: '代田橋', offset: 6 },
        { name: '明大前', offset: 8 }, { name: '下高井戸', offset: 11 }, { name: '桜上水', offset: 13 },
        { name: '上北沢', offset: 15 }, { name: '八幡山', offset: 17 }, { name: '芦花公園', offset: 19 },
        { name: '千歳烏山', offset: 21 }, { name: '仙川', offset: 24 }, { name: 'つつじヶ丘', offset: 26 },
        { name: '柴崎', offset: 28 }, { name: '国領', offset: 30 }, { name: '布田', offset: 32 },
        { name: '調布', offset: 34 }, { name: '西調布', offset: 37 }, { name: '飛田給', offset: 39 },
        { name: '武蔵野台', offset: 41 }, { name: '多磨霊園', offset: 43 }, { name: '東府中', offset: 45 },
        { name: '府中', offset: 47 }, { name: '分倍河原', offset: 50 }, { name: '中河原', offset: 52 },
        { name: '聖蹟桜ヶ丘', offset: 54 }, { name: '百草園', offset: 57 }, { name: '高幡不動', offset: 59 },
        { name: '南平', offset: 62 }, { name: '平山城址公園', offset: 64 }, { name: '長沼', offset: 67 },
        { name: '北野', offset: 69 }, { name: '高尾山口', offset: 79 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 10, type: '各停', destination: '高尾山口行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 4, type: '各停', destination: '高尾山口行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 8, type: '特急', destination: '高尾山口行き' },
        { fromMin: m(9), toMin: m(17), intervalMin: 6, type: '各停', destination: '高尾山口行き' },
        { fromMin: m(9), toMin: m(17), intervalMin: 10, type: '特急', destination: '高尾山口行き' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 4, type: '各停', destination: '高尾山口行き' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 8, type: '各停', destination: '高尾山口行き' },
      ],
    },
    {
      label: '高尾山口→新宿',
      stations: [
        { name: '高尾山口', offset: 0 }, { name: '北野', offset: 10 }, { name: '長沼', offset: 12 },
        { name: '平山城址公園', offset: 15 }, { name: '南平', offset: 17 }, { name: '高幡不動', offset: 20 },
        { name: '百草園', offset: 22 }, { name: '聖蹟桜ヶ丘', offset: 25 }, { name: '中河原', offset: 27 },
        { name: '分倍河原', offset: 29 }, { name: '府中', offset: 32 }, { name: '東府中', offset: 34 },
        { name: '多磨霊園', offset: 36 }, { name: '武蔵野台', offset: 38 }, { name: '飛田給', offset: 40 },
        { name: '西調布', offset: 42 }, { name: '調布', offset: 45 }, { name: '布田', offset: 47 },
        { name: '国領', offset: 49 }, { name: '柴崎', offset: 51 }, { name: 'つつじヶ丘', offset: 53 },
        { name: '仙川', offset: 55 }, { name: '千歳烏山', offset: 58 }, { name: '芦花公園', offset: 60 },
        { name: '八幡山', offset: 62 }, { name: '上北沢', offset: 64 }, { name: '桜上水', offset: 66 },
        { name: '下高井戸', offset: 68 }, { name: '明大前', offset: 71 }, { name: '代田橋', offset: 73 },
        { name: '笹塚', offset: 75 }, { name: '新宿', offset: 79 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 10, type: '各停', destination: '新宿行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 4, type: '各停', destination: '新宿行き' },
        { fromMin: m(9), toMin: m(17), intervalMin: 6, type: '各停', destination: '新宿行き' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 4, type: '各停', destination: '新宿行き' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 8, type: '各停', destination: '新宿行き' },
      ],
    },
  ],
};

const seibuIkebukuroData: LineTimetableData = {
  key: 'seibuIkebukuroLine', name: '西武池袋線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '池袋→飯能',
      stations: [
        { name: '池袋', offset: 0 }, { name: '椎名町', offset: 3 }, { name: '東長崎', offset: 5 },
        { name: '江古田', offset: 7 }, { name: '桜台', offset: 9 }, { name: '練馬', offset: 11 },
        { name: '中村橋', offset: 14 }, { name: '富士見台', offset: 16 }, { name: '練馬高野台', offset: 18 },
        { name: '石神井公園', offset: 20 }, { name: '大泉学園', offset: 23 }, { name: '保谷', offset: 26 },
        { name: 'ひばりヶ丘', offset: 29 }, { name: '東久留米', offset: 32 }, { name: '清瀬', offset: 35 },
        { name: '秋津', offset: 38 }, { name: '所沢', offset: 41 }, { name: '西所沢', offset: 44 },
        { name: '小手指', offset: 47 }, { name: '狭山ヶ丘', offset: 50 }, { name: '武蔵藤沢', offset: 53 },
        { name: '稲荷山公園', offset: 56 }, { name: '入間市', offset: 59 },
      ],
      patterns: [
        { fromMin: m(4,30), toMin: m(7), intervalMin: 9, type: '各停', destination: '飯能方面' },
        { fromMin: m(7), toMin: m(9), intervalMin: 4, type: '各停', destination: '飯能方面' },
        { fromMin: m(7), toMin: m(9), intervalMin: 8, type: '急行', destination: '飯能方面' },
        { fromMin: m(9), toMin: m(17), intervalMin: 6, type: '各停', destination: '飯能方面' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 4, type: '各停', destination: '飯能方面' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 8, type: '各停', destination: '飯能方面' },
      ],
    },
    {
      label: '飯能→池袋',
      stations: [
        { name: '入間市', offset: 0 }, { name: '稲荷山公園', offset: 3 }, { name: '武蔵藤沢', offset: 6 },
        { name: '狭山ヶ丘', offset: 9 }, { name: '小手指', offset: 12 }, { name: '西所沢', offset: 15 },
        { name: '所沢', offset: 18 }, { name: '秋津', offset: 21 }, { name: '清瀬', offset: 24 },
        { name: '東久留米', offset: 27 }, { name: 'ひばりヶ丘', offset: 30 }, { name: '保谷', offset: 33 },
        { name: '大泉学園', offset: 36 }, { name: '石神井公園', offset: 39 }, { name: '練馬高野台', offset: 41 },
        { name: '富士見台', offset: 43 }, { name: '中村橋', offset: 45 }, { name: '練馬', offset: 48 },
        { name: '桜台', offset: 50 }, { name: '江古田', offset: 52 }, { name: '東長崎', offset: 54 },
        { name: '椎名町', offset: 56 }, { name: '池袋', offset: 59 },
      ],
      patterns: [
        { fromMin: m(4,30), toMin: m(7), intervalMin: 9, type: '各停', destination: '池袋行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 4, type: '各停', destination: '池袋行き' },
        { fromMin: m(9), toMin: m(17), intervalMin: 6, type: '各停', destination: '池袋行き' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 4, type: '各停', destination: '池袋行き' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 8, type: '各停', destination: '池袋行き' },
      ],
    },
  ],
};

const tobuTojoData: LineTimetableData = {
  key: 'tobuTojoLine', name: '東武東上線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '池袋→小川町',
      stations: [
        { name: '池袋', offset: 0 }, { name: '下板橋', offset: 3 }, { name: '大山', offset: 5 },
        { name: '中板橋', offset: 7 }, { name: '常盤台', offset: 9 }, { name: '上板橋', offset: 11 },
        { name: '東武練馬', offset: 14 }, { name: '下赤塚', offset: 16 }, { name: '成増', offset: 19 },
        { name: '和光市', offset: 22 }, { name: '朝霞', offset: 25 }, { name: '朝霞台', offset: 28 },
        { name: '志木', offset: 31 }, { name: '柳瀬川', offset: 34 }, { name: 'みずほ台', offset: 36 },
        { name: '鶴瀬', offset: 38 }, { name: 'ふじみ野', offset: 41 }, { name: '上福岡', offset: 44 },
        { name: '新河岸', offset: 47 }, { name: '川越', offset: 51 }, { name: '川越市', offset: 54 },
        { name: '霞ケ関', offset: 57 }, { name: '鶴ケ島', offset: 60 }, { name: '若葉', offset: 63 },
        { name: '坂戸', offset: 66 }, { name: '北坂戸', offset: 69 }, { name: '高坂', offset: 72 },
        { name: '東松山', offset: 75 }, { name: '森林公園', offset: 79 }, { name: 'つきのわ', offset: 82 },
        { name: '武蔵嵐山', offset: 85 }, { name: '小川町', offset: 90 },
      ],
      patterns: [
        { fromMin: m(4,30), toMin: m(7), intervalMin: 9, type: '各停', destination: '川越・小川町方面' },
        { fromMin: m(7), toMin: m(9), intervalMin: 3, type: '各停', destination: '川越・小川町方面' },
        { fromMin: m(7), toMin: m(9), intervalMin: 8, type: '急行', destination: '川越市行き' },
        { fromMin: m(9), toMin: m(17), intervalMin: 5, type: '各停', destination: '川越・小川町方面' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 3, type: '各停', destination: '川越・小川町方面' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 8, type: '各停', destination: '川越・小川町方面' },
      ],
    },
    {
      label: '小川町→池袋',
      stations: [
        { name: '小川町', offset: 0 }, { name: '武蔵嵐山', offset: 5 }, { name: 'つきのわ', offset: 8 },
        { name: '森林公園', offset: 11 }, { name: '東松山', offset: 15 }, { name: '高坂', offset: 18 },
        { name: '北坂戸', offset: 21 }, { name: '坂戸', offset: 24 }, { name: '若葉', offset: 27 },
        { name: '鶴ケ島', offset: 30 }, { name: '霞ケ関', offset: 33 }, { name: '川越市', offset: 36 },
        { name: '川越', offset: 39 }, { name: '新河岸', offset: 43 }, { name: '上福岡', offset: 46 },
        { name: 'ふじみ野', offset: 49 }, { name: '鶴瀬', offset: 52 }, { name: 'みずほ台', offset: 54 },
        { name: '柳瀬川', offset: 56 }, { name: '志木', offset: 59 }, { name: '朝霞台', offset: 62 },
        { name: '朝霞', offset: 65 }, { name: '和光市', offset: 68 }, { name: '成増', offset: 71 },
        { name: '下赤塚', offset: 74 }, { name: '東武練馬', offset: 76 }, { name: '上板橋', offset: 79 },
        { name: '常盤台', offset: 81 }, { name: '中板橋', offset: 83 }, { name: '大山', offset: 85 },
        { name: '下板橋', offset: 87 }, { name: '池袋', offset: 90 },
      ],
      patterns: [
        { fromMin: m(4,30), toMin: m(7), intervalMin: 9, type: '各停', destination: '池袋行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 3, type: '各停', destination: '池袋行き' },
        { fromMin: m(9), toMin: m(17), intervalMin: 5, type: '各停', destination: '池袋行き' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 3, type: '各停', destination: '池袋行き' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 8, type: '各停', destination: '池袋行き' },
      ],
    },
  ],
};

const tsukubaExpressData: LineTimetableData = {
  key: 'tsukubaExpress', name: 'つくばエクスプレス', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '秋葉原→つくば',
      stations: [
        { name: '秋葉原', offset: 0 }, { name: '新御徒町', offset: 3 }, { name: '浅草', offset: 5 },
        { name: '南千住', offset: 8 }, { name: '北千住', offset: 11 }, { name: '青井', offset: 14 },
        { name: '六町', offset: 16 }, { name: '八潮', offset: 19 }, { name: '三郷中央', offset: 23 },
        { name: '南流山', offset: 27 }, { name: '流山セントラルパーク', offset: 30 }, { name: '流山おおたかの森', offset: 33 },
        { name: '柏の葉キャンパス', offset: 37 }, { name: '柏たなか', offset: 40 }, { name: '守谷', offset: 44 },
        { name: 'みらい平', offset: 49 }, { name: 'みどりの', offset: 53 }, { name: '万博記念公園', offset: 56 },
        { name: '研究学園', offset: 59 }, { name: 'つくば', offset: 63 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 10, type: '各停', destination: 'つくば行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 5, type: '各停', destination: 'つくば行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 8, type: '快速', destination: 'つくば行き' },
        { fromMin: m(9), toMin: m(17), intervalMin: 7, type: '各停', destination: 'つくば行き' },
        { fromMin: m(9), toMin: m(17), intervalMin: 15, type: '快速', destination: 'つくば行き' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 5, type: '各停', destination: 'つくば行き' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 10, type: '各停', destination: 'つくば行き' },
      ],
    },
    {
      label: 'つくば→秋葉原',
      stations: [
        { name: 'つくば', offset: 0 }, { name: '研究学園', offset: 4 }, { name: '万博記念公園', offset: 7 },
        { name: 'みどりの', offset: 10 }, { name: 'みらい平', offset: 14 }, { name: '守谷', offset: 19 },
        { name: '柏たなか', offset: 23 }, { name: '柏の葉キャンパス', offset: 26 }, { name: '流山おおたかの森', offset: 30 },
        { name: '流山セントラルパーク', offset: 33 }, { name: '南流山', offset: 36 }, { name: '三郷中央', offset: 40 },
        { name: '八潮', offset: 44 }, { name: '六町', offset: 47 }, { name: '青井', offset: 49 },
        { name: '北千住', offset: 52 }, { name: '南千住', offset: 55 }, { name: '浅草', offset: 58 },
        { name: '新御徒町', offset: 60 }, { name: '秋葉原', offset: 63 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 10, type: '各停', destination: '秋葉原行き' },
        { fromMin: m(7), toMin: m(9), intervalMin: 5, type: '各停', destination: '秋葉原行き' },
        { fromMin: m(9), toMin: m(17), intervalMin: 7, type: '各停', destination: '秋葉原行き' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 5, type: '各停', destination: '秋葉原行き' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 10, type: '各停', destination: '秋葉原行き' },
      ],
    },
  ],
};

const meguroData: LineTimetableData = {
  key: 'tokyuMeguro', name: '東急目黒線', updatedAt: '2025-03-15', dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '目黒→日吉',
      stations: [
        { name: '目黒', offset: 0 }, { name: '不動前', offset: 2 }, { name: '武蔵小山', offset: 4 },
        { name: '西小山', offset: 6 }, { name: '洗足', offset: 8 }, { name: '大岡山', offset: 10 },
        { name: '奥沢', offset: 12 }, { name: '田園調布', offset: 14 }, { name: '多摩川', offset: 16 },
        { name: '新丸子', offset: 19 }, { name: '武蔵小杉', offset: 21 }, { name: '元住吉', offset: 24 },
        { name: '日吉', offset: 27 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 7, type: '各停', destination: '日吉行き' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 3, type: '各停', destination: '日吉行き' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '日吉行き' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 3, type: '各停', destination: '日吉行き' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 6, type: '各停', destination: '日吉行き' },
      ],
    },
    {
      label: '日吉→目黒',
      stations: [
        { name: '日吉', offset: 0 }, { name: '元住吉', offset: 3 }, { name: '武蔵小杉', offset: 6 },
        { name: '新丸子', offset: 8 }, { name: '多摩川', offset: 11 }, { name: '田園調布', offset: 13 },
        { name: '奥沢', offset: 15 }, { name: '大岡山', offset: 17 }, { name: '洗足', offset: 19 },
        { name: '西小山', offset: 21 }, { name: '武蔵小山', offset: 23 }, { name: '不動前', offset: 25 },
        { name: '目黒', offset: 27 },
      ],
      patterns: [
        { fromMin: m(5), toMin: m(7), intervalMin: 7, type: '各停', destination: '目黒行き' },
        { fromMin: m(7), toMin: m(9,30), intervalMin: 3, type: '各停', destination: '目黒行き' },
        { fromMin: m(9,30), toMin: m(17), intervalMin: 5, type: '各停', destination: '目黒行き' },
        { fromMin: m(17), toMin: m(20,30), intervalMin: 3, type: '各停', destination: '目黒行き' },
        { fromMin: m(20,30), toMin: m(24), intervalMin: 6, type: '各停', destination: '目黒行き' },
      ],
    },
  ],
};

// ── 追加路線データ（第2弾）──────────────────────────────

const jrUtsunomiyaData: LineTimetableData = {
  key: 'jrUtsunomiyaLine',
  name: '宇都宮線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '東京→宇都宮方面',
      stations: [
        { name: '東京', offset: 0 }, { name: '上野', offset: 5 }, { name: '赤羽', offset: 14 },
        { name: '浦和', offset: 20 }, { name: 'さいたま新都心', offset: 24 }, { name: '大宮', offset: 28 },
        { name: '土呂', offset: 32 }, { name: '東大宮', offset: 36 }, { name: '蓮田', offset: 40 },
        { name: '白岡', offset: 44 }, { name: '新白岡', offset: 47 }, { name: '久喜', offset: 51 },
        { name: '東鷲宮', offset: 54 }, { name: '栗橋', offset: 59 }, { name: '古河', offset: 67 },
        { name: '野木', offset: 71 }, { name: '間々田', offset: 75 }, { name: '小山', offset: 82 },
        { name: '小金井', offset: 88 }, { name: '自治医大', offset: 92 }, { name: '石橋', offset: 97 },
        { name: '雀宮', offset: 103 }, { name: '宇都宮', offset: 110 },
      ],
      patterns: [
        { fromMin: m(5),  toMin: m(7),    intervalMin: 20, type: '普通', destination: '宇都宮行き' },
        { fromMin: m(7),  toMin: m(9),    intervalMin: 15, type: '普通', destination: '宇都宮行き' },
        { fromMin: m(9),  toMin: m(17),   intervalMin: 20, type: '普通', destination: '宇都宮行き' },
        { fromMin: m(17), toMin: m(20),   intervalMin: 15, type: '普通', destination: '宇都宮行き' },
        { fromMin: m(20), toMin: m(23),   intervalMin: 20, type: '普通', destination: '宇都宮行き' },
      ],
    },
    {
      label: '宇都宮→東京方面',
      stations: [
        { name: '宇都宮', offset: 0 }, { name: '雀宮', offset: 7 }, { name: '石橋', offset: 13 },
        { name: '自治医大', offset: 18 }, { name: '小金井', offset: 22 }, { name: '小山', offset: 28 },
        { name: '間々田', offset: 35 }, { name: '野木', offset: 39 }, { name: '古河', offset: 43 },
        { name: '栗橋', offset: 51 }, { name: '東鷲宮', offset: 56 }, { name: '久喜', offset: 59 },
        { name: '新白岡', offset: 63 }, { name: '白岡', offset: 66 }, { name: '蓮田', offset: 70 },
        { name: '東大宮', offset: 74 }, { name: '土呂', offset: 78 }, { name: '大宮', offset: 82 },
        { name: 'さいたま新都心', offset: 86 }, { name: '浦和', offset: 90 }, { name: '赤羽', offset: 96 },
        { name: '上野', offset: 105 }, { name: '東京', offset: 110 },
      ],
      patterns: [
        { fromMin: m(5),  toMin: m(7),    intervalMin: 20, type: '普通', destination: '東京行き' },
        { fromMin: m(7),  toMin: m(9),    intervalMin: 15, type: '普通', destination: '東京行き' },
        { fromMin: m(9),  toMin: m(17),   intervalMin: 20, type: '普通', destination: '東京行き' },
        { fromMin: m(17), toMin: m(20),   intervalMin: 15, type: '普通', destination: '東京行き' },
        { fromMin: m(20), toMin: m(23),   intervalMin: 20, type: '普通', destination: '東京行き' },
      ],
    },
  ],
};

const jrNegishiData: LineTimetableData = {
  key: 'jrNegishiLine',
  name: '根岸線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '横浜→大船方面',
      stations: [
        { name: '横浜', offset: 0 }, { name: '桜木町', offset: 4 }, { name: '関内', offset: 7 },
        { name: '石川町', offset: 9 }, { name: '山手', offset: 12 }, { name: '根岸', offset: 15 },
        { name: '磯子', offset: 18 }, { name: '新杉田', offset: 21 }, { name: '洋光台', offset: 24 },
        { name: '港南台', offset: 27 }, { name: '本郷台', offset: 30 }, { name: '大船', offset: 33 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 10, type: '普通', destination: '大船行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '普通', destination: '大船行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 8,  type: '普通', destination: '大船行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '普通', destination: '大船行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 10, type: '普通', destination: '大船行き' },
      ],
    },
    {
      label: '大船→横浜方面',
      stations: [
        { name: '大船', offset: 0 }, { name: '本郷台', offset: 3 }, { name: '港南台', offset: 6 },
        { name: '洋光台', offset: 9 }, { name: '新杉田', offset: 12 }, { name: '磯子', offset: 15 },
        { name: '根岸', offset: 18 }, { name: '山手', offset: 21 }, { name: '石川町', offset: 24 },
        { name: '関内', offset: 26 }, { name: '桜木町', offset: 29 }, { name: '横浜', offset: 33 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 10, type: '普通', destination: '横浜行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '普通', destination: '横浜行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 8,  type: '普通', destination: '横浜行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '普通', destination: '横浜行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 10, type: '普通', destination: '横浜行き' },
      ],
    },
  ],
};

const keioInokashiraData: LineTimetableData = {
  key: 'keioInokashiraLine',
  name: '京王井の頭線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '渋谷→吉祥寺方面',
      stations: [
        { name: '渋谷', offset: 0 }, { name: '神泉', offset: 2 }, { name: '駒場東大前', offset: 4 },
        { name: '池ノ上', offset: 6 }, { name: '下北沢', offset: 8 }, { name: '新代田', offset: 10 },
        { name: '東松原', offset: 12 }, { name: '明大前', offset: 14 }, { name: '永福町', offset: 17 },
        { name: '西永福', offset: 19 }, { name: '浜田山', offset: 21 }, { name: '高井戸', offset: 23 },
        { name: '富士見ヶ丘', offset: 25 }, { name: '久我山', offset: 27 }, { name: '三鷹台', offset: 29 },
        { name: '井の頭公園', offset: 31 }, { name: '吉祥寺', offset: 33 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 10, type: '各停', destination: '吉祥寺行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '各停', destination: '吉祥寺行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 7,  type: '各停', destination: '吉祥寺行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '吉祥寺行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 10, type: '各停', destination: '吉祥寺行き' },
      ],
    },
    {
      label: '吉祥寺→渋谷方面',
      stations: [
        { name: '吉祥寺', offset: 0 }, { name: '井の頭公園', offset: 2 }, { name: '三鷹台', offset: 4 },
        { name: '久我山', offset: 6 }, { name: '富士見ヶ丘', offset: 8 }, { name: '高井戸', offset: 10 },
        { name: '浜田山', offset: 12 }, { name: '西永福', offset: 14 }, { name: '永福町', offset: 16 },
        { name: '明大前', offset: 19 }, { name: '東松原', offset: 21 }, { name: '新代田', offset: 23 },
        { name: '下北沢', offset: 25 }, { name: '池ノ上', offset: 27 }, { name: '駒場東大前', offset: 29 },
        { name: '神泉', offset: 31 }, { name: '渋谷', offset: 33 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 10, type: '各停', destination: '渋谷行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '各停', destination: '渋谷行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 7,  type: '各停', destination: '渋谷行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '渋谷行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 10, type: '各停', destination: '渋谷行き' },
      ],
    },
  ],
};

const tokyuOimachiData: LineTimetableData = {
  key: 'tokyuOimachiLine',
  name: '東急大井町線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '大井町→二子玉川方面',
      stations: [
        { name: '大井町', offset: 0 }, { name: '下神明', offset: 2 }, { name: '戸越公園', offset: 4 },
        { name: '中延', offset: 6 }, { name: '荏原町', offset: 8 }, { name: '旗の台', offset: 10 },
        { name: '北千束', offset: 12 }, { name: '大岡山', offset: 14 }, { name: '緑が丘', offset: 16 },
        { name: '自由が丘', offset: 18 }, { name: '九品仏', offset: 20 }, { name: '尾山台', offset: 22 },
        { name: '等々力', offset: 24 }, { name: '上野毛', offset: 26 }, { name: '二子玉川', offset: 28 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 8,  type: '各停', destination: '二子玉川行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '各停', destination: '二子玉川行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 7,  type: '各停', destination: '二子玉川行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '二子玉川行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 8,  type: '各停', destination: '二子玉川行き' },
      ],
    },
    {
      label: '二子玉川→大井町方面',
      stations: [
        { name: '二子玉川', offset: 0 }, { name: '上野毛', offset: 2 }, { name: '等々力', offset: 4 },
        { name: '尾山台', offset: 6 }, { name: '九品仏', offset: 8 }, { name: '自由が丘', offset: 10 },
        { name: '緑が丘', offset: 12 }, { name: '大岡山', offset: 14 }, { name: '北千束', offset: 16 },
        { name: '旗の台', offset: 18 }, { name: '荏原町', offset: 20 }, { name: '中延', offset: 22 },
        { name: '戸越公園', offset: 24 }, { name: '下神明', offset: 26 }, { name: '大井町', offset: 28 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 8,  type: '各停', destination: '大井町行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '各停', destination: '大井町行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 7,  type: '各停', destination: '大井町行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '大井町行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 8,  type: '各停', destination: '大井町行き' },
      ],
    },
  ],
};

const tobuIsesakiData: LineTimetableData = {
  key: 'tobuIsesakiLine',
  name: '東武伊勢崎線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '浅草→竹ノ塚方面',
      stations: [
        { name: '浅草', offset: 0 }, { name: 'とうきょうスカイツリー', offset: 3 }, { name: '押上', offset: 4 },
        { name: '曳舟', offset: 6 }, { name: '東向島', offset: 8 }, { name: '鐘ヶ淵', offset: 10 },
        { name: '堀切', offset: 13 }, { name: '牛田', offset: 15 }, { name: '北千住', offset: 17 },
        { name: '小菅', offset: 19 }, { name: '五反野', offset: 21 }, { name: '梅島', offset: 23 },
        { name: '西新井', offset: 25 }, { name: '竹ノ塚', offset: 28 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 8,  type: '各停', destination: '竹ノ塚行き' },
        { fromMin: m(7),    toMin: m(9,30), intervalMin: 5,  type: '各停', destination: '竹ノ塚行き' },
        { fromMin: m(9,30), toMin: m(17),   intervalMin: 7,  type: '各停', destination: '竹ノ塚行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '竹ノ塚行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 8,  type: '各停', destination: '竹ノ塚行き' },
      ],
    },
    {
      label: '竹ノ塚→浅草方面',
      stations: [
        { name: '竹ノ塚', offset: 0 }, { name: '西新井', offset: 3 }, { name: '梅島', offset: 5 },
        { name: '五反野', offset: 7 }, { name: '小菅', offset: 9 }, { name: '北千住', offset: 11 },
        { name: '牛田', offset: 13 }, { name: '堀切', offset: 15 }, { name: '鐘ヶ淵', offset: 18 },
        { name: '東向島', offset: 20 }, { name: '曳舟', offset: 22 }, { name: '押上', offset: 24 },
        { name: 'とうきょうスカイツリー', offset: 25 }, { name: '浅草', offset: 28 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 8,  type: '各停', destination: '浅草行き' },
        { fromMin: m(7),    toMin: m(9,30), intervalMin: 5,  type: '各停', destination: '浅草行き' },
        { fromMin: m(9,30), toMin: m(17),   intervalMin: 7,  type: '各停', destination: '浅草行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '浅草行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 8,  type: '各停', destination: '浅草行き' },
      ],
    },
  ],
};

const sotetsuMainData: LineTimetableData = {
  key: 'sotetsuMainLine',
  name: '相鉄本線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '横浜→海老名方面',
      stations: [
        { name: '横浜', offset: 0 }, { name: '平沼橋', offset: 2 }, { name: '西横浜', offset: 4 },
        { name: '天王町', offset: 6 }, { name: '星川', offset: 8 }, { name: '和田町', offset: 10 },
        { name: '上星川', offset: 12 }, { name: '西谷', offset: 15 }, { name: '鶴ヶ峰', offset: 18 },
        { name: '二俣川', offset: 21 }, { name: '希望ヶ丘', offset: 23 }, { name: '三ツ境', offset: 26 },
        { name: '瀬谷', offset: 29 }, { name: '大和', offset: 32 }, { name: '相模大塚', offset: 34 },
        { name: 'さがみ野', offset: 36 }, { name: 'かしわ台', offset: 38 }, { name: '海老名', offset: 41 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 10, type: '各停', destination: '海老名行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 6,  type: '各停', destination: '海老名行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '各停', destination: '海老名行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 6,  type: '各停', destination: '海老名行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 10, type: '各停', destination: '海老名行き' },
      ],
    },
    {
      label: '海老名→横浜方面',
      stations: [
        { name: '海老名', offset: 0 }, { name: 'かしわ台', offset: 3 }, { name: 'さがみ野', offset: 5 },
        { name: '相模大塚', offset: 7 }, { name: '大和', offset: 9 }, { name: '瀬谷', offset: 12 },
        { name: '三ツ境', offset: 15 }, { name: '希望ヶ丘', offset: 18 }, { name: '二俣川', offset: 20 },
        { name: '鶴ヶ峰', offset: 23 }, { name: '西谷', offset: 26 }, { name: '上星川', offset: 29 },
        { name: '和田町', offset: 31 }, { name: '星川', offset: 33 }, { name: '天王町', offset: 35 },
        { name: '西横浜', offset: 37 }, { name: '平沼橋', offset: 39 }, { name: '横浜', offset: 41 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 10, type: '各停', destination: '横浜行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 6,  type: '各停', destination: '横浜行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '各停', destination: '横浜行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 6,  type: '各停', destination: '横浜行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 10, type: '各停', destination: '横浜行き' },
      ],
    },
  ],
};

const sotetsuIzuminoData: LineTimetableData = {
  key: 'sotetsuIzumino',
  name: '相鉄いずみの線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '二俣川→湘南台方面',
      stations: [
        { name: '二俣川', offset: 0 }, { name: '南万騎が原', offset: 3 }, { name: '緑園都市', offset: 6 },
        { name: '弥生台', offset: 9 }, { name: 'いずみ野', offset: 11 }, { name: 'いずみ中央', offset: 13 },
        { name: 'ゆめが丘', offset: 16 }, { name: '湘南台', offset: 19 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 12, type: '各停', destination: '湘南台行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 8,  type: '各停', destination: '湘南台行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 12, type: '各停', destination: '湘南台行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 8,  type: '各停', destination: '湘南台行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 12, type: '各停', destination: '湘南台行き' },
      ],
    },
    {
      label: '湘南台→二俣川方面',
      stations: [
        { name: '湘南台', offset: 0 }, { name: 'ゆめが丘', offset: 3 }, { name: 'いずみ中央', offset: 6 },
        { name: 'いずみ野', offset: 8 }, { name: '弥生台', offset: 10 }, { name: '緑園都市', offset: 13 },
        { name: '南万騎が原', offset: 16 }, { name: '二俣川', offset: 19 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 12, type: '各停', destination: '二俣川行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 8,  type: '各停', destination: '二俣川行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 12, type: '各停', destination: '二俣川行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 8,  type: '各停', destination: '二俣川行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 12, type: '各停', destination: '二俣川行き' },
      ],
    },
  ],
};

const jrSobuChibaData: LineTimetableData = {
  key: 'jrSobuChiba',
  name: '総武線（千葉方面）',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '西船橋→佐倉方面',
      stations: [
        { name: '西船橋', offset: 0 }, { name: '船橋', offset: 4 }, { name: '東船橋', offset: 6 },
        { name: '津田沼', offset: 9 }, { name: '幕張本郷', offset: 12 }, { name: '幕張', offset: 14 },
        { name: '新検見川', offset: 16 }, { name: '稲毛', offset: 19 }, { name: '西千葉', offset: 22 },
        { name: '千葉', offset: 24 }, { name: '東千葉', offset: 27 }, { name: '都賀', offset: 30 },
        { name: '四街道', offset: 34 }, { name: '物井', offset: 38 }, { name: '佐倉', offset: 42 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 12, type: '各停', destination: '佐倉行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 7,  type: '各停', destination: '佐倉行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 12, type: '各停', destination: '佐倉行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 7,  type: '各停', destination: '佐倉行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 12, type: '各停', destination: '佐倉行き' },
      ],
    },
    {
      label: '佐倉→西船橋方面',
      stations: [
        { name: '佐倉', offset: 0 }, { name: '物井', offset: 4 }, { name: '四街道', offset: 8 },
        { name: '都賀', offset: 12 }, { name: '東千葉', offset: 15 }, { name: '千葉', offset: 18 },
        { name: '西千葉', offset: 20 }, { name: '稲毛', offset: 23 }, { name: '新検見川', offset: 26 },
        { name: '幕張', offset: 28 }, { name: '幕張本郷', offset: 30 }, { name: '津田沼', offset: 33 },
        { name: '東船橋', offset: 36 }, { name: '船橋', offset: 38 }, { name: '西船橋', offset: 42 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 12, type: '各停', destination: '西船橋行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 7,  type: '各停', destination: '西船橋行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 12, type: '各停', destination: '西船橋行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 7,  type: '各停', destination: '西船橋行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 12, type: '各停', destination: '西船橋行き' },
      ],
    },
  ],
};

const jrKeiyoData: LineTimetableData = {
  key: 'jrKeiyo',
  name: '京葉線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '東京→蘇我方面',
      stations: [
        { name: '東京', offset: 0 }, { name: '八丁堀', offset: 3 }, { name: '越中島', offset: 5 },
        { name: '潮見', offset: 7 }, { name: '新木場', offset: 10 }, { name: '葛西臨海公園', offset: 12 },
        { name: '舞浜', offset: 15 }, { name: '新浦安', offset: 18 }, { name: '市川塩浜', offset: 22 },
        { name: '二俣新町', offset: 25 }, { name: '南船橋', offset: 28 }, { name: '新習志野', offset: 31 },
        { name: '海浜幕張', offset: 33 }, { name: '検見川浜', offset: 35 }, { name: '稲毛海岸', offset: 38 },
        { name: '千葉みなと', offset: 41 }, { name: '蘇我', offset: 44 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 15, type: '各停', destination: '蘇我行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 8,  type: '各停', destination: '蘇我行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 12, type: '各停', destination: '蘇我行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 8,  type: '各停', destination: '蘇我行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 15, type: '各停', destination: '蘇我行き' },
      ],
    },
    {
      label: '蘇我→東京方面',
      stations: [
        { name: '蘇我', offset: 0 }, { name: '千葉みなと', offset: 3 }, { name: '稲毛海岸', offset: 6 },
        { name: '検見川浜', offset: 9 }, { name: '海浜幕張', offset: 11 }, { name: '新習志野', offset: 13 },
        { name: '南船橋', offset: 16 }, { name: '二俣新町', offset: 19 }, { name: '市川塩浜', offset: 22 },
        { name: '新浦安', offset: 26 }, { name: '舞浜', offset: 29 }, { name: '葛西臨海公園', offset: 32 },
        { name: '新木場', offset: 34 }, { name: '潮見', offset: 37 }, { name: '越中島', offset: 39 },
        { name: '八丁堀', offset: 41 }, { name: '東京', offset: 44 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 15, type: '各停', destination: '東京行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 8,  type: '各停', destination: '東京行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 12, type: '各停', destination: '東京行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 8,  type: '各停', destination: '東京行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 15, type: '各停', destination: '東京行き' },
      ],
    },
  ],
};

const yokohamaBlueData: LineTimetableData = {
  key: 'yokohamaBlueLine',
  name: '横浜市営地下鉄ブルーライン',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '湘南台→あざみ野方面',
      stations: [
        { name: '湘南台', offset: 0 }, { name: '下飯田', offset: 5 }, { name: '立場', offset: 9 },
        { name: '中田', offset: 12 }, { name: '踊場', offset: 15 }, { name: '戸塚', offset: 19 },
        { name: '舞岡', offset: 23 }, { name: '港南中央', offset: 27 }, { name: '上永谷', offset: 30 },
        { name: '上大岡', offset: 34 }, { name: '弘明寺', offset: 37 }, { name: '蒔田', offset: 39 },
        { name: '吉野町', offset: 42 }, { name: '阪東橋', offset: 44 }, { name: '伊勢佐木長者町', offset: 46 },
        { name: '関内', offset: 48 }, { name: '桜木町', offset: 51 }, { name: '高島町', offset: 53 },
        { name: '横浜', offset: 57 }, { name: '三ツ沢下町', offset: 60 }, { name: '三ツ沢上町', offset: 63 },
        { name: '片倉町', offset: 66 }, { name: '岸根公園', offset: 69 }, { name: '新横浜', offset: 73 },
        { name: '北新横浜', offset: 76 }, { name: '新羽', offset: 80 }, { name: '仲町台', offset: 84 },
        { name: 'センター南', offset: 87 }, { name: 'センター北', offset: 91 }, { name: '中川', offset: 94 },
        { name: 'あざみ野', offset: 97 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 10, type: '各停', destination: 'あざみ野行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 6,  type: '各停', destination: 'あざみ野行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 8,  type: '各停', destination: 'あざみ野行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 6,  type: '各停', destination: 'あざみ野行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 10, type: '各停', destination: 'あざみ野行き' },
      ],
    },
    {
      label: 'あざみ野→湘南台方面',
      stations: [
        { name: 'あざみ野', offset: 0 }, { name: '中川', offset: 3 }, { name: 'センター北', offset: 6 },
        { name: 'センター南', offset: 10 }, { name: '仲町台', offset: 13 }, { name: '新羽', offset: 17 },
        { name: '北新横浜', offset: 21 }, { name: '新横浜', offset: 24 }, { name: '岸根公園', offset: 28 },
        { name: '片倉町', offset: 31 }, { name: '三ツ沢上町', offset: 34 }, { name: '三ツ沢下町', offset: 37 },
        { name: '横浜', offset: 40 }, { name: '高島町', offset: 44 }, { name: '桜木町', offset: 46 },
        { name: '関内', offset: 49 }, { name: '伊勢佐木長者町', offset: 51 }, { name: '阪東橋', offset: 53 },
        { name: '吉野町', offset: 55 }, { name: '蒔田', offset: 58 }, { name: '弘明寺', offset: 60 },
        { name: '上大岡', offset: 63 }, { name: '上永谷', offset: 67 }, { name: '港南中央', offset: 70 },
        { name: '舞岡', offset: 74 }, { name: '戸塚', offset: 78 }, { name: '踊場', offset: 82 },
        { name: '中田', offset: 85 }, { name: '立場', offset: 88 }, { name: '下飯田', offset: 92 },
        { name: '湘南台', offset: 97 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 10, type: '各停', destination: '湘南台行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 6,  type: '各停', destination: '湘南台行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 8,  type: '各停', destination: '湘南台行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 6,  type: '各停', destination: '湘南台行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 10, type: '各停', destination: '湘南台行き' },
      ],
    },
  ],
};

const rinkaiData: LineTimetableData = {
  key: 'rinkaiLine',
  name: 'りんかい線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '大崎→新木場方面',
      stations: [
        { name: '大崎', offset: 0 }, { name: '大井町', offset: 3 }, { name: '品川シーサイド', offset: 7 },
        { name: '天王洲アイル', offset: 10 }, { name: '東京テレポート', offset: 14 },
        { name: '国際展示場', offset: 17 }, { name: '東雲', offset: 20 }, { name: '新木場', offset: 22 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 12, type: '各停', destination: '新木場行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 8,  type: '各停', destination: '新木場行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 12, type: '各停', destination: '新木場行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 8,  type: '各停', destination: '新木場行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 12, type: '各停', destination: '新木場行き' },
      ],
    },
    {
      label: '新木場→大崎方面',
      stations: [
        { name: '新木場', offset: 0 }, { name: '東雲', offset: 2 }, { name: '国際展示場', offset: 5 },
        { name: '東京テレポート', offset: 8 }, { name: '天王洲アイル', offset: 12 },
        { name: '品川シーサイド', offset: 15 }, { name: '大井町', offset: 19 }, { name: '大崎', offset: 22 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 12, type: '各停', destination: '大崎行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 8,  type: '各停', destination: '大崎行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 12, type: '各停', destination: '大崎行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 8,  type: '各停', destination: '大崎行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 12, type: '各停', destination: '大崎行き' },
      ],
    },
  ],
};

const yurikamomeData: LineTimetableData = {
  key: 'yurikamomeLine',
  name: 'ゆりかもめ',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '新橋→豊洲方面',
      stations: [
        { name: '新橋', offset: 0 }, { name: '汐留', offset: 2 }, { name: '竹芝', offset: 4 },
        { name: '日の出', offset: 6 }, { name: '芝浦ふ頭', offset: 8 }, { name: 'お台場海浜公園', offset: 11 },
        { name: '台場', offset: 13 }, { name: 'テレコムセンター', offset: 15 }, { name: '青海', offset: 17 },
        { name: '東京国際クルーズターミナル', offset: 19 }, { name: '中央広場前', offset: 21 },
        { name: '有明', offset: 23 }, { name: '有明テニスの森', offset: 25 },
        { name: '市場前', offset: 27 }, { name: '新豊洲', offset: 29 }, { name: '豊洲', offset: 32 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 10, type: '各停', destination: '豊洲行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 7,  type: '各停', destination: '豊洲行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '各停', destination: '豊洲行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 7,  type: '各停', destination: '豊洲行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 10, type: '各停', destination: '豊洲行き' },
      ],
    },
    {
      label: '豊洲→新橋方面',
      stations: [
        { name: '豊洲', offset: 0 }, { name: '新豊洲', offset: 3 }, { name: '市場前', offset: 5 },
        { name: '有明テニスの森', offset: 7 }, { name: '有明', offset: 9 }, { name: '中央広場前', offset: 11 },
        { name: '東京国際クルーズターミナル', offset: 13 }, { name: '青海', offset: 15 },
        { name: 'テレコムセンター', offset: 17 }, { name: '台場', offset: 19 },
        { name: 'お台場海浜公園', offset: 21 }, { name: '芝浦ふ頭', offset: 24 },
        { name: '日の出', offset: 26 }, { name: '竹芝', offset: 28 },
        { name: '汐留', offset: 30 }, { name: '新橋', offset: 32 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 10, type: '各停', destination: '新橋行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 7,  type: '各停', destination: '新橋行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '各停', destination: '新橋行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 7,  type: '各停', destination: '新橋行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 10, type: '各停', destination: '新橋行き' },
      ],
    },
  ],
};

const jrOmeData: LineTimetableData = {
  key: 'jrOmeLine',
  name: '青梅線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '立川→青梅方面',
      stations: [
        { name: '立川', offset: 0 }, { name: '西立川', offset: 3 }, { name: '東中神', offset: 5 },
        { name: '中神', offset: 7 }, { name: '昭島', offset: 9 }, { name: '拝島', offset: 12 },
        { name: '牛浜', offset: 14 }, { name: '福生', offset: 16 }, { name: '羽村', offset: 18 },
        { name: '小作', offset: 21 }, { name: '河辺', offset: 23 }, { name: '東青梅', offset: 25 },
        { name: '青梅', offset: 27 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 20, type: '各停', destination: '青梅行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 12, type: '各停', destination: '青梅行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 20, type: '各停', destination: '青梅行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 12, type: '各停', destination: '青梅行き' },
        { fromMin: m(20),   toMin: m(23),   intervalMin: 20, type: '各停', destination: '青梅行き' },
      ],
    },
    {
      label: '青梅→立川方面',
      stations: [
        { name: '青梅', offset: 0 }, { name: '東青梅', offset: 2 }, { name: '河辺', offset: 4 },
        { name: '小作', offset: 6 }, { name: '羽村', offset: 9 }, { name: '福生', offset: 11 },
        { name: '牛浜', offset: 13 }, { name: '拝島', offset: 15 }, { name: '昭島', offset: 18 },
        { name: '中神', offset: 20 }, { name: '東中神', offset: 22 }, { name: '西立川', offset: 24 },
        { name: '立川', offset: 27 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 20, type: '各停', destination: '立川行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 12, type: '各停', destination: '立川行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 20, type: '各停', destination: '立川行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 12, type: '各停', destination: '立川行き' },
        { fromMin: m(20),   toMin: m(23),   intervalMin: 20, type: '各停', destination: '立川行き' },
      ],
    },
  ],
};

const nipporiToneriData: LineTimetableData = {
  key: 'nipporiToneriLiner',
  name: '日暮里・舎人ライナー',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '日暮里→見沼代親水公園方面',
      stations: [
        { name: '日暮里', offset: 0 }, { name: '西日暮里', offset: 2 }, { name: '赤土小学校前', offset: 4 },
        { name: '熊野前', offset: 6 }, { name: '足立小台', offset: 8 }, { name: '扇大橋', offset: 10 },
        { name: '高野', offset: 12 }, { name: '江北', offset: 14 }, { name: '西新井大師西', offset: 16 },
        { name: '谷在家', offset: 18 }, { name: '舎人公園', offset: 20 }, { name: '舎人', offset: 22 },
        { name: '見沼代親水公園', offset: 24 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 10, type: '各停', destination: '見沼代親水公園行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '各停', destination: '見沼代親水公園行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 8,  type: '各停', destination: '見沼代親水公園行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '見沼代親水公園行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 10, type: '各停', destination: '見沼代親水公園行き' },
      ],
    },
    {
      label: '見沼代親水公園→日暮里方面',
      stations: [
        { name: '見沼代親水公園', offset: 0 }, { name: '舎人', offset: 2 }, { name: '舎人公園', offset: 4 },
        { name: '谷在家', offset: 6 }, { name: '西新井大師西', offset: 8 }, { name: '江北', offset: 10 },
        { name: '高野', offset: 12 }, { name: '扇大橋', offset: 14 }, { name: '足立小台', offset: 16 },
        { name: '熊野前', offset: 18 }, { name: '赤土小学校前', offset: 20 }, { name: '西日暮里', offset: 22 },
        { name: '日暮里', offset: 24 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 10, type: '各停', destination: '日暮里行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '各停', destination: '日暮里行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 8,  type: '各停', destination: '日暮里行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '日暮里行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 10, type: '各停', destination: '日暮里行き' },
      ],
    },
  ],
};

const tamaMonorailData: LineTimetableData = {
  key: 'tamaMonorail',
  name: '多摩モノレール',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '上北台→多摩センター方面',
      stations: [
        { name: '上北台', offset: 0 }, { name: '桜街道', offset: 2 }, { name: '玉川上水', offset: 4 },
        { name: '砂川七番', offset: 6 }, { name: '泉体育館', offset: 8 }, { name: '立飛', offset: 10 },
        { name: '高松', offset: 12 }, { name: '立川北', offset: 15 }, { name: '立川南', offset: 17 },
        { name: '柴崎体育館', offset: 19 }, { name: '甲州街道', offset: 21 }, { name: '万願寺', offset: 23 },
        { name: '高幡不動', offset: 26 }, { name: '程久保', offset: 28 }, { name: '中央大学・明星大学', offset: 30 },
        { name: '大塚・帝京大学', offset: 32 }, { name: '松が谷', offset: 34 }, { name: '多摩センター', offset: 37 },
      ],
      patterns: [
        { fromMin: m(6),    toMin: m(7),    intervalMin: 10, type: '各停', destination: '多摩センター行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 6,  type: '各停', destination: '多摩センター行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '各停', destination: '多摩センター行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 6,  type: '各停', destination: '多摩センター行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 10, type: '各停', destination: '多摩センター行き' },
      ],
    },
    {
      label: '多摩センター→上北台方面',
      stations: [
        { name: '多摩センター', offset: 0 }, { name: '松が谷', offset: 3 }, { name: '大塚・帝京大学', offset: 5 },
        { name: '中央大学・明星大学', offset: 7 }, { name: '程久保', offset: 9 }, { name: '高幡不動', offset: 11 },
        { name: '万願寺', offset: 14 }, { name: '甲州街道', offset: 16 }, { name: '柴崎体育館', offset: 18 },
        { name: '立川南', offset: 20 }, { name: '立川北', offset: 22 }, { name: '高松', offset: 25 },
        { name: '立飛', offset: 27 }, { name: '泉体育館', offset: 29 }, { name: '砂川七番', offset: 31 },
        { name: '玉川上水', offset: 33 }, { name: '桜街道', offset: 35 }, { name: '上北台', offset: 37 },
      ],
      patterns: [
        { fromMin: m(6),    toMin: m(7),    intervalMin: 10, type: '各停', destination: '上北台行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 6,  type: '各停', destination: '上北台行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '各停', destination: '上北台行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 6,  type: '各停', destination: '上北台行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 10, type: '各停', destination: '上北台行き' },
      ],
    },
  ],
};

const tokyuTamagawaData: LineTimetableData = {
  key: 'tokyuTamagawa',
  name: '東急多摩川線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '多摩川→蒲田方面',
      stations: [
        { name: '多摩川', offset: 0 }, { name: '沼部', offset: 2 }, { name: '鵜の木', offset: 4 },
        { name: '下丸子', offset: 6 }, { name: '武蔵新田', offset: 8 }, { name: '矢口渡', offset: 10 },
        { name: '蒲田', offset: 12 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 8,  type: '各停', destination: '蒲田行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '各停', destination: '蒲田行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 7,  type: '各停', destination: '蒲田行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '蒲田行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 8,  type: '各停', destination: '蒲田行き' },
      ],
    },
    {
      label: '蒲田→多摩川方面',
      stations: [
        { name: '蒲田', offset: 0 }, { name: '矢口渡', offset: 2 }, { name: '武蔵新田', offset: 4 },
        { name: '下丸子', offset: 6 }, { name: '鵜の木', offset: 8 }, { name: '沼部', offset: 10 },
        { name: '多摩川', offset: 12 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 8,  type: '各停', destination: '多摩川行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '各停', destination: '多摩川行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 7,  type: '各停', destination: '多摩川行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '多摩川行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 8,  type: '各停', destination: '多摩川行き' },
      ],
    },
  ],
};

const tokyuIkegamiData: LineTimetableData = {
  key: 'tokyuIkegami',
  name: '東急池上線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '五反田→蒲田方面',
      stations: [
        { name: '五反田', offset: 0 }, { name: '大崎広小路', offset: 2 }, { name: '戸越銀座', offset: 4 },
        { name: '荏原中延', offset: 6 }, { name: '旗の台', offset: 8 }, { name: '長原', offset: 10 },
        { name: '洗足池', offset: 12 }, { name: '石川台', offset: 14 }, { name: '雪が谷大塚', offset: 16 },
        { name: '御嶽山', offset: 18 }, { name: '久が原', offset: 20 }, { name: '千鳥町', offset: 22 },
        { name: '池上', offset: 24 }, { name: '蓮沼', offset: 26 }, { name: '蒲田', offset: 28 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 8,  type: '各停', destination: '蒲田行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '各停', destination: '蒲田行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 7,  type: '各停', destination: '蒲田行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '蒲田行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 8,  type: '各停', destination: '蒲田行き' },
      ],
    },
    {
      label: '蒲田→五反田方面',
      stations: [
        { name: '蒲田', offset: 0 }, { name: '蓮沼', offset: 2 }, { name: '池上', offset: 4 },
        { name: '千鳥町', offset: 6 }, { name: '久が原', offset: 8 }, { name: '御嶽山', offset: 10 },
        { name: '雪が谷大塚', offset: 12 }, { name: '石川台', offset: 14 }, { name: '洗足池', offset: 16 },
        { name: '長原', offset: 18 }, { name: '旗の台', offset: 20 }, { name: '荏原中延', offset: 22 },
        { name: '戸越銀座', offset: 24 }, { name: '大崎広小路', offset: 26 }, { name: '五反田', offset: 28 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 8,  type: '各停', destination: '五反田行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 5,  type: '各停', destination: '五反田行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 7,  type: '各停', destination: '五反田行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '五反田行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 8,  type: '各停', destination: '五反田行き' },
      ],
    },
  ],
};

const yokohamaGreenData: LineTimetableData = {
  key: 'yokohamaGreenLine',
  name: '横浜市営地下鉄グリーンライン',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '中山→日吉方面',
      stations: [
        { name: '中山', offset: 0 }, { name: '川和町', offset: 3 }, { name: '都筑ふれあいの丘', offset: 6 },
        { name: 'センター南', offset: 9 }, { name: 'センター北', offset: 11 }, { name: '北山田', offset: 14 },
        { name: '東山田', offset: 17 }, { name: '高田', offset: 19 }, { name: '日吉本町', offset: 21 },
        { name: '日吉', offset: 24 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 12, type: '各停', destination: '日吉行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 7,  type: '各停', destination: '日吉行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '各停', destination: '日吉行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 7,  type: '各停', destination: '日吉行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 12, type: '各停', destination: '日吉行き' },
      ],
    },
    {
      label: '日吉→中山方面',
      stations: [
        { name: '日吉', offset: 0 }, { name: '日吉本町', offset: 3 }, { name: '高田', offset: 5 },
        { name: '東山田', offset: 7 }, { name: '北山田', offset: 10 }, { name: 'センター北', offset: 13 },
        { name: 'センター南', offset: 15 }, { name: '都筑ふれあいの丘', offset: 18 }, { name: '川和町', offset: 21 },
        { name: '中山', offset: 24 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 12, type: '各停', destination: '中山行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 7,  type: '各停', destination: '中山行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '各停', destination: '中山行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 7,  type: '各停', destination: '中山行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 12, type: '各停', destination: '中山行き' },
      ],
    },
  ],
};

const keioSagamiharaData: LineTimetableData = {
  key: 'keioSagamiharaLine',
  name: '京王相模原線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '調布→橋本方面',
      stations: [
        { name: '調布', offset: 0 }, { name: '京王多摩川', offset: 2 }, { name: '京王稲田堤', offset: 5 },
        { name: '京王よみうりランド', offset: 7 }, { name: '稲城', offset: 10 }, { name: '若葉台', offset: 13 },
        { name: '京王永山', offset: 16 }, { name: '京王多摩センター', offset: 19 }, { name: '京王堀之内', offset: 21 },
        { name: '南大沢', offset: 23 }, { name: '多摩境', offset: 26 }, { name: '橋本', offset: 29 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 12, type: '各停', destination: '橋本行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 8,  type: '各停', destination: '橋本行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '各停', destination: '橋本行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 8,  type: '各停', destination: '橋本行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 12, type: '各停', destination: '橋本行き' },
      ],
    },
    {
      label: '橋本→調布方面',
      stations: [
        { name: '橋本', offset: 0 }, { name: '多摩境', offset: 3 }, { name: '南大沢', offset: 6 },
        { name: '京王堀之内', offset: 8 }, { name: '京王多摩センター', offset: 10 }, { name: '京王永山', offset: 13 },
        { name: '若葉台', offset: 16 }, { name: '稲城', offset: 19 }, { name: '京王よみうりランド', offset: 22 },
        { name: '京王稲田堤', offset: 24 }, { name: '京王多摩川', offset: 27 }, { name: '調布', offset: 29 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 12, type: '各停', destination: '調布行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 8,  type: '各停', destination: '調布行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '各停', destination: '調布行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 8,  type: '各停', destination: '調布行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 12, type: '各停', destination: '調布行き' },
      ],
    },
  ],
};

const odakyuTamaData: LineTimetableData = {
  key: 'odakyuTamaLine',
  name: '小田急多摩線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '新百合ヶ丘→唐木田方面',
      stations: [
        { name: '新百合ヶ丘', offset: 0 }, { name: '五月台', offset: 3 }, { name: '栗平', offset: 5 },
        { name: '黒川', offset: 7 }, { name: 'はるひ野', offset: 9 }, { name: '小田急永山', offset: 12 },
        { name: '小田急多摩センター', offset: 15 }, { name: '唐木田', offset: 17 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 15, type: '各停', destination: '唐木田行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 10, type: '各停', destination: '唐木田行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 15, type: '各停', destination: '唐木田行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 10, type: '各停', destination: '唐木田行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 15, type: '各停', destination: '唐木田行き' },
      ],
    },
    {
      label: '唐木田→新百合ヶ丘方面',
      stations: [
        { name: '唐木田', offset: 0 }, { name: '小田急多摩センター', offset: 2 }, { name: '小田急永山', offset: 5 },
        { name: 'はるひ野', offset: 8 }, { name: '黒川', offset: 10 }, { name: '栗平', offset: 12 },
        { name: '五月台', offset: 14 }, { name: '新百合ヶ丘', offset: 17 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 15, type: '各停', destination: '新百合ヶ丘行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 10, type: '各停', destination: '新百合ヶ丘行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 15, type: '各停', destination: '新百合ヶ丘行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 10, type: '各停', destination: '新百合ヶ丘行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 15, type: '各停', destination: '新百合ヶ丘行き' },
      ],
    },
  ],
};

const jrSobuLineData: LineTimetableData = {
  key: 'jrSobuLine',
  name: '総武快速線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '東京→千葉方面',
      stations: [
        { name: '東京', offset: 0 }, { name: '新日本橋', offset: 3 }, { name: '馬喰町', offset: 5 },
        { name: '錦糸町', offset: 8 }, { name: '亀戸', offset: 11 }, { name: '平井', offset: 13 },
        { name: '新小岩', offset: 15 }, { name: '小岩', offset: 18 }, { name: '市川', offset: 21 },
        { name: '本八幡', offset: 23 }, { name: '下総中山', offset: 25 }, { name: '西船橋', offset: 28 },
        { name: '船橋', offset: 31 }, { name: '東船橋', offset: 33 }, { name: '津田沼', offset: 35 },
        { name: '幕張本郷', offset: 37 }, { name: '幕張', offset: 39 }, { name: '新検見川', offset: 41 },
        { name: '稲毛', offset: 43 }, { name: '西千葉', offset: 45 }, { name: '千葉', offset: 47 },
      ],
      patterns: [
        { fromMin: m(4,45), toMin: m(7),    intervalMin: 10, type: '各停', destination: '千葉行き' },
        { fromMin: m(7),    toMin: m(9,30), intervalMin: 5,  type: '各停', destination: '千葉行き' },
        { fromMin: m(9,30), toMin: m(17),   intervalMin: 10, type: '各停', destination: '千葉行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '千葉行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 10, type: '各停', destination: '千葉行き' },
      ],
    },
    {
      label: '千葉→東京方面',
      stations: [
        { name: '千葉', offset: 0 }, { name: '西千葉', offset: 2 }, { name: '稲毛', offset: 4 },
        { name: '新検見川', offset: 6 }, { name: '幕張', offset: 8 }, { name: '幕張本郷', offset: 10 },
        { name: '津田沼', offset: 12 }, { name: '東船橋', offset: 14 }, { name: '船橋', offset: 16 },
        { name: '西船橋', offset: 19 }, { name: '下総中山', offset: 22 }, { name: '本八幡', offset: 24 },
        { name: '市川', offset: 26 }, { name: '小岩', offset: 29 }, { name: '新小岩', offset: 32 },
        { name: '平井', offset: 34 }, { name: '亀戸', offset: 36 }, { name: '錦糸町', offset: 39 },
        { name: '馬喰町', offset: 42 }, { name: '新日本橋', offset: 44 }, { name: '東京', offset: 47 },
      ],
      patterns: [
        { fromMin: m(4,45), toMin: m(7),    intervalMin: 10, type: '各停', destination: '東京行き' },
        { fromMin: m(7),    toMin: m(9,30), intervalMin: 5,  type: '各停', destination: '東京行き' },
        { fromMin: m(9,30), toMin: m(17),   intervalMin: 10, type: '各停', destination: '東京行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 5,  type: '各停', destination: '東京行き' },
        { fromMin: m(20),   toMin: m(24),   intervalMin: 10, type: '各停', destination: '東京行き' },
      ],
    },
  ],
};

const jrTakasakiLineData: LineTimetableData = {
  key: 'jrTakasakiLine',
  name: '高崎線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '東京→高崎方面',
      stations: [
        { name: '東京', offset: 0 }, { name: '上野', offset: 5 }, { name: '尾久', offset: 8 },
        { name: '赤羽', offset: 13 }, { name: '浦和', offset: 19 }, { name: 'さいたま新都心', offset: 23 },
        { name: '大宮', offset: 27 }, { name: '宮原', offset: 31 }, { name: '上尾', offset: 35 },
        { name: '桶川', offset: 39 }, { name: '北本', offset: 43 }, { name: '鴻巣', offset: 47 },
        { name: '熊谷', offset: 57 }, { name: '深谷', offset: 65 }, { name: '本庄', offset: 72 },
        { name: '新町', offset: 78 }, { name: '倉賀野', offset: 85 }, { name: '高崎', offset: 89 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 20, type: '普通', destination: '高崎行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 15, type: '普通', destination: '高崎行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 20, type: '普通', destination: '高崎行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 15, type: '普通', destination: '高崎行き' },
        { fromMin: m(20),   toMin: m(23),   intervalMin: 20, type: '普通', destination: '高崎行き' },
      ],
    },
    {
      label: '高崎→東京方面',
      stations: [
        { name: '高崎', offset: 0 }, { name: '倉賀野', offset: 4 }, { name: '新町', offset: 11 },
        { name: '本庄', offset: 17 }, { name: '深谷', offset: 24 }, { name: '熊谷', offset: 32 },
        { name: '鴻巣', offset: 42 }, { name: '北本', offset: 46 }, { name: '桶川', offset: 50 },
        { name: '上尾', offset: 54 }, { name: '宮原', offset: 58 }, { name: '大宮', offset: 62 },
        { name: 'さいたま新都心', offset: 66 }, { name: '浦和', offset: 70 }, { name: '赤羽', offset: 76 },
        { name: '尾久', offset: 81 }, { name: '上野', offset: 84 }, { name: '東京', offset: 89 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 20, type: '普通', destination: '東京行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 15, type: '普通', destination: '東京行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 20, type: '普通', destination: '東京行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 15, type: '普通', destination: '東京行き' },
        { fromMin: m(20),   toMin: m(23),   intervalMin: 20, type: '普通', destination: '東京行き' },
      ],
    },
  ],
};

const odakyuEnoshimaData: LineTimetableData = {
  key: 'odakyuEnoshimaLine',
  name: '小田急江ノ島線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '相模大野→片瀬江ノ島',
      stations: [
        { name: '相模大野', offset: 0 }, { name: '東林間', offset: 2 }, { name: '中央林間', offset: 4 },
        { name: '南林間', offset: 6 }, { name: '鶴間', offset: 8 }, { name: '大和', offset: 11 },
        { name: '桜ヶ丘', offset: 13 }, { name: '高座渋谷', offset: 15 }, { name: '長後', offset: 18 },
        { name: '湘南台', offset: 21 }, { name: '六会日大前', offset: 23 }, { name: '善行', offset: 25 },
        { name: '藤沢本町', offset: 27 }, { name: '藤沢', offset: 29 }, { name: '本鵠沼', offset: 31 },
        { name: '鵠沼海岸', offset: 33 }, { name: '片瀬江ノ島', offset: 35 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 15, type: '各停', destination: '片瀬江ノ島行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 10, type: '各停', destination: '片瀬江ノ島行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 15, type: '各停', destination: '片瀬江ノ島行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 10, type: '各停', destination: '片瀬江ノ島行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 15, type: '各停', destination: '片瀬江ノ島行き' },
      ],
    },
    {
      label: '片瀬江ノ島→相模大野',
      stations: [
        { name: '片瀬江ノ島', offset: 0 }, { name: '鵠沼海岸', offset: 2 }, { name: '本鵠沼', offset: 4 },
        { name: '藤沢', offset: 6 }, { name: '藤沢本町', offset: 8 }, { name: '善行', offset: 10 },
        { name: '六会日大前', offset: 12 }, { name: '湘南台', offset: 14 }, { name: '長後', offset: 17 },
        { name: '高座渋谷', offset: 20 }, { name: '桜ヶ丘', offset: 22 }, { name: '大和', offset: 24 },
        { name: '鶴間', offset: 27 }, { name: '南林間', offset: 29 }, { name: '中央林間', offset: 31 },
        { name: '東林間', offset: 33 }, { name: '相模大野', offset: 35 },
      ],
      patterns: [
        { fromMin: m(5,30), toMin: m(7),    intervalMin: 15, type: '各停', destination: '相模大野行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 10, type: '各停', destination: '相模大野行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 15, type: '各停', destination: '相模大野行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 10, type: '各停', destination: '相模大野行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 15, type: '各停', destination: '相模大野行き' },
      ],
    },
  ],
};

const seibuShinjukuData: LineTimetableData = {
  key: 'seibuShinjukuLine',
  name: '西武新宿線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '西武新宿→本川越方面',
      stations: [
        { name: '西武新宿', offset: 0 }, { name: '高田馬場', offset: 4 }, { name: '下落合', offset: 7 },
        { name: '中井', offset: 9 }, { name: '新井薬師前', offset: 11 }, { name: '沼袋', offset: 13 },
        { name: '野方', offset: 15 }, { name: '都立家政', offset: 17 }, { name: '鷺ノ宮', offset: 19 },
        { name: '下井草', offset: 21 }, { name: '井荻', offset: 23 }, { name: '上井草', offset: 25 },
        { name: '上石神井', offset: 27 }, { name: '武蔵関', offset: 29 }, { name: '東伏見', offset: 31 },
        { name: '西武柳沢', offset: 33 }, { name: '田無', offset: 35 }, { name: '花小金井', offset: 39 },
        { name: '小平', offset: 42 }, { name: '久米川', offset: 46 }, { name: '東村山', offset: 49 },
        { name: '所沢', offset: 54 }, { name: '航空公園', offset: 57 }, { name: '新所沢', offset: 59 },
        { name: '入曽', offset: 63 }, { name: '狭山市', offset: 67 }, { name: '新狭山', offset: 70 },
        { name: '南大塚', offset: 72 }, { name: '本川越', offset: 75 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 15, type: '各停', destination: '本川越行き' },
        { fromMin: m(7),    toMin: m(9,30), intervalMin: 8,  type: '各停', destination: '本川越行き' },
        { fromMin: m(9,30), toMin: m(17),   intervalMin: 12, type: '各停', destination: '本川越行き' },
        { fromMin: m(17),   toMin: m(20,30),intervalMin: 8,  type: '各停', destination: '本川越行き' },
        { fromMin: m(20,30),toMin: m(24),   intervalMin: 12, type: '各停', destination: '本川越行き' },
      ],
    },
    {
      label: '本川越→西武新宿方面',
      stations: [
        { name: '本川越', offset: 0 }, { name: '南大塚', offset: 3 }, { name: '新狭山', offset: 5 },
        { name: '狭山市', offset: 8 }, { name: '入曽', offset: 12 }, { name: '新所沢', offset: 16 },
        { name: '航空公園', offset: 18 }, { name: '所沢', offset: 21 }, { name: '東村山', offset: 26 },
        { name: '久米川', offset: 29 }, { name: '小平', offset: 33 }, { name: '花小金井', offset: 36 },
        { name: '田無', offset: 40 }, { name: '西武柳沢', offset: 42 }, { name: '東伏見', offset: 44 },
        { name: '武蔵関', offset: 46 }, { name: '上石神井', offset: 48 }, { name: '上井草', offset: 50 },
        { name: '井荻', offset: 52 }, { name: '下井草', offset: 54 }, { name: '鷺ノ宮', offset: 56 },
        { name: '都立家政', offset: 58 }, { name: '野方', offset: 60 }, { name: '沼袋', offset: 62 },
        { name: '新井薬師前', offset: 64 }, { name: '中井', offset: 66 }, { name: '下落合', offset: 68 },
        { name: '高田馬場', offset: 71 }, { name: '西武新宿', offset: 75 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 15, type: '各停', destination: '西武新宿行き' },
        { fromMin: m(7),    toMin: m(9,30), intervalMin: 8,  type: '各停', destination: '西武新宿行き' },
        { fromMin: m(9,30), toMin: m(17),   intervalMin: 12, type: '各停', destination: '西武新宿行き' },
        { fromMin: m(17),   toMin: m(20,30),intervalMin: 8,  type: '各停', destination: '西武新宿行き' },
        { fromMin: m(20,30),toMin: m(24),   intervalMin: 12, type: '各停', destination: '西武新宿行き' },
      ],
    },
  ],
};

const jrMusashinoData: LineTimetableData = {
  key: 'jrMusashinoLine',
  name: '武蔵野線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '府中本町→西船橋方面',
      stations: [
        { name: '府中本町', offset: 0 }, { name: '北府中', offset: 3 }, { name: '西国分寺', offset: 6 },
        { name: '新小平', offset: 9 }, { name: '新秋津', offset: 13 }, { name: '東所沢', offset: 16 },
        { name: '新座', offset: 20 }, { name: '北朝霞', offset: 24 }, { name: '西浦和', offset: 28 },
        { name: '武蔵浦和', offset: 31 }, { name: '南浦和', offset: 34 }, { name: '東浦和', offset: 37 },
        { name: '東川口', offset: 40 }, { name: '南越谷', offset: 44 }, { name: '越谷レイクタウン', offset: 47 },
        { name: '吉川美南', offset: 50 }, { name: '新三郷', offset: 53 }, { name: '三郷', offset: 56 },
        { name: '南流山', offset: 60 }, { name: '新松戸', offset: 63 }, { name: '新八柱', offset: 67 },
        { name: '東松戸', offset: 70 }, { name: '市川大野', offset: 73 }, { name: '船橋法典', offset: 76 },
        { name: '西船橋', offset: 79 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 15, type: '各停', destination: '西船橋行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 10, type: '各停', destination: '西船橋行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 15, type: '各停', destination: '西船橋行き' },
        { fromMin: m(17),   toMin: m(19,30),intervalMin: 10, type: '各停', destination: '西船橋行き' },
        { fromMin: m(19,30),toMin: m(23,30),intervalMin: 15, type: '各停', destination: '西船橋行き' },
      ],
    },
    {
      label: '西船橋→府中本町方面',
      stations: [
        { name: '西船橋', offset: 0 }, { name: '船橋法典', offset: 3 }, { name: '市川大野', offset: 6 },
        { name: '東松戸', offset: 9 }, { name: '新八柱', offset: 12 }, { name: '新松戸', offset: 16 },
        { name: '南流山', offset: 19 }, { name: '三郷', offset: 23 }, { name: '新三郷', offset: 26 },
        { name: '吉川美南', offset: 29 }, { name: '越谷レイクタウン', offset: 32 }, { name: '南越谷', offset: 35 },
        { name: '東川口', offset: 39 }, { name: '東浦和', offset: 42 }, { name: '南浦和', offset: 45 },
        { name: '武蔵浦和', offset: 48 }, { name: '西浦和', offset: 51 }, { name: '北朝霞', offset: 55 },
        { name: '新座', offset: 59 }, { name: '東所沢', offset: 63 }, { name: '新秋津', offset: 66 },
        { name: '新小平', offset: 70 }, { name: '西国分寺', offset: 73 }, { name: '北府中', offset: 76 },
        { name: '府中本町', offset: 79 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 15, type: '各停', destination: '府中本町行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 10, type: '各停', destination: '府中本町行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 15, type: '各停', destination: '府中本町行き' },
        { fromMin: m(17),   toMin: m(19,30),intervalMin: 10, type: '各停', destination: '府中本町行き' },
        { fromMin: m(19,30),toMin: m(23,30),intervalMin: 15, type: '各停', destination: '府中本町行き' },
      ],
    },
  ],
};

const tokyoMonorailData: LineTimetableData = {
  key: 'tokyoMonorail',
  name: '東京モノレール',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: 'モノレール浜松町→羽田空港',
      stations: [
        { name: 'モノレール浜松町', offset: 0 }, { name: '天王洲アイル', offset: 5 },
        { name: '大井競馬場前', offset: 8 }, { name: '流通センター', offset: 11 },
        { name: '昭和島', offset: 13 }, { name: '整備場', offset: 15 },
        { name: '天空橋', offset: 17 }, { name: '羽田空港第3ターミナル', offset: 19 },
        { name: '羽田空港第1・第2ターミナル', offset: 21 },
      ],
      patterns: [
        { fromMin: m(5,20), toMin: m(7),    intervalMin: 10, type: '普通', destination: '羽田空港行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 6,  type: '普通', destination: '羽田空港行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '普通', destination: '羽田空港行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 6,  type: '普通', destination: '羽田空港行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 10, type: '普通', destination: '羽田空港行き' },
      ],
    },
    {
      label: '羽田空港→モノレール浜松町',
      stations: [
        { name: '羽田空港第1・第2ターミナル', offset: 0 }, { name: '羽田空港第3ターミナル', offset: 2 },
        { name: '天空橋', offset: 4 }, { name: '整備場', offset: 6 },
        { name: '昭和島', offset: 8 }, { name: '流通センター', offset: 10 },
        { name: '大井競馬場前', offset: 13 }, { name: '天王洲アイル', offset: 16 },
        { name: 'モノレール浜松町', offset: 21 },
      ],
      patterns: [
        { fromMin: m(5,20), toMin: m(7),    intervalMin: 10, type: '普通', destination: '浜松町行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 6,  type: '普通', destination: '浜松町行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 10, type: '普通', destination: '浜松町行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 6,  type: '普通', destination: '浜松町行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 10, type: '普通', destination: '浜松町行き' },
      ],
    },
  ],
};

const keiseiMainData: LineTimetableData = {
  key: 'keiseiMainLine',
  name: '京成本線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '京成上野→京成成田方面',
      stations: [
        { name: '京成上野', offset: 0 }, { name: '日暮里', offset: 3 }, { name: '新三河島', offset: 5 },
        { name: '町屋', offset: 7 }, { name: '千住大橋', offset: 10 }, { name: '京成関屋', offset: 12 },
        { name: '堀切菖蒲園', offset: 14 }, { name: 'お花茶屋', offset: 16 }, { name: '青砥', offset: 18 },
        { name: '京成高砂', offset: 21 }, { name: '京成小岩', offset: 24 }, { name: '江戸川', offset: 26 },
        { name: '国府台', offset: 28 }, { name: '市川真間', offset: 30 }, { name: '菅野', offset: 32 },
        { name: '京成八幡', offset: 34 }, { name: '鬼越', offset: 36 }, { name: '京成中山', offset: 38 },
        { name: '東中山', offset: 40 }, { name: '京成西船', offset: 42 }, { name: '海神', offset: 44 },
        { name: '京成船橋', offset: 46 }, { name: '大神成', offset: 48 }, { name: '船橋競馬場', offset: 50 },
        { name: '谷津', offset: 52 }, { name: '京成津田沼', offset: 55 }, { name: '京成大久保', offset: 58 },
        { name: '実籾', offset: 61 }, { name: '八千代台', offset: 64 }, { name: '京成大和田', offset: 67 },
        { name: '勝田台', offset: 70 }, { name: '志津', offset: 73 }, { name: 'ユーカリが丘', offset: 76 },
        { name: '京成臼井', offset: 78 }, { name: '京成佐倉', offset: 82 }, { name: '大佐倉', offset: 85 },
        { name: '京成酒々井', offset: 88 }, { name: '宗吾参道', offset: 91 }, { name: '公津の杜', offset: 94 },
        { name: '京成成田', offset: 57 }, { name: '東成田', offset: 62 }, { name: '成田空港', offset: 68 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 15, type: '各停', destination: '京成成田行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 10, type: '各停', destination: '京成成田行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 15, type: '各停', destination: '京成成田行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 10, type: '各停', destination: '京成成田行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 15, type: '各停', destination: '京成成田行き' },
      ],
    },
    {
      label: '京成成田→京成上野方面',
      stations: [
        { name: '成田空港', offset: 0 }, { name: '東成田', offset: 6 }, { name: '京成成田', offset: 11 },
        { name: '公津の杜', offset: 14 }, { name: '宗吾参道', offset: 17 }, { name: '京成酒々井', offset: 20 },
        { name: '大佐倉', offset: 23 }, { name: '京成佐倉', offset: 26 }, { name: '京成臼井', offset: 30 },
        { name: 'ユーカリが丘', offset: 32 }, { name: '志津', offset: 35 }, { name: '勝田台', offset: 38 },
        { name: '京成大和田', offset: 41 }, { name: '八千代台', offset: 44 }, { name: '実籾', offset: 47 },
        { name: '京成大久保', offset: 50 }, { name: '京成津田沼', offset: 53 }, { name: '谷津', offset: 56 },
        { name: '船橋競馬場', offset: 58 }, { name: '大神成', offset: 60 }, { name: '京成船橋', offset: 62 },
        { name: '海神', offset: 64 }, { name: '京成西船', offset: 66 }, { name: '東中山', offset: 68 },
        { name: '京成中山', offset: 70 }, { name: '鬼越', offset: 72 }, { name: '京成八幡', offset: 74 },
        { name: '菅野', offset: 76 }, { name: '市川真間', offset: 78 }, { name: '国府台', offset: 80 },
        { name: '江戸川', offset: 82 }, { name: '京成小岩', offset: 84 }, { name: '京成高砂', offset: 87 },
        { name: '青砥', offset: 90 }, { name: 'お花茶屋', offset: 92 }, { name: '堀切菖蒲園', offset: 94 },
        { name: '京成関屋', offset: 96 }, { name: '千住大橋', offset: 98 }, { name: '町屋', offset: 101 },
        { name: '新三河島', offset: 103 }, { name: '日暮里', offset: 105 }, { name: '京成上野', offset: 108 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 15, type: '各停', destination: '京成上野行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 10, type: '各停', destination: '京成上野行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 15, type: '各停', destination: '京成上野行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 10, type: '各停', destination: '京成上野行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 15, type: '各停', destination: '京成上野行き' },
      ],
    },
  ],
};

const jrYokohamaData: LineTimetableData = {
  key: 'jrYokohamaLine',
  name: 'JR横浜線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '東神奈川→八王子方面',
      stations: [
        { name: '東神奈川', offset: 0 }, { name: '大口', offset: 3 }, { name: '菊名', offset: 6 },
        { name: '新横浜', offset: 10 }, { name: '小机', offset: 14 }, { name: '鴨居', offset: 17 },
        { name: '中山', offset: 21 }, { name: '十日市場', offset: 25 }, { name: '長津田', offset: 29 },
        { name: '成瀬', offset: 32 }, { name: '町田', offset: 36 }, { name: '古淵', offset: 40 },
        { name: '淵野辺', offset: 43 }, { name: '矢部', offset: 46 }, { name: '相模原', offset: 49 },
        { name: '橋本', offset: 53 }, { name: '相原', offset: 57 }, { name: '八王子みなみ野', offset: 61 },
        { name: '片倉', offset: 64 }, { name: '八王子', offset: 67 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 15, type: '各停', destination: '八王子行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 10, type: '各停', destination: '八王子行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 12, type: '各停', destination: '八王子行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 10, type: '各停', destination: '八王子行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 15, type: '各停', destination: '八王子行き' },
      ],
    },
    {
      label: '八王子→東神奈川方面',
      stations: [
        { name: '八王子', offset: 0 }, { name: '片倉', offset: 3 }, { name: '八王子みなみ野', offset: 6 },
        { name: '相原', offset: 10 }, { name: '橋本', offset: 14 }, { name: '相模原', offset: 18 },
        { name: '矢部', offset: 21 }, { name: '淵野辺', offset: 24 }, { name: '古淵', offset: 27 },
        { name: '町田', offset: 31 }, { name: '成瀬', offset: 35 }, { name: '長津田', offset: 38 },
        { name: '十日市場', offset: 42 }, { name: '中山', offset: 46 }, { name: '鴨居', offset: 50 },
        { name: '小机', offset: 53 }, { name: '新横浜', offset: 57 }, { name: '菊名', offset: 61 },
        { name: '大口', offset: 64 }, { name: '東神奈川', offset: 67 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 15, type: '各停', destination: '東神奈川行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 10, type: '各停', destination: '東神奈川行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 12, type: '各停', destination: '東神奈川行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 10, type: '各停', destination: '東神奈川行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 15, type: '各停', destination: '東神奈川行き' },
      ],
    },
  ],
};

const yokosukaData: LineTimetableData = {
  key: 'yokosukaLine',
  name: '横須賀線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '東京→久里浜方面',
      stations: [
        { name: '東京', offset: 0 }, { name: '新橋', offset: 4 }, { name: '品川', offset: 10 },
        { name: '西大井', offset: 16 }, { name: '武蔵小杉', offset: 21 }, { name: '新川崎', offset: 26 },
        { name: '横浜', offset: 33 }, { name: '保土ケ谷', offset: 37 }, { name: '東戸塚', offset: 43 },
        { name: '戸塚', offset: 48 }, { name: '大船', offset: 54 }, { name: '北鎌倉', offset: 58 },
        { name: '鎌倉', offset: 62 }, { name: '逗子', offset: 66 }, { name: '東逗子', offset: 69 },
        { name: '田浦', offset: 72 }, { name: '横須賀', offset: 76 }, { name: '衣笠', offset: 80 },
        { name: '久里浜', offset: 84 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 20, type: '普通', destination: '久里浜行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 15, type: '普通', destination: '久里浜行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 20, type: '普通', destination: '久里浜行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 15, type: '普通', destination: '久里浜行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 20, type: '普通', destination: '久里浜行き' },
      ],
    },
    {
      label: '久里浜→東京方面',
      stations: [
        { name: '久里浜', offset: 0 }, { name: '衣笠', offset: 4 }, { name: '横須賀', offset: 8 },
        { name: '田浦', offset: 12 }, { name: '東逗子', offset: 15 }, { name: '逗子', offset: 18 },
        { name: '鎌倉', offset: 22 }, { name: '北鎌倉', offset: 26 }, { name: '大船', offset: 30 },
        { name: '戸塚', offset: 36 }, { name: '東戸塚', offset: 41 }, { name: '保土ケ谷', offset: 47 },
        { name: '横浜', offset: 51 }, { name: '新川崎', offset: 58 }, { name: '武蔵小杉', offset: 63 },
        { name: '西大井', offset: 68 }, { name: '品川', offset: 74 }, { name: '新橋', offset: 80 },
        { name: '東京', offset: 84 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 20, type: '普通', destination: '東京行き' },
        { fromMin: m(7),    toMin: m(9),    intervalMin: 15, type: '普通', destination: '東京行き' },
        { fromMin: m(9),    toMin: m(17),   intervalMin: 20, type: '普通', destination: '東京行き' },
        { fromMin: m(17),   toMin: m(20),   intervalMin: 15, type: '普通', destination: '東京行き' },
        { fromMin: m(20),   toMin: m(23,30),intervalMin: 20, type: '普通', destination: '東京行き' },
      ],
    },
  ],
};

const jrNanbuData: LineTimetableData = {
  key: 'jrNanbuLine',
  name: '南武線',
  updatedAt: '2025-03-15',
  dataVersion: '2025年版（概算）',
  directions: [
    {
      label: '立川→川崎方面',
      stations: [
        { name: '立川', offset: 0 }, { name: '西国立', offset: 3 }, { name: '国立', offset: 5 },
        { name: '矢川', offset: 8 }, { name: '谷保', offset: 10 }, { name: '西府', offset: 13 },
        { name: '分倍河原', offset: 16 }, { name: '府中本町', offset: 19 }, { name: '南多摩', offset: 22 },
        { name: '矢野口', offset: 25 }, { name: '稲城長沼', offset: 28 }, { name: '登戸', offset: 32 },
        { name: '中野島', offset: 35 }, { name: '稲田堤', offset: 38 }, { name: '武蔵溝ノ口', offset: 41 },
        { name: '津田山', offset: 44 }, { name: '久地', offset: 46 }, { name: '宿河原', offset: 49 },
        { name: '平間', offset: 52 }, { name: '向河原', offset: 54 }, { name: '武蔵小杉', offset: 57 },
        { name: '川崎', offset: 62 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 12, type: '各停', destination: '川崎行き' },
        { fromMin: m(7),    toMin: m(9,30), intervalMin: 7,  type: '各停', destination: '川崎行き' },
        { fromMin: m(9,30), toMin: m(17),   intervalMin: 10, type: '各停', destination: '川崎行き' },
        { fromMin: m(17),   toMin: m(20,30),intervalMin: 7,  type: '各停', destination: '川崎行き' },
        { fromMin: m(20,30),toMin: m(24),   intervalMin: 12, type: '各停', destination: '川崎行き' },
      ],
    },
    {
      label: '川崎→立川方面',
      stations: [
        { name: '川崎', offset: 0 }, { name: '武蔵小杉', offset: 5 }, { name: '向河原', offset: 8 },
        { name: '平間', offset: 10 }, { name: '宿河原', offset: 13 }, { name: '久地', offset: 16 },
        { name: '津田山', offset: 18 }, { name: '武蔵溝ノ口', offset: 21 }, { name: '稲田堤', offset: 24 },
        { name: '中野島', offset: 27 }, { name: '登戸', offset: 30 }, { name: '稲城長沼', offset: 34 },
        { name: '矢野口', offset: 37 }, { name: '南多摩', offset: 40 }, { name: '府中本町', offset: 43 },
        { name: '分倍河原', offset: 46 }, { name: '西府', offset: 49 }, { name: '谷保', offset: 52 },
        { name: '矢川', offset: 54 }, { name: '国立', offset: 57 }, { name: '西国立', offset: 59 },
        { name: '立川', offset: 62 },
      ],
      patterns: [
        { fromMin: m(5),    toMin: m(7),    intervalMin: 12, type: '各停', destination: '立川行き' },
        { fromMin: m(7),    toMin: m(9,30), intervalMin: 7,  type: '各停', destination: '立川行き' },
        { fromMin: m(9,30), toMin: m(17),   intervalMin: 10, type: '各停', destination: '立川行き' },
        { fromMin: m(17),   toMin: m(20,30),intervalMin: 7,  type: '各停', destination: '立川行き' },
        { fromMin: m(20,30),toMin: m(24),   intervalMin: 12, type: '各停', destination: '立川行き' },
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
  // 追加路線
  hibiyaData,
  tozaiData,
  chiyodaData,
  yurakuchoData,
  hanzomonData,
  nambokuData,
  fukutoshinData,
  toeiAsakusaData,
  toeiMitaData,
  toeiShinjukuData,
  toeiOedoData,
  saikyoData,
  jobanData,
  keioData,
  seibuIkebukuroData,
  tobuTojoData,
  tsukubaExpressData,
  meguroData,
  // 第2弾追加路線（JR・私鉄・地下鉄・新交通）
  jrSobuLineData,
  jrTakasakiLineData,
  odakyuEnoshimaData,
  seibuShinjukuData,
  jrMusashinoData,
  tokyoMonorailData,
  keiseiMainData,
  jrYokohamaData,
  yokosukaData,
  jrNanbuData,
  jrUtsunomiyaData,
  jrNegishiData,
  keioInokashiraData,
  tokyuOimachiData,
  tobuIsesakiData,
  sotetsuMainData,
  sotetsuIzuminoData,
  jrSobuChibaData,
  jrKeiyoData,
  yokohamaBlueData,
  rinkaiData,
  yurikamomeData,
  jrOmeData,
  nipporiToneriData,
  tamaMonorailData,
  tokyuTamagawaData,
  tokyuIkegamiData,
  yokohamaGreenData,
  keioSagamiharaData,
  odakyuTamaData,
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
