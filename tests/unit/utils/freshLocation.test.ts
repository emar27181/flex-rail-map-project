import { describe, it, expect, vi } from 'vitest';
import { requestFreshPosition, requestPosition, resolveCurrentPosition, LOCATION_FRESH_ENOUGH_MS, type PositionResult } from '../../../src/utils/freshLocation';

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

describe('requestPosition（理由つき）', () => {
  const errGeo = (code: number) => geo(((_ok: PositionCallback, err?: PositionErrorCallback | null) =>
    err?.({ code } as GeolocationPositionError)) as Geolocation['getCurrentPosition']);

  it('許可されていない（code 1）→ denied', async () => {
    expect(await requestPosition(errGeo(1))).toEqual({ ok: false, reason: 'denied' });
  });
  it('取れない（code 2）→ unavailable、時間切れ（code 3）→ timeout', async () => {
    expect(await requestPosition(errGeo(2))).toEqual({ ok: false, reason: 'unavailable' });
    expect(await requestPosition(errGeo(3))).toEqual({ ok: false, reason: 'timeout' });
  });
  it('取れたら位置を返す', async () => {
    const g = geo(((ok: PositionCallback) => ok({ coords: { latitude: 35, longitude: 139 } } as GeolocationPosition)) as Geolocation['getCurrentPosition']);
    expect(await requestPosition(g)).toEqual({ ok: true, position: [35, 139] });
  });
  it('位置情報に対応していない環境 → unsupported', async () => {
    expect(await requestPosition(null)).toEqual({ ok: false, reason: 'unsupported' });
  });
  it('押すたびに取り直す: 前に拒否されていても、そのたびに getCurrentPosition を呼ぶ（許可の確認を出せるブラウザでは、もう一度聞く）', async () => {
    const spy = vi.fn(((_ok: PositionCallback, err?: PositionErrorCallback | null) => err?.({ code: 1 } as GeolocationPositionError)) as Geolocation['getCurrentPosition']);
    await requestPosition(geo(spy));
    await requestPosition(geo(spy));
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

describe('resolveCurrentPosition', () => {
  const known: [number, number] = [35.0, 139.0];
  const fresh: [number, number] = [35.5, 139.5];
  const ok = (position: [number, number]): PositionResult => ({ ok: true, position });
  const ng = (reason: 'denied' | 'unavailable' | 'timeout'): PositionResult => ({ ok: false, reason });

  it('直前に更新された位置は、取り直さずそのまま使う', async () => {
    const fetchFresh = vi.fn(async () => ok(fresh));
    const r = await resolveCurrentPosition({ known, knownAt: 1000, now: 1000 + LOCATION_FRESH_ENOUGH_MS, fetchFresh });
    expect(r).toEqual({ position: known, refreshed: false });
    expect(fetchFresh).not.toHaveBeenCalled();
  });

  it('時間が空いて古くなっていたら、取り直した位置を使う', async () => {
    const fetchFresh = vi.fn(async () => ok(fresh));
    const r = await resolveCurrentPosition({ known, knownAt: 1000, now: 1000 + LOCATION_FRESH_ENOUGH_MS + 1, fetchFresh });
    expect(r).toEqual({ position: fresh, refreshed: true });
    expect(fetchFresh).toHaveBeenCalledTimes(1);
  });

  it('取り直せなかったときは古い位置で続け、取れなかった理由を返す', async () => {
    const r = await resolveCurrentPosition({ known, knownAt: 0, now: 10 * 60_000, fetchFresh: async () => ng('timeout') });
    expect(r).toEqual({ position: known, refreshed: false, failure: 'timeout' });
  });

  it('位置がまだ無く（許可していない）、取れなければ null と理由（denied）', async () => {
    const r = await resolveCurrentPosition({ known: null, knownAt: 0, now: 5000, fetchFresh: async () => ng('denied') });
    expect(r.position).toBeNull();
    expect(r.failure).toBe('denied');
  });

  it('位置がまだ無いときは、押すたびに取り直す（許可し直したあとの1回目で取れる）', async () => {
    const fetchFresh = vi.fn()
      .mockResolvedValueOnce(ng('denied'))
      .mockResolvedValueOnce(ok(fresh));
    const first = await resolveCurrentPosition({ known: null, knownAt: 0, now: 5000, fetchFresh });
    const second = await resolveCurrentPosition({ known: null, knownAt: 0, now: 6000, fetchFresh });
    expect(first.position).toBeNull();
    expect(second).toEqual({ position: fresh, refreshed: true });
    expect(fetchFresh).toHaveBeenCalledTimes(2);
  });
});
