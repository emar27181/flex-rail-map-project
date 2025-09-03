import React, { useMemo, useCallback } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';
import type { RouteResult } from '../utils/routeFinder';
import { createSchematicLayout, getRouteLayout, type SchematicStationLayout } from '../data/schematicLayout';

interface SchematicMapProps {
  visibleRoutes: Set<RouteKey>;
  routeRecommendations: RouteResult[];
  departure: Station | null;
  arrival: Station | null;
  transferStations: Set<string>;
  showTransferStationsOnly: boolean;
  onStationClick: (station: Station, action: 'departure' | 'arrival') => void;
}

interface SchematicStation {
  name: string;
  x: number;
  y: number;
  routes: RouteKey[];
  isTransfer: boolean;
  isDeparture: boolean;
  isArrival: boolean;
}

interface SchematicRoute {
  routeKey: RouteKey;
  stations: SchematicStation[];
  color: string;
  path: string;
}

const SchematicMap: React.FC<SchematicMapProps> = ({
  visibleRoutes,
  routeRecommendations,
  departure,
  arrival,
  transferStations,
  showTransferStationsOnly,
  onStationClick
}) => {
  // 図式化された駅座標を生成
  const schematicData = useMemo(() => {
    // オープンデータベースのレイアウトを使用
    const stationPositions = createSchematicLayout();
    
    // レイアウトにない駅は動的に配置
    const centerX = 400;
    const centerY = 300;
    const placedStations = new Set(Object.keys(stationPositions));
    let currentAngle = 0;
    let currentRadius = 280; // より外側に配置
    
    Object.values(routes).flat().forEach(station => {
      if (!placedStations.has(station.name)) {
        stationPositions[station.name] = {
          x: centerX + Math.cos(currentAngle) * currentRadius,
          y: centerY + Math.sin(currentAngle) * currentRadius
        };
        currentAngle += 0.4;
        if (currentAngle > 2 * Math.PI) {
          currentAngle = 0;
          currentRadius += 40;
        }
        placedStations.add(station.name);
      }
    });
    
    // 図式化された路線データを生成
    const schematicRoutes: SchematicRoute[] = [];
    
    Object.entries(routes).forEach(([routeKey, stations]) => {
      if (!visibleRoutes.has(routeKey as RouteKey)) return;
      
      const schematicStations: SchematicStation[] = stations.map(station => {
        const pos = stationPositions[station.name] || { x: centerX, y: centerY };
        return {
          name: station.name,
          x: pos.x,
          y: pos.y,
          routes: [routeKey as RouteKey],
          isTransfer: transferStations.has(station.name),
          isDeparture: departure?.name === station.name,
          isArrival: arrival?.name === station.name
        };
      });
      
      // 路線のタイプに応じてパスを生成
      const layoutType = getRouteLayout(routeKey as RouteKey);
      let pathCommands: string[] = [];
      
      if (layoutType === 'circular' && routeKey === 'yamanote') {
        // 山手線は円形パスで描画
        const centerX = 400;
        const centerY = 300;
        const radius = 150;
        pathCommands = [
          `M ${centerX + radius} ${centerY}`,
          `A ${radius} ${radius} 0 1 1 ${centerX + radius - 0.1} ${centerY}`
        ];
      } else {
        // その他の路線は直線で接続
        schematicStations.forEach((station, index) => {
          if (index === 0) {
            pathCommands.push(`M ${station.x} ${station.y}`);
          } else {
            const prevStation = schematicStations[index - 1];
            
            // 直線的な路線は直線で、そうでなければ曲線で接続
            if (layoutType === 'linear') {
              pathCommands.push(`L ${station.x} ${station.y}`);
            } else {
              // 曲線で接続（より自然な見た目）
              const midX = (prevStation.x + station.x) / 2;
              const midY = (prevStation.y + station.y) / 2;
              pathCommands.push(`Q ${midX} ${midY} ${station.x} ${station.y}`);
            }
          }
        });
      }
      
      schematicRoutes.push({
        routeKey: routeKey as RouteKey,
        stations: schematicStations,
        color: routeColors[routeKey as RouteKey],
        path: pathCommands.join(' ')
      });
    });
    
    return schematicRoutes;
  }, [visibleRoutes, departure, arrival, transferStations]);
  
  // 駅をクリックした時のハンドラー
  const handleStationClick = useCallback((station: SchematicStation, event: React.MouseEvent) => {
    event.stopPropagation();
    const originalStation: Station = {
      name: station.name,
      lat: 35.6812, // ダミー座標
      lng: 139.7671
    };
    
    if (event.shiftKey) {
      onStationClick(originalStation, 'arrival');
    } else {
      onStationClick(originalStation, 'departure');
    }
  }, [onStationClick]);
  
  // 表示する駅をフィルタリング
  const getVisibleStations = useCallback((stations: SchematicStation[]) => {
    if (!showTransferStationsOnly) return stations;
    return stations.filter(station => 
      station.isTransfer || station.isDeparture || station.isArrival
    );
  }, [showTransferStationsOnly]);
  
  return (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      border: '1px solid #ccc',
      backgroundColor: '#f8f9fa',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 800 600"
        style={{ display: 'block' }}
      >
        {/* 路線を描画 */}
        {schematicData.map(route => (
          <path
            key={route.routeKey}
            d={route.path}
            stroke={route.color}
            strokeWidth="4"
            fill="none"
            opacity={0.8}
          />
        ))}
        
        {/* 駅を描画 */}
        {schematicData.map(route => 
          getVisibleStations(route.stations).map(station => (
            <g key={`${route.routeKey}-${station.name}`}>
              {/* 特別駅（出発/到着）のマーカー */}
              {(station.isDeparture || station.isArrival) && (
                <rect
                  x={station.x - 40}
                  y={station.y - 10}
                  width="80"
                  height="20"
                  fill="white"
                  stroke={station.isDeparture ? '#4CAF50' : '#F44336'}
                  strokeWidth="3"
                  rx="4"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => handleStationClick(station, e)}
                />
              )}
              
              {/* 駅の円 */}
              <circle
                cx={station.x}
                cy={station.y}
                r={station.isTransfer ? 6 : 4}
                fill="white"
                stroke={route.color}
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleStationClick(station, e)}
              />
              
              {/* 駅名ラベル */}
              {(station.isTransfer || station.isDeparture || station.isArrival) && (
                <text
                  x={station.x}
                  y={station.isDeparture || station.isArrival ? station.y + 2 : station.y + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill={station.isDeparture ? '#4CAF50' : station.isArrival ? '#F44336' : '#333'}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => handleStationClick(station, e)}
                >
                  {station.name}
                </text>
              )}
            </g>
          ))
        )}
      </svg>
      
      {/* 使用方法の説明 */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666'
      }}>
        クリック: 出発駅設定 | Shift+クリック: 到着駅設定
      </div>
    </div>
  );
};

export default SchematicMap;