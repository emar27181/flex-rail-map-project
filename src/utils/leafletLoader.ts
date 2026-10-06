/**
 * 地図ライブラリ（react-leaflet / leaflet / leaflet-rotate）の読み込みを1つの Promise にまとめる。
 *
 * 以前は RailwayMap がマウントしてから取得を始めていたため、
 * 「アプリ本体の JS → leaflet → leaflet-rotate」と直列に待っていた。
 * ページのスクリプト（index.astro）から先に呼んでおくと、本体の JS と並行して取得が進み、
 * RailwayMap は同じ Promise を受け取るだけになる（2回目以降の呼び出しは同じものを返す）。
 */
export interface LeafletModules {
  reactLeaflet: typeof import('react-leaflet');
  leaflet: typeof import('leaflet');
}

let pending: Promise<LeafletModules> | null = null;

export function loadLeafletModules(): Promise<LeafletModules> {
  if (pending) return pending;
  pending = (async () => {
    const [reactLeaflet, leaflet] = await Promise.all([import('react-leaflet'), import('leaflet')]);
    // leaflet-rotate はグローバルな `L` にプロトタイプ拡張を行う昔ながらのプラグイン形式のため、
    // バンドラー経由で読み込んだ leaflet を window.L に橋渡ししてから読み込む。
    // react-leaflet も同じ leaflet の単一インスタンスを使うので、拡張がそのまま反映される
    if (typeof window !== 'undefined' && !(window as any).L) {
      (window as any).L = leaflet;
    }
    await import('leaflet-rotate');
    return { reactLeaflet, leaflet };
  })();
  // 失敗したら次の呼び出しでやり直せるようにする
  pending.catch(() => { pending = null; });
  return pending;
}
