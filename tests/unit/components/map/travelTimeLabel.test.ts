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
    expect(single.width).toBe(15);
    expect(double.width).toBe(single.width);
    expect(triple.width).toBe(single.width);
    expect(TRAVEL_TIME_LABEL.fontWeight).toBe(700);
    expect(double.height).toBe(double.width);
    expect(triple.height).toBe(triple.width);
  });

  it('従来の内容径と枠線を維持し、アンカーは外枠の中心に置く', () => {
    for (const time of [0, 3, 43, 99, 143, 1000]) {
      const label = travelTimeLabelLayout(time);
      const token = TRAVEL_TIME_LABEL;
      expect(label.width).toBe(token.contentDiameterPx + 2 * token.borderWidthPx);
      expect(token.lineHeight).toBe(1);
      expect(token.paddingXPx).toBe(0);
      expect(token.paddingYPx).toBe(0);
      expect(label.anchor).toEqual([label.width / 2, label.height / 2]);
    }
  });

  it('従来の分単位の四捨五入を維持する', () => {
    expect(travelTimeLabelLayout(42.6).text).toBe('43');
  });
});
