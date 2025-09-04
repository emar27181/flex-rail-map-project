import React, { useState, useMemo, useRef, useEffect } from 'react';
import { routes } from '../data/routes';
import type { Station } from '../data/yamanote';

interface StationSelectorProps {
  onDepartureChange: (station: Station | null) => void;
  onArrivalChange: (station: Station | null) => void;
  departure: Station | null;
  arrival: Station | null;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  onDepartureChange,
  onArrivalChange,
  departure,
  arrival,
  isExpanded = true,
  onToggleExpanded
}) => {
  const [departureSearch, setDepartureSearch] = useState('');
  const [arrivalSearch, setArrivalSearch] = useState('');
  const [showDepartureResults, setShowDepartureResults] = useState(false);
  const [showArrivalResults, setShowArrivalResults] = useState(false);
  
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
    return allStations
      .filter(station => 
        station.name.includes(departureSearch) ||
        station.name.toLowerCase().includes(departureSearch.toLowerCase())
      )
      .slice(0, 10);
  }, [allStations, departureSearch, majorStations]);

  const filteredArrivalStations = useMemo(() => {
    if (!arrivalSearch) return majorStations;
    return allStations
      .filter(station => 
        station.name.includes(arrivalSearch) ||
        station.name.toLowerCase().includes(arrivalSearch.toLowerCase())
      )
      .slice(0, 10);
  }, [allStations, arrivalSearch, majorStations]);

  const handleDepartureSelect = (station: Station) => {
    onDepartureChange(station);
    setDepartureSearch(station.name);
    setShowDepartureResults(false);
  };

  const handleArrivalSelect = (station: Station) => {
    onArrivalChange(station);
    setArrivalSearch(station.name);
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

  const swapStations = () => {
    const tempDeparture = departure;
    const tempSearch = departureSearch;
    
    onDepartureChange(arrival);
    setDepartureSearch(arrivalSearch);
    
    onArrivalChange(tempDeparture);
    setArrivalSearch(tempSearch);
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
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
        <h3 style={{ margin: '0', color: '#333' }}>出発駅・到着駅を選択</h3>
        {onToggleExpanded && (
          <span style={{
            fontSize: '18px',
            color: '#666',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}>
            ▼
          </span>
        )}
      </div>
      
      {isExpanded && (
        <>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* 出発駅選択 */}
            <div ref={departureRef} style={{ flex: '1', minWidth: '200px', maxWidth: '300px', position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                出発駅
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
                  placeholder="駅名を入力"
                  style={{
                    width: '100%',
                    padding: '8px 30px 8px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
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
                      color: '#666'
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
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                        borderBottom: index < filteredDepartureStations.length - 1 ? '1px solid #eee' : 'none',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      {station.name}
                    </div>
                  ))}
                  {filteredDepartureStations.length === 0 && (
                    <div style={{ padding: '8px 12px', color: '#666', fontSize: '14px' }}>
                      {departureSearch ? '該当する駅が見つかりません' : '主要駅: 東京、新宿、渋谷、池袋、横浜、新横浜'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 入れ替えボタン */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
              <button
                onClick={swapStations}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}
                disabled={!departure || !arrival}
              >
                ⇄ 入替
              </button>
            </div>

            {/* 到着駅選択 */}
            <div ref={arrivalRef} style={{ flex: '1', minWidth: '200px', maxWidth: '300px', position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                到着駅
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
                  placeholder="駅名を入力"
                  style={{
                    width: '100%',
                    padding: '8px 30px 8px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
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
                      color: '#666'
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
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      {station.name}
                    </div>
                  ))}
                  {filteredArrivalStations.length === 0 && (
                    <div style={{ padding: '8px 12px', color: '#666', fontSize: '14px' }}>
                      {arrivalSearch ? '該当する駅が見つかりません' : '主要駅: 東京、新宿、渋谷、池袋、横浜、新横浜'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 選択された駅の表示 */}
          {(departure || arrival) && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
              <div style={{ fontSize: '14px', color: '#333' }}>
                {departure && <span><strong>出発:</strong> {departure.name}</span>}
                {departure && arrival && <span style={{ margin: '0 10px' }}>→</span>}
                {arrival && <span><strong>到着:</strong> {arrival.name}</span>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StationSelector;