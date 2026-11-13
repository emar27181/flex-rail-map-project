import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { routes, type RouteKey } from '../../../src/data/routes';
import { distanceM, validateGeometry } from '../../../src/utils/trackGeometry';
import {
  isTrackGeometryExperiment, toTrackGeometries, type TrackGeometryPrototypeFile,
} from '../../../src/utils/trackGeometryPrototype';
import { build, lineFromRuns, MAX_STATION_DIST_M } from '../../../scripts/track-geometry/build-from-terrain3d-v2.mts';

const file = JSON.parse(readFileSync('public/data/track-geometry-prototype.json', 'utf8')) as TrackGeometryPrototypeFile & {
  meta: { skipped: Array<{ key: string; reason: string }> };
};

describe('線形の試作データ（public/data/track-geometry-prototype.json）', () => {
  it('出典・ライセンス・取得日が付いている（OSM のデータなので出典表示が必要）', () => {
    expect(file.meta.source.license).toContain('ODbL');
    expect(file.meta.source.license).toContain('OpenStreetMap contributors');
    expect(file.meta.source.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(file.meta.source.crs).toBe('EPSG:4326');
  });

  it('検証に通った路線だけが入っていて、除外した路線は理由つきで残す', () => {
    const keys = Object.keys(file.routes);
    expect(keys.length).toBe(file.meta.routeCount);
    expect(keys.length).toBeGreaterThan(40);
    for (const s of file.meta.skipped) {
      expect(keys).not.toContain(s.key);
      expect(s.reason.length).toBeGreaterThan(0);
    }
  });

  it('入っている路線はすべて、路線データの駅と突き合わせて問題が無い（1区間 = 隣り合う2駅）', () => {
    const geometries = toTrackGeometries(file);
    for (const [key, geometry] of Object.entries(geometries)) {
      const stations = routes[key as RouteKey];
      expect(stations, key).toBeDefined();
      expect(geometry.sections.length, key).toBe(stations.length - 1);
      // 点の間の距離の上限は、下のテストで区間ごとに確かめる（常磐線のように駅の間が10kmの直線もあるため一律にしない）
      expect(validateGeometry(geometry, stations, { maxStationDistM: MAX_STATION_DIST_M, maxJumpM: 20_000 }), key).toEqual([]);
    }
  });

  it('線は駅の間をまっすぐ結ぶ以上に飛ばず、遠回りもしない（途中で別の線につながった線形を弾く）', () => {
    const geometries = toTrackGeometries(file);
    for (const [key, geometry] of Object.entries(geometries)) {
      const at = new Map(routes[key as RouteKey].map(s => [s.name, [s.lat, s.lng] as [number, number]]));
      for (const sec of geometry.sections) {
        const a = at.get(sec.from)!, b = at.get(sec.to)!;
        const chain = [a, ...sec.points, b];
        const direct = distanceM(a, b);
        let length = 0;
        for (let i = 1; i < chain.length; i++) {
          const d = distanceM(chain[i - 1], chain[i]);
          length += d;
          // 隣り合う点の間は、駅の間の直線距離を超えない（余裕 300m は、大きな駅で駅の座標と線がずれる分）
          expect(d, `${key} ${sec.from}→${sec.to}`).toBeLessThanOrEqual(direct + 300);
        }
        // 線路の長さは、駅の間の直線距離の 2.5倍以内（大きなカーブ・ループ線を含めても）
        expect(length, `${key} ${sec.from}→${sec.to}`).toBeLessThanOrEqual(direct * 2.5 + 600);
      }
    }
  });

  it('標高（m）は持たない（OSMの構造は高さに変換しない）', () => {
    for (const r of Object.values(file.routes)) {
      for (const sec of r.sections) {
        expect(sec).not.toHaveProperty('trackElevationM');
        expect(sec).not.toHaveProperty('terrainElevationM');
      }
    }
  });
});

describe('変換の元になる線', () => {
  it('runs は隣の run と端点を共有するので、つなぐと重複する点が1つにまとまる', () => {
    const line = lineFromRuns([
      { s: 'g', p: [[35, 139], [35.001, 139.001]] },
      { s: 'u', p: [[35.001, 139.001], [35.002, 139.002]] },
    ]);
    expect(line.points).toEqual([[35, 139], [35.001, 139.001], [35.002, 139.002]]);
    expect(line.kinds).toEqual(['untagged', 'untagged', 'tunnel']);
  });

  it('駅と線の距離が基準を超える路線は書き出さず、理由を残す', () => {
    const stations = routes.chuo;
    const far = { routes: [{ key: 'chuo', osmRelId: 1, osmName: 'x', runs: [{ s: 'g', p: [[10, 10], [10.1, 10.1]] as [number, number][] }] }] };
    const { built, skipped } = build(far);
    expect(stations.length).toBeGreaterThan(2);
    expect(built).toEqual([]);
    expect(skipped[0].key).toBe('chuo');
    expect(skipped[0].reason).toContain('station-far');
  });
});

describe('試作のURLパラメータ', () => {
  it('?experiment=track-geometry のときだけ試作を読む', () => {
    expect(isTrackGeometryExperiment('?experiment=track-geometry')).toBe(true);
    expect(isTrackGeometryExperiment('?experiment=last-train')).toBe(false);
    expect(isTrackGeometryExperiment('')).toBe(false);
  });
});
