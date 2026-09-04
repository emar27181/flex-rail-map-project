import React, { useState, useEffect, useMemo } from 'react';
import type { RouteKey } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation'
import type { Language } from '../../utils/translation';
import RouteToggleItem from '../ui/RouteToggleItem';
import type { StationStats } from '../../data/stationStats';
import MapConfigPanel from './MapConfigPanel';
import type { MapConfig } from './MapConfigPanel';
import Checkbox from '../ui/atoms/Checkbox';
import { FS, TARGET, SEMANTIC, MAP_LABEL, ROUTE_LINE } from '../../constants/ui';
import RouteSwitchBoard from './RouteSwitchBoard';
import Button from '../ui/atoms/Button';
import SegmentedControl from '../ui/molecules/SegmentedControl';
import Stepper from '../ui/molecules/Stepper';
import { ALERT_MINUTE_OPTIONS } from '../../utils/arrivalAlert';
import Select from '../ui/atoms/Select';
import Radio from '../ui/atoms/Radio';
import Slider from '../ui/atoms/Slider';
import { L } from './legendStyles';

type SortMode = 'name' | 'color' | 'default' | 'distance';

/** 路線切り替えの表示方式の保存キー */
const ROUTE_UI_MODE_KEY = 'routeSwitchUiMode';

interface LegendRouteListProps {
  visibleRoutesData: Array<[string, any]>;
  visibleRoutes: Set<RouteKey>;
  routeOrder: RouteKey[];
  onRouteOrderChange: (order: RouteKey[]) => void;
  availableRoutes: Set<RouteKey>;
  highlightedRouteKeys?: Set<RouteKey> | null;
  stationRouteKeys?: Set<RouteKey>;
  routeColors: Record<RouteKey, string>;
  routeNames: Record<RouteKey, string>;
  showTransferStationsOnly: boolean;
  showExpressStationsOnly: boolean;
  showTravelTimes: boolean;
  showStationNames: boolean;
  showStationNumbers: boolean;
  showTrainStatusPanel: boolean;
  autoSetDepartureFromLocation: boolean;
  alwaysVisibleStationsEnabled: boolean;
  alwaysVisibleMinRoutes: number;
  arrivalAlertEnabled: boolean;
  arrivalAlertMinutes: number;
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
  onAlwaysVisibleStationsEnabledChange: (value: boolean) => void;
  onAlwaysVisibleMinRoutesChange: (value: number) => void;
  onArrivalAlertEnabledChange: (value: boolean) => void;
  onArrivalAlertMinutesChange: (value: number) => void;
  onShowTrainStatusPanelChange: (value: boolean) => void;
  onAutoSetDepartureFromLocationChange: (value: boolean) => void;
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
  showEstimatedData: boolean;
  onShowEstimatedDataChange: (v: boolean) => void;
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
  stationRouteKeys,
  routeColors,
  routeNames,
  showTransferStationsOnly,
  showExpressStationsOnly,
  showTravelTimes,
  showStationNames,
  showStationNumbers,
  showTrainStatusPanel,
  autoSetDepartureFromLocation,
  alwaysVisibleStationsEnabled,
  alwaysVisibleMinRoutes,
  arrivalAlertEnabled,
  arrivalAlertMinutes,
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
  onAlwaysVisibleStationsEnabledChange,
  onAlwaysVisibleMinRoutesChange,
  onArrivalAlertEnabledChange,
  onArrivalAlertMinutesChange,
  onShowTrainStatusPanelChange,
  onAutoSetDepartureFromLocationChange,
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
  showEstimatedData,
  onShowEstimatedDataChange,
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
  /**
   * 路線切り替えの表示方式。
   * 従来の一覧（classic）は並べ替え・ドラッグ順の変更ができるので残し、
   * 読みやすさを優先したボード表示（board）を既定にする。
   * 選んだ方式は次回も同じで開けるよう保存する。
   */
  const [routeUiMode, setRouteUiMode] = useState<'board' | 'classic'>(() => {
    if (typeof window === 'undefined') return 'board';
    try {
      return window.localStorage.getItem(ROUTE_UI_MODE_KEY) === 'classic' ? 'classic' : 'board';
    } catch {
      // プライベートブラウズなどで localStorage が使えなくても既定で動く
      return 'board';
    }
  });
  const changeRouteUiMode = (mode: 'board' | 'classic') => {
    setRouteUiMode(mode);
    try { window.localStorage.setItem(ROUTE_UI_MODE_KEY, mode); } catch { /* 保存できなくても表示は変わる */ }
  };
  const [sortMode, setSortMode] = useState<SortMode>('distance');
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [touchDragKey, setTouchDragKey] = useState<RouteKey | null>(null);
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

  /**
   * ボード表示に渡す並び順。
   * 全国490路線を名前順にすると「IGRいわて銀河鉄道」から始まって
   * 手元の路線に届かないので、画面中心から近い順で渡す。
   */
  const boardRouteKeys = useMemo(
    () => [...visibleRoutesData]
      .sort(([, a], [, b]) => routeMinDist(a) - routeMinDist(b))
      .map(([k]) => k as RouteKey),
    [visibleRoutesData, viewCenter],
  );

  const sectionHeader = (label: string, isOpen: boolean, onToggle: () => void) => (
    <div
      onClick={onToggle}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${L.sp.xs} ${L.sp.sm}`, cursor: 'pointer', borderRadius: L.r.control, background: colors.surfaceElevated, marginBottom: L.sp.xxs }}
    >
      <span style={{ fontSize: FS.caption, fontWeight: 'bold', color: colors.textSecondary }}>{label}</span>
      <span style={{ fontSize: FS.caption, color: colors.textSecondary, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
    </div>
  );

  return (
    <div style={{
      marginBottom: L.sp['2xl'],
      padding: L.sp.lg,
      backgroundColor: colors.surface,
      borderRadius: L.r.control,
      border: `1px solid ${colors.borderLight}`
    }}>

      {/* ═══ セクション1: 表示路線切り替え ═══ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: L.sp.md,
        marginBottom: L.sp.md,
      }}>
        <div style={{ fontSize: FS.title, fontWeight: 'bold', color: colors.text }}>
          {translateUI('routeDisplayToggle', language)}
        </div>
        {/* 表示方式の切り替え。従来の一覧も選べる形で残している */}
        <SegmentedControl
          theme={theme}
          value={routeUiMode}
          onChange={changeRouteUiMode}
          ariaLabel={translateUI('routeDisplayToggle', language)}
          options={[
            { value: 'board' as const, label: translateUI('routeViewBoard', language) },
            { value: 'classic' as const, label: translateUI('routeViewClassic', language) },
          ]}
        />
      </div>

      {routeUiMode === 'board' && (
        <RouteSwitchBoard
          routeKeys={boardRouteKeys}
          visibleRoutes={visibleRoutes}
          highlightedRouteKeys={highlightedRouteKeys}
          stationRouteKeys={stationRouteKeys}
          routeColors={routeColors}
          routeNames={routeNames}
          theme={theme}
          language={language}
          onToggleRoute={onToggleRoute}
          onSelectAllRoutes={onSelectAllRoutes}
          onDeselectAllRoutes={onDeselectAllRoutes}
          adjustRouteColorForTheme={adjustRouteColorForTheme}
        />
      )}

      {routeUiMode === 'classic' && (<>
      {/* ソート選択 */}
      <div style={{ display: 'flex', gap: L.sp.xs, marginBottom: L.sp.sm, alignItems: 'center' }}>
        <span style={{ fontSize: FS.caption, color: colors.textSecondary, whiteSpace: 'nowrap' }}>
          {translateUI('sortLabel', language)}
        </span>
        <SegmentedControl
          theme={theme}
          value={sortMode}
          onChange={setSortMode}
          ariaLabel={translateUI('sortLabel', language)}
          options={[
            { value: 'name' as SortMode, label: translateUI('sortAlpha', language) },
            { value: 'color' as SortMode, label: translateUI('sortColor', language) },
            { value: 'default' as SortMode, label: translateUI('sortDefault', language) },
            { value: 'distance' as SortMode, label: translateUI('sortNearby', language) },
          ]}
        />
      </div>

      {/* 全表示/全非表示 */}
      <div style={{ display: 'flex', gap: L.sp.xs, marginBottom: L.sp.sm }}>
        <Button theme={theme} variant="positive" size="sm" onClick={onSelectAllRoutes} styleOverride={{ flex: 1 }}>
          {translateUI('allShow', language)}
        </Button>
        <Button theme={theme} variant="danger" size="sm" onClick={onDeselectAllRoutes} styleOverride={{ flex: 1 }}>
          {translateUI('allHide', language)}
        </Button>
      </div>

      {(() => {
        let baseRoutes: RouteKey[] = sortMode === 'default'
          ? [...routeOrder].filter(rk => visibleRoutesData.some(([k]) => k === rk))
          : sortedVisibleRoutesData.map(([k]) => k as RouteKey);
        // 出発/到着駅を通る路線を前にグループ化
        let dividerIndex = -1;
        if (stationRouteKeys && stationRouteKeys.size > 0) {
          const inStation = baseRoutes.filter(rk => stationRouteKeys.has(rk));
          const notInStation = baseRoutes.filter(rk => !stationRouteKeys.has(rk));
          if (inStation.length > 0 && notInStation.length > 0) {
            baseRoutes = [...inStation, ...notInStation];
            dividerIndex = inStation.length;
          }
        }
        const allRoutes = baseRoutes;
        const shown = routeListExpanded ? allRoutes : allRoutes.slice(0, ROUTE_LIST_LIMIT);
        const hidden = allRoutes.length - shown.length;
        return (
          <>
            {shown.map((routeKey, listIdx) => {
              const isVisible = visibleRoutes.has(routeKey as RouteKey);
              const isInSelectedRoute = !!(highlightedRouteKeys && highlightedRouteKeys.has(routeKey as RouteKey));
              const isDragTarget = dragOverKey === routeKey;
              const showDivider = dividerIndex > 0 && listIdx === dividerIndex;
              return (
                <React.Fragment key={routeKey}>
                {showDivider && (
                  <div style={{ margin: `${L.sp.xs} 0 ${L.sp.xxs}` }}>
                    <div style={{ fontSize: FS.caption, color: colors.textSecondary, whiteSpace: 'nowrap', marginBottom: L.sp.xxs }}>
                      ↑ この駅を通る路線
                    </div>
                    <div style={{ borderTop: `1px dashed ${colors.borderLight}` }} />
                  </div>
                )}
                <div
                  data-routekey={routeKey}
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
                    borderRadius: L.r.control,
                    background: isDragTarget ? `${adjustRouteColorForTheme(routeColors[routeKey] ?? '#888', theme)}18` : 'transparent',
                    userSelect: 'none',
                  }}
                >
                  <span
                    draggable
                    onDragStart={e => { e.dataTransfer.setData('text/plain', routeKey); e.dataTransfer.effectAllowed = 'move'; }}
                    onDragEnd={() => setDragOverKey(null)}
                    onTouchStart={e => {
                      e.stopPropagation();
                      setTouchDragKey(routeKey as RouteKey);
                      setDragOverKey(routeKey);
                    }}
                    onTouchMove={e => {
                      if (!touchDragKey) return;
                      e.preventDefault();
                      const touch = e.touches[0];
                      const el = document.elementFromPoint(touch.clientX, touch.clientY);
                      const row = el?.closest('[data-routekey]');
                      const target = row?.getAttribute('data-routekey');
                      if (target) setDragOverKey(target);
                    }}
                    onTouchEnd={() => {
                      if (touchDragKey && dragOverKey && touchDragKey !== dragOverKey) {
                        const next = [...routeOrder];
                        const fi = next.indexOf(touchDragKey), ti = next.indexOf(dragOverKey as RouteKey);
                        if (fi !== -1 && ti !== -1) { next.splice(fi, 1); next.splice(ti, 0, touchDragKey); onRouteOrderChange(next); }
                      }
                      setTouchDragKey(null);
                      setDragOverKey(null);
                    }}
                    style={{ fontSize: FS.body, color: colors.textSecondary, lineHeight: 1, flexShrink: 0, padding: `${L.sp.xxs} ${L.sp.xs} ${L.sp.xxs} 0`, cursor: 'grab', opacity: 0.5, userSelect: 'none', touchAction: 'none', WebkitUserSelect: 'none' }}
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
                </React.Fragment>
              );
            })}
            {(hidden > 0 || routeListExpanded) && (
              <Button
                theme={theme}
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setRouteListExpanded(v => !v)}
                styleOverride={{ marginTop: L.sp.xs }}
              >
                {routeListExpanded
                  ? translateUI('collapseList', language)
                  : translateUI('showMoreRoutes', language, { count: String(hidden) })}
              </Button>
            )}
          </>
        );
      })()}

      </>)}

      {/* ═══ セクション2: 表示設定 ═══ */}
      <div style={{ marginTop: L.sp.xl, marginBottom: L.sp.xs }}>
        <div style={{ fontSize: FS.title, fontWeight: 'bold', marginBottom: L.sp.md, color: colors.text }}>
          {translateUI('displaySettings', language)}
        </div>
        <div>

            {/* ── 駅ラベル ── */}
            {sectionHeader(translateUI('settingsGroupLabel', language), groupLabelOpen, () => setGroupLabelOpen(v => !v))}
            {groupLabelOpen && (
              <div style={{ paddingLeft: L.sp.xs, marginBottom: L.sp.xs }}>
                <Checkbox theme={theme} checked={showTransferStationsOnly} onChange={onShowTransferStationsOnlyChange}>
                  {translateUI('showOnlyTransferStations', language)}
                </Checkbox>
                <Checkbox theme={theme} checked={showTravelTimes} onChange={onShowTravelTimesChange}>
                  {translateUI('showTravelTimes', language)}
                </Checkbox>
                {showTravelTimes && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.sm, paddingLeft: L.sp['4xl'], marginBottom: L.sp.xxs }}>
                    <span style={{ fontSize: FS.caption, color: colors.textSecondary, whiteSpace: 'nowrap' }}>{translateUI('travelTimeLabelMode', language)}:</span>
                    {(['interval', 'cumulative'] as const).map(mode => (
                      <Radio
                          theme={theme}
                          size="sm"
                          name="travelTimeLabelMode"
                          checked={travelTimeLabelMode === mode}
                          onChange={() => onTravelTimeLabelModeChange(mode)}
                        >
                          {mode === 'interval' ? translateUI('travelTimeLabelInterval', language) : `${translateUI('travelTimeLabelCumulative', language)}（実装中）`}
                        </Radio>
                    ))}
                  </div>
                )}
                <Checkbox theme={theme} checked={showStationNumbers} onChange={onShowStationNumbersChange}>
                  {translateUI('showStationCodes', language)}
                </Checkbox>
                <Checkbox theme={theme} checked={autoSetDepartureFromLocation} onChange={onAutoSetDepartureFromLocationChange}>
                  {translateUI('useLocationFeatures', language)}
                </Checkbox>                <Checkbox theme={theme} checked={showTrainStatusPanel} onChange={onShowTrainStatusPanelChange}>
                  {translateUI('showTrainStatusPanel', language)}
                </Checkbox>
                {/* 降車駅アラーム。時刻表ではなく現在地から残り時間を出して知らせる */}
                <Checkbox theme={theme} checked={arrivalAlertEnabled} onChange={onArrivalAlertEnabledChange}>
                  {translateUI('arrivalAlert', language)}
                </Checkbox>
                {arrivalAlertEnabled && (
                  <div style={{ paddingLeft: L.sp['4xl'], paddingBottom: L.sp.xs }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.sm }}>
                      <span style={{ fontSize: FS.caption, color: colors.textSecondary }}>
                        {translateUI('arrivalAlertTiming', language)}
                      </span>
                      <Select
                        theme={theme}
                        size="sm"
                        value={arrivalAlertMinutes}
                        onChange={e => onArrivalAlertMinutesChange(Number(e.target.value))}
                      >
                        {ALERT_MINUTE_OPTIONS.map(n => (
                          <option key={n} value={n}>
                            {translateUI('arrivalAlertMinutesOption', language, { count: n })}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div style={{ fontSize: FS.caption, color: colors.textSecondary, marginTop: L.sp.xs, lineHeight: 1.5 }}>
                      {translateUI('arrivalAlertNote', language)}
                    </div>
                  </div>
                )}
                <Checkbox theme={theme} checked={showStationNames} onChange={onShowStationNamesChange}>
                  {translateUI('showStationNames', language)}
                </Checkbox>
                {/* 主要駅の常時表示。しきい値（何路線以上か）も変えられるようにする */}
                <Checkbox theme={theme} checked={alwaysVisibleStationsEnabled} onChange={onAlwaysVisibleStationsEnabledChange}>
                  {translateUI('alwaysShowMajorStations', language)}
                </Checkbox>
                {alwaysVisibleStationsEnabled && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.sm, padding: `${L.sp.xxs} 0 ${L.sp.xs} ${L.sp['4xl']}` }}>
                    <span style={{ fontSize: FS.caption, color: colors.textSecondary }}>
                      {translateUI('minRouteCount', language)}
                    </span>
                    <Select
                        theme={theme}
                        size="sm"
                        value={alwaysVisibleMinRoutes}
                      onChange={e => onAlwaysVisibleMinRoutesChange(Number(e.target.value))}
                      >
                      {[2, 3, 4, 5, 6, 7, 8, 10].map(n => (
                        <option key={n} value={n}>
                          {translateUI('routeCountOption', language, { count: n })}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
                {language === 'japanese' && (
                  <Checkbox theme={theme} checked={showFurigana} onChange={onShowFuriganaChange}>
                  {translateUI('showFurigana', language)}
                </Checkbox>
                )}
              </div>
            )}

            {/* ── データ可視化 ── */}
            {sectionHeader(translateUI('settingsGroupViz', language), groupVizOpen, () => setGroupVizOpen(v => !v))}
            {groupVizOpen && (
              <div style={{ paddingLeft: L.sp.xs, marginBottom: L.sp.xs }}>
                <Checkbox theme={theme} checked={heatmapEnabled} onChange={onHeatmapEnabledChange}>
                  {translateUI('stationHeatmap', language)}
                </Checkbox>
                {heatmapEnabled && (
                  <Checkbox
                    theme={theme}
                    size="sm"
                    checked={showEstimatedData}
                    onChange={onShowEstimatedDataChange}
                    styleOverride={{ paddingLeft: L.sp['2xl'] }}
                  >
                    <span>推定データを含める</span>
                    {!showEstimatedData && <span style={{ marginLeft: L.sp.xs, color: SEMANTIC.arrival, fontSize: FS.caption }}>（実データのみ）</span>}
                  </Checkbox>
                )}
                {mapViewMode === 'realistic' && (
                  <Checkbox theme={theme} checked={showTrainDemo} onChange={onTrainDemoToggle}>
                  {translateUI('trainDemoLabel', language)}
                </Checkbox>
                )}
                <Checkbox theme={theme} checked={mapViewMode === 'bubble'} onChange={(checked) => onMapViewModeChange(checked ? 'bubble' : 'realistic')}>
                  {translateUI('bubbleMap', language)}
                </Checkbox>
                {mapViewMode === 'bubble' && (
                  <div style={{ marginLeft: L.sp['4xl'], marginTop: L.sp.xs }}>
                    <div style={{ display: 'flex', gap: L.sp.sm, marginBottom: L.sp.sm }}>
                      {(['circle', 'square'] as const).map(shape => (
                        <Radio
                          theme={theme}
                          size="sm"
                          name="bubbleShape"
                          checked={bubbleShape === shape}
                          onChange={() => onBubbleShapeChange(shape)}
                        >
                          {shape === 'circle' ? translateUI('bubbleCircle', language) : translateUI('bubbleSquare', language)}
                        </Radio>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.sm }}>
                      <span style={{ fontSize: FS.caption, color: colors.textSecondary, whiteSpace: 'nowrap' }}>{translateUI('bubbleMaxRadius', language)}</span>
                      <Slider
                        min={500} max={50000} step={500}
                        value={bubbleMaxRadiusM}
                        onChange={e => onBubbleMaxRadiusMChange(Number(e.target.value))}
                      />
                      <span style={{ fontSize: FS.caption, color: colors.text, minWidth: '40px', textAlign: 'right' }}>
                        {bubbleMaxRadiusM >= 1000 ? `${(bubbleMaxRadiusM / 1000).toFixed(1)}km` : `${bubbleMaxRadiusM}m`}
                      </span>
                    </div>
                  </div>
                )}
                <Checkbox theme={theme} checked={mapViewMode === 'schematic'} onChange={(checked) => onMapViewModeChange(checked ? 'schematic' : 'realistic')}>
                  {translateUI('schematicMapLabel', language)}
                </Checkbox>
              </div>
            )}

            {/* ── 駅フィルター ── */}
            {sectionHeader(translateUI('settingsGroupFilter', language), groupFilterOpen, () => setGroupFilterOpen(v => !v))}
            {groupFilterOpen && (
              <div style={{ paddingLeft: L.sp.xs, marginBottom: L.sp.xs }}>
                <Checkbox theme={theme} checked={showExpressStationsOnly} onChange={onShowExpressStationsOnlyChange}>
                  {translateUI('showOnlyExpressStations', language)}
                </Checkbox>
                <Checkbox theme={theme} checked={showFullRouteStations} onChange={onShowFullRouteStationsChange}>
                  {translateUI('showFullRouteStations', language)}
                </Checkbox>
              </div>
            )}

            {/* ── 地図表示 ── */}
            {sectionHeader(translateUI('settingsGroupMap', language), groupMapOpen, () => setGroupMapOpen(v => !v))}
            {groupMapOpen && (
              <div style={{ paddingLeft: L.sp.xs, marginBottom: L.sp.xs }}>
                <Checkbox theme={theme} checked={showDimmedRoutes} onChange={onShowDimmedRoutesChange}>
                  {translateUI('showOutsideSegmentRoutes', language)}
                </Checkbox>
                <Checkbox theme={theme} checked={showRouteLine} onChange={onShowRouteLineChange}>
                  {translateUI('showRouteLines', language)}
                </Checkbox>
                <Checkbox theme={theme} checked={showStationTierBadges} onChange={onShowStationTierBadgesChange}>
                  {translateUI('transferHighlight', language)}
                </Checkbox>
                <Checkbox theme={theme} checked={showStationTooltip} onChange={onShowStationTooltipChange}>
                  {translateUI('stationTooltipLabel', language)}
                </Checkbox>
                <Checkbox theme={theme} checked={showOsmTiles} onChange={onShowOsmTilesChange}>
                  {translateUI('showMapTiles', language)}
                </Checkbox>
                <Stepper
                  theme={theme}
                  label={translateUI('settingsIconSize', language)}
                  value={stationSizeScale}
                  min={MAP_LABEL.minScale}
                  max={MAP_LABEL.maxScale}
                  step={MAP_LABEL.scaleStep}
                  onChange={onStationSizeScaleChange}
                  // 倍率だけだと何pxになるのか分からないので実際の文字サイズも出す
                  format={(v) => `${Math.round(MAP_LABEL.baseFontPx * v)}px`}
                  decreaseLabel={translateUI('decrease', language)}
                  increaseLabel={translateUI('increase', language)}
                />
                <Stepper
                  theme={theme}
                  label={translateUI('routeLineWidth', language)}
                  value={routeLineWidth}
                  min={ROUTE_LINE.minWidth}
                  max={ROUTE_LINE.maxWidth}
                  step={ROUTE_LINE.widthStep}
                  onChange={onRouteLineWidthChange}
                  format={(v) => `${v.toFixed(1)}px`}
                  decreaseLabel={translateUI('decrease', language)}
                  increaseLabel={translateUI('increase', language)}
                />
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
