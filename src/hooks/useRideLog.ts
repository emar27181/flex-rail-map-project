/**
 * 乗車ログ（試作）の記録を持つ。ブラウザの localStorage に保存し、読み書きの失敗では落ちない
 * （プライベートウィンドウなどで使えないことがある）。計算は utils/rideLog.ts。
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { RIDE_LOG_STORAGE_KEY, parseRideLog, serializeRideLog, type RideLogEntry } from '../utils/rideLog';

function readStored(): RideLogEntry[] {
  try {
    return typeof window === 'undefined' ? [] : parseRideLog(window.localStorage.getItem(RIDE_LOG_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function useRideLog() {
  // 保存済みの読み込みは最初の描画の後（サーバー側の描画と食い違わないように）
  const [entries, setEntries] = useState<RideLogEntry[]>([]);
  const loaded = useRef(false);
  useEffect(() => {
    setEntries(readStored());
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { window.localStorage.setItem(RIDE_LOG_STORAGE_KEY, serializeRideLog(entries)); } catch { /* 保存できない環境 */ }
  }, [entries]);

  const add = useCallback((added: RideLogEntry[]) => setEntries(prev => [...prev, ...added]), []);
  /** 直前の記録（1回の経路ぶん = 同じ id の接頭辞でまとめた全区間）を取り消す */
  const undoLast = useCallback(() => setEntries(prev => {
    if (prev.length === 0) return prev;
    const batch = prev[prev.length - 1].id.split(':')[0];
    return prev.filter(e => e.id.split(':')[0] !== batch);
  }), []);
  const clear = useCallback(() => setEntries([]), []);
  /** 条件に合う記録を外す（路線のタップの取り消し・降りた駅の取り消し） */
  const removeWhere = useCallback((predicate: (e: RideLogEntry) => boolean) => setEntries(prev => prev.filter(e => !predicate(e))), []);
  return { entries, add, undoLast, clear, removeWhere };
}
