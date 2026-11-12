/**
 * 集合駅を探す（複数の出発駅から、お互いに行きやすい駅を探す）計算。
 *
 * 出発駅ごとに、全駅までの最短所要時間（ダイクストラ。routeFinder.findStationsWithinTime）を求め、
 * 駅ごとに「全員が着く時間」を比べる。UIには依存しない（画面は RailwayMap / StationSelector）。
 *
 * 並べ方: 「いちばん遅い人の所要時間」が短い順（待たされる人を作らない）。同じなら合計が短い順。
 * 所要時間は路線データの駅間時間と乗換ペナルティによる目安で、実際のダイヤではない。
 */

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
