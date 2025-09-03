import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';
import StationSelector from './StationSelector';
import RouteRecommendations from './RouteRecommendations';
import CoverageAnalysis from './CoverageAnalysis';
import ErrorBoundary from './ErrorBoundary';
import { RouteFinder, type RouteResult } from '../utils/routeFinder';

interface RailwayMapProps {
  className?: string;
}

const RailwayMap: React.FC<RailwayMapProps> = ({ className }) => {
  const [visibleRoutes, setVisibleRoutes] = useState<Set<RouteKey>>(new Set(Object.keys(routes) as RouteKey[]));
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const mapRef = useRef<any>(null);
  
  // 新しい機能のstate - デフォルトで横浜→新宿を設定
  const [departure, setDeparture] = useState<Station | null>({ 
    name: "横浜", 
    lat: 35.4657, 
    lng: 139.6227 
  });
  const [arrival, setArrival] = useState<Station | null>({ 
    name: "新宿", 
    lat: 35.6896, 
    lng: 139.7006 
  });
  const [routeRecommendations, setRouteRecommendations] = useState<RouteResult[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteResult | null>(null);
  
  // 折りたたみ状態の管理
  const [isStationSelectorExpanded, setIsStationSelectorExpanded] = useState(true);
  const [isRouteToggleExpanded, setIsRouteToggleExpanded] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(true);
  
  // 表示モードの管理
  const [showTransferStationsOnly, setShowTransferStationsOnly] = useState(true);
  
  // 経路推薦設定
  const [maxRouteRecommendations, setMaxRouteRecommendations] = useState(10);
  
  const routeFinder = useMemo(() => new RouteFinder(), []);

  // 路線色から薄い背景色を生成
  const getLightBackgroundColor = useCallback((color: string): string => {
    // 16進数カラーをRGBに変換
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // 薄い背景色を作成（元の色に白を混ぜる）
    const mixRatio = 0.15; // 元の色の15%の濃度
    const newR = Math.round(r * mixRatio + 255 * (1 - mixRatio));
    const newG = Math.round(g * mixRatio + 255 * (1 - mixRatio));
    const newB = Math.round(b * mixRatio + 255 * (1 - mixRatio));
    
    return `rgb(${newR}, ${newG}, ${newB})`;
  }, []);

  // 主要駅リストを一箇所でメモ化
  const majorStations = useMemo(() => [
    '東京', '新宿', '渋谷', '池袋', '上野', '品川', '横浜', '大宮', '立川',
    '吉祥寺', '町田', '川崎', '蒲田', '新橋', '有楽町', '秋葉原', '神田',
    '浜松町', '田町', '高田馬場', '新大久保', '四ツ谷', '市ヶ谷', '飯田橋',
    '御茶ノ水', '水道橋', '後楽園', '春日', '本郷三丁目', '上野広小路',
    '仲御徒町', '御徒町', '鶯谷', '日暮里', '西日暮里', '田端', '駒込',
    '巣鴨', '大塚', '目白', '新宿三丁目', '新宿御苑前', '四谷三丁目'
  ], []);

  // 乗換駅を特定する（複数路線で同じ駅名を持つ駅）
  const transferStations = useMemo(() => {
    // 乗換駅判定は全路線を対象にする（表示中の路線のみではなく）
    const stationCounts = new Map<string, Set<RouteKey>>();
    
    Object.entries(routes).forEach(([routeKey, stationList]) => {
      stationList.forEach(station => {
        if (!stationCounts.has(station.name)) {
          stationCounts.set(station.name, new Set());
        }
        stationCounts.get(station.name)!.add(routeKey as RouteKey);
      });
    });
    
    // 2路線以上で使用される駅名を乗換駅とする
    const transferStationNames = new Set<string>();
    stationCounts.forEach((routeSet, stationName) => {
      if (routeSet.size >= 2) {
        transferStationNames.add(stationName);
      }
    });
    
    // デバッグ：乗換駅数をログ出力
    console.log(`Transfer stations detected: ${transferStationNames.size} (from all ${Object.keys(routes).length} routes)`);
    console.log('First 15 transfer stations:', Array.from(transferStationNames).slice(0, 15));
    
    // 全駅数もログ出力
    const allStations = new Set<string>();
    Object.values(routes).forEach(stationList => {
      stationList.forEach(station => {
        allStations.add(station.name);
      });
    });
    console.log(`Total unique stations in all routes: ${allStations.size}`);
    
    return transferStationNames;
  }, []); // routeRecommendationsに依存しない

  // アイコン作成関数をメモ化
  const createStationIcon = useCallback((station: Station, color: string, zoomLevel: number, isDetailed: boolean, opacity: number = 1) => {
    if (!MapComponents?.DivIcon) return null;
    
    const { DivIcon } = MapComponents;
    
    if (isDetailed) {
      return new DivIcon({
        html: `<div style="background:${color};color:white;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:bold;white-space:nowrap;border:1px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);text-align:center;opacity:${opacity}">${station.name}</div>`,
        className: 'station-name-marker',
        iconSize: [station.name.length * 11 + 12, 18],
        iconAnchor: [(station.name.length * 11 + 12) / 2, 9]
      });
    } else {
      const stationSize = Math.max(8, Math.min(16, zoomLevel - 8));
      return new DivIcon({
        html: `<div style="background:${color};width:${stationSize}px;height:${stationSize}px;border:1px solid white;box-shadow:0 1px 2px rgba(0,0,0,0.2);opacity:${opacity}"></div>`,
        className: 'station-marker',
        iconSize: [stationSize, stationSize],
        iconAnchor: [stationSize / 2, stationSize / 2]
      });
    }
  }, [MapComponents]);

  const getTimeMarkerSize = (zoom: number) => {
    const baseSize = 20;
    const scaleFactor = Math.max(0.4, Math.min(1.2, (zoom - 8) / 8));
    return Math.round(baseSize * scaleFactor);
  };

  const createSpecialStationIcon = useCallback((isDeparture: boolean, zoomLevel: number) => {
    if (!MapComponents?.DivIcon) return null;
    
    const { DivIcon } = MapComponents;
    const markerSize = getTimeMarkerSize(zoomLevel) * 1.8;
    const fontSize = Math.max(14, Math.round(markerSize * 0.55));
    const markerColor = isDeparture ? '#4CAF50' : '#F44336';
    const markerText = isDeparture ? 'S' : 'G';
    
    return new DivIcon({
      html: `<div style="background:white;border:3px solid ${markerColor};border-radius:4px;width:${markerSize}px;height:${markerSize}px;display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;font-weight:bold;color:${markerColor};box-shadow:0 3px 6px rgba(0,0,0,0.3);position:relative;z-index:1000">${markerText}</div>`,
      className: 'special-station-marker',
      iconSize: [markerSize, markerSize],
      iconAnchor: [markerSize / 2, markerSize / 2]
    });
  }, [MapComponents]);

  const createTimeIcon = useCallback((time: number, color: string, zoomLevel: number, isSection = false) => {
    if (!MapComponents?.DivIcon) return null;
    
    const { DivIcon } = MapComponents;
    const fontSize = Math.max(10, Math.round(zoomLevel * 0.8));
    const padding = Math.max(2, Math.round(zoomLevel * 0.3));
    
    return new DivIcon({
      html: `<div style="background:rgba(255,255,255,0.9);border:1px solid ${color};border-radius:3px;padding:${padding}px ${padding + 2}px;font-size:${fontSize}px;font-weight:bold;color:${color};box-shadow:0 1px 3px rgba(0,0,0,0.3);white-space:nowrap;text-align:center">${time}分</div>`,
      className: isSection ? 'time-text-section' : 'time-text',
      iconSize: [time.toString().length * fontSize + padding * 4, fontSize + padding * 2],
      iconAnchor: [(time.toString().length * fontSize + padding * 4) / 2, (fontSize + padding * 2) / 2]
    });
  }, [MapComponents]);

  // レンダリング最適化：表示する路線のデータを準備
  const visibleRoutesData = useMemo(() => {
    // 経路推薦がある場合は、推薦で使用される路線のみを表示対象とする
    if (routeRecommendations.length > 0) {
      const usedRouteKeys = new Set<RouteKey>();
      routeRecommendations.forEach(route => {
        route.segments.forEach(segment => {
          usedRouteKeys.add(segment.routeKey);
        });
      });
      return Object.entries(routes).filter(([routeKey]) => usedRouteKeys.has(routeKey as RouteKey));
    }
    
    // 経路推薦がない場合は、全路線を表示対象とする
    return Object.entries(routes);
  }, [routeRecommendations]);


  useEffect(() => {
    let mounted = true;
    
    const loadLeaflet = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        const [
          { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents },
          { DivIcon }
        ] = await Promise.all([
          import('react-leaflet'),
          import('leaflet'),
        ]);
        
        if (mounted) {
          setMapComponents({ MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents, DivIcon });
          setIsClient(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadLeaflet();
    
    return () => {
      mounted = false;
    };
  }, []);

  // 出発駅と到着駅が設定された時にルート検索を実行
  useEffect(() => {
    if (departure && arrival) {
      const routeResults = routeFinder.findRoutes(departure, arrival, maxRouteRecommendations);
      setRouteRecommendations(routeResults);
      setSelectedRoute(null);
      
      // 推薦路線で使用される全ての路線を表示
      const usedRouteKeys = new Set<RouteKey>();
      routeResults.forEach(route => {
        route.segments.forEach(segment => {
          usedRouteKeys.add(segment.routeKey);
        });
      });
      
      // デバッグ：推薦された経路の詳細をログ出力
      console.log(`Route recommendations for ${departure.name} → ${arrival.name}:`);
      routeResults.forEach((route, index) => {
        const routeDescription = route.segments.map(seg => seg.routeName).join(' → ');
        console.log(`${index + 1}: ${routeDescription} (${route.totalTime}分, ${route.transfers}回乗換)`);
      });
      console.log(`Used routes: ${Array.from(usedRouteKeys).join(', ')}`);
      
      setVisibleRoutes(usedRouteKeys);
    } else {
      setRouteRecommendations([]);
      setSelectedRoute(null);
      // 出発駅・到着駅がない場合は全路線を表示
      setVisibleRoutes(new Set(Object.keys(routes) as RouteKey[]));
    }
  }, [departure, arrival, routeFinder, maxRouteRecommendations]);

  const toggleRoute = (routeKey: RouteKey) => {
    const newVisibleRoutes = new Set(visibleRoutes);
    if (newVisibleRoutes.has(routeKey)) {
      newVisibleRoutes.delete(routeKey);
    } else {
      newVisibleRoutes.add(routeKey);
    }
    setVisibleRoutes(newVisibleRoutes);
  };

  const getMarkerRadius = (zoom: number) => {
    // ズームレベルに応じてマーカーサイズを調整
    // ズームレベルが低い（広域）ほど小さく、高い（詳細）ほど大きく
    const baseRadius = 3;
    const scaleFactor = Math.max(0.3, Math.min(1.5, (zoom - 8) / 8));
    return Math.round(baseRadius * scaleFactor);
  };


  const getMidpoint = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    return [(lat1 + lat2) / 2, (lng1 + lng2) / 2];
  };

  // 路線に沿った中点を計算（複数駅を跨ぐ区間用）
  const getRouteBasedMidpoint = (stations: Station[], startIndex: number, endIndex: number) => {
    if (startIndex >= endIndex || startIndex < 0 || endIndex >= stations.length) {
      return getMidpoint(stations[startIndex].lat, stations[startIndex].lng, stations[endIndex].lat, stations[endIndex].lng);
    }

    // 区間内の全ての座標を取得
    const sectionStations = stations.slice(startIndex, endIndex + 1);
    
    // 路線の総距離を計算
    let totalDistance = 0;
    const distances: number[] = [];
    
    for (let i = 0; i < sectionStations.length - 1; i++) {
      const dist = Math.sqrt(
        Math.pow(sectionStations[i + 1].lat - sectionStations[i].lat, 2) +
        Math.pow(sectionStations[i + 1].lng - sectionStations[i].lng, 2)
      );
      distances.push(dist);
      totalDistance += dist;
    }
    
    // 中点となる距離を計算
    const midDistance = totalDistance / 2;
    let accumulatedDistance = 0;
    
    // 中点が含まれる区間を特定
    for (let i = 0; i < distances.length; i++) {
      if (accumulatedDistance + distances[i] >= midDistance) {
        // この区間内に中点がある
        const remainingDistance = midDistance - accumulatedDistance;
        const ratio = remainingDistance / distances[i];
        
        const lat = sectionStations[i].lat + (sectionStations[i + 1].lat - sectionStations[i].lat) * ratio;
        const lng = sectionStations[i].lng + (sectionStations[i + 1].lng - sectionStations[i].lng) * ratio;
        
        return [lat, lng];
      }
      accumulatedDistance += distances[i];
    }
    
    // フォールバック: 単純な中点
    return getMidpoint(
      sectionStations[0].lat, 
      sectionStations[0].lng, 
      sectionStations[sectionStations.length - 1].lat, 
      sectionStations[sectionStations.length - 1].lng
    );
  };

  const selectAllRoutes = () => {
    setVisibleRoutes(new Set(Object.keys(routes) as RouteKey[]));
  };

  const deselectAllRoutes = () => {
    setVisibleRoutes(new Set());
  };

  const handleRouteClick = (routeKey: RouteKey) => {
    toggleRoute(routeKey);
  };

  const handleRouteSelect = (route: RouteResult) => {
    setSelectedRoute(route);
    // 選択されたルートの路線を表示
    const routeKeys = new Set<RouteKey>();
    route.segments.forEach(segment => {
      routeKeys.add(segment.routeKey);
    });
    setVisibleRoutes(routeKeys);
  };


  if (!isClient || isLoading || !MapComponents) {
    return (
      <div style={{ 
        height: '600px', 
        width: '100%', 
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <div>
          <div>マップを読み込み中...</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Client: {isClient ? 'OK' : 'Loading'}, 
            Loading: {isLoading ? 'Yes' : 'No'}, 
            Components: {MapComponents ? 'OK' : 'Loading'}
          </div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents, DivIcon } = MapComponents;
  const tokyoStation = [35.6812, 139.7671];

  const MapEvents = () => {
    useMapEvents({
      zoomend: (e) => {
        setZoomLevel(e.target.getZoom());
      },
    });
    return null;
  };

  const getRouteSegmentForStations = (routeKey: RouteKey, stations: Station[], depStation: Station, arrStation: Station) => {
    const depIndex = stations.findIndex(s => s.name === depStation.name);
    const arrIndex = stations.findIndex(s => s.name === arrStation.name);
    
    if (depIndex === -1 || arrIndex === -1) return null;
    
    const startIndex = Math.min(depIndex, arrIndex);
    const endIndex = Math.max(depIndex, arrIndex);
    
    return {
      stations: stations.slice(startIndex, endIndex + 1),
      startIndex,
      endIndex
    };
  };

  const renderRoute = (routeKey: RouteKey, stations: Station[]) => {
    if (!visibleRoutes.has(routeKey)) return null;

    let displayStations = stations;
    let displayStartIndex = 0;
    
    // 推薦ルートが存在し、特定のルートが選択されている場合
    if (selectedRoute && departure && arrival) {
      const routeSegment = selectedRoute.segments.find(seg => seg.routeKey === routeKey);
      if (routeSegment) {
        displayStations = routeSegment.stations;
      } else {
        return null;
      }
    } else if (departure && arrival && routeRecommendations.length > 0) {
      // 推薦ルートが存在するが特定ルートが選択されていない場合、全推薦ルートで使用される区間を表示
      const allSegments = routeRecommendations.flatMap(route => route.segments);
      const routeSegment = allSegments.find(seg => seg.routeKey === routeKey);
      if (routeSegment) {
        displayStations = routeSegment.stations;
      } else {
        return null;
      }
    }

    const positions = displayStations.map(station => [station.lat, station.lng]);
    const color = routeColors[routeKey];

    return (
      <React.Fragment key={routeKey}>
        <Polyline 
          positions={positions} 
          color={color}
          weight={4}
          opacity={visibleRoutes.has(routeKey) ? 0.8 : 0.2}
          eventHandlers={{
            click: () => {
              toggleRoute(routeKey);
            }
          }}
          style={{ cursor: 'pointer' }}
        />
        {displayStations.map((station, index) => {
          const isDeparture = departure && station.name === departure.name;
          const isArrival = arrival && station.name === arrival.name;
          const isSpecialStation = isDeparture || isArrival;
          
          if (isSpecialStation) {
            // 乗換駅のみ表示モード時は、特別駅も乗換駅チェックを適用
            if (showTransferStationsOnly && !transferStations.has(station.name)) {
              console.log(`Filtering out special non-transfer station: ${station.name}`);
              return null;
            }
            
            const specialIcon = createSpecialStationIcon(isDeparture, zoomLevel);
            if (!specialIcon) return null;

            return (
              <Marker
                key={`${routeKey}-special-${index}`}
                position={[station.lat, station.lng]}
                icon={specialIcon}
                zIndexOffset={1000}
              >
                <Popup>
                  <div>
                    <strong>{station.name}</strong>
                    {isDeparture && <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>出発駅</div>}
                    {isArrival && <div style={{ color: '#F44336', fontWeight: 'bold' }}>到着駅</div>}
                    <div style={{ marginTop: '10px' }}>
                      <button 
                        onClick={() => setDeparture(station)}
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          marginRight: '5px',
                          fontSize: '12px'
                        }}
                      >
                        出発駅に設定
                      </button>
                      <button 
                        onClick={() => setArrival(station)}
                        style={{
                          backgroundColor: '#F44336',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        到着駅に設定
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          } else {
            const shouldShowStation = zoomLevel >= 11; // より広域で駅を表示
            const shouldShowStationName = zoomLevel >= 10; // より広域で駅名を表示
            const shouldShowAllStations = zoomLevel >= 13; // 十分拡大したらすべての駅を表示
            const isMajorStation = majorStations.includes(station.name);
            const isTransferStation = transferStations.has(station.name);
            const shouldShowInWideView = zoomLevel >= 10 && isMajorStation; // 主要駅をより広域で表示
            
            // デバッグ：特定の駅の情報を確認と、乗換駅でない駅の表示を記録
            if (showTransferStationsOnly && !isTransferStation) {
              console.log(`Filtering out non-transfer station: ${station.name} on ${routeKey}`);
              return null;
            }
            
            // 乗換駅のみ表示時に表示される駅をログ
            if (showTransferStationsOnly && isTransferStation) {
              console.log(`Showing transfer station: ${station.name} on ${routeKey}`);
            }
            
            // 十分拡大している場合はすべての駅を表示（但し乗換駅フィルターは維持）
            if (shouldShowAllStations) {
              // 全駅表示モード - 乗換駅フィルターのみ適用済み
            } else {
              // 通常表示モードの場合
              if (!shouldShowStation && !shouldShowInWideView) {
                return null;
              }
            }

            const isDetailed = shouldShowStationName || shouldShowInWideView || shouldShowAllStations;
            const stationOpacity = visibleRoutes.has(routeKey) ? 1 : 0.3;
            const stationIcon = createStationIcon(station, color, zoomLevel, isDetailed, stationOpacity);
            if (!stationIcon) return null;

            return (
              <Marker
                key={`${routeKey}-station-${index}`}
                position={[station.lat, station.lng]}
                icon={stationIcon}
                zIndexOffset={2000}
              >
                <Popup>
                  <div>
                    <strong>{station.name}</strong>
                    <div style={{ marginTop: '10px' }}>
                      <button 
                        onClick={() => setDeparture(station)}
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          marginRight: '5px',
                          fontSize: '12px'
                        }}
                      >
                        出発駅に設定
                      </button>
                      <button 
                        onClick={() => setArrival(station)}
                        style={{
                          backgroundColor: '#F44336',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        到着駅に設定
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          }
        })}
        {displayStations.map((station, index) => {
          if (index < displayStations.length - 1 && station.timeToNext) {
            const nextStation = displayStations[index + 1];
            
            if (zoomLevel < 14) { // より高いズームレベルでのみ詳細表示
              const isCurrentMajor = majorStations.includes(station.name);
              if (!isCurrentMajor) return null;
              
              let totalTime = 0;
              let endIndex = index;
              let stationCount = 0;
              
              // より多くの駅をまとめて表示
              for (let i = index; i < displayStations.length - 1; i++) {
                const currentSt = displayStations[i];
                const nextSt = displayStations[i + 1];
                totalTime += currentSt.timeToNext || 3;
                endIndex = i + 1;
                stationCount++;
                
                // 主要駅に到達するか、一定数の駅をまとめたら停止
                if (majorStations.includes(nextSt.name) || stationCount >= 5) {
                  break;
                }
              }
              
              if (endIndex === index) return null;
              
              // 路線に沿った正確な中点を計算
              const midpoint = getRouteBasedMidpoint(displayStations, index, endIndex);
              const timeIcon = createTimeIcon(totalTime, color, zoomLevel, true);
              if (!timeIcon) return null;

              return (
                <Marker
                  key={`${routeKey}-time-section-${index}`}
                  position={midpoint}
                  icon={timeIcon}
                  zIndexOffset={500}
                />
              );
            } else {
              // 乗換駅のみ表示時は、隠れた駅間の時間を集計する
              if (showTransferStationsOnly) {
                const isCurrentTransfer = transferStations.has(station.name);
                const isNextTransfer = transferStations.has(nextStation.name);
                
                // 現在の駅が乗換駅でない場合はスキップ
                if (!isCurrentTransfer) return null;
                
                // 次の乗換駅までの時間を集計
                let totalTime = 0;
                let endStationIndex = index;
                
                for (let i = index; i < displayStations.length - 1; i++) {
                  const currentSt = displayStations[i];
                  const nextSt = displayStations[i + 1];
                  totalTime += currentSt.timeToNext || 3;
                  endStationIndex = i + 1;
                  
                  // 次の駅が乗換駅なら停止
                  if (transferStations.has(nextSt.name)) {
                    break;
                  }
                }
                
                // 集計した時間が元の時間と同じ場合（つまり隣接駅も乗換駅）は通常表示
                if (endStationIndex === index + 1) {
                  const midpoint = getMidpoint(station.lat, station.lng, nextStation.lat, nextStation.lng);
                  const timeIcon = createTimeIcon(station.timeToNext, color, zoomLevel, false);
                  if (!timeIcon) return null;

                  return (
                    <Marker
                      key={`${routeKey}-time-${index}`}
                      position={midpoint}
                      icon={timeIcon}
                      zIndexOffset={500}
                    />
                  );
                } else {
                  // 集計した時間を表示
                  const endStation = displayStations[endStationIndex];
                  const midpoint = getRouteBasedMidpoint(displayStations, index, endStationIndex);
                  const timeIcon = createTimeIcon(totalTime, color, zoomLevel, true);
                  if (!timeIcon) return null;

                  return (
                    <Marker
                      key={`${routeKey}-time-aggregated-${index}`}
                      position={midpoint}
                      icon={timeIcon}
                      zIndexOffset={500}
                    />
                  );
                }
              } else {
                // 通常の時間表示
                const midpoint = getMidpoint(station.lat, station.lng, nextStation.lat, nextStation.lng);
                const timeIcon = createTimeIcon(station.timeToNext, color, zoomLevel, false);
                if (!timeIcon) return null;

                return (
                  <Marker
                    key={`${routeKey}-time-${index}`}
                    position={midpoint}
                    icon={timeIcon}
                    zIndexOffset={500}
                  />
                );
              }
            }
          }
          return null;
        })}
      </React.Fragment>
    );
  };

  return (
    <ErrorBoundary>
    <div className={className}>
      {/* 駅選択UI */}
      <StationSelector
        departure={departure}
        arrival={arrival}
        onDepartureChange={setDeparture}
        onArrivalChange={setArrival}
        isExpanded={isStationSelectorExpanded}
        onToggleExpanded={() => setIsStationSelectorExpanded(!isStationSelectorExpanded)}
      />

      {/* カバレッジ分析 */}
      <CoverageAnalysis />

      {/* ルート推薦表示 */}
      {routeRecommendations.length > 0 && (
        <RouteRecommendations
          routes={routeRecommendations}
          onRouteSelect={handleRouteSelect}
        />
      )}

      <div style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <div 
          onClick={() => setIsRouteToggleExpanded(!isRouteToggleExpanded)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: isRouteToggleExpanded ? '15px' : '0'
          }}
        >
          <h3 style={{ margin: '0', color: '#333' }}>路線表示切替</h3>
          <span style={{
            fontSize: '18px',
            color: '#666',
            transform: isRouteToggleExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}>
            ▼
          </span>
        </div>
        
        {isRouteToggleExpanded && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '14px',
              color: '#333'
            }}>
              <span style={{ marginRight: '8px' }}>経路推薦数:</span>
              <select
                value={maxRouteRecommendations}
                onChange={(e) => setMaxRouteRecommendations(Number(e.target.value))}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '14px'
                }}
              >
                <option value={3}>3件</option>
                <option value={5}>5件</option>
                <option value={10}>10件</option>
                <option value={15}>15件</option>
                <option value={20}>20件</option>
              </select>
            </label>
            <div style={{ 
              fontSize: '11px', 
              color: '#666', 
              marginTop: '4px'
            }}>
              ※路線表示・乗換駅切り替えは右上の凡例から
            </div>
          </div>
        <div 
          style={{
            width: '100%',
            maxHeight: '200px',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            overflowY: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            alignContent: 'flex-start'
          }}
        >
          {Object.entries(routes).map(([routeKey, _]) => {
            const routeName = routeNames[routeKey as RouteKey];
            const routeColor = routeColors[routeKey as RouteKey];
            const isSelected = visibleRoutes.has(routeKey as RouteKey);
            // 幅をより正確に計算: アイコン12px + マージン8px + テキスト + パディング16px
            const textWidth = routeName.length * 11; // 長い路線名に対応するため余裕を持たせる
            const totalWidth = 12 + 8 + textWidth + 16;
            
            return (
              <div
                key={routeKey}
                onClick={() => handleRouteClick(routeKey as RouteKey)}
                style={{
                  padding: '6px 8px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? getLightBackgroundColor(routeColor) : 'transparent',
                  color: routeColor,
                  fontWeight: isSelected ? 'bold' : 'normal',
                  borderRadius: '3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease',
                  border: isSelected 
                    ? `2px solid ${routeColor}` 
                    : '2px solid transparent',
                  width: `${totalWidth}px`,
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span 
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    backgroundColor: routeColor,
                    borderRadius: '50%',
                    marginRight: '8px',
                    opacity: isSelected ? 1 : 0.3,
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: '13px' }}>
                  {routeName}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginTop: '5px' 
        }}>
          クリックで表示・非表示を切替
        </div>
        </div>
        )}
      </div>
      
      <div style={{ height: '600px', width: '100%', border: '1px solid #ccc', position: 'relative' }}>
        <MapContainer
          center={tokyoStation}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <MapEvents />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {visibleRoutesData.map(([routeKey, stations]) =>
            renderRoute(routeKey as RouteKey, stations)
          )}
        </MapContainer>
        
        {/* 路線凡例（Legend） */}
        {visibleRoutesData.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            minWidth: '150px',
            zIndex: 1000
          }}>
            <div 
              onClick={() => setIsLegendExpanded(!isLegendExpanded)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '10px',
                borderBottom: isLegendExpanded ? '1px solid #eee' : 'none'
              }}
            >
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#333'
              }}>
                表示中の路線
              </span>
              <span style={{
                fontSize: '12px',
                color: '#666',
                transform: isLegendExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}>
                ▼
              </span>
            </div>
            
            {isLegendExpanded && (
              <div style={{
                padding: '10px',
                maxHeight: '350px',
                overflowY: 'auto'
              }}>
                {/* マーカー表示（一番上に配置） */}
                {(departure || arrival) && (
                  <div style={{ 
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold', 
                      marginBottom: '8px',
                      color: '#333'
                    }}>
                      現在の駅設定
                    </div>
                    {departure && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '6px',
                        fontSize: '12px'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: 'white',
                          border: '3px solid #4CAF50',
                          borderRadius: '4px',
                          marginRight: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: '#4CAF50',
                          flexShrink: 0
                        }}>
                          S
                        </div>
                        <span style={{ color: '#333', fontWeight: 'bold' }}>出発駅: {departure.name}</span>
                      </div>
                    )}
                    {arrival && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '6px',
                        fontSize: '12px'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: 'white',
                          border: '3px solid #F44336',
                          borderRadius: '4px',
                          marginRight: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: '#F44336',
                          flexShrink: 0
                        }}>
                          G
                        </div>
                        <span style={{ color: '#333', fontWeight: 'bold' }}>到着駅: {arrival.name}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 表示オプション */}
                <div style={{ 
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      fontSize: '12px',
                      color: '#333',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={showTransferStationsOnly}
                        onChange={(e) => setShowTransferStationsOnly(e.target.checked)}
                        style={{ 
                          marginRight: '6px',
                          cursor: 'pointer'
                        }}
                      />
                      乗換駅のみ表示
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={selectAllRoutes}
                      style={{ 
                        flex: 1,
                        padding: '4px 8px',
                        fontSize: '10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      全表示
                    </button>
                    <button 
                      onClick={deselectAllRoutes}
                      style={{ 
                        flex: 1,
                        padding: '4px 8px',
                        fontSize: '10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      全非表示
                    </button>
                  </div>
                </div>
                
                {/* 路線一覧 */}
                {visibleRoutesData.map(([routeKey]) => (
                  <div 
                    key={routeKey} 
                    onClick={() => toggleRoute(routeKey as RouteKey)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '3px',
                      backgroundColor: visibleRoutes.has(routeKey as RouteKey) 
                        ? 'rgba(0, 123, 255, 0.1)' 
                        : 'rgba(108, 117, 125, 0.1)',
                      border: `1px solid ${visibleRoutes.has(routeKey as RouteKey) 
                        ? '#007bff' 
                        : '#6c757d'}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={visibleRoutes.has(routeKey as RouteKey)}
                      onChange={() => {}} // ハンドルはdivのonClickで
                      style={{
                        marginRight: '8px',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div style={{
                      width: '20px',
                      height: '3px',
                      backgroundColor: routeColors[routeKey as RouteKey],
                      marginRight: '8px',
                      borderRadius: '1px',
                      flexShrink: 0,
                      opacity: visibleRoutes.has(routeKey as RouteKey) ? 1 : 0.3
                    }} />
                    <span style={{ 
                      color: visibleRoutes.has(routeKey as RouteKey) ? '#333' : '#6c757d',
                      lineHeight: '1.2'
                    }}>
                      {routeNames[routeKey as RouteKey]}
                    </span>
                  </div>
                ))}
                
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default RailwayMap;