import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderHook, act } from '@testing-library/react';
import { useCanHover } from '../../../../src/hooks/useCanHover';
import { MEDIA } from '../../../../src/constants/breakpoints';

/** matchMedia の結果を差し替える（change を後から起こせる） */
function mockMatchMedia(initial: boolean) {
  const listeners = new Set<() => void>();
  const state = { matches: initial };
  const query = {
    get matches() { return state.matches; },
    media: MEDIA.mouse,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  };
  const spy = vi.fn((q: string) => {
    expect(q).toBe(MEDIA.mouse);
    return query;
  });
  window.matchMedia = spy as unknown as typeof window.matchMedia;
  return { set: (v: boolean) => { state.matches = v; listeners.forEach(fn => fn()); } };
}

const original = window.matchMedia;
afterEach(() => { window.matchMedia = original; });

describe('useCanHover（マウスで操作する端末か）', () => {
  it('MEDIA.mouse に合うとき true、指の端末では false', () => {
    mockMatchMedia(true);
    expect(renderHook(() => useCanHover()).result.current).toBe(true);
    mockMatchMedia(false);
    expect(renderHook(() => useCanHover()).result.current).toBe(false);
  });

  it('端末の状態が変わったら（マウスをつないだ等）決め直す', () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useCanHover());
    expect(result.current).toBe(false);
    act(() => media.set(true));
    expect(result.current).toBe(true);
  });
});

describe('地図の線のホバーはマウスのときだけ（iPhone の Safari でタップが効かなくなるため）', () => {
  const src = readFileSync(join(__dirname, '../../../../src/components/RailwayMap.tsx'), 'utf8');

  it('線のホバー（強調）は routeHoverHandlers を通して付ける', () => {
    expect(src).not.toMatch(/mouseover: \(\) => setHoveredRoute\((routeKey|rKey)\),\s*\n\s*mouseout/);
    expect(src).toMatch(/const routeHoverHandlers = \(routeKey: string\) => \(canHover/);
  });

  it('線の路線名の吹き出し（sticky な Tooltip）は canHover のときだけ描く', () => {
    const stickyRouteTooltips = src.match(/<Tooltip sticky offset=\{\[10, 0\]\}/g) ?? [];
    const gated = src.match(/\{canHover && <Tooltip sticky offset=\{\[10, 0\]\}/g) ?? [];
    expect(stickyRouteTooltips.length).toBeGreaterThan(0);
    expect(gated.length).toBe(stickyRouteTooltips.length);
  });
});
