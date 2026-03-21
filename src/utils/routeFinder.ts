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

export interface RouteSegment {
  routeKey: RouteKey;
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

  findStationsWithinTime(baseStation: Station, maxTime: number, visibleRoutes?: Set<RouteKey>): StationWithTime[] {
    const result: StationWithTime[] = [];
    const visited = new Set<string>();

    // 全ての駅を探索
    Object.entries(routes).forEach(([routeKey, stations]) => {
      // 表示路線でフィルター（指定されている場合）
      if (visibleRoutes && !visibleRoutes.has(routeKey as RouteKey)) {
        return;
      }

      stations.forEach(station => {
        if (station.name === baseStation.name || visited.has(station.name)) {
          return;
        }

        // 基準駅からこの駅への経路を探索
        const routeResults = this.routeFinder.findRoutes(baseStation, station, 1);
        if (routeResults.length > 0) {
          const bestRoute = routeResults[0];
          if (bestRoute.totalTime <= maxTime) {
            result.push({
              station,
              totalTime: bestRoute.totalTime,
              routePath: bestRoute.segments
            });
            visited.add(station.name);
            console.log(`TimeFilter: ${station.name} included (${bestRoute.totalTime} min <= ${maxTime} min)`);
          } else {
            console.log(`TimeFilter: ${station.name} filtered out (${bestRoute.totalTime} min > ${maxTime} min)`);
          }
        }
      });
    });

    // 基準駅自身も追加（0分）
    result.push({
      station: baseStation,
      totalTime: 0,
      routePath: []
    });

    return result.sort((a, b) => a.totalTime - b.totalTime);
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

      while (queue.length > 0) {
        const current = queue.shift()!;

        // Limit to 2 transfers maximum
        if (current.transfers >= 2) continue;

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
    const normalizeRouteKey = (routeKey: RouteKey): string => {
      if (routeKey === 'tokaido' || routeKey === 'jrTokaidoMainLine' || routeKey === 'jrTokaidoKanagawa') {
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

    // Filter out routes that are more than 1.5x the best time
    if (uniqueResults.length > 0) {
      const bestTime = Math.min(...uniqueResults.map(r => r.totalTime));
      const maxReasonableTime = bestTime * 1.5;
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