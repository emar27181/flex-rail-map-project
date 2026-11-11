/**
 * 地図アプリの言語メニュー（components/LanguagePicker.tsx）のテスト。
 * 以前は次の言語の略称を出す巡回ボタンで、押す前にどの言語になるか分からなかった（2026-11）。
 */
// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import LanguagePicker from '../../../src/components/LanguagePicker';
import { LANGUAGE_NATIVE_NAME, LANGUAGE_CODES } from '../../../src/constants/languages';
import type { Language } from '../../../src/utils/translation';

const open = (language: Language) => {
  const onLanguageChange = vi.fn();
  const r = render(<LanguagePicker theme="light" language={language} onLanguageChange={onLanguageChange} />);
  fireEvent.click(r.getByRole('button', { name: new RegExp(`: `) }));
  return { ...r, onLanguageChange };
};

describe('LanguagePicker', () => {
  it('ボタンは地球儀のアイコンだけ（文字を添えない）。今の言語は読み上げ名で伝える', () => {
    const cases: Array<[Language, string]> = [
      ['japanese', '言語: 日本語'],
      ['english', 'Language: English'],
      ['chinese', '语言: 简体中文'],
      ['korean', '언어: 한국어'],
    ];
    for (const [language, label] of cases) {
      const r = render(<LanguagePicker theme="light" language={language} onLanguageChange={() => {}} />);
      const button = r.getByRole('button', { name: label });
      expect(button.textContent, label).toBe('');
      expect(button.querySelector('svg'), label).not.toBeNull();
      r.unmount();
    }
  });

  it('開くと4言語が「その言語自身の文字」で並び、今の言語に印が付く', () => {
    const { getAllByRole } = open('english');
    const items = getAllByRole('menuitemradio');
    expect(items.map(i => i.textContent)).toEqual(LANGUAGE_CODES.map(c => LANGUAGE_NATIVE_NAME[c]));
    expect(items.map(i => i.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false', 'false']);
    expect(items.map(i => i.getAttribute('lang'))).toEqual(['ja', 'en', 'zh-CN', 'ko']);
  });

  it('押した言語へ直接切り替わる（巡回しない）', () => {
    const { getByRole, onLanguageChange } = open('japanese');
    fireEvent.click(getByRole('menuitemradio', { name: '한국어' }));
    expect(onLanguageChange).toHaveBeenCalledTimes(1);
    expect(onLanguageChange).toHaveBeenCalledWith('korean');
  });

  it('今の言語を押しても何も変えない', () => {
    const { getByRole, onLanguageChange } = open('chinese');
    fireEvent.click(getByRole('menuitemradio', { name: '简体中文' }));
    expect(onLanguageChange).not.toHaveBeenCalled();
  });
});
