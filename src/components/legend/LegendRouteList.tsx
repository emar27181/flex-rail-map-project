import React, { useState, useEffect } from 'react';
import type { RouteKey } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation'
import type { Language } from '../../utils/translation';
import RouteToggleItem from '../ui/RouteToggleItem';
import type { StationStats } from '../../data/stationStats';
import MapConfigPanel from './MapConfigPanel';
import type { MapConfig } from './MapConfigPanel';
import { checkboxLabel } from './legendStyles';

type SortMode = 'name' | 'color' | 'default' | 'distance';

interface LegendRouteListProps {
  visibleRoutesData: Array<[string, any]>;
  visibleRoutes: Set<RouteKey>;
  routeOrder: RouteKey[];
  onRouteOrderChange: (order: RouteKey[]) => void;
  availableRoutes: Set<RouteKey>;
  highlightedRouteKeys?: Set<RouteKey> | null;
  routeColors: Record<RouteKey, string>;
  routeNames: Record<RouteKey, string>;
  showTransferStationsOnly: boolean;
  showExpressStationsOnly: boolean;
  showTravelTimes: boolean;
  showStationNames: boolean;
  showStationNumbers: boolean;
  showFurigana: boolean;
  showOsmTiles: boolean;
  theme: 'light' | 'dark';
  language: Language;
  onToggleRoute: (routeKey: RouteKey) => void;
  onSelectAllRoutes: () => void;
  onDeselectAllRoutes: () => void;
  showDimmedRoutes: boolean;
  onShowDimmedRoutesChange: (value: boolean) => void;
  onShowTransferStationsOnlyChange: (value: boolean) => void;
  onShowExpressStationsOnlyChange: (value: boolean) => void;
  onShowTravelTimesChange: (value: boolean) => void;
  onShowStationNamesChange: (value: boolean) => void;
  onShowStationNumbersChange: (value: boolean) => void;
  onShowFuriganaChange: (value: boolean) => void;
  onShowOsmTilesChange: (value: boolean) => void;
  adjustRouteColorForTheme: (color: string, theme: 'light' | 'dark') => string;
  viewCenter?: [number, number];
  showTrainDemo: boolean;
  onTrainDemoToggle: () => void;
  mapViewMode: 'realistic' | 'schematic' | 'bubble';
  onMapViewModeChange: (mode: 'realistic' | 'schematic' | 'bubble') => void;
  heatmapEnabled: boolean;
  heatmapParam: keyof StationStats;
  onHeatmapEnabledChange: (v: boolean) => void;
  onHeatmapParamChange: (k: keyof StationStats) => void;
  bubbleShape: 'circle' | 'square';
  onBubbleShapeChange: (shape: 'circle' | 'square') => void;
  bubbleMaxRadiusM: number;
  onBubbleMaxRadiusMChange: (v: number) => void;
  showLatLngGrid?: boolean;
  showStationTierBadges: boolean;
  onShowStationTierBadgesChange: (v: boolean) => void;
  showStationTooltip: boolean;
  onShowStationTooltipChange: (v: boolean) => void;
  showFullRouteStations: boolean;
  onShowFullRouteStationsChange: (v: boolean) => void;
  showRouteLine: boolean;
  onShowRouteLineChange: (v: boolean) => void;
  mapConfig: MapConfig;
  onImportConfig: (config: MapConfig) => void;
  stationLabelFontSize: number;
  onStationLabelFontSizeChange: (v: number) => void;
  stationIconScale: number;
  onStationIconScaleChange: (v: number) => void;
  stationSizeScale: number;
  onStationSizeScaleChange: (v: number) => void;
  routeLineWidth: number;
  onRouteLineWidthChange: (v: number) => void;
  travelTimeLabelMode: 'interval' | 'cumulative';
  onTravelTimeLabelModeChange: (v: 'interval' | 'cumulative') => void;
}

const LegendRouteList: React.FC<LegendRouteListProps> = ({
  visibleRoutesData,
  visibleRoutes,
  routeOrder,
  onRouteOrderChange,
  availableRoutes,
  highlightedRouteKeys,
  routeColors,
  routeNames,
  showTransferStationsOnly,
  showExpressStationsOnly,
  showTravelTimes,
  showStationNames,
  showStationNumbers,
  showFurigana,
  showOsmTiles,
  theme,
  language,
  onToggleRoute,
  onSelectAllRoutes,
  onDeselectAllRoutes,
  showDimmedRoutes,
  onShowDimmedRoutesChange,
  onShowTransferStationsOnlyChange,
  onShowExpressStationsOnlyChange,
  onShowTravelTimesChange,
  onShowStationNamesChange,
  onShowStationNumbersChange,
  onShowFuriganaChange,
  onShowOsmTilesChange,
  adjustRouteColorForTheme,
  viewCenter,
  showTrainDemo,
  onTrainDemoToggle,
  mapViewMode,
  onMapViewModeChange,
  heatmapEnabled,
  heatmapParam,
  onHeatmapEnabledChange,
  onHeatmapParamChange,
  bubbleShape,
  onBubbleShapeChange,
  bubbleMaxRadiusM,
  onBubbleMaxRadiusMChange,
  showStationTierBadges,
  onShowStationTierBadgesChange,
  showStationTooltip,
  onShowStationTooltipChange,
  showFullRouteStations,
  onShowFullRouteStationsChange,
  showRouteLine,
  onShowRouteLineChange,
  mapConfig,
  onImportConfig,
  stationLabelFontSize,
  onStationLabelFontSizeChange,
  stationIconScale,
  onStationIconScaleChange,
  stationSizeScale,
  onStationSizeScaleChange,
  routeLineWidth,
  onRouteLineWidthChange,
  travelTimeLabelMode,
  onTravelTimeLabelModeChange,
}) => {
  const colors = getThemeColors(theme);
  const [sortMode, setSortMode] = useState<SortMode>('distance');
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const ROUTE_LIST_LIMIT = 10;
  const [routeListExpanded, setRouteListExpanded] = useState(false);
  const [groupLabelOpen,  setGroupLabelOpen]  = useState(true);
  const [groupVizOpen,    setGroupVizOpen]    = useState(true);
  const [groupFilterOpen, setGroupFilterOpen] = useState(false);
  const [groupMapOpen,    setGroupMapOpen]    = useState(false);

  useEffect(() => { if (heatmapEnabled) setGroupVizOpen(true); }, [heatmapEnabled]);

  // HEX色をHue値(0-360)に変換
  const hexToHue = (hex: string): number => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return 0;
    const d = max - min;
    let h = 0;
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return h * 60;
  };

  // 路線の画面中心からの最近接駅距離（度単位の簡易距離）
  const routeMinDist = (stations: any[]): number => {
    if (!viewCenter || !stations?.length) return Infinity;
    const [clat, clng] = viewCenter;
    return Math.min(...stations.map((s: any) => {
      const dlat = s.lat - clat, dlng = s.lng - clng;
      return dlat * dlat + dlng * dlng;
    }));
  };

  const sortedVisibleRoutesData = [...visibleRoutesData].sort(([keyA, stationsA], [keyB, stationsB]) => {
    if (sortMode === 'name') {
      const nameA = routeNames[keyA as RouteKey] || '';
      const nameB = routeNames[keyB as RouteKey] || '';
      return nameA.localeCompare(nameB, language === 'japanese' ? 'ja' : 'en');
    }
    if (sortMode === 'color') {
      const colorA = routeColors[keyA as RouteKey] ?? '#888';
      const colorB = routeColors[keyB as RouteKey] ?? '#888';
      return hexToHue(colorA.padEnd(7, '0')) - hexToHue(colorB.padEnd(7, '0'));
    }
    if (sortMode === 'distance') {
      return routeMinDist(stationsA) - routeMinDist(stationsB);
    }
    return 0;
  });

  const sectionHeader = (label: string, isOpen: boolean, onToggle: () => void) => (
    <div
      onClick={onToggle}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 6px', cursor: 'pointer', borderRadius: '4px', background: colors.surfaceElevated, marginBottom: '2px' }}
    >
      <span style={{ fontSize: '11px', fontWeight: 'bold', color: colors.textSecondary }}>{label}</span>
      <span style={{ fontSize: '9px', color: colors.textSecondary, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
    </div>
  );

  return (
    <div style={{
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: colors.surface,
      borderRadius: '4px',
      border: `1px solid ${colors.borderLight}`
    }}>

      {/* ═══ セクション1: 表示路線切り替え ═══ */}
      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>
        {translateUI('routeDisplayToggle', language)}
      </div>

      {/* ソート選択 */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', color: colors.textSecondary, whiteSpace: 'nowrap' }}>
          {translateUI('sortLabel', language)}
        </span>
        {(['name', 'color', 'default', 'distance'] as SortMode[]).map(mode => {
          const label = mode === 'name'
            ? translateUI('sortAlpha', language)
            : mode === 'color'
              ? translateUI('sortColor', language)
              : mode === 'distance'
                ? translateUI('sortNearby', language)
                : translateUI('sortDefault', language);
          return (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              style={{
                padding: '2px 6px',
                fontSize: '10px',
                border: `1px solid ${sortMode === mode ? colors.primary : colors.borderLight}`,
                borderRadius: '3px',
                backgroundColor: sortMode === mode ? colors.primary : 'transparent',
                color: sortMode === mode ? '#fff' : colors.textSecondary,
                cursor: 'pointer',
              }}
            >{label}</button>
          );
        })}
      </div>

      {/* 全表示/全非表示 */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
        <button
          onClick={onSelectAllRoutes}
          style={{ flex: 1, padding: '4px 8px', fontSize: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
        >
          {translateUI('allShow', language)}
        </button>
        <button
          onClick={onDeselectAllRoutes}
          style={{ flex: 1, padding: '4px 8px', fontSize: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
        >
          {translateUI('allHide', language)}
        </button>
      </div>

      {(() => {
        const allRoutes: RouteKey[] = sortMode === 'default'
          ? [...routeOrder].filter(rk => visibleRoutesData.some(([k]) => k === rk))
          : sortedVisibleRoutesData.map(([k]) => k as RouteKey);
        const shown = routeListExpanded ? allRoutes : allRoutes.slice(0, ROUTE_LIST_LIMIT);
        const hidden = allRoutes.length - shown.length;
        return (
          <>
            {shown.map((routeKey) => {
              const isVisible = visibleRoutes.has(routeKey as RouteKey);
              const isInSelectedRoute = !!(highlightedRouteKeys && highlightedRouteKeys.has(routeKey as RouteKey));
              const isDragTarget = dragOverKey === routeKey;
              return (
                <div
                  key={routeKey}
                  onDragOver={e => { e.preventDefault(); setDragOverKey(routeKey); }}
                  onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverKey(null); }}
                  onDrop={e => {
                    e.preventDefault();
                    const from = e.dataTransfer.getData('text/plain') as RouteKey;
                    if (from === routeKey) { setDragOverKey(null); return; }
                    const next = [...routeOrder];
                    const fi = next.indexOf(from as RouteKey), ti = next.indexOf(routeKey);
                    if (fi !== -1 && ti !== -1) { next.splice(fi, 1); next.splice(ti, 0, from as RouteKey); onRouteOrderChange(next); }
                    setDragOverKey(null);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center',
                    outline: isDragTarget ? `2px dashed ${adjustRouteColorForTheme(routeColors[routeKey] ?? '#888', theme)}` : 'none',
                    borderRadius: '3px',
                    background: isDragTarget ? `${adjustRouteColorForTheme(routeColors[routeKey] ?? '#888', theme)}18` : 'transparent',
                  }}
                >
                  <span
                    draggable
                    onDragStart={e => { e.dataTransfer.setData('text/plain', routeKey); e.dataTransfer.effectAllowed = 'move'; }}
                    onDragEnd={() => setDragOverKey(null)}
                    style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1, flexShrink: 0, padding: '2px 3px 2px 0', cursor: 'grab', opacity: 0.5, userSelect: 'none' }}
                  >
                    ⠿
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <RouteToggleItem
                      routeKey={routeKey}
                      routeName={routeNames[routeKey as RouteKey]}
                      routeColor={routeColors[routeKey as RouteKey]}
                      isVisible={isVisible}
                      isInSelectedRoute={isInSelectedRoute}
                      theme={theme}
                      language={language}
                      onToggle={onToggleRoute}
                      adjustRouteColorForTheme={adjustRouteColorForTheme}
                    />
                  </div>
                </div>
              );
            })}
            {(hidden > 0 || routeListExpanded) && (
              <button
                onClick={() => setRouteListExpanded(v => !v)}
                style={{ width: '100%', marginTop: '4px', padding: '4px', fontSize: '10px', background: 'transparent', border: `1px solid ${colors.borderLight}`, borderRadius: '3px', color: colors.textSecondary, cursor: 'pointer' }}
              >
                {routeListExpanded ? '▲ 折りたたむ' : `▼ 他 ${hidden} 路線を表示`}
              </button>
            )}
          </>
        );
      })()}

      {/* ═══ セクション2: 表示設定 ═══ */}
      <div style={{ marginTop: '12px', marginBottom: '4px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: colors.text }}>
          {translateUI('displaySettings', language)}
        </div>
        <div>

            {/* ── 駅ラベル ── */}
            {sectionHeader(translateUI('settingsGroupLabel', language), groupLabelOpen, () => setGroupLabelOpen(v => !v))}
            {groupLabelOpen && (
              <div style={{ paddingLeft: '4px', marginBottom: '4px' }}>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showTransferStationsOnly} onChange={e => onShowTransferStationsOnlyChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('showOnlyTransferStations', language)}
                </label>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showTravelTimes} onChange={e => onShowTravelTimesChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('showTravelTimes', language)}
                </label>
                {showTravelTimes && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '22px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px', color: colors.textSecondary, whiteSpace: 'nowrap' }}>{translateUI('travelTimeLabelMode', language)}:</span>
                    {(['interval', 'cumulative'] as const).map(mode => (
                      <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px', color: colors.text, cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="travelTimeLabelMode"
                          checked={travelTimeLabelMode === mode}
                          onChange={() => onTravelTimeLabelModeChange(mode)}
                          style={{ cursor: 'pointer' }}
                        />
                        {mode === 'interval' ? translateUI('travelTimeLabelInterval', language) : `${translateUI('travelTimeLabelCumulative', language)}（実装中）`}
                      </label>
                    ))}
                  </div>
                )}
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showStationNumbers} onChange={e => onShowStationNumbersChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('showStationCodes', language)}
                </label>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showStationNames} onChange={e => onShowStationNamesChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('showStationNames', language)}
                </label>
                {language === 'japanese' && (
                  <label style={checkboxLabel(colors)}>
                    <input type="checkbox" checked={showFurigana} onChange={e => onShowFuriganaChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                    {translateUI('showFurigana', language)}
                  </label>
                )}
              </div>
            )}

            {/* ── データ可視化 ── */}
            {sectionHeader(translateUI('settingsGroupViz', language), groupVizOpen, () => setGroupVizOpen(v => !v))}
            {groupVizOpen && (
              <div style={{ paddingLeft: '4px', marginBottom: '4px' }}>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={heatmapEnabled} onChange={e => onHeatmapEnabledChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('stationHeatmap', language)}
                </label>
                {mapViewMode === 'realistic' && (
                  <label style={checkboxLabel(colors)}>
                    <input type="checkbox" checked={showTrainDemo} onChange={onTrainDemoToggle} style={{ marginRight: '6px', cursor: 'pointer' }} />
                    {translateUI('trainDemoLabel', language)}
                  </label>
                )}
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={mapViewMode === 'bubble'} onChange={e => onMapViewModeChange(e.target.checked ? 'bubble' : 'realistic')} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('bubbleMap', language)}
                </label>
                {mapViewMode === 'bubble' && (
                  <div style={{ marginLeft: '22px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      {(['circle', 'square'] as const).map(shape => (
                        <label key={shape} style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: colors.text, cursor: 'pointer' }}>
                          <input type="radio" name="bubbleShape" checked={bubbleShape === shape} onChange={() => onBubbleShapeChange(shape)} style={{ marginRight: '4px', cursor: 'pointer' }} />
                          {shape === 'circle' ? translateUI('bubbleCircle', language) : translateUI('bubbleSquare', language)}
                        </label>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', color: colors.textSecondary, whiteSpace: 'nowrap' }}>{translateUI('bubbleMaxRadius', language)}</span>
                      <input
                        type="range" min={500} max={50000} step={500}
                        value={bubbleMaxRadiusM}
                        onChange={e => onBubbleMaxRadiusMChange(Number(e.target.value))}
                        style={{ flex: 1, cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '10px', color: colors.text, minWidth: '40px', textAlign: 'right' }}>
                        {bubbleMaxRadiusM >= 1000 ? `${(bubbleMaxRadiusM / 1000).toFixed(1)}km` : `${bubbleMaxRadiusM}m`}
                      </span>
                    </div>
                  </div>
                )}
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={mapViewMode === 'schematic'} onChange={e => onMapViewModeChange(e.target.checked ? 'schematic' : 'realistic')} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('schematicMapLabel', language)}
                </label>
              </div>
            )}

            {/* ── 駅フィルター ── */}
            {sectionHeader(translateUI('settingsGroupFilter', language), groupFilterOpen, () => setGroupFilterOpen(v => !v))}
            {groupFilterOpen && (
              <div style={{ paddingLeft: '4px', marginBottom: '4px' }}>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showExpressStationsOnly} onChange={e => onShowExpressStationsOnlyChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('showOnlyExpressStations', language)}
                </label>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showFullRouteStations} onChange={e => onShowFullRouteStationsChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('showFullRouteStations', language)}
                </label>
              </div>
            )}

            {/* ── 地図表示 ── */}
            {sectionHeader(translateUI('settingsGroupMap', language), groupMapOpen, () => setGroupMapOpen(v => !v))}
            {groupMapOpen && (
              <div style={{ paddingLeft: '4px', marginBottom: '4px' }}>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showDimmedRoutes} onChange={e => onShowDimmedRoutesChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('showOutsideSegmentRoutes', language)}
                </label>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showRouteLine} onChange={e => onShowRouteLineChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('showRouteLines', language)}
                </label>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showStationTierBadges} onChange={e => onShowStationTierBadgesChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('transferHighlight', language)}
                </label>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showStationTooltip} onChange={e => onShowStationTooltipChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('stationTooltipLabel', language)}
                </label>
                <label style={checkboxLabel(colors)}>
                  <input type="checkbox" checked={showOsmTiles} onChange={e => onShowOsmTilesChange(e.target.checked)} style={{ marginRight: '6px', cursor: 'pointer' }} />
                  {translateUI('showMapTiles', language)}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: colors.text, padding: '2px 0', marginTop: '2px' }}>
                  <span style={{ flex: 1, color: colors.textSecondary }}>{translateUI('settingsIconSize', language)}</span>
                  <button onClick={() => onStationSizeScaleChange(Math.max(0.5, Math.round((stationSizeScale - 0.1) * 10) / 10))}
                    style={{ width: '18px', height: '18px', fontSize: '12px', cursor: 'pointer', border: `1px solid ${colors.border}`, borderRadius: '3px', background: colors.surfaceElevated, color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>−</button>
                  <span style={{ minWidth: '30px', textAlign: 'center', fontSize: '11px' }}>{stationSizeScale.toFixed(1)}x</span>
                  <button onClick={() => onStationSizeScaleChange(Math.min(2.0, Math.round((stationSizeScale + 0.1) * 10) / 10))}
                    style={{ width: '18px', height: '18px', fontSize: '12px', cursor: 'pointer', border: `1px solid ${colors.border}`, borderRadius: '3px', background: colors.surfaceElevated, color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: colors.text, padding: '2px 0' }}>
                  <span style={{ flex: 1, color: colors.textSecondary }}>{translateUI('routeLineWidth', language)}</span>
                  <button onClick={() => onRouteLineWidthChange(Math.max(1, routeLineWidth - 0.5))}
                    style={{ width: '18px', height: '18px', fontSize: '12px', cursor: 'pointer', border: `1px solid ${colors.border}`, borderRadius: '3px', background: colors.surfaceElevated, color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>−</button>
                  <span style={{ minWidth: '30px', textAlign: 'center', fontSize: '11px' }}>{routeLineWidth.toFixed(1)}px</span>
                  <button onClick={() => onRouteLineWidthChange(Math.min(8, routeLineWidth + 0.5))}
                    style={{ width: '18px', height: '18px', fontSize: '12px', cursor: 'pointer', border: `1px solid ${colors.border}`, borderRadius: '3px', background: colors.surfaceElevated, color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
                </div>
              </div>
            )}

        </div>
      </div>

      {/* ═══ セクション3: 設定の保存/読み込み ═══ */}
      <MapConfigPanel config={mapConfig} theme={theme} language={language} onImport={onImportConfig} />

    </div>
  );
};

export default LegendRouteList;
