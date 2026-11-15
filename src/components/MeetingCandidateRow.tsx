/**
 * 集合駅の候補1つ分のカード（organism）。「1　茅場町　最大44分」と、出発駅ごとの所要時間。
 *
 * 候補は推薦であって入力欄ではないので、色は控えめにする（2026-11-15 ユーザー指示: 主張が強すぎる）。
 * - 1候補 = 1枚のカード（枠だけの `Button`。全体が押せる）。塗りは使わない
 * - 色の手がかりは、駅名の前の小さな丸だけ（到着駅と同じ赤。いま集合駅に決めている候補はチェックと赤い枠）
 * - 出発駅ごとの所要時間は、灰色の小さな文字を1行にまとめる（出発駅の入力順。誰も優先しない）
 * 押すとその駅が到着駅になる（呼び出し側）。計算は utils/meetingPoint.ts。ここは見せるだけ。
 */
import React from 'react';
import { Check } from 'lucide-react';
import { getThemeColors } from '../contexts/ThemeContext';
import { FS, SEMANTIC } from '../constants/ui';
import { L } from './legend/legendStyles';
import Button from './ui/atoms/Button';
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

/** 駅名の前の丸の直径（px） */
const DOT_SIZE = 8;

const MeetingCandidateRow: React.FC<MeetingCandidateRowProps> = ({ theme, language, rank, name, max, times, selected, disabled, onSelect }) => {
  const colors = getThemeColors(theme);
  const suffix = translateUI('minutesSuffix', language);
  return (
    <Button
      theme={theme}
      size="sm"
      variant="outline"
      fullWidth
      disabled={disabled}
      onClick={onSelect}
      aria-current={selected ? 'true' : undefined}
      data-meeting-candidate={name}
      styleOverride={{
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: L.sp.xxs,
        whiteSpace: 'normal',
        textAlign: 'start',
        // 決めている候補だけ、到着駅の赤の枠（太さは変えない）
        borderColor: selected ? SEMANTIC.arrival : undefined,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: L.sp.sm }}>
        <span data-candidate-dot aria-hidden style={{ width: DOT_SIZE, height: DOT_SIZE, borderRadius: '50%', background: SEMANTIC.arrival, flexShrink: 0 }} />
        <span style={{ fontWeight: 'bold', color: colors.text, minWidth: 0 }}>{`${rank}  ${translateStation(name, language)}`}</span>
        {selected && <Check size={14} aria-hidden style={{ color: SEMANTIC.arrival, flexShrink: 0 }} />}
        <span style={{ marginInlineStart: 'auto', fontSize: FS.caption, color: colors.textSecondary, flexShrink: 0 }}>
          {translateUI('meetingMaxMinutes', language, { minutes: max })}
        </span>
      </span>
      <span style={{ fontSize: FS.caption, color: colors.textSecondary }}>
        {times.map(t => `${translateStation(t.origin, language)} ${t.minutes}`).join(' · ')}{suffix}
      </span>
    </Button>
  );
};

export default MeetingCandidateRow;
