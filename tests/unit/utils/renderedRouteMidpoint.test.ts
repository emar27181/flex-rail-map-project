import { describe, expect, it } from 'vitest';
import { closeFullRouteStations, renderedRouteMidpoint, stationVertexIndices } from '../../../src/utils/renderedRouteMidpoint';
import { yamanote } from '../../../src/data/yamanote';
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
  it('山手線の全周は有楽町から東京へ閉じ、元データは変更しない', () => {
    const closed = closeFullRouteStations(yamanote, yamanote, true);
    expect(closed.at(-2)?.name).toBe('有楽町');
    expect(closed.at(-1)?.name).toBe('東京');
    expect(closed).toHaveLength(yamanote.length + 1);
    expect(yamanote.at(-1)?.name).toBe('有楽町');
    expect(stationVertexIndices(closed)).toHaveLength(closed.length);
  });

  it('部分区間・非環状線・既に閉じた環状線を誤接続しない', () => {
    const partial = yamanote.slice(0, 3);
    expect(closeFullRouteStations(partial, yamanote, true)).toBe(partial);
    expect(closeFullRouteStations(yamanote, yamanote, false)).toBe(yamanote);
    const closed = [...yamanote, yamanote[0]];
    expect(closeFullRouteStations(closed, closed, true)).toBe(closed);
  });

  it('閉じた環状線の末尾から先頭への中点は閉じる区間上に置く', () => {
    const stations = [a, b, c, a];
    const segments = [{ stations, positions: stations.map(s => [s.lat, s.lng] as LatLng), stationIndices: [0, 1, 2, 3] }];
    expect(midpoint(segments, c, a)).toEqual([5, 10]);
    expect(midpoint(segments, a, c)).toEqual([5, 10]);
  });
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
