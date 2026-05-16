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
