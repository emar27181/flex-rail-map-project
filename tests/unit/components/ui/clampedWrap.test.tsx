/**
 * 折り返して並ぶ部品を、決まった行数までに収め、「さらに表示」で少しずつ広げる箱（ui/molecules/ClampedWrap）のテスト。
 * 表示路線の切替の各グループ（表示中・非表示など）は5行で始まり、1回押すごとに10行ずつ広がる。
 * 2026-11 まで、押すと数百路線が一度に出てスクロールがとても長くなっていた。
 */
// @vitest-environment jsdom
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import ClampedWrap, {
  CLAMPED_WRAP_COLLAPSED_RENDER_LIMIT, CLAMPED_WRAP_DEFAULT_ROWS, CLAMPED_WRAP_RENDER_PER_ROW, CLAMPED_WRAP_STEP_ROWS,
} from '../../../../src/components/ui/molecules/ClampedWrap';
import { CONTROL_SIZE } from '../../../../src/components/ui/atoms/controlSize';
import { L } from '../../../../src/components/legend/legendStyles';

const items = (n: number) => Array.from({ length: n }, (_, i) => <span key={i} data-item>{`路線${i}`}</span>);
const heightOf = (rows: number) => `${rows * CONTROL_SIZE.sm.minHeight + (rows - 1) * parseFloat(L.sp.sm)}px`;

/** 押した回数を中で持つ（RouteSwitchBoard と同じ使い方） */
function Harness({ count }: { count: number }) {
  const [steps, setSteps] = useState(0);
  return (
    <ClampedWrap theme="dark" steps={steps} onStepsChange={setSteps} moreLabel={n => `さらに（残り${n}）`} lessLabel="折りたたむ">
      {items(count)}
    </ClampedWrap>
  );
}

describe('ClampedWrap', () => {
  it('最初は5行の高さで切り、描く部品にも上限がある', () => {
    const { container } = render(
      <ClampedWrap theme="dark" steps={0} onStepsChange={() => {}} moreLabel={n => `残り${n}`} lessLabel="折りたたむ">{items(500)}</ClampedWrap>,
    );
    const box = container.querySelector('[data-clamped="true"]') as HTMLElement;
    expect(box.style.maxHeight).toBe(heightOf(CLAMPED_WRAP_DEFAULT_ROWS));
    expect(box.style.overflow).toBe('hidden');
    expect(container.querySelectorAll('[data-item]')).toHaveLength(CLAMPED_WRAP_COLLAPSED_RENDER_LIMIT);
  });

  it('1回で広げるのは10行。最初の5行と合わせて、スマホで約1画面の3分の1ずつ増える', () => {
    expect(CLAMPED_WRAP_DEFAULT_ROWS).toBe(5);
    expect(CLAMPED_WRAP_STEP_ROWS).toBe(10);
  });

  it('「さらに表示」を押すたびに10行ずつ広がり、全部は一度に出さない', () => {
    const { container, getByText } = render(<Harness count={500} />);
    const box = () => container.querySelector('[data-rows]') as HTMLElement;
    const drawn = () => container.querySelectorAll('[data-item]').length;

    fireEvent.click(getByText(/さらに/));
    expect(box().dataset.rows).toBe(String(CLAMPED_WRAP_DEFAULT_ROWS + CLAMPED_WRAP_STEP_ROWS));
    expect(box().style.maxHeight).toBe(heightOf(15));
    expect(drawn()).toBe(15 * CLAMPED_WRAP_RENDER_PER_ROW);
    expect(drawn()).toBeLessThan(500);

    fireEvent.click(getByText(/さらに/));
    expect(box().dataset.rows).toBe('25');
    expect(getByText(`さらに（残り${500 - 25 * CLAMPED_WRAP_RENDER_PER_ROW}）`)).toBeTruthy();
  });

  it('広げたあとは「折りたたむ」で最初の5行に戻る', () => {
    const { container, getByText, queryByText } = render(<Harness count={500} />);
    expect(queryByText('折りたたむ')).toBeNull();
    fireEvent.click(getByText(/さらに/));
    fireEvent.click(getByText(/さらに/));
    fireEvent.click(getByText('折りたたむ'));
    expect((container.querySelector('[data-rows]') as HTMLElement).dataset.rows).toBe(String(CLAMPED_WRAP_DEFAULT_ROWS));
    expect(queryByText('折りたたむ')).toBeNull();
  });

  it('全部出し切ったら「さらに表示」を消し、「折りたたむ」だけ残す', () => {
    const count = CLAMPED_WRAP_COLLAPSED_RENDER_LIMIT + 10;
    const { getByText, queryByText } = render(<Harness count={count} />);
    fireEvent.click(getByText(/さらに/));
    expect(queryByText(/さらに/)).toBeNull();
    expect(getByText('折りたたむ')).toBeTruthy();
  });

  it('全部が5行に収まるときはボタンを出さない', () => {
    const onStepsChange = vi.fn();
    const { queryByRole } = render(
      <ClampedWrap theme="dark" steps={0} onStepsChange={onStepsChange} moreLabel={n => `残り${n}`} lessLabel="折りたたむ">{items(3)}</ClampedWrap>,
    );
    expect(queryByRole('button')).toBeNull();
  });
});
