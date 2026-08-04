/**
 * WCAG 2.1 のコントラスト比計算と、背景色に応じた読みやすい文字色の選択。
 *
 * 駅ラベルは路線色を背景に文字色を白固定で描画していたため、
 * 黄色(#FFCC00 南武線など)や橙色の路線でコントラスト比が
 * 1.5:1 程度となり判読が困難だった。背景の明るさに応じて
 * 白と濃色を切り替えることで、どの路線色でも AA を満たすようにする。
 */

/** #RGB / #RRGGBB を [r, g, b] に変換する。解釈できない場合は null */
export function parseHexColor(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;

  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];

  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** sRGB の相対輝度 (WCAG 2.1 定義) */
export function relativeLuminance([r, g, b]: [number, number, number]): number {
  const ch = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

/** 2色間のコントラスト比 (1〜21) */
export function contrastRatio(
  a: [number, number, number],
  b: [number, number, number]
): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * 明るい背景に載せる文字色。
 * #111111 では緑系(#2E8B57 など)や赤系(#E73820)の路線色で 4.45:1 と
 * わずかに AA を下回るため、純黒を用いて全路線色で 4.5:1 以上を確保する。
 */
export const DARK_TEXT = '#000000';
export const LIGHT_TEXT = '#FFFFFF';

/**
 * 背景色に対してコントラスト比が高くなる方の文字色を返す。
 * 色を解釈できない場合は白にフォールバックする（従来の挙動）。
 */
export function readableTextColor(background: string): string {
  const bg = parseHexColor(background);
  if (!bg) return LIGHT_TEXT;

  const white = parseHexColor(LIGHT_TEXT)!;
  const dark = parseHexColor(DARK_TEXT)!;

  return contrastRatio(bg, white) >= contrastRatio(bg, dark) ? LIGHT_TEXT : DARK_TEXT;
}
