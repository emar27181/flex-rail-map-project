import React, { useState, useMemo, useRef, useEffect } from 'react';
import { routes } from '../data/routes';
import type { Station } from '../data/yamanote';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateStation, translateUI } from '../utils/translation';

interface StationSelectorProps {
  onDepartureChange: (station: Station | null) => void;
  onArrivalChange: (station: Station | null) => void;
  departure: Station | null;
  arrival: Station | null;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  language?: 'japanese' | 'english';
}

const StationSelector: React.FC<StationSelectorProps> = ({
  onDepartureChange,
  onArrivalChange,
  departure,
  arrival,
  isExpanded = true,
  onToggleExpanded,
  language = 'japanese'
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [departureSearch, setDepartureSearch] = useState('');
  const [arrivalSearch, setArrivalSearch] = useState('');
  const [showDepartureResults, setShowDepartureResults] = useState(false);
  const [showArrivalResults, setShowArrivalResults] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const departureRef = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLDivElement>(null);

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
    const searchTerm = departureSearch.toLowerCase();
    return allStations
      .filter(station => {
        const japaneseName = station.name.toLowerCase();
        const englishName = translateStation(station.name, 'english').toLowerCase();
        return japaneseName.includes(searchTerm) ||
               englishName.includes(searchTerm);
      })
      .slice(0, 10);
  }, [allStations, departureSearch, majorStations]);

  const filteredArrivalStations = useMemo(() => {
    if (!arrivalSearch) return majorStations;
    const searchTerm = arrivalSearch.toLowerCase();
    return allStations
      .filter(station => {
        const japaneseName = station.name.toLowerCase();
        const englishName = translateStation(station.name, 'english').toLowerCase();
        return japaneseName.includes(searchTerm) ||
               englishName.includes(searchTerm);
      })
      .slice(0, 10);
  }, [allStations, arrivalSearch, majorStations]);

  const handleDepartureSelect = (station: Station) => {
    onDepartureChange(station);
    setDepartureSearch(translateStation(station.name, language));
    setShowDepartureResults(false);
  };

  const handleArrivalSelect = (station: Station) => {
    onArrivalChange(station);
    setArrivalSearch(translateStation(station.name, language));
    setShowArrivalResults(false);
  };

  const clearDeparture = () => {
    onDepartureChange(null);
    setDepartureSearch('');
  };

  const clearArrival = () => {
    onArrivalChange(null);
    setArrivalSearch('');
  };


  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: `1px solid ${colors.border}`, borderRadius: '8px', backgroundColor: colors.surface }}>
      <div 
        onClick={onToggleExpanded}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: onToggleExpanded ? 'pointer' : 'default',
          marginBottom: isExpanded ? '15px' : '0'
        }}
      >
        <h3 style={{ margin: '0', color: colors.text }}>{translateUI('stationSelection', language)}</h3>
        {onToggleExpanded && (
          <span style={{
            fontSize: '18px',
            color: colors.textSecondary,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}>
            ▼
          </span>
        )}
      </div>
      
      {isExpanded && (
        <>
          <div style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            {/* 出発駅選択 */}
            <div ref={departureRef} style={{
              flex: '1',
              minWidth: '160px',
              maxWidth: '300px',
              position: 'relative'
            }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: colors.textSecondary }}>
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
                  onFocus={() => setShowDepartureResults(true)}
                  placeholder={departure ? translateStation(departure.name, language) : translateUI('stationPlaceholder', language)}
                  style={{
                    width: '100%',
                    padding: '8px 30px 8px 8px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '4px',
                    fontSize: '14px',
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
                        fontSize: '14px'
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


            {/* 到着駅選択 */}
            <div ref={arrivalRef} style={{
              flex: '1',
              minWidth: '160px',
              maxWidth: '300px',
              position: 'relative'
            }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: colors.textSecondary }}>
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
                  onFocus={() => setShowArrivalResults(true)}
                  placeholder={arrival ? translateStation(arrival.name, language) : translateUI('stationPlaceholder', language)}
                  style={{
                    width: '100%',
                    padding: '8px 30px 8px 8px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '4px',
                    fontSize: '14px',
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
                        borderBottom: index < filteredArrivalStations.length - 1 ? '1px solid #eee' : 'none',
                        fontSize: '14px'
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

          {/* 選択された駅の表示 */}
          {(departure || arrival) && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: theme === 'dark' ? '#2d4a2d' : '#e8f5e8', borderRadius: '4px' }}>
              <div style={{ fontSize: '14px', color: colors.text }}>
                {departure && <span><strong>{translateUI('departure', language)}:</strong> {translateStation(departure.name, language)}</span>}
                {departure && arrival && <span style={{ margin: '0 10px' }}>→</span>}
                {arrival && <span><strong>{translateUI('arrival', language)}:</strong> {translateStation(arrival.name, language)}</span>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StationSelector;