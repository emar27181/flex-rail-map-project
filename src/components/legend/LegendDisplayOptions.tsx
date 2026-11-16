import React from 'react';
import { TrainFront } from 'lucide-react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation'
import type { Language } from '../../utils/translation';
import { L } from './legendStyles';
import SegmentedControl from '../ui/molecules/SegmentedControl';
import SettingToggle from '../ui/atoms/SettingToggle';
import { FS } from '../../constants/ui';
import type { MapViewMode } from '../../constants/mapViewMode';

interface LegendDisplayOptionsProps {
  mapViewMode: MapViewMode;
  theme: 'light' | 'dark';
  language: Language;
  trainTypeViewEnabled?: boolean;
  onMapViewModeChange: (mode: MapViewMode) => void;
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
      borderRadius: L.r.control,
      border: `1px solid ${colors.borderLight}`
    }}>
      <div style={{ marginBottom: L.sp.lg }}>
        <label style={{
          display: 'block',
          marginBottom: L.sp.md,
          fontSize: FS.caption,
          fontWeight: 'bold',
          color: colors.text
        }}>
          {translateUI('mapDisplayMode', language)}:
        </label>
        <div style={{ marginBottom: L.sp.xl }}>
          <SegmentedControl<MapViewMode> variant="chips" theme={theme}
            ariaLabel={translateUI('mapDisplayMode', language)}
            value={mapViewMode} onChange={onMapViewModeChange} options={[
              { value: 'realistic', label: translateUI('realisticView', language) },
              { value: 'schematic', label: translateUI('schematicView', language) },
              { value: 'terrain3d', label: translateUI('terrain3dLabel', language) },
            ]} />
        </div>
      </div>

      {/* 列車種別表示モード */}
      {onTrainTypeViewChange && (
        <div style={{ marginTop: L.sp.xl, paddingTop: L.sp.xl, borderTop: `1px solid ${colors.borderLight}` }}>
          <SettingToggle theme={theme}
            checked={trainTypeViewEnabled}
            onChange={onTrainTypeViewChange} icon={<TrainFront />} label={translateUI('trainTypeView', language)} />
        </div>
      )}
    </div>
  );
};

export default LegendDisplayOptions;