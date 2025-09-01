import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  
  // 新しい機能のstate
  const [departure, setDeparture] = useState<Station | null>(null);
  const [arrival, setArrival] = useState<Station | null>(null);
  const [routeRecommendations, setRouteRecommendations] = useState<RouteResult[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteResult | null>(null);
  
  const routeFinder = useMemo(() => new RouteFinder(), []);

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

  const getTimeMarkerSize = (zoom: number) => {
    // ズームレベルに応じて時刻マーカーサイズを調整
    const baseSize = 20;
    const scaleFactor = Math.max(0.4, Math.min(1.2, (zoom - 8) / 8));
    return Math.round(baseSize * scaleFactor);
  };

  const getMidpoint = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    return [(lat1 + lat2) / 2, (lng1 + lng2) / 2];
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

  const renderRoute = (routeKey: RouteKey, stations: Station[]) => {
    if (!visibleRoutes.has(routeKey)) return null;

    const positions = stations.map(station => [station.lat, station.lng]);
    const color = routeColors[routeKey];

    return (
      <React.Fragment key={routeKey}>
        <Polyline 
          positions={positions} 
          color={color}
          weight={4}
          opacity={0.8}
        />
        {stations.map((station, index) => (
          <CircleMarker 
            key={`${routeKey}-${index}`} 
            center={[station.lat, station.lng]}
            radius={getMarkerRadius(zoomLevel)}
            pathOptions={{
              fillColor: color,
              color: color,
              weight: Math.max(1, Math.round(getMarkerRadius(zoomLevel) / 3)),
              opacity: 1,
              fillOpacity: 0.8
            }}
          >
            <Popup>
              <div>
                <strong>{station.name}</strong>
                <br />
                {station.timeToNext && `次駅まで: ${station.timeToNext}分`}
              </div>
            </Popup>
          </CircleMarker>
        ))}
        {stations.map((station, index) => {
          if (index < stations.length - 1 && station.timeToNext) {
            const nextStation = stations[index + 1];
            const midpoint = getMidpoint(station.lat, station.lng, nextStation.lat, nextStation.lng);
            const markerSize = getTimeMarkerSize(zoomLevel);
            const fontSize = Math.max(8, Math.round(markerSize * 0.45));
            
            const timeIcon = new DivIcon({
              html: `<div style="
                background: white;
                border: 2px solid ${color};
                border-radius: 50%;
                width: ${markerSize}px;
                height: ${markerSize}px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${fontSize}px;
                font-weight: bold;
                color: ${color};
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              ">${station.timeToNext}</div>`,
              className: 'time-marker',
              iconSize: [markerSize, markerSize],
              iconAnchor: [markerSize / 2, markerSize / 2]
            });

            return (
              <Marker
                key={`${routeKey}-time-${index}`}
                position={midpoint}
                icon={timeIcon}
              />
            );
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
          
          {Object.entries(routes).map(([routeKey, stations]) =>
            renderRoute(routeKey as RouteKey, stations)
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RailwayMap;