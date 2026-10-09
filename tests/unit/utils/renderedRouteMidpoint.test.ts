import { describe, expect, it } from 'vitest';
import { renderedRouteMidpoint, stationVertexIndices } from '../../../src/utils/renderedRouteMidpoint';
import type { RenderedRouteSegment } from '../../../src/utils/renderedRouteMidpoint';
import type { LatLng, TrackGeometry } from '../../../src/data/trackGeometry/types';

const a = { name: 'A', lat: 0, lng: 0 };
const b = { name: 'B', lat: 10, lng: 10 };
const c = { name: 'C', lat: 10, lng: 20 };
const project = ([lat, lng]: LatLng) => ({ x: lng, y: lat });
const unproject = ({ x, y }: { x: number; y: number }): LatLng => [y, x];
const midpoint = (segments: RenderedRouteSegment[], from = a, to = b) =>
  renderedRouteMidpoint(segments, from, to, project, unproject);

describe('描画した路線上の所要時間位置', () => {
  it('並走オフセット後の線を使い、元の駅の中点には置かない', () => {
    expect(midpoint([{ stations: [a, b], positions: [[2, 0], [12, 10]], stationIndices: [0, 1] }]))
      .toEqual([7, 5]);
  });

  it('カーブの長さを半分たどり、直線の中点を避ける（逆方向も同じ）', () => {
    const segments: RenderedRouteSegment[] = [{ stations: [a, b], positions: [[0, 0], [0, 10], [10, 10]], stationIndices: [0, 2] }];
    expect(midpoint(segments)).toEqual([0, 10]);
    expect(midpoint(segments, b, a)).toEqual([0, 10]);
  });

  it('駅間にも複数駅の合算にも、描画セグメント全体の同じ頂点列を使う', () => {
    const segments: RenderedRouteSegment[] = [{ stations: [a, b, c], positions: [[0, 0], [0, 10], [10, 10], [10, 20]], stationIndices: [0, 2, 3] }];
    expect(midpoint(segments, b, c)).toEqual([10, 15]);
    expect(midpoint(segments, a, c)).toEqual([5, 10]);
  });

  it('非連続の別区間や、同名で座標の異なる駅を結ばない', () => {
    const segments: RenderedRouteSegment[] = [
      { stations: [a], positions: [[0, 0]], stationIndices: [0] },
      { stations: [b], positions: [[10, 10]], stationIndices: [0] },
    ];
    expect(midpoint(segments)).toBeNull();
    expect(midpoint(segments, { ...a, lat: 1 }, a)).toBeNull();
  });

  it('重複座標でもNaNを出さない', () => {
    expect(midpoint([{ stations: [a, b], positions: [[0, 0], [0, 0]], stationIndices: [0, 1] }]))
      .toEqual([0, 0]);
  });

  it('線形の途中頂点を数え、欠損区間と逆方向にも駅のインデックスを合わせる', () => {
    const geometry = { sections: [{ from: 'A', to: 'B', points: [[0, 3], [0, 6]] }] } as TrackGeometry;
    expect(stationVertexIndices([a, b, c], geometry)).toEqual([0, 3, 4]);
    expect(stationVertexIndices([c, b, a], geometry)).toEqual([0, 1, 4]);
    expect(stationVertexIndices([a, b, c])).toEqual([0, 1, 2]);
  });
});
