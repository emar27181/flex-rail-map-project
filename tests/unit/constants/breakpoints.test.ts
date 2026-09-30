import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { BREAKPOINT, deviceClassOf, MEDIA } from '../../../src/constants/breakpoints';

/**
 * 端末の区分（スマホ・タブレット・PC）の境目を1か所（src/constants/breakpoints.ts）にまとめたことを固定する。
 * 以前は 768（< と <= が混在）・500・480・560・600・620px がばらばらに書かれていた。
 */
const ALLOWED = new Set([BREAKPOINT.tablet, BREAKPOINT.tablet - 0.02, BREAKPOINT.desktop, BREAKPOINT.desktop - 0.02].map(String));

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(f => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(css|astro|tsx?|mts)$/.test(f) ? [p] : [];
  });
}

describe('端末の区分', () => {
  it('幅から区分を決める（768未満=スマホ、1024未満=タブレット、それ以上=PC）', () => {
    expect(deviceClassOf(390)).toBe('mobile');
    expect(deviceClassOf(767)).toBe('mobile');
    expect(deviceClassOf(768)).toBe('tablet');
    expect(deviceClassOf(1023)).toBe('tablet');
    expect(deviceClassOf(1024)).toBe('desktop');
    expect(MEDIA.mobile).toContain('767.98px');
  });

  it('メディアクエリの幅と画面幅の比較は、breakpoints.ts の値だけを使う', () => {
    const bad: string[] = [];
    for (const file of walk('src')) {
      if (file.endsWith(join('constants', 'breakpoints.ts'))) continue;
      const src = readFileSync(file, 'utf8');
      for (const m of src.matchAll(/@media[^{]*?\((?:max|min)-width\s*:\s*([\d.]+)px\)/g)) {
        if (!ALLOWED.has(m[1])) bad.push(`${file}: ${m[0]}`);
      }
      for (const m of src.matchAll(/innerWidth\s*(?:<|<=|>|>=)\s*(\d+)/g)) bad.push(`${file}: ${m[0]}（deviceClassOf を使う）`);
    }
    expect(bad).toEqual([]);
  });
});
