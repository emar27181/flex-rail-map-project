/**
 * 駅名が同じ別の駅を取り違えないための照合。
 *
 * 路線データは駅を名前で持つため、名前だけで「この駅を通る路線」を探すと、
 * 大宮（埼玉）を選んだのに京都の阪急京都線「大宮」まで引っかかっていた。
 * 同名の別駅は数十km以上離れている一方、同じ駅でも路線ごとに座標が
 * 数百mずれている（武蔵小杉の横須賀線ホーム、渋谷など）ので、
 * 名前が同じで SAME_STATION_MAX_KM 以内なら同じ駅とみなす。
 */

/** 同じ駅とみなす座標の最大距離（km） */
export const SAME_STATION_MAX_KM = 5;

export interface StationRef {
  name: string;
  lat?: number;
  lng?: number;
}

/** 2点間のおおよその距離（km）。数km単位の判定なので平面近似で足りる */
export function approxDistanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const kmPerDegLat = 111;
  const kmPerDegLng = 111 * Math.cos(((aLat + bLat) / 2) * (Math.PI / 180));
  return Math.hypot((aLat - bLat) * kmPerDegLat, (aLng - bLng) * kmPerDegLng);
}

/**
 * candidate が ref と同じ駅か。
 * ref に座標が無い（名前しか分からない）ときは名前だけで判定する。
 */
export function isSameStation(candidate: { name: string; lat: number; lng: number }, ref: StationRef): boolean {
  if (candidate.name !== ref.name) return false;
  if (ref.lat === undefined || ref.lng === undefined) return true;
  return approxDistanceKm(candidate.lat, candidate.lng, ref.lat, ref.lng) <= SAME_STATION_MAX_KM;
}
