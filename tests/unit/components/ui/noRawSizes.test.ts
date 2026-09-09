/**
 * 寸法の直書きを防ぐ検査。
 *
 * `fontSize: '12px'` が196箇所、余白が322箇所、角丸が85箇所あり、
 * 同じ意味の値が 2/3/4/5/6/8/10/12/15/16/20px と分かれていた。
 * 「揃っていない」と言われるたびに1箇所ずつ直す作業が続いていたので、
 * 値そのものを書けないようにする。
 *
 * 使うもの:
 * - 文字サイズ … `FS`（src/constants/ui.ts）
 * - 余白・角丸 … `L.sp` / `L.r`（src/components/legend/legendStyles.ts）
 * - 操作部品の高さ … `CONTROL_SIZE`（ui/atoms/controlSize.ts）
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const COMPONENTS = join(process.cwd(), 'src', 'components');

/**
 * 検査から外すもの。
 * - v2/ は本番未使用の実験UI（CSS変数の別系統を使う）
 * - design/ は開発者向けデバッグパネル
 * - legend/legendStyles.ts と ui/atoms/controlSize.ts は定義元
 */
const EXCLUDED = [
  'v2',
  'design',
  join('legend', 'legendStyles.ts'),
  join('ui', 'atoms', 'controlSize.ts'),
];

function listFiles(dir: string, base = ''): string[] {
  return readdirSync(dir).flatMap((name) => {
    const abs = join(dir, name);
    const rel = base ? join(base, name) : name;
    if (statSync(abs).isDirectory()) return listFiles(abs, rel);
    return /\.tsx?$/.test(name) ? [rel] : [];
  });
}

const targetFiles = listFiles(COMPONENTS).filter(
  (rel) => !EXCLUDED.some((p) => rel.startsWith(p) || rel === p),
);

/**
 * 地図のアイコンは DivIcon の HTML 文字列として組み立てるため、
 * ここでの `fontSize:` の直書きは JSX ではなく文字列連結の中にある。
 * その場合も定数から取るべきだが、検査は JSX の style オブジェクトに絞る。
 */
const RULES: Array<{ name: string; re: RegExp; use: string }> = [
  { name: '文字サイズ', re: /fontSize: '\d+(\.\d+)?px'/, use: 'FS' },
  { name: '余白', re: /(padding|margin|gap)(Top|Bottom|Left|Right)?: '[^']*\d+px[^']*'/, use: 'L.sp' },
  { name: '角丸', re: /borderRadius: '\d+px'/, use: 'L.r' },
];

describe('寸法は定数から取る', () => {
  it.each(RULES)('$name の直書きが無い', ({ re, use }) => {
    const offenders = targetFiles.filter((rel) =>
      re.test(readFileSync(join(COMPONENTS, rel), 'utf-8')),
    );
    expect(
      offenders,
      `${use} を使うこと。直書きが残っている: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('検査対象のファイルがある（除外条件が広すぎないことの確認）', () => {
    expect(targetFiles.length).toBeGreaterThan(20);
  });
});
