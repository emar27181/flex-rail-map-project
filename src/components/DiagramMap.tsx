'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { routes, routeColors, routeNames, type RouteKey } from '../data/routes';

// ---- 表示対象路線（東京都市圏の主要路線）----
const DIAGRAM_ROUTE_KEYS: RouteKey[] = [
  'yamanote', 'chuo', 'keihinTohoku', 'jrSobuLine', 'jrSaikyoLine',
  'jrTakasakiLine', 'jrJobanLine',
  'ginzaLine', 'marunouchiLine', 'hibiyaLine', 'tozaiLine', 'chiyodaLine',
  'yurakuchoLine', 'hanzomonLine', 'nambokuLine', 'fukutoshinLine',
  'toeiOedoLine', 'toeiAsakusaLine', 'toeiMitaLine', 'toeiShinjukuLine',
  'odakyuLine', 'keioLine', 'keioInokashiraLine',
  'tokyuToyokoLine', 'tokyuDenEnToshiLine', 'tokyuMeguro',
  'seibuIkebukuroLine', 'seibuShinjukuLine',
  'tobuTojoLine', 'tobuIsesakiLine',
  'keikyuLine', 'keiseiMainLine',
  'tsukubaExpress', 'rinkaiLine', 'yurikamomeLine',
];

// ---- 地理的範囲 ----
const MIN_LAT = 35.52;
const MAX_LAT = 35.85;
const MIN_LNG = 139.54;
const MAX_LNG = 139.98;

// ---- グリッド設定 ----
const GRID_DEG = 0.005; // 1グリッド ≈ 500m
const CELL_PX = 14;    // 1グリッドのピクセルサイズ
const PAD = 50;        // キャンバスの余白

const GX_MAX = Math.round((MAX_LNG - MIN_LNG) / GRID_DEG);
const GY_MAX = Math.round((MAX_LAT - MIN_LAT) / GRID_DEG);
const SVG_W = PAD * 2 + GX_MAX * CELL_PX;
const SVG_H = PAD * 2 + GY_MAX * CELL_PX;

const OFFSET_PX = 3.5; // 重複セグメントのオフセット量（px）

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

// セグメントキー（順序を正規化して双方向を同じキーにする）
function normSegKey(gx1: number, gy1: number, gx2: number, gy2: number): string {
  if (gx1 > gx2 || (gx1 === gx2 && gy1 > gy2)) {
    return `${gx2},${gy2}|${gx1},${gy1}`;
  }
  return `${gx1},${gy1}|${gx2},${gy2}`;
}

// ---- メインコンポーネント ----
const DiagramMap: React.FC = () => {
  const [visibleRoutes, setVisibleRoutes] = useState<Set<RouteKey>>(
    new Set(DIAGRAM_ROUTE_KEYS)
  );
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.85 });
  const [showPanel, setShowPanel] = useState(true);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

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

      stationList.forEach(station => {
        grids.push(toGrid(station.lat, station.lng));
        names.push(station.name);
        stationRouteCount.set(station.name, (stationRouteCount.get(station.name) ?? 0) + 1);
      });

      routeGridData.set(routeKey, { grids, names });

      // セグメントを登録（重複路線を検出するため）
      for (let i = 0; i < grids.length - 1; i++) {
        const [gx1, gy1] = grids[i];
        const [gx2, gy2] = grids[i + 1];
        if (gx1 === gx2 && gy1 === gy2) continue; // 同一グリッド = スキップ

        const key = normSegKey(gx1, gy1, gx2, gy2);
        if (!segmentRouteMap.has(key)) segmentRouteMap.set(key, []);
        const existing = segmentRouteMap.get(key)!;
        if (!existing.includes(routeKey)) existing.push(routeKey);
      }
    });

    // 乗換駅（2路線以上が通る駅）
    const transferStations = new Set<string>();
    stationRouteCount.forEach((count, name) => {
      if (count >= 2) transferStations.add(name);
    });

    return { routeGridData, segmentRouteMap, transferStations };
  }, []);

  // ---- セグメントごとの垂直オフセットを計算 ----
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

      // 垂直方向の単位ベクトル（90°回転）
      const perpX = -dy / len;
      const perpY = dx / len;

      const n = routeKeys.length;
      routeKeys.forEach((routeKey, idx) => {
        const t = (idx - (n - 1) / 2) * OFFSET_PX;
        offsets.set(`${routeKey}|${segKey}`, [perpX * t, perpY * t]);
      });
    });

    return offsets;
  }, [segmentRouteMap]);

  // ---- 路線ライン要素を生成 ----
  const routeLineElements = useMemo(() => {
    const elements: React.ReactElement[] = [];

    DIAGRAM_ROUTE_KEYS.forEach(routeKey => {
      if (!visibleRoutes.has(routeKey)) return;
      const data = routeGridData.get(routeKey);
      if (!data) return;

      const color = routeColors[routeKey] ?? '#888';

      for (let i = 0; i < data.grids.length - 1; i++) {
        const [gx1, gy1] = data.grids[i];
        const [gx2, gy2] = data.grids[i + 1];
        if (gx1 === gx2 && gy1 === gy2) continue;

        const segKey = normSegKey(gx1, gy1, gx2, gy2);
        const [ox, oy] = routeSegmentOffsets.get(`${routeKey}|${segKey}`) ?? [0, 0];

        const [sx1, sy1] = gridToXY(gx1, gy1);
        const [sx2, sy2] = gridToXY(gx2, gy2);

        elements.push(
          <line
            key={`${routeKey}-${i}`}
            x1={sx1 + ox} y1={sy1 + oy}
            x2={sx2 + ox} y2={sy2 + oy}
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      }
    });

    return elements;
  }, [visibleRoutes, routeGridData, routeSegmentOffsets]);

  // ---- 駅マーカー要素を生成（乗換駅のみ表示）----
  const stationElements = useMemo(() => {
    const elements: React.ReactElement[] = [];
    const rendered = new Set<string>();

    DIAGRAM_ROUTE_KEYS.forEach(routeKey => {
      if (!visibleRoutes.has(routeKey)) return;
      const data = routeGridData.get(routeKey);
      if (!data) return;

      data.names.forEach((name, idx) => {
        if (rendered.has(name)) return;

        const isTransfer = transferStations.has(name);
        if (!isTransfer) return; // 乗換駅のみ表示（パフォーマンス・視認性のため）

        rendered.add(name);
        const [gx, gy] = data.grids[idx];
        const [sx, sy] = gridToXY(gx, gy);

        elements.push(
          <g key={name}>
            {/* 白い縁取り（背景テキストとの分離用）*/}
            <circle cx={sx} cy={sy} r={5.5} fill="white" stroke="#555" strokeWidth={1.5} />
            {/* 駅名ラベル */}
            <text
              x={sx + 7}
              y={sy + 4}
              fontSize={9}
              fontWeight="bold"
              fill="#222"
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

  // ---- パン・ズーム操作 ----
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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setTransform(t => ({
      ...t,
      scale: Math.max(0.25, Math.min(6, t.scale * factor)),
    }));
  }, []);

  const toggleRoute = useCallback((key: RouteKey) => {
    setVisibleRoutes(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', fontFamily: 'sans-serif', background: '#fff' }}>
      {/* ---- サイドパネル ---- */}
      {showPanel && (
        <div style={{
          width: '185px',
          minWidth: '185px',
          background: '#f8f8f8',
          borderRight: '1px solid #ddd',
          overflowY: 'auto',
          padding: '10px 8px',
          fontSize: '12px',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            路線の表示切替
          </div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            <button
              onClick={() => setVisibleRoutes(new Set(DIAGRAM_ROUTE_KEYS))}
              style={{
                flex: 1, fontSize: '10px', padding: '4px 2px',
                border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer',
                background: '#fff',
              }}
            >全表示</button>
            <button
              onClick={() => setVisibleRoutes(new Set())}
              style={{
                flex: 1, fontSize: '10px', padding: '4px 2px',
                border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer',
                background: '#fff',
              }}
            >全非表示</button>
          </div>
          {DIAGRAM_ROUTE_KEYS.map(key => (
            <label key={key} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              cursor: 'pointer', padding: '2px 0', lineHeight: '1.4',
            }}>
              <input
                type="checkbox"
                checked={visibleRoutes.has(key)}
                onChange={() => toggleRoute(key)}
                style={{ width: '12px', height: '12px', cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{
                display: 'inline-block', width: '10px', height: '10px',
                background: routeColors[key] ?? '#888',
                borderRadius: '50%', flexShrink: 0,
              }} />
              <span style={{ color: '#333', fontSize: '11px' }}>
                {routeNames[key] ?? key}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* ---- SVGマップエリア ---- */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#fafafa' }}>
        {/* コントロールバー */}
        <div style={{
          position: 'absolute', top: 8, left: 8, zIndex: 20,
          display: 'flex', gap: '6px',
        }}>
          <button
            onClick={() => setShowPanel(p => !p)}
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid #ccc', borderRadius: '4px',
              padding: '5px 10px', fontSize: '12px', cursor: 'pointer',
            }}
          >
            {showPanel ? '◀ パネル' : '▶ パネル'}
          </button>
          <button
            onClick={() => setTransform({ x: 0, y: 0, scale: 0.85 })}
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid #ccc', borderRadius: '4px',
              padding: '5px 10px', fontSize: '12px', cursor: 'pointer',
            }}
          >
            リセット
          </button>
        </div>

        {/* 操作説明 */}
        <div style={{
          position: 'absolute', bottom: 8, right: 8, zIndex: 20,
          background: 'rgba(255,255,255,0.85)', border: '1px solid #ddd',
          borderRadius: '4px', padding: '5px 8px', fontSize: '10px', color: '#666',
        }}>
          スクロール: ズーム | ドラッグ: 移動 | ●: 乗換駅
        </div>

        {/* 実験的ラベル */}
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 20,
          background: '#FF8C00', color: '#fff',
          borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold',
        }}>
          実験的
        </div>

        <svg
          style={{
            width: '100%', height: '100%',
            cursor: isPanning.current ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
            {/* 薄いグリッド背景（参考用）*/}
            <rect x={PAD} y={PAD} width={GX_MAX * CELL_PX} height={GY_MAX * CELL_PX}
              fill="#f0f4f8" rx={4} />

            {/* 路線ライン */}
            {routeLineElements}

            {/* 乗換駅マーカー */}
            {stationElements}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default DiagramMap;
