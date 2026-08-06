import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import DiagramMap from '../components/DiagramMap';
import { RouteFinder } from '../utils/routeFinder';
import type { RouteResult } from '../utils/routeFinder';
import type { RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';
import { useTheme } from '../contexts/ThemeContext';
import { translateUI } from '../utils/translation';
import type { Language } from '../utils/translation';
import { getAllStations } from '../utils/allStations';
import { DesignTokensProvider } from '../design/DesignTokensProvider';
import DesignDebugPanel from '../design/DesignDebugPanel';
import StationPickerV2 from './StationPickerV2';
import RouteResultsV2 from './RouteResultsV2';

interface RailwayMapV2Props {
  language: Language;
}

const MOBILE_BREAKPOINT = 768;

/**
 * v2 UI シェル。
 *
 * 経路探索アルゴリズム(RouteFinder)・地図描画(DiagramMap)はv1と完全に同一のものを
 * そのまま再利用し、外側のレイアウト・配色・タイポグラフィだけを刷新した実装。
 * デザイン値はすべて src/design/tokens.ts のCSS変数(--v2-*)経由で参照する。
 */
const RailwayMapV2Inner: React.FC<RailwayMapV2Props> = ({ language }) => {
  const { theme } = useTheme();
  const [departure, setDeparture] = useState<Station | null>(null);
  const [arrival, setArrival] = useState<Station | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const routeFinder = useMemo(() => new RouteFinder(), []);
  const allStations = useMemo(() => getAllStations(), []);

  const routeResults = useMemo<RouteResult[]>(() => {
    if (!departure || !arrival) return [];
    return routeFinder.findRoutes(departure, arrival, 5);
  }, [departure, arrival, routeFinder]);

  useEffect(() => setSelectedIndex(null), [departure, arrival]);

  const highlightedRouteKeys = useMemo<Set<RouteKey> | null>(() => {
    if (routeResults.length === 0) return null;
    const targets = selectedIndex !== null ? [routeResults[selectedIndex]] : routeResults;
    const keys = new Set<RouteKey>();
    targets.forEach(r => r.segments.forEach(seg => {
      if (seg.routeKey !== 'walking') keys.add(seg.routeKey as RouteKey);
    }));
    return keys.size > 0 ? keys : null;
  }, [routeResults, selectedIndex]);

  const handleMapStationClick = useCallback((name: string) => {
    const station = allStations.find(s => s.name === name);
    if (!station) return;
    if (!departure) setDeparture(station);
    else if (!arrival) setArrival(station);
    else { setDeparture(station); setArrival(null); }
  }, [allStations, departure, arrival]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: 'var(--v2-space-4)',
      padding: 'var(--v2-space-4)',
      backgroundColor: 'var(--v2-color-bg)',
      color: 'var(--v2-color-text)',
      fontFamily: 'var(--v2-font-family)',
      minHeight: '640px',
      boxSizing: 'border-box',
    }}>
      {/* サイドパネル: 駅選択 + 経路結果 */}
      <div style={{
        width: isMobile ? '100%' : '380px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--v2-space-4)',
      }}>
        <div style={{
          backgroundColor: 'var(--v2-color-surface)',
          border: '1px solid var(--v2-color-border)',
          borderRadius: 'var(--v2-radius-lg)',
          padding: 'var(--v2-space-4)',
          boxShadow: 'var(--v2-shadow-sm)',
        }}>
          <StationPickerV2
            departure={departure}
            arrival={arrival}
            onDepartureChange={setDeparture}
            onArrivalChange={setArrival}
            language={language}
          />
        </div>

        {departure && arrival && routeResults.length === 0 && (
          <div style={{
            padding: 'var(--v2-space-4)', textAlign: 'center',
            fontSize: 'var(--v2-font-size-sm)', color: 'var(--v2-color-text-secondary)',
            backgroundColor: 'var(--v2-color-surface)', borderRadius: 'var(--v2-radius-lg)',
            border: '1px solid var(--v2-color-border)',
          }}>{translateUI('noRoutesFound', language)}</div>
        )}

        {routeResults.length > 0 && (
          <div style={{ overflowY: isMobile ? 'visible' : 'auto', maxHeight: isMobile ? 'none' : '480px' }}>
            <RouteResultsV2
              routes={routeResults}
              selectedIndex={selectedIndex}
              onSelect={(i) => setSelectedIndex(prev => prev === i ? null : i)}
              language={language}
            />
          </div>
        )}
      </div>

      {/* 地図エリア */}
      <div style={{
        flex: 1,
        minWidth: 0,
        height: isMobile ? '60vh' : 'calc(100vh - 220px)',
        minHeight: '420px',
        borderRadius: 'var(--v2-radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--v2-color-border)',
        boxShadow: 'var(--v2-shadow-sm)',
        position: 'relative',
      }}>
        <DiagramMap
          departure={departure?.name ?? ''}
          arrival={arrival?.name ?? ''}
          highlightedRouteKeys={highlightedRouteKeys}
          theme={theme}
          language={language}
          showStationNames={true}
          onStationClick={handleMapStationClick}
        />
        {(departure || arrival) && (
          <button
            onClick={() => { setDeparture(null); setArrival(null); }}
            style={{
              position: 'absolute', top: 'var(--v2-space-3)', right: 'var(--v2-space-3)',
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: 'var(--v2-space-1) var(--v2-space-2)',
              fontSize: 'var(--v2-font-size-xs)',
              borderRadius: 'var(--v2-radius-md)',
              border: '1px solid var(--v2-color-border)',
              backgroundColor: 'var(--v2-color-bg-elevated)', color: 'var(--v2-color-text-secondary)',
              cursor: 'pointer', boxShadow: 'var(--v2-shadow-sm)',
              zIndex: 10,
            }}
          ><X size={12} /> クリア</button>
        )}
      </div>

      <DesignDebugPanel />
    </div>
  );
};

const RailwayMapV2: React.FC<RailwayMapV2Props> = (props) => (
  <DesignTokensProvider>
    <RailwayMapV2Inner {...props} />
  </DesignTokensProvider>
);

export default RailwayMapV2;
