import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import TopList, { TOP_LIST_DEFAULT_COUNT } from '../../../../src/components/ui/molecules/TopList';

const items = (n: number) => Array.from({ length: n }, (_, i) => <div key={i} data-item>{`項目${i + 1}`}</div>);

describe('TopList（上位だけ見せて残りは折りたたむ一覧）', () => {
  it('既定は上位3つだけ見せ、残りの件数つきの「さらに表示」を出す', () => {
    expect(TOP_LIST_DEFAULT_COUNT).toBe(3);
    const { container, getByRole } = render(
      <TopList theme="light" moreLabel={n => `さらに${n}`} lessLabel="折りたたむ">{items(5)}</TopList>,
    );
    expect(container.querySelectorAll('[data-item]')).toHaveLength(3);
    expect(getByRole('button').textContent).toContain('さらに2');
    expect(container.querySelector('[data-top-list]')?.getAttribute('data-top-list')).toBe('collapsed');
  });

  it('「さらに表示」で全部開き、「折りたたむ」で上位3つに戻る', () => {
    const { container, getByRole } = render(
      <TopList theme="light" moreLabel={n => `さらに${n}`} lessLabel="折りたたむ">{items(5)}</TopList>,
    );
    fireEvent.click(getByRole('button'));
    expect(container.querySelectorAll('[data-item]')).toHaveLength(5);
    expect(getByRole('button').textContent).toContain('折りたたむ');
    expect(getByRole('button').getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(getByRole('button'));
    expect(container.querySelectorAll('[data-item]')).toHaveLength(3);
  });

  it('3つ以下ならボタンを出さない', () => {
    const { container, queryByRole } = render(
      <TopList theme="light" moreLabel={n => `さらに${n}`} lessLabel="折りたたむ">{items(3)}</TopList>,
    );
    expect(container.querySelectorAll('[data-item]')).toHaveLength(3);
    expect(queryByRole('button')).toBeNull();
  });
});
