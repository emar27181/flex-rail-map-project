import { routes } from '../data/routes';
import type { Station } from '../data/yamanote';

let cache: Station[] | null = null;

/** 全路線から重複を除いた駅一覧を返す（静的データなので一度だけ計算してキャッシュする） */
export function getAllStations(): Station[] {
  if (cache) return cache;
  const map = new Map<string, Station>();
  Object.values(routes).forEach(list => (list as Station[]).forEach(s => {
    if (!map.has(s.name)) map.set(s.name, s);
  }));
  cache = Array.from(map.values());
  return cache;
}
