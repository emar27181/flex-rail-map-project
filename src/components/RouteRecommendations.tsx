import React, { useState } from 'react';
import { routeColors } from '../data/routes';
import type { RouteResult } from '../utils/routeFinder';

interface RouteRecommendationsProps {
  routes: RouteResult[];
  onRouteSelect?: (route: RouteResult) => void;
  selectedRoute?: RouteResult | null;
  onShowAllRoutes?: () => void;
}

const RouteRecommendations: React.FC<RouteRecommendationsProps> = ({
  routes,
  onRouteSelect,
  selectedRoute,
  onShowAllRoutes
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (routes.length === 0) {
    return null;
  }

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)}分`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
    }
  };

  const getTransferText = (transfers: number): string => {
    if (transfers === 0) {
      return '乗換なし';
    } else if (transfers === 1) {
      return '乗換1回';
    } else {
      return `乗換${transfers}回`;
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
    <div style={{
      marginBottom: '20px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: isExpanded ? '15px' : '0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ margin: '0', color: '#333' }}>
            推薦ルート ({routes.length}件)
          </h3>
          {selectedRoute && onShowAllRoutes && (
            <button
              onClick={onShowAllRoutes}
              style={{
                padding: '4px 8px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                color: '#666'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
            >
              全ルート表示
            </button>
          )}
        </div>
        <span style={{
          fontSize: '18px',
          color: '#666',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {routes.map((route, index) => {
          const isSelected = isRouteSelected(route);
          return (
            <div
              key={index}
              style={{
                padding: '15px',
                backgroundColor: isSelected ? '#e3f2fd' : 'white',
                borderRadius: '6px',
                border: isSelected ? '2px solid #2196F3' : '1px solid #e0e0e0',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(33,150,243,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
            {/* ルートヘッダー */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: isSelected ? '#2196F3' : '#333'
                }}>
                  ルート {index + 1} {isSelected && '(選択中)'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#2196F3'
                  }}>
                    {formatTime(route.totalTime)}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#666',
                    padding: '2px 8px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '12px'
                  }}>
                    {getTransferText(route.transfers)}
                  </span>
                </div>
              </div>
              
              {/* 地図で表示ボタン */}
              <button
                onClick={() => onRouteSelect?.(route)}
                disabled={isSelected}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isSelected ? '#ccc' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isSelected ? 'default' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#1976D2';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#2196F3';
                  }
                }}
              >
                {isSelected ? '地図に表示中' : '地図で表示'}
              </button>
            </div>

            {/* 路線詳細 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {route.segments.map((segment, segIndex) => (
                <div key={segIndex}>
                  {/* 乗換案内 */}
                  {segIndex > 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '5px 0',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <div style={{
                        padding: '3px 8px',
                        backgroundColor: segment.isWalkingTransfer ? '#4CAF50' : '#ff9800',
                        color: 'white',
                        borderRadius: '10px',
                        fontSize: '11px'
                      }}>
                        {segment.isWalkingTransfer ? '徒歩乗換' : '乗換'}
                      </div>
                    </div>
                  )}

                  {/* 路線セグメント */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 0'
                  }}>
                    {/* 路線アイコン */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '120px'
                    }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: segment.isWalkingTransfer ? '#4CAF50' : routeColors[segment.routeKey],
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'white'
                      }}>
                        {segment.isWalkingTransfer ? '🚶' : ''}
                      </div>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: segment.isWalkingTransfer ? '#4CAF50' : routeColors[segment.routeKey]
                      }}>
                        {segment.routeName}
                      </span>
                    </div>

                    {/* 駅名と時間 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      fontSize: '14px'
                    }}>
                      <span style={{ fontWeight: '500' }}>
                        {segment.stations[0].name}
                      </span>
                      <span style={{ color: '#999' }}>→</span>
                      <span style={{ fontWeight: '500' }}>
                        {segment.stations[segment.stations.length - 1].name}
                      </span>
                      <span style={{
                        marginLeft: 'auto',
                        color: '#666',
                        fontSize: '13px'
                      }}>
                        {formatTime(segment.time)}
                      </span>
                    </div>
                  </div>

                  {/* 経由駅（多い場合は省略） */}
                  {segment.stations.length > 2 && (
                    <div style={{
                      marginLeft: '28px',
                      fontSize: '12px',
                      color: '#888',
                      lineHeight: '1.4'
                    }}>
                      経由: {segment.stations.slice(1, -1).length > 3
                        ? `${segment.stations.slice(1, 4).map(s => s.name).join('、')}...他${segment.stations.length - 5}駅`
                        : segment.stations.slice(1, -1).map(s => s.name).join('、')
                      }
                    </div>
                  )}
                </div>
              ))}
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
          ルートが見つかりませんでした
        </div>
      )}
    </div>
  );
};

export default RouteRecommendations;