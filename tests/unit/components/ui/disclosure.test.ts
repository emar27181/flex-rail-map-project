/**
 * 開閉の印（▼）は DisclosureIndicator だけが描く、という規則の検査。
 *
 * 駅選択・表示路線の切替・ヒートマップ・設定の保存などで ▼ ▲ ▶ を手で書いていて、
 * 向き（閉じて ▶ / ▼）・回す時間（0.2s / 0.3s）・色がパネルごとにばらばらだった。
 * 翻訳文言に「▼ 他 N 路線を表示」のように入れると、言語ごとにずれ、色も変えられない。
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = join(__dirname, '../../../../src');
/** 印を描いてよいのは定義元だけ。v2・design は開発途上の別UI */
const ALLOWED = ['components/ui/atoms/DisclosureIndicator.tsx'];
const EXCLUDED_DIRS = ['v2', 'design'];
const ARROWS = /[▼▲▶◀]/;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!EXCLUDED_DIRS.includes(name)) walk(p, out);
    } else if (/\.(tsx?|astro|css)$/.test(name)) out.push(p);
  }
  return out;
}

/** コメント（説明文の中で ▼ に触れるのは構わない）を除く */
function stripComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

describe('開閉の印', () => {
  it('▼ ▲ ▶ を手で書かない（DisclosureIndicator を使う。翻訳文言にも入れない）', () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const rel = relative(SRC, file).split('\\').join('/');
      if (ALLOWED.includes(rel)) continue;
      stripComments(readFileSync(file, 'utf8')).split('\n').forEach((line, i) => {
        if (ARROWS.test(line)) offenders.push(`${rel}:${i + 1}: ${line.trim().slice(0, 80)}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});
