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

  // デバッグ用の駅登録確認メソッド
  public debugStationRegistration() {
    // 全路線の確認
    console.log('📍 全登録路線数:', Object.keys(routes).length);
    console.log('📍 小田急関連路線:', Object.keys(routes).filter(key => key.includes('odakyu')));

    // 小田急線データの実際の内容を確認
    console.log('📊 小田急小田原線データ:', routes.odakyuLine ? `${routes.odakyuLine.length}駅` : '未定義');
    console.log('📊 小田急江ノ島線データ:', routes.odakyuEnoshimaLine ? `${routes.odakyuEnoshimaLine.length}駅` : '未定義');

    if (routes.odakyuLine) {
      console.log('🚉 小田急小田原線の主要駅:', routes.odakyuLine.filter(s => ['新宿', '相模大野'].includes(s.name)).map(s => s.name));
    }
    if (routes.odakyuEnoshimaLine) {
      console.log('🚉 小田急江ノ島線の主要駅:', routes.odakyuEnoshimaLine.filter(s => ['藤沢', '相模大野'].includes(s.name)).map(s => s.name));
    }

    // デバッグ: 藤沢駅と相模大野駅の登録状況を確認
    const fujiSawaRoutes = this.stationToRoutes.get('藤沢');
    if (fujiSawaRoutes) {
      console.log('🚉 藤沢駅の登録路線:', fujiSawaRoutes.map(n => ({
        route: n.routeKey,
        index: n.index,
        coords: `${n.station.lat}, ${n.station.lng}`
      })));
    } else {
      console.log('❌ 藤沢駅が見つかりません');
      // 他に藤沢が含まれる駅名があるかチェック
      const fujiSawaLike = Array.from(this.stationToRoutes.keys()).filter(name => name.includes('藤沢'));
      console.log('🔍 藤沢を含む駅名:', fujiSawaLike);
    }

    const sagamiOnoRoutes = this.stationToRoutes.get('相模大野');
    if (sagamiOnoRoutes) {
      console.log('🚉 相模大野駅の登録路線:', sagamiOnoRoutes.map(n => ({
        route: n.routeKey,
        index: n.index,
        coords: `${n.station.lat}, ${n.station.lng}`
      })));
    } else {
      console.log('❌ 相模大野駅が見つかりません');
      // 他に相模大野が含まれる駅名があるかチェック
      const sagamiOnoLike = Array.from(this.stationToRoutes.keys()).filter(name => name.includes('相模'));
      console.log('🔍 相模を含む駅名:', sagamiOnoLike);
    }

    const shinjukuRoutes = this.stationToRoutes.get('新宿');
    if (shinjukuRoutes) {
      console.log('🚉 新宿駅の登録路線:', shinjukuRoutes.map(n => ({
        route: n.routeKey,
        index: n.index
      })));
    }

    // 小田急江ノ島線のサンプル駅をチェック
    const enoshimaLineStation = this.stationToRoutes.get('湘南台');
    if (enoshimaLineStation) {
      console.log('🚉 湘南台駅の登録路線:', enoshimaLineStation.map(n => n.routeKey));
    }
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

    console.log(`\n=== 経路検索: ${departure.name} → ${arrival.name} ===`);
    console.log(`出発駅の路線:`, departureNodes.map(n => n.routeKey));
    console.log(`到着駅の路線:`, arrivalNodes.map(n => n.routeKey));

    // 小田急線関連の特別なデバッグ
    if (departure.name === '藤沢' || arrival.name === '新宿') {
      console.log('🔍 小田急線経路検索デバッグ開始');
      console.log('藤沢駅の登録路線:', this.stationToRoutes.get('藤沢')?.map(n => `${n.routeKey}[${n.index}]`));
      console.log('相模大野駅の登録路線:', this.stationToRoutes.get('相模大野')?.map(n => `${n.routeKey}[${n.index}]`));
      console.log('新宿駅の登録路線:', this.stationToRoutes.get('新宿')?.map(n => `${n.routeKey}[${n.index}]`));
    }

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

    // Find two-transfer routes only if we have very few results and they're significantly different
    if (allResults.length < 3) {
      this.findTransferRoutes(departureNodes, arrival, allResults, 2);
    }

    // Remove exact duplicates
    const uniqueResults = this.removeDuplicateRoutes(allResults);

    // Apply RAPTOR-inspired optimization: prioritize by transfers then time
    const optimizedResults = this.applyRAPTOROptimization(uniqueResults);

    // Diversify results to ensure different route combinations
    const diverseResults = this.diversifyRoutes(optimizedResults, maxResults);

    console.log(`📊 最終結果 (${diverseResults.length}件):`);
    diverseResults.forEach((result, i) => {
      const routeDesc = result.segments.map(s => s.routeName || s.routeKey).join(' → ');
      console.log(`  ${i + 1}: ${routeDesc} (${result.totalTime}分, ${result.transfers}回乗り換え)`);
    });

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
    console.log(`\n🔍 乗り換え探索開始 (最大${maxTransfers}回まで)`);

    departureNodes.forEach(depNode => {
      console.log(`出発路線: ${depNode.routeKey} 駅: ${depNode.station.name}[${depNode.index}]`);

      // 小田急江ノ島線からの探索を特別にログ
      if (depNode.routeKey === 'odakyuEnoshimaLine') {
        console.log(`🔥 小田急江ノ島線からの探索開始！ 駅: ${depNode.station.name}, インデックス: ${depNode.index}`);
        console.log(`🔥 路線データ長: ${routes.odakyuEnoshimaLine?.length}, 逆方向探索で相模大野(インデックス0)を目指します`);
      }

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

          // 小田急線での探索開始をデバッグ
          if (current.node.routeKey.includes('odakyu')) {
            console.log(`🚂 小田急線探索開始: ${current.node.routeKey}, 駅: ${current.node.station.name}[${current.node.index}], 方向: ${direction === 1 ? '正方向' : '逆方向'}`);
          }

          while (stationsVisited < 50) { // Prevent infinite loops
            const nextIndex = currentIndex + direction;
            if (nextIndex < 0 || nextIndex >= route.length) break;

            // 時間計算: 正方向では currentStation.timeToNext、逆方向では前の駅の timeToNext
            const timeForThisSegment = direction === 1
              ? (route[currentIndex].timeToNext || 3)
              : (route[nextIndex].timeToNext || 3);
            segmentTime += timeForThisSegment;
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
              console.log(`🎯 到着駅に到達: ${arrival.name}, 路線: ${current.node.routeKey}, 時間: ${newTotalTime}分, 乗り換え: ${current.transfers}回`);
              const routeDescription = newPath.map(seg => `${seg.routeName || seg.routeKey}(${seg.stations[0]?.name}→${seg.stations[seg.stations.length-1]?.name})`).join(' → ');
              console.log(`📍 経路詳細: ${routeDescription}`);

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

              // 小田急線関連駅での乗り換えをデバッグ
              if (nextStation.name === '相模大野' || nextStation.name === '藤沢' || nextStation.name === '新宿') {
                console.log(`🔄 ${nextStation.name}での乗り換え検索:`, {
                  currentRoute: current.node.routeKey,
                  availableRoutes: transferNodes.map(n => n.routeKey),
                  totalTime: newTotalTime,
                  transfers: current.transfers,
                  segmentTime: segmentTime
                });
              }

              transferNodes.forEach(transferNode => {
                if (transferNode.routeKey !== current.node.routeKey) {
                  const transferKey = `${transferNode.station.name}-${transferNode.routeKey}`;
                  if (!visited.has(transferKey)) {
                    // 相模大野での小田急線乗り換えをログ
                    if (nextStation.name === '相模大野' && (transferNode.routeKey === 'odakyuLine' || transferNode.routeKey === 'odakyuEnoshimaLine')) {
                      console.log(`✅ 相模大野で${current.node.routeKey} → ${transferNode.routeKey}に乗り換え追加`);
                    }

                    queue.push({
                      node: transferNode,
                      path: newPath,
                      totalTime: newTotalTime + this.getTransferPenalty(nextStation.name), // Dynamic transfer penalty
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

    // より詳細なルート識別のための関数（乗り換え駅と使用路線の組み合わせを完全に考慮）
    const getRouteSignature = (result: RouteResult): string => {
      // 歩行乗換以外のセグメントで、路線 + 経由駅のパターンを作成
      const segments = result.segments.filter(seg => seg.routeKey !== 'walking');

      // 乗り換え駅のリストを抽出
      const transferStations: string[] = [];
      for (let i = 0; i < segments.length - 1; i++) {
        const currentSegmentEnd = segments[i].stations[segments[i].stations.length - 1]?.name;
        const nextSegmentStart = segments[i + 1].stations[0]?.name;

        // 通常は同じ駅だが、念のため両方チェック
        if (currentSegmentEnd && nextSegmentStart) {
          transferStations.push(currentSegmentEnd === nextSegmentStart ? currentSegmentEnd : `${currentSegmentEnd}-${nextSegmentStart}`);
        }
      }

      // 使用路線のリスト
      const routeKeys = segments.map(seg => seg.routeKey).join('-');

      // 乗り換え駅の組み合わせ
      const transferPattern = transferStations.join(',');

      // 出発駅と到着駅
      const startStation = segments[0]?.stations[0]?.name || '';
      const endStation = segments[segments.length - 1]?.stations[segments[segments.length - 1].stations.length - 1]?.name || '';

      // 完全なシグネチャ: 出発駅 + 路線組み合わせ + 乗り換え駅 + 到着駅
      return `${startStation}|${routeKeys}|${transferPattern}|${endStation}`;
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
          const routeDescription = result.segments
            .filter(seg => seg.routeKey !== 'walking')
            .map(seg => `${seg.routeName || seg.routeKey}(${seg.stations[0]?.name}→${seg.stations[seg.stations.length - 1]?.name})`)
            .join(' → ');
          console.log(`❌ Skipped duplicate route ${index + 1}: ${routeDescription}`);
          console.log(`   Signature: ${signature}`);
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

  // RAPTOR-inspired optimization: bicriteria approach (transfers first, then time)
  private applyRAPTOROptimization(results: RouteResult[]): RouteResult[] {
    if (results.length === 0) return results;

    // Group by number of transfers
    const byTransfers = new Map<number, RouteResult[]>();
    results.forEach(result => {
      if (!byTransfers.has(result.transfers)) {
        byTransfers.set(result.transfers, []);
      }
      byTransfers.get(result.transfers)!.push(result);
    });

    const optimizedResults: RouteResult[] = [];

    // Process in order of transfers (0, 1, 2, ...)
    Array.from(byTransfers.keys()).sort((a, b) => a - b).forEach(transferCount => {
      const routesWithThisTransferCount = byTransfers.get(transferCount)!;

      // Sort by time within each transfer group
      routesWithThisTransferCount.sort((a, b) => a.totalTime - b.totalTime);

      // Apply more aggressive time filtering based on transfer count
      const bestTime = routesWithThisTransferCount[0].totalTime;

      // For direct routes (0 transfers): allow up to 1.5x the best time
      // For 1 transfer: allow up to 1.3x the best time
      // For 2+ transfers: allow up to 1.2x the best time
      let timeMultiplier = 1.5;
      if (transferCount === 1) timeMultiplier = 1.3;
      else if (transferCount >= 2) timeMultiplier = 1.2;

      const maxAllowedTime = bestTime * timeMultiplier;

      const filtered = routesWithThisTransferCount.filter(route =>
        route.totalTime <= maxAllowedTime
      );

      console.log(`Transfer ${transferCount}: ${routesWithThisTransferCount.length} → ${filtered.length} routes (time filter: ${Math.round(maxAllowedTime)}min max)`);

      optimizedResults.push(...filtered);
    });

    // Further filter: for each transfer level, keep only truly diverse routes
    const finalResults: RouteResult[] = [];
    byTransfers.forEach((routes, transferCount) => {
      const sortedRoutes = routes
        .filter(r => optimizedResults.includes(r))
        .sort((a, b) => a.totalTime - b.totalTime);

      if (sortedRoutes.length > 0) {
        // Always include the best route for this transfer count
        finalResults.push(sortedRoutes[0]);

        // Add additional routes only if they're significantly different
        for (let i = 1; i < sortedRoutes.length; i++) {
          const current = sortedRoutes[i];
          const timeDiffFromBest = current.totalTime - sortedRoutes[0].totalTime;

          // Only add if time difference is significant AND route is meaningfully different
          if (timeDiffFromBest >= 5 && !this.areRoutesEssentiallySame(sortedRoutes[0], current)) {
            const isDifferentFromExisting = finalResults.every(existing =>
              !this.areRoutesEssentiallySame(existing, current)
            );

            if (isDifferentFromExisting) {
              finalResults.push(current);
            }
          }
        }
      }
    });

    console.log(`RAPTOR optimization: ${results.length} → ${finalResults.length} routes`);
    return finalResults;
  }

  // Improved transfer penalty calculation based on station type
  private getTransferPenalty(stationName: string): number {
    // Major hub stations have lower transfer penalty (better facilities)
    const majorHubs = ['新宿', '東京', '渋谷', '池袋', '品川', '上野', '横浜', '大手町', '表参道'];
    if (majorHubs.includes(stationName)) {
      return 3; // 3 minutes for major hubs
    }

    // Regular transfer stations
    return 5; // 5 minutes standard penalty
  }

  // 2つのルートが実質的に同じかどうかを判定（より厳密）
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

    // 各セグメントが完全に一致するかチェック
    const segmentsMatch = segments1.every((seg1, index) => {
      const seg2 = segments2[index];
      return seg1.routeKey === seg2.routeKey &&
             seg1.stations[0]?.name === seg2.stations[0]?.name &&
             seg1.stations[seg1.stations.length - 1]?.name === seg2.stations[seg2.stations.length - 1]?.name;
    });

    if (!segmentsMatch) {
      return false;
    }

    // 乗り換え駅のパターンが同じかチェック
    const getTransferStations = (segments: any[]) => {
      const transfers: string[] = [];
      for (let i = 0; i < segments.length - 1; i++) {
        const transferStation = segments[i].stations[segments[i].stations.length - 1]?.name;
        if (transferStation) {
          transfers.push(transferStation);
        }
      }
      return transfers.join(',');
    };

    const transfers1 = getTransferStations(segments1);
    const transfers2 = getTransferStations(segments2);

    return transfers1 === transfers2;
  }
}