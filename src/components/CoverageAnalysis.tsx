import React, { useState, useMemo } from 'react';
import { routes, routeNames, type RouteKey } from '../data/routes';

interface CoverageStats {
  totalRoutes: number;
  totalStations: number;
  uniqueStations: number;
  duplicateStations: number;
  routeBreakdown: Array<{
    routeKey: RouteKey;
    routeName: string;
    stationCount: number;
  }>;
  missingCriticalRoutes: string[];
  incompleteRoutes: Array<{
    routeName: string;
    currentStations: number;
    expectedStations: number;
    completeness: number;
  }>;
}

const CoverageAnalysis: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const coverageStats = useMemo((): CoverageStats => {
    try {
    // 全駅名を収集
    const allStations = new Set<string>();
    const stationRouteMap = new Map<string, Set<RouteKey>>();
    
    const routeBreakdown = Object.entries(routes).map(([routeKey, stations]) => {
      stations.forEach(station => {
        allStations.add(station.name);
        if (!stationRouteMap.has(station.name)) {
          stationRouteMap.set(station.name, new Set());
        }
        stationRouteMap.get(station.name)!.add(routeKey as RouteKey);
      });
      
      return {
        routeKey: routeKey as RouteKey,
        routeName: routeNames[routeKey as RouteKey],
        stationCount: stations.length
      };
    });

    // 重複駅の計算
    let totalStationCount = 0;
    Object.values(routes).forEach(stations => {
      totalStationCount += stations.length;
    });

    const duplicateStations = totalStationCount - allStations.size;

    // 既知の不完全な路線
    const knownIncompleteRoutes = [
      {
        routeName: '山手線',
        currentStations: routes.yamanote?.length || 0,
        expectedStations: 30,
        completeness: Math.round(((routes.yamanote?.length || 0) / 30) * 100)
      }
    ];

    // 重要な欠落路線
    const criticalMissingRoutes = [
      '武蔵野線',
      '京成本線', 
      '東京モノレール',
      'ゆりかもめ',
      '南武線',
      '根岸線'
    ];

    return {
      totalRoutes: Object.keys(routes).length,
      totalStations: totalStationCount,
      uniqueStations: allStations.size,
      duplicateStations,
      routeBreakdown: routeBreakdown.sort((a, b) => b.stationCount - a.stationCount),
      missingCriticalRoutes: criticalMissingRoutes,
      incompleteRoutes: knownIncompleteRoutes
    };
    } catch (error) {
      console.error('Error in coverage analysis:', error);
      return {
        totalRoutes: 0,
        totalStations: 0,
        uniqueStations: 0,
        duplicateStations: 0,
        routeBreakdown: [],
        missingCriticalRoutes: [],
        incompleteRoutes: []
      };
    }
  }, []);

  const getCoverageGrade = (stats: CoverageStats): { grade: string; color: string } => {
    const completenessScore = (stats.totalRoutes / 40) * 100; // 40路線を満点とする
    
    if (completenessScore >= 90) return { grade: 'A', color: '#4CAF50' };
    if (completenessScore >= 80) return { grade: 'B', color: '#8BC34A' };
    if (completenessScore >= 70) return { grade: 'C', color: '#FFC107' };
    if (completenessScore >= 60) return { grade: 'D', color: '#FF9800' };
    return { grade: 'F', color: '#f44336' };
  };

  const { grade, color } = getCoverageGrade(coverageStats);

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '2px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '200px',
      maxWidth: isExpanded ? '400px' : '200px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontSize: '12px'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isExpanded ? '10px' : '0'
        }}
      >
        <h3 style={{ margin: 0, fontSize: '14px' }}>路線カバレッジ分析</h3>
        <div style={{
          backgroundColor: color,
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '12px'
        }}>
          {grade}
        </div>
      </div>

      {isExpanded && (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>基本統計</h4>
            <div>登録路線数: <strong>{coverageStats.totalRoutes}</strong></div>
            <div>総駅数: <strong>{coverageStats.totalStations}</strong></div>
            <div>ユニーク駅数: <strong>{coverageStats.uniqueStations}</strong></div>
            <div>重複駅数: <strong>{coverageStats.duplicateStations}</strong></div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#f44336' }}>不完全な路線</h4>
            {coverageStats.incompleteRoutes.map((route, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                <strong>{route.routeName}</strong>: {route.currentStations}/{route.expectedStations}駅 
                <span style={{ color: route.completeness < 70 ? '#f44336' : '#FF9800' }}>
                  ({route.completeness}%)
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#f44336' }}>欠落している重要路線</h4>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {coverageStats.missingCriticalRoutes.join('、')}
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>路線別駅数 (上位10)</h4>
            <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
              {coverageStats.routeBreakdown.slice(0, 10).map((route, index) => (
                <div key={route.routeKey} style={{ 
                  marginBottom: '2px',
                  fontSize: '11px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{route.routeName}</span>
                  <strong>{route.stationCount}駅</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            marginTop: '10px', 
            paddingTop: '8px', 
            borderTop: '1px solid #eee',
            fontSize: '10px',
            color: '#666'
          }}>
            <strong>改善提案:</strong><br/>
            1. 山手線の完全化 (最優先)<br/>
            2. 武蔵野線・空港アクセス線の追加<br/>
            3. 欠落路線の段階的追加
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverageAnalysis;