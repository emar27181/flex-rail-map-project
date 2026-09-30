import { describe, it, expect } from 'vitest';
import { routes } from '../../../src/data/routes';
import { TRACK_GEOMETRY } from '../../../src/data/trackGeometry';
import { validateGeometry } from '../../../src/utils/trackGeometry';

/**
 * 登録された線形（src/data/trackGeometry/）を路線データと突き合わせる。
 * 基準は docs/track-geometry.md（収集スクリプトと同じ値）。
 */
const MAX_STATION_DIST_M = 150;
const MAX_JUMP_M = 3000;
const stationsOf = routes as Record<string, Array<{ name: string; lat: number; lng: number }>>;

describe('線形（実際の線路に沿った座標列）', () => {
  it('登録のキーは路線データのキーで、中身の routeKey と一致する', () => {
    for (const [key, g] of Object.entries(TRACK_GEOMETRY)) {
      expect(stationsOf[key], key).toBeDefined();
      expect(g.routeKey).toBe(key);
    }
  });

  for (const [key, g] of Object.entries(TRACK_GEOMETRY)) {
    describe(key, () => {
      it('出典・利用条件・取得日・座標系がある', () => {
        expect(g.source.name).toBeTruthy();
        expect(g.source.url).toMatch(/^https?:\/\//);
        expect(g.source.license).toBeTruthy();
        expect(g.source.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(g.source.crs).toBe('EPSG:4326');
      });
      it('隣り合う駅の間ごとに1区間ずつで、線が駅から離れず途切れない', () => {
        expect(validateGeometry(g, stationsOf[key], { maxStationDistM: MAX_STATION_DIST_M, maxJumpM: MAX_JUMP_M })).toEqual([]);
        const pairs = new Set(g.sections.map(s => `${s.from}\u0000${s.to}`));
        expect(pairs.size, '同じ区間が重複している').toBe(g.sections.length);
      });
    });
  }
});
