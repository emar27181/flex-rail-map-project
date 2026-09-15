/**
 * `leaflet-rotate` 自身が認めている未修正のバグ（レンダラーのズレ）に対する
 * 追加パッチ。
 *
 * `leaflet-rotate` の `L.Renderer.prototype._updateTransform`
 * (node_modules/leaflet-rotate/src/layer/vector/Renderer.js) には
 * 作者自身のコメントで以下のように明記されている:
 *
 *   @FIXME layer drifts on `map.setZoom()` (eg. zoom during animation)
 *
 * 原因: 通常のLeafletは、ズーム中は実際の座標を計算し直さず、直前の
 * 状態からのCSS transform（拡大縮小＋平行移動）だけで見た目をごまかし、
 * 静止したとき（'moveend'）に初めて本当の位置へ計算し直す
 * （負荷を抑えるための最適化）。`leaflet-rotate` はこの「ごまかし」の
 * 計算式（`_latLngToNewLayerPoint`）を回転を考慮したものに直しておらず、
 * 一方で駅マーカー（`L.Marker`）側は毎回正確な位置を計算し直す実装に
 * なっているため、2本指ピンチズームの最中だけ路線・地図輪郭（SVG/Canvas
 * レンダラーで描画）と駅マーカーの位置がズレて見える。
 *
 * 対処: 回転が有効なときだけ、「ごまかし」ではなく毎回 `_update()`
 * （実際の座標の再計算＋SVGパスの再描画）を呼ぶようにする。回転していない
 * 通常の地図はこれまでどおり（対象外）。ピンチズーム中の負荷は上がるが、
 * ズレたまま動くよりはこちらを優先する。
 */
export function patchRotatedRendererDrift(leaflet: any): void {
  const RendererProto = leaflet?.Renderer?.prototype;
  if (!RendererProto || RendererProto.__rotateDriftPatched) return;

  const original = RendererProto._updateTransform;
  RendererProto._updateTransform = function patchedUpdateTransform(
    this: any,
    center: unknown,
    zoom: unknown,
  ) {
    if (this._map && this._map._rotate) {
      this._update();
      return;
    }
    return original.apply(this, arguments);
  };
  RendererProto.__rotateDriftPatched = true;
}
