/**
 * 記事のブロック（src/data/articles/types.ts）を本文の HTML にする。
 *
 * 記事ごとに HTML を手で書くと、同じ部品（結論の箱・画像・地図のボタン）の書き方が
 * 記事や言語ごとにずれる。部品の HTML はここだけで作り、見た目は article-layout.css で決める。
 * 地図へのリンク・埋め込みの URL は mapDeepLink.ts で作る（パラメータ名を書かない）。
 */
import { buildMapHref } from './mapDeepLink';
import { EMBED_PARAM } from './embedMode';
import { responsiveTableHtml } from '../components/ui/atoms/responsiveTable';
import { mapEmbedHtml } from '../components/ui/atoms/mapEmbed';
import { ARTICLE_SOURCES } from '../data/articles';
import type { ArticleBlock, ArticleLang, ArticleMapState, ArticleShotSpec, ArticleSource } from '../data/articles/types';

/** 部品に出す決まり文句 */
export const ARTICLE_BLOCK_LABELS: Record<ArticleLang, { points: string; openMap: string }> = {
  ja: { points: 'この記事の結論', openMap: '地図で開く' },
  en: { points: 'Key takeaways', openMap: 'Open the map' },
  zh: { points: '本文结论', openMap: '打开地图' },
  ko: { points: '이 글의 결론', openMap: '지도 열기' },
};


const esc = (s: string) => s.replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');

export function articleMapHref(state: ArticleMapState, lang: ArticleLang, embed = false): string {
  return buildMapHref({ ...state, lang, embed });
}

/**
 * 画面（shots の1つ）を埋め込む URL。どちらも埋め込み表示（?embed=1。テーマを記事に合わせ、設定を保存しない）。
 * 地図は記事の状態で、駅・路線のページは節の位置（#id）で開く
 */
export function shotEmbedSrc(spec: ArticleShotSpec, owner: ArticleSource, lang: ArticleLang): string {
  if (spec.page) return `${lang === 'ja' ? '' : `/${lang}`}${spec.page}?${EMBED_PARAM}=1${spec.anchor ? `#${spec.anchor}` : ''}`;
  const map = typeof spec.map === 'string' ? owner.maps[spec.map] : spec.map;
  if (!map) throw new Error(`${owner.slug}: 画面の撮り方に map も page も無い`);
  return articleMapHref(map, lang, true);
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
      // 表の見せ方（スマホではカード）は静的ページと同じ規格（ui/atoms/responsiveTable.ts）
      return responsiveTableHtml(
        block.head.map((label, i) => ({ label, kind: block.kinds?.[i] ?? (i === 0 ? 'title' : 'text') })),
        block.rows,
      );
    case 'uses':
      return `<div class="uses">${block.items.map(u => `<div class="use"><div class="t"><span class="dot"></span>${u.title}</div><p>${u.text}</p></div>`).join('')}</div>`;
    case 'shot': {
      // 実際の画面を埋め込む（2026-10: スクリーンショットは小さくて読みにくかったため置き換えた）
      const owner = block.article ? ARTICLE_SOURCES.find(a => a.slug === block.article) : source;
      const spec = owner?.shots[block.shot];
      if (!owner || !spec) throw new Error(`${source.slug}: 画面 "${block.shot}" の撮り方（shots）が無い`);
      return mapEmbedHtml({ src: shotEmbedSrc(spec, owner, lang), title: block.alt, caption: block.caption });
    }
    case 'embed': {
      const src = articleMapHref({ ...mapOf(block.map), ...(block.view ?? {}) }, lang, true);
      return mapEmbedHtml({ src, title: block.title, caption: block.caption });
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
