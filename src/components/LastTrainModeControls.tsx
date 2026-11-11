import React from 'react';
import { Clock3, Pause, Play, RotateCcw, TriangleAlert } from 'lucide-react';
import type { Station } from '../data/yamanote';
import type { Language } from '../utils/translation';
import { translateStation } from '../utils/translation';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { FS } from '../constants/ui';
import { L } from './legend/legendStyles';
import Button from './ui/atoms/Button';
import Select from './ui/atoms/Select';
import Slider from './ui/atoms/Slider';
import { DEMO_START, DEMO_END, DEMO_STATIONS, formatDemoClock, getCurrentDemoClock } from '../utils/lastTrainDemo';
import { lastTrainCopy } from '../utils/lastTrainDemoI18n';

export interface LastTrainModeControlsProps {
  language: Language;
  destination: Station | null;
  minute: number;
  onMinuteChange: (minute: number) => void;
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  inspectedStation: string;
  onInspectedStationChange: (name: string) => void;
  latestDeparture: ReadonlyMap<string, number>;
  availableCount: number;
}

/**
 * 駅の入力欄そのものは StationSelector を使用する。
 * この部品は既存の駅選択パネルに「時刻スライダー」と結果行だけを追加する。
 * 地図/パネル/地図線/駅アイコンを自作・複製しない。
 */
export default function LastTrainModeControls({
  language, destination, minute, onMinuteChange, playing, onPlayingChange,
  inspectedStation, onInspectedStationChange, latestDeparture, availableCount,
}: LastTrainModeControlsProps) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const t = lastTrainCopy(language);
  const latest = latestDeparture.get(inspectedStation);
  const remaining = latest === undefined ? null : latest - minute;
  const isDestination = inspectedStation === destination?.name;
  const total = DEMO_STATIONS.length - (destination && DEMO_STATIONS.some(s => s.name === destination.name) ? 1 : 0);
  const sectionStyle: React.CSSProperties = {
    borderTop: '1px solid ' + colors.border,
    paddingTop: L.sp.lg, marginTop: L.sp.lg, display: 'grid', gap: L.sp.sm,
  };
  const labelStyle: React.CSSProperties = { fontSize: FS.caption, color: colors.textSecondary };
  const expiring = [...latestDeparture].filter(([name, at]) => name !== destination?.name && at >= minute)
    .sort((a, b) => a[1] - b[1]).slice(0, 3);

  return (
    <section aria-label={t.mapHeading} style={sectionStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.xs, fontSize: FS.body, fontWeight: 700 }}>
        <Clock3 size={18} aria-hidden />{t.mapHeading}
        <span style={{ marginLeft: 'auto', fontSize: FS.caption, color: colors.warning }}>POC</span>
      </div>
      <div role="note" style={{
        display: 'flex', alignItems: 'flex-start', gap: L.sp.sm,
        padding: L.sp.md, border: '1px solid ' + colors.warning,
        borderRadius: L.r.card, background: colors.surfaceElevated, fontSize: FS.caption,
      }}>
        <TriangleAlert size={18} aria-hidden style={{ flexShrink: 0, color: colors.warning }}/>
        <span><strong>{t.warnTitle}</strong> {t.warnBody}</span>
      </div>
      <div style={{ fontSize: FS.caption, color: colors.textSecondary }}>
        {t.destinationPrompt}: <strong style={{ color: colors.text }}>
          {destination ? translateStation(destination.name, language) : t.statusNoData}
        </strong>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: L.sp.sm }}>
        <strong style={{ fontSize: FS.heading, fontVariantNumeric: 'tabular-nums' }}>{formatDemoClock(minute)}</strong>
        <span style={labelStyle}>{t.virtualTime}</span>
      </div>
      <Slider size="md" min={Math.min(DEMO_START, minute)} max={Math.max(DEMO_END, minute)} step={1} value={minute}
        aria-label={t.timeAria} onChange={e => onMinuteChange(Number(e.target.value))}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...labelStyle }}>
        <span>{formatDemoClock(Math.min(DEMO_START, minute))}</span><span>{formatDemoClock(Math.max(DEMO_END, minute))}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.sm }}>
        <Button theme={theme} variant="primary" size="sm" pressed
          disabled={!destination || (minute >= DEMO_END && !playing)}
          icon={playing ? <Pause /> : <Play />}
          onClick={() => onPlayingChange(!playing)}>{playing ? t.pause : t.play}</Button>
        <Button theme={theme} variant="outline" size="sm" icon={<RotateCcw />}
          onClick={() => { onPlayingChange(false); onMinuteChange(getCurrentDemoClock()); }}>{t.nowButton}</Button>
      </div>
      <div style={{ ...labelStyle }}>
        {t.reachableSummary} : <strong style={{ color: colors.text }}>{availableCount} / {total} {t.stationUnit}</strong>
      </div>
      <label htmlFor="lt-inspected-station" style={labelStyle}>{t.inspectLabel}</label>
      <Select id="lt-inspected-station" theme={theme} size="sm" fullWidth value={inspectedStation}
        onChange={e => onInspectedStationChange(e.target.value)}>
        {DEMO_STATIONS.map(st =>
          <option key={st.name} value={st.name}>{translateStation(st.name, language)}</option>)}
      </Select>
      <div style={{
        borderLeft: '3px solid ' + (isDestination ? colors.primary : remaining !== null && remaining >= 0 ? colors.success : colors.danger),
        borderRadius: L.r.control, padding: L.sp.md,
        background: colors.surfaceElevated, display: 'grid', gap: L.sp.xxs,
      }}>
        <strong style={{ fontSize: FS.body }}>
          {isDestination ? t.statusDestination : latest === undefined ? t.statusNoData
            : remaining !== null && remaining >= 0
              ? t.statusRemaining + remaining + t.minuteUnit : t.statusEnded}
        </strong>
        <span style={labelStyle}>{isDestination ? t.statusDestDetail
          : latest === undefined ? t.statusNoDataDetail : t.statusLast + formatDemoClock(latest)}</span>
      </div>
      {expiring.length > 0 && (
        <div style={{ fontSize: FS.caption, color: colors.textSecondary }}>
          <strong style={{ color: colors.text }}>{t.expiringHeading}</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.sm, marginTop: L.sp.xs }}>
            {expiring.map(([name, at]) =>
              <span key={name} style={{
                background: colors.surfaceElevated, padding: L.sp.xs, borderRadius: L.r.control,
              }}>{translateStation(name, language)} {formatDemoClock(at)}</span>)}
          </div>
        </div>
      )}
    </section>
  );
}
