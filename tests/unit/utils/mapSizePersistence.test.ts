/**
 * 地図の大きさの既定値と保持のテスト。
 *
 * 既定値は一度 12px（倍率1.0）に上げたが、地図はラベルが重ならずに
 * 何個並ぶかが効くため 11px × 0.8 = 9px に戻した経緯がある。
 * 意図せず変わると「前とサイズが違う」が再発するので数値で固定する。
 *
 * localStorage を使うため jsdom 環境で実行する
 * （デフォルトの node 環境には localStorage が無い）。
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { MAP_LABEL, ROUTE_LINE } from '../../../src/constants/ui';
import {
  STATION_SIZE_SCALE_KEY,
  ROUTE_LINE_WIDTH_KEY,
  TRAVEL_TIME_STYLE_KEY,
  STATION_ICON_STYLE_KEY,
  getInitialStationSizeScale,
  persistStationSizeScale,
  getInitialRouteLineWidth,
  persistRouteLineWidth,
  getInitialTravelTimeStyle,
  persistTravelTimeStyle,
  getInitialStationIconStyle,
  persistStationIconStyle,
} from '../../../src/utils/mapSizePersistence';

describe('地図の大きさの既定値', () => {
  it('駅ラベルは 11px × 0.8 = 9px（main と同じ）', () => {
    expect(MAP_LABEL.baseFontPx).toBe(11);
    expect(MAP_LABEL.defaultScale).toBe(0.8);
    expect(Math.round(MAP_LABEL.baseFontPx * MAP_LABEL.defaultScale)).toBe(9);
  });

  it('ふりがなは駅名の75%・下限7px（main と同じ）', () => {
    expect(MAP_LABEL.furiganaRatio).toBe(0.75);
    expect(MAP_LABEL.furiganaMinPx).toBe(7);
  });

  it('ラベルの余白は 1px 3px（main と同じ）', () => {
    expect(MAP_LABEL.paddingYPx).toBe(1);
    expect(MAP_LABEL.paddingXPx).toBe(3);
  });

  it('路線の線の太さは 3px（main と同じ）', () => {
    expect(ROUTE_LINE.defaultWidth).toBe(3);
  });

  it('調整の範囲に既定値が含まれている', () => {
    expect(MAP_LABEL.defaultScale).toBeGreaterThanOrEqual(MAP_LABEL.minScale);
    expect(MAP_LABEL.defaultScale).toBeLessThanOrEqual(MAP_LABEL.maxScale);
    expect(ROUTE_LINE.defaultWidth).toBeGreaterThanOrEqual(ROUTE_LINE.minWidth);
    expect(ROUTE_LINE.defaultWidth).toBeLessThanOrEqual(ROUTE_LINE.maxWidth);
  });
});

describe('地図の大きさの保持', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('保存が無ければ既定値を返す', () => {
    expect(getInitialStationSizeScale()).toBe(MAP_LABEL.defaultScale);
    expect(getInitialRouteLineWidth()).toBe(ROUTE_LINE.defaultWidth);
  });

  it('保存した値を次回読み出せる', () => {
    persistStationSizeScale(1.4);
    persistRouteLineWidth(5);
    expect(getInitialStationSizeScale()).toBe(1.4);
    expect(getInitialRouteLineWidth()).toBe(5);
  });

  it('壊れた保存値は既定値に落とす', () => {
    window.localStorage.setItem(STATION_SIZE_SCALE_KEY, 'ほげ');
    window.localStorage.setItem(ROUTE_LINE_WIDTH_KEY, '');
    expect(getInitialStationSizeScale()).toBe(MAP_LABEL.defaultScale);
    expect(getInitialRouteLineWidth()).toBe(ROUTE_LINE.defaultWidth);
  });

  it('範囲外の保存値は下限・上限に丸める', () => {
    persistStationSizeScale(99);
    expect(getInitialStationSizeScale()).toBe(MAP_LABEL.maxScale);
    persistStationSizeScale(-1);
    expect(getInitialStationSizeScale()).toBe(MAP_LABEL.minScale);
  });
});

describe('所要時間ラベル・駅アイコンの色カスタムの保持', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('保存が無ければ空（＝自動配色のまま）を返す', () => {
    expect(getInitialTravelTimeStyle()).toEqual({});
    expect(getInitialStationIconStyle()).toEqual({});
  });

  it('保存した値を次回読み出せる', () => {
    persistTravelTimeStyle({ textColor: '#ff0000', bgColor: '#000000', borderColor: '#00ff00' });
    persistStationIconStyle({ textColor: '#111111' });
    expect(getInitialTravelTimeStyle()).toEqual({ textColor: '#ff0000', bgColor: '#000000', borderColor: '#00ff00' });
    expect(getInitialStationIconStyle()).toEqual({ textColor: '#111111' });
  });

  it('リセット（空オブジェクト）を保存すると次回も自動配色に戻る', () => {
    persistTravelTimeStyle({ textColor: '#ff0000' });
    persistTravelTimeStyle({});
    expect(getInitialTravelTimeStyle()).toEqual({});
  });

  it('壊れた保存値は空にフォールバックする', () => {
    window.localStorage.setItem(TRAVEL_TIME_STYLE_KEY, '{not json');
    window.localStorage.setItem(STATION_ICON_STYLE_KEY, '"just a string"');
    expect(getInitialTravelTimeStyle()).toEqual({});
    expect(getInitialStationIconStyle()).toEqual({});
  });

  it('想定外のフィールドや型は無視する', () => {
    window.localStorage.setItem(TRAVEL_TIME_STYLE_KEY, JSON.stringify({ textColor: 123, unknownField: 'x' }));
    expect(getInitialTravelTimeStyle()).toEqual({});
  });
});
