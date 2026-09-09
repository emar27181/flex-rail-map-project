/**
 * 路線切り替え（ボード表示）のテスト。
 *
 * 従来の一覧は490路線を1行1件で並べるだけで、絞り込みも無く
 * 目的の路線に届かなかった。ここで固定したいのは次の3点:
 * - 呼び出し側が渡した並び順（既定は画面中心から近い順）を勝手に並べ替えない
 * - 絞り込みが翻訳後の名前でも元の日本語名でも効く
 * - 状態（表示中／非表示）でチップの外形が変わらない
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RouteSwitchBoard from '../../../../src/components/legend/RouteSwitchBoard';
import type { RouteKey } from '../../../../src/data/routes';

vi.mock('../../../../src/contexts/ThemeContext', () => ({
  getThemeColors: () => ({
    background: '#fff', surface: '#f5f5f5', surfaceElevated: '#fff',
    border: '#ddd', borderLight: '#eee',
    text: '#333', textSecondary: '#666',
  }),
}));

vi.mock('../../../../src/utils/translation', () => ({
  // 翻訳を通した名前と元の日本語名を区別できるようにする
  translateRoute: (name: string) => (name === '山手線' ? 'Yamanote Line' : name),
  translateUI: (key: string) => key,
}));

const routeNames = {
  yamanote: '山手線',
  chuo: '中央線',
  ginzaLine: '銀座線',
} as unknown as Record<RouteKey, string>;

const routeColors = {
  yamanote: '#9ACD32',
  chuo: '#FFA500',
  ginzaLine: '#FF9500',
} as unknown as Record<RouteKey, string>;

/** 呼び出し側が渡す順序（近い順のつもり）。名前順とはわざと違う並びにする */
const routeKeys = ['ginzaLine', 'yamanote', 'chuo'] as RouteKey[];

const renderBoard = (overrides: Partial<React.ComponentProps<typeof RouteSwitchBoard>> = {}) => {
  const onToggleRoute = vi.fn();
  const utils = render(
    <RouteSwitchBoard
      routeKeys={routeKeys}
      visibleRoutes={new Set<RouteKey>()}
      routeColors={routeColors}
      routeNames={routeNames}
      theme="light"
      language="japanese"
      onToggleRoute={onToggleRoute}
      onSelectAllRoutes={vi.fn()}
      onDeselectAllRoutes={vi.fn()}
      adjustRouteColorForTheme={(c) => c}
      {...overrides}
    />,
  );
  return { ...utils, onToggleRoute };
};

/** 路線チップだけを名前順ではなく描画順で取り出す */
const chipLabels = () =>
  Array.from(document.querySelectorAll('button[aria-pressed]'))
    .map(el => (el as HTMLElement).textContent?.trim() ?? '');

describe('RouteSwitchBoard', () => {
  it('渡された並び順のまま描く（名前順に並べ替えない）', () => {
    renderBoard();
    expect(chipLabels()).toEqual(['銀座線', 'Yamanote Line', '中央線']);
  });

  it('翻訳後の名前で絞り込める', () => {
    renderBoard();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'yamanote' } });
    expect(chipLabels()).toEqual(['Yamanote Line']);
  });

  it('英語表示でも元の日本語名で絞り込める', () => {
    // 表示は英語でも、日本語で入力して引けないと日本語話者が探せない
    renderBoard();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '山手' } });
    expect(chipLabels()).toEqual(['Yamanote Line']);
  });

  it('一致するものが無ければその旨を出す', () => {
    renderBoard();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ありえない路線' } });
    expect(chipLabels()).toEqual([]);
    expect(screen.getByText('routeNoMatch')).toBeTruthy();
  });

  it('チップを押すと切り替えが呼ばれる', () => {
    const { onToggleRoute } = renderBoard();
    fireEvent.click(screen.getByText('中央線'));
    expect(onToggleRoute).toHaveBeenCalledWith('chuo');
  });

  it('表示中と非表示でチップの枠線の太さと文字の太さが変わらない', () => {
    // 太さが変わるとチップの外形が動いて、押すたびに並びがずれる
    renderBoard({ visibleRoutes: new Set(['yamanote'] as RouteKey[]) });
    const chips = Array.from(document.querySelectorAll('button[aria-pressed]')) as HTMLElement[];
    const on = chips.find(c => c.getAttribute('aria-pressed') === 'true')!;
    const off = chips.find(c => c.getAttribute('aria-pressed') === 'false')!;
    expect(on.style.borderTopWidth).toBe(off.style.borderTopWidth);
    expect(on.style.fontWeight).toBe(off.style.fontWeight);
    expect(on.style.boxSizing).toBe('border-box');
  });

  it('表示中の路線は路線色で塗られ、非表示は塗られない', () => {
    renderBoard({ visibleRoutes: new Set(['yamanote'] as RouteKey[]) });
    const chips = Array.from(document.querySelectorAll('button[aria-pressed]')) as HTMLElement[];
    const on = chips.find(c => c.getAttribute('aria-pressed') === 'true')!;
    const off = chips.find(c => c.getAttribute('aria-pressed') === 'false')!;
    expect(on.style.backgroundColor).not.toBe(off.style.backgroundColor);
  });

  it('経路上・駅を通る路線が先に来る', () => {
    renderBoard({ stationRouteKeys: new Set(['chuo'] as RouteKey[]) });
    expect(chipLabels()[0]).toBe('中央線');
  });
});
