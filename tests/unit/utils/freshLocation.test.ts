import { describe, it, expect, vi } from 'vitest';
import { requestFreshPosition, resolveCurrentPosition, LOCATION_FRESH_ENOUGH_MS } from '../../../src/utils/freshLocation';

const geo = (impl: Geolocation['getCurrentPosition']) => ({ getCurrentPosition: impl });

describe('requestFreshPosition', () => {
  it('キャッシュを使わず（maximumAge: 0）、高精度で取り直す', async () => {
    const spy = vi.fn((ok: PositionCallback) => ok({ coords: { latitude: 35.1, longitude: 139.2 } } as GeolocationPosition));
    const r = await requestFreshPosition(geo(spy as unknown as Geolocation['getCurrentPosition']));
    expect(r).toEqual([35.1, 139.2]);
    const opts = spy.mock.calls[0][2] as PositionOptions;
    expect(opts.maximumAge).toBe(0);
    expect(opts.enableHighAccuracy).toBe(true);
  });

  it('取れなかったとき（権限拒否・時間切れ）は null', async () => {
    const r = await requestFreshPosition(geo(((_ok: PositionCallback, err?: PositionErrorCallback | null) =>
      err?.({ code: 1 } as GeolocationPositionError)) as Geolocation['getCurrentPosition']));
    expect(r).toBeNull();
  });

  it('コールバックが返ってこなくても、上限で打ち切って null', async () => {
    vi.useFakeTimers();
    const p = requestFreshPosition(geo((() => {}) as Geolocation['getCurrentPosition']), 100);
    await vi.advanceTimersByTimeAsync(700);
    expect(await p).toBeNull();
    vi.useRealTimers();
  });

  it('位置情報に対応していない環境では null', async () => {
    expect(await requestFreshPosition(null)).toBeNull();
  });
});

describe('resolveCurrentPosition', () => {
  const known: [number, number] = [35.0, 139.0];
  const fresh: [number, number] = [35.5, 139.5];

  it('直前に更新された位置は、取り直さずそのまま使う', async () => {
    const fetchFresh = vi.fn(async () => fresh);
    const r = await resolveCurrentPosition({ known, knownAt: 1000, now: 1000 + LOCATION_FRESH_ENOUGH_MS, fetchFresh });
    expect(r).toEqual({ position: known, refreshed: false });
    expect(fetchFresh).not.toHaveBeenCalled();
  });

  it('時間が空いて古くなっていたら、取り直した位置を使う', async () => {
    const fetchFresh = vi.fn(async () => fresh);
    const r = await resolveCurrentPosition({ known, knownAt: 1000, now: 1000 + LOCATION_FRESH_ENOUGH_MS + 1, fetchFresh });
    expect(r).toEqual({ position: fresh, refreshed: true });
    expect(fetchFresh).toHaveBeenCalledTimes(1);
  });

  it('取り直せなかったときは古い位置で続ける', async () => {
    const r = await resolveCurrentPosition({ known, knownAt: 0, now: 10 * 60_000, fetchFresh: async () => null });
    expect(r).toEqual({ position: known, refreshed: false });
  });

  it('位置がまだ無く、取り直せもしないときは null', async () => {
    const r = await resolveCurrentPosition({ known: null, knownAt: 0, now: 5000, fetchFresh: async () => null });
    expect(r.position).toBeNull();
  });

  it('位置がまだ無いときも取り直す', async () => {
    const r = await resolveCurrentPosition({ known: null, knownAt: 0, now: 5000, fetchFresh: async () => fresh });
    expect(r).toEqual({ position: fresh, refreshed: true });
  });
});
