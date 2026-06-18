import React, { useState, useMemo } from 'react';
import { routes, routeColors, routeNames } from '../data/routes';
import type { RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';
import { makeManualRoute, haversineDistance } from '../utils/trainDetector';
import type { DetectedRoute } from '../utils/trainDetector';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { FS } from '../constants/ui';

interface TrainStatusPanelProps {
  detectedRoute: DetectedRoute | null;
  manualRoute: DetectedRoute | null;
  onManualRouteChange: (route: DetectedRoute | null) => void;
  userLocation: [number, number] | null;
  hasGps: boolean;
}

const TrainStatusPanel: React.FC<TrainStatusPanelProps> = ({
  detectedRoute,
  manualRoute,
  onManualRouteChange,
  userLocation,
  hasGps,
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideSearch, setOverrideSearch] = useState('');

  const effective = manualRoute ?? detectedRoute;
  const isManual = manualRoute !== null;

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
          <span style={{ fontSize: FS.label, fontWeight: 'bold', color: colors.text }}>路線を選択</span>
          <button
            onClick={() => { setShowOverride(false); setOverrideSearch(''); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary, fontSize: FS.base }}
          >✕</button>
        </div>
        <input
          type="text"
          value={overrideSearch}
          onChange={e => setOverrideSearch(e.target.value)}
          placeholder="路線名を検索..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '4px 6px',
            fontSize: FS.label,
            border: `1px solid ${colors.border}`,
            borderRadius: '4px',
            backgroundColor: colors.surface,
            color: colors.text,
            marginBottom: '6px',
          }}
        />
        <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
          {filteredRoutes.map(r => {
            const routeStations = (routes[r.key] as Station[]) ?? [];
            const termA = routeStations[routeStations.length - 1]?.name ?? '';
            const termB = routeStations[0]?.name ?? '';
            return (
              <div key={r.key} style={{ marginBottom: '4px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 6px',
                  backgroundColor: colors.surface,
                  borderRadius: '4px',
                  borderLeft: `4px solid ${r.color}`,
                }}>
                  <span style={{ flex: 1, fontSize: FS.label, color: colors.text, fontWeight: 'bold' }}>{r.name}</span>
                  <button
                    onClick={() => handleSelectRoute(r.key, 0)}
                    style={{
                      fontSize: FS.helper,
                      padding: '2px 6px',
                      borderRadius: '3px',
                      border: `1px solid ${r.color}`,
                      backgroundColor: 'transparent',
                      color: r.color,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >→ {termA}方面</button>
                  <button
                    onClick={() => handleSelectRoute(r.key, 1)}
                    style={{
                      fontSize: FS.helper,
                      padding: '2px 6px',
                      borderRadius: '3px',
                      border: `1px solid ${r.color}`,
                      backgroundColor: 'transparent',
                      color: r.color,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >→ {termB}方面</button>
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
        <span style={{ fontSize: FS.label, color: colors.textSecondary }}>路線を検出中</span>
        <button
          onClick={() => setShowOverride(true)}
          style={{
            marginLeft: 'auto',
            fontSize: FS.helper,
            padding: '2px 6px',
            borderRadius: '3px',
            border: `1px solid ${colors.border}`,
            backgroundColor: 'transparent',
            color: colors.textSecondary,
            cursor: 'pointer',
          }}
        >手動設定</button>
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
        }}>{effective.routeName}</span>
        <span style={{ fontSize: FS.label, color: colors.text }}>
          {effective.terminalStation}方面
        </span>
        {isManual && (
          <span style={{
            fontSize: FS.helper,
            color: colors.textSecondary,
            backgroundColor: colors.surface,
            padding: '1px 4px',
            borderRadius: '3px',
            border: `1px solid ${colors.border}`,
          }}>手動</span>
        )}
      </div>

      {/* 次の駅行 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
        <span style={{ fontSize: FS.helper, color: colors.textSecondary, whiteSpace: 'nowrap' }}>次の駅</span>
        <span style={{
          fontSize: FS.base,
          fontWeight: 'bold',
          color: colors.text,
        }}>▶ {effective.nextStation}</span>
        {effective.estimatedMinutes !== null && (
          <span style={{
            fontSize: FS.label,
            color: colors.textSecondary,
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
          }}>約 {effective.estimatedMinutes} 分</span>
        )}
      </div>

      {/* 操作ボタン行 */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        <button
          onClick={handleFlipDirection}
          title="方向を逆転"
          style={{
            fontSize: FS.helper,
            padding: '2px 7px',
            borderRadius: '3px',
            border: `1px solid ${colors.border}`,
            backgroundColor: 'transparent',
            color: colors.textSecondary,
            cursor: 'pointer',
          }}
        >⇄ 方向反転</button>
        <button
          onClick={() => setShowOverride(true)}
          style={{
            fontSize: FS.helper,
            padding: '2px 7px',
            borderRadius: '3px',
            border: `1px solid ${colors.border}`,
            backgroundColor: 'transparent',
            color: colors.textSecondary,
            cursor: 'pointer',
          }}
        >路線変更</button>
        {isManual && (
          <button
            onClick={handleReset}
            style={{
              fontSize: FS.helper,
              padding: '2px 7px',
              borderRadius: '3px',
              border: `1px solid ${colors.border}`,
              backgroundColor: 'transparent',
              color: colors.textSecondary,
              cursor: 'pointer',
            }}
          >自動検出に戻す</button>
        )}
      </div>
    </div>
  );
};

export default TrainStatusPanel;
