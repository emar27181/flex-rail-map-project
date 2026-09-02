import React from 'react';
import { TrainFront } from 'lucide-react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation'
import type { Language } from '../../utils/translation';
import { checkboxInput, L} from './legendStyles';
import Radio from '../ui/atoms/Radio';
import Checkbox from '../ui/atoms/Checkbox';
import { FS } from '../../constants/ui';

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
      marginBottom: L.sp['2xl'],
      padding: L.sp.lg,
      backgroundColor: colors.surface,
      borderRadius: L.r.md,
      border: `1px solid ${colors.borderLight}`
    }}>
      <div style={{ marginBottom: L.sp.lg }}>
        <label style={{
          display: 'block',
          marginBottom: L.sp.md,
          fontSize: FS.label,
          fontWeight: 'bold',
          color: colors.text
        }}>
          {translateUI('mapDisplayMode', language)}:
        </label>
        <div style={{ marginBottom: L.sp.xl }}>
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
        <div style={{ marginTop: L.sp.xl, paddingTop: L.sp.xl, borderTop: `1px solid ${colors.borderLight}` }}>
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