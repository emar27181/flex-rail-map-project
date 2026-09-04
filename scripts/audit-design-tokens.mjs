#!/usr/bin/env node
/**
 * デザインの一元管理の点検スクリプト。
 *
 * 色・フォントサイズ・余白・角丸がどれだけベタ書きされているかを数える。
 * docs/design-system.md の表はこの出力を元にしているので、
 * 数字を更新したいときはこれを実行して同ファイルを直す。
 *
 *   node scripts/audit-design-tokens.mjs
 *   node scripts/audit-design-tokens.mjs --list fontSize   # 該当箇所を列挙
 *
 * 路線色などのデータ定義（src/data/）は仕様上のデータなので対象外にする。
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const REPO = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC = join(REPO, 'src');

const listTarget = process.argv.includes('--list')
  ? process.argv[process.argv.indexOf('--list') + 1]
  : null;

/** 対象ファイルを再帰的に集める */
function collect(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...collect(p));
    else if (/\.(tsx|ts|astro)$/.test(p)) out.push(p);
  }
  return out;
}

/** データ層は路線色などの仕様データなので点検対象外 */
const isUICode = f => !f.includes(`${'/'}data${'/'}`);

/** 行コメントは誤検出のもとなので飛ばす */
const isComment = line => /^\s*(\/\/|\*|\/\*)/.test(line);

const RULES = [
  {
    key: 'fontSize',
    label: 'fontSize のベタ書き',
    should: 'FS（src/constants/ui.ts）',
    re: /fontSize:\s*['"`](\d+)px/g,
  },
  {
    key: 'borderRadius',
    label: 'borderRadius のベタ書き',
    should: 'L.r（legendStyles.ts）',
    re: /borderRadius:\s*['"`](\d+)px/g,
  },
  {
    key: 'spacing',
    label: 'padding / margin のベタ書き',
    should: 'L.sp（legendStyles.ts）',
    re: /(?:padding|margin)(?:Top|Bottom|Left|Right)?:\s*['"`]([\d ]+px[^'"`]*)['"`]/g,
  },
  {
    key: 'hexColor',
    label: '16進カラーのベタ書き',
    should: 'getThemeColors(theme) / 意味付き定数',
    re: /(#[0-9a-fA-F]{6}\b)/g,
  },
  {
    key: 'rgba',
    label: 'rgba() のベタ書き',
    should: 'getThemeColors(theme)',
    re: /(rgba?\(\s*\d+[^)]*\))/g,
  },
];

/** 意味を持つ色。1箇所で定義すべきもの */
const SEMANTIC_COLORS = {
  '#4CAF50': '出発駅・確定・OK',
  '#F44336': '到着駅・警告',
  '#2196F3': 'primary（選択中・リンク）',
};

const files = collect(SRC).filter(isUICode);
const findings = new Map(RULES.map(r => [r.key, []]));

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    for (const rule of RULES) {
      const re = new RegExp(rule.re.source, 'g');
      let m;
      while ((m = re.exec(line))) {
        findings.get(rule.key).push({
          file: relative(REPO, file),
          line: i + 1,
          value: m[1],
          text: line.trim().slice(0, 100),
        });
      }
    }
  });
}

if (listTarget) {
  const rows = findings.get(listTarget);
  if (!rows) {
    console.error(`不明な対象: ${listTarget}（${RULES.map(r => r.key).join(', ')}）`);
    process.exit(1);
  }
  for (const r of rows) console.log(`${r.file}:${r.line}  ${r.value}\n    ${r.text}`);
  console.log(`\n合計 ${rows.length} 箇所`);
  process.exit(0);
}

console.log(`対象: ${files.length} ファイル（src/data/ を除く）\n`);
console.log('項目'.padEnd(30) + '箇所'.padStart(6) + '  種類'.padStart(6) + '  本来使うもの');
console.log('-'.repeat(88));

for (const rule of RULES) {
  const rows = findings.get(rule.key);
  const kinds = new Set(rows.map(r => r.value)).size;
  console.log(
    rule.label.padEnd(28) +
    String(rows.length).padStart(6) +
    String(kinds).padStart(8) + '  ' +
    rule.should
  );
}

// ファイル別の偏り
console.log('\n=== ベタ書きが多いファイル（上位8） ===');
const perFile = {};
for (const rows of findings.values()) {
  for (const r of rows) perFile[r.file] = (perFile[r.file] ?? 0) + 1;
}
Object.entries(perFile)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .forEach(([f, n]) => console.log(`  ${String(n).padStart(4)}  ${f}`));

// 意味を持つ色
console.log('\n=== 意味を持つ色のベタ書き（1箇所で定義すべきもの） ===');
for (const [hex, meaning] of Object.entries(SEMANTIC_COLORS)) {
  const rows = findings.get('hexColor').filter(r => r.value.toLowerCase() === hex.toLowerCase());
  const fileCount = new Set(rows.map(r => r.file)).size;
  console.log(`  ${hex} (${meaning}): ${rows.length}箇所 / ${fileCount}ファイル`);
}

// 共有ボタンの浸透度
const buttonTotal = files
  .filter(f => f.endsWith('.tsx'))
  .reduce((n, f) => n + (readFileSync(f, 'utf8').match(/<button/g)?.length ?? 0), 0);
const btnHelper = files
  .reduce((n, f) => n + (readFileSync(f, 'utf8').match(/style=\{btn\(/g)?.length ?? 0), 0);
console.log('\n=== ボタン ===');
console.log(`  <button> 要素: ${buttonTotal}`);
console.log(`  共有ヘルパ btn() 使用: ${btnHelper}`);
console.log(`  インラインstyle: ${buttonTotal - btnHelper}`);

// テーマ非対応のコンポーネント（インラインstyleを持つのに色をテーマから取っていない）
const components = files.filter(f => /(components|v2)\/.*\.tsx$/.test(f));
const noTheme = components.filter(f => {
  const s = readFileSync(f, 'utf8');
  if (!/style=\{\{/.test(s)) return false;
  // theme を受け取って配色ユーティリティに委ねている部品も「対応済み」とみなす
  return !/getThemeColors|useTheme|--v2-|filledLabelColors|theme:\s*'light'/.test(s);
});
console.log('\n=== テーマから色を取っていないコンポーネント ===');
console.log(`  ${noTheme.length} / ${components.length}（ダークモードで崩れる可能性）`);
noTheme.forEach(f => console.log(`    ${relative(REPO, f)}`));

// トークン定義の分裂
console.log('\n=== トークン定義系ごとの参照ファイル数 ===');
const systems = [
  ['constants/ui.ts (FS/TARGET)', /from ['"].*constants\/ui['"]/],
  ['legend/legendStyles.ts (L)', /from ['"].*legendStyles['"]/],
  ['design/tokens.ts (--v2-*)', /--v2-|design\/tokens|cssVars/],
];
for (const [name, re] of systems) {
  const n = files.filter(f => re.test(readFileSync(f, 'utf8'))).length;
  console.log(`  ${name.padEnd(32)} ${n} ファイル`);
}

console.log('\n詳細は docs/design-system.md を参照。');
console.log('個別の箇所を見るには --list <fontSize|borderRadius|spacing|hexColor|rgba>');
