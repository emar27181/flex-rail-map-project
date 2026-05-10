import React, { useState, useMemo, useRef, useEffect } from 'react';
import { routes } from '../data/routes';
import type { Station } from '../data/yamanote';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateStation, translateUI } from '../utils/translation';
import { stationReadings, normalizeToHiragana } from '../utils/stationReadings';

interface StationSelectorProps {
  onDepartureChange: (station: Station | null) => void;
  onArrivalChange: (station: Station | null) => void;
  departure: Station | null;
  arrival: Station | null;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  language?: 'japanese' | 'english';
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
    return Array.from(stationMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // 主要駅6選
  const majorStations = useMemo(() => {
    const majorStationNames = ['東京', '新宿', '渋谷', '池袋', '横浜', '新横浜'];
    return majorStationNames
      .map(name => allStations.find(station => station.name === name))
      .filter(station => station !== undefined) as Station[];
  }, [allStations]);

  const filteredDepartureStations = useMemo(() => {
    if (!departureSearch) return majorStations;
    const searchTerm = normalizeToHiragana(departureSearch.toLowerCase());
    return allStations
      .filter(station => {
        const japaneseName = station.name.toLowerCase();
        const reading = stationReadings[station.name] ?? '';
        const englishName = translateStation(station.name, 'english').toLowerCase();
        return japaneseName.includes(searchTerm) ||
               reading.includes(searchTerm) ||
               normalizeToHiragana(japaneseName).includes(searchTerm) ||
               englishName.includes(searchTerm);
      })
      .slice(0, 10);
  }, [allStations, departureSearch, majorStations]);

  const filteredArrivalStations = useMemo(() => {
    if (!arrivalSearch) return majorStations;
    const searchTerm = normalizeToHiragana(arrivalSearch.toLowerCase());
    return allStations
      .filter(station => {
        const japaneseName = station.name.toLowerCase();
        const reading = stationReadings[station.name] ?? '';
        const englishName = translateStation(station.name, 'english').toLowerCase();
        return japaneseName.includes(searchTerm) ||
               reading.includes(searchTerm) ||
               normalizeToHiragana(japaneseName).includes(searchTerm) ||
               englishName.includes(searchTerm);
      })
      .slice(0, 10);
  }, [allStations, arrivalSearch, majorStations]);

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
      style={{ marginBottom: '12px', padding: '10px', border: `1px solid ${colors.border}`, borderRadius: '8px', backgroundColor: colors.surface }}
    >
      <div 
        onClick={onToggleExpanded}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: onToggleExpanded ? 'pointer' : 'default',
          marginBottom: isExpanded ? '10px' : '0'
        }}
      >
        <h3 style={{ margin: '0', color: colors.text }}>{translateUI('stationSelection', language)}</h3>
        {onToggleExpanded && (
          <span style={{
            fontSize: '12px',
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
            gap: '8px',
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
              <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', color: colors.textSecondary, fontSize: '12px' }}>
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
                    setShowDepartureResults(true);
                    handleSearchFocus();
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!departureClickedRef.current) {
                        handleDepartureConfirm();
                      }
                      departureClickedRef.current = false;
                      setShowDepartureResults(false);
                    }, 150);
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
                    padding: '5px 24px 5px 7px',
                    border: `2px solid #4CAF50`,
                    borderRadius: '4px',
                    fontSize: '16px',
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
                      right: '5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: colors.textSecondary
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              {onSetNearestDeparture && !isSearching && (
                <button
                  onClick={onSetNearestDeparture}
                  style={{
                    marginTop: '4px',
                    border: `1px solid #4CAF50`,
                    borderRadius: '4px',
                    padding: '2px 7px',
                    fontSize: '11px',
                    backgroundColor: 'transparent',
                    color: '#4CAF50',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📍 {translateUI('currentLocationFrom', language)}
                </button>
              )}

              {showDepartureResults && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: colors.surfaceElevated,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  boxShadow: `0 2px 4px ${colors.shadow}`,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000
                }}>
                  {filteredDepartureStations.map((station, index) => (
                    <div
                      key={`${station.name}-${index}`}
                      onClick={() => handleDepartureSelect(station)}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderBottom: index < filteredDepartureStations.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                        fontSize: '14px',
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
                    <div style={{ padding: '8px 12px', color: colors.textSecondary, fontSize: '14px' }}>
                      {departureSearch ? translateUI('noStationFound', language) : translateUI('majorStationsHint', language)}
                    </div>
                  )}
                </div>
              )}
            </div>


            {/* 入れ替えボタン */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}>
              {/* ラベルと同じ高さのスペーサー */}
              <div style={{ marginBottom: '3px', height: '18px' }} />
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
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: colors.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
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
              <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', color: colors.textSecondary, fontSize: '12px' }}>
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
                    setShowArrivalResults(true);
                    handleSearchFocus();
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!arrivalClickedRef.current) {
                        handleArrivalConfirm();
                      }
                      arrivalClickedRef.current = false;
                      setShowArrivalResults(false);
                    }, 150);
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
                    padding: '5px 24px 5px 7px',
                    border: `2px solid #f44336`,
                    borderRadius: '4px',
                    fontSize: '16px',
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
                      right: '5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: colors.textSecondary
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              
              {showArrivalResults && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: colors.surfaceElevated,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  boxShadow: `0 2px 4px ${colors.shadow}`,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000
                }}>
                  {filteredArrivalStations.map((station, index) => (
                    <div
                      key={`${station.name}-${index}`}
                      onClick={() => handleArrivalSelect(station)}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderBottom: index < filteredArrivalStations.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                        fontSize: '14px',
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
                    <div style={{ padding: '8px 12px', color: colors.textSecondary, fontSize: '14px' }}>
                      {arrivalSearch ? translateUI('noStationFound', language) : translateUI('majorStationsHint', language)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 出発時刻（駅名入力中は非表示） */}
          {onDepartureTimeChange && !isSearching && (
            <div style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: colors.textSecondary, whiteSpace: 'nowrap' }}>
                {translateUI('departureTime', language)}
              </label>
              <input
                type="time"
                value={departureTime ?? ''}
                onChange={e => onDepartureTimeChange(e.target.value)}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  padding: '5px 8px',
                  fontSize: '16px',
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
                  padding: '5px 8px',
                  fontSize: '12px',
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