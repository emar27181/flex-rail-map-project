import { routes, type RouteKey, routeNames } from '../data/routes';
import type { Station } from '../data/yamanote';
import { getWalkingTransferStations, getWalkingTime } from '../data/walkingTransfers';

// ---- 距離計算 ----
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---- 路線カテゴリ ----
// 長距離専用（新幹線）は短距離では非現実的
const SHINKANSEN_ROUTES: Set<RouteKey> = new Set([
  'tokaidoShinkansen',
  'jrKobeLine',
  'jrKyotoLine',
] as RouteKey[]);

// 新幹線を使う最低限の直線距離（km）
const MIN_KM_FOR_SHINKANSEN = 80;
// 新幹線乗車オーバーヘッド：チケット購入・改札・ホーム移動 (分)
const SHINKANSEN_OVERHEAD_MIN = 30;
// 乗換ペナルティ（東京の実測ベース：約12分）
const TRANSFER_PENALTY_MIN = 12;
const TRANSFER_PENALTY_HUB_MIN = 8; // 主要ターミナルは少し短い
// 迂回率の上限（直線距離に対する経路の比率）
const MAX_DETOUR_RATIO = 2.2;
// 所要時間探索で許す乗換回数の上限。findRoutes の「2回まで」に合わせる
const MAX_TRANSFERS_FOR_TIME_SEARCH = 2;

/**
 * 最小ヒープ。
 * 単一始点最短路の探索で「次に見るべき最小コスト」を取り出すために使う。
 * 配列を毎回 sort すると駅数に対して現実的な速度が出ない。
 */
class MinHeap<T> {
  private items: T[] = [];
  constructor(private compare: (a: T, b: T) => number) {}
  get size(): number { return this.items.length; }
  push(item: T): void {
    this.items.push(item);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.items[i], this.items[parent]) >= 0) break;
      [this.items[i], this.items[parent]] = [this.items[parent], this.items[i]];
      i = parent;
    }
  }
  pop(): T | undefined {
    if (this.items.length === 0) return undefined;
    const top = this.items[0];
    const last = this.items.pop()!;
    if (this.items.length > 0) {
      this.items[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1, r = l + 1;
        let smallest = i;
        if (l < this.items.length && this.compare(this.items[l], this.items[smallest]) < 0) smallest = l;
        if (r < this.items.length && this.compare(this.items[r], this.items[smallest]) < 0) smallest = r;
        if (smallest === i) break;
        [this.items[i], this.items[smallest]] = [this.items[smallest], this.items[i]];
        i = smallest;
      }
    }
    return top;
  }
}

export interface RouteSegment {
  /** 徒歩乗換区間は 'walking'（実路線を持たないためRouteKeyの外側の特別値） */
  routeKey: RouteKey | 'walking';
  routeName: string;
  stations: Station[];
  startIndex: number;
  endIndex: number;
  time: number;
  isWalkingTransfer?: boolean;
  walkingTime?: number;
}

export interface RouteResult {
  segments: RouteSegment[];
  totalTime: number;
  transfers: number;
}

interface StationNode {
  station: Station;
  routeKey: RouteKey;
  index: number;
}

interface PathNode {
  node: StationNode;
  path: RouteSegment[];
  totalTime: number;
  transfers: number;
}

export interface StationWithTime {
  station: Station;
  totalTime: number;
  routePath: RouteSegment[];
}

export class TimeFilter {
  private routeFinder: RouteFinder;

  constructor(routeFinder: RouteFinder) {
    this.routeFinder = routeFinder;
  }

  /**
   * 基準駅から maxTime 分以内で行ける駅を全部返す。
   * 実体は RouteFinder 側にある（駅と路線の索引を持っているのがあちらのため）。
   */
  findStationsWithinTime(baseStation: Station, maxTime: number, visibleRoutes?: Set<RouteKey>): StationWithTime[] {
    return this.routeFinder.findStationsWithinTime(baseStation, maxTime, visibleRoutes);
  }
}

export class RouteFinder {
  private stationToRoutes: Map<string, StationNode[]> = new Map();

  constructor() {
    this.buildStationIndex();
  }


  private buildStationIndex() {
    Object.entries(routes).forEach(([routeKey, stations]) => {
      stations.forEach((station, index) => {
        const node: StationNode = {
          station,
          routeKey: routeKey as RouteKey,
          index
        };

        if (!this.stationToRoutes.has(station.name)) {
          this.stationToRoutes.set(station.name, []);
        }
        this.stationToRoutes.get(station.name)!.push(node);
      });
    });
  }

  private calculateTime(route: Station[], startIndex: number, endIndex: number): number {
    let totalTime = 0;
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);

    for (let i = start; i < end; i++) {
      const station = route[i];
      if (station.timeToNext) {
        totalTime += station.timeToNext;
      } else {
        totalTime += 3;
      }
    }
    return totalTime;
  }

  private createRouteSegment(
    routeKey: RouteKey,
    stations: Station[],
    startIndex: number,
    endIndex: number
  ): RouteSegment {
    const isReverse = startIndex > endIndex;
    const segmentStations = isReverse
      ? stations.slice(endIndex, startIndex + 1).reverse()
      : stations.slice(startIndex, endIndex + 1);

    return {
      routeKey,
      routeName: routeNames[routeKey],
      stations: segmentStations,
      startIndex,
      endIndex,
      time: this.calculateTime(stations, startIndex, endIndex)
    };
  }

  findRoutes(departure: Station, arrival: Station, maxResults: number = 5): RouteResult[] {
    if (departure.name === arrival.name) {
      return [];
    }

    const departureNodes = this.stationToRoutes.get(departure.name) || [];
    const arrivalNodes = this.stationToRoutes.get(arrival.name) || [];

    if (departureNodes.length === 0 || arrivalNodes.length === 0) {
      return [];
    }

    // 出発〜到着の直線距離（迂回チェック・新幹線判定に使用）
    const directDistanceKm = haversineKm(
      departure.lat, departure.lng, arrival.lat, arrival.lng
    );
    const useShinkansenAllowed = directDistanceKm >= MIN_KM_FOR_SHINKANSEN;

    const results: RouteResult[] = [];

    // Find direct routes (same line)
    departureNodes.forEach(depNode => {
      // 新幹線で短距離は非現実的なのでスキップ
      if (SHINKANSEN_ROUTES.has(depNode.routeKey) && !useShinkansenAllowed) return;

      arrivalNodes.forEach(arrNode => {
        if (depNode.routeKey === arrNode.routeKey) {
          const segment = this.createRouteSegment(
            depNode.routeKey,
            routes[depNode.routeKey],
            depNode.index,
            arrNode.index
          );
          // 新幹線乗車オーバーヘッドを追加
          const overhead = SHINKANSEN_ROUTES.has(depNode.routeKey) ? SHINKANSEN_OVERHEAD_MIN : 0;
          results.push({
            segments: [segment],
            totalTime: segment.time + overhead,
            transfers: 0
          });
        }
      });
    });

    // Find routes with transfers
    departureNodes.forEach(depNode => {
      // 新幹線スタートで短距離はスキップ
      if (SHINKANSEN_ROUTES.has(depNode.routeKey) && !useShinkansenAllowed) return;

      const visited = new Set<string>();
      const queue: PathNode[] = [{
        node: depNode,
        path: [],
        totalTime: SHINKANSEN_ROUTES.has(depNode.routeKey) ? SHINKANSEN_OVERHEAD_MIN : 0,
        transfers: 0
      }];

      visited.add(`${depNode.station.name}-${depNode.routeKey}`);

      // 出発駅からの徒歩乗換を初期化（depNodeの駅に隣接する徒歩乗換先を最初から追加）
      const walkFromDep = getWalkingTransferStations(depNode.station.name);
      walkFromDep.forEach(walkTransfer => {
        const walkTarget = walkTransfer.station1 === depNode.station.name
          ? walkTransfer.station2
          : walkTransfer.station1;
        const walkTargetNodes = this.stationToRoutes.get(walkTarget) || [];
        walkTargetNodes.forEach(walkNode => {
          const wk = `${walkNode.station.name}-${walkNode.routeKey}`;
          if (!visited.has(wk)) {
            queue.push({
              node: walkNode,
              path: [],
              totalTime: walkTransfer.walkingTime + 2,
              transfers: 1
            });
            visited.add(wk);
          }
        });
      });

      while (queue.length > 0) {
        const current = queue.shift()!;

        const route = routes[current.node.routeKey];

        // Explore both directions on the current line
        for (let direction of [-1, 1]) {
          let currentIndex = current.node.index;
          let segmentTime = 0;
          let stationsVisited = 0;

          while (stationsVisited < 50) {
            const nextIndex = currentIndex + direction;
            if (nextIndex < 0 || nextIndex >= route.length) break;

            // Calculate time correctly for both directions
            const timeForThisSegment = direction === 1
              ? (route[currentIndex].timeToNext || 3)
              : (route[nextIndex].timeToNext || 3);
            segmentTime += timeForThisSegment;
            currentIndex = nextIndex;
            stationsVisited++;

            const nextStation = route[currentIndex];
            const visitKey = `${nextStation.name}-${current.node.routeKey}`;

            if (visited.has(visitKey)) continue;

            // 迂回率チェック: 現在地が出発地から大きく外れているものを枝刈り
            const distFromDeparture = haversineKm(
              departure.lat, departure.lng, nextStation.lat, nextStation.lng
            );
            const distFromArrival = haversineKm(
              nextStation.lat, nextStation.lng, arrival.lat, arrival.lng
            );
            if (
              directDistanceKm > 5 && // 近距離では迂回チェックを緩める
              distFromDeparture + distFromArrival > directDistanceKm * MAX_DETOUR_RATIO
            ) {
              visited.add(visitKey);
              continue;
            }

            const newSegment = this.createRouteSegment(
              current.node.routeKey,
              route,
              current.node.index,
              currentIndex
            );

            const newPath = [...current.path, newSegment];
            const newTotalTime = current.totalTime + segmentTime;

            // Check if we've reached the destination
            if (nextStation.name === arrival.name) {
              results.push({
                segments: newPath,
                totalTime: newTotalTime,
                transfers: current.transfers
              });
              continue;
            }

            // Look for transfer opportunities
            if (current.transfers < 2) {
              const transferNodes = this.stationToRoutes.get(nextStation.name) || [];
              const transferPenalty = this.getTransferPenalty(nextStation.name);

              transferNodes.forEach(transferNode => {
                // 短距離で新幹線への乗換はスキップ
                if (SHINKANSEN_ROUTES.has(transferNode.routeKey) && !useShinkansenAllowed) return;

                if (transferNode.routeKey !== current.node.routeKey) {
                  const transferKey = `${transferNode.station.name}-${transferNode.routeKey}`;
                  if (!visited.has(transferKey)) {
                    // 新幹線への乗換は追加オーバーヘッドを加算
                    const shinkansenOverhead =
                      SHINKANSEN_ROUTES.has(transferNode.routeKey) ? SHINKANSEN_OVERHEAD_MIN : 0;
                    queue.push({
                      node: transferNode,
                      path: newPath,
                      totalTime: newTotalTime + transferPenalty + shinkansenOverhead,
                      transfers: current.transfers + 1
                    });
                    visited.add(transferKey);
                  }
                }
              });

              // Check for walking transfers
              const walkingTransfers = getWalkingTransferStations(nextStation.name);
              walkingTransfers.forEach(walkTransfer => {
                const walkTargetStation = walkTransfer.station1 === nextStation.name
                  ? walkTransfer.station2
                  : walkTransfer.station1;

                const walkTargetNodes = this.stationToRoutes.get(walkTargetStation) || [];
                walkTargetNodes.forEach(walkTargetNode => {
                  if (SHINKANSEN_ROUTES.has(walkTargetNode.routeKey) && !useShinkansenAllowed) return;

                  if (walkTargetNode.routeKey !== current.node.routeKey) {
                    const walkTransferKey = `${walkTargetNode.station.name}-${walkTargetNode.routeKey}`;
                    if (!visited.has(walkTransferKey)) {
                      queue.push({
                        node: walkTargetNode,
                        path: newPath,
                        totalTime: newTotalTime + walkTransfer.walkingTime + 2,
                        transfers: current.transfers + 1
                      });
                      visited.add(walkTransferKey);
                    }
                  }
                });
              });
            }
          }
        }
      }
    });

    // Normalize route keys for duplicate detection (unify Tokaido lines)
    const normalizeRouteKey = (routeKey: RouteKey | 'walking'): string => {
      if (routeKey === 'jrTokaidoMainLine') {
        return 'tokaido-unified';
      }
      return routeKey;
    };

    // Remove duplicates and filter by time
    const uniqueResults = results.filter((result, index, self) => {
      return index === self.findIndex(r =>
        r.segments.length === result.segments.length &&
        r.segments.every((seg, i) => {
          const normalizedKey1 = normalizeRouteKey(seg.routeKey);
          const normalizedKey2 = normalizeRouteKey(result.segments[i].routeKey);
          return normalizedKey1 === normalizedKey2 &&
            seg.startIndex === result.segments[i].startIndex &&
            seg.endIndex === result.segments[i].endIndex;
        })
      );
    });

    // Filter out routes that are significantly slower than the best time
    // 2.5x を使用: 各駅停車換算でも急行・特急と比べると遅くなるため余裕を持たせる
    if (uniqueResults.length > 0) {
      const bestTime = Math.min(...uniqueResults.map(r => r.totalTime));
      const maxReasonableTime = bestTime * 2.5;
      const filteredResults = uniqueResults.filter(r => r.totalTime <= maxReasonableTime);

      // Sort by transfers first, then by time
      return filteredResults
        .sort((a, b) => {
          if (a.transfers !== b.transfers) {
            return a.transfers - b.transfers;
          }
          return a.totalTime - b.totalTime;
        })
        .slice(0, maxResults);
    }

    return uniqueResults
      .sort((a, b) => {
        if (a.transfers !== b.transfers) {
          return a.transfers - b.transfers;
        }
        return a.totalTime - b.totalTime;
      })
      .slice(0, maxResults);
  }


  // Transfer penalty calculation based on station type
  // 東京の実測データベース: 乗換は平均12分のコスト（待ち時間・歩行含む）
  /**
   * 基準駅から maxTime 分以内で行ける駅を全部返す。
   *
   * 以前は「全駅について findRoutes を1回ずつ呼ぶ」実装だった。
   * 駅が6,000ある今は経路探索を6,000回まわすことになり、
   * 所要時間表示をONにすると画面が数分固まって操作を受け付けなくなっていた
   * （駅ごとに console.log も出していた）。
   *
   * 基準駅は1つなので、単一始点最短路を1回解けば全駅ぶんの時間が同時に出る。
   * 探索の状態は「駅・路線・乗換回数」の組で、コスト（分）は findRoutes と揃える:
   * 駅間は timeToNext（無ければ3分）、乗換は駅ごとのペナルティ、
   * 徒歩乗換は徒歩時間+2分、新幹線は乗車オーバーヘッドを加算する。
   *
   * 戻り値の routePath は経路そのものではなく空配列を返す。
   * 呼び出し側は所要時間しか使っておらず、全駅ぶんの経路を組み立てると
   * それ自体が重くなるため。
   */
  findStationsWithinTime(baseStation: Station, maxTime: number, visibleRoutes?: Set<RouteKey>): StationWithTime[] {
    const isVisible = (routeKey: RouteKey) => !visibleRoutes || visibleRoutes.has(routeKey);

    /** 新幹線を許すのは基準駅から十分離れた駅だけ。近距離で新幹線に乗る経路は現実的でない */
    const shinkansenAllowedAt = (station: Station) =>
      haversineKm(baseStation.lat, baseStation.lng, station.lat, station.lng) >= MIN_KM_FOR_SHINKANSEN;

    type State = { key: string; node: StationNode; cost: number; transfers: number };
    const best = new Map<string, number>();
    const heap = new MinHeap<State>((a, b) => a.cost - b.cost);

    const push = (node: StationNode, cost: number, transfers: number) => {
      if (cost > maxTime) return;
      if (!isVisible(node.routeKey)) return;
      if (SHINKANSEN_ROUTES.has(node.routeKey) && !shinkansenAllowedAt(node.station)) return;
      const key = `${node.station.name}\u0000${node.routeKey}\u0000${transfers}`;
      const known = best.get(key);
      if (known !== undefined && known <= cost) return;
      best.set(key, cost);
      heap.push({ key, node, cost, transfers });
    };

    // 出発地点: 基準駅が属する全路線から始める
    (this.stationToRoutes.get(baseStation.name) || []).forEach(node => {
      const overhead = SHINKANSEN_ROUTES.has(node.routeKey) ? SHINKANSEN_OVERHEAD_MIN : 0;
      push(node, overhead, 0);
    });
    // 基準駅からの徒歩乗換
    getWalkingTransferStations(baseStation.name).forEach(walk => {
      const target = walk.station1 === baseStation.name ? walk.station2 : walk.station1;
      (this.stationToRoutes.get(target) || []).forEach(node => {
        push(node, walk.walkingTime + 2, 1);
      });
    });

    /** 駅名ごとの最短時間 */
    const arrivalTime = new Map<string, number>();
    const stationByName = new Map<string, Station>();

    while (heap.size > 0) {
      const cur = heap.pop()!;
      if ((best.get(cur.key) ?? Infinity) < cur.cost) continue; // 既により良い経路で確定済み

      const name = cur.node.station.name;
      if ((arrivalTime.get(name) ?? Infinity) > cur.cost) {
        arrivalTime.set(name, cur.cost);
        stationByName.set(name, cur.node.station);
      }

      const route = routes[cur.node.routeKey];

      // 同じ路線を前後に1駅ずつ進む
      for (const direction of [-1, 1] as const) {
        const nextIndex = cur.node.index + direction;
        if (nextIndex < 0 || nextIndex >= route.length) continue;
        // 進行方向によって参照する timeToNext が変わる（calculateTime と同じ規則）
        const stepTime = direction === 1
          ? (route[cur.node.index].timeToNext || 3)
          : (route[nextIndex].timeToNext || 3);
        push(
          { station: route[nextIndex], routeKey: cur.node.routeKey, index: nextIndex },
          cur.cost + stepTime,
          cur.transfers,
        );
      }

      if (cur.transfers >= MAX_TRANSFERS_FOR_TIME_SEARCH) continue;

      // 同じ駅で別路線に乗り換える
      const transferPenalty = this.getTransferPenalty(name);
      (this.stationToRoutes.get(name) || []).forEach(other => {
        if (other.routeKey === cur.node.routeKey) return;
        const overhead = SHINKANSEN_ROUTES.has(other.routeKey) ? SHINKANSEN_OVERHEAD_MIN : 0;
        push(other, cur.cost + transferPenalty + overhead, cur.transfers + 1);
      });

      // 徒歩での乗り換え
      getWalkingTransferStations(name).forEach(walk => {
        const target = walk.station1 === name ? walk.station2 : walk.station1;
        (this.stationToRoutes.get(target) || []).forEach(other => {
          if (other.routeKey === cur.node.routeKey) return;
          push(other, cur.cost + walk.walkingTime + 2, cur.transfers + 1);
        });
      });
    }

    const result: StationWithTime[] = [];
    arrivalTime.forEach((totalTime, name) => {
      if (name === baseStation.name) return;
      const station = stationByName.get(name);
      if (!station) return;
      result.push({ station, totalTime: Math.round(totalTime), routePath: [] });
    });

    // 基準駅自身も追加（0分）
    result.push({ station: baseStation, totalTime: 0, routePath: [] });

    return result.sort((a, b) => a.totalTime - b.totalTime);
  }

  private getTransferPenalty(stationName: string): number {
    const majorHubs = ['新宿', '東京', '渋谷', '池袋', '品川', '上野', '横浜', '大手町', '表参道', '新橋', '有楽町'];
    if (majorHubs.includes(stationName)) {
      return TRANSFER_PENALTY_HUB_MIN;
    }
    return TRANSFER_PENALTY_MIN;
  }

  // Debug method to check station registration
  debugStationRegistration(): void {
    console.log('=== Station Registration Debug ===');
    console.log(`Total stations registered: ${this.stationToRoutes.size}`);

    // Check specific stations
    const checkStations = ['藤沢', '相模大野', '新宿', '横浜', '渋谷'];
    checkStations.forEach(name => {
      const nodes = this.stationToRoutes.get(name);
      if (nodes) {
        console.log(`${name}: ${nodes.length} route(s) - ${nodes.map(n => n.routeKey).join(', ')}`);
      } else {
        console.log(`${name}: NOT FOUND`);
      }
    });
  }
}