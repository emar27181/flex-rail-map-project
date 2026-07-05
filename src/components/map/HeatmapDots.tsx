/**
 * ヒートマップ用駅ドット層
 *
 * react-leaflet の CircleMarker を使い、駅ごとのパラメータ値を色で表現する。
 * DivIcon のような in-place 更新の問題がなく、fillColor が React prop として
 * 完全にリアクティブに動作する。
 *
 * 既存の駅ラベル・駅アイコンとは独立した描画レイヤーとして機能する。
 */
import { CircleMarker, Tooltip } from 'react-leaflet';
import {
  stationStatsData,
  getParamRange,
  heatValueToColor,
  HEATMAP_NO_DATA_COLOR,
  STAT_PARAMS,
} from '../../data/stationStats';
import type { StationStats } from '../../data/stationStats';

type Props = {
  paramKey: keyof StationStats;
  radius?: number;
};

export default function HeatmapDots({ paramKey, radius = 10 }: Props) {
  const meta = STAT_PARAMS.find(p => p.key === paramKey);
  const { min, max } = getParamRange(paramKey);

  return (
    <>
      {Object.values(stationStatsData).map(stats => {
        const val = stats[paramKey] as number | undefined;
        let color: string;
        let normalized: number | null = null;

        if (val !== undefined && max > min) {
          normalized = (val - min) / (max - min);
          color = heatValueToColor(normalized);
        } else {
          color = HEATMAP_NO_DATA_COLOR;
        }

        return (
          <CircleMarker
            key={`heat-${stats.stationName}-${String(paramKey)}`}
            center={[stats.lat, stats.lng]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.85,
              color: '#fff',
              weight: 1.5,
            }}
          >
            <Tooltip direction="top" offset={[0, -radius]} opacity={0.95}>
              <span style={{ fontWeight: 'bold' }}>{stats.stationName}</span>
              <br />
              {meta?.label}: {val !== undefined ? `${val} ${meta?.unit ?? ''}` : 'データなし'}
              {normalized !== null && (
                <><br />スコア: {Math.round(normalized * 100)} / 100</>
              )}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}
