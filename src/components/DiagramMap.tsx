'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { routes, routeColors, type RouteKey } from '../data/routes';
import { getThemeColors, adjustRouteColorForTheme } from '../contexts/ThemeContext';

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

// ---- SVGキャンバス & 地理範囲 ----
const SVG_W = 1400;
const SVG_H = 900;
const LAYOUT_PAD = 80;
const GEO_MIN_LNG = 139.10, GEO_MAX_LNG = 140.12;
const GEO_MIN_LAT = 35.22, GEO_MAX_LAT = 35.92;

function geoX(lng: number): number {
  return LAYOUT_PAD + (lng - GEO_MIN_LNG) / (GEO_MAX_LNG - GEO_MIN_LNG) * (SVG_W - 2 * LAYOUT_PAD);
}
function geoY(lat: number): number {
  return LAYOUT_PAD + (GEO_MAX_LAT - lat) / (GEO_MAX_LAT - GEO_MIN_LAT) * (SVG_H - 2 * LAYOUT_PAD);
}

// 地理座標とトラック座標のブレンド率 (0=純スケマティック, 1=純地理)
const BLEND = 0.35;

// セグメントを 0°/45°/90° に丸めたoctilinear path を生成
function makeOctilinearPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1, dy = y2 - y1;
  const adx = Math.abs(dx), ady = Math.abs(dy);
  if (adx < 0.5 || ady < 0.5 || Math.abs(adx - ady) < 0.5) {
    return `M${x1},${y1} L${x2},${y2}`;
  }
  const sx = Math.sign(dx), sy = Math.sign(dy);
  const diagSteps = Math.min(adx, ady);
  const mx = x1 + sx * diagSteps, my = y1 + sy * diagSteps;
  return `M${x1},${y1} L${mx},${my} L${x2},${y2}`;
}

// 路線の主方向: 経度幅 >= 緯度幅*1.1 → 横(H)、それ以外 → 縦(V)
function classifyRoute(k: RouteKey): 'H' | 'V' {
  const stns = routes[k] as Array<{ lat: number; lng: number }> | undefined;
  if (!stns?.length) return 'H';
  const latR = Math.max(...stns.map(s => s.lat)) - Math.min(...stns.map(s => s.lat));
  const lngR = Math.max(...stns.map(s => s.lng)) - Math.min(...stns.map(s => s.lng));
  return lngR >= latR * 1.1 ? 'H' : 'V';
}

// ---- Props ----
interface DiagramMapProps {
  visibleRoutes?: Set<RouteKey>;
  highlightedRouteKeys?: Set<RouteKey> | null;
  departure?: string;
  arrival?: string;
  theme?: 'light' | 'dark';
  language?: 'japanese' | 'english';
  showStationNames?: boolean;
}

const DiagramMap: React.FC<DiagramMapProps> = ({
  visibleRoutes: externalVisibleRoutes,
  highlightedRouteKeys = null,
  departure = '',
  arrival = '',
  theme = 'light',
  language = 'japanese',
  showStationNames = true,
}) => {
  const visibleRoutes = externalVisibleRoutes ?? new Set(DIAGRAM_ROUTE_KEYS);
  const [transform, setTransform] = useState({ x: 10, y: 10, scale: 0.5 });
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const mapAreaRef = useRef<HTMLDivElement>(null);

  // ---- スケマティックレイアウト計算 ----
  // H路線: y固定の水平ライン、V路線: x固定の垂直ライン
  // H-V乗換駅は両トラックの交点に配置
  const schematicData = useMemo(() => {
    const activeRoutes = DIAGRAM_ROUTE_KEYS.filter(k => visibleRoutes.has(k));

    const hRoutes: RouteKey[] = [];
    const vRoutes: RouteKey[] = [];
    activeRoutes.forEach(k => {
      if (classifyRoute(k) === 'H') hRoutes.push(k);
      else vRoutes.push(k);
    });

    // H路線: 平均緯度降順（北=上=小y）、V路線: 平均経度昇順（西=左=小x）
    const avgLat = (k: RouteKey) => {
      const s = routes[k] as any[];
      return s.reduce((sum: number, st: any) => sum + st.lat, 0) / s.length;
    };
    const avgLng = (k: RouteKey) => {
      const s = routes[k] as any[];
      return s.reduce((sum: number, st: any) => sum + st.lng, 0) / s.length;
    };
    hRoutes.sort((a, b) => avgLat(b) - avgLat(a));
    vRoutes.sort((a, b) => avgLng(a) - avgLng(b));

    const nH = hRoutes.length;
    const nV = vRoutes.length;
    const hStep = nH > 1 ? (SVG_H - 2 * LAYOUT_PAD) / (nH - 1) : 0;
    const vStep = nV > 1 ? (SVG_W - 2 * LAYOUT_PAD) / (nV - 1) : 0;

    const hTrack = new Map<RouteKey, number>(); // route → y座標
    const vTrack = new Map<RouteKey, number>(); // route → x座標
    hRoutes.forEach((k, i) => hTrack.set(k, nH <= 1 ? SVG_H / 2 : LAYOUT_PAD + i * hStep));
    vRoutes.forEach((k, i) => vTrack.set(k, nV <= 1 ? SVG_W / 2 : LAYOUT_PAD + i * vStep));

    // 駅ごとのH/V路線と地理座標を収集
    const stationGeo = new Map<string, { lat: number; lng: number }>();
    const stationHRoute = new Map<string, RouteKey>(); // primary H route
    const stationVRoute = new Map<string, RouteKey>(); // primary V route

    activeRoutes.forEach(k => {
      const stns = routes[k] as any[];
      const isH = hTrack.has(k);
      stns?.forEach((st: any) => {
        if (!stationGeo.has(st.name)) stationGeo.set(st.name, { lat: st.lat, lng: st.lng });
        if (isH && !stationHRoute.has(st.name)) stationHRoute.set(st.name, k);
        if (!isH && !stationVRoute.has(st.name)) stationVRoute.set(st.name, k);
      });
    });

    // 駅の位置: スケマティックトラックと地理座標をBLENDで混合
    // H-V乗換駅は交点付近、H専用は水平トラック付近、V専用は垂直トラック付近
    const stationPos = new Map<string, [number, number]>();
    const allNames = new Set([...stationHRoute.keys(), ...stationVRoute.keys()]);

    allNames.forEach(name => {
      const hR = stationHRoute.get(name);
      const vR = stationVRoute.get(name);
      const geo = stationGeo.get(name)!;
      const gx = geoX(geo.lng), gy = geoY(geo.lat);
      if (hR && vR) {
        // H-V乗換: トラック交点 × (1-BLEND) + 地理 × BLEND
        const tx = vTrack.get(vR)!, ty = hTrack.get(hR)!;
        stationPos.set(name, [tx * (1 - BLEND) + gx * BLEND, ty * (1 - BLEND) + gy * BLEND]);
      } else if (hR) {
        // H専用: x=地理経度、y=トラック×(1-BLEND)+地理×BLEND
        stationPos.set(name, [gx, hTrack.get(hR)! * (1 - BLEND) + gy * BLEND]);
      } else if (vR) {
        // V専用: x=トラック×(1-BLEND)+地理×BLEND、y=地理緯度
        stationPos.set(name, [vTrack.get(vR)! * (1 - BLEND) + gx * BLEND, gy]);
      }
    });

    // 乗換駅: 2路線以上に所属する駅
    const transferStations = new Set<string>();
    allNames.forEach(name => {
      const total = (stationHRoute.has(name) ? 1 : 0) + (stationVRoute.has(name) ? 1 : 0);
      if (total >= 2) transferStations.add(name);
    });

    return { stationPos, hTrack, vTrack, hRoutes, vRoutes, transferStations, stationVRoute, stationHRoute };
  }, [visibleRoutes]);

  // ---- 路線ライン要素（octilinear: 0°/45°/90°で接続） ----
  const routeLineElements = useMemo(() => {
    const hasFilter = highlightedRouteKeys !== null;
    const elements: React.ReactElement[] = [];
    const { stationPos } = schematicData;

    const sortedKeys = [...DIAGRAM_ROUTE_KEYS].sort((a, b) =>
      Number(highlightedRouteKeys?.has(a) ?? false) - Number(highlightedRouteKeys?.has(b) ?? false)
    );

    sortedKeys.forEach(routeKey => {
      if (!visibleRoutes.has(routeKey)) return;
      if (hasFilter && !highlightedRouteKeys!.has(routeKey)) return;

      const stns = routes[routeKey] as any[];
      if (!stns?.length) return;

      const color = adjustRouteColorForTheme(routeColors[routeKey] ?? '#888', theme);
      const sw = hasFilter ? 3 : 2;

      for (let i = 0; i < stns.length - 1; i++) {
        const pos1 = stationPos.get(stns[i].name);
        const pos2 = stationPos.get(stns[i + 1].name);
        if (!pos1 || !pos2) continue;
        const [x1, y1] = pos1, [x2, y2] = pos2;
        if (Math.abs(x1 - x2) < 0.5 && Math.abs(y1 - y2) < 0.5) continue;

        elements.push(
          <path key={`${routeKey}-${i}`}
            d={makeOctilinearPath(x1, y1, x2, y2)}
            fill="none" stroke={color} strokeWidth={sw}
            strokeLinecap="round" strokeLinejoin="round"
          />
        );
      }
    });
    return elements;
  }, [schematicData, visibleRoutes, highlightedRouteKeys, theme]);

  // ---- ラベル配置定数（スケール非依存・固定基準） ----
  const REF_FS = 5.5;
  const REF_LH = REF_FS * 1.5;
  const REF_GAP = 0.8;
  const REF_R_TRANSFER = 2.5;
  const REF_R_REGULAR = 1.5;

  // ---- 駅レイアウト計算（スケール非依存・位置固定） ----
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

    // 表示対象駅を収集（重複排除・乗換駅優先ソート）
    const stations: Array<{ name: string; sx: number; sy: number; isTransfer: boolean }> = [];
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
        stations.push({ name: st.name, sx: pos[0], sy: pos[1], isTransfer: transferStations.has(st.name) });
      });
    });
    stations.sort((a, b) => {
      if (a.isTransfer !== b.isTransfer) return a.isTransfer ? -1 : 1;
      return 0;
    });

    // ラベル配置: 8方向 × 最大8ステップ
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

  // ---- 駅SVG要素（スケール依存のサイズのみ更新・位置固定） ----
  const stationElements = useMemo(() => {
    const colors = getThemeColors(theme);
    const s = transform.scale;
    const rTransfer = Math.max(1.5, REF_R_TRANSFER / s);
    const rRegular = Math.max(1.0, REF_R_REGULAR / s);
    const fs = Math.max(3.5, Math.min(9, REF_FS / s));
    const sw = 1.5 / s;
    const { stations, placements } = stationLayout;

    if (!showStationNames) {
      return stations.map(({ name, sx, sy, isTransfer }) => {
        const r = isTransfer ? rTransfer : rRegular;
        return (
          <g key={name}>
            <circle cx={sx} cy={sy} r={r}
              fill={isTransfer ? colors.surfaceElevated : colors.textMuted}
              stroke={isTransfer ? colors.textSecondary : 'none'}
              strokeWidth={isTransfer ? 0.8 / s : 0}
            />
          </g>
        );
      });
    }

    return stations.map(({ name, sx, sy, isTransfer }) => {
      const placement = placements.get(name);
      if (!placement) return null;
      const [lx, ly, displaced, anchorX, anchorY] = placement;
      const r = isTransfer ? rTransfer : rRegular;
      return (
        <g key={name}>
          {displaced && (
            <line x1={anchorX} y1={anchorY} x2={lx + REF_FS * 2} y2={ly + REF_LH * 0.5}
              stroke={colors.textMuted} strokeWidth={0.5 / s} strokeOpacity={0.4}
            />
          )}
          <circle cx={sx} cy={sy} r={r}
            fill={isTransfer ? colors.surfaceElevated : colors.textMuted}
            stroke={isTransfer ? colors.textSecondary : 'none'}
            strokeWidth={isTransfer ? 0.8 / s : 0}
          />
          <text
            x={lx} y={ly + fs}
            fontSize={fs}
            fontWeight={isTransfer ? 'bold' : 'normal'}
            fill={isTransfer ? colors.text : colors.textSecondary}
            stroke={colors.background} strokeWidth={sw} paintOrder="stroke"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {name}
          </text>
        </g>
      );
    });
  }, [stationLayout, transform.scale, theme, showStationNames]);

  // ---- パン操作 ----
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
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
        const newScale = Math.max(0.12, Math.min(8, t.scale * factor));
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
          const newScale = Math.max(0.12, Math.min(8, t.scale * factor));
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
    const scale = 0.6;
    setTransform({ x: rect.width / 2 - cx * scale, y: rect.height / 2 - cy * scale, scale });
  }, [departure, arrival, schematicData]);

  const colors = getThemeColors(theme);
  const mapBg = theme === 'dark' ? '#1a1f1a' : '#f0f4f0';
  const depSVGPos = schematicData.stationPos.get(departure) ?? null;
  const arrSVGPos = schematicData.stationPos.get(arrival) ?? null;

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', fontFamily: 'sans-serif', background: colors.background }}>
      <div
        ref={mapAreaRef}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', background: colors.surface }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 操作ヒント（PC幅のみ） */}
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
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
            {/* 背景 */}
            <rect x={0} y={0} width={SVG_W} height={SVG_H} fill={mapBg} rx={4} />

            {/* 路線ライン */}
            {routeLineElements}

            {/* 駅マーカー・ラベル */}
            {stationElements}

            {/* 出発駅マーカー */}
            {depSVGPos && (() => {
              const s = transform.scale;
              const r = Math.max(3, 6 / s);
              const fs = Math.max(5, Math.min(12, 8 / s));
              const c = colors.success;
              return (
                <g style={{ pointerEvents: 'none' }}>
                  <circle cx={depSVGPos[0]} cy={depSVGPos[1]} r={r} fill={c} stroke={colors.background} strokeWidth={1.5 / s} />
                  <text x={depSVGPos[0] + r + 2 / s} y={depSVGPos[1] + fs * 0.35}
                    fontSize={fs} fontWeight="bold" fill={c}
                    stroke={colors.background} strokeWidth={2 / s} paintOrder="stroke"
                    style={{ userSelect: 'none' }}
                  >{departure}</text>
                </g>
              );
            })()}

            {/* 到着駅マーカー */}
            {arrSVGPos && (() => {
              const s = transform.scale;
              const r = Math.max(3, 6 / s);
              const fs = Math.max(5, Math.min(12, 8 / s));
              const c = theme === 'dark' ? '#ff5555' : '#F44336';
              return (
                <g style={{ pointerEvents: 'none' }}>
                  <circle cx={arrSVGPos[0]} cy={arrSVGPos[1]} r={r} fill={c} stroke={colors.background} strokeWidth={1.5 / s} />
                  <text x={arrSVGPos[0] + r + 2 / s} y={arrSVGPos[1] + fs * 0.35}
                    fontSize={fs} fontWeight="bold" fill={c}
                    stroke={colors.background} strokeWidth={2 / s} paintOrder="stroke"
                    style={{ userSelect: 'none' }}
                  >{arrival}</text>
                </g>
              );
            })()}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default DiagramMap;
