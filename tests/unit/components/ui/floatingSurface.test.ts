/**
 * 地図の上に浮かぶ箱・ボタンの地（透け具合・ぼかし・枠線・影・角の丸み）の一元管理のテスト。
 *
 * 透け具合・ぼかしを場所ごとに直書きしていて、凡例・隅のボタン・駅選択・ツールチップの
 * 見た目がそろっていなかった（左下の「表示切替」だけがすりガラスに見えた）。
 * 地は ui/atoms/floatingSurface.ts の floatingSurfaceStyle / floatingSurfaceCss だけが作る。
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { floatingSurfaceStyle, floatingSurfaceCss, FLOATING_SURFACE } from '../../../../src/components/ui/atoms/floatingSurface';
import { FLOATING_OPACITY } from '../../../../src/contexts/ThemeContext';
import { FLOATING_CONTROL } from '../../../../src/components/ui/atoms/controlSize';

const ROOT = join(__dirname, '../../../../src/components');
/** 地を作ってよいのは定義元だけ。v2 は開発途上の別UI */
const ALLOWED = ['ui/atoms/floatingSurface.ts'];
const EXCLUDED_DIRS = ['v2'];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!EXCLUDED_DIRS.includes(name)) walk(p, out);
    } else if (/\.(tsx?|astro)$/.test(name)) out.push(p);
  }
  return out;
}

describe('地図の上に浮かぶものの地', () => {
  it('閉じた箱・ボタン（idle）と開いた箱（open）は同じぼかし・角の丸み・影で、透け具合だけが違う', () => {
    for (const theme of ['light', 'dark'] as const) {
      const idle = floatingSurfaceStyle(theme, 'idle');
      const open = floatingSurfaceStyle(theme, 'open');
      expect(idle.backdropFilter).toBe(`blur(${FLOATING_SURFACE.blurPx}px)`);
      expect(open.backdropFilter).toBe(idle.backdropFilter);
      expect(open.borderRadius).toBe(FLOATING_CONTROL.radius);
      expect(open.boxShadow).toBe(idle.boxShadow);
      expect(String(idle.backgroundColor)).toContain(`${FLOATING_OPACITY.idle})`);
      expect(String(open.backgroundColor)).toContain(`${FLOATING_OPACITY.open})`);
    }
  });

  it('開いた箱もすりガラスに見えるよう、不透明にしない', () => {
    expect(FLOATING_OPACITY.open).toBeLessThan(0.9);
    expect(FLOATING_OPACITY.idle).toBeLessThanOrEqual(FLOATING_OPACITY.open);
  });

  it('CSS の文字列版も同じ値になる', () => {
    const css = floatingSurfaceCss('dark', 'open', true);
    expect(css).toContain(`blur(${FLOATING_SURFACE.blurPx}px) !important`);
    expect(css).toContain(`border-radius: ${FLOATING_CONTROL.radius} !important`);
  });

  it('コンポーネントで透け具合・ぼかしを直書きしない（floatingSurfaceStyle から取る）', () => {
    const pattern = /backdropFilter|backdrop-filter|blur\(\d|glassOpen|glassCollapsed|glassButton/;
    const offenders = walk(ROOT)
      .map(f => relative(ROOT, f).split('\\').join('/'))
      .filter(rel => !ALLOWED.includes(rel))
      .filter(rel => pattern.test(readFileSync(join(ROOT, rel), 'utf8')));
    expect(offenders, `ui/atoms/floatingSurface.ts の floatingSurfaceStyle を使うこと: ${offenders.join(', ')}`).toEqual([]);
  });
});
