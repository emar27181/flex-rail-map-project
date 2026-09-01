import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeftRight, X } from 'lucide-react';
import { routes, routeColors, routeNames } from '../data/routes';
import type { RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';
import { makeManualRoute, haversineDistance, DEFAULT_SPEED_MS } from '../utils/trainDetector';
import type { DetectedRoute } from '../utils/trainDetector';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { FS } from '../constants/ui';
import { translateUI, translateRoute, translateStation } from '../utils/translation';
import type { Language } from '../utils/translation';
import Button from './ui/atoms/Button';
import IconButton from './ui/atoms/IconButton';
import Chip from './ui/atoms/Chip';
import TextField from './ui/atoms/TextField';

interface TrainStatusPanelProps {
  detectedRoute: DetectedRoute | null;
  manualRoute: DetectedRoute | null;
  onManualRouteChange: (route: DetectedRoute | null) => void;
  userLocation: [number, number] | null;
  hasGps: boolean;
  language: Language;
}

const TrainStatusPanel: React.FC<TrainStatusPanelProps> = ({
  detectedRoute,
  manualRoute,
  onManualRouteChange,
  userLocation,
  hasGps,
  language,
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideSearch, setOverrideSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputFocusedRef = useRef(false);

  // iOSなどでソフトキーボード表示時に検索欄が隠れないよう、
  // visualViewportのリサイズに合わせてフォーカス中の欄までスクロールする
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const vv = window.visualViewport;
    const handleResize = () => {
      if (searchInputFocusedRef.current && searchInputRef.current) {
        searchInputRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    };
    vv.addEventListener('resize', handleResize);
    return () => vv.removeEventListener('resize', handleResize);
  }, []);

  const effective = manualRoute ?? detectedRoute;
  const isManual = manualRoute !== null;

  // 次の駅までの所要時間を現在地から動的計算
  const dynamicEstMinutes = useMemo(() => {
    if (!effective || !userLocation) return effective?.estimatedMinutes ?? null;
    const stas = routes[effective.routeKey] as Station[] | undefined;
    if (!stas) return effective.estimatedMinutes;
    const nextSta = stas.find(s => s.name === effective.nextStation);
    if (!nextSta) return effective.estimatedMinutes;
    const dist = haversineDistance(userLocation[0], userLocation[1], nextSta.lat, nextSta.lng);
    const estMin = Math.round(dist / DEFAULT_SPEED_MS / 60);
    return estMin > 0 ? estMin : 1;
  }, [effective, userLocation]);

  // 全路線リスト（showOverride が開いたときだけ計算）
  const allRoutesList = useMemo(() => {
    if (!showOverride) return [];
    const [lat, lng] = userLocation ?? [35.6812, 139.7671];
    return (Object.entries(routes) as [RouteKey, Station[]][])
      .map(([key, stas]) => {
        const minDist = stas.reduce((min, s) => {
          const d = haversineDistance(lat, lng, s.lat, s.lng);
          return d < min ? d : min;
        }, Infinity);
        return {
          key,
          name: routeNames[key] ?? key,
          color: routeColors[key] ?? '#888888',
          dist: minDist,
        };
      })
      .sort((a, b) => a.dist - b.dist);
  }, [showOverride, userLocation]);

  const filteredRoutes = overrideSearch
    ? allRoutesList.filter(r => r.name.includes(overrideSearch))
    : allRoutesList;

  const handleSelectRoute = (routeKey: RouteKey, dir: 0 | 1) => {
    const [lat, lng] = userLocation ?? [35.6812, 139.7671];
    const manual = makeManualRoute(routeKey, dir, lat, lng);
    if (manual) onManualRouteChange(manual);
    setShowOverride(false);
    setOverrideSearch('');
  };

  const handleFlipDirection = () => {
    if (!effective) return;
    const [lat, lng] = userLocation ?? [35.6812, 139.7671];
    const flipped = makeManualRoute(
      effective.routeKey,
      effective.directionIndex === 0 ? 1 : 0,
      lat, lng
    );
    if (flipped) onManualRouteChange(flipped);
  };

  const handleReset = () => {
    onManualRouteChange(null);
    setShowOverride(false);
  };

  // GPS なし
  if (!hasGps) return null;

  // 路線変更UI
  if (showOverride) {
    return (
      <div style={{
        marginTop: '8px',
        padding: '8px',
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        backgroundColor: colors.surfaceElevated,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: FS.label, fontWeight: 'bold', color: colors.text }}>{translateUI('selectRouteTitle', language)}</span>
          <IconButton
            theme={theme}
            size="sm"
            onClick={() => { setShowOverride(false); setOverrideSearch(''); }}
            label={translateUI('close', language)}
            icon={<X size={16} />}
          />
        </div>
        <TextField
          theme={theme}
          size="sm"
          type="text"
          ref={searchInputRef}
          value={overrideSearch}
          onChange={e => setOverrideSearch(e.target.value)}
          onFocus={() => { searchInputFocusedRef.current = true; }}
          onBlur={() => { searchInputFocusedRef.current = false; }}
          placeholder={translateUI('searchRoutePlaceholder', language)}
        />
        <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
          {filteredRoutes.map(r => {
            const routeStations = (routes[r.key] as Station[]) ?? [];
            const termA = routeStations[routeStations.length - 1]?.name ?? '';
            const termB = routeStations[0]?.name ?? '';
            return (
              <div key={r.key} style={{
                marginBottom: '4px',
                padding: '6px 8px',
                backgroundColor: colors.surface,
                borderRadius: '4px',
                borderLeft: `4px solid ${r.color}`,
              }}>
                <div style={{ fontSize: FS.label, color: colors.text, fontWeight: 'bold', marginBottom: '4px' }}>{translateRoute(r.name, language)}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <Chip
                    theme={theme}
                    size="sm"
                    color={r.color}
                    label={`→ ${translateStation(termA, language)}`}
                    selected={false}
                    onClick={() => handleSelectRoute(r.key, 0)}
                    styleOverride={{ flex: '1 1 0', minWidth: 0 }}
                  />
                  <Chip
                    theme={theme}
                    size="sm"
                    color={r.color}
                    label={`→ ${translateStation(termB, language)}`}
                    selected={false}
                    onClick={() => handleSelectRoute(r.key, 1)}
                    styleOverride={{ flex: '1 1 0', minWidth: 0 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 検出中（まだ結果なし）
  if (!effective) {
    return (
      <div style={{
        marginTop: '6px',
        padding: '3px 8px',
        border: `1px solid ${colors.border}`,
        borderRadius: '4px',
        backgroundColor: colors.surfaceElevated,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{ fontSize: FS.label, color: colors.textSecondary }}>{translateUI('detectingRoute', language)}</span>
        <Button
          theme={theme}
          variant="outline"
          size="sm"
          onClick={() => setShowOverride(true)}
          styleOverride={{ marginLeft: 'auto' }}
        >{translateUI('manualSetRoute', language)}</Button>
      </div>
    );
  }

  // 路線検出済み
  return (
    <div style={{
      marginTop: '6px',
      padding: '4px 8px',
      border: `1px solid ${effective.routeColor}44`,
      borderLeft: `4px solid ${effective.routeColor}`,
      borderRadius: '4px',
      backgroundColor: colors.surfaceElevated,
    }}>
      {/* 路線・方面行 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: FS.label,
          fontWeight: 'bold',
          color: effective.routeColor,
          backgroundColor: effective.routeColor + '1a',
          padding: '1px 6px',
          borderRadius: '10px',
          border: `1px solid ${effective.routeColor}66`,
        }}>{translateRoute(effective.routeName, language)}</span>
        <span style={{ fontSize: FS.label, color: colors.text }}>
          {translateUI('boundForStation', language, { station: translateStation(effective.terminalStation, language) })}
        </span>
        {isManual && (
          <span style={{
            fontSize: FS.helper,
            color: colors.textSecondary,
            backgroundColor: colors.surface,
            padding: '1px 4px',
            borderRadius: '3px',
            border: `1px solid ${colors.border}`,
          }}>{translateUI('manualBadge', language)}</span>
        )}
      </div>

      {/* 駅行: 停車中は現在の駅、走行中は次の駅を表示 */}
      {effective.currentStation ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <span style={{ fontSize: FS.helper, color: colors.textSecondary, whiteSpace: 'nowrap' }}>{translateUI('currentStationLabel', language)}</span>
          <span style={{
            fontSize: FS.base,
            fontWeight: 'bold',
            color: colors.text,
          }}>{translateStation(effective.currentStation, language)}</span>
          <span style={{
            fontSize: FS.label,
            color: colors.textSecondary,
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
          }}>{translateUI('stoppedLabel', language)}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <span style={{ fontSize: FS.helper, color: colors.textSecondary, whiteSpace: 'nowrap' }}>{translateUI('nextStationLabel', language)}</span>
          <span style={{
            fontSize: FS.base,
            fontWeight: 'bold',
            color: colors.text,
          }}>{translateStation(effective.nextStation, language)}</span>
          {dynamicEstMinutes !== null && (
            <span style={{
              fontSize: FS.label,
              color: colors.textSecondary,
              marginLeft: 'auto',
              whiteSpace: 'nowrap',
            }}>{translateUI('approxMinutesLabel', language, { minutes: dynamicEstMinutes })}</span>
          )}
        </div>
      )}

      {/* 操作ボタン行 */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
        <Button
          theme={theme}
          variant="outline"
          size="sm"
          onClick={handleFlipDirection}
          title={translateUI('flipDirectionTitle', language)}
          icon={<ArrowLeftRight size={13} />}
        >{translateUI('flipDirection', language)}</Button>
        <Button theme={theme} variant="outline" size="sm" onClick={() => setShowOverride(true)}>
          {translateUI('changeRoute', language)}
        </Button>
        {isManual && (
          <Button theme={theme} variant="ghost" size="sm" onClick={handleReset}>
            {translateUI('resetToAutoDetect', language)}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TrainStatusPanel;
