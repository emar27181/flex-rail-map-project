/**
 * 記事の中に置く広告枠（Google AdSense の記事内広告）の規格。
 *
 * どこに置くかは使う側が決める（記事は utils/articleRender.ts の articleAdSections）。ここは枠の HTML・CSS・
 * スクリプトだけを持つ。
 *
 * - 広告を出すのは本番のサイト（utils/siteHost.ts の PRODUCTION_ORIGIN）だけ。プレビュー・手元では広告を
 *   読み込まず、置かれる位置が分かるように「広告枠」の箱を出す（目で位置を確かめるため。広告の表示・クリックを
 *   自分で発生させない）
 * - 広告ユニット ID（config/ads.ts の ADSENSE_SLOTS）が空なら、本番では枠ごと消す（空の箱を出さない）
 * - 広告が配信されなかった（data-ad-status="unfilled"）ときも枠ごと隠す
 * - 枠の上に「広告」と書く。本文・地図のデモと見分けが付くように、上に線を引いて間を空ける
 *   （地図のボタンの近くで押し間違えさせない。AdSense の「誤クリックを誘う配置」の禁止）
 * - どの広告が出るかは AdSense がページの内容（記事の言語・地名・話題）と閲覧者から選ぶ。こちらで広告主を指定できない
 *
 * 色は各レイアウトが CSS 変数で渡す: `--ad-border`（線・箱）/ `--ad-muted`（「広告」の文字）。
 */
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import { ADSENSE_CLIENT } from '../../../config/ads';
import { PRODUCTION_ORIGIN } from '../../../utils/siteHost';

export const AD_CLASS = { slot: 'ad-slot', label: 'ad-slot-label', placeholder: 'ad-slot-placeholder' } as const;

/** 枠の上の表記と、本番以外で出す箱の文言（言語ごと） */
export const AD_SLOT_LABELS = {
  ja: { label: '広告', placeholder: '広告枠（本番のサイトでだけ広告が表示されます）' },
  en: { label: 'Advertisement', placeholder: 'Ad space (ads appear only on the live site)' },
  zh: { label: '广告', placeholder: '广告位（仅在正式网站上显示广告）' },
  ko: { label: '광고', placeholder: '광고 영역(정식 사이트에서만 광고가 표시됩니다)' },
} as const;
export type AdSlotLang = keyof typeof AD_SLOT_LABELS;

export interface AdSlotProps {
  /** 広告ユニット ID。空なら本番では出さない */
  slot: string;
  lang: AdSlotLang;
  /** 位置の名前（本文の何番目か。確かめるときの目印） */
  position: string;
}

export function adSlotHtml({ slot, lang, position }: AdSlotProps): string {
  const t = AD_SLOT_LABELS[lang];
  return `<aside class="${AD_CLASS.slot}" data-ad-position="${position}" aria-label="${t.label}">`
    + `<span class="${AD_CLASS.label}">${t.label}</span>`
    + `<p class="${AD_CLASS.placeholder}">${t.placeholder}</p>`
    + (slot
      ? `<ins class="adsbygoogle" style="display:block; text-align:center;" data-ad-client="${ADSENSE_CLIENT}" data-ad-slot="${slot}"`
        + ` data-ad-format="fluid" data-ad-layout="in-article"></ins>`
      : '')
    + `</aside>`;
}

/** 枠はスクリプトが本番（is-live）か本番以外（is-preview）かを決めるまで出さない */
export const AD_INLINE_MAX_WIDTH = '320px';

export const AD_SLOT_CSS = `
.${AD_CLASS.slot} { display: none; margin: ${L.sp['3xl']} 0; padding-top: ${L.sp.sm}; border-top: 1px solid var(--ad-border, currentColor); }
.${AD_CLASS.slot}.is-live, .${AD_CLASS.slot}.is-preview { display: block; }
.${AD_CLASS.slot}[data-ad-position^="inline-"] { width: min(100%, ${AD_INLINE_MAX_WIDTH}); margin-inline: auto; }
.${AD_CLASS.slot}.is-live:has(ins.adsbygoogle[data-ad-status="unfilled"]) { display: none; }
.${AD_CLASS.label} { display: block; margin-bottom: ${L.sp.sm}; font-size: ${FS.caption}; line-height: 1.7; color: var(--ad-muted, inherit); }
.${AD_CLASS.placeholder} {
  display: none; margin: 0; padding: ${L.sp['3xl']}; text-align: center; font-size: ${FS.caption}; line-height: 1.7;
  color: var(--ad-muted, inherit); border: 1px dashed var(--ad-border, currentColor); border-radius: ${L.r.card};
}
.${AD_CLASS.slot}.is-preview .${AD_CLASS.placeholder} { display: block; }
`;

/** 枠のスクリプト（ページに1回だけ、枠より後に入れる） */
export const AD_SLOT_SCRIPT = `(function(){
  var slots = document.querySelectorAll('.${AD_CLASS.slot}');
  if (!slots.length) return;
  var live = location.origin === ${JSON.stringify(PRODUCTION_ORIGIN)};
  slots.forEach(function (el) {
    var ins = el.querySelector('ins.adsbygoogle');
    if (!live) {
      // プレビュー・手元: 広告は読み込まず、位置だけ見せる
      if (ins) ins.remove();
      el.classList.add('is-preview');
      return;
    }
    if (!ins) { el.remove(); return; }
    el.classList.add('is-live');
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  });
})();`;
