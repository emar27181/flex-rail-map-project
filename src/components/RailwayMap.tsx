import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';
import StationSelector from './StationSelector';
import RouteRecommendations from './RouteRecommendations';
import { RouteFinder, type RouteResult } from '../utils/routeFinder';

interface RailwayMapProps {
  className?: string;
}

const RailwayMap: React.FC<RailwayMapProps> = ({ className }) => {
  const [visibleRoutes, setVisibleRoutes] = useState<Set<RouteKey>>(new Set(Object.keys(routes) as RouteKey[]));
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const mapRef = useRef<any>(null);
  
  // 新しい機能のstate - デフォルトで横浜→新宿を設定
  const [departure, setDeparture] = useState<Station | null>({ 
    name: "横浜", 
    lat: 35.4657, 
    lng: 139.6227 
  });
  const [arrival, setArrival] = useState<Station | null>({ 
    name: "新宿", 
    lat: 35.6896, 
    lng: 139.7006 
  });
  const [routeRecommendations, setRouteRecommendations] = useState<RouteResult[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteResult | null>(null);
  
  const routeFinder = useMemo(() => new RouteFinder(), []);

  // 主要駅リストを一箇所でメモ化
  const majorStations = useMemo(() => [
    '東京', '新宿', '渋谷', '池袋', '上野', '品川', '横浜', '大宮', '立川',
    '吉祥寺', '町田', '川崎', '蒲田', '新橋', '有楽町', '秋葉原', '神田',
    '浜松町', '田町', '高田馬場', '新大久保', '四ツ谷', '市ヶ谷', '飯田橋',
    '御茶ノ水', '水道橋', '後楽園', '春日', '本郷三丁目', '上野広小路',
    '仲御徒町', '御徒町', '鶯谷', '日暮里', '西日暮里', '田端', '駒込',
    '巣鴨', '大塚', '目白', '新宿三丁目', '新宿御苑前', '四谷三丁目'
  ], []);

  // アイコン作成関数をメモ化
  const createStationIcon = useCallback((station: Station, color: string, zoomLevel: number, isDetailed: boolean) => {
    if (!MapComponents?.DivIcon) return null;
    
    const { DivIcon } = MapComponents;
    
    if (isDetailed) {
      return new DivIcon({
        html: `<div style="background:${color};color:white;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:bold;white-space:nowrap;border:1px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);text-align:center">${station.name}</div>`,
        className: 'station-name-marker',
        iconSize: [station.name.length * 11 + 12, 18],
        iconAnchor: [(station.name.length * 11 + 12) / 2, 9]
      });
    } else {
      const stationSize = Math.max(8, Math.min(16, zoomLevel - 8));
      return new DivIcon({
        html: `<div style="background:${color};width:${stationSize}px;height:${stationSize}px;border:1px solid white;box-shadow:0 1px 2px rgba(0,0,0,0.2)"></div>`,
        className: 'station-marker',
        iconSize: [stationSize, stationSize],
        iconAnchor: [stationSize / 2, stationSize / 2]
      });
    }
  }, [MapComponents]);

  const getTimeMarkerSize = (zoom: number) => {
    const baseSize = 20;
    const scaleFactor = Math.max(0.4, Math.min(1.2, (zoom - 8) / 8));
    return Math.round(baseSize * scaleFactor);
  };

  const createSpecialStationIcon = useCallback((isDeparture: boolean, zoomLevel: number) => {
    if (!MapComponents?.DivIcon) return null;
    
    const { DivIcon } = MapComponents;
    const markerSize = getTimeMarkerSize(zoomLevel) * 1.8;
    const fontSize = Math.max(14, Math.round(markerSize * 0.55));
    const markerColor = isDeparture ? '#4CAF50' : '#F44336';
    const markerText = isDeparture ? 'S' : 'G';
    
    return new DivIcon({
      html: `<div style="background:white;border:3px solid ${markerColor};border-radius:50%;width:${markerSize}px;height:${markerSize}px;display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;font-weight:bold;color:${markerColor};box-shadow:0 3px 6px rgba(0,0,0,0.3);position:relative;z-index:1000">${markerText}</div>`,
      className: 'special-station-marker',
      iconSize: [markerSize, markerSize],
      iconAnchor: [markerSize / 2, markerSize / 2]
    });
  }, [MapComponents]);

  const createTimeIcon = useCallback((time: number, color: string, zoomLevel: number, isSection = false) => {
    if (!MapComponents?.DivIcon) return null;
    
    const { DivIcon } = MapComponents;
    const markerSize = isSection ? getTimeMarkerSize(zoomLevel) * 1.2 : getTimeMarkerSize(zoomLevel);
    const fontSize = Math.max(isSection ? 10 : 8, Math.round(markerSize * (isSection ? 0.4 : 0.45)));
    
    return new DivIcon({
      html: `<div style="background:white;border:2px solid ${color};border-radius:50%;width:${markerSize}px;height:${markerSize}px;display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;font-weight:bold;color:${color};box-shadow:0 2px 4px rgba(0,0,0,${isSection ? 0.3 : 0.2})">${time}</div>`,
      className: isSection ? 'time-marker-section' : 'time-marker',
      iconSize: [markerSize, markerSize],
      iconAnchor: [markerSize / 2, markerSize / 2]
    });
  }, [MapComponents]);

  // レンダリング最適化：表示する路線のみレンダリング
  const visibleRoutesData = useMemo(() => {
    return Object.entries(routes).filter(([routeKey]) => visibleRoutes.has(routeKey as RouteKey));
  }, [visibleRoutes]);


  useEffect(() => {
    setIsClient(true);
    
    const loadLeaflet = async () => {
      try {
        const [
          { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents },
          { DivIcon }
        ] = await Promise.all([
          import('react-leaflet'),
          import('leaflet'),
        ]);
        
        setMapComponents({ MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents, DivIcon });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
        setIsLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  // 出発駅と到着駅が設定された時にルート検索を実行
  useEffect(() => {
    if (departure && arrival) {
      const routes = routeFinder.findRoutes(departure, arrival, 5);
      setRouteRecommendations(routes);
      setSelectedRoute(null);
      
      // 推薦路線で使用される全ての路線を表示
      const allRouteKeys = new Set<RouteKey>();
      routes.forEach(route => {
        route.segments.forEach(segment => {
          allRouteKeys.add(segment.routeKey);
        });
      });
      setVisibleRoutes(allRouteKeys);
    } else {
      setRouteRecommendations([]);
      setSelectedRoute(null);
      // 出発駅・到着駅がない場合は全路線を表示
      setVisibleRoutes(new Set(Object.keys(routes) as RouteKey[]));
    }
  }, [departure, arrival, routeFinder]);

  const toggleRoute = (routeKey: RouteKey) => {
    const newVisibleRoutes = new Set(visibleRoutes);
    if (newVisibleRoutes.has(routeKey)) {
      newVisibleRoutes.delete(routeKey);
    } else {
      newVisibleRoutes.add(routeKey);
    }
    setVisibleRoutes(newVisibleRoutes);
  };

  const getMarkerRadius = (zoom: number) => {
    // ズームレベルに応じてマーカーサイズを調整
    // ズームレベルが低い（広域）ほど小さく、高い（詳細）ほど大きく
    const baseRadius = 3;
    const scaleFactor = Math.max(0.3, Math.min(1.5, (zoom - 8) / 8));
    return Math.round(baseRadius * scaleFactor);
  };


  const getMidpoint = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    return [(lat1 + lat2) / 2, (lng1 + lng2) / 2];
  };

  // 路線に沿った中点を計算（複数駅を跨ぐ区間用）
  const getRouteBasedMidpoint = (stations: Station[], startIndex: number, endIndex: number) => {
    if (startIndex >= endIndex || startIndex < 0 || endIndex >= stations.length) {
      return getMidpoint(stations[startIndex].lat, stations[startIndex].lng, stations[endIndex].lat, stations[endIndex].lng);
    }

    // 区間内の全ての座標を取得
    const sectionStations = stations.slice(startIndex, endIndex + 1);
    
    // 路線の総距離を計算
    let totalDistance = 0;
    const distances: number[] = [];
    
    for (let i = 0; i < sectionStations.length - 1; i++) {
      const dist = Math.sqrt(
        Math.pow(sectionStations[i + 1].lat - sectionStations[i].lat, 2) +
        Math.pow(sectionStations[i + 1].lng - sectionStations[i].lng, 2)
      );
      distances.push(dist);
      totalDistance += dist;
    }
    
    // 中点となる距離を計算
    const midDistance = totalDistance / 2;
    let accumulatedDistance = 0;
    
    // 中点が含まれる区間を特定
    for (let i = 0; i < distances.length; i++) {
      if (accumulatedDistance + distances[i] >= midDistance) {
        // この区間内に中点がある
        const remainingDistance = midDistance - accumulatedDistance;
        const ratio = remainingDistance / distances[i];
        
        const lat = sectionStations[i].lat + (sectionStations[i + 1].lat - sectionStations[i].lat) * ratio;
        const lng = sectionStations[i].lng + (sectionStations[i + 1].lng - sectionStations[i].lng) * ratio;
        
        return [lat, lng];
      }
      accumulatedDistance += distances[i];
    }
    
    // フォールバック: 単純な中点
    return getMidpoint(
      sectionStations[0].lat, 
      sectionStations[0].lng, 
      sectionStations[sectionStations.length - 1].lat, 
      sectionStations[sectionStations.length - 1].lng
    );
  };

  const selectAllRoutes = () => {
    setVisibleRoutes(new Set(Object.keys(routes) as RouteKey[]));
  };

  const deselectAllRoutes = () => {
    setVisibleRoutes(new Set());
  };

  const handleRouteClick = (routeKey: RouteKey) => {
    toggleRoute(routeKey);
  };

  const handleRouteSelect = (route: RouteResult) => {
    setSelectedRoute(route);
    // 選択されたルートの路線を表示
    const routeKeys = new Set<RouteKey>();
    route.segments.forEach(segment => {
      routeKeys.add(segment.routeKey);
    });
    setVisibleRoutes(routeKeys);
  };


  if (!isClient || isLoading || !MapComponents) {
    return (
      <div style={{ 
        height: '600px', 
        width: '100%', 
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <div>マップを読み込み中...</div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMapEvents, DivIcon } = MapComponents;
  const tokyoStation = [35.6812, 139.7671];

  const MapEvents = () => {
    useMapEvents({
      zoomend: (e) => {
        setZoomLevel(e.target.getZoom());
      },
    });
    return null;
  };

  const getRouteSegmentForStations = (routeKey: RouteKey, stations: Station[], depStation: Station, arrStation: Station) => {
    const depIndex = stations.findIndex(s => s.name === depStation.name);
    const arrIndex = stations.findIndex(s => s.name === arrStation.name);
    
    if (depIndex === -1 || arrIndex === -1) return null;
    
    const startIndex = Math.min(depIndex, arrIndex);
    const endIndex = Math.max(depIndex, arrIndex);
    
    return {
      stations: stations.slice(startIndex, endIndex + 1),
      startIndex,
      endIndex
    };
  };

  const renderRoute = (routeKey: RouteKey, stations: Station[]) => {
    if (!visibleRoutes.has(routeKey)) return null;

    let displayStations = stations;
    let displayStartIndex = 0;
    
    // 推薦ルートが存在し、特定のルートが選択されている場合
    if (selectedRoute && departure && arrival) {
      const routeSegment = selectedRoute.segments.find(seg => seg.routeKey === routeKey);
      if (routeSegment) {
        displayStations = routeSegment.stations;
      } else {
        return null;
      }
    } else if (departure && arrival && routeRecommendations.length > 0) {
      // 推薦ルートが存在するが特定ルートが選択されていない場合、全推薦ルートで使用される区間を表示
      const allSegments = routeRecommendations.flatMap(route => route.segments);
      const routeSegment = allSegments.find(seg => seg.routeKey === routeKey);
      if (routeSegment) {
        displayStations = routeSegment.stations;
      } else {
        return null;
      }
    }

    const positions = displayStations.map(station => [station.lat, station.lng]);
    const color = routeColors[routeKey];

    return (
      <React.Fragment key={routeKey}>
        <Polyline 
          positions={positions} 
          color={color}
          weight={4}
          opacity={0.8}
        />
        {displayStations.map((station, index) => {
          const isDeparture = departure && station.name === departure.name;
          const isArrival = arrival && station.name === arrival.name;
          const isSpecialStation = isDeparture || isArrival;
          
          if (isSpecialStation) {
            const specialIcon = createSpecialStationIcon(isDeparture, zoomLevel);
            if (!specialIcon) return null;

            return (
              <Marker
                key={`${routeKey}-special-${index}`}
                position={[station.lat, station.lng]}
                icon={specialIcon}
                zIndexOffset={1000}
              >
                <Popup>
                  <div>
                    <strong>{station.name}</strong>
                    {isDeparture && <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>出発駅</div>}
                    {isArrival && <div style={{ color: '#F44336', fontWeight: 'bold' }}>到着駅</div>}
                    <br />
                    {station.timeToNext && `次駅まで: ${station.timeToNext}分`}
                  </div>
                </Popup>
              </Marker>
            );
          } else {
            const shouldShowStation = zoomLevel >= 13;
            const shouldShowStationName = zoomLevel >= 14;
            const isMajorStation = majorStations.includes(station.name);
            const shouldShowInWideView = zoomLevel >= 11 && isMajorStation;
            
            if (!shouldShowStation && !shouldShowInWideView) {
              return null;
            }

            const isDetailed = shouldShowStationName || shouldShowInWideView;
            const stationIcon = createStationIcon(station, color, zoomLevel, isDetailed);
            if (!stationIcon) return null;

            return (
              <Marker
                key={`${routeKey}-station-${index}`}
                position={[station.lat, station.lng]}
                icon={stationIcon}
              >
                <Popup>
                  <div>
                    <strong>{station.name}</strong>
                    <br />
                    {station.timeToNext && `次駅まで: ${station.timeToNext}分`}
                  </div>
                </Popup>
              </Marker>
            );
          }
        })}
        {displayStations.map((station, index) => {
          if (index < displayStations.length - 1 && station.timeToNext) {
            const nextStation = displayStations[index + 1];
            
            if (zoomLevel < 13) {
              const isCurrentMajor = majorStations.includes(station.name);
              if (!isCurrentMajor) return null;
              
              let totalTime = 0;
              let endIndex = index;
              
              for (let i = index; i < displayStations.length - 1; i++) {
                const currentSt = displayStations[i];
                const nextSt = displayStations[i + 1];
                totalTime += currentSt.timeToNext || 3;
                endIndex = i + 1;
                
                if (majorStations.includes(nextSt.name)) {
                  break;
                }
              }
              
              if (endIndex === index) return null;
              
              // 路線に沿った正確な中点を計算
              const midpoint = getRouteBasedMidpoint(displayStations, index, endIndex);
              const timeIcon = createTimeIcon(totalTime, color, zoomLevel, true);
              if (!timeIcon) return null;

              return (
                <Marker
                  key={`${routeKey}-time-section-${index}`}
                  position={midpoint}
                  icon={timeIcon}
                />
              );
            } else {
              const midpoint = getMidpoint(station.lat, station.lng, nextStation.lat, nextStation.lng);
              const timeIcon = createTimeIcon(station.timeToNext, color, zoomLevel, false);
              if (!timeIcon) return null;

              return (
                <Marker
                  key={`${routeKey}-time-${index}`}
                  position={midpoint}
                  icon={timeIcon}
                />
              );
            }
          }
          return null;
        })}
      </React.Fragment>
    );
  };

  return (
    <div className={className}>
      {/* 駅選択UI */}
      <StationSelector
        departure={departure}
        arrival={arrival}
        onDepartureChange={setDeparture}
        onArrivalChange={setArrival}
      />

      {/* ルート推薦表示 */}
      {routeRecommendations.length > 0 && (
        <RouteRecommendations
          routes={routeRecommendations}
          onRouteSelect={handleRouteSelect}
        />
      )}

      <div style={{ marginBottom: '15px' }}>
        <h3>路線表示切替</h3>
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={selectAllRoutes}
            style={{ 
              marginRight: '10px',
              padding: '5px 10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            すべて表示
          </button>
          <button 
            onClick={deselectAllRoutes}
            style={{ 
              padding: '5px 10px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            すべて非表示
          </button>
        </div>
        <div 
          style={{
            width: '100%',
            maxHeight: '200px',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            overflowY: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            alignContent: 'flex-start'
          }}
        >
          {Object.entries(routes).map(([routeKey, _]) => {
            const routeName = routeNames[routeKey as RouteKey];
            // 幅をより正確に計算: アイコン12px + マージン8px + テキスト + パディング16px
            const textWidth = routeName.length * 11; // 長い路線名に対応するため余裕を持たせる
            const totalWidth = 12 + 8 + textWidth + 16;
            
            return (
              <div
                key={routeKey}
                onClick={() => handleRouteClick(routeKey as RouteKey)}
                style={{
                  padding: '6px 8px',
                  cursor: 'pointer',
                  backgroundColor: visibleRoutes.has(routeKey as RouteKey) ? '#e8f5e8' : 'transparent',
                  color: routeColors[routeKey as RouteKey],
                  fontWeight: visibleRoutes.has(routeKey as RouteKey) ? 'bold' : 'normal',
                  borderRadius: '3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease',
                  border: visibleRoutes.has(routeKey as RouteKey) 
                    ? `2px solid ${routeColors[routeKey as RouteKey]}` 
                    : '2px solid transparent',
                  width: `${totalWidth}px`,
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!visibleRoutes.has(routeKey as RouteKey)) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!visibleRoutes.has(routeKey as RouteKey)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span 
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    backgroundColor: routeColors[routeKey as RouteKey],
                    borderRadius: '50%',
                    marginRight: '8px',
                    opacity: visibleRoutes.has(routeKey as RouteKey) ? 1 : 0.3,
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: '13px' }}>
                  {routeName}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginTop: '5px' 
        }}>
          クリックで表示・非表示を切替
        </div>
      </div>
      
      <div style={{ height: '600px', width: '100%', border: '1px solid #ccc' }}>
        <MapContainer
          center={tokyoStation}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <MapEvents />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {visibleRoutesData.map(([routeKey, stations]) =>
            renderRoute(routeKey as RouteKey, stations)
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RailwayMap;