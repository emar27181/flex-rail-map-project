import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { COPYRIGHT_TEXT, PROJECT_NAME, SITE_NAME, withSiteName } from '../../../src/config/seo';

const ROOT = join(__dirname, '../../..');
const SRC = join(ROOT, 'src');

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) return listFiles(abs);
    return /\.(ts|tsx|astro)$/.test(name) ? [abs] : [];
  });
}

/** 旧名・別表記と、正式名の直書き */
const NAME = /Flex Rail(?:way)? Map|フレックス路線図/;
/** コメント行と、検索語の一覧（keywords）は対象外（検索される別名として残してよい） */
const ignorable = (line: string) => /^\s*(\*|\/\/|\/\*|<!--)/.test(line) || /keywords|KEYWORDS/.test(line);

describe('サービス名（正式名称: Flex Railway Map）', () => {
  it('正式名称・著作権表記は src/config/seo.ts で決める', () => {
    expect(SITE_NAME).toBe('Flex Railway Map');
    expect(PROJECT_NAME).toBe('Flex Railway Map Project');
    expect(COPYRIGHT_TEXT).toBe('© 2025 Flex Railway Map Project');
  });

  it('src/config/seo.ts 以外にサービス名を直書きしない（データは {siteName} と書く）', () => {
    const offenders: string[] = [];
    for (const file of listFiles(SRC)) {
      if (file.endsWith(join('config', 'seo.ts'))) continue;
      let inKeywordTable = false; // ARTICLE_PAGE_KEYWORDS など、検索語だけを並べた表の中
      readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        if (/KEYWORDS[^=]*=/.test(line)) inKeywordTable = true;
        else if (inKeywordTable && /^\};/.test(line)) inKeywordTable = false;
        if (!inKeywordTable && !ignorable(line) && NAME.test(line)) offenders.push(`${file.replace(ROOT + '/', '')}:${i + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it('PWA の manifest のアプリ名も正式名称', () => {
    const manifest = JSON.parse(readFileSync(join(ROOT, 'public/manifest.json'), 'utf8'));
    expect(manifest.name).toBe(SITE_NAME);
    expect(manifest.short_name).toBe(SITE_NAME);
  });

  it('{siteName} は文章・入れ子のオブジェクトの中まで置き換わる', () => {
    expect(withSiteName({ a: '{siteName}で見る', b: ['x {siteName}'] })).toEqual({ a: `${SITE_NAME}で見る`, b: [`x ${SITE_NAME}`] });
  });
});
