import { describe, it, expect } from 'vitest';
import { distanceM, expandWithGeometry, splitAtStations, stitchWays, validateGeometry, type SourceWay } from '../../../src/utils/trackGeometry';
import type { LatLng, TrackGeometry } from '../../../src/data/trackGeometry/types';

// 東西に走る架空の線（緯度35.0で経度を少しずつ進める。0.001度 ≒ 91m）
const P = (x: number, dy = 0): LatLng => [35 + dy, 139 + x * 0.001];
const stations = [
  { name: 'A', lat: 35, lng: 139 },
  { name: 'B', lat: 35, lng: 139.010 },
  { name: 'C', lat: 35, lng: 139.020 },
];
const way = (id: string, xs: number[], kind: SourceWay['kind'] = 'untagged', layer: number | null = null, dy = 0.0005): SourceWay =>
  ({ id, coords: xs.map(x => P(x, x > 0 && x < 20 ? dy : 0)), kind, layer });

describe('線をつなぐ（stitchWays）', () => {
  it('向きが逆の way も反転してつなぎ、途切れは gaps に残す', () => {
    const line = stitchWays([way('w1', [0, 3, 6]), way('w2', [10, 8, 6]), way('w3', [12, 20])]);
    expect(line.points[0]).toEqual(P(0));
    expect(line.points[line.points.length - 1]).toEqual(P(20));
    // w2 の終点(10) と w3 の始点(12) の間は約180m 途切れている
    expect(line.gaps).toHaveLength(1);
    expect(line.gaps[0].afterWay).toBe('w2');
    // つながった点は重複させない
    expect(line.points.filter(p => p[1] === P(6)[1])).toHaveLength(1);
  });
});

describe('駅で区切る（splitAtStations）', () => {
  const line = stitchWays([way('w1', [0, 2, 4, 6, 8, 10]), way('w2', [10, 12, 14, 16, 18, 20], 'bridge', 1)]);

  it('隣り合う駅の間ごとに、途中の点だけを持つ区間になる', () => {
    const { sections, issues } = splitAtStations(line, stations, { maxStationDistM: 100, simplifyM: 0 });
    expect(issues).toEqual([]);
    expect(sections.map(s => `${s.from}-${s.to}`)).toEqual(['A-B', 'B-C']);
    expect(sections[0].points.length).toBeGreaterThan(0);
    // 構造（橋）は B-C だけ、layer は高さではなく上下関係のまま
    expect(sections[0].structures).toBeUndefined();
    expect(sections[1].structures?.some(sp => sp.kind === 'bridge' && sp.layer === 1)).toBe(true);
  });

  it('線の向きが駅の並びと逆でも、駅の並びの向きで区切る', () => {
    const rev = stitchWays([way('w2', [20, 18, 16, 14, 12, 10]), way('w1', [10, 8, 6, 4, 2, 0])]);
    const { sections, issues } = splitAtStations(rev, stations, { maxStationDistM: 100, simplifyM: 0 });
    expect(issues).toEqual([]);
    expect(sections[0].points[0][1]).toBeLessThan(sections[0].points[sections[0].points.length - 1][1]);
  });

  it('線から遠い駅は問題として返す（勝手に寄せない）', () => {
    const far = [...stations.slice(0, 2), { name: 'C', lat: 35.01, lng: 139.02 }];
    const { issues } = splitAtStations(line, far, { maxStationDistM: 100, simplifyM: 0 });
    expect(issues.some(i => i.kind === 'station-far' && i.detail.startsWith('C'))).toBe(true);
  });
});

describe('描くときに駅の間へ線形の点を差し込む（expandWithGeometry）', () => {
  const geometry: TrackGeometry = {
    routeKey: 'test',
    source: { name: 't', url: 'https://example.com', license: 'ODbL', retrievedAt: '2026-09-29', crs: 'EPSG:4326' },
    sections: [{ from: 'A', to: 'B', points: [P(5, 0.001)] }],
  };
  it('線形のある区間だけ点が増え、逆向きの並びでも使える', () => {
    expect(expandWithGeometry(stations, geometry)).toEqual([[35, 139], P(5, 0.001), [35, 139.01], [35, 139.02]]);
    expect(expandWithGeometry([...stations].reverse(), geometry)).toEqual([[35, 139.02], [35, 139.01], P(5, 0.001), [35, 139]]);
  });
  it('線形が無ければ駅を直線で結ぶ（今までどおり）', () => {
    expect(expandWithGeometry(stations, undefined)).toEqual([[35, 139], [35, 139.01], [35, 139.02]]);
  });
});

describe('線形の検証（validateGeometry）', () => {
  const base = { routeKey: 'test', source: { name: 't', url: 'u', license: 'ODbL', retrievedAt: '2026-09-29', crs: 'EPSG:4326' as const } };
  it('隣り合わない駅・飛んだ点・高さの基準の無い標高を問題にする', () => {
    const problems = validateGeometry({
      ...base,
      sections: [
        { from: 'A', to: 'C', points: [] },
        { from: 'A', to: 'B', points: [P(5, 0.05)], trackElevationM: [12] },
      ],
    }, stations, { maxStationDistM: 150, maxJumpM: 2000 });
    expect(problems.some(p => p.includes('隣り合う駅ではない'))).toBe(true);
    expect(problems.some(p => p.includes('飛んでいる'))).toBe(true);
    expect(problems.some(p => p.includes('高さの基準'))).toBe(true);
  });
  it('距離の計算: 経度0.01度（緯度35度）は約912m', () => {
    expect(Math.round(distanceM([35, 139], [35, 139.01]))).toBeGreaterThan(900);
    expect(Math.round(distanceM([35, 139], [35, 139.01]))).toBeLessThan(920);
  });
});
