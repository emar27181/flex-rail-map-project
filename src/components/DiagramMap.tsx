'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import { getThemeColors, adjustRouteColorForTheme } from '../contexts/ThemeContext';
import { translateRoute } from '../utils/translation'
import type { Language } from '../utils/translation';

// ---- 表示対象路線 ----
const DIAGRAM_ROUTE_KEYS: RouteKey[] = [
  'yamanote', 'chuo', 'keihinTohoku', 'jrSobuLine', 'jrJobanLine',
  'jrSaikyoLine', 'jrTakasakiLine', 'jrTokaidoMainLine', 'jrMusashinoLine',
  'jrYokohamaLine', 'jrNanbuLine', 'jrSobuChiba', 'jrKeiyo',
  'jrOmeLine', 'jrHachikoLine', 'jrItsukaichiLine', 'jrUtsunomiyaLine', 'jrNegishiLine',
  'yokosukaLine',
  'ginzaLine', 'marunouchiLine', 'hibiyaLine', 'tozaiLine', 'chiyodaLine',
  'yurakuchoLine', 'hanzomonLine', 'nambokuLine', 'fukutoshinLine',
  'toeiAsakusaLine', 'toeiMitaLine', 'toeiShinjukuLine', 'toeiOedoLine',
  'odakyuLine', 'odakyuEnoshimaLine', 'odakyuTamaLine',
  'keioLine', 'keioInokashiraLine', 'keioSagamiharaLine',
  'tokyuToyokoLine', 'tokyuDenEnToshiLine', 'tokyuMeguro',
  'tokyuOimachiLine', 'tokyuTamagawa', 'tokyuIkegami', 'tokyuSetagayaLine',
  'seibuIkebukuroLine', 'seibuShinjukuLine',
  'tobuTojoLine', 'tobuIsesakiLine', 'tobuNikkoLine', 'tobuDaishiLine', 'tobuKameidoLine',
  'keikyuLine', 'keikyuKurihamaLine', 'keikyuAirportLine',
  'keiseiMainLine', 'keiseiOshiageLine', 'hokusouLine',
  'sotetsuMainLine', 'sotetsuIzumino', 'sotetsuJRLine',
  'tokyoMonorail', 'rinkaiLine', 'yurikamomeLine', 'tsukubaExpress',
  'tamaMonorail', 'todenArakawaLine', 'nipporiToneriLiner',
  'yokohamaBlueLine', 'yokohamaGreenLine', 'shonanMonorail', 'enoshimaElectricRailway',
  'saitamaRailway', 'newShuttle', 'shinkeisei', 'toyoRapid',
];

// ---- 地理座標系 (新宿アンカー・無限拡張キャンバス) ----
const SCALE_PX = 12000;
const LNG_COS = Math.cos(35.57 * Math.PI / 180);
const ANCHOR_LNG = 139.7006;
const ANCHOR_LAT = 35.6896;
const CANVAS_CX = 5000;
const CANVAS_CY = 5000;

function geoX(lng: number): number {
  return CANVAS_CX + (lng - ANCHOR_LNG) * LNG_COS * SCALE_PX;
}
function geoY(lat: number): number {
  return CANVAS_CY - (lat - ANCHOR_LAT) * SCALE_PX;
}

// ---- ラベル配置定数 ----
const REF_FS = 5.5;
const REF_LH = REF_FS * 1.5;
const REF_GAP = 0.8;
const REF_R_TRANSFER = 2.5;
const REF_R_REGULAR = 1.5;
const SCREEN_FS = 12; // 固定スクリーン空間フォントサイズ
const MARKER_R = 8;   // 出発/到着マーカー半径（スクリーンpx）

// ---- Props ----
interface DiagramMapProps {
  visibleRoutes?: Set<RouteKey>;
  highlightedRouteKeys?: Set<RouteKey> | null;
  departure?: string;
  arrival?: string;
  theme?: 'light' | 'dark';
  language?: Language;
  showStationNames?: boolean;
  onToggleRoute?: (routeKey: RouteKey) => void;
  onHideRoute?: (routeKey: RouteKey) => void;
  showDimmedRoutes?: boolean;
}

const DiagramMap: React.FC<DiagramMapProps> = ({
  visibleRoutes: externalVisibleRoutes,
  highlightedRouteKeys = null,
  departure = '',
  arrival = '',
  theme = 'light',
  language = 'japanese',
  showStationNames = true,
  onToggleRoute,
  onHideRoute,
  showDimmedRoutes: externalShowDimmed,
}) => {
  const visibleRoutes = externalVisibleRoutes ?? new Set(DIAGRAM_ROUTE_KEYS);
  const [transform, setTransform] = useState(() => {
    const s = 0.08;
    const w = typeof window !== 'undefined' ? window.innerWidth : 800;
    const h = typeof window !== 'undefined' ? window.innerHeight : 600;
    return { x: w / 2 - CANVAS_CX * s, y: h / 2 - CANVAS_CY * s, scale: s };
  });
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });
  const [internalShowDimmed, setInternalShowDimmed] = useState(true);
  const showDimmedRoutes = externalShowDimmed !== undefined ? externalShowDimmed : internalShowDimmed;
  const [dimmedTooltip, setDimmedTooltip] = useState<{ routeKey: RouteKey; x: number; y: number; isVisible: boolean } | null>(null);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const mapAreaRef = useRef<HTMLDivElement>(null);

  // ---- 地理座標ベースの駅位置計算 ----
  const schematicData = useMemo(() => {
    const stationGeo = new Map<string, { lat: number; lng: number }>();
    const stationRouteCount = new Map<string, number>();

    DIAGRAM_ROUTE_KEYS.filter(k => visibleRoutes.has(k)).forEach(k => {
      const stns = routes[k] as any[];
      stns?.forEach((st: any) => {
        if (!stationGeo.has(st.name)) stationGeo.set(st.name, { lat: st.lat, lng: st.lng });
        stationRouteCount.set(st.name, (stationRouteCount.get(st.name) ?? 0) + 1);
      });
    });

    const stationPos = new Map<string, [number, number]>();
    const transferStations = new Set<string>();
    stationGeo.forEach((geo, name) => {
      stationPos.set(name, [geoX(geo.lng), geoY(geo.lat)]);
      if ((stationRouteCount.get(name) ?? 0) >= 2) transferStations.add(name);
    });

    return { stationPos, transferStations };
  }, [visibleRoutes]);

  // ---- 非表示路線クリックハンドラ ----
  const handleDimmedRouteClick = useCallback((e: React.MouseEvent<SVGPathElement>, routeKey: RouteKey) => {
    e.stopPropagation();
    const rect = mapAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDimmedTooltip({ routeKey, x: e.clientX - rect.left, y: e.clientY - rect.top, isVisible: false });
  }, []);

  const handleVisibleRouteClick = useCallback((e: React.MouseEvent<SVGPathElement>, routeKey: RouteKey) => {
    e.stopPropagation();
    const rect = mapAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDimmedTooltip({ routeKey, x: e.clientX - rect.left, y: e.clientY - rect.top, isVisible: true });
  }, []);

  // ---- 非表示路線（半透明・transform非依存） ----
  const dimmedPathElements = useMemo(() => {
    if (!showDimmedRoutes) return [];

    return DIAGRAM_ROUTE_KEYS.flatMap(routeKey => {
      if (visibleRoutes.has(routeKey)) return [];

      const stns = routes[routeKey] as any[];
      if (!stns?.length) return [];

      const color = adjustRouteColorForTheme(routeColors[routeKey] ?? '#888', theme);

      let d = '';
      let prevPos: [number, number] | null = null;
      for (let i = 0; i < stns.length; i++) {
        const st = stns[i] as any;
        if (!st?.lat || !st?.lng) { prevPos = null; continue; }
        const x = geoX(st.lng);
        const y = geoY(st.lat);
        if (prevPos === null) {
          d += `M${x.toFixed(1)},${y.toFixed(1)}`;
        } else {
          const [px, py] = prevPos;
          if (Math.abs(x - px) < 0.5 && Math.abs(y - py) < 0.5) { prevPos = [x, y]; continue; }
          d += `L${x.toFixed(1)},${y.toFixed(1)}`;
        }
        prevPos = [x, y];
      }

      if (!d || d.length < 3) return [];

      const clickSW = 12 / transform.scale;
      return [
        <path key={`click-${routeKey}`} d={d} fill="none" stroke={color}
          strokeWidth={clickSW}
          style={{ cursor: 'pointer', pointerEvents: 'all' }} opacity={0}
          onClick={(e) => handleDimmedRouteClick(e, routeKey)}
        />,
        <path key={`dimmed-${routeKey}`} d={d} fill="none" stroke={color}
          strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
          opacity={0.22}
          vectorEffect="non-scaling-stroke"
          style={{ pointerEvents: 'none' }}
        />,
      ];
    });
  }, [schematicData, visibleRoutes, showDimmedRoutes, theme, handleDimmedRouteClick, transform.scale]);

  // ---- 路線パス要素（1 path per route · transform非依存） ----
  const routePathElements = useMemo(() => {
    const hasFilter = highlightedRouteKeys !== null;
    const { stationPos } = schematicData;

    const sortedKeys = [...DIAGRAM_ROUTE_KEYS].sort((a, b) =>
      Number(highlightedRouteKeys?.has(a) ?? false) - Number(highlightedRouteKeys?.has(b) ?? false)
    );

    return sortedKeys.flatMap(routeKey => {
      if (!visibleRoutes.has(routeKey)) return [];
      if (hasFilter && !highlightedRouteKeys!.has(routeKey)) return [];

      const stns = routes[routeKey] as any[];
      if (!stns?.length) return [];

      const color = adjustRouteColorForTheme(routeColors[routeKey] ?? '#888', theme);
      const sw = hasFilter ? 3 : 2;

      let d = '';
      let prevPos: [number, number] | null = null;
      for (let i = 0; i < stns.length; i++) {
        const pos = stationPos.get(stns[i].name);
        if (!pos) { prevPos = null; continue; }
        const [x, y] = pos;
        if (prevPos === null) {
          d += `M${x.toFixed(1)},${y.toFixed(1)}`;
        } else {
          const [px, py] = prevPos;
          if (Math.abs(x - px) < 0.5 && Math.abs(y - py) < 0.5) { prevPos = pos; continue; }
          d += `L${x.toFixed(1)},${y.toFixed(1)}`;
        }
        prevPos = pos;
      }

      if (!d || d.length < 3) return [];

      return [<path key={routeKey} d={d} fill="none" stroke={color} strokeWidth={sw}
        strokeLinecap="round" strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ cursor: 'pointer' }}
        onClick={(e) => handleVisibleRouteClick(e, routeKey)}
      />];
    });
  }, [schematicData, visibleRoutes, highlightedRouteKeys, theme, handleVisibleRouteClick]);

  // ---- 駅レイアウト計算（スケール非依存） ----
  const stationLayout = useMemo(() => {
    const { stationPos, transferStations } = schematicData;
    const hasFilter = highlightedRouteKeys !== null;

    function textW(name: string): number {
      let w = 0;
      for (const ch of name) w += ch.charCodeAt(0) > 127 ? REF_FS : REF_FS * 0.55;
      return w;
    }

    const CELL = REF_LH * 3;
    const grid = new Map<string, Array<[number, number, number, number]>>();

    function addBox(box: [number, number, number, number]) {
      const [x0, y0, x1, y1] = box;
      for (let gx = Math.floor(x0 / CELL); gx <= Math.ceil(x1 / CELL); gx++) {
        for (let gy = Math.floor(y0 / CELL); gy <= Math.ceil(y1 / CELL); gy++) {
          const k = `${gx},${gy}`;
          if (!grid.has(k)) grid.set(k, []);
          grid.get(k)!.push(box);
        }
      }
    }

    function hits(lx: number, ly: number, lw: number): boolean {
      const x1 = lx + lw, y1 = ly + REF_LH;
      for (let gx = Math.floor(lx / CELL); gx <= Math.ceil(x1 / CELL); gx++) {
        for (let gy = Math.floor(ly / CELL); gy <= Math.ceil(y1 / CELL); gy++) {
          for (const [px, py, px1, py1] of grid.get(`${gx},${gy}`) ?? []) {
            if (lx < px1 + REF_GAP && x1 + REF_GAP > px && ly < py1 + REF_GAP && y1 + REF_GAP > py) return true;
          }
        }
      }
      return false;
    }

    const DIRS: Array<[number, number]> = [
      [1, 0], [-1, 0], [0, -1], [0, 1],
      [1, -1], [-1, -1], [1, 1], [-1, 1],
    ];

    function labelPos(sx: number, sy: number, lw: number, r: number, dx: number, dy: number, step: number): [number, number] {
      const off = r + 2 + step * (REF_LH + REF_GAP);
      const lx = dx > 0 ? sx + off : dx < 0 ? sx - off - lw : sx - lw / 2;
      const ly = dy < 0 ? sy - off - REF_LH : dy > 0 ? sy + off : sy - REF_LH * 0.5;
      return [lx, ly];
    }

    const stations: Array<{ name: string; sx: number; sy: number; isTransfer: boolean; routeKey: RouteKey }> = [];
    const seen = new Set<string>();

    DIAGRAM_ROUTE_KEYS.forEach(routeKey => {
      if (!visibleRoutes.has(routeKey)) return;
      if (hasFilter && !highlightedRouteKeys!.has(routeKey)) return;
      const stns = routes[routeKey] as any[];
      stns?.forEach((st: any) => {
        if (seen.has(st.name)) return;
        seen.add(st.name);
        const pos = stationPos.get(st.name);
        if (!pos) return;
        stations.push({ name: st.name, sx: pos[0], sy: pos[1], isTransfer: transferStations.has(st.name), routeKey });
      });
    });
    stations.sort((a, b) => {
      if (a.isTransfer !== b.isTransfer) return a.isTransfer ? -1 : 1;
      return 0;
    });

    const placements = new Map<string, [number, number, boolean, number, number]>();
    stations.forEach(({ name, sx, sy, isTransfer }) => {
      const lw = textW(name);
      const r = isTransfer ? REF_R_TRANSFER : REF_R_REGULAR;
      let found = false;
      outer: for (let step = 0; step <= 8; step++) {
        for (const [dx, dy] of DIRS) {
          const [lx, ly] = labelPos(sx, sy, lw, r, dx, dy, step);
          if (!hits(lx, ly, lw)) {
            addBox([lx, ly, lx + lw, ly + REF_LH]);
            const anchorX = sx + (lx > sx ? r : lx + lw < sx ? -r : 0);
            const anchorY = sy + (ly + REF_LH < sy ? -r : ly > sy ? r : 0);
            placements.set(name, [lx, ly, step > 0 || dx !== 1 || dy !== 0, anchorX, anchorY]);
            found = true;
            break outer;
          }
        }
      }
      if (!found) {
        const [lx, ly] = labelPos(sx, sy, lw, r, 1, 0, 9);
        addBox([lx, ly, lx + lw, ly + REF_LH]);
        placements.set(name, [lx, ly, true, sx + r, sy]);
      }
    });

    return { stations, placements };
  }, [schematicData, visibleRoutes, highlightedRouteKeys]);

  // ---- 駅ドット（スケール非依存・ズーム中も安定） ----
  const stationDotElements = useMemo(() => {
    const colors = getThemeColors(theme);
    const { stations } = stationLayout;

    return stations.map(({ name, sx, sy, isTransfer, routeKey }) => {
      const r = isTransfer ? REF_R_TRANSFER : REF_R_REGULAR;
      const routeColor = adjustRouteColorForTheme(routeColors[routeKey] ?? colors.textMuted, theme);
      return (
        <circle key={name} cx={sx} cy={sy} r={r}
          fill={isTransfer ? colors.surfaceElevated : routeColor}
          stroke={isTransfer ? colors.textSecondary : 'none'}
          strokeWidth={isTransfer ? 0.8 : 0}
        />
      );
    });
  }, [stationLayout, theme]);

  // ---- 駅ラベル（スクリーン空間・常時固定12px） ----
  const labelElements = useMemo(() => {
    if (!showStationNames) return null;
    const colors = getThemeColors(theme);
    const { stations, placements } = stationLayout;
    const { x: tx, y: ty, scale: s } = transform;

    if (s < 0.05) return null;

    const texts: React.ReactElement[] = [];
    for (const { name, sx, sy, isTransfer } of stations) {
      if (s < 0.09 && !isTransfer) continue;

      const screenSx = sx * s + tx;
      const screenSy = sy * s + ty;
      if (screenSx < -60 || screenSx > containerSize.w + 60) continue;
      if (screenSy < -60 || screenSy > containerSize.h + 60) continue;

      const placement = placements.get(name);
      if (!placement) continue;
      const [lx, ly] = placement;

      texts.push(
        <text key={name}
          x={lx * s + tx} y={ly * s + ty + SCREEN_FS}
          fontSize={SCREEN_FS}
          fontWeight={isTransfer ? 'bold' : 'normal'}
          fill={isTransfer ? colors.text : colors.textSecondary}
          stroke={colors.background} strokeWidth={1.5} paintOrder="stroke"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {name}
        </text>
      );
    }
    return texts;
  }, [stationLayout, transform, containerSize, theme, showStationNames]);

  // ---- コンテナサイズ追跡 ----
  useEffect(() => {
    const area = mapAreaRef.current;
    if (!area) return;
    const ro = new ResizeObserver(([e]) => {
      setContainerSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(area);
    return () => ro.disconnect();
  }, []);

  // ---- 初期表示: 新宿を中央に（実コンテナサイズが確定してから設定） ----
  // ユーザーが手動でパンしたかどうかを記録
  const userPannedRef = useRef(false);
  useEffect(() => {
    // ユーザーが既に操作していたら自動リセットしない
    if (userPannedRef.current) return;
    // 実サイズが確定していない(デフォルト800x600のまま)は待つ
    if (containerSize.w === 800 && containerSize.h === 600) return;
    const initialScale = 0.08;
    setTransform({
      x: containerSize.w / 2 - CANVAS_CX * initialScale,
      y: containerSize.h / 2 - CANVAS_CY * initialScale,
      scale: initialScale,
    });
  }, [containerSize]);

  // ---- パン操作 ----
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    userPannedRef.current = true;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => { isPanning.current = false; }, []);

  // ---- ホイールズーム（カーソル基準） ----
  useEffect(() => {
    const area = mapAreaRef.current;
    if (!area) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = area.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      setTransform(t => {
        const newScale = Math.max(0.03, Math.min(8, t.scale * factor));
        const svgX = (mouseX - t.x) / t.scale;
        const svgY = (mouseY - t.y) / t.scale;
        return { x: mouseX - svgX * newScale, y: mouseY - svgY * newScale, scale: newScale };
      });
    };
    area.addEventListener('wheel', onWheel, { passive: false });
    return () => area.removeEventListener('wheel', onWheel);
  }, []);

  // ---- タッチ操作（1本指パン・2本指ピンチ） ----
  useEffect(() => {
    const area = mapAreaRef.current;
    if (!area) return;
    let lastTouches: TouchList | null = null;

    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); lastTouches = e.touches; };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!lastTouches) return;
      userPannedRef.current = true;
      const rect = area.getBoundingClientRect();
      if (e.touches.length === 1 && lastTouches.length === 1) {
        const dx = e.touches[0].clientX - lastTouches[0].clientX;
        const dy = e.touches[0].clientY - lastTouches[0].clientY;
        setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
      } else if (e.touches.length === 2 && lastTouches.length >= 2) {
        const prevDist = Math.hypot(
          lastTouches[0].clientX - lastTouches[1].clientX,
          lastTouches[0].clientY - lastTouches[1].clientY,
        );
        const newDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        if (prevDist < 1) { lastTouches = e.touches; return; }
        const factor = newDist / prevDist;
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
        setTransform(t => {
          const newScale = Math.max(0.03, Math.min(8, t.scale * factor));
          const svgX = (cx - t.x) / t.scale;
          const svgY = (cy - t.y) / t.scale;
          return { x: cx - svgX * newScale, y: cy - svgY * newScale, scale: newScale };
        });
      }
      lastTouches = e.touches;
    };
    const onTouchEnd = () => { lastTouches = null; };

    area.addEventListener('touchstart', onTouchStart, { passive: false });
    area.addEventListener('touchmove', onTouchMove, { passive: false });
    area.addEventListener('touchend', onTouchEnd);
    return () => {
      area.removeEventListener('touchstart', onTouchStart);
      area.removeEventListener('touchmove', onTouchMove);
      area.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // ---- 出発/到着駅の中間にビューをセンタリング ----
  useEffect(() => {
    const area = mapAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    if (rect.width === 0) return;
    const depPos = schematicData.stationPos.get(departure) ?? null;
    const arrPos = schematicData.stationPos.get(arrival) ?? null;
    if (!depPos && !arrPos) return;
    const cx = depPos && arrPos ? (depPos[0] + arrPos[0]) / 2 : (depPos ?? arrPos)![0];
    const cy = depPos && arrPos ? (depPos[1] + arrPos[1]) / 2 : (depPos ?? arrPos)![1];
    let scale = 0.35;
    if (depPos && arrPos) {
      const span = Math.max(Math.abs(depPos[0] - arrPos[0]), Math.abs(depPos[1] - arrPos[1]), 400);
      scale = Math.min(0.6, Math.max(0.1, Math.min(rect.width, rect.height) * 0.5 / span));
    }
    setTransform({ x: rect.width / 2 - cx * scale, y: rect.height / 2 - cy * scale, scale });
  }, [departure, arrival, schematicData]);

  const colors = getThemeColors(theme);
  const mapBg = theme === 'dark' ? '#1a1f1a' : '#f0f4f0';
  const depSVGPos = schematicData.stationPos.get(departure) ?? null;
  const arrSVGPos = schematicData.stationPos.get(arrival) ?? null;

  const depScreenX = depSVGPos ? depSVGPos[0] * transform.scale + transform.x : null;
  const depScreenY = depSVGPos ? depSVGPos[1] * transform.scale + transform.y : null;
  const arrScreenX = arrSVGPos ? arrSVGPos[0] * transform.scale + transform.x : null;
  const arrScreenY = arrSVGPos ? arrSVGPos[1] * transform.scale + transform.y : null;
  const depColor = colors.success;
  const arrColor = theme === 'dark' ? '#ff5555' : '#F44336';

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', fontFamily: 'sans-serif', background: colors.background }}>
      <div
        ref={mapAreaRef}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', background: colors.surface }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => setDimmedTooltip(null)}
      >
        <div style={{
          position: 'absolute', bottom: 8, right: 8, zIndex: 20,
          background: colors.surfaceElevated, border: `1px solid ${colors.border}`,
          borderRadius: '4px', padding: '4px 7px', fontSize: '10px',
          color: colors.textSecondary, boxShadow: `0 1px 4px ${colors.shadow}`,
          display: 'none',
        }} className="diagram-hint">
          スクロール: ズーム ｜ ドラッグ: 移動
        </div>
        <style>{`@media (min-width: 600px) { .diagram-hint { display: block !important; } }`}</style>

        <svg style={{ width: '100%', height: '100%', cursor: isPanning.current ? 'grabbing' : 'grab', display: 'block' }}>
          {/* スケール変換グループ: 路線・ドットのみ（transform非依存メモで安定） */}
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
            <rect x={-3000} y={1000} width={16000} height={12000} fill={mapBg} />
            {dimmedPathElements}
            {routePathElements}
            {stationDotElements}
          </g>

          {/* ラベル（スクリーン空間・常時12px） */}
          {labelElements}

          {/* 出発駅マーカー（スクリーン空間） */}
          {depScreenX !== null && depScreenY !== null && (
            <g style={{ pointerEvents: 'none' }}>
              <circle cx={depScreenX} cy={depScreenY} r={MARKER_R}
                fill={depColor} stroke={colors.background} strokeWidth={1.5} />
              <text x={depScreenX + MARKER_R + 3} y={depScreenY + 4}
                fontSize={SCREEN_FS} fontWeight="bold" fill={depColor}
                stroke={colors.background} strokeWidth={2} paintOrder="stroke"
                style={{ userSelect: 'none' }}
              >{departure}</text>
            </g>
          )}

          {/* 到着駅マーカー（スクリーン空間） */}
          {arrScreenX !== null && arrScreenY !== null && (
            <g style={{ pointerEvents: 'none' }}>
              <circle cx={arrScreenX} cy={arrScreenY} r={MARKER_R}
                fill={arrColor} stroke={colors.background} strokeWidth={1.5} />
              <text x={arrScreenX + MARKER_R + 3} y={arrScreenY + 4}
                fontSize={SCREEN_FS} fontWeight="bold" fill={arrColor}
                stroke={colors.background} strokeWidth={2} paintOrder="stroke"
                style={{ userSelect: 'none' }}
              >{arrival}</text>
            </g>
          )}
        </svg>

        {/* 非表示路線の半透明表示トグルボタン */}
        <button
          onClick={e => { e.stopPropagation(); setInternalShowDimmed(v => !v); }}
          style={{
            position: 'absolute', bottom: 8, left: 8, zIndex: 20,
            background: colors.surfaceElevated,
            border: `1px solid ${showDimmedRoutes ? colors.border : colors.borderLight}`,
            borderRadius: '4px', padding: '4px 8px', fontSize: '11px',
            color: showDimmedRoutes ? colors.text : colors.textSecondary,
            cursor: 'pointer', boxShadow: `0 1px 4px ${colors.shadow}`,
            opacity: showDimmedRoutes ? 1 : 0.6,
          }}
        >
          {language === 'english'
            ? (showDimmedRoutes ? 'All routes: ON' : 'All routes: OFF')
            : (showDimmedRoutes ? '全路線: 表示' : '全路線: 非表示')}
        </button>

        {/* 非表示路線ツールチップ */}
        {dimmedTooltip && (() => {
          const TW = 180;
          const TH = 78;
          const rawX = dimmedTooltip.x + 12;
          const rawY = dimmedTooltip.y + 12;
          const tx = rawX + TW > containerSize.w - 8 ? dimmedTooltip.x - TW - 4 : rawX;
          const ty = rawY + TH > containerSize.h - 8 ? dimmedTooltip.y - TH - 4 : rawY;
          const displayName = translateRoute(
            (routeNames as Record<string, string>)[dimmedTooltip.routeKey] ?? dimmedTooltip.routeKey,
            language
          );
          return (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', left: tx, top: ty, zIndex: 50,
                width: TW, backgroundColor: colors.surfaceElevated,
                border: `1px solid ${colors.border}`, borderRadius: '8px',
                boxShadow: `0 4px 16px ${colors.shadow}`,
                overflow: 'hidden',
              }}
            >
              <div style={{
                padding: '7px 10px 6px',
                borderBottom: `1px solid ${colors.borderLight}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px', color: colors.text }}>
                  {displayName}
                </span>
                <span
                  onClick={() => setDimmedTooltip(null)}
                  style={{ fontSize: '12px', color: colors.textSecondary, cursor: 'pointer', padding: '0 2px' }}
                >✕</span>
              </div>
              <div style={{ padding: '8px 10px' }}>
                {dimmedTooltip.isVisible ? (
                  <button
                    onClick={() => { onHideRoute?.(dimmedTooltip.routeKey); setDimmedTooltip(null); }}
                    style={{
                      backgroundColor: '#F44336', color: 'white', border: 'none',
                      padding: '3px 8px', borderRadius: '3px', cursor: 'pointer',
                      fontSize: '11px', width: '100%',
                    }}
                  >
                    {language === 'english' ? 'Hide this route' : 'この路線を非表示にする'}
                  </button>
                ) : (
                  <button
                    onClick={() => { onToggleRoute?.(dimmedTooltip.routeKey); setDimmedTooltip(null); }}
                    style={{
                      backgroundColor: '#4CAF50', color: 'white', border: 'none',
                      padding: '3px 8px', borderRadius: '3px', cursor: 'pointer',
                      fontSize: '11px', width: '100%',
                    }}
                  >
                    {language === 'english' ? 'Show this route' : 'この路線を表示する'}
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default DiagramMap;
