import React from 'react';
import { TrainFront } from 'lucide-react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation'
import type { Language } from '../../utils/translation';
import { checkboxInput } from './legendStyles';
import Radio from '../ui/atoms/Radio';
import Checkbox from '../ui/atoms/Checkbox';

interface LegendDisplayOptionsProps {
  mapViewMode: 'realistic' | 'schematic';
  theme: 'light' | 'dark';
  language: Language;
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
          <Radio
            theme={theme}
            size="sm"
            name="mapViewMode"
            checked={mapViewMode === 'realistic'}
            onChange={() => onMapViewModeChange('realistic')}
          >
            {translateUI('realisticView', language)}
          </Radio>
          <Radio
            theme={theme}
            size="sm"
            name="mapViewMode"
            checked={mapViewMode === 'schematic'}
            onChange={() => onMapViewModeChange('schematic')}
          >
            {translateUI('schematicView', language)}
          </Radio>
        </div>
      </div>

      {/* 列車種別表示モード */}
      {onTrainTypeViewChange && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.borderLight}` }}>
          <Checkbox
            theme={theme}
            size="sm"
            checked={trainTypeViewEnabled}
            onChange={onTrainTypeViewChange}
          >
            <TrainFront size={13} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />列車種別表示モード
          </Checkbox>
        </div>
      )}
    </div>
  );
};

export default LegendDisplayOptions;