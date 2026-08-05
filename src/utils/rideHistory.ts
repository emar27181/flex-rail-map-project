/**
 * 乗車履歴・実績のパーソナライズ機能（プレースホルダ）
 *
 * 「通った路線」「降りた駅」などをユーザーごとに記録し、将来的に
 * 実績・統計として見せる機能のための型定義とストレージ層のみを用意する。
 * まだどの画面からも呼び出しておらず、機能としては未接続。
 *
 * 実装時の想定:
 * - `RailwayMap.tsx` の `visitHistoryRef`（`StationVisit[]`、trainDetector.ts）は
 *   セッション内メモリのみで、ページを再読み込みすると消える。
 *   路線検出で `StationVisit` が確定したタイミングで `recordVisit()` を呼べば
 *   自動的に永続化できる設計にしてある。
 * - Cookie同意（CookieBanner.tsx）で analytics が無効な場合は記録しない、
 *   といった同意との連携も未実装。呼び出し側で判断すること。
 * - UIパネルは無し。表示する場合は `getStats()` の返り値を使う。
 */

import type { RouteKey } from '../data/routes';

const STORAGE_KEY = 'rideHistory';

/** 一度の乗車区間の記録 */
export interface RideLogEntry {
  id: string;
  routeKey: RouteKey;
  routeName: string;
  /** 乗車駅 */
  boardingStation: string;
  /** 降車駅。区間が確定する前（乗車中）は null */
  alightingStation: string | null;
  /** ISO 8601 */
  boardedAt: string;
  /** ISO 8601。降車が確定していない場合は null */
  alightedAt: string | null;
}

/** 駅ごとの訪問実績 */
export interface StationVisitStats {
  stationName: string;
  visitCount: number;
  /** ISO 8601 */
  firstVisitedAt: string;
  /** ISO 8601 */
  lastVisitedAt: string;
}

export interface RideHistoryStats {
  totalRides: number;
  /** 利用した路線の一意な数 */
  uniqueRoutesUsed: number;
  /** 訪問した駅の一意な数 */
  uniqueStationsVisited: number;
  stationVisits: StationVisitStats[];
}

interface RideHistoryData {
  entries: RideLogEntry[];
  stationVisits: Record<string, StationVisitStats>;
}

function loadRaw(): RideHistoryData {
  if (typeof localStorage === 'undefined') {
    return { entries: [], stationVisits: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [], stationVisits: {} };
    const parsed = JSON.parse(raw) as RideHistoryData;
    return {
      entries: parsed.entries ?? [],
      stationVisits: parsed.stationVisits ?? {},
    };
  } catch {
    // 壊れたデータは無視して空から始める
    return { entries: [], stationVisits: {} };
  }
}

function saveRaw(data: RideHistoryData): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** 新しい乗車区間を記録する（乗車開始時に呼ぶ） */
export function recordBoarding(params: {
  routeKey: RouteKey;
  routeName: string;
  boardingStation: string;
  boardedAt?: Date;
}): RideLogEntry {
  const data = loadRaw();
  const entry: RideLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    routeKey: params.routeKey,
    routeName: params.routeName,
    boardingStation: params.boardingStation,
    alightingStation: null,
    boardedAt: (params.boardedAt ?? new Date()).toISOString(),
    alightedAt: null,
  };
  data.entries.push(entry);
  touchStationVisit(data, params.boardingStation);
  saveRaw(data);
  return entry;
}

/** 直近の乗車区間の降車駅を確定する（降車時に呼ぶ） */
export function recordAlighting(entryId: string, alightingStation: string, alightedAt: Date = new Date()): void {
  const data = loadRaw();
  const entry = data.entries.find(e => e.id === entryId);
  if (!entry) return;
  entry.alightingStation = alightingStation;
  entry.alightedAt = alightedAt.toISOString();
  touchStationVisit(data, alightingStation);
  saveRaw(data);
}

function touchStationVisit(data: RideHistoryData, stationName: string): void {
  const now = new Date().toISOString();
  const existing = data.stationVisits[stationName];
  if (existing) {
    existing.visitCount += 1;
    existing.lastVisitedAt = now;
  } else {
    data.stationVisits[stationName] = {
      stationName,
      visitCount: 1,
      firstVisitedAt: now,
      lastVisitedAt: now,
    };
  }
}

/** 全乗車履歴を取得する */
export function getEntries(): RideLogEntry[] {
  return loadRaw().entries;
}

/** 集計済みの統計を取得する */
export function getStats(): RideHistoryStats {
  const data = loadRaw();
  const uniqueRoutes = new Set(data.entries.map(e => e.routeKey));
  return {
    totalRides: data.entries.length,
    uniqueRoutesUsed: uniqueRoutes.size,
    uniqueStationsVisited: Object.keys(data.stationVisits).length,
    stationVisits: Object.values(data.stationVisits).sort((a, b) => b.visitCount - a.visitCount),
  };
}

/** 記録を全て消去する（ユーザーからの削除要求に対応するため用意） */
export function clearHistory(): void {
  saveRaw({ entries: [], stationVisits: {} });
}
