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
const GRID_DEG = 0.004;  // 1グリッド ≈ 400m（細かくして中心部の重複を分散）
const CELL_PX = 16;
const PAD = 60;

const GX_MAX = Math.round((MAX_LNG - MIN_LNG) / GRID_DEG);
const GY_MAX = Math.round((MAX_LAT - MIN_LAT) / GRID_DEG);
const SVG_W = PAD * 2 + GX_MAX * CELL_PX;
const SVG_H = PAD * 2 + GY_MAX * CELL_PX;

const BASE_OFFSET_PX = 4;
// 路線数に応じて動的にオフセット量を調整: 多数路線ほどセル内に収める
function dynamicOffset(n: number): number {
  const maxTotalSpread = CELL_PX * 0.72; // セル幅の72%以内に全路線を収める
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
const DiagramMap: React.FC = () => {
  const [visibleRoutes, setVisibleRoutes] = useState<Set<RouteKey>>(
    new Set(DIAGRAM_ROUTE_KEYS)
  );
  const [transform, setTransform] = useState({ x: 20, y: 20, scale: 0.55 });
  const [showPanel, setShowPanel] = useState(true);
  const [showWipNote, setShowWipNote] = useState(false);
  const [depInput, setDepInput] = useState('横浜');
  const [arrInput, setArrInput] = useState('新宿');
  const [depStation, setDepStation] = useState('横浜');
  const [arrStation, setArrStation] = useState('新宿');

  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const mapAreaRef = useRef<HTMLDivElement>(null);

  // ---- 路線データをグリッド座標に変換 ----
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
        grids.push(toGrid(station.lat, station.lng));
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
      const color = routeColors[routeKey] ?? '#888';
      const isHighlighted = depRouteSet.has(routeKey) || arrRouteSet.has(routeKey);
      const opacity = hasFilter ? (isHighlighted ? 1.0 : 0.13) : 1.0;
      const sw = isHighlighted ? 4 : 2.5;
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
  }, [visibleRoutes, routeGridData, routeSegmentOffsets, depRouteSet, arrRouteSet]);

  // ---- 駅マーカー要素生成（乗換駅のみ） ----
  const stationElements = useMemo(() => {
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
            <circle cx={sx} cy={sy} r={5.5} fill="white" stroke="#444" strokeWidth={1.5} />
            <text
              x={sx + 7} y={sy + 4}
              fontSize={9} fontWeight="bold" fill="#222"
              stroke="white" strokeWidth={2.5} paintOrder="stroke"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {name}
            </text>
          </g>
        );
      });
    });
    return elements;
  }, [visibleRoutes, routeGridData, transferStations]);

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

  const toggleRoute = useCallback((key: RouteKey) => {
    setVisibleRoutes(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', fontFamily: 'sans-serif', background: '#fff' }}>
      {/* ---- サイドパネル ---- */}
      {showPanel && (
        <div style={{
          width: '190px', minWidth: '190px',
          background: '#f8f8f8', borderRight: '1px solid #ddd',
          overflowY: 'auto', padding: '10px 8px', fontSize: '12px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {/* 出発/到着駅入力 */}
          <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #ddd' }}>
            <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', fontSize: '11px' }}>区間を指定</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px' }}>
              <span style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '10px', minWidth: '24px' }}>出発</span>
              <input
                value={depInput}
                onChange={e => setDepInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setDepStation(depInput); setArrStation(arrInput); } }}
                style={{ flex: 1, fontSize: '11px', padding: '3px 4px', border: '1px solid #4CAF50', borderRadius: '3px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '5px' }}>
              <span style={{ color: '#F44336', fontWeight: 'bold', fontSize: '10px', minWidth: '24px' }}>到着</span>
              <input
                value={arrInput}
                onChange={e => setArrInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setDepStation(depInput); setArrStation(arrInput); } }}
                style={{ flex: 1, fontSize: '11px', padding: '3px 4px', border: '1px solid #F44336', borderRadius: '3px', outline: 'none' }}
              />
            </div>
            <button
              onClick={() => { setDepStation(depInput); setArrStation(arrInput); }}
              style={{ width: '100%', fontSize: '10px', padding: '4px', background: '#333', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
            >
              この区間を表示
            </button>
          </div>

          <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>路線の表示切替</div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <button
              onClick={() => setVisibleRoutes(new Set(DIAGRAM_ROUTE_KEYS))}
              style={{ flex: 1, fontSize: '10px', padding: '4px 2px', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer', background: '#fff' }}
            >全表示</button>
            <button
              onClick={() => setVisibleRoutes(new Set())}
              style={{ flex: 1, fontSize: '10px', padding: '4px 2px', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer', background: '#fff' }}
            >全非表示</button>
          </div>
          {DIAGRAM_ROUTE_KEYS.map(key => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', padding: '2px 0', lineHeight: '1.4' }}>
              <input
                type="checkbox"
                checked={visibleRoutes.has(key)}
                onChange={() => toggleRoute(key)}
                style={{ width: '12px', height: '12px', cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ display: 'inline-block', width: '10px', height: '10px', background: routeColors[key] ?? '#888', borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ color: '#333', fontSize: '11px' }}>{routeNames[key] ?? key}</span>
            </label>
          ))}
        </div>
      )}

      {/* ---- SVGマップエリア ---- */}
      <div
        ref={mapAreaRef}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#f5f5f0' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* コントロールバー */}
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 20, display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setShowPanel(p => !p)}
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #ccc', borderRadius: '4px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}
          >
            {showPanel ? '◀ パネル' : '▶ パネル'}
          </button>
          <button
            onClick={() => { setDepStation(depInput); setArrStation(arrInput); }}
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #ccc', borderRadius: '4px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}
          >
            リセット
          </button>
        </div>

        {/* 操作説明 */}
        <div style={{
          position: 'absolute', bottom: 8, right: 8, zIndex: 20,
          background: 'rgba(255,255,255,0.88)', border: '1px solid #ddd',
          borderRadius: '4px', padding: '5px 8px', fontSize: '10px', color: '#666',
        }}>
          スクロール: ズーム（カーソル基準） | ドラッグ: 移動 | ●: 乗換駅
        </div>

        {/* 準備中バッジ + WIPノート */}
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 20, display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          <button
            onClick={() => setShowWipNote(v => !v)}
            style={{
              background: '#e67e00', color: '#fff', border: 'none',
              borderRadius: '4px', padding: '5px 10px',
              fontSize: '11px', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }}
          >
            🚧 準備中
          </button>
        </div>

        {/* WIPノートパネル */}
        {showWipNote && (
          <div style={{
            position: 'absolute', top: 40, right: 8, zIndex: 30,
            background: '#fffbf0', border: '1px solid #e0a800',
            borderRadius: '6px', padding: '12px 14px',
            fontSize: '11px', color: '#444', width: '280px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', lineHeight: '1.6',
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#b35900', fontSize: '12px' }}>
              🚧 路線図モード — 仮実装
            </div>
            <div style={{ marginBottom: '8px' }}>
              現在の実装: 地理座標 → グリッドスナップ + 並走路線オフセット
            </div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>実装予定の機能:</div>
            <ul style={{ margin: '0 0 8px 16px', padding: 0 }}>
              <li>オクチリニア配置（45°整列）</li>
              <li>駅ラベルの重なり回避</li>
              <li>経路ハイライト連携</li>
              <li>英語/日本語切替</li>
            </ul>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>参考文献:</div>
            <div style={{ fontSize: '10px', color: '#666', lineHeight: '1.5' }}>
              <div>• Nöllenburg &amp; Wolff (2011) "Drawing and Labeling High-Quality Metro Maps by Mixed-Integer Programming" <em>IEEE TVCG</em></div>
              <div style={{ marginTop: '4px' }}>• Stott et al. (2011) "Automatic Metro Map Layout Using Multicriteria Optimization" <em>IEEE TVCG</em></div>
              <div style={{ marginTop: '4px' }}>• Hurter et al. (2012) "Graph Bundling by Kernel Density Estimation"</div>
            </div>
            <button
              onClick={() => setShowWipNote(false)}
              style={{ marginTop: '10px', fontSize: '10px', padding: '3px 8px', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer', background: '#fff' }}
            >閉じる</button>
          </div>
        )}

        {/* SVG */}
        <svg
          style={{ width: '100%', height: '100%', cursor: isPanning.current ? 'grabbing' : 'grab', display: 'block' }}
        >
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
            {/* 地図背景 */}
            <rect x={PAD} y={PAD} width={GX_MAX * CELL_PX} height={GY_MAX * CELL_PX} fill="#eef0eb" rx={4} />

            {/* 準備中ウォーターマーク */}
            <text
              x={PAD + (GX_MAX * CELL_PX) / 2}
              y={PAD + (GY_MAX * CELL_PX) / 2}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={140} fill="rgba(180,160,100,0.12)" fontWeight="bold"
              transform={`rotate(-25, ${PAD + (GX_MAX * CELL_PX) / 2}, ${PAD + (GY_MAX * CELL_PX) / 2})`}
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              準備中
            </text>

            {/* 路線ライン */}
            {routeLineElements}

            {/* 乗換駅マーカー */}
            {stationElements}

            {/* 出発駅マーカー */}
            {depSVGPos && (
              <g style={{ pointerEvents: 'none' }}>
                <circle cx={depSVGPos[0]} cy={depSVGPos[1]} r={10} fill="#4CAF50" stroke="white" strokeWidth={2.5} />
                <text x={depSVGPos[0] + 14} y={depSVGPos[1] - 3}
                  fontSize={10} fontWeight="bold" fill="#4CAF50"
                  stroke="white" strokeWidth={2.5} paintOrder="stroke"
                  style={{ userSelect: 'none' }}
                >{depStation}</text>
                <text x={depSVGPos[0] + 14} y={depSVGPos[1] + 10}
                  fontSize={8} fill="#4CAF50"
                  stroke="white" strokeWidth={2} paintOrder="stroke"
                  style={{ userSelect: 'none' }}
                >出発</text>
              </g>
            )}

            {/* 到着駅マーカー */}
            {arrSVGPos && (
              <g style={{ pointerEvents: 'none' }}>
                <circle cx={arrSVGPos[0]} cy={arrSVGPos[1]} r={10} fill="#F44336" stroke="white" strokeWidth={2.5} />
                <text x={arrSVGPos[0] + 14} y={arrSVGPos[1] - 3}
                  fontSize={10} fontWeight="bold" fill="#F44336"
                  stroke="white" strokeWidth={2.5} paintOrder="stroke"
                  style={{ userSelect: 'none' }}
                >{arrStation}</text>
                <text x={arrSVGPos[0] + 14} y={arrSVGPos[1] + 10}
                  fontSize={8} fill="#F44336"
                  stroke="white" strokeWidth={2} paintOrder="stroke"
                  style={{ userSelect: 'none' }}
                >到着</text>
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default DiagramMap;
