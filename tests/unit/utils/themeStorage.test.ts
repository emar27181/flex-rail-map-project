/**
 * テーマの保存先と埋め込み表示のテーマのテスト（src/utils/themeStorage.ts）。
 *
 * 以前は記事が `frm-theme`、地図・ほかのページが `theme` に保存していて、
 * 記事の中の地図（iframe）が記事と違うテーマで出ていた。保存先のキーを1か所にまとめたことを固定する。
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  getThemeFromUrl, readSavedTheme, saveTheme,
  THEME_STORAGE_KEY, LEGACY_THEME_STORAGE_KEY,
} from '../../../src/utils/themeStorage';
import { MAP_EMBED_SCRIPT } from '../../../src/components/ui/atoms/mapEmbed';

describe('readSavedTheme / saveTheme', () => {
  beforeEach(() => localStorage.clear());

  it('保存が無ければ null（既定は各ページが決める）', () => {
    expect(readSavedTheme()).toBeNull();
  });

  it('保存したテーマを読む', () => {
    saveTheme('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(readSavedTheme()).toBe('light');
  });

  it('記事が以前使っていたキーも読む（移行用）。新しいキーがあればそちらを優先', () => {
    localStorage.setItem(LEGACY_THEME_STORAGE_KEY, 'light');
    expect(readSavedTheme()).toBe('light');
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(readSavedTheme()).toBe('dark');
  });

  it('知らない値は無視する', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
    expect(readSavedTheme()).toBeNull();
  });
});

describe('getThemeFromUrl', () => {
  it('URL の theme を読む', () => {
    expect(getThemeFromUrl('?embed=1&theme=light')).toBe('light');
    expect(getThemeFromUrl('?theme=dark')).toBe('dark');
  });
  it('無い・知らない値は null', () => {
    expect(getThemeFromUrl('')).toBeNull();
    expect(getThemeFromUrl('?theme=blue')).toBeNull();
  });
});

describe('埋め込みのスクリプト', () => {
  it('ページのテーマを iframe に渡す（URL の theme と postMessage）', () => {
    expect(MAP_EMBED_SCRIPT).toContain('searchParams.set(');
    expect(MAP_EMBED_SCRIPT).toContain('postMessage(');
  });
});

describe('テーマの保存先を直書きしない', () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(ts|tsx|astro)$/.test(name)) files.push(p);
    }
  };
  walk(join(__dirname, '../../../src'));

  it('localStorage のテーマのキーは utils/themeStorage.ts の定数から取る', () => {
    const literal = /localStorage\.(?:get|set)Item\(\s*['"](?:theme|frm-theme)['"]/;
    const offenders = files.filter(f => literal.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
