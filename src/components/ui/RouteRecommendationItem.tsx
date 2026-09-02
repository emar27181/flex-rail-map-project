import React from 'react';
import { MapPin, RefreshCw, CircleDot } from 'lucide-react';
import { routeNames, routeColors } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { checkboxInput, selectableCard, L} from '../legend/legendStyles';
import { translateUI, translateRoute, translateStation } from '../../utils/translation'
import type { Language } from '../../utils/translation';
import { SEMANTIC, FS} from '../../constants/ui';
import ToggleMark from './atoms/ToggleMark';

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
        padding: `${L.sp.xs} ${L.sp.sm}`,
        cursor: 'pointer',
        marginBottom: L.sp.xs,
        ...selectableCard(colors, { selected: isSelected }),
        userSelect: 'none',
      }}
    >
      {/* 上段: チェック・カラードット・番号・時間 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.sm }}>
        <ToggleMark
          checked={isSelected}
          onChange={e => { e.stopPropagation(); onToggle(index); }}
        />

        {/* 路線カラードット */}
        <div style={{ display: 'flex', gap: L.sp.xxs, flexShrink: 0, alignItems: 'center' }}>
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
          <span style={{ fontSize: FS.tiny, color: isSelected ? colors.textSecondary : colors.textMuted, lineHeight: 1 }}>
            {translateUI('routeNumber', language, { number: (index + 1).toString() })}
            {route.transfers > 0 && (
              <span style={{ marginLeft: L.sp.xs }}>{transferText}</span>
            )}
          </span>
        </div>

        {/* 合計時間 */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: L.sp.xxs }}>
          <span style={{
            fontSize: FS.emphasis, fontWeight: 'bold', lineHeight: 1,
            color: isSelected ? SEMANTIC.primary : colors.text,
            opacity: isSelected ? 1 : 0.5,
          }}>
            {totalMin}
          </span>
          <span style={{ fontSize: FS.helper, color: isSelected ? colors.textSecondary : colors.textMuted, opacity: isSelected ? 1 : 0.5 }}>
            {translateUI('minutesSuffix', language)}
          </span>
        </div>
      </div>

      {/* 下段: セグメント詳細（出発 → 路線 → 乗換 → 路線 → 到着） */}
      <div style={{
        marginTop: L.sp.xs, paddingLeft: L.sp['3xl'],
        fontSize: FS.tiny, color: colors.textSecondary, lineHeight: 1.5,
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
                <div style={{ fontWeight: 'bold', color: SEMANTIC.departure, fontSize: FS.tiny }}>
                  <CircleDot size={12} style={{ verticalAlign: 'text-bottom' }} /> {translateStation(fromName, language)}
                </div>
              )}
              {/* 路線 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.xs, paddingLeft: L.sp.sm }}>
                <span style={{ color: colors.textSecondary }}>↓</span>
                <span style={{ width: '6px', height: '6px', background: color, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ color, fontWeight: 'bold' }}>{name}</span>
                <span style={{ color: colors.textSecondary, marginLeft: L.sp.xxs }}>({segMin}{translateUI('minutesSuffix', language)})</span>
              </div>
              {/* 乗換駅 or 到着駅 */}
              {toName && (
                <div style={{
                  fontWeight: 'bold',
                  color: isLast ? SEMANTIC.arrival : colors.text,
                  fontSize: FS.tiny,
                }}>
                  {isLast ? <MapPin size={12} style={{ verticalAlign: 'text-bottom' }} /> : <RefreshCw size={12} style={{ verticalAlign: 'text-bottom' }} />} {translateStation(toName, language)}
                  {!isLast && <span style={{ fontSize: FS.micro, fontWeight: 'normal', color: colors.textSecondary, marginLeft: L.sp.xs }}>乗換</span>}
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
