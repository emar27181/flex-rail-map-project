/**
 * 集合駅を探すときの、駅ごとの詳細（organism）。出発駅それぞれからの所要時間と、いちばん遅い人の時間。
 *
 * 駅アイコンの下には出発駅ごとの時間を並べない（地図が読めなくなる）。代わりに、駅のツールチップの中に出す
 * （2026-11-14 ユーザー指示）。出発駅の札は `ColorChip`（出発=緑）、行の並びは出発駅の入力順（誰も優先しない）。
 * 計算は utils/meetingPoint.ts。ここは見せるだけ。
 */
import React from 'react';
import { getThemeColors } from '../contexts/ThemeContext';
import { FS, SEMANTIC } from '../constants/ui';
import { L } from './legend/legendStyles';
import ColorChip from './ui/ColorChip';
import { translateStation, translateUI, type Language } from '../utils/translation';

export interface MeetingTimesDetailProps {
  theme: 'light' | 'dark';
  language: Language;
  /** 出発駅ごとの所要時間（分）。行けないときは undefined */
  rows: Array<{ origin: string; minutes: number | undefined }>;
}

const MeetingTimesDetail: React.FC<MeetingTimesDetailProps> = ({ theme, language, rows }) => {
  const colors = getThemeColors(theme);
  const known = rows.map(r => r.minutes).filter((m): m is number => m !== undefined);
  const max = known.length === rows.length && known.length > 0 ? Math.max(...known) : undefined;
  const suffix = translateUI('minutesSuffix', language);
  return (
    <div data-meeting-times style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xs }}>
      <div style={{ fontSize: FS.caption, color: colors.textSecondary }}>{translateUI('meetingDetailTitle', language)}</div>
      {rows.map(row => (
        <div key={row.origin} data-meeting-times-row={row.origin} style={{ display: 'flex', alignItems: 'center', gap: L.sp.xs }}>
          <ColorChip color={SEMANTIC.departure} theme={theme}>{translateStation(row.origin, language)}</ColorChip>
          <span style={{ fontSize: FS.caption, color: colors.text }}>
            {row.minutes === undefined ? '—' : `${row.minutes}${suffix}`}
          </span>
        </div>
      ))}
      {max !== undefined && (
        <div style={{ fontSize: FS.caption, fontWeight: 'bold', color: colors.text }}>
          {translateUI('meetingMaxMinutes', language, { minutes: max })}
        </div>
      )}
    </div>
  );
};

export default MeetingTimesDetail;
