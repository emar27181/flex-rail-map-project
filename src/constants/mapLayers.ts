/**
 * 地図の上の重なり順（どれが上に描かれるか）の唯一の定義。
 *
 * ■ Pane（層）: Leaflet の markerPane は z-index 600。それより下・上に置く専用の層
 * ■ zIndexOffset: 同じ markerPane の中の重なり順。Leaflet は「画面上のY座標(px) + zIndexOffset」で
 *   並べるため、段の差が画面の高さより小さいと、下の方にある駅が上に来てしまう
 *   （以前は路線数の段が1000刻みで、乗換の多い駅のラベルが少ない駅のラベルの下に隠れることがあった）
 *
 * 値を変えるときはここだけを直す。RailwayMap に数値を直書きしない（tests/unit/constants/mapLayers.test.ts）。
 */

/** 専用の層の z-index（markerPane = 600 との大小で前後が決まる） */
export const MAP_PANE_Z = {
  /** 駅間の所要時間の丸。駅アイコン（markerPane）より後ろ */
  travelTime: 550,
  /** 現在地。駅アイコンより後ろ（駅を隠さない） */
  userLocation: 590,
  /** 列車の走行デモ。駅アイコンより前 */
  trainDemo: 620,
} as const;

/** 1段あたりの zIndexOffset。画面の高さ（数千px）より十分大きくし、Y座標で順番が逆転しないようにする */
export const MARKER_Z_STEP = 100_000;

/** 路線数の段の上限（これより多い駅は同じ段。最多の新宿・東京でも収まる） */
export const MARKER_Z_MAX_ROUTES = 60;

/**
 * 駅アイコン・駅名ラベルの zIndexOffset。路線数が多い駅ほど上に描く（同じ路線数なら画面の下の駅が上）。
 * 乗換の多い駅の名前は位置の目印になるので、周りの小さな駅のラベルに隠れないようにする
 */
export function stationMarkerZ(routeCount: number): number {
  const n = Math.max(1, Math.min(Math.floor(routeCount), MARKER_Z_MAX_ROUTES));
  return n * MARKER_Z_STEP;
}

/** 出発駅・到着駅のラベル。どの駅よりも上 */
export const ENDPOINT_MARKER_Z = (MARKER_Z_MAX_ROUTES + 1) * MARKER_Z_STEP;

/** 現在地マーカー（userLocation の層の中）と、列車デモ（同じ層の中）の zIndexOffset */
export const USER_LOCATION_MARKER_Z = MARKER_Z_STEP;
export const TRAIN_DEMO_MARKER_Z = 2 * MARKER_Z_STEP;
/** 所要時間の丸（travelTime の層の中） */
export const TRAVEL_TIME_MARKER_Z = MARKER_Z_STEP;
