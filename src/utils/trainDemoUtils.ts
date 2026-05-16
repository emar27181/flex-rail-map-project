/**
 * 山手線 列車位置デモ用ユーティリティ
 * 時刻表データから各時刻の列車位置（緯度経度）を計算する
 */
import { yamanote } from '../data/yamanote';

const LOOP_MIN = 59; // 山手線1周の所要時間（分）
const INTERVAL_MIN = 5; // 昼間帯（10:00-17:00）の発車間隔

interface StationEntry { name: string; offset: number; }
interface StationWithCoord extends StationEntry { lat: number; lng: number; }

// 内回り: 東京→渋谷→品川→東京
const DIR0_RAW: StationEntry[] = [
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
];

// 外回り: 東京→品川→渋谷→東京
const DIR1_RAW: StationEntry[] = [
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
];

const coordMap = new Map(yamanote.map(s => [s.name, { lat: s.lat, lng: s.lng }]));

function withCoords(raw: StationEntry[]): StationWithCoord[] {
  return raw.map(s => ({ ...s, ...(coordMap.get(s.name) ?? { lat: 0, lng: 0 }) }));
}

const DIR0 = withCoords(DIR0_RAW);
const DIR1 = withCoords(DIR1_RAW);

function interpolatePos(stations: StationWithCoord[], elapsed: number): [number, number] | null {
  const e = ((elapsed % LOOP_MIN) + LOOP_MIN) % LOOP_MIN;

  for (let i = 0; i < stations.length - 1; i++) {
    const a = stations[i], b = stations[i + 1];
    if (e >= a.offset && e < b.offset) {
      const r = (e - a.offset) / (b.offset - a.offset);
      return [a.lat + r * (b.lat - a.lat), a.lng + r * (b.lng - a.lng)];
    }
  }

  // 最終駅→東京 の折り返し区間
  const last = stations[stations.length - 1];
  const first = stations[0];
  const r = (e - last.offset) / (LOOP_MIN - last.offset);
  return [last.lat + r * (first.lat - last.lat), last.lng + r * (first.lng - last.lng)];
}

export interface TrainPosition {
  id: string;
  direction: 0 | 1;
  departureMin: number; // 東京駅発車時刻（0時からの分）
  pos: [number, number];
}

export function getYamanoteTrainPositions(currentMinutes: number): TrainPosition[] {
  const result: TrainPosition[] = [];
  const firstDep = Math.ceil((currentMinutes - LOOP_MIN) / INTERVAL_MIN) * INTERVAL_MIN;

  for (const [dirIdx, stations] of [[0, DIR0], [1, DIR1]] as [number, StationWithCoord[]][]) {
    for (let d = firstDep; d <= currentMinutes; d += INTERVAL_MIN) {
      const elapsed = currentMinutes - d;
      if (elapsed < 0 || elapsed >= LOOP_MIN) continue;
      const pos = interpolatePos(stations, elapsed);
      if (!pos) continue;
      result.push({
        id: `y_${dirIdx}_${d}`,
        direction: dirIdx as 0 | 1,
        departureMin: d,
        pos,
      });
    }
  }

  return result;
}

export function formatDemoTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
