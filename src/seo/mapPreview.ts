/**
 * ページの「実際の地図画面」のプレビュー画像（検索結果・SNS のサムネイルと、埋め込み地図の読み込み中の表示）。
 *
 * 以前はどのページも og:image がアプリのアイコンで、検索結果を見てもどんな画面なのか分からなかった（2026-10-15）。
 * ページの冒頭に埋め込んである地図（同じ URL・そのページの言語の画面）を撮った画像を使う。作り物の図は使わない。
 *
 * - 画像は `scripts/capture-map-previews.mjs` が、ビルドしたサイトを実際のブラウザで開いて撮る（`npm run og:capture`）
 * - 置き場所は `public/og/{ページのパス}.jpg`。画像が無いページはアプリのアイコンのまま（壊れた画像を出さない）
 * - 地図の表示が変わったら撮り直す。手順は docs/seo.md の「プレビュー画像」
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** 撮る大きさ（og:image の推奨 1200×630）。画面は 800×420 を 1.5 倍で撮る（埋め込みの枠と同じくらいの縮尺で、文字をくっきりさせる） */
export const MAP_PREVIEW = {
  width: 1200,
  height: 630,
  viewport: { width: 800, height: 420 },
  scale: 1.5,
  dir: 'og',
} as const;

/** ページのパス（"/en/lines/jr-nara-line"）→ 画像のパス（"/og/en/lines/jr-nara-line.jpg"）。トップページは対象外 */
export function mapPreviewPath(pagePath: string): string | undefined {
  const p = pagePath.replace(/\/+$/, '').replace(/^\/+/, '');
  if (!p) return undefined;
  return `/${MAP_PREVIEW.dir}/${p}.jpg`;
}

/** そのページの画像があれば、その画像のパス（ビルド時に public を見る） */
export function existingMapPreview(pagePath: string): string | undefined {
  const img = mapPreviewPath(pagePath);
  if (!img) return undefined;
  return existsSync(join(process.cwd(), 'public', img)) ? img : undefined;
}
