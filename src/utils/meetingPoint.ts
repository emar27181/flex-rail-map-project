/**
 * 集合駅を探す（複数の出発駅から、お互いに行きやすい駅を探す）計算。
 *
 * 出発駅ごとに、全駅までの最短所要時間（ダイクストラ。routeFinder.findStationsWithinTime）を求め、
 * 駅ごとに「全員が着く時間」を比べる。UIには依存しない（画面は RailwayMap / StationSelector）。
 *
 * 並べ方: 既定は「いちばん遅い人の所要時間」が短い順（待たされる人を作らない）。同じなら合計が短い順。
 * 3人以上のときは、偏りの設定（5段階）で、全員が同じくらい ←→ 人の多い側に寄せる（合計が短い順）を切り替えられる。
 * 所要時間は路線データの駅間時間と乗換ペナルティによる目安で、実際のダイヤではない。
 */

import { addMinutes } from '../data/timetableData';

export interface MeetingCandidate {
  /** 集合駅の名前 */
  name: string;
  /** 出発駅ごとの所要時間（分）。origins と同じ並び */
  times: number[];
  /** いちばん遅い人の所要時間（分） */
  max: number;
  /** 全員の所要時間の合計（分） */
  sum: number;
  /** 並べ替えの点数（小さいほど上）。偏りの設定（balance）で、最大と平均を混ぜた値 */
  score: number;
}

/** 計算する所要時間の上限（分）。これを超える駅は集合駅の候補にしない */
export const MEETING_MAX_MINUTES = 120;
/** 偏りの設定の段階数（0 〜 段階数-1）。0 = 全員が同じくらい、いちばん大きい値 = 人の多い側に寄せる */
export const MEETING_BALANCE_LEVELS = 5;
/** 偏りの設定の初期値（全員が同じくらい） */
export const MEETING_BALANCE_DEFAULT = 0;

/** 段階 → 平均の重み（0〜1）。段階が上がるほど平均（人の多い側に寄る）の割合が増える */
export function meetingBalanceWeight(level: number): number {
  const clamped = Math.min(Math.max(Math.round(level), 0), MEETING_BALANCE_LEVELS - 1);
  return clamped / (MEETING_BALANCE_LEVELS - 1);
}

/** 一覧に出す候補の最大件数 */
export const MEETING_RESULT_LIMIT = 15;
/** 到着駅を選ぶ前に、地図に駅名と経路を描く候補の最大件数 */
export const MEETING_MAP_CANDIDATE_LIMIT = 5;

/**
 * @param timeMaps 出発駅ごとの「駅名 → 所要時間(分)」。出発駅の並びは呼び出し側が決める
 * @returns 全員が行ける駅だけを、いちばん遅い人の所要時間が短い順に並べたもの。
 *          出発駅そのものは候補に含める（1人の駅に全員が集まる形も有り得るため）
 */
export function rankMeetingStations(
  originNames: string[],
  timeMaps: Array<Map<string, number>>,
  balance: number = MEETING_BALANCE_DEFAULT,
): MeetingCandidate[] {
  if (timeMaps.length < 2) return [];
  // 出発駅自身の所要時間は 0 分（探索結果に含まれない場合に備えて補う）
  const maps = timeMaps.map((m, i) => {
    const copy = new Map(m);
    if (!copy.has(originNames[i])) copy.set(originNames[i], 0);
    return copy;
  });

  const result: MeetingCandidate[] = [];
  for (const [name] of maps[0]) {
    const times: number[] = [];
    for (const m of maps) {
      const t = m.get(name);
      if (t === undefined) break;
      times.push(Math.round(t));
    }
    if (times.length !== maps.length) continue;
    const max = Math.max(...times);
    const sum = times.reduce((a, b) => a + b, 0);
    // 点数 = 最大 × (1-w) + 平均 × w。w=0 は「待たされる人を作らない」（全員が同じくらい）、
    // w=1 は合計が最小（駅が近くに固まっている人の多い側に寄る = 重心に近い）
    const w = meetingBalanceWeight(balance);
    result.push({ name, times, max, sum, score: max * (1 - w) + (sum / times.length) * w });
  }
  return result.sort((a, b) => a.score - b.score || a.max - b.max || a.sum - b.sum || a.name.localeCompare(b.name, 'ja'));
}

/** 集合駅までの、出発駅ごとのルート（使う路線の並び） */
export interface MeetingRouteEntry {
  /** 出発駅の名前 */
  origin: string;
  /** 乗る路線（同じ路線が続くときは1つにまとめる。徒歩の乗換は含めない） */
  lines: string[];
  /** 所要時間（分）。ルートが無いときは null */
  totalTime: number | null;
  transfers: number;
}

interface RouteLike {
  totalTime: number;
  transfers: number;
  segments: Array<{ routeKey: string; isWalkingTransfer?: boolean }>;
}

/**
 * 出発駅ごとに、集合駅までのいちばん良いルートで使う路線を並べる。
 * ルートの探索そのものは findRoute（routeFinder.findRoutes の先頭）に任せ、ここは整理だけ。
 */
export function summarizeMeetingRoutes(
  originNames: string[],
  arrivalName: string,
  findRoute: (origin: string) => RouteLike | null,
): MeetingRouteEntry[] {
  return originNames.map(origin => {
    if (origin === arrivalName) return { origin, lines: [], totalTime: 0, transfers: 0 };
    const route = findRoute(origin);
    if (!route) return { origin, lines: [], totalTime: null, transfers: 0 };
    const lines: string[] = [];
    for (const seg of route.segments) {
      if (!seg.routeKey || seg.routeKey === 'walking' || seg.isWalkingTransfer) continue;
      if (lines[lines.length - 1] !== seg.routeKey) lines.push(seg.routeKey);
    }
    return { origin, lines, totalTime: Math.round(route.totalTime), transfers: route.transfers };
  });
}

/**
 * 基準の時刻（駅選択パネルの時刻）と所要時間から、出発駅ごとの「何時に出て何時に着くか」を求める。
 *
 * - 出発基準（'departure'）: 全員が基準の時刻に出発し、着く時刻は所要時間の分だけ後になる
 * - 到着基準（'arrival'）: 全員が基準の時刻に着き、出発する時刻は所要時間の分だけ前になる
 * 出発駅どうしに優先は無い（誰も特別扱いしない）。所要時間は路線データによる目安。
 */
export function meetingClockTimes(
  baseTime: string,
  mode: 'departure' | 'arrival',
  totalMinutes: number,
): { depart: string; arrive: string } {
  return mode === 'arrival'
    ? { depart: addMinutes(baseTime, -totalMinutes), arrive: baseTime }
    : { depart: baseTime, arrive: addMinutes(baseTime, totalMinutes) };
}

/**
 * 出発駅ごとの経路の並びを、順位の順に交互に1本の並びにする（1位どうし → 2位どうし → …）。
 * 最初に入力した出発駅の経路だけが先頭に並ぶ、ということがないようにする。
 */
export function interleaveByRank<T>(lists: T[][]): T[] {
  const result: T[] = [];
  const longest = Math.max(0, ...lists.map(l => l.length));
  for (let rank = 0; rank < longest; rank++) {
    for (const list of lists) {
      if (rank < list.length) result.push(list[rank]);
    }
  }
  return result;
}

/**
 * 隣り合う2駅の間（路線の区間）に出す所要時間。出発駅それぞれの最短所要時間（ダイクストラ）から決める。
 *
 * 各出発駅から見た区間の時間 = 区間の遠い側の駅までの所要時間（出発駅から離れるほど増える）。
 * 出発駅が複数あるときは、いちばん近い出発駅から見た時間（最小）を出す。
 * これで、出発駅どうしの間の路線では、それぞれの出発駅の側から数字が増えていく。
 * どの出発駅も出発駅どうしを区別しない（最初の入力も追加した入力も同じ扱い）。
 *
 * @param timeMaps 出発駅ごとの「駅名 → 所要時間(分)」
 * @returns 分。どの出発駅からも両端の駅に行けないときは undefined
 */
export function meetingEdgeMinutes(
  timeMaps: ReadonlyArray<ReadonlyMap<string, number>>,
  stationA: string,
  stationB: string,
): number | undefined {
  let best: number | undefined;
  for (const m of timeMaps) {
    const a = m.get(stationA);
    const b = m.get(stationB);
    if (a === undefined || b === undefined) continue;
    const far = Math.max(a, b);
    if (best === undefined || far < best) best = far;
  }
  return best === undefined ? undefined : Math.round(best);
}
