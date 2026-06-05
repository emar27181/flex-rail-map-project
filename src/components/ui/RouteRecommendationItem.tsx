import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const colors = getThemeColors(theme);

  const totalMin = Math.round(route.totalTime);
  const transferText = translateUI('transfersCount', language, { count: route.transfers.toString() });

  return (
    <div
      onClick={() => onToggle(index)}
      onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY })}
      onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setTooltip(null)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
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
      {/* チェックボックス */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={e => { e.stopPropagation(); onToggle(index); }}
        style={{ cursor: 'pointer', flexShrink: 0 }}
      />

      {/* 路線カラードット列 */}
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

      {/* ルート番号 + 乗換数 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '10px', color: isSelected ? colors.textSecondary : colors.textMuted, lineHeight: 1 }}>
          {translateUI('routeNumber', language, { number: (index + 1).toString() })}
          {route.transfers > 0 && (
            <span style={{ marginLeft: '4px' }}>{transferText}</span>
          )}
        </div>
      </div>

      {/* 合計時間（メイン表示） */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'baseline',
        gap: '1px',
      }}>
        <span style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: isSelected ? '#2196F3' : colors.text,
          lineHeight: 1,
          opacity: isSelected ? 1 : 0.5,
        }}>
          {totalMin}
        </span>
        <span style={{
          fontSize: '11px',
          color: isSelected ? colors.textSecondary : colors.textMuted,
          opacity: isSelected ? 1 : 0.5,
        }}>
          {translateUI('minutesSuffix', language)}
        </span>
      </div>

      {/* ホバーツールチップ：セグメント別時間内訳 */}
      {tooltip && createPortal(
        <div style={{
          position: 'fixed',
          left: tooltip.x + 14,
          top: tooltip.y - 10,
          backgroundColor: colors.surfaceElevated,
          color: colors.text,
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 99999,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          minWidth: '180px',
        }}>
          {/* 合計時間ヘッダー */}
          <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '2px', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '4px' }}>
            {translateUI('routeNumber', language, { number: (index + 1).toString() })}
            {'  '}
            <span style={{ color: '#2196F3' }}>
              {totalMin}{translateUI('minutesSuffix', language)}
            </span>
            {'  '}
            <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 'normal' }}>
              {transferText}
            </span>
          </div>
          {/* セグメント別内訳 */}
          {(() => {
            const lines: React.ReactNode[] = [];
            route.segments.forEach((seg, i) => {
              const key = seg.routeKey as keyof typeof routeNames;
              const japaneseName = routeNames[key] || seg.routeKey;
              const name = translateRoute(japaneseName, language);
              const color = routeColors[key] || '#888';
              const boardStation = translateStation(seg.stations?.[0]?.name ?? '', language);
              const endStation = translateStation(seg.stations?.[seg.stations.length - 1]?.name ?? '', language);
              const segMin = Math.round(seg.time);

              if (i === 0) {
                lines.push(
                  <div key={`s-${i}`} style={{ fontWeight: 'bold', fontSize: '12px' }}>{boardStation}</div>
                );
              }
              lines.push(
                <div key={`r-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: colors.textSecondary, fontSize: '11px' }}>
                  <span>↓</span>
                  <div style={{ width: '8px', height: '8px', backgroundColor: color, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.2)', flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{name}</span>
                  <span style={{ color: '#2196F3', fontWeight: 'bold', marginLeft: '4px' }}>
                    {segMin}{translateUI('minutesSuffix', language)}
                  </span>
                </div>
              );
              lines.push(
                <div key={`e-${i}`} style={{ fontWeight: 'bold', fontSize: '12px' }}>{endStation}</div>
              );
            });
            return lines;
          })()}
        </div>,
        document.body
      )}
    </div>
  );
};

export default RouteRecommendationItem;
