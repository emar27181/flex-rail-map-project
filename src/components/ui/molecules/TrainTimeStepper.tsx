import React from 'react';
import { ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import type { Language } from '../../../utils/translation';
import { translateUI } from '../../../utils/translation';
import { L } from '../../legend/legendStyles';

interface TrainTimeStepperProps {
  value: string;
  theme: 'light' | 'dark';
  language: Language;
  onPrevious: () => void;
  onNext: () => void;
  onUseNow: () => void;
}

const TrainTimeStepper: React.FC<TrainTimeStepperProps> = ({ value, theme, language, onPrevious, onNext, onUseNow }) => {
  const colors = getThemeColors(theme);
  const controlStyle: React.CSSProperties = {
    minHeight: 36,
    border: `1px solid ${colors.border}`,
    background: colors.glassOpen,
    color: colors.text,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    font: 'inherit', cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
  };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', borderRadius: L.r.control, overflow: 'hidden' }}>
      <button type="button" onClick={onPrevious} aria-label={translateUI('previousTrain', language)} style={{ ...controlStyle, width: 38, borderRight: 0 }}><ChevronLeft size={18}/></button>
      <button type="button" onClick={onUseNow} aria-label={translateUI('currentTime', language)} style={{ ...controlStyle, minWidth: 94, gap: L.sp.xs, padding: `0 ${L.sp.md}` }}><Clock3 size={15}/><strong>{value}</strong></button>
      <button type="button" onClick={onNext} aria-label={translateUI('nextTrain', language)} style={{ ...controlStyle, width: 38, borderLeft: 0 }}><ChevronRight size={18}/></button>
    </div>
  );
};
export default TrainTimeStepper;
