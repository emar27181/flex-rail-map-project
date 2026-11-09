/**
 * アプリ用のデータを JSON に書き出す（docs/app/flutter-app-spec.md の 4.1）。
 *
 *   npm run app:data                # app/assets/data/ に書き出す
 *   npm run app:data -- <出力先>     # 別の場所に書き出す
 *
 * 書き出したファイルは手で直さない（元は src/data/ などの一次情報）。app/assets/data/ は git に入れない。
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildAppDataFiles } from './buildAppData';

const outDir = resolve(process.argv[2] ?? 'app/assets/data');
mkdirSync(outDir, { recursive: true });
const { files, manifest } = buildAppDataFiles();
for (const [name, text] of Object.entries(files)) writeFileSync(join(outDir, name), text);

const kb = (n: number) => `${Math.round(n / 1024)}KB`;
console.log(`版 ${manifest.version}（形 ${manifest.schemaVersion}）→ ${outDir}`);
for (const [name, e] of Object.entries(manifest.files)) console.log(`  ${name.padEnd(20)} ${kb(e.bytes)}`);
