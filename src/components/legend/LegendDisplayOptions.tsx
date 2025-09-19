import React from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation';

interface LegendDisplayOptionsProps {
  mapViewMode: 'realistic' | 'schematic';
  theme: 'light' | 'dark';
  language: 'japanese' | 'english';
  trainTypeViewEnabled?: boolean;
  onMapViewModeChange: (mode: 'realistic' | 'schematic') => void;
  onTrainTypeViewChange?: (enabled: boolean) => void;
}

const LegendDisplayOptions: React.FC<LegendDisplayOptionsProps> = ({
  mapViewMode,
  theme,
  language,
  trainTypeViewEnabled = false,
  onMapViewModeChange,
  onTrainTypeViewChange
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
      </div>

      {/* 列車種別表示モード */}
      {onTrainTypeViewChange && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.borderLight}` }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '11px',
            color: colors.text,
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={trainTypeViewEnabled}
              onChange={(e) => onTrainTypeViewChange(e.target.checked)}
              style={{
                marginRight: '6px',
                cursor: 'pointer'
              }}
            />
            🚆 列車種別表示モード
          </label>
        </div>
      )}
    </div>
  );
};

export default LegendDisplayOptions;