import { useLayoutEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { Info } from 'lucide-react';
import { FS } from '../../constants/ui';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI, type Language } from '../../utils/translation';
import { L } from '../legend/legendStyles';
import { CONTROL_SIZE, FLOATING_PANEL } from '../ui/atoms/controlSize';
import { floatingSurfaceStyle } from '../ui/atoms/floatingSurface';
import MapDistanceScale from './MapDistanceScale';

export type MapDataNotice = 'mapEstimatedTimes' | 'mapReferenceStatistics' | 'mapLastTrainDemo' | 'mapLastTrainNoTrips' | 'mapTrainSimulation';

export default function MapFooter({ map, notices, lastTrainLegend, attribution, theme, language, bottom, onHeightChange }: {
  map: LeafletMap | null;
  notices: MapDataNotice[];
  lastTrainLegend: boolean;
  attribution: boolean;
  theme: 'light' | 'dark';
  language: Language;
  bottom: string;
  onHeightChange: (height: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = !!map || notices.length > 0 || lastTrainLegend || attribution;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) { onHeightChange(0); return; }
    const measure = () => onHeightChange(Math.ceil(el.getBoundingClientRect().height));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown, onHeightChange]);

  if (!shown) return null;
  const colors = getThemeColors(theme);
  const surface = {
    ...floatingSurfaceStyle(theme, 'open'),
    padding: `${L.sp.xxs} ${L.sp.sm}`,
    fontSize: FS.caption,
    color: colors.text,
    lineHeight: 1.4,
  };

  return (
    <div ref={ref} data-map-footer style={{
      position: 'absolute', bottom,
      left: `max(${FLOATING_PANEL.inset}, env(safe-area-inset-left, 0px))`,
      right: `max(${FLOATING_PANEL.inset}, env(safe-area-inset-right, 0px))`,
      zIndex: 1003, display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      gap: L.sp.xs, pointerEvents: 'none',
    }}>
      {(notices.length > 0 || lastTrainLegend) && (
        <div role="status" data-map-data-notice style={{ ...surface, display: 'flex', alignItems: 'flex-start', gap: L.sp.xs }}>
          <Info size={CONTROL_SIZE.sm.iconSize} aria-hidden style={{ flexShrink: 0 }} />
          <span style={{ overflowWrap: 'anywhere' }}>
            {notices.map(key => <span key={key} style={{ display: 'block' }}>{translateUI(key, language)}</span>)}
            {lastTrainLegend && <span style={{ display: 'block' }}>{translateUI('mapLastTrainLineLegend', language)}</span>}
          </span>
        </div>
      )}
      {(map || attribution) && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: L.sp.xs, width: '100%', flexWrap: 'wrap' }}>
          {map && <MapDistanceScale map={map} language={language} style={surface} />}
          {attribution && (
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" style={{
              ...surface, display: 'inline-flex', alignItems: 'center', minHeight: CONTROL_SIZE.sm.minHeight,
              marginInlineStart: 'auto', pointerEvents: 'auto', boxSizing: 'border-box',
            }}>© OpenStreetMap contributors</a>
          )}
        </div>
      )}
    </div>
  );
}
