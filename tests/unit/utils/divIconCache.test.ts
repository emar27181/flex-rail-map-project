import { describe, it, expect, beforeEach } from 'vitest';
import { cachedDivIcon, clearDivIconCache, divIconCacheSize, DIV_ICON_CACHE_LIMIT } from '../../../src/utils/divIconCache';

class FakeIcon { constructor(public options: unknown) {} }
class OtherIcon { constructor(public options: unknown) {} }

describe('cachedDivIcon', () => {
  beforeEach(() => clearDivIconCache());

  it('見た目が同じなら同じ DivIcon を返す（変わらないマーカーの DOM を作り直させない）', () => {
    const o = { html: '<b>新宿</b>', className: 'a', iconSize: [10, 20] as [number, number], iconAnchor: [5, 10] as [number, number] };
    expect(cachedDivIcon(FakeIcon, o)).toBe(cachedDivIcon(FakeIcon, { ...o }));
    expect(divIconCacheSize()).toBe(1);
  });

  it('html・クラス・大きさ・基準点のどれかが違えば別のアイコン（表示は変わる）', () => {
    const base = { html: 'x', className: 'a', iconSize: [1, 2] as [number, number], iconAnchor: [0, 0] as [number, number] };
    const a = cachedDivIcon(FakeIcon, base);
    expect(cachedDivIcon(FakeIcon, { ...base, html: 'y' })).not.toBe(a);
    expect(cachedDivIcon(FakeIcon, { ...base, className: 'b' })).not.toBe(a);
    expect(cachedDivIcon(FakeIcon, { ...base, iconSize: [1, 3] })).not.toBe(a);
    expect(cachedDivIcon(FakeIcon, { ...base, iconAnchor: [1, 0] })).not.toBe(a);
  });

  it('作り手（DivIcon のクラス）が違えば混ぜない', () => {
    const o = { html: 'x' };
    expect(cachedDivIcon(FakeIcon, o)).toBeInstanceOf(FakeIcon);
    expect(cachedDivIcon(OtherIcon, o)).toBeInstanceOf(OtherIcon);
  });

  it('上限を超えたら全部捨てて、メモリを使い続けない', () => {
    for (let i = 0; i < DIV_ICON_CACHE_LIMIT; i++) cachedDivIcon(FakeIcon, { html: String(i) });
    expect(divIconCacheSize()).toBe(DIV_ICON_CACHE_LIMIT);
    cachedDivIcon(FakeIcon, { html: 'overflow' });
    expect(divIconCacheSize()).toBe(1);
  });
});
