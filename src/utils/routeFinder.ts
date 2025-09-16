import { routes, type RouteKey, routeNames } from '../data/routes';
import type { Station } from '../data/yamanote';
import { getWalkingTransferStations, getWalkingTime } from '../data/walkingTransfers';

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

  findRoutes(departure: Station, arrival: Station, maxResults: number = 10): RouteResult[] {
    if (departure.name === arrival.name) {
      return [];
    }

    const departureNodes = this.stationToRoutes.get(departure.name) || [];
    const arrivalNodes = this.stationToRoutes.get(arrival.name) || [];

    if (departureNodes.length === 0 || arrivalNodes.length === 0) {
      return [];
    }

    const allResults: RouteResult[] = [];

    // Find direct routes (same line) - highest priority
    departureNodes.forEach(depNode => {
      arrivalNodes.forEach(arrNode => {
        if (depNode.routeKey === arrNode.routeKey) {
          const segment = this.createRouteSegment(
            depNode.routeKey,
            routes[depNode.routeKey],
            depNode.index,
            arrNode.index
          );
          allResults.push({
            segments: [segment],
            totalTime: segment.time,
            transfers: 0
          });
        }
      });
    });

    // Find direct walking transfer routes
    this.findDirectWalkingRoutes(departure, arrival, allResults);

    // Find one-transfer routes
    this.findTransferRoutes(departureNodes, arrival, allResults, 1);

    // Find two-transfer routes if needed
    if (allResults.length < maxResults) {
      this.findTransferRoutes(departureNodes, arrival, allResults, 2);
    }

    // Remove exact duplicates
    const uniqueResults = this.removeDuplicateRoutes(allResults);

    // Diversify results to ensure different route combinations
    const diverseResults = this.diversifyRoutes(uniqueResults, maxResults);

    return diverseResults;
  }

  private findDirectWalkingRoutes(departure: Station, arrival: Station, results: RouteResult[]) {
    // 出発駅から歩行乗換可能な駅への直接歩行ルートを探索
    const walkingTransfers = getWalkingTransferStations(departure.name);
    
    walkingTransfers.forEach(walkTransfer => {
      const walkTargetStation = walkTransfer.station1 === departure.name 
        ? walkTransfer.station2 
        : walkTransfer.station1;
      
      // 歩行先の駅から到着駅への直接ルートがあるかチェック
      const walkTargetNodes = this.stationToRoutes.get(walkTargetStation) || [];
      const arrivalNodes = this.stationToRoutes.get(arrival.name) || [];
      
      walkTargetNodes.forEach(walkNode => {
        arrivalNodes.forEach(arrivalNode => {
          if (walkNode.routeKey === arrivalNode.routeKey) {
            // 歩行 + 1路線での直接ルート
            const trainSegment = this.createRouteSegment(
              walkNode.routeKey,
              routes[walkNode.routeKey],
              walkNode.index,
              arrivalNode.index
            );
            
            const walkingSegment: RouteSegment = {
              routeKey: 'walking' as RouteKey,
              routeName: `徒歩 (${walkTransfer.description || ''})`,
              stations: [departure, { name: walkTargetStation, lat: 0, lng: 0 }],
              startIndex: 0,
              endIndex: 1,
              time: walkTransfer.walkingTime,
              isWalkingTransfer: true,
              walkingTime: walkTransfer.walkingTime
            };
            
            results.push({
              segments: [walkingSegment, trainSegment],
              totalTime: walkTransfer.walkingTime + trainSegment.time,
              transfers: 1
            });
          }
        });
      });
    });
  }

  private findTransferRoutes(
    departureNodes: StationNode[], 
    arrival: Station, 
    results: RouteResult[], 
    maxTransfers: number
  ) {
    departureNodes.forEach(depNode => {
      const visited = new Set<string>();
      const queue: PathNode[] = [{
        node: depNode,
        path: [],
        totalTime: 0,
        transfers: 0
      }];

      visited.add(`${depNode.station.name}-${depNode.routeKey}`);

      while (queue.length > 0) {
        const current = queue.shift()!;

        if (current.transfers > maxTransfers) continue;

        const route = routes[current.node.routeKey];
        
        // Explore both directions on the current line
        for (let direction of [-1, 1]) {
          let currentIndex = current.node.index;
          let segmentTime = 0;
          let stationsVisited = 0;

          while (stationsVisited < 50) { // Prevent infinite loops
            const nextIndex = currentIndex + direction;
            if (nextIndex < 0 || nextIndex >= route.length) break;

            const currentStation = route[currentIndex];
            segmentTime += currentStation.timeToNext || 3;
            currentIndex = nextIndex;
            stationsVisited++;

            const nextStation = route[currentIndex];
            const visitKey = `${nextStation.name}-${current.node.routeKey}`;

            if (visited.has(visitKey)) continue;

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
            if (current.transfers < maxTransfers) {
              // 通常の乗換
              const transferNodes = this.stationToRoutes.get(nextStation.name) || [];
              transferNodes.forEach(transferNode => {
                if (transferNode.routeKey !== current.node.routeKey) {
                  const transferKey = `${transferNode.station.name}-${transferNode.routeKey}`;
                  if (!visited.has(transferKey)) {
                    queue.push({
                      node: transferNode,
                      path: newPath,
                      totalTime: newTotalTime + 5, // Transfer penalty
                      transfers: current.transfers + 1
                    });
                    visited.add(transferKey);
                  }
                }
              });

              // 歩行乗換の検索
              const walkingTransfers = getWalkingTransferStations(nextStation.name);
              walkingTransfers.forEach(walkTransfer => {
                const walkTargetStation = walkTransfer.station1 === nextStation.name 
                  ? walkTransfer.station2 
                  : walkTransfer.station1;
                
                const walkTargetNodes = this.stationToRoutes.get(walkTargetStation) || [];
                walkTargetNodes.forEach(walkTargetNode => {
                  if (walkTargetNode.routeKey !== current.node.routeKey) {
                    const walkTransferKey = `${walkTargetNode.station.name}-${walkTargetNode.routeKey}`;
                    if (!visited.has(walkTransferKey)) {
                      queue.push({
                        node: walkTargetNode,
                        path: newPath,
                        totalTime: newTotalTime + walkTransfer.walkingTime + 2, // 歩行時間 + 少しの余裕
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
  }

  private removeDuplicateRoutes(results: RouteResult[]): RouteResult[] {
    const uniqueResults: RouteResult[] = [];
    const seen = new Set<string>();

    results.forEach(result => {
      // より詳細な識別子を作成（路線、駅名、方向を含む）
      const routeId = result.segments
        .map(seg => {
          const startStation = seg.stations[0]?.name || '';
          const endStation = seg.stations[seg.stations.length - 1]?.name || '';
          return `${seg.routeKey}:${startStation}-${endStation}`;
        })
        .join('|');

      if (!seen.has(routeId)) {
        seen.add(routeId);
        uniqueResults.push(result);
      }
    });

    console.log(`Exact duplicate removal: ${results.length} → ${uniqueResults.length}`);
    return uniqueResults;
  }

  private diversifyRoutes(results: RouteResult[], maxResults: number): RouteResult[] {
    // まず品質でソート（乗換回数優先、次に時間）
    results.sort((a, b) => {
      if (a.transfers !== b.transfers) {
        return a.transfers - b.transfers;
      }
      return a.totalTime - b.totalTime;
    });

    // 明らかに非効率なルートを除外（最良時間の2.5倍以上）
    if (results.length > 0) {
      const bestTime = Math.min(...results.map(r => r.totalTime));
      const maxReasonableTime = bestTime * 2.5;
      results = results.filter(r => r.totalTime <= maxReasonableTime);
      console.log(`Time filter applied: removed routes > ${Math.round(maxReasonableTime)} minutes`);
    }

    const diverseResults: RouteResult[] = [];
    const seenRouteSignatures = new Set<string>();

    // より詳細なルート識別のための関数（乗り換え駅も含む）
    const getRouteSignature = (result: RouteResult): string => {
      // 歩行乗換以外のセグメントで、路線 + 経由駅のパターンを作成
      const segments = result.segments.filter(seg => seg.routeKey !== 'walking');

      const signature = segments.map((seg, index) => {
        const startStation = seg.stations[0]?.name || '';
        const endStation = seg.stations[seg.stations.length - 1]?.name || '';

        // 最初のセグメント以外は乗り換え駅から始まる
        if (index > 0) {
          return `${seg.routeKey}:${startStation}→${endStation}`;
        } else {
          return `${seg.routeKey}:${startStation}→${endStation}`;
        }
      }).join('|');

      return signature;
    };

    // デバッグ: 全ルートのシグネチャを出力
    console.log(`\n=== Route Signatures Analysis ===`);
    results.forEach((result, index) => {
      const signature = getRouteSignature(result);
      const routeDescription = result.segments
        .filter(seg => seg.routeKey !== 'walking')
        .map(seg => `${seg.routeName || seg.routeKey}(${seg.stations[0]?.name}→${seg.stations[seg.stations.length - 1]?.name})`)
        .join(' → ');
      console.log(`Route ${index + 1}: ${signature}`);
      console.log(`  Description: ${routeDescription}`);
      console.log(`  Time: ${result.totalTime}min, Transfers: ${result.transfers}`);
    });

    // 段階的にルートを追加
    // 1. 各ユニークなルートシグネチャから最良のものを選択
    results.forEach((result, index) => {
      const signature = getRouteSignature(result);

      if (!seenRouteSignatures.has(signature) && diverseResults.length < maxResults) {
        diverseResults.push(result);
        seenRouteSignatures.add(signature);

        const routeDescription = result.segments
          .filter(seg => seg.routeKey !== 'walking')
          .map(seg => `${seg.routeName || seg.routeKey}(${seg.stations[0]?.name}→${seg.stations[seg.stations.length - 1]?.name})`)
          .join(' → ');
        console.log(`✅ Added unique route ${diverseResults.length}: ${routeDescription} (${result.totalTime}min, ${result.transfers} transfers)`);
      } else {
        if (seenRouteSignatures.has(signature)) {
          console.log(`❌ Skipped duplicate route ${index + 1}: signature already seen`);
        }
      }
    });

    // 2. 非常に厳しい条件でのみ、実質的に異なるルートを追加
    if (diverseResults.length < maxResults) {
      const remainingRoutes = results.filter(result => {
        const signature = getRouteSignature(result);
        return !seenRouteSignatures.has(signature);
      });

      remainingRoutes.forEach(result => {
        if (diverseResults.length >= maxResults) return;

        // 既存のルートと大幅に異なる場合のみ追加（10分以上の差、または明らかに異なる経路）
        const hasSignificantValue = diverseResults.every(existing => {
          const timeDiff = Math.abs(existing.totalTime - result.totalTime);
          const transferDiff = Math.abs(existing.transfers - result.transfers);
          const isDifferentPath = !this.areRoutesEssentiallySame(existing, result);

          return (timeDiff >= 10 || transferDiff > 0) && isDifferentPath;
        });

        if (hasSignificantValue) {
          const signature = getRouteSignature(result);
          seenRouteSignatures.add(signature);
          diverseResults.push(result);

          const routeDescription = result.segments
            .filter(seg => seg.routeKey !== 'walking')
            .map(seg => `${seg.routeName || seg.routeKey}(${seg.stations[0]?.name}→${seg.stations[seg.stations.length - 1]?.name})`)
            .join(' → ');
          console.log(`✅ Added significantly different route: ${routeDescription} (${result.totalTime}min, ${result.transfers} transfers)`);
        }
      });
    }

    console.log(`\n=== Final Results ===`);
    console.log(`Route diversification: ${results.length} → ${diverseResults.length} unique routes`);
    diverseResults.forEach((result, index) => {
      const routeDescription = result.segments
        .filter(seg => seg.routeKey !== 'walking')
        .map(seg => `${seg.routeName || seg.routeKey}(${seg.stations[0]?.name}→${seg.stations[seg.stations.length - 1]?.name})`)
        .join(' → ');
      console.log(`Final ${index + 1}: ${routeDescription} (${result.totalTime}min, ${result.transfers} transfers)`);
    });

    return diverseResults;
  }

  // 2つのルートが実質的に同じかどうかを判定
  private areRoutesEssentiallySame(route1: RouteResult, route2: RouteResult): boolean {
    // セグメント数が異なる場合は異なるルート
    if (route1.segments.length !== route2.segments.length) {
      return false;
    }

    // 各セグメントを比較（歩行乗換以外）
    const segments1 = route1.segments.filter(seg => seg.routeKey !== 'walking');
    const segments2 = route2.segments.filter(seg => seg.routeKey !== 'walking');

    if (segments1.length !== segments2.length) {
      return false;
    }

    return segments1.every((seg1, index) => {
      const seg2 = segments2[index];
      return seg1.routeKey === seg2.routeKey &&
             seg1.stations[0]?.name === seg2.stations[0]?.name &&
             seg1.stations[seg1.stations.length - 1]?.name === seg2.stations[seg2.stations.length - 1]?.name;
    });
  }
}