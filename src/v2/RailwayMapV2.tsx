import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import DiagramMap, { DIAGRAM_ROUTE_KEYS } from '../components/DiagramMap';
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
import RouteLegendV2 from './RouteLegendV2';
import MultiDepartureRoutesV2 from './MultiDepartureRoutesV2';
import DisplaySettingsV2 from './DisplaySettingsV2';

interface RailwayMapV2Props {
  language: Language;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const MOBILE_BREAKPOINT = 768;

/**
 * v2 UI シェル。
 *
 * 経路探索アルゴリズム(RouteFinder)・地図描画(DiagramMap)はv1と完全に同一のものを
 * そのまま再利用し、外側のレイアウト・配色・タイポグラフィだけを刷新した実装。
 * デザイン値はすべて src/design/tokens.ts のCSS変数(--v2-*)経由で参照する。
 */
const RailwayMapV2Inner: React.FC<RailwayMapV2Props> = ({ language, onFullscreenChange }) => {
  const { theme } = useTheme();
  const [departure, setDeparture] = useState<Station | null>(null);
  const [arrival, setArrival] = useState<Station | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visibleRoutes, setVisibleRoutes] = useState<Set<RouteKey>>(() => new Set(DIAGRAM_ROUTE_KEYS));
  const [extraDepartures, setExtraDepartures] = useState<Station[]>([]);
  const [showStationNames, setShowStationNames] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 出発駅の入力候補に現在地周辺の駅を出すための一度きりの位置情報取得(継続監視は不要)
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => { /* 権限拒否・取得失敗時は主要駅にフォールバックするため何もしない */ },
      { maximumAge: 5 * 60 * 1000, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    onFullscreenChange?.(isFullscreen);
  }, [isFullscreen, onFullscreenChange]);

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

  const handleToggleRoute = useCallback((key: RouteKey) => {
    setVisibleRoutes(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);
  const handleShowAllRoutes = useCallback(() => setVisibleRoutes(new Set(DIAGRAM_ROUTE_KEYS)), []);
  const handleHideAllRoutes = useCallback(() => setVisibleRoutes(new Set()), []);

  const handleAddExtraDeparture = useCallback((station: Station) => {
    setExtraDepartures(prev => prev.some(s => s.name === station.name) ? prev : [...prev, station]);
  }, []);
  const handleRemoveExtraDeparture = useCallback((name: string) => {
    setExtraDepartures(prev => prev.filter(s => s.name !== name));
  }, []);

  const sidebar = (
    <>
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
          userLocation={userLocation}
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
        <div style={{ overflowY: (isMobile && !isFullscreen) ? 'visible' : 'auto', maxHeight: (isMobile && !isFullscreen) ? 'none' : '480px' }}>
          <RouteResultsV2
            routes={routeResults}
            selectedIndex={selectedIndex}
            onSelect={(i) => setSelectedIndex(prev => prev === i ? null : i)}
            language={language}
          />
        </div>
      )}

      <MultiDepartureRoutesV2
        arrival={arrival}
        extraDepartures={extraDepartures}
        routeFinder={routeFinder}
        onAddDeparture={handleAddExtraDeparture}
        onRemoveDeparture={handleRemoveExtraDeparture}
        onFocusDeparture={setDeparture}
        language={language}
      />

      <RouteLegendV2
        visibleRoutes={visibleRoutes}
        onToggleRoute={handleToggleRoute}
        onShowAll={handleShowAllRoutes}
        onHideAll={handleHideAllRoutes}
        language={language}
      />

      <DisplaySettingsV2
        showStationNames={showStationNames}
        onShowStationNamesChange={setShowStationNames}
        language={language}
      />
    </>
  );

  const map = (
    <>
      <DiagramMap
        departure={departure?.name ?? ''}
        arrival={arrival?.name ?? ''}
        visibleRoutes={visibleRoutes}
        highlightedRouteKeys={highlightedRouteKeys}
        theme={theme}
        language={language}
        showStationNames={showStationNames}
        onStationClick={handleMapStationClick}
        onToggleRoute={handleToggleRoute}
        onHideRoute={handleToggleRoute}
      />
      <button
        onClick={() => setIsFullscreen(v => !v)}
        title={isFullscreen ? translateUI('exitFullscreen', language) : translateUI('enterFullscreen', language)}
        aria-label={isFullscreen ? translateUI('exitFullscreen', language) : translateUI('enterFullscreen', language)}
        style={{
          position: 'absolute', top: 'var(--v2-space-3)', left: isFullscreen ? undefined : 'var(--v2-space-3)',
          right: isFullscreen ? 'var(--v2-space-3)' : undefined,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px',
          borderRadius: 'var(--v2-radius-md)',
          border: '1px solid var(--v2-color-border)',
          backgroundColor: 'var(--v2-color-bg-elevated)', color: 'var(--v2-color-text-secondary)',
          cursor: 'pointer', boxShadow: 'var(--v2-shadow-sm)',
          zIndex: 10,
        }}
      >{isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
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
    </>
  );

  if (isFullscreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        backgroundColor: 'var(--v2-color-bg)', color: 'var(--v2-color-text)', fontFamily: 'var(--v2-font-family)',
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {map}
        </div>
        <div style={{
          position: 'absolute', top: 'var(--v2-space-3)', left: 'var(--v2-space-3)',
          width: '360px', maxWidth: 'calc(100% - 24px)', maxHeight: 'calc(100% - 24px)',
          overflowY: 'auto', zIndex: 20,
          display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)',
        }}>
          {sidebar}
        </div>
        <DesignDebugPanel />
      </div>
    );
  }

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
        {sidebar}
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
        {map}
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
