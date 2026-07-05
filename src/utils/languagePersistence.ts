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

export const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'japanese';
  const params = new URLSearchParams(window.location.search);
  return normalizeLanguage(params.get('lang'))
    ?? normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
    ?? normalizeLanguage(window.localStorage.getItem(ARTICLE_LANGUAGE_STORAGE_KEY))
    ?? 'japanese';
};

export const persistLanguage = (language: Language): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  window.localStorage.setItem(ARTICLE_LANGUAGE_STORAGE_KEY, toArticleLanguage(language));
};
