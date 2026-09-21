/**
 * 乗車路線検出のテスト
 *
 * 対象:
 * - 停車中（速度ほぼ0）に現在の駅を返すこと
 * - 走行中は現在の駅を返さないこと（次の駅表示のまま）
 * - 速度・進行方向を時間窓全体から求め、GPSノイズで方向が反転しないこと
 */

import { describe, it, expect } from 'vitest';
import {
  detectCurrentRoute,
  DETECTION_WARMUP_MS,
  GPS_HISTORY_SIZE,
  estimateHeadingFromHistory,
  HEADING_WINDOW_MS,
  HEADING_MIN_DISTANCE_M,
  type GpsPoint,
} from '../../../src/utils/trainDetector';
import { routes } from '../../../src/data/routes';

const yamanote = routes.yamanote;
const stationByName = (name: string) => {
  const s = yamanote.find((st) => st.name === name);
  if (!s) throw new Error(`駅が見つからない: ${name}`);
  return s;
};

describe('検出のウォームアップ設定', () => {
  it('推定時間が約15秒確保されている', () => {
    expect(DETECTION_WARMUP_MS).toBe(15000);
  });

  it('GPS履歴がウォームアップ時間を1秒間隔でカバーできる長さを持つ', () => {
    expect(GPS_HISTORY_SIZE).toBeGreaterThanOrEqual(DETECTION_WARMUP_MS / 1000);
  });
});

describe('停車中の現在駅表示', () => {
  it('駅構内で速度ほぼ0なら現在の駅を返す', () => {
    const shinjuku = stationByName('新宿');
    const t0 = 1_700_000_000_000;

    // 同一地点に留まる = 速度ほぼ0
    const history: GpsPoint[] = [];
    for (let i = 0; i < 16; i++) {
      history.push({ lat: shinjuku.lat, lng: shinjuku.lng, timestamp: t0 + i * 1000 });
    }

    const detected = detectCurrentRoute(history);
    expect(detected).not.toBeNull();
    expect(detected!.isStopped).toBe(true);
    expect(detected!.currentStation).toBe('新宿');
  });

  it('走行中は現在の駅を返さない', () => {
    const shinjuku = stationByName('新宿');
    const yoyogi = stationByName('代々木');
    const t0 = 1_700_000_000_000;

    // 新宿→代々木を15秒かけて移動（十分な速度）
    const history: GpsPoint[] = [];
    const steps = 16;
    for (let i = 0; i < steps; i++) {
      const r = i / (steps - 1);
      history.push({
        lat: shinjuku.lat + (yoyogi.lat - shinjuku.lat) * r,
        lng: shinjuku.lng + (yoyogi.lng - shinjuku.lng) * r,
        timestamp: t0 + i * 1000,
      });
    }

    const detected = detectCurrentRoute(history);
    expect(detected).not.toBeNull();
    expect(detected!.isStopped).toBe(false);
    expect(detected!.currentStation).toBeNull();
  });
});

describe('進行方向の安定性', () => {
  it('最後の1点がGPSノイズで逆方向にずれても進行方向が反転しない', () => {
    const shinjuku = stationByName('新宿');
    const yoyogi = stationByName('代々木');
    const t0 = 1_700_000_000_000;

    const build = (withNoise: boolean): GpsPoint[] => {
      const pts: GpsPoint[] = [];
      const steps = 16;
      for (let i = 0; i < steps; i++) {
        const r = i / (steps - 1);
        pts.push({
          lat: shinjuku.lat + (yoyogi.lat - shinjuku.lat) * r,
          lng: shinjuku.lng + (yoyogi.lng - shinjuku.lng) * r,
          timestamp: t0 + i * 1000,
        });
      }
      if (withNoise) {
        // 最終点だけ進行方向と逆に大きくずらす（GPSの揺らぎを模擬）
        const last = pts[pts.length - 1];
        const back = pts[pts.length - 4];
        pts[pts.length - 1] = { ...last, lat: back.lat, lng: back.lng };
      }
      return pts;
    };

    const clean = detectCurrentRoute(build(false));
    const noisy = detectCurrentRoute(build(true));

    expect(clean).not.toBeNull();
    expect(noisy).not.toBeNull();
    // 直近2点だけで計算していた頃はここで方向が反転していた
    expect(noisy!.directionIndex).toBe(clean!.directionIndex);
  });
});

describe('現在地アイコンの向き推定（estimateHeadingFromHistory）', () => {
  const t0 = 1_700_000_000_000;
  const baseLat = 35.6909;
  const baseLng = 139.7003;

  it('履歴が1点以下ならnull', () => {
    expect(estimateHeadingFromHistory([], t0)).toBeNull();
    expect(estimateHeadingFromHistory([{ lat: baseLat, lng: baseLng, timestamp: t0 }], t0)).toBeNull();
  });

  it('真北へ十分な距離を移動していれば0度に近い値を返す', () => {
    const history: GpsPoint[] = [
      { lat: baseLat, lng: baseLng, timestamp: t0 },
      { lat: baseLat + 0.002, lng: baseLng, timestamp: t0 + HEADING_WINDOW_MS },
    ];
    const heading = estimateHeadingFromHistory(history, t0 + HEADING_WINDOW_MS);
    expect(heading).not.toBeNull();
    expect(heading!).toBeCloseTo(0, 0);
  });

  it('真東へ十分な距離を移動していれば90度に近い値を返す', () => {
    const history: GpsPoint[] = [
      { lat: baseLat, lng: baseLng, timestamp: t0 },
      { lat: baseLat, lng: baseLng + 0.002, timestamp: t0 + HEADING_WINDOW_MS },
    ];
    const heading = estimateHeadingFromHistory(history, t0 + HEADING_WINDOW_MS);
    expect(heading).not.toBeNull();
    expect(heading!).toBeCloseTo(90, 0);
  });

  it('真南へ十分な距離を移動していれば180度に近い値を返す', () => {
    const history: GpsPoint[] = [
      { lat: baseLat, lng: baseLng, timestamp: t0 },
      { lat: baseLat - 0.002, lng: baseLng, timestamp: t0 + HEADING_WINDOW_MS },
    ];
    const heading = estimateHeadingFromHistory(history, t0 + HEADING_WINDOW_MS);
    expect(heading).not.toBeNull();
    expect(heading!).toBeCloseTo(180, 0);
  });

  it('ほぼ静止中（移動距離が閾値未満）はnull（矢印を出さない）', () => {
    // 閾値(HEADING_MIN_DISTANCE_M)未満の、GPSノイズ程度の見かけ上の移動
    const tinyDegree = (HEADING_MIN_DISTANCE_M * 0.3) / 111_000; // ゆとりを持って閾値の3割程度の距離
    const history: GpsPoint[] = [
      { lat: baseLat, lng: baseLng, timestamp: t0 },
      { lat: baseLat + tinyDegree, lng: baseLng, timestamp: t0 + HEADING_WINDOW_MS },
    ];
    expect(estimateHeadingFromHistory(history, t0 + HEADING_WINDOW_MS)).toBeNull();
  });

  it('時間窓より古い点は無視し、窓内の変位だけで方向を求める', () => {
    const history: GpsPoint[] = [
      // 窓の外（大昔）: 東へ大きく動いた点。これが混入すると方向が変わってしまう
      { lat: baseLat, lng: baseLng, timestamp: t0 },
      { lat: baseLat, lng: baseLng + 0.05, timestamp: t0 + 1000 },
      // 窓内: ここから真北へ移動
      { lat: baseLat, lng: baseLng + 0.05, timestamp: t0 + 20_000 },
      { lat: baseLat + 0.002, lng: baseLng + 0.05, timestamp: t0 + 20_000 + HEADING_WINDOW_MS },
    ];
    const heading = estimateHeadingFromHistory(history, t0 + 20_000 + HEADING_WINDOW_MS);
    expect(heading).not.toBeNull();
    expect(heading!).toBeCloseTo(0, 0);
  });
});
