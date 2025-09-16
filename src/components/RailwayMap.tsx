import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';
import StationSelector from './StationSelector';
import RouteRecommendations from './RouteRecommendations';
import CoverageAnalysis from './CoverageAnalysis';
import ErrorBoundary from './ErrorBoundary';
import SchematicMap from './SchematicMap';
import { RouteFinder, TimeFilter, type RouteResult, type StationWithTime } from '../utils/routeFinder';
import { getRouteDestination, getRouteDisplayText, getDirectionText, commonDirections } from '../data/routeDestinations';

// デバッグ用のwindow拡張
declare global {
  interface Window {
    lastMouseLog?: number;
  }
}

interface RailwayMapProps {
  className?: string;
}

const RailwayMap: React.FC<RailwayMapProps> = ({ className }) => {
  // console.log('RailwayMap component initialized');

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
  const [mapViewMode, setMapViewMode] = useState<'realistic' | 'schematic'>('realistic');

  // 経路推薦設定
  const [maxRouteRecommendations, setMaxRouteRecommendations] = useState(10);

  // 時間フィルター機能
  const [timeFilterEnabled, setTimeFilterEnabled] = useState(false);
  const [timeFilterMaxMinutes, setTimeFilterMaxMinutes] = useState(15);
  const [stationsWithinTime, setStationsWithinTime] = useState<StationWithTime[]>([]);
  const [actuallyDisplayedStations, setActuallyDisplayedStations] = useState<Set<string>>(new Set());

  // 路線ホバー・ポップアップ状態
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [clickedRoute, setClickedRoute] = useState<string | null>(null);
  const [routePopupPosition, setRoutePopupPosition] = useState<{ x: number, y: number } | null>(null);
  const [hoverTooltipPosition, setHoverTooltipPosition] = useState<{ x: number, y: number } | null>(null);

  // デバッグ用
  useEffect(() => {
    console.log('🟢🟢🟢 clickedRoute changed:', clickedRoute);
  }, [clickedRoute]);

  useEffect(() => {
    console.log('🟢🟢🟢 routePopupPosition changed:', routePopupPosition);
  }, [routePopupPosition]);

  const routeFinder = useMemo(() => new RouteFinder(), []);
  const timeFilter = useMemo(() => new TimeFilter(routeFinder), [routeFinder]);

  // 駅が通っている路線を見つける関数
  const getRoutesForStation = useCallback((stationName: string): RouteKey[] => {
    const stationRoutes: RouteKey[] = [];
    Object.entries(routes).forEach(([routeKey, stationList]) => {
      if (stationList.some(station => station.name === stationName)) {
        stationRoutes.push(routeKey as RouteKey);
      }
    });
    return stationRoutes;
  }, []);

  // 時間フィルター結果と実際表示の一致性をチェックする関数
  const checkTimeFilterConsistency = useCallback(() => {
    if (!timeFilterEnabled || stationsWithinTime.length === 0) return;

    const expectedStations = new Set(stationsWithinTime.map(s => s.station.name));
    const displayedStations = actuallyDisplayedStations;

    console.log('=== Time Filter Consistency Check ===');
    console.log(`Expected stations (${expectedStations.size}):`, Array.from(expectedStations).sort());
    console.log(`Actually displayed stations (${displayedStations.size}):`, Array.from(displayedStations).sort());

    // 期待されているが表示されていない駅
    const missingStations = Array.from(expectedStations).filter(station => !displayedStations.has(station));
    if (missingStations.length > 0) {
      console.log(`❌ Missing stations (expected but not displayed):`, missingStations);
    }

    // 表示されているが期待されていない駅
    const unexpectedStations = Array.from(displayedStations).filter(station => !expectedStations.has(station));
    if (unexpectedStations.length > 0) {
      console.log(`❌ Unexpected stations (displayed but not expected):`, unexpectedStations);
    }

    if (missingStations.length === 0 && unexpectedStations.length === 0) {
      console.log('✅ Perfect match! All stations are correctly filtered.');
    } else {
      console.log(`⚠️  Mismatch detected: ${missingStations.length} missing, ${unexpectedStations.length} unexpected`);
    }

    console.log('=======================================');
  }, [timeFilterEnabled, stationsWithinTime]);

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

  // 推薦ルートベースの乗換駅を特定
  const recommendationTransferStations = useMemo(() => {
    if (routeRecommendations.length === 0) return new Set<string>();

    const transferStationNames = new Set<string>();

    // 推薦ルートの乗換駅を特定
    routeRecommendations.forEach(route => {
      route.segments.forEach((segment, segmentIndex) => {
        // セグメントの最初の駅（前のセグメントからの乗換駅）
        if (segmentIndex > 0) {
          transferStationNames.add(segment.stations[0].name);
        }

        // セグメントの最後の駅（次のセグメントへの乗換駅）
        if (segmentIndex < route.segments.length - 1) {
          transferStationNames.add(segment.stations[segment.stations.length - 1].name);
        }
      });
    });

    // 出発駅と到着駅も必ず表示
    if (departure) transferStationNames.add(departure.name);
    if (arrival) transferStationNames.add(arrival.name);

    console.log(`Recommendation-based transfer stations: ${transferStationNames.size}`);
    console.log('Transfer stations:', Array.from(transferStationNames));

    return transferStationNames;
  }, [routeRecommendations, departure, arrival]);

  // 全路線ベースの乗換駅を特定（推薦ルートがない場合の参考用）
  const allTransferStations = useMemo(() => {
    const stationCounts = new Map<string, Set<RouteKey>>();

    Object.entries(routes).forEach(([routeKey, stationList]) => {
      stationList.forEach(station => {
        if (!stationCounts.has(station.name)) {
          stationCounts.set(station.name, new Set());
        }
        stationCounts.get(station.name)!.add(routeKey as RouteKey);
      });
    });

    const transferStationNames = new Set<string>();
    stationCounts.forEach((routeSet, stationName) => {
      if (routeSet.size >= 2) {
        transferStationNames.add(stationName);
      }
    });

    return transferStationNames;
  }, []);

  // 使用する乗換駅セットを決定
  const transferStations = useMemo(() => {
    // 推薦ルートがある場合は推薦ベースの乗換駅、ない場合は全乗換駅
    const activeTransferStations = routeRecommendations.length > 0
      ? recommendationTransferStations
      : allTransferStations;

    console.log(`Using transfer stations: ${routeRecommendations.length > 0 ? 'recommendation-based' : 'all-routes-based'} (${activeTransferStations.size} stations)`);

    return activeTransferStations;
  }, [routeRecommendations.length, recommendationTransferStations, allTransferStations]);

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

  const createSpecialStationIcon = useCallback((isDeparture: boolean, zoomLevel: number, stationName: string) => {
    if (!MapComponents?.DivIcon) return null;

    const { DivIcon } = MapComponents;
    const baseMarkerSize = getTimeMarkerSize(zoomLevel) * 1.8;
    const markerColor = isDeparture ? '#4CAF50' : '#F44336';

    // 駅名のみを表示（S: G: プレフィックスなし）
    const fontSize = Math.max(12, Math.round(baseMarkerSize * 0.4));
    const textWidth = stationName.length * fontSize * 0.6 + 16;
    const markerWidth = Math.max(baseMarkerSize, textWidth);
    const markerHeight = baseMarkerSize;

    return new DivIcon({
      html: `<div style="background:white;border:3px solid ${markerColor};border-radius:4px;width:${markerWidth}px;height:${markerHeight}px;display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;font-weight:bold;color:${markerColor};box-shadow:0 3px 6px rgba(0,0,0,0.3);position:relative;z-index:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 4px">${stationName}</div>`,
      className: 'special-station-marker-inline',
      iconSize: [markerWidth, markerHeight],
      iconAnchor: [markerWidth / 2, markerHeight / 2]
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

      // デバッグ：推薦された経路の詳細をログ出力
      console.log(`Route recommendations for ${departure.name} → ${arrival.name}:`);
      routeResults.forEach((route, index) => {
        const routeDescription = route.segments.map(seg => seg.routeName).join(' → ');
        console.log(`${index + 1}: ${routeDescription} (${route.totalTime}分, ${route.transfers}回乗換)`);
      });

      // visibleRoutesの制御は時間フィルターのuseEffectで行う
    } else {
      setRouteRecommendations([]);
      setSelectedRoute(null);
    }
  }, [departure, arrival, routeFinder, maxRouteRecommendations]);

  // 時間フィルターが有効な時の駅フィルタリング（出発駅ベース）
  useEffect(() => {
    if (timeFilterEnabled && departure) {
      // 時間フィルター有効時は全路線を対象とする
      const allRoutes = new Set(Object.keys(routes) as RouteKey[]);
      const stationsInRange = timeFilter.findStationsWithinTime(
        departure,
        timeFilterMaxMinutes,
        allRoutes
      );
      setStationsWithinTime(stationsInRange);
      console.log(`Time filter: Found ${stationsInRange.length} stations within ${timeFilterMaxMinutes} minutes from ${departure.name}`);
      console.log('Stations within time range:', stationsInRange.map(s => `${s.station.name}(${s.totalTime}min)`).slice(0, 10));

      // 時間フィルター有効時は全路線を表示対象とする
      setVisibleRoutes(allRoutes);
    } else {
      setStationsWithinTime([]);
      // 時間フィルター無効時は元のロジックに戻る
      if (departure && arrival) {
        // 推薦経路がある場合はそれに基づく
        const routeResults = routeFinder.findRoutes(departure, arrival, maxRouteRecommendations);
        const usedRouteKeys = new Set<RouteKey>();
        routeResults.forEach(route => {
          route.segments.forEach(segment => {
            usedRouteKeys.add(segment.routeKey);
          });
        });
        setVisibleRoutes(usedRouteKeys);
      } else {
        // 出発駅・到着駅がない場合は全路線を表示
        setVisibleRoutes(new Set(Object.keys(routes) as RouteKey[]));
      }
    }
  }, [timeFilterEnabled, departure, timeFilterMaxMinutes, routeFinder, maxRouteRecommendations, arrival, timeFilter]);

  // 表示された駅情報を更新するuseEffect
  useEffect(() => {
    if (timeFilterEnabled) {
      // 時間フィルター設定変更時に表示駅セットをリセット
      setActuallyDisplayedStations(new Set());

      const timer = setTimeout(() => {
        checkTimeFilterConsistency();
      }, 1500); // レンダリング完了後にチェック実行

      return () => clearTimeout(timer);
    } else {
      setActuallyDisplayedStations(new Set());
    }
  }, [timeFilterEnabled, departure, timeFilterMaxMinutes, visibleRoutes]);

  const toggleRoute = (routeKey: RouteKey) => {
    console.log('🔄 toggleRoute called for:', routeKey);
    console.log('🔄 Current visibleRoutes:', visibleRoutes);
    const newVisibleRoutes = new Set(visibleRoutes);
    if (newVisibleRoutes.has(routeKey)) {
      console.log('🔄 Removing route from visible routes');
      newVisibleRoutes.delete(routeKey);
    } else {
      console.log('🔄 Adding route to visible routes');
      newVisibleRoutes.add(routeKey);
    }
    console.log('🔄 New visibleRoutes:', newVisibleRoutes);
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
      // 歩行乗換は路線表示に含めない
      if (segment.routeKey !== 'walking') {
        routeKeys.add(segment.routeKey);
      }
    });
    setVisibleRoutes(routeKeys);
  };

  const handleShowAllRoutes = () => {
    setSelectedRoute(null);
    setVisibleRoutes(new Set(Object.keys(routes) as RouteKey[]));
  };

  const handleRoutePopupClose = () => {
    setClickedRoute(null);
    setRoutePopupPosition(null);
  };

  const handleSchematicStationClick = (station: Station, action: 'departure' | 'arrival') => {
    if (action === 'departure') {
      setDeparture(station);
    } else {
      setArrival(station);
    }
  };


  if (!isClient || isLoading || !MapComponents) {
    console.log('RailwayMap loading state:', { isClient, isLoading, MapComponents: !!MapComponents });
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
          <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
            Window: {typeof window !== 'undefined' ? 'Available' : 'Not Available'}
          </div>
        </div>
      </div>
    );
  }

  // console.log('RailwayMap rendering main component');

  const { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents, DivIcon } = MapComponents;
  const tokyoStation = [35.6812, 139.7671];

  const MapEvents = () => {
    const map = useMapEvents({
      zoomend: (e) => {
        setZoomLevel(e.target.getZoom());
      },
      click: () => {
        // 地図クリック時にルートポップアップを閉じる
        handleRoutePopupClose();
      },
      mousemove: (e) => {
        // デバッグ用：マウス位置をログ出力（頻度制限）
        if (hoveredRoute && hoverTooltipPosition) {
          // 100ms間隔でログを制限
          const now = Date.now();
          if (!window.lastMouseLog || now - window.lastMouseLog > 100) {
            window.lastMouseLog = now;

            const containerPoint = e.containerPoint;
            console.log('🔵🔵🔵 === MOUSE MOVE DEBUG ===');
            console.log('🔵 Mouse container point:', containerPoint);
            console.log('🔵 Tooltip position:', hoverTooltipPosition);

            // 調整前の座標との差異
            const originalDeltaX = containerPoint.x - hoverTooltipPosition.x;
            const originalDeltaY = containerPoint.y - hoverTooltipPosition.y;
            console.log('🔵 Delta from tooltip (raw): x=' + originalDeltaX + ', y=' + originalDeltaY);

            // 調整分を考慮した実際の距離
            const adjustedDeltaY = containerPoint.y - (hoverTooltipPosition.y + 10); // +10は調整で引いた分
            console.log('🔵 Delta considering -10 adjustment: x=' + originalDeltaX + ', y=' + adjustedDeltaY);

            // transform(-50%, -100%)を考慮すると...
            console.log('🔵 Note: tooltip is also shifted by transform(-50%, -100%) + marginTop(-5px)');
          }
        }

        // 地図上でのマウス移動時にホバーを無効化（路線上でない場合）
        if (hoveredRoute && !hoverTooltipPosition) {
          setHoveredRoute(null);
          setHoverTooltipPosition(null);
        }
      }
    });

    // mapRefに地図インスタンスを保存
    if (map && !mapRef.current) {
      mapRef.current = map;
    }

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

    // 時間フィルター有効時に実際に表示される駅を記録するためのセット
    const currentlyDisplayedStations = new Set<string>();

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
        {/* 透明な太い線でマウス判定を緩くする */}
        <Polyline
          positions={positions}
          color="transparent"
          weight={12}
          opacity={0}
          eventHandlers={{
            click: (e) => {
              console.log('🔴🔴🔴 ROUTE CLICKED:', routeKey);
              const { latlng } = e;
              console.log('🔴 Click position:', latlng);
              const point = mapRef.current?.latLngToContainerPoint(latlng);
              console.log('🔴 Map ref exists:', !!mapRef.current);
              console.log('🔴 Container point:', point);
              if (point) {
                setClickedRoute(routeKey);
                setRoutePopupPosition({ x: point.x, y: point.y });
                console.log('🔴 Popup position set:', { x: point.x, y: point.y });
              } else {
                // Fallbackとして画面中央に表示
                setClickedRoute(routeKey);
                setRoutePopupPosition({ x: 400, y: 300 });
                console.log('🔴 Using fallback position');
              }
            },
            mouseover: (e) => {
              console.log('🟡🟡🟡 === ROUTE HOVER DEBUG START ===');
              console.log('🟡 Route:', routeKey);

              // すべての利用可能な座標情報を取得
              const { latlng, containerPoint, layerPoint, originalEvent } = e;
              console.log('🟡 Event latlng:', latlng);
              console.log('🟡 Event containerPoint:', containerPoint);
              console.log('🟡 Event layerPoint:', layerPoint);
              console.log('🟡 Original event clientX/Y:', originalEvent?.clientX, originalEvent?.clientY);
              console.log('🟡 Original event pageX/Y:', originalEvent?.pageX, originalEvent?.pageY);

              // 地図の境界とコンテナ情報
              const mapContainer = mapRef.current?.getContainer();
              if (mapContainer) {
                const mapBounds = mapContainer.getBoundingClientRect();
                console.log('🟡 Map container bounds:', mapBounds);
              }

              // 複数の方法で座標を計算
              const calculatedPoint = mapRef.current?.latLngToContainerPoint(latlng);
              console.log('🟡 Calculated container point:', calculatedPoint);

              setHoveredRoute(routeKey);

              if (originalEvent && originalEvent.clientX && originalEvent.clientY) {
                // ブラウザの画面座標を直接使用（最も正確）
                const tooltipPosition = {
                  x: originalEvent.clientX,
                  y: originalEvent.clientY - 80  // ツールチップとマウスの間にスペースを確保
                };
                setHoverTooltipPosition(tooltipPosition);

                console.log('🟡 Using clientX/Y:', originalEvent.clientX, originalEvent.clientY);
                console.log('🟡 Final tooltip position:', tooltipPosition);
                console.log('🟡 Adjustment: y -= 80 (tooltip height + spacing)');
                console.log('🟡 === ROUTE HOVER DEBUG END ===');
              } else if (containerPoint || calculatedPoint) {
                // フォールバック：コンテナポイント使用
                const usePoint = containerPoint || calculatedPoint;
                const mapContainer = mapRef.current?.getContainer();
                const mapBounds = mapContainer?.getBoundingClientRect();

                if (mapBounds) {
                  // コンテナポイントを画面座標に変換
                  const screenX = mapBounds.left + usePoint.x;
                  const screenY = mapBounds.top + usePoint.y - 80;
                  const tooltipPosition = { x: screenX, y: screenY };
                  setHoverTooltipPosition(tooltipPosition);

                  console.log('🟡 Using container point with bounds conversion');
                  console.log('🟡 Map bounds:', mapBounds);
                  console.log('🟡 Container point:', usePoint);
                  console.log('🟡 Screen position:', tooltipPosition);
                } else {
                  console.log('🟡 ERROR: No map bounds available!');
                }
              } else {
                console.log('🟡 ERROR: No valid coordinates found!');
              }
            },
            mouseout: () => {
              setHoveredRoute(null);
              setHoverTooltipPosition(null);
            }
          }}
          style={{ cursor: 'pointer' }}
        />
        {/* 実際に見える路線 */}
        <Polyline
          positions={positions}
          color={color}
          weight={hoveredRoute === routeKey ? 6 : 4}
          opacity={visibleRoutes.has(routeKey) ? 0.8 : 0.2}
          interactive={false}
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

            // 時間フィルターが有効な場合は、範囲内の駅のみ表示
            if (timeFilterEnabled && stationsWithinTime.length > 0) {
              const stationWithTime = stationsWithinTime.find(sWithTime => sWithTime.station.name === station.name);
              if (!stationWithTime) {
                return null;
              }
              currentlyDisplayedStations.add(station.name);
            }

            // 時間フィルターが無効な場合は通常表示
            if (!timeFilterEnabled) {
              currentlyDisplayedStations.add(station.name);
            }

            const specialIcon = createSpecialStationIcon(isDeparture, zoomLevel, station.name);
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
                    
                    {/* 通っている路線を表示 */}
                    <div style={{ marginTop: '8px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>通っている路線:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {getRoutesForStation(station.name).map((stationRouteKey) => (
                          <div
                            key={stationRouteKey}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11px'
                            }}
                          >
                            <div
                              style={{
                                width: '10px',
                                height: '10px',
                                backgroundColor: routeColors[stationRouteKey],
                                borderRadius: '50%',
                                flexShrink: 0
                              }}
                            />
                            <span style={{ color: routeColors[stationRouteKey], fontWeight: '500' }}>
                              {getRouteDestination(stationRouteKey)?.description || routeNames[stationRouteKey] || stationRouteKey}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

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

            // 時間フィルターが有効な場合は最優先でチェック
            if (timeFilterEnabled && stationsWithinTime.length > 0) {
              const stationWithTime = stationsWithinTime.find(sWithTime => sWithTime.station.name === station.name);
              if (!stationWithTime) {
                // 時間範囲外の駅は表示しない
                return null;
              }
              // 時間範囲内の駅は記録
              currentlyDisplayedStations.add(station.name);
              console.log(`TimeFilter: Showing station ${station.name} - ${stationWithTime.totalTime} minutes`);
            }

            // 乗換駅のみ表示モード（時間フィルター有効時でも適用）
            if (showTransferStationsOnly && !isTransferStation) {
              return null;
            }

            // 時間フィルターが無効な場合は通常表示
            if (!timeFilterEnabled) {
              currentlyDisplayedStations.add(station.name);
            }

            // 乗換駅のみ表示時に表示される駅をログ（コメントアウト - ノイズを削減）
            // if (showTransferStationsOnly && isTransferStation) {
            //   console.log(`Showing transfer station: ${station.name} on ${routeKey}`);
            // }

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
                    
                    {/* 通っている路線を表示 */}
                    <div style={{ marginTop: '8px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>通っている路線:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {getRoutesForStation(station.name).map((stationRouteKey) => (
                          <div
                            key={stationRouteKey}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11px'
                            }}
                          >
                            <div
                              style={{
                                width: '10px',
                                height: '10px',
                                backgroundColor: routeColors[stationRouteKey],
                                borderRadius: '50%',
                                flexShrink: 0
                              }}
                            />
                            <span style={{ color: routeColors[stationRouteKey], fontWeight: '500' }}>
                              {getRouteDestination(stationRouteKey)?.description || routeNames[stationRouteKey] || stationRouteKey}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

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
            const isCurrentTransfer = transferStations.has(station.name);

            // 乗換駅間で時間をまとめる共通ロジック
            const aggregateTimeToNextTransfer = () => {
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

              return { totalTime, endStationIndex };
            };

            // 乗換駅のみ表示時、または通常時でも乗換駅から次の乗換駅までをまとめる
            if (showTransferStationsOnly || isCurrentTransfer) {
              // 現在の駅が乗換駅でない場合はスキップ（乗換駅のみ表示時）
              if (showTransferStationsOnly && !isCurrentTransfer) return null;

              const { totalTime, endStationIndex } = aggregateTimeToNextTransfer();

              // 隣接する駅も乗換駅の場合は通常表示
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
                // 乗換駅間の集計時間を表示
                const midpoint = getRouteBasedMidpoint(displayStations, index, endStationIndex);
                const timeIcon = createTimeIcon(totalTime, color, zoomLevel, true);
                if (!timeIcon) return null;

                return (
                  <Marker
                    key={`${routeKey}-time-transfer-${index}`}
                    position={midpoint}
                    icon={timeIcon}
                    zIndexOffset={500}
                  />
                );
              }
            } else if (zoomLevel < 14) {
              // 高いズームレベル以下では主要駅間をまとめて表示
              const isCurrentMajor = majorStations.includes(station.name);
              if (!isCurrentMajor) return null;

              let totalTime = 0;
              let endIndex = index;
              let stationCount = 0;

              for (let i = index; i < displayStations.length - 1; i++) {
                const currentSt = displayStations[i];
                const nextSt = displayStations[i + 1];
                totalTime += currentSt.timeToNext || 3;
                endIndex = i + 1;
                stationCount++;

                // 主要駅または乗換駅に到達するか、一定数の駅をまとめたら停止
                if (majorStations.includes(nextSt.name) || transferStations.has(nextSt.name) || stationCount >= 5) {
                  break;
                }
              }

              if (endIndex === index) return null;

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
              // 通常の詳細表示（全ての駅間時間を表示）
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
          return null;
        })}
      </React.Fragment>
    );

    // 時間フィルター有効時に表示された駅のセットを更新
    if (timeFilterEnabled && currentlyDisplayedStations.size > 0) {
      setTimeout(() => {
        setActuallyDisplayedStations(currentDisplayedSet => {
          const newSet = new Set([...currentDisplayedSet, ...currentlyDisplayedStations]);
          return newSet;
        });
      }, 0);
    }
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
            selectedRoute={selectedRoute}
            onShowAllRoutes={handleShowAllRoutes}
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
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
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
                  <button
                    onClick={selectAllRoutes}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    全表示
                  </button>
                  <button
                    onClick={deselectAllRoutes}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    全非表示
                  </button>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#666',
                  marginTop: '4px'
                }}>
                  ※路線表示・乗換駅切り替えは右上の凡例から
                </div>
              </div>

              {/* 時間フィルター設定 */}
              <div style={{
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#333',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={timeFilterEnabled}
                      onChange={(e) => setTimeFilterEnabled(e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    所要時間フィルター(準備中)
                  </label>
                </div>

                {timeFilterEnabled && (
                  <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px',
                      fontSize: '13px'
                    }}>
                      <span style={{ color: '#555' }}>基準駅:</span>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: departure ? '#e8f5e8' : '#f0f0f0',
                        border: departure ? '1px solid #4CAF50' : '1px solid #ccc',
                        borderRadius: '4px',
                        color: departure ? '#2e7d32' : '#666',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>
                        {departure ? departure.name : '出発駅を設定してください'}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px'
                    }}>
                      <span style={{ color: '#555' }}>最大時間:</span>
                      <select
                        value={timeFilterMaxMinutes}
                        onChange={(e) => setTimeFilterMaxMinutes(Number(e.target.value))}
                        style={{
                          padding: '3px 6px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          fontSize: '13px'
                        }}
                        disabled={!departure}
                      >
                        <option value={5}>5分</option>
                        <option value={10}>10分</option>
                        <option value={15}>15分</option>
                        <option value={20}>20分</option>
                        <option value={30}>30分</option>
                        <option value={45}>45分</option>
                        <option value={60}>60分</option>
                      </select>
                      {timeFilterEnabled && departure && stationsWithinTime.length > 0 && (
                        <span style={{ color: '#666', fontSize: '11px' }}>
                          ({stationsWithinTime.length}駅)
                        </span>
                      )}
                    </div>

                    {timeFilterEnabled && !departure && (
                      <div style={{
                        marginTop: '8px',
                        padding: '6px',
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#856404'
                      }}>
                        出発駅を設定すると、その駅から指定時間内にアクセス可能な駅のみが表示されます
                      </div>
                    )}
                  </div>
                )}

                {/* デバッグ用テストボタン */}
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '5px' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>デバッグテスト</div>
                  <button
                    onClick={() => {
                      setClickedRoute('yamanote');
                      setRoutePopupPosition({ x: 300, y: 150 });
                      console.log('🟠🟠🟠 TEST BUTTON CLICKED - Setting popup for yamanote at x:300, y:150');
                    }}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginRight: '10px'
                    }}
                  >
                    テスト山手線ポップアップ
                  </button>
                  <button
                    onClick={() => {
                      setClickedRoute('chuo-rapid');
                      setRoutePopupPosition({ x: 200, y: 100 });
                      console.log('🟠🟠🟠 TEST BUTTON 2 CLICKED - Setting popup for chuo-rapid at x:200, y:100');
                    }}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    テスト中央線ポップアップ
                  </button>
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
          {mapViewMode === 'realistic' ? (
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
          ) : (
            <SchematicMap
              visibleRoutes={visibleRoutes}
              routeRecommendations={routeRecommendations}
              departure={departure}
              arrival={arrival}
              transferStations={transferStations}
              showTransferStationsOnly={showTransferStationsOnly}
              onStationClick={handleSchematicStationClick}
            />
          )}

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

                  {/* 推薦ルート選択 */}
                  {routeRecommendations.length > 0 && (
                    <div style={{
                      marginBottom: '15px',
                      padding: '10px',
                      backgroundColor: selectedRoute ? '#e3f2fd' : '#f8f9fa',
                      borderRadius: '4px',
                      border: selectedRoute ? '1px solid #2196F3' : '1px solid #e9ecef'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: selectedRoute ? '#2196F3' : '#333'
                      }}>
                        推薦ルート選択
                      </div>

                      <div style={{ marginBottom: '8px' }}>
                        <select
                          value={selectedRoute ? routeRecommendations.findIndex(route =>
                            route.segments.length === selectedRoute.segments.length &&
                            route.segments.every((segment, index) => {
                              const selectedSegment = selectedRoute.segments[index];
                              return (
                                segment.routeKey === selectedSegment.routeKey &&
                                segment.startIndex === selectedSegment.startIndex &&
                                segment.endIndex === selectedSegment.endIndex
                              );
                            })
                          ) : -1}
                          onChange={(e) => {
                            const index = parseInt(e.target.value);
                            if (index === -1) {
                              handleShowAllRoutes();
                            } else {
                              handleRouteSelect(routeRecommendations[index]);
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '4px',
                            fontSize: '12px',
                            borderRadius: '3px',
                            border: '1px solid #ccc'
                          }}
                        >
                          <option value={-1}>全ルート表示</option>
                          {routeRecommendations.map((route, index) => (
                            <option key={index} value={index}>
                              ルート {index + 1} ({Math.round(route.totalTime)}分, 乗換{route.transfers}回)
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedRoute && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {selectedRoute.segments.map((segment, index) => (
                            <div key={index} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11px'
                            }}>
                              <div style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: segment.isWalkingTransfer ? '#4CAF50' : routeColors[segment.routeKey] || '#666',
                                borderRadius: '50%',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '8px'
                              }}>
                                {segment.isWalkingTransfer ? '🚶' : ''}
                              </div>
                              <span style={{
                                color: segment.isWalkingTransfer ? '#4CAF50' : routeColors[segment.routeKey] || '#666',
                                fontWeight: '500'
                              }}>
                                {segment.isWalkingTransfer ?
                                  `徒歩 (${segment.walkingTime}分)` :
                                  (() => {
                                    const routeDestination = getRouteDestination(segment.routeKey);
                                    const routeName = routeDestination?.description || segment.routeName;
                                    const fromStation = segment.stations[0].name;
                                    const toStation = segment.stations[segment.stations.length - 1].name;

                                    // 行先情報を取得
                                    let direction = '';
                                    if (routeDestination) {
                                      const destinations = routeDestination.destinations;
                                      if (destinations.includes(toStation)) {
                                        direction = `${toStation}行き`;
                                      } else {
                                        direction = `${destinations[destinations.length - 1]}方面`;
                                      }
                                    }

                                    return `${routeName}${direction ? ` ${direction}` : ''} (${Math.round(segment.time)}分)`;
                                  })()
                                }
                              </span>
                            </div>
                          ))}
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
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#333'
                      }}>
                        地図表示モード:
                      </label>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '11px',
                          color: '#333',
                          cursor: 'pointer',
                          marginBottom: '4px'
                        }}>
                          <input
                            type="radio"
                            name="mapViewMode"
                            checked={mapViewMode === 'realistic'}
                            onChange={() => setMapViewMode('realistic')}
                            style={{
                              marginRight: '6px',
                              cursor: 'pointer'
                            }}
                          />
                          実地図ベース
                        </label>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '11px',
                          color: '#333',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="radio"
                            name="mapViewMode"
                            checked={mapViewMode === 'schematic'}
                            onChange={() => setMapViewMode('schematic')}
                            style={{
                              marginRight: '6px',
                              cursor: 'pointer'
                            }}
                          />
                          図式化路線図(準備中)
                        </label>
                      </div>
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
                  {visibleRoutesData.map(([routeKey]) => {
                    const isVisible = visibleRoutes.has(routeKey as RouteKey);
                    const isInSelectedRoute = selectedRoute && selectedRoute.segments.some(
                      segment => segment.routeKey === routeKey && segment.routeKey !== 'walking'
                    );

                    return (
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
                          backgroundColor: isInSelectedRoute
                            ? 'rgba(33, 150, 243, 0.25)'
                            : isVisible
                              ? 'rgba(0, 123, 255, 0.1)'
                              : 'rgba(108, 117, 125, 0.1)',
                          border: isInSelectedRoute
                            ? '2px solid #2196F3'
                            : `1px solid ${isVisible ? '#007bff' : '#6c757d'}`,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={visibleRoutes.has(routeKey as RouteKey)}
                          onChange={(e) => {
                            console.log('Checkbox clicked for route:', routeKey, 'checked:', e.target.checked);
                            e.stopPropagation(); // 親のクリックイベントを防ぐ
                            toggleRoute(routeKey as RouteKey);
                          }}
                          style={{
                            marginRight: '8px',
                            cursor: 'pointer'
                          }}
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
                          color: isInSelectedRoute
                            ? '#2196F3'
                            : isVisible
                              ? '#333'
                              : '#6c757d',
                          lineHeight: '1.2',
                          fontWeight: isInSelectedRoute ? 'bold' : 'normal'
                        }}>
                          {routeNames[routeKey as RouteKey]}
                          {isInSelectedRoute && (
                            <span style={{
                              fontSize: '10px',
                              marginLeft: '4px',
                              color: '#2196F3',
                              fontWeight: 'normal'
                            }}>
                              (選択中のルート)
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}

                </div>
              )}
            </div>
          )}

          {/* ホバーツールチップ */}
          {hoveredRoute && hoverTooltipPosition && (() => {
            console.log('🟢🟢🟢 === TOOLTIP RENDER DEBUG START ===');
            console.log('🟢 Raw tooltip position:', hoverTooltipPosition);
            console.log('🟢 CSS left:', (hoverTooltipPosition.x - 100) + 'px (centered by subtracting 100px)');
            console.log('🟢 CSS top:', hoverTooltipPosition.y + 'px (direct positioning)');
            console.log('🟢 No transform used - direct positioning');
            console.log('🟢 === TOOLTIP RENDER DEBUG END ===');
            return (
              <div
                style={{
                  position: 'fixed',
                  left: `${hoverTooltipPosition.x - 75}px`, // 中央揃えのため半分の幅（約150px）を引く
                  top: `${hoverTooltipPosition.y}px`,
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  zIndex: 9998,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(0,0,0,0.2)',
                  minWidth: '150px',
                  textAlign: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: routeColors[hoveredRoute] || '#666',
                    borderRadius: '50%',
                    border: '1px solid rgba(0,0,0,0.3)',
                    flexShrink: 0
                  }} />
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    lineHeight: '1',
                    whiteSpace: 'nowrap'
                  }}>
                    {getRouteDestination(hoveredRoute)?.description || routeNames[hoveredRoute as RouteKey] || hoveredRoute}
                  </div>
                </div>

                {/* 推薦経路でのこの路線が使われているルート番号と区間を表示 */}
                {departure && arrival && routeRecommendations.length > 0 && (() => {
                  // ホバー中の路線が使われている推薦ルートの番号と利用区間を収集
                  const routeInfo = [];
                  routeRecommendations.forEach((recommendation, index) => {
                    for (const segment of recommendation.segments) {
                      if (segment.routeKey === hoveredRoute) {
                        // このルートで使用される区間を特定
                        const startStation = segment.stations[0].name;
                        const endStation = segment.stations[segment.stations.length - 1].name;
                        
                        routeInfo.push({
                          routeNumber: index + 1,
                          startStation,
                          endStation,
                          segment
                        });
                        break;
                      }
                    }
                  });

                  if (routeInfo.length > 0) {
                    return (
                      <div style={{ fontSize: '11px', opacity: 0.9 }}>
                        <div style={{ color: '#333', marginBottom: '2px' }}>
                          推薦ルート: {routeInfo.map(info => info.routeNumber).join(', ')}
                        </div>
                        <div style={{ color: '#333', fontSize: '10px' }}>
                          {routeInfo[0].startStation} → {routeInfo[0].endStation}
                        </div>
                      </div>
                    );
                  }

                  // 推薦経路に含まれていない場合は通常の行先表示
                  return (
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>
                      {getRouteDestination(hoveredRoute)?.destinations.join(' ⇔ ') || ''}
                    </div>
                  );
                })()}

                {/* 出発駅・到着駅が未設定の場合 */}
                {(!departure || !arrival) && (() => {
                  const routeDestination = getRouteDestination(hoveredRoute);
                  if (routeDestination) {
                    // 出発駅のみ設定されている場合
                    if (departure && !arrival) {
                      const direction = getDirectionText(hoveredRoute, departure.name, '');
                      return (
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>
                          出発駅: {departure.name}, {direction || `${routeDestination.destinations.join(' または ')}`}
                        </div>
                      );
                    }
                    // 到着駅のみ設定されている場合
                    else if (arrival && !departure) {
                      return (
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>
                          {arrival.name}行き
                        </div>
                      );
                    }
                    // どちらも未設定の場合は両端駅を表示
                    else {
                      return (
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>
                          {routeDestination.destinations.join(' ⇔ ')}
                        </div>
                      );
                    }
                  }
                  return null;
                })()}
              </div>
            );
          })()}

          {/* 路線情報ポップアップ */}
          {clickedRoute && routePopupPosition && (() => {
            console.log('🔵🔵🔵 RENDERING POPUP:', clickedRoute, 'position:', routePopupPosition);
            console.log('🔵 Popup should be visible at:', `left: ${routePopupPosition.x}px, top: ${routePopupPosition.y}px`);
            return (
              <div
                id="route-popup-debug"
                style={{
                  position: 'fixed',
                  left: `${routePopupPosition.x}px`,
                  top: `${routePopupPosition.y}px`,
                  backgroundColor: 'yellow',
                  border: '5px solid #ff0000',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.8)',
                  zIndex: 99999,
                  minWidth: '300px',
                  transform: 'translate(-50%, -100%)',
                  marginTop: '-20px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={handleRoutePopupClose}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: routeColors[clickedRoute] || '#666',
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      {getRouteDestination(clickedRoute)?.description || routeNames[clickedRoute as RouteKey] || clickedRoute}
                    </div>
                  </div>

                  {/* 出発駅と行先のみ表示 */}
                  {departure && arrival && (() => {
                    const direction = getDirectionText(clickedRoute, departure.name, arrival.name);
                    return (
                      <div style={{
                        fontSize: '14px',
                        color: '#333',
                        textAlign: 'center'
                      }}>
                        <div style={{ marginBottom: '4px' }}>
                          <strong>{departure.name}</strong> から
                        </div>
                        {direction && (
                          <div style={{
                            fontSize: '16px',
                            color: '#4CAF50',
                            fontWeight: 'bold'
                          }}>
                            {direction}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* 出発駅や到着駅が設定されていない場合 */}
                  {(!departure || !arrival) && (
                    <div style={{
                      fontSize: '14px',
                      color: '#666',
                      textAlign: 'center'
                    }}>
                      <strong>行先:</strong> {getRouteDestination(clickedRoute)?.destinations.join(' ⇔ ') || '情報なし'}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RailwayMap;