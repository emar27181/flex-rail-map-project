/**
 * 集合駅を探す（複数の出発駅から、お互いに行きやすい駅を探す）計算。
 *
 * 出発駅ごとに、全駅までの最短所要時間（ダイクストラ。routeFinder.findStationsWithinTime）を求め、
 * 駅ごとに「全員が着く時間」を比べる。UIには依存しない（画面は RailwayMap / StationSelector）。
 *
 * 並べ方: 「いちばん遅い人の所要時間」が短い順（待たされる人を作らない）。同じなら合計が短い順。
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
}

/** 計算する所要時間の上限（分）。これを超える駅は集合駅の候補にしない */
export const MEETING_MAX_MINUTES = 120;
/** 駅ラベルで、どの出発駅からの時間かを示す駅名の文字数（先頭から） */
export const MEETING_LABEL_NAME_CHARS = 3;
/** 画面に出す候補の数 */
export const MEETING_RESULT_LIMIT = 5;

/**
 * @param timeMaps 出発駅ごとの「駅名 → 所要時間(分)」。出発駅の並びは呼び出し側が決める
 * @returns 全員が行ける駅だけを、いちばん遅い人の所要時間が短い順に並べたもの。
 *          出発駅そのものは候補に含める（1人の駅に全員が集まる形も有り得るため）
 */
export function rankMeetingStations(
  originNames: string[],
  timeMaps: Array<Map<string, number>>,
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
    result.push({ name, times, max: Math.max(...times), sum: times.reduce((a, b) => a + b, 0) });
  }
  return result.sort((a, b) => a.max - b.max || a.sum - b.sum || a.name.localeCompare(b.name, 'ja'));
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
