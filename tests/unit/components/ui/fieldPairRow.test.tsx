import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import FieldPairRow, { PAIR_DIVIDER_WIDTH } from '../../../../src/components/ui/molecules/FieldPairRow';
import { CONTROL_SIZE } from '../../../../src/components/ui/atoms/controlSize';

describe('FieldPairRow（同じ幅の欄を2つ並べる行）', () => {
  it('左右は同じ幅（flex: 1 1 0%）、間の区切りは入れ替えボタンと同じ幅（CONTROL_SIZE.sm）', () => {
    const { container } = render(<FieldPairRow left={<i data-l />} right={<i data-r />} middle={<i data-m />} />);
    const row = container.firstElementChild as HTMLElement;
    const [left, middle, right] = Array.from(row.children) as HTMLElement[];
    expect(left.style.flex).toBe('1 1 0%');
    expect(right.style.flex).toBe('1 1 0%');
    expect(middle.style.width).toBe(`${PAIR_DIVIDER_WIDTH}px`);
    expect(PAIR_DIVIDER_WIDTH).toBe(CONTROL_SIZE.sm.minHeight);
    expect(left.querySelector('[data-l]')).toBeTruthy();
    expect(right.querySelector('[data-r]')).toBeTruthy();
  });

  it('欄が1つだけでも、空きが同じ幅を取る（ほかの行と同じ半分の幅になる）', () => {
    const { container } = render(<FieldPairRow left={<i />} />);
    const row = container.firstElementChild as HTMLElement;
    expect(row.children).toHaveLength(3);
    expect((row.children[2] as HTMLElement).style.flex).toBe('1 1 0%');
  });
});
