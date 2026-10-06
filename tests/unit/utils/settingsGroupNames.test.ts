/**
 * 設定パネルの節の名前（2026-10-07 ユーザー指示）。
 * - px などで見た目を変える節は「UI設定」（以前は「表示切替」）
 */
import { describe, it, expect } from 'vitest';
import { translateUI } from '../../../src/utils/translation';

describe('設定パネルの節の名前', () => {
  it('UI設定', () => {
    expect(translateUI('settingsGroupMap', 'japanese')).toBe('UI設定');
    expect(translateUI('settingsGroupMap', 'english')).toBe('UI Settings');
  });
});
