/**
 * 生の操作要素を書かせないための検査。
 *
 * `<button>` は93個中91個がインラインstyleで、padding・角丸・色・文字サイズを
 * 毎回手書きしていた。同じ役割でも高さも色も少しずつ違い、
 * 「揃っていない」と指摘されるたびに1箇所ずつ直す作業を繰り返していた。
 *
 * アトム（ui/atoms/）の中だけが生の要素を書いてよい場所。
 * それ以外は Button / IconButton / Chip / TextField / Select / Switch を使う。
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const COMPONENTS = join(process.cwd(), 'src', 'components');

/** アトムの定義元。ここだけは生の要素を書いてよい */
const ATOM_DIR = join('ui', 'atoms');

/**
 * 検査から外すもの。
 * - v2/ は本番で使っていない実験用UI（CSS変数の別系統を使う）
 * - design/ は開発者向けのデバッグパネル
 * どちらも触るときに移す。
 */
const EXCLUDED_PREFIXES = ['v2', 'design'];

function listTsxFiles(dir: string, base = ''): string[] {
  return readdirSync(dir).flatMap((name) => {
    const abs = join(dir, name);
    const rel = base ? join(base, name) : name;
    if (statSync(abs).isDirectory()) return listTsxFiles(abs, rel);
    return name.endsWith('.tsx') ? [rel] : [];
  });
}

const targetFiles = listTsxFiles(COMPONENTS)
  .filter((rel) => !rel.startsWith(ATOM_DIR))
  .filter((rel) => !EXCLUDED_PREFIXES.some((p) => rel.startsWith(p)));

/**
 * 画面に出ないものは検査から外す。
 * ファイル選択欄は display:none で、実際に押されるのは別のボタン。
 */
const HIDDEN_INPUT = /<input[^>]*type="file"/;

/** 生の要素と、代わりに使うアトム */
const RULES: Array<{ tag: RegExp; use: string }> = [
  { tag: /<button[\s>]/, use: 'Button / IconButton / Chip' },
  { tag: /<select[\s>]/, use: 'Select' },
  { tag: /<textarea[\s>]/, use: 'TextArea' },
  { tag: /<input[\s>]/, use: 'TextField / Checkbox / Radio / Slider / ToggleMark' },
];

describe('操作要素はアトムを通す', () => {
  it.each(RULES)('アトム以外に生の要素が無い ($use)', ({ tag, use }) => {
    const offenders = targetFiles.filter((rel) => {
      const text = readFileSync(join(COMPONENTS, rel), 'utf-8');
      if (!tag.test(text)) return false;
      // 画面に出ない input だけの場合は許す
      if (tag.source.includes('input')) {
        const inputs = text.match(/<input[^>]*>/g) ?? [];
        return inputs.some((one) => !HIDDEN_INPUT.test(one));
      }
      return true;
    });
    expect(
      offenders,
      `ui/atoms/ の ${use} を使うこと。生の要素が残っている: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('検査対象のファイルがある（除外条件が広すぎないことの確認）', () => {
    // 除外を増やしすぎて何も検査していない状態になるのを防ぐ
    expect(targetFiles.length).toBeGreaterThan(20);
  });
});
