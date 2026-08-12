import React, { useMemo, useRef, useState, useEffect } from 'react';
import { ArrowLeftRight, MapPin, Flag, X } from 'lucide-react';
import type { Station } from '../data/yamanote';
import { getAllStations } from '../utils/allStations';
import { stationReadings, normalizeToHiragana } from '../utils/stationReadings';
import { findNearestStations } from '../utils/nearestStations';
import { translateStation, translateUI } from '../utils/translation';
import type { Language } from '../utils/translation';

interface StationPickerV2Props {
  departure: Station | null;
  arrival: Station | null;
  onDepartureChange: (station: Station | null) => void;
  onArrivalChange: (station: Station | null) => void;
  language: Language;
  /** 出発駅の入力候補を現在地周辺の駅にするための位置情報(未取得ならnull) */
  userLocation?: [number, number] | null;
}

function filterStations(allStations: Station[], search: string, emptySearchDefault: Station[] = []): Station[] {
  if (!search) return emptySearchDefault;
  const term = normalizeToHiragana(search.toLowerCase());
  return allStations
    .filter(s => {
      const reading = stationReadings[s.name] ?? '';
      const name = normalizeToHiragana(s.name.toLowerCase());
      const en = translateStation(s.name, 'english').toLowerCase();
      return reading.startsWith(term) || reading.includes(term) || name.includes(term) || en.includes(term);
    })
    .sort((a, b) => {
      const ra = stationReadings[a.name] ?? a.name;
      const rb = stationReadings[b.name] ?? b.name;
      const aStarts = ra.startsWith(term) ? 0 : 1;
      const bStarts = rb.startsWith(term) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return ra.localeCompare(rb, 'ja');
    })
    .slice(0, 8);
}

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  station: Station | null;
  onChange: (station: Station | null) => void;
  language: Language;
  allStations: Station[];
  emptySearchDefault?: Station[];
}

const StationField: React.FC<FieldProps> = ({ icon, label, station, onChange, language, allStations, emptySearchDefault }) => {
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(station ? translateStation(station.name, language) : '');
  }, [station, language]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(
    () => filterStations(allStations, search, emptySearchDefault),
    [allStations, search, emptySearchDefault]
  );

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <label style={{
        display: 'flex', alignItems: 'center', gap: 'var(--v2-space-1)',
        fontSize: 'var(--v2-font-size-xs)', fontWeight: 'var(--v2-font-weight-medium)',
        color: 'var(--v2-color-text-secondary)', marginBottom: 'var(--v2-space-1)',
      }}>{icon}{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          placeholder={translateUI('stationPlaceholder', language)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: 'var(--v2-space-2) var(--v2-space-3)',
            paddingRight: station ? '32px' : 'var(--v2-space-3)',
            fontSize: 'var(--v2-font-size-md)',
            border: '1.5px solid var(--v2-color-border)',
            borderRadius: 'var(--v2-radius-md)',
            backgroundColor: 'var(--v2-color-bg-elevated)',
            color: 'var(--v2-color-text)',
            outline: 'none',
          }}
        />
        {station && (
          <button
            onClick={() => { onChange(null); setSearch(''); }}
            aria-label="クリア"
            style={{
              position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--v2-color-text-muted)',
              display: 'flex', padding: '4px',
            }}
          ><X size={16} /></button>
        )}
      </div>
      {showResults && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 30,
          marginTop: 'var(--v2-space-1)', maxHeight: '220px', overflowY: 'auto',
          backgroundColor: 'var(--v2-color-bg-elevated)', border: '1px solid var(--v2-color-border)',
          borderRadius: 'var(--v2-radius-md)', boxShadow: 'var(--v2-shadow-md)',
        }}>
          {results.map(s => (
            <div
              key={s.name}
              onClick={() => { onChange(s); setShowResults(false); }}
              style={{
                padding: 'var(--v2-space-2) var(--v2-space-3)',
                fontSize: 'var(--v2-font-size-base)', color: 'var(--v2-color-text)', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--v2-color-surface-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >{translateStation(s.name, language)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const StationPickerV2: React.FC<StationPickerV2Props> = ({
  departure, arrival, onDepartureChange, onArrivalChange, language, userLocation,
}) => {
  const allStations = useMemo(() => getAllStations(), []);

  // 現在地周辺5駅(出発駅の入力候補用。位置情報が未取得なら候補なし)
  const nearbyStations = useMemo(() => {
    if (!userLocation) return undefined;
    return findNearestStations(allStations, userLocation[0], userLocation[1], 5);
  }, [allStations, userLocation]);

  const handleSwap = () => {
    onDepartureChange(arrival);
    onArrivalChange(departure);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 'var(--v2-space-2)',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
        <StationField
          icon={<MapPin size={13} />}
          label={translateUI('departureStation', language)}
          station={departure}
          onChange={onDepartureChange}
          language={language}
          allStations={allStations}
          emptySearchDefault={nearbyStations}
        />
        <StationField
          icon={<Flag size={13} />}
          label={translateUI('arrivalStation', language)}
          station={arrival}
          onChange={onArrivalChange}
          language={language}
          allStations={allStations}
        />
      </div>
      <button
        onClick={handleSwap}
        aria-label="出発駅と到着駅を入れ替え"
        title="入れ替え"
        style={{
          flexShrink: 0, width: '40px', height: '40px', marginBottom: 'var(--v2-space-1)',
          borderRadius: 'var(--v2-radius-md)', border: '1.5px solid var(--v2-color-border)',
          backgroundColor: 'var(--v2-color-bg-elevated)', color: 'var(--v2-color-text-secondary)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      ><ArrowLeftRight size={16} /></button>
    </div>
  );
};

export default StationPickerV2;
