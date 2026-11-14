/**
 * 乗車ログ（試作）の操作（organism）。駅選択パネルの中の、モードのボタンの下に出る。
 *
 * - 段階の絞り込み: 「全く通っていない／通ったけど降りていない／通って降りた」を選んで見せる（複数選べる）。
 *   色はこの3段階で地図の見え方と対応させる（Chip の丸の色 = 地図の段階の色の意味づけ）
 * - 記録: いま選んでいる出発駅→到着駅の経路を記録する。直前の取り消し・全消去
 * 別の入力欄・別のパネルは作らない（出発駅・到着駅は既存の欄を使う）。計算は utils/rideLog.ts。
 */
import React from 'react';
import { Check, Undo2, Trash2 } from 'lucide-react';
import { getThemeColors } from '../contexts/ThemeContext';
import { FS, SEMANTIC } from '../constants/ui';
import { L } from './legend/legendStyles';
import Button from './ui/atoms/Button';
import Chip from './ui/atoms/Chip';
import { translateUI, type Language } from '../utils/translation';
import { RIDE_LEVELS, type RideLevel } from '../utils/rideLog';

export interface RideLogControlsProps {
  theme: 'light' | 'dark';
  language: Language;
  filter: ReadonlySet<RideLevel>;
  onToggleLevel: (level: RideLevel) => void;
  /** 段階ごとの駅の数 */
  counts: Record<RideLevel, number>;
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

const LEVEL_LABEL_KEY: Record<RideLevel, string> = {
  0: 'rideLogLevelNone',
  1: 'rideLogLevelPassed',
  2: 'rideLogLevelAlighted',
};

const RideLogControls: React.FC<RideLogControlsProps> = ({
  theme, language, filter, onToggleLevel, counts, loggedLines, loggedStations, canRecord, hasEntries, onRecord, onUndo, onClear,
}) => {
  const colors = getThemeColors(theme);
  /** 段階を示す色（意味ごと）。0=無彩色 / 1=通っただけ / 2=降りた */
  const levelColor: Record<RideLevel, string> = { 0: colors.textMuted, 1: SEMANTIC.primary, 2: SEMANTIC.success };
  return (
    <div data-ride-log style={{ marginTop: L.sp.sm, display: 'flex', flexDirection: 'column', gap: L.sp.xs }}>
      <div style={{ fontSize: FS.caption, color: colors.textSecondary }}>{translateUI('rideLogFilterLabel', language)}</div>
      <div data-ride-log-filter style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.xs }}>
        {RIDE_LEVELS.map(level => (
          <Chip
            key={level}
            color={levelColor[level]}
            label={`${translateUI(LEVEL_LABEL_KEY[level], language)} ${counts[level]}`}
            selected={filter.has(level)}
            theme={theme}
            size="sm"
            onClick={() => onToggleLevel(level)}
            dataAttr={{ 'data-ride-level': String(level) }}
          />
        ))}
      </div>
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
          : translateUI(canRecord ? 'rideLogHint' : 'rideLogNeedRoute', language)}
      </div>
    </div>
  );
};

export default RideLogControls;
