import { afterEach, describe, expect, it, vi } from 'vitest';
import { PerspectiveCamera, Vector3 } from 'three';
import { terrain3dPalette, loadTerrain3dGroundStyle, saveTerrain3dGroundStyle } from '../../../../src/utils/terrain3dAppearance';
import { captureTerrainCamera, restoreTerrainCamera } from '../../../../src/utils/terrain3dCamera';
import { getThemeColors } from '../../../../src/contexts/ThemeContext';

afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

describe('立体表示の地表カラー', () => {
  it.each(['light', 'dark'] as const)('%sでもシンプル表示は通常マップの暗い陸・海を共有する', theme => {
    const palette = terrain3dPalette('simple', theme), map = getThemeColors('dark');
    expect(palette.low).toBe(map.mapLand);
    expect(palette.high).toBe(palette.low);
    expect(palette.water).toBe(map.mapSea);
    expect(palette.background).toBe(map.mapSea);
  });
  it.each(['light', 'dark'] as const)('%sの従来の標高配色を維持する', theme => {
    const colors = getThemeColors(theme);
    expect(terrain3dPalette('elevation', theme)).toEqual({ low: colors.terrainLow, high: colors.terrainHigh, water: colors.terrainWater, background: colors.background });
  });
  it('シンプルが既定で、標高表示への切り替えを保存・復元できる', () => {
    expect(loadTerrain3dGroundStyle()).toBe('simple');
    saveTerrain3dGroundStyle('elevation');
    expect(loadTerrain3dGroundStyle()).toBe('elevation');
  });
  it('保存が拒否されても動作し、不正な値は既定に戻す', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid');
    expect(loadTerrain3dGroundStyle()).toBe('simple');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(() => saveTerrain3dGroundStyle('simple')).not.toThrow();
  });
});

describe('立体表示の視点保持', () => {
  it('高さ・カラー変更後も移動・回転・ズームした視点を厳密に復元する', () => {
    const previous = new PerspectiveCamera(45, 1.5, 0.01, 500);
    previous.position.set(12, 8, -5); previous.zoom = 2;
    const target = new Vector3(5, 2, -3);
    previous.lookAt(target);
    const saved = captureTerrainCamera(previous, target, 'same-frame');
    const camera = new PerspectiveCamera(45, 1.5, 1, 100), newTarget = new Vector3();
    expect(restoreTerrainCamera(camera, newTarget, 'same-frame', saved)).toBe(true);
    expect(camera.position.toArray()).toEqual(previous.position.toArray());
    expect(newTarget.toArray()).toEqual(target.toArray());
    expect(camera.quaternion.toArray()).toEqual(previous.quaternion.toArray());
    expect(camera.zoom).toBe(2);
    expect(camera.near).toBe(previous.near);
    expect(camera.far).toBe(previous.far);
    previous.position.set(100, 100, 100);
    expect(saved.position).toEqual([12, 8, -5]);
  });
  it('初回と異なる路線範囲では古い視点を適用しない', () => {
    const camera = new PerspectiveCamera(), target = new Vector3();
    expect(restoreTerrainCamera(camera, target, 'new', null)).toBe(false);
    const saved = captureTerrainCamera(camera, target, 'old');
    camera.position.set(10, 20, 30);
    expect(restoreTerrainCamera(camera, target, 'new', saved)).toBe(false);
    expect(camera.position.toArray()).toEqual([10, 20, 30]);
  });
});
