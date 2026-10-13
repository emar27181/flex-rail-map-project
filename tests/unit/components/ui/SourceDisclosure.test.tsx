import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SourceDisclosure from '../../../../src/components/ui/molecules/SourceDisclosure';

vi.mock('../../../../src/contexts/ThemeContext', () => ({
  getThemeColors: () => ({
    surface: '#fff', border: '#ddd', text: '#222', textSecondary: '#555',
  }),
}));

describe('SourceDisclosure', () => {
  it('attribution is compact by default and expands accessibly', () => {
    const { container } = render(
      <SourceDisclosure theme="light" label="データ出典">
        <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>
      </SourceDisclosure>
    );
    const details = container.querySelector('details');
    expect(details?.open).toBe(false);
    const summary = screen.getByText('データ出典');
    expect(summary.closest('summary')).toHaveAttribute('aria-label', 'データ出典');
    fireEvent.click(summary);
    expect(details?.open).toBe(true);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.openstreetmap.org/copyright');
  });
});
