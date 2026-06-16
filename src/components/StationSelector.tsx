import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { routes } from '../data/routes';
import type { Station } from '../data/yamanote';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateStation, translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';
import { stationReadings, normalizeToHiragana } from '../utils/stationReadings';
import { FS } from '../constants/ui';

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
  const departureClickedRef = useRef(false);
  const arrivalClickedRef = useRef(false);
  const focusedInputRef = useRef<HTMLInputElement | null>(null);

  // 外側クリックで閉じる機能
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departureRef.current && !departureRef.current.contains(event.target as Node)) {
        setShowDepartureResults(false);
      }
      if (arrivalRef.current && !arrivalRef.current.contains(event.target as Node)) {
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

  // 主要駅6選
  const majorStations = useMemo(() => {
    const majorStationNames = ['東京', '新宿', '渋谷', '池袋', '横浜', '新横浜'];
    return majorStationNames
      .map(name => allStations.find(station => station.name === name))
      .filter(station => station !== undefined) as Station[];
  }, [allStations]);

  // 検索文字列でフィルタし、前方一致優先・読み順でソートして上位10件を返す
  function filterStations(search: string): Station[] {
    if (!search) return majorStations;
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
      .slice(0, 10);
  }

  const filteredDepartureStations = useMemo(
    () => filterStations(departureSearch),
    [allStations, departureSearch, majorStations]
  );

  const filteredArrivalStations = useMemo(
    () => filterStations(arrivalSearch),
    [allStations, arrivalSearch, majorStations]
  );

  const handleDepartureSelect = (station: Station) => {
    departureClickedRef.current = true;
    onDepartureChange(station);
    setDepartureSearch(translateStation(station.name, language));
    setShowDepartureResults(false);
  };

  const handleArrivalSelect = (station: Station) => {
    arrivalClickedRef.current = true;
    onArrivalChange(station);
    setArrivalSearch(translateStation(station.name, language));
    setShowArrivalResults(false);
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
        marginBottom: '8px',
        paddingTop: '8px',
        paddingBottom: isExpanded ? '8px' : '0',
        paddingLeft: '8px',
        paddingRight: '8px',
        height: isExpanded ? 'auto' : '36px',
        boxSizing: 'border-box',
        overflow: (showDepartureResults || showArrivalResults) ? 'visible' : 'hidden',
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
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
        <h3 style={{ margin: '0', color: colors.text, fontSize: FS.sectionTitle, fontWeight: 'bold' }}>{translateUI('stationSelection', language)}</h3>
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
            gap: '4px',
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
              <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', color: colors.textSecondary, fontSize: FS.label }}>
                {translateUI('departureStation', language)}
              </label>
              <div style={{ position: 'relative' }}>
                <input
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
                  style={{
                    width: '100%',
                    padding: '3px 20px 3px 6px',
                    border: `2px solid #4CAF50`,
                    borderRadius: '4px',
                    fontSize: FS.label,
                    boxSizing: 'border-box',
                    backgroundColor: colors.surfaceElevated,
                    color: colors.text
                  }}
                />
                {departure && (
                  <button
                    onClick={clearDeparture}
                    style={{
                      position: 'absolute',
                      right: '2px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: colors.textSecondary,
                      padding: '2px 4px',
                      lineHeight: '1',
                      minWidth: '20px',
                      minHeight: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              {onSetNearestDeparture && (
                <button
                  onClick={onSetNearestDeparture}
                  style={{
                    marginTop: '4px',
                    border: `1px solid #4CAF50`,
                    borderRadius: '4px',
                    padding: '2px 7px',
                    fontSize: FS.helper,
                    backgroundColor: 'transparent',
                    color: '#4CAF50',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📍 {translateUI('currentLocationFrom', language)}
                </button>
              )}

              {showDepartureResults && departureDropdownPos && createPortal(
                <div
                  onMouseDown={(e) => { e.preventDefault(); departureClickedRef.current = true; }}
                  onTouchStart={() => { departureClickedRef.current = true; }}
                  style={{
                  position: 'fixed',
                  top: departureDropdownPos.top,
                  left: departureDropdownPos.left,
                  width: departureDropdownPos.width,
                  backgroundColor: colors.surfaceElevated,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  boxShadow: `0 4px 12px ${colors.shadow}`,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 99999
                }}>
                  {filteredDepartureStations.map((station, index) => (
                    <div
                      key={`${station.name}-${index}`}
                      onClick={() => handleDepartureSelect(station)}
                      style={{
                        padding: '8px 12px',
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
                    <div style={{ padding: '8px 12px', color: colors.textSecondary, fontSize: FS.base }}>
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
              paddingBottom: '2px',
            }}>
              {/* ラベル (line-height≒18px) + margin-bottom 3px 分のオフセット */}
              <div style={{ height: '21px' }} />
              <button
                onClick={() => {
                  const prevDep = departure;
                  const prevArr = arrival;
                  onDepartureChange(prevArr);
                  onArrivalChange(prevDep);
                  setDepartureSearch(prevArr ? translateStation(prevArr.name, language) : '');
                  setArrivalSearch(prevDep ? translateStation(prevDep.name, language) : '');
                }}
                title={translateUI('swapStationsTitle', language)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  cursor: 'pointer',
                  fontSize: FS.label,
                  color: colors.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  padding: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.surface; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                ⇆
              </button>
            </div>

            {/* 到着駅選択 */}
            <div ref={arrivalRef} style={{
              flex: '1 1 0',
              minWidth: '0',
              position: 'relative'
            }}>
              <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', color: colors.textSecondary, fontSize: FS.label }}>
                {translateUI('arrivalStation', language)}
              </label>
              <div style={{ position: 'relative' }}>
                <input
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
                  style={{
                    width: '100%',
                    padding: '3px 20px 3px 6px',
                    border: `2px solid #f44336`,
                    borderRadius: '4px',
                    fontSize: FS.label,
                    boxSizing: 'border-box',
                    backgroundColor: colors.surfaceElevated,
                    color: colors.text
                  }}
                />
                {arrival && (
                  <button
                    onClick={clearArrival}
                    style={{
                      position: 'absolute',
                      right: '2px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: colors.textSecondary,
                      padding: '2px 4px',
                      lineHeight: '1',
                      minWidth: '20px',
                      minHeight: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              
              {showArrivalResults && arrivalDropdownPos && createPortal(
                <div
                  onMouseDown={(e) => { e.preventDefault(); arrivalClickedRef.current = true; }}
                  onTouchStart={() => { arrivalClickedRef.current = true; }}
                  style={{
                  position: 'fixed',
                  top: arrivalDropdownPos.top,
                  left: arrivalDropdownPos.left,
                  width: arrivalDropdownPos.width,
                  backgroundColor: colors.surfaceElevated,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  boxShadow: `0 4px 12px ${colors.shadow}`,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 99999
                }}>
                  {filteredArrivalStations.map((station, index) => (
                    <div
                      key={`${station.name}-${index}`}
                      onClick={() => handleArrivalSelect(station)}
                      style={{
                        padding: '8px 12px',
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
                    <div style={{ padding: '8px 12px', color: colors.textSecondary, fontSize: FS.base }}>
                      {arrivalSearch ? translateUI('noStationFound', language) : translateUI('majorStationsHint', language)}
                    </div>
                  )}
                </div>,
                document.body
              )}
            </div>
          </div>

          {/* 出発時刻 */}
          {onDepartureTimeChange && (
            <div style={{
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <label style={{ fontSize: FS.label, fontWeight: 'bold', color: colors.textSecondary, whiteSpace: 'nowrap' }}>
                {translateUI('departureTime', language)}
              </label>
              <input
                type="time"
                value={departureTime ?? ''}
                onChange={e => onDepartureTimeChange(e.target.value)}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  padding: '0 3px',
                  height: '22px',
                  boxSizing: 'border-box',
                  fontSize: FS.label,
                  backgroundColor: colors.surfaceElevated,
                  color: colors.text,
                  cursor: 'pointer',
                }}
              />
              <button
                onClick={() => {
                  const now = new Date();
                  const hh = String(now.getHours()).padStart(2, '0');
                  const mm = String(now.getMinutes()).padStart(2, '0');
                  onDepartureTimeChange(`${hh}:${mm}`);
                }}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  padding: '0 5px',
                  height: '22px',
                  boxSizing: 'border-box',
                  fontSize: FS.helper,
                  backgroundColor: colors.surface,
                  color: colors.textSecondary,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {translateUI('currentTime', language)}
              </button>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default StationSelector;