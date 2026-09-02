import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { routeColors, routeNames } from '../data/routes';
import type { RouteResult } from '../utils/routeFinder';
import { getRouteDestination, getDirectionText, commonDirections } from '../data/routeDestinations';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { selectableCard, L} from './legend/legendStyles';
import { translateStation, translateRoute, translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';
import { SEMANTIC, FS} from '../constants/ui';
import { tintColor } from '../utils/contrast';
import Button from './ui/atoms/Button';

interface RouteRecommendationsProps {
  routes: RouteResult[];
  onRouteSelect?: (route: RouteResult) => void;
  selectedRoute?: RouteResult | null;
  onShowAllRoutes?: () => void;
  language?: Language;
}

const RouteRecommendations: React.FC<RouteRecommendationsProps> = ({
  routes,
  onRouteSelect,
  selectedRoute,
  onShowAllRoutes,
  language = 'japanese'
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

  const buildTooltip = (route: RouteResult): string => {
    return route.segments.map((seg, i) => {
      const name = seg.routeKey === 'walking'
        ? translateUI('walkingTransferShort', language)
        : translateRoute(routeNames[seg.routeKey] ?? seg.routeName, language);
      if (i === 0) return name;
      const transferStation = seg.stations[0]?.name ?? '';
      return `${translateStation(transferStation, language)} → ${name}`;
    }).join(' → ');
  };

  if (routes.length === 0) {
    return null;
  }

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return translateUI('minutes', language, { minutes: Math.round(minutes).toString() });
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return remainingMinutes > 0
        ? translateUI('hours', language, { hours: hours.toString(), minutes: remainingMinutes.toString() })
        : translateUI('hoursOnly', language, { hours: hours.toString() });
    }
  };

  const getTransferText = (transfers: number): string => {
    if (transfers === 0) {
      return translateUI('noTransfer', language);
    } else if (transfers === 1) {
      return translateUI('oneTransfer', language);
    } else {
      return translateUI('transfers', language, { count: transfers.toString() });
    }
  };

  const isRouteSelected = (route: RouteResult): boolean => {
    if (!selectedRoute) return false;
    
    // ルートが同じかどうかを判定（セグメント数、路線、駅で比較）
    if (route.segments.length !== selectedRoute.segments.length) return false;
    
    return route.segments.every((segment, index) => {
      const selectedSegment = selectedRoute.segments[index];
      return (
        segment.routeKey === selectedSegment.routeKey &&
        segment.startIndex === selectedSegment.startIndex &&
        segment.endIndex === selectedSegment.endIndex
      );
    });
  };

  return (
    <>
    {tooltip && createPortal(
      <div style={{
        position: 'fixed',
        left: tooltip.x + 12,
        top: tooltip.y - 36,
        backgroundColor: 'rgba(30,30,30,0.92)',
        color: colors.onPrimary,
        padding: `${L.sp.xs} ${L.sp.lg}`,
        borderRadius: L.r.control,
        fontSize: FS.caption,
        pointerEvents: 'none',
        zIndex: 9999,
        maxWidth: '420px',
        overflowWrap: 'break-word'
      }}>
        {tooltip.content}
      </div>,
      document.body
    )}
    <div style={{
      marginBottom: L.sp['3xl'],
      backgroundColor: colors.surfaceElevated,
      border: `1px solid ${colors.border}`,
      borderRadius: L.r.control,
      boxShadow: `0 2px 6px ${colors.shadow}`,
      minWidth: '200px'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          padding: L.sp.lg,
          borderBottom: isExpanded ? `1px solid ${colors.borderLight}` : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.lg }}>
          <span style={{
            fontSize: FS.title,
            fontWeight: 'bold',
            color: colors.text,
            margin: `0`
          }}>
{translateUI('recommendedRoutes', language)} ({translateUI('routeCount', language, { count: routes.length.toString() })})
          </span>
          {selectedRoute && onShowAllRoutes && (
            <Button theme={theme} variant="outline" size="sm" onClick={onShowAllRoutes}>
              {translateUI('showAllRoutes', language)}
            </Button>
          )}
        </div>
        <span style={{
          fontSize: FS.caption,
          color: '#666',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: L.sp.xl,
          padding: L.sp.lg,
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
        {routes.map((route, index) => {
          const isSelected = isRouteSelected(route);
          return (
            <div
              key={index}
              onMouseEnter={(e) => setTooltip({ content: buildTooltip(route), x: e.clientX, y: e.clientY })}
              onMouseMove={(e) => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
              onMouseLeave={() => setTooltip(null)}
              style={{
                padding: `${L.sp.lg} ${L.sp.xl}`,
                ...selectableCard(colors, { selected: isSelected, radius: '6px' }),
                boxShadow: isSelected ? `0 2px 8px ${tintColor(SEMANTIC.primary, 0.3)}` : `0 1px 3px ${colors.shadow}`
              }}
            >
            {/* ルートヘッダー: 番号・時間・乗換・ボタン */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: L.sp.lg,
              gap: L.sp.md
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.md, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: FS.caption,
                  color: colors.textSecondary
                }}>
                  {translateUI('routeNumber', language, { number: (index + 1).toString() })}
                </span>
                {/* 所要時間 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: L.sp.xxs
                }}>
                  <span style={{ fontSize: FS.heading, fontWeight: 'bold', color: isSelected ? SEMANTIC.primary : colors.text, lineHeight: '1' }}>
                    {Math.round(route.totalTime)}
                  </span>
                  <span style={{ fontSize: FS.caption, color: colors.textSecondary }}>{translateUI('minutesSuffix', language)}</span>
                </div>
                {/* 乗換数 */}
                <span style={{
                  fontSize: FS.caption,
                  color: route.transfers === 0 ? SEMANTIC.departure : '#ff9800',
                  padding: `${L.sp.xxs} ${L.sp.sm}`,
                  backgroundColor: route.transfers === 0 ? tintColor(SEMANTIC.departure, 0.12) : 'rgba(255,152,0,0.12)',
                  borderRadius: L.r.card,
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}>
                  {getTransferText(route.transfers)}
                </span>
              </div>

              {/* 地図で表示ボタン */}
              <Button
                theme={theme}
                variant="primary"
                size="sm"
                onClick={() => onRouteSelect?.(route)}
                disabled={isSelected}
                styleOverride={{ flexShrink: 0 }}
              >
                {isSelected ? translateUI('displayOnMapActive', language) : translateUI('displayOnMapButton', language)}
              </Button>
            </div>

            {/* 路線フロービジュアル */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: L.sp.sm }}>
              {route.segments.map((segment, segIndex) => {
                const segColor = segment.isWalkingTransfer || segment.routeKey === 'walking'
                  ? SEMANTIC.departure
                  : (routeColors[segment.routeKey] || '#888');
                const segName = segment.routeKey === 'walking'
                  ? translateUI('walkingTransferShort', language)
                  : translateRoute(routeNames[segment.routeKey] ?? segment.routeName, language);
                const startName = translateStation(segment.stations[0].name, language);
                const endName = translateStation(segment.stations[segment.stations.length - 1].name, language);
                const isLast = segIndex === route.segments.length - 1;
                return (
                  <React.Fragment key={segIndex}>
                    {/* 出発駅 or 乗換駅 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: L.sp.xxs }}>
                      {segIndex > 0 && (
                        <span style={{
                          fontSize: FS.caption,
                          color: colors.onPrimary,
                          backgroundColor: segment.isWalkingTransfer ? SEMANTIC.departure : '#ff9800',
                          padding: `${L.sp.xxs} ${L.sp.xs}`,
                          borderRadius: L.r.control,
                          whiteSpace: 'nowrap'
                        }}>
                          {segment.isWalkingTransfer
                            ? translateUI('walkingTransferShort', language)
                            : translateUI('transferShort', language)}
                        </span>
                      )}
                      <span style={{
                        fontSize: FS.caption,
                        fontWeight: 'bold',
                        color: colors.text,
                        whiteSpace: 'nowrap',
                        maxWidth: '60px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'center'
                      }}>
                        {startName}
                      </span>
                    </div>

                    {/* 路線バー */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 40px', minWidth: '40px' }}>
                      <span style={{
                        fontSize: FS.caption,
                        color: segColor,
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        marginBottom: L.sp.xxs,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%'
                      }}>
                        {segName}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: L.sp.xxs }}>
                        <div style={{ flex: 1, height: '5px', backgroundColor: segColor, borderRadius: L.r.control }} />
                        <span style={{ fontSize: FS.caption, color: colors.textSecondary, whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {Math.round(segment.time)}{translateUI('minutesSuffix', language)}
                        </span>
                        <div style={{ flex: 1, height: '5px', backgroundColor: segColor, borderRadius: L.r.control }} />
                      </div>
                    </div>

                    {/* 到着駅（最終セグメントのみ） */}
                    {isLast && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{
                          fontSize: FS.caption,
                          fontWeight: 'bold',
                          color: colors.text,
                          whiteSpace: 'nowrap',
                          maxWidth: '60px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'center'
                        }}>
                          {endName}
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            </div>
          );
        })}
        </div>
      )}

      {isExpanded && routes.length === 0 && (
        <div style={{
          padding: L.sp['3xl'],
          textAlign: 'center',
          color: '#666',
          fontSize: FS.title
        }}>
{translateUI('noRoutesFound', language)}
        </div>
      )}
    </div>
    </>
  );
};

export default RouteRecommendations;