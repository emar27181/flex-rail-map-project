import React, { useState } from 'react';
import { Layers3, Settings, TrainFront, X } from 'lucide-react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import IconButton from '../atoms/IconButton';
import { L } from '../../legend/legendStyles';

export type MapBottomNavKey = 'routes' | 'display' | 'settings';

export interface MapBottomNavSection {
  key: MapBottomNavKey;
  content: React.ReactNode;
  badge?: number;
}

interface MapBottomNavigationProps {
  sections: MapBottomNavSection[];
  theme: 'light' | 'dark';
}

const navMeta: Record<MapBottomNavKey, { label: string; icon: React.ReactNode }> = {
  routes: { label: '経路', icon: <TrainFront size={21} /> },
  display: { label: '表示', icon: <Layers3 size={21} /> },
  settings: { label: '設定', icon: <Settings size={21} /> },
};

const MapBottomNavigation: React.FC<MapBottomNavigationProps> = ({ sections, theme }) => {
  const colors = getThemeColors(theme);
  const [openKey, setOpenKey] = useState<MapBottomNavKey | null>(null);
  const sectionMap = new Map(sections.map(section => [section.key, section]));
  const active = openKey ? sectionMap.get(openKey) : undefined;

  return (
    <>
      {active && (
        <>
          <div onClick={() => setOpenKey(null)} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,.10)' }} />
          <section style={{
            position: 'fixed', left: 10, right: 10,
            bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
            maxHeight: '68dvh', zIndex: 10002,
            background: colors.glassOpen, border: `1px solid ${colors.border}`,
            borderRadius: 18, boxShadow: `0 12px 40px ${colors.shadow}`,
            backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', overflow: 'hidden',
          }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${L.sp.md} ${L.sp.xl}`, borderBottom: `1px solid ${colors.border}` }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: L.sp.sm, color: colors.text }}>
                {navMeta[active.key].icon}{navMeta[active.key].label}
              </strong>
              <IconButton theme={theme} size="sm" label="閉じる" icon={<X size={18} />} onClick={() => setOpenKey(null)} />
            </header>
            <div style={{ overflowY: 'auto', maxHeight: 'calc(68dvh - 52px)', padding: L.sp.xl }}>{active.content}</div>
          </section>
        </>
      )}

      <nav aria-label="メイン操作" style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 10001,
        minHeight: 60, paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        borderTop: `1px solid ${colors.border}`, background: colors.glassOpen,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: `0 -3px 14px ${colors.shadow}`,
      }}>
        {(Object.keys(navMeta) as MapBottomNavKey[]).map(key => {
          const item = navMeta[key];
          const section = sectionMap.get(key);
          const selected = openKey === key;
          return (
            <button key={key} type="button" disabled={!section} onClick={() => section && setOpenKey(selected ? null : key)} style={{
              position: 'relative', border: 0, background: selected ? colors.surface : 'transparent',
              color: selected ? colors.primary : colors.textSecondary, opacity: section ? 1 : 0.42,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              font: 'inherit', fontSize: 10, fontWeight: selected ? 700 : 600,
            }}>
              {item.icon}<span>{item.label}</span>
              {!!section?.badge && <span style={{ position: 'absolute', top: 4, left: 'calc(50% + 8px)', minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999, background: colors.primary, color: colors.onPrimary, fontSize: 9, lineHeight: '16px' }}>{section.badge}</span>}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default MapBottomNavigation;
