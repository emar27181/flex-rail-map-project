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
const GRID_DEG = 0.005;  // 1グリッド ≈ 500m
const CELL_PX = 14;
const PAD = 60;

const GX_MAX = Math.round((MAX_LNG - MIN_LNG) / GRID_DEG);
const GY_MAX = Math.round((MAX_LAT - MIN_LAT) / GRID_DEG);
const SVG_W = PAD * 2 + GX_MAX * CELL_PX;
const SVG_H = PAD * 2 + GY_MAX * CELL_PX;

const OFFSET_PX = 3.5;

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
  const [transform, setTransform] = useState({ x: 20, y: 20, scale: 0.48 });
  const [showPanel, setShowPanel] = useState(true);
  const [showWipNote, setShowWipNote] = useState(false);

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

  // ---- セグメントごとの垂直オフセット計算 ----
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
      routeKeys.forEach((routeKey, idx) => {
        const t = (idx - (n - 1) / 2) * OFFSET_PX;
        offsets.set(`${routeKey}|${segKey}`, [perpX * t, perpY * t]);
      });
    });
    return offsets;
  }, [segmentRouteMap]);

  // ---- 路線ライン要素生成（オクチリニア: 0°/45°/90°整列） ----
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
        const d = makeOctilinearPath(sx1 + ox, sy1 + oy, sx2 + ox, sy2 + oy);
        elements.push(
          <path
            key={`${routeKey}-${i}`}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      }
    });
    return elements;
  }, [visibleRoutes, routeGridData, routeSegmentOffsets]);

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
            onClick={() => setTransform({ x: 20, y: 20, scale: 0.48 })}
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
          </g>
        </svg>
      </div>
    </div>
  );
};

export default DiagramMap;
