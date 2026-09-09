/**
 * 降車駅の手前で鳴らすアラーム。
 *
 * 時刻表ベースの「◯分後に到着」は遅延しているとまったく当てにならない。
 * そこで時刻表を一切使わず、GPSの現在地と実測の速度だけで
 * 「あと何分で着くか」を出し、しきい値を切ったら通知する。
 *
 * 距離ではなく時間で判定するのは、路線によって速度が大きく違うため。
 * 各駅停車の私鉄と新幹線で同じ「5分前の距離」を使うと意味がずれる。
 */
import { haversineDistance, DEFAULT_SPEED_MS, MIN_SPEED_MS } from './trainDetector';

/** 既定の通知タイミング（分）。降車の準備に必要な時間として5分 */
export const DEFAULT_ALERT_MINUTES = 5;

/** 選べる通知タイミング（分） */
export const ALERT_MINUTE_OPTIONS = [1, 2, 3, 5, 10] as const;

/**
 * 停車中や渋滞でGPS速度がほぼ0のとき、そのまま割ると残り時間が無限大になる。
 * 走っていないとみなす下限速度を決め、それ未満のときは
 * 直近に出ていた速度、それも無ければ路線の平均速度で見積もる。
 */
const MIN_MOVING_SPEED_MS = MIN_SPEED_MS;

/**
 * これより近ければ、速度に関係なく「もう着く」とみなす。
 * 駅構内でGPSが揺れて残り時間が乱高下するのを防ぐ。
 */
export const ARRIVED_DISTANCE_M = 150;

/**
 * ありえない速度の上限(m/s)。360km/h 相当。
 *
 * トンネルを抜けた直後や測位のやり直しで現在地が一気に数km飛ぶことがあり、
 * 2点間の差からそのまま速度を出すと数百m/sになる。それを信じると
 * まだ10km以上手前なのに「あと1分」と誤って通知してしまう。
 * 新幹線の最高速度(320km/h)を超える値は測位の飛びとみなして採用しない。
 */
const MAX_PLAUSIBLE_SPEED_MS = 100;

/**
 * 実測速度として採用してよい値か。
 * 直近の速度を保存する側と、残り時間を出す側の両方でここを通す。
 * 片方だけ弾くと、飛んだ値が「直近の速度」として残って結局採用されてしまう。
 */
export function isPlausibleSpeed(speedMs: number | undefined): speedMs is number {
  return (
    speedMs !== undefined &&
    Number.isFinite(speedMs) &&
    speedMs >= MIN_MOVING_SPEED_MS &&
    speedMs <= MAX_PLAUSIBLE_SPEED_MS
  );
}

export type ArrivalEstimate = {
  /** 降車駅までの直線距離(m) */
  distanceM: number;
  /** 見積もり残り時間(分)。速度が取れないときも既定速度で必ず返す */
  minutesRemaining: number;
  /** 残り時間の算出に使った速度(m/s) */
  speedUsedMs: number;
  /** 速度が実測ではなく既定値へのフォールバックだったか */
  usedFallbackSpeed: boolean;
};

/**
 * 現在地と降車駅から残り距離・残り時間を見積もる。
 *
 * @param speedMs 実測速度。停車中などで信頼できない場合は recentSpeedMs / 既定速度に落ちる
 * @param recentSpeedMs 直近で走行していたときの速度。停車中の見積もりに使う
 */
export function estimateArrival(
  current: { lat: number; lng: number },
  target: { lat: number; lng: number },
  speedMs: number,
  recentSpeedMs?: number,
): ArrivalEstimate {
  const distanceM = haversineDistance(current.lat, current.lng, target.lat, target.lng);

  let speedUsedMs = speedMs;
  let usedFallbackSpeed = false;
  if (!isPlausibleSpeed(speedUsedMs)) {
    // 停車中、または測位が飛んだとき。
    // 直前まで走っていた速度があればそれを使う（駅間の停車を想定）が、
    // その値自体が飛びに由来することもあるので同じ基準で検査する
    speedUsedMs = isPlausibleSpeed(recentSpeedMs) ? recentSpeedMs : DEFAULT_SPEED_MS;
    usedFallbackSpeed = true;
  }

  return {
    distanceM,
    minutesRemaining: distanceM / speedUsedMs / 60,
    speedUsedMs,
    usedFallbackSpeed,
  };
}

export type AlertDecisionInput = {
  estimate: ArrivalEstimate;
  /** 通知するしきい値（分） */
  thresholdMinutes: number;
  /** すでにこの降車駅で通知済みか */
  alreadyNotified: boolean;
};

/**
 * 通知を出すべきかを判定する。
 *
 * 一度出したら同じ降車駅では二度と出さない。GPSが揺れて
 * しきい値の前後を行き来するたびに鳴るのを防ぐため。
 */
export function shouldNotifyArrival(input: AlertDecisionInput): boolean {
  const { estimate, thresholdMinutes, alreadyNotified } = input;
  if (alreadyNotified) return false;
  if (estimate.distanceM <= ARRIVED_DISTANCE_M) return true;
  return estimate.minutesRemaining <= thresholdMinutes;
}

/**
 * 通知の文面を組み立てる。
 * 遅延で時刻表が当てにならない場面で使うので、
 * 時刻ではなく「あと何分・何km」という実測値だけを出す。
 */
export function buildArrivalMessage(
  stationName: string,
  estimate: ArrivalEstimate,
): { title: string; body: string } {
  const mins = Math.max(0, Math.round(estimate.minutesRemaining));
  const km = estimate.distanceM / 1000;
  const distanceText = km >= 1
    ? `${km.toFixed(1)}km`
    : `${Math.round(estimate.distanceM)}m`;

  const title = estimate.distanceM <= ARRIVED_DISTANCE_M
    ? `まもなく ${stationName}`
    : `あと約${mins}分で ${stationName}`;

  const body = estimate.usedFallbackSpeed
    ? `残り${distanceText}（停車中のため平均速度で見積もり）`
    : `残り${distanceText}・現在の速度から算出`;

  return { title, body };
}
