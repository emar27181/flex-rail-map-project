import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { routeColors, routeNames } from '../data/routes';
import type { RouteKey } from '../data/routes';
import { DIAGRAM_ROUTE_KEYS } from '../components/DiagramMap';
import { translateRoute, translateUI } from '../utils/translation';
import type { Language } from '../utils/translation';
import { NEUTRAL } from '../constants/ui';

interface RouteLegendV2Props {
  visibleRoutes: Set<RouteKey>;
  onToggleRoute: (key: RouteKey) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  language: Language;
}

/**
 * v2版の路線表示切り替え(凡例)。
 * DiagramMapが実際に描画する路線集合(DIAGRAM_ROUTE_KEYS)と完全に一致させるため、
 * 独自リストを持たずDiagramMap.tsxからエクスポートされた定数をそのまま使う。
 */
const RouteLegendV2: React.FC<RouteLegendV2Props> = ({
  visibleRoutes, onToggleRoute, onShowAll, onHideAll, language,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const routes = useMemo(() => {
    const list = DIAGRAM_ROUTE_KEYS.map(key => ({
      key,
      name: translateRoute(routeNames[key] ?? key, language),
      color: routeColors[key] ?? '#888888',
    }));
    return [...list].sort((a, b) => a.name.localeCompare(b.name, language === 'japanese' ? 'ja' : 'en'));
  }, [language]);

  const filtered = useMemo(() => {
    if (!search) return routes;
    const term = search.toLowerCase();
    return routes.filter(r => r.name.toLowerCase().includes(term));
  }, [routes, search]);

  const visibleCount = DIAGRAM_ROUTE_KEYS.filter(k => visibleRoutes.has(k)).length;

  return (
    <div style={{
      backgroundColor: 'var(--v2-color-surface)',
      border: '1px solid var(--v2-color-border)',
      borderRadius: 'var(--v2-radius-lg)',
      boxShadow: 'var(--v2-shadow-sm)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setIsOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--v2-space-3) var(--v2-space-4)',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--v2-font-family)', color: 'var(--v2-color-text)',
        }}
      >
        <span style={{ fontSize: 'var(--v2-font-size-base)', fontWeight: 'var(--v2-font-weight-bold)' }}>
          {translateUI('displayedRoutes', language)}
          <span style={{ marginLeft: 'var(--v2-space-2)', fontSize: 'var(--v2-font-size-xs)', fontWeight: 'var(--v2-font-weight-regular)', color: 'var(--v2-color-text-secondary)' }}>
            {visibleCount} / {DIAGRAM_ROUTE_KEYS.length}
          </span>
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div style={{ padding: '0 var(--v2-space-4) var(--v2-space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--v2-space-2)', marginBottom: 'var(--v2-space-2)' }}>
            <button
              onClick={onShowAll}
              style={{
                flex: 1, padding: 'var(--v2-space-1) var(--v2-space-2)', fontSize: 'var(--v2-font-size-xs)',
                borderRadius: 'var(--v2-radius-sm)', border: 'none', cursor: 'pointer',
                backgroundColor: 'var(--v2-color-success)', color: NEUTRAL.white,
              }}
            >{translateUI('allShow', language)}</button>
            <button
              onClick={onHideAll}
              style={{
                flex: 1, padding: 'var(--v2-space-1) var(--v2-space-2)', fontSize: 'var(--v2-font-size-xs)',
                borderRadius: 'var(--v2-radius-sm)', border: 'none', cursor: 'pointer',
                backgroundColor: 'var(--v2-color-danger)', color: NEUTRAL.white,
              }}
            >{translateUI('allHide', language)}</button>
          </div>

          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={translateUI('searchRoutePlaceholder', language)}
            style={{
              width: '100%', boxSizing: 'border-box', marginBottom: 'var(--v2-space-2)',
              padding: 'var(--v2-space-1) var(--v2-space-2)', fontSize: 'var(--v2-font-size-sm)',
              border: '1px solid var(--v2-color-border)', borderRadius: 'var(--v2-radius-sm)',
              backgroundColor: 'var(--v2-color-bg-elevated)', color: 'var(--v2-color-text)',
            }}
          />

          <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {filtered.map(route => {
              const isVisible = visibleRoutes.has(route.key);
              return (
                <label
                  key={route.key}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--v2-space-2)',
                    padding: 'var(--v2-space-1) var(--v2-space-2)', borderRadius: 'var(--v2-radius-sm)',
                    cursor: 'pointer', opacity: isVisible ? 1 : 0.5,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => onToggleRoute(route.key)}
                    style={{ cursor: 'pointer', accentColor: 'var(--v2-color-primary)' }}
                  />
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: route.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--v2-font-size-sm)', color: 'var(--v2-color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {route.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteLegendV2;
