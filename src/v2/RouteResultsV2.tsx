import React from 'react';
import { CircleDot, MapPin, RefreshCw } from 'lucide-react';
import { routeColors, routeNames } from '../data/routes';
import type { RouteKey } from '../data/routes';
import type { RouteResult } from '../utils/routeFinder';
import { translateRoute, translateStation, translateUI } from '../utils/translation';
import type { Language } from '../utils/translation';

interface RouteResultsV2Props {
  routes: RouteResult[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  language: Language;
}

const RouteResultsV2: React.FC<RouteResultsV2Props> = ({ routes, selectedIndex, onSelect, language }) => {
  if (routes.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
      {routes.map((route, index) => {
        const isSelected = selectedIndex === null || selectedIndex === index;
        const totalMin = Math.round(route.totalTime);

        return (
          <div
            key={index}
            onClick={() => onSelect(index)}
            style={{
              padding: 'var(--v2-space-3)',
              borderRadius: 'var(--v2-radius-lg)',
              cursor: 'pointer',
              backgroundColor: isSelected ? 'var(--v2-color-bg-elevated)' : 'var(--v2-color-surface)',
              border: isSelected ? '2px solid var(--v2-color-primary)' : '1px solid var(--v2-color-border)',
              boxShadow: isSelected ? 'var(--v2-shadow-sm)' : 'none',
              transition: 'var(--v2-transition-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--v2-space-2)', marginBottom: 'var(--v2-space-2)' }}>
              <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                {route.segments.map((seg, i) => (
                  <span key={i} style={{
                    width: '9px', height: '9px', borderRadius: '50%',
                    backgroundColor: routeColors[seg.routeKey as RouteKey] ?? '#888',
                    border: '1px solid rgba(0,0,0,0.15)',
                  }} />
                ))}
              </div>
              <span style={{ flex: 1, fontSize: 'var(--v2-font-size-xs)', color: 'var(--v2-color-text-secondary)' }}>
                {translateUI('routeNumber', language, { number: (index + 1).toString() })}
                {route.transfers > 0 && (
                  <span style={{ marginLeft: 'var(--v2-space-2)' }}>
                    {translateUI('transfersCount', language, { count: route.transfers.toString() })}
                  </span>
                )}
              </span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: '2px', flexShrink: 0 }}>
                <span style={{ fontSize: 'var(--v2-font-size-xl)', fontWeight: 'var(--v2-font-weight-bold)', color: 'var(--v2-color-primary)', lineHeight: 1 }}>
                  {totalMin}
                </span>
                <span style={{ fontSize: 'var(--v2-font-size-sm)', color: 'var(--v2-color-text-secondary)' }}>
                  {translateUI('minutesSuffix', language)}
                </span>
              </span>
            </div>

            <div style={{ fontSize: 'var(--v2-font-size-sm)', color: 'var(--v2-color-text-secondary)', lineHeight: 'var(--v2-line-height-relaxed)' }}>
              {route.segments.map((seg, i) => {
                const key = seg.routeKey as RouteKey;
                const name = translateRoute(routeNames[key] ?? seg.routeKey, language);
                const color = routeColors[key] ?? '#888';
                const fromName = seg.stations[0]?.name ?? '';
                const toName = seg.stations[seg.stations.length - 1]?.name ?? '';
                const isLast = i === route.segments.length - 1;

                return (
                  <div key={i}>
                    {i === 0 && fromName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'var(--v2-font-weight-bold)', color: 'var(--v2-color-success)' }}>
                        <CircleDot size={12} />{translateStation(fromName, language)}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--v2-space-1)', paddingLeft: 'var(--v2-space-2)' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                      <span style={{ color, fontWeight: 'var(--v2-font-weight-medium)' }}>{name}</span>
                      <span>({Math.round(seg.time)}{translateUI('minutesSuffix', language)})</span>
                    </div>
                    {toName && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontWeight: 'var(--v2-font-weight-bold)',
                        color: isLast ? 'var(--v2-color-danger)' : 'var(--v2-color-text)',
                      }}>
                        {isLast ? <MapPin size={12} /> : <RefreshCw size={12} />}
                        {translateStation(toName, language)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RouteResultsV2;
