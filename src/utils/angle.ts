/**
 * 角度（度）の計算。
 */

/**
 * 前の角度 `prev` から、`next` と同じ向きになる角度のうち最も近いものを返す。
 *
 * 地図の回転角は 0〜360° に丸められて届くため、北をまたぐと 359°→1° のように飛ぶ。
 * そのまま CSS の rotate に渡すと逆向きにほぼ1周して見えるので、
 * 前の値から最短の向き（-180°〜+180°）に進めた連続した角度にする。
 */
export function continuousAngle(prev: number, next: number): number {
  const delta = ((((next - prev) % 360) + 540) % 360) - 180;
  return prev + delta;
}
