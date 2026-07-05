'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';

// Yokohama → Shinjuku corridor routes only
const DEMO_ROUTES: RouteKey[] = [
  'tokyuToyokoLine',
  'yamanote',
  'keihinTohoku',
  'jrTokaidoMainLine',
  'yokohamaBlueLine',
];

const INITIAL_VISIBLE = new Set<RouteKey>(['tokyuToyokoLine', 'yamanote']);

const MAP_CENTER: [number, number] = [35.555, 139.65];
const MAP_ZOOM = 11;

const KEY_STATIONS = [
  { name: '横浜', lat: 35.4657, lng: 139.6227, isEndpoint: true },
  { name: '渋谷', lat: 35.658, lng: 139.7016, isEndpoint: false },
  { name: '新宿', lat: 35.6896, lng: 139.7006, isEndpoint: true },
  { name: '品川', lat: 35.6284, lng: 139.7387, isEndpoint: false },
];

const TUTORIAL_STEPS = [
  {
    step: 1,
    emoji: '🗺️',
    title: '横浜 → 新宿の路線図',
    desc: '現在2路線を表示中。左の路線パネルをクリックすると、路線を追加・非表示にできます。',
    panelHighlight: false,
  },
  {
    step: 2,
    emoji: '👆',
    title: '路線をクリックして追加しよう',
    desc: '灰色（非表示）の路線をクリックしてみてください。地図に追加されます！',
    panelHighlight: true,
  },
  {
    step: 3,
    emoji: '✅',
    title: '自分だけのシンプル路線図！',
    desc: '必要な路線だけを選択することで、遅延・運休時も自分で乗り換えを判断できます。',
    panelHighlight: false,
  },
];

interface MapComponentsType {
  MapContainer: any;
  TileLayer: any;
  Polyline: any;
  CircleMarker: any;
  Tooltip: any;
}

const DemoMap: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [MapComponents, setMapComponents] = useState<MapComponentsType | null>(null);
  const [visibleRoutes, setVisibleRoutes] = useState<Set<RouteKey>>(INITIAL_VISIBLE);
  const [tutorialStep, setTutorialStep] = useState(1);
  const [tutorialDismissed, setTutorialDismissed] = useState(false);
  const [userToggledRoute, setUserToggledRoute] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    import('react-leaflet').then((rl) => {
      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Polyline: rl.Polyline,
        CircleMarker: rl.CircleMarker,
        Tooltip: rl.Tooltip,
      });
    });
  }, []);

  // Auto-advance to step 3 after user toggles a route on step 2
  useEffect(() => {
    if (tutorialStep === 2 && userToggledRoute) {
      const timer = setTimeout(() => setTutorialStep(3), 600);
      return () => clearTimeout(timer);
    }
  }, [tutorialStep, userToggledRoute]);

  const handleRouteToggle = useCallback((routeKey: RouteKey) => {
    setVisibleRoutes((prev) => {
      const next = new Set(prev);
      if (next.has(routeKey)) {
        next.delete(routeKey);
      } else {
        next.add(routeKey);
      }
      return next;
    });
    if (tutorialStep === 2) setUserToggledRoute(true);
  }, [tutorialStep]);

  const handleNext = () => {
    if (tutorialStep < TUTORIAL_STEPS.length) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setTutorialDismissed(true);
    }
  };

  const currentStep = TUTORIAL_STEPS.find((s) => s.step === tutorialStep);
  const isPanelHighlighted = !tutorialDismissed && currentStep?.panelHighlight;

  const getRouteColor = (rk: RouteKey) => routeColors[rk] || '#888';
  const getRouteName = (rk: RouteKey) => routeNames[rk] || rk;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      overflow: 'hidden',
    }}>
      {/* Tutorial Banner - always at top, never overflows */}
      {!tutorialDismissed && currentStep && (
        <div style={{
          backgroundColor: '#1a1a2e',
          color: '#fff',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>{currentStep.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' }}>
              <span style={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                borderRadius: '10px',
                padding: '1px 7px',
                fontSize: '11px',
                marginRight: '6px',
              }}>
                STEP {currentStep.step}/{TUTORIAL_STEPS.length}
              </span>
              {currentStep.title}
            </div>
            <div style={{ fontSize: '12px', color: '#ccc', lineHeight: 1.4 }}>
              {currentStep.desc}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            {tutorialStep < TUTORIAL_STEPS.length ? (
              <button
                onClick={handleNext}
                style={{
                  padding: '5px 12px',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                次へ →
              </button>
            ) : (
              <button
                onClick={() => setTutorialDismissed(true)}
                style={{
                  padding: '5px 12px',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                完了 ✓
              </button>
            )}
            <button
              onClick={() => setTutorialDismissed(true)}
              style={{
                padding: '5px 8px',
                backgroundColor: 'transparent',
                color: '#aaa',
                border: '1px solid #555',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        gap: 0,
      }}>
        {/* Route panel */}
        <div
          ref={panelRef}
          id="demo-route-panel"
          style={{
            width: '160px',
            flexShrink: 0,
            backgroundColor: '#fff',
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease',
            boxShadow: isPanelHighlighted
              ? '0 0 0 3px #4CAF50, 0 0 20px rgba(76,175,80,0.4)'
              : 'none',
            position: 'relative',
            zIndex: isPanelHighlighted ? 10 : 1,
          }}
        >
          {/* Panel header */}
          <div style={{
            padding: '10px 12px',
            backgroundColor: '#1a1a2e',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 'bold',
            flexShrink: 0,
          }}>
            路線の表示切替
            {isPanelHighlighted && (
              <span style={{
                display: 'block',
                fontSize: '10px',
                color: '#4CAF50',
                marginTop: '2px',
                animation: 'pulse-text 1s infinite',
              }}>
                ← クリックしてみよう！
              </span>
            )}
          </div>

          {/* Route list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
            {DEMO_ROUTES.map((rk) => {
              const color = getRouteColor(rk);
              const name = getRouteName(rk);
              const isVisible = visibleRoutes.has(rk);
              return (
                <button
                  key={rk}
                  onClick={() => handleRouteToggle(rk)}
                  title={isVisible ? '非表示にする' : '表示する'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '7px 8px',
                    border: isVisible ? `2px solid ${color}` : '2px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: isVisible ? `${color}18` : '#fafafa',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.15s ease',
                    animation: isPanelHighlighted && !isVisible ? 'wiggle 1.5s infinite' : 'none',
                  }}
                >
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    flexShrink: 0,
                    opacity: isVisible ? 1 : 0.35,
                    transition: 'opacity 0.15s',
                  }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: isVisible ? 'bold' : 'normal',
                    color: isVisible ? color : '#999',
                    lineHeight: 1.3,
                  }}>
                    {name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel footer */}
          <div style={{
            padding: '8px 10px',
            borderTop: '1px solid #eee',
            fontSize: '10px',
            color: '#aaa',
            flexShrink: 0,
          }}>
            クリックで表示切替
          </div>
        </div>

        {/* Map area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {isClient && MapComponents ? (
            <MapComponents.MapContainer
              center={MAP_CENTER}
              zoom={MAP_ZOOM}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
              zoomControl={true}
              attributionControl={false}
            >
              <MapComponents.TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              {/* Render visible routes */}
              {DEMO_ROUTES.map((rk) => {
                if (!visibleRoutes.has(rk)) return null;
                const stationList = routes[rk];
                if (!stationList || stationList.length < 2) return null;
                const color = getRouteColor(rk);
                const positions = stationList.map((s: any) => [s.lat, s.lng] as [number, number]);
                return (
                  <MapComponents.Polyline
                    key={rk}
                    positions={positions}
                    pathOptions={{ color, weight: 4, opacity: 0.85 }}
                  />
                );
              })}

              {/* Key station markers */}
              {KEY_STATIONS.map((st) => (
                <MapComponents.CircleMarker
                  key={st.name}
                  center={[st.lat, st.lng]}
                  radius={st.isEndpoint ? 9 : 6}
                  pathOptions={{
                    color: st.isEndpoint ? '#1a1a2e' : '#555',
                    fillColor: st.isEndpoint ? '#fff' : '#fff',
                    fillOpacity: 1,
                    weight: st.isEndpoint ? 3 : 2,
                  }}
                >
                  <MapComponents.Tooltip
                    permanent
                    direction="right"
                    offset={[10, 0]}
                    className="demo-station-label"
                  >
                    <span style={{
                      fontSize: '11px',
                      fontWeight: st.isEndpoint ? 'bold' : 'normal',
                      color: st.isEndpoint ? '#1a1a2e' : '#444',
                    }}>
                      {st.name}
                    </span>
                  </MapComponents.Tooltip>
                </MapComponents.CircleMarker>
              ))}
            </MapComponents.MapContainer>
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontSize: '14px',
            }}>
              読み込み中...
            </div>
          )}

          {/* Attribution overlay */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            fontSize: '9px',
            color: '#888',
            backgroundColor: 'rgba(255,255,255,0.7)',
            padding: '1px 4px',
            borderRadius: '2px',
            pointerEvents: 'none',
            zIndex: 500,
          }}>
            © OpenStreetMap contributors | Flex Rail Map
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .demo-station-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .demo-station-label::before {
          display: none !important;
        }
        .leaflet-tooltip.demo-station-label {
          background: rgba(255,255,255,0.85) !important;
          border: none !important;
          box-shadow: none !important;
          padding: 1px 4px !important;
          border-radius: 3px !important;
        }
      `}</style>
    </div>
  );
};

export default DemoMap;
