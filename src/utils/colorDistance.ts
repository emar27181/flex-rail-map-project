/**
 * 2色の見た目の差（CIE76 ΔE, sRGB→CIELAB, D65）。
 * 地図上で並走する路線の色が見分けられるかの判定に使う。
 * 目安: 10未満はほぼ同色、20以上なら細い線でも見分けやすい。
 */
function hexToLab(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const lin = (c: number) => (c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92);
  const [r, g, b] = [0, 2, 4].map(i => lin(parseInt(h.slice(i, i + 2), 16) / 255));
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

export function colorDistance(a: string, b: string): number {
  const [l1, a1, b1] = hexToLab(a);
  const [l2, a2, b2] = hexToLab(b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}
