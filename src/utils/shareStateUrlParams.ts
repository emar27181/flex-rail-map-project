/**
 * 画面の「見せ方」の状態を URL で共有する（出発駅・到着駅・経由駅は stationUrlParams.ts）。
 *
 *   ?time=0830        … 基準の時刻（出発時刻。4桁の HHMM。「:」を省いて短くする。読むときは 08:30 も受け付ける）
 *   &basis=arr        … 基準の時刻が「到着時刻」のとき（出発のときは書かない）
 *   &times=0|1        … 所要時間（駅と駅の間の数字）の表示。出発駅があるときは既定でON なので、OFF のときだけ 0 を書く。
 *                       出発駅が無いときは既定でOFF なので、ON のときだけ 1 を書く
 *   &mode=meeting|last-train … 集合駅を探す・終電モード（mapModeUrlParam.ts）。集合駅は &with=（追加の出発駅）と &bal=
 *   &bal=2            … 3人以上の集合駅の決め方（0〜4。既定の 0 は書かない）
 *
 * 方針: 既定の値は書かない（URL を短く保つ）。名前は短い語で、読んだだけで意味が分かるものにする。
 * 開いたときに1回読み、変わるたびに履歴を増やさず書き戻す（history.replaceState）。
 * 乗車ログは端末の中のデータなので URL には載せない（設定ファイルの書き出し・読み込みで移す）。
 */
import { MEETING_BALANCE_LEVELS } from './meetingPoint';

export const TIME_PARAM = 'time';
export const BASIS_PARAM = 'basis';
export const TIMES_PARAM = 'times';
export const BALANCE_PARAM = 'bal';
export const MODE_PARAM_NAME = 'mode';
export const WITH_PARAM_NAME = 'with';

export type TimeBasis = 'departure' | 'arrival';

/** "0830" / "08:30" / "830" → "08:30"。範囲外・不正は null */
export function parseTimeParam(value: string | null | undefined): string | null {
  if (!value) return null;
  const m = /^(\d{1,2}):?(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

/** "08:30" → "0830"。書式が違えば null */
export function formatTimeParam(time: string): string | null {
  const parsed = parseTimeParam(time);
  return parsed ? parsed.replace(':', '') : null;
}

export function parseBasisParam(value: string | null | undefined): TimeBasis | null {
  return value === 'arr' ? 'arrival' : null;
}

export function parseBalanceParam(value: string | null | undefined): number | null {
  if (value == null || !/^\d$/.test(value)) return null;
  const n = Number(value);
  return n < MEETING_BALANCE_LEVELS ? n : null;
}

/** 所要時間の表示: '1' → true / '0' → false / それ以外 → null（既定に任せる） */
export function parseTimesParam(value: string | null | undefined): boolean | null {
  return value === '1' ? true : value === '0' ? false : null;
}

export interface InitialShareState {
  time: string | null;
  basis: TimeBasis | null;
  balance: number | null;
  times: boolean | null;
}

export function readShareState(search: string): InitialShareState {
  const p = new URLSearchParams(search);
  return {
    time: parseTimeParam(p.get(TIME_PARAM)),
    basis: parseBasisParam(p.get(BASIS_PARAM)),
    balance: parseBalanceParam(p.get(BALANCE_PARAM)),
    times: parseTimesParam(p.get(TIMES_PARAM)),
  };
}

export function getInitialShareStateFromUrl(): InitialShareState {
  if (typeof window === 'undefined') return { time: null, basis: null, balance: null, times: null };
  try {
    return readShareState(window.location.search);
  } catch {
    return { time: null, basis: null, balance: null, times: null };
  }
}

export interface ShareState {
  /** 利用者が決めた基準の時刻（まだ触っていなければ null。既定は「いま」なので書かない） */
  time: string | null;
  basis: TimeBasis;
  /** 所要時間（駅と駅の間の数字）を表示しているか */
  showTravelTimes: boolean;
  /** 出発駅があるか（所要時間の既定がONになる） */
  hasDeparture: boolean;
  /** 開いているモード（集合駅・終電）。無ければ null */
  mode: 'meeting' | 'last-train' | null;
  /** 集合駅の追加の出発駅（URL用の英語slug。mode が meeting のときだけ） */
  withCodes: string[];
  /** 集合駅の決め方（3人以上のとき） */
  balance: number;
}

/**
 * 状態を URLSearchParams に書く（既定の値は消す）。stationUrlParams.ts が書く from / to / via には触らない。
 * 純粋関数（params を書き換えて返す）。history への反映は syncShareStateToUrl。
 */
export function applyShareState(params: URLSearchParams, state: ShareState): URLSearchParams {
  const set = (key: string, value: string | null) => { if (value) params.set(key, value); else params.delete(key); };
  set(TIME_PARAM, state.time ? formatTimeParam(state.time) : null);
  set(BASIS_PARAM, state.basis === 'arrival' ? 'arr' : null);
  const defaultTimes = state.hasDeparture;
  set(TIMES_PARAM, state.showTravelTimes === defaultTimes ? null : state.showTravelTimes ? '1' : '0');
  set(MODE_PARAM_NAME, state.mode);
  set(WITH_PARAM_NAME, state.mode === 'meeting' && state.withCodes.length > 0 ? state.withCodes.join(',') : null);
  set(BALANCE_PARAM, state.mode === 'meeting' && state.balance > 0 ? String(state.balance) : null);
  return params;
}

export function syncShareStateToUrl(state: ShareState): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    applyShareState(url.searchParams, state);
    if (url.search !== window.location.search) window.history.replaceState(window.history.state, '', url);
  } catch {
    // URL操作に失敗しても表示は続ける
  }
}
