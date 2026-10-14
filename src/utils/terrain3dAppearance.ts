import { getThemeColors } from '../contexts/ThemeContext';

export const TERRAIN3D_GROUND_STYLES = ['simple', 'elevation'] as const;
export type Terrain3DGroundStyle = typeof TERRAIN3D_GROUND_STYLES[number];
export const TERRAIN3D_DEFAULT_GROUND_STYLE: Terrain3DGroundStyle = 'simple';
const STORAGE_KEY = 'flex-terrain3d-ground-style';

/** 暗い通常マップの陸・海を再利用。従来の標高配色はテーマごとにそのまま残す。 */
export function terrain3dPalette(style: Terrain3DGroundStyle, theme: 'light' | 'dark') {
  const colors = getThemeColors(theme);
  const map = getThemeColors('dark');
  return style === 'simple'
    ? { low: map.mapLand, high: map.mapLand, water: map.mapSea, background: map.mapSea }
    : { low: colors.terrainLow, high: colors.terrainHigh, water: colors.terrainWater, background: colors.background };
}

export function loadTerrain3dGroundStyle(): Terrain3DGroundStyle {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return TERRAIN3D_GROUND_STYLES.find(style => style === saved) ?? TERRAIN3D_DEFAULT_GROUND_STYLE;
  } catch { return TERRAIN3D_DEFAULT_GROUND_STYLE; }
}

export function saveTerrain3dGroundStyle(style: Terrain3DGroundStyle): void {
  try { window.localStorage.setItem(STORAGE_KEY, style); } catch { /* 保存できなくても表示は切り替える */ }
}
