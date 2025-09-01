import React from 'react';
import { routeColors } from '../data/routes';
import type { RouteResult } from '../utils/routeFinder';

interface RouteRecommendationsProps {
  routes: RouteResult[];
  onRouteSelect?: (route: RouteResult) => void;
}

const RouteRecommendations: React.FC<RouteRecommendationsProps> = ({
  routes,
  onRouteSelect
}) => {
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

  return (
    <div style={{
      marginBottom: '20px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
        推薦ルート ({routes.length}件)
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {routes.map((route, index) => (
          <div
            key={index}
            onClick={() => onRouteSelect?.(route)}
            style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              cursor: onRouteSelect ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              if (onRouteSelect) {
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (onRouteSelect) {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
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
                  color: '#333'
                }}>
                  ルート {index + 1}
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
                        backgroundColor: '#ff9800',
                        color: 'white',
                        borderRadius: '10px',
                        fontSize: '11px'
                      }}>
                        乗換
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
                        backgroundColor: routeColors[segment.routeKey],
                        borderRadius: '50%',
                        flexShrink: 0
                      }} />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: routeColors[segment.routeKey]
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
        ))}
      </div>

      {routes.length === 0 && (
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