/**
 * 列車位置デモ用ユーティリティ
 * 時刻表データから各時刻の列車位置（緯度経度）を計算する
 */
import { yamanote } from '../data/yamanote';
import { chuo } from '../data/chuo';
import { ginzaLine } from '../data/ginza-line';
import { marunouchiLine } from '../data/marunouchi-line';
import { keihinTohoku } from '../data/keihin-tohoku';
import { tokyuToyokoLine } from '../data/tokyu-toyoko-line';
import { jrTokaidoMainLine } from '../data/jr-tokaido-main-line';
import { tokyuDenEnToshiLine } from '../data/tokyu-den-en-toshi-line';
import { odakyuLine } from '../data/odakyu-line';
import { keikyuLine } from '../data/keikyu-line';
import { hibiyaLine } from '../data/hibiya-line';
import { tozaiLine } from '../data/tozai-line';
import { chiyodaLine } from '../data/chiyoda-line';
import { hanzomonLine } from '../data/hanzomon-line';
import { nambokuLine } from '../data/namboku-line';
import { fukutoshinLine } from '../data/fukutoshin-line';
import { toeiAsakusaLine } from '../data/toei-asakusa-line';
import { toeiMitaLine } from '../data/toei-mita-line';
import { toeiShinjukuLine } from '../data/toei-shinjuku-line';
import { toeiOedoLine } from '../data/toei-oedo-line';
import { seibuIkebukuroLine } from '../data/seibu-ikebukuro-line';
import { tobuTojoLine } from '../data/tobu-tojo-line';
import { jrSaikyoLine } from '../data/jr-saikyo-line';

// ── 型定義 ──────────────────────────────────────────────

interface StationEntry { name: string; offset: number; }
export interface StationWithCoord extends StationEntry { lat: number; lng: number; }

interface PatternSimple { fromMin: number; toMin: number; intervalMin: number; }

interface DirectionDemo {
  stations: StationWithCoord[];
  travelMin: number;  // 最終駅のoffset（所要時間）
  isCircular: boolean; // ループ路線（山手線など）か否か
  patterns: PatternSimple[];
}

interface LineDemo {
  key: string;
  color: string; // ドットの色（路線カラー）
  directions: DirectionDemo[];
}

export interface TrainPosition {
  id: string;
  lineKey: string;
  color: string;
  direction: number;
  departureMin: number;
  pos: [number, number];
}

// ── ユーティリティ ─────────────────────────────────────

const m = (h: number, min = 0) => h * 60 + min;

function buildCoordMap(stations: { name: string; lat: number; lng: number }[]) {
  return new Map(stations.map(s => [s.name, { lat: s.lat, lng: s.lng }]));
}

function withCoords(
  raw: StationEntry[],
  coordMap: Map<string, { lat: number; lng: number }>
): StationWithCoord[] {
  return raw.map(s => ({ ...s, ...(coordMap.get(s.name) ?? { lat: 0, lng: 0 }) }));
}

// 各駅での停車時間（分）。offset は発車時刻を表すので、到着→発車までをここで表現する
const DWELL_MIN = 0.5;

function interpolate(stations: StationWithCoord[], elapsed: number, circular: boolean): [number, number] | null {
  const totalMin = stations[stations.length - 1].offset;
  const e = circular ? ((elapsed % totalMin) + totalMin) % totalMin : elapsed;

  for (let i = 0; i < stations.length - 1; i++) {
    const a = stations[i], b = stations[i + 1];
    if (e < a.offset || e >= b.offset) continue;

    const segDur = b.offset - a.offset;
    // セグメント時間の最大40%・上限DWELL_MINを停車時間とする
    const dwell = Math.min(DWELL_MIN, segDur * 0.4);
    const moveDur = segDur - dwell;

    if (e < a.offset + moveDur) {
      // 走行中: a → b
      const r = moveDur > 0 ? (e - a.offset) / moveDur : 1;
      return [a.lat + r * (b.lat - a.lat), a.lng + r * (b.lng - a.lng)];
    } else {
      // 停車中: 駅bに停まっている
      return [b.lat, b.lng];
    }
  }

  if (circular) {
    // 折り返し区間: 最終駅→始発駅（東京）
    const last = stations[stations.length - 1];
    const first = stations[0];
    const segDur = totalMin - last.offset;
    const dwell = Math.min(DWELL_MIN, segDur * 0.4);
    const moveDur = segDur - dwell;

    if (e >= last.offset) {
      if (moveDur > 0 && e < last.offset + moveDur) {
        const r = (e - last.offset) / moveDur;
        return [last.lat + r * (first.lat - last.lat), last.lng + r * (first.lng - last.lng)];
      }
      return [first.lat, first.lng]; // 始発駅で停車
    }
  }

  // 線形路線の終端
  const last = stations[stations.length - 1];
  return [last.lat, last.lng];
}

function getActiveDepartures(patterns: PatternSimple[], windowStart: number, windowEnd: number): number[] {
  const departures: number[] = [];
  for (const p of patterns) {
    const lo = Math.max(p.fromMin, windowStart);
    const hi = Math.min(p.toMin - p.intervalMin, windowEnd);
    if (lo > hi) continue;
    const firstDep = p.fromMin + Math.ceil((lo - p.fromMin) / p.intervalMin) * p.intervalMin;
    for (let d = firstDep; d <= hi + 0.001; d += p.intervalMin) {
      departures.push(d);
    }
  }
  return departures;
}

// ── 路線定義 ───────────────────────────────────────────

// 山手線（内回り: 0 / 外回り: 1）
const YAMANOTE_LOOP = 59;
const yamanoteMap = buildCoordMap(yamanote);
const yamanoteDir0 = withCoords([
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
], yamanoteMap);
const yamanoteDir1 = withCoords([
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
], yamanoteMap);
const yamanotePatterns: PatternSimple[] = [
  { fromMin: m(4,45), toMin: m(7),    intervalMin: 6 },
  { fromMin: m(7),    toMin: m(10),   intervalMin: 3 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 5 },
  { fromMin: m(17),   toMin: m(20,30),intervalMin: 3 },
  { fromMin: m(20,30),toMin: m(23,30),intervalMin: 6 },
  { fromMin: m(23,30),toMin: m(25,30),intervalMin: 9 },
];

// 中央・総武線（西行き: 0 / 東行き: 1）
const chuoMap = buildCoordMap(chuo);
const chuoDir0 = withCoords([
  { name: '東京', offset: 0 }, { name: '神田', offset: 2 }, { name: '御茶ノ水', offset: 4 },
  { name: '水道橋', offset: 6 }, { name: '飯田橋', offset: 8 }, { name: '市ケ谷', offset: 10 },
  { name: '四ツ谷', offset: 12 }, { name: '信濃町', offset: 14 }, { name: '千駄ケ谷', offset: 16 },
  { name: '代々木', offset: 18 }, { name: '新宿', offset: 20 }, { name: '大久保', offset: 22 },
  { name: '東中野', offset: 24 }, { name: '中野', offset: 26 }, { name: '高円寺', offset: 29 },
  { name: '阿佐ケ谷', offset: 31 }, { name: '荻窪', offset: 33 }, { name: '西荻窪', offset: 36 },
  { name: '吉祥寺', offset: 38 }, { name: '三鷹', offset: 40 }, { name: '武蔵境', offset: 42 },
  { name: '東小金井', offset: 44 }, { name: '武蔵小金井', offset: 46 }, { name: '国分寺', offset: 48 },
  { name: '西国分寺', offset: 50 }, { name: '国立', offset: 52 }, { name: '立川', offset: 54 },
], chuoMap);
const chuoDir1 = withCoords([
  { name: '立川', offset: 0 }, { name: '国立', offset: 2 }, { name: '西国分寺', offset: 4 },
  { name: '国分寺', offset: 6 }, { name: '武蔵小金井', offset: 8 }, { name: '東小金井', offset: 10 },
  { name: '武蔵境', offset: 12 }, { name: '三鷹', offset: 14 }, { name: '吉祥寺', offset: 16 },
  { name: '西荻窪', offset: 18 }, { name: '荻窪', offset: 21 }, { name: '阿佐ケ谷', offset: 23 },
  { name: '高円寺', offset: 25 }, { name: '中野', offset: 27 }, { name: '東中野', offset: 30 },
  { name: '大久保', offset: 32 }, { name: '新宿', offset: 34 }, { name: '代々木', offset: 36 },
  { name: '千駄ケ谷', offset: 38 }, { name: '信濃町', offset: 40 }, { name: '四ツ谷', offset: 42 },
  { name: '市ケ谷', offset: 44 }, { name: '飯田橋', offset: 46 }, { name: '水道橋', offset: 48 },
  { name: '御茶ノ水', offset: 50 }, { name: '神田', offset: 52 }, { name: '東京', offset: 54 },
], chuoMap);
const chuoPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 8 },
  { fromMin: m(7),    toMin: m(10),   intervalMin: 5 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 5 },
  { fromMin: m(20),   toMin: m(24,30),intervalMin: 10 },
];

// 銀座線（渋谷方面: 0 / 浅草方面: 1）
const ginzaMap = buildCoordMap(ginzaLine);
const ginzaDir0 = withCoords([
  { name: '浅草', offset: 0 }, { name: '田原町', offset: 2 }, { name: '稲荷町', offset: 4 },
  { name: '上野', offset: 6 }, { name: '上野広小路', offset: 9 }, { name: '末広町', offset: 10 },
  { name: '神田', offset: 11 }, { name: '三越前', offset: 13 }, { name: '日本橋', offset: 14 },
  { name: '京橋', offset: 16 }, { name: '銀座', offset: 18 }, { name: '新橋', offset: 20 },
  { name: '虎ノ門', offset: 22 }, { name: '溜池山王', offset: 24 }, { name: '赤坂見附', offset: 26 },
  { name: '青山一丁目', offset: 28 }, { name: '外苑前', offset: 30 }, { name: '表参道', offset: 32 },
  { name: '渋谷', offset: 34 },
], ginzaMap);
const ginzaDir1 = withCoords([
  { name: '渋谷', offset: 0 }, { name: '表参道', offset: 2 }, { name: '外苑前', offset: 4 },
  { name: '青山一丁目', offset: 6 }, { name: '赤坂見附', offset: 8 }, { name: '溜池山王', offset: 10 },
  { name: '虎ノ門', offset: 12 }, { name: '新橋', offset: 14 }, { name: '銀座', offset: 16 },
  { name: '京橋', offset: 18 }, { name: '日本橋', offset: 20 }, { name: '三越前', offset: 21 },
  { name: '神田', offset: 23 }, { name: '末広町', offset: 24 }, { name: '上野広小路', offset: 25 },
  { name: '上野', offset: 28 }, { name: '稲荷町', offset: 31 }, { name: '田原町', offset: 33 },
  { name: '浅草', offset: 35 },
], ginzaMap);
const ginzaPatterns: PatternSimple[] = [
  { fromMin: m(5,10),  toMin: m(7,30),  intervalMin: 6 },
  { fromMin: m(7,30),  toMin: m(9,30),  intervalMin: 3 },
  { fromMin: m(9,30),  toMin: m(17),    intervalMin: 4 },
  { fromMin: m(17),    toMin: m(20,30), intervalMin: 3 },
  { fromMin: m(20,30), toMin: m(24,10), intervalMin: 5 },
];

// 丸ノ内線（荻窪方面: 0 / 池袋方面: 1）
const marunouchiMap = buildCoordMap(marunouchiLine);
const marunouchiDir0 = withCoords([
  { name: '池袋', offset: 0 }, { name: '新大塚', offset: 2 }, { name: '茗荷谷', offset: 4 },
  { name: '後楽園', offset: 6 }, { name: '本郷三丁目', offset: 7 }, { name: '御茶ノ水', offset: 8 },
  { name: '淡路町', offset: 9 }, { name: '大手町', offset: 10 }, { name: '東京', offset: 11 },
  { name: '銀座', offset: 12 }, { name: '霞ケ関', offset: 14 }, { name: '国会議事堂前', offset: 15 },
  { name: '赤坂見附', offset: 16 }, { name: '四ツ谷', offset: 17 }, { name: '四谷三丁目', offset: 19 },
  { name: '新宿御苑前', offset: 21 }, { name: '新宿三丁目', offset: 22 }, { name: '新宿', offset: 23 },
  { name: '西新宿', offset: 25 }, { name: '中野坂上', offset: 26 }, { name: '新中野', offset: 28 },
  { name: '東高円寺', offset: 29 }, { name: '新高円寺', offset: 31 }, { name: '南阿佐ケ谷', offset: 32 },
  { name: '荻窪', offset: 33 },
], marunouchiMap);
const marunouchiDir1 = withCoords([
  { name: '荻窪', offset: 0 }, { name: '南阿佐ケ谷', offset: 1 }, { name: '新高円寺', offset: 2 },
  { name: '東高円寺', offset: 4 }, { name: '新中野', offset: 5 }, { name: '中野坂上', offset: 7 },
  { name: '西新宿', offset: 8 }, { name: '新宿', offset: 9 }, { name: '新宿三丁目', offset: 11 },
  { name: '新宿御苑前', offset: 12 }, { name: '四谷三丁目', offset: 13 }, { name: '四ツ谷', offset: 15 },
  { name: '赤坂見附', offset: 17 }, { name: '国会議事堂前', offset: 18 }, { name: '霞ケ関', offset: 19 },
  { name: '銀座', offset: 21 }, { name: '東京', offset: 22 }, { name: '大手町', offset: 23 },
  { name: '淡路町', offset: 24 }, { name: '御茶ノ水', offset: 25 }, { name: '本郷三丁目', offset: 26 },
  { name: '後楽園', offset: 27 }, { name: '茗荷谷', offset: 29 }, { name: '新大塚', offset: 31 },
  { name: '池袋', offset: 33 },
], marunouchiMap);
const marunouchiPatterns: PatternSimple[] = [
  { fromMin: m(5,10),  toMin: m(7,30),  intervalMin: 5 },
  { fromMin: m(7,30),  toMin: m(9,30),  intervalMin: 3 },
  { fromMin: m(9,30),  toMin: m(17),    intervalMin: 4 },
  { fromMin: m(17),    toMin: m(20,30), intervalMin: 3 },
  { fromMin: m(20,30), toMin: m(24,10), intervalMin: 5 },
];

// 京浜東北線（南行き: 0 / 北行き: 1）
const keihinMap = buildCoordMap(keihinTohoku);
const keihinDir0 = withCoords([
  { name: '大宮', offset: 0 }, { name: 'さいたま新都心', offset: 4 }, { name: '与野', offset: 7 },
  { name: '北浦和', offset: 9 }, { name: '浦和', offset: 11 }, { name: '南浦和', offset: 14 },
  { name: '蕨', offset: 17 }, { name: '西川口', offset: 20 }, { name: '川口', offset: 22 },
  { name: '赤羽', offset: 26 }, { name: '東十条', offset: 29 }, { name: '王子', offset: 31 },
  { name: '上中里', offset: 33 }, { name: '田端', offset: 35 }, { name: '西日暮里', offset: 37 },
  { name: '日暮里', offset: 39 }, { name: '鶯谷', offset: 41 }, { name: '上野', offset: 44 },
  { name: '御徒町', offset: 46 }, { name: '秋葉原', offset: 49 }, { name: '神田', offset: 52 },
  { name: '東京', offset: 55 }, { name: '有楽町', offset: 57 }, { name: '新橋', offset: 59 },
  { name: '浜松町', offset: 61 }, { name: '田町', offset: 63 }, { name: '高輪ゲートウェイ', offset: 65 },
  { name: '品川', offset: 67 }, { name: '大井町', offset: 70 }, { name: '大森', offset: 73 },
  { name: '蒲田', offset: 76 }, { name: '川崎', offset: 80 }, { name: '鶴見', offset: 83 },
  { name: '新子安', offset: 85 }, { name: '東神奈川', offset: 87 }, { name: '横浜', offset: 90 },
  { name: '桜木町', offset: 92 }, { name: '関内', offset: 94 }, { name: '石川町', offset: 96 },
  { name: '山手', offset: 99 }, { name: '根岸', offset: 102 }, { name: '磯子', offset: 105 },
  { name: '新杉田', offset: 108 }, { name: '洋光台', offset: 111 }, { name: '港南台', offset: 114 },
  { name: '本郷台', offset: 118 }, { name: '大船', offset: 124 },
], keihinMap);
const keihinDir1 = withCoords([
  { name: '大船', offset: 0 }, { name: '本郷台', offset: 6 }, { name: '港南台', offset: 10 },
  { name: '洋光台', offset: 13 }, { name: '新杉田', offset: 16 }, { name: '磯子', offset: 19 },
  { name: '根岸', offset: 22 }, { name: '山手', offset: 25 }, { name: '石川町', offset: 28 },
  { name: '関内', offset: 30 }, { name: '桜木町', offset: 32 }, { name: '横浜', offset: 34 },
  { name: '東神奈川', offset: 37 }, { name: '新子安', offset: 39 }, { name: '鶴見', offset: 41 },
  { name: '川崎', offset: 44 }, { name: '蒲田', offset: 48 }, { name: '大森', offset: 51 },
  { name: '大井町', offset: 54 }, { name: '品川', offset: 57 }, { name: '高輪ゲートウェイ', offset: 59 },
  { name: '田町', offset: 61 }, { name: '浜松町', offset: 63 }, { name: '新橋', offset: 65 },
  { name: '有楽町', offset: 67 }, { name: '東京', offset: 69 }, { name: '神田', offset: 72 },
  { name: '秋葉原', offset: 75 }, { name: '御徒町', offset: 78 }, { name: '上野', offset: 80 },
  { name: '鶯谷', offset: 83 }, { name: '日暮里', offset: 85 }, { name: '西日暮里', offset: 87 },
  { name: '田端', offset: 89 }, { name: '上中里', offset: 91 }, { name: '王子', offset: 93 },
  { name: '東十条', offset: 95 }, { name: '赤羽', offset: 99 }, { name: '川口', offset: 102 },
  { name: '西川口', offset: 104 }, { name: '蕨', offset: 107 }, { name: '南浦和', offset: 110 },
  { name: '浦和', offset: 113 }, { name: '北浦和', offset: 115 }, { name: '与野', offset: 117 },
  { name: 'さいたま新都心', offset: 119 }, { name: '大宮', offset: 124 },
], keihinMap);
const keihinPatterns: PatternSimple[] = [
  { fromMin: m(4,30),  toMin: m(7),    intervalMin: 7 },
  { fromMin: m(7),     toMin: m(10),   intervalMin: 3 },
  { fromMin: m(10),    toMin: m(17),   intervalMin: 5 },
  { fromMin: m(17),    toMin: m(20,30),intervalMin: 3 },
  { fromMin: m(20,30), toMin: m(24,30),intervalMin: 6 },
];

// 東急東横線（渋谷→横浜: 0 / 横浜→渋谷: 1）
const toyokoMap = buildCoordMap(tokyuToyokoLine);
const toyokoDir0 = withCoords([
  { name: '渋谷', offset: 0 }, { name: '代官山', offset: 2 }, { name: '中目黒', offset: 3 },
  { name: '祐天寺', offset: 5 }, { name: '学芸大学', offset: 7 }, { name: '都立大学', offset: 8 },
  { name: '自由が丘', offset: 9 }, { name: '田園調布', offset: 11 }, { name: '多摩川', offset: 13 },
  { name: '新丸子', offset: 16 }, { name: '武蔵小杉', offset: 17 }, { name: '元住吉', offset: 19 },
  { name: '日吉', offset: 21 }, { name: '綱島', offset: 24 }, { name: '大倉山', offset: 27 },
  { name: '菊名', offset: 29 }, { name: '妙蓮寺', offset: 31 }, { name: '白楽', offset: 32 },
  { name: '東白楽', offset: 33 }, { name: '反町', offset: 35 }, { name: '横浜', offset: 37 },
], toyokoMap);
const toyokoDir1 = withCoords([
  { name: '横浜', offset: 0 }, { name: '反町', offset: 2 }, { name: '東白楽', offset: 4 },
  { name: '白楽', offset: 5 }, { name: '妙蓮寺', offset: 6 }, { name: '菊名', offset: 8 },
  { name: '大倉山', offset: 10 }, { name: '綱島', offset: 13 }, { name: '日吉', offset: 16 },
  { name: '元住吉', offset: 18 }, { name: '武蔵小杉', offset: 20 }, { name: '新丸子', offset: 21 },
  { name: '多摩川', offset: 24 }, { name: '田園調布', offset: 26 }, { name: '自由が丘', offset: 28 },
  { name: '都立大学', offset: 29 }, { name: '学芸大学', offset: 30 }, { name: '祐天寺', offset: 32 },
  { name: '中目黒', offset: 34 }, { name: '代官山', offset: 35 }, { name: '渋谷', offset: 37 },
], toyokoMap);
const toyokoPatterns: PatternSimple[] = [
  { fromMin: m(5),     toMin: m(7,30),  intervalMin: 7 },
  { fromMin: m(7,30),  toMin: m(9,30),  intervalMin: 5 },
  { fromMin: m(9,30),  toMin: m(17),    intervalMin: 7 },
  { fromMin: m(17),    toMin: m(20,30), intervalMin: 5 },
  { fromMin: m(20,30), toMin: m(24,30), intervalMin: 8 },
];

// 東海道線（東京→小田原: 0 / 小田原→東京: 1）
const tokaidoMap = buildCoordMap(jrTokaidoMainLine);
const tokaidoDir0 = withCoords([
  { name: '東京', offset: 0 }, { name: '新橋', offset: 3 }, { name: '品川', offset: 6 },
  { name: '川崎', offset: 10 }, { name: '横浜', offset: 14 }, { name: '保土ケ谷', offset: 19 },
  { name: '東戸塚', offset: 22 }, { name: '戸塚', offset: 26 }, { name: '大船', offset: 32 },
  { name: '藤沢', offset: 38 }, { name: '辻堂', offset: 42 }, { name: '茅ケ崎', offset: 45 },
  { name: '平塚', offset: 49 }, { name: '大磯', offset: 53 }, { name: '二宮', offset: 56 },
  { name: '国府津', offset: 59 }, { name: '鴨宮', offset: 63 }, { name: '小田原', offset: 66 },
], tokaidoMap);
const tokaidoDir1 = withCoords([
  { name: '小田原', offset: 0 }, { name: '鴨宮', offset: 3 }, { name: '国府津', offset: 7 },
  { name: '二宮', offset: 10 }, { name: '大磯', offset: 13 }, { name: '平塚', offset: 17 },
  { name: '茅ケ崎', offset: 21 }, { name: '辻堂', offset: 24 }, { name: '藤沢', offset: 28 },
  { name: '大船', offset: 34 }, { name: '戸塚', offset: 40 }, { name: '東戸塚', offset: 44 },
  { name: '保土ケ谷', offset: 47 }, { name: '横浜', offset: 52 }, { name: '川崎', offset: 56 },
  { name: '品川', offset: 60 }, { name: '新橋', offset: 63 }, { name: '東京', offset: 66 },
], tokaidoMap);
const tokaidoPatterns: PatternSimple[] = [
  { fromMin: m(5,20),  toMin: m(7),    intervalMin: 20 },
  { fromMin: m(7),     toMin: m(9,30), intervalMin: 10 },
  { fromMin: m(9,30),  toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),    toMin: m(21),   intervalMin: 10 },
  { fromMin: m(21),    toMin: m(24,30),intervalMin: 20 },
];

// 東急田園都市線（渋谷→中央林間: 0 / 中央林間→渋谷: 1）
const dentoshiMap = buildCoordMap(tokyuDenEnToshiLine);
const dentoshiDir0 = withCoords([
  { name: '渋谷', offset: 0 }, { name: '池尻大橋', offset: 3 }, { name: '三軒茶屋', offset: 5 },
  { name: '駒沢大学', offset: 7 }, { name: '桜新町', offset: 9 }, { name: '用賀', offset: 11 },
  { name: '二子玉川', offset: 13 }, { name: '二子新地', offset: 15 }, { name: '高津', offset: 16 },
  { name: '溝の口', offset: 17 }, { name: '梶が谷', offset: 19 }, { name: '宮崎台', offset: 21 },
  { name: '宮前平', offset: 22 }, { name: '鷺沼', offset: 24 }, { name: 'たまプラーザ', offset: 26 },
  { name: 'あざみ野', offset: 29 }, { name: '江田', offset: 31 }, { name: '市が尾', offset: 33 },
  { name: '藤が丘', offset: 35 }, { name: '青葉台', offset: 37 }, { name: '田奈', offset: 39 },
  { name: '長津田', offset: 41 }, { name: 'つくし野', offset: 43 }, { name: 'すずかけ台', offset: 45 },
  { name: '南町田グランベリーパーク', offset: 47 }, { name: 'つきみ野', offset: 49 }, { name: '中央林間', offset: 52 },
], dentoshiMap);
const dentoshiDir1 = withCoords([
  { name: '中央林間', offset: 0 }, { name: 'つきみ野', offset: 3 }, { name: '南町田グランベリーパーク', offset: 5 },
  { name: 'すずかけ台', offset: 7 }, { name: 'つくし野', offset: 9 }, { name: '長津田', offset: 11 },
  { name: '田奈', offset: 13 }, { name: '青葉台', offset: 15 }, { name: '藤が丘', offset: 17 },
  { name: '市が尾', offset: 19 }, { name: '江田', offset: 21 }, { name: 'あざみ野', offset: 23 },
  { name: 'たまプラーザ', offset: 26 }, { name: '鷺沼', offset: 28 }, { name: '宮前平', offset: 30 },
  { name: '宮崎台', offset: 31 }, { name: '梶が谷', offset: 33 }, { name: '溝の口', offset: 35 },
  { name: '高津', offset: 37 }, { name: '二子新地', offset: 38 }, { name: '二子玉川', offset: 39 },
  { name: '用賀', offset: 41 }, { name: '桜新町', offset: 43 }, { name: '駒沢大学', offset: 45 },
  { name: '三軒茶屋', offset: 47 }, { name: '池尻大橋', offset: 49 }, { name: '渋谷', offset: 52 },
], dentoshiMap);
const dentoshiPatterns: PatternSimple[] = [
  { fromMin: m(5),     toMin: m(7),    intervalMin: 6 },
  { fromMin: m(7),     toMin: m(9,30), intervalMin: 4 },
  { fromMin: m(9,30),  toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),    toMin: m(20,30),intervalMin: 4 },
  { fromMin: m(20,30), toMin: m(24,30),intervalMin: 7 },
];

// 小田急小田原線（新宿→小田原: 0 / 小田原→新宿: 1）
const odakyuMap = buildCoordMap(odakyuLine);
const odakyuDir0 = withCoords([
  { name: '新宿', offset: 0 }, { name: '南新宿', offset: 2 }, { name: '参宮橋', offset: 4 },
  { name: '代々木八幡', offset: 6 }, { name: '代々木上原', offset: 8 }, { name: '東北沢', offset: 10 },
  { name: '下北沢', offset: 11 }, { name: '世田谷代田', offset: 13 }, { name: '梅ヶ丘', offset: 14 },
  { name: '豪徳寺', offset: 15 }, { name: '経堂', offset: 16 }, { name: '千歳船橋', offset: 18 },
  { name: '祖師ヶ谷大蔵', offset: 20 }, { name: '成城学園前', offset: 22 }, { name: '喜多見', offset: 24 },
  { name: '狛江', offset: 26 }, { name: '和泉多摩川', offset: 28 }, { name: '登戸', offset: 30 },
  { name: '向ヶ丘遊園', offset: 33 }, { name: '生田', offset: 35 }, { name: '読売ランド前', offset: 37 },
  { name: '百合ヶ丘', offset: 39 }, { name: '新百合ヶ丘', offset: 41 }, { name: '柿生', offset: 44 },
  { name: '鶴川', offset: 46 }, { name: '玉川学園前', offset: 48 }, { name: '町田', offset: 50 },
  { name: '相模大野', offset: 54 }, { name: '小田急相模原', offset: 57 }, { name: '相武台前', offset: 59 },
  { name: '座間', offset: 61 }, { name: '海老名', offset: 64 }, { name: '厚木', offset: 67 },
  { name: '本厚木', offset: 69 }, { name: '愛甲石田', offset: 72 }, { name: '伊勢原', offset: 75 },
  { name: '鶴巻温泉', offset: 79 }, { name: '東海大学前', offset: 81 }, { name: '秦野', offset: 83 },
  { name: '渋沢', offset: 86 }, { name: '新松田', offset: 89 }, { name: '開成', offset: 91 },
  { name: '小田原', offset: 100 },
], odakyuMap);
const odakyuDir1 = withCoords([
  { name: '小田原', offset: 0 }, { name: '開成', offset: 9 }, { name: '新松田', offset: 11 },
  { name: '渋沢', offset: 14 }, { name: '秦野', offset: 17 }, { name: '東海大学前', offset: 19 },
  { name: '鶴巻温泉', offset: 21 }, { name: '伊勢原', offset: 25 }, { name: '愛甲石田', offset: 28 },
  { name: '本厚木', offset: 31 }, { name: '厚木', offset: 33 }, { name: '海老名', offset: 36 },
  { name: '座間', offset: 39 }, { name: '相武台前', offset: 41 }, { name: '小田急相模原', offset: 43 },
  { name: '相模大野', offset: 46 }, { name: '町田', offset: 50 }, { name: '玉川学園前', offset: 52 },
  { name: '鶴川', offset: 54 }, { name: '柿生', offset: 56 }, { name: '新百合ヶ丘', offset: 59 },
  { name: '百合ヶ丘', offset: 62 }, { name: '読売ランド前', offset: 63 }, { name: '生田', offset: 65 },
  { name: '向ヶ丘遊園', offset: 67 }, { name: '登戸', offset: 70 }, { name: '和泉多摩川', offset: 72 },
  { name: '狛江', offset: 74 }, { name: '喜多見', offset: 76 }, { name: '成城学園前', offset: 78 },
  { name: '祖師ヶ谷大蔵', offset: 80 }, { name: '千歳船橋', offset: 82 }, { name: '経堂', offset: 84 },
  { name: '豪徳寺', offset: 85 }, { name: '梅ヶ丘', offset: 86 }, { name: '世田谷代田', offset: 87 },
  { name: '下北沢', offset: 89 }, { name: '東北沢', offset: 90 }, { name: '代々木上原', offset: 92 },
  { name: '代々木八幡', offset: 94 }, { name: '参宮橋', offset: 96 }, { name: '南新宿', offset: 98 },
  { name: '新宿', offset: 100 },
], odakyuMap);
const odakyuPatterns: PatternSimple[] = [
  { fromMin: m(5),     toMin: m(7),    intervalMin: 10 },
  { fromMin: m(7),     toMin: m(9,30), intervalMin: 6 },
  { fromMin: m(9,30),  toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),    toMin: m(21),   intervalMin: 6 },
  { fromMin: m(21),    toMin: m(24,30),intervalMin: 10 },
];

// 京急線（泉岳寺→横浜: 0 / 横浜→泉岳寺: 1）
const keikyuMap = buildCoordMap(keikyuLine);
const keikyuDir0 = withCoords([
  { name: '泉岳寺', offset: 0 }, { name: '品川', offset: 2 }, { name: '北品川', offset: 4 },
  { name: '新馬場', offset: 6 }, { name: '青物横丁', offset: 8 }, { name: '鮫洲', offset: 10 },
  { name: '立会川', offset: 12 }, { name: '大森海岸', offset: 14 }, { name: '平和島', offset: 16 },
  { name: '大森町', offset: 18 }, { name: '梅屋敷', offset: 20 }, { name: '京急蒲田', offset: 22 },
  { name: '雑色', offset: 25 }, { name: '六郷土手', offset: 27 }, { name: '京急川崎', offset: 29 },
  { name: '港町', offset: 30 }, { name: '鶴見市場', offset: 32 }, { name: '京急鶴見', offset: 34 },
  { name: '花月園前', offset: 35 }, { name: '生麦', offset: 37 }, { name: '京急新子安', offset: 39 },
  { name: '子安', offset: 41 }, { name: '神奈川新町', offset: 42 }, { name: '仲木戸', offset: 43 },
  { name: '神奈川', offset: 44 }, { name: '横浜', offset: 46 },
], keikyuMap);
const keikyuDir1 = withCoords([
  { name: '横浜', offset: 0 }, { name: '神奈川', offset: 2 }, { name: '仲木戸', offset: 3 },
  { name: '神奈川新町', offset: 4 }, { name: '子安', offset: 5 }, { name: '京急新子安', offset: 7 },
  { name: '生麦', offset: 9 }, { name: '花月園前', offset: 11 }, { name: '京急鶴見', offset: 12 },
  { name: '鶴見市場', offset: 14 }, { name: '港町', offset: 16 }, { name: '京急川崎', offset: 17 },
  { name: '六郷土手', offset: 19 }, { name: '雑色', offset: 21 }, { name: '京急蒲田', offset: 24 },
  { name: '梅屋敷', offset: 26 }, { name: '大森町', offset: 28 }, { name: '平和島', offset: 30 },
  { name: '大森海岸', offset: 32 }, { name: '立会川', offset: 34 }, { name: '鮫洲', offset: 36 },
  { name: '青物横丁', offset: 38 }, { name: '新馬場', offset: 40 }, { name: '北品川', offset: 42 },
  { name: '品川', offset: 44 }, { name: '泉岳寺', offset: 46 },
], keikyuMap);
const keikyuPatterns: PatternSimple[] = [
  { fromMin: m(5),     toMin: m(7),    intervalMin: 7 },
  { fromMin: m(7),     toMin: m(9,30), intervalMin: 5 },
  { fromMin: m(9,30),  toMin: m(17),   intervalMin: 7 },
  { fromMin: m(17),    toMin: m(20,30),intervalMin: 5 },
  { fromMin: m(20,30), toMin: m(24,30),intervalMin: 8 },
];

// 日比谷線（北千住→中目黒: 0 / 中目黒→北千住: 1）
const hibiyaMap = buildCoordMap(hibiyaLine);
const hibiyaDir0 = withCoords([
  { name: '北千住', offset: 0 }, { name: '南千住', offset: 3 }, { name: '三ノ輪', offset: 5 },
  { name: '入谷', offset: 7 }, { name: '上野', offset: 10 }, { name: '仲御徒町', offset: 12 },
  { name: '秋葉原', offset: 14 }, { name: '小伝馬町', offset: 16 }, { name: '人形町', offset: 18 },
  { name: '茅場町', offset: 20 }, { name: '八丁堀', offset: 22 }, { name: '築地', offset: 24 },
  { name: '東銀座', offset: 26 }, { name: '銀座', offset: 27 }, { name: '日比谷', offset: 29 },
  { name: '霞ケ関', offset: 31 }, { name: '虎ノ門ヒルズ', offset: 33 }, { name: '神谷町', offset: 35 },
  { name: '六本木', offset: 37 }, { name: '広尾', offset: 39 }, { name: '恵比寿', offset: 42 },
  { name: '中目黒', offset: 44 },
], hibiyaMap);
const hibiyaDir1 = withCoords([
  { name: '中目黒', offset: 0 }, { name: '恵比寿', offset: 2 }, { name: '広尾', offset: 5 },
  { name: '六本木', offset: 7 }, { name: '神谷町', offset: 9 }, { name: '虎ノ門ヒルズ', offset: 11 },
  { name: '霞ケ関', offset: 13 }, { name: '日比谷', offset: 15 }, { name: '銀座', offset: 17 },
  { name: '東銀座', offset: 18 }, { name: '築地', offset: 20 }, { name: '八丁堀', offset: 22 },
  { name: '茅場町', offset: 24 }, { name: '人形町', offset: 26 }, { name: '小伝馬町', offset: 28 },
  { name: '秋葉原', offset: 30 }, { name: '仲御徒町', offset: 32 }, { name: '上野', offset: 34 },
  { name: '入谷', offset: 37 }, { name: '三ノ輪', offset: 39 }, { name: '南千住', offset: 41 },
  { name: '北千住', offset: 44 },
], hibiyaMap);
const hibiyaPatterns: PatternSimple[] = [
  { fromMin: m(5),     toMin: m(7),    intervalMin: 8 },
  { fromMin: m(7),     toMin: m(9,30), intervalMin: 3 },
  { fromMin: m(9,30),  toMin: m(17),   intervalMin: 5 },
  { fromMin: m(17),    toMin: m(20),   intervalMin: 3 },
  { fromMin: m(20),    toMin: m(24,30),intervalMin: 6 },
];

// 東西線（西船橋→中野: 0 / 中野→西船橋: 1）
const tozaiMap = buildCoordMap(tozaiLine);
const tozaiDir0 = withCoords([
  { name: '西船橋', offset: 0 }, { name: '原木中山', offset: 3 }, { name: '妙典', offset: 5 },
  { name: '行徳', offset: 7 }, { name: '南行徳', offset: 9 }, { name: '浦安', offset: 11 },
  { name: '葛西', offset: 13 }, { name: '西葛西', offset: 15 }, { name: '南砂町', offset: 17 },
  { name: '東陽町', offset: 20 }, { name: '木場', offset: 22 }, { name: '門前仲町', offset: 25 },
  { name: '茅場町', offset: 27 }, { name: '日本橋', offset: 29 }, { name: '大手町', offset: 31 },
  { name: '竹橋', offset: 33 }, { name: '九段下', offset: 35 }, { name: '飯田橋', offset: 37 },
  { name: '神楽坂', offset: 39 }, { name: '早稲田', offset: 41 }, { name: '高田馬場', offset: 43 },
  { name: '落合', offset: 46 }, { name: '中野', offset: 48 },
], tozaiMap);
const tozaiDir1 = withCoords([
  { name: '中野', offset: 0 }, { name: '落合', offset: 2 }, { name: '高田馬場', offset: 5 },
  { name: '早稲田', offset: 7 }, { name: '神楽坂', offset: 9 }, { name: '飯田橋', offset: 11 },
  { name: '九段下', offset: 13 }, { name: '竹橋', offset: 15 }, { name: '大手町', offset: 17 },
  { name: '日本橋', offset: 19 }, { name: '茅場町', offset: 21 }, { name: '門前仲町', offset: 23 },
  { name: '木場', offset: 26 }, { name: '東陽町', offset: 28 }, { name: '南砂町', offset: 31 },
  { name: '西葛西', offset: 33 }, { name: '葛西', offset: 35 }, { name: '浦安', offset: 37 },
  { name: '南行徳', offset: 39 }, { name: '行徳', offset: 41 }, { name: '妙典', offset: 43 },
  { name: '原木中山', offset: 45 }, { name: '西船橋', offset: 48 },
], tozaiMap);
const tozaiPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 7 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 3 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 5 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 3 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 6 },
];

// 千代田線（代々木上原→金町: 0 / 金町→代々木上原: 1）
const chiyodaMap = buildCoordMap(chiyodaLine);
const chiyodaDir0 = withCoords([
  { name: '代々木上原', offset: 0 }, { name: '代々木公園', offset: 2 }, { name: '明治神宮前', offset: 4 },
  { name: '表参道', offset: 6 }, { name: '乃木坂', offset: 8 }, { name: '赤坂', offset: 10 },
  { name: '国会議事堂前', offset: 12 }, { name: '霞ケ関', offset: 14 }, { name: '日比谷', offset: 16 },
  { name: '二重橋前', offset: 18 }, { name: '大手町', offset: 20 }, { name: '新御茶ノ水', offset: 22 },
  { name: '湯島', offset: 24 }, { name: '根津', offset: 26 }, { name: '千駄木', offset: 28 },
  { name: '西日暮里', offset: 30 }, { name: '町屋', offset: 32 }, { name: '北千住', offset: 34 },
  { name: '綾瀬', offset: 37 }, { name: '北綾瀬', offset: 40 }, { name: '亀有', offset: 43 },
  { name: '金町', offset: 46 },
], chiyodaMap);
const chiyodaDir1 = withCoords([
  { name: '金町', offset: 0 }, { name: '亀有', offset: 3 }, { name: '北綾瀬', offset: 6 },
  { name: '綾瀬', offset: 9 }, { name: '北千住', offset: 12 }, { name: '町屋', offset: 14 },
  { name: '西日暮里', offset: 16 }, { name: '千駄木', offset: 18 }, { name: '根津', offset: 20 },
  { name: '湯島', offset: 22 }, { name: '新御茶ノ水', offset: 24 }, { name: '大手町', offset: 26 },
  { name: '二重橋前', offset: 28 }, { name: '日比谷', offset: 30 }, { name: '霞ケ関', offset: 32 },
  { name: '国会議事堂前', offset: 34 }, { name: '赤坂', offset: 36 }, { name: '乃木坂', offset: 38 },
  { name: '表参道', offset: 40 }, { name: '明治神宮前', offset: 42 }, { name: '代々木公園', offset: 44 },
  { name: '代々木上原', offset: 46 },
], chiyodaMap);
const chiyodaPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 7 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 3 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 5 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 3 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 6 },
];

// 半蔵門線（押上→中央林間: 0 / 中央林間→押上: 1）
const hanzomonMap = buildCoordMap(hanzomonLine);
const hanzomonDir0 = withCoords([
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
], hanzomonMap);
const hanzomonDir1 = withCoords([
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
], hanzomonMap);
const hanzomonPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 8 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 4 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 5 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 6 },
];

// 南北線（目黒→赤羽岩淵: 0 / 赤羽岩淵→目黒: 1）
const nambokuMap = buildCoordMap(nambokuLine);
const nambokuDir0 = withCoords([
  { name: '目黒', offset: 0 }, { name: '白金台', offset: 2 }, { name: '白金高輪', offset: 4 },
  { name: '麻布十番', offset: 6 }, { name: '六本木一丁目', offset: 8 }, { name: '溜池山王', offset: 10 },
  { name: '永田町', offset: 12 }, { name: '四ツ谷', offset: 14 }, { name: '市ケ谷', offset: 16 },
  { name: '飯田橋', offset: 18 }, { name: '後楽園', offset: 20 }, { name: '東大前', offset: 22 },
  { name: '本駒込', offset: 24 }, { name: '駒込', offset: 26 }, { name: '西ケ原', offset: 28 },
  { name: '王子', offset: 30 }, { name: '王子神谷', offset: 32 }, { name: '志茂', offset: 34 },
  { name: '赤羽岩淵', offset: 36 },
], nambokuMap);
const nambokuDir1 = withCoords([
  { name: '赤羽岩淵', offset: 0 }, { name: '志茂', offset: 2 }, { name: '王子神谷', offset: 4 },
  { name: '王子', offset: 6 }, { name: '西ケ原', offset: 8 }, { name: '駒込', offset: 10 },
  { name: '本駒込', offset: 12 }, { name: '東大前', offset: 14 }, { name: '後楽園', offset: 16 },
  { name: '飯田橋', offset: 18 }, { name: '市ケ谷', offset: 20 }, { name: '四ツ谷', offset: 22 },
  { name: '永田町', offset: 24 }, { name: '溜池山王', offset: 26 }, { name: '六本木一丁目', offset: 28 },
  { name: '麻布十番', offset: 30 }, { name: '白金高輪', offset: 32 }, { name: '白金台', offset: 34 },
  { name: '目黒', offset: 36 },
], nambokuMap);
const nambokuPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 8 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 4 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 7 },
];

// 副都心線（和光市→渋谷: 0 / 渋谷→和光市: 1）
const fukutoshinMap = buildCoordMap(fukutoshinLine);
const fukutoshinDir0 = withCoords([
  { name: '和光市', offset: 0 }, { name: '地下鉄成増', offset: 3 }, { name: '地下鉄赤塚', offset: 5 },
  { name: '平和台', offset: 7 }, { name: '氷川台', offset: 9 }, { name: '小竹向原', offset: 11 },
  { name: '千川', offset: 13 }, { name: '要町', offset: 15 }, { name: '池袋', offset: 17 },
  { name: '雑司が谷', offset: 19 }, { name: '西早稲田', offset: 21 }, { name: '東新宿', offset: 23 },
  { name: '新宿三丁目', offset: 25 }, { name: '北参道', offset: 27 }, { name: '明治神宮前', offset: 29 },
  { name: '渋谷', offset: 31 },
], fukutoshinMap);
const fukutoshinDir1 = withCoords([
  { name: '渋谷', offset: 0 }, { name: '明治神宮前', offset: 2 }, { name: '北参道', offset: 4 },
  { name: '新宿三丁目', offset: 6 }, { name: '東新宿', offset: 8 }, { name: '西早稲田', offset: 10 },
  { name: '雑司が谷', offset: 12 }, { name: '池袋', offset: 14 }, { name: '要町', offset: 16 },
  { name: '千川', offset: 18 }, { name: '小竹向原', offset: 20 }, { name: '氷川台', offset: 22 },
  { name: '平和台', offset: 24 }, { name: '地下鉄赤塚', offset: 26 }, { name: '地下鉄成増', offset: 28 },
  { name: '和光市', offset: 31 },
], fukutoshinMap);
const fukutoshinPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 8 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 4 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 7 },
];

// 都営浅草線（押上→西馬込: 0 / 西馬込→押上: 1）
const toeiAsakusaMap = buildCoordMap(toeiAsakusaLine);
const toeiAsakusaDir0 = withCoords([
  { name: '押上', offset: 0 }, { name: '本所吾妻橋', offset: 2 }, { name: '浅草', offset: 4 },
  { name: '蔵前', offset: 6 }, { name: '浅草橋', offset: 8 }, { name: '人形町', offset: 10 },
  { name: '東日本橋', offset: 12 }, { name: '宝町', offset: 14 }, { name: '東銀座', offset: 16 },
  { name: '新橋', offset: 18 }, { name: '大門', offset: 20 }, { name: '三田', offset: 23 },
  { name: '泉岳寺', offset: 26 }, { name: '高輪台', offset: 28 }, { name: '五反田', offset: 31 },
  { name: '戸越', offset: 33 }, { name: '中延', offset: 35 }, { name: '馬込', offset: 37 },
  { name: '西馬込', offset: 39 },
], toeiAsakusaMap);
const toeiAsakusaDir1 = withCoords([
  { name: '西馬込', offset: 0 }, { name: '馬込', offset: 2 }, { name: '中延', offset: 4 },
  { name: '戸越', offset: 6 }, { name: '五反田', offset: 8 }, { name: '高輪台', offset: 11 },
  { name: '泉岳寺', offset: 13 }, { name: '三田', offset: 16 }, { name: '大門', offset: 19 },
  { name: '新橋', offset: 21 }, { name: '東銀座', offset: 23 }, { name: '宝町', offset: 25 },
  { name: '東日本橋', offset: 27 }, { name: '人形町', offset: 29 }, { name: '浅草橋', offset: 31 },
  { name: '蔵前', offset: 33 }, { name: '浅草', offset: 35 }, { name: '本所吾妻橋', offset: 37 },
  { name: '押上', offset: 39 },
], toeiAsakusaMap);
const toeiAsakusaPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 8 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 4 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 7 },
];

// 都営三田線（目黒→西高島平: 0 / 西高島平→目黒: 1）
const toeiMitaMap = buildCoordMap(toeiMitaLine);
const toeiMitaDir0 = withCoords([
  { name: '目黒', offset: 0 }, { name: '白金台', offset: 2 }, { name: '白金高輪', offset: 4 },
  { name: '三田', offset: 7 }, { name: '芝公園', offset: 9 }, { name: '御成門', offset: 11 },
  { name: '内幸町', offset: 13 }, { name: '日比谷', offset: 15 }, { name: '大手町', offset: 17 },
  { name: '神保町', offset: 19 }, { name: '水道橋', offset: 21 }, { name: '春日', offset: 23 },
  { name: '白山', offset: 25 }, { name: '千石', offset: 27 }, { name: '巣鴨', offset: 29 },
  { name: '西巣鴨', offset: 31 }, { name: '新板橋', offset: 33 }, { name: '板橋区役所前', offset: 35 },
  { name: '板橋本町', offset: 37 }, { name: '本蓮沼', offset: 39 }, { name: '志村坂上', offset: 41 },
  { name: '志村三丁目', offset: 43 }, { name: '蓮根', offset: 45 }, { name: '西台', offset: 47 },
  { name: '高島平', offset: 49 }, { name: '新高島平', offset: 51 }, { name: '西高島平', offset: 53 },
], toeiMitaMap);
const toeiMitaDir1 = withCoords([
  { name: '西高島平', offset: 0 }, { name: '新高島平', offset: 2 }, { name: '高島平', offset: 4 },
  { name: '西台', offset: 6 }, { name: '蓮根', offset: 8 }, { name: '志村三丁目', offset: 10 },
  { name: '志村坂上', offset: 12 }, { name: '本蓮沼', offset: 14 }, { name: '板橋本町', offset: 16 },
  { name: '板橋区役所前', offset: 18 }, { name: '新板橋', offset: 20 }, { name: '西巣鴨', offset: 22 },
  { name: '巣鴨', offset: 24 }, { name: '千石', offset: 26 }, { name: '白山', offset: 28 },
  { name: '春日', offset: 30 }, { name: '水道橋', offset: 32 }, { name: '神保町', offset: 34 },
  { name: '大手町', offset: 36 }, { name: '日比谷', offset: 38 }, { name: '内幸町', offset: 40 },
  { name: '御成門', offset: 42 }, { name: '芝公園', offset: 44 }, { name: '三田', offset: 46 },
  { name: '白金高輪', offset: 49 }, { name: '白金台', offset: 51 }, { name: '目黒', offset: 53 },
], toeiMitaMap);
const toeiMitaPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 8 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 4 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 7 },
];

// 都営新宿線（新宿→本八幡: 0 / 本八幡→新宿: 1）
const toeiShinjukuMap = buildCoordMap(toeiShinjukuLine);
const toeiShinjukuDir0 = withCoords([
  { name: '新宿', offset: 0 }, { name: '曙橋', offset: 3 }, { name: '市ケ谷', offset: 5 },
  { name: '九段下', offset: 8 }, { name: '神保町', offset: 10 }, { name: '小川町', offset: 12 },
  { name: '岩本町', offset: 14 }, { name: '馬喰横山', offset: 16 }, { name: '浜町', offset: 18 },
  { name: '森下', offset: 21 }, { name: '菊川', offset: 23 }, { name: '住吉', offset: 25 },
  { name: '西大島', offset: 27 }, { name: '大島', offset: 29 }, { name: '東大島', offset: 32 },
  { name: '船堀', offset: 35 }, { name: '一之江', offset: 37 }, { name: '瑞江', offset: 39 },
  { name: '篠崎', offset: 41 }, { name: '本八幡', offset: 44 },
], toeiShinjukuMap);
const toeiShinjukuDir1 = withCoords([
  { name: '本八幡', offset: 0 }, { name: '篠崎', offset: 3 }, { name: '瑞江', offset: 5 },
  { name: '一之江', offset: 7 }, { name: '船堀', offset: 9 }, { name: '東大島', offset: 12 },
  { name: '大島', offset: 15 }, { name: '西大島', offset: 17 }, { name: '住吉', offset: 19 },
  { name: '菊川', offset: 21 }, { name: '森下', offset: 23 }, { name: '浜町', offset: 26 },
  { name: '馬喰横山', offset: 28 }, { name: '岩本町', offset: 30 }, { name: '小川町', offset: 32 },
  { name: '神保町', offset: 34 }, { name: '九段下', offset: 36 }, { name: '市ケ谷', offset: 39 },
  { name: '曙橋', offset: 41 }, { name: '新宿', offset: 44 },
], toeiShinjukuMap);
const toeiShinjukuPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 8 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 4 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 7 },
];

// 都営大江戸線（都庁前→光が丘: 0 / 光が丘→都庁前: 1）
const toeiOedoMap = buildCoordMap(toeiOedoLine);
const toeiOedoDir0 = withCoords([
  { name: '都庁前', offset: 0 }, { name: '新宿西口', offset: 2 }, { name: '東新宿', offset: 4 },
  { name: '若松河田', offset: 6 }, { name: '牛込柳町', offset: 8 }, { name: '牛込神楽坂', offset: 10 },
  { name: '飯田橋', offset: 12 }, { name: '春日', offset: 14 }, { name: '本郷三丁目', offset: 16 },
  { name: '上野御徒町', offset: 18 }, { name: '新御徒町', offset: 20 }, { name: '蔵前', offset: 22 },
  { name: '両国', offset: 24 }, { name: '森下', offset: 26 }, { name: '清澄白河', offset: 28 },
  { name: '門前仲町', offset: 30 }, { name: '月島', offset: 32 }, { name: '勝どき', offset: 34 },
  { name: '築地市場', offset: 36 }, { name: '汐留', offset: 38 }, { name: '大門', offset: 40 },
  { name: '赤羽橋', offset: 42 }, { name: '麻布十番', offset: 44 }, { name: '六本木', offset: 46 },
  { name: '青山一丁目', offset: 48 }, { name: '国立競技場', offset: 50 }, { name: '代々木', offset: 52 },
  { name: '新宿', offset: 54 }, { name: '中野坂上', offset: 58 }, { name: '西新宿五丁目', offset: 60 },
  { name: '中井', offset: 62 }, { name: '落合南長崎', offset: 64 }, { name: '新江古田', offset: 66 },
  { name: '練馬', offset: 68 }, { name: '豊島園', offset: 70 }, { name: '練馬春日町', offset: 72 },
  { name: '光が丘', offset: 74 },
], toeiOedoMap);
const toeiOedoDir1 = withCoords([
  { name: '光が丘', offset: 0 }, { name: '練馬春日町', offset: 2 }, { name: '豊島園', offset: 4 },
  { name: '練馬', offset: 6 }, { name: '新江古田', offset: 8 }, { name: '落合南長崎', offset: 10 },
  { name: '中井', offset: 12 }, { name: '西新宿五丁目', offset: 14 }, { name: '中野坂上', offset: 16 },
  { name: '新宿', offset: 20 }, { name: '代々木', offset: 22 }, { name: '国立競技場', offset: 24 },
  { name: '青山一丁目', offset: 26 }, { name: '六本木', offset: 28 }, { name: '麻布十番', offset: 30 },
  { name: '赤羽橋', offset: 32 }, { name: '大門', offset: 34 }, { name: '汐留', offset: 36 },
  { name: '築地市場', offset: 38 }, { name: '勝どき', offset: 40 }, { name: '月島', offset: 42 },
  { name: '門前仲町', offset: 44 }, { name: '清澄白河', offset: 46 }, { name: '森下', offset: 48 },
  { name: '両国', offset: 50 }, { name: '蔵前', offset: 52 }, { name: '新御徒町', offset: 54 },
  { name: '上野御徒町', offset: 56 }, { name: '本郷三丁目', offset: 58 }, { name: '春日', offset: 60 },
  { name: '飯田橋', offset: 62 }, { name: '牛込神楽坂', offset: 64 }, { name: '牛込柳町', offset: 66 },
  { name: '若松河田', offset: 68 }, { name: '東新宿', offset: 70 }, { name: '都庁前', offset: 74 },
], toeiOedoMap);
const toeiOedoPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 8 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 4 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 7 },
];

// 西武池袋線（池袋→入間市: 0 / 入間市→池袋: 1）
const seibuIkebukuroMap = buildCoordMap(seibuIkebukuroLine);
const seibuIkebukuroDir0 = withCoords([
  { name: '池袋', offset: 0 }, { name: '椎名町', offset: 3 }, { name: '東長崎', offset: 5 },
  { name: '江古田', offset: 7 }, { name: '桜台', offset: 9 }, { name: '練馬', offset: 11 },
  { name: '中村橋', offset: 14 }, { name: '富士見台', offset: 16 }, { name: '練馬高野台', offset: 18 },
  { name: '石神井公園', offset: 20 }, { name: '大泉学園', offset: 23 }, { name: '保谷', offset: 26 },
  { name: 'ひばりヶ丘', offset: 29 }, { name: '東久留米', offset: 32 }, { name: '清瀬', offset: 35 },
  { name: '秋津', offset: 38 }, { name: '所沢', offset: 41 }, { name: '西所沢', offset: 44 },
  { name: '小手指', offset: 47 }, { name: '狭山ヶ丘', offset: 50 }, { name: '武蔵藤沢', offset: 53 },
  { name: '稲荷山公園', offset: 56 }, { name: '入間市', offset: 59 },
], seibuIkebukuroMap);
const seibuIkebukuroDir1 = withCoords([
  { name: '入間市', offset: 0 }, { name: '稲荷山公園', offset: 3 }, { name: '武蔵藤沢', offset: 6 },
  { name: '狭山ヶ丘', offset: 9 }, { name: '小手指', offset: 12 }, { name: '西所沢', offset: 15 },
  { name: '所沢', offset: 18 }, { name: '秋津', offset: 21 }, { name: '清瀬', offset: 24 },
  { name: '東久留米', offset: 27 }, { name: 'ひばりヶ丘', offset: 30 }, { name: '保谷', offset: 33 },
  { name: '大泉学園', offset: 36 }, { name: '石神井公園', offset: 39 }, { name: '練馬高野台', offset: 41 },
  { name: '富士見台', offset: 43 }, { name: '中村橋', offset: 45 }, { name: '練馬', offset: 48 },
  { name: '桜台', offset: 50 }, { name: '江古田', offset: 52 }, { name: '東長崎', offset: 54 },
  { name: '椎名町', offset: 56 }, { name: '池袋', offset: 59 },
], seibuIkebukuroMap);
const seibuIkebukuroPatterns: PatternSimple[] = [
  { fromMin: m(4,30), toMin: m(7),    intervalMin: 9 },
  { fromMin: m(7),    toMin: m(9),    intervalMin: 4 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20,30),intervalMin: 4 },
  { fromMin: m(20,30),toMin: m(24),   intervalMin: 8 },
];

// 東武東上線（池袋→小川町: 0 / 小川町→池袋: 1）
const tobuTojoMap = buildCoordMap(tobuTojoLine);
const tobuTojoDir0 = withCoords([
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
], tobuTojoMap);
const tobuTojoDir1 = withCoords([
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
], tobuTojoMap);
const tobuTojoPatterns: PatternSimple[] = [
  { fromMin: m(4,30), toMin: m(7),    intervalMin: 9 },
  { fromMin: m(7),    toMin: m(9),    intervalMin: 3 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 5 },
  { fromMin: m(17),   toMin: m(20,30),intervalMin: 3 },
  { fromMin: m(20,30),toMin: m(24),   intervalMin: 8 },
];

// JR埼京線（大崎→大宮: 0 / 大宮→大崎: 1）
const saikyoMap = buildCoordMap(jrSaikyoLine);
const saikyoDir0 = withCoords([
  { name: '大崎', offset: 0 }, { name: '恵比寿', offset: 3 }, { name: '渋谷', offset: 5 },
  { name: '新宿', offset: 8 }, { name: '池袋', offset: 11 }, { name: '板橋', offset: 14 },
  { name: '十条', offset: 16 }, { name: '赤羽', offset: 19 }, { name: '北赤羽', offset: 21 },
  { name: '浮間舟渡', offset: 23 }, { name: '戸田公園', offset: 26 }, { name: '戸田', offset: 28 },
  { name: '北戸田', offset: 30 }, { name: '武蔵浦和', offset: 33 }, { name: '中浦和', offset: 35 },
  { name: '南与野', offset: 37 }, { name: '与野本町', offset: 39 }, { name: '北与野', offset: 41 },
  { name: '大宮', offset: 43 },
], saikyoMap);
const saikyoDir1 = withCoords([
  { name: '大宮', offset: 0 }, { name: '北与野', offset: 2 }, { name: '与野本町', offset: 4 },
  { name: '南与野', offset: 6 }, { name: '中浦和', offset: 8 }, { name: '武蔵浦和', offset: 10 },
  { name: '北戸田', offset: 13 }, { name: '戸田', offset: 15 }, { name: '戸田公園', offset: 17 },
  { name: '浮間舟渡', offset: 20 }, { name: '北赤羽', offset: 22 }, { name: '赤羽', offset: 24 },
  { name: '十条', offset: 27 }, { name: '板橋', offset: 29 }, { name: '池袋', offset: 32 },
  { name: '新宿', offset: 35 }, { name: '渋谷', offset: 38 }, { name: '恵比寿', offset: 40 },
  { name: '大崎', offset: 43 },
], saikyoMap);
const saikyoPatterns: PatternSimple[] = [
  { fromMin: m(4,30), toMin: m(7),    intervalMin: 9 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 4 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20,30),intervalMin: 4 },
  { fromMin: m(20,30),toMin: m(24),   intervalMin: 8 },
];

// ── 全路線の設定 ────────────────────────────────────────

const DEMO_LINES: LineDemo[] = [
  {
    key: 'yamanote',
    color: '#9ACD32',
    directions: [
      { stations: yamanoteDir0, travelMin: YAMANOTE_LOOP, isCircular: true, patterns: yamanotePatterns },
      { stations: yamanoteDir1, travelMin: YAMANOTE_LOOP, isCircular: true, patterns: yamanotePatterns },
    ],
  },
  {
    key: 'chuo',
    color: '#FFD400',
    directions: [
      { stations: chuoDir0, travelMin: 54, isCircular: false, patterns: chuoPatterns },
      { stations: chuoDir1, travelMin: 54, isCircular: false, patterns: chuoPatterns },
    ],
  },
  {
    key: 'ginzaLine',
    color: '#FF9500',
    directions: [
      { stations: ginzaDir0, travelMin: 34, isCircular: false, patterns: ginzaPatterns },
      { stations: ginzaDir1, travelMin: 35, isCircular: false, patterns: ginzaPatterns },
    ],
  },
  {
    key: 'marunouchiLine',
    color: '#E60000',
    directions: [
      { stations: marunouchiDir0, travelMin: 33, isCircular: false, patterns: marunouchiPatterns },
      { stations: marunouchiDir1, travelMin: 33, isCircular: false, patterns: marunouchiPatterns },
    ],
  },
  {
    key: 'keihinTohoku',
    color: '#48A5E2',
    directions: [
      { stations: keihinDir0, travelMin: 124, isCircular: false, patterns: keihinPatterns },
      { stations: keihinDir1, travelMin: 124, isCircular: false, patterns: keihinPatterns },
    ],
  },
  {
    key: 'tokyuToyokoLine',
    color: '#D31F27',
    directions: [
      { stations: toyokoDir0, travelMin: 37, isCircular: false, patterns: toyokoPatterns },
      { stations: toyokoDir1, travelMin: 37, isCircular: false, patterns: toyokoPatterns },
    ],
  },
  {
    key: 'jrTokaidoMainLine',
    color: '#FC8D29',
    directions: [
      { stations: tokaidoDir0, travelMin: 66, isCircular: false, patterns: tokaidoPatterns },
      { stations: tokaidoDir1, travelMin: 66, isCircular: false, patterns: tokaidoPatterns },
    ],
  },
  {
    key: 'tokyuDenEnToshiLine',
    color: '#009639',
    directions: [
      { stations: dentoshiDir0, travelMin: 52, isCircular: false, patterns: dentoshiPatterns },
      { stations: dentoshiDir1, travelMin: 52, isCircular: false, patterns: dentoshiPatterns },
    ],
  },
  {
    key: 'odakyuLine',
    color: '#0066CC',
    directions: [
      { stations: odakyuDir0, travelMin: 100, isCircular: false, patterns: odakyuPatterns },
      { stations: odakyuDir1, travelMin: 100, isCircular: false, patterns: odakyuPatterns },
    ],
  },
  {
    key: 'keikyuLine',
    color: '#C8102E',
    directions: [
      { stations: keikyuDir0, travelMin: 46, isCircular: false, patterns: keikyuPatterns },
      { stations: keikyuDir1, travelMin: 46, isCircular: false, patterns: keikyuPatterns },
    ],
  },
  {
    key: 'hibiyaLine',
    color: '#B5B5AC',
    directions: [
      { stations: hibiyaDir0, travelMin: 44, isCircular: false, patterns: hibiyaPatterns },
      { stations: hibiyaDir1, travelMin: 44, isCircular: false, patterns: hibiyaPatterns },
    ],
  },
  {
    key: 'tozaiLine',
    color: '#009BBF',
    directions: [
      { stations: tozaiDir0, travelMin: 48, isCircular: false, patterns: tozaiPatterns },
      { stations: tozaiDir1, travelMin: 48, isCircular: false, patterns: tozaiPatterns },
    ],
  },
  {
    key: 'chiyodaLine',
    color: '#00BB85',
    directions: [
      { stations: chiyodaDir0, travelMin: 46, isCircular: false, patterns: chiyodaPatterns },
      { stations: chiyodaDir1, travelMin: 46, isCircular: false, patterns: chiyodaPatterns },
    ],
  },
  {
    key: 'hanzomonLine',
    color: '#8F76D6',
    directions: [
      { stations: hanzomonDir0, travelMin: 78, isCircular: false, patterns: hanzomonPatterns },
      { stations: hanzomonDir1, travelMin: 78, isCircular: false, patterns: hanzomonPatterns },
    ],
  },
  {
    key: 'nambokuLine',
    color: '#00ADA9',
    directions: [
      { stations: nambokuDir0, travelMin: 36, isCircular: false, patterns: nambokuPatterns },
      { stations: nambokuDir1, travelMin: 36, isCircular: false, patterns: nambokuPatterns },
    ],
  },
  {
    key: 'fukutoshinLine',
    color: '#9C5F2C',
    directions: [
      { stations: fukutoshinDir0, travelMin: 31, isCircular: false, patterns: fukutoshinPatterns },
      { stations: fukutoshinDir1, travelMin: 31, isCircular: false, patterns: fukutoshinPatterns },
    ],
  },
  {
    key: 'toeiAsakusaLine',
    color: '#E85298',
    directions: [
      { stations: toeiAsakusaDir0, travelMin: 39, isCircular: false, patterns: toeiAsakusaPatterns },
      { stations: toeiAsakusaDir1, travelMin: 39, isCircular: false, patterns: toeiAsakusaPatterns },
    ],
  },
  {
    key: 'toeiMitaLine',
    color: '#0079C2',
    directions: [
      { stations: toeiMitaDir0, travelMin: 53, isCircular: false, patterns: toeiMitaPatterns },
      { stations: toeiMitaDir1, travelMin: 53, isCircular: false, patterns: toeiMitaPatterns },
    ],
  },
  {
    key: 'toeiShinjukuLine',
    color: '#6CBB5A',
    directions: [
      { stations: toeiShinjukuDir0, travelMin: 44, isCircular: false, patterns: toeiShinjukuPatterns },
      { stations: toeiShinjukuDir1, travelMin: 44, isCircular: false, patterns: toeiShinjukuPatterns },
    ],
  },
  {
    key: 'toeiOedoLine',
    color: '#B6007A',
    directions: [
      { stations: toeiOedoDir0, travelMin: 74, isCircular: false, patterns: toeiOedoPatterns },
      { stations: toeiOedoDir1, travelMin: 74, isCircular: false, patterns: toeiOedoPatterns },
    ],
  },
  {
    key: 'seibuIkebukuroLine',
    color: '#004098',
    directions: [
      { stations: seibuIkebukuroDir0, travelMin: 59, isCircular: false, patterns: seibuIkebukuroPatterns },
      { stations: seibuIkebukuroDir1, travelMin: 59, isCircular: false, patterns: seibuIkebukuroPatterns },
    ],
  },
  {
    key: 'tobuTojoLine',
    color: '#1E3C8C',
    directions: [
      { stations: tobuTojoDir0, travelMin: 90, isCircular: false, patterns: tobuTojoPatterns },
      { stations: tobuTojoDir1, travelMin: 90, isCircular: false, patterns: tobuTojoPatterns },
    ],
  },
  {
    key: 'jrSaikyoLine',
    color: '#00B5AD',
    directions: [
      { stations: saikyoDir0, travelMin: 43, isCircular: false, patterns: saikyoPatterns },
      { stations: saikyoDir1, travelMin: 43, isCircular: false, patterns: saikyoPatterns },
    ],
  },
];

// ── メインAPI ────────────────────────────────────────────

export function getAllTrainPositions(currentMinutes: number): TrainPosition[] {
  const result: TrainPosition[] = [];

  for (const line of DEMO_LINES) {
    for (let di = 0; di < line.directions.length; di++) {
      const dir = line.directions[di];
      const windowStart = currentMinutes - dir.travelMin;
      const departures = getActiveDepartures(dir.patterns, windowStart, currentMinutes);

      for (const d of departures) {
        const elapsed = currentMinutes - d;
        if (elapsed < 0) continue;
        const pos = interpolate(dir.stations, elapsed, dir.isCircular);
        if (!pos) continue;
        result.push({
          id: `${line.key}_${di}_${Math.round(d * 100)}`,
          lineKey: line.key,
          color: line.color,
          direction: di,
          departureMin: d,
          pos,
        });
      }
    }
  }

  return result;
}

export function formatDemoTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const min = Math.floor(minutes % 60);
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

export const DEMO_LINE_COLORS: Record<string, string> = Object.fromEntries(
  DEMO_LINES.map(l => [l.key, l.color])
);
