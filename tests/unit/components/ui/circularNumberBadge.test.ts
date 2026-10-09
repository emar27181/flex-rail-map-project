import { describe, expect, it } from 'vitest';
import { circularNumberBadgeHtml, circularNumberBadgeLayout } from '../../../../src/components/ui/atoms/circularNumberBadge';

describe('円形数値バッジのアトム', () => {
  it('HTMLの円と配置用の寸法が一致し、元の継承フォント/太字を使う', () => {
    for (const value of [3, 43, 143]) {
      const layout = circularNumberBadgeLayout(value);
      const host = document.createElement('div');
      host.innerHTML = circularNumberBadgeHtml(layout, { background: 'blue', text: 'white', border: 'blue' }, 'light');
      const badge = host.firstElementChild as HTMLElement;
      expect(badge.style.width).toBe(`${layout.width}px`);
      expect(badge.style.height).toBe(`${layout.width}px`);
      expect(badge.style.boxSizing).toBe('border-box');
      expect(badge.style.fontWeight).toBe('700');
      expect(badge.style.fontFamily).toBe('inherit');
      expect(badge.style.fontVariantNumeric).toBe('');
      expect(badge.textContent?.trim()).toBe(layout.text);
    }
  });
});
