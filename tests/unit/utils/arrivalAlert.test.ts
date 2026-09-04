/**
 * 降車駅アラームのテスト。
 *
 * 時刻表を使わず GPS の位置と実測速度だけで残り時間を出すのが要点。
 * 遅延時に時刻表が当てにならないことが動機なので、
 * 「時刻表由来の値が混ざっていない」ことと「停車中でも破綻しない」ことを固定する。
 */
import { describe, it, expect } from 'vitest';
import {
  estimateArrival,
  shouldNotifyArrival,
  buildArrivalMessage,
  ARRIVED_DISTANCE_M,
  DEFAULT_ALERT_MINUTES,
  ALERT_MINUTE_OPTIONS,
  isPlausibleSpeed,
} from '../../../src/utils/arrivalAlert';
import { DEFAULT_SPEED_MS } from '../../../src/utils/trainDetector';

/** 東京駅と、そこから概ね南へ n メートル進んだ地点 */
const TOKYO = { lat: 35.681236, lng: 139.767125 };
const southOf = (m: number) => ({ lat: TOKYO.lat - m / 111000, lng: TOKYO.lng });

describe('estimateArrival', () => {
  it('距離と速度から残り時間を出す', () => {
    // 時速72km = 20m/s で 6000m 手前 → 300秒 = 5分
    const e = estimateArrival(southOf(6000), TOKYO, 20);
    expect(e.distanceM).toBeGreaterThan(5900);
    expect(e.distanceM).toBeLessThan(6100);
    expect(e.minutesRemaining).toBeCloseTo(5, 1);
    expect(e.usedFallbackSpeed).toBe(false);
  });

  it('速度が上がれば残り時間は短くなる', () => {
    const slow = estimateArrival(southOf(6000), TOKYO, 10);
    const fast = estimateArrival(southOf(6000), TOKYO, 40);
    expect(fast.minutesRemaining).toBeLessThan(slow.minutesRemaining);
  });

  it('停車中（速度0）でも無限大にならず、直近の速度を使う', () => {
    const e = estimateArrival(southOf(6000), TOKYO, 0, 20);
    expect(Number.isFinite(e.minutesRemaining)).toBe(true);
    expect(e.speedUsedMs).toBe(20);
    expect(e.usedFallbackSpeed).toBe(true);
  });

  it('直近の速度も無ければ既定速度で見積もる', () => {
    const e = estimateArrival(southOf(6000), TOKYO, 0);
    expect(e.speedUsedMs).toBe(DEFAULT_SPEED_MS);
    expect(Number.isFinite(e.minutesRemaining)).toBe(true);
  });

  it('速度が NaN でも破綻しない', () => {
    const e = estimateArrival(southOf(3000), TOKYO, Number.NaN);
    expect(Number.isFinite(e.minutesRemaining)).toBe(true);
    expect(e.usedFallbackSpeed).toBe(true);
  });
});

describe('shouldNotifyArrival', () => {
  const at = (distM: number, speedMs: number) =>
    estimateArrival(southOf(distM), TOKYO, speedMs);

  it('しきい値より遠いうちは通知しない', () => {
    // 20m/s で 12000m → 10分
    const estimate = at(12000, 20);
    expect(shouldNotifyArrival({ estimate, thresholdMinutes: 5, alreadyNotified: false })).toBe(false);
  });

  it('しきい値を切ったら通知する', () => {
    // 20m/s で 5000m → 約4.2分
    const estimate = at(5000, 20);
    expect(shouldNotifyArrival({ estimate, thresholdMinutes: 5, alreadyNotified: false })).toBe(true);
  });

  it('一度通知したら同じ駅では二度と通知しない', () => {
    const estimate = at(1000, 20);
    expect(shouldNotifyArrival({ estimate, thresholdMinutes: 5, alreadyNotified: true })).toBe(false);
  });

  it('駅のすぐ近くなら速度に関係なく通知する', () => {
    // 停車していて速度0でも、もう着いているので出す
    const estimate = estimateArrival(southOf(ARRIVED_DISTANCE_M - 50), TOKYO, 0);
    expect(shouldNotifyArrival({ estimate, thresholdMinutes: 5, alreadyNotified: false })).toBe(true);
  });

  it('しきい値を短くすると、同じ位置でも通知されなくなる', () => {
    const estimate = at(5000, 20); // 約4.2分
    expect(shouldNotifyArrival({ estimate, thresholdMinutes: 5, alreadyNotified: false })).toBe(true);
    expect(shouldNotifyArrival({ estimate, thresholdMinutes: 2, alreadyNotified: false })).toBe(false);
  });

  it('遅延で減速しても、距離ではなく実測速度で判定が伸びる', () => {
    // 同じ5000m地点でも、速度が半分なら残り時間は倍になりまだ通知しない
    const normal = at(5000, 20);   // 約4.2分 → 通知
    const delayed = at(5000, 8);   // 約10.4分 → まだ
    expect(shouldNotifyArrival({ estimate: normal, thresholdMinutes: 5, alreadyNotified: false })).toBe(true);
    expect(shouldNotifyArrival({ estimate: delayed, thresholdMinutes: 5, alreadyNotified: false })).toBe(false);
  });
});

describe('buildArrivalMessage', () => {
  it('残り時間と距離を文面に含める', () => {
    const e = estimateArrival(southOf(5000), TOKYO, 20);
    const { title, body } = buildArrivalMessage('新宿', e);
    expect(title).toContain('新宿');
    expect(title).toMatch(/あと約\d+分/);
    expect(body).toContain('km');
  });

  it('駅の直前は「まもなく」になる', () => {
    const e = estimateArrival(southOf(50), TOKYO, 5);
    expect(buildArrivalMessage('新宿', e).title).toContain('まもなく');
  });

  it('1km未満はメートル表記になる', () => {
    const e = estimateArrival(southOf(600), TOKYO, 20);
    expect(buildArrivalMessage('新宿', e).body).toMatch(/\d+m/);
  });

  it('停車中の見積もりであることが分かる文面になる', () => {
    const e = estimateArrival(southOf(5000), TOKYO, 0);
    expect(buildArrivalMessage('新宿', e).body).toContain('停車中');
  });

  it('時刻表由来の時刻表記を含めない', () => {
    // 遅延時に当てにならないため、HH:MM 形式の時刻は出さない
    const e = estimateArrival(southOf(5000), TOKYO, 20);
    const { title, body } = buildArrivalMessage('新宿', e);
    expect(`${title} ${body}`).not.toMatch(/\d{1,2}:\d{2}/);
  });
});

describe('設定値', () => {
  it('既定のしきい値は選択肢に含まれる', () => {
    expect(ALERT_MINUTE_OPTIONS).toContain(DEFAULT_ALERT_MINUTES);
  });
});

describe('測位の飛びに対する頑健性', () => {
  const TOKYO2 = { lat: 35.681236, lng: 139.767125 };
  const far = (m: number) => ({ lat: TOKYO2.lat - m / 111000, lng: TOKYO2.lng });

  it('ありえない速度は採用せず、既定速度で見積もる', () => {
    // トンネル明けに現在地が飛ぶと2点間の速度が数百m/sになる
    const e = estimateArrival(far(12000), TOKYO2, 5000);
    expect(e.usedFallbackSpeed).toBe(true);
    expect(e.speedUsedMs).toBeLessThanOrEqual(DEFAULT_SPEED_MS);
  });

  it('測位が飛んでも、まだ遠ければ通知しない', () => {
    // 12km手前で速度5000m/sを信じると「あと0.04分」になり誤通知していた
    const e = estimateArrival(far(12000), TOKYO2, 5000);
    expect(shouldNotifyArrival({ estimate: e, thresholdMinutes: 5, alreadyNotified: false })).toBe(false);
  });

  it('直近の速度として飛んだ値が残っていても採用しない', () => {
    // 停車中(速度0)の見積もりで recentSpeedMs を使うが、
    // その recentSpeedMs 自体が飛びに由来する異常値のことがある。
    // ここを検査していないと 12km 手前で「あと約1分」と誤通知する
    const e = estimateArrival(far(12000), TOKYO2, 0, 5000);
    expect(e.speedUsedMs).toBe(DEFAULT_SPEED_MS);
    expect(shouldNotifyArrival({ estimate: e, thresholdMinutes: 5, alreadyNotified: false })).toBe(false);
  });

  it('新幹線並みの速度は正常値として扱う', () => {
    // 320km/h ≈ 88.9m/s。これは飛びではないので実測として使う
    const e = estimateArrival(far(20000), TOKYO2, 88);
    expect(e.usedFallbackSpeed).toBe(false);
    expect(e.speedUsedMs).toBe(88);
  });
});

describe('isPlausibleSpeed', () => {
  it('停止・徐行・飛び・未定義をまとめて弾く', () => {
    expect(isPlausibleSpeed(undefined)).toBe(false);
    expect(isPlausibleSpeed(Number.NaN)).toBe(false);
    expect(isPlausibleSpeed(0)).toBe(false);
    expect(isPlausibleSpeed(500)).toBe(false);
  });

  it('通常の走行速度は通す', () => {
    expect(isPlausibleSpeed(20)).toBe(true);
    expect(isPlausibleSpeed(88)).toBe(true);
  });
});
