import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { stationStatsData, getParamRange, STAT_PARAMS } from '../../data/stationStats';
import type { StationStats } from '../../data/stationStats';

type Props = {
  paramKey: keyof StationStats;
  opacity: number;
};

export default function HeatmapLayer({ paramKey, opacity }: Props) {
  const map = useMap();
  const layerRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const L = await import('leaflet');
      await import('leaflet.heat');
      if (!active) return;

      const meta = STAT_PARAMS.find(p => p.key === paramKey);
      const { min, max } = getParamRange(paramKey);

      const points: [number, number, number][] = [];
      for (const stats of Object.values(stationStatsData)) {
        const val = stats[paramKey] as number | undefined;
        if (val === undefined) continue;
        const normalized = max > min ? (val - min) / (max - min) : 0.5;
        // higherIsBetter=false（家賃・犯罪等）は高い値ほど赤くなるよう反転しない
        // ヒートマップは「この値が高い = 赤」なので、higherIsBetter=false なら反転して「危険エリア」として表示
        const intensity = meta?.higherIsBetter === false ? 1 - normalized : normalized;
        points.push([stats.lat, stats.lng, intensity]);
      }

      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      layerRef.current = (L as any).heatLayer(points, {
        radius: 40,
        blur: 30,
        maxZoom: 17,
        max: 1.0,
        minOpacity: 0.05 + opacity * 0.1,
        gradient: {
          0.0: '#313695',
          0.25: '#74add1',
          0.5: '#fee090',
          0.75: '#f46d43',
          1.0: '#a50026',
        },
      });
      layerRef.current.addTo(map);
    })();

    return () => {
      active = false;
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, paramKey, opacity]);

  return null;
}
