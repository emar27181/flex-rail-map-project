import React, { useMemo, useCallback } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';
import type { RouteResult } from '../utils/routeFinder';

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
    // 主要駅を中心とした簡単な配置
    const stationPositions = new Map<string, { x: number, y: number }>();
    
    // 東京を中心とした基本配置
    const centerX = 400;
    const centerY = 300;
    
    // 主要駅の配置（円形に配置）
    const majorStations = [
      { name: '東京', angle: 0 },
      { name: '新宿', angle: Math.PI / 4 },
      { name: '池袋', angle: Math.PI / 2 },
      { name: '上野', angle: 3 * Math.PI / 4 },
      { name: '品川', angle: Math.PI },
      { name: '渋谷', angle: 5 * Math.PI / 4 },
      { name: '新橋', angle: 3 * Math.PI / 2 },
      { name: '有楽町', angle: 7 * Math.PI / 4 }
    ];
    
    const radius = 150;
    majorStations.forEach(({ name, angle }) => {
      stationPositions.set(name, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    });
    
    // その他の駅を適当に配置
    let placedStations = new Set(majorStations.map(s => s.name));
    let currentAngle = 0;
    let currentRadius = 200;
    
    Object.values(routes).flat().forEach(station => {
      if (!placedStations.has(station.name)) {
        stationPositions.set(station.name, {
          x: centerX + Math.cos(currentAngle) * currentRadius,
          y: centerY + Math.sin(currentAngle) * currentRadius
        });
        currentAngle += 0.3;
        if (currentAngle > 2 * Math.PI) {
          currentAngle = 0;
          currentRadius += 30;
        }
        placedStations.add(station.name);
      }
    });
    
    // 図式化された路線データを生成
    const schematicRoutes: SchematicRoute[] = [];
    
    Object.entries(routes).forEach(([routeKey, stations]) => {
      if (!visibleRoutes.has(routeKey as RouteKey)) return;
      
      const schematicStations: SchematicStation[] = stations.map(station => {
        const pos = stationPositions.get(station.name) || { x: centerX, y: centerY };
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
      
      // 駅間をつなぐパスを生成
      let pathCommands: string[] = [];
      schematicStations.forEach((station, index) => {
        if (index === 0) {
          pathCommands.push(`M ${station.x} ${station.y}`);
        } else {
          pathCommands.push(`L ${station.x} ${station.y}`);
        }
      });
      
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