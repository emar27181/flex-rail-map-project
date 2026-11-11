/**
 * 終電マップの独立 PoC。
 * 駅名・座標だけは既存路線データを参照。以下の発車時刻は完全な架空のデモダイヤ。
 * 実際の終電案内や移動判断には絶対に使わないこと。
 */
import { yamanote, type Station } from '../data/yamanote';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import { chuo } from '../data/chuo';
import { keihinTohoku } from '../data/keihin-tohoku';

export interface DemoLine {
  id: string;
  routeKey: RouteKey;
  label: string;
  color: string;
  stations: Station[];
  circular?: boolean;
  interval: number;
  lastOrigin: number;
}

export interface DemoLeg {
  from: string;
  to: string;
  lineId: string;
  depart: number;
  arrive: number;
}

export const DEMO_START = 22 * 60;
export const DEMO_END = 25 * 60 + 30;
export const DEMO_STEP = 5;
export const DEMO_TRANSFER_MINUTES = 4;

/** 色も含めて試験路線の定義を1箇所に集約する。 */
export const DEMO_LINES: DemoLine[] = [
  {
    id: 'yamanote', routeKey: 'yamanote', label: '山手線', color: '#87bd50',
    stations: yamanote, circular: true, interval: 13, lastOrigin: 24 * 60 + 6,
  },
  {
    id: 'chuo', routeKey: 'chuo', label: '中央線', color: '#f39832',
    stations: chuo.slice(0, 20), interval: 17, lastOrigin: 23 * 60 + 55,
  },
  {
    id: 'keihin', routeKey: 'keihinTohoku', label: '京浜東北線', color: '#55a8e1',
    stations: keihinTohoku.slice(9, 34), interval: 16, lastOrigin: 24 * 60 + 2,
  },
];

export const DEMO_STATIONS: Station[] = Array.from(
  new Map(DEMO_LINES.flatMap(line => line.stations.map(st => [st.name, st] as const))).values(),
).sort((a, b) => a.name.localeCompare(b.name, 'ja'));

/**
 * 任意の到着駅で試せるよう、既存の駅・路線情報から周辺のつながりを抽出。
 * 30路線上限は計算量の上限であり、選んだ路線内の駅を途中で省略しない。
 * 運行時刻は引き続き全て架空。実際の終電推定ではない。
 */
export const DEMO_MAX_CONNECTED_LINES = 30;

export interface DestinationDemoNetwork {
  lines: DemoLine[];
  stations: Station[];
  legs: DemoLeg[];
  limited: boolean;
}

export function buildDestinationDemoNetwork(
  destination: string,
  maxLines: number = DEMO_MAX_CONNECTED_LINES,
): DestinationDemoNetwork {
  const allKeys = Object.keys(routes) as RouteKey[];
  const direct = allKeys.filter(key => routes[key].some(st => st.name === destination));
  if (direct.length === 0 || maxLines < 1) return { lines: [], stations: [], legs: [], limited: false };

  const selected: RouteKey[] = [];
  const seen = new Set<string>([destination]);
  const directSet = new Set(direct);
  const cap = Math.max(1, Math.floor(maxLines));

  while (selected.length < cap) {
    let candidate: RouteKey | undefined;
    let best = -Infinity;
    for (const key of allKeys) {
      if (selected.includes(key)) continue;
      const stations = routes[key];
      if (stations.length < 2) continue;
      const common = stations.filter(st => seen.has(st.name)).length;
      if (common === 0) continue;
      // 到着駅に直接乗り入れる路線を優先し、次に乗換駅の多い路線へ展開する。
      const score = (directSet.has(key) ? 10000 : 0) + common * 100 - Math.min(stations.length, 200);
      if (score > best) { best = score; candidate = key; }
    }
    if (!candidate) break;
    selected.push(candidate);
    for (const st of routes[candidate]) seen.add(st.name);
  }

  const lines: DemoLine[] = selected.map((routeKey, i) => {
    const stations = routes[routeKey];
    return {
      id: routeKey,
      routeKey,
      label: routeNames[routeKey] ?? routeKey,
      color: routeColors[routeKey],
      stations,
      circular: stations.length > 2 && stations[0].name === stations[stations.length - 1].name,
      interval: 12 + (i % 5) * 3,
      lastOrigin: 24 * 60 + 4 - (i % 6) * 3,
    };
  });
  const stations: Station[] = [...new Map(lines.flatMap(line =>
    line.stations.map(st => [st.name, st] as const),
  )).values()].sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  const limited = selected.length >= cap && allKeys.some(key =>
    !selected.includes(key) && routes[key].some(st => seen.has(st.name))
  );
  return { lines, stations, legs: buildDemoLegs(lines), limited };
}

export function formatDemoClock(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
}

/** 既存の時刻入力（HH:mm）を試験タイムラインの連続分へ変換。
 * 深夜0〜4時は24:xx〜28:xxと扱い、日付またぎでも残り時間が逆戻りしない。
 */
export function parseDemoClock(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minute = Number(match[2]);
  return (hours < 5 ? hours + 24 : hours) * 60 + minute;
}
export function toInputClock(minutes: number): string {
  const normalized = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return formatDemoClock(normalized);
}
export function getCurrentDemoClock(now: Date = new Date()): number {
  return parseDemoClock(String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0')) ?? DEMO_START;
}

export function demoEdgeKey(lineId: string, from: string, to: string): string {
  return lineId + ':' + from + '→' + to;
}

/**
 * 各方向の架空列車を駅間コネクションに展開する。
 * 同一列車の駅間は連続するが、実ダイヤではない。
 */
export function buildDemoLegs(lines: readonly DemoLine[] = DEMO_LINES): DemoLeg[] {
  const result: DemoLeg[] = [];
  for (const line of lines) {
    for (const reversed of [false, true]) {
      const sequence = reversed ? [...line.stations].reverse() : [...line.stations];
      if (line.circular && sequence.length > 1) sequence.push(sequence[0]);
      if (sequence.length < 2) continue;
      for (let origin = 21 * 60 + 40; origin <= line.lastOrigin; origin += line.interval) {
        let cursor = origin;
        for (let i = 0; i < sequence.length - 1; i++) {
          const from = sequence[i];
          const to = sequence[i + 1];
          // 逆方向は元データで「次」の駅に割り当てた値を使う。
          const base = reversed ? to.timeToNext : from.timeToNext;
          const duration = Math.max(1, base ?? 2);
          result.push({
            from: from.name, to: to.name, lineId: line.id,
            depart: cursor, arrive: cursor + duration,
          });
          cursor += duration;
        }
      }
    }
  }
  return result;
}

export interface LastTrainDemoResult {
  /** その駅から乗り始める最遅時刻。到着駅自体は含めない。 */
  latestDeparture: Map<string, number>;
  /** その接続から先に目的地へ到達可能な架空便を含む地図区間。 */
  feasibleLegs: DemoLeg[];
}

/**
 * 到着駅から時刻逆順に到達可能性を伝播。
 * - 同一路線継続: 追加待ち時間0分（PoCの単純化）
 * - 異なる路線へ乗換: DEMO_TRANSFER_MINUTES分の猶予
 * 方向・日付・事業者の実運行時刻を推定する処理ではない。
 */
export function calculateDemoLastTrain(
  legs: readonly DemoLeg[],
  destination: string,
  transferMinutes = DEMO_TRANSFER_MINUTES,
): LastTrainDemoResult {
  // station → lineId → 最も遅く乗車できる時刻
  const latestByLine = new Map<string, Map<string, number>>();
  const feasibleLegs: DemoLeg[] = [];
  const sorted = [...legs].sort((a, b) => b.depart - a.depart);
  for (const leg of sorted) {
    if (leg.from === destination) continue;
    const next = latestByLine.get(leg.to);
    const canFinish = leg.to === destination || (
      next !== undefined && [...next].some(([lineId, latest]) =>
        leg.arrive + (lineId === leg.lineId ? 0 : transferMinutes) <= latest
      )
    );
    if (!canFinish) continue;
    feasibleLegs.push(leg);
    const state = latestByLine.get(leg.from) ?? new Map<string, number>();
    state.set(leg.lineId, Math.max(state.get(leg.lineId) ?? -Infinity, leg.depart));
    latestByLine.set(leg.from, state);
  }
  const latestDeparture = new Map<string, number>();
  for (const [station, states] of latestByLine) {
    latestDeparture.set(station, Math.max(...states.values()));
  }
  return { latestDeparture, feasibleLegs };
}

export function availableDemoStations(
  latest: ReadonlyMap<string, number>, destination: string, atTime: number,
): string[] {
  return [...latest].filter(([name, minute]) => name !== destination && minute >= atTime)
    .map(([name]) => name);
}
