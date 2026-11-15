/** 集合駅の候補カード。カード全体を押すと、候補が到着駅になる。 */
import React, { useId } from 'react';
import { Check } from 'lucide-react';
import { getThemeColors } from '../contexts/ThemeContext';
import { FS, SEMANTIC } from '../constants/ui';
import { L, selectableCard } from './legend/legendStyles';
import Button from './ui/atoms/Button';
import { CONTROL_SIZE } from './ui/atoms/controlSize';
import { translateStation, translateUI, type Language } from '../utils/translation';

export interface MeetingCandidateRowProps {
  theme: 'light' | 'dark';
  language: Language;
  /** 順位（1から） */
  rank: number;
  name: string;
  /** いちばん遅い人の所要時間（分） */
  max: number;
  /** 出発駅ごとの名前と所要時間（分）。出発駅の入力順 */
  times: Array<{ origin: string; minutes: number }>;
  /** いま集合駅（到着駅）に決めている候補か */
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

const MeetingCandidateRow: React.FC<MeetingCandidateRowProps> = ({ theme, language, rank, name, max, times, selected, disabled, onSelect }) => {
  const descriptionId = useId();
  const colors = getThemeColors(theme);
  const suffix = translateUI('minutesSuffix', language);
  const stationLabel = `${rank}. ${translateStation(name, language)}`;
  return (
    <Button
      theme={theme}
      size="md"
      variant="outline"
      fullWidth
      disabled={disabled}
      onClick={onSelect}
      aria-label={stationLabel}
      aria-describedby={`${descriptionId}-max ${descriptionId}-times`}
      aria-current={selected ? 'true' : undefined}
      data-meeting-candidate={name}
      styleOverride={{
        ...selectableCard(colors, { selected, accent: SEMANTIC.arrival }),
        borderColor: selected ? SEMANTIC.arrival : colors.border,
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: L.sp.xxs,
        padding: `${L.sp.xs} ${L.sp.md}`,
        textAlign: 'start',
        whiteSpace: 'normal',
      }}
    >
      <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: L.sp.xs }}>
        <span style={{ fontWeight: 'bold', overflowWrap: 'anywhere' }}>{stationLabel}</span>
        <span id={`${descriptionId}-max`} style={{ fontSize: FS.caption, color: colors.textSecondary, whiteSpace: 'nowrap' }}>
          {translateUI('meetingMaxMinutes', language, { minutes: max })}
        </span>
        {selected && <Check size={CONTROL_SIZE.sm.iconSize} aria-hidden="true" style={{ alignSelf: 'center', marginInlineStart: 'auto' }} />}
      </span>
      <span id={`${descriptionId}-times`} style={{ display: 'flex', flexWrap: 'wrap', columnGap: L.sp.md, rowGap: L.sp.xxs, fontSize: FS.caption, color: colors.textSecondary }}>
        {times.map(t => (
          <span key={t.origin} data-meeting-origin-time={t.origin} style={{ overflowWrap: 'anywhere' }}>
            {`${translateStation(t.origin, language)} ${t.minutes}${suffix}`}
          </span>
        ))}
      </span>
    </Button>
  );
};

export default MeetingCandidateRow;
