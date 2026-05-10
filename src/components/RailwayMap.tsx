import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Maximize2, Minimize2, Sun, Moon } from 'lucide-react';
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
import { getFurigana } from '../utils/furigana';
import LegendStationMarkers from './legend/LegendStationMarkers';
import LegendRouteList from './legend/LegendRouteList';
import LegendRouteRecommendations from './legend/LegendRouteRecommendations';
import LegendDisplayOptions from './legend/LegendDisplayOptions';
import DiagramMap from './DiagramMap';
import { getStoppingTrainTypes, generateStationDescription } from '../data/stationTrainTypeAnalysis';
import { getStationNumber, getAnyStationNumber } from '../data/stationNumbers';
import { getStationBorderStyleByPattern, getBorderStyleExplanation } from '../data/stationBorderStyles';
import { attachDebugFunctions } from '../utils/stationAnalysisUtils';
import CookieBanner from './CookieBanner';
import {
  getNextDepartures,
  getDeparturesAround,
  getDirectionIndex as getTimetableDirectionIndex,
  hasTimetableData,
  addMinutes,
  type Departure,
} from '../data/timetableData';
import { FS } from '../constants/ui';

// デバッグ用のwindow拡張
declare global {
  interface Window {
    lastMouseLog?: number;
  }
}

interface RailwayMapProps {
  className?: string;
  language: 'japanese' | 'english';
  onLanguageChange?: (language: 'japanese' | 'english') => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const RailwayMap: React.FC<RailwayMapProps> = ({ className, language, onLanguageChange, onFullscreenChange }) => {
  // console.log('RailwayMap component initialized');
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);

  const [mapCenter, setMapCenter] = useState<[number, number]>([35.57765, 139.66165]); // Default center: midpoint of Yokohama and Shinjuku
  const [visibleRoutes, setVisibleRoutes] = useState<Set<RouteKey>>(new Set(Object.keys(routes) as RouteKey[]));
  const [availableRoutes, setAvailableRoutes] = useState<Set<RouteKey>>(new Set(Object.keys(routes) as RouteKey[]));
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(20); // Adjusted for better initial view
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
  const [selectedRouteIndices, setSelectedRouteIndices] = useState<Set<number> | null>(null);

  // Language state management
  const currentLanguage = language;

  // Debug language changes
  console.log('Current language state:', { language, currentLanguage });

  // 折りたたみ状態の管理
  const [isStationSelectorExpanded, setIsStationSelectorExpanded] = useState(true);
  const [isRouteToggleExpanded, setIsRouteToggleExpanded] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(true);

  // 表示モードの管理
  const [showTransferStationsOnly, setShowTransferStationsOnly] = useState(false);
  const [showExpressStationsOnly, setShowExpressStationsOnly] = useState(false);
  const [showTravelTimes, setShowTravelTimes] = useState(true);
  const [showStationNames, setShowStationNames] = useState(true);
  const [showFurigana, setShowFurigana] = useState(false);
  const [showStationNumbers, setShowStationNumbers] = useState(language === 'english');
  const [showOsmTiles, setShowOsmTiles] = useState(true);
  const [showRouteToggleSection, setShowRouteToggleSection] = useState(false);
  // 地図表示モード
  const [mapViewMode, setMapViewMode] = useState<'realistic' | 'schematic'>('realistic');

  // 列車種別表示モード（常にオン）
  const trainTypeViewEnabled = true;
  const [selectedTrainRoute, setSelectedTrainRoute] = useState<RouteKey | null>(null);
  const [selectedTrainType, setSelectedTrainType] = useState<string | null>(null);

  // 経路推薦設定
  const [maxRouteRecommendations, setMaxRouteRecommendations] = useState(10);

  // 時間フィルター機能
  const [timeFilterEnabled, setTimeFilterEnabled] = useState(false);
  const [timeFilterMaxMinutes, setTimeFilterMaxMinutes] = useState(15);
  const [stationsWithinTime, setStationsWithinTime] = useState<StationWithTime[]>([]);
  const [actuallyDisplayedStations, setActuallyDisplayedStations] = useState<Set<string>>(new Set());

  // フルスクリーン状態（モバイルはデフォルトでフルスクリーン）
  const [isFullscreen, setIsFullscreen] = useState(true);

  // 時刻表モード
  const [timetableModeEnabled, setTimetableModeEnabled] = useState(true);
  const [timetableBaseTime, setTimetableBaseTime] = useState('13:00');

  // モバイル検出
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePanelTab, setMobilePanelTab] = useState<'station' | 'legend'>('station');
  const [isMobilePanelExpanded, setIsMobilePanelExpanded] = useState(true);
  const [isStationSearching, setIsStationSearching] = useState(false);
  const handleSearchingChange = (searching: boolean) => {
    setIsStationSearching(searching);
    if (searching && isFullscreen && isMobile) {
      setMobilePanelTab('station');
      setIsMobilePanelExpanded(true);
    }
  };

  // 駅時刻表ツールチップ状態
  const [stationTooltip, setStationTooltip] = useState<{ stationName: string; station: Station; x: number; y: number } | null>(null);
  // ツールチップ内で選択中の路線
  const [tooltipSelectedRoute, setTooltipSelectedRoute] = useState<string | null>(null);
  const [showAllTooltipDeps, setShowAllTooltipDeps] = useState(false);

  // 路線ホバー・ポップアップ状態
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [clickedRoute, setClickedRoute] = useState<string | null>(null);
  const [routePopupPosition, setRoutePopupPosition] = useState<{ x: number, y: number } | null>(null);
  const [hoverTooltipPosition, setHoverTooltipPosition] = useState<{ x: number, y: number } | null>(null);

  // 現在地表示
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const isFirstPositionRef = useRef(true);
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);



  // 位置情報をデフォルトでON（初回マウント時に自動開始）
  useEffect(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    isFirstPositionRef.current = true;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        isFirstPositionRef.current = false;
      },
      () => {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );
    watchIdRef.current = id;
    return () => {
      navigator.geolocation.clearWatch(id);
      watchIdRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // モバイル幅の監視
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // フルスクリーン状態を親に通知
  useEffect(() => {
    onFullscreenChange?.(isFullscreen);
  }, [isFullscreen, onFullscreenChange]);

  // 駅が変わったらツールチップの選択路線・すべて表示をリセット
  useEffect(() => {
    setTooltipSelectedRoute(null);
    setShowAllTooltipDeps(false);
  }, [stationTooltip?.stationName]);

  // 列車種別表示: 路線変更時に列車種別をリセット
  useEffect(() => {
    if (selectedTrainRoute) {
      setSelectedTrainType(null);
    }
  }, [selectedTrainRoute]);

  // デバッグ用
  useEffect(() => {
    console.log('🟢🟢🟢 clickedRoute changed:', clickedRoute);
  }, [clickedRoute]);

  useEffect(() => {
    console.log('🟢🟢🟢 routePopupPosition changed:', routePopupPosition);
  }, [routePopupPosition]);

  const routeFinder = useMemo(() => {
    const finder = new RouteFinder();
    // 初期化時にデバッグ情報を出力
    finder.debugStationRegistration();
    return finder;
  }, []);
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

  // 全駅（重複なし）
  const allUniqueStations = useMemo(() => {
    const map = new Map<string, Station>();
    Object.values(routes).forEach(stationList => {
      stationList.forEach(station => {
        if (!map.has(station.name)) map.set(station.name, station);
      });
    });
    return Array.from(map.values());
  }, []);

  // 現在地から最も近い駅を返す
  const findNearestStation = useCallback((lat: number, lng: number): Station | null => {
    let nearest: Station | null = null;
    let minDist = Infinity;
    allUniqueStations.forEach(station => {
      const dlat = station.lat - lat;
      const dlng = station.lng - lng;
      const dist = dlat * dlat + dlng * dlng;
      if (dist < minDist) { minDist = dist; nearest = station; }
    });
    return nearest;
  }, [allUniqueStations]);

  // 現在地付近の駅を出発に設定するコールバック
  const handleSetNearestDeparture = useCallback(() => {
    if (!userLocation) return;
    const nearest = findNearestStation(userLocation[0], userLocation[1]);
    if (nearest) setDeparture(nearest);
  }, [userLocation, findNearestStation]);

  // 使用する乗換駅セットを決定
  const transferStations = useMemo(() => {
    // 推薦ルートがある場合は推薦ベースの乗換駅、ない場合は全乗換駅
    const activeTransferStations = routeRecommendations.length > 0
      ? recommendationTransferStations
      : allTransferStations;

    console.log(`Using transfer stations: ${routeRecommendations.length > 0 ? 'recommendation-based' : 'all-routes-based'} (${activeTransferStations.size} stations)`);

    return activeTransferStations;
  }, [routeRecommendations.length, recommendationTransferStations, allTransferStations]);

  // 経路上の各駅の出発時刻マップ（時刻表モード用）
  // 同一駅が複数セグメントに登場する場合も全エントリを保持する
  type StationJourneyEntry = { depTime: string; routeKey: string; directionIndex: number };
  const stationTimelineMap = useMemo(() => {
    const map = new Map<string, StationJourneyEntry[]>();
    if (!timetableModeEnabled) return map;
    const selectedIdx = selectedRouteIndices ? [...selectedRouteIndices][0] : 0;
    const route = routeRecommendations[selectedIdx];
    if (!route) return map;

    let cumTime = 0;
    for (const seg of route.segments) {
      if (seg.isWalkingTransfer) {
        cumTime += (seg as any).walkingTime ?? 5;
        continue;
      }
      const n = seg.stations.length;
      const fromName = seg.stations[0]?.name ?? '';
      const toName   = seg.stations[n - 1]?.name ?? '';
      const dirIdx   = getTimetableDirectionIndex(seg.routeKey, fromName, toName);
      seg.stations.forEach((st, i) => {
        const stTime = addMinutes(timetableBaseTime, cumTime + Math.round(seg.time * i / Math.max(n - 1, 1)));
        const existing = map.get(st.name) ?? [];
        // 同じ routeKey が既に登録済みの場合は追加しない
        if (!existing.some(e => e.routeKey === seg.routeKey)) {
          existing.push({ depTime: stTime, routeKey: seg.routeKey, directionIndex: dirIdx });
          map.set(st.name, existing);
        }
      });
      cumTime += seg.time;
    }
    return map;
  }, [timetableModeEnabled, routeRecommendations, selectedRouteIndices, timetableBaseTime]);

  const TRAIN_TYPE_COLOR: Record<string, string> = {
    '各停': '#2980b9', '普通': '#2980b9',
    '準急': '#e87a2a',
    '快速': '#f39800', '快速アクティー': '#f39800', '特別快速': '#f39800',
    '急行': '#e74c3c',
    '快特': '#8e44ad',
    '特急': '#c0392b', '特急ロマンスカー': '#c0392b',
  };

  const getTrainTypeBadgeColor = (trainType: string, _lineKey: string | null): string => {
    return TRAIN_TYPE_COLOR[trainType] ?? '#555';
  };

  // クリック時の時刻表ツールチップを浮き上がりで表示（左:路線一覧 / 右:時刻表）
  const renderStationTimetableTooltip = () => {
    if (!timetableModeEnabled || !stationTooltip) return null;

    // この駅を通る全路線
    const allRoutes = getRoutesForStation(stationTooltip.stationName);
    if (allRoutes.length === 0) return null;

    // 経路上でのこの駅の全セグメント情報（複数路線にまたがる可能性あり）
    const journeyEntries = stationTimelineMap.get(stationTooltip.stationName) ?? [];
    const journeyRouteKeys = new Set(journeyEntries.map(e => e.routeKey));

    // 選択路線を決定
    // 優先順: ユーザー選択 → 経路上でデータあり → 経路上でデータなし → 他のデータあり路線
    const activeRouteKey: string | null = (() => {
      if (tooltipSelectedRoute && allRoutes.includes(tooltipSelectedRoute as RouteKey)) {
        return tooltipSelectedRoute;
      }
      const journeyWithData = journeyEntries.find(e => hasTimetableData(e.routeKey));
      if (journeyWithData) return journeyWithData.routeKey;
      if (journeyEntries.length > 0) return journeyEntries[0].routeKey;
      return allRoutes.find(rk => hasTimetableData(rk)) ?? null;
    })();

    // アクティブ路線が経路上の路線かどうか
    const isJourneyRoute = journeyRouteKeys.has(activeRouteKey ?? '');
    // アクティブ路線の経路エントリ（方向・時刻）
    const activeJourneyEntry = journeyEntries.find(e => e.routeKey === activeRouteKey);

    // 選択路線の発車情報を取得（経路の方向・時刻を優先使用）
    const activeDeps: Departure[] = (() => {
      if (!activeRouteKey || !hasTimetableData(activeRouteKey)) return [];
      const depTime = activeJourneyEntry?.depTime ?? timetableBaseTime;
      const dirIdx  = activeJourneyEntry?.directionIndex ?? 0;
      return getNextDepartures(activeRouteKey, stationTooltip.stationName, dirIdx, depTime, showAllTooltipDeps ? 50 : 5);
    })();

    const activeDepTime = activeJourneyEntry?.depTime ?? timetableBaseTime;

    // 画面端からはみ出さないよう位置調整
    const MARGIN = 8;
    const vw = typeof window !== 'undefined'
      ? (window.visualViewport?.width ?? window.innerWidth)
      : 800;
    const vh = typeof window !== 'undefined'
      ? (window.visualViewport?.height ?? window.innerHeight)
      : 600;
    const isMobileView = vw < 500;
    // 幅はビューポートに収まるよう上限を設定
    const TW = Math.min(360, vw - MARGIN * 2);
    const LEFT_W = Math.min(120, Math.floor(TW * 0.35));
    // モバイルでは画面中央寄せ、PCはクリック位置基準
    let x: number;
    if (isMobileView) {
      x = Math.max(MARGIN, (vw - TW) / 2);
    } else {
      const rawX = stationTooltip.x + 14;
      x = rawX + TW > vw - MARGIN ? stationTooltip.x - TW - 6 : rawX;
      x = Math.max(MARGIN, Math.min(x, vw - TW - MARGIN));
    }
    const maxTooltipH = Math.min(vh - MARGIN * 2, 480);
    const estH = Math.min(52 + Math.max(allRoutes.length * 28, activeDeps.length * 26 + 22) + 20, maxTooltipH);
    const rawY = stationTooltip.y + 14;
    const y = Math.max(MARGIN, Math.min(
      rawY + estH > vh - MARGIN ? stationTooltip.y - estH - 6 : rawY,
      vh - estH - MARGIN
    ));

    return (
      <div
        style={{
          position: 'fixed', left: x, top: y, zIndex: 9999,
          width: `${TW}px`,
          maxHeight: `${maxTooltipH}px`,
          backgroundColor: colors.surfaceElevated,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          boxShadow: `0 4px 16px ${colors.shadow}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'default',
        }}
      >
        {/* ヘッダー */}
        <div style={{
          padding: '7px 10px 6px',
          borderBottom: `1px solid ${colors.borderLight}`,
        }}>
          {/* 駅名 + 閉じるボタン */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px', color: colors.text }}>
              {stationTooltip.stationName}
            </span>
            <span
              onClick={() => setStationTooltip(null)}
              style={{ fontSize: '12px', color: colors.textSecondary, cursor: 'pointer', padding: '0 2px' }}
            >✕</span>
          </div>
          {/* 出発/到着ボタン + 基準時刻 */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => { setDeparture(stationTooltip.station); setStationTooltip(null); }}
                style={{
                  backgroundColor: '#4CAF50', color: 'white', border: 'none',
                  padding: '3px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px',
                }}
              >{translateUI('setDepartureStation', currentLanguage)}</button>
              <button
                onClick={() => { setArrival(stationTooltip.station); setStationTooltip(null); }}
                style={{
                  backgroundColor: '#F44336', color: 'white', border: 'none',
                  padding: '3px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px',
                }}
              >{translateUI('setArrivalStation', currentLanguage)}</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: colors.textSecondary }}>{translateUI('baseTime', currentLanguage)}</span>
              <input
                type="time"
                value={timetableBaseTime}
                onChange={e => setTimetableBaseTime(e.target.value)}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: '3px',
                  padding: '1px 4px',
                  fontSize: '16px',
                  backgroundColor: colors.surface,
                  color: colors.text,
                  cursor: 'pointer',
                  width: '110px',
                }}
              />
            </div>
          </div>
        </div>

        {/* 2カラム本体 */}
        <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, overflowX: 'auto', overflowY: 'hidden' }}>

          {/* 左カラム: 通過路線一覧 */}
          <div style={{
            width: `${LEFT_W}px`,
            flexShrink: 0,
            borderRight: `1px solid ${colors.borderLight}`,
            overflowY: 'auto',
          }}>
            {allRoutes.map(rk => {
              const isActive = rk === activeRouteKey;
              const hasData = hasTimetableData(rk);
              const isJourney = journeyRouteKeys.has(rk);
              const routeColor = adjustRouteColorForTheme(routeColors[rk as RouteKey] ?? '#888', theme);
              return (
                <div
                  key={rk}
                  onClick={e => {
                    e.stopPropagation();
                    setTooltipSelectedRoute(rk);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '5px 8px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? colors.primary + '22' : 'transparent',
                    borderLeft: isActive
                      ? `3px solid ${colors.primary}`
                      : isJourney ? `3px solid ${routeColor}` : '3px solid transparent',
                  }}
                >
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: routeColor,
                    opacity: hasData ? 1 : 0.4,
                  }} />
                  <span style={{
                    fontSize: '10px',
                    color: isActive ? colors.text : isJourney ? colors.text : colors.textSecondary,
                    fontWeight: isJourney ? 'bold' : 'normal',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    opacity: hasData ? 1 : 0.5,
                  }}>
                    {routeNames[rk as RouteKey] ?? rk}
                  </span>
                  {isJourney && (
                    <span style={{ fontSize: '9px', color: colors.primary, flexShrink: 0, marginLeft: 'auto' }}>{translateUI('onboard', currentLanguage)}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 右カラム: 時刻表 */}
          <div style={{ flex: 1, minWidth: '180px', overflowY: 'auto' }}>
            {activeRouteKey && hasTimetableData(activeRouteKey) ? (
              <>
                <div style={{
                  padding: '4px 8px',
                  fontSize: '10px', color: colors.textSecondary,
                  borderBottom: `1px solid ${colors.borderLight}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>{activeDepTime} {translateUI('afterSuffix', currentLanguage)}</span>
                  {!isJourneyRoute && (
                    <span style={{ color: colors.textSecondary, opacity: 0.7, fontSize: '9px' }}>{translateUI('offRouteReference', currentLanguage)}</span>
                  )}
                </div>
                {activeDeps.length === 0 ? (
                  <div style={{ padding: '8px', fontSize: '11px', color: colors.textSecondary }}>
                    {translateUI('noData', currentLanguage)}
                  </div>
                ) : (
                  <>
                    {activeDeps.map((dep, i) => (
                      <div key={`${dep.time}-${dep.type}-${i}`} style={{
                        padding: '4px 8px',
                        borderBottom: `1px solid ${colors.borderLight}`,
                      }}>
                        {/* 1行目: 時刻・種別・番線 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '13px', color: colors.text, flexShrink: 0 }}>
                            {dep.time}
                          </span>
                          <span style={{
                            fontSize: '10px', color: '#fff', padding: '1px 4px', borderRadius: '3px',
                            backgroundColor: getTrainTypeBadgeColor(dep.type, activeRouteKey), flexShrink: 0,
                          }}>
                            {dep.type}
                          </span>
                          {dep.platform && (
                            <span style={{ fontSize: '10px', color: colors.textSecondary, flexShrink: 0 }}>
                              {dep.platform}
                            </span>
                          )}
                        </div>
                        {/* 2行目: 行き先 */}
                        <div style={{ fontSize: '11px', color: colors.textSecondary, paddingLeft: '2px' }}>
                          {dep.destination}{dep.toward ? `（${dep.toward} ${translateUI('towardSuffix', currentLanguage)}）` : ''}
                        </div>
                      </div>
                    ))}
                    {!showAllTooltipDeps && (
                      <div
                        onClick={() => setShowAllTooltipDeps(true)}
                        style={{
                          padding: '5px 8px',
                          fontSize: '10px',
                          color: colors.primary,
                          cursor: 'pointer',
                          textAlign: 'center',
                          borderTop: `1px solid ${colors.borderLight}`,
                        }}
                      >
                        {translateUI('showAllTimetable', currentLanguage)}
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div style={{ padding: '10px 8px', fontSize: '11px', color: colors.textSecondary, whiteSpace: 'pre-line' }}>
                {isJourneyRoute
                  ? translateUI('onboardRouteNoData', currentLanguage)
                  : translateUI('noTimetableData', currentLanguage)}
              </div>
            )}
          </div>
        </div>

        <div style={{
          padding: '3px 10px',
          borderTop: `1px solid ${colors.borderLight}`,
          fontSize: '9px', color: colors.textSecondary, opacity: 0.6,
        }}>
          {translateUI('approximateNote', currentLanguage)}
        </div>
      </div>
    );
  };

  // テキスト幅を文字種別考慮で推定（ASCII約7px, 日本語約12px, パディング12px）
  const estimateTextWidth = (text: string): number => {
    let w = 6; // padding 1px 3px → 左右3px×2=6px
    for (const ch of text) w += ch.charCodeAt(0) > 127 ? 12 : 7;
    return w;
  };

  // アイコン作成関数をメモ化
  const createStationIcon = useCallback((station: Station, color: string, zoomLevel: number, isDetailed: boolean, opacity: number = 1, timeLabel?: string, routeKey?: RouteKey) => {
    if (!MapComponents?.DivIcon) return null;

    const { DivIcon } = MapComponents;

    if (isDetailed) {
      const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'white';
      const shadowColor = theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)';
      const translatedStationName = translateStation(station.name, currentLanguage);
      const furigana = (showFurigana && currentLanguage === 'japanese') ? getFurigana(station.name) : '';
      const hasFurigana = furigana.length > 0;
      const hasTime = !!timeLabel;
      const stationNumber = (showStationNumbers && routeKey)
        ? (getStationNumber(routeKey, station.name) ?? getAnyStationNumber(station.name))
        : undefined;
      const displayName = stationNumber ? `${stationNumber} ${translatedStationName}` : translatedStationName;
      const nameWidth = estimateTextWidth(displayName);
      const labelWidth = Math.max(nameWidth, timeLabel ? estimateTextWidth(timeLabel) : 0);
      const stationNameWidth = hasTime ? labelWidth : nameWidth;
      const iconHeight = hasFurigana ? (hasTime ? 42 : 30) : (hasTime ? 30 : 18);
      const timeLine = hasTime ? `<div style="font-size:9px;line-height:1;margin-top:1px;font-weight:normal;opacity:0.9">${timeLabel}</div>` : '';
      const htmlContent = hasFurigana || hasTime
        ? `<div style="background:${color};color:white;padding:1px 3px;border-radius:3px;white-space:nowrap;border:1px solid ${borderColor};box-shadow:0 1px 3px ${shadowColor};text-align:center;opacity:${opacity};display:flex;flex-direction:column;align-items:center;justify-content:center">${hasFurigana ? `<div style="font-size:8px;line-height:1;margin-bottom:1px;font-weight:normal">${furigana}</div>` : ''}<div style="font-size:11px;font-weight:bold;line-height:1">${displayName}</div>${timeLine}</div>`
        : `<div style="background:${color};color:white;padding:1px 3px;border-radius:3px;font-size:11px;font-weight:bold;white-space:nowrap;border:1px solid ${borderColor};box-shadow:0 1px 3px ${shadowColor};opacity:${opacity}">${displayName}</div>`;
      return new DivIcon({
        html: htmlContent,
        className: 'station-name-marker',
        iconSize: [stationNameWidth, iconHeight],
        iconAnchor: [stationNameWidth / 2, iconHeight / 2]
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
  }, [MapComponents, currentLanguage, theme, showFurigana, showStationNumbers]);

  // 列車種別停車パターンの取得（外部データソースを使用）
  const getSimplifiedStationStops = useCallback((routeKey: RouteKey, trainType: string, stationName: string): boolean => {
    const stoppingTypes = getStoppingTrainTypes(routeKey, stationName);
    return stoppingTypes.includes(trainType);
  }, []);

  // 駅の停車パターンから枠線スタイルを決定する関数（新システム）
  const getStationBorderStyle = useCallback((routeKey: RouteKey, stationName: string) => {
    // 出発駅・到着駅は枠線なしで表示
    if ((departure && departure.name === stationName) || (arrival && arrival.name === stationName)) {
      return {
        borderWidth: 0,
        borderStyle: 'none' as const,
        borderColor: 'transparent',
        description: departure?.name === stationName ? '出発駅' : '到着駅',
        visualLevel: 'basic' as const
      };
    }

    // 路線色を取得
    const stationColor = routeColors[routeKey];

    if (!selectedTrainType) {
      // 列車種別未選択時は全停車パターンを考慮した枠線を表示
      return getStationBorderStyleByPattern(routeKey, stationName, stationColor);
    }

    // 特定の列車種別が選択されている場合の表示
    const stops = getSimplifiedStationStops(routeKey, selectedTrainType, stationName);
    const baseStyle = getStationBorderStyleByPattern(routeKey, stationName, stationColor);

    if (!stops) {
      return {
        borderWidth: 1,
        borderStyle: 'dashed' as const,
        borderColor: stationColor,
        description: `${selectedTrainType}通過`
      };
    }

    // 停車する場合は基本スタイルに選択された列車種別の情報を付加
    return {
      ...baseStyle,
      description: `${selectedTrainType}停車 (${baseStyle.description})`
    };
  }, [selectedTrainType, getSimplifiedStationStops, departure, arrival]);

  // 路線別の利用可能な列車種別を取得する関数
  const getAvailableTrainTypes = useCallback((routeKey: RouteKey) => {
    const trainTypeOptions: Record<string, Array<{id: string, name: string}>> = {
      yamanote: [
        { id: 'local', name: '各駅停車' }
      ],
      chuo: [
        { id: 'local', name: '各駅停車' },
        { id: 'rapid_acty', name: 'ラピッドアクティー' },
        { id: 'special_rapid', name: '特別快速' }
      ],
      odakyuLine: [
        { id: 'local', name: '各駅停車' },
        { id: 'semi_express', name: '準急' },
        { id: 'express', name: '急行' },
        { id: 'multi_express', name: '多摩急行' },
        { id: 'romance_car', name: 'ロマンスカー' }
      ],
      keihinTohoku: [
        { id: 'local', name: '各駅停車' },
        { id: 'rapid', name: '快速' }
      ],
      ginzaLine: [
        { id: 'local', name: '各駅停車' }
      ]
    };

    return trainTypeOptions[routeKey] || [];
  }, []);

  // 列車種別表示用の駅アイコン作成関数
  const createTrainTypeStationIcon = useCallback((station: Station, routeKey: RouteKey, zoomLevel: number, isDetailed: boolean, opacity: number = 1) => {
    if (!MapComponents?.DivIcon || !trainTypeViewEnabled) {
      return createStationIcon(station, routeColors[routeKey], zoomLevel, isDetailed, opacity, undefined, routeKey);
    }

    const { DivIcon } = MapComponents;
    const borderStyle = getStationBorderStyle(routeKey, station.name);

    // 特定の路線が選択されている場合、他の路線を薄く表示
    if (selectedTrainRoute && routeKey !== selectedTrainRoute) {
      opacity *= 0.4;
    }

    if (isDetailed) {
      const translatedStationName = translateStation(station.name, currentLanguage);
      const furigana = (showFurigana && currentLanguage === 'japanese') ? getFurigana(station.name) : '';
      const hasFurigana = furigana.length > 0;
      const stationNumber = showStationNumbers
        ? (getStationNumber(routeKey, station.name) ?? getAnyStationNumber(station.name))
        : undefined;
      const displayName = stationNumber ? `${stationNumber} ${translatedStationName}` : translatedStationName;
      const baseWidth = estimateTextWidth(displayName);
      // 枠線の太さを考慮して幅を調整
      const borderAdjustment = borderStyle.borderWidth * 2; // 左右の枠線分
      const stationNameWidth = baseWidth + borderAdjustment;
      const stationNameHeight = (hasFurigana ? 30 : 18) + borderAdjustment; // ふりがな分の高さ追加
      // 出発駅・到着駅は影なし、その他は通常の影
      const isSelectedStation = (departure && departure.name === station.name) || (arrival && arrival.name === station.name);
      const shadowColor = isSelectedStation ? 'transparent' : (theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)');

      const innerHtml = hasFurigana
        ? `<div style="font-size:8px;line-height:1;margin-bottom:1px;font-weight:normal">${furigana}</div><div style="font-size:11px;font-weight:bold;line-height:1">${displayName}</div>`
        : displayName;

      return new DivIcon({
        html: `<div style="
          background:${routeColors[routeKey]};
          color:white;
          padding:1px 3px;
          border-radius:2px;
          ${hasFurigana ? '' : 'font-size:11px;font-weight:bold;'}
          white-space:nowrap;
          border:${borderStyle.borderWidth}px ${borderStyle.borderStyle} ${borderStyle.borderColor};
          ${borderStyle.boxShadow ? `box-shadow:${borderStyle.boxShadow};` : ''}
          ${isSelectedStation ? 'box-shadow: none !important;' : ''}
          text-align:center;
          display:flex;
          ${hasFurigana ? 'flex-direction:column;' : ''}
          align-items:center;
          justify-content:center;
          box-sizing:border-box;
          opacity:${opacity}
        ">${innerHtml}</div>`,
        className: 'station-name-marker train-type-marker',
        iconSize: [stationNameWidth, stationNameHeight],
        iconAnchor: [stationNameWidth / 2, stationNameHeight / 2]
      });
    } else {
      const baseStationSize = Math.max(8, Math.min(16, zoomLevel - 8));
      // 枠線の太さを考慮してサイズを調整
      const borderAdjustment = borderStyle.borderWidth * 2; // 左右・上下の枠線分
      const stationSize = baseStationSize + borderAdjustment;
      // 出発駅・到着駅は影なし、その他は通常の影
      const isSelectedStation = (departure && departure.name === station.name) || (arrival && arrival.name === station.name);
      const shadowColor = isSelectedStation ? 'transparent' : (theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)');

      return new DivIcon({
        html: `<div style="
          background:${routeColors[routeKey]};
          width:${baseStationSize}px;
          height:${baseStationSize}px;
          border:${borderStyle.borderWidth}px ${borderStyle.borderStyle} ${borderStyle.borderColor};
          ${borderStyle.boxShadow ? `box-shadow:${borderStyle.boxShadow};` : ''}
          ${isSelectedStation ? 'box-shadow: none !important;' : ''}
          opacity:${opacity};
          border-radius:50%;
          box-sizing:border-box;
          display:flex;
          align-items:center;
          justify-content:center
        "></div>`,
        className: 'station-marker train-type-marker',
        iconSize: [stationSize, stationSize],
        iconAnchor: [stationSize / 2, stationSize / 2]
      });
    }
  }, [MapComponents, currentLanguage, theme, trainTypeViewEnabled, selectedTrainRoute, selectedTrainType, createStationIcon, getStationBorderStyle, showFurigana, showStationNumbers]);

  const getTimeMarkerSize = (zoom: number) => {
    const baseSize = 20;
    const scaleFactor = Math.max(0.4, Math.min(1.2, (zoom - 8) / 8));
    return Math.round(baseSize * scaleFactor);
  };

  const createSpecialStationIcon = useCallback((isDeparture: boolean, zoomLevel: number, stationName: string, originalName?: string, routeKey?: RouteKey) => {
    if (!MapComponents?.DivIcon) return null;

    const { DivIcon } = MapComponents;
    const fontSize = 14;
    const markerHeight = 30;
    const markerColor = isDeparture ? '#4CAF50' : '#F44336';

    const stationNumber = showStationNumbers
      ? ((routeKey ? getStationNumber(routeKey, originalName ?? stationName) : undefined) ?? getAnyStationNumber(originalName ?? stationName))
      : undefined;
    const displayStationName = stationNumber ? `${stationNumber} ${stationName}` : stationName;

    // 文字種別ごとに幅を推定（ASCII約7px, 日本語約12px）
    let textWidth = 20;
    for (const ch of displayStationName) textWidth += ch.charCodeAt(0) > 127 ? fontSize * 1.0 : fontSize * 0.55;
    const markerWidth = Math.min(textWidth, language === 'english' ? 130 : 160);

    const furigana = (showFurigana && language === 'japanese' && originalName) ? getFurigana(originalName) : '';
    const hasFurigana = furigana.length > 0;
    const totalHeight = hasFurigana ? markerHeight + 12 : markerHeight;

    const bgColor = theme === 'dark' ? colors.surfaceElevated : 'white';
    const htmlContent = hasFurigana
      ? `<div style="background:${bgColor};border:4px solid ${markerColor};border-radius:5px;width:${markerWidth}px;height:${totalHeight}px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:bold;color:${markerColor};position:relative;z-index:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 5px"><div style="font-size:${Math.max(9, Math.round(fontSize * 0.55))}px;line-height:1;margin-bottom:1px;font-weight:normal">${furigana}</div><div style="font-size:${fontSize}px;line-height:1">${displayStationName}</div></div>`
      : `<div style="background:${bgColor};border:4px solid ${markerColor};border-radius:5px;width:${markerWidth}px;height:${totalHeight}px;display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;font-weight:bold;color:${markerColor};position:relative;z-index:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 5px">${displayStationName}</div>`;
    return new DivIcon({
      html: htmlContent,
      className: 'special-station-marker-inline',
      iconSize: [markerWidth, totalHeight],
      iconAnchor: [markerWidth / 2, totalHeight / 2]
    });
  }, [MapComponents, theme, colors, language, showFurigana, showStationNumbers]);

  const createTimeIcon = useCallback((time: number, color: string, zoomLevel: number, isSection = false) => {
    if (!MapComponents?.DivIcon || !showTravelTimes) return null;

    const { DivIcon } = MapComponents;
    const fontSize = 12;
    const circleSize = 20;

    const bgColor = theme === 'dark' ? 'rgba(40,40,40,0.9)' : 'rgba(255,255,255,0.9)';
    const shadowColor = theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)';
    const timeNumber = Math.round(time);

    return new DivIcon({
      html: `<div style="
        width:${circleSize}px;
        height:${circleSize}px;
        border-radius:50%;
        border:2px solid ${color};
        background:${bgColor};
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 1px 3px ${shadowColor};
        font-weight:bold;
        line-height:1;
      ">
        <span style="font-size:${fontSize}px;color:${color};">${timeNumber}</span>
      </div>`,
      className: isSection ? 'time-text-section' : 'time-text',
      iconSize: [circleSize, circleSize],
      iconAnchor: [circleSize / 2, circleSize / 2]
    });
  }, [MapComponents, currentLanguage, theme, showTravelTimes]);

  // 選択された推薦ルートで使用される路線キーのセット（凡例ハイライト用）
  const highlightedRouteKeys = useMemo(() => {
    if (selectedRouteIndices === null) return null;
    const keys = new Set<RouteKey>();
    [...selectedRouteIndices].forEach(idx => {
      routeRecommendations[idx]?.segments.forEach(seg => {
        if (seg.routeKey !== 'walking') {
          keys.add(seg.routeKey as RouteKey);
        }
      });
    });
    return keys;
  }, [selectedRouteIndices, routeRecommendations]);

  // 路線図モード用: dep/arr設定時は全推薦ルートの路線を表示（未選択時）
  const diagramHighlightedRouteKeys = useMemo(() => {
    if (!departure || !arrival) return null;
    if (highlightedRouteKeys !== null) return highlightedRouteKeys;
    if (routeRecommendations.length === 0) return null;
    const keys = new Set<RouteKey>();
    routeRecommendations.forEach(rec => {
      rec.segments.forEach((seg: any) => {
        if (seg.routeKey !== 'walking') keys.add(seg.routeKey as RouteKey);
      });
    });
    return keys.size > 0 ? keys : null;
  }, [departure, arrival, highlightedRouteKeys, routeRecommendations]);

  // レンダリング最適化：表示する路線のデータを準備
  const visibleRoutesData = useMemo(() => {
    // availableRoutes状態に基づいて凡例に表示する路線を決定
    const filteredRoutes = Object.entries(routes).filter(([routeKey]) => availableRoutes.has(routeKey as RouteKey));
    console.log('🗺️ Available routes for legend:', filteredRoutes.map(([routeKey]) => routeKey).join(', '));
    return filteredRoutes;
  }, [availableRoutes]);


  useEffect(() => {
    let mounted = true;

    const loadLeaflet = async () => {
      try {
        if (typeof window === 'undefined') return;

        const [
          { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents, ZoomControl },
          { DivIcon }
        ] = await Promise.all([
          import('react-leaflet'),
          import('leaflet'),
        ]);

        if (mounted) {
          setMapComponents({ MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents, ZoomControl, DivIcon });
          setIsClient(true);
          setIsLoading(false);
          // デバッグ関数をブラウザコンソールで利用可能にする
          attachDebugFunctions();
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
      setSelectedRouteIndices(null);

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

      // 推薦されたルートで使用される路線を自動的に表示状態にする
      const routesUsedInRecommendations = new Set<RouteKey>();
      finalUniqueRoutes.forEach(route => {
        route.segments.forEach(segment => {
          if (segment.routeKey !== 'walking' && segment.routeKey) {
            routesUsedInRecommendations.add(segment.routeKey as RouteKey);
          }
        });
      });

      if (routesUsedInRecommendations.size > 0) {
        console.log('🚇 Auto-showing routes used in recommendations:', Array.from(routesUsedInRecommendations));
        // prev に追加ではなく、推薦経路のルートに置き換える
        // （切替時に古いルートが残ってオフ表示になる問題を防ぐ）
        setVisibleRoutes(routesUsedInRecommendations);
        setAvailableRoutes(routesUsedInRecommendations);
      }

      // visibleRoutesの制御は時間フィルターのuseEffectで行う
    } else {
      setRouteRecommendations([]);
      setSelectedRouteIndices(null);
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
      if (!departure || !arrival) {
        // 出発駅・到着駅がない場合は全路線を表示
        const allRoutes = new Set(Object.keys(routes) as RouteKey[]);
        setVisibleRoutes(allRoutes);
        setAvailableRoutes(allRoutes);
      }
      // departure && arrival の場合は route recommendation useEffect が visibleRoutes/availableRoutes を管理するため、ここでは設定しない
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

  // 両駅をつなぐ路線を特定する関数
  const getConnectingRoutes = (departureStation: string, arrivalStation: string): RouteKey[] => {
    const departureRoutes = getRoutesForStation(departureStation);
    const arrivalRoutes = getRoutesForStation(arrivalStation);

    // 両方の駅を通る路線（直接接続）
    const directRoutes = departureRoutes.filter(route => arrivalRoutes.includes(route));

    // 直接接続がある場合はそれを優先
    if (directRoutes.length > 0) {
      console.log(`🚉 Direct connection found: ${directRoutes.join(', ')}`);
      return directRoutes;
    }

    // 乗り換えが必要な場合は、経路推薦で使用される路線を含める
    if (routeRecommendations.length > 0) {
      const usedRoutes = new Set<RouteKey>();
      routeRecommendations.forEach(route => {
        route.segments.forEach(segment => {
          usedRoutes.add(segment.routeKey as RouteKey);
        });
      });
      console.log(`🚉 Transfer connection found via route recommendations: ${Array.from(usedRoutes).join(', ')}`);
      return Array.from(usedRoutes);
    }

    // 経路推薦がない場合は、出発駅と到着駅の路線を両方表示
    const combinedRoutes = [...new Set([...departureRoutes, ...arrivalRoutes])];
    console.log(`🚉 No direct connection, showing all routes from both stations: ${combinedRoutes.join(', ')}`);
    return combinedRoutes;
  };

  // 駅選択に応じた路線表示制御
  // ※ departure && arrival の場合は route recommendation useEffect が availableRoutes/visibleRoutes を管理
  useEffect(() => {
    if (departure && arrival) return; // 両駅選択時は推薦useEffectに委ねる

    if (departure && !arrival) {
      const departureRoutes = getRoutesForStation(departure.name);
      setAvailableRoutes(new Set(departureRoutes));
      setVisibleRoutes(new Set(departureRoutes));
    } else if (arrival && !departure) {
      const arrivalRoutes = getRoutesForStation(arrival.name);
      setAvailableRoutes(new Set(arrivalRoutes));
      setVisibleRoutes(new Set(arrivalRoutes));
    } else {
      const allRoutes = Object.keys(routes) as RouteKey[];
      setAvailableRoutes(new Set(allRoutes));
      setVisibleRoutes(new Set(allRoutes));
    }
  }, [departure, arrival]);

  // Leafletポップアップとコントロールのテーマ対応（動的スタイル適用）
  useEffect(() => {
    const applyThemeToPopups = () => {
      const popups = document.querySelectorAll('.leaflet-popup');

      popups.forEach(popup => {
        if (theme === 'dark') {
          // ダークモード適用
          (popup as HTMLElement).style.setProperty('background', '#2d2d2d', 'important');

          // ポップアップコンテンツラッパー
          const wrapper = popup.querySelector('.leaflet-popup-content-wrapper');
          if (wrapper) {
            (wrapper as HTMLElement).style.setProperty('background', '#2d2d2d', 'important');
            (wrapper as HTMLElement).style.setProperty('color', '#ffffff', 'important');
            (wrapper as HTMLElement).style.setProperty('border', '1px solid #404040', 'important');
          }

          // ポップアップコンテンツ
          const content = popup.querySelector('.leaflet-popup-content');
          if (content) {
            (content as HTMLElement).style.setProperty('background', '#2d2d2d', 'important');
            (content as HTMLElement).style.setProperty('color', '#ffffff', 'important');

            // 全ての子要素（路線色表示を除く）
            const allElements = content.querySelectorAll('*:not(button)');
            allElements.forEach(el => {
              if (!el.classList.contains('leaflet-popup-close-button') &&
                  !el.classList.contains('route-color-line')) {
                (el as HTMLElement).style.setProperty('background', '#2d2d2d', 'important');
                (el as HTMLElement).style.setProperty('color', '#ffffff', 'important');
              }
            });
          }

          // ポップアップTip（矢印）
          const tip = popup.querySelector('.leaflet-popup-tip');
          if (tip) {
            (tip as HTMLElement).style.setProperty('background', '#2d2d2d', 'important');
            (tip as HTMLElement).style.setProperty('border', '1px solid #404040', 'important');
          }

          // 閉じるボタン
          const closeButton = popup.querySelector('.leaflet-popup-close-button');
          if (closeButton) {
            (closeButton as HTMLElement).style.setProperty('color', '#ffffff', 'important');
            (closeButton as HTMLElement).style.setProperty('background', 'transparent', 'important');
          }
        } else {
          // ライトモード - 強制適用したダークモードスタイルを削除
          (popup as HTMLElement).style.removeProperty('background');

          const wrapper = popup.querySelector('.leaflet-popup-content-wrapper');
          if (wrapper) {
            (wrapper as HTMLElement).style.removeProperty('background');
            (wrapper as HTMLElement).style.removeProperty('color');
            (wrapper as HTMLElement).style.removeProperty('border');
          }

          const content = popup.querySelector('.leaflet-popup-content');
          if (content) {
            (content as HTMLElement).style.removeProperty('background');
            (content as HTMLElement).style.removeProperty('color');

            // 全ての子要素のスタイルもリセット（路線色表示を除く）
            const allElements = content.querySelectorAll('*:not(button)');
            allElements.forEach(el => {
              if (!el.classList.contains('leaflet-popup-close-button') &&
                  !el.classList.contains('route-color-line')) {
                (el as HTMLElement).style.removeProperty('background');
                (el as HTMLElement).style.removeProperty('color');
              }
            });
          }

          const tip = popup.querySelector('.leaflet-popup-tip');
          if (tip) {
            (tip as HTMLElement).style.removeProperty('background');
            (tip as HTMLElement).style.removeProperty('border');
          }

          const closeButton = popup.querySelector('.leaflet-popup-close-button');
          if (closeButton) {
            (closeButton as HTMLElement).style.removeProperty('color');
            (closeButton as HTMLElement).style.removeProperty('background');
          }
        }
      });
    };

    // ズームコントロールのテーマ適用
    const applyThemeToZoomControls = () => {
      const zoomControls = document.querySelectorAll('.leaflet-control-zoom');

      zoomControls.forEach(control => {
        if (theme === 'dark') {
          // ダークモード適用
          (control as HTMLElement).style.setProperty('background', '#2d2d2d', 'important');
          (control as HTMLElement).style.setProperty('border', '1px solid #404040', 'important');
          (control as HTMLElement).style.setProperty('border-radius', '4px', 'important');
          (control as HTMLElement).style.setProperty('box-shadow', '0 2px 5px rgba(0,0,0,0.3)', 'important');

          // ズームボタン（+ と -）
          const zoomButtons = control.querySelectorAll('a');
          zoomButtons.forEach(button => {
            (button as HTMLElement).style.setProperty('background', '#2d2d2d', 'important');
            (button as HTMLElement).style.setProperty('background-color', '#2d2d2d', 'important');
            (button as HTMLElement).style.setProperty('color', '#ffffff', 'important');
            (button as HTMLElement).style.setProperty('border', '1px solid #404040', 'important');
            (button as HTMLElement).style.setProperty('text-decoration', 'none', 'important');

            // ホバーイベント
            button.addEventListener('mouseenter', () => {
              if (theme === 'dark') {
                (button as HTMLElement).style.setProperty('background', '#404040', 'important');
                (button as HTMLElement).style.setProperty('background-color', '#404040', 'important');
              }
            });

            button.addEventListener('mouseleave', () => {
              if (theme === 'dark') {
                (button as HTMLElement).style.setProperty('background', '#2d2d2d', 'important');
                (button as HTMLElement).style.setProperty('background-color', '#2d2d2d', 'important');
              }
            });
          });
        } else {
          // ライトモード（デフォルトに戻す）
          (control as HTMLElement).style.removeProperty('background');
          (control as HTMLElement).style.removeProperty('border');
          (control as HTMLElement).style.removeProperty('border-radius');
          (control as HTMLElement).style.removeProperty('box-shadow');

          const zoomButtons = control.querySelectorAll('a');
          zoomButtons.forEach(button => {
            (button as HTMLElement).style.removeProperty('background');
            (button as HTMLElement).style.removeProperty('background-color');
            (button as HTMLElement).style.removeProperty('color');
            (button as HTMLElement).style.removeProperty('border');
            (button as HTMLElement).style.removeProperty('text-decoration');
          });
        }
      });
    };

    // テーマが変更されたときにポップアップとコントロールを更新
    applyThemeToPopups();
    applyThemeToZoomControls();

    // Mutationオブザーバーで動的に追加されるポップアップを監視
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // より包括的なポップアップ検出
              if (element.classList?.contains('leaflet-popup') ||
                  element.querySelector?.('.leaflet-popup') ||
                  element.classList?.contains('leaflet-popup-content-wrapper') ||
                  element.classList?.contains('leaflet-popup-content')) {
                // 即座に適用 + 少し遅延しても適用（確実性のため）
                applyThemeToPopups();
                setTimeout(applyThemeToPopups, 1);
                setTimeout(applyThemeToPopups, 10);
                setTimeout(applyThemeToPopups, 50);
              }

              // ズームコントロール検出
              if (element.classList?.contains('leaflet-control-zoom') ||
                  element.querySelector?.('.leaflet-control-zoom') ||
                  element.classList?.contains('leaflet-control')) {
                // 即座に適用 + 少し遅延しても適用（確実性のため）
                applyThemeToZoomControls();
                setTimeout(applyThemeToZoomControls, 1);
                setTimeout(applyThemeToZoomControls, 10);
                setTimeout(applyThemeToZoomControls, 50);
              }
            }
          });
        }
      });
    });

    // body要素を監視（より詳細な設定）
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // 定期的なチェック（初回表示問題の保険）
    const intervalCheck = setInterval(applyThemeToPopups, 100);

    return () => {
      observer.disconnect();
      clearInterval(intervalCheck);
    };
  }, [theme]);

  const toggleRoute = (routeKey: RouteKey) => {
    console.log('🔄 toggleRoute called for:', routeKey);
    console.log('🔄 Current visibleRoutes:', visibleRoutes);

    // 利用可能な路線のみ操作を許可
    if (!availableRoutes.has(routeKey)) {
      console.log('🔄 Route not available, ignoring toggle');
      return;
    }

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

  const handleRouteToggle = (index: number) => {
    let newIndices: Set<number>;
    if (selectedRouteIndices === null) {
      // 全表示中→1つを外す
      newIndices = new Set(routeRecommendations.map((_, i) => i));
      newIndices.delete(index);
    } else {
      newIndices = new Set(selectedRouteIndices);
      if (newIndices.has(index)) {
        newIndices.delete(index);
      } else {
        newIndices.add(index);
      }
    }
    setSelectedRouteIndices(newIndices);
    if (newIndices.size === 0) {
      setVisibleRoutes(new Set<RouteKey>());
    } else {
      const keys = new Set<RouteKey>();
      [...newIndices].forEach(idx => {
        routeRecommendations[idx]?.segments.forEach(segment => {
          if (segment.routeKey !== 'walking') {
            keys.add(segment.routeKey as RouteKey);
          }
        });
      });
      setVisibleRoutes(keys);
    }
  };

  const handleSelectAllRecommendedRoutes = () => {
    setSelectedRouteIndices(null);
    setVisibleRoutes(availableRoutes);
  };

  const handleDeselectAllRecommendedRoutes = () => {
    setSelectedRouteIndices(new Set<number>());
    setVisibleRoutes(new Set<RouteKey>());
  };

  const handleShowAllRoutes = () => {
    setSelectedRouteIndices(null);
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

  // 現在地を一度だけ取得して更新するヘルパー
  const fetchCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // 現在地取得ハンドラー（トグル式: ON/OFF）
  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) {
      alert(currentLanguage === 'japanese' ? '位置情報はこのブラウザではサポートされていません。' : 'Geolocation is not supported by this browser.');
      return;
    }

    // トラッキング中なら停止
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      if (locationIntervalRef.current !== null) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
      setIsLocating(false);
      setUserLocation(null);
      isFirstPositionRef.current = true;
      return;
    }

    // トラッキング開始
    setIsLocating(true);
    isFirstPositionRef.current = true;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);

        isFirstPositionRef.current = false;
      },
      (error) => {
        // エラー時はトラッキング停止
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        if (locationIntervalRef.current !== null) {
          clearInterval(locationIntervalRef.current);
          locationIntervalRef.current = null;
        }
        setIsLocating(false);
        setUserLocation(null);
        isFirstPositionRef.current = true;

        const messages: Record<string, { ja: string; en: string }> = {
          '1': { ja: '位置情報の使用が許可されていません。', en: 'Location permission denied.' },
          '2': { ja: '位置情報を取得できませんでした。', en: 'Position unavailable.' },
          '3': { ja: '位置情報の取得がタイムアウトしました。', en: 'Location request timed out.' },
        };
        const msg = messages[String(error.code)] || { ja: '位置情報の取得に失敗しました。', en: 'Failed to get location.' };
        alert(currentLanguage === 'japanese' ? msg.ja : msg.en);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );

    watchIdRef.current = id;

    // 10秒ごとに位置情報を強制更新
    locationIntervalRef.current = setInterval(() => {
      fetchCurrentPosition();
    }, 10000);
  }, [currentLanguage, fetchCurrentPosition]);

  // 現在地を即時更新するハンドラー
  const handleRefreshLocation = useCallback(() => {
    fetchCurrentPosition();
  }, [fetchCurrentPosition]);

  // 現在地マーカーアイコン
  const userLocationIcon = useMemo(() => {
    if (!MapComponents?.DivIcon || !userLocation) return null;
    const { DivIcon } = MapComponents;
    return new DivIcon({
      html: `<div style="
        width: 18px; height: 18px;
        background: #4285F4;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 2px #4285F4, 0 2px 6px rgba(0,0,0,0.3);
      "></div>`,
      className: 'user-location-marker',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
  }, [MapComponents, userLocation]);

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
          <div>{translateUI('loadingMap', currentLanguage)}</div>
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

  const { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents, ZoomControl, DivIcon } = MapComponents;

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
    // 複数セグメントを個別描画するための配列（連続しないセグメントを誤接続しない）
    let displaySegments: Station[][] = [];

    // 出発・到着が設定されているが推薦ルートがまだない場合は何も表示しない（遷移中の全駅表示を防ぐ）
    if (departure && arrival && routeRecommendations.length === 0) {
      return null;
    }

    if (departure && arrival && routeRecommendations.length > 0) {
      // 選択された推薦ルートのこの路線に関するセグメントを収集（重複除去）
      const routesToShow = selectedRouteIndices === null
        ? routeRecommendations
        : routeRecommendations.filter((_, idx) => selectedRouteIndices.has(idx));

      if (routesToShow.length === 0) return null;

      const seen = new Set<string>();
      const uniqueSegments: Station[][] = [];
      routesToShow.forEach(route => {
        route.segments
          .filter(seg => seg.routeKey === routeKey)
          .forEach(seg => {
            const key = `${seg.stations[0]?.name}-${seg.stations[seg.stations.length - 1]?.name}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueSegments.push(seg.stations);
            }
          });
      });
      if (uniqueSegments.length === 0) return null;
      displaySegments = uniqueSegments;
      // マーカー用：全セグメントの駅の和集合（元路線の順序を保持）
      const allNames = new Set<string>();
      uniqueSegments.forEach(seg => seg.forEach(s => allNames.add(s.name)));
      displayStations = stations.filter(s => allNames.has(s.name));
    } else {
      displaySegments = [stations];
    }

    const color = adjustRouteColorForTheme(routeColors[routeKey], theme);

    return (
      <React.Fragment key={routeKey}>
        {/* 各セグメントを個別描画（非連続区間を誤接続しない） */}
        {displaySegments.map((segStations, segIdx) => {
          const segPositions = segStations.map(s => [s.lat, s.lng]);
          return (
            <React.Fragment key={`${routeKey}-seg-${segIdx}`}>
        {/* 透明な太い線でマウス判定を緩くする */}
        <Polyline
          positions={segPositions}
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
          positions={segPositions}
          color={color}
          weight={hoveredRoute === routeKey ? 6 : 4}
          opacity={visibleRoutes.has(routeKey) ? 0.8 : 0.2}
          interactive={false}
        />
            </React.Fragment>
          );
        })}
        {/* 駅マーカー（全セグメントの和集合） */}
        {displayStations.map((station, index) => {
          const isDeparture = departure && station.name === departure.name;
          const isArrival = arrival && station.name === arrival.name;
          const isSpecialStation = isDeparture || isArrival;

          if (isSpecialStation) {
            // 駅名表示がオフの場合は特別駅も非表示
            if (!showStationNames) {
              return null;
            }

            // 乗換駅のみ表示モード時は、特別駅も乗換駅チェックを適用
            if (showTransferStationsOnly && !transferStations.has(station.name)) {
              console.log(`Filtering out special non-transfer station: ${station.name}`);
              return null;
            }

            // 急行駅のみ表示モード時は、特別駅も急行駅チェックを適用
            if (showExpressStationsOnly && !station.isExpress) {
              console.log(`Filtering out special non-express station: ${station.name}`);
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

            const specialIcon = createSpecialStationIcon(isDeparture, zoomLevel, translateStation(station.name, currentLanguage), station.name, routeKey);
            if (!specialIcon) return null;

            return (
              <Marker
                key={`${routeKey}-special-${index}`}
                position={[station.lat, station.lng]}
                icon={specialIcon}
                zIndexOffset={5000}
                eventHandlers={{
                  click: (e) => {
                    const oe = e.originalEvent as MouseEvent | undefined;
                    if (!oe) return;
                    setStationTooltip(prev =>
                      prev?.stationName === station.name ? null : { stationName: station.name, station, x: oe.clientX, y: oe.clientY }
                    );
                  },
                }}
              >
              </Marker>
            );
          } else {
            // 駅名表示がオフの場合は通常駅も非表示
            if (!showStationNames) {
              return null;
            }

            const isTransferStation = transferStations.has(station.name);

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

            // 急行駅のみ表示モード（時間フィルター有効時でも適用）
            if (showExpressStationsOnly && !station.isExpress) {
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

            // 表示切替のみで駅の表示を制御（ズームレベルによる省略なし）
            const isDetailed = showStationNames;
            const stationOpacity = visibleRoutes.has(routeKey) ? 1 : 0.3;
            // 時刻表モード有効かつ経路上の駅なら出発時刻を2行目に表示
            const timelineEntry = timetableModeEnabled
              ? stationTimelineMap.get(station.name)?.find(e => e.routeKey === routeKey)
              : undefined;
            const stationTimeLabel = isDetailed && timelineEntry ? timelineEntry.depTime : undefined;
            const stationIcon = trainTypeViewEnabled
              ? createTrainTypeStationIcon(station, routeKey, zoomLevel, isDetailed, stationOpacity)
              : createStationIcon(station, color, zoomLevel, isDetailed, stationOpacity, stationTimeLabel, routeKey);
            if (!stationIcon) return null;

            const stationZIndex = (station.isExpress || isTransferStation) ? 3000 : 1000;

            return (
              <Marker
                key={`${routeKey}-station-${index}`}
                position={[station.lat, station.lng]}
                icon={stationIcon}
                zIndexOffset={stationZIndex}
                eventHandlers={{
                  click: (e) => {
                    const oe = e.originalEvent as MouseEvent | undefined;
                    if (!oe) return;
                    setStationTooltip(prev =>
                      prev?.stationName === station.name ? null : { stationName: station.name, station, x: oe.clientX, y: oe.clientY }
                    );
                  },
                }}
              >
              </Marker>
            );
          }
        })}
        {displayStations.map((station, index) => {
          if (index < displayStations.length - 1 && station.timeToNext) {
            const nextStation = displayStations[index + 1];
            const isCurrentTransfer = transferStations.has(station.name);

            if (showTransferStationsOnly) {
              // 乗換駅のみ表示時：乗換駅起点のみ処理（それ以外はスキップ）
              if (!isCurrentTransfer) return null;

              // 次の乗換駅まで合算
              let totalTime = 0;
              let endIndex = index;
              for (let i = index; i < displayStations.length - 1; i++) {
                const cSt = displayStations[i];
                const nSt = displayStations[i + 1];
                totalTime += cSt.timeToNext || 3;
                endIndex = i + 1;
                if (transferStations.has(nSt.name)) break;
              }

              if (endIndex === index) return null;

              // 隣接する駅も乗換駅なら個別表示、それ以外は合算表示
              if (endIndex === index + 1) {
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
                const midpoint = getRouteBasedMidpoint(displayStations, index, endIndex);
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
            } else {
              // 全駅表示時：各駅間の個別時間を表示
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
    <ErrorBoundary language={currentLanguage}>
      <div
        className={className}
        style={isFullscreen
          ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, overflow: 'hidden', backgroundColor: colors.background }
          : { padding: '0 20px' }
        }
      >
        {/* 駅選択UI */}
        {isFullscreen ? (
          /* モバイルフルスクリーン時は下部統合パネルで表示するためスキップ */
          !isMobile && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 1001,
              width: '320px',
              maxHeight: 'calc(100% - 20px)',
              overflowY: 'auto',
              borderRadius: '8px',
            }}>
              <StationSelector
                departure={departure}
                arrival={arrival}
                onDepartureChange={setDeparture}
                onArrivalChange={setArrival}
                isExpanded={isStationSelectorExpanded}
                onToggleExpanded={() => setIsStationSelectorExpanded(!isStationSelectorExpanded)}
                language={currentLanguage}
                departureTime={timetableBaseTime}
                onDepartureTimeChange={setTimetableBaseTime}
                onSetNearestDeparture={userLocation ? handleSetNearestDeparture : undefined}
                onSearchingChange={handleSearchingChange}
              />
            </div>
          )
        ) : (
          <StationSelector
            departure={departure}
            arrival={arrival}
            onDepartureChange={setDeparture}
            onArrivalChange={setArrival}
            isExpanded={isStationSelectorExpanded}
            onToggleExpanded={() => setIsStationSelectorExpanded(!isStationSelectorExpanded)}
            departureTime={timetableBaseTime}
            onDepartureTimeChange={setTimetableBaseTime}
            language={currentLanguage}
            onSetNearestDeparture={userLocation ? handleSetNearestDeparture : undefined}
            onSearchingChange={handleSearchingChange}
          />
        )}

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
            <h3 style={{ margin: '0', color: colors.text, fontSize: FS.sectionTitle, fontWeight: 'bold' }}>{translateUI('routeToggle', currentLanguage)}</h3>
            <span style={{
              fontSize: FS.label,
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
                  fontSize: FS.base,
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
                      fontSize: FS.base,
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
                      <span style={{ color: '#555' }}>{translateUI('maxTime', currentLanguage)}</span>
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

        <div style={isFullscreen
          ? { position: 'absolute', inset: 0, border: 'none' }
          : { height: '600px', width: '100%', border: `1px solid ${colors.border}`, position: 'relative' }
        }>
          {mapViewMode === 'realistic' ? (
            <MapContainer
              center={mapCenter}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              zoomControl={false}
              ref={mapRef}
            >
              <ZoomControl position="bottomright" />
              <MapEvents />
              {showOsmTiles && (
                <TileLayer
                  url={theme === 'dark'
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  }
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
              )}

              {visibleRoutesData.map(([routeKey, stations]) =>
                renderRoute(routeKey as RouteKey, stations)
              )}

              {/* 現在地マーカー */}
              {userLocation && userLocationIcon && (
                <Marker
                  position={userLocation}
                  icon={userLocationIcon}
                  zIndexOffset={3000}
                />
              )}
            </MapContainer>
          ) : (
            <DiagramMap
              visibleRoutes={visibleRoutes}
              highlightedRouteKeys={diagramHighlightedRouteKeys}
              departure={departure?.name ?? ''}
              arrival={arrival?.name ?? ''}
              theme={theme}
              language={currentLanguage}
              showStationNames={showStationNames}
            />
          )}

          {/* 路線凡例（Legend） - モバイルフルスクリーン時は下部統合パネルで表示 */}
          {visibleRoutesData.length > 0 && !(isFullscreen && isMobile) && !isStationSearching && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              maxHeight: isFullscreen ? 'calc(100% - 66px)' : 'none',
              backgroundColor: colors.surfaceElevated,
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              boxShadow: `0 2px 6px ${colors.shadow}`,
              minWidth: '150px',
              zIndex: 1000,
              overflowY: isFullscreen ? 'auto' : 'visible',
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
                  maxHeight: isFullscreen ? 'none' : '350px',
                  overflowY: isFullscreen ? 'visible' : 'auto',
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
                    availableRoutes={availableRoutes}
                    highlightedRouteKeys={highlightedRouteKeys}
                    routeColors={routeColors}
                    routeNames={routeNames}
                    showTransferStationsOnly={showTransferStationsOnly}
                    showExpressStationsOnly={showExpressStationsOnly}
                    showTravelTimes={showTravelTimes}
                    showStationNames={showStationNames}
                    showStationNumbers={showStationNumbers}
                    showFurigana={showFurigana}
                    showOsmTiles={showOsmTiles}
                    theme={theme}
                    language={currentLanguage}
                    onToggleRoute={toggleRoute}
                    onSelectAllRoutes={selectAllRoutes}
                    onDeselectAllRoutes={deselectAllRoutes}
                    onShowTransferStationsOnlyChange={setShowTransferStationsOnly}
                    onShowExpressStationsOnlyChange={setShowExpressStationsOnly}
                    onShowTravelTimesChange={setShowTravelTimes}
                    onShowStationNamesChange={setShowStationNames}
                    onShowStationNumbersChange={setShowStationNumbers}
                    onShowFuriganaChange={setShowFurigana}
                    onShowOsmTilesChange={setShowOsmTiles}
                    adjustRouteColorForTheme={adjustRouteColorForTheme}
                  />

                  {/* 3. 表示オプション (Display Options) */}
                  <LegendDisplayOptions
                    mapViewMode={mapViewMode}
                    theme={theme}
                    language={currentLanguage}
                    trainTypeViewEnabled={trainTypeViewEnabled}
                    onMapViewModeChange={setMapViewMode}
                  />

                  {/* 4. 推薦ルート選択 (Route Recommendations) */}
                  <LegendRouteRecommendations
                    routeRecommendations={routeRecommendations}
                    selectedRouteIndices={selectedRouteIndices}
                    theme={theme}
                    language={currentLanguage}
                    onRouteToggle={handleRouteToggle}
                    onSelectAll={handleSelectAllRecommendedRoutes}
                    onDeselectAll={handleDeselectAllRecommendedRoutes}
                  />

                  {/* 5. 列車種別ビューア - 非表示 */}
                  {false && (
                    <div style={{
                      marginBottom: '15px',
                      padding: '10px',
                      backgroundColor: colors.surface,
                      borderRadius: '4px',
                      border: `1px solid ${colors.borderLight}`,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '12px', color: colors.text }}>
                        <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>🚆 列車種別表示</div>

                        <div style={{ marginBottom: '8px', textAlign: 'left' }}>
                          <label style={{ fontSize: '11px', color: colors.textSecondary, display: 'block', marginBottom: '4px' }}>
                            路線選択:
                          </label>
                          <select
                            value={selectedTrainRoute || ''}
                            onChange={(e) => setSelectedTrainRoute(e.target.value as RouteKey || null)}
                            style={{
                              width: '100%',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: `1px solid ${colors.border}`,
                              fontSize: '11px',
                              backgroundColor: colors.surface,
                              color: colors.text
                            }}
                          >
                            <option value="">路線を選択してください</option>
                            <option value="yamanote">山手線</option>
                            <option value="chuo">中央線</option>
                            <option value="odakyuLine">小田急小田原線</option>
                            <option value="keihinTohoku">京浜東北線</option>
                            <option value="ginzaLine">銀座線</option>
                          </select>
                        </div>

                        {selectedTrainRoute && (
                          <div style={{ marginTop: '8px', textAlign: 'left' }}>
                            <label style={{ fontSize: '11px', color: colors.textSecondary, display: 'block', marginBottom: '4px' }}>
                              列車種別:
                            </label>
                            <select
                              value={selectedTrainType || ''}
                              onChange={(e) => setSelectedTrainType(e.target.value || null)}
                              style={{
                                width: '100%',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: `1px solid ${colors.border}`,
                                fontSize: '11px',
                                backgroundColor: colors.surface,
                                color: colors.text
                              }}
                            >
                              <option value="">列車種別を選択してください</option>
                              {getAvailableTrainTypes(selectedTrainRoute).map(trainType => (
                                <option key={trainType.id} value={trainType.id}>
                                  {trainType.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {selectedTrainRoute && (
                          <div style={{ marginTop: '12px', textAlign: 'left', fontSize: '10px', color: colors.textSecondary }}>
                            <div style={{ marginBottom: '6px', fontWeight: 'bold' }}>駅枠線の見方:</div>
                            {getBorderStyleExplanation().map((item, index) => (
                              <div key={index} style={{ marginBottom: '2px', display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                  width: '20px',
                                  height: '12px',
                                  border: item.level === 'basic' ? '1px solid #666666' :
                                          item.level === 'enhanced' ? '2px solid #FF6600' :
                                          item.level === 'premium' ? '3px solid #FF0000' :
                                          '3px double #8B0000',
                                  marginRight: '6px',
                                  borderRadius: '2px'
                                }} />
                                <span style={{ fontSize: '9px' }}>
                                  {item.style}: {item.description}
                                </span>
                              </div>
                            ))}
                            {selectedTrainType && (
                              <div style={{ marginTop: '6px', fontSize: '9px', fontStyle: 'italic' }}>
                                選択中: {selectedTrainType} の停車駅を強調表示
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* モバイルフルスクリーン時の統合パネル */}
          {isFullscreen && isMobile && (
            <>
              {/* コンテンツエリア（タブバーの上に展開） */}
              {isMobilePanelExpanded && (
                <div style={{
                  position: 'absolute',
                  bottom: isStationSearching ? 0 : 'calc(44px + env(safe-area-inset-bottom, 0px))',
                  left: 0,
                  right: 0,
                  zIndex: 1001,
                  backgroundColor: colors.surfaceElevated,
                  borderTop: `2px solid ${colors.border}`,
                  borderRadius: '12px 12px 0 0',
                  maxHeight: isStationSearching ? '80dvh' : 'calc(60dvh - 44px)',
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch' as any,
                  touchAction: 'pan-y',
                  boxShadow: `0 -2px 10px ${colors.shadow}`,
                }}>
                  {/* 折りたたみボタン（右上） - 検索中は非表示 */}
                  {!isStationSearching && <button
                    onClick={() => setIsMobilePanelExpanded(false)}
                    style={{
                      position: 'sticky',
                      top: 0,
                      float: 'right',
                      zIndex: 10,
                      width: '44px',
                      height: '44px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: colors.textSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >▼</button>}
                  {mobilePanelTab === 'station' && (
                    <StationSelector
                      departure={departure}
                      arrival={arrival}
                      onDepartureChange={setDeparture}
                      onArrivalChange={setArrival}
                      isExpanded={true}
                      language={currentLanguage}
                      departureTime={timetableBaseTime}
                      onDepartureTimeChange={setTimetableBaseTime}
                      onSetNearestDeparture={userLocation ? handleSetNearestDeparture : undefined}
                      onSearchingChange={handleSearchingChange}
                    />
                  )}
                  {mobilePanelTab === 'legend' && (
                    <div style={{ padding: '10px' }}>
                      <LegendStationMarkers
                        departure={departure}
                        arrival={arrival}
                        theme={theme}
                        language={currentLanguage}
                      />
                      <LegendRouteList
                        visibleRoutesData={visibleRoutesData}
                        visibleRoutes={visibleRoutes}
                        availableRoutes={availableRoutes}
                        highlightedRouteKeys={highlightedRouteKeys}
                        routeColors={routeColors}
                        routeNames={routeNames}
                        showTransferStationsOnly={showTransferStationsOnly}
                        showExpressStationsOnly={showExpressStationsOnly}
                        showTravelTimes={showTravelTimes}
                        showStationNames={showStationNames}
                        showStationNumbers={showStationNumbers}
                        showFurigana={showFurigana}
                        showOsmTiles={showOsmTiles}
                        theme={theme}
                        language={currentLanguage}
                        onToggleRoute={toggleRoute}
                        onSelectAllRoutes={selectAllRoutes}
                        onDeselectAllRoutes={deselectAllRoutes}
                        onShowTransferStationsOnlyChange={setShowTransferStationsOnly}
                        onShowExpressStationsOnlyChange={setShowExpressStationsOnly}
                        onShowTravelTimesChange={setShowTravelTimes}
                        onShowStationNamesChange={setShowStationNames}
                        onShowStationNumbersChange={setShowStationNumbers}
                        onShowFuriganaChange={setShowFurigana}
                        onShowOsmTilesChange={setShowOsmTiles}
                        adjustRouteColorForTheme={adjustRouteColorForTheme}
                      />
                      <LegendDisplayOptions
                        mapViewMode={mapViewMode}
                        theme={theme}
                        language={currentLanguage}
                        trainTypeViewEnabled={trainTypeViewEnabled}
                        onMapViewModeChange={setMapViewMode}
                      />
                      <LegendRouteRecommendations
                        routeRecommendations={routeRecommendations}
                        selectedRouteIndices={selectedRouteIndices}
                        theme={theme}
                        language={currentLanguage}
                        onRouteToggle={handleRouteToggle}
                        onSelectAll={handleSelectAllRecommendedRoutes}
                        onDeselectAll={handleDeselectAllRecommendedRoutes}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* タブバー（常に下端に固定） - 検索中は非表示 */}
              {!isStationSearching && <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1002,
                backgroundColor: colors.surfaceElevated,
                borderTop: isMobilePanelExpanded ? 'none' : `2px solid ${colors.border}`,
                borderRadius: isMobilePanelExpanded ? '0' : '12px 12px 0 0',
                height: 'calc(44px + env(safe-area-inset-bottom, 0px))',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                display: 'flex',
                alignItems: 'center',
                padding: `0 4px env(safe-area-inset-bottom, 0px)`,
                boxShadow: isMobilePanelExpanded ? 'none' : `0 -2px 10px ${colors.shadow}`,
              }}>
                <button
                  onClick={() => { setMobilePanelTab('station'); setIsMobilePanelExpanded(true); }}
                  style={{
                    flex: 1,
                    height: '44px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    backgroundColor: mobilePanelTab === 'station' && isMobilePanelExpanded ? colors.primary : 'transparent',
                    color: mobilePanelTab === 'station' && isMobilePanelExpanded ? '#fff' : colors.textSecondary,
                    transition: 'background-color 0.2s',
                  }}
                >
                  🚉 {translateUI('departure', currentLanguage) + '/' + translateUI('arrival', currentLanguage)}
                </button>
                <button
                  onClick={() => { setMobilePanelTab('legend'); setIsMobilePanelExpanded(true); }}
                  style={{
                    flex: 1,
                    height: '44px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: mobilePanelTab === 'legend' && isMobilePanelExpanded ? colors.primary : 'transparent',
                    color: mobilePanelTab === 'legend' && isMobilePanelExpanded ? '#fff' : colors.textSecondary,
                    transition: 'background-color 0.2s',
                  }}
                >
                  ⚙ {translateUI('displaySettings', currentLanguage)}
                </button>
              </div>}
            </>
          )}

          {/* 左下ボタングループ: フルスクリーン切り替え / 言語 / テーマ */}
          <div style={{
            position: 'absolute',
            ...(isFullscreen && isMobile
              ? { top: 'calc(env(safe-area-inset-top, 0px) + 10px)', bottom: 'auto' }
              : !isFullscreen
                ? isMobile
                  ? { top: '60px', bottom: 'auto' }
                  : { bottom: '10px', top: 'auto' }
                : { bottom: '10px', top: 'auto' }),
            left: '10px',
            zIndex: 1003,
            display: 'flex',
            gap: '4px',
          }}>
            {/* フルスクリーン切り替え */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{
                display: 'flex',
                backgroundColor: colors.surface,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                boxShadow: `0 2px 8px ${colors.shadow}`,
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
              title={isFullscreen
                ? translateUI('exitFullscreen', currentLanguage)
                : translateUI('enterFullscreen', currentLanguage)
              }
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>

            {/* 言語切り替え */}
            {onLanguageChange && (
              <button
                onClick={() => onLanguageChange(language === 'japanese' ? 'english' : 'japanese')}
                style={{
                  display: 'flex',
                  backgroundColor: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  boxShadow: `0 2px 8px ${colors.shadow}`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                  fontSize: FS.label,
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                }}
                title={language === 'japanese' ? 'Switch to English' : 'Switch to Japanese'}
                aria-label={language === 'japanese' ? 'Switch to English' : 'Switch to Japanese'}
              >
                {language === 'japanese' ? 'En' : '日'}
              </button>
            )}

            {/* テーマ切り替え */}
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                backgroundColor: colors.surface,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                boxShadow: `0 2px 8px ${colors.shadow}`,
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
              title={language === 'japanese'
                ? `${theme === 'light' ? 'ダーク' : 'ライト'}モードに切り替え`
                : `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`
              }
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>


          {/* 駅時刻表ツールチップ */}
          {timetableModeEnabled && renderStationTimetableTooltip()}

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
                            <span>{translateUI('fromWhere', currentLanguage)}</span>
                            <span style={{
                              color: '#4CAF50',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>→</span>
                            <span>{translateUI('direction', currentLanguage, { destination: translateStation(arrival.name, currentLanguage) })}</span>
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
                        <span>{getRouteDestination(clickedRoute)?.destinations[0] || translateUI('firstTrain', currentLanguage)}</span>
                        <span style={{
                          color: colors.textSecondary,
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}>⇔</span>
                        <span>{getRouteDestination(clickedRoute)?.destinations[1] || translateUI('lastStation', currentLanguage)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      <CookieBanner language={currentLanguage} />
    </ErrorBoundary>
  );
};

export default RailwayMap;