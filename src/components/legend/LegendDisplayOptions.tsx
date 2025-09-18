import React from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation';

interface LegendDisplayOptionsProps {
  mapViewMode: 'realistic' | 'schematic';
  showTransferStationsOnly: boolean;
  theme: 'light' | 'dark';
  language: 'japanese' | 'english';
  onMapViewModeChange: (mode: 'realistic' | 'schematic') => void;
  onShowTransferStationsOnlyChange: (value: boolean) => void;
}

const LegendDisplayOptions: React.FC<LegendDisplayOptionsProps> = ({
  mapViewMode,
  showTransferStationsOnly,
  theme,
  language,
  onMapViewModeChange,
  onShowTransferStationsOnlyChange
}) => {
  const colors = getThemeColors(theme);

  return (
    <div style={{
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: colors.surface,
      borderRadius: '4px',
      border: `1px solid ${colors.borderLight}`
    }}>
      <div style={{ marginBottom: '10px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: colors.text
        }}>
          {translateUI('mapDisplayMode', language)}:
        </label>
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '11px',
            color: colors.text,
            cursor: 'pointer',
            marginBottom: '4px'
          }}>
            <input
              type="radio"
              name="mapViewMode"
              checked={mapViewMode === 'realistic'}
              onChange={() => onMapViewModeChange('realistic')}
              style={{
                marginRight: '6px',
                cursor: 'pointer'
              }}
            />
            {translateUI('realisticView', language)}
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '11px',
            color: colors.text,
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              name="mapViewMode"
              checked={mapViewMode === 'schematic'}
              onChange={() => onMapViewModeChange('schematic')}
              style={{
                marginRight: '6px',
                cursor: 'pointer'
              }}
            />
            {translateUI('schematicView', language)}
          </label>
        </div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px',
          color: colors.text,
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={showTransferStationsOnly}
            onChange={(e) => onShowTransferStationsOnlyChange(e.target.checked)}
            style={{
              marginRight: '6px',
              cursor: 'pointer'
            }}
          />
          {translateUI('showOnlyTransferStations', language)}
        </label>
      </div>
    </div>
  );
};

export default LegendDisplayOptions;