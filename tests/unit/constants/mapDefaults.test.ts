/**
 * 位置情報が無いときの既定の表示位置（src/constants/mapDefaults.ts）のテスト。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_MAP_CENTER } from '../../../src/constants/mapDefaults';
import { yamanote } from '../../../src/data/yamanote';

describe('既定の表示位置', () => {
  it('東京駅を中心にする', () => {
    const tokyo = yamanote.find(s => s.name === '東京')!;
    expect(DEFAULT_MAP_CENTER).toEqual([tokyo.lat, tokyo.lng]);
  });

  it('地図は既定の中心を定数から取り、座標を直書きしない（以前は武蔵小杉付近を直書きしていた）', () => {
    const src = readFileSync(join(__dirname, '../../../src/components/RailwayMap.tsx'), 'utf8');
    expect(src).toContain('DEFAULT_MAP_CENTER');
    expect(src).not.toMatch(/useState<\[number, number\]>\(\s*\[\s*\d/);
  });
});
