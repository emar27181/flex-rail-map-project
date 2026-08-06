import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { routes } from '../data/routes';
import type { Station } from '../data/yamanote';
import type { RouteFinder } from '../utils/routeFinder';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateStation, translateUI } from '../utils/translation';
import type { Language } from '../utils/translation';
import { stationReadings, normalizeToHiragana } from '../utils/stationReadings';
import { FS } from '../constants/ui';
import RouteRecommendationItem from './ui/RouteRecommendationItem';

interface MultiDepartureRoutesProps {
  /** 全出発駅の共通ゴール */
  arrival: Station | null;
  /** メインの出発駅とは別に追加された出発駅のリスト */
  extraDepartures: Station[];
  routeFinder: RouteFinder;
  onAddDeparture: (station: Station) => void;
  onRemoveDeparture: (name: string) => void;
  /** 追加出発駅を「メインの出発駅」に昇格させたいときのコールバック（地図ハイライトに反映） */
  onFocusDeparture?: (station: Station) => void;
  language: Language;
}

/**
 * 複数の出発駅から共通の1つのゴール駅への経路をまとめて表示する。
 * 例: 藤沢・大磯・平塚・流山おおたかの森 それぞれから新橋への経路を並べて比較できる。
 */
const MultiDepartureRoutes: React.FC<MultiDepartureRoutesProps> = ({
  arrival,
  extraDepartures,
  routeFinder,
  onAddDeparture,
  onRemoveDeparture,
  onFocusDeparture,
  language,
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allStations = useMemo(() => {
    const map = new Map<string, Station>();
    Object.values(routes).forEach(list => (list as Station[]).forEach(s => {
      if (!map.has(s.name)) map.set(s.name, s);
    }));
    return Array.from(map.values());
  }, []);

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
      route: routeFinder.findRoutes(station, arrival, 1)[0] ?? null,
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
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: colors.surface,
      borderRadius: '4px',
      border: `1px solid ${colors.borderLight}`,
    }}>
      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>
        {translateUI('multiDepartureTitle', language)}
      </div>

      {extraDepartures.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
          {extraDepartures.map(station => (
            <span key={station.name} style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: FS.label, padding: '2px 6px', borderRadius: '12px',
              backgroundColor: colors.surfaceElevated, border: `1px solid ${colors.border}`,
              color: colors.text,
            }}>
              {translateStation(station.name, language)}
              <button
                onClick={() => onRemoveDeparture(station.name)}
                aria-label={translateUI('removeDepartureLabel', language)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '16px', height: '16px', border: 'none', borderRadius: '50%',
                  backgroundColor: 'transparent', color: colors.textSecondary, cursor: 'pointer', padding: 0,
                }}
              ><X size={12} /></button>
            </span>
          ))}
        </div>
      )}

      <div ref={wrapperRef} style={{ position: 'relative', marginBottom: entries.length > 0 ? '8px' : 0 }}>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          placeholder={translateUI('addDepartureButton', language)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '4px 6px', fontSize: FS.label,
            border: `1px solid ${colors.border}`, borderRadius: '4px',
            backgroundColor: colors.surfaceElevated, color: colors.text,
          }}
        />
        {showResults && filteredStations.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
            marginTop: '2px', maxHeight: '160px', overflowY: 'auto',
            backgroundColor: colors.surfaceElevated, border: `1px solid ${colors.border}`,
            borderRadius: '4px', boxShadow: `0 4px 12px ${colors.shadow}`,
          }}>
            {filteredStations.map(station => (
              <div
                key={station.name}
                onClick={() => handleSelect(station)}
                style={{ padding: '5px 8px', fontSize: FS.label, color: colors.text, cursor: 'pointer' }}
              >{translateStation(station.name, language)}</div>
            ))}
          </div>
        )}
      </div>

      {entries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {entries.map(({ station, route }) => (
            route ? (
              <RouteRecommendationItem
                key={station.name}
                route={route}
                index={0}
                isSelected={true}
                theme={theme}
                language={language}
                onToggle={() => onFocusDeparture?.(station)}
              />
            ) : (
              <div key={station.name} style={{
                padding: '6px', fontSize: FS.label, color: colors.textSecondary,
                border: `1px solid ${colors.borderLight}`, borderRadius: '5px',
              }}>
                {translateStation(station.name, language)}: {translateUI('noRoutesFound', language)}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDepartureRoutes;
