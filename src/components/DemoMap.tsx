'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Map, MousePointerClick, CircleCheck } from 'lucide-react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import { SEMANTIC, NEUTRAL, FS} from '../constants/ui';
import Button from './ui/atoms/Button';
import Chip from './ui/atoms/Chip';

/** デモ画面はテーマ切替を持たずライト固定 */
const DEMO_THEME = 'light' as const;
import { tintColor } from '../utils/contrast';
import { L } from './legend/legendStyles';

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
    icon: <Map size={28} />,
    title: '横浜 → 新宿の路線図',
    desc: '現在2路線を表示中。左の路線パネルをクリックすると、路線を追加・非表示にできます。',
    panelHighlight: false,
  },
  {
    step: 2,
    icon: <MousePointerClick size={28} />,
    title: '路線をクリックして追加しよう',
    desc: '灰色（非表示）の路線をクリックしてみてください。地図に追加されます！',
    panelHighlight: true,
  },
  {
    step: 3,
    icon: <CircleCheck size={28} />,
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
          color: NEUTRAL.white,
          padding: `${L.sp.lg} ${L.sp['2xl']}`,
          display: 'flex',
          alignItems: 'center',
          gap: L.sp.lg,
          flexShrink: 0,
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          <span style={{ fontSize: FS.heading, flexShrink: 0, display: 'flex' }}>{currentStep.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 'bold', fontSize: FS.body, marginBottom: L.sp.xxs }}>
              <span style={{
                backgroundColor: SEMANTIC.departure,
                color: NEUTRAL.white,
                borderRadius: L.r.card,
                padding: `${L.sp.xxs} ${L.sp.sm}`,
                fontSize: FS.caption,
                marginRight: L.sp.sm,
              }}>
                STEP {currentStep.step}/{TUTORIAL_STEPS.length}
              </span>
              {currentStep.title}
            </div>
            <div style={{ fontSize: FS.caption, color: '#ccc', lineHeight: 1.4 }}>
              {currentStep.desc}
            </div>
          </div>
          <div style={{ display: 'flex', gap: L.sp.sm, flexShrink: 0 }}>
            {tutorialStep < TUTORIAL_STEPS.length ? (
              <Button theme={DEMO_THEME} variant="positive" size="sm" onClick={handleNext}>
                次へ →
              </Button>
            ) : (
              <Button theme={DEMO_THEME} variant="positive" size="sm" onClick={() => setTutorialDismissed(true)}>
                完了 ✓
              </Button>
            )}
            <Button theme={DEMO_THEME} variant="outline" size="sm" onClick={() => setTutorialDismissed(true)}>
              閉じる
            </Button>
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
            backgroundColor: NEUTRAL.white,
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease',
            boxShadow: isPanelHighlighted
              ? `0 0 0 3px ${SEMANTIC.departure}, 0 0 20px ${tintColor(SEMANTIC.departure, 0.4)}`
              : 'none',
            position: 'relative',
            zIndex: isPanelHighlighted ? 10 : 1,
          }}
        >
          {/* Panel header */}
          <div style={{
            padding: `${L.sp.lg} ${L.sp.xl}`,
            backgroundColor: '#1a1a2e',
            color: NEUTRAL.white,
            fontSize: FS.caption,
            fontWeight: 'bold',
            flexShrink: 0,
          }}>
            路線の表示切替
            {isPanelHighlighted && (
              <span style={{
                display: 'block',
                fontSize: FS.caption,
                color: SEMANTIC.departure,
                marginTop: L.sp.xxs,
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
            padding: L.sp.md,
            display: 'flex',
            flexDirection: 'column',
            gap: L.sp.xs,
          }}>
            {DEMO_ROUTES.map((rk) => {
              const color = getRouteColor(rk);
              const name = getRouteName(rk);
              const isVisible = visibleRoutes.has(rk);
              return (
                <Chip
                  key={rk}
                  theme={DEMO_THEME}
                  size="sm"
                  color={color}
                  label={name}
                  selected={isVisible}
                  onClick={() => handleRouteToggle(rk)}
                  styleOverride={{
                    width: '100%',
                    animation: isPanelHighlighted && !isVisible ? 'wiggle 1.5s infinite' : 'none',
                  }}
                />
              );
            })}
          </div>

          {/* Panel footer */}
          <div style={{
            padding: `${L.sp.md} ${L.sp.lg}`,
            borderTop: '1px solid #eee',
            fontSize: FS.caption,
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
                    fillColor: st.isEndpoint ? NEUTRAL.white : NEUTRAL.white,
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
                      fontSize: FS.caption,
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
              fontSize: FS.title,
            }}>
              読み込み中...
            </div>
          )}

          {/* Attribution overlay */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            fontSize: FS.caption,
            color: '#888',
            backgroundColor: 'rgba(255,255,255,0.7)',
            padding: `${L.sp.xxs} ${L.sp.xs}`,
            borderRadius: L.r.control,
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
