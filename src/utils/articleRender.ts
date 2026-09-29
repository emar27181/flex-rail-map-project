/**
 * 記事のブロック（src/data/articles/types.ts）を本文の HTML にする。
 *
 * 記事ごとに HTML を手で書くと、同じ部品（結論の箱・画像・地図のボタン）の書き方が
 * 記事や言語ごとにずれる。部品の HTML はここだけで作り、見た目は article-layout.css で決める。
 * 地図へのリンク・埋め込みの URL は mapDeepLink.ts で作る（パラメータ名を書かない）。
 */
import { buildMapHref } from './mapDeepLink';
import type { ArticleBlock, ArticleLang, ArticleMapState, ArticleSource } from '../data/articles/types';

/** 部品に出す決まり文句 */
export const ARTICLE_BLOCK_LABELS: Record<ArticleLang, { points: string; openMap: string; embedActivate: string }> = {
  ja: { points: 'この記事の結論', openMap: '地図で開く', embedActivate: 'タップして地図を動かす' },
  en: { points: 'Key takeaways', openMap: 'Open the map', embedActivate: 'Tap to use the map' },
  zh: { points: '本文结论', openMap: '打开地图', embedActivate: '点击后操作地图' },
  ko: { points: '이 글의 결론', openMap: '지도 열기', embedActivate: '눌러서 지도 움직이기' },
};

/** 画像の置き場所（撮影スクリプトの出力先と同じ） */
export const articleImagePath = (slug: string, shot: string, lang: ArticleLang) => `/images/articles/${slug}/${shot}-${lang}.webp`;
/** スクリーンショットの寸法（撮影スクリプトの出力: 1000×640 を幅1200に縮小） */
export const ARTICLE_SHOT_WIDTH = 1200;
export const ARTICLE_SHOT_HEIGHT = 768;

const esc = (s: string) => s.replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');

export function articleMapHref(state: ArticleMapState, lang: ArticleLang, embed = false): string {
  return buildMapHref({ ...state, lang, embed });
}

function renderBlock(block: ArticleBlock, source: ArticleSource, lang: ArticleLang, h2Index: { n: number }): string {
  const labels = ARTICLE_BLOCK_LABELS[lang];
  const mapOf = (key: string): ArticleMapState => {
    const m = source.maps[key];
    if (!m) throw new Error(`${source.slug}: 地図の状態 "${key}" が maps に無い`);
    return m;
  };
  switch (block.type) {
    case 'points':
      return `<div class="points"><div class="ttl">${labels.points}</div><ul>${block.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`;
    case 'h2':
      h2Index.n += 1;
      return `<h2><span class="num">${String(h2Index.n).padStart(2, '0')}</span><span>${block.text}</span></h2>`;
    case 'h3':
      return `<h3>${block.text}</h3>`;
    case 'p':
      return `<p>${block.text}</p>`;
    case 'ul':
      return `<ul>${block.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    case 'steps':
      return `<ol class="steps">${block.items.map(i => `<li><strong>${i}</strong></li>`).join('')}</ol>`;
    case 'table':
      return `<div class="tbl"><table><thead><tr>${block.head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${
        block.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'uses':
      return `<div class="uses">${block.items.map(u => `<div class="use"><div class="t"><span class="dot"></span>${u.title}</div><p>${u.text}</p></div>`).join('')}</div>`;
    case 'shot': {
      const src = articleImagePath(block.article ?? source.slug, block.shot, lang);
      return `<figure class="shot"><a href="${src}"><img src="${src}" width="${ARTICLE_SHOT_WIDTH}" height="${ARTICLE_SHOT_HEIGHT}" loading="lazy" decoding="async" alt="${esc(block.alt)}"></a><figcaption>${block.caption}</figcaption></figure>`;
    }
    case 'embed': {
      const src = articleMapHref({ ...mapOf(block.map), ...(block.view ?? {}) }, lang, true);
      return `<figure class="embed"><div class="embed-frame" data-activate-label="${esc(labels.embedActivate)}"><iframe src="${esc(src)}" title="${esc(block.title)}" loading="lazy"></iframe></div><figcaption>${block.caption}</figcaption></figure>`;
    }
    case 'cta':
      return `<div class="cta"><h3>${block.title}</h3><p>${block.text}</p><a class="btn" href="${esc(articleMapHref(mapOf(block.map), lang))}">${labels.openMap} <span class="ar">→</span></a></div>`;
    case 'html':
      return block.html;
  }
}

export function renderArticleBody(source: ArticleSource, lang: ArticleLang): string {
  const h2Index = { n: 0 };
  return source.content[lang].blocks.map(b => renderBlock(b, source, lang, h2Index)).join('\n');
}
