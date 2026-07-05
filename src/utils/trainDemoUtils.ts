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
import { yurakuchoLine } from '../data/yurakucho-line';
import { jrSobuLine } from '../data/jr-sobu-line';
import { jrJobanLine } from '../data/jr-joban-line';
import { tsukubaExpress } from '../data/tsukuba-express';
import { rinkaiLine } from '../data/rinkai-line';
import { yurikamomeLine } from '../data/yurikamome-line';
import { keioLine } from '../data/keio-line';
import { jrNanbuLine } from '../data/jr-nanbu-line';
import { jrNegishiLine } from '../data/jr-kanto-additional';
import { jrYokohamaLine } from '../data/jr-yokohama-line';
import { tokyuMeguro } from '../data/tokyu-additional';
import { seibuShinjukuLine } from '../data/seibu-shinjuku-line';
import { tobuIsesakiLine } from '../data/tobu-isesaki-line';
import { sotetsuMainLine } from '../data/sotetsu-line';
import { tokyoMonorail } from '../data/tokyo-monorail';
import { tamaMonorail } from '../data/tama-monorail';
import { odakyuEnoshimaLine } from '../data/odakyu-enoshima-line';
import { keiseiMainLine } from '../data/keisei-main-line';
import { jrUtsunomiyaLine } from '../data/jr-kanto-additional';
import { jrHachikoLine } from '../data/jr-hachiko-line';
import { jrItsukaichiLine } from '../data/jr-itsukaichi-line';
import { saitamaRailway, newShuttle } from '../data/saitama-lines';
import { keiseiOshiageLine, hokusouLine } from '../data/keisei-branch-lines';
import { keikyuAirportLine, keikyuKurihamaLine } from '../data/keikyu-branch-lines';
import { toyoRapid, shinkeisei } from '../data/chiba-private-railways';
import { sotetsuIzumino } from '../data/sotetsu-line';
import { sotetsuJRLine } from '../data/sotetsu-jr-line';
import { shonanMonorail } from '../data/shonan-monorail';
import { odakyuTamaLine } from '../data/odakyu-tama-line';
import { tobuNikkoLine } from '../data/tobu-nikko-line';
import { tobuKameidoLine } from '../data/tobu-kameido-line';
import { tokyuTamagawa, tokyuIkegami } from '../data/tokyu-additional';
import { jrMusashinoLine } from '../data/jr-musashino-line';
import { yokohamaBlueLine } from '../data/yokohama-blue-line';
import { jrTakasakiLine } from '../data/jr-takasaki-line';
import { jrKeiyo, jrSobuChiba } from '../data/jr-sobu-chiba';
import { yokohamaGreenLine } from '../data/yokohama-green-line';
import { enoshimaElectricRailway } from '../data/enoshima-electric-railway';
import { todenArakawaLine } from '../data/toden-arakawa-line';
import { nipporiToneriLiner } from '../data/nippori-toneri-liner';
import { jrOmeLine } from '../data/jr-ome-line';
import { keioInokashiraLine } from '../data/keio-inokashira-line';
import { tokyuSetagayaLine } from '../data/tokyu-setagaya-line';
import { tokyuOimachiLine } from '../data/tokyu-oimachi-line';
import { yokosukaLine } from '../data/yokosuka-line';
import { keioSagamiharaLine } from '../data/keio-sagamihara-line';

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
  bearing: number;
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

function calcBearing(aLat: number, aLng: number, bLat: number, bLng: number): number {
  return Math.atan2(bLng - aLng, bLat - aLat) * 180 / Math.PI;
}

function interpolateWithBearing(
  stations: StationWithCoord[], elapsed: number, circular: boolean
): { pos: [number, number]; bearing: number } | null {
  const totalMin = stations[stations.length - 1].offset;
  const e = circular ? ((elapsed % totalMin) + totalMin) % totalMin : elapsed;

  for (let i = 0; i < stations.length - 1; i++) {
    const a = stations[i], b = stations[i + 1];
    if (e < a.offset || e >= b.offset) continue;
    const segDur = b.offset - a.offset;
    const dwell = Math.min(DWELL_MIN, segDur * 0.4);
    const moveDur = segDur - dwell;
    if (e < a.offset + moveDur) {
      const r = moveDur > 0 ? (e - a.offset) / moveDur : 1;
      return {
        pos: [a.lat + r * (b.lat - a.lat), a.lng + r * (b.lng - a.lng)],
        bearing: calcBearing(a.lat, a.lng, b.lat, b.lng),
      };
    } else {
      const next = stations[i + 2];
      return {
        pos: [b.lat, b.lng],
        bearing: next ? calcBearing(b.lat, b.lng, next.lat, next.lng) : calcBearing(a.lat, a.lng, b.lat, b.lng),
      };
    }
  }

  if (circular) {
    const last = stations[stations.length - 1];
    const first = stations[0];
    const segDur = totalMin - last.offset;
    const dwell = Math.min(DWELL_MIN, segDur * 0.4);
    const moveDur = segDur - dwell;
    if (e >= last.offset) {
      if (moveDur > 0 && e < last.offset + moveDur) {
        const r = (e - last.offset) / moveDur;
        return {
          pos: [last.lat + r * (first.lat - last.lat), last.lng + r * (first.lng - last.lng)],
          bearing: calcBearing(last.lat, last.lng, first.lat, first.lng),
        };
      }
      return { pos: [first.lat, first.lng], bearing: calcBearing(last.lat, last.lng, first.lat, first.lng) };
    }
  }

  const last = stations[stations.length - 1];
  const prev = stations[stations.length - 2];
  return { pos: [last.lat, last.lng], bearing: prev ? calcBearing(prev.lat, prev.lng, last.lat, last.lng) : 0 };
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

// 有楽町線（和光市→新木場: 0 / 新木場→和光市: 1）
const yurakuchoMap = buildCoordMap(yurakuchoLine);
const yurakuchoDir0 = withCoords([
  { name: '和光市', offset: 0 }, { name: '地下鉄成増', offset: 5 }, { name: '地下鉄赤塚', offset: 7 },
  { name: '平和台', offset: 9 }, { name: '氷川台', offset: 11 }, { name: '小竹向原', offset: 12 },
  { name: '千川', offset: 14 }, { name: '要町', offset: 15 }, { name: '池袋', offset: 16 },
  { name: '東池袋', offset: 18 }, { name: '護国寺', offset: 19 }, { name: '江戸川橋', offset: 21 },
  { name: '飯田橋', offset: 22 }, { name: '市ケ谷', offset: 24 }, { name: '麹町', offset: 25 },
  { name: '永田町', offset: 26 }, { name: '桜田門', offset: 28 }, { name: '有楽町', offset: 29 },
  { name: '銀座一丁目', offset: 30 }, { name: '新富町', offset: 31 }, { name: '月島', offset: 33 },
  { name: '豊洲', offset: 34 }, { name: '辰巳', offset: 36 }, { name: '新木場', offset: 38 },
], yurakuchoMap);
const yurakuchoDir1 = withCoords([
  { name: '新木場', offset: 0 }, { name: '辰巳', offset: 2 }, { name: '豊洲', offset: 4 },
  { name: '月島', offset: 6 }, { name: '新富町', offset: 7 }, { name: '銀座一丁目', offset: 8 },
  { name: '有楽町', offset: 9 }, { name: '桜田門', offset: 10 }, { name: '永田町', offset: 12 },
  { name: '麹町', offset: 13 }, { name: '市ケ谷', offset: 14 }, { name: '飯田橋', offset: 16 },
  { name: '江戸川橋', offset: 17 }, { name: '護国寺', offset: 19 }, { name: '東池袋', offset: 20 },
  { name: '池袋', offset: 22 }, { name: '要町', offset: 23 }, { name: '千川', offset: 24 },
  { name: '小竹向原', offset: 26 }, { name: '氷川台', offset: 27 }, { name: '平和台', offset: 29 },
  { name: '地下鉄赤塚', offset: 31 }, { name: '地下鉄成増', offset: 33 }, { name: '和光市', offset: 38 },
], yurakuchoMap);
const yurakuchoPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 8 },
  { fromMin: m(7,30), toMin: m(9,30), intervalMin: 5 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 7 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 5 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 9 },
];

// JR総武線快速（東京→千葉: 0 / 千葉→東京: 1）
const sobuMap = buildCoordMap(jrSobuLine);
const sobuDir0 = withCoords([
  { name: '東京', offset: 0 }, { name: '新日本橋', offset: 3 }, { name: '馬喰町', offset: 5 },
  { name: '錦糸町', offset: 7 }, { name: '亀戸', offset: 10 }, { name: '平井', offset: 12 },
  { name: '新小岩', offset: 14 }, { name: '小岩', offset: 17 }, { name: '市川', offset: 20 },
  { name: '本八幡', offset: 23 }, { name: '下総中山', offset: 25 }, { name: '西船橋', offset: 27 },
  { name: '船橋', offset: 30 }, { name: '東船橋', offset: 33 }, { name: '津田沼', offset: 35 },
  { name: '幕張本郷', offset: 38 }, { name: '幕張', offset: 40 }, { name: '新検見川', offset: 42 },
  { name: '稲毛', offset: 44 }, { name: '西千葉', offset: 47 }, { name: '千葉', offset: 49 },
], sobuMap);
const sobuDir1 = withCoords([
  { name: '千葉', offset: 0 }, { name: '西千葉', offset: 2 }, { name: '稲毛', offset: 5 },
  { name: '新検見川', offset: 7 }, { name: '幕張', offset: 9 }, { name: '幕張本郷', offset: 11 },
  { name: '津田沼', offset: 14 }, { name: '東船橋', offset: 16 }, { name: '船橋', offset: 19 },
  { name: '西船橋', offset: 22 }, { name: '下総中山', offset: 24 }, { name: '本八幡', offset: 26 },
  { name: '市川', offset: 29 }, { name: '小岩', offset: 32 }, { name: '新小岩', offset: 35 },
  { name: '平井', offset: 37 }, { name: '亀戸', offset: 39 }, { name: '錦糸町', offset: 42 },
  { name: '馬喰町', offset: 44 }, { name: '新日本橋', offset: 46 }, { name: '東京', offset: 49 },
], sobuMap);
const sobuPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 15 },
  { fromMin: m(7),    toMin: m(9),    intervalMin: 10 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// JR常磐線（品川→土浦: 0 / 土浦→品川: 1）
const jobanMap = buildCoordMap(jrJobanLine);
const jobanDir0 = withCoords([
  { name: '品川', offset: 0 }, { name: '田町', offset: 2 }, { name: '浜松町', offset: 4 },
  { name: '新橋', offset: 6 }, { name: '東京', offset: 9 }, { name: '上野', offset: 12 },
  { name: '日暮里', offset: 15 }, { name: '三河島', offset: 17 }, { name: '南千住', offset: 19 },
  { name: '北千住', offset: 21 }, { name: '松戸', offset: 24 }, { name: '柏', offset: 30 },
  { name: '我孫子', offset: 37 }, { name: '天王台', offset: 41 }, { name: '取手', offset: 43 },
  { name: '藤代', offset: 47 }, { name: '龍ケ崎市', offset: 50 }, { name: '牛久', offset: 54 },
  { name: 'ひたち野うしく', offset: 57 }, { name: '荒川沖', offset: 60 }, { name: '土浦', offset: 62 },
], jobanMap);
const jobanDir1 = withCoords([
  { name: '土浦', offset: 0 }, { name: '荒川沖', offset: 2 }, { name: 'ひたち野うしく', offset: 5 },
  { name: '牛久', offset: 8 }, { name: '龍ケ崎市', offset: 12 }, { name: '藤代', offset: 15 },
  { name: '取手', offset: 19 }, { name: '天王台', offset: 21 }, { name: '我孫子', offset: 25 },
  { name: '柏', offset: 32 }, { name: '松戸', offset: 38 }, { name: '北千住', offset: 41 },
  { name: '南千住', offset: 43 }, { name: '三河島', offset: 45 }, { name: '日暮里', offset: 47 },
  { name: '上野', offset: 50 }, { name: '東京', offset: 53 }, { name: '新橋', offset: 56 },
  { name: '浜松町', offset: 58 }, { name: '田町', offset: 60 }, { name: '品川', offset: 62 },
], jobanMap);
const jobanPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 20 },
  { fromMin: m(7),    toMin: m(9),    intervalMin: 10 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 20 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 25 },
];

// つくばエクスプレス（秋葉原→つくば: 0 / つくば→秋葉原: 1）
const txMap = buildCoordMap(tsukubaExpress);
const txDir0 = withCoords([
  { name: '秋葉原', offset: 0 }, { name: '新御徒町', offset: 8 }, { name: '浅草', offset: 13 },
  { name: '南千住', offset: 20 }, { name: '北千住', offset: 26 }, { name: '青井', offset: 34 },
  { name: '六町', offset: 39 }, { name: '八潮', offset: 43 }, { name: '三郷中央', offset: 48 },
  { name: '南流山', offset: 54 }, { name: '流山セントラルパーク', offset: 58 }, { name: '流山おおたかの森', offset: 61 },
  { name: '柏の葉キャンパス', offset: 66 }, { name: '柏たなか', offset: 70 }, { name: '守谷', offset: 74 },
  { name: 'みらい平', offset: 82 }, { name: 'みどりの', offset: 88 }, { name: '万博記念公園', offset: 93 },
  { name: '研究学園', offset: 97 }, { name: 'つくば', offset: 100 },
], txMap);
const txDir1 = withCoords([
  { name: 'つくば', offset: 0 }, { name: '研究学園', offset: 3 }, { name: '万博記念公園', offset: 7 },
  { name: 'みどりの', offset: 12 }, { name: 'みらい平', offset: 18 }, { name: '守谷', offset: 26 },
  { name: '柏たなか', offset: 30 }, { name: '柏の葉キャンパス', offset: 34 }, { name: '流山おおたかの森', offset: 39 },
  { name: '流山セントラルパーク', offset: 42 }, { name: '南流山', offset: 46 }, { name: '三郷中央', offset: 52 },
  { name: '八潮', offset: 57 }, { name: '六町', offset: 61 }, { name: '青井', offset: 66 },
  { name: '北千住', offset: 74 }, { name: '南千住', offset: 80 }, { name: '浅草', offset: 87 },
  { name: '新御徒町', offset: 92 }, { name: '秋葉原', offset: 100 },
], txMap);
const txPatterns: PatternSimple[] = [
  { fromMin: m(5,20), toMin: m(7),    intervalMin: 20 },
  { fromMin: m(7),    toMin: m(9),    intervalMin: 10 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// りんかい線（大崎→新木場: 0 / 新木場→大崎: 1）
const rinkaiMap = buildCoordMap(rinkaiLine);
const rinkaiDir0 = withCoords([
  { name: '大崎', offset: 0 }, { name: '大井町', offset: 3 }, { name: '品川シーサイド', offset: 7 },
  { name: '天王洲アイル', offset: 11 }, { name: '東京テレポート', offset: 14 },
  { name: '国際展示場', offset: 17 }, { name: '東雲', offset: 21 }, { name: '新木場', offset: 23 },
], rinkaiMap);
const rinkaiDir1 = withCoords([
  { name: '新木場', offset: 0 }, { name: '東雲', offset: 2 }, { name: '国際展示場', offset: 6 },
  { name: '東京テレポート', offset: 9 }, { name: '天王洲アイル', offset: 12 },
  { name: '品川シーサイド', offset: 16 }, { name: '大井町', offset: 20 }, { name: '大崎', offset: 23 },
], rinkaiMap);
const rinkaiPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 12 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 8 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 12 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 8 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 15 },
];

// ゆりかもめ（新橋→豊洲: 0 / 豊洲→新橋: 1）
const yurikamomeMap = buildCoordMap(yurikamomeLine);
const yurikamomeDir0 = withCoords([
  { name: '新橋', offset: 0 }, { name: '汐留', offset: 2 }, { name: '竹芝', offset: 4 },
  { name: '日の出', offset: 6 }, { name: '芝浦ふ頭', offset: 8 }, { name: 'お台場海浜公園', offset: 10 },
  { name: '台場', offset: 12 }, { name: 'テレコムセンター', offset: 14 }, { name: '青海', offset: 16 },
  { name: '東京国際クルーズターミナル', offset: 19 }, { name: '中央広場前', offset: 21 },
  { name: '有明', offset: 23 }, { name: '有明テニスの森', offset: 25 }, { name: '市場前', offset: 27 },
  { name: '新豊洲', offset: 29 }, { name: '豊洲', offset: 31 },
], yurikamomeMap);
const yurikamomeDir1 = withCoords([
  { name: '豊洲', offset: 0 }, { name: '新豊洲', offset: 2 }, { name: '市場前', offset: 4 },
  { name: '有明テニスの森', offset: 6 }, { name: '有明', offset: 8 }, { name: '中央広場前', offset: 10 },
  { name: '東京国際クルーズターミナル', offset: 12 }, { name: '青海', offset: 15 },
  { name: 'テレコムセンター', offset: 17 }, { name: '台場', offset: 19 },
  { name: 'お台場海浜公園', offset: 21 }, { name: '芝浦ふ頭', offset: 23 },
  { name: '日の出', offset: 25 }, { name: '竹芝', offset: 27 }, { name: '汐留', offset: 29 }, { name: '新橋', offset: 31 },
], yurikamomeMap);
const yurikamomePatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(7),    intervalMin: 10 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 7 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 7 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 10 },
];

// 京王線（新宿→高幡不動: 0 / 高幡不動→新宿: 1）
const keioMap = buildCoordMap(keioLine);
const keioDir0 = withCoords([
  { name: '新宿', offset: 0 }, { name: '笹塚', offset: 3 }, { name: '代田橋', offset: 5 },
  { name: '明大前', offset: 7 }, { name: '下高井戸', offset: 8 }, { name: '桜上水', offset: 10 },
  { name: '上北沢', offset: 11 }, { name: '八幡山', offset: 12 }, { name: '芦花公園', offset: 13 },
  { name: '千歳烏山', offset: 14 }, { name: '仙川', offset: 16 }, { name: 'つつじヶ丘', offset: 18 },
  { name: '柴崎', offset: 20 }, { name: '国領', offset: 21 }, { name: '布田', offset: 22 },
  { name: '調布', offset: 23 }, { name: '西調布', offset: 25 }, { name: '飛田給', offset: 26 },
  { name: '武蔵野台', offset: 28 }, { name: '多磨霊園', offset: 30 }, { name: '東府中', offset: 32 },
  { name: '府中', offset: 33 }, { name: '分倍河原', offset: 35 }, { name: '中河原', offset: 37 },
  { name: '聖蹟桜ヶ丘', offset: 39 }, { name: '百草園', offset: 41 }, { name: '高幡不動', offset: 43 },
], keioMap);
const keioDir1 = withCoords([
  { name: '高幡不動', offset: 0 }, { name: '百草園', offset: 2 }, { name: '聖蹟桜ヶ丘', offset: 4 },
  { name: '中河原', offset: 6 }, { name: '分倍河原', offset: 8 }, { name: '府中', offset: 10 },
  { name: '東府中', offset: 11 }, { name: '多磨霊園', offset: 13 }, { name: '武蔵野台', offset: 15 },
  { name: '飛田給', offset: 17 }, { name: '西調布', offset: 18 }, { name: '調布', offset: 20 },
  { name: '布田', offset: 21 }, { name: '国領', offset: 22 }, { name: '柴崎', offset: 23 },
  { name: 'つつじヶ丘', offset: 25 }, { name: '仙川', offset: 27 }, { name: '千歳烏山', offset: 29 },
  { name: '芦花公園', offset: 30 }, { name: '八幡山', offset: 31 }, { name: '上北沢', offset: 32 },
  { name: '桜上水', offset: 33 }, { name: '下高井戸', offset: 35 }, { name: '明大前', offset: 36 },
  { name: '代田橋', offset: 38 }, { name: '笹塚', offset: 40 }, { name: '新宿', offset: 43 },
], keioMap);
const keioPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7),    intervalMin: 10 },
  { fromMin: m(7),    toMin: m(9,30), intervalMin: 6 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20,30),intervalMin: 6 },
  { fromMin: m(20,30),toMin: m(24),   intervalMin: 12 },
];

// ── 追加路線データ ──────────────────────────────────────

// 南武線（立川→川崎: 0 / 川崎→立川: 1）
const nanbuMap = buildCoordMap(jrNanbuLine);
const nanbuDir0 = withCoords([
  { name: '立川', offset: 0 }, { name: '西国立', offset: 5 }, { name: '矢川', offset: 7 },
  { name: '谷保', offset: 10 }, { name: '西府', offset: 12 }, { name: '分倍河原', offset: 14 },
  { name: '府中本町', offset: 17 }, { name: '南多摩', offset: 20 }, { name: '矢野口', offset: 22 },
  { name: '稲城長沼', offset: 24 }, { name: '稲田堤', offset: 27 }, { name: '中野島', offset: 30 },
  { name: '登戸', offset: 32 }, { name: '宿河原', offset: 36 }, { name: '久地', offset: 38 },
  { name: '津田山', offset: 40 }, { name: '武蔵溝ノ口', offset: 42 }, { name: '武蔵小杉', offset: 45 },
  { name: '向河原', offset: 47 }, { name: '平間', offset: 49 },
], nanbuMap);
const nanbuDir1 = withCoords([
  { name: '平間', offset: 0 }, { name: '向河原', offset: 2 }, { name: '武蔵小杉', offset: 4 },
  { name: '武蔵溝ノ口', offset: 7 }, { name: '津田山', offset: 9 }, { name: '久地', offset: 11 },
  { name: '宿河原', offset: 13 }, { name: '登戸', offset: 17 }, { name: '中野島', offset: 19 },
  { name: '稲田堤', offset: 22 }, { name: '稲城長沼', offset: 25 }, { name: '矢野口', offset: 27 },
  { name: '南多摩', offset: 29 }, { name: '府中本町', offset: 32 }, { name: '分倍河原', offset: 35 },
  { name: '西府', offset: 37 }, { name: '谷保', offset: 39 }, { name: '矢川', offset: 42 },
  { name: '西国立', offset: 44 }, { name: '立川', offset: 49 },
], nanbuMap);
const nanbuPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 8 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 5 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 5 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 10 },
];

// 根岸線（横浜→大船方面: 0 / 逆: 1）
const negishiMap = buildCoordMap(jrNegishiLine);
const negishiDir0 = withCoords([
  { name: '横浜', offset: 0 }, { name: '桜木町', offset: 3 }, { name: '関内', offset: 5 },
  { name: '石川町', offset: 7 }, { name: '山手', offset: 9 }, { name: '根岸', offset: 12 },
  { name: '磯子', offset: 15 }, { name: '新杉田', offset: 18 }, { name: '洋光台', offset: 21 },
  { name: '港南台', offset: 24 }, { name: '本郷台', offset: 27 },
], negishiMap);
const negishiDir1 = withCoords([
  { name: '本郷台', offset: 0 }, { name: '港南台', offset: 3 }, { name: '洋光台', offset: 6 },
  { name: '新杉田', offset: 9 }, { name: '磯子', offset: 12 }, { name: '根岸', offset: 15 },
  { name: '山手', offset: 18 }, { name: '石川町', offset: 20 }, { name: '関内', offset: 22 },
  { name: '桜木町', offset: 24 }, { name: '横浜', offset: 27 },
], negishiMap);
const negishiPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 7 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 4 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 7 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 10 },
];

// 横浜線（東神奈川→八王子: 0 / 逆: 1）
const yokohamaLineMap = buildCoordMap(jrYokohamaLine);
const yokohamaLineDir0 = withCoords([
  { name: '東神奈川', offset: 0 }, { name: '大口', offset: 3 }, { name: '菊名', offset: 6 },
  { name: '新横浜', offset: 10 }, { name: '小机', offset: 15 }, { name: '鴨居', offset: 18 },
  { name: '中山', offset: 22 }, { name: '十日市場', offset: 25 }, { name: '長津田', offset: 29 },
  { name: '成瀬', offset: 33 }, { name: '町田', offset: 36 }, { name: '古淵', offset: 41 },
  { name: '淵野辺', offset: 45 }, { name: '矢部', offset: 48 }, { name: '相模原', offset: 51 },
  { name: '橋本', offset: 54 }, { name: '相原', offset: 58 }, { name: '八王子みなみ野', offset: 62 },
  { name: '片倉', offset: 66 }, { name: '八王子', offset: 69 },
], yokohamaLineMap);
const yokohamaLineDir1 = withCoords([
  { name: '八王子', offset: 0 }, { name: '片倉', offset: 3 }, { name: '八王子みなみ野', offset: 7 },
  { name: '相原', offset: 11 }, { name: '橋本', offset: 15 }, { name: '相模原', offset: 18 },
  { name: '矢部', offset: 21 }, { name: '淵野辺', offset: 24 }, { name: '古淵', offset: 28 },
  { name: '町田', offset: 33 }, { name: '成瀬', offset: 36 }, { name: '長津田', offset: 40 },
  { name: '十日市場', offset: 44 }, { name: '中山', offset: 47 }, { name: '鴨居', offset: 51 },
  { name: '小机', offset: 54 }, { name: '新横浜', offset: 59 }, { name: '菊名', offset: 63 },
  { name: '大口', offset: 66 }, { name: '東神奈川', offset: 69 },
], yokohamaLineMap);
const yokohamaLinePatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 10 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 6 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 10 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 15 },
];

// 東急目黒線（目黒→日吉: 0 / 逆: 1）
const meguroMap = buildCoordMap(tokyuMeguro);
const meguroDir0 = withCoords([
  { name: '目黒', offset: 0 }, { name: '不動前', offset: 2 }, { name: '武蔵小山', offset: 4 },
  { name: '洗足', offset: 8 }, { name: '大岡山', offset: 10 },
  { name: '奥沢', offset: 12 }, { name: '田園調布', offset: 14 }, { name: '多摩川', offset: 16 },
  { name: '新丸子', offset: 18 }, { name: '武蔵小杉', offset: 20 },
  { name: '元住吉', offset: 22 }, { name: '日吉', offset: 25 },
], meguroMap);
const meguroDir1 = withCoords([
  { name: '日吉', offset: 0 }, { name: '元住吉', offset: 3 }, { name: '武蔵小杉', offset: 5 },
  { name: '新丸子', offset: 7 }, { name: '多摩川', offset: 9 }, { name: '田園調布', offset: 11 },
  { name: '奥沢', offset: 13 }, { name: '大岡山', offset: 15 },
  { name: '洗足', offset: 17 }, { name: '武蔵小山', offset: 21 },
  { name: '不動前', offset: 23 }, { name: '目黒', offset: 25 },
], meguroMap);
const meguroPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 6 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 4 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20,30),intervalMin: 4 },
  { fromMin: m(20,30),toMin: m(24),   intervalMin: 8 },
];

// 西武新宿線（西武新宿→南大塚: 0 / 逆: 1）
const seibuShinjukuMap = buildCoordMap(seibuShinjukuLine);
const seibuShinjukuDir0 = withCoords([
  { name: '西武新宿', offset: 0 }, { name: '高田馬場', offset: 4 }, { name: '下落合', offset: 6 },
  { name: '中井', offset: 8 }, { name: '新井薬師前', offset: 10 }, { name: '沼袋', offset: 12 },
  { name: '野方', offset: 14 }, { name: '都立家政', offset: 16 }, { name: '鷺ノ宮', offset: 18 },
  { name: '下井草', offset: 20 }, { name: '井荻', offset: 22 }, { name: '上石神井', offset: 26 },
  { name: '武蔵関', offset: 28 }, { name: '東伏見', offset: 30 }, { name: '西武柳沢', offset: 32 },
  { name: '田無', offset: 34 }, { name: '花小金井', offset: 36 }, { name: '小平', offset: 39 },
  { name: '東村山', offset: 44 }, { name: '所沢', offset: 46 }, { name: '新所沢', offset: 52 },
  { name: '狭山市', offset: 57 }, { name: '南大塚', offset: 62 },
], seibuShinjukuMap);
const seibuShinjukuDir1 = withCoords([
  { name: '南大塚', offset: 0 }, { name: '狭山市', offset: 5 }, { name: '新所沢', offset: 10 },
  { name: '所沢', offset: 16 }, { name: '東村山', offset: 18 }, { name: '小平', offset: 23 },
  { name: '花小金井', offset: 26 }, { name: '田無', offset: 28 }, { name: '西武柳沢', offset: 30 },
  { name: '東伏見', offset: 32 }, { name: '武蔵関', offset: 34 }, { name: '上石神井', offset: 36 },
  { name: '井荻', offset: 40 }, { name: '下井草', offset: 42 }, { name: '鷺ノ宮', offset: 44 },
  { name: '都立家政', offset: 46 }, { name: '野方', offset: 48 }, { name: '沼袋', offset: 50 },
  { name: '新井薬師前', offset: 52 }, { name: '中井', offset: 54 }, { name: '下落合', offset: 56 },
  { name: '高田馬場', offset: 58 }, { name: '西武新宿', offset: 62 },
], seibuShinjukuMap);
const seibuShinjukuPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 10 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 6 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 10 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 12 },
];

// 東武伊勢崎線（浅草→竹ノ塚: 0 / 逆: 1）
const tobuIsesakiMap = buildCoordMap(tobuIsesakiLine);
const tobuIsesakiDir0 = withCoords([
  { name: '浅草', offset: 0 }, { name: 'とうきょうスカイツリー', offset: 3 },
  { name: '押上', offset: 5 }, { name: '曳舟', offset: 6 }, { name: '東向島', offset: 8 },
  { name: '鐘ヶ淵', offset: 10 }, { name: '堀切', offset: 12 }, { name: '牛田', offset: 14 },
  { name: '北千住', offset: 16 }, { name: '小菅', offset: 18 }, { name: '五反野', offset: 20 },
  { name: '梅島', offset: 22 }, { name: '西新井', offset: 24 }, { name: '竹ノ塚', offset: 26 },
], tobuIsesakiMap);
const tobuIsesakiDir1 = withCoords([
  { name: '竹ノ塚', offset: 0 }, { name: '西新井', offset: 2 }, { name: '梅島', offset: 4 },
  { name: '五反野', offset: 6 }, { name: '小菅', offset: 8 }, { name: '北千住', offset: 10 },
  { name: '牛田', offset: 12 }, { name: '堀切', offset: 14 }, { name: '鐘ヶ淵', offset: 16 },
  { name: '東向島', offset: 18 }, { name: '曳舟', offset: 20 }, { name: '押上', offset: 21 },
  { name: 'とうきょうスカイツリー', offset: 23 }, { name: '浅草', offset: 26 },
], tobuIsesakiMap);
const tobuIsesakiPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 6 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 4 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20,30),intervalMin: 4 },
  { fromMin: m(20,30),toMin: m(24),   intervalMin: 8 },
];

// 相鉄本線（横浜→海老名: 0 / 逆: 1）
const sotetsuMap = buildCoordMap(sotetsuMainLine);
const sotetsuDir0 = withCoords([
  { name: '横浜', offset: 0 }, { name: '平沼橋', offset: 2 }, { name: '西横浜', offset: 4 },
  { name: '天王町', offset: 6 }, { name: '星川', offset: 8 }, { name: '和田町', offset: 10 },
  { name: '上星川', offset: 12 }, { name: '西谷', offset: 14 }, { name: '鶴ヶ峰', offset: 17 },
  { name: '二俣川', offset: 20 }, { name: '希望ヶ丘', offset: 23 }, { name: '三ツ境', offset: 25 },
  { name: '瀬谷', offset: 28 }, { name: '大和', offset: 31 }, { name: 'かしわ台', offset: 38 },
  { name: '海老名', offset: 41 },
], sotetsuMap);
const sotetsuDir1 = withCoords([
  { name: '海老名', offset: 0 }, { name: 'かしわ台', offset: 3 }, { name: '大和', offset: 10 },
  { name: '瀬谷', offset: 13 }, { name: '三ツ境', offset: 16 }, { name: '希望ヶ丘', offset: 18 },
  { name: '二俣川', offset: 21 }, { name: '鶴ヶ峰', offset: 24 }, { name: '西谷', offset: 27 },
  { name: '上星川', offset: 29 }, { name: '和田町', offset: 31 }, { name: '星川', offset: 33 },
  { name: '天王町', offset: 35 }, { name: '西横浜', offset: 37 }, { name: '平沼橋', offset: 39 },
  { name: '横浜', offset: 41 },
], sotetsuMap);
const sotetsuPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 8 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 5 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 5 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 10 },
];

// 東京モノレール（浜松町→羽田: 0 / 逆: 1）
const monorailMap = buildCoordMap(tokyoMonorail);
const monorailDir0 = withCoords([
  { name: 'モノレール浜松町', offset: 0 }, { name: '天王洲アイル', offset: 3 },
  { name: '大井競馬場前', offset: 7 }, { name: '流通センター', offset: 9 },
  { name: '昭和島', offset: 12 }, { name: '整備場', offset: 14 },
  { name: '天空橋', offset: 16 }, { name: '羽田空港第3ターミナル', offset: 19 },
  { name: '羽田空港第1・第2ターミナル', offset: 21 },
], monorailMap);
const monorailDir1 = withCoords([
  { name: '羽田空港第1・第2ターミナル', offset: 0 }, { name: '羽田空港第3ターミナル', offset: 2 },
  { name: '天空橋', offset: 5 }, { name: '整備場', offset: 7 },
  { name: '昭和島', offset: 9 }, { name: '流通センター', offset: 12 },
  { name: '大井競馬場前', offset: 14 }, { name: '天王洲アイル', offset: 18 },
  { name: 'モノレール浜松町', offset: 21 },
], monorailMap);
const monorailPatterns: PatternSimple[] = [
  { fromMin: m(5,20), toMin: m(7,30), intervalMin: 10 },
  { fromMin: m(7,30), toMin: m(9,30), intervalMin: 4 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 10 },
];

// 多摩モノレール（上北台→多摩センター: 0 / 逆: 1）
const tamaMonoMap = buildCoordMap(tamaMonorail);
const tamaMonoDir0 = withCoords([
  { name: '上北台', offset: 0 }, { name: '玉川上水', offset: 4 },
  { name: '泉体育館', offset: 8 }, { name: '立飛', offset: 10 }, { name: '高松', offset: 12 },
  { name: '立川北', offset: 14 }, { name: '立川南', offset: 16 }, { name: '柴崎体育館', offset: 18 },
  { name: '甲州街道', offset: 20 }, { name: '万願寺', offset: 22 }, { name: '高幡不動', offset: 24 },
  { name: '程久保', offset: 26 }, { name: '中央大学・明星大学', offset: 28 },
  { name: '松が谷', offset: 32 }, { name: '多摩センター', offset: 34 },
], tamaMonoMap);
const tamaMonoDir1 = withCoords([
  { name: '多摩センター', offset: 0 }, { name: '松が谷', offset: 2 },
  { name: '中央大学・明星大学', offset: 6 }, { name: '程久保', offset: 8 },
  { name: '高幡不動', offset: 10 }, { name: '万願寺', offset: 12 }, { name: '甲州街道', offset: 14 },
  { name: '柴崎体育館', offset: 16 }, { name: '立川南', offset: 18 }, { name: '立川北', offset: 20 },
  { name: '高松', offset: 22 }, { name: '立飛', offset: 24 }, { name: '泉体育館', offset: 26 },
  { name: '玉川上水', offset: 30 }, { name: '上北台', offset: 34 },
], tamaMonoMap);
const tamaMonoPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(7,30), intervalMin: 10 },
  { fromMin: m(7,30), toMin: m(9,30), intervalMin: 6 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 12 },
];

// 小田急江ノ島線（相模大野→片瀬江ノ島: 0 / 逆: 1）
const odakyuEnoMap = buildCoordMap(odakyuEnoshimaLine);
const odakyuEnoDir0 = withCoords([
  { name: '相模大野', offset: 0 }, { name: '東林間', offset: 2 }, { name: '中央林間', offset: 4 },
  { name: '南林間', offset: 6 }, { name: '鶴間', offset: 8 }, { name: '大和', offset: 10 },
  { name: '桜ヶ丘', offset: 12 }, { name: '高座渋谷', offset: 14 }, { name: '長後', offset: 16 },
  { name: '湘南台', offset: 19 }, { name: '六会日大前', offset: 21 }, { name: '善行', offset: 23 },
  { name: '藤沢本町', offset: 25 }, { name: '藤沢', offset: 27 },
  { name: '本鵠沼', offset: 29 }, { name: '鵠沼海岸', offset: 31 }, { name: '片瀬江ノ島', offset: 33 },
], odakyuEnoMap);
const odakyuEnoDir1 = withCoords([
  { name: '片瀬江ノ島', offset: 0 }, { name: '鵠沼海岸', offset: 2 }, { name: '本鵠沼', offset: 4 },
  { name: '藤沢', offset: 6 }, { name: '藤沢本町', offset: 8 }, { name: '善行', offset: 10 },
  { name: '六会日大前', offset: 12 }, { name: '湘南台', offset: 14 }, { name: '長後', offset: 17 },
  { name: '高座渋谷', offset: 19 }, { name: '桜ヶ丘', offset: 21 }, { name: '大和', offset: 23 },
  { name: '鶴間', offset: 25 }, { name: '南林間', offset: 27 }, { name: '中央林間', offset: 29 },
  { name: '東林間', offset: 31 }, { name: '相模大野', offset: 33 },
], odakyuEnoMap);
const odakyuEnoPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(7,30), intervalMin: 15 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 10 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// 京成本線（京成上野→成田空港: 0 / 逆: 1）
const keiseiMap = buildCoordMap(keiseiMainLine);
const keiseiDir0 = withCoords([
  { name: '京成上野', offset: 0 }, { name: '日暮里', offset: 2 }, { name: '新三河島', offset: 5 },
  { name: '町屋', offset: 7 }, { name: '千住大橋', offset: 9 }, { name: '京成関屋', offset: 11 },
  { name: '堀切菖蒲園', offset: 13 }, { name: 'お花茶屋', offset: 15 }, { name: '青砥', offset: 17 },
  { name: '京成高砂', offset: 20 }, { name: '京成小岩', offset: 24 }, { name: '江戸川', offset: 27 },
  { name: '国府台', offset: 31 }, { name: '市川真間', offset: 34 }, { name: '京成八幡', offset: 38 },
  { name: '東中山', offset: 45 }, { name: '京成西船', offset: 47 }, { name: '京成船橋', offset: 51 },
  { name: '谷津', offset: 59 }, { name: '京成津田沼', offset: 61 }, { name: '八千代台', offset: 70 },
  { name: '勝田台', offset: 77 }, { name: 'ユーカリが丘', offset: 84 },
  { name: '京成佐倉', offset: 89 }, { name: '宗吾参道', offset: 102 },
  { name: '京成成田', offset: 110 }, { name: '成田空港', offset: 116 },
], keiseiMap);
const keiseiDir1 = withCoords([
  { name: '成田空港', offset: 0 }, { name: '京成成田', offset: 6 },
  { name: '宗吾参道', offset: 14 }, { name: '京成佐倉', offset: 27 },
  { name: 'ユーカリが丘', offset: 32 }, { name: '勝田台', offset: 39 },
  { name: '八千代台', offset: 46 }, { name: '京成津田沼', offset: 55 }, { name: '谷津', offset: 57 },
  { name: '京成船橋', offset: 65 }, { name: '京成西船', offset: 69 }, { name: '東中山', offset: 71 },
  { name: '京成八幡', offset: 78 }, { name: '市川真間', offset: 82 }, { name: '国府台', offset: 85 },
  { name: '江戸川', offset: 89 }, { name: '京成小岩', offset: 92 }, { name: '京成高砂', offset: 96 },
  { name: '青砥', offset: 99 }, { name: 'お花茶屋', offset: 101 }, { name: '堀切菖蒲園', offset: 103 },
  { name: '京成関屋', offset: 105 }, { name: '千住大橋', offset: 107 }, { name: '町屋', offset: 109 },
  { name: '新三河島', offset: 111 }, { name: '日暮里', offset: 114 }, { name: '京成上野', offset: 116 },
], keiseiMap);
const keiseiPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 20 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 10 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// 宇都宮線（上野→宇都宮: 0 / 逆: 1）
const utsunomiyaMap = buildCoordMap(jrUtsunomiyaLine);
const utsunomiyaDir0 = withCoords([
  { name: '上野', offset: 0 }, { name: '赤羽', offset: 5 }, { name: '浦和', offset: 11 },
  { name: 'さいたま新都心', offset: 15 }, { name: '大宮', offset: 17 }, { name: '土呂', offset: 21 },
  { name: '東大宮', offset: 24 }, { name: '蓮田', offset: 28 }, { name: '白岡', offset: 32 },
  { name: '新白岡', offset: 36 }, { name: '久喜', offset: 39 }, { name: '東鷲宮', offset: 43 },
  { name: '栗橋', offset: 46 }, { name: '古河', offset: 51 }, { name: '野木', offset: 58 },
  { name: '間々田', offset: 62 }, { name: '小山', offset: 66 }, { name: '小金井', offset: 72 },
  { name: '自治医大', offset: 77 }, { name: '石橋', offset: 81 }, { name: '雀宮', offset: 86 },
  { name: '宇都宮', offset: 91 },
], utsunomiyaMap);
const utsunomiyaDir1 = withCoords([
  { name: '宇都宮', offset: 0 }, { name: '雀宮', offset: 5 }, { name: '石橋', offset: 10 },
  { name: '自治医大', offset: 14 }, { name: '小金井', offset: 19 }, { name: '小山', offset: 25 },
  { name: '間々田', offset: 29 }, { name: '野木', offset: 33 }, { name: '古河', offset: 40 },
  { name: '栗橋', offset: 45 }, { name: '東鷲宮', offset: 48 }, { name: '久喜', offset: 52 },
  { name: '新白岡', offset: 55 }, { name: '白岡', offset: 59 }, { name: '蓮田', offset: 63 },
  { name: '東大宮', offset: 67 }, { name: '土呂', offset: 70 }, { name: '大宮', offset: 74 },
  { name: 'さいたま新都心', offset: 76 }, { name: '浦和', offset: 80 }, { name: '赤羽', offset: 86 },
  { name: '上野', offset: 91 },
], utsunomiyaMap);
const utsunomiyaPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 15 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 10 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// JR八高線（八王子→箱根ヶ崎: 0 / 逆: 1）
const hachikoMap = buildCoordMap(jrHachikoLine);
const hachikoDir0 = withCoords([
  { name: '八王子', offset: 0 }, { name: '北八王子', offset: 2 }, { name: '小宮', offset: 4 },
  { name: '拝島', offset: 6 }, { name: '東福生', offset: 9 }, { name: '箱根ヶ崎', offset: 11 },
], hachikoMap);
const hachikoDir1 = withCoords([
  { name: '箱根ヶ崎', offset: 0 }, { name: '東福生', offset: 2 }, { name: '拝島', offset: 5 },
  { name: '小宮', offset: 7 }, { name: '北八王子', offset: 9 }, { name: '八王子', offset: 11 },
], hachikoMap);
const hachikoPatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(9),    intervalMin: 30 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 30 },
  { fromMin: m(17),   toMin: m(21),   intervalMin: 30 },
];

// JR五日市線（拝島→武蔵五日市: 0 / 逆: 1）
const itsukaichiMap = buildCoordMap(jrItsukaichiLine);
const itsukaichiDir0 = withCoords([
  { name: '拝島', offset: 0 }, { name: '熊川', offset: 3 }, { name: '東秋留', offset: 5 },
  { name: '秋川', offset: 7 }, { name: '武蔵引田', offset: 9 }, { name: '武蔵増戸', offset: 11 },
  { name: '武蔵五日市', offset: 13 },
], itsukaichiMap);
const itsukaichiDir1 = withCoords([
  { name: '武蔵五日市', offset: 0 }, { name: '武蔵増戸', offset: 2 }, { name: '武蔵引田', offset: 4 },
  { name: '秋川', offset: 6 }, { name: '東秋留', offset: 8 }, { name: '熊川', offset: 10 },
  { name: '拝島', offset: 13 },
], itsukaichiMap);
const itsukaichiPatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(9),    intervalMin: 20 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 30 },
  { fromMin: m(17),   toMin: m(21),   intervalMin: 20 },
];

// 埼玉高速鉄道（赤羽岩淵→浦和美園: 0 / 逆: 1）
const saitamaRwMap = buildCoordMap(saitamaRailway);
const saitamaRwDir0 = withCoords([
  { name: '赤羽岩淵', offset: 0 }, { name: '川口元郷', offset: 3 }, { name: '南鳩ヶ谷', offset: 6 },
  { name: '鳩ヶ谷', offset: 9 }, { name: '新井宿', offset: 12 }, { name: '戸塚安行', offset: 15 },
  { name: '東川口', offset: 18 }, { name: '浦和美園', offset: 22 },
], saitamaRwMap);
const saitamaRwDir1 = withCoords([
  { name: '浦和美園', offset: 0 }, { name: '東川口', offset: 4 }, { name: '戸塚安行', offset: 7 },
  { name: '新井宿', offset: 10 }, { name: '鳩ヶ谷', offset: 13 }, { name: '南鳩ヶ谷', offset: 16 },
  { name: '川口元郷', offset: 19 }, { name: '赤羽岩淵', offset: 22 },
], saitamaRwMap);
const saitamaRwPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(8),    intervalMin: 6 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 8 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 10 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 10 },
];

// ニューシャトル（大宮→内宿: 0 / 逆: 1）
const newShuttleMap = buildCoordMap(newShuttle);
const newShuttleDir0 = withCoords([
  { name: '大宮', offset: 0 }, { name: '鉄道博物館', offset: 2 }, { name: '加茂宮', offset: 4 },
  { name: '東宮原', offset: 6 }, { name: '今羽', offset: 8 }, { name: '吉野原', offset: 10 },
  { name: '原市', offset: 12 }, { name: '沼南', offset: 14 }, { name: '丸山', offset: 16 },
  { name: '志久', offset: 18 }, { name: '伊奈中央', offset: 20 }, { name: '羽貫', offset: 22 },
  { name: '内宿', offset: 24 },
], newShuttleMap);
const newShuttleDir1 = withCoords([
  { name: '内宿', offset: 0 }, { name: '羽貫', offset: 2 }, { name: '伊奈中央', offset: 4 },
  { name: '志久', offset: 6 }, { name: '丸山', offset: 8 }, { name: '沼南', offset: 10 },
  { name: '原市', offset: 12 }, { name: '吉野原', offset: 14 }, { name: '今羽', offset: 16 },
  { name: '東宮原', offset: 18 }, { name: '加茂宮', offset: 20 }, { name: '鉄道博物館', offset: 22 },
  { name: '大宮', offset: 24 },
], newShuttleMap);
const newShuttlePatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(8),    intervalMin: 6 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 8 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 10 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 12 },
];

// 京成押上線（押上→青砥: 0 / 逆: 1）
const oshiageMap = buildCoordMap(keiseiOshiageLine);
const oshiageDir0 = withCoords([
  { name: '押上', offset: 0 }, { name: '京成曳舟', offset: 2 }, { name: '八広', offset: 4 },
  { name: '四ツ木', offset: 6 }, { name: '立石', offset: 8 }, { name: '青砥', offset: 11 },
], oshiageMap);
const oshiageDir1 = withCoords([
  { name: '青砥', offset: 0 }, { name: '立石', offset: 3 }, { name: '四ツ木', offset: 5 },
  { name: '八広', offset: 7 }, { name: '京成曳舟', offset: 9 }, { name: '押上', offset: 11 },
], oshiageMap);
const oshiagePatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(8),    intervalMin: 6 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 4 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 8 },
];

// 北総線（京成高砂→印旛日本医大: 0 / 逆: 1）
const hokusouMap = buildCoordMap(hokusouLine);
const hokusouDir0 = withCoords([
  { name: '京成高砂', offset: 0 }, { name: '新柴又', offset: 4 }, { name: '矢切', offset: 7 },
  { name: '北国分', offset: 10 }, { name: '秋山', offset: 13 }, { name: '東松戸', offset: 16 },
  { name: '松飛台', offset: 19 }, { name: '大町', offset: 22 }, { name: '新鎌ヶ谷', offset: 25 },
  { name: '西白井', offset: 29 }, { name: '白井', offset: 33 }, { name: '小室', offset: 37 },
  { name: '千葉ニュータウン中央', offset: 41 }, { name: '印西牧の原', offset: 46 },
  { name: '印旛日本医大', offset: 51 },
], hokusouMap);
const hokusouDir1 = withCoords([
  { name: '印旛日本医大', offset: 0 }, { name: '印西牧の原', offset: 5 },
  { name: '千葉ニュータウン中央', offset: 10 }, { name: '小室', offset: 14 },
  { name: '白井', offset: 18 }, { name: '西白井', offset: 22 }, { name: '新鎌ヶ谷', offset: 26 },
  { name: '大町', offset: 29 }, { name: '松飛台', offset: 32 }, { name: '東松戸', offset: 35 },
  { name: '秋山', offset: 38 }, { name: '北国分', offset: 41 }, { name: '矢切', offset: 44 },
  { name: '新柴又', offset: 47 }, { name: '京成高砂', offset: 51 },
], hokusouMap);
const hokusouPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(8),    intervalMin: 12 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 10 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// 京急空港線（京急蒲田→羽田空港: 0 / 逆: 1）
const kqAirportMap = buildCoordMap(keikyuAirportLine);
const kqAirportDir0 = withCoords([
  { name: '京急蒲田', offset: 0 }, { name: '糀谷', offset: 2 }, { name: '大鳥居', offset: 4 },
  { name: '穴守稲荷', offset: 6 }, { name: '天空橋', offset: 8 },
  { name: '羽田空港第3ターミナル', offset: 11 }, { name: '羽田空港第1・第2ターミナル', offset: 13 },
], kqAirportMap);
const kqAirportDir1 = withCoords([
  { name: '羽田空港第1・第2ターミナル', offset: 0 }, { name: '羽田空港第3ターミナル', offset: 2 },
  { name: '天空橋', offset: 5 }, { name: '穴守稲荷', offset: 7 }, { name: '大鳥居', offset: 9 },
  { name: '糀谷', offset: 11 }, { name: '京急蒲田', offset: 13 },
], kqAirportMap);
const kqAirportPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(8),    intervalMin: 8 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 5 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 5 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 10 },
];

// 京急久里浜線（堀ノ内→三崎口: 0 / 逆: 1）
const kqKurihamaMap = buildCoordMap(keikyuKurihamaLine);
const kqKurihamaDir0 = withCoords([
  { name: '堀ノ内', offset: 0 }, { name: '新大津', offset: 2 }, { name: '北久里浜', offset: 4 },
  { name: '京急久里浜', offset: 7 }, { name: 'YRP野比', offset: 10 }, { name: '京急長沢', offset: 13 },
  { name: '津久井浜', offset: 15 }, { name: '三浦海岸', offset: 18 }, { name: '三崎口', offset: 21 },
], kqKurihamaMap);
const kqKurihamaDir1 = withCoords([
  { name: '三崎口', offset: 0 }, { name: '三浦海岸', offset: 3 }, { name: '津久井浜', offset: 6 },
  { name: '京急長沢', offset: 8 }, { name: 'YRP野比', offset: 11 }, { name: '京急久里浜', offset: 14 },
  { name: '北久里浜', offset: 17 }, { name: '新大津', offset: 19 }, { name: '堀ノ内', offset: 21 },
], kqKurihamaMap);
const kqKurihamaPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(8),    intervalMin: 15 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 10 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// 新京成電鉄（松戸→京成津田沼: 0 / 逆: 1）手動オフセット
const shinkeiseiMap = buildCoordMap(shinkeisei);
const shinkeiseiDir0 = withCoords([
  { name: '松戸', offset: 0 }, { name: '上本郷', offset: 2 }, { name: '松戸新田', offset: 4 },
  { name: 'みのり台', offset: 6 }, { name: '八柱', offset: 8 }, { name: '常盤平', offset: 10 },
  { name: '五香', offset: 13 }, { name: '元山', offset: 15 }, { name: 'くぬぎ山', offset: 17 },
  { name: '北初富', offset: 19 }, { name: '新鎌ヶ谷', offset: 22 }, { name: '初富', offset: 25 },
  { name: '鎌ヶ谷大仏', offset: 28 }, { name: '二和向台', offset: 31 }, { name: '三咲', offset: 34 },
  { name: '滝不動', offset: 36 }, { name: '高根木戸', offset: 38 }, { name: '高根公団', offset: 40 },
  { name: '北習志野', offset: 42 }, { name: '習志野', offset: 44 }, { name: '薬園台', offset: 46 },
  { name: '前原', offset: 48 }, { name: '新津田沼', offset: 51 }, { name: '京成津田沼', offset: 53 },
], shinkeiseiMap);
const shinkeiseiDir1 = withCoords([
  { name: '京成津田沼', offset: 0 }, { name: '新津田沼', offset: 2 }, { name: '前原', offset: 5 },
  { name: '薬園台', offset: 7 }, { name: '習志野', offset: 9 }, { name: '北習志野', offset: 11 },
  { name: '高根公団', offset: 13 }, { name: '高根木戸', offset: 15 }, { name: '滝不動', offset: 17 },
  { name: '三咲', offset: 19 }, { name: '二和向台', offset: 22 }, { name: '鎌ヶ谷大仏', offset: 25 },
  { name: '初富', offset: 28 }, { name: '新鎌ヶ谷', offset: 31 }, { name: '北初富', offset: 34 },
  { name: 'くぬぎ山', offset: 36 }, { name: '元山', offset: 38 }, { name: '五香', offset: 40 },
  { name: '常盤平', offset: 43 }, { name: '八柱', offset: 45 }, { name: 'みのり台', offset: 47 },
  { name: '松戸新田', offset: 49 }, { name: '上本郷', offset: 51 }, { name: '松戸', offset: 53 },
], shinkeiseiMap);
const shinkeiseiPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(8),    intervalMin: 8 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 6 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 10 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 12 },
];

// 東葉高速鉄道（西船橋→東葉勝田台: 0 / 逆: 1）手動オフセット
const toyoRapidMap = buildCoordMap(toyoRapid);
const toyoRapidDir0 = withCoords([
  { name: '西船橋', offset: 0 }, { name: '東海神', offset: 4 }, { name: '飯山満', offset: 8 },
  { name: '北習志野', offset: 12 }, { name: '船橋日大前', offset: 16 }, { name: '八千代緑が丘', offset: 21 },
  { name: '八千代中央', offset: 25 }, { name: '村上', offset: 29 }, { name: '東葉勝田台', offset: 32 },
], toyoRapidMap);
const toyoRapidDir1 = withCoords([
  { name: '東葉勝田台', offset: 0 }, { name: '村上', offset: 3 }, { name: '八千代中央', offset: 7 },
  { name: '八千代緑が丘', offset: 11 }, { name: '船橋日大前', offset: 16 }, { name: '北習志野', offset: 20 },
  { name: '飯山満', offset: 24 }, { name: '東海神', offset: 28 }, { name: '西船橋', offset: 32 },
], toyoRapidMap);
const toyoRapidPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(8),    intervalMin: 8 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 5 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 5 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 12 },
];

// 相鉄いずみ野線（二俣川→湘南台: 0 / 逆: 1）
const sotetsuIzuminoMap = buildCoordMap(sotetsuIzumino);
const sotetsuIzuminoDir0 = withCoords([
  { name: '二俣川', offset: 0 }, { name: '南万騎が原', offset: 3 }, { name: '緑園都市', offset: 5 },
  { name: '弥生台', offset: 8 }, { name: 'いずみ野', offset: 10 }, { name: 'いずみ中央', offset: 12 },
  { name: 'ゆめが丘', offset: 14 }, { name: '湘南台', offset: 17 },
], sotetsuIzuminoMap);
const sotetsuIzuminoDir1 = withCoords([
  { name: '湘南台', offset: 0 }, { name: 'ゆめが丘', offset: 3 }, { name: 'いずみ中央', offset: 5 },
  { name: 'いずみ野', offset: 7 }, { name: '弥生台', offset: 9 }, { name: '緑園都市', offset: 12 },
  { name: '南万騎が原', offset: 14 }, { name: '二俣川', offset: 17 },
], sotetsuIzuminoMap);
const sotetsuIzuminoPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(8),    intervalMin: 10 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 6 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 10 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 15 },
];

// 相鉄JR直通線（海老名→新宿: 0 / 逆: 1）
const sotetsuJRMap = buildCoordMap(sotetsuJRLine);
const sotetsuJRDir0 = withCoords([
  { name: '海老名', offset: 0 }, { name: 'かしわ台', offset: 3 }, { name: 'さがみ野', offset: 5 },
  { name: '相模大塚', offset: 8 }, { name: '大和', offset: 11 }, { name: '瀬谷', offset: 14 },
  { name: '三ツ境', offset: 17 }, { name: '希望ヶ丘', offset: 20 }, { name: '二俣川', offset: 23 },
  { name: '西谷', offset: 26 }, { name: '羽沢横浜国大', offset: 30 }, { name: '武蔵小杉', offset: 38 },
  { name: '西大井', offset: 46 }, { name: '大崎', offset: 51 }, { name: '恵比寿', offset: 55 },
  { name: '渋谷', offset: 58 }, { name: '新宿', offset: 62 },
], sotetsuJRMap);
const sotetsuJRDir1 = withCoords([
  { name: '新宿', offset: 0 }, { name: '渋谷', offset: 4 }, { name: '恵比寿', offset: 7 },
  { name: '大崎', offset: 11 }, { name: '西大井', offset: 16 }, { name: '武蔵小杉', offset: 24 },
  { name: '羽沢横浜国大', offset: 32 }, { name: '西谷', offset: 36 }, { name: '二俣川', offset: 39 },
  { name: '希望ヶ丘', offset: 42 }, { name: '三ツ境', offset: 45 }, { name: '瀬谷', offset: 48 },
  { name: '大和', offset: 51 }, { name: '相模大塚', offset: 54 }, { name: 'さがみ野', offset: 57 },
  { name: 'かしわ台', offset: 59 }, { name: '海老名', offset: 62 },
], sotetsuJRMap);
const sotetsuJRPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(8),    intervalMin: 15 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 10 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// 湘南モノレール（大船→湘南江の島: 0 / 逆: 1）
const shonanMonoMap = buildCoordMap(shonanMonorail);
const shonanMonoDir0 = withCoords([
  { name: '大船', offset: 0 }, { name: '富士見町', offset: 2 }, { name: '湘南町屋', offset: 4 },
  { name: '湘南深沢', offset: 6 }, { name: '西鎌倉', offset: 8 }, { name: '片瀬山', offset: 10 },
  { name: '目白山下', offset: 12 }, { name: '湘南江の島', offset: 14 },
], shonanMonoMap);
const shonanMonoDir1 = withCoords([
  { name: '湘南江の島', offset: 0 }, { name: '目白山下', offset: 2 }, { name: '片瀬山', offset: 4 },
  { name: '西鎌倉', offset: 6 }, { name: '湘南深沢', offset: 8 }, { name: '湘南町屋', offset: 10 },
  { name: '富士見町', offset: 12 }, { name: '大船', offset: 14 },
], shonanMonoMap);
const shonanMonoPatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(9),    intervalMin: 8 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 10 },
  { fromMin: m(17),   toMin: m(21),   intervalMin: 8 },
  { fromMin: m(21),   toMin: m(24),   intervalMin: 15 },
];

// 小田急多摩線（新百合ヶ丘→唐木田: 0 / 逆: 1）
const odakyuTamaMap = buildCoordMap(odakyuTamaLine);
const odakyuTamaDir0 = withCoords([
  { name: '新百合ヶ丘', offset: 0 }, { name: '五月台', offset: 3 }, { name: '栗平', offset: 5 },
  { name: '黒川', offset: 7 }, { name: 'はるひ野', offset: 8 }, { name: '小田急永山', offset: 10 },
  { name: '小田急多摩センター', offset: 13 }, { name: '唐木田', offset: 15 },
], odakyuTamaMap);
const odakyuTamaDir1 = withCoords([
  { name: '唐木田', offset: 0 }, { name: '小田急多摩センター', offset: 2 }, { name: '小田急永山', offset: 5 },
  { name: 'はるひ野', offset: 7 }, { name: '黒川', offset: 8 }, { name: '栗平', offset: 10 },
  { name: '五月台', offset: 12 }, { name: '新百合ヶ丘', offset: 15 },
], odakyuTamaMap);
const odakyuTamaPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(8),    intervalMin: 10 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 8 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 12 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 8 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 15 },
];

// 東武日光線（東武動物公園→東武日光: 0 / 逆: 1）
const tobuNikkoMap = buildCoordMap(tobuNikkoLine);
const tobuNikkoDir0 = withCoords([
  { name: '東武動物公園', offset: 0 }, { name: '杉戸高野台', offset: 3 }, { name: '幸手', offset: 6 },
  { name: '南栗橋', offset: 10 }, { name: '栗橋', offset: 14 }, { name: '新古河', offset: 18 },
  { name: '柳生', offset: 22 }, { name: '板倉東洋大前', offset: 26 }, { name: '藤岡', offset: 31 },
  { name: '静和', offset: 35 }, { name: '新大平下', offset: 39 }, { name: '栃木', offset: 43 },
  { name: '新栃木', offset: 47 }, { name: '合戦場', offset: 51 }, { name: '家中', offset: 54 },
  { name: '東武金崎', offset: 58 }, { name: '楡木', offset: 63 }, { name: '樅山', offset: 67 },
  { name: '新鹿沼', offset: 70 }, { name: '北鹿沼', offset: 74 }, { name: '板荷', offset: 78 },
  { name: '下小代', offset: 83 }, { name: '明神', offset: 87 }, { name: '下今市', offset: 90 },
  { name: '上今市', offset: 94 }, { name: '東武日光', offset: 97 },
], tobuNikkoMap);
const tobuNikkoDir1 = withCoords([
  { name: '東武日光', offset: 0 }, { name: '上今市', offset: 3 }, { name: '下今市', offset: 7 },
  { name: '明神', offset: 10 }, { name: '下小代', offset: 14 }, { name: '板荷', offset: 19 },
  { name: '北鹿沼', offset: 23 }, { name: '新鹿沼', offset: 27 }, { name: '樅山', offset: 30 },
  { name: '楡木', offset: 34 }, { name: '東武金崎', offset: 39 }, { name: '家中', offset: 43 },
  { name: '合戦場', offset: 46 }, { name: '新栃木', offset: 50 }, { name: '栃木', offset: 54 },
  { name: '新大平下', offset: 58 }, { name: '静和', offset: 62 }, { name: '藤岡', offset: 66 },
  { name: '板倉東洋大前', offset: 71 }, { name: '柳生', offset: 75 }, { name: '新古河', offset: 79 },
  { name: '栗橋', offset: 83 }, { name: '南栗橋', offset: 87 }, { name: '幸手', offset: 91 },
  { name: '杉戸高野台', offset: 94 }, { name: '東武動物公園', offset: 97 },
], tobuNikkoMap);
const tobuNikkoPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(8),    intervalMin: 20 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 15 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 20 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 15 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 30 },
];

// 東武亀戸線（曳舟→亀戸: 0 / 逆: 1）
const kameidoMap = buildCoordMap(tobuKameidoLine);
const kameidoDir0 = withCoords([
  { name: '曳舟', offset: 0 }, { name: '小村井', offset: 2 }, { name: '東あずま', offset: 4 },
  { name: '亀戸水神', offset: 6 }, { name: '亀戸', offset: 8 },
], kameidoMap);
const kameidoDir1 = withCoords([
  { name: '亀戸', offset: 0 }, { name: '亀戸水神', offset: 2 }, { name: '東あずま', offset: 4 },
  { name: '小村井', offset: 6 }, { name: '曳舟', offset: 8 },
], kameidoMap);
const kameidoPatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(9),    intervalMin: 10 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 12 },
  { fromMin: m(17),   toMin: m(21),   intervalMin: 10 },
  { fromMin: m(21),   toMin: m(24),   intervalMin: 15 },
];

// JR総武線千葉方面（西船橋→佐倉: 0 / 逆: 1）手動オフセット
const sobuChibaMap = buildCoordMap(jrSobuChiba);
const sobuChibaDir0 = withCoords([
  { name: '西船橋', offset: 0 }, { name: '船橋', offset: 3 }, { name: '東船橋', offset: 5 },
  { name: '津田沼', offset: 8 }, { name: '幕張本郷', offset: 11 }, { name: '幕張', offset: 13 },
  { name: '新検見川', offset: 15 }, { name: '稲毛', offset: 17 }, { name: '西千葉', offset: 19 },
  { name: '千葉', offset: 21 }, { name: '東千葉', offset: 24 }, { name: '都賀', offset: 28 },
  { name: '四街道', offset: 33 }, { name: '物井', offset: 37 }, { name: '佐倉', offset: 41 },
], sobuChibaMap);
const sobuChibaDir1 = withCoords([
  { name: '佐倉', offset: 0 }, { name: '物井', offset: 4 }, { name: '四街道', offset: 8 },
  { name: '都賀', offset: 13 }, { name: '東千葉', offset: 17 }, { name: '千葉', offset: 20 },
  { name: '西千葉', offset: 22 }, { name: '稲毛', offset: 24 }, { name: '新検見川', offset: 26 },
  { name: '幕張', offset: 28 }, { name: '幕張本郷', offset: 30 }, { name: '津田沼', offset: 33 },
  { name: '東船橋', offset: 36 }, { name: '船橋', offset: 38 }, { name: '西船橋', offset: 41 },
], sobuChibaMap);
const sobuChibaPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(8),    intervalMin: 10 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 6 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 10 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 15 },
];

// 東急多摩川線（多摩川→蒲田: 0 / 逆: 1）手動オフセット
const tamagawaMap = buildCoordMap(tokyuTamagawa);
const tamagawaDir0 = withCoords([
  { name: '多摩川', offset: 0 }, { name: '沼部', offset: 2 }, { name: '鵜の木', offset: 4 },
  { name: '下丸子', offset: 6 }, { name: '武蔵新田', offset: 8 }, { name: '矢口渡', offset: 10 },
  { name: '蒲田', offset: 12 },
], tamagawaMap);
const tamagawaDir1 = withCoords([
  { name: '蒲田', offset: 0 }, { name: '矢口渡', offset: 2 }, { name: '武蔵新田', offset: 4 },
  { name: '下丸子', offset: 6 }, { name: '鵜の木', offset: 8 }, { name: '沼部', offset: 10 },
  { name: '多摩川', offset: 12 },
], tamagawaMap);
const tamagawaPatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(9),    intervalMin: 6 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 7 },
  { fromMin: m(17),   toMin: m(21),   intervalMin: 6 },
  { fromMin: m(21),   toMin: m(24),   intervalMin: 10 },
];

// 東急池上線（五反田→蒲田: 0 / 逆: 1）手動オフセット
const ikegamiMap = buildCoordMap(tokyuIkegami);
const ikegamiDir0 = withCoords([
  { name: '五反田', offset: 0 }, { name: '大崎広小路', offset: 2 }, { name: '戸越銀座', offset: 4 },
  { name: '荏原中延', offset: 6 }, { name: '旗の台', offset: 8 }, { name: '長原', offset: 10 },
  { name: '洗足池', offset: 13 }, { name: '石川台', offset: 15 }, { name: '雪が谷大塚', offset: 17 },
  { name: '御嶽山', offset: 19 }, { name: '久が原', offset: 21 }, { name: '千鳥町', offset: 23 },
  { name: '池上', offset: 25 }, { name: '蓮沼', offset: 27 }, { name: '蒲田', offset: 29 },
], ikegamiMap);
const ikegamiDir1 = withCoords([
  { name: '蒲田', offset: 0 }, { name: '蓮沼', offset: 2 }, { name: '池上', offset: 4 },
  { name: '千鳥町', offset: 6 }, { name: '久が原', offset: 8 }, { name: '御嶽山', offset: 10 },
  { name: '雪が谷大塚', offset: 12 }, { name: '石川台', offset: 14 }, { name: '洗足池', offset: 16 },
  { name: '長原', offset: 19 }, { name: '旗の台', offset: 21 }, { name: '荏原中延', offset: 23 },
  { name: '戸越銀座', offset: 25 }, { name: '大崎広小路', offset: 27 }, { name: '五反田', offset: 29 },
], ikegamiMap);
const ikegamiPatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(9),    intervalMin: 5 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 7 },
  { fromMin: m(17),   toMin: m(21),   intervalMin: 5 },
  { fromMin: m(21),   toMin: m(24),   intervalMin: 10 },
];

// 武蔵野線（府中本町→新木場: 0 / 逆: 1）
const musashinoMap = buildCoordMap(jrMusashinoLine);
const musashinoDir0 = withCoords([
  { name: '府中本町', offset: 0 }, { name: '北府中', offset: 3 }, { name: '西国分寺', offset: 5 },
  { name: '新小平', offset: 9 }, { name: '新秋津', offset: 12 }, { name: '東所沢', offset: 16 },
  { name: '新座', offset: 21 }, { name: '北朝霞', offset: 25 }, { name: '西浦和', offset: 28 },
  { name: '武蔵浦和', offset: 32 }, { name: '南浦和', offset: 35 }, { name: '東浦和', offset: 39 },
  { name: '東川口', offset: 42 }, { name: '南越谷', offset: 46 }, { name: '越谷レイクタウン', offset: 49 },
  { name: '吉川美南', offset: 53 }, { name: '新三郷', offset: 56 }, { name: '三郷', offset: 61 },
  { name: '南流山', offset: 65 }, { name: '新松戸', offset: 68 }, { name: '新八柱', offset: 72 },
  { name: '東松戸', offset: 75 }, { name: '市川大野', offset: 79 }, { name: '船橋法典', offset: 82 },
  { name: '西船橋', offset: 86 }, { name: '市川塩浜', offset: 91 }, { name: '新木場', offset: 95 },
], musashinoMap);
const musashinoDir1 = withCoords([
  { name: '新木場', offset: 0 }, { name: '市川塩浜', offset: 4 }, { name: '西船橋', offset: 9 },
  { name: '船橋法典', offset: 13 }, { name: '市川大野', offset: 16 }, { name: '東松戸', offset: 20 },
  { name: '新八柱', offset: 23 }, { name: '新松戸', offset: 27 }, { name: '南流山', offset: 30 },
  { name: '三郷', offset: 34 }, { name: '新三郷', offset: 39 }, { name: '吉川美南', offset: 42 },
  { name: '越谷レイクタウン', offset: 46 }, { name: '南越谷', offset: 49 }, { name: '東川口', offset: 53 },
  { name: '東浦和', offset: 56 }, { name: '南浦和', offset: 60 }, { name: '武蔵浦和', offset: 63 },
  { name: '西浦和', offset: 67 }, { name: '北朝霞', offset: 70 }, { name: '新座', offset: 74 },
  { name: '東所沢', offset: 79 }, { name: '新秋津', offset: 83 }, { name: '新小平', offset: 86 },
  { name: '西国分寺', offset: 90 }, { name: '北府中', offset: 92 }, { name: '府中本町', offset: 95 },
], musashinoMap);
const musashinoPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 15 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 8 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 8 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// 横浜市営地下鉄ブルーライン（湘南台→あざみ野: 0 / 逆: 1）
const yokohamaBlueMap = buildCoordMap(yokohamaBlueLine);
const yokohamaBlueDir0 = withCoords([
  { name: '湘南台', offset: 0 }, { name: '下飯田', offset: 5 }, { name: '立場', offset: 8 },
  { name: '中田', offset: 12 }, { name: '踊場', offset: 15 }, { name: '戸塚', offset: 18 },
  { name: '舞岡', offset: 22 }, { name: '港南中央', offset: 26 }, { name: '上永谷', offset: 29 },
  { name: '上大岡', offset: 32 }, { name: '弘明寺', offset: 36 }, { name: '蒔田', offset: 39 },
  { name: '吉野町', offset: 41 }, { name: '阪東橋', offset: 44 }, { name: '伊勢佐木長者町', offset: 46 },
  { name: '関内', offset: 48 }, { name: '桜木町', offset: 50 }, { name: '高島町', offset: 53 },
  { name: '横浜', offset: 55 }, { name: '三ツ沢下町', offset: 59 }, { name: '三ツ沢上町', offset: 62 },
  { name: '片倉町', offset: 65 }, { name: '岸根公園', offset: 68 }, { name: '新横浜', offset: 71 },
  { name: '北新横浜', offset: 75 }, { name: '新羽', offset: 78 }, { name: '仲町台', offset: 82 },
  { name: 'センター南', offset: 85 }, { name: 'センター北', offset: 88 }, { name: '中川', offset: 92 },
  { name: 'あざみ野', offset: 95 },
], yokohamaBlueMap);
const yokohamaBlueDir1 = withCoords([
  { name: 'あざみ野', offset: 0 }, { name: '中川', offset: 3 }, { name: 'センター北', offset: 7 },
  { name: 'センター南', offset: 10 }, { name: '仲町台', offset: 13 }, { name: '新羽', offset: 17 },
  { name: '北新横浜', offset: 20 }, { name: '新横浜', offset: 24 }, { name: '岸根公園', offset: 27 },
  { name: '片倉町', offset: 30 }, { name: '三ツ沢上町', offset: 33 }, { name: '三ツ沢下町', offset: 36 },
  { name: '横浜', offset: 40 }, { name: '高島町', offset: 42 }, { name: '桜木町', offset: 45 },
  { name: '関内', offset: 47 }, { name: '伊勢佐木長者町', offset: 49 }, { name: '阪東橋', offset: 51 },
  { name: '吉野町', offset: 54 }, { name: '蒔田', offset: 56 }, { name: '弘明寺', offset: 59 },
  { name: '上大岡', offset: 63 }, { name: '上永谷', offset: 66 }, { name: '港南中央', offset: 69 },
  { name: '舞岡', offset: 73 }, { name: '戸塚', offset: 77 }, { name: '踊場', offset: 80 },
  { name: '中田', offset: 83 }, { name: '立場', offset: 87 }, { name: '下飯田', offset: 90 },
  { name: '湘南台', offset: 95 },
], yokohamaBlueMap);
const yokohamaBluePatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(7,30), intervalMin: 10 },
  { fromMin: m(7,30), toMin: m(9,30), intervalMin: 5 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 5 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 10 },
];

// 高崎線（東京→高崎: 0 / 逆: 1）
const takasakiMap = buildCoordMap(jrTakasakiLine);
const takasakiDir0 = withCoords([
  { name: '東京', offset: 0 }, { name: '上野', offset: 3 }, { name: '尾久', offset: 6 },
  { name: '赤羽', offset: 8 }, { name: '浦和', offset: 12 }, { name: 'さいたま新都心', offset: 16 },
  { name: '大宮', offset: 18 }, { name: '宮原', offset: 22 }, { name: '上尾', offset: 24 },
  { name: '桶川', offset: 27 }, { name: '北本', offset: 30 }, { name: '鴻巣', offset: 33 },
  { name: '熊谷', offset: 36 }, { name: '深谷', offset: 43 }, { name: '本庄', offset: 49 },
  { name: '新町', offset: 54 }, { name: '倉賀野', offset: 58 }, { name: '高崎', offset: 62 },
], takasakiMap);
const takasakiDir1 = withCoords([
  { name: '高崎', offset: 0 }, { name: '倉賀野', offset: 4 }, { name: '新町', offset: 8 },
  { name: '本庄', offset: 13 }, { name: '深谷', offset: 19 }, { name: '熊谷', offset: 26 },
  { name: '鴻巣', offset: 29 }, { name: '北本', offset: 32 }, { name: '桶川', offset: 35 },
  { name: '上尾', offset: 38 }, { name: '宮原', offset: 40 }, { name: '大宮', offset: 44 },
  { name: 'さいたま新都心', offset: 46 }, { name: '浦和', offset: 50 }, { name: '赤羽', offset: 54 },
  { name: '尾久', offset: 56 }, { name: '上野', offset: 59 }, { name: '東京', offset: 62 },
], takasakiMap);
const takasakiPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 15 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 10 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// 京葉線（東京→蘇我: 0 / 逆: 1）
const keiyoMap = buildCoordMap(jrKeiyo);
const keiyoDir0 = withCoords([
  { name: '東京', offset: 0 }, { name: '八丁堀', offset: 2 }, { name: '越中島', offset: 4 },
  { name: '潮見', offset: 6 }, { name: '新木場', offset: 8 }, { name: '葛西臨海公園', offset: 11 },
  { name: '舞浜', offset: 13 }, { name: '新浦安', offset: 16 }, { name: '市川塩浜', offset: 19 },
  { name: '二俣新町', offset: 23 }, { name: '南船橋', offset: 26 }, { name: '新習志野', offset: 29 },
  { name: '海浜幕張', offset: 32 }, { name: '検見川浜', offset: 34 }, { name: '稲毛海岸', offset: 36 },
  { name: '千葉みなと', offset: 39 }, { name: '蘇我', offset: 42 },
], keiyoMap);
const keiyoDir1 = withCoords([
  { name: '蘇我', offset: 0 }, { name: '千葉みなと', offset: 3 }, { name: '稲毛海岸', offset: 6 },
  { name: '検見川浜', offset: 8 }, { name: '海浜幕張', offset: 10 }, { name: '新習志野', offset: 13 },
  { name: '南船橋', offset: 16 }, { name: '二俣新町', offset: 19 }, { name: '市川塩浜', offset: 23 },
  { name: '新浦安', offset: 26 }, { name: '舞浜', offset: 29 }, { name: '葛西臨海公園', offset: 31 },
  { name: '新木場', offset: 34 }, { name: '潮見', offset: 36 }, { name: '越中島', offset: 38 },
  { name: '八丁堀', offset: 40 }, { name: '東京', offset: 42 },
], keiyoMap);
const keiyoPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 12 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 6 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 12 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 15 },
];

// 横浜市営地下鉄グリーンライン（中山→日吉: 0 / 逆: 1）
const yokohamaGreenMap = buildCoordMap(yokohamaGreenLine);
const yokohamaGreenDir0 = withCoords([
  { name: '中山', offset: 0 }, { name: '川和町', offset: 3 }, { name: '都筑ふれあいの丘', offset: 6 },
  { name: 'センター南', offset: 8 }, { name: 'センター北', offset: 10 }, { name: '北山田', offset: 13 },
  { name: '東山田', offset: 15 }, { name: '高田', offset: 18 }, { name: '日吉本町', offset: 20 },
  { name: '日吉', offset: 22 },
], yokohamaGreenMap);
const yokohamaGreenDir1 = withCoords([
  { name: '日吉', offset: 0 }, { name: '日吉本町', offset: 2 }, { name: '高田', offset: 4 },
  { name: '東山田', offset: 7 }, { name: '北山田', offset: 9 }, { name: 'センター北', offset: 12 },
  { name: 'センター南', offset: 14 }, { name: '都筑ふれあいの丘', offset: 16 },
  { name: '川和町', offset: 19 }, { name: '中山', offset: 22 },
], yokohamaGreenMap);
const yokohamaGreenPatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(7,30), intervalMin: 8 },
  { fromMin: m(7,30), toMin: m(9,30), intervalMin: 5 },
  { fromMin: m(9,30), toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 5 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 10 },
];

// 江ノ島電鉄（藤沢→鎌倉: 0 / 逆: 1）
const enoshimaMap = buildCoordMap(enoshimaElectricRailway);
const enoshimaDir0 = withCoords([
  { name: '藤沢', offset: 0 }, { name: '石上', offset: 2 }, { name: '柳小路', offset: 4 },
  { name: '鵠沼', offset: 6 }, { name: '湘南海岸公園', offset: 8 }, { name: '江ノ島', offset: 10 },
  { name: '腰越', offset: 12 }, { name: '鎌倉高校前', offset: 14 }, { name: '七里ヶ浜', offset: 16 },
  { name: '稲村ヶ崎', offset: 18 }, { name: '極楽寺', offset: 20 }, { name: '長谷', offset: 22 },
  { name: '由比ヶ浜', offset: 24 }, { name: '和田塚', offset: 26 }, { name: '鎌倉', offset: 28 },
], enoshimaMap);
const enoshimaDir1 = withCoords([
  { name: '鎌倉', offset: 0 }, { name: '和田塚', offset: 2 }, { name: '由比ヶ浜', offset: 4 },
  { name: '長谷', offset: 6 }, { name: '極楽寺', offset: 8 }, { name: '稲村ヶ崎', offset: 10 },
  { name: '七里ヶ浜', offset: 12 }, { name: '鎌倉高校前', offset: 14 }, { name: '腰越', offset: 16 },
  { name: '江ノ島', offset: 18 }, { name: '湘南海岸公園', offset: 20 }, { name: '鵠沼', offset: 22 },
  { name: '柳小路', offset: 24 }, { name: '石上', offset: 26 }, { name: '藤沢', offset: 28 },
], enoshimaMap);
const enoshimaPatterns: PatternSimple[] = [
  { fromMin: m(7),    toMin: m(9),    intervalMin: 10 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 12 },
  { fromMin: m(17),   toMin: m(21),   intervalMin: 10 },
  { fromMin: m(21),   toMin: m(24),   intervalMin: 15 },
];

// 都電荒川線（早稲田→三ノ輪橋: 0 / 逆: 1）
const arakawaMap = buildCoordMap(todenArakawaLine);
const arakawaDir0 = withCoords([
  { name: '早稲田', offset: 0 }, { name: '面影橋', offset: 2 }, { name: '学習院下', offset: 4 },
  { name: '鬼子母神前', offset: 6 }, { name: '都電雑司ヶ谷', offset: 8 }, { name: '東池袋四丁目', offset: 10 },
  { name: '向原', offset: 12 }, { name: '大塚駅前', offset: 14 }, { name: '巣鴨新田', offset: 16 },
  { name: '庚申塚', offset: 18 }, { name: '新庚申塚', offset: 20 }, { name: '西ヶ原四丁目', offset: 22 },
  { name: '滝野川一丁目', offset: 24 }, { name: '飛鳥山', offset: 26 }, { name: '王子駅前', offset: 28 },
  { name: '栄町', offset: 30 }, { name: '梶原', offset: 32 }, { name: '荒川車庫前', offset: 34 },
  { name: '荒川遊園地前', offset: 36 }, { name: '小台', offset: 38 }, { name: '宮ノ前', offset: 40 },
  { name: '熊野前', offset: 42 }, { name: '東尾久三丁目', offset: 44 }, { name: '町屋二丁目', offset: 46 },
  { name: '町屋駅前', offset: 48 }, { name: '荒川七丁目', offset: 50 }, { name: '荒川二丁目', offset: 52 },
  { name: '荒川区役所前', offset: 54 }, { name: '荒川一中前', offset: 56 }, { name: '三ノ輪橋', offset: 58 },
], arakawaMap);
const arakawaDir1 = withCoords([
  { name: '三ノ輪橋', offset: 0 }, { name: '荒川一中前', offset: 2 }, { name: '荒川区役所前', offset: 4 },
  { name: '荒川二丁目', offset: 6 }, { name: '荒川七丁目', offset: 8 }, { name: '町屋駅前', offset: 10 },
  { name: '町屋二丁目', offset: 12 }, { name: '東尾久三丁目', offset: 14 }, { name: '熊野前', offset: 16 },
  { name: '宮ノ前', offset: 18 }, { name: '小台', offset: 20 }, { name: '荒川遊園地前', offset: 22 },
  { name: '荒川車庫前', offset: 24 }, { name: '梶原', offset: 26 }, { name: '栄町', offset: 28 },
  { name: '王子駅前', offset: 30 }, { name: '飛鳥山', offset: 32 }, { name: '滝野川一丁目', offset: 34 },
  { name: '西ヶ原四丁目', offset: 36 }, { name: '新庚申塚', offset: 38 }, { name: '庚申塚', offset: 40 },
  { name: '巣鴨新田', offset: 42 }, { name: '大塚駅前', offset: 44 }, { name: '向原', offset: 46 },
  { name: '東池袋四丁目', offset: 48 }, { name: '都電雑司ヶ谷', offset: 50 }, { name: '鬼子母神前', offset: 52 },
  { name: '学習院下', offset: 54 }, { name: '面影橋', offset: 56 }, { name: '早稲田', offset: 58 },
], arakawaMap);
const arakawaPatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(8),    intervalMin: 5 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 6 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 8 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(23),   intervalMin: 8 },
];

// 日暮里・舎人ライナー（日暮里→見沼代親水公園: 0 / 逆: 1）
const toneriMap = buildCoordMap(nipporiToneriLiner);
const toneriDir0 = withCoords([
  { name: '日暮里', offset: 0 }, { name: '西日暮里', offset: 2 }, { name: '赤土小学校前', offset: 4 },
  { name: '熊野前', offset: 6 }, { name: '足立小台', offset: 8 }, { name: '扇大橋', offset: 10 },
  { name: '高野', offset: 12 }, { name: '江北', offset: 14 }, { name: '西新井大師西', offset: 16 },
  { name: '谷在家', offset: 18 }, { name: '舎人公園', offset: 20 }, { name: '舎人', offset: 22 },
  { name: '見沼代親水公園', offset: 24 },
], toneriMap);
const toneriDir1 = withCoords([
  { name: '見沼代親水公園', offset: 0 }, { name: '舎人', offset: 2 }, { name: '舎人公園', offset: 4 },
  { name: '谷在家', offset: 6 }, { name: '西新井大師西', offset: 8 }, { name: '江北', offset: 10 },
  { name: '高野', offset: 12 }, { name: '扇大橋', offset: 14 }, { name: '足立小台', offset: 16 },
  { name: '熊野前', offset: 18 }, { name: '赤土小学校前', offset: 20 }, { name: '西日暮里', offset: 22 },
  { name: '日暮里', offset: 24 },
], toneriMap);
const toneriPatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(8),    intervalMin: 4 },
  { fromMin: m(8),    toMin: m(10),   intervalMin: 3 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 5 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 6 },
];

// JR青梅線（立川→奥多摩: 0 / 逆: 1）
const omeMap = buildCoordMap(jrOmeLine);
const omeDir0 = withCoords([
  { name: '立川', offset: 0 }, { name: '西立川', offset: 3 }, { name: '東中神', offset: 5 },
  { name: '中神', offset: 7 }, { name: '昭島', offset: 9 }, { name: '拝島', offset: 11 },
  { name: '牛浜', offset: 14 }, { name: '福生', offset: 16 }, { name: '羽村', offset: 18 },
  { name: '小作', offset: 20 }, { name: '河辺', offset: 22 }, { name: '東青梅', offset: 24 },
  { name: '青梅', offset: 26 }, { name: '宮ノ平', offset: 29 }, { name: '日向和田', offset: 31 },
  { name: '石神前', offset: 33 }, { name: '二俣尾', offset: 35 }, { name: '軍畑', offset: 37 },
  { name: '沢井', offset: 39 }, { name: '御嶽', offset: 41 }, { name: '川井', offset: 44 },
  { name: '古里', offset: 46 }, { name: '鳩ノ巣', offset: 49 }, { name: '白丸', offset: 52 },
  { name: '奥多摩', offset: 55 },
], omeMap);
const omeDir1 = withCoords([
  { name: '奥多摩', offset: 0 }, { name: '白丸', offset: 3 }, { name: '鳩ノ巣', offset: 6 },
  { name: '古里', offset: 9 }, { name: '川井', offset: 11 }, { name: '御嶽', offset: 14 },
  { name: '沢井', offset: 16 }, { name: '軍畑', offset: 18 }, { name: '二俣尾', offset: 20 },
  { name: '石神前', offset: 22 }, { name: '日向和田', offset: 24 }, { name: '宮ノ平', offset: 26 },
  { name: '青梅', offset: 29 }, { name: '東青梅', offset: 31 }, { name: '河辺', offset: 33 },
  { name: '小作', offset: 35 }, { name: '羽村', offset: 37 }, { name: '福生', offset: 39 },
  { name: '牛浜', offset: 41 }, { name: '拝島', offset: 44 }, { name: '昭島', offset: 46 },
  { name: '中神', offset: 48 }, { name: '東中神', offset: 50 }, { name: '西立川', offset: 52 },
  { name: '立川', offset: 55 },
], omeMap);
const omePatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(7,30), intervalMin: 20 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 15 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 20 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 15 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 30 },
];

// 京王井の頭線（渋谷→吉祥寺: 0 / 逆: 1）
const inokashiraMap = buildCoordMap(keioInokashiraLine);
const inokashiraDir0 = withCoords([
  { name: '渋谷', offset: 0 }, { name: '神泉', offset: 2 }, { name: '駒場東大前', offset: 4 },
  { name: '池ノ上', offset: 6 }, { name: '下北沢', offset: 8 }, { name: '新代田', offset: 10 },
  { name: '東松原', offset: 12 }, { name: '明大前', offset: 14 }, { name: '永福町', offset: 16 },
  { name: '西永福', offset: 18 }, { name: '浜田山', offset: 20 }, { name: '高井戸', offset: 22 },
  { name: '富士見ヶ丘', offset: 24 }, { name: '久我山', offset: 26 }, { name: '三鷹台', offset: 28 },
  { name: '井の頭公園', offset: 30 }, { name: '吉祥寺', offset: 32 },
], inokashiraMap);
const inokashiraDir1 = withCoords([
  { name: '吉祥寺', offset: 0 }, { name: '井の頭公園', offset: 2 }, { name: '三鷹台', offset: 4 },
  { name: '久我山', offset: 6 }, { name: '富士見ヶ丘', offset: 8 }, { name: '高井戸', offset: 10 },
  { name: '浜田山', offset: 12 }, { name: '西永福', offset: 14 }, { name: '永福町', offset: 16 },
  { name: '明大前', offset: 18 }, { name: '東松原', offset: 20 }, { name: '新代田', offset: 22 },
  { name: '下北沢', offset: 24 }, { name: '池ノ上', offset: 26 }, { name: '駒場東大前', offset: 28 },
  { name: '神泉', offset: 30 }, { name: '渋谷', offset: 32 },
], inokashiraMap);
const inokashiraPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 8 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 4 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 8 },
];

// 東急世田谷線（三軒茶屋→下高井戸: 0 / 逆: 1）
const setagayaMap = buildCoordMap(tokyuSetagayaLine);
const setagayaDir0 = withCoords([
  { name: '三軒茶屋', offset: 0 }, { name: '西太子堂', offset: 2 }, { name: '若林', offset: 4 },
  { name: '松陰神社前', offset: 6 }, { name: '世田谷', offset: 8 }, { name: '上町', offset: 10 },
  { name: '宮の坂', offset: 12 }, { name: '山下', offset: 14 }, { name: '松原', offset: 16 },
  { name: '下高井戸', offset: 18 },
], setagayaMap);
const setagayaDir1 = withCoords([
  { name: '下高井戸', offset: 0 }, { name: '松原', offset: 2 }, { name: '山下', offset: 4 },
  { name: '宮の坂', offset: 6 }, { name: '上町', offset: 8 }, { name: '世田谷', offset: 10 },
  { name: '松陰神社前', offset: 12 }, { name: '若林', offset: 14 }, { name: '西太子堂', offset: 16 },
  { name: '三軒茶屋', offset: 18 },
], setagayaMap);
const setagayaPatterns: PatternSimple[] = [
  { fromMin: m(6),    toMin: m(9),    intervalMin: 5 },
  { fromMin: m(9),    toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(21),   intervalMin: 5 },
  { fromMin: m(21),   toMin: m(24),   intervalMin: 8 },
];

// 東急大井町線（大井町→二子玉川: 0 / 逆: 1）
const oimachiMap = buildCoordMap(tokyuOimachiLine);
const oimachiDir0 = withCoords([
  { name: '大井町', offset: 0 }, { name: '下神明', offset: 2 }, { name: '戸越公園', offset: 4 },
  { name: '中延', offset: 6 }, { name: '荏原町', offset: 8 }, { name: '旗の台', offset: 10 },
  { name: '北千束', offset: 12 }, { name: '大岡山', offset: 14 }, { name: '緑が丘', offset: 16 },
  { name: '自由が丘', offset: 18 }, { name: '九品仏', offset: 20 }, { name: '尾山台', offset: 22 },
  { name: '等々力', offset: 24 }, { name: '上野毛', offset: 26 }, { name: '二子玉川', offset: 28 },
], oimachiMap);
const oimachiDir1 = withCoords([
  { name: '二子玉川', offset: 0 }, { name: '上野毛', offset: 2 }, { name: '等々力', offset: 4 },
  { name: '尾山台', offset: 6 }, { name: '九品仏', offset: 8 }, { name: '自由が丘', offset: 10 },
  { name: '緑が丘', offset: 12 }, { name: '大岡山', offset: 14 }, { name: '北千束', offset: 16 },
  { name: '旗の台', offset: 18 }, { name: '荏原町', offset: 20 }, { name: '中延', offset: 22 },
  { name: '戸越公園', offset: 24 }, { name: '下神明', offset: 26 }, { name: '大井町', offset: 28 },
], oimachiMap);
const oimachiPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(7,30), intervalMin: 6 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 4 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 6 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 4 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 8 },
];

// 横須賀線（東京→久里浜: 0 / 逆: 1）
const yokosukaMap = buildCoordMap(yokosukaLine);
const yokosukaDir0 = withCoords([
  { name: '東京', offset: 0 }, { name: '新橋', offset: 4 }, { name: '品川', offset: 7 },
  { name: '西大井', offset: 13 }, { name: '武蔵小杉', offset: 18 }, { name: '新川崎', offset: 23 },
  { name: '横浜', offset: 30 }, { name: '保土ケ谷', offset: 34 }, { name: '東戸塚', offset: 37 },
  { name: '戸塚', offset: 42 }, { name: '大船', offset: 48 }, { name: '北鎌倉', offset: 53 },
  { name: '鎌倉', offset: 57 }, { name: '逗子', offset: 61 }, { name: '東逗子', offset: 64 },
  { name: '田浦', offset: 68 }, { name: '横須賀', offset: 71 }, { name: '衣笠', offset: 75 },
  { name: '久里浜', offset: 79 },
], yokosukaMap);
const yokosukaDir1 = withCoords([
  { name: '久里浜', offset: 0 }, { name: '衣笠', offset: 4 }, { name: '横須賀', offset: 8 },
  { name: '田浦', offset: 11 }, { name: '東逗子', offset: 15 }, { name: '逗子', offset: 18 },
  { name: '鎌倉', offset: 22 }, { name: '北鎌倉', offset: 26 }, { name: '大船', offset: 31 },
  { name: '戸塚', offset: 37 }, { name: '東戸塚', offset: 42 }, { name: '保土ケ谷', offset: 45 },
  { name: '横浜', offset: 49 }, { name: '新川崎', offset: 56 }, { name: '武蔵小杉', offset: 61 },
  { name: '西大井', offset: 66 }, { name: '品川', offset: 72 }, { name: '新橋', offset: 75 },
  { name: '東京', offset: 79 },
], yokosukaMap);
const yokosukaPatterns: PatternSimple[] = [
  { fromMin: m(5),    toMin: m(7,30), intervalMin: 15 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 10 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 15 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 10 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 20 },
];

// 京王相模原線（調布→橋本: 0 / 逆: 1）
const keioSagamiharaMap = buildCoordMap(keioSagamiharaLine);
const keioSagamiharaDir0 = withCoords([
  { name: '調布', offset: 0 }, { name: '京王多摩川', offset: 2 }, { name: '京王稲田堤', offset: 5 },
  { name: '京王よみうりランド', offset: 7 }, { name: '稲城', offset: 9 }, { name: '若葉台', offset: 12 },
  { name: '京王永山', offset: 15 }, { name: '京王多摩センター', offset: 18 }, { name: '京王堀之内', offset: 21 },
  { name: '南大沢', offset: 23 }, { name: '多摩境', offset: 25 }, { name: '橋本', offset: 28 },
], keioSagamiharaMap);
const keioSagamiharaDir1 = withCoords([
  { name: '橋本', offset: 0 }, { name: '多摩境', offset: 3 }, { name: '南大沢', offset: 5 },
  { name: '京王堀之内', offset: 7 }, { name: '京王多摩センター', offset: 10 }, { name: '京王永山', offset: 13 },
  { name: '若葉台', offset: 16 }, { name: '稲城', offset: 19 }, { name: '京王よみうりランド', offset: 21 },
  { name: '京王稲田堤', offset: 23 }, { name: '京王多摩川', offset: 26 }, { name: '調布', offset: 28 },
], keioSagamiharaMap);
const keioSagamiharaPatterns: PatternSimple[] = [
  { fromMin: m(5,30), toMin: m(7,30), intervalMin: 10 },
  { fromMin: m(7,30), toMin: m(10),   intervalMin: 6 },
  { fromMin: m(10),   toMin: m(17),   intervalMin: 10 },
  { fromMin: m(17),   toMin: m(20),   intervalMin: 6 },
  { fromMin: m(20),   toMin: m(24),   intervalMin: 12 },
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
  {
    key: 'yurakuchoLine',
    color: '#C1A470',
    directions: [
      { stations: yurakuchoDir0, travelMin: 38, isCircular: false, patterns: yurakuchoPatterns },
      { stations: yurakuchoDir1, travelMin: 38, isCircular: false, patterns: yurakuchoPatterns },
    ],
  },
  {
    key: 'jrSobuLine',
    color: '#FED100',
    directions: [
      { stations: sobuDir0, travelMin: 49, isCircular: false, patterns: sobuPatterns },
      { stations: sobuDir1, travelMin: 49, isCircular: false, patterns: sobuPatterns },
    ],
  },
  {
    key: 'jrJobanLine',
    color: '#417036',
    directions: [
      { stations: jobanDir0, travelMin: 62, isCircular: false, patterns: jobanPatterns },
      { stations: jobanDir1, travelMin: 62, isCircular: false, patterns: jobanPatterns },
    ],
  },
  {
    key: 'tsukubaExpress',
    color: '#8B4513',
    directions: [
      { stations: txDir0, travelMin: 100, isCircular: false, patterns: txPatterns },
      { stations: txDir1, travelMin: 100, isCircular: false, patterns: txPatterns },
    ],
  },
  {
    key: 'rinkaiLine',
    color: '#00B5E2',
    directions: [
      { stations: rinkaiDir0, travelMin: 23, isCircular: false, patterns: rinkaiPatterns },
      { stations: rinkaiDir1, travelMin: 23, isCircular: false, patterns: rinkaiPatterns },
    ],
  },
  {
    key: 'yurikamomeLine',
    color: '#00BFFF',
    directions: [
      { stations: yurikamomeDir0, travelMin: 31, isCircular: false, patterns: yurikamomePatterns },
      { stations: yurikamomeDir1, travelMin: 31, isCircular: false, patterns: yurikamomePatterns },
    ],
  },
  {
    key: 'keioLine',
    color: '#DD0077',
    directions: [
      { stations: keioDir0, travelMin: 43, isCircular: false, patterns: keioPatterns },
      { stations: keioDir1, travelMin: 43, isCircular: false, patterns: keioPatterns },
    ],
  },
  {
    key: 'jrNanbuLine',
    color: '#FFCC00',
    directions: [
      { stations: nanbuDir0, travelMin: 49, isCircular: false, patterns: nanbuPatterns },
      { stations: nanbuDir1, travelMin: 49, isCircular: false, patterns: nanbuPatterns },
    ],
  },
  {
    key: 'jrNegishiLine',
    color: '#00B5E2',
    directions: [
      { stations: negishiDir0, travelMin: 27, isCircular: false, patterns: negishiPatterns },
      { stations: negishiDir1, travelMin: 27, isCircular: false, patterns: negishiPatterns },
    ],
  },
  {
    key: 'jrYokohamaLine',
    color: '#41A541',
    directions: [
      { stations: yokohamaLineDir0, travelMin: 69, isCircular: false, patterns: yokohamaLinePatterns },
      { stations: yokohamaLineDir1, travelMin: 69, isCircular: false, patterns: yokohamaLinePatterns },
    ],
  },
  {
    key: 'tokyuMeguro',
    color: '#008B8B',
    directions: [
      { stations: meguroDir0, travelMin: 25, isCircular: false, patterns: meguroPatterns },
      { stations: meguroDir1, travelMin: 25, isCircular: false, patterns: meguroPatterns },
    ],
  },
  {
    key: 'seibuShinjukuLine',
    color: '#F39700',
    directions: [
      { stations: seibuShinjukuDir0, travelMin: 62, isCircular: false, patterns: seibuShinjukuPatterns },
      { stations: seibuShinjukuDir1, travelMin: 62, isCircular: false, patterns: seibuShinjukuPatterns },
    ],
  },
  {
    key: 'tobuIsesakiLine',
    color: '#1E88E5',
    directions: [
      { stations: tobuIsesakiDir0, travelMin: 26, isCircular: false, patterns: tobuIsesakiPatterns },
      { stations: tobuIsesakiDir1, travelMin: 26, isCircular: false, patterns: tobuIsesakiPatterns },
    ],
  },
  {
    key: 'sotetsuMainLine',
    color: '#2E8B57',
    directions: [
      { stations: sotetsuDir0, travelMin: 41, isCircular: false, patterns: sotetsuPatterns },
      { stations: sotetsuDir1, travelMin: 41, isCircular: false, patterns: sotetsuPatterns },
    ],
  },
  {
    key: 'tokyoMonorail',
    color: '#0066CC',
    directions: [
      { stations: monorailDir0, travelMin: 21, isCircular: false, patterns: monorailPatterns },
      { stations: monorailDir1, travelMin: 21, isCircular: false, patterns: monorailPatterns },
    ],
  },
  {
    key: 'tamaMonorail',
    color: '#20B2AA',
    directions: [
      { stations: tamaMonoDir0, travelMin: 34, isCircular: false, patterns: tamaMonoPatterns },
      { stations: tamaMonoDir1, travelMin: 34, isCircular: false, patterns: tamaMonoPatterns },
    ],
  },
  {
    key: 'odakyuEnoshimaLine',
    color: '#0066CC',
    directions: [
      { stations: odakyuEnoDir0, travelMin: 33, isCircular: false, patterns: odakyuEnoPatterns },
      { stations: odakyuEnoDir1, travelMin: 33, isCircular: false, patterns: odakyuEnoPatterns },
    ],
  },
  {
    key: 'keiseiMainLine',
    color: '#3165B1',
    directions: [
      { stations: keiseiDir0, travelMin: 116, isCircular: false, patterns: keiseiPatterns },
      { stations: keiseiDir1, travelMin: 116, isCircular: false, patterns: keiseiPatterns },
    ],
  },
  {
    key: 'jrMusashinoLine',
    color: '#F15A22',
    directions: [
      { stations: musashinoDir0, travelMin: 95, isCircular: false, patterns: musashinoPatterns },
      { stations: musashinoDir1, travelMin: 95, isCircular: false, patterns: musashinoPatterns },
    ],
  },
  {
    key: 'yokohamaBlueLine',
    color: '#0066FF',
    directions: [
      { stations: yokohamaBlueDir0, travelMin: 95, isCircular: false, patterns: yokohamaBluePatterns },
      { stations: yokohamaBlueDir1, travelMin: 95, isCircular: false, patterns: yokohamaBluePatterns },
    ],
  },
  {
    key: 'jrTakasakiLine',
    color: '#F68B1E',
    directions: [
      { stations: takasakiDir0, travelMin: 62, isCircular: false, patterns: takasakiPatterns },
      { stations: takasakiDir1, travelMin: 62, isCircular: false, patterns: takasakiPatterns },
    ],
  },
  {
    key: 'jrKeiyo',
    color: '#FF6347',
    directions: [
      { stations: keiyoDir0, travelMin: 42, isCircular: false, patterns: keiyoPatterns },
      { stations: keiyoDir1, travelMin: 42, isCircular: false, patterns: keiyoPatterns },
    ],
  },
  {
    key: 'yokohamaGreenLine',
    color: '#32CD32',
    directions: [
      { stations: yokohamaGreenDir0, travelMin: 22, isCircular: false, patterns: yokohamaGreenPatterns },
      { stations: yokohamaGreenDir1, travelMin: 22, isCircular: false, patterns: yokohamaGreenPatterns },
    ],
  },
  {
    key: 'enoshimaElectricRailway',
    color: '#228B22',
    directions: [
      { stations: enoshimaDir0, travelMin: 28, isCircular: false, patterns: enoshimaPatterns },
      { stations: enoshimaDir1, travelMin: 28, isCircular: false, patterns: enoshimaPatterns },
    ],
  },
  {
    key: 'todenArakawaLine',
    color: '#EE82EE',
    directions: [
      { stations: arakawaDir0, travelMin: 58, isCircular: false, patterns: arakawaPatterns },
      { stations: arakawaDir1, travelMin: 58, isCircular: false, patterns: arakawaPatterns },
    ],
  },
  {
    key: 'nipporiToneriLiner',
    color: '#FF1493',
    directions: [
      { stations: toneriDir0, travelMin: 24, isCircular: false, patterns: toneriPatterns },
      { stations: toneriDir1, travelMin: 24, isCircular: false, patterns: toneriPatterns },
    ],
  },
  {
    key: 'jrOmeLine',
    color: '#FF8C00',
    directions: [
      { stations: omeDir0, travelMin: 55, isCircular: false, patterns: omePatterns },
      { stations: omeDir1, travelMin: 55, isCircular: false, patterns: omePatterns },
    ],
  },
  {
    key: 'keioInokashiraLine',
    color: '#48D1CC',
    directions: [
      { stations: inokashiraDir0, travelMin: 32, isCircular: false, patterns: inokashiraPatterns },
      { stations: inokashiraDir1, travelMin: 32, isCircular: false, patterns: inokashiraPatterns },
    ],
  },
  {
    key: 'tokyuSetagayaLine',
    color: '#2E8B57',
    directions: [
      { stations: setagayaDir0, travelMin: 18, isCircular: false, patterns: setagayaPatterns },
      { stations: setagayaDir1, travelMin: 18, isCircular: false, patterns: setagayaPatterns },
    ],
  },
  {
    key: 'tokyuOimachiLine',
    color: '#FF4500',
    directions: [
      { stations: oimachiDir0, travelMin: 28, isCircular: false, patterns: oimachiPatterns },
      { stations: oimachiDir1, travelMin: 28, isCircular: false, patterns: oimachiPatterns },
    ],
  },
  {
    key: 'yokosukaLine',
    color: '#0072BC',
    directions: [
      { stations: yokosukaDir0, travelMin: 79, isCircular: false, patterns: yokosukaPatterns },
      { stations: yokosukaDir1, travelMin: 79, isCircular: false, patterns: yokosukaPatterns },
    ],
  },
  {
    key: 'keioSagamiharaLine',
    color: '#DD0077',
    directions: [
      { stations: keioSagamiharaDir0, travelMin: 28, isCircular: false, patterns: keioSagamiharaPatterns },
      { stations: keioSagamiharaDir1, travelMin: 28, isCircular: false, patterns: keioSagamiharaPatterns },
    ],
  },
  {
    key: 'jrUtsunomiyaLine',
    color: '#F68B1E',
    directions: [
      { stations: utsunomiyaDir0, travelMin: 91, isCircular: false, patterns: utsunomiyaPatterns },
      { stations: utsunomiyaDir1, travelMin: 91, isCircular: false, patterns: utsunomiyaPatterns },
    ],
  },
  {
    key: 'jrHachikoLine',
    color: '#F5A623',
    directions: [
      { stations: hachikoDir0, travelMin: 11, isCircular: false, patterns: hachikoPatterns },
      { stations: hachikoDir1, travelMin: 11, isCircular: false, patterns: hachikoPatterns },
    ],
  },
  {
    key: 'jrItsukaichiLine',
    color: '#FF8C00',
    directions: [
      { stations: itsukaichiDir0, travelMin: 13, isCircular: false, patterns: itsukaichiPatterns },
      { stations: itsukaichiDir1, travelMin: 13, isCircular: false, patterns: itsukaichiPatterns },
    ],
  },
  {
    key: 'saitamaRailway',
    color: '#CC0066',
    directions: [
      { stations: saitamaRwDir0, travelMin: 22, isCircular: false, patterns: saitamaRwPatterns },
      { stations: saitamaRwDir1, travelMin: 22, isCircular: false, patterns: saitamaRwPatterns },
    ],
  },
  {
    key: 'newShuttle',
    color: '#FF6600',
    directions: [
      { stations: newShuttleDir0, travelMin: 24, isCircular: false, patterns: newShuttlePatterns },
      { stations: newShuttleDir1, travelMin: 24, isCircular: false, patterns: newShuttlePatterns },
    ],
  },
  {
    key: 'keiseiOshiageLine',
    color: '#3165B1',
    directions: [
      { stations: oshiageDir0, travelMin: 11, isCircular: false, patterns: oshiagePatterns },
      { stations: oshiageDir1, travelMin: 11, isCircular: false, patterns: oshiagePatterns },
    ],
  },
  {
    key: 'hokusouLine',
    color: '#FF4500',
    directions: [
      { stations: hokusouDir0, travelMin: 51, isCircular: false, patterns: hokusouPatterns },
      { stations: hokusouDir1, travelMin: 51, isCircular: false, patterns: hokusouPatterns },
    ],
  },
  {
    key: 'keikyuAirportLine',
    color: '#FF0000',
    directions: [
      { stations: kqAirportDir0, travelMin: 13, isCircular: false, patterns: kqAirportPatterns },
      { stations: kqAirportDir1, travelMin: 13, isCircular: false, patterns: kqAirportPatterns },
    ],
  },
  {
    key: 'keikyuKurihamaLine',
    color: '#FF0000',
    directions: [
      { stations: kqKurihamaDir0, travelMin: 21, isCircular: false, patterns: kqKurihamaPatterns },
      { stations: kqKurihamaDir1, travelMin: 21, isCircular: false, patterns: kqKurihamaPatterns },
    ],
  },
  {
    key: 'shinkeisei',
    color: '#FF69B4',
    directions: [
      { stations: shinkeiseiDir0, travelMin: 53, isCircular: false, patterns: shinkeiseiPatterns },
      { stations: shinkeiseiDir1, travelMin: 53, isCircular: false, patterns: shinkeiseiPatterns },
    ],
  },
  {
    key: 'toyoRapid',
    color: '#9370DB',
    directions: [
      { stations: toyoRapidDir0, travelMin: 32, isCircular: false, patterns: toyoRapidPatterns },
      { stations: toyoRapidDir1, travelMin: 32, isCircular: false, patterns: toyoRapidPatterns },
    ],
  },
  {
    key: 'sotetsuIzumino',
    color: '#2E8B57',
    directions: [
      { stations: sotetsuIzuminoDir0, travelMin: 17, isCircular: false, patterns: sotetsuIzuminoPatterns },
      { stations: sotetsuIzuminoDir1, travelMin: 17, isCircular: false, patterns: sotetsuIzuminoPatterns },
    ],
  },
  {
    key: 'sotetsuJRLine',
    color: '#4169E1',
    directions: [
      { stations: sotetsuJRDir0, travelMin: 62, isCircular: false, patterns: sotetsuJRPatterns },
      { stations: sotetsuJRDir1, travelMin: 62, isCircular: false, patterns: sotetsuJRPatterns },
    ],
  },
  {
    key: 'shonanMonorail',
    color: '#20B2AA',
    directions: [
      { stations: shonanMonoDir0, travelMin: 14, isCircular: false, patterns: shonanMonoPatterns },
      { stations: shonanMonoDir1, travelMin: 14, isCircular: false, patterns: shonanMonoPatterns },
    ],
  },
  {
    key: 'odakyuTamaLine',
    color: '#0066CC',
    directions: [
      { stations: odakyuTamaDir0, travelMin: 15, isCircular: false, patterns: odakyuTamaPatterns },
      { stations: odakyuTamaDir1, travelMin: 15, isCircular: false, patterns: odakyuTamaPatterns },
    ],
  },
  {
    key: 'tobuNikkoLine',
    color: '#1E88E5',
    directions: [
      { stations: tobuNikkoDir0, travelMin: 97, isCircular: false, patterns: tobuNikkoPatterns },
      { stations: tobuNikkoDir1, travelMin: 97, isCircular: false, patterns: tobuNikkoPatterns },
    ],
  },
  {
    key: 'tobuKameidoLine',
    color: '#1E88E5',
    directions: [
      { stations: kameidoDir0, travelMin: 8, isCircular: false, patterns: kameidoPatterns },
      { stations: kameidoDir1, travelMin: 8, isCircular: false, patterns: kameidoPatterns },
    ],
  },
  {
    key: 'jrSobuChiba',
    color: '#FFD700',
    directions: [
      { stations: sobuChibaDir0, travelMin: 41, isCircular: false, patterns: sobuChibaPatterns },
      { stations: sobuChibaDir1, travelMin: 41, isCircular: false, patterns: sobuChibaPatterns },
    ],
  },
  {
    key: 'tokyuTamagawa',
    color: '#DC143C',
    directions: [
      { stations: tamagawaDir0, travelMin: 12, isCircular: false, patterns: tamagawaPatterns },
      { stations: tamagawaDir1, travelMin: 12, isCircular: false, patterns: tamagawaPatterns },
    ],
  },
  {
    key: 'tokyuIkegami',
    color: '#DC143C',
    directions: [
      { stations: ikegamiDir0, travelMin: 29, isCircular: false, patterns: ikegamiPatterns },
      { stations: ikegamiDir1, travelMin: 29, isCircular: false, patterns: ikegamiPatterns },
    ],
  },
];

// ── メインAPI ────────────────────────────────────────────

export function getAllTrainPositions(currentMinutes: number, allowedKeys?: Set<string>): TrainPosition[] {
  const result: TrainPosition[] = [];

  for (const line of DEMO_LINES) {
    if (allowedKeys && !allowedKeys.has(line.key)) continue;
    for (let di = 0; di < line.directions.length; di++) {
      const dir = line.directions[di];
      const windowStart = currentMinutes - dir.travelMin;
      const departures = getActiveDepartures(dir.patterns, windowStart, currentMinutes);

      for (const d of departures) {
        const elapsed = currentMinutes - d;
        if (elapsed < 0) continue;
        const result2 = interpolateWithBearing(dir.stations, elapsed, dir.isCircular);
        if (!result2) continue;
        result.push({
          id: `${line.key}_${di}_${Math.round(d * 100)}`,
          lineKey: line.key,
          color: line.color,
          direction: di,
          departureMin: d,
          pos: result2.pos,
          bearing: result2.bearing,
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

/**
 * 各路線・方向の終端駅名を返す。
 * ツールチップの「〇〇方面」表示に使用。
 * direction=0 → stations[0] が出発、最後の駅が終点
 * direction=1 → 逆方向の終点
 */
export const DEMO_DIRECTION_TERMINALS: Record<string, [string, string]> = Object.fromEntries(
  DEMO_LINES.map(l => {
    const d0end = l.directions[0]?.stations.at(-1)?.name ?? '';
    const d1end = l.directions[1]?.stations.at(-1)?.name ?? '';
    return [l.key, [d0end, d1end] as [string, string]];
  })
);
