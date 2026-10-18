/**
 * 記事のブロック（src/data/articles/types.ts）を本文の HTML にする。
 *
 * 記事ごとに HTML を手で書くと、同じ部品（結論の箱・画像・地図のボタン）の書き方が
 * 記事や言語ごとにずれる。部品の HTML はここだけで作り、見た目は article-layout.css で決める。
 * 地図へのリンク・埋め込みの URL は mapDeepLink.ts で作る（パラメータ名を書かない）。
 */
import { buildMapHref } from './mapDeepLink';
import { fitVisibleRoutes } from './routeMapViewport';
import { EMBED_PARAM, EMBED_SECTION_PARAM } from './embedMode';
import { responsiveTableHtml } from '../components/ui/atoms/responsiveTable';
import { mapEmbedHtml } from '../components/ui/atoms/mapEmbed';
import { adSlotHtml } from '../components/ui/atoms/adSlot';
import { ADSENSE_SLOTS } from '../config/ads';
import { ARTICLE_SOURCES } from '../data/articles';
import { findArticleStation, resolveArticleTokens } from './articleFacts';
import type { ArticleBlock, ArticleLang, ArticleMapState, ArticleShotSpec, ArticleSource } from '../data/articles/types';

/** 部品に出す決まり文句 */
export const ARTICLE_BLOCK_LABELS: Record<ArticleLang, { points: string; openMap: string }> = {
  ja: { points: 'この記事の結論', openMap: '地図で開く' },
  en: { points: 'Key takeaways', openMap: 'Open the map' },
  zh: { points: '本文结论', openMap: '打开地图' },
  ko: { points: '이 글의 결론', openMap: '지도 열기' },
};


const esc = (s: string) => s.replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');

/** focus（駅を中心に開く）で zoom を書かなかったときの拡大率（駅とその両隣が見える程度） */
export const ARTICLE_FOCUS_ZOOM = 14;

export function articleMapHref(state: ArticleMapState, lang: ArticleLang, embed = false): string {
  const { focus, view, ...rest } = state;
  let center = rest.center;
  let zoom = rest.zoom;
  if (focus && !center) {
    const st = findArticleStation(focus);
    if (!st) throw new Error(`地図の focus: 路線 ${focus.route} に駅「${focus.name}」が無い`);
    center = [st.lat, st.lng];
    zoom = zoom ?? ARTICLE_FOCUS_ZOOM;
  } else if (!center && rest.routes?.length) {
    // 路線フィルタがある場合、記事内に固定されたズーム値よりも全線表示を優先。
    // 単路線・複数路線とも設定は routeMapViewport.ts で一元管理する。
    const fitted = fitVisibleRoutes(rest.routes);
    if (fitted) {
      center = fitted.center;
      zoom = fitted.zoom;
    }
  }
  return buildMapHref({ ...rest, center, zoom, view3d: view === '3d', lang, embed });
}

/**
 * 画面（shots の1つ）を埋め込む URL。どちらも埋め込み表示（?embed=1。テーマを記事に合わせ、設定を保存しない）。
 * 地図は記事の状態で、駅・路線のページは節の位置（?section=id）で開く。
 * `#id` は使わない: ブラウザが記事のページごとその位置までスクロールし、記事が途中から表示されていた
 */
/** 埋め込んだ画面を、埋め込みでない普通の画面で開く URL（「地図を大きく開く」のリンク） */
export function shotOpenHref(spec: ArticleShotSpec, owner: ArticleSource, lang: ArticleLang): string {
  if (spec.page) return `${lang === 'ja' ? '' : `/${lang}`}${spec.page}${spec.anchor ? `#${spec.anchor}` : ''}`;
  const map = typeof spec.map === 'string' ? owner.maps[spec.map] : spec.map;
  if (!map) throw new Error(`${owner.slug}: 画面の撮り方に map も page も無い`);
  return articleMapHref(map, lang);
}

export function shotEmbedSrc(spec: ArticleShotSpec, owner: ArticleSource, lang: ArticleLang): string {
  if (spec.page) return `${lang === 'ja' ? '' : `/${lang}`}${spec.page}?${EMBED_PARAM}=1${spec.anchor ? `&${EMBED_SECTION_PARAM}=${encodeURIComponent(spec.anchor)}` : ''}`;
  const map = typeof spec.map === 'string' ? owner.maps[spec.map] : spec.map;
  if (!map) throw new Error(`${owner.slug}: 画面の撮り方に map も page も無い`);
  return articleMapHref(map, lang, true);
}

/** 見出しの id（目次から飛ぶ先）。言語に依らず section-1, section-2… */
export const articleSectionId = (n: number) => `section-${n}`;

/** 目次（見出しの文と飛ぶ先）。描画と同じ並び（冒頭のデモを前に出した後）で数える */
export function articleToc(source: ArticleSource, lang: ArticleLang): Array<{ id: string; text: string }> {
  return articleBlocksForRender(source, lang)
    .filter((b): b is Extract<ArticleBlock, { type: 'h2' }> => b.type === 'h2')
    .map((b, i) => ({ id: articleSectionId(i + 1), text: resolveArticleTokens(b.text, lang, source.slug) }));
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
      return `<h2 id="${articleSectionId(h2Index.n)}"><span class="num">${String(h2Index.n).padStart(2, '0')}</span><span>${block.text}</span></h2>`;
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
      return mapEmbedHtml({
        src: shotEmbedSrc(spec, owner, lang), title: block.alt, caption: block.caption,
        openHref: shotOpenHref(spec, owner, lang), lang, demoId: `${owner.slug}/${block.shot}`,
      });
    }
    case 'embed': {
      const state = { ...mapOf(block.map), ...(block.view ?? {}) };
      return mapEmbedHtml({
        src: articleMapHref(state, lang, true), title: block.title, caption: block.caption,
        openHref: articleMapHref(state, lang), lang, demoId: `${source.slug}/${block.map}`,
      });
    }
    case 'cta':
      return `<div class="cta"><h3>${block.title}</h3><p>${block.text}</p><a class="btn" href="${esc(articleMapHref(mapOf(block.map), lang))}">${labels.openMap} <span class="ar">→</span></a></div>`;
    case 'html':
      return block.html;
  }
}

/**
 * 記事は「結論を読む → まず実物を触る → 詳しい説明を読む」の順にする。
 * データ側で embed を末尾近くに置いている既存記事もあるため、描画時に最初の地図デモを
 * 結論（points）の直後へ昇格させる。これで全記事・全言語に同じ規則が適用される。
 */
export function articleBlocksForRender(source: ArticleSource, lang: ArticleLang): ArticleBlock[] {
  const blocks = source.content[lang].blocks;
  const demoIndex = blocks.findIndex(b => b.type === 'embed');
  const ordered = demoIndex <= 1 ? blocks : [
    blocks[0],
    blocks[demoIndex],
    ...blocks.slice(1, demoIndex),
    ...blocks.slice(demoIndex + 1),
  ];
  // 冒頭のデモと同じ画面を、本文でもう一度埋め込まない（同じ地図が2つ続いて見えていた）
  const seen = new Set<string>();
  return ordered.filter(b => {
    const src = blockEmbedSrc(b, source, lang);
    if (!src) return true;
    if (seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

/** 画面を埋め込むブロック（embed・shot）の URL。ほかのブロックは null */
function blockEmbedSrc(block: ArticleBlock, source: ArticleSource, lang: ArticleLang): string | null {
  if (block.type === 'embed') {
    const map = source.maps[block.map];
    return map ? articleMapHref({ ...map, ...(block.view ?? {}) }, lang, true) : null;
  }
  if (block.type === 'shot') {
    const owner = block.article ? ARTICLE_SOURCES.find(a => a.slug === block.article) : source;
    const spec = owner?.shots[block.shot];
    return owner && spec ? shotEmbedSrc(spec, owner, lang) : null;
  }
  return null;
}

/**
 * 本文の広告の置き方。結論とその直後の地図のデモの近くには置かず（読む前に広告を見せない・地図の操作と押し間違えさせない）、
 * 4つ目の見出しの前から、長文の記事も最大1枠までに抑える。
 * 冒頭と地図デモの操作近くを避け、短い記事には挿入しない。
 */
export const ARTICLE_AD_FIRST_SECTION = 4;
export const ARTICLE_AD_EVERY_SECTIONS = 999;

/**
 * 広告のすぐ上に来てよいか。地図を開くボタン・中身の分からない HTML・説明文の無い地図のデモの下には置かない
 * （地図のデモの下には「地図を大きく開く」などのボタンがある。説明文があれば、ボタンと広告の間に文が挟まる）
 */
function adSafeAfter(block: ArticleBlock): boolean {
  if (block.type === 'cta' || block.type === 'html') return false;
  if (block.type === 'embed' || block.type === 'shot') return Boolean(block.caption);
  return true;
}

/**
 * 本文に広告を置く節の番号（1始まり。その節の見出しの前に置く）。
 * 候補の節の直前がボタン・説明文の無い地図なら、次の候補の手前までの範囲で後ろの節へずらす。置ける所が無ければ置かない
 */
export function articleAdSections(blocks: ArticleBlock[]): number[] {
  const h2At = blocks.flatMap((b, i) => (b.type === 'h2' ? [i] : []));
  const sections: number[] = [];
  for (let k = ARTICLE_AD_FIRST_SECTION; k <= h2At.length; k += ARTICLE_AD_EVERY_SECTIONS) {
    for (let s = k; s <= h2At.length && s < k + ARTICLE_AD_EVERY_SECTIONS; s++) {
      const prev = blocks[h2At[s - 1] - 1];
      if (prev && adSafeAfter(prev)) { sections.push(s); break; }
    }
  }
  return sections;
}

export function renderArticleBody(source: ArticleSource, lang: ArticleLang): string {
  const h2Index = { n: 0 };
  const blocks = articleBlocksForRender(source, lang);
  const adSections = articleAdSections(blocks);
  const html = blocks.map(b => {
    const ad = b.type === 'h2' && adSections.includes(h2Index.n + 1)
      ? adSlotHtml({ slot: ADSENSE_SLOTS.articleInline, lang, position: `inline-${adSections.indexOf(h2Index.n + 1) + 1}` }) + '\n'
      : '';
    return ad + renderBlock(b, source, lang, h2Index);
  }).join('\n');
  // 駅番号・駅名の差し込み（articleFacts.ts）。データに無いものはここで止まる
  return resolveArticleTokens(html, lang, `${source.slug} (${lang})`);
}
