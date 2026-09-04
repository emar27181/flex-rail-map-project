/**
 * 意味を持つ色のベタ書きを防ぐテスト。
 *
 * 「出発は緑・到着は赤」はアプリ全体の約束事なのに、以前は12ファイルが
 * 各自 `#4CAF50` と書いていた。色を変えるには全ファイルを直す必要があり、
 * 実際に入力欄だけ色が変わってボタンが取り残される事故が起きている。
 *
 * 大文字小文字が混ざっていた（`#F44336` と `#f44336`）ことも、
 * 検索での取りこぼしを生んでいた。ここで機械的に禁止する。
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { SEMANTIC, NEUTRAL } from '../../../src/constants/ui';

const SRC = join(process.cwd(), 'src');

/** ここでだけ実際の色を書いてよい */
const DEFINITION_FILE = join('constants', 'ui.ts');

/**
 * 検査から外すファイル。
 * articleBodyI18n.ts は記事本文のHTMLとSVGの挿絵を持つデータで、
 * 挿絵の配色はUIのテーマとは無関係（テーマを切り替えても挿絵は変わらない）。
 */
const EXCLUDED = new Set([join('data', 'articleBodyI18n.ts')]);

function listFiles(dir: string, pattern: RegExp, base = ''): string[] {
  return readdirSync(dir).flatMap((name) => {
    const abs = join(dir, name);
    const rel = base ? join(base, name) : name;
    if (statSync(abs).isDirectory()) return listFiles(abs, pattern, rel);
    return pattern.test(name) ? [rel] : [];
  });
}

const listSourceFiles = (dir: string) => listFiles(dir, /\.(ts|tsx)$/);

/**
 * ページ（.astro）とスタイルシート（.css）も見る。
 *
 * 固定ページ5枚が同じ `#2196F3` を各自書いていて、そのうち3枚だけ
 * 古いドメインの hreflang を持ったまま取り残されていた。TypeScript だけ
 * 検査しても、同じ事故がページ側で起き続ける。
 *
 * 未対応のものは除外する。いずれも別課題として残っている:
 * - pages/index.astro … Leaflet のポップアップを上書きするCSSに約70箇所
 * - pages/articles/ と styles/ … 記事は本体UIと別の配色系統を使っている
 */
const MARKUP_EXCLUDED = [
  join('pages', 'index.astro'),
  join('pages', 'articles'),
  'styles',
];

const listMarkupFiles = (dir: string) =>
  listFiles(dir, /\.(astro|css)$/).filter(
    (rel) => !MARKUP_EXCLUDED.some((p) => rel === p || rel.startsWith(p + '/')),
  );

describe('意味を持つ色の一元管理', () => {
  it('SEMANTIC の色は constants/ui.ts 以外にベタ書きされていない', () => {
    const hexes = Object.values(SEMANTIC);
    const pattern = new RegExp(hexes.join('|'), 'i');

    const offenders = listSourceFiles(SRC)
      .filter((rel) => rel !== DEFINITION_FILE)
      .filter((rel) => pattern.test(readFileSync(join(SRC, rel), 'utf-8')));

    expect(
      offenders,
      `SEMANTIC.* を使うこと。ベタ書きが残っている: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('SEMANTIC の色は .astro / .css にもベタ書きされていない', () => {
    const pattern = new RegExp(Object.values(SEMANTIC).join('|'), 'i');

    const offenders = listMarkupFiles(SRC).filter((rel) =>
      pattern.test(readFileSync(join(SRC, rel), 'utf-8')),
    );

    expect(
      offenders,
      `レイアウト(layouts/staticPageStyles.ts)から取ること。ベタ書きが残っている: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('SEMANTIC の色は互いに異なる', () => {
    const values = Object.values(SEMANTIC);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe('白と黒の一元管理', () => {
  /**
   * `color: 'white'` `'#fff'` `'#ffffff'` が3通り混在して76箇所に散らばっていた。
   * 同じ「塗った色の上に載せる文字」なのに書き方が違うため、
   * 検索での取りこぼしが起き、直したつもりで残るということが起きていた。
   */
  const RAW_WHITE_OR_BLACK = /['"](?:white|black|#fff|#ffffff|#FFF|#FFFFFF|#000|#000000)['"]/;

  it('白・黒の直書きが constants/ui.ts 以外に無い', () => {
    const offenders = listSourceFiles(SRC)
      .filter((rel) => rel !== DEFINITION_FILE && !EXCLUDED.has(rel))
      .filter((rel) => RAW_WHITE_OR_BLACK.test(readFileSync(join(SRC, rel), 'utf-8')));

    expect(
      offenders,
      `NEUTRAL.white / NEUTRAL.black か getThemeColors() を使うこと。直書きが残っている: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('NEUTRAL は白と黒を持つ', () => {
    expect(NEUTRAL.white.toLowerCase()).toBe('#ffffff');
    expect(NEUTRAL.black.toLowerCase()).toBe('#000000');
  });
});
