import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useLocationDeparture } from '../../../../src/hooks/useLocationDeparture';

describe('現在地からの再許可・再取得', () => {
  it('拒否時は案内を開き、再取得が成功した新しい位置だけを適用する', () => {
    const apply = vi.fn(), retry = vi.fn();
    const oldLocation: [number, number] = [35, 139];
    const { result, rerender } = renderHook(({ location, error }) => useLocationDeparture(location, error, apply, retry),
      { initialProps: { location: oldLocation as [number, number] | null, error: 'denied' as string | null } });
    act(() => result.current.start());
    expect(result.current.open).toBe(true);
    act(() => result.current.retry());
    expect(retry).toHaveBeenCalledOnce();
    rerender({ location: oldLocation, error: null });
    expect(apply).not.toHaveBeenCalled();
    rerender({ location: [36, 140], error: null });
    expect(apply).toHaveBeenCalledOnce();
    expect(result.current.open).toBe(false);
  });

  it('拒否が続く間は案内を残し、閉じた後のGPS更新では出発駅を変えない', () => {
    const apply = vi.fn();
    const { result, rerender } = renderHook(({ location, error }) => useLocationDeparture(location, error, apply, vi.fn()),
      { initialProps: { location: null as [number, number] | null, error: 'denied' as string | null } });
    act(() => { result.current.start(); result.current.retry(); });
    expect(result.current.open).toBe(true);
    expect(apply).not.toHaveBeenCalled();
    act(() => result.current.close());
    rerender({ location: [35, 139], error: null });
    expect(apply).not.toHaveBeenCalled();
  });

  it('取得済みなら案内なしで適用し、未取得なら案内する', () => {
    const apply = vi.fn();
    const { result, rerender } = renderHook(({ location }) => useLocationDeparture(location, null, apply),
      { initialProps: { location: [35, 139] as [number, number] | null } });
    act(() => result.current.start());
    expect(apply).toHaveBeenCalledOnce();
    expect(result.current.open).toBe(false);
    rerender({ location: null });
    act(() => result.current.start());
    expect(result.current.open).toBe(true);
  });
});
