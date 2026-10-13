/**
 * 地図の表示方式。ここだけで定義する（以前は RailwayMap・設定パネルでそれぞれ文字列の組を書いていた）。
 * - realistic: 実際の地図（Leaflet）
 * - schematic: 路線図風（DiagramMap）
 * - bubble: 駅統計のバブル
 * - terrain3d: 立体（線路の下の地面の標高。Terrain3DView）
 */
export type MapViewMode = 'realistic' | 'schematic' | 'bubble' | 'terrain3d';
