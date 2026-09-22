import type { Language } from './translation';

export const LANGUAGE_STORAGE_KEY = 'frm-language';
export const ARTICLE_LANGUAGE_STORAGE_KEY = 'frm-article-lang';

export const normalizeLanguage = (value: string | null): Language | null => {
  switch (value) {
    case 'ja':
    case 'japanese':
      return 'japanese';
    case 'en':
    case 'english':
      return 'english';
    case 'zh':
    case 'chinese':
      return 'chinese';
    case 'ko':
    case 'korean':
      return 'korean';
    default:
      return null;
  }
};

export const toArticleLanguage = (language: Language): string => ({
  japanese: 'ja',
  english: 'en',
  chinese: 'zh',
  korean: 'ko',
}[language]);

/**
 * ブラウザ（端末）の言語設定から対応言語を推定する。
 * 「デバイスの標準の言語で表示されるように」という要望を受けて追加した。
 *
 * `navigator.languages`（優先順のリスト。無ければ`navigator.language`）を
 * 先頭から見て、対応4言語（ja/en/zh/ko）のどれかに一致した最初のものを使う。
 * "en-US" のような地域付きの値は `normalizeLanguage` に渡す前に
 * 主言語タグ（"en"）だけに切り出す。
 *
 * どれにも一致しない場合（スペイン語・フランス語など未対応言語で
 * 海外からアクセスした場合など）は、日本語ではなく英語にフォールバックする
 * （「言語がない言語だったらとりあえず英語を表示するように」という要望）。
 */
export const detectBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'english';
  const candidates = navigator.languages && navigator.languages.length > 0
    ? navigator.languages
    : navigator.language ? [navigator.language] : [];
  for (const candidate of candidates) {
    const primary = candidate.split('-')[0];
    const normalized = normalizeLanguage(primary);
    if (normalized) return normalized;
  }
  return 'english';
};

export const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'japanese';
  const params = new URLSearchParams(window.location.search);
  return normalizeLanguage(params.get('lang'))
    ?? normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
    ?? normalizeLanguage(window.localStorage.getItem(ARTICLE_LANGUAGE_STORAGE_KEY))
    ?? detectBrowserLanguage();
};

export const persistLanguage = (language: Language): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  window.localStorage.setItem(ARTICLE_LANGUAGE_STORAGE_KEY, toArticleLanguage(language));
};
