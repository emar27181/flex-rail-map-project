/**
 * ヒートマップの指標をURLで共有する（`?metric=restaurantCount`）。
 *
 * 駅周辺データのページ（/data/*）から「この指標のヒートマップで地図を開く」ために使う。
 * 値は駅統計のキー（stationStats.ts の STAT_PARAMS の key）をそのまま使う。
 * 推定値の指標（dataQuality: 'estimated'）は既定で非表示なので、URLからは開かない
 * （知らないキー・推定値のキーは黙って無視する）。
 */
import { STAT_PARAMS, type StationStats } from '../data/stationStats';

export const HEATMAP_METRIC_PARAM = 'metric';

/** URLで指定してよい指標（実データのみ） */
export function isUrlHeatmapMetric(key: string | null | undefined): key is keyof StationStats {
  return !!key && STAT_PARAMS.some(p => p.key === key && p.dataQuality === 'real');
}

/** 初回マウント時にURLからヒートマップの指標を読み取る */
export const getInitialHeatmapMetricFromUrl = (): keyof StationStats | null => {
  if (typeof window === 'undefined') return null;
  try {
    const key = new URLSearchParams(window.location.search).get(HEATMAP_METRIC_PARAM);
    return isUrlHeatmapMetric(key) ? key : null;
  } catch {
    return null;
  }
};

/** ヒートマップの状態をURLへ反映する（表示中の指標、非表示なら消す） */
export const syncHeatmapMetricToUrl = (enabled: boolean, key: keyof StationStats): void => {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (enabled && isUrlHeatmapMetric(key)) url.searchParams.set(HEATMAP_METRIC_PARAM, key);
    else url.searchParams.delete(HEATMAP_METRIC_PARAM);
    if (url.search !== window.location.search) {
      window.history.replaceState(window.history.state, '', url);
    }
  } catch {
    // URL操作に失敗しても表示は続ける
  }
};
