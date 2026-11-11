/**
 * 言語名の唯一の定義（constants/languages.ts）のテスト。
 * 言語名を各ファイルに書き写すと、片方だけ直されてずれる（2026-11 に4か所の重複を1つにした）。
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { LANGUAGE_CODES, LANGUAGE_HTML_LANG, LANGUAGE_NATIVE_NAME } from '../../../src/constants/languages';

describe('言語名の定義', () => {
  it('4言語すべてに名前・lang 属性がある', () => {
    expect(LANGUAGE_CODES).toEqual(['ja', 'en', 'zh', 'ko']);
    for (const c of LANGUAGE_CODES) {
      expect(LANGUAGE_NATIVE_NAME[c], c).toBeTruthy();
      expect(LANGUAGE_HTML_LANG[c], c).toBeTruthy();
    }
  });

  it('言語名は「その言語自身の文字」で、旗や絵文字を使わない', () => {
    expect(LANGUAGE_NATIVE_NAME).toEqual({ ja: '日本語', en: 'English', zh: '简体中文', ko: '한국어' });
    for (const name of Object.values(LANGUAGE_NATIVE_NAME)) expect(name).not.toMatch(/\p{Extended_Pictographic}|\p{Regional_Indicator}/u);
    expect(LANGUAGE_HTML_LANG.zh).toBe('zh-CN');
  });

  it('言語名の一覧（日本語・English・简体中文・한국어を1つの表に並べたもの）を、定義元以外に書かない', () => {
    const root = join(__dirname, '../../../src');
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) { walk(p); continue; }
        if (!/\.(ts|tsx|astro)$/.test(name) || p.endsWith('constants/languages.ts')) continue;
        if (/['"]简体中文['"]\s*,\s*ko\s*:/.test(readFileSync(p, 'utf8'))) hits.push(relative(root, p));
      }
    };
    walk(root);
    expect(hits, 'constants/languages.ts の LANGUAGE_NATIVE_NAME を使うこと').toEqual([]);
  });

  it('言語を「次へ進む」巡回で切り替えるコードを書かない（押す前に行き先が分からない。OptionMenu を使う）', () => {
    const root = join(__dirname, '../../../src');
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) { walk(p); continue; }
        if (!/\.(ts|tsx)$/.test(name)) continue;
        // langs[(langs.indexOf(language) + 1) % langs.length] のような巡回
        if (/\.indexOf\(\s*\w*[lL]ang\w*\s*\)\s*\+\s*1\s*\)\s*%/.test(readFileSync(p, 'utf8'))) hits.push(relative(root, p));
      }
    };
    walk(root);
    expect(hits).toEqual([]);
  });
});
