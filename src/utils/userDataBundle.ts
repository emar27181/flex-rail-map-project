/**
 * 設定ファイル（書き出し・読み込み）に入れる、画面の設定のほかの「利用者のデータ」。
 *
 * 画面の設定（MapConfig）は React の状態から作るが、次の3つはブラウザの localStorage（と乗車ログの状態）にあり、
 * 別の端末・別のブラウザに移すには設定ファイルに入れる必要がある（2026-11-15 ユーザー指示: 網羅的に）。
 *   - 乗車ログ（乗った路線・降りた駅）
 *   - 駅のメモ（誰の最寄り駅がどこか）
 *   - 駅の選択履歴（よく使う駅の候補）
 * 読み込みは、壊れた要素を捨てて使える形だけにする（地図を壊さない）。読み込むと、その項目は設定ファイルの内容に置き換わる。
 * 新しい種類のデータを足すときは、ここに項目を足し、tests/unit/utils/userDataBundle.test.ts に往復の検査を足す。
 */
import { loadMemos, saveMemos, isMemo, type StationMemo } from './stationMemo';
import { loadStationHistory, saveStationHistory, isEntry, type StationHistoryEntry } from './stationHistory';
import { sanitizeRideLog, type RideLogEntry } from './rideLog';

export interface UserDataBundle {
  rideLog?: RideLogEntry[];
  stationMemos?: StationMemo[];
  stationHistory?: StationHistoryEntry[];
}

/** 書き出すデータを集める（乗車ログは状態から、メモ・履歴は localStorage から） */
export function collectUserData(rideLog: readonly RideLogEntry[]): UserDataBundle {
  return {
    rideLog: [...rideLog],
    stationMemos: loadMemos(),
    stationHistory: loadStationHistory(),
  };
}

/** 読み込んだ値を、使える形のものだけにする。含まれていない項目は undefined のまま（その項目は置き換えない） */
export function parseUserData(raw: unknown): UserDataBundle {
  if (typeof raw !== 'object' || raw === null) return {};
  const data = raw as Record<string, unknown>;
  const result: UserDataBundle = {};
  if (Array.isArray(data.rideLog)) result.rideLog = sanitizeRideLog(data.rideLog);
  if (Array.isArray(data.stationMemos)) result.stationMemos = (data.stationMemos as unknown[]).filter(isMemo);
  if (Array.isArray(data.stationHistory)) result.stationHistory = (data.stationHistory as unknown[]).filter(isEntry);
  return result;
}

/** メモ・履歴を localStorage に書く（乗車ログは呼び出し側が状態に入れる） */
export function persistUserData(bundle: UserDataBundle): void {
  if (bundle.stationMemos) saveMemos(bundle.stationMemos);
  if (bundle.stationHistory) saveStationHistory(bundle.stationHistory);
}
