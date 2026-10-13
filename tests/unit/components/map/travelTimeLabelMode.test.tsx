import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTravelTimeLabelMode } from '../../../../src/hooks/useTravelTimeLabelMode';

describe('所要時間表示の既定モード', () => {
  it('出発駅がなければ駅間、あれば累積で初期化する', () => {
    const withoutDeparture = renderHook(() => useTravelTimeLabelMode(false));
    const withDeparture = renderHook(() => useTravelTimeLabelMode(true));
    expect(withoutDeparture.result.current[0]).toBe('interval');
    expect(withDeparture.result.current[0]).toBe('cumulative');
  });

  it('出発駅を設定したら累積、解除したら駅間、再設定したら累積にする', () => {
    const { result, rerender } = renderHook(
      ({ hasDeparture }) => useTravelTimeLabelMode(hasDeparture),
      { initialProps: { hasDeparture: false } },
    );
    rerender({ hasDeparture: true });
    expect(result.current[0]).toBe('cumulative');
    rerender({ hasDeparture: false });
    expect(result.current[0]).toBe('interval');
    rerender({ hasDeparture: true });
    expect(result.current[0]).toBe('cumulative');
  });

  it('設定中の手動切り替えは再描画で上書きせず、出発駅を解除/再設定したら既定に戻す', () => {
    const { result, rerender } = renderHook(
      ({ hasDeparture }) => useTravelTimeLabelMode(hasDeparture),
      { initialProps: { hasDeparture: true } },
    );
    act(() => result.current[1]('interval'));
    rerender({ hasDeparture: true });
    expect(result.current[0]).toBe('interval');
    rerender({ hasDeparture: false });
    rerender({ hasDeparture: true });
    expect(result.current[0]).toBe('cumulative');
  });
});
