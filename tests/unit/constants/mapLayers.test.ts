/**
 * 地図の上の重なり順（src/constants/mapLayers.ts）のテスト。
 *
 * 駅アイコン・駅名ラベルは、路線数が多い駅ほど上に描く。以前は路線数の段が1000刻みで、
 * Leaflet が足す画面上のY座標（数千px）で順番が逆転し、乗換の多い駅のラベルが
 * 周りの駅のラベルの下に隠れることがあった。
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { routes } from '../../../src/data/routes';
import {
  stationMarkerZ, ENDPOINT_MARKER_Z, MARKER_Z_STEP, MARKER_Z_MAX_ROUTES, MAP_PANE_Z,
} from '../../../src/constants/mapLayers';

/** 画面の高さの上限の目安(px)。段の差はこれより大きくなければならない */
const MAX_SCREEN_PX = 10_000;

describe('駅の重なり順', () => {
  it('路線数が1つ多いごとに、画面上のY座標では逆転しない差で上になる', () => {
    for (let n = 1; n < MARKER_Z_MAX_ROUTES; n++) {
      expect(stationMarkerZ(n + 1) - stationMarkerZ(n)).toBeGreaterThan(MAX_SCREEN_PX);
    }
    expect(MARKER_Z_STEP).toBeGreaterThan(MAX_SCREEN_PX);
  });

  it('データ上いちばん路線数の多い駅も段の上限に収まる（上限で頭打ちにならない）', () => {
    const counts = new Map<string, Set<string>>();
    for (const [rk, stations] of Object.entries(routes)) {
      for (const s of stations ?? []) {
        if (!counts.has(s.name)) counts.set(s.name, new Set());
        counts.get(s.name)!.add(rk);
      }
    }
    const max = Math.max(...[...counts.values()].map(s => s.size));
    expect(max).toBeLessThanOrEqual(MARKER_Z_MAX_ROUTES);
  });

  it('出発駅・到着駅はどの駅よりも上', () => {
    expect(ENDPOINT_MARKER_Z - stationMarkerZ(MARKER_Z_MAX_ROUTES)).toBeGreaterThan(MAX_SCREEN_PX);
  });

  it('CSS の z-index の上限（32bit）を超えない', () => {
    expect(ENDPOINT_MARKER_Z + MAX_SCREEN_PX).toBeLessThan(2 ** 31 - 1);
  });

  it('層は markerPane（600）との前後関係を保つ: 所要時間・現在地は駅の後ろ、列車デモは前', () => {
    expect(MAP_PANE_Z.travelTime).toBeLessThan(600);
    expect(MAP_PANE_Z.userLocation).toBeLessThan(600);
    expect(MAP_PANE_Z.trainDemo).toBeGreaterThan(600);
  });
});

describe('重なり順の直書き', () => {
  it('コンポーネントで zIndexOffset・Pane の z-index に数値を直書きしない（mapLayers.ts から取る）', () => {
    const ROOT = join(__dirname, '../../../src/components');
    const files: string[] = [];
    const walk = (d: string) => readdirSync(d).forEach(n => {
      const p = join(d, n);
      if (statSync(p).isDirectory()) { if (n !== 'v2') walk(p); } else if (/\.tsx?$/.test(n)) files.push(p);
    });
    walk(ROOT);
    const offenders: string[] = [];
    for (const f of files) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        if (/zIndexOffset=\{\s*\d/.test(line) || /<Pane\b[^>]*zIndex:\s*\d/.test(line)) {
          offenders.push(`${relative(ROOT, f)}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});
