/**
 * `leaflet-rotate` 自身が認めている未修正のバグ（回転時、ピンチズーム中に
 * 路線・地図輪郭が駅マーカーからズレる）への追加パッチのテスト。
 *
 * 実際の Leaflet インスタンスは重いため、ここでは
 * `Renderer.prototype._updateTransform` の呼び分けロジックだけを
 * 最小限のダミーオブジェクトで検証する。
 */
import { describe, it, expect, vi } from 'vitest';
import { patchRotatedRendererDrift } from '../../../src/utils/leafletRotatePatch';

function makeFakeLeaflet() {
  const original = vi.fn();
  return {
    Renderer: {
      prototype: {
        _updateTransform: original,
      },
    },
  };
}

describe('patchRotatedRendererDrift', () => {
  it('回転が有効なときは _update() を呼び、元の _updateTransform は呼ばない', () => {
    const leaflet = makeFakeLeaflet();
    const original = leaflet.Renderer.prototype._updateTransform;
    patchRotatedRendererDrift(leaflet);

    const update = vi.fn();
    const ctx = { _map: { _rotate: true }, _update: update };
    leaflet.Renderer.prototype._updateTransform.call(ctx, 'center', 5);

    expect(update).toHaveBeenCalledTimes(1);
    expect(original).not.toHaveBeenCalled();
  });

  it('回転していないときは元の _updateTransform をそのまま呼ぶ（非回転の地図には影響しない）', () => {
    const leaflet = makeFakeLeaflet();
    const original = leaflet.Renderer.prototype._updateTransform;
    patchRotatedRendererDrift(leaflet);

    const update = vi.fn();
    const ctx = { _map: { _rotate: false }, _update: update };
    leaflet.Renderer.prototype._updateTransform.call(ctx, 'center', 5);

    expect(update).not.toHaveBeenCalled();
    expect(original).toHaveBeenCalledWith('center', 5);
  });

  it('_map が無い状態でも壊れない（マウント直後などの防御）', () => {
    const leaflet = makeFakeLeaflet();
    const original = leaflet.Renderer.prototype._updateTransform;
    patchRotatedRendererDrift(leaflet);

    const ctx = { _map: null };
    expect(() => leaflet.Renderer.prototype._updateTransform.call(ctx, 'center', 5)).not.toThrow();
    expect(original).toHaveBeenCalledWith('center', 5);
  });

  it('二重に適用しても多重ラップしない（冪等）', () => {
    const leaflet = makeFakeLeaflet();
    patchRotatedRendererDrift(leaflet);
    const onceWrapped = leaflet.Renderer.prototype._updateTransform;
    patchRotatedRendererDrift(leaflet);
    expect(leaflet.Renderer.prototype._updateTransform).toBe(onceWrapped);
  });

  it('Renderer が無い leaflet オブジェクトを渡されても壊れない', () => {
    expect(() => patchRotatedRendererDrift({})).not.toThrow();
    expect(() => patchRotatedRendererDrift(null)).not.toThrow();
  });
});
