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
