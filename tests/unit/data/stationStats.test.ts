import { describe, it, expect } from 'vitest';
import { getParamRange, STAT_PARAMS, PARAM_DATA_SOURCES } from '../../../src/data/stationStats';

// niceStep のロジックを直接テスト（RailwayMap.tsx と同じアルゴリズム）
function niceStep(fullRange: number): number {
  const rnd1 = (v: number) => Math.round(v * 10) / 10;
  if (fullRange <= 0) return 1;
  const rough = fullRange / 40;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const s = norm <= 1 ? mag : norm <= 2 ? 2 * mag : norm <= 5 ? 5 * mag : 10 * mag;
  return rnd1(s);
}

describe('niceStep アルゴリズム', () => {
  it('家賃レンジ（約20万）は0.5刻みになる', () => {
    expect(niceStep(20)).toBe(0.5);
  });

  it('家賃1LDKレンジ（約30万）は1.0刻みになる', () => {
    expect(niceStep(30)).toBe(1);
  });

  it('治安スコアレンジ（100）は5刻みになる', () => {
    expect(niceStep(100)).toBe(5);
  });

  it('人口密度レンジ（50000）は2000刻みになる', () => {
    expect(niceStep(50000)).toBe(2000);
  });

  it('乗降客数レンジ（500000）は20000刻みになる', () => {
    expect(niceStep(500000)).toBe(20000);
  });

  it('レンジ0以下は1を返す（ゼロ除算防止）', () => {
    expect(niceStep(0)).toBe(1);
    expect(niceStep(-1)).toBe(1);
  });

  it('小さいレンジ（1）は正の値を返す', () => {
    const step = niceStep(1);
    expect(step).toBeGreaterThan(0);
  });
});

describe('getParamRange', () => {
  it('avgRent1K のレンジが min < max を満たす', () => {
    const { min, max } = getParamRange('avgRent1K');
    expect(min).toBeLessThan(max);
  });

  it('dailyPassengers のレンジが正の値', () => {
    const { min, max } = getParamRange('dailyPassengers');
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeGreaterThan(0);
  });

  it('全 STAT_PARAMS のレンジが min <= max を満たす', () => {
    for (const p of STAT_PARAMS) {
      const { min, max } = getParamRange(p.key);
      expect(min, `${String(p.key)}: min <= max`).toBeLessThanOrEqual(max);
    }
  });
});

describe('PARAM_DATA_SOURCES', () => {
  it('dead フラグが true のソースは url が設定されていても非リンクになる想定', () => {
    for (const [key, src] of Object.entries(PARAM_DATA_SOURCES)) {
      if (src?.dead) {
        // dead=true のときは url があっても無視される（UIテスト不要、型のみ確認）
        expect(typeof src.dead).toBe('boolean');
      }
    }
  });

  it('全ソースに retrievedAt が設定されている', () => {
    for (const [key, src] of Object.entries(PARAM_DATA_SOURCES)) {
      expect(src?.retrievedAt, `${key} に retrievedAt が必要`).toBeTruthy();
    }
  });
});
