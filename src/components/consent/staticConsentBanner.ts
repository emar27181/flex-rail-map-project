/**
 * 記事・ガイド・駅/路線・静的ページ（React の地図を読み込まないページ）の Cookie の確認。
 *
 * 以前は Cookie の確認（CookieBanner.tsx）が地図のページにしか無かった。GA4 は「同意が無いあいだは
 * Cookie を使わない」で読み込むため、検索から記事に来た人は同意する手段が無く、GA4 の通常のレポートに
 * ほとんど数えられていなかった（2026-10-16）。
 *
 * - 地図のバナーと同じ保存先・同じ形で答えを残す（どちらで答えても、もう一方では聞かない）
 * - 出すのは本番のサイトだけ（utils/siteHost.ts。プレビューは URL ごとに保存先が別で、開くたびに出ていた）。
 *   埋め込み（?embed=1）では出さない
 * - 答えが出るまで GA4 の計測を始めない（GA4Loader.astro の `flexConsentDecided`）。許可なら Cookie 付きで、
 *   拒否なら Cookie 無しで、そのページの閲覧を1回だけ送る（同意の後で二重に数えない）
 * - 文言は地図のバナーと同じ翻訳（translation.ts）。言語はページの <html lang> から決める
 * - 細かい設定（項目ごとの切り替え）は地図のバナーにある。ここは「すべて許可」「必要なもののみ」の2つ
 */
import { FS } from '../../constants/ui';
import { NEUTRAL } from '../../constants/ui';
import { L } from '../legend/legendStyles';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateUI, type Language } from '../../utils/translation';
import { PRODUCTION_ORIGIN } from '../../utils/siteHost';
import { EMBED_PARAM } from '../../utils/embedMode';

/** 答えの保存先（地図の CookieBanner.tsx と同じ） */
export const CONSENT_STORAGE_KEY = 'cookieConsent';
export const CONSENT_DATE_KEY = 'cookieConsentDate';

const LANGS: Language[] = ['japanese', 'english', 'chinese', 'korean'];
const KEYS = ['cookieUsage', 'cookieBannerIntro', 'privacyLink', 'cookieBannerIntroSuffix', 'cookieAcceptAll', 'cookieEssentialOnly'] as const;

/** 4言語の文言（地図のバナーと同じ翻訳） */
export const CONSENT_TEXTS = Object.fromEntries(
  LANGS.map(lang => [lang, Object.fromEntries(KEYS.map(k => [k, translateUI(k, lang)]))]),
) as Record<Language, Record<(typeof KEYS)[number], string>>;

export const CONSENT_ID = 'flex-consent';

const light = getThemeColors('light');
const dark = getThemeColors('dark');

export const CONSENT_CSS = `
#${CONSENT_ID} {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 1000; box-sizing: border-box;
  padding: ${L.sp['3xl']} ${L.sp['3xl']} calc(${L.sp['3xl']} + env(safe-area-inset-bottom, 0px));
  background: ${light.surface}; color: ${light.text}; border-top: 1px solid ${light.border};
  font-size: ${FS.body}; line-height: 1.6;
}
html[data-theme="dark"] #${CONSENT_ID}, body.dark #${CONSENT_ID} { background: ${dark.surface}; color: ${dark.text}; border-top-color: ${dark.border}; }
#${CONSENT_ID} .cb-in { max-width: 960px; margin: 0 auto; }
#${CONSENT_ID} .cb-title { margin: 0 0 ${L.sp.sm}; font-size: ${FS.title}; font-weight: bold; }
#${CONSENT_ID} .cb-text { margin: 0 0 ${L.sp.xl}; color: ${light.textSecondary}; }
html[data-theme="dark"] #${CONSENT_ID} .cb-text, body.dark #${CONSENT_ID} .cb-text { color: ${dark.textSecondary}; }
#${CONSENT_ID} .cb-text a { color: ${light.primary}; }
html[data-theme="dark"] #${CONSENT_ID} .cb-text a, body.dark #${CONSENT_ID} .cb-text a { color: ${dark.primary}; }
#${CONSENT_ID} .cb-actions { display: flex; flex-wrap: wrap; gap: ${L.sp.md}; }
#${CONSENT_ID} .cb-accept { background: ${light.primary}; border-color: ${light.primary}; color: ${NEUTRAL.white}; }
html[data-theme="dark"] #${CONSENT_ID} .cb-accept, body.dark #${CONSENT_ID} .cb-accept { background: ${dark.primary}; border-color: ${dark.primary}; }
#${CONSENT_ID} .cb-accept:hover { color: ${NEUTRAL.white}; }
`;

/**
 * ページに1回だけ入れるスクリプト。答えが無いときだけバナーを作り、押した答えを保存して
 * GA4 に伝える（GA4 が無いページ・環境でも動く）
 */
export const CONSENT_SCRIPT = `(function(){
  if (location.origin !== ${JSON.stringify(PRODUCTION_ORIGIN)}) return;
  if (new URLSearchParams(location.search).get(${JSON.stringify(EMBED_PARAM)}) === '1') return;
  try { if (localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})) return; } catch (e) { return; }
  var TEXTS = ${JSON.stringify(CONSENT_TEXTS)};
  var q = new URLSearchParams(location.search).get('lang') || document.documentElement.lang || 'ja';
  var lang = /^en/.test(q) ? 'english' : /^zh/.test(q) ? 'chinese' : /^ko/.test(q) ? 'korean' : 'japanese';
  var t = TEXTS[lang];
  function decide(analytics) {
    var prefs = { necessary: true, analytics: analytics, advertising: analytics };
    try {
      localStorage.setItem(${JSON.stringify(CONSENT_STORAGE_KEY)}, JSON.stringify(prefs));
      localStorage.setItem(${JSON.stringify(CONSENT_DATE_KEY)}, new Date().toISOString());
    } catch (e) {}
    if (typeof window.flexConsentDecided === 'function') window.flexConsentDecided(analytics);
    var el = document.getElementById(${JSON.stringify(CONSENT_ID)});
    if (el) el.remove();
  }
  function show() {
    var box = document.createElement('section');
    box.id = ${JSON.stringify(CONSENT_ID)};
    box.setAttribute('aria-label', t.cookieUsage);
    var inner = document.createElement('div'); inner.className = 'cb-in';
    var h = document.createElement('p'); h.className = 'cb-title'; h.textContent = t.cookieUsage;
    var p = document.createElement('p'); p.className = 'cb-text';
    var a = document.createElement('a'); a.href = '/privacy'; a.textContent = t.privacyLink;
    p.append(t.cookieBannerIntro, ' ', a, t.cookieBannerIntroSuffix);
    var actions = document.createElement('div'); actions.className = 'cb-actions';
    var yes = document.createElement('button'); yes.type = 'button'; yes.className = 'ctl cb-accept'; yes.textContent = t.cookieAcceptAll;
    var no = document.createElement('button'); no.type = 'button'; no.className = 'ctl'; no.textContent = t.cookieEssentialOnly;
    yes.addEventListener('click', function () { decide(true); });
    no.addEventListener('click', function () { decide(false); });
    actions.append(yes, no);
    inner.append(h, p, actions);
    box.append(inner);
    document.body.append(box);
  }
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show, { once: true });
})();`;
