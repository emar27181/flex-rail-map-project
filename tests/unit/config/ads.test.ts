import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { ADSENSE_CLIENT, ADSENSE_SCRIPT_SRC, ADSENSE_SLOTS } from '../../../src/config/ads';

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
