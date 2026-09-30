import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TOKEN_VARS_CSS } from '../../../src/components/ui/atoms/controlCss';
import { CONTROL_SIZE } from '../../../src/components/ui/atoms/controlSize';
import { L } from '../../../src/components/legend/legendStyles';

const STYLES = join(__dirname, '../../../src/styles');
const FILES = ['article-layout.css', 'article-introduction.css'];

/**
 * 記事の CSS は手書きのため、角の丸み・操作部品の寸法をデザイントークンの CSS 変数
 * （controlCss.ts の TOKEN_VARS_CSS）から取っているかを確かめる。以前はボタンが 8/9px・
 * チップが 999px・箱が 10/11/12/14px とばらばらで、React のアトム（すべて角丸 3px）と揃っていなかった。
 */
describe('記事の CSS はデザイントークンに従う', () => {
  it('トークンの CSS 変数は L.r・CONTROL_SIZE の値から作る', () => {
    expect(TOKEN_VARS_CSS).toContain(`--r-control: ${L.r.control}`);
    expect(TOKEN_VARS_CSS).toContain(`--r-card: ${L.r.card}`);
    expect(TOKEN_VARS_CSS).toContain(`--r-pill: ${L.r.pill}`);
    expect(TOKEN_VARS_CSS).toContain(`--ctl-md-h: ${CONTROL_SIZE.md.minHeight}px`);
  });

  for (const file of FILES) {
    const css = readFileSync(join(STYLES, file), 'utf8');

    it(`${file}: 角の丸みは --r-control / --r-card / --r-pill（円は 50%）だけ`, () => {
      const radii = [...css.matchAll(/border-radius\s*:\s*([^;}]+)/g)].map(m => m[1].trim());
      const bad = radii.filter(v => !/^var\(--r-(control|card|pill)\)$/.test(v) && v !== '50%');
      expect(bad).toEqual([]);
    });

    it(`${file}: ボタン（.btn・.chip・.seg button・地図を開くリンク）は操作部品の寸法を使う`, () => {
      const rules = css.split('}').filter(r => /(\.btn|\.chip|\.seg button|foot-app-link)\s*\{/.test(r) && !/:hover|\.sw|\.ar|\.n\{|aria-/.test(r.split('{')[0]));
      for (const r of rules) {
        if (!/padding|font-size/.test(r)) continue;
        expect(r, r.split('{')[0]).toContain('var(--ctl-md-h)');
        expect(r, r.split('{')[0]).toContain('var(--ctl-md-fs)');
      }
    });
  }
});
