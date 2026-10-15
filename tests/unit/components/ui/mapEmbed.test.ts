/**
 * 埋め込み地図（ui/atoms/mapEmbed.ts）の、読み込むまで敷く画像（poster）と、プレビュー画像のパス（seo/mapPreview.ts）。
 * 画像は og:image と同じ「冒頭の地図を撮ったもの」なので、最初の埋め込みにだけ付ける。
 */
import { describe, it, expect } from 'vitest';
import { mapEmbedHtml, withFirstEmbedPoster } from '../../../../src/components/ui/atoms/mapEmbed';
import { mapPreviewPath } from '../../../../src/seo/mapPreview';

describe('埋め込み地図の読み込み中の画像', () => {
  it('poster を渡すと iframe の下に画像を敷く（alt は iframe と同じ説明）', () => {
    const html = mapEmbedHtml({ src: '/?routes=jrnar&embed=1', title: 'JR奈良線だけを表示した地図', poster: '/og/lines/jr-nara-line.jpg' });
    expect(html).toMatch(/<img class="map-embed-poster" src="\/og\/lines\/jr-nara-line\.jpg" alt="JR奈良線だけを表示した地図"[^>]*><iframe /);
  });

  it('poster が無ければ画像を出さない', () => {
    expect(mapEmbedHtml({ src: '/?embed=1', title: 't' })).not.toContain('<img');
  });

  it('記事の本文では最初の埋め込みにだけ付ける', () => {
    const body = [
      mapEmbedHtml({ src: '/?a=1&embed=1', title: '1つ目' }),
      mapEmbedHtml({ src: '/?b=1&embed=1', title: '2つ目' }),
    ].join('\n');
    const out = withFirstEmbedPoster(body, '/og/articles/x.jpg');
    expect(out.match(/map-embed-poster/g)).toHaveLength(1);
    expect(out).toMatch(/alt="1つ目"[^>]*><iframe src="\/\?a=1&amp;embed=1"/);
    expect(withFirstEmbedPoster(body, undefined)).toBe(body);
  });
});

describe('プレビュー画像のパス', () => {
  it('ページのパスと同じ並びで public/og に置く。トップページは対象外', () => {
    expect(mapPreviewPath('/en/lines/jr-nara-line')).toBe('/og/en/lines/jr-nara-line.jpg');
    expect(mapPreviewPath('/guides/sapporo-train-map/')).toBe('/og/guides/sapporo-train-map.jpg');
    expect(mapPreviewPath('/')).toBeUndefined();
  });
});
