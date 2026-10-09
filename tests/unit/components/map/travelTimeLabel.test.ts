import { describe, expect, it } from 'vitest';
import { FS } from '../../../../src/constants/ui';
import { travelTimeLabelLayout, TRAVEL_TIME_LABEL } from '../../../../src/components/map/travelTimeLabel';

describe('地図の所要時間ラベル', () => {
  it('元の太字の12px文字を維持し、全桁数で円形にする', () => {
    const single = travelTimeLabelLayout(3);
    const double = travelTimeLabelLayout(43);
    const triple = travelTimeLabelLayout(143);
    expect(TRAVEL_TIME_LABEL.fontSizePx).toBe(parseFloat(FS.caption));
    expect(single.width).toBe(single.height);
    expect(double.width).toBeGreaterThan(single.width);
    expect(triple.width).toBeGreaterThan(double.width);
    expect(TRAVEL_TIME_LABEL.fontWeight).toBe(700);
    expect(double.height).toBe(double.width);
    expect(triple.height).toBe(triple.width);
  });

  it('全桁の文字幅・左右余白・境界線を含め、アンカーは枠の中心に置く', () => {
    for (const time of [0, 3, 43, 99, 143, 1000]) {
      const label = travelTimeLabelLayout(time);
      const token = TRAVEL_TIME_LABEL;
      expect(label.width).toBeGreaterThanOrEqual(
        label.text.length * token.fontSizePx * token.digitWidthEm
        + 2 * (token.paddingXPx + token.borderWidthPx),
      );
      expect(label.height).toBeGreaterThanOrEqual(
        token.fontSizePx * token.lineHeight + 2 * (token.paddingYPx + token.borderWidthPx),
      );
      expect(label.anchor).toEqual([label.width / 2, label.height / 2]);
    }
  });

  it('従来の分単位の四捨五入を維持する', () => {
    expect(travelTimeLabelLayout(42.6).text).toBe('43');
  });
});
