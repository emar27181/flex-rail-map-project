/**
 * 2本指の操作の判定（utils/mapGestures.ts）のテスト。
 * 実際に指で動かしたときの滑らかさ・ずれは描画テスト（tests/render/pinchGesture.render.ts）で見る。
 */
import { describe, it, expect } from 'vitest';
import { isPinchGestureActive, normalizeDeg, shouldStartRotating, ROTATE_THRESHOLD_DEG } from '../../../src/utils/mapGestures';

describe('isPinchGestureActive', () => {
  it('拡大・縮小または回転の最中だけ true', () => {
    expect(isPinchGestureActive({ touchGestures: { _zooming: true } })).toBe(true);
    expect(isPinchGestureActive({ touchGestures: { _rotating: true } })).toBe(true);
    expect(isPinchGestureActive({ touchGestures: { _zooming: false, _rotating: false } })).toBe(false);
  });

  it('2本指の操作が無い地図・地図が無いときも壊れない', () => {
    expect(isPinchGestureActive({})).toBe(false);
    expect(isPinchGestureActive(null)).toBe(false);
  });
});

describe('normalizeDeg', () => {
  it('-180〜180 度に丸める', () => {
    expect(normalizeDeg(0)).toBe(0);
    expect(normalizeDeg(190)).toBe(-170);
    expect(normalizeDeg(-190)).toBe(170);
    expect(normalizeDeg(350)).toBe(-10);
    expect(normalizeDeg(720 + 5)).toBe(5);
  });
});

describe('shouldStartRotating', () => {
  it('ひねりが閾値に届くまでは回さない', () => {
    expect(shouldStartRotating(0)).toBe(false);
    expect(shouldStartRotating(ROTATE_THRESHOLD_DEG - 1)).toBe(false);
    expect(shouldStartRotating(-(ROTATE_THRESHOLD_DEG - 1))).toBe(false);
  });

  it('閾値を超えたら左右どちらにひねっても回す', () => {
    expect(shouldStartRotating(ROTATE_THRESHOLD_DEG)).toBe(true);
    expect(shouldStartRotating(-ROTATE_THRESHOLD_DEG - 5)).toBe(true);
  });

  it('角度が 360 度をまたいでも、ひねりの量で判断する（指の向きが 179 度→ -179 度は 2 度のひねり）', () => {
    expect(shouldStartRotating(358)).toBe(false);
    expect(shouldStartRotating(-358)).toBe(false);
  });
});
