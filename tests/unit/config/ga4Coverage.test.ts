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
import { CONSENT_STORAGE_KEY, CONSENT_TEXTS } from '../../../src/components/consent/staticConsentBanner';

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

  it('記事に埋め込んだ地図（?embed=1）では読み込まない（記事の閲覧を地図の閲覧として二重に数えない）', () => {
    expect(read('components/GA4Loader.astro')).toMatch(/get\(EMBED_PARAM\)\s*===\s*'1'\)\s*return/);
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

describe('地図のページ以外でも Cookie の確認を出す（2026-10-16）', () => {
  /** React の地図（RailwayMap の CookieBanner）を読み込むページ。ここは地図のバナーが聞く */
  const MAP_APP_PAGES = ['pages/index.astro', 'pages/fullscreen.astro'];

  it('GA4Loader を置く所は、地図のページ以外すべて consentBanner を付ける', () => {
    const withoutBanner = astroFiles(SRC)
      .map(f => relative(SRC, f).split('\\').join('/'))
      .filter(rel => rel !== 'components/GA4Loader.astro')
      .filter(rel => /<GA4Loader\b/.test(read(rel)))
      .filter(rel => !/<GA4Loader\s+consentBanner\b/.test(read(rel)));
    expect(withoutBanner.sort()).toEqual([...MAP_APP_PAGES].sort());
  });

  it('地図のページは地図のバナー（CookieBanner）を出す RailwayMap を読み込む', () => {
    expect(read('components/RailwayMap.tsx')).toMatch(/<CookieBanner\b/);
    expect(read('pages/index.astro')).toMatch(/ThemeWrapper/);
    expect(read('components/FullscreenMapWrapper.tsx')).toMatch(/<RailwayMap\b/);
  });

  it('答えは地図のバナーと同じ保存先に残す（どちらで答えても、もう一方では聞かない）', () => {
    expect(read('components/CookieBanner.tsx')).toContain(`localStorage.getItem('${CONSENT_STORAGE_KEY}')`);
  });

  it('確認を出すページでは、答えが出るまで GA4 の閲覧の送信（config）を始めない', () => {
    const loader = read('components/GA4Loader.astro');
    expect(loader).toMatch(/var waitForAnswer = CONSENT_BANNER && !stored;/);
    expect(loader).toMatch(/if \(!waitForAnswer\) start\(\);/);
    expect(loader).toMatch(/window\.flexConsentDecided = function/);
  });

  it('文言は4言語そろっている（地図のバナーと同じ翻訳）', () => {
    for (const texts of Object.values(CONSENT_TEXTS)) {
      for (const v of Object.values(texts)) expect(v).toBeTruthy();
    }
  });
});

describe('Search Console の確認コード', () => {
  it('.env.production 以外に直接書かない（config/seo.ts の GOOGLE_SITE_VERIFICATION から取る）', () => {
    const offenders = astroFiles(SRC)
      .map(f => relative(SRC, f).split('\\').join('/'))
      .filter(rel => /name="google-site-verification"\s+content="/.test(read(rel)));
    expect(offenders).toEqual([]);
  });
});
