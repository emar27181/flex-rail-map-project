import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MapFooter from '../../../../src/components/map/MapFooter';

describe('地図下部の出典と注記', () => {
  it('試作時刻と線種の説明を注記に出し、OSMの出典を残す', () => {
    render(<MapFooter map={null} notices={['mapLastTrainDemo']} lastTrainLegend attribution
      theme="dark" language="japanese" bottom="0" onHeightChange={() => {}} />);
    expect(screen.getByRole('status')).toHaveTextContent('架空ダイヤ');
    expect(screen.getByRole('status')).toHaveTextContent('実線');
    expect(screen.getByRole('link', { name: '© OpenStreetMap contributors' }))
      .toHaveAttribute('href', 'https://www.openstreetmap.org/copyright');
    expect(screen.queryByText('Leaflet')).toBeNull();
  });
});
