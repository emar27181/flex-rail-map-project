/**
 * 地図の見た目の大きさ（駅ラベルの倍率・路線の線の太さ）の保持。
 *
 * これまでは設定パネルで大きさを変えても、リロードすると既定値に戻っていた。
 * 「自分に合う大きさに調整する」操作が毎回やり直しになるため、
 * 言語やテーマと同じように選んだ値を持ち越す。
 *
 * 保存に失敗しても表示は続けられるべきなので、読み書きは黙って諦める
 * （プライベートブラウズや容量超過で localStorage が例外を投げる）。
 */
import { MAP_LABEL, ROUTE_LINE } from '../constants/ui';

export const STATION_SIZE_SCALE_KEY = 'frm-station-size-scale';
export const ROUTE_LINE_WIDTH_KEY = 'frm-route-line-width';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** 保存値が壊れていても既定値で立ち上がるようにする */
const readNumber = (key: string, fallback: number, min: number, max: number): number => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    // Number('') は 0 になってしまうので、空文字は「未保存」として扱う
    if (raw === null || raw.trim() === '') return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? clamp(value, min, max) : fallback;
  } catch {
    return fallback;
  }
};

const writeNumber = (key: string, value: number): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // 保存できなくても表示は続ける
  }
};

export const getInitialStationSizeScale = (): number =>
  readNumber(STATION_SIZE_SCALE_KEY, MAP_LABEL.defaultScale, MAP_LABEL.minScale, MAP_LABEL.maxScale);

export const persistStationSizeScale = (scale: number): void =>
  writeNumber(STATION_SIZE_SCALE_KEY, scale);

export const getInitialRouteLineWidth = (): number =>
  readNumber(ROUTE_LINE_WIDTH_KEY, ROUTE_LINE.defaultWidth, ROUTE_LINE.minWidth, ROUTE_LINE.maxWidth);

export const persistRouteLineWidth = (width: number): void =>
  writeNumber(ROUTE_LINE_WIDTH_KEY, width);
