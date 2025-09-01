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

    const results: RouteResult[] = [];

    departureNodes.forEach(depNode => {
      arrivalNodes.forEach(arrNode => {
        if (depNode.routeKey === arrNode.routeKey) {
          const segment = this.createRouteSegment(
            depNode.routeKey,
            routes[depNode.routeKey],
            depNode.index,
            arrNode.index
          );
          results.push({
            segments: [segment],
            totalTime: segment.time,
            transfers: 0
          });
        }
      });
    });

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

        if (current.transfers >= 2) continue;

        const route = routes[current.node.routeKey];
        
        for (let direction of [-1, 1]) {
          let currentIndex = current.node.index;
          let segmentTime = 0;

          while (true) {
            const nextIndex = currentIndex + direction;
            if (nextIndex < 0 || nextIndex >= route.length) break;

            const currentStation = route[currentIndex];
            segmentTime += currentStation.timeToNext || 3;
            currentIndex = nextIndex;

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

            if (nextStation.name === arrival.name) {
              results.push({
                segments: newPath,
                totalTime: newTotalTime,
                transfers: current.transfers
              });
              continue;
            }

            if (current.transfers < 2) {
              const transferNodes = this.stationToRoutes.get(nextStation.name) || [];
              transferNodes.forEach(transferNode => {
                if (transferNode.routeKey !== current.node.routeKey) {
                  const transferKey = `${transferNode.station.name}-${transferNode.routeKey}`;
                  if (!visited.has(transferKey)) {
                    queue.push({
                      node: transferNode,
                      path: newPath,
                      totalTime: newTotalTime + 3,
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

    return results
      .filter((result, index, self) => {
        return index === self.findIndex(r => 
          r.segments.length === result.segments.length &&
          r.segments.every((seg, i) => 
            seg.routeKey === result.segments[i].routeKey &&
            seg.startIndex === result.segments[i].startIndex &&
            seg.endIndex === result.segments[i].endIndex
          )
        );
      })
      .sort((a, b) => {
        if (a.transfers !== b.transfers) {
          return a.transfers - b.transfers;
        }
        return a.totalTime - b.totalTime;
      })
      .slice(0, maxResults);
  }
}