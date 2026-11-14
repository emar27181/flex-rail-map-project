import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Chip from '../../../src/components/ui/atoms/Chip';
import { serviceBrandLabel } from '../../../src/components/ServiceTermini';

describe('運行系統名は路線のチップの枠の中の2行目に入れる', () => {
  it('横須賀線には系統名「横須賀・総武快速線」。路線名がすでに系統名を含む路線・系統の無い路線は出さない', () => {
    expect(serviceBrandLabel('yokosukaLine', 'japanese')).toBe('横須賀・総武快速線');
    expect(serviceBrandLabel('yamanote', 'japanese')).toBeUndefined();
  });

  it('Chip の subLabel は同じボタンの中に入る（枠の外にぶら下げない）', () => {
    const { container, getByRole } = render(
      <Chip color="#1e88e5" label="横須賀線" subLabel="横須賀・総武快速線" selected={false} theme="light" size="sm" onClick={() => {}} />,
    );
    const button = getByRole('button');
    expect(button.textContent).toContain('横須賀線');
    expect(button.textContent).toContain('横須賀・総武快速線');
    expect(container.querySelectorAll('button')).toHaveLength(1);
    expect(button.getAttribute('title')).toContain('横須賀・総武快速線');
  });

  it('subLabel が無ければ従来どおり1行', () => {
    const { getByRole } = render(<Chip color="#1e88e5" label="山手線" selected theme="light" onClick={() => {}} />);
    expect(getByRole('button').textContent).toBe('山手線');
  });
});
