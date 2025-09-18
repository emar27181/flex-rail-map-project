import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';
import StationSelector from './StationSelector';
import CoverageAnalysis from './CoverageAnalysis';
import ErrorBoundary from './ErrorBoundary';
import SchematicMap from './SchematicMap';
import { RouteFinder, TimeFilter, type RouteResult, type StationWithTime } from '../utils/routeFinder';
import { getRouteDestination, getRouteDisplayText, getDirectionText, commonDirections } from '../data/routeDestinations';
import { useTheme, getThemeColors, adjustRouteColorForTheme } from '../contexts/ThemeContext';
import { translateStation, translateRoute, translateUI } from '../utils/translation';
import LegendStationMarkers from './legend/LegendStationMarkers';
import LegendRouteList from './legend/LegendRouteList';
import LegendRouteRecommendations from './legend/LegendRouteRecommendations';
import LegendDisplayOptions from './legend/LegendDisplayOptions';

// デバッグ用のwindow拡張
declare global {
  interface Window {
    lastMouseLog?: number;
  }
}

interface RailwayMapProps {
  className?: string;
  language: 'japanese' | 'english';
}

const RailwayMap: React.FC<RailwayMapProps> = ({ className, language }) => {
  // console.log('RailwayMap component initialized');
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

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

  // Language state management
  const currentLanguage = language;

  // Debug language changes
  console.log('Current language state:', { language, currentLanguage });

  // 折りたたみ状態の管理
  const [isStationSelectorExpanded, setIsStationSelectorExpanded] = useState(true);
  const [isRouteToggleExpanded, setIsRouteToggleExpanded] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(true);

  // 表示モードの管理
  const [showTransferStationsOnly, setShowTransferStationsOnly] = useState(true);
  const [showTravelTimes, setShowTravelTimes] = useState(true);
  const [showRouteToggleSection, setShowRouteToggleSection] = useState(false);
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
      const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'white';
      const shadowColor = theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)';
      const translatedStationName = translateStation(station.name, currentLanguage);
      const stationNameWidth = translatedStationName.length * 11 + 12;
      return new DivIcon({
        html: `<div style="background:${color};color:white;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:bold;white-space:nowrap;border:1px solid ${borderColor};box-shadow:0 1px 3px ${shadowColor};text-align:center;opacity:${opacity}">${translatedStationName}</div>`,
        className: 'station-name-marker',
        iconSize: [stationNameWidth, 18],
        iconAnchor: [stationNameWidth / 2, 9]
      });
    } else {
      const stationSize = Math.max(8, Math.min(16, zoomLevel - 8));
      const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'white';
      const shadowColor = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)';
      return new DivIcon({
        html: `<div style="background:${color};width:${stationSize}px;height:${stationSize}px;border:1px solid ${borderColor};box-shadow:0 1px 2px ${shadowColor};opacity:${opacity}"></div>`,
        className: 'station-marker',
        iconSize: [stationSize, stationSize],
        iconAnchor: [stationSize / 2, stationSize / 2]
      });
    }
  }, [MapComponents, currentLanguage, theme]);

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
    // 英語駅名の場合は文字幅係数を調整（英語は日本語より文字幅が狭い）
    const charWidthMultiplier = language === 'english' ? 0.4 : 0.6;
    const padding = language === 'english' ? 8 : 16; // 英語時はパディング削減
    const textWidth = stationName.length * fontSize * charWidthMultiplier + padding;
    const markerWidth = Math.max(baseMarkerSize, Math.min(textWidth, language === 'english' ? 150 : 200)); // 英語時は最大幅をさらに制限
    const markerHeight = baseMarkerSize;

    const bgColor = theme === 'dark' ? colors.surfaceElevated : 'white';
    const shadowColor = theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)';
    return new DivIcon({
      html: `<div style="background:${bgColor};border:3px solid ${markerColor};border-radius:4px;width:${markerWidth}px;height:${markerHeight}px;display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;font-weight:bold;color:${markerColor};box-shadow:0 3px 6px ${shadowColor};position:relative;z-index:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 ${language === 'english' ? '2px' : '4px'}">${stationName}</div>`,
      className: 'special-station-marker-inline',
      iconSize: [markerWidth, markerHeight],
      iconAnchor: [markerWidth / 2, markerHeight / 2]
    });
  }, [MapComponents, theme, colors, language]);

  const createTimeIcon = useCallback((time: number, color: string, zoomLevel: number, isSection = false) => {
    if (!MapComponents?.DivIcon || !showTravelTimes) return null;

    const { DivIcon } = MapComponents;
    const fontSize = Math.max(10, Math.round(zoomLevel * 0.8));
    const padding = Math.max(2, Math.round(zoomLevel * 0.3));

    const bgColor = theme === 'dark' ? 'rgba(40,40,40,0.9)' : 'rgba(255,255,255,0.9)';
    const shadowColor = theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)';
    const translatedTimeText = translateUI('minutesShort', currentLanguage, { time: time.toString() });
    const timeTextWidth = translatedTimeText.length * fontSize * 0.6 + padding * 4;
    return new DivIcon({
      html: `<div style="background:${bgColor};border:1px solid ${color};border-radius:3px;padding:${padding}px ${padding + 2}px;font-size:${fontSize}px;font-weight:bold;color:${color};box-shadow:0 1px 3px ${shadowColor};white-space:nowrap;text-align:center">${translatedTimeText}</div>`,
      className: isSection ? 'time-text-section' : 'time-text',
      iconSize: [timeTextWidth, fontSize + padding * 2],
      iconAnchor: [timeTextWidth / 2, (fontSize + padding * 2) / 2]
    });
  }, [MapComponents, currentLanguage, theme, showTravelTimes]);

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

  // 最終的な重複除去関数（表示レベル）
  const removeFinalDuplicates = useCallback((routes: RouteResult[]): RouteResult[] => {
    const uniqueRoutes: RouteResult[] = [];
    const seenSignatures = new Set<string>();

    routes.forEach((route, index) => {
      // 乗り換え駅 + 所要時間 + 乗り換え回数の組み合わせで判定
      const transferStations = [];
      for (let i = 0; i < route.segments.length - 1; i++) {
        const currentEnd = route.segments[i].stations[route.segments[i].stations.length - 1]?.name;
        if (currentEnd) {
          transferStations.push(currentEnd);
        }
      }

      const signature = `${route.transfers}transfers-${Math.round(route.totalTime)}min-${transferStations.join(',')}`;

      if (!seenSignatures.has(signature)) {
        seenSignatures.add(signature);
        uniqueRoutes.push(route);
        console.log(`✅ Display route ${uniqueRoutes.length}: ${signature}`);
      } else {
        console.log(`❌ Skipped display duplicate ${index + 1}: ${signature}`);
      }
    });

    return uniqueRoutes;
  }, []);

  // 出発駅と到着駅が設定された時にルート検索を実行
  useEffect(() => {
    if (departure && arrival) {
      const routeResults = routeFinder.findRoutes(departure, arrival, maxRouteRecommendations * 2); // 多めに取得

      // 表示レベルでの最終重複除去
      const finalUniqueRoutes = removeFinalDuplicates(routeResults).slice(0, maxRouteRecommendations);

      setRouteRecommendations(finalUniqueRoutes);
      setSelectedRoute(null);

      // デバッグ：推薦された経路の詳細をログ出力
      console.log(`\n=== Final Route Recommendations for ${departure.name} → ${arrival.name} ===`);
      finalUniqueRoutes.forEach((route, index) => {
        const routeDescription = route.segments
          .filter(seg => seg.routeKey !== 'walking')
          .map(seg => seg.routeName || seg.routeKey)
          .join(' → ');

        const transferStations = [];
        for (let i = 0; i < route.segments.length - 1; i++) {
          const currentEnd = route.segments[i].stations[route.segments[i].stations.length - 1]?.name;
          if (currentEnd) {
            transferStations.push(currentEnd);
          }
        }

        console.log(`${index + 1}: ${routeDescription} (${route.totalTime}min, ${route.transfers} transfers)`);
        console.log(`   乗り換え駅: ${transferStations.join(', ') || 'なし'}`);
      });

      // visibleRoutesの制御は時間フィルターのuseEffectで行う
    } else {
      setRouteRecommendations([]);
      setSelectedRoute(null);
    }
  }, [departure, arrival, routeFinder, maxRouteRecommendations, removeFinalDuplicates]);

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

  // 駅選択に応じた路線表示制御
  useEffect(() => {
    console.log('🚉 Station selection changed:', { departure: departure?.name, arrival: arrival?.name });

    // 両方の駅が選択されている場合は、全路線表示（既存の動作）
    if (departure && arrival) {
      console.log('🚉 Both stations selected, showing all routes');
      return;
    }

    // 片方の駅のみ選択されている場合は、その駅の通過路線のみ表示
    if (departure && !arrival) {
      const departureRoutes = getRoutesForStation(departure.name);
      console.log('🚉 Showing routes for departure station:', departure.name, 'Routes:', departureRoutes);
      setVisibleRoutes(new Set(departureRoutes));
    } else if (arrival && !departure) {
      const arrivalRoutes = getRoutesForStation(arrival.name);
      console.log('🚉 Showing routes for arrival station:', arrival.name, 'Routes:', arrivalRoutes);
      setVisibleRoutes(new Set(arrivalRoutes));
    } else {
      // 何も選択されていない場合は全路線表示
      console.log('🚉 No stations selected, showing all routes');
      setVisibleRoutes(new Set(Object.keys(routes) as RouteKey[]));
    }
  }, [departure, arrival]);

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
        border: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface
      }}>
        <div>
          <div>マップを読み込み中...</div>
          <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '10px' }}>
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
    const color = adjustRouteColorForTheme(routeColors[routeKey], theme);

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

            const specialIcon = createSpecialStationIcon(isDeparture, zoomLevel, translateStation(station.name, currentLanguage));
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
                    <strong>{translateStation(station.name, currentLanguage)}</strong>
                    {isDeparture && <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>{translateUI('departure', currentLanguage)}</div>}
                    {isArrival && <div style={{ color: '#F44336', fontWeight: 'bold' }}>{translateUI('arrival', currentLanguage)}</div>}
                    
                    {/* 通っている路線を表示 */}
                    <div style={{ marginTop: '8px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>{currentLanguage === 'japanese' ? '通っている路線:' : 'Routes:'}:</div>
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
                            <span style={{ color: adjustRouteColorForTheme(routeColors[stationRouteKey], theme), fontWeight: '500' }}>
                              {translateRoute(getRouteDestination(stationRouteKey)?.description || routeNames[stationRouteKey] || stationRouteKey, currentLanguage)}
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
{translateUI('setDepartureStation', currentLanguage)}
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
{translateUI('setArrivalStation', currentLanguage)}
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
                    <strong>{translateStation(station.name, currentLanguage)}</strong>
                    
                    {/* 通っている路線を表示 */}
                    <div style={{ marginTop: '8px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>{currentLanguage === 'japanese' ? '通っている路線:' : 'Routes:'}:</div>
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
                            <span style={{ color: adjustRouteColorForTheme(routeColors[stationRouteKey], theme), fontWeight: '500' }}>
                              {translateRoute(getRouteDestination(stationRouteKey)?.description || routeNames[stationRouteKey] || stationRouteKey, currentLanguage)}
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
{translateUI('setDepartureStation', currentLanguage)}
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
{translateUI('setArrivalStation', currentLanguage)}
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
      <div className={className} style={{ padding: '0 20px' }}>
        {/* 駅選択UI */}
        <StationSelector
          departure={departure}
          arrival={arrival}
          onDepartureChange={setDeparture}
          onArrivalChange={setArrival}
          isExpanded={isStationSelectorExpanded}
          onToggleExpanded={() => setIsStationSelectorExpanded(!isStationSelectorExpanded)}
          language={currentLanguage}
        />

        {/* カバレッジ分析 - オフ */}
        {/* <CoverageAnalysis /> */}

        {/* ルート推薦表示は凡例内に統合 */}

        {showRouteToggleSection && (
          <div style={{ marginBottom: '15px', padding: '15px', border: `1px solid ${colors.border}`, borderRadius: '8px', backgroundColor: colors.surface }}>
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
            <h3 style={{ margin: '0', color: colors.text }}>{translateUI('routeToggle', currentLanguage)}</h3>
            <span style={{
              fontSize: '18px',
              color: colors.textSecondary,
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
                  color: colors.text
                }}>
                  <span style={{ marginRight: '8px' }}>{translateUI('routeRecommendationCount', currentLanguage)}</span>
                  <select
                    value={maxRouteRecommendations}
                    onChange={(e) => setMaxRouteRecommendations(Number(e.target.value))}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${colors.border}`,
                      fontSize: '14px',
                      backgroundColor: colors.surfaceElevated,
                      color: colors.text
                    }}
                  >
                    <option value={1}>{translateUI('routeCount', currentLanguage, { count: '1' })}</option>
                    <option value={2}>{translateUI('routeCount', currentLanguage, { count: '2' })}</option>
                    <option value={3}>{translateUI('routeCount', currentLanguage, { count: '3' })}</option>
                    <option value={5}>{translateUI('routeCount', currentLanguage, { count: '5' })}</option>
                    <option value={10}>{translateUI('routeCount', currentLanguage, { count: '10' })}</option>
                  </select>
                  <button
                    onClick={selectAllRoutes}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: colors.success,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
{translateUI('allShow', currentLanguage)}
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
{translateUI('allHide', currentLanguage)}
                  </button>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: colors.textSecondary,
                  marginTop: '4px'
                }}>
{translateUI('routeSwitchNote', currentLanguage)}
                </div>
              </div>

              {/* 時間フィルター設定 */}
              <div style={{
                marginBottom: '10px',
                padding: '10px',
                border: `1px solid ${colors.borderLight}`,
                borderRadius: '6px',
                backgroundColor: colors.surfaceElevated
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: colors.text,
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={timeFilterEnabled}
                      onChange={(e) => setTimeFilterEnabled(e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
{translateUI('timeFilter', currentLanguage)}
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
                      <span style={{ color: colors.textSecondary }}>{translateUI('baseStation', currentLanguage)}</span>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: departure ? colors.successLight : colors.surface,
                        border: departure ? '1px solid #4CAF50' : `1px solid ${colors.border}`,
                        borderRadius: '4px',
                        color: departure ? colors.success : colors.textSecondary,
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>
                        {departure ? translateStation(departure.name, currentLanguage) : translateUI('pleaseSetDeparture', currentLanguage)}
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
                          border: `1px solid ${colors.border}`,
                          fontSize: '13px'
                        }}
                        disabled={!departure}
                      >
                        <option value={5}>{translateUI('minutesShort', currentLanguage, { time: '5' })}</option>
                        <option value={10}>{translateUI('minutesShort', currentLanguage, { time: '10' })}</option>
                        <option value={15}>{translateUI('minutesShort', currentLanguage, { time: '15' })}</option>
                        <option value={20}>{translateUI('minutesShort', currentLanguage, { time: '20' })}</option>
                        <option value={30}>{translateUI('minutesShort', currentLanguage, { time: '30' })}</option>
                        <option value={45}>{translateUI('minutesShort', currentLanguage, { time: '45' })}</option>
                        <option value={60}>{translateUI('minutesShort', currentLanguage, { time: '60' })}</option>
                      </select>
                      {timeFilterEnabled && departure && stationsWithinTime.length > 0 && (
                        <span style={{ color: colors.textSecondary, fontSize: '11px' }}>
{translateUI('stationsCount', currentLanguage, { count: stationsWithinTime.length.toString() })}
                        </span>
                      )}
                    </div>

                    {timeFilterEnabled && !departure && (
                      <div style={{
                        marginTop: '8px',
                        padding: '6px',
                        backgroundColor: colors.warningLight,
                        border: `1px solid ${colors.warning}`,
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: colors.warning
                      }}>
{translateUI('accessibleStations', currentLanguage, { minutes: timeFilterMaxMinutes.toString() })}
                      </div>
                    )}
                  </div>
                )}

                {/* デバッグ用テストボタン */}
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '5px' }}>
                  <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '8px' }}>デバッグテスト</div>
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
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  backgroundColor: colors.surfaceElevated,
                  overflowY: 'auto',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  alignContent: 'flex-start'
                }}
              >
                {Object.entries(routes).map(([routeKey, _]) => {
                  const routeName = routeNames[routeKey as RouteKey];
                  const routeColor = adjustRouteColorForTheme(routeColors[routeKey as RouteKey], theme);
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
                          e.currentTarget.style.backgroundColor = colors.surfaceHover;
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
                color: colors.textSecondary,
                marginTop: '5px'
              }}>
{translateUI('clickToToggleVisibility', currentLanguage)}
              </div>
            </div>
          )}
          </div>
        )}

        <div style={{ height: '600px', width: '100%', border: `1px solid ${colors.border}`, position: 'relative' }}>
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
                url={theme === 'dark'
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                }
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
              backgroundColor: colors.surfaceElevated,
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              boxShadow: `0 2px 6px ${colors.shadow}`,
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
                  borderBottom: isLegendExpanded ? `1px solid ${colors.borderLight}` : 'none'
                }}
              >
                <span style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: colors.text
                }}>
{translateUI('displayedRoutes', currentLanguage)}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: colors.textSecondary,
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
                  {/* 1. マーカー表示 (Current Station Settings) */}
                  <LegendStationMarkers
                    departure={departure}
                    arrival={arrival}
                    theme={theme}
                    language={currentLanguage}
                  />

                  {/* 2. 路線一覧 (Route List) */}
                  <LegendRouteList
                    visibleRoutesData={visibleRoutesData}
                    visibleRoutes={visibleRoutes}
                    selectedRoute={selectedRoute}
                    routeColors={routeColors}
                    routeNames={routeNames}
                    showTransferStationsOnly={showTransferStationsOnly}
                    showTravelTimes={showTravelTimes}
                    theme={theme}
                    language={currentLanguage}
                    onToggleRoute={toggleRoute}
                    onSelectAllRoutes={selectAllRoutes}
                    onDeselectAllRoutes={deselectAllRoutes}
                    onShowTransferStationsOnlyChange={setShowTransferStationsOnly}
                    onShowTravelTimesChange={setShowTravelTimes}
                    adjustRouteColorForTheme={adjustRouteColorForTheme}
                  />

                  {/* 3. 推薦ルート選択 (Route Recommendations) */}
                  <LegendRouteRecommendations
                    routeRecommendations={routeRecommendations}
                    selectedRoute={selectedRoute}
                    theme={theme}
                    language={currentLanguage}
                    onRouteSelect={handleRouteSelect}
                    onShowAllRoutes={handleShowAllRoutes}
                  />

                  {/* 4. 表示オプション (Display Options) */}
                  <LegendDisplayOptions
                    mapViewMode={mapViewMode}
                    theme={theme}
                    language={currentLanguage}
                    onMapViewModeChange={setMapViewMode}
                  />

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
                  backgroundColor: colors.surfaceElevated,
                  color: colors.text,
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
                    backgroundColor: routeColors[hoveredRoute] || colors.textSecondary,
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
                    {translateRoute(getRouteDestination(hoveredRoute)?.description || routeNames[hoveredRoute as RouteKey] || hoveredRoute, currentLanguage)}
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
                        <div style={{ color: colors.text, marginBottom: '2px' }}>
{translateUI('recommendedRoute', currentLanguage)}: {routeInfo.map(info => info.routeNumber).join(', ')}
                        </div>
                        <div style={{
                          color: colors.text,
                          fontSize: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}>
                          <span>{translateStation(routeInfo[0].startStation, currentLanguage)}</span>
                          <span style={{
                            color: '#4CAF50',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>→</span>
                          <span>{translateStation(routeInfo[0].endStation, currentLanguage)}</span>
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
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <span>{translateUI('departureStationLabel', currentLanguage)} {translateStation(departure.name, currentLanguage)}</span>
                            <span style={{
                              color: '#4CAF50',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>→</span>
                            <span>{direction || `${routeDestination.destinations.join(' または ')}`}</span>
                          </div>
                        </div>
                      );
                    }
                    // 到着駅のみ設定されている場合
                    else if (arrival && !departure) {
                      return (
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <span>どこから</span>
                            <span style={{
                              color: '#4CAF50',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>→</span>
                            <span>{arrival.name}行き</span>
                          </div>
                        </div>
                      );
                    }
                    // どちらも未設定の場合は両端駅を表示
                    else {
                      return (
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <span>{routeDestination.destinations[0]}</span>
                            <span style={{
                              color: colors.textSecondary,
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>⇔</span>
                            <span>{routeDestination.destinations[1] || routeDestination.destinations[0]}</span>
                          </div>
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
                      backgroundColor: routeColors[clickedRoute] || colors.textSecondary,
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: colors.text
                    }}>
                      {translateRoute(getRouteDestination(clickedRoute)?.description || routeNames[clickedRoute as RouteKey] || clickedRoute, currentLanguage)}
                    </div>
                  </div>

                  {/* 出発駅と行先のみ表示 */}
                  {departure && arrival && (() => {
                    const direction = getDirectionText(clickedRoute, departure.name, arrival.name);
                    return (
                      <div style={{
                        fontSize: '14px',
                        color: colors.text,
                        textAlign: 'center'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <strong>{translateStation(departure.name, currentLanguage)}</strong>
                          <span style={{
                            color: '#4CAF50',
                            fontSize: '18px',
                            fontWeight: 'bold'
                          }}>→</span>
                          <span>{direction || translateStation(arrival.name, currentLanguage)}</span>
                        </div>
                        {direction && direction !== arrival.name && (
                          <div style={{
                            fontSize: '12px',
                            color: colors.textSecondary,
                            marginTop: '4px'
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
                      color: colors.textSecondary,
                      textAlign: 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <span>{getRouteDestination(clickedRoute)?.destinations[0] || '始発'}</span>
                        <span style={{
                          color: colors.textSecondary,
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}>⇔</span>
                        <span>{getRouteDestination(clickedRoute)?.destinations[1] || '終点'}</span>
                      </div>
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