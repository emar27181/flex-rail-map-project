/**
 * デザインの規則一覧（docs/design-system.md「規則一覧（CI で検査）」）と、実際の検査・部品・CI を突き合わせる。
 *
 * 規則を決めても、テストが無い・CI で動いていない・部品表に載っていない、のどれかで
 * いつの間にか守られなくなっていた（2026-10: CI が無く、規則のテストは手元でしか動いていなかった）。
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { designRuleTests, RULES_DOC, RULES_HEADING } from '../../scripts/design-rules.mjs';

const ROOT = join(__dirname, '../..');
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const files: string[] = designRuleTests(ROOT);

describe('規則一覧と検査', () => {
  it('規則一覧に検査テストが並んでいる', () => {
    expect(files.length).toBeGreaterThanOrEqual(10);
  });

  it('表の「検査」に書いたテストはすべて存在し、test:unit でも動く場所にある', () => {
    for (const f of files) {
      expect(existsSync(join(ROOT, f)), f).toBe(true);
      expect(f.startsWith('tests/unit/'), f).toBe(true);
    }
  });

  it('この突き合わせのテスト自身も表に載っている', () => {
    expect(files).toContain('tests/unit/designRules.test.ts');
  });
});

describe('部品表（どの部品を使うか）', () => {
  it('ui/atoms・ui/molecules の部品はすべて design-system.md に載っている', () => {
    const doc = read(RULES_DOC);
    const missing: string[] = [];
    for (const dir of ['src/components/ui/atoms', 'src/components/ui/molecules']) {
      for (const name of readdirSync(join(ROOT, dir))) {
        const base = name.replace(/\.(tsx?|astro)$/, '');
        if (!doc.includes(base)) missing.push(`${dir}/${name}`);
      }
    }
    expect(missing, '「どの部品を使うか」に1行足すこと').toEqual([]);
  });
});

describe('CI と入口の文書', () => {
  it('GitHub Actions が型・デザイン規則・ユニットテスト・ビルドを実行する', () => {
    const ci = read('.github/workflows/ci.yml');
    for (const cmd of ['npm run test:types', 'npm run test:design', 'npm run test:unit', 'npm run build']) {
      expect(ci, cmd).toContain(cmd);
    }
  });

  it('CLAUDE.md・AGENTS.md・デザインのスキルから規則一覧へ案内している', () => {
    const heading = RULES_HEADING.replace(/^## /, '');
    for (const p of ['CLAUDE.md', 'AGENTS.md', '.claude/skills/design-tokens/SKILL.md']) {
      const text = read(p);
      expect(text, p).toContain(RULES_DOC);
      expect(text, p).toContain(heading);
    }
  });
});
