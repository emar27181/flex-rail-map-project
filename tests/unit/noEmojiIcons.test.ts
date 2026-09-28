/**
 * UIアイコンに絵文字を使っていないことを検証する
 *
 * 絵文字はOS・フォントによって字形も大きさも変わり、サイズや色を
 * 制御できないためUIアイコンとしては安定しない。
 * lucide-react のアイコンコンポーネントを使うこと。
 *
 * 対象は src/ 配下の画面に出るもの全般（.tsx/.astro の JSX、.ts の翻訳文言、
 * .css の content、記事本文）。以前は .tsx/.astro だけを見ていたため、
 * translation.ts の「⚠ 概算値」「📋 テキストコピー」や記事CSSの「🗺」が
 * すり抜けていた。
 *
 * console.log などのデバッグ出力・コメント、
 * 矢印記号(→ ← ⇔ など、経路表記に使う文字)と ▼▲▶ などの図形記号は対象外。
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

/**
 * 絵文字・装飾用ピクトグラム。
 * 1F000-1FAFF: 絵文字本体 / 2600-27BF: 記号・装飾記号（⚠ ✓ ✕ ✅ ❌ など）/
 * 2300-23FF: 技術記号（⏱ ⏰ ⌛ など）/ 2B00-2BFF: ⬇ ⭐ など / FE0F: 絵文字化セレクタ。
 * 矢印（2190-21FF）と図形記号（25A0-25FF の ▼▲▶）は含めない。
 */
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walk(p);
    return /\.(tsx?|astro|css|mdx?)$/.test(p) ? [p] : [];
  });
}

describe('UIアイコンの絵文字禁止', () => {
  it('画面に出るコード・文言・CSS・記事に絵文字を含まない', () => {
    const violations: string[] = [];

    for (const file of walk(SRC)) {
      const lines = readFileSync(file, 'utf-8').split('\n');
      lines.forEach((line, i) => {
        // デバッグ出力・コメントは対象外
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
        if (/console\.(log|warn|error|info|debug|group)/.test(line)) return;

        if (EMOJI.test(line)) {
          violations.push(`${file.replace(process.cwd() + '/', '')}:${i + 1}  ${trimmed.slice(0, 70)}`);
        }
      });
    }

    expect(violations).toEqual([]);
  });
});
