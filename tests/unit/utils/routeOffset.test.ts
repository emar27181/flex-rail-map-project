/**
 * 重なっている路線をずらす計算のテスト。
 *
 * 山手線と京浜東北線のように同じ区間を走る路線は座標がほぼ同じで、
 * 上に描いた1本しか見えていなかった。ここで固定したいのは:
 * - 重なっていない区間はずらさない（元の位置のまま）
 * - 重なっている本数の中心を基準に左右へ振り分ける
 * - ずらす向きが線に対して垂直である
 */
import { describe, it, expect } from 'vitest';
import {
  corridorKey,
  buildCorridorRoutes,
  offsetRank,
  vertexRanks,
  offsetPoints,
} from '../../../src/utils/routeOffset';

const st = (...names: string[]) => names.map(name => ({ name }));

describe('corridorKey', () => {
  it('駅の並びが逆でも同じキーになる', () => {
    // 上りと下りで並びが逆に定義されている路線があるため
    expect(corridorKey('品川', '田町')).toBe(corridorKey('田町', '品川'));
  });

  it('別の区間は別のキーになる', () => {
    expect(corridorKey('品川', '田町')).not.toBe(corridorKey('品川', '大崎'));
  });
});

describe('buildCorridorRoutes', () => {
  it('同じ2駅を結ぶ路線をまとめる', () => {
    const index = buildCorridorRoutes([
      ['yamanote', st('品川', '田町', '浜松町')],
      ['keihinTohoku', st('品川', '田町', '浜松町')],
      ['tokaido', st('品川', '新橋')],
    ]);
    expect(index.get(corridorKey('品川', '田町'))).toEqual(['yamanote', 'keihinTohoku']);
    expect(index.get(corridorKey('品川', '新橋'))).toEqual(['tokaido']);
  });

  it('同じ路線が同じ区間を2回通っても重複して数えない', () => {
    const index = buildCorridorRoutes([
      ['loop', st('A', 'B', 'A', 'B')],
    ]);
    expect(index.get(corridorKey('A', 'B'))).toEqual(['loop']);
  });

  it('駅名が一致しない並走区間は拾わない', () => {
    // 座標が近いだけでは判定しない（データが同じ2駅を結んでいるかで判断する）
    const index = buildCorridorRoutes([
      ['a', st('品川', '大井町')],
      ['b', st('品川', '大崎')],
    ]);
    expect(index.get(corridorKey('品川', '大井町'))).toEqual(['a']);
    expect(index.get(corridorKey('品川', '大崎'))).toEqual(['b']);
  });
});

describe('offsetRank', () => {
  it('1本しか走っていない区間はずらさない', () => {
    expect(offsetRank(['yamanote'], 'yamanote')).toBe(0);
    expect(offsetRank(undefined, 'yamanote')).toBe(0);
  });

  it('2本なら中心をはさんで左右に振り分ける', () => {
    expect(offsetRank(['a', 'b'], 'a')).toBe(-0.5);
    expect(offsetRank(['a', 'b'], 'b')).toBe(0.5);
  });

  it('3本なら中央の1本は動かない', () => {
    expect(offsetRank(['a', 'b', 'c'], 'a')).toBe(-1);
    expect(offsetRank(['a', 'b', 'c'], 'b')).toBe(0);
    expect(offsetRank(['a', 'b', 'c'], 'c')).toBe(1);
  });

  it('段数の合計は0になる（区間全体の位置が元からずれない）', () => {
    const routes = ['a', 'b', 'c', 'd'];
    const total = routes.reduce((sum, r) => sum + offsetRank(routes, r), 0);
    expect(total).toBeCloseTo(0);
  });

  it('その区間を走っていない路線はずらさない', () => {
    expect(offsetRank(['a', 'b'], 'z')).toBe(0);
  });
});

describe('vertexRanks', () => {
  const index = buildCorridorRoutes([
    ['yamanote', st('大崎', '品川', '田町', '浜松町')],
    ['keihinTohoku', st('品川', '田町', '浜松町')],
  ]);

  it('共用していない区間の端はずらさない', () => {
    // 大崎-品川 は山手線だけなので、大崎側は0
    const ranks = vertexRanks(['大崎', '品川', '田町', '浜松町'], 'yamanote', index);
    expect(ranks[0]).toBe(0);
  });

  it('共用区間ではずれる', () => {
    const ranks = vertexRanks(['大崎', '品川', '田町', '浜松町'], 'yamanote', index);
    expect(ranks[2]).toBe(-0.5);
    expect(ranks[3]).toBe(-0.5);
  });

  it('単独区間から共用区間へ移る頂点は中間の値になる', () => {
    // 品川は「大崎-品川(単独=0)」と「品川-田町(共用=-0.5)」の間
    const ranks = vertexRanks(['大崎', '品川', '田町', '浜松町'], 'yamanote', index);
    expect(ranks[1]).toBe(-0.25);
  });

  it('2つの路線は反対側にずれる', () => {
    const a = vertexRanks(['品川', '田町'], 'yamanote', index);
    const b = vertexRanks(['品川', '田町'], 'keihinTohoku', index);
    expect(a[0]).toBe(-b[0]);
  });

  it('駅が0個・1個でも壊れない', () => {
    expect(vertexRanks([], 'yamanote', index)).toEqual([]);
    expect(vertexRanks(['品川'], 'yamanote', index)).toEqual([0]);
  });
});

describe('offsetPoints', () => {
  it('段数0の頂点は動かさない', () => {
    const pts = [{ x: 0, y: 0 }, { x: 10, y: 0 }];
    expect(offsetPoints(pts, [0, 0], 4)).toEqual(pts);
  });

  it('東西に伸びる線は南北にずれる', () => {
    const pts = [{ x: 0, y: 0 }, { x: 10, y: 0 }];
    const out = offsetPoints(pts, [1, 1], 4);
    // 進行方向(+x)に対する法線は -y 方向
    expect(out[0].x).toBeCloseTo(0);
    expect(out[0].y).toBeCloseTo(4);
    expect(out[1].y).toBeCloseTo(4);
  });

  it('南北に伸びる線は東西にずれる', () => {
    const pts = [{ x: 0, y: 0 }, { x: 0, y: 10 }];
    const out = offsetPoints(pts, [1, 1], 4);
    expect(out[0].x).toBeCloseTo(-4);
    expect(out[0].y).toBeCloseTo(0);
  });

  it('ずらす向きは線に対して垂直', () => {
    const pts = [{ x: 0, y: 0 }, { x: 6, y: 8 }]; // 長さ10の斜め線
    const out = offsetPoints(pts, [1, 1], 5);
    const dir = { x: 6, y: 8 };
    const move = { x: out[0].x - pts[0].x, y: out[0].y - pts[0].y };
    // 内積が0なら直交している
    expect(dir.x * move.x + dir.y * move.y).toBeCloseTo(0);
    // 移動量は指定した距離ぶん
    expect(Math.hypot(move.x, move.y)).toBeCloseTo(5);
  });

  it('段数に比例した距離だけずれる', () => {
    const pts = [{ x: 0, y: 0 }, { x: 10, y: 0 }];
    const one = offsetPoints(pts, [1, 1], 4)[0];
    const two = offsetPoints(pts, [2, 2], 4)[0];
    expect(Math.abs(two.y)).toBeCloseTo(Math.abs(one.y) * 2);
  });

  it('反対の段数は反対側にずれる', () => {
    const pts = [{ x: 0, y: 0 }, { x: 10, y: 0 }];
    const plus = offsetPoints(pts, [0.5, 0.5], 4)[0];
    const minus = offsetPoints(pts, [-0.5, -0.5], 4)[0];
    expect(plus.y).toBeCloseTo(-minus.y);
  });

  it('同じ座標が連続していても壊れない', () => {
    // 向きが決まらないので、その頂点は動かさない
    const pts = [{ x: 5, y: 5 }, { x: 5, y: 5 }];
    const out = offsetPoints(pts, [1, 1], 4);
    expect(out).toEqual(pts);
  });

  it('頂点が1つ以下ならそのまま返す', () => {
    expect(offsetPoints([{ x: 1, y: 2 }], [1], 4)).toEqual([{ x: 1, y: 2 }]);
    expect(offsetPoints([], [], 4)).toEqual([]);
  });
});
