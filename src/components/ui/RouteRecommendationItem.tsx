import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { routeNames, routeColors } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI } from '../../utils/translation';
import ToggleableItem from './ToggleableItem';

interface RouteSegment {
  routeKey: string;
  startIndex: number;
  endIndex: number;
  stations?: { name: string }[];
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
  language: 'japanese' | 'english';
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

  const routeLabel = `${translateUI('routeNumber', language, { number: (index + 1).toString() })} → (${translateUI('minutesShort', language, { time: Math.round(route.totalTime).toString() })}, ${translateUI('transfersCount', language, { count: route.transfers.toString() })})`;

  return (
    <div
      onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY })}
      onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setTooltip(null)}
    >
      {tooltip && createPortal(
        <div style={{
          position: 'fixed',
          left: tooltip.x + 12,
          top: tooltip.y - 10,
          backgroundColor: colors.surfaceElevated,
          color: colors.text,
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '13px',
          zIndex: 99999,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          border: '1px solid rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          minWidth: '160px'
        }}>
          {(() => {
            const lines: React.ReactNode[] = [];
            route.segments.forEach((seg, i) => {
              const key = seg.routeKey as keyof typeof routeNames;
              const name = routeNames[key] || seg.routeKey;
              const color = routeColors[key] || '#888';
              const boardStation = seg.stations?.[0]?.name ?? '';
              const endStation = seg.stations?.[seg.stations.length - 1]?.name ?? '';
              // 最初のセグメントのみ乗車駅を表示
              if (i === 0) {
                lines.push(
                  <div key={`station-${i}`} style={{ fontSize: '12px', fontWeight: 'bold' }}>{boardStation}</div>
                );
              }
              // ↓（路線名）
              lines.push(
                <div key={`route-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '3px', color: colors.textSecondary, fontSize: '12px' }}>
                  <span>↓</span>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: color, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.3)', flexShrink: 0 }} />
                  <span>{name}</span>
                </div>
              );
              // 終着駅
              lines.push(
                <div key={`station-end-${i}`} style={{ fontSize: '12px', fontWeight: 'bold' }}>{endStation}</div>
              );
            });
            return lines;
          })()}
        </div>,
        document.body
      )}
      <ToggleableItem
        id={`route-${index}`}
        label={routeLabel}
        isActive={isSelected}
        isHighlighted={isSelected}
        theme={theme}
        inputType="checkbox"
        colorIndicator={{
          color: '#4CAF50',
          opacity: 1
        }}
        badge={undefined}
        onToggle={() => onToggle(index)}
      />
    </div>
  );
};

export default RouteRecommendationItem;