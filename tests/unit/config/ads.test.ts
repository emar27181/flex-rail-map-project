import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { ADSENSE_CLIENT, ADSENSE_SCRIPT_SRC, ADSENSE_SLOTS, hasManualAdSlot } from '../../../src/config/ads';

const ROOT = join(__dirname, '../../..');
const SRC = join(ROOT, 'src');

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) return listFiles(abs);
    return /\.(ts|tsx|astro|mjs|js)$/.test(name) ? [abs] : [];
  });
}

describe('広告の設定（src/config/ads.ts）', () => {
  it('サイト運営者 ID と広告スクリプトの URL', () => {
    expect(ADSENSE_CLIENT).toMatch(/^ca-pub-\d{16}$/);
    expect(ADSENSE_SCRIPT_SRC).toBe(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`);
  });

  it('src/config/ads.ts 以外にサイト運営者 ID（ca-pub-…）を直書きしない', () => {
    const offenders = listFiles(SRC)
      .filter(f => !f.endsWith(join('config', 'ads.ts')))
      .filter(f => /ca-pub-\d/.test(readFileSync(f, 'utf8')))
      .map(f => f.replace(ROOT + '/', ''));
    expect(offenders).toEqual([]);
  });

  it('広告ユニット ID は空（未設定）か、管理画面の ID の形（数字10桁）。仮の連番を入れない', () => {
    for (const [key, slot] of Object.entries(ADSENSE_SLOTS)) {
      if (slot === '') continue;
      expect(slot, key).toMatch(/^\d{10}$/);
      expect(['0123456789', '1234567890', '0987654321', '9876543210'], key).not.toContain(slot);
    }
  });
});

describe('広告はこちらで決めた位置にだけ出す（自動広告・全画面広告を使わない, 2026-11）', () => {
  const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');

  it('hasManualAdSlot は広告ユニット ID が1つでも入っているときだけ true', () => {
    expect(hasManualAdSlot('')).toBe(false);
    expect(hasManualAdSlot('', '  ')).toBe(false);
    expect(hasManualAdSlot('', '1357924680')).toBe(true);
  });

  it('広告スクリプトを読むファイルは、広告の枠があるときだけ読む（hasManualAdSlot で判定する）', () => {
    // 広告スクリプトを読んだページでは、管理画面の自動広告（全画面広告・アンカー広告を含む）が効いてしまう
    const loaders = listFiles(SRC)
      .filter(f => !f.endsWith(join('config', 'ads.ts')))
      .filter(f => readFileSync(f, 'utf8').includes('ADSENSE_SCRIPT_SRC'))
      .map(f => f.replace(ROOT + '/', ''))
      .sort();
    expect(loaders).toEqual(['src/components/articles/ArticleLayout.astro', 'src/pages/index.astro']);
    for (const f of loaders) expect(read(f), f).toMatch(/hasManualAdSlot\(ADSENSE_SLOTS\.\w+\)/);
    expect(read('src/pages/index.astro')).toMatch(/\{LOAD_ADSENSE && <script/);
    expect(read('src/components/articles/ArticleLayout.astro')).toMatch(/\{hasManualAdSlot\(ADSENSE_SLOTS\.articleInline\) && <script async src=\{ADSENSE_SCRIPT_SRC\}/);
  });

  it('広告の枠が無い静的ページ（プライバシーポリシー等）では広告スクリプトを読まない', () => {
    expect(read('src/layouts/StaticPage.astro')).not.toMatch(/ADSENSE_SCRIPT_SRC|adsbygoogle\.js/);
  });

  it('自動広告を有効にするコード（enable_page_level_ads など）を書かない', () => {
    const offenders = listFiles(SRC)
      .filter(f => /enable_page_level_ads|google_ad_client|overlays\s*:/.test(readFileSync(f, 'utf8')))
      .map(f => f.replace(ROOT + '/', ''));
    expect(offenders).toEqual([]);
  });

  it('広告ユニット ID を画面のファイルに直接書かない（ADSENSE_SLOTS から取る）', () => {
    // 2026-10 まで地図の下の広告に、実在を確かめていない仮の ID `0987654321` が直接書かれていた
    const offenders = listFiles(SRC)
      .filter(f => !f.endsWith(join('config', 'ads.ts')))
      .filter(f => /(adSlot|data-ad-slot|slot)\s*[=:]\s*["'`]\d{6,}["'`]/.test(readFileSync(f, 'utf8')))
      .map(f => f.replace(ROOT + '/', ''));
    expect(offenders).toEqual([]);
  });

  it('地図の下の広告は、広告ユニット ID があるときだけ置く', () => {
    expect(read('src/components/ThemeWrapper.tsx')).toMatch(/hasManualAdSlot\(ADSENSE_SLOTS\.mapBottom\) && <StickyBottomAd adSlot=\{ADSENSE_SLOTS\.mapBottom\}/);
  });
});
