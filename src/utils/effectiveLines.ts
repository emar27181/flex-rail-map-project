/**
 * 駅に実質何本の「路線」が来ているかを数える（乗換駅の判定用）。
 *
 * 路線データは運行系統ごとに分かれているため、同じ線路を走る別系統
 * （藤沢〜大船の東海道線（上野東京ライン）と湘南新宿ラインなど）を
 * そのまま数えると、辻堂のように乗り換えようのない駅まで「2路線＝乗換駅」
 * になっていた。
 *
 * 各路線について、その駅の隣の駅（前後）の集合を取り、
 * - 隣の駅が同じ、または一方がもう一方に含まれる（片方がその駅で終点）
 *   路線どうしは、同じ線路を走っているとみなして1本にまとめる
 * - まとめた後に残る本数を「実質の路線数」とする
 * 別の方向へ分かれる・交わる路線があって初めて2本以上になる。
 *
 * 同名の別駅（大宮〈埼玉〉と大宮〈京都〉など）は座標で分けて数え、
 * 駅名単位の値には最大のものを使う。
 */
import { approxDistanceKm, SAME_STATION_MAX_KM } from './sameStation';

interface StationLike {
  name: string;
  lat: number;
  lng: number;
}

/** 同じ駅名のうち、座標の近いものを1つの駅として扱うためのまとまり */
interface Cluster {
  lat: number;
  lng: number;
  /** 路線ごとの隣の駅の集合 */
  neighborsByRoute: Map<string, Set<string>>;
}

function isSubset(a: Set<string>, b: Set<string>): boolean {
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

/** 隣の駅の集合の並びから、実質の本数を数える */
export function countDistinctLines(neighborSets: Set<string>[]): number {
  // 大きい集合から見て、既に数えた集合に含まれるものは同じ線路とみなす
  const sorted = [...neighborSets].sort((a, b) => b.size - a.size);
  const kept: Set<string>[] = [];
  for (const s of sorted) {
    if (!kept.some(k => isSubset(s, k))) kept.push(s);
  }
  return kept.length;
}

/**
 * 駅名 → 実質の路線数。
 * routeEntries は [路線キー, 駅列] の並び（routes の Object.entries をそのまま渡せる）。
 */
export function buildEffectiveLineCounts(routeEntries: Array<[string, StationLike[]]>): Map<string, number> {
  const clustersByName = new Map<string, Cluster[]>();

  const clusterFor = (s: StationLike): Cluster => {
    const list = clustersByName.get(s.name) ?? [];
    let c = list.find(c => approxDistanceKm(c.lat, c.lng, s.lat, s.lng) <= SAME_STATION_MAX_KM);
    if (!c) {
      c = { lat: s.lat, lng: s.lng, neighborsByRoute: new Map() };
      list.push(c);
      clustersByName.set(s.name, list);
    }
    return c;
  };

  for (const [routeKey, stations] of routeEntries) {
    stations.forEach((s, i) => {
      const c = clusterFor(s);
      const set = c.neighborsByRoute.get(routeKey) ?? new Set<string>();
      if (i > 0 && stations[i - 1].name !== s.name) set.add(stations[i - 1].name);
      if (i < stations.length - 1 && stations[i + 1].name !== s.name) set.add(stations[i + 1].name);
      c.neighborsByRoute.set(routeKey, set);
    });
  }

  const result = new Map<string, number>();
  for (const [name, clusters] of clustersByName) {
    let max = 0;
    for (const c of clusters) max = Math.max(max, countDistinctLines([...c.neighborsByRoute.values()]));
    result.set(name, max);
  }
  return result;
}
