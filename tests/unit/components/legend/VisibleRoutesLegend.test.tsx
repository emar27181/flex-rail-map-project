import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import VisibleRoutesLegend from '../../../../src/components/legend/VisibleRoutesLegend';

const items = Array.from({ length: 12 }, (_, i) => ({ key: `r${i}`, name: `路線${i}`, color: '#336699' }));

describe('表示中の路線の凡例', () => {
  it('10件までは路線名を並べ、残りは「…ほかN路線」にまとめる', () => {
    const { container } = render(<VisibleRoutesLegend items={items} theme="dark" language="japanese" maxItems={10} />);
    expect(container.textContent).toContain('路線9');
    expect(container.textContent).not.toContain('路線10');
    expect(container.textContent).toContain('…ほか2路線');
  });

  it('10件以下なら「ほか」は出さない', () => {
    const { container } = render(<VisibleRoutesLegend items={items.slice(0, 3)} theme="light" language="japanese" />);
    expect(container.textContent).not.toContain('ほか');
  });

  it('路線が無ければ何も描かない', () => {
    const { container } = render(<VisibleRoutesLegend items={[]} theme="light" language="japanese" />);
    expect(container.innerHTML).toBe('');
  });
});

describe('凡例の折りたたみ', () => {
  it('折りたたむと見出しと件数だけになり、路線名は出さない', () => {
    const { container } = render(<VisibleRoutesLegend items={items} theme="dark" language="japanese" collapsed onToggleCollapsed={() => {}} />);
    expect(container.textContent).toContain('表示中の路線（12）');
    expect(container.textContent).not.toContain('路線0');
  });

  it('見出しを押すと開閉の関数が呼ばれる', () => {
    const toggle = vi.fn();
    const { getByRole } = render(<VisibleRoutesLegend items={items} theme="dark" language="japanese" onToggleCollapsed={toggle} />);
    fireEvent.click(getByRole('button'));
    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
