/**
 * 「現在地から」を押した時点の位置を取り直す。
 *
 * 位置の監視（watchPosition）は、画面を閉じていた・別アプリに切り替えていた間は更新が止まり、
 * 古い位置を持ったままになる。時間を空けて押したときに古い最寄り駅を出発駅にしないよう、
 * 押した時点でキャッシュを使わずに（maximumAge: 0）取り直す。
 * 取れなかったとき（権限・圏外・時間切れ）は null を返し、呼び出し側が直前の位置で代用する。
 */

/** 取り直しを待つ上限（ミリ秒）。これ以上待たせず、直前の位置で続ける */
export const FRESH_LOCATION_TIMEOUT_MS = 5000;
/** 最後に位置が更新されてからこの時間以内なら、いまの位置として使う（取り直さない） */
export const LOCATION_FRESH_ENOUGH_MS = 10_000;

type GeolocationLike = Pick<Geolocation, 'getCurrentPosition'>;

export function requestFreshPosition(
  geolocation: GeolocationLike | undefined | null = typeof navigator !== 'undefined' ? navigator.geolocation : undefined,
  timeoutMs: number = FRESH_LOCATION_TIMEOUT_MS,
): Promise<[number, number] | null> {
  if (!geolocation) return Promise.resolve(null);
  return new Promise(resolve => {
    let settled = false;
    const done = (v: [number, number] | null) => { if (!settled) { settled = true; resolve(v); } };
    // 端末によっては timeout オプションが効かないことがあるので、こちらでも打ち切る
    const timer = setTimeout(() => done(null), timeoutMs + 500);
    geolocation.getCurrentPosition(
      pos => { clearTimeout(timer); done([pos.coords.latitude, pos.coords.longitude]); },
      () => { clearTimeout(timer); done(null); },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 },
    );
  });
}

/**
 * 押した時点で使う位置を決める。
 * - 直前（LOCATION_FRESH_ENOUGH_MS 以内）に更新された位置があれば、待たずにそれを使う
 * - 古い（監視が止まっていた）か、まだ無いときは取り直す。取れなければ古い位置で代用（無ければ null）
 */
export async function resolveCurrentPosition(args: {
  known: [number, number] | null;
  /** known を最後に受け取った時刻（ミリ秒）。known が無ければ 0 */
  knownAt: number;
  now: number;
  fetchFresh: () => Promise<[number, number] | null>;
}): Promise<{ position: [number, number] | null; refreshed: boolean }> {
  const { known, knownAt, now, fetchFresh } = args;
  if (known && now - knownAt <= LOCATION_FRESH_ENOUGH_MS) return { position: known, refreshed: false };
  const fresh = await fetchFresh();
  if (fresh) return { position: fresh, refreshed: true };
  return { position: known, refreshed: false };
}
