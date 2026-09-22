/**
 * 表示言語の初期値のテスト。
 *
 * 「デバイスの標準の言語で表示されるように」という要望を受けて、
 * URL指定・保存済み設定が無いときはブラウザの言語設定
 * （navigator.languages）から対応言語を推定するようにした。
 * スペイン語・フランス語など対応外の言語のときは、日本語ではなく
 * 英語にフォールバックする（「言語がなければとりあえず英語」の要望）。
 *
 * navigator を使うため jsdom 環境で実行する。
 */
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { detectBrowserLanguage, normalizeLanguage } from '../../../src/utils/languagePersistence';

const setNavigatorLanguages = (languages: string[]) => {
  Object.defineProperty(window.navigator, 'languages', {
    value: languages,
    configurable: true,
  });
  Object.defineProperty(window.navigator, 'language', {
    value: languages[0] ?? '',
    configurable: true,
  });
};

describe('detectBrowserLanguage', () => {
  afterEach(() => {
    setNavigatorLanguages(['en-US']);
  });

  it('日本語（ja）の端末は japanese になる', () => {
    setNavigatorLanguages(['ja-JP', 'ja']);
    expect(detectBrowserLanguage()).toBe('japanese');
  });

  it('地域付き言語タグ（en-US）でも主言語タグだけで一致する', () => {
    setNavigatorLanguages(['en-US']);
    expect(detectBrowserLanguage()).toBe('english');
  });

  it('中国語（zh-CN）は chinese になる', () => {
    setNavigatorLanguages(['zh-CN']);
    expect(detectBrowserLanguage()).toBe('chinese');
  });

  it('韓国語（ko-KR）は korean になる', () => {
    setNavigatorLanguages(['ko-KR']);
    expect(detectBrowserLanguage()).toBe('korean');
  });

  it('対応外の言語（スペイン語・フランス語）は日本語ではなく英語にフォールバックする', () => {
    setNavigatorLanguages(['es-ES']);
    expect(detectBrowserLanguage()).toBe('english');

    setNavigatorLanguages(['fr-FR']);
    expect(detectBrowserLanguage()).toBe('english');
  });

  it('先頭が対応外でも、優先順リストの後方に対応言語があればそれを使う', () => {
    setNavigatorLanguages(['fr-FR', 'ja-JP']);
    expect(detectBrowserLanguage()).toBe('japanese');
  });
});

describe('normalizeLanguage', () => {
  it('ja / japanese はどちらも japanese になる', () => {
    expect(normalizeLanguage('ja')).toBe('japanese');
    expect(normalizeLanguage('japanese')).toBe('japanese');
  });

  it('対応外の値は null になる', () => {
    expect(normalizeLanguage('es')).toBeNull();
    expect(normalizeLanguage('fr')).toBeNull();
    expect(normalizeLanguage(null)).toBeNull();
  });
});
