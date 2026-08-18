/**
 * 選択状態でレイアウトがずれないことを保証するテスト。
 *
 * 「選択時だけ枠線を太くする」書き方が3箇所にあり、box-sizing が
 * content-box のままだと選択した瞬間に行の幅と高さが変わって
 * 一覧の並びがずれていた。同じことを再び書けないように固定する。
 */
import { describe, it, expect } from 'vitest';
import { selectableCard, SELECTION_BORDER_WIDTH } from '../../../../src/components/legend/legendStyles';
import { tintColor } from '../../../../src/utils/contrast';

const colors = {
  text: '#fff', textSecondary: '#bbb', border: '#444', borderLight: '#333',
  surface: '#2d2d2d', surfaceElevated: '#3a3a3a', primary: '#2196F3',
};

describe('selectableCard', () => {
  it('選択しても枠線の太さが変わらない', () => {
    const off = selectableCard(colors, { selected: false });
    const on = selectableCard(colors, { selected: true });
    const width = (s: string) => s.split(' ')[0];
    expect(width(String(off.border))).toBe(`${SELECTION_BORDER_WIDTH}px`);
    expect(width(String(on.border))).toBe(`${SELECTION_BORDER_WIDTH}px`);
  });

  it('枠線が寸法に含まれる（box-sizing: border-box）', () => {
    // content-box だと枠線ぶん外形が大きくなり隣の行とずれる
    expect(selectableCard(colors, { selected: false }).boxSizing).toBe('border-box');
    expect(selectableCard(colors, { selected: true }).boxSizing).toBe('border-box');
  });

  it('非選択時は枠線を透明にして場所だけ確保する', () => {
    expect(String(selectableCard(colors, { selected: false }).border)).toContain('transparent');
  });

  it('選択は枠線だけでなく背景も変える', () => {
    const off = selectableCard(colors, { selected: false });
    const on = selectableCard(colors, { selected: true });
    expect(on.backgroundColor).not.toBe(off.backgroundColor);
    expect(String(on.backgroundColor)).toMatch(/^rgba\(/);
  });

  it('accent を渡すとその色が枠線と背景に使われる', () => {
    const s = selectableCard(colors, { selected: true, accent: '#FF0000' });
    expect(String(s.border)).toContain('#FF0000');
    expect(s.backgroundColor).toBe(tintColor('#FF0000', 0.18));
  });

  it('角丸は呼び出し側で指定でき、既定値もある', () => {
    expect(selectableCard(colors, { selected: false }).borderRadius).toBeTruthy();
    expect(selectableCard(colors, { selected: false, radius: '6px' }).borderRadius).toBe('6px');
  });
});

describe('tintColor', () => {
  it('16進色を rgba に変換する', () => {
    expect(tintColor('#2196F3', 0.18)).toBe('rgba(33, 150, 243, 0.18)');
  });

  it('3桁の短縮形も解釈する', () => {
    expect(tintColor('#f00', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('解釈できない色は transparent を返す（描画を壊さない）', () => {
    expect(tintColor('not-a-color', 0.2)).toBe('transparent');
  });
});
