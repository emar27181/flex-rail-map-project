import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeftRight, Clock, LocateFixed, MapPinPlus, Timer, Waypoints, X } from 'lucide-react';
import { routes } from '../data/routes';
import type { Station } from '../data/yamanote';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateStation, translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';
import { stationReadings, normalizeToHiragana, hiraganaToRomaji, normalizeRomajiForMatch } from '../utils/stationReadings';
import { findNearestStations } from '../utils/nearestStations';
import { loadStationHistory, recordStationSelection, buildSuggestions } from '../utils/stationHistory';
import type { StationHistoryEntry } from '../utils/stationHistory';
import { FS, TARGET, SEMANTIC, alphaWhite } from '../constants/ui';
import { L } from './legend/legendStyles';
import Button from './ui/atoms/Button';
import IconButton from './ui/atoms/IconButton';
import RemovableTag from './ui/atoms/RemovableTag';
import StationSearchDropdown from './ui/StationSearchDropdown';
import { FLOATING_ICON_BUTTON_SIZE } from './ui/atoms/controlSize';
import TrainStatusPanel from './TrainStatusPanel';
import type { DetectedRoute } from '../utils/trainDetector';
import TextField from './ui/atoms/TextField';
import SegmentedControl from './ui/molecules/SegmentedControl';

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
 * 同じ設定は駅ツールチップ側にもある（timetableBaseTime を共有）が、
 * 「経由駅の設定と、時刻の設定も出発駅とかの入力の下でできるように」との
 * 要望を受け、駅選択パネルからも直接操作できるようにした
 */
const SHOW_DEPARTURE_TIME_ROW: boolean = true;
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
  /**
   * 出発駅が「現在地の最寄り駅」と一致しているか。
   * 「現在地から」ボタンを塗りつぶすかどうかに使う（GPSが取れただけでは
   * 塗らず、実際に出発駅として適用されているときだけ塗る）
   */
  isNearestDeparture?: boolean;
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
  /** 乗換駅のみ表示するか */
  showTransferStationsOnly?: boolean;
  /** 乗換駅のみ表示の切り替え。渡されたときだけボタンを出す */
  onShowTransferStationsOnlyChange?: (value: boolean) => void;
  /** 経由駅（順序付き）。渡されたときだけ経由駅の設定UIを出す */
  waypoints?: Station[];
  /** 経由駅を追加する */
  onAddWaypoint?: (station: Station) => void;
  /** 経由駅を削除する（配列インデックス指定） */
  onRemoveWaypoint?: (index: number) => void;
  /** 駅アイコンの下に時刻表の発車時刻を表示するか */
  showStationTimeLabels?: boolean;
  /** 時刻表示の切り替え。渡されたときだけボタンを出す */
  onShowStationTimeLabelsChange?: (value: boolean) => void;
  /** 出発時刻欄を「出発時刻」「到着時刻」どちらとして扱うか */
  timeMode?: 'departure' | 'arrival';
  /** 出発/到着基準の切り替え。渡されたときだけ切替UIを出す */
  onTimeModeChange?: (mode: 'departure' | 'arrival') => void;
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
  isNearestDeparture = false,
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
  showTransferStationsOnly = false,
  onShowTransferStationsOnlyChange,
  waypoints,
  onAddWaypoint,
  onRemoveWaypoint,
  showStationTimeLabels = false,
  onShowStationTimeLabelsChange,
  timeMode = 'departure',
  onTimeModeChange,
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [departureSearch, setDepartureSearch] = useState('');
  const [arrivalSearch, setArrivalSearch] = useState('');
  const [showDepartureResults, setShowDepartureResults] = useState(false);
  const [showArrivalResults, setShowArrivalResults] = useState(false);
  const [waypointSearch, setWaypointSearch] = useState('');
  const [showWaypointResults, setShowWaypointResults] = useState(false);
  const [showWaypointInput, setShowWaypointInput] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [departureDropdownPos, setDepartureDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [arrivalDropdownPos, setArrivalDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [waypointDropdownPos, setWaypointDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  /**
   * 経由駅入力欄の横幅を出発駅欄と同じにするため、実際に描画された
   * 出発駅欄（departureRef）の横幅を測って使う（値をハードコードしない）。
   */
  const [waypointFieldWidth, setWaypointFieldWidth] = useState<number | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
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
    // ひらがな読みデータ(stationReadings)がある駅は1割程度のため、それ以外の駅でも
    // ひらがな入力でヒットするよう、入力をローマ字化して英語表記（全駅分ある）とも
    // 緩く比較する（長音表記の違いは normalizeRomajiForMatch 側で吸収する）
    const termRomaji = normalizeRomajiForMatch(hiraganaToRomaji(term));
    return allStations
      .filter(station => {
        const reading = stationReadings[station.name] ?? '';
        const name = normalizeToHiragana(station.name.toLowerCase());
        const en = translateStation(station.name, 'english').toLowerCase();
        const enRomaji = normalizeRomajiForMatch(en);
        return reading.startsWith(term) || reading.includes(term) ||
               name.includes(term) || en.includes(term) ||
               (termRomaji.length > 0 && enRomaji.includes(termRomaji));
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

  // 経由駅の候補は、まだ経由駅に入っていない駅だけに絞る（同じ駅を二重に選べないように）
  const filteredWaypointStations = useMemo(() => {
    const already = new Set((waypoints ?? []).map(s => s.name));
    return filterStations(waypointSearch, majorStations).filter(s => !already.has(s.name));
  }, [allStations, waypointSearch, majorStations, waypoints]);

  const handleWaypointSelect = (station: Station) => {
    onAddWaypoint?.(station);
    setWaypointSearch('');
    setShowWaypointResults(false);
    setShowWaypointInput(false);
  };

  /**
   * 出発駅・到着駅の候補ドロップダウンの位置・横幅を、入力欄自身の幅ではなく
   * パネル全体の中身の幅に合わせて計算する。
   *
   * 出発駅・到着駅は横に並ぶ2カラムのため、入力欄自身の幅はパネルの半分ほど
   * しかない。候補の横幅もそれに合わせていたため、候補を出すと隣の到着駅欄の
   * ぶんだけ余白ができ、しかも候補が下のボタン行に重なって隠れていた。
   * パネルの余白（padding）はデザイントークン(L.sp.md)から決まるが、
   * ここでは実際に描画された値を`getComputedStyle`で読み取ることで、
   * トークンの値が変わっても計算式を書き換えずに済むようにしている。
   */
  const getFullWidthDropdownPosition = (inputRect: DOMRect) => {
    const panelEl = panelRef.current;
    if (!panelEl) return { top: inputRect.bottom + 2, left: inputRect.left, width: inputRect.width };
    const panelRect = panelEl.getBoundingClientRect();
    const style = getComputedStyle(panelEl);
    const padLeft = parseFloat(style.paddingLeft) || 0;
    const padRight = parseFloat(style.paddingRight) || 0;
    return {
      top: inputRect.bottom + 2,
      left: panelRect.left + padLeft,
      width: panelRect.width - padLeft - padRight,
    };
  };

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
      ref={panelRef}
      onTouchStart={stopTouchPropagation}
      onTouchMove={stopTouchPropagation}
      onTouchEnd={stopTouchPropagation}
      style={{
        marginBottom: L.sp.md,
        // 畳んだ状態は上余白だけ8px・下余白0pxという非対称な指定になっており、
        // 見出し行の高さぶんだけ下側の空きが上側より狭く見えていた。
        // 上下とも余白を0にし、代わりにflexの縦中央揃えで高さいっぱいに
        // センタリングすることで、中身の実際の高さに関係なく必ず揃うようにする
        paddingTop: isExpanded ? L.sp.md : 0,
        paddingBottom: isExpanded ? L.sp.md : 0,
        paddingLeft: L.sp.md,
        paddingRight: L.sp.md,
        // 畳んだ高さは、地図隅に浮かぶ他のアイコンボタン（フルスクリーン/言語切替等）
        // と行が揃うよう、それらと同じ一元管理された寸法から取る
        height: isExpanded ? 'auto' : FLOATING_ICON_BUTTON_SIZE.md,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isExpanded ? 'flex-start' : 'center',
        boxSizing: 'border-box',
        overflow: (showDepartureResults || showArrivalResults) ? 'visible' : 'hidden',
        border: `1px solid ${colors.border}`,
        borderRadius: L.r.card,
        backgroundColor: isExpanded ? colors.glassOpen : colors.glassCollapsed,
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
        <h3 style={{ margin: `0`, color: colors.text, fontSize: FS.title, fontWeight: 'bold' }}>{translateUI('stationSelection', language)}</h3>
        {onToggleExpanded && (
          <span style={{
            fontSize: FS.caption,
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
              <label style={{ display: 'block', marginBottom: L.sp.xs, fontWeight: 'bold', color: colors.textSecondary, fontSize: FS.caption }}>
                {translateUI('departureStation', language)}
              </label>
              <div style={{ position: 'relative' }}>
                <TextField
                  theme={theme}
                  size="sm"
                  type="text"
                  value={departureSearch}
                  onChange={(e) => {
                    setDepartureSearch(e.target.value);
                    setShowDepartureResults(true);
                  }}
                  onFocus={(e) => {
                    focusedInputRef.current = e.currentTarget;
                    setDepartureDropdownPos(getFullWidthDropdownPosition(e.currentTarget.getBoundingClientRect()));
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
                  <span style={{ fontSize: FS.caption, color: colors.textSecondary }}>
                    {translateUI(locationError === 'denied' ? 'locationDenied' : 'locationUnavailable', language)}
                  </span>
                  {locationError !== 'denied' && onRetryLocation && (
                    <Button theme={theme} variant="outline" size="sm" onClick={onRetryLocation}>
                      {translateUI('retryLocation', language)}
                    </Button>
                  )}
                </div>
              )}
              {showDepartureResults && departureDropdownPos && (
                <StationSearchDropdown
                  ref={departurePortalRef}
                  position={departureDropdownPos}
                  stations={filteredDepartureStations}
                  onSelect={handleDepartureSelect}
                  theme={theme}
                  language={language}
                  hasQuery={!!departureSearch}
                  onMouseDown={(e) => { e.preventDefault(); departureClickedRef.current = true; }}
                  onTouchStart={(e) => { e.stopPropagation(); departureClickedRef.current = true; }}
                  onTouchMove={(e) => e.stopPropagation()}
                />
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
              <label style={{ display: 'block', marginBottom: L.sp.xs, fontWeight: 'bold', color: colors.textSecondary, fontSize: FS.caption }}>
                {translateUI('arrivalStation', language)}
              </label>
              <div style={{ position: 'relative' }}>
                <TextField
                  theme={theme}
                  size="sm"
                  type="text"
                  value={arrivalSearch}
                  onChange={(e) => {
                    setArrivalSearch(e.target.value);
                    setShowArrivalResults(true);
                  }}
                  onFocus={(e) => {
                    focusedInputRef.current = e.currentTarget;
                    setArrivalDropdownPos(getFullWidthDropdownPosition(e.currentTarget.getBoundingClientRect()));
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
              
              {showArrivalResults && arrivalDropdownPos && (
                <StationSearchDropdown
                  ref={arrivalPortalRef}
                  position={arrivalDropdownPos}
                  stations={filteredArrivalStations}
                  onSelect={handleArrivalSelect}
                  theme={theme}
                  language={language}
                  hasQuery={!!arrivalSearch}
                  onMouseDown={(e) => { e.preventDefault(); arrivalClickedRef.current = true; }}
                  onTouchStart={(e) => { e.stopPropagation(); arrivalClickedRef.current = true; }}
                  onTouchMove={(e) => e.stopPropagation()}
                />
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
          {(onSetNearestDeparture || onShowTravelTimeChange || onShowTransferStationsOnlyChange || onAddWaypoint || onShowStationTimeLabelsChange) && (
            <div style={{
              // 出発駅・到着駅欄とこの行の間隔も、ボタン同士の間隔（下記gap）と
              // 揃える。片方だけ広げるとリズムが不揃いに見えるため統一する。
              marginTop: L.sp.md,
              display: 'flex',
              alignItems: 'center',
              // タッチ操作での押し間違いを防ぐため、隣接ボタン間はタップ領域が
              // 触れ合わない程度に離す（一般的なタッチターゲット間隔の目安 8px）
              gap: L.sp.md,
              flexWrap: 'wrap',
            }}>
              {onSetNearestDeparture && (
                <Button
                  theme={theme}
                  /*
                    「現在地から」の塗り分けは何度か迷走した経緯があるので
                    最終的な条件をここに書いておく:
                    - disabled: 位置情報（userLocation）が取れていない間。
                      押しても意味が無いため非活性にする（消すと隣のボタンの
                      位置が動くので、消さずに非活性で存在だけ示す）
                    - pressed(塗りつぶし): 出発駅が「今の現在地の最寄り駅」と
                      一致しているときだけ。「今だったら藤沢本町が最寄り駅で
                      それが出発駅にセットされていたら活性化」との指定どおり、
                      GPSが取れただけでは塗らない（＝押せるが色はまだ変わらない）。
                      実際に出発駅へ適用された状態を確認できる表示にする
                    isNearestDeparture の計算は RailwayMap.tsx 側（呼び出し元）
                    で行っている
                  */
                  variant="primary"
                  size="sm"
                  onClick={onSetNearestDeparture}
                  icon={<LocateFixed />}
                  disabled={!userLocation}
                  pressed={isNearestDeparture}
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
                  icon={<Clock />}
                >
                  {translateUI('showTravelTimes', language)}
                </Button>
              )}
              {onShowTransferStationsOnlyChange && (
                <Button
                  theme={theme}
                  variant="primary"
                  size="sm"
                  pressed={!!showTransferStationsOnly}
                  onClick={() => onShowTransferStationsOnlyChange(!showTransferStationsOnly)}
                  icon={<Waypoints />}
                >
                  {translateUI('showOnlyTransferStations', language)}
                </Button>
              )}
              {/*
                「経由駅を追加」は乗換駅のみ表示の右に詰めて置く。入力欄を
                開いている間は下に検索欄が出るのでボタン自体は隠す。
              */}
              {onAddWaypoint && !showWaypointInput && (
                <Button
                  theme={theme}
                  size="sm"
                  variant="outline"
                  icon={<MapPinPlus />}
                  onClick={() => {
                    setWaypointFieldWidth(departureRef.current?.getBoundingClientRect().width ?? null);
                    setShowWaypointInput(true);
                  }}
                >
                  {translateUI('addWaypoint', language)}
                </Button>
              )}
              {/*
                出発駅・到着駅の両方が決まって初めて経路上の時刻が意味を持つため、
                「経路が無いのに時刻を表示するかを聞かれる」状態を避け、
                両方揃ったときだけボタンを出す（そのときは既定でON。
                RailwayMap.tsx側で両方揃った瞬間にONへ戻す処理を入れている）。
              */}
              {onShowStationTimeLabelsChange && departure && arrival && (
                <Button
                  theme={theme}
                  variant="primary"
                  size="sm"
                  pressed={!!showStationTimeLabels}
                  onClick={() => onShowStationTimeLabelsChange(!showStationTimeLabels)}
                  icon={<Timer />}
                >
                  {translateUI('showStationTimeLabelsButton', language)}
                </Button>
              )}
            </div>
          )}

          {/*
            経由駅の設定。「経由駅の設定と、時刻の設定も出発駅とかの入力の下で
            できるように」という要望を受けて追加した。出発駅・到着駅の入力欄
            と同じ検索候補ロジック（filterStations）・同じ候補ドロップダウン
            （StationSearchDropdown、出発駅・到着駅と共通）を使う。
            以前はパネル内`position: absolute`の簡易版で、パネルのスクロール
            領域からはみ出す分が見切れていたため、出発駅・到着駅と同じ
            portal＋固定位置の仕組みに揃えた。
            「経由駅を追加」ボタン自体は上のボタン行（乗換駅のみ表示の右）に
            詰めて配置してあるので、ここには選択済みチップと検索欄（開いて
            いるときだけ）を出す。どちらも無ければ何も描画せず余白を使わない。
          */}
          {onAddWaypoint && ((waypoints ?? []).length > 0 || showWaypointInput) && (
            <div style={{ marginTop: L.sp.md }}>
              {/*
                入力欄を開いていないときは、選択済みチップだけを独立した行で表示。
                開いているときは、入力欄を出発駅欄と同じ横幅に絞った分だけ
                右側が空くため、チップは入力欄と同じ行に詰めて表示し
                空きスペースを使う（無ければ何も出ない）。
              */}
              {(waypoints ?? []).length > 0 && !showWaypointInput && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.xs }}>
                  {(waypoints ?? []).map((wp, index) => (
                    <RemovableTag
                      key={`${wp.name}-${index}`}
                      theme={theme}
                      size="sm"
                      label={`${index + 1}. ${translateStation(wp.name, language)}`}
                      onRemove={() => onRemoveWaypoint?.(index)}
                      removeLabel={translateUI('clearSelection', language)}
                    />
                  ))}
                </div>
              )}
              {showWaypointInput && (
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: L.sp.xs }}>
                  {/*
                    入力欄自体の横幅は出発駅欄と同じにする（以前はここだけ
                    `fullWidth`のままパネル全幅＝出発駅欄の2倍以上の横幅に
                    なっていた）。出発駅・到着駅は「flex: 1 1 0」の2カラムで
                    横幅が決まるが、経由駅は隣にもう1つ入力欄が無いぶん
                    flexだけでは合わせられないため、実測した出発駅欄の
                    横幅（waypointFieldWidth）をそのまま使う。
                    右側に空いた分は、入力を閉じる×ボタンと、既存の
                    経由駅チップ（折り返して表示）に詰めて使う。
                    候補ドロップダウンの横幅は出発駅・到着駅と同じ
                    `getFullWidthDropdownPosition`（同じ表示関数）を使い、
                    入力欄より狭くならないようにする。
                  */}
                  <div style={{
                    flex: waypointFieldWidth ? `0 0 ${waypointFieldWidth}px` : '1 1 0',
                    minWidth: '0',
                    position: 'relative',
                  }}>
                    <TextField
                      theme={theme}
                      size="sm"
                      type="text"
                      autoFocus
                      fullWidth
                      value={waypointSearch}
                      onChange={(e) => {
                        setWaypointSearch(e.target.value);
                        setShowWaypointResults(true);
                      }}
                      onFocus={(e) => {
                        focusedInputRef.current = e.currentTarget;
                        setWaypointDropdownPos(getFullWidthDropdownPosition(e.currentTarget.getBoundingClientRect()));
                        setShowWaypointResults(true);
                      }}
                      onBlur={() => {
                        focusedInputRef.current = null;
                        setShowWaypointResults(false);
                        setShowWaypointInput(false);
                        setWaypointSearch('');
                      }}
                      placeholder={translateUI('addWaypoint', language)}
                    />
                    {showWaypointResults && waypointDropdownPos && (
                      <StationSearchDropdown
                        position={waypointDropdownPos}
                        stations={filteredWaypointStations}
                        onSelect={handleWaypointSelect}
                        theme={theme}
                        language={language}
                        hasQuery={!!waypointSearch}
                        // input の blur より先に効かせて、候補クリックが確実に通るようにする
                        onMouseDown={(e) => e.preventDefault()}
                      />
                    )}
                  </div>
                  <IconButton
                    theme={theme}
                    size="sm"
                    // onBlurより先にクリックを通す（blurで閉じる処理と競合させない）
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setShowWaypointResults(false);
                      setShowWaypointInput(false);
                      setWaypointSearch('');
                    }}
                    label={translateUI('close', language)}
                    icon={<X size={14} />}
                    styleOverride={{ flexShrink: 0 }}
                  />
                  {(waypoints ?? []).map((wp, index) => (
                    // input の blur（クリックで閉じる処理）より先に mousedown を
                    // 止めないと、削除ボタンを押した瞬間に入力欄ごと閉じてしまう
                    <span key={`${wp.name}-${index}`} onMouseDown={(e) => e.preventDefault()}>
                      <RemovableTag
                        theme={theme}
                        size="sm"
                        label={`${index + 1}. ${translateStation(wp.name, language)}`}
                        onRemove={() => onRemoveWaypoint?.(index)}
                        removeLabel={translateUI('clearSelection', language)}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/*
            出発時刻の行。駅ツールチップ側にも同じ設定（timetableBaseTime を
            共有）があるが、経路を選ぶ前に時刻を決めたい操作にも対応できるよう
            駅選択パネルからも直接変更できるようにしている。
            timeMode（出発/到着）で、この時刻を「出発時刻」として使うか
            「到着時刻」として使うかを切り替えられる（ラベルも連動して変わる）。
            「時刻を表示」ボタンと同様、経路が無いと意味を持たないため
            出発駅・到着駅の両方が決まってから表示する。
          */}
          {SHOW_DEPARTURE_TIME_ROW && onDepartureTimeChange && departure && arrival && (
            <div style={{ marginTop: L.sp.sm }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: L.sp.xs,
                flexWrap: 'wrap',
              }}>
                <label style={{ fontSize: FS.caption, fontWeight: 'bold', color: colors.textSecondary, whiteSpace: 'nowrap' }}>
                  {translateUI(timeMode === 'arrival' ? 'arrivalTimeLabel' : 'departureTime', language)}
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
                {/*
                  出発/到着どちらの基準かは、時刻そのものの隣に置いて初めて
                  「この時刻が何を意味するか」が一目でわかる。以前は下の行に
                  分けていたが、現在時刻ボタンのすぐ右に詰めて1つの操作列に見せる。
                  行が折り返される狭い画面（スマホ・PWA）では、この2つが
                  親のflexWrapでバラバラの行に千切れると「現在時刻の右」が
                  保証できなくなるため、2つをまとめて1つのflexアイテムにし、
                  折り返す時は必ずセットのまま次の行へ落ちるようにする。
                  選択中はButton(variant="primary", pressed)で塗りつぶす
                  （このアプリの他のトグルと共通の「押されている＝塗り」の規約）。
                */}
                <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.xs, flexShrink: 0 }}>
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
                  {onTimeModeChange && (
                    <SegmentedControl
                      theme={theme}
                      size="sm"
                      variant="slide"
                      ariaLabel={translateUI('baseTime', language)}
                      value={timeMode}
                      onChange={onTimeModeChange}
                      options={[
                        { value: 'departure', label: translateUI('timeBasisDeparture', language) },
                        { value: 'arrival', label: translateUI('timeBasisArrival', language) },
                      ]}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default StationSelector;