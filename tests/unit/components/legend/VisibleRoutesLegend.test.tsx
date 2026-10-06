import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import VisibleRoutesLegend from '../../../../src/components/legend/VisibleRoutesLegend';

const items = Array.from({ length: 12 }, (_, i) => ({ key: `r${i}`, name: `路線${i}`, color: '#336699', visible: true }));
const noop = () => {};

describe('表示中の路線の凡例', () => {
  it('路線を「表示路線の切替」と同じチップで全部並べる（多いときは一覧の中でスクロール）', () => {
    const { container } = render(<VisibleRoutesLegend items={items} theme="dark" language="japanese" onToggleRoute={noop} />);
    const chips = container.querySelectorAll('[data-legend-route]');
    expect(chips).toHaveLength(12);
    expect(container.textContent).toContain('路線11');
  });

  it('路線が無ければ何も描かない', () => {
    const { container } = render(<VisibleRoutesLegend items={[]} theme="light" language="japanese" onToggleRoute={noop} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('凡例からの表示切り替え', () => {
  it('チップを押すとその路線の切り替えが呼ばれる', () => {
    const toggle = vi.fn();
    const { container } = render(<VisibleRoutesLegend items={items} theme="dark" language="japanese" onToggleRoute={toggle} />);
    fireEvent.click(container.querySelector('[data-legend-route="r3"]')!);
    expect(toggle).toHaveBeenCalledWith('r3');
  });

  it('非表示にした路線は凡例に残り、非表示の見た目（押されていない状態）になる', () => {
    const withHidden = items.map(i => (i.key === 'r1' ? { ...i, visible: false } : i));
    const { container } = render(<VisibleRoutesLegend items={withHidden} theme="dark" language="japanese" onToggleRoute={noop} />);
    expect(container.querySelector('[data-legend-route="r1"]')!.getAttribute('aria-pressed')).toBe('false');
    expect(container.querySelector('[data-legend-route="r2"]')!.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('凡例の折りたたみ', () => {
  it('折りたたむと見出しと表示中の件数だけになり、路線は出さない', () => {
    const withHidden = items.map(i => (i.key === 'r0' ? { ...i, visible: false } : i));
    const { container } = render(<VisibleRoutesLegend items={withHidden} theme="dark" language="japanese" onToggleRoute={noop} collapsed onToggleCollapsed={noop} />);
    expect(container.textContent).toContain('表示中の路線（11）');
    expect(container.querySelectorAll('[data-legend-route]')).toHaveLength(0);
  });

  it('見出しを押すと開閉の関数が呼ばれる', () => {
    const toggle = vi.fn();
    const { getByRole } = render(<VisibleRoutesLegend items={items} theme="dark" language="japanese" onToggleRoute={noop} collapsed onToggleCollapsed={toggle} />);
    fireEvent.click(getByRole('button', { expanded: false }));
    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
