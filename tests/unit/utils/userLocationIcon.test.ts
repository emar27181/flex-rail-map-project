/**
 * 現在地マーカー（utils/userLocationIcon.ts）のテスト。
 * 向き（進行方向の扇形）は端末によって合わないため、2026-11 から出さない。
 */
import { describe, it, expect } from 'vitest';
import { SHOW_USER_HEADING, userLocationIconHtml } from '../../../src/utils/userLocationIcon';

describe('userLocationIconHtml', () => {
  it('向きは既定で出さない（向きが取れていても青い点だけ）', () => {
    expect(SHOW_USER_HEADING).toBe(false);
    const html = userLocationIconHtml({ heading: 90, dotShadow: 'none' });
    expect(html).not.toContain('data-heading-cone');
    expect(html).toContain('#4285F4');
  });

  it('戻したときは、向きが取れているときだけ扇形を重ねる', () => {
    expect(userLocationIconHtml({ heading: 90, dotShadow: 'none', showHeading: true })).toContain('rotate(90deg)');
    expect(userLocationIconHtml({ heading: null, dotShadow: 'none', showHeading: true })).not.toContain('data-heading-cone');
  });
});
