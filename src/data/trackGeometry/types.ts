/**
 * 路線の線形（実際の線路に沿った座標列）のデータの形。
 *
 * 路線データ（src/data/<路線>.ts）は駅の座標だけを持ち、地図では駅と駅を直線で結んでいた。
 * 線形があれば、駅と駅の間を実際の線路の形（カーブ・分岐の手前の曲がり）で描く。
 * 線形の無い路線は今までどおり直線で描く。
 *
 * 高さの決まり（docs/track-geometry.md）:
 * - 地形の標高（terrainElevationM）と線路自体の標高（trackElevationM）は別の値として持つ
 * - OSM の bridge / tunnel / layer は「上下関係・構造」の情報であり、メートルの高さに変換しない
 * - 分からない値は書かない（欠損）。推測で埋めない
 */

/** 座標 [緯度, 経度]（WGS84, EPSG:4326） */
export type LatLng = [number, number];

/** 線路の構造（出典のタグをそのまま分類したもの。タグが無い区間は 'untagged' で、地上とは限らない） */
export type TrackStructureKind = 'bridge' | 'tunnel' | 'untagged';

export interface TrackStructureSpan {
  /** この区間の points の範囲（両端を含む添字。駅の座標は含めない数え方） */
  fromIndex: number;
  toIndex: number;
  kind: TrackStructureKind;
  /** OSM の layer（相対的な上下関係。高さではない）。タグが無ければ null */
  layer: number | null;
}

/** 隣り合う2駅の間の線形 */
export interface TrackSection {
  /** 駅名（路線データの表記。from → to は路線データの並び順） */
  from: string;
  to: string;
  /** 駅と駅の間の途中の点（両端の駅の座標は含めない） */
  points: LatLng[];
  structures?: TrackStructureSpan[];
  /** 線路自体の標高（m）。出典があるときだけ。points と同じ長さ、不明は null */
  trackElevationM?: (number | null)[];
  /** 地形の標高（m）。線路の標高とは別。出典があるときだけ */
  terrainElevationM?: (number | null)[];
}

export interface TrackGeometrySource {
  name: string;
  url: string;
  license: string;
  /** 取得日 YYYY-MM-DD */
  retrievedAt: string;
  /** 座標系 */
  crs: 'EPSG:4326';
  /** OSM の route リレーション ID など、取得に使った識別子 */
  sourceIds?: string[];
  note?: string;
}

export interface TrackGeometry {
  /** src/data/routes.ts のキー */
  routeKey: string;
  source: TrackGeometrySource;
  /** 高さの基準（標高を持つときだけ。例: 'T.P.（東京湾平均海面）'） */
  heightReference?: string;
  sections: TrackSection[];
}
