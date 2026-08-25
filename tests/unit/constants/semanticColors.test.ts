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
import { SEMANTIC } from '../../../src/constants/ui';

const SRC = join(process.cwd(), 'src');

/** ここでだけ実際の色を書いてよい */
const DEFINITION_FILE = join('constants', 'ui.ts');

function listSourceFiles(dir: string, base = ''): string[] {
  return readdirSync(dir).flatMap((name) => {
    const abs = join(dir, name);
    const rel = base ? join(base, name) : name;
    if (statSync(abs).isDirectory()) return listSourceFiles(abs, rel);
    return /\.(ts|tsx)$/.test(name) ? [rel] : [];
  });
}

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

  it('SEMANTIC の色は互いに異なる', () => {
    const values = Object.values(SEMANTIC);
    expect(new Set(values).size).toBe(values.length);
  });
});
