/**
 * 折り返して並ぶ部品を、閉じているときは決まった行数までに収める箱（ui/molecules/ClampedWrap）のテスト。
 * 表示路線の切替の各グループ（表示中・非表示など）は、閉じた状態で5行まで、開くと全部見せる。
 */
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import ClampedWrap, { CLAMPED_WRAP_COLLAPSED_RENDER_LIMIT, CLAMPED_WRAP_DEFAULT_ROWS } from '../../../../src/components/ui/molecules/ClampedWrap';
import { CONTROL_SIZE } from '../../../../src/components/ui/atoms/controlSize';
import { L } from '../../../../src/components/legend/legendStyles';

const items = (n: number) => Array.from({ length: n }, (_, i) => <span key={i} data-item>{`路線${i}`}</span>);
const noop = () => {};

describe('ClampedWrap', () => {
  it('閉じているときは決まった行数の高さで切り、描く部品にも上限がある', () => {
    const { container } = render(
      <ClampedWrap theme="dark" expanded={false} onToggle={noop} moreLabel={n => `他${n}`} lessLabel="閉じる">{items(200)}</ClampedWrap>,
    );
    const box = container.querySelector('[data-clamped="true"]') as HTMLElement;
    const rows = CLAMPED_WRAP_DEFAULT_ROWS;
    expect(box.style.maxHeight).toBe(`${rows * CONTROL_SIZE.sm.minHeight + (rows - 1) * parseFloat(L.sp.sm)}px`);
    expect(box.style.overflow).toBe('hidden');
    expect(container.querySelectorAll('[data-item]')).toHaveLength(CLAMPED_WRAP_COLLAPSED_RENDER_LIMIT);
  });

  it('隠れている部品があれば「すべて表示」を出し、押すと開く', () => {
    const toggle = vi.fn();
    const { getByRole } = render(
      <ClampedWrap theme="light" expanded={false} onToggle={toggle} moreLabel={n => `他${n}件`} lessLabel="閉じる">{items(200)}</ClampedWrap>,
    );
    const button = getByRole('button', { expanded: false });
    expect(button.textContent).toContain(`他${200 - CLAMPED_WRAP_COLLAPSED_RENDER_LIMIT}件`);
    fireEvent.click(button);
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('開いているときは全部を、高さを切らずに描く', () => {
    const { container } = render(
      <ClampedWrap theme="dark" expanded onToggle={noop} moreLabel={n => `他${n}`} lessLabel="閉じる">{items(200)}</ClampedWrap>,
    );
    const box = container.querySelector('[data-clamped="false"]') as HTMLElement;
    expect(box.style.maxHeight).toBe('');
    expect(container.querySelectorAll('[data-item]')).toHaveLength(200);
  });

  it('全部が行数に収まるときはボタンを出さない', () => {
    const { queryByRole } = render(
      <ClampedWrap theme="dark" expanded={false} onToggle={noop} moreLabel={n => `他${n}`} lessLabel="閉じる">{items(3)}</ClampedWrap>,
    );
    expect(queryByRole('button')).toBeNull();
  });
});
