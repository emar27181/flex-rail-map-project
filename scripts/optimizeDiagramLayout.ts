#!/usr/bin/env node
/**
 * Diagram layout optimizer — force-directed station placement
 *
 * Algorithm:
 *   1. Initialize each station at its geographic grid position (continuous float)
 *   2. Each iteration:
 *      a. Repel pairs closer than minDist (Coulomb-like: F ∝ (minDist - dist) / dist)
 *      b. Attract toward geographic anchor (prevents over-expansion)
 *      c. Compress: if bounding box grew beyond geo bounds, scale toward center
 *   3. Stop when maxDisplacement < converge, or maxIter reached
 *   4. Save versioned log + overwrite latest.json
 *
 * Run:
 *   npx tsx scripts/optimizeDiagramLayout.ts
 *   npx tsx scripts/optimizeDiagramLayout.ts --minDist=2.5 --anchor=0.05 --maxIter=5000
 *
 * Output: src/data/diagramLayouts/vN.json (versioned) + latest.json (used by DiagramMap)
 */

import { routes, type RouteKey } from '../src/data/routes';
import { writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---- 対象路線（DiagramMap.tsx と同じリスト） ----
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

const GRID_DEG = 0.005;
const MIN_LAT = 35.22, MAX_LAT = 35.92;
const MIN_LNG = 139.10, MAX_LNG = 140.12;

// ---- パラメータ ----
interface Params {
  minDist: number;   // この距離(grid単位)未満の駅ペアを離す
  maxIter: number;   // 最大反復回数
  repulsion: number; // 斥力係数
  anchor: number;    // 地理位置へのアンカー係数（拡散防止）
  compress: number;  // バウンディングボックスが広がりすぎた時の圧縮係数
  step: number;      // 1ステップあたりの移動量スケール
  converge: number;  // 収束判定（最大変位がこれ未満で終了）
}

const DEFAULT_PARAMS: Params = {
  minDist: 2.0,
  maxIter: 3000,
  repulsion: 1.0,
  anchor: 0.06,
  compress: 0.08,
  step: 0.18,
  converge: 0.008,
};

// ---- CLI引数でパラメータ上書き ----
const params: Params = { ...DEFAULT_PARAMS };
process.argv.slice(2).forEach(arg => {
  const m = arg.match(/^--?(\w+)=(.+)$/);
  if (m && m[1] in params) (params as Record<string, number>)[m[1]] = parseFloat(m[2]);
});

// ---- ユーティリティ ----
type Vec2 = [number, number];

function geoToGrid(lat: number, lng: number): Vec2 {
  return [(lng - MIN_LNG) / GRID_DEG, (MAX_LAT - lat) / GRID_DEG];
}

function dist2(a: Vec2, b: Vec2): number {
  const dx = a[0] - b[0], dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

// ---- メイン最適化 ----
function optimize(p: Params) {
  // 全ユニーク駅を初期化
  const pos: Record<string, Vec2> = {};
  const geo: Record<string, Vec2> = {};

  DIAGRAM_ROUTE_KEYS.forEach(rk => {
    const sl = (routes[rk] as Array<{ lat: number; lng: number; name: string }>) ?? [];
    sl.forEach(s => {
      if (!(s.name in pos)) {
        const g = geoToGrid(s.lat, s.lng);
        pos[s.name] = [g[0], g[1]];
        geo[s.name] = [g[0], g[1]];
      }
    });
  });

  const names = Object.keys(pos);
  const n = names.length;
  console.log(`\n  Stations loaded: ${n}`);

  // 完全同座標ペアに小ジッターを付与（斥力の分母ゼロ対策）
  const SEED_JITTER = 0.05; // 決定論的ハッシュで分散させる
  names.forEach((nm, i) => {
    // インデックスベースの決定論的ジッター（再現性確保）
    pos[nm][0] += Math.sin(i * 2.4731) * SEED_JITTER;
    pos[nm][1] += Math.cos(i * 2.4731) * SEED_JITTER;
  });

  // ゼロ距離ペアを検出してさらに強制分離
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const d = dist2(pos[names[i]], pos[names[j]]);
      if (d < 0.01) {
        const angle = (i * 1.618 + j * 0.382) * Math.PI * 2;
        pos[names[i]][0] += Math.cos(angle) * 0.1;
        pos[names[i]][1] += Math.sin(angle) * 0.1;
        pos[names[j]][0] -= Math.cos(angle) * 0.1;
        pos[names[j]][1] -= Math.sin(angle) * 0.1;
      }
    }
  }

  // 地理的バウンディングボックス（圧縮時の基準）
  const geoMinX = Math.min(...names.map(nm => geo[nm][0]));
  const geoMaxX = Math.max(...names.map(nm => geo[nm][0]));
  const geoMinY = Math.min(...names.map(nm => geo[nm][1]));
  const geoMaxY = Math.max(...names.map(nm => geo[nm][1]));
  const geoCx = (geoMinX + geoMaxX) / 2;
  const geoCy = (geoMinY + geoMaxY) / 2;
  const geoW = geoMaxX - geoMinX;
  const geoH = geoMaxY - geoMinY;

  let iter = 0;
  let maxDisp = Infinity;
  let converged = false;
  const log: Array<{ iter: number; maxDisp: number; violations: number }> = [];

  while (iter < p.maxIter) {
    // 空間インデックス（セルサイズ = minDist で近傍検索を高速化）
    const cellSz = p.minDist;
    const cells = new Map<string, string[]>();
    names.forEach(nm => {
      const ck = `${Math.floor(pos[nm][0] / cellSz)},${Math.floor(pos[nm][1] / cellSz)}`;
      if (!cells.has(ck)) cells.set(ck, []);
      cells.get(ck)!.push(nm);
    });

    const fx: Record<string, number> = {};
    const fy: Record<string, number> = {};
    names.forEach(nm => { fx[nm] = 0; fy[nm] = 0; });

    // 斥力: minDist 未満なら押し離す
    names.forEach(nmA => {
      const [ax, ay] = pos[nmA];
      const cx = Math.floor(ax / cellSz);
      const cy = Math.floor(ay / cellSz);
      for (let ddx = -2; ddx <= 2; ddx++) {
        for (let ddy = -2; ddy <= 2; ddy++) {
          const nb = cells.get(`${cx + ddx},${cy + ddy}`);
          if (!nb) continue;
          nb.forEach(nmB => {
            if (nmB <= nmA) return;
            const [bx, by] = pos[nmB];
            const ex = ax - bx, ey = ay - by;
            const d = Math.sqrt(ex * ex + ey * ey);
            if (d < p.minDist && d > 0.0001) {
              const f = p.repulsion * (p.minDist - d) / d;
              fx[nmA] += ex * f; fy[nmA] += ey * f;
              fx[nmB] -= ex * f; fy[nmB] -= ey * f;
            }
          });
        }
      }
    });

    // アンカー引力: 地理的位置へ引き戻す
    names.forEach(nm => {
      fx[nm] += p.anchor * (geo[nm][0] - pos[nm][0]);
      fy[nm] += p.anchor * (geo[nm][1] - pos[nm][1]);
    });

    // 力を適用
    maxDisp = 0;
    names.forEach(nm => {
      const disp = Math.sqrt(fx[nm] ** 2 + fy[nm] ** 2);
      maxDisp = Math.max(maxDisp, disp * p.step);
      pos[nm][0] += fx[nm] * p.step;
      pos[nm][1] += fy[nm] * p.step;
    });

    // 圧縮: バウンディングボックスが地理的範囲より大きくなったら中心に向けて縮める
    const curMinX = Math.min(...names.map(nm => pos[nm][0]));
    const curMaxX = Math.max(...names.map(nm => pos[nm][0]));
    const curMinY = Math.min(...names.map(nm => pos[nm][1]));
    const curMaxY = Math.max(...names.map(nm => pos[nm][1]));
    const curW = curMaxX - curMinX, curH = curMaxY - curMinY;
    if (curW > geoW * 1.05 || curH > geoH * 1.05) {
      names.forEach(nm => {
        pos[nm][0] += p.compress * (geoCx - pos[nm][0]);
        pos[nm][1] += p.compress * (geoCy - pos[nm][1]);
      });
    }

    iter++;

    // 100イテレーションごとに進捗ログ
    if (iter % 100 === 0) {
      const violations = countViolations(names, pos, p.minDist);
      log.push({ iter, maxDisp: +maxDisp.toFixed(5), violations });
      process.stdout.write(`  iter ${iter.toString().padStart(5)}: maxDisp=${maxDisp.toFixed(5)}, violations=${violations}\n`);
    }

    if (maxDisp < p.converge) { converged = true; break; }
  }

  return { pos, geo, iter, converged, maxDisp, log, n };
}

function countViolations(names: string[], pos: Record<string, Vec2>, minDist: number): number {
  let v = 0;
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      if (dist2(pos[names[i]], pos[names[j]]) < minDist) v++;
    }
  }
  return v;
}

// ---- 近接ペア分布を計算（スパース: minDist*4 以内のみ） ----
function pairwiseStats(names: string[], pos: Record<string, Vec2>, minDist: number) {
  const nearby: number[] = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const d = dist2(pos[names[i]], pos[names[j]]);
      if (d < minDist * 5) nearby.push(d);
    }
  }
  nearby.sort((a, b) => a - b);
  const p = (q: number) => nearby[Math.floor(nearby.length * q)] ?? 0;
  return {
    nearbyPairs: nearby.length,
    minDist: +(nearby[0] ?? 0).toFixed(4),
    p10: +p(0.10).toFixed(4),
    p25: +p(0.25).toFixed(4),
    median: +p(0.50).toFixed(4),
    violations: nearby.filter(d => d < minDist).length,
  };
}

// ---- バージョン番号決定 ----
const outDir = join(__dirname, '..', 'src', 'data', 'diagramLayouts');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const existingVersions = readdirSync(outDir)
  .filter(f => /^v\d+\.json$/.test(f))
  .map(f => parseInt(f.slice(1)));
const version = existingVersions.length > 0 ? Math.max(...existingVersions) + 1 : 1;

// ---- 実行 ----
console.log(`\n=== Diagram Layout Optimizer ===`);
console.log(`  Version: v${version}`);
console.log(`  Params:  ${JSON.stringify(params)}`);

const t0 = Date.now();
const { pos, n, iter, converged, maxDisp, log } = optimize(params);
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

const names = Object.keys(pos);
const stats = pairwiseStats(names, pos, params.minDist);
const finalViolations = countViolations(names, pos, params.minDist);

console.log(`\n  Done in ${elapsed}s, ${iter} iterations (converged=${converged})`);
console.log(`  Final maxDisp: ${maxDisp.toFixed(5)}`);
console.log(`  Nearby pair stats: ${JSON.stringify(stats)}`);
console.log(`  Final violations (dist < minDist): ${finalViolations}`);

// ---- 保存 ----
const output = {
  version,
  timestamp: new Date().toISOString(),
  elapsed_s: +elapsed,
  params,
  result: {
    iterations: iter,
    converged,
    maxDisp: +maxDisp.toFixed(5),
    stationCount: n,
    finalViolations,
    pairwiseStats: stats,
  },
  iterLog: log,
  positions: pos,
};

const versionedPath = join(outDir, `v${version}.json`);
const latestPath = join(outDir, 'latest.json');

writeFileSync(versionedPath, JSON.stringify(output, null, 2));
writeFileSync(latestPath, JSON.stringify({ version, positions: pos }, null, 2));

console.log(`\n  Saved: ${versionedPath}`);
console.log(`  Updated: ${latestPath}`);
