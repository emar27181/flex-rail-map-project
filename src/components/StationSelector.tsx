import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeftRight, Clock, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { routes } from '../data/routes';
import type { Station } from '../data/yamanote';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateStation, translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';
import { stationReadings, normalizeToHiragana } from '../utils/stationReadings';
import { findNearestStations } from '../utils/nearestStations';
import { loadStationHistory, recordStationSelection, buildSuggestions } from '../utils/stationHistory';
import type { StationHistoryEntry } from '../utils/stationHistory';
import { FS, TARGET, SEMANTIC, alphaWhite } from '../constants/ui';
import { L } from './legend/legendStyles';
import Button from './ui/atoms/Button';
import IconButton from './ui/atoms/IconButton';
import TrainStatusPanel from './TrainStatusPanel';
import type { DetectedRoute } from '../utils/trainDetector';
import TextField from './ui/atoms/TextField';

/** 駅名検索の結果として出す最大件数 */
const STATION_SUGGESTION_LIMIT = 10;
/**
 * 未入力時の候補の先頭5件の内訳。
 * よく使う駅（履歴）を先に出し、残りを近くの駅で埋める。
 * 到着駅は現在地の近くを出しても意味がないので近くの駅は使わない。
 */
const SUGGESTION_FREQUENT_COUNT = 3;
const SUGGESTION_NEARBY_COUNT = 2;
const SUGGESTION_HEAD_COUNT = SUGGESTION_NEARBY_COUNT + SUGGESTION_FREQUENT_COUNT;
/**
 * 駅選択パネル内の「出発時刻」行を出すか。
 * 同じ設定が駅ツールチップ側にもあるため既定では出さない。
 */
const SHOW_DEPARTURE_TIME_ROW: boolean = false;
/** 近隣駅は候補の補充にも使うため、先頭3件より多めに求めておく */
const NEARBY_STATION_COUNT = STATION_SUGGESTION_LIMIT;

interface StationSelectorProps {
  onDepartureChange: (station: Station | null) => void;
  onArrivalChange: (station: Station | null) => void;
  departure: Station | null;
  arrival: Station | null;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  language?: Language;
  departureTime?: string;
  onDepartureTimeChange?: (time: string) => void;
  onSetNearestDeparture?: () => void;
  onSearchingChange?: (isSearching: boolean) => void;
  detectedRoute?: DetectedRoute | null;
  manualTrainRoute?: DetectedRoute | null;
  onManualTrainRouteChange?: (route: DetectedRoute | null) => void;
  userLocation?: [number, number] | null;
  hasGps?: boolean;
  /** 乗車中の路線・到着予定を出すか。既定は非表示で、表示設定からONにできる */
  showTrainStatusPanel?: boolean;
  /** 位置情報が取れなかった理由。取れているときは null */
  locationError?: 'denied' | 'unavailable' | 'timeout' | null;
  /** 位置情報の再取得 */
  onRetryLocation?: () => void;
  /** 駅と駅のあいだに所要時間の丸を出すか */
  showTravelTime?: boolean;
  /** 所要時間表示の切り替え。渡されたときだけボタンを出す */
  onShowTravelTimeChange?: (value: boolean) => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  onDepartureChange,
  onArrivalChange,
  departure,
  arrival,
  isExpanded = true,
  onToggleExpanded,
  language = 'japanese',
  departureTime,
  onDepartureTimeChange,
  onSetNearestDeparture,
  onSearchingChange,
  detectedRoute = null,
  manualTrainRoute = null,
  onManualTrainRouteChange,
  userLocation = null,
  hasGps = false,
  showTrainStatusPanel = false,
  locationError = null,
  onRetryLocation,
  showTravelTime = false,
  onShowTravelTimeChange,
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [departureSearch, setDepartureSearch] = useState('');
  const [arrivalSearch, setArrivalSearch] = useState('');
  const [showDepartureResults, setShowDepartureResults] = useState(false);
  const [showArrivalResults, setShowArrivalResults] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [departureDropdownPos, setDepartureDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [arrivalDropdownPos, setArrivalDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const departureRef = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLDivElement>(null);
  const departurePortalRef = useRef<HTMLDivElement>(null);
  const arrivalPortalRef = useRef<HTMLDivElement>(null);
  const departureClickedRef = useRef(false);
  const arrivalClickedRef = useRef(false);
  const focusedInputRef = useRef<HTMLInputElement | null>(null);

  // 選択回数の履歴。候補の一部をここから埋める（localStorage 由来なのでマウント後に読む）
  const [stationHistory, setStationHistory] = useState<StationHistoryEntry[]>([]);
  useEffect(() => { setStationHistory(loadStationHistory()); }, []);

  // 外側クリックで閉じる機能（ポータルドロップダウンは除外）
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        departureRef.current && !departureRef.current.contains(target) &&
        !departurePortalRef.current?.contains(target)
      ) {
        setShowDepartureResults(false);
      }
      if (
        arrivalRef.current && !arrivalRef.current.contains(target) &&
        !arrivalPortalRef.current?.contains(target)
      ) {
        setShowArrivalResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // レスポンシブ対応
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 初期設定
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // visualViewport でキーボード表示を検知して入力欄をスクロール
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleViewportResize = () => {
      if (!focusedInputRef.current) return;
      // キーボードが出て viewport が縮んだとき入力欄を画面内に収める
      focusedInputRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    vv.addEventListener('resize', handleViewportResize);
    return () => vv.removeEventListener('resize', handleViewportResize);
  }, []);

  // 言語変更時に選択済み駅名の表示を更新
  useEffect(() => {
    if (departure) {
      setDepartureSearch(translateStation(departure.name, language));
    }
    if (arrival) {
      setArrivalSearch(translateStation(arrival.name, language));
    }
  }, [language, departure, arrival]);

  const allStations = useMemo(() => {
    const stationMap = new Map<string, Station>();
    Object.values(routes).forEach(routeStations => {
      routeStations.forEach(station => {
        if (!stationMap.has(station.name)) {
          stationMap.set(station.name, station);
        }
      });
    });
    // 読み（ひらがな）でソート。読みがない駅は末尾
    return Array.from(stationMap.values()).sort((a, b) => {
      const ra = stationReadings[a.name] ?? '￿' + a.name;
      const rb = stationReadings[b.name] ?? '￿' + b.name;
      return ra.localeCompare(rb, 'ja');
    });
  }, []);

  // 未入力時に出す「大きい駅」。乗り入れ路線数の多い順に並べる。
  // 以前は東京・新宿…の固定リストだったが、関東以外に居ると1件も役に立たない。
  // 路線データから数えれば、どの地域でもその土地の主要駅が上に来る。
  const majorStations = useMemo(() => {
    const routeCount = new Map<string, number>();
    for (const stationList of Object.values(routes)) {
      for (const st of stationList as Station[]) {
        routeCount.set(st.name, (routeCount.get(st.name) ?? 0) + 1);
      }
    }
    return [...allStations]
      .sort((a, b) => (routeCount.get(b.name) ?? 0) - (routeCount.get(a.name) ?? 0))
      .slice(0, STATION_SUGGESTION_LIMIT * 3);
  }, [allStations]);

  // 現在地周辺の駅（出発駅の入力候補用。位置情報が未取得の場合は主要駅にフォールバック）
  // 候補欄は6件ほどで打ち切られスクロールするため、その先も辿れるよう
  // 検索結果の上限（10件）と同じ件数を出す。
  const nearbyStations = useMemo(() => {
    if (!userLocation) return null;
    return findNearestStations(allStations, userLocation[0], userLocation[1], NEARBY_STATION_COUNT);
  }, [allStations, userLocation]);

  // 検索文字列でフィルタし、前方一致優先・読み順でソートして上位 STATION_SUGGESTION_LIMIT 件を返す
  function filterStations(search: string, emptySearchDefault: Station[] = majorStations): Station[] {
    if (!search) return emptySearchDefault;
    const term = normalizeToHiragana(search.toLowerCase());
    return allStations
      .filter(station => {
        const reading = stationReadings[station.name] ?? '';
        const name = normalizeToHiragana(station.name.toLowerCase());
        const en = translateStation(station.name, 'english').toLowerCase();
        return reading.startsWith(term) || reading.includes(term) ||
               name.includes(term) || en.includes(term);
      })
      .sort((a, b) => {
        // 前方一致を優先
        const ra = stationReadings[a.name] ?? a.name;
        const rb = stationReadings[b.name] ?? b.name;
        const aStarts = ra.startsWith(term) ? 0 : 1;
        const bStarts = rb.startsWith(term) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return ra.localeCompare(rb, 'ja');
      })
      .slice(0, STATION_SUGGESTION_LIMIT);
  }

  const findStationByName = useMemo(() => {
    const map = new Map(allStations.map(s => [s.name, s]));
    return (name: string) => map.get(name);
  }, [allStations]);

  /**
   * 未入力時に出す候補を組み立てる。
   *
   * 並びは「よく使う駅（履歴）→ 近くの駅 → 大きい駅」。
   * 到着駅は現在地の近くを出しても意味がないので近くの駅を外す
   * （その分、履歴と大きい駅が上に来る）。
   */
  const buildEmptySuggestions = (useNearby: boolean): Station[] => {
    const nearby = useNearby ? (nearbyStations ?? []) : [];
    const head = buildSuggestions(nearby, stationHistory, majorStations, findStationByName, {
      nearbyCount: useNearby ? SUGGESTION_NEARBY_COUNT : 0,
      frequentCount: SUGGESTION_FREQUENT_COUNT,
      total: SUGGESTION_HEAD_COUNT,
    });
    // 6件目以降はスクロールで辿れるよう 近隣→大きい駅 の順で補う
    const seen = new Set(head.map(s => s.name));
    const rest: Station[] = [];
    for (const s of [...nearby, ...majorStations]) {
      if (head.length + rest.length >= STATION_SUGGESTION_LIMIT) break;
      if (seen.has(s.name)) continue;
      seen.add(s.name);
      rest.push(s);
    }
    return [...head, ...rest];
  };

  const departureSuggestions = useMemo(
    () => buildEmptySuggestions(true),
    [nearbyStations, stationHistory, majorStations, findStationByName]
  );
  const arrivalSuggestions = useMemo(
    () => buildEmptySuggestions(false),
    [nearbyStations, stationHistory, majorStations, findStationByName]
  );

  const filteredDepartureStations = useMemo(
    () => filterStations(departureSearch, departureSuggestions),
    [allStations, departureSearch, departureSuggestions]
  );

  const filteredArrivalStations = useMemo(
    () => filterStations(arrivalSearch, arrivalSuggestions),
    [allStations, arrivalSearch, arrivalSuggestions]
  );

  const handleDepartureSelect = (station: Station) => {
    departureClickedRef.current = true;
    onDepartureChange(station);
    setDepartureSearch(translateStation(station.name, language));
    setShowDepartureResults(false);
    setStationHistory(recordStationSelection(station.name));
  };

  const handleArrivalSelect = (station: Station) => {
    arrivalClickedRef.current = true;
    onArrivalChange(station);
    setArrivalSearch(translateStation(station.name, language));
    setShowArrivalResults(false);
    setStationHistory(recordStationSelection(station.name));
  };

  // 完全一致する駅を検索
  const findExactMatchStation = (searchTerm: string): Station | null => {
    if (!searchTerm) return null;
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return allStations.find(station => {
      const japaneseName = station.name.toLowerCase();
      const englishName = translateStation(station.name, 'english').toLowerCase();
      return japaneseName === normalizedSearch || englishName === normalizedSearch;
    }) || null;
  };

  // 出発駅の検索確定処理
  const handleDepartureConfirm = () => {
    const exactMatch = findExactMatchStation(departureSearch);
    if (exactMatch) {
      handleDepartureSelect(exactMatch);
    }
  };

  // 到着駅の検索確定処理
  const handleArrivalConfirm = () => {
    const exactMatch = findExactMatchStation(arrivalSearch);
    if (exactMatch) {
      handleArrivalSelect(exactMatch);
    }
  };

  const clearDeparture = () => {
    departureClickedRef.current = true;
    onDepartureChange(null);
    setDepartureSearch('');
  };

  const clearArrival = () => {
    arrivalClickedRef.current = true;
    onArrivalChange(null);
    setArrivalSearch('');
  };


  // 入力フォーカス状態の管理
  const searchingBlurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchFocus = () => {
    if (searchingBlurTimer.current) clearTimeout(searchingBlurTimer.current);
    setIsSearching(true);
    onSearchingChange?.(true);
  };

  const handleSearchBlur = () => {
    // blurとfocusの間に少し待機（タブ移動などで即座に非表示にならないように）
    searchingBlurTimer.current = setTimeout(() => {
      setIsSearching(false);
      onSearchingChange?.(false);
      focusedInputRef.current = null;
    }, 200);
  };

  // マップへのタッチイベント伝播を防ぐ（Leafletマップが誤ってズームしないように）
  const stopTouchPropagation = (e: React.TouchEvent) => e.stopPropagation();

  return (
    <div
      onTouchStart={stopTouchPropagation}
      onTouchMove={stopTouchPropagation}
      onTouchEnd={stopTouchPropagation}
      style={{
        marginBottom: L.sp.md,
        paddingTop: L.sp.md,
        paddingBottom: isExpanded ? '8px' : '0',
        paddingLeft: L.sp.md,
        paddingRight: L.sp.md,
        height: isExpanded ? 'auto' : '36px',
        boxSizing: 'border-box',
        overflow: (showDepartureResults || showArrivalResults) ? 'visible' : 'hidden',
        border: `1px solid ${colors.border}`,
        borderRadius: L.r.pill,
        backgroundColor: isExpanded ? colors.glassOpen : colors.glassCollapsed,
        boxShadow: `0 2px 8px ${colors.shadow}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div 
        onClick={onToggleExpanded}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: onToggleExpanded ? 'pointer' : 'default',
          marginBottom: isExpanded ? '6px' : '0'
        }}
      >
        <h3 style={{ margin: `0`, color: colors.text, fontSize: FS.sectionTitle, fontWeight: 'bold' }}>{translateUI('stationSelection', language)}</h3>
        {onToggleExpanded && (
          <span style={{
            fontSize: FS.label,
            color: colors.textSecondary,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}>▼</span>
        )}
      </div>
      
      {isExpanded && (
        <>
          <div style={{
            display: 'flex',
            gap: L.sp.xs,
            alignItems: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            {/* 出発駅選択 */}
            <div ref={departureRef} style={{
              flex: '1 1 0',
              minWidth: '0',
              position: 'relative'
            }}>
              <label style={{ display: 'block', marginBottom: L.sp.xs, fontWeight: 'bold', color: colors.textSecondary, fontSize: FS.label }}>
                {translateUI('departureStation', language)}
              </label>
              <div style={{ position: 'relative' }}>
                <TextField
                  theme={theme}
                  size="md"
                  type="text"
                  value={departureSearch}
                  onChange={(e) => {
                    setDepartureSearch(e.target.value);
                    setShowDepartureResults(true);
                  }}
                  onFocus={(e) => {
                    focusedInputRef.current = e.currentTarget;
                    const rect = e.currentTarget.getBoundingClientRect();
                    setDepartureDropdownPos({ top: rect.bottom + 2, left: rect.left, width: rect.width });
                    setShowDepartureResults(true);
                    handleSearchFocus();
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!departureClickedRef.current) {
                        handleDepartureConfirm();
                        setShowDepartureResults(false);
                      }
                      departureClickedRef.current = false;
                    }, 200);
                    handleSearchBlur();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleDepartureConfirm();
                      setShowDepartureResults(false);
                    }
                  }}
                  placeholder={departure ? translateStation(departure.name, language) : translateUI('stationPlaceholder', language)}
                  className="station-input-filled"
                  styleOverride={{
                    // ✕ を重ねるので右側だけ余白を広げる
                    paddingRight: L.sp['3xl'],
                    // 出発＝緑 で塗りつぶし、文字は白。地図の上でも役割が一目で分かるようにする
                    border: `2px solid ${SEMANTIC.departure}`,
                    backgroundColor: SEMANTIC.departure,
                    color: colors.onPrimary,
                  }}
                />
                {departure && (
                  <IconButton
                    theme={theme}
                    size="sm"
                    onClick={clearDeparture}
                    label={translateUI('clearSelection', language)}
                    icon={<X size={14} />}
                    styleOverride={{
                      position: 'absolute',
                      right: '2px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      // 塗りつぶした入力欄の上に置くため白系にする
                      color: alphaWhite(0.9),
                    }}
                  />
                )}
              </div>
              {/*
                位置情報が取れないときは黙って何も出さないと、
                なぜ現在地が使えないのか分からず再取得もできない。
              */}
              {locationError && (
                <div style={{ marginTop: L.sp.xs, display: 'flex', alignItems: 'center', gap: L.sp.xs, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: FS.helper, color: colors.textSecondary }}>
                    {translateUI(locationError === 'denied' ? 'locationDenied' : 'locationUnavailable', language)}
                  </span>
                  {locationError !== 'denied' && onRetryLocation && (
                    <Button theme={theme} variant="outline" size="sm" onClick={onRetryLocation}>
                      {translateUI('retryLocation', language)}
                    </Button>
                  )}
                </div>
              )}
              {showDepartureResults && departureDropdownPos && createPortal(
                <div
                  ref={departurePortalRef}
                  onMouseDown={(e) => { e.preventDefault(); departureClickedRef.current = true; }}
                  onTouchStart={(e) => { e.stopPropagation(); departureClickedRef.current = true; }}
                  onTouchMove={(e) => e.stopPropagation()}
                  style={{
                  position: 'fixed',
                  top: departureDropdownPos.top,
                  left: departureDropdownPos.left,
                  width: departureDropdownPos.width,
                  backgroundColor: colors.surfaceElevated,
                  border: `1px solid ${colors.border}`,
                  borderRadius: L.r.md,
                  boxShadow: `0 4px 12px ${colors.shadow}`,
                  maxHeight: '240px',
                  overflowY: 'auto',
                  // iOSで候補内をスクロールしたとき、端に達しても地図やページ側へ
                  // スクロールが伝播しないようにする
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                  // body に touch-action: manipulation が掛かっており、
                  // 指定しないと縦スワイプがスクロールとして扱われない端末がある
                  touchAction: 'pan-y',
                  zIndex: 99999
                }}>
                  {filteredDepartureStations.map((station, index) => (
                    <div
                      key={`${station.name}-${index}`}
                      onClick={() => handleDepartureSelect(station)}
                      style={{
                        padding: `${L.sp.md} ${L.sp.xl}`,
                        cursor: 'pointer',
                        borderBottom: index < filteredDepartureStations.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                        fontSize: FS.base,
                        wordBreak: language === 'english' ? 'break-word' : 'normal',
                        lineHeight: '1.3'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surface}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.surfaceElevated}
                    >
                      {translateStation(station.name, language)}
                    </div>
                  ))}
                  {filteredDepartureStations.length === 0 && (
                    <div style={{ padding: `${L.sp.md} ${L.sp.xl}`, color: colors.textSecondary, fontSize: FS.base }}>
                      {departureSearch ? translateUI('noStationFound', language) : translateUI('majorStationsHint', language)}
                    </div>
                  )}
                </div>,
                document.body
              )}
            </div>


            {/* 入れ替えボタン */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              paddingBottom: L.sp.xxs,
            }}>
              {/* ラベル (line-height≒18px) + margin-bottom 3px 分のオフセット */}
              <div style={{ height: '21px' }} />
              <IconButton
                theme={theme}
                size="sm"
                onClick={() => {
                  const prevDep = departure;
                  const prevArr = arrival;
                  onDepartureChange(prevArr);
                  onArrivalChange(prevDep);
                  setDepartureSearch(prevArr ? translateStation(prevArr.name, language) : '');
                  setArrivalSearch(prevDep ? translateStation(prevDep.name, language) : '');
                }}
                label={translateUI('swapStationsTitle', language)}
                icon={<ArrowLeftRight size={14} />}
                styleOverride={{ flexShrink: 0 }}
              />
            </div>

            {/* 到着駅選択 */}
            <div ref={arrivalRef} style={{
              flex: '1 1 0',
              minWidth: '0',
              position: 'relative'
            }}>
              <label style={{ display: 'block', marginBottom: L.sp.xs, fontWeight: 'bold', color: colors.textSecondary, fontSize: FS.label }}>
                {translateUI('arrivalStation', language)}
              </label>
              <div style={{ position: 'relative' }}>
                <TextField
                  theme={theme}
                  size="md"
                  type="text"
                  value={arrivalSearch}
                  onChange={(e) => {
                    setArrivalSearch(e.target.value);
                    setShowArrivalResults(true);
                  }}
                  onFocus={(e) => {
                    focusedInputRef.current = e.currentTarget;
                    const rect = e.currentTarget.getBoundingClientRect();
                    setArrivalDropdownPos({ top: rect.bottom + 2, left: rect.left, width: rect.width });
                    setShowArrivalResults(true);
                    handleSearchFocus();
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!arrivalClickedRef.current) {
                        handleArrivalConfirm();
                        setShowArrivalResults(false);
                      }
                      arrivalClickedRef.current = false;
                    }, 200);
                    handleSearchBlur();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleArrivalConfirm();
                      setShowArrivalResults(false);
                    }
                  }}
                  placeholder={arrival ? translateStation(arrival.name, language) : translateUI('stationPlaceholder', language)}
                  className="station-input-filled"
                  styleOverride={{
                    // ✕ を重ねるので右側だけ余白を広げる
                    paddingRight: L.sp['3xl'],
                    // 到着＝赤 で塗りつぶし、文字は白（出発欄と対になる配色）
                    border: `2px solid ${SEMANTIC.arrival}`,
                    backgroundColor: SEMANTIC.arrival,
                    color: colors.onPrimary,
                  }}
                />
                {arrival && (
                  <IconButton
                    theme={theme}
                    size="sm"
                    onClick={clearArrival}
                    label={translateUI('clearSelection', language)}
                    icon={<X size={14} />}
                    styleOverride={{
                      position: 'absolute',
                      right: '2px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      // 塗りつぶした入力欄の上に置くため白系にする
                      color: alphaWhite(0.9),
                    }}
                  />
                )}
              </div>
              
              {showArrivalResults && arrivalDropdownPos && createPortal(
                <div
                  ref={arrivalPortalRef}
                  onMouseDown={(e) => { e.preventDefault(); arrivalClickedRef.current = true; }}
                  onTouchStart={(e) => { e.stopPropagation(); arrivalClickedRef.current = true; }}
                  onTouchMove={(e) => e.stopPropagation()}
                  style={{
                  position: 'fixed',
                  top: arrivalDropdownPos.top,
                  left: arrivalDropdownPos.left,
                  width: arrivalDropdownPos.width,
                  backgroundColor: colors.surfaceElevated,
                  border: `1px solid ${colors.border}`,
                  borderRadius: L.r.md,
                  boxShadow: `0 4px 12px ${colors.shadow}`,
                  maxHeight: '240px',
                  overflowY: 'auto',
                  // iOSで候補内をスクロールしたとき、端に達しても地図やページ側へ
                  // スクロールが伝播しないようにする
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                  // body に touch-action: manipulation が掛かっており、
                  // 指定しないと縦スワイプがスクロールとして扱われない端末がある
                  touchAction: 'pan-y',
                  zIndex: 99999
                }}>
                  {filteredArrivalStations.map((station, index) => (
                    <div
                      key={`${station.name}-${index}`}
                      onClick={() => handleArrivalSelect(station)}
                      style={{
                        padding: `${L.sp.md} ${L.sp.xl}`,
                        cursor: 'pointer',
                        borderBottom: index < filteredArrivalStations.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                        fontSize: FS.base,
                        wordBreak: language === 'english' ? 'break-word' : 'normal',
                        lineHeight: '1.3'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surface}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.surfaceElevated}
                    >
                      {translateStation(station.name, language)}
                    </div>
                  ))}
                  {filteredArrivalStations.length === 0 && (
                    <div style={{ padding: `${L.sp.md} ${L.sp.xl}`, color: colors.textSecondary, fontSize: FS.base }}>
                      {arrivalSearch ? translateUI('noStationFound', language) : translateUI('majorStationsHint', language)}
                    </div>
                  )}
                </div>,
                document.body
              )}
            </div>
          </div>

          {/* 乗車路線検出パネル（表示設定でONにしたときだけ出す） */}
          {showTrainStatusPanel && hasGps && onManualTrainRouteChange && (
            <TrainStatusPanel
              detectedRoute={detectedRoute}
              manualRoute={manualTrainRoute}
              onManualRouteChange={onManualTrainRouteChange}
              userLocation={userLocation}
              hasGps={hasGps}
              language={language}
            />
          )}

          {/*
            駅の指定に付随する操作をまとめた行。

            「現在地から」は出発駅の列の中に置いていたが、列幅が110pxしかなく
            所要時間トグル(115px)を横に並べられなかった。パネル幅(270px)を
            使える位置に出して横並びにする。

            所要時間は駅と駅のあいだに出る丸の切り替え。以前は開発用の
            「路線表示切替セクション」と設定パネルの中にしか無く、
            経路を見ている最中に切り替えられなかった。

            寸法は Button の size="sm" に揃えてあるので2つの大きさは一致する。
          */}
          {(onSetNearestDeparture || onShowTravelTimeChange) && (
            <div style={{
              marginTop: L.sp.xs,
              display: 'flex',
              alignItems: 'center',
              gap: L.sp.xs,
              flexWrap: 'wrap',
            }}>
              {onSetNearestDeparture && (
                <Button
                  theme={theme}
                  // 出発駅欄と同じ緑の塗りつぶしで、出発側の操作だと分かるようにする
                  variant="positive"
                  size="sm"
                  onClick={onSetNearestDeparture}
                >
                  {translateUI('currentLocationFrom', language)}
                </Button>
              )}
              {onShowTravelTimeChange && (
                <Button
                  theme={theme}
                  variant="primary"
                  size="sm"
                  pressed={!!showTravelTime}
                  onClick={() => onShowTravelTimeChange(!showTravelTime)}
                  icon={<Clock size={14} aria-hidden />}
                >
                  {translateUI('showTravelTimes', language)}
                </Button>
              )}
            </div>
          )}

          {/*
            出発時刻の行はここでは表示しない。
            駅ツールチップ側に同じ設定（timetableBaseTime を共有）があり、
            駅選択パネルでは駅の指定に集中させたいため。
          */}
          {SHOW_DEPARTURE_TIME_ROW && onDepartureTimeChange && (
            <div style={{
              marginTop: L.sp.sm,
              display: 'flex',
              alignItems: 'center',
              gap: L.sp.xs,
            }}>
              <label style={{ fontSize: FS.label, fontWeight: 'bold', color: colors.textSecondary, whiteSpace: 'nowrap' }}>
                {translateUI('departureTime', language)}
              </label>
              <TextField
                theme={theme}
                size="sm"
                type="time"
                value={departureTime ?? ''}
                onChange={e => onDepartureTimeChange(e.target.value)}
                onFocus={(e) => { focusedInputRef.current = e.currentTarget; }}
                onBlur={() => { focusedInputRef.current = null; }}
                fullWidth={false}
              />
              <Button
                theme={theme}
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const hh = String(now.getHours()).padStart(2, '0');
                  const mm = String(now.getMinutes()).padStart(2, '0');
                  onDepartureTimeChange(`${hh}:${mm}`);
                }}
              >
                {translateUI('currentTime', language)}
              </Button>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default StationSelector;