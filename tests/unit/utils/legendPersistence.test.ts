/**
 * 凡例「N路線」の開閉の保持（src/utils/legendPersistence.ts）のテスト。
 * 開いて始め（2026-11 ユーザー指示「凡例はデフォルト展開で」）、閉じたことを保存した人だけ閉じて始める。
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { getInitialLegendCollapsed, persistLegendCollapsed, VISIBLE_ROUTES_LEGEND_COLLAPSED_KEY } from '../../../src/utils/legendPersistence';

describe('凡例の開閉の保持', () => {
  beforeEach(() => localStorage.clear());

  it('保存が無ければ開いて始める', () => {
    expect(getInitialLegendCollapsed()).toBe(false);
  });

  it('開いたことを保存した人は開いて始める', () => {
    persistLegendCollapsed(false);
    expect(localStorage.getItem(VISIBLE_ROUTES_LEGEND_COLLAPSED_KEY)).toBe('0');
    expect(getInitialLegendCollapsed()).toBe(false);
  });

  it('閉じたことを保存した人は閉じて始める', () => {
    persistLegendCollapsed(true);
    expect(getInitialLegendCollapsed()).toBe(true);
  });
});
