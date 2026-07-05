/**
 * 出発駅の自動設定ロジックのリグレッションテスト
 *
 * 再発防止バグ:
 *   watchPosition によるGPS更新が、ユーザーが × で出発駅をクリアした後に
 *   元の駅を復元してしまう問題（2026-06-17 に発生・修正）
 *
 * 修正箇所:
 *   RailwayMap.tsx の StationSelector に渡す onDepartureChange を
 *   setDeparture → handleManualSetDeparture に変更した。
 *   handleManualSetDeparture は setDeparture(station) + setIsManualDeparture(true) を呼ぶため、
 *   GPS 自動設定の useEffect が isManualDeparture=true をガードしてスキップする。
 *
 * テスト対象のロジック（RailwayMap.tsx より抜粋）:
 *   useEffect(() => {
 *     if (!userLocation || isManualDeparture) return;
 *     const nearest = findNearestStation(...);
 *     if (nearest) setDeparture(nearest);
 *   }, [userLocation, isManualDeparture]);
 *
 *   const handleManualSetDeparture = (station) => {
 *     setDeparture(station);
 *     setIsManualDeparture(true);   // ← これがキー: GPS自動更新を止める
 *   };
 */
import React, { useState, useCallback, useEffect } from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

type Station = { name: string; lat: number; lng: number };

/**
 * RailwayMap.tsx の出発駅ロジックを抽出した最小フック。
 * このフックを変更する場合は RailwayMap.tsx 側も同様に変更すること。
 */
function useDepartureAutoSet(
  userLocation: [number, number] | null,
  findNearestStation: (lat: number, lng: number) => Station | null
) {
  const [departure, setDeparture] = useState<Station | null>(null);
  const [isManualDeparture, setIsManualDeparture] = useState(false);

  // GPS更新時の自動設定（手動設定後はスキップ）
  useEffect(() => {
    if (!userLocation || isManualDeparture) return;
    const nearest = findNearestStation(userLocation[0], userLocation[1]);
    if (nearest) setDeparture(nearest);
  }, [userLocation, isManualDeparture]); // eslint-disable-line react-hooks/exhaustive-deps

  // 手動設定（× ボタン・候補選択）: isManualDeparture=true でGPS自動更新を止める
  const handleManualSetDeparture = useCallback((station: Station | null) => {
    setDeparture(station);
    setIsManualDeparture(true);
  }, []);

  // 📍 ボタン: 現在地の最寄駅を一度だけセット（isManualDeparture は変更しない）
  const handleSetNearestDeparture = useCallback(() => {
    if (!userLocation) return;
    const nearest = findNearestStation(userLocation[0], userLocation[1]);
    if (nearest) setDeparture(nearest);
  }, [userLocation, findNearestStation]);

  return { departure, isManualDeparture, handleManualSetDeparture, handleSetNearestDeparture };
}

// ──────────────────────────────────────────────────────────
// テスト
// ──────────────────────────────────────────────────────────

const stationA: Station = { name: '東京', lat: 35.6812, lng: 139.7671 };
const stationB: Station = { name: '新宿', lat: 35.6896, lng: 139.6918 };

describe('出発駅の自動設定ロジック (useDepartureAutoSet)', () => {
  it('isManualDeparture=false のとき、GPS更新で最寄駅が自動設定される', async () => {
    const findNearest = vi.fn().mockReturnValue(stationA);

    const { result, rerender } = renderHook(
      ({ loc }) => useDepartureAutoSet(loc, findNearest),
      { initialProps: { loc: null as [number, number] | null } }
    );

    expect(result.current.departure).toBeNull();

    // GPS位置が届いた
    rerender({ loc: [35.68, 139.76] as [number, number] });

    expect(result.current.departure).toEqual(stationA);
    expect(result.current.isManualDeparture).toBe(false);
  });

  it('[バグ再発防止] × クリア後、GPS更新があっても出発駅は復元されない', async () => {
    const findNearest = vi.fn().mockReturnValue(stationA);

    const { result, rerender } = renderHook(
      ({ loc }) => useDepartureAutoSet(loc, findNearest),
      { initialProps: { loc: [35.68, 139.76] as [number, number] } }
    );

    // GPS によって東京駅が自動設定されている
    expect(result.current.departure).toEqual(stationA);
    expect(result.current.isManualDeparture).toBe(false);

    // ユーザーが × ボタンで出発駅をクリア（handleManualSetDeparture(null)）
    act(() => {
      result.current.handleManualSetDeparture(null);
    });

    expect(result.current.departure).toBeNull();
    expect(result.current.isManualDeparture).toBe(true);

    // GPS更新が来る（位置が少し変わった）
    rerender({ loc: [35.69, 139.77] as [number, number] });

    // バグ: ここで departure が stationA に戻ってしまっていた
    expect(result.current.departure).toBeNull();
  });

  it('[バグ再発防止] 手動で別の駅を選択後、GPS更新があっても上書きされない', async () => {
    const findNearest = vi.fn().mockReturnValue(stationA);

    const { result, rerender } = renderHook(
      ({ loc }) => useDepartureAutoSet(loc, findNearest),
      { initialProps: { loc: [35.68, 139.76] as [number, number] } }
    );

    // GPS で東京駅が自動設定
    expect(result.current.departure).toEqual(stationA);

    // ユーザーが手動で新宿駅を選択
    act(() => {
      result.current.handleManualSetDeparture(stationB);
    });

    expect(result.current.departure).toEqual(stationB);
    expect(result.current.isManualDeparture).toBe(true);

    // GPS更新（findNearestStation は東京駅を返す）
    rerender({ loc: [35.69, 139.77] as [number, number] });

    // 手動設定した新宿駅が維持される
    expect(result.current.departure).toEqual(stationB);
  });

  it('GPS位置なしのとき、handleManualSetDeparture は正しく動作する', () => {
    const findNearest = vi.fn().mockReturnValue(stationA);

    const { result } = renderHook(
      () => useDepartureAutoSet(null, findNearest)
    );

    expect(result.current.departure).toBeNull();

    act(() => {
      result.current.handleManualSetDeparture(stationB);
    });

    expect(result.current.departure).toEqual(stationB);
    expect(result.current.isManualDeparture).toBe(true);
  });

  it('handleSetNearestDeparture は isManualDeparture を変更しない', () => {
    const findNearest = vi.fn().mockReturnValue(stationA);

    const { result } = renderHook(
      ({ loc }) => useDepartureAutoSet(loc, findNearest),
      { initialProps: { loc: [35.68, 139.76] as [number, number] } }
    );

    // GPS で自動設定された後、手動クリア
    act(() => {
      result.current.handleManualSetDeparture(null);
    });
    expect(result.current.isManualDeparture).toBe(true);

    // 📍 ボタン押下
    act(() => {
      result.current.handleSetNearestDeparture();
    });

    // 駅はセットされるが isManualDeparture は true のまま
    expect(result.current.departure).toEqual(stationA);
    expect(result.current.isManualDeparture).toBe(true);
  });

  it('findNearestStation が null を返すとき departure は変わらない', () => {
    const findNearest = vi.fn().mockReturnValue(null);

    const { result, rerender } = renderHook(
      ({ loc }) => useDepartureAutoSet(loc, findNearest),
      { initialProps: { loc: null as [number, number] | null } }
    );

    rerender({ loc: [35.68, 139.76] as [number, number] });

    expect(result.current.departure).toBeNull();
  });
});
