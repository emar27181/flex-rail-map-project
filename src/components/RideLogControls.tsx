/**
 * 乗車ログ（試作）の操作（organism）。駅選択パネルの中の、モードのボタンの下に出る。
 *
 * - 記録: いま選んでいる出発駅→到着駅の経路を記録する。直前の取り消し・全消去
 * - 見せ方の絞り込みは無い（乗っていない路線は灰色、乗った路線は色つきで常に出す）。
 *   路線の記録は地図の灰色の線をタップ、降りた駅の記録は駅のツールチップのボタンで行う
 * 別の入力欄・別のパネルは作らない（出発駅・到着駅は既存の欄を使う）。計算は utils/rideLog.ts。
 */
import React from 'react';
import { Check, Undo2, Trash2 } from 'lucide-react';
import { getThemeColors } from '../contexts/ThemeContext';
import { FS } from '../constants/ui';
import { L } from './legend/legendStyles';
import Button from './ui/atoms/Button';
import { translateUI, type Language } from '../utils/translation';

export interface RideLogControlsProps {
  theme: 'light' | 'dark';
  language: Language;
  /** 記録した路線数・駅数 */
  loggedLines: number;
  loggedStations: number;
  /** いま選んでいる経路を記録できるか（出発駅・到着駅がそろい、経路がある） */
  canRecord: boolean;
  hasEntries: boolean;
  onRecord: () => void;
  onUndo: () => void;
  onClear: () => void;
}

const RideLogControls: React.FC<RideLogControlsProps> = ({
  theme, language, loggedLines, loggedStations, canRecord, hasEntries, onRecord, onUndo, onClear,
}) => {
  const colors = getThemeColors(theme);
  return (
    <div data-ride-log style={{ marginTop: L.sp.sm, display: 'flex', flexDirection: 'column', gap: L.sp.xs }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.xs }}>
        <Button theme={theme} size="sm" variant="primary" icon={<Check />} disabled={!canRecord} onClick={onRecord} data-ride-log-record>
          {translateUI('rideLogRecord', language)}
        </Button>
        <Button theme={theme} size="sm" variant="outline" icon={<Undo2 />} disabled={!hasEntries} onClick={onUndo}>
          {translateUI('rideLogUndo', language)}
        </Button>
        <Button theme={theme} size="sm" variant="outline" icon={<Trash2 />} disabled={!hasEntries} onClick={onClear}>
          {translateUI('rideLogClear', language)}
        </Button>
      </div>
      <div style={{ fontSize: FS.caption, color: colors.textSecondary }}>
        {hasEntries
          ? translateUI('rideLogSummary', language, { lines: loggedLines, stations: loggedStations })
          : translateUI('rideLogHint', language)}
      </div>
    </div>
  );
};

export default RideLogControls;
