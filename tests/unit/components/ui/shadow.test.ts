/**
 * 影の一元管理（ui/atoms/shadow.ts）のテスト。
 *
 * 所要時間の丸・駅ラベル・浮かぶボタンなどに場所ごとに影を書いていて、濃さがばらばらだった。
 * 方針は「影なし」（2026-10-06）。戻すときは SHADOW の enabled を true にするだけで、
 * 呼び出し側は直さない。そのため、影は必ず shadow() / textHalo() から取る。
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  SHADOW, TEXT_HALO, shadow, buildShadow, dropShadowFilter, joinShadows, textHalo, textHaloCss,
  type ShadowRole,
} from '../../../../src/components/ui/atoms/shadow';
import { getThemeColors } from '../../../../src/contexts/ThemeContext';
import { TOKEN_VARS_CSS } from '../../../../src/components/ui/atoms/controlCss';

const ROLES = Object.keys(SHADOW) as ShadowRole[];
const THEMES = ['light', 'dark'] as const;

describe('影の方針', () => {
  it('既定ではどの役割も影を付けない', () => {
    for (const role of ROLES) {
      expect(SHADOW[role].enabled, role).toBe(false);
      for (const theme of THEMES) {
        expect(shadow(role, theme)).toBe('none');
        expect(dropShadowFilter(role, theme)).toBe('none');
      }
    }
  });

  it('enabled を true にすれば、その役割の値どおりの影になる（設定ファイルだけで戻せる）', () => {
    const spec = { ...SHADOW.marker, enabled: true };
    expect(buildShadow(spec, 'dark')).toBe(`0 ${spec.offsetY}px ${spec.blur}px ${getThemeColors('dark').shadowHeavy}`);
    expect(buildShadow({ ...SHADOW.raised, enabled: true }, 'light')).toBe(
      `0 ${SHADOW.raised.offsetY}px ${SHADOW.raised.blur}px ${getThemeColors('light').shadow}`,
    );
    expect(buildShadow(spec, 'light', { upward: true })).toContain(`0 -${spec.offsetY}px`);
    expect(buildShadow(spec, 'light', { color: 'red' })).toMatch(/ red$/);
  });

  it('輪（広がりだけの縁取り）と影をまとめるとき、影が無ければ輪だけになる', () => {
    expect(joinShadows('0 0 0 1px blue', 'none')).toBe('0 0 0 1px blue');
    expect(joinShadows('none', undefined, false)).toBe('none');
    expect(joinShadows('0 0 0 1px blue', '0 1px 3px black')).toBe('0 0 0 1px blue, 0 1px 3px black');
  });

  it('文字の縁取り（ハロー）は影ではないので既定でオン', () => {
    expect(TEXT_HALO.enabled).toBe(true);
    expect(textHalo('strong')).toBe(TEXT_HALO.strong);
    expect(textHaloCss('soft')).toBe(`text-shadow:${TEXT_HALO.soft};`);
  });

  it('記事・SEOページの CSS 変数 --shadow も同じ規格から作る', () => {
    expect(TOKEN_VARS_CSS).toContain(`--shadow: ${shadow('raised', 'light')}`);
    expect(TOKEN_VARS_CSS).toContain(`--shadow: ${shadow('raised', 'dark')}`);
  });
});

const SRC = join(__dirname, '../../../../src');
/** 定義元と、開発途上の別UI（v2・デザイン確認用パネル） */
const ALLOWED = ['components/ui/atoms/shadow.ts'];
const EXCLUDED_DIRS = ['v2', 'design'];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!EXCLUDED_DIRS.includes(name)) walk(p, out);
    } else if (/\.(tsx?|astro|css)$/.test(name)) out.push(p);
  }
  return out;
}

/** 影の値（box-shadow / text-shadow / drop-shadow / --shadow 変数）を取り出す */
const SHADOW_VALUE = /(?:box-?shadow|text-?shadow|drop-shadow|--(?:me-)?shadow)\s*[:(]\s*([^;}\n]*)/gi;
/** 影の色や「ずれ・ぼかし」を直書きしている印。広がりだけの輪（0 0 0 2px 色）は枠線なので対象外 */
const HARDCODED = /rgba\(|colors\.shadow|shadowHeavy|shadowColor|alphaBlack\(|-?\d+px\s+-?\d+px\s+[1-9]\d*px/;

describe('影の直書き', () => {
  it('src の中で影を直書きしない（ui/atoms/shadow.ts の shadow / textHalo から取る）', () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const rel = relative(SRC, file).split('\\').join('/');
      if (ALLOWED.includes(rel)) continue;
      const text = readFileSync(file, 'utf8');
      for (const m of text.matchAll(SHADOW_VALUE)) {
        if (HARDCODED.test(m[1])) offenders.push(`${rel}: ${m[0].trim().slice(0, 80)}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
