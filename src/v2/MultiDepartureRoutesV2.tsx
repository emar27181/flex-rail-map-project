import React, { useMemo, useRef, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { Station } from '../data/yamanote';
import type { RouteFinder, RouteResult } from '../utils/routeFinder';
import { getAllStations } from '../utils/allStations';
import { stationReadings, normalizeToHiragana } from '../utils/stationReadings';
import { translateStation, translateUI } from '../utils/translation';
import type { Language } from '../utils/translation';
import RouteResultsV2 from './RouteResultsV2';

interface MultiDepartureRoutesV2Props {
  /** 全出発駅の共通ゴール */
  arrival: Station | null;
  extraDepartures: Station[];
  routeFinder: RouteFinder;
  onAddDeparture: (station: Station) => void;
  onRemoveDeparture: (name: string) => void;
  /** カードクリックでその駅をメインの出発駅に昇格させ、地図ハイライトへ反映する */
  onFocusDeparture: (station: Station) => void;
  language: Language;
}

/**
 * v2版: 複数の出発駅から共通の1つのゴール駅への経路をまとめて表示する。
 * 例: 藤沢・大磯・平塚・流山おおたかの森 それぞれから新橋への経路を並べて比較。
 * 経路探索アルゴリズムはv1と同じ routeFinder.findRoutes をそのまま使う。
 */
const MultiDepartureRoutesV2: React.FC<MultiDepartureRoutesV2Props> = ({
  arrival, extraDepartures, routeFinder, onAddDeparture, onRemoveDeparture, onFocusDeparture, language,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allStations = useMemo(() => getAllStations(), []);

  const filteredStations = useMemo(() => {
    if (!search) return [];
    const term = normalizeToHiragana(search.toLowerCase());
    const excluded = new Set([arrival?.name, ...extraDepartures.map(s => s.name)]);
    return allStations
      .filter(s => !excluded.has(s.name))
      .filter(s => {
        const reading = stationReadings[s.name] ?? '';
        const name = normalizeToHiragana(s.name.toLowerCase());
        const en = translateStation(s.name, 'english').toLowerCase();
        return reading.startsWith(term) || reading.includes(term) || name.includes(term) || en.includes(term);
      })
      .slice(0, 8);
  }, [search, allStations, extraDepartures, arrival]);

  const entries = useMemo(() => {
    if (!arrival) return [];
    return extraDepartures.map(station => ({
      station,
      route: routeFinder.findRoutes(station, arrival, 1)[0] as RouteResult | undefined,
    }));
  }, [extraDepartures, arrival, routeFinder]);

  const handleSelect = (station: Station) => {
    onAddDeparture(station);
    setSearch('');
    setShowResults(false);
  };

  if (!arrival) return null;

  return (
    <div style={{
      backgroundColor: 'var(--v2-color-surface)',
      border: '1px solid var(--v2-color-border)',
      borderRadius: 'var(--v2-radius-lg)',
      boxShadow: 'var(--v2-shadow-sm)',
      overflow: 'visible',
    }}>
      <button
        onClick={() => setIsOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--v2-space-3) var(--v2-space-4)',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--v2-font-family)', color: 'var(--v2-color-text)',
        }}
      >
        <span style={{ fontSize: 'var(--v2-font-size-base)', fontWeight: 'var(--v2-font-weight-bold)' }}>
          {translateUI('multiDepartureTitle', language)}
          {extraDepartures.length > 0 && (
            <span style={{ marginLeft: 'var(--v2-space-2)', fontSize: 'var(--v2-font-size-xs)', fontWeight: 'var(--v2-font-weight-regular)', color: 'var(--v2-color-text-secondary)' }}>
              {extraDepartures.length}
            </span>
          )}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div style={{ padding: '0 var(--v2-space-4) var(--v2-space-4)' }}>
          {extraDepartures.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--v2-space-1)', marginBottom: 'var(--v2-space-2)' }}>
              {extraDepartures.map(station => (
                <span key={station.name} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: 'var(--v2-font-size-xs)', padding: '2px var(--v2-space-2)',
                  borderRadius: 'var(--v2-radius-pill)',
                  backgroundColor: 'var(--v2-color-bg-elevated)', border: '1px solid var(--v2-color-border)',
                  color: 'var(--v2-color-text)',
                }}>
                  {translateStation(station.name, language)}
                  <button
                    onClick={() => onRemoveDeparture(station.name)}
                    aria-label={translateUI('removeDepartureLabel', language)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '14px', height: '14px', border: 'none', borderRadius: '50%',
                      backgroundColor: 'transparent', color: 'var(--v2-color-text-muted)', cursor: 'pointer', padding: 0,
                    }}
                  ><X size={11} /></button>
                </span>
              ))}
            </div>
          )}

          <div ref={wrapperRef} style={{ position: 'relative', marginBottom: entries.length > 0 ? 'var(--v2-space-2)' : 0 }}>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              placeholder={translateUI('addDepartureButton', language)}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: 'var(--v2-space-1) var(--v2-space-2)', fontSize: 'var(--v2-font-size-sm)',
                border: '1px solid var(--v2-color-border)', borderRadius: 'var(--v2-radius-sm)',
                backgroundColor: 'var(--v2-color-bg-elevated)', color: 'var(--v2-color-text)',
              }}
            />
            {showResults && filteredStations.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 30,
                marginTop: 'var(--v2-space-1)', maxHeight: '180px', overflowY: 'auto',
                backgroundColor: 'var(--v2-color-bg-elevated)', border: '1px solid var(--v2-color-border)',
                borderRadius: 'var(--v2-radius-md)', boxShadow: 'var(--v2-shadow-md)',
              }}>
                {filteredStations.map(station => (
                  <div
                    key={station.name}
                    onClick={() => handleSelect(station)}
                    style={{ padding: 'var(--v2-space-2) var(--v2-space-3)', fontSize: 'var(--v2-font-size-sm)', color: 'var(--v2-color-text)', cursor: 'pointer' }}
                  >{translateStation(station.name, language)}</div>
                ))}
              </div>
            )}
          </div>

          {entries.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-2)' }}>
              {entries.map(({ station, route }) => (
                route ? (
                  <RouteResultsV2
                    key={station.name}
                    routes={[route]}
                    selectedIndex={null}
                    onSelect={() => onFocusDeparture(station)}
                    language={language}
                  />
                ) : (
                  <div key={station.name} style={{
                    padding: 'var(--v2-space-2)', fontSize: 'var(--v2-font-size-sm)', color: 'var(--v2-color-text-secondary)',
                    border: '1px solid var(--v2-color-border)', borderRadius: 'var(--v2-radius-md)',
                  }}>{translateStation(station.name, language)}: {translateUI('noRoutesFound', language)}</div>
                )
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiDepartureRoutesV2;
