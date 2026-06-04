import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { routeColors, routeNames } from '../data/routes';
import type { RouteResult } from '../utils/routeFinder';
import { getRouteDestination, getDirectionText, commonDirections } from '../data/routeDestinations';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateStation, translateRoute, translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';

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
      const name = routeNames[seg.routeKey] || seg.routeName;
      if (i === 0) return name;
      const transferStation = seg.stations[0]?.name ?? '';
      return `${transferStation} → ${name}`;
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
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px',
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
      marginBottom: '20px',
      backgroundColor: colors.surfaceElevated,
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
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
          padding: '10px',
          borderBottom: isExpanded ? `1px solid ${colors.borderLight}` : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: colors.text,
            margin: '0'
          }}>
{translateUI('recommendedRoutes', language)} ({translateUI('routeCount', language, { count: routes.length.toString() })})
          </span>
          {selectedRoute && onShowAllRoutes && (
            <button
              onClick={onShowAllRoutes}
              style={{
                padding: '4px 8px',
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                color: colors.textSecondary,
                width: 'fit-content',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
            >
{translateUI('showAllRoutes', language)}
            </button>
          )}
        </div>
        <span style={{
          fontSize: '12px',
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
          gap: '12px',
          padding: '10px',
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
                padding: '10px 12px',
                backgroundColor: isSelected ? colors.selectedBackground || colors.surfaceElevated : colors.surface,
                borderRadius: '6px',
                border: isSelected ? '2px solid #2196F3' : `1px solid ${colors.borderLight}`,
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(33,150,243,0.3)' : `0 1px 3px ${colors.shadow}`
              }}
            >
            {/* ルートヘッダー: 番号・時間・乗換・ボタン */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '12px',
                  color: colors.textSecondary
                }}>
                  {translateUI('routeNumber', language, { number: (index + 1).toString() })}
                </span>
                {/* 所要時間 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '2px'
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: isSelected ? '#2196F3' : colors.text, lineHeight: '1' }}>
                    {Math.round(route.totalTime)}
                  </span>
                  <span style={{ fontSize: '11px', color: colors.textSecondary }}>{translateUI('minutesSuffix', language)}</span>
                </div>
                {/* 乗換数 */}
                <span style={{
                  fontSize: '12px',
                  color: route.transfers === 0 ? '#4CAF50' : '#ff9800',
                  padding: '2px 7px',
                  backgroundColor: route.transfers === 0 ? 'rgba(76,175,80,0.12)' : 'rgba(255,152,0,0.12)',
                  borderRadius: '10px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}>
                  {getTransferText(route.transfers)}
                </span>
              </div>

              {/* 地図で表示ボタン */}
              <button
                onClick={() => onRouteSelect?.(route)}
                disabled={isSelected}
                style={{
                  padding: '5px 12px',
                  backgroundColor: isSelected ? colors.textSecondary : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isSelected ? 'default' : 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  flexShrink: 0,
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#1976D2'; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#2196F3'; }}
              >
                {isSelected ? translateUI('displayOnMapActive', language) : translateUI('displayOnMapButton', language)}
              </button>
            </div>

            {/* 路線フロービジュアル */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: '6px' }}>
              {route.segments.map((segment, segIndex) => {
                const segColor = segment.isWalkingTransfer ? '#4CAF50' : (routeColors[segment.routeKey] || '#888');
                const segName = routeNames[segment.routeKey] || segment.routeName;
                const startName = translateStation(segment.stations[0].name, language);
                const endName = translateStation(segment.stations[segment.stations.length - 1].name, language);
                const isLast = segIndex === route.segments.length - 1;
                return (
                  <React.Fragment key={segIndex}>
                    {/* 出発駅 or 乗換駅 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      {segIndex > 0 && (
                        <span style={{
                          fontSize: '9px',
                          color: '#fff',
                          backgroundColor: segment.isWalkingTransfer ? '#4CAF50' : '#ff9800',
                          padding: '1px 5px',
                          borderRadius: '6px',
                          whiteSpace: 'nowrap'
                        }}>
                          {segment.isWalkingTransfer
                            ? translateUI('walkingTransferShort', language)
                            : translateUI('transferShort', language)}
                        </span>
                      )}
                      <span style={{
                        fontSize: '11px',
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
                        fontSize: '10px',
                        color: segColor,
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        marginBottom: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%'
                      }}>
                        {segName}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '2px' }}>
                        <div style={{ flex: 1, height: '5px', backgroundColor: segColor, borderRadius: '2px' }} />
                        <span style={{ fontSize: '10px', color: colors.textSecondary, whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {Math.round(segment.time)}{translateUI('minutesSuffix', language)}
                        </span>
                        <div style={{ flex: 1, height: '5px', backgroundColor: segColor, borderRadius: '2px' }} />
                      </div>
                    </div>

                    {/* 到着駅（最終セグメントのみ） */}
                    {isLast && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '11px',
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
          padding: '20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
{translateUI('noRoutesFound', language)}
        </div>
      )}
    </div>
    </>
  );
};

export default RouteRecommendations;