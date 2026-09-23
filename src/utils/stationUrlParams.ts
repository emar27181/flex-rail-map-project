/**
 * 出発駅・到着駅・経由駅をURLで共有できるようにするための、駅名⇔URLパラメータの変換。
 *
 * 路線（`routeUrlCodes.ts`）と違い、駅は名前自体がもともと短く読みやすいため
 * （例: "渋谷"）、路線のような短縮コードは作らず駅名をそのままURLパラメータに
 * 使う。ブラウザのアドレスバーはUTF-8のパーセントエンコードを自動で元の文字に
 * 戻して表示するため、実際に見えるURLは人間にも分かりやすいままになる。
 *
 * パラメータ名:
 * - `from`: 出発駅
 * - `to`: 到着駅
 * - `via`: 経由駅（複数はカンマ区切り、経由順を保持）
 *
 * 駅名の一意性は`getAllStations()`と同じ規則（同名駅は最初に登録された
 * ものを正とする）に揃えてある。存在しない駅名が指定された場合は
 * 黙って無視する（エラーにはしない）。
 */
import { getAllStations } from './allStations';
import type { Station } from '../data/yamanote';

export const DEPARTURE_PARAM = 'from';
export const ARRIVAL_PARAM = 'to';
export const WAYPOINTS_PARAM = 'via';

/** 経由駅の指定件数が多すぎるとURLが長くなるため上限を設ける */
export const MAX_URL_WAYPOINTS = 5;

const findStationByName = (name: string): Station | null => {
  if (!name) return null;
  return getAllStations().find(s => s.name === name) ?? null;
};

/** 初回マウント時にURLから出発駅を読み取る */
export const getInitialDepartureFromUrl = (): Station | null => {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return findStationByName(params.get(DEPARTURE_PARAM) ?? '');
  } catch {
    return null;
  }
};

/** 初回マウント時にURLから到着駅を読み取る */
export const getInitialArrivalFromUrl = (): Station | null => {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return findStationByName(params.get(ARRIVAL_PARAM) ?? '');
  } catch {
    return null;
  }
};

/** 初回マウント時にURLから経由駅を読み取る */
export const getInitialWaypointsFromUrl = (): Station[] => {
  if (typeof window === 'undefined') return [];
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(WAYPOINTS_PARAM);
    if (!raw) return [];
    return raw
      .split(',')
      .map(n => findStationByName(n.trim()))
      .filter((s): s is Station => !!s)
      .slice(0, MAX_URL_WAYPOINTS);
  } catch {
    return [];
  }
};

/**
 * 出発駅・到着駅・経由駅をURLへ反映する（`history.replaceState`、履歴は増やさない）。
 * 未選択のものはパラメータ自体を消す。
 */
export const syncStationsToUrl = (
  departure: Station | null,
  arrival: Station | null,
  waypoints: readonly Station[]
): void => {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);

    if (departure) url.searchParams.set(DEPARTURE_PARAM, departure.name);
    else url.searchParams.delete(DEPARTURE_PARAM);

    if (arrival) url.searchParams.set(ARRIVAL_PARAM, arrival.name);
    else url.searchParams.delete(ARRIVAL_PARAM);

    if (waypoints.length > 0) {
      url.searchParams.set(WAYPOINTS_PARAM, waypoints.map(s => s.name).join(','));
    } else {
      url.searchParams.delete(WAYPOINTS_PARAM);
    }

    if (url.search !== window.location.search) {
      window.history.replaceState(window.history.state, '', url);
    }
  } catch {
    // URL操作に失敗しても表示は続ける
  }
};
