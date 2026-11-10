/**
 * 地図の2本指の操作（拡大・縮小・回転）に関する判定。
 *
 * 2本指の操作は leaflet-rotate の TouchGestures が受け持つ。操作中は `_zooming` / `_rotating` が立つ。
 * 公開された API が無いため、ここ1か所だけで内部の値を読む（leaflet-rotate を更新して名前が変わったら、ここだけ直す）。
 */

interface TouchGesturesLike {
  _zooming?: boolean;
  _rotating?: boolean;
}

/** 2本指で拡大・縮小・回転している最中か */
export function isPinchGestureActive(map: unknown): boolean {
  const gestures = (map as { touchGestures?: TouchGesturesLike } | null)?.touchGestures;
  return !!(gestures && (gestures._zooming || gestures._rotating));
}

/**
 * 2本指をこの角度（度）以上ひねったときだけ地図を回す。
 *
 * 拡大・縮小しようとしただけでも指の向きは少し変わる。以前はそのたびに地図が回り、回るたびに全路線を描き直すため
 * スマホで2本指の操作が止まる・カクつく原因になっていた（2026-11）。地図アプリ（Google マップ・Apple マップ）も
 * ひねりが小さいうちは回さない。
 */
export const ROTATE_THRESHOLD_DEG = 15;

/** 2本指の向き（度）。leaflet-rotate と同じ測り方（atan と y の向きで 180 度を足す） */
function fingerAngleDeg(vector: { x: number; y: number }): number {
  const deg = Math.atan(vector.x / vector.y) * (180 / Math.PI);
  return vector.y < 0 ? deg + 180 : deg;
}

/** -180〜180 度に丸める */
export function normalizeDeg(deg: number): number {
  return ((((deg + 180) % 360) + 360) % 360) - 180;
}

/**
 * ひねりの量（開始からの角度の差）が閾値を超えたか。超えるまでは回さない
 */
export function shouldStartRotating(twistDeg: number, threshold = ROTATE_THRESHOLD_DEG): boolean {
  return Math.abs(normalizeDeg(twistDeg)) >= threshold;
}

/**
 * leaflet-rotate の2本指の操作（TouchGestures）を、スマホで滑らかに動くように差し替える。
 *
 * - ひねりが ROTATE_THRESHOLD_DEG を超えるまでは回さない（超えたら、その時点の向きから回し始めるので飛ばない）
 * - 回転と拡大・移動を、指の動き（touchmove）ごとではなく 1 フレームに 1 回だけまとめて反映する。
 *   画面の書き換えが速い端末では 1 フレームに touchmove が複数回来て、そのたびに全路線を描き直していた
 *
 * それ以外（拡大の中心・ズームの上下限・指を離したときの処理）は leaflet-rotate のまま。
 */
export function patchSmoothTouchGestures(leaflet: any): void {
  const proto = leaflet?.Map?.TouchGestures?.prototype;
  if (!proto || proto.__smoothPatched) return;
  const originalStart = proto._onTouchStart;
  const DomUtil = leaflet.DomUtil;
  const Util = leaflet.Util;
  const DomEvent = leaflet.DomEvent;

  proto._onTouchStart = function patchedTouchStart(this: any, e: TouchEvent) {
    originalStart.call(this, e);
    if (!this._rotating) return;
    // 回すのはひねりが閾値を超えてから
    const map = this._map;
    const p1 = map.mouseEventToContainerPoint(e.touches[0]);
    const p2 = map.mouseEventToContainerPoint(e.touches[1]);
    this._rotateStarted = false;
    this._twistStartDeg = fingerAngleDeg(p1.subtract(p2));
  };

  proto._onTouchMove = function patchedTouchMove(this: any, e: TouchEvent) {
    if (!e.touches || e.touches.length !== 2 || !(this._zooming || this._rotating)) return;

    const map = this._map;
    const p1 = map.mouseEventToContainerPoint(e.touches[0]);
    const p2 = map.mouseEventToContainerPoint(e.touches[1]);
    const vector = p1.subtract(p2);
    const scale = p1.distanceTo(p2) / this._startDist;
    let nextBearing: number | null = null;

    if (this._rotating) {
      const angle = fingerAngleDeg(vector);
      if (!this._rotateStarted && shouldStartRotating(angle - this._twistStartDeg)) {
        // 閾値を超えた時点の向きを起点にする（ここまでのひねりの分だけ急に回らないように）
        this._rotateStarted = true;
        this._twistStartDeg = angle;
        this._startBearing = map.getBearing();
      }
      if (this._rotateStarted) {
        const delta = normalizeDeg(angle - this._twistStartDeg);
        if (delta) nextBearing = this._startBearing - delta;
      }
    }

    if (this._zooming) {
      this._zoom = map.getScaleZoom(scale, this._startZoom);
      if (!map.options.bounceAtZoomLimits && (
        (this._zoom < map.getMinZoom() && scale < 1) ||
        (this._zoom > map.getMaxZoom() && scale > 1))) {
        this._zoom = map._limitZoom(this._zoom);
      }
      if (map.options.touchZoom === 'center') {
        this._center = this._startLatLng;
        if (scale === 1 && nextBearing === null) return;
      } else {
        const delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
        if (scale === 1 && delta.x === 0 && delta.y === 0 && nextBearing === null) return;
        // 回したあとの向きで中心を求める（回転と拡大を同じフレームで反映するため）
        const bearing = nextBearing ?? map.getBearing();
        const alpha = -bearing * DomUtil.DEG_TO_RAD;
        this._center = map.unproject(map.project(this._pinchStartLatLng).subtract(delta.rotate(alpha)));
      }
    }

    if (!this._moved) {
      map._moveStart(true, false);
      this._moved = true;
    }

    Util.cancelAnimFrame(this._animRequest);
    const center = this._center;
    const zoom = this._zoom;
    this._animRequest = Util.requestAnimFrame(() => {
      if (nextBearing !== null) map.setBearing(nextBearing);
      if (this._zooming && center) map._move(center, zoom, { pinch: true, round: false }, undefined);
    }, this, true);

    DomEvent.preventDefault(e);
  };

  proto.__smoothPatched = true;
}
