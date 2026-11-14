/**
 * Leaflet の DivIcon の使い回し。
 *
 * 駅のマーカーは描き直すたびに新しい DivIcon を作っていて、react-leaflet は icon が変わったと見て
 * 全マーカーの DOM を作り直していた（終電モードのように駅が多いと、動かすたび・押すたびに数百個を作り直して重かった。2026-11-13）。
 * 見た目（html・クラス・大きさ・基準点）が同じなら同じ DivIcon を返し、変わらないマーカーの DOM はそのまま残す。
 *
 * 見た目が少しでも違えば別のアイコンになる（キーは中身そのもの）ので、表示は変わらない。
 * 数が増えすぎたら全部捨てる（ズームや言語を変え続けたときにメモリを使い続けない）。
 */

/** 保持するアイコンの上限。ズーム・言語・テーマを何度も変えても、これを超えたら作り直す */
export const DIV_ICON_CACHE_LIMIT = 4000;

export interface DivIconOptions {
  html: string;
  className?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
}

type DivIconCtor<T> = new (options: DivIconOptions) => T;

const cache = new Map<string, unknown>();
const ctorIds = new WeakMap<object, number>();
let nextCtorId = 1;

function ctorId(ctor: object): number {
  let id = ctorIds.get(ctor);
  if (id === undefined) { id = nextCtorId++; ctorIds.set(ctor, id); }
  return id;
}

export function cachedDivIcon<T>(DivIcon: DivIconCtor<T>, options: DivIconOptions): T {
  const key = [
    ctorId(DivIcon), options.className ?? '', options.iconSize?.join(',') ?? '', options.iconAnchor?.join(',') ?? '', options.html,
  ].join('\u0000');
  const hit = cache.get(key);
  if (hit) return hit as T;
  if (cache.size >= DIV_ICON_CACHE_LIMIT) cache.clear();
  const icon = new DivIcon(options);
  cache.set(key, icon);
  return icon;
}

/** テスト用: 保持しているアイコンの数 */
export function divIconCacheSize(): number {
  return cache.size;
}
/** テスト用: 捨てる */
export function clearDivIconCache(): void {
  cache.clear();
}
