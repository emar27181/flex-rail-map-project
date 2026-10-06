/**
 * デザインの規則（docs/design-system.md の「規則一覧（CI で検査）」）の検査テストを実行する。
 *
 *   npm run test:design
 *
 * どのテストを実行するかは表の「検査」列から読む。規則の一覧を表とこのスクリプトの2か所に
 * 書かないため（表に1行足せば、そのテストが CI の「デザイン規則」の段で動く）。
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export const RULES_DOC = 'docs/design-system.md';
export const RULES_HEADING = '## 規則一覧（CI で検査）';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** 表の「検査」列（3列目）に書かれたテストファイルのパス（重複なし・書かれた順） */
export function designRuleTests(root = ROOT) {
  const doc = readFileSync(join(root, RULES_DOC), 'utf8');
  const start = doc.indexOf(RULES_HEADING);
  if (start < 0) throw new Error(`${RULES_DOC} に「${RULES_HEADING}」がありません`);
  const rest = doc.slice(start + RULES_HEADING.length);
  const end = rest.search(/\n## /);
  const section = end < 0 ? rest : rest.slice(0, end);
  const files = [];
  for (const line of section.split('\n')) {
    const cells = line.split('|').map(c => c.trim());
    // | 規則 | 使うもの | 検査 | → ['', 規則, 使うもの, 検査, '']
    if (cells.length < 5 || cells[1] === '規則' || /^-+$/.test(cells[1])) continue;
    for (const m of cells[3].matchAll(/`(tests\/[^`]+)`/g)) {
      if (!files.includes(m[1])) files.push(m[1]);
    }
  }
  return files;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const files = designRuleTests();
  console.log(`デザイン規則の検査 ${files.length} 件（${RULES_DOC}）`);
  const r = spawnSync('npx', ['vitest', 'run', ...files], { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
  process.exit(r.status ?? 1);
}
