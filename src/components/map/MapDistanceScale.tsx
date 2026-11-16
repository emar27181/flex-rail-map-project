import { useEffect, useState, type CSSProperties } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import type { Language } from '../../utils/translation';
import { toArticleLanguage } from '../../utils/languagePersistence';
import ScaleBar from '../ui/atoms/ScaleBar';

const SCALE_MAX_WIDTH = 96;

export default function MapDistanceScale({ map, language, style }: { map: LeafletMap; language: Language; style?: CSSProperties }) {
  const [scale, setScale] = useState<{ meters: number; widthPx: number } | null>(null);
  useEffect(() => {
    function update() {
      const { x, y } = map.getSize();
      const width = Math.min(x, SCALE_MAX_WIDTH);
      const maxMeters = map.distance(
        map.containerPointToLatLng([x / 2 - width / 2, y / 2]),
        map.containerPointToLatLng([x / 2 + width / 2, y / 2]),
      );
      if (!(maxMeters > 0) || !Number.isFinite(maxMeters)) { setScale(null); return; }
      const power = 10 ** Math.floor(Math.log10(maxMeters));
      const meters = (maxMeters >= 5 * power ? 5 : maxMeters >= 2 * power ? 2 : 1) * power;
      setScale({ meters, widthPx: width * meters / maxMeters });
    }
    map.whenReady(update);
    map.on('moveend zoomend resize rotate', update);
    return () => { map.off('load moveend zoomend resize rotate', update); };
  }, [map]);

  if (!scale) return null;
  const inKm = scale.meters >= 1000;
  const value = new Intl.NumberFormat(toArticleLanguage(language), { maximumFractionDigits: 2 })
    .format(inKm ? scale.meters / 1000 : scale.meters);
  return <ScaleBar style={style} label={`${value} ${inKm ? 'km' : 'm'}`} widthPx={scale.widthPx} />;
}
