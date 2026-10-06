import { describe, expect, it } from 'vitest';
import type { Station } from '../../../src/data/yamanote';
import { findDirectionalStation } from '../../../src/utils/stationKeyboardNavigation';

const station = (name: string, lat: number, lng: number): Station => ({ name, lat, lng });

describe('findDirectionalStation', () => {
  it('左右キーで東西方向の隣駅へ移動する', () => {
    const a = station('A', 35, 139);
    const b = station('B', 35, 139.01);
    const c = station('C', 35, 139.02);
    const map = { line: [a, b, c] };

    expect(findDirectionalStation(b, map, new Set(['line']), 'ArrowLeft')?.name).toBe('A');
    expect(findDirectionalStation(b, map, new Set(['line']), 'ArrowRight')?.name).toBe('C');
  });

  it('上下キーで南北方向の隣駅へ移動する', () => {
    const north = station('North', 35.02, 139);
    const center = station('Center', 35.01, 139);
    const south = station('South', 35, 139);
    const map = { line: [north, center, south] };

    expect(findDirectionalStation(center, map, new Set(['line']), 'ArrowUp')?.name).toBe('North');
    expect(findDirectionalStation(center, map, new Set(['line']), 'ArrowDown')?.name).toBe('South');
  });

  it('乗換駅では表示中の複数路線から押下方向に近い隣駅を選ぶ', () => {
    const center = station('Center', 35, 139);
    const west = station('West', 35, 138.99);
    const east = station('East', 35, 139.01);
    const north = station('North', 35.01, 139);
    const south = station('South', 34.99, 139);
    const map = {
      horizontal: [west, center, east],
      vertical: [north, center, south],
    };

    const visible = new Set(['horizontal', 'vertical']);
    expect(findDirectionalStation(center, map, visible, 'ArrowUp')?.name).toBe('North');
    expect(findDirectionalStation(center, map, visible, 'ArrowRight')?.name).toBe('East');
  });

  it('現在駅を通る表示路線が無い場合は全路線へフォールバックする', () => {
    const a = station('A', 35, 139);
    const b = station('B', 35, 139.01);
    const map = { hiddenLine: [a, b] };

    expect(findDirectionalStation(a, map, new Set(), 'ArrowRight')?.name).toBe('B');
  });
});
