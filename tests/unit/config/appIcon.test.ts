import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { APP_ICON_PATH } from '../../../src/config/seo';

const ROOT = join(__dirname, '../../..');

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) return listFiles(abs);
    return /\.(ts|tsx|astro|css)$/.test(name) ? [abs] : [];
  });
}

describe('アプリのアイコン', () => {
  it('PWA の manifest のアイコンと、サイトで使うアイコンが同じファイル', () => {
    const manifest = JSON.parse(readFileSync(join(ROOT, 'public/manifest.json'), 'utf8'));
    expect(manifest.icons.length).toBeGreaterThan(0);
    for (const icon of manifest.icons) expect(icon.src).toBe(APP_ICON_PATH);
  });

  it('アイコンのパスを src/config/seo.ts 以外に書かない（ページごとに書くと片方だけ変わる）', () => {
    const file = APP_ICON_PATH.replace(/^\//, '');
    const offenders = listFiles(join(ROOT, 'src'))
      .filter(f => !f.endsWith(join('config', 'seo.ts')))
      .filter(f => readFileSync(f, 'utf8').includes(file))
      .map(f => f.replace(ROOT + '/', ''));
    expect(offenders).toEqual([]);
  });
});
