import React, { useState, useEffect, useRef } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';

interface RailwayMapProps {
  className?: string;
}

const RailwayMap: React.FC<RailwayMapProps> = ({ className }) => {
  const [visibleRoutes, setVisibleRoutes] = useState<Set<RouteKey>>(new Set(['yamanote']));
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    const loadLeaflet = async () => {
      try {
        const [
          { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker },
        ] = await Promise.all([
          import('react-leaflet'),
        ]);
        
        setMapComponents({ MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
        setIsLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  const toggleRoute = (routeKey: RouteKey) => {
    const newVisibleRoutes = new Set(visibleRoutes);
    if (newVisibleRoutes.has(routeKey)) {
      newVisibleRoutes.delete(routeKey);
    } else {
      newVisibleRoutes.add(routeKey);
    }
    setVisibleRoutes(newVisibleRoutes);
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

  const { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } = MapComponents;
  const tokyoStation = [35.6812, 139.7671];

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
            radius={6}
            pathOptions={{
              fillColor: color,
              color: color,
              weight: 2,
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
      </React.Fragment>
    );
  };

  return (
    <div className={className}>
      <div style={{ marginBottom: '10px' }}>
        <h3>路線表示切替</h3>
        {Object.entries(routes).map(([routeKey, _]) => (
          <label key={routeKey} style={{ display: 'block', marginBottom: '5px' }}>
            <input
              type="checkbox"
              checked={visibleRoutes.has(routeKey as RouteKey)}
              onChange={() => toggleRoute(routeKey as RouteKey)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ color: routeColors[routeKey as RouteKey] }}>
              {routeNames[routeKey as RouteKey]}
            </span>
          </label>
        ))}
      </div>
      
      <div style={{ height: '600px', width: '100%', border: '1px solid #ccc' }}>
        <MapContainer
          center={tokyoStation}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          ref={mapRef}
        >
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