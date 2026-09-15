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
 * 原因: 通常のLeafletは、ズーム中は各頂点の座標を再計算せず、直前の
 * 状態（`layer._parts`、緯度経度→ピクセル変換の結果をキャッシュしたもの）を
 * そのまま使い、コンテナ全体にCSS transform（拡大縮小＋平行移動）をかけて
 * 見た目をごまかす（負荷を抑えるための最適化）。静止したとき（'moveend'/
 * 'viewreset'）に初めて全頂点を本当の位置へ計算し直す。
 * `leaflet-rotate` はこの「ごまかし」の計算式（`_latLngToNewLayerPoint`）を
 * 回転を考慮したものに直していないため、この“ごまかし”のスケール・平行移動が
 * 常に不正確になる。一方、駅マーカー（`L.Marker`）は常に正確な位置を
 * 計算し直す実装のため、2本指ピンチズームの最中だけ路線・地図輪郭
 * （SVG/Canvasレンダラーで描画）と駅マーカーの位置・縮尺がズレて見える。
 *
 * 対処: 回転が有効なときだけ、「ごまかし」ではなく毎回
 * `_update()`（コンテナ自体の再配置）に加えて、各レイヤーの`_reset()`
 * （緯度経度→ピクセルの再投影＋パスの再描画）まで呼ぶようにする。
 * `_update()`だけでは頂点データ自体が古いズーム時点のままになり、
 * コンテナだけ新しいズームに合わせて動いて頂点は動かない
 * （＝路線の形・縮尺だけが一瞬おかしく見える）ため、頂点の再投影まで
 * 必要だった。回転していない通常の地図はこれまでどおり（対象外）。
 * ピンチズーム中の負荷は上がるが、ズレたまま動くよりはこちらを優先する。
 *
 * （`_reset()`を直接呼ばないのは、`Renderer.prototype._reset()`が内部で
 * 再度`this._updateTransform(...)`を呼ぶため、素直に委譲すると
 * このパッチ自身を再帰的に呼んでしまうため。`_reset()`と同じ処理を
 * ここで直接展開している）
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
      for (const id in this._layers) {
        this._layers[id]._reset();
      }
      return;
    }
    return original.apply(this, arguments);
  };
  RendererProto.__rotateDriftPatched = true;
}
