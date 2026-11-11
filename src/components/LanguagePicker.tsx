/**
 * 地図アプリの言語を選ぶメニュー（オーガニズム）。
 *
 * 以前は「次の言語の略称（En → 中 → 한 → 日）」を出す巡回ボタンで、押す前にどの言語になるか分からず、
 * 狙った言語へ行くまで何度も押す必要があった。今は、地球儀のアイコンと今の言語（日 / EN / 中 / 한）の
 * ボタンを押すと、4言語が「その言語自身の文字」で並び、押したものへ直接切り替わる。
 * 静的ページの言語切り替え（LanguageSwitcher.astro）と同じ並び・名前・アイコンで、サイト全体でそろう。
 */
import React from 'react';
import { Globe } from 'lucide-react';
import OptionMenu, { type OptionMenuOption, type OptionMenuProps } from './ui/molecules/OptionMenu';
import { translateUI, type Language } from '../utils/translation';
import { normalizeLanguage, toArticleLanguage } from '../utils/languagePersistence';
import {
  LANGUAGE_CODES, LANGUAGE_HTML_LANG, LANGUAGE_NATIVE_NAME, LANGUAGE_SHORT_NAME, type LangCode,
} from '../constants/languages';

export interface LanguagePickerProps extends Pick<OptionMenuProps, 'appearance' | 'placement' | 'align'> {
  theme: 'light' | 'dark';
  /** いまの画面の言語 */
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ theme, language, onLanguageChange, ...layout }) => {
  const current = toArticleLanguage(language) as LangCode;
  const menuLabel = translateUI('languageMenuLabel', language);
  const options: OptionMenuOption[] = LANGUAGE_CODES.map(code => ({
    value: code,
    label: LANGUAGE_NATIVE_NAME[code],
    lang: LANGUAGE_HTML_LANG[code],
  }));
  return (
    <OptionMenu
      {...layout}
      theme={theme}
      triggerLabel={`${menuLabel}: ${LANGUAGE_NATIVE_NAME[current]}`}
      menuLabel={menuLabel}
      triggerIcon={<Globe />}
      triggerText={LANGUAGE_SHORT_NAME[current]}
      options={options}
      value={current}
      onSelect={code => {
        const next = normalizeLanguage(code);
        if (next && next !== language) onLanguageChange(next);
      }}
    />
  );
};

export default LanguagePicker;
