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
import IconButton from './ui/atoms/IconButton';
import TextField from './ui/atoms/TextField';
import { L } from './legend/legendStyles';

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
      marginBottom: L.sp['2xl'],
      padding: L.sp.lg,
      backgroundColor: colors.surface,
      borderRadius: L.r.md,
      border: `1px solid ${colors.borderLight}`,
    }}>
      <div style={{ fontSize: FS.sectionTitle, fontWeight: 'bold', marginBottom: L.sp.md, color: colors.text }}>
        {translateUI('multiDepartureTitle', language)}
      </div>

      {extraDepartures.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.xs, marginBottom: L.sp.md }}>
          {extraDepartures.map(station => (
            <span key={station.name} style={{
              display: 'inline-flex', alignItems: 'center', gap: L.sp.xs,
              fontSize: FS.label, padding: `${L.sp.xxs} ${L.sp.sm}`, borderRadius: L.r.pill,
              backgroundColor: colors.surfaceElevated, border: `1px solid ${colors.border}`,
              color: colors.text,
            }}>
              {translateStation(station.name, language)}
              <IconButton
                theme={theme}
                size="sm"
                onClick={() => onRemoveDeparture(station.name)}
                label={translateUI('removeDepartureLabel', language)}
                icon={<X size={12} />}
              />
            </span>
          ))}
        </div>
      )}

      <div ref={wrapperRef} style={{ position: 'relative', marginBottom: entries.length > 0 ? '8px' : 0 }}>
        <TextField
          theme={theme}
          size="sm"
          type="text"
          
          value={search}
          onChange={e => { setSearch(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          placeholder={translateUI('addDepartureButton', language)}
        />
        {showResults && filteredStations.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
            marginTop: L.sp.xxs, maxHeight: '160px', overflowY: 'auto',
            backgroundColor: colors.surfaceElevated, border: `1px solid ${colors.border}`,
            borderRadius: L.r.md, boxShadow: `0 4px 12px ${colors.shadow}`,
          }}>
            {filteredStations.map(station => (
              <div
                key={station.name}
                onClick={() => handleSelect(station)}
                style={{ padding: `${L.sp.xs} ${L.sp.md}`, fontSize: FS.label, color: colors.text, cursor: 'pointer' }}
              >{translateStation(station.name, language)}</div>
            ))}
          </div>
        )}
      </div>

      {entries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xs }}>
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
                padding: L.sp.sm, fontSize: FS.label, color: colors.textSecondary,
                border: `1px solid ${colors.borderLight}`, borderRadius: L.r.md,
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
