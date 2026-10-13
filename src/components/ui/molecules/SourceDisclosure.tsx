/** Compact, accessible attribution disclosure for map overlays (molecule). */
import React from 'react';
import { Info } from 'lucide-react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import { floatingSurfaceStyle } from '../atoms/floatingSurface';

export interface SourceDisclosureProps {
  theme: 'light' | 'dark';
  label: string;
  children: React.ReactNode;
}

export default function SourceDisclosure({ theme, label, children }: SourceDisclosureProps) {
  const colors = getThemeColors(theme);
  return (
    <details data-testid="map-source-disclosure" style={{ position: 'relative', color: colors.textSecondary, fontSize: FS.caption }}>
      <summary aria-label={label} title={label} style={{
        display: 'inline-flex', alignItems: 'center', gap: L.sp.xxs, cursor: 'pointer',
        listStyle: 'none', color: colors.textSecondary,
      }}>
        <Info size={14} aria-hidden="true" />
        <span>{label}</span>
      </summary>
      <div style={{
        ...floatingSurfaceStyle(theme, 'open'),
        marginTop: L.sp.xs, padding: L.sp.sm, fontSize: FS.caption,
        overflowWrap: 'anywhere', maxWidth: '100%',
      }}>
        {children}
      </div>
    </details>
  );
}
