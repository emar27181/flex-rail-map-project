import type { Station } from '../data/yamanote';

/** 指定した緯度経度から近い順に上位N件の駅を返す（簡易的な平面距離、東京近辺の短距離比較には十分な精度） */
export function findNearestStations(stations: Station[], lat: number, lng: number, count: number): Station[] {
  return [...stations]
    .sort((a, b) => {
      const distA = (a.lat - lat) ** 2 + (a.lng - lng) ** 2;
      const distB = (b.lat - lat) ** 2 + (b.lng - lng) ** 2;
      return distA - distB;
    })
    .slice(0, count);
}
