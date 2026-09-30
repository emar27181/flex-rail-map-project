import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CONTROL_CSS, HEADER_CONTROL_PX } from '../../../../src/components/ui/atoms/controlCss';
import { FLOATING_ICON_BUTTON_SIZE, FLOATING_ICON_GLYPH_SIZE } from '../../../../src/components/ui/atoms/controlSize';

const SRC = join(__dirname, '../../../../src');

describe('静的ページの操作部品（.ctl）', () => {
  it('地図の隅のボタンと同じ高さ・アイコンの大きさから作る', () => {
    expect(HEADER_CONTROL_PX).toBe(FLOATING_ICON_BUTTON_SIZE.md);
    expect(CONTROL_CSS).toContain(`height: ${HEADER_CONTROL_PX}px`);
    expect(CONTROL_CSS).toContain(`width: ${FLOATING_ICON_GLYPH_SIZE}px`);
  });

  it('記事ヘッダーのテーマ切り替えと言語切り替えは同じクラスを使う（寸法を個別に書かない）', () => {
    const layout = readFileSync(join(SRC, 'components/articles/ArticleLayout.astro'), 'utf8');
    const switcher = readFileSync(join(SRC, 'components/LanguageSwitcher.astro'), 'utf8');
    expect(layout).toMatch(/class="ctl ctl-icon theme-btn"/);
    expect(switcher).toMatch(/<summary class="ctl"/);
    const css = readFileSync(join(SRC, 'styles/article-layout.css'), 'utf8');
    expect(css).not.toMatch(/\.theme-btn\{[^}]*(width|height)/);
  });
});
