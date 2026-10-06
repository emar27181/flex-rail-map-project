/**
 * 設定パネルの節の名前（2026-10-07 ユーザー指示）。
 * - px などで見た目を変える節は「UI設定」（以前は「表示切替」）
 * - 複数の駅の路線を地図に出す節は「複数駅の共通路線」（以前は「最寄り駅メモ」）
 */
import { describe, it, expect } from 'vitest';
import { translateUI } from '../../../src/utils/translation';

describe('設定パネルの節の名前', () => {
  it('UI設定', () => {
    expect(translateUI('settingsGroupMap', 'japanese')).toBe('UI設定');
    expect(translateUI('settingsGroupMap', 'english')).toBe('UI Settings');
  });
  it('複数駅の共通路線', () => {
    expect(translateUI('memoTitle', 'japanese')).toBe('複数駅の共通路線');
    expect(translateUI('memoTitle', 'english')).toBe('Lines shared by stations');
  });
});
