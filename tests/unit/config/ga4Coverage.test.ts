/**
 * GA4 の計測がすべてのページで動き、Cookie の確認が何度も出ないことのテスト。
 *
 * 以前は GA4Loader を読み込んでいるのが地図・ガイド・駅/路線ページだけで、記事・全画面・
 * 静的ページ（このサイトについて・よくある質問など）は計測されていなかった。
 * また PR のプレビューはURLが毎回違い保存領域も別のため、開くたびに Cookie の確認が出ていた。
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { isProductionSite, PRODUCTION_ORIGIN } from '../../../src/utils/siteHost';
import { SITE_URL } from '../../../src/config/seo';

const SRC = join(__dirname, '../../../src');
const read = (p: string) => readFileSync(join(SRC, p), 'utf8');

function astroFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) astroFiles(p, out);
    else if (name.endsWith('.astro')) out.push(p);
  }
  return out;
}

describe('GA4 をすべてのページで読み込む', () => {
  it('<head> を持つ所（FaviconLinks を置く所）はすべて GA4Loader か SeoHead を置いている', () => {
    const missing = astroFiles(SRC)
      .map(f => relative(SRC, f).split('\\').join('/'))
      .filter(rel => rel !== 'components/seo/SeoHead.astro')
      .filter(rel => /<FaviconLinks\b/.test(read(rel)))
      .filter(rel => !/<GA4Loader\b|<SeoHead\b/.test(read(rel)));
    expect(missing).toEqual([]);
  });

  it('SeoHead は GA4Loader を含む', () => {
    expect(read('components/seo/SeoHead.astro')).toMatch(/<GA4Loader\b/);
  });

  it('GA4 は本番サイトでだけ読み込む（プレビュー・ローカルのアクセスを混ぜない）', () => {
    const loader = read('components/GA4Loader.astro');
    expect(loader).toContain('PRODUCTION_ORIGIN');
    expect(loader).toMatch(/location\.origin\s*!==\s*PRODUCTION_ORIGIN/);
  });
});

describe('Cookie の確認は本番で1回だけ', () => {
  it('本番のオリジンだけを本番とみなす', () => {
    expect(PRODUCTION_ORIGIN).toBe(new URL(SITE_URL).origin);
    expect(isProductionSite(PRODUCTION_ORIGIN)).toBe(true);
    expect(isProductionSite('https://deploy-preview-44--flex-railway-map.netlify.app')).toBe(false);
    expect(isProductionSite('http://localhost:8080')).toBe(false);
  });

  it('Cookie の確認は本番でだけ出し、回答は保存して次からは出さない', () => {
    const banner = read('components/CookieBanner.tsx');
    expect(banner).toContain('isProductionSite()');
    expect(banner).toContain("localStorage.getItem('cookieConsent')");
  });
});
