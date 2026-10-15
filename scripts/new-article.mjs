/**
 * 記事のひな形を作る（4言語ぶん）。手でコピーして写し間違える（slug の書き忘れ・index.ts への追加漏れ）のを防ぐ。
 *
 *   npm run article:new -- --slug how-to-read-station-numbers
 *
 * - docs/templates/article-template.ts を src/data/articles/{slug}.ts に写し、slug・公開日・変数名を入れる
 * - 日本語の下書き（ja）を en / zh / ko にも写す（4言語でブロックの並びをそろえる決まりのため）。
 *   「〇〇」の所を書き終えるまでテストが落ちる（書きかけのまま公開しない）
 * - src/data/articles/index.ts に1行足す
 * 書いたら npm run article:validate で確かめる。手順は docs/article-writing.md
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const i = process.argv.indexOf('--slug');
const slug = i >= 0 ? process.argv[i + 1] : undefined;
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('使い方: npm run article:new -- --slug {英小文字・数字・ハイフンの slug}');
  process.exit(1);
}
const out = join(ROOT, 'src/data/articles', `${slug}.ts`);
if (existsSync(out)) {
  console.error(`${out} は既にある`);
  process.exit(1);
}

const camel = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const name = /^[0-9]/.test(camel) ? `article${camel}` : camel;
const today = new Date().toISOString().slice(0, 10);

let src = readFileSync(join(ROOT, 'docs/templates/article-template.ts'), 'utf8')
  .replace('export const exampleArticle', `export const ${name}`)
  .replace("slug: 'example-article'", `slug: '${slug}'`)
  .replace("publishedDate: '2026-10-01'", `publishedDate: '${today}'`);

// 日本語の下書きを en / zh / ko に写す
const jaStart = src.indexOf('    ja: {');
const placeholder = src.indexOf('    // en / zh / ko も同じ並びで書く');
const end = src.indexOf('  },\n};', placeholder);
if (jaStart < 0 || placeholder < 0 || end < 0) {
  console.error('docs/templates/article-template.ts の形が想定と違う（ja: { … } の後に en / zh / ko の行がある形）');
  process.exit(1);
}
const ja = src.slice(jaStart, placeholder);
const copies = ['en', 'zh', 'ko'].map(l => ja.replace('    ja: {', `    ${l}: {`)).join('');
src = src.slice(0, placeholder) + copies + src.slice(end);
writeFileSync(out, src);

const indexPath = join(ROOT, 'src/data/articles/index.ts');
let index = readFileSync(indexPath, 'utf8');
const lastImport = index.lastIndexOf("import { ");
const lineEnd = index.indexOf('\n', lastImport);
index = index.slice(0, lineEnd + 1) + `import { ${name} } from './${slug}';\n` + index.slice(lineEnd + 1);
index = index.replace(/\n\];\s*$/, `\n  ${name},\n];\n`);
writeFileSync(indexPath, index);

console.log(`作った: src/data/articles/${slug}.ts（index.ts に追加済み）`);
console.log('「〇〇」を4言語とも書き換えてから npm run article:validate');
