/**
 * 出発駅・到着駅・経由駅をURLで共有するための、駅名⇔URLパラメータ変換。
 *
 * URLには日本語駅名を直接書かず、英語表記をASCIIのslugにして使う。
 * 例: 渋谷 -> shibuya / 武蔵小杉 -> musashi-kosugi
 * これにより %E6%B8%8B%E8%B0%B7 のようなパーセントエンコードを避け、
 * 共有URLを見ただけで駅を推測できるようにする。
 *
 * 既に共有済みの旧URLを壊さないため、日本語駅名の値も読み取り時だけ後方互換で受け付ける。
 */
import { getAllStations } from './allStations';
import { stationTranslations } from './translation';
import type { Station } from '../data/yamanote';

export const DEPARTURE_PARAM = 'from';
export const ARRIVAL_PARAM = 'to';
export const WAYPOINTS_PARAM = 'via';

/** 経由駅の指定件数が多すぎるとURLが長くなるため上限を設ける */
export const MAX_URL_WAYPOINTS = 5;

/** 英語表記をURL向けのASCII slugへ変換する */
const toStationSlug = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** 英語表記が無い駅でも日本語をURLへ出さないための安定したASCIIフォールバック */
const stableStationFallback = (name: string): string => {
  let hash = 2166136261;
  for (const ch of name) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return `station-${(hash >>> 0).toString(36)}`;
};

const buildStationParamMaps = () => {
  const byName = new Map<string, string>();
  const byCode = new Map<string, Station>();
  for (const station of getAllStations()) {
    const translated = stationTranslations[station.name];
    const base = toStationSlug(translated ?? '') || stableStationFallback(station.name);
    let code = base;
    let suffix = 2;
    while (byCode.has(code)) {
      code = `${base}-${suffix}`;
      suffix += 1;
    }
    byName.set(station.name, code);
    byCode.set(code, station);
  }
  return { byName, byCode };
};

const { byName: STATION_CODE_BY_NAME, byCode: STATION_BY_CODE } = buildStationParamMaps();

/** 日本語の駅名を、共有URLに載せる英語slugへ変換する */
export const encodeStationParam = (name: string): string | null =>
  STATION_CODE_BY_NAME.get(name) ?? null;

/**
 * URLの値を駅へ戻す。
 * 新形式の英語slugを優先し、旧形式の日本語駅名も後方互換で受け付ける。
 */
export const decodeStationParam = (value: string | null | undefined): Station | null => {
  if (!value) return null;
  const byCode = STATION_BY_CODE.get(value.toLowerCase());
  if (byCode) return byCode;
  return getAllStations().find(s => s.name === value) ?? null;
};

/** 初回マウント時にURLから出発駅を読み取る */
export const getInitialDepartureFromUrl = (): Station | null => {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return decodeStationParam(params.get(DEPARTURE_PARAM));
  } catch {
    return null;
  }
};

/** 初回マウント時にURLから到着駅を読み取る */
export const getInitialArrivalFromUrl = (): Station | null => {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return decodeStationParam(params.get(ARRIVAL_PARAM));
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
      .map(code => decodeStationParam(code.trim()))
      .filter((s): s is Station => !!s)
      .slice(0, MAX_URL_WAYPOINTS);
  } catch {
    return [];
  }
};

/**
 * 出発駅・到着駅・経由駅をURLへ反映する（history.replaceState、履歴は増やさない）。
 * 新しく書くURLは必ず英語slug。未選択のものはパラメータ自体を消す。
 */
export const syncStationsToUrl = (
  departure: Station | null,
  arrival: Station | null,
  waypoints: readonly Station[]
): void => {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);

    const departureCode = departure ? encodeStationParam(departure.name) : null;
    if (departureCode) url.searchParams.set(DEPARTURE_PARAM, departureCode);
    else url.searchParams.delete(DEPARTURE_PARAM);

    const arrivalCode = arrival ? encodeStationParam(arrival.name) : null;
    if (arrivalCode) url.searchParams.set(ARRIVAL_PARAM, arrivalCode);
    else url.searchParams.delete(ARRIVAL_PARAM);

    const waypointCodes = waypoints
      .slice(0, MAX_URL_WAYPOINTS)
      .map(s => encodeStationParam(s.name))
      .filter((code): code is string => !!code);
    if (waypointCodes.length > 0) {
      url.searchParams.set(WAYPOINTS_PARAM, waypointCodes.join(','));
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
