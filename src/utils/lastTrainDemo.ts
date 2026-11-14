/**
 * 終電マップの独立 PoC。
 * 駅名・座標だけは既存路線データを参照。以下の発車時刻は完全な架空のデモダイヤ。
 * 実際の終電案内や移動判断には絶対に使わないこと。
 */
import { yamanote, type Station } from '../data/yamanote';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import { THROUGH_SERVICES, type ThroughService } from '../data/throughServices';
import { DEFAULT_ROUTE_RECOMMENDATION_LIMIT } from '../constants/routeRecommendationLimit';
import { chuo } from '../data/chuo';
import { keihinTohoku } from '../data/keihin-tohoku';
import { LAST_TRAIN_TIMETABLES, type LineLastTrainTimetable } from '../data/lastTrainTimetables';

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
  /** 同じ列車が路線境界を越えるときも共通のID（ない場合は従来の路線単位フォールバック）。 */
  tripId?: string;
  depart: number;
  arrive: number;
  /** 'real' = 実際の時刻表（data/lastTrainTimetables.ts）。省略 = 架空のデモダイヤ（駅名の下の時刻に「*」が付く） */
  quality?: 'real';
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
 * 到着駅へ直接乗り入れる路線は全件採用し、残り枠を乗換1回の路線から順番に拡張する。
 * 例えば到着駅に1路線だけなら、直接路線1本+接続路線4本で計5路線（既定値）。
 * 直接乗り入れる路線が指定上限を超える場合は、直接路線を優先して残す。
 * 入力ダイヤは全て架空で、時刻表の正確さを意味しない。
 *
 * maxLines に Infinity を渡すと、到着駅からたどれる路線をすべて含める（直接つながらない路線の駅にも終電時刻を付けるため。
 * 2026-11-14 ユーザー指示）。画面に最初から出す路線の数は、従来どおり上限つきで作ったものを使う。
 */
export interface DestinationDemoNetwork {
  lines: DemoLine[];
  stations: Station[];
  legs: DemoLeg[];
  limited: boolean;
}

export function buildDestinationDemoNetwork(
  destination: string,
  maxLines: number = DEFAULT_ROUTE_RECOMMENDATION_LIMIT,
): DestinationDemoNetwork {
  const allKeys = Object.keys(routes) as RouteKey[];
  const onStation = allKeys.filter(key => routes[key].some(st => st.name === destination));
  if (onStation.length === 0 || Number.isNaN(maxLines) || maxLines < 1) {
    return { lines: [], stations: [], legs: [], limited: false };
  }

  // 既存の「乗換なしで直通する系統」も直接つながる路線として扱う。
  // ただし現在の架空デモで列車IDを連続させている2路線系統に限定する。
  // セクションの区間に目的地が含まれない（例: 新宿と千代田線の直通）ものは含めない。
  const directThrough = new Set<RouteKey>();
  for (const service of THROUGH_SERVICES) {
    if (service.sections.length !== 2) continue;
    const includesDestination = service.sections.some(section => {
      const stations = routes[section.route];
      const start = section.from ? stations.findIndex(st => st.name === section.from) : 0;
      const end = section.to ? stations.findIndex(st => st.name === section.to) : stations.length - 1;
      const position = stations.findIndex(st => st.name === destination);
      return start >= 0 && end >= 0 && position >= Math.min(start, end) && position <= Math.max(start, end);
    });
    if (includesDestination) {
      for (const section of service.sections) directThrough.add(section.route);
    }
  }
  const direct = allKeys.filter(key => onStation.includes(key) || directThrough.has(key));

  // 表示上限より直接乗入路線が多い場合も省略しない。
  const cap = Math.max(direct.length, Math.floor(maxLines));
  const selected: RouteKey[] = [...direct];
  const selectedSet = new Set<RouteKey>(direct);
  const allSelectedStationNames = new Set(direct.flatMap(key => routes[key].map(st => st.name)));
  let frontier = new Set(allSelectedStationNames);

  // 既存の直通系統を優先するが、系統外の路線を勝手に直通列車扱いしない。
  const directSet = new Set<RouteKey>(direct);
  const throughPriority = new Set(THROUGH_SERVICES
    .filter(service => service.sections.some(sec => directSet.has(sec.route)))
    .flatMap(service => service.sections.map(sec => sec.route)));

  // BFS: 直通路線 → 乗換1回で接続 → 2回... の順。候補上限に達したら終了。
  while (selected.length < cap && frontier.size > 0) {
    const candidates = allKeys.filter(key => !selectedSet.has(key) &&
      routes[key].length >= 2 && routes[key].some(st => frontier.has(st.name)));
    if (candidates.length === 0) break;
    const score = (key: RouteKey) =>
      (throughPriority.has(key) ? 5000 : 0) +
      routes[key].filter(st => frontier.has(st.name)).length * 100 -
      Math.min(routes[key].length, 200);
    candidates.sort((a, b) => score(b) - score(a) || allKeys.indexOf(a) - allKeys.indexOf(b));

    const nextFrontier = new Set<string>();
    for (const key of candidates) {
      if (selected.length >= cap) break;
      selected.push(key);
      selectedSet.add(key);
      for (const st of routes[key]) {
        if (!allSelectedStationNames.has(st.name)) nextFrontier.add(st.name);
        allSelectedStationNames.add(st.name);
      }
    }
    frontier = nextFrontier;
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
    !selectedSet.has(key) && routes[key].some(st => allSelectedStationNames.has(st.name))
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
export function buildDemoLegs(
  lines: readonly DemoLine[] = DEMO_LINES,
  realTimetables: readonly LineLastTrainTimetable[] = LAST_TRAIN_TIMETABLES,
): DemoLeg[] {
  const result: DemoLeg[] = [];
  // 実データのある路線は、架空のダイヤを作らず実データを使う（路線の単位で切り替える）
  const realKeys = new Set(realTimetables.map(t => t.routeKey));
  for (const line of lines) {
    if (realKeys.has(line.routeKey)) continue;
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
            tripId: `line:${line.id}:${reversed ? 'reverse' : 'forward'}:${origin}`,
            depart: cursor, arrive: cursor + duration,
          });
          cursor += duration;
        }
      }
    }
  }
  result.push(...buildDemoThroughLegs(lines.filter(line => !realKeys.has(line.routeKey))));
  for (const timetable of realTimetables) {
    if (lines.some(line => line.routeKey === timetable.routeKey)) result.push(...legsFromRealTimetable(timetable));
  }
  return result;
}

/** "HH:MM"（24以上の時も可）を、0時からの分に直す。書き方が違うときは null */
export function parseTimetableClock(value: string): number | null {
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  return hours > 29 ? null : hours * 60 + Number(match[2]);
}

/**
 * 実際の時刻表（data/lastTrainTimetables.ts）を、架空のデモダイヤと同じ形（駅間の列車）に展開する。
 * 以降の計算（calculateDemoLastTrain）は、架空か実データかを区別せずに同じ処理で行う。
 */
export function legsFromRealTimetable(timetable: LineLastTrainTimetable): DemoLeg[] {
  const result: DemoLeg[] = [];
  for (const trip of timetable.trips) {
    for (let i = 0; i < trip.stops.length - 1; i++) {
      const from = trip.stops[i];
      const to = trip.stops[i + 1];
      const depart = parseTimetableClock(from.time);
      const arrive = parseTimetableClock(to.time);
      if (depart === null || arrive === null || arrive < depart) continue;
      result.push({
        from: from.station, to: to.station, lineId: timetable.routeKey,
        tripId: `real:${timetable.routeKey}:${trip.id}`,
        depart, arrive, quality: 'real',
      });
    }
  }
  return result;
}

/**
 * throughServicesで確認済みの路線間接続について、同じ列車IDで跨ぐ架空便を生成する。
 * 終点で折り返す通常便は上の路線ごとのデモ便として残す。
 * 現状は共有する接続駅が明確な2路線の定義だけ対象とする（実時刻は生成しない）。
 */
export function buildDemoThroughLegs(
  lines: readonly DemoLine[],
  services: readonly ThroughService[] = THROUGH_SERVICES,
): DemoLeg[] {
  const byKey = new Map(lines.map(line => [line.routeKey, line] as const));
  const result: DemoLeg[] = [];
  for (const service of services) {
    if (service.sections.length !== 2 || service.sections.some(sec => !byKey.has(sec.route))) continue;
    const sections = service.sections.map(sec => {
      const src = routes[sec.route];
      const start = sec.from ? src.findIndex(st => st.name === sec.from) : 0;
      const end = sec.to ? src.findIndex(st => st.name === sec.to) : src.length - 1;
      if (start < 0 || end < 0) return null;
      const seq = start <= end ? src.slice(start, end + 1) : src.slice(end, start + 1).reverse();
      return { routeKey: sec.route, seq, original: src };
    });
    const first = sections[0], second = sections[1];
    if (!first || !second || first.seq.length < 2 || second.seq.length < 2) continue;
    if (first.seq[first.seq.length - 1].name !== second.seq[0].name) continue;

    const edges: { from: string; to: string; lineId: string; minutes: number }[] = [];
    for (const sec of [first, second]) {
      for (let i = 0; i < sec.seq.length - 1; i++) {
        const from = sec.seq[i], to = sec.seq[i + 1];
        const originalIndex = sec.original.findIndex(st => st.name === from.name);
        const nextIndex = sec.original.findIndex(st => st.name === to.name);
        const forwardIndex = Math.min(originalIndex, nextIndex);
        const base = sec.original[forwardIndex]?.timeToNext;
        edges.push({ from: from.name, to: to.name, lineId: sec.routeKey,
          minutes: Math.max(1, base ?? 2) });
      }
    }
    const lastOrigin = Math.min(...service.sections.map(sec => byKey.get(sec.route)!.lastOrigin));
    for (const reversed of [false, true]) {
      const journey = reversed
        ? [...edges].reverse().map(edge => ({ ...edge, from: edge.to, to: edge.from }))
        : edges;
      for (let origin = 21 * 60 + 40; origin <= lastOrigin; origin += 24) {
        let cursor = origin;
        const tripId = `through:${service.id}:${reversed ? 'reverse' : 'forward'}:${origin}`;
        for (const edge of journey) {
          result.push({ from: edge.from, to: edge.to, lineId: edge.lineId,
            tripId, depart: cursor, arrive: cursor + edge.minutes });
          cursor += edge.minutes;
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
  /** 最遅時刻が実際の時刻表（data/lastTrainTimetables.ts）によるもの。無い駅は架空のデモダイヤ（時刻に「*」を付ける） */
  latestIsReal: Set<string>;
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
  // station → tripId → その列車で目的地に着ける最遅の次便出発時刻
  const latestByTrip = new Map<string, Map<string, number>>();
  const latestAny = new Map<string, number>();
  const feasibleLegs: DemoLeg[] = [];
  const latestIsReal = new Set<string>();
  const sorted = [...legs].sort((a, b) => b.depart - a.depart);
  for (const leg of sorted) {
    if (leg.from === destination) continue;
    const tripKey = leg.tripId ?? leg.lineId;
    const sameTrip = latestByTrip.get(leg.to)?.get(tripKey);
    const transfer = latestAny.get(leg.to);
    const canFinish = leg.to === destination
      || (sameTrip !== undefined && leg.arrive <= sameTrip)
      || (transfer !== undefined && leg.arrive + transferMinutes <= transfer);
    if (!canFinish) continue;
    feasibleLegs.push(leg);
    const state = latestByTrip.get(leg.from) ?? new Map<string, number>();
    state.set(tripKey, Math.max(state.get(tripKey) ?? -Infinity, leg.depart));
    latestByTrip.set(leg.from, state);
    // 最遅の出発をつくる便が実データなら、その駅の時刻は実データ（便は出発の遅い順に処理しているので、最初に入った便が最遅）
    if (!latestAny.has(leg.from) || leg.depart > latestAny.get(leg.from)!) {
      latestAny.set(leg.from, leg.depart);
      if (leg.quality === 'real') latestIsReal.add(leg.from); else latestIsReal.delete(leg.from);
    }
  }
  const latestDeparture = latestAny;
  return { latestDeparture, feasibleLegs, latestIsReal };
}

export function availableDemoStations(
  latest: ReadonlyMap<string, number>, destination: string, atTime: number,
): string[] {
  return [...latest].filter(([name, minute]) => name !== destination && minute >= atTime)
    .map(([name]) => name);
}
