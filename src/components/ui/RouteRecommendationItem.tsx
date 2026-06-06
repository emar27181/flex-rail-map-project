import React from 'react';
import { routeNames, routeColors } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI, translateRoute, translateStation } from '../../utils/translation'
import type { Language } from '../../utils/translation';

interface RouteSegment {
  routeKey: string;
  startIndex: number;
  endIndex: number;
  time: number;
  stations?: { name: string }[];
  isWalkingTransfer?: boolean;
  walkingTime?: number;
}

interface RouteRecommendation {
  segments: RouteSegment[];
  totalTime: number;
  transfers: number;
}

interface RouteRecommendationItemProps {
  route: RouteRecommendation;
  index: number;
  isSelected: boolean;
  theme: 'light' | 'dark';
  language: Language;
  onToggle: (index: number) => void;
}

const RouteRecommendationItem: React.FC<RouteRecommendationItemProps> = ({
  route,
  index,
  isSelected,
  theme,
  language,
  onToggle
}) => {
  const colors = getThemeColors(theme);

  const totalMin = Math.round(route.totalTime);
  const transferText = translateUI('transfersCount', language, { count: route.transfers.toString() });

  return (
    <div
      onClick={() => onToggle(index)}
      style={{
        padding: '5px 6px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '4px',
        backgroundColor: isSelected ? 'rgba(33,150,243,0.12)' : 'rgba(108,117,125,0.07)',
        border: isSelected ? '1.5px solid #2196F3' : `1px solid ${colors.borderLight}`,
        transition: 'all 0.15s ease',
        userSelect: 'none',
      }}
    >
      {/* 上段: チェック・カラードット・番号・時間 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={e => { e.stopPropagation(); onToggle(index); }}
          style={{ cursor: 'pointer', flexShrink: 0 }}
        />

        {/* 路線カラードット */}
        <div style={{ display: 'flex', gap: '2px', flexShrink: 0, alignItems: 'center' }}>
          {route.segments.map((seg, i) => {
            const color = routeColors[seg.routeKey as keyof typeof routeColors] || '#888';
            return (
              <div key={i} style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: color,
                opacity: isSelected ? 1 : 0.4,
                border: '1px solid rgba(0,0,0,0.15)',
              }} />
            );
          })}
        </div>

        {/* 番号 + 乗換数 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '10px', color: isSelected ? colors.textSecondary : colors.textMuted, lineHeight: 1 }}>
            {translateUI('routeNumber', language, { number: (index + 1).toString() })}
            {route.transfers > 0 && (
              <span style={{ marginLeft: '4px' }}>{transferText}</span>
            )}
          </span>
        </div>

        {/* 合計時間 */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: '1px' }}>
          <span style={{
            fontSize: '18px', fontWeight: 'bold', lineHeight: 1,
            color: isSelected ? '#2196F3' : colors.text,
            opacity: isSelected ? 1 : 0.5,
          }}>
            {totalMin}
          </span>
          <span style={{ fontSize: '11px', color: isSelected ? colors.textSecondary : colors.textMuted, opacity: isSelected ? 1 : 0.5 }}>
            {translateUI('minutesSuffix', language)}
          </span>
        </div>
      </div>

      {/* 下段: セグメント詳細（出発 → 路線 → 乗換 → 路線 → 到着） */}
      <div style={{
        marginTop: '4px', paddingLeft: '20px',
        fontSize: '10px', color: colors.textSecondary, lineHeight: 1.5,
        opacity: isSelected ? 1 : 0.6,
      }}>
        {route.segments.map((seg, i) => {
          const key = seg.routeKey as keyof typeof routeNames;
          const name = translateRoute(routeNames[key] || seg.routeKey, language);
          const color = routeColors[key] || '#888';
          const fromName = seg.stations?.[0]?.name ?? '';
          const toName = seg.stations?.[seg.stations.length - 1]?.name ?? '';
          const segMin = Math.round(seg.time);
          const isLast = i === route.segments.length - 1;

          return (
            <div key={i}>
              {/* 出発駅（最初のセグメントのみ） */}
              {i === 0 && fromName && (
                <div style={{ fontWeight: 'bold', color: '#4CAF50', fontSize: '10px' }}>
                  🟢 {translateStation(fromName, language)}
                </div>
              )}
              {/* 路線 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', paddingLeft: '6px' }}>
                <span style={{ color: colors.textSecondary }}>↓</span>
                <span style={{ width: '6px', height: '6px', background: color, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ color, fontWeight: 'bold' }}>{name}</span>
                <span style={{ color: colors.textSecondary, marginLeft: '2px' }}>({segMin}{translateUI('minutesSuffix', language)})</span>
              </div>
              {/* 乗換駅 or 到着駅 */}
              {toName && (
                <div style={{
                  fontWeight: 'bold',
                  color: isLast ? '#F44336' : colors.text,
                  fontSize: '10px',
                }}>
                  {isLast ? '🔴' : '🔄'} {translateStation(toName, language)}
                  {!isLast && <span style={{ fontSize: '9px', fontWeight: 'normal', color: colors.textSecondary, marginLeft: '3px' }}>乗換</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RouteRecommendationItem;
