import React, { useState, useMemo } from 'react';
import { TriangleAlert } from 'lucide-react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';
import {
  getNextDepartures,
  getDirectionIndex,
  hasTimetableData,
  getLineTimetable,
  type Departure,
} from '../data/timetableData';
import type { RouteResult } from '../utils/routeFinder';
import { SEMANTIC, FS} from '../constants/ui';
import Button from './ui/atoms/Button';
import TextField from './ui/atoms/TextField';
import { L } from './legend/legendStyles';

interface TimetablePanelProps {
  routeResult: RouteResult | null;
  departureTime: string;        // "HH:MM"
  onDepartureTimeChange: (t: string) => void;
  language?: Language;
  isMobile?: boolean;
}

function addMinutes(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const norm  = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(norm / 60)).padStart(2, '0')}:${String(norm % 60).padStart(2, '0')}`;
}

const TYPE_COLOR: Record<string, string> = {
  '各停': '#555',
  '普通': '#555',
  '急行': '#d35400',
  '快速': '#2980b9',
  '快速アクティー': '#2980b9',
  '特別快速': '#1a6ea8',
  '準急': '#c0392b',
  '快特': '#8e44ad',
  '特急ロマンスカー': '#e74c3c',
};
function typeColor(t: string): string {
  return TYPE_COLOR[t] ?? '#333';
}

const TimetablePanel: React.FC<TimetablePanelProps> = ({
  routeResult,
  departureTime,
  onDepartureTimeChange,
  language = 'japanese',
  isMobile = false,
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [expandedSegments, setExpandedSegments] = useState<Set<number>>(new Set());

  // 累積所要時間を計算して、各区間の発着時刻を求める
  const timeline = useMemo(() => {
    if (!routeResult) return [];

    const result: {
      segIndex: number;
      fromStation: string;
      toStation: string;
      routeKey: string;
      routeName: string;
      departTime: string;   // この区間の出発時刻
      arriveTime: string;   // この区間の到着時刻
      segTime: number;      // この区間の所要時間
      directionIndex: number;
      hasTimetable: boolean;
    }[] = [];

    let cumTime = 0;
    for (let i = 0; i < routeResult.segments.length; i++) {
      const seg = routeResult.segments[i];
      if (seg.isWalkingTransfer) {
        cumTime += seg.walkingTime ?? 5;
        continue;
      }
      const fromName = seg.stations[0]?.name ?? '';
      const toName   = seg.stations[seg.stations.length - 1]?.name ?? '';
      const depTime  = addMinutes(departureTime, cumTime);
      const arrTime  = addMinutes(departureTime, cumTime + seg.time);
      const dirIdx   = getDirectionIndex(seg.routeKey, fromName, toName);

      result.push({
        segIndex: i,
        fromStation: fromName,
        toStation: toName,
        routeKey: seg.routeKey,
        routeName: seg.routeName,
        departTime: depTime,
        arriveTime: arrTime,
        segTime: seg.time,
        directionIndex: dirIdx,
        hasTimetable: hasTimetableData(seg.routeKey),
      });
      cumTime += seg.time;
    }
    return result;
  }, [routeResult, departureTime]);

  const toggleExpand = (segIndex: number) => {
    setExpandedSegments(prev => {
      const next = new Set(prev);
      if (next.has(segIndex)) next.delete(segIndex);
      else next.add(segIndex);
      return next;
    });
  };

  // 最終到着時刻
  const totalArriveTime = useMemo(() => {
    if (!timeline.length) return '';
    return timeline[timeline.length - 1].arriveTime;
  }, [timeline]);

  // 更新日ラベル（路線ごとに異なる場合は最初の路線を使用）
  const dataVersionLabel = useMemo(() => {
    for (const seg of timeline) {
      const ld = getLineTimetable(seg.routeKey);
      if (ld) return { version: ld.dataVersion, updatedAt: ld.updatedAt };
    }
    return null;
  }, [timeline]);

  if (!routeResult) {
    return (
      <div style={{
        padding: L.sp.xl,
        color: colors.textSecondary,
        fontSize: FS.body,
        textAlign: 'center',
      }}>
        {translateUI('selectStationsPrompt', language)}
      </div>
    );
  }

  const panelStyle: React.CSSProperties = {
    backgroundColor: colors.surfaceElevated,
    color: colors.text,
    fontSize: FS.body,
    overflowY: 'auto',
    maxHeight: isMobile ? 'calc(60vh - 88px)' : '70vh',
  };

  return (
    <div style={panelStyle}>
      {/* 出発時刻入力 */}
      <div style={{
        padding: `${L.sp.lg} ${L.sp.xl}`,
        borderBottom: `1px solid ${colors.borderLight}`,
        display: 'flex',
        alignItems: 'center',
        gap: L.sp.md,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontWeight: 'bold', color: colors.text }}>⏰ {translateUI('departureTime', language)}</span>
        <TextField
          theme={theme}
          size="sm"
          type="time"
          value={departureTime}
          onChange={e => onDepartureTimeChange(e.target.value)}
          fullWidth={false}
        />
        <Button
          theme={theme}
          variant="outline"
          size="sm"
          onClick={() => {
            const now = new Date();
            const hh  = String(now.getHours()).padStart(2, '0');
            const mm  = String(now.getMinutes()).padStart(2, '0');
            onDepartureTimeChange(`${hh}:${mm}`);
          }}
        >
          {translateUI('currentTime', language)}
        </Button>
      </div>

      {/* タイムライン */}
      <div style={{ padding: `${L.sp.md} 0` }}>
        {timeline.map((seg, idx) => {
          const isExpanded = expandedSegments.has(seg.segIndex);
          const nextDeps   = isExpanded && seg.hasTimetable
            ? getNextDepartures(seg.routeKey, seg.fromStation, seg.directionIndex, seg.departTime, 5)
            : [];
          const isLast = idx === timeline.length - 1;

          return (
            <React.Fragment key={seg.segIndex}>
              {/* 出発駅行 */}
              <div style={{
                padding: `${L.sp.sm} ${L.sp.xl}`,
                display: 'flex',
                alignItems: 'center',
                gap: L.sp.sm,
              }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: idx === 0 ? SEMANTIC.departure : colors.primary,
                  flexShrink: 0,
                }} />
                <span style={{ fontWeight: 'bold', color: colors.text }}>
                  {seg.fromStation}
                </span>
                <span style={{
                  fontSize: FS.title, fontWeight: 'bold',
                  color: idx === 0 ? SEMANTIC.departure : colors.primary,
                  marginLeft: 'auto',
                }}>
                  {seg.departTime} {translateUI('departsLabel', language)}
                </span>
              </div>

              {/* 路線・所要時間 + 時刻表ボタン */}
              <div style={{
                padding: `${L.sp.xxs} ${L.sp.xl} ${L.sp.xxs} ${L.sp['4xl']}`,
                display: 'flex',
                alignItems: 'center',
                gap: L.sp.sm,
                flexWrap: 'wrap',
              }}>
                <div style={{
                  width: '2px', height: '24px', backgroundColor: colors.borderLight,
                  marginRight: L.sp.xs, flexShrink: 0,
                }} />
                <span style={{ color: colors.textSecondary, fontSize: FS.caption }}>
                  {seg.routeName}
                </span>
                <span style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.borderLight}`,
                  borderRadius: L.r.control,
                  padding: `0 ${L.sp.xs}`,
                  fontSize: FS.caption,
                  color: colors.textSecondary,
                }}>
                  {translateUI('approxMinutes', language, { time: seg.segTime })}
                </span>
                {seg.hasTimetable && (
                  <Button
                    theme={theme}
                    variant="primary"
                    size="sm"
                    pressed={isExpanded}
                    onClick={() => toggleExpand(seg.segIndex)}
                    styleOverride={{ marginLeft: 'auto' }}
                  >
                    {isExpanded ? `▲ ${translateUI('close', language)}` : `▼ ${translateUI('timetableButton', language)}`}
                  </Button>
                )}
              </div>

              {/* 展開された時刻表 */}
              {isExpanded && (
                <div style={{
                  margin: `${L.sp.xs} ${L.sp.xl} ${L.sp.xs} ${L.sp['4xl']}`,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.borderLight}`,
                  borderRadius: L.r.control,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: `${L.sp.xs} ${L.sp.md}`,
                    fontSize: FS.caption,
                    color: colors.textSecondary,
                    borderBottom: `1px solid ${colors.borderLight}`,
                    backgroundColor: colors.surfaceElevated,
                  }}>
                    {translateUI('departsAfterLabel', language, { station: seg.fromStation, time: seg.departTime, route: seg.routeName })}
                  </div>
                  {nextDeps.length === 0 ? (
                    <div style={{ padding: L.sp.md, color: colors.textSecondary, fontSize: FS.caption }}>
                      {translateUI('noTimetableDataFound', language)}
                    </div>
                  ) : (
                    nextDeps.map((dep, di) => (
                      <div key={di} style={{
                        padding: `${L.sp.xs} ${L.sp.md}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: L.sp.md,
                        borderBottom: di < nextDeps.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                      }}>
                        <span style={{ fontWeight: 'bold', fontSize: FS.title, color: colors.text, minWidth: '45px' }}>
                          {dep.time}
                        </span>
                        <span style={{
                          fontSize: FS.caption,
                          color: colors.onPrimary,
                          backgroundColor: typeColor(dep.type),
                          borderRadius: L.r.control,
                          padding: `${L.sp.xxs} ${L.sp.xs}`,
                          minWidth: '28px',
                          textAlign: 'center',
                        }}>
                          {dep.type}
                        </span>
                        {dep.platform && (
                          <span style={{ fontSize: FS.caption, color: colors.textSecondary, whiteSpace: 'nowrap' }}>
                            {dep.platform}
                          </span>
                        )}
                        <span style={{ fontSize: FS.caption, color: colors.textSecondary }}>
                          {dep.destination}{dep.toward ? translateUI('towardDirection', language, { direction: dep.toward }) : ''}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 矢印 */}
              {!isLast && (
                <div style={{ padding: `0 ${L.sp.xl} 0 ${L.sp['4xl']}`, color: colors.textSecondary, fontSize: FS.caption }}>
                  ▼
                </div>
              )}

              {/* 最終区間の到着駅 */}
              {isLast && (
                <div style={{
                  padding: `${L.sp.sm} ${L.sp.xl}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: L.sp.sm,
                }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: SEMANTIC.arrival, flexShrink: 0,
                  }} />
                  <span style={{ fontWeight: 'bold', color: colors.text }}>
                    {seg.toStation}
                  </span>
                  <span style={{
                    fontSize: FS.title, fontWeight: 'bold',
                    color: SEMANTIC.arrival, marginLeft: 'auto',
                  }}>
                    {totalArriveTime} {translateUI('arrivesLabel', language)}
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* フッター（更新日・免責） */}
      {dataVersionLabel && (
        <div style={{
          padding: `${L.sp.md} ${L.sp.xl}`,
          borderTop: `1px solid ${colors.borderLight}`,
          fontSize: FS.caption,
          color: colors.textSecondary,
          lineHeight: '1.5',
        }}>
          <TriangleAlert size={11} style={{ verticalAlign: 'text-bottom', marginRight: 3 }} />{dataVersionLabel.version}{translateUI('approxNote', language)}<br />
          {translateUI('timetableUpdatedAt', language, { date: dataVersionLabel.updatedAt })}　{translateUI('timetableDisclaimerNote', language)}
        </div>
      )}
    </div>
  );
};

export default TimetablePanel;
