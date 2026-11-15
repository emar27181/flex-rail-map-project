/**
 * 乗車ログ（試作）: 乗った路線・降りた駅を記録して、3段階で見せる計算。UI・地図には依存しない。
 *
 * 駅の段階（RideLevel）:
 *   0 = 全く通っていない
 *   1 = 通ったけど降りていない（乗った路線の途中駅）
 *   2 = 通って降りた（乗った駅・乗り換えた駅・降りた駅。乗り降りした駅）
 * 路線は、乗った区間（駅の並び）だけが「乗った」。路線のほかの区間は、乗っていない。
 *
 * 記録（RideLogEntry）の種類:
 *   'ride'  = 経路検索の結果の区間（路線ごとの、通った駅の並び）。最初の駅と最後の駅が乗り降りした駅（段階2）、途中は通っただけ（段階1）
 *   'line'  = 地図の灰色の線をタップして「この路線に乗った」とした記録。路線の全駅が通っただけ（段階1）
 *   'alight'= 駅のツールチップで「降りた駅に記録」した駅（段階2）
 * 同じ駅が別の記録で乗り降りされていれば、そちらを優先して段階2になる。
 * 地図の見せ方: 乗っていない路線は灰色、乗った路線は色つきで常に出し、駅名は乗った路線の駅だけ。降りていない駅は半透明。
 */

export type RideLevel = 0 | 1 | 2;

export type RideLogEntryKind = 'ride' | 'line' | 'alight';

/** 記録1件 */
export interface RideLogEntry {
  id: string;
  /** 省略 = 'ride' */
  kind?: RideLogEntryKind;
  routeKey: string;
  /** 通った駅の並び（'ride' は乗った駅から降りた駅まで・'line' は路線の全駅で2駅以上、'alight' は降りた駅1つ） */
  stations: string[];
}

export interface RideLogState {
  /** 駅 → 段階（記録に出てくる駅だけ。無い駅は段階0） */
  stationLevel: Map<string, RideLevel>;
  /** 駅の段階を決めた路線（色付きで描く路線。乗り降りした記録を優先） */
  stationRoute: Map<string, string>;
  /** 乗った路線 */
  riddenRoutes: Set<string>;
  /** 乗った区間（路線 → 区間ごとの駅の並び。地図に色付きで描く） */
  paths: Array<{ id: string; routeKey: string; stations: string[] }>;
}

/** 記録として使える形か（路線と、2駅以上の並び。同じ駅が続かない） */
export function isValidEntry(entry: RideLogEntry): boolean {
  if (!entry.routeKey || !entry.stations.every(s => typeof s === 'string' && s.length > 0)) return false;
  return entry.kind === 'alight' ? entry.stations.length === 1 : entry.stations.length >= 2;
}

/** 経路検索の結果（区間の並び）から、記録を作る。徒歩の乗り換えと、2駅に満たない区間は入れない */
export function entriesFromRoute(
  segments: ReadonlyArray<{ routeKey?: string; isWalkingTransfer?: boolean; stations: ReadonlyArray<{ name: string }> }>,
  newId: () => string,
): RideLogEntry[] {
  const entries: RideLogEntry[] = [];
  for (const seg of segments) {
    if (!seg.routeKey || seg.routeKey === 'walking' || seg.isWalkingTransfer) continue;
    const stations = seg.stations.map(s => s.name);
    const entry = { id: newId(), routeKey: seg.routeKey, stations };
    if (isValidEntry(entry)) entries.push(entry);
  }
  return entries;
}

export function deriveRideLog(entries: readonly RideLogEntry[]): RideLogState {
  const stationLevel = new Map<string, RideLevel>();
  const stationRoute = new Map<string, string>();
  const riddenRoutes = new Set<string>();
  const paths: RideLogState['paths'] = [];
  const raise = (name: string, level: RideLevel, routeKey: string) => {
    const current = stationLevel.get(name) ?? 0;
    if (level > current) {
      stationLevel.set(name, level);
      stationRoute.set(name, routeKey);
    } else if (level === current && !stationRoute.has(name)) {
      stationRoute.set(name, routeKey);
    }
  };
  for (const entry of entries) {
    if (!isValidEntry(entry)) continue;
    const kind = entry.kind ?? 'ride';
    if (kind === 'alight') {
      raise(entry.stations[0], 2, entry.routeKey);
      continue;
    }
    riddenRoutes.add(entry.routeKey);
    paths.push({ id: entry.id, routeKey: entry.routeKey, stations: entry.stations });
    const last = entry.stations.length - 1;
    entry.stations.forEach((name, i) => raise(name, kind === 'ride' && (i === 0 || i === last) ? 2 : 1, entry.routeKey));
  }
  return { stationLevel, stationRoute, riddenRoutes, paths };
}

export function rideLevelOf(state: RideLogState, stationName: string): RideLevel {
  return state.stationLevel.get(stationName) ?? 0;
}

/** 駅を「降りた駅」とする記録（ツールチップのボタン）が既にあるか */
export function hasAlightEntry(entries: readonly RideLogEntry[], stationName: string): boolean {
  return entries.some(e => e.kind === 'alight' && e.stations[0] === stationName);
}

// ── 保存（ブラウザの localStorage。端末の外へは出さない）──

export const RIDE_LOG_STORAGE_KEY = 'flex-railway-map:ride-log:v1';

export function serializeRideLog(entries: readonly RideLogEntry[]): string {
  return JSON.stringify({ version: 1, entries: entries.filter(isValidEntry) });
}

/** 記録の配列を、使える形のものだけにする（壊れた要素・知らない種類は捨てる）。保存データと設定ファイルの取り込みで共通 */
export function sanitizeRideLog(entries: unknown): RideLogEntry[] {
  if (!Array.isArray(entries)) return [];
  return (entries as RideLogEntry[]).filter(e =>
    e && typeof e.id === 'string' && typeof e.routeKey === 'string' && Array.isArray(e.stations)
    && (e.kind === undefined || e.kind === 'ride' || e.kind === 'line' || e.kind === 'alight') && isValidEntry(e));
}

/** 壊れた保存データ・古い形式は空として扱う（地図を壊さない） */
export function parseRideLog(raw: string | null): RideLogEntry[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as { version?: number; entries?: unknown };
    if (data.version !== 1) return [];
    return sanitizeRideLog(data.entries);
  } catch {
    return [];
  }
}
