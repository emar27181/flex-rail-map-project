/**
 * 駅ラベルの文字色選択のテスト
 *
 * 過去に起きた問題:
 * - 駅ラベルは路線色を背景に color:white 固定で描画していたため、
 *   南武線(#FFCC00)では白文字とのコントラスト比が1.51:1しかなく判読困難だった
 */

import { describe, it, expect } from 'vitest';
import {
  contrastRatio,
  parseHexColor,
  readableTextColor,
  DARK_TEXT,
  LIGHT_TEXT,
  darkenForWhiteText,
  MIN_DARKEN_SCALE,
} from '../../../src/utils/contrast';
import { routeColors } from '../../../src/data/routes';

const ratioWith = (bg: string, fg: string) =>
  contrastRatio(parseHexColor(bg)!, parseHexColor(fg)!);

describe('parseHexColor', () => {
  it('#RRGGBB と #RGB を解釈する', () => {
    expect(parseHexColor('#FFCC00')).toEqual([255, 204, 0]);
    expect(parseHexColor('#fc0')).toEqual([255, 204, 0]);
  });

  it('解釈できない値は null を返す', () => {
    expect(parseHexColor('rgb(1,2,3)')).toBeNull();
    expect(parseHexColor('')).toBeNull();
  });
});

describe('readableTextColor', () => {
  it('明るい路線色(南武線の黄色)では濃色を選ぶ', () => {
    expect(readableTextColor('#FFCC00')).toBe(DARK_TEXT);
  });

  it('暗い路線色では白を選ぶ', () => {
    expect(readableTextColor('#1565C0')).toBe(LIGHT_TEXT);
  });

  it('解釈できない色は白にフォールバックする', () => {
    expect(readableTextColor('not-a-color')).toBe(LIGHT_TEXT);
  });
});

describe('全路線色での駅ラベル可読性', () => {
  it('どの路線色でも選択された文字色が白固定より劣化しない', () => {
    for (const [key, color] of Object.entries(routeColors)) {
      if (!parseHexColor(color)) continue;
      const chosen = readableTextColor(color);
      expect(
        ratioWith(color, chosen),
        `${key} (${color})`
      ).toBeGreaterThanOrEqual(ratioWith(color, LIGHT_TEXT));
    }
  });

  it('白固定では基準を大きく下回る路線色が、選択後は改善する', () => {
    // 南武線の黄色は白文字だと 1.51:1
    expect(ratioWith('#FFCC00', LIGHT_TEXT)).toBeLessThan(2);
    expect(ratioWith('#FFCC00', readableTextColor('#FFCC00'))).toBeGreaterThan(4.5);
  });

  it('全ての路線色で WCAG AA (4.5:1) を満たす', () => {
    const failures: string[] = [];
    for (const [key, color] of Object.entries(routeColors)) {
      if (!parseHexColor(color)) continue;
      const ratio = ratioWith(color, readableTextColor(color));
      if (ratio < 4.5) failures.push(`${key} (${color}) = ${ratio.toFixed(2)}`);
    }
    expect(failures).toEqual([]);
  });
});

describe('darkenForWhiteText（ダークモードの駅名白字統一）', () => {
  const WHITE: [number, number, number] = [255, 255, 255];

  it('すでに白字で読める色はそのまま返す', () => {
    // 濃い青。白字とのコントラストは十分ある
    expect(darkenForWhiteText('#0067C0')).toBe('#0067C0');
  });

  /**
   * 関数の契約: 「白字で4.5:1を満たす」か「色の同一性を守るため下限で止めた」かの
   * どちらかであること。下限で止めた場合の可読性は駅ラベル側の文字ハローが担保する。
   */
  it('全ての路線色で「4.5:1を満たす」か「下限で止まっている」のどちらかになる', () => {
    const violations: string[] = [];

    for (const [key, color] of Object.entries(routeColors)) {
      const before = parseHexColor(color);
      if (!before) continue;

      const adjusted = darkenForWhiteText(color);
      const after = parseHexColor(adjusted)!;
      const ratio = contrastRatio(after, WHITE);
      if (ratio >= 4.5) continue;

      // 目標未達なら、下限係数まで暗くし切っているはず
      const brightest = Math.max(before[0], before[1], before[2]);
      const scale = brightest === 0 ? 1 : Math.max(after[0], after[1], after[2]) / brightest;
      if (Math.abs(scale - MIN_DARKEN_SCALE) > 0.02) {
        violations.push(`${key} (${color} -> ${adjusted}) 比${ratio.toFixed(2)} 係数${scale.toFixed(2)}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('下限まで暗くしても届かない色は、色の同一性を優先して下限で止める', () => {
    // 総武線の黄色などは 4.5:1 に必要なだけ暗くすると黄土色になってしまう
    const color = '#FFCC00';
    const before = parseHexColor(color)!;
    const after = parseHexColor(darkenForWhiteText(color))!;

    expect(after[0] / before[0]).toBeCloseTo(MIN_DARKEN_SCALE, 1);
    expect(contrastRatio(after, WHITE)).toBeLessThan(4.5);
  });

  it('下限を緩めれば4.5:1に到達できる（上限で止めているだけと確認）', () => {
    const adjusted = darkenForWhiteText('#FFCC00', 4.5, 0);
    expect(contrastRatio(parseHexColor(adjusted)!, WHITE)).toBeGreaterThanOrEqual(4.5);
  });

  it('色相を保つ（RGBの大小関係が変わらない）ので同じ路線色に見える', () => {
    for (const color of ['#FFCC00', '#44ddaa', '#ff77bb']) {
      const before = parseHexColor(color)!;
      const after = parseHexColor(darkenForWhiteText(color))!;

      // 各チャンネルの順位関係が維持されていれば色味は同系統に保たれる
      const rank = (c: [number, number, number]) =>
        [0, 1, 2].sort((a, b) => c[b] - c[a]).join('');
      expect(rank(after), color).toBe(rank(before));
    }
  });

  it('必要以上に暗くしない（目標比を大きく超えない）', () => {
    for (const color of ['#FFCC00', '#44ddaa', '#cccccc']) {
      const ratio = contrastRatio(parseHexColor(darkenForWhiteText(color))!, WHITE);
      // ちょうど4.5:1付近に収まること = 元の色から最小限の変化
      expect(ratio, color).toBeLessThan(5.0);
    }
  });

  it('解釈できない色はそのまま返す', () => {
    expect(darkenForWhiteText('rgb(1,2,3)')).toBe('rgb(1,2,3)');
  });
});
