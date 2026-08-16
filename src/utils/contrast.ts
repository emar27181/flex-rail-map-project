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

/**
 * 白文字用に背景を暗くするときの、RGB スケール係数の下限。
 *
 * 0.62 は「明るいブランド色でも色として同一と判断できる範囲」で決めた値。
 * これより小さくすると総武線の黄色などが別の色（黄土色）に見えてしまう。
 */
export const MIN_DARKEN_SCALE = 0.62;

/** [r,g,b] を #RRGGBB に戻す */
function toHex([r, g, b]: [number, number, number]): string {
  const h = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

/**
 * 白文字を載せたときに目標コントラスト比を満たすまで、背景色を必要最小限だけ暗くする。
 *
 * ダークモードでは路線色を明るく補正しているため、白文字とのコントラストが
 * 落ちて readableTextColor が黒文字を返し、路線ごとに白文字と黒文字が
 * 混在して見た目が不統一になっていた。
 *
 * 文字色は白に統一したまま可読性を確保するため、RGB を一律の係数で
 * スケールして輝度だけを落とす。色相と彩度の比率は保たれるので、
 * 人間には「同じ路線色のまま少し濃くなった」程度にしか見えない。
 *
 * ただし総武線の黄色(#FED100)のような明るいブランド色は、白字で 4.5:1 を
 * 満たすところまで暗くすると元の路線色とは別の色に見えてしまう。
 * そのため暗くする量に下限 (minScale) を設けて色の同一性を優先し、
 * それでも比が足りない分は駅ラベル側の文字ハロー（縁取り）で補う。
 *
 * @param background 元の背景色 (#RGB / #RRGGBB)
 * @param targetRatio 目標コントラスト比。既定は WCAG AA の 4.5:1
 * @param minScale RGBを縮小する係数の下限。小さいほど暗くできるが色が変わる
 */
export function darkenForWhiteText(background: string, targetRatio = 4.5, minScale = MIN_DARKEN_SCALE): string {
  const bg = parseHexColor(background);
  if (!bg) return background;

  const white: [number, number, number] = [255, 255, 255];
  if (contrastRatio(bg, white) >= targetRatio) return background;

  // 係数 k で RGB をスケールし、条件を満たす最大の k（＝元色に最も近い色）を二分探索する。
  // 判定は必ず「丸めたあとの実際の出力色」で行う。連続値で判定すると、
  // toHex の丸め上げによって最終的な色が目標比をわずかに下回ることがある。
  const scaledHex = (k: number) => toHex([bg[0] * k, bg[1] * k, bg[2] * k]);
  const meets = (k: number) => contrastRatio(parseHexColor(scaledHex(k))!, white) >= targetRatio;

  // 下限まで暗くしても届かない色は、色の同一性を優先して下限で止める
  if (!meets(minScale)) return scaledHex(minScale);

  let lo = minScale;
  let hi = 1;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (meets(mid)) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return scaledHex(lo);
}

/**
 * 路線色などを「塗りつぶしのラベル」として使うときの配色。
 *
 * 駅名ラベル・駅アイコン・ツールチップ内のバッジがそれぞれ別々に
 * 「ダークなら白字、ライトなら明るさで白黒を選ぶ」を書いていて、
 * 直すたびに片方だけ変わってしまっていた。規則をここ1箇所にまとめる。
 *
 * - ダークモード: 文字は白に統一し、足りない分は背景を必要最小限だけ暗くする
 * - ライトモード: 背景はそのままで、明るさに応じて白/黒の読みやすい方を選ぶ
 * - それでも 4.5:1 に届かない明るい色（総武線の黄色など）は needsHalo が true。
 *   呼び出し側で文字の縁取りを足して可読性を補う
 */
export function filledLabelColors(baseColor: string, theme: 'light' | 'dark'): {
  background: string;
  text: string;
  needsHalo: boolean;
} {
  const background = theme === 'dark' ? darkenForWhiteText(baseColor) : baseColor;
  const text = theme === 'dark' ? LIGHT_TEXT : readableTextColor(background);
  return { background, text, needsHalo: !meetsContrast(background, text) };
}

/** 2色が目標コントラスト比（既定 WCAG AA の 4.5:1）を満たすか */
export function meetsContrast(background: string, text: string, targetRatio = 4.5): boolean {
  const bg = parseHexColor(background);
  const fg = parseHexColor(text);
  if (!bg || !fg) return false;
  return contrastRatio(bg, fg) >= targetRatio;
}
