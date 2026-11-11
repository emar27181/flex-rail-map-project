/**
 * 対応する4言語の名前の唯一の定義。
 *
 * 言語の選択肢（地図の言語メニュー・静的ページの言語切り替え・「この言語でも読めます」の案内・
 * 駅/路線ページの言語表示）に出す名前は、以前それぞれのファイルに同じ文字列を書いていた。
 * 多言語サイトの定石どおり、言語名は「その言語自身の文字」で出す（日本語の画面でも「English」と書く。
 * 旗は国であって言語ではないので使わない）。
 *
 * 画面の言語を表す値は、ページ（Astro）側は `ja` / `en` / `zh` / `ko`（LangCode）、
 * 地図アプリ側は `japanese` / `english` / `chinese` / `korean`（utils/translation の Language）。
 * 変換は utils/languagePersistence の `toArticleLanguage` / `normalizeLanguage`。
 */

export type LangCode = 'ja' | 'en' | 'zh' | 'ko';

/** メニューに並べる順 */
export const LANGUAGE_CODES: readonly LangCode[] = ['ja', 'en', 'zh', 'ko'];

/** その言語自身での名前 */
export const LANGUAGE_NATIVE_NAME: Record<LangCode, string> = {
  ja: '日本語',
  en: 'English',
  zh: '简体中文',
  ko: '한국어',
};

/** ボタンに出す短い表記（狭いヘッダーでも折り返さない） */
export const LANGUAGE_SHORT_NAME: Record<LangCode, string> = {
  ja: '日',
  en: 'EN',
  zh: '中',
  ko: '한',
};

/** HTML の lang 属性（読み上げ・フォントの選択用。中国語は簡体字） */
export const LANGUAGE_HTML_LANG: Record<LangCode, string> = {
  ja: 'ja',
  en: 'en',
  zh: 'zh-CN',
  ko: 'ko',
};
