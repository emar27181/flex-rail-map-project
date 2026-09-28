/**
 * 選んだ経路の区間と並行して走る「別の路線」の区間を探す。
 *
 * 出発・到着を選ぶと地図は経路の区間だけを描くが、藤沢→東京で東海道線だけが
 * 出ていると、遅延・運休のときに京浜東北線（大船〜東京、根岸線回り）や
 * 横須賀線（大船〜東京、武蔵小杉回り）へ逃げられることが地図から分からない。
 * 経路候補の順位（所要時間）に頼ると、こうした「わざと別の路線で行く」道は
 * 上位に入らないので、路線の形から直接探す。
 *
 * ある路線 Q が経路の区間（路線 R）と次の条件を満たすとき、Q の区間を並行ルートとする。
 * - 区間の駅を MIN_SHARED 駅以上通る（乗り換えて乗り継げる、実際に並行している）
 * - 共通の駅の間で、区間に無い駅を1つ以上通る（別の線路・別の道を通る。
 *   同じ駅だけを通る系統〈湘南新宿ラインの藤沢〜横浜など〉は、線を増やすだけなので除く）
 * - 遠回りしすぎない（山手線で品川→東京を大崎・新宿回りで結ぶような区間は除く）
 * 既に選んだ並行ルートで新しい駅が全部描かれている路線（京浜東北線と同じ駅を通る
 * 山手線など）も、線を増やすだけなので除く。
 */
import { approxDistanceKm, isSameStation } from './sameStation';

interface StationLike {
  name: string;
  lat: number;
  lng: number;
}

export interface JourneySegment<K extends string = string> {
  routeKey: K;
  stations: StationLike[];
}

/** 並行とみなすのに必要な、区間と共通の駅の数 */
export const MIN_SHARED = 3;
/** 並行ルートの長さが、同じ2駅間の経路の区間の長さの何倍までなら許すか */
export const MAX_DETOUR_RATIO = 2;

function pathKm(stations: StationLike[]): number {
  let km = 0;
  for (let i = 1; i < stations.length; i++) {
    km += approxDistanceKm(stations[i - 1].lat, stations[i - 1].lng, stations[i].lat, stations[i].lng);
  }
  return km;
}

/**
 * 並行ルートの区間を路線ごとに返す（経路そのものの路線・区間は含まない）。
 * routeEntries は [路線キー, 駅列]（routes の Object.entries をそのまま渡せる）。
 */
export function findParallelSections<K extends string>(
  segments: JourneySegment<K>[],
  routeEntries: Array<[K, StationLike[]]>,
): Map<K, StationLike[][]> {
  const result = new Map<K, StationLike[][]>();
  const covered = new Set<string>();
  segments.forEach(seg => seg.stations.forEach(s => covered.add(s.name)));

  for (const seg of segments) {
    if (seg.stations.length < 2) continue;
    const candidates: Array<{ key: K; section: StationLike[]; shared: number }> = [];

    for (const [key, list] of routeEntries) {
      if (key === seg.routeKey) continue;
      // 区間の駅それぞれについて、この路線での位置
      const hits: Array<{ segIdx: number; routeIdx: number }> = [];
      seg.stations.forEach((s, segIdx) => {
        const routeIdx = list.findIndex(x => isSameStation(x, s));
        if (routeIdx !== -1) hits.push({ segIdx, routeIdx });
      });
      if (hits.length < MIN_SHARED) continue;

      const first = hits[0];
      const last = hits[hits.length - 1];
      const [a, b] = first.routeIdx <= last.routeIdx ? [first.routeIdx, last.routeIdx] : [last.routeIdx, first.routeIdx];
      let section = list.slice(a, b + 1);
      if (first.routeIdx > last.routeIdx) section = [...section].reverse();

      const segNames = new Set(seg.stations.map(s => s.name));
      if (!section.some(s => !segNames.has(s.name))) continue; // 同じ駅だけ＝同じ道

      const mainKm = pathKm(seg.stations.slice(first.segIdx, last.segIdx + 1));
      if (mainKm > 0 && pathKm(section) > mainKm * MAX_DETOUR_RATIO) continue; // 遠回り

      candidates.push({ key, section, shared: hits.length });
    }

    // 共通の駅が多い（よく並行している）路線から採用し、新しい駅が無くなった路線は除く
    candidates.sort((x, y) => y.shared - x.shared);
    for (const c of candidates) {
      if (!c.section.some(s => !covered.has(s.name))) continue;
      c.section.forEach(s => covered.add(s.name));
      result.set(c.key, [...(result.get(c.key) ?? []), c.section]);
    }
  }
  return result;
}
