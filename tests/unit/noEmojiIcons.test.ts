/**
 * UIアイコンに絵文字を使っていないことを検証する
 *
 * 絵文字はOS・フォントによって字形も大きさも変わり、サイズや色を
 * 制御できないためUIアイコンとしては安定しない。
 * lucide-react のアイコンコンポーネントを使うこと。
 *
 * 対象は「画面に描画されるJSX」に限る。console.log などのデバッグ出力や
 * 矢印記号(→ ← ⇔ など、経路表記に使う文字)は対象外。
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

/** 絵文字（装飾用ピクトグラム）。矢印や記号類は含めない */
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2705}\u{274C}\u{2B07}]/u;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walk(p);
    return /\.(tsx|astro)$/.test(p) ? [p] : [];
  });
}

describe('UIアイコンの絵文字禁止', () => {
  it('描画されるJSXに絵文字を含まない', () => {
    const violations: string[] = [];

    for (const file of walk(SRC)) {
      const lines = readFileSync(file, 'utf-8').split('\n');
      lines.forEach((line, i) => {
        // デバッグ出力・コメントは対象外
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
        if (/console\.(log|warn|error|info|debug)/.test(line)) return;

        if (EMOJI.test(line)) {
          violations.push(`${file.replace(process.cwd() + '/', '')}:${i + 1}  ${trimmed.slice(0, 70)}`);
        }
      });
    }

    expect(violations).toEqual([]);
  });
});
