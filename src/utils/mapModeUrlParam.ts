/**
 * 地図を「モード」を入れた状態で開くURLパラメータ（記事の埋め込み・共有リンク用）。
 *
 *   ?mode=last-train&to=shibuya            … 終電モード（試作。到着駅 to が必要）
 *   ?mode=meeting&from=shinjuku&with=tokyo,yokohama … 集合駅を探す（from + with が出発駅）
 *
 * 埋め込みの画面ではボタンを押せないので、見せたいモードはURLで指定する（articles の maps の `mode` / `withStations`）。
 * パラメータ名はここだけに書く。URL を作る側は mapDeepLink.ts、読む側は RailwayMap。
 */
import type { Station } from '../data/yamanote';
import { decodeStationParam } from './stationUrlParams';

export const MODE_PARAM = 'mode';
export const WITH_PARAM = 'with';

export type MapMode = 'last-train' | 'meeting';
export const MAP_MODES: readonly MapMode[] = ['last-train', 'meeting'];

/** 集合駅モードで、URLから読む追加の出発駅の上限（出発駅欄とあわせて 1 + この数） */
export const MAX_URL_EXTRA_DEPARTURES = 5;

export function parseMapMode(value: string | null | undefined): MapMode | null {
  return (MAP_MODES as readonly string[]).includes(value ?? '') ? (value as MapMode) : null;
}

export function getInitialMapModeFromUrl(): MapMode | null {
  if (typeof window === 'undefined') return null;
  try {
    return parseMapMode(new URLSearchParams(window.location.search).get(MODE_PARAM));
  } catch {
    return null;
  }
}

/** `with=` の追加の出発駅（英語slug。旧形式の日本語名も読む） */
export function parseExtraDepartures(value: string | null | undefined): Station[] {
  if (!value) return [];
  const seen = new Set<string>();
  const out: Station[] = [];
  for (const code of value.split(',')) {
    const st = decodeStationParam(code.trim());
    if (st && !seen.has(st.name)) { seen.add(st.name); out.push(st); }
  }
  return out.slice(0, MAX_URL_EXTRA_DEPARTURES);
}

export function getInitialExtraDeparturesFromUrl(): Station[] {
  if (typeof window === 'undefined') return [];
  try {
    return parseExtraDepartures(new URLSearchParams(window.location.search).get(WITH_PARAM));
  } catch {
    return [];
  }
}
