import { routes, type RouteKey, routeNames } from '../data/routes';
import type { Station } from '../data/yamanote';

export interface RouteSegment {
  routeKey: RouteKey;
  routeName: string;
  stations: Station[];
  startIndex: number;
  endIndex: number;
  time: number;
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
      // Create a unique identifier for the route
      const routeId = result.segments
        .map(seg => `${seg.routeKey}:${seg.startIndex}-${seg.endIndex}`)
        .join('|');
      
      if (!seen.has(routeId)) {
        seen.add(routeId);
        uniqueResults.push(result);
      }
    });

    return uniqueResults;
  }

  private diversifyRoutes(results: RouteResult[], maxResults: number): RouteResult[] {
    // Filter out obviously inefficient routes (more than 3x the best time)
    if (results.length > 0) {
      const bestTime = Math.min(...results.map(r => r.totalTime));
      const maxReasonableTime = bestTime * 3;
      results = results.filter(r => r.totalTime <= maxReasonableTime);
    }

    // Sort by quality (transfers first, then time)
    results.sort((a, b) => {
      if (a.transfers !== b.transfers) {
        return a.transfers - b.transfers;
      }
      return a.totalTime - b.totalTime;
    });

    const diverseResults: RouteResult[] = [];
    const usedRouteKeys = new Set<string>();

    // First, add the best route from each unique route combination
    results.forEach(result => {
      const routeKeyCombo = result.segments.map(seg => seg.routeKey).sort().join('-');
      
      if (!usedRouteKeys.has(routeKeyCombo) && diverseResults.length < maxResults) {
        diverseResults.push(result);
        usedRouteKeys.add(routeKeyCombo);
      }
    });

    // If we still need more results, add remaining routes (but prioritize fewer transfers)
    const sortedRemaining = results.filter(result => {
      const alreadyIncluded = diverseResults.some(existing => 
        existing.segments.length === result.segments.length &&
        existing.segments.every((seg, i) => 
          seg.routeKey === result.segments[i].routeKey &&
          seg.startIndex === result.segments[i].startIndex &&
          seg.endIndex === result.segments[i].endIndex
        )
      );
      return !alreadyIncluded;
    }).sort((a, b) => {
      // Prioritize routes with fewer transfers
      if (a.transfers !== b.transfers) {
        return a.transfers - b.transfers;
      }
      return a.totalTime - b.totalTime;
    });

    sortedRemaining.forEach(result => {
      if (diverseResults.length >= maxResults) return;
      diverseResults.push(result);
    });

    console.log(`Filtered routes: ${results.length} → ${diverseResults.length}`);
    return diverseResults;
  }
}