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

// ---- 地理座標系 (新宿アンカー・無限拡張キャンバス) ----
const SCALE_PX = 12000;                              // px / 緯度1°
const LNG_COS = Math.cos(35.57 * Math.PI / 180);    // ~0.813 (東京緯度での経度補正)
const ANCHOR_LNG = 139.7006;                         // 新宿
const ANCHOR_LAT = 35.6896;
const CANVAS_CX = 5000;
const CANVAS_CY = 5000;

function geoX(lng: number): number {
  return CANVAS_CX + (lng - ANCHOR_LNG) * LNG_COS * SCALE_PX;
}
function geoY(lat: number): number {
  return CANVAS_CY - (lat - ANCHOR_LAT) * SCALE_PX;
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
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.08 });
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const mapAreaRef = useRef<HTMLDivElement>(null);

  // ---- 地理座標ベースの駅レイアウト計算 ----
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

  // ---- 路線ライン要素 ----
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
          <line key={`${routeKey}-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth={sw}
            strokeLinecap="round"
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
      const [lx, ly, , ,] = placement;
      const r = isTransfer ? rTransfer : rRegular;
      return (
        <g key={name}>
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

  // ---- 初期表示: 新宿を中央に ----
  useEffect(() => {
    const area = mapAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    if (rect.width === 0) return;
    const initialScale = 0.08;
    setTransform({
      x: rect.width / 2 - CANVAS_CX * initialScale,
      y: rect.height / 2 - CANVAS_CY * initialScale,
      scale: initialScale,
    });
  }, []);

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
            {/* 背景 (全駅をカバーする大領域) */}
            <rect x={-3000} y={1000} width={16000} height={12000} fill={mapBg} />

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
