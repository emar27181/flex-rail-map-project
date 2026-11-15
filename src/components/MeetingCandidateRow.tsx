/**
 * 集合駅の候補1つ分の行（organism）。「1. 茅場町　最大44分」と、出発駅ごとの所要時間。
 *
 * 色は役割で統一する（2026-11-14 ユーザー指示: 到着駅候補なので到着駅と同じ赤、出発駅は緑）。
 * - 候補の駅 = 到着駅と同じ赤の `Button`（variant="arrival"）。いま集合駅（到着駅）に決めている候補にはチェックを付ける
 * - 出発駅ごとの所要時間 = 出発駅と同じ緑の `ColorChip`（「藤沢 42分」）。出発駅の入力順に並べ、誰も優先しない
 * 押すとその駅が到着駅になる（呼び出し側）。計算は utils/meetingPoint.ts。ここは見せるだけ。
 */
import React from 'react';
import { Check } from 'lucide-react';
import { getThemeColors } from '../contexts/ThemeContext';
import { FS, SEMANTIC } from '../constants/ui';
import { L } from './legend/legendStyles';
import Button from './ui/atoms/Button';
import ColorChip from './ui/ColorChip';
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
  const colors = getThemeColors(theme);
  const suffix = translateUI('minutesSuffix', language);
  return (
    <div data-meeting-candidate={name} style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xs }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: L.sp.sm }}>
        <Button
          theme={theme}
          size="sm"
          variant="arrival"
          disabled={disabled}
          onClick={onSelect}
          icon={selected ? <Check /> : undefined}
          aria-current={selected ? 'true' : undefined}
        >
          {`${rank}. ${translateStation(name, language)}`}
        </Button>
        <span style={{ fontSize: FS.caption, fontWeight: 'bold', color: colors.text }}>
          {translateUI('meetingMaxMinutes', language, { minutes: max })}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.xs }}>
        {times.map(t => (
          <ColorChip key={t.origin} color={SEMANTIC.departure} theme={theme}>
            {`${translateStation(t.origin, language)} ${t.minutes}${suffix}`}
          </ColorChip>
        ))}
      </div>
    </div>
  );
};

export default MeetingCandidateRow;
