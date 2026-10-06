/**
 * 方位磁針の針を回す角度（utils/angle.ts）のテスト。
 * 地図の回転角は 0〜360° に丸められて届き、北をまたぐと針が逆向きに1周して震えて見えていた。
 */
import { describe, it, expect } from 'vitest';
import { continuousAngle } from '../../../src/utils/angle';

describe('continuousAngle', () => {
  it('北をまたいでも最短の向きに進む（359°→1° は +2°）', () => {
    expect(continuousAngle(359, 1)).toBe(361);
    expect(continuousAngle(1, 359)).toBe(-1);
  });

  it('何周しても前の値から連続する', () => {
    let shown = 0;
    for (const raw of [350, 340, 10, 20, 350]) shown = continuousAngle(shown, raw);
    expect(shown).toBe(-10);
    expect(continuousAngle(720, 5)).toBe(725);
  });

  it('小さな揺れはそのまま小さな動きになる', () => {
    expect(continuousAngle(90, 91)).toBe(91);
    expect(continuousAngle(90, 89.5)).toBe(89.5);
  });

  it('向きとしては常に届いた角度と同じ', () => {
    for (const [p, n] of [[0, 180], [123, 300], [-400, 45], [10, 190]]) {
      const r = continuousAngle(p, n);
      expect(((r % 360) + 360) % 360).toBeCloseTo(n, 9);
      expect(Math.abs(r - p)).toBeLessThanOrEqual(180);
    }
  });
});
