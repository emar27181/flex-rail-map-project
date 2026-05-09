'use client';

/**
 * DiagramMap - SVG路線図コンポーネント（仮実装）
 *
 * アルゴリズム:
 *   地理座標 → グリッド座標 (GRID_DEG ≈ 500m/格子) にスナップし、
 *   同一セグメントを共有する並走路線を法線方向へオフセット表示する。
 *
 * 今後の実装予定（参考文献）:
 *   - Octilinear schematization: 線を 45° の倍数に整列
 *     Nöllenburg & Wolff (2011) "Drawing and Labeling High-Quality Metro Maps
 *     by Mixed-Integer Programming" (IEEE TVCG)
 *   - 多目的最適化レイアウト:
 *     Stott et al. (2011) "Automatic Metro Map Layout Using Multicriteria
 *     Optimization" (IEEE TVCG)
 *   - 駅ラベル重なり回避（greedy / MIP）
 *   - 路線バンドル可視化 (Hurter et al. 2012)
 */

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';
import { getThemeColors, adjustRouteColorForTheme } from '../contexts/ThemeContext';
import layoutData from '../data/diagramLayouts/latest.json';

// ---- 表示対象路線（東京圏全路線） ----
const DIAGRAM_ROUTE_KEYS: RouteKey[] = [
  // JR東日本
  'yamanote', 'chuo', 'keihinTohoku', 'jrSobuLine', 'jrJobanLine',
  'jrSaikyoLine', 'jrTakasakiLine', 'jrTokaidoMainLine', 'jrMusashinoLine',
  'jrYokohamaLine', 'jrNanbuLine', 'jrSobuChiba', 'jrKeiyo',
  'jrOmeLine', 'jrHachikoLine', 'jrItsukaichiLine', 'jrUtsunomiyaLine', 'jrNegishiLine',
  'yokosukaLine',
  // 東京メトロ
  'ginzaLine', 'marunouchiLine', 'hibiyaLine', 'tozaiLine', 'chiyodaLine',
  'yurakuchoLine', 'hanzomonLine', 'nambokuLine', 'fukutoshinLine',
  // 都営地下鉄
  'toeiAsakusaLine', 'toeiMitaLine', 'toeiShinjukuLine', 'toeiOedoLine',
  // 小田急・京王
  'odakyuLine', 'odakyuEnoshimaLine', 'odakyuTamaLine',
  'keioLine', 'keioInokashiraLine', 'keioSagamiharaLine',
  // 東急
  'tokyuToyokoLine', 'tokyuDenEnToshiLine', 'tokyuMeguro',
  'tokyuOimachiLine', 'tokyuTamagawa', 'tokyuIkegami', 'tokyuSetagayaLine',
  // 西武・東武
  'seibuIkebukuroLine', 'seibuShinjukuLine',
  'tobuTojoLine', 'tobuIsesakiLine', 'tobuNikkoLine', 'tobuDaishiLine', 'tobuKameidoLine',
  // 京急・京成
  'keikyuLine', 'keikyuKurihamaLine', 'keikyuAirportLine',
  'keiseiMainLine', 'keiseiOshiageLine', 'hokusouLine',
  // 相鉄
  'sotetsuMainLine', 'sotetsuIzumino', 'sotetsuJRLine',
  // 新交通・モノレール
  'tokyoMonorail', 'rinkaiLine', 'yurikamomeLine', 'tsukubaExpress',
  'tamaMonorail', 'todenArakawaLine', 'nipporiToneriLiner',
  // 横浜・神奈川
  'yokohamaBlueLine', 'yokohamaGreenLine', 'shonanMonorail', 'enoshimaElectricRailway',
  // 埼玉・千葉
  'saitamaRailway', 'newShuttle', 'shinkeisei', 'toyoRapid',
];

// ---- 地理的範囲（東京圏全体） ----
const MIN_LAT = 35.22;
const MAX_LAT = 35.92;
const MIN_LNG = 139.10;
const MAX_LNG = 140.12;

// ---- グリッド設定 ----
const GRID_DEG = 0.005;  // 1グリッド ≈ 500m
const PAD = 8;

// 隣接駅間のグリッド距離分布から最適セルサイズを自動計算:
//   20パーセンタイル距離が TARGET_PX になるよう調整（近い駅がぎりぎり離れる）
function computeOptimalCellPx(): number {
  const dists: number[] = [];
  DIAGRAM_ROUTE_KEYS.forEach(routeKey => {
    const stationList = routes[routeKey] as Array<{ lat: number; lng: number }> | undefined;
    if (!stationList) return;
    for (let i = 0; i < stationList.length - 1; i++) {
      const gx1 = Math.round((stationList[i].lng - MIN_LNG) / GRID_DEG);
      const gy1 = Math.round((MAX_LAT - stationList[i].lat) / GRID_DEG);
      const gx2 = Math.round((stationList[i + 1].lng - MIN_LNG) / GRID_DEG);
      const gy2 = Math.round((MAX_LAT - stationList[i + 1].lat) / GRID_DEG);
      if (gx1 === gx2 && gy1 === gy2) continue;
      dists.push(Math.sqrt((gx2 - gx1) ** 2 + (gy2 - gy1) ** 2));
    }
  });
  dists.sort((a, b) => a - b);
  if (dists.length === 0) return 4;
  const TARGET_PX = 6; // 20パーセンタイルの駅ペアが TARGET_PX px 離れるようにする
  const p20 = dists[Math.floor(dists.length * 0.20)] ?? 1;
  return Math.max(3, Math.min(8, Math.round(TARGET_PX / Math.max(1, p20))));
}
const CELL_PX = computeOptimalCellPx();

const GX_MAX = Math.round((MAX_LNG - MIN_LNG) / GRID_DEG);
const GY_MAX = Math.round((MAX_LAT - MIN_LAT) / GRID_DEG);
const SVG_W = PAD * 2 + GX_MAX * CELL_PX;
const SVG_H = PAD * 2 + GY_MAX * CELL_PX;

const BASE_OFFSET_PX = 1.1;
// 路線数に応じて動的にオフセット量を調整: stroke幅(1.0px)とほぼ等しい間隔で並べる
function dynamicOffset(n: number): number {
  const maxTotalSpread = CELL_PX * 0.85;
  return Math.min(BASE_OFFSET_PX, maxTotalSpread / Math.max(1, n - 1));
}

// ---- ユーティリティ ----
function toGrid(lat: number, lng: number): [number, number] {
  return [
    Math.round((lng - MIN_LNG) / GRID_DEG),
    Math.round((MAX_LAT - lat) / GRID_DEG),
  ];
}

function gridToXY(gx: number, gy: number): [number, number] {
  return [PAD + gx * CELL_PX, PAD + gy * CELL_PX];
}

function normSegKey(gx1: number, gy1: number, gx2: number, gy2: number): string {
  if (gx1 > gx2 || (gx1 === gx2 && gy1 > gy2)) {
    return `${gx2},${gy2}|${gx1},${gy1}`;
  }
  return `${gx1},${gy1}|${gx2},${gy2}`;
}

// ---- オクチリニアパス生成 ----
// 実際の路線図の考え方: 2本の線分（斜め+直線 または 直線+斜め）で接続
// 線は必ず 0°/45°/90°/135° のいずれかになる
function makeOctilinearPath(
  x1: number, y1: number,
  x2: number, y2: number
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  // 既に水平・垂直・45°の場合はそのまま
  if (adx === 0 || ady === 0 || adx === ady) {
    return `M${x1},${y1} L${x2},${y2}`;
  }

  const sx = Math.sign(dx);
  const sy = Math.sign(dy);

  // 折れ曲がり点: 対角線部分を先に消化し、残りを直線
  // adx > ady → 斜め ady ステップ後に水平
  // adx < ady → 斜め adx ステップ後に垂直
  const diagSteps = Math.min(adx, ady);
  const mx = x1 + sx * diagSteps;
  const my = y1 + sy * diagSteps;

  return `M${x1},${y1} L${mx},${my} L${x2},${y2}`;
}

// ---- メインコンポーネント ----
interface DiagramMapProps {
  visibleRoutes?: Set<RouteKey>;
  departure?: string;
  arrival?: string;
  theme?: 'light' | 'dark';
  language?: 'japanese' | 'english';
}

const DiagramMap: React.FC<DiagramMapProps> = ({
  visibleRoutes: externalVisibleRoutes,
  departure = '横浜',
  arrival = '新宿',
  theme = 'light',
  language = 'japanese',
}) => {
  const visibleRoutes = externalVisibleRoutes ?? new Set(DIAGRAM_ROUTE_KEYS);
  const depStation = departure;
  const arrStation = arrival;
  const [transform, setTransform] = useState({ x: 20, y: 20, scale: 0.55 });
  const [showWipNote, setShowWipNote] = useState(false);

  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const mapAreaRef = useRef<HTMLDivElement>(null);

  // ---- 路線データをグリッド座標に変換（最適化済みレイアウトがあればそちらを優先） ----
  const prePos = (layoutData as { version: number; positions: Record<string, [number, number]> }).positions;
  const hasLayout = Object.keys(prePos).length > 0;

  const { routeGridData, segmentRouteMap, transferStations } = useMemo(() => {
    const segmentRouteMap = new Map<string, RouteKey[]>();
    const routeGridData = new Map<RouteKey, { grids: [number, number][]; names: string[] }>();
    const stationRouteCount = new Map<string, number>();

    DIAGRAM_ROUTE_KEYS.forEach(routeKey => {
      const stationList = routes[routeKey];
      if (!stationList) return;

      const grids: [number, number][] = [];
      const names: string[] = [];

      stationList.forEach((station: { lat: number; lng: number; name: string }) => {
        // 最適化済み位置があればそちらを使用、なければ地理座標から計算
        const optimized = hasLayout ? prePos[station.name] : null;
        grids.push(optimized ?? toGrid(station.lat, station.lng));
        names.push(station.name);
        stationRouteCount.set(station.name, (stationRouteCount.get(station.name) ?? 0) + 1);
      });

      routeGridData.set(routeKey, { grids, names });

      for (let i = 0; i < grids.length - 1; i++) {
        const [gx1, gy1] = grids[i];
        const [gx2, gy2] = grids[i + 1];
        if (gx1 === gx2 && gy1 === gy2) continue;
        const key = normSegKey(gx1, gy1, gx2, gy2);
        if (!segmentRouteMap.has(key)) segmentRouteMap.set(key, []);
        const existing = segmentRouteMap.get(key)!;
        if (!existing.includes(routeKey)) existing.push(routeKey);
      }
    });

    const transferStations = new Set<string>();
    stationRouteCount.forEach((count, name) => {
      if (count >= 2) transferStations.add(name);
    });

    return { routeGridData, segmentRouteMap, transferStations };
  }, []);

  // ---- セグメントごとの垂直オフセット計算（路線数に応じて動的スケール） ----
  const routeSegmentOffsets = useMemo(() => {
    const offsets = new Map<string, [number, number]>();
    segmentRouteMap.forEach((routeKeys, segKey) => {
      if (routeKeys.length <= 1) return;
      const [fromPart, toPart] = segKey.split('|');
      const [gx1, gy1] = fromPart.split(',').map(Number);
      const [gx2, gy2] = toPart.split(',').map(Number);
      const [sx1, sy1] = gridToXY(gx1, gy1);
      const [sx2, sy2] = gridToXY(gx2, gy2);
      const dx = sx2 - sx1;
      const dy = sy2 - sy1;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 0.001) return;
      const perpX = -dy / len;
      const perpY = dx / len;
      const n = routeKeys.length;
      const offsetStep = dynamicOffset(n);
      routeKeys.forEach((routeKey, idx) => {
        const t = (idx - (n - 1) / 2) * offsetStep;
        offsets.set(`${routeKey}|${segKey}`, [perpX * t, perpY * t]);
      });
    });
    return offsets;
  }, [segmentRouteMap]);

  // ---- 出発/到着駅の関連路線とSVG座標 ----
  const { depRouteSet, arrRouteSet, depSVGPos, arrSVGPos } = useMemo(() => {
    const depRouteSet = new Set<RouteKey>(
      DIAGRAM_ROUTE_KEYS.filter(k => (routes[k] as any[])?.some(s => s.name === depStation))
    );
    const arrRouteSet = new Set<RouteKey>(
      DIAGRAM_ROUTE_KEYS.filter(k => (routes[k] as any[])?.some(s => s.name === arrStation))
    );
    let depSVGPos: [number, number] | null = null;
    let arrSVGPos: [number, number] | null = null;
    for (const k of DIAGRAM_ROUTE_KEYS) {
      const depSt = (routes[k] as any[])?.find(s => s.name === depStation);
      if (depSt && !depSVGPos) { const [gx, gy] = toGrid(depSt.lat, depSt.lng); depSVGPos = gridToXY(gx, gy); }
      const arrSt = (routes[k] as any[])?.find(s => s.name === arrStation);
      if (arrSt && !arrSVGPos) { const [gx, gy] = toGrid(arrSt.lat, arrSt.lng); arrSVGPos = gridToXY(gx, gy); }
      if (depSVGPos && arrSVGPos) break;
    }
    return { depRouteSet, arrRouteSet, depSVGPos, arrSVGPos };
  }, [depStation, arrStation]);

  // ---- 路線ライン要素生成（オクチリニア: 0°/45°/90°整列） ----
  const routeLineElements = useMemo(() => {
    const hasFilter = depRouteSet.size > 0 || arrRouteSet.size > 0;
    const elements: React.ReactElement[] = [];
    // 非ハイライト路線を先に描画（背面）、ハイライト路線を後に描画（前面）
    const sortedKeys = [...DIAGRAM_ROUTE_KEYS].sort((a, b) => {
      const aHi = depRouteSet.has(a) || arrRouteSet.has(a);
      const bHi = depRouteSet.has(b) || arrRouteSet.has(b);
      return Number(aHi) - Number(bHi);
    });
    sortedKeys.forEach(routeKey => {
      if (!visibleRoutes.has(routeKey)) return;
      const data = routeGridData.get(routeKey);
      if (!data) return;
      const color = adjustRouteColorForTheme(routeColors[routeKey] ?? '#888', theme);
      const isHighlighted = depRouteSet.has(routeKey) || arrRouteSet.has(routeKey);
      const opacity = hasFilter ? (isHighlighted ? 1.0 : 0.15) : 1.0;
      const sw = hasFilter ? (isHighlighted ? 1.8 : 0.8) : 1.1;
      for (let i = 0; i < data.grids.length - 1; i++) {
        const [gx1, gy1] = data.grids[i];
        const [gx2, gy2] = data.grids[i + 1];
        if (gx1 === gx2 && gy1 === gy2) continue;
        const segKey = normSegKey(gx1, gy1, gx2, gy2);
        const [ox, oy] = routeSegmentOffsets.get(`${routeKey}|${segKey}`) ?? [0, 0];
        const [sx1, sy1] = gridToXY(gx1, gy1);
        const [sx2, sy2] = gridToXY(gx2, gy2);
        const d = makeOctilinearPath(sx1 + ox, sy1 + oy, sx2 + ox, sy2 + oy);
        elements.push(
          <path
            key={`${routeKey}-${i}`}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={sw}
            strokeOpacity={opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      }
    });
    return elements;
  }, [visibleRoutes, routeGridData, routeSegmentOffsets, depRouteSet, arrRouteSet, theme]);

  // ---- 駅マーカー要素生成（乗換駅のみ） ----
  // ラベル表示はズームが十分なときだけ（重なり防止）
  const LABEL_SCALE_THRESHOLD = 0.9; // これ以上のscaleでラベルを表示

  const stationElements = useMemo(() => {
    const colors = getThemeColors(theme);
    const s = transform.scale;
    const r = Math.max(1.5, 2.5 / s);
    const fs = Math.max(4, Math.min(10, 6 / s));
    const sw = 1.8 / s;
    const csw = 0.8 / s;
    const offset = r + 2 / s;
    const showLabel = s >= LABEL_SCALE_THRESHOLD;
    const elements: React.ReactElement[] = [];
    const rendered = new Set<string>();
    DIAGRAM_ROUTE_KEYS.forEach(routeKey => {
      if (!visibleRoutes.has(routeKey)) return;
      const data = routeGridData.get(routeKey);
      if (!data) return;
      data.names.forEach((name, idx) => {
        if (rendered.has(name)) return;
        if (!transferStations.has(name)) return;
        rendered.add(name);
        const [gx, gy] = data.grids[idx];
        const [sx, sy] = gridToXY(gx, gy);
        elements.push(
          <g key={name}>
            <circle cx={sx} cy={sy} r={r} fill={colors.surfaceElevated} stroke={colors.textSecondary} strokeWidth={csw} />
            {showLabel && (
              <text
                x={sx + offset} y={sy + fs * 0.4}
                fontSize={fs} fontWeight="bold" fill={colors.text}
                stroke={colors.background} strokeWidth={sw} paintOrder="stroke"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {name}
              </text>
            )}
          </g>
        );
      });
    });
    return elements;
  }, [visibleRoutes, routeGridData, transferStations, transform.scale, theme]);

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

  // ---- マウスカーソル位置基準ズーム（non-passive wheel event） ----
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

  // ---- タッチ操作（スマホ対応: 1本指パン + 2本指ピンチズーム） ----
  useEffect(() => {
    const area = mapAreaRef.current;
    if (!area) return;
    let lastTouches: TouchList | null = null;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      lastTouches = e.touches;
    };

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

  // ---- 出発/到着駅の中間点にビューをセンタリング ----
  useEffect(() => {
    const area = mapAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    if (rect.width === 0) return;

    let depPos: [number, number] | null = null;
    let arrPos: [number, number] | null = null;
    for (const k of DIAGRAM_ROUTE_KEYS) {
      const d = (routes[k] as any[])?.find(s => s.name === depStation);
      if (d && !depPos) { const [gx, gy] = toGrid(d.lat, d.lng); depPos = gridToXY(gx, gy); }
      const a = (routes[k] as any[])?.find(s => s.name === arrStation);
      if (a && !arrPos) { const [gx, gy] = toGrid(a.lat, a.lng); arrPos = gridToXY(gx, gy); }
      if (depPos && arrPos) break;
    }
    if (!depPos && !arrPos) return;

    const cx = depPos && arrPos ? (depPos[0] + arrPos[0]) / 2 : (depPos ?? arrPos)![0];
    const cy = depPos && arrPos ? (depPos[1] + arrPos[1]) / 2 : (depPos ?? arrPos)![1];
    const scale = 0.65;
    setTransform({ x: rect.width / 2 - cx * scale, y: rect.height / 2 - cy * scale, scale });
  }, [depStation, arrStation]);

  const colors = getThemeColors(theme);
  const mapBg = theme === 'dark' ? '#1e2a1e' : '#eef4ee';

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', fontFamily: 'sans-serif', background: colors.background }}>
      {/* ---- SVGマップエリア ---- */}
      <div
        ref={mapAreaRef}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', background: colors.surface }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 操作説明（PC幅のみ表示） */}
        <div style={{
          position: 'absolute', bottom: 8, right: 8, zIndex: 20,
          background: colors.surfaceElevated,
          border: `1px solid ${colors.border}`,
          borderRadius: '4px', padding: '4px 7px', fontSize: '10px',
          color: colors.textSecondary,
          boxShadow: `0 1px 4px ${colors.shadow}`,
          display: 'none', // JS不要でCSSのみ対応 — PC: inline-block
        }}
          className="diagram-hint"
        >
          スクロール: ズーム | ドラッグ: 移動 | ●: 乗換駅
        </div>
        <style>{`
          @media (min-width: 600px) { .diagram-hint { display: block !important; } }
        `}</style>

        {/* 準備中バッジ */}
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
          <button
            onClick={() => setShowWipNote(v => !v)}
            style={{
              background: colors.warning, color: '#fff', border: 'none',
              borderRadius: '4px', padding: '5px 10px',
              fontSize: '11px', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: `0 1px 4px ${colors.shadow}`,
            }}
          >
            🚧 準備中
          </button>
        </div>

        {/* WIPノートパネル */}
        {showWipNote && (
          <div style={{
            position: 'absolute', top: 40, right: 8, zIndex: 30,
            background: colors.surfaceElevated,
            border: `1px solid ${colors.border}`,
            borderRadius: '6px', padding: '12px 14px',
            fontSize: '11px', color: colors.text, width: '260px',
            boxShadow: `0 4px 12px ${colors.shadowHeavy}`, lineHeight: '1.6',
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', color: colors.warning, fontSize: '12px' }}>
              🚧 路線図モード — 仮実装
            </div>
            <div style={{ marginBottom: '6px', color: colors.textSecondary, fontSize: '10px' }}>
              地理座標 → グリッドスナップ + 並走路線オフセット
            </div>
            <button
              onClick={() => setShowWipNote(false)}
              style={{ fontSize: '10px', padding: '3px 8px', border: `1px solid ${colors.border}`, borderRadius: '3px', cursor: 'pointer', background: colors.surface, color: colors.text }}
            >閉じる</button>
          </div>
        )}

        {/* SVG */}
        <svg
          style={{ width: '100%', height: '100%', cursor: isPanning.current ? 'grabbing' : 'grab', display: 'block' }}
        >
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
            {/* 地図背景 */}
            <rect x={PAD} y={PAD} width={GX_MAX * CELL_PX} height={GY_MAX * CELL_PX} fill={mapBg} rx={2} />

            {/* 路線ライン */}
            {routeLineElements}

            {/* 乗換駅マーカー */}
            {stationElements}

            {/* 出発駅マーカー */}
            {depSVGPos && (() => {
              const s = transform.scale;
              const r = Math.max(3, 6 / s);
              const fs = Math.max(5, Math.min(11, 7 / s));
              const depColor = colors.success;
              const showText = s >= 0.5;
              return (
                <g style={{ pointerEvents: 'none' }}>
                  <circle cx={depSVGPos[0]} cy={depSVGPos[1]} r={r} fill={depColor} stroke={colors.background} strokeWidth={1.5 / s} />
                  {showText && (
                    <text x={depSVGPos[0] + r + 2 / s} y={depSVGPos[1] + fs * 0.35}
                      fontSize={fs} fontWeight="bold" fill={depColor}
                      stroke={colors.background} strokeWidth={2 / s} paintOrder="stroke"
                      style={{ userSelect: 'none' }}
                    >{depStation}</text>
                  )}
                </g>
              );
            })()}

            {/* 到着駅マーカー */}
            {arrSVGPos && (() => {
              const s = transform.scale;
              const r = Math.max(3, 6 / s);
              const fs = Math.max(5, Math.min(11, 7 / s));
              const arrColor = theme === 'dark' ? '#ff5555' : '#F44336';
              const showText = s >= 0.5;
              return (
                <g style={{ pointerEvents: 'none' }}>
                  <circle cx={arrSVGPos[0]} cy={arrSVGPos[1]} r={r} fill={arrColor} stroke={colors.background} strokeWidth={1.5 / s} />
                  {showText && (
                    <text x={arrSVGPos[0] + r + 2 / s} y={arrSVGPos[1] + fs * 0.35}
                      fontSize={fs} fontWeight="bold" fill={arrColor}
                      stroke={colors.background} strokeWidth={2 / s} paintOrder="stroke"
                      style={{ userSelect: 'none' }}
                    >{arrStation}</text>
                  )}
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
