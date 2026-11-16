/**
 * 地図の表示方式。ここだけで定義する（以前は RailwayMap・設定パネルでそれぞれ文字列の組を書いていた）。
 * - realistic: 実際の地図（Leaflet）
 * - track-geometry: 実際の線路に沿う2D地図（Leaflet）
 * - schematic: 路線図風（DiagramMap）
 * - bubble: 駅統計のバブル
 * - terrain3d: 立体（線路の下の地面の標高。Terrain3DView）
 */
export const TRACK_GEOMETRY_VIEW = 'track-geometry';

export const MAP_VIEW_MODES = ['realistic', TRACK_GEOMETRY_VIEW, 'schematic', 'bubble', 'terrain3d'] as const;
export type MapViewMode = typeof MAP_VIEW_MODES[number];
