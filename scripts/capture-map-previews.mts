/**
 * ページ冒頭の地図の「実際の画面」を撮り、検索結果・SNS のサムネイル（og:image）と、
 * 埋め込み地図の読み込み中の表示に使う画像を作る（src/seo/mapPreview.ts）。
 *
 * ビルドしたサイトを実際のブラウザで開き、そのページに埋め込んである地図と同じ URL
 * （同じ路線・同じ範囲・そのページの言語）を撮る。作り物の図は作らない。
 *
 * 使い方:
 *   npm run build
 *   npm run og:capture                       # sitemap に載っている路線・ガイド・記事・駅のページ
 *   npm run og:capture -- --only /en/lines/  # パスに含む文字で絞る
 *   npm run og:capture -- --missing          # まだ画像が無いページだけ
 *
 * 出力: public/og/{ページのパス}.jpg（1200×630）。撮り直したら、もう一度 npm run build で og:image に入る。
 * 撮影条件: 800×420 を 1.5 倍・ダークテーマ・サービスワーカーと外部への通信を止める（描画テストと同じ条件）
 */
import { chromium, type Browser } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { MAP_PREVIEW, mapPreviewPath } from '../src/seo/mapPreview';
import { SITE_URL } from '../src/config/seo';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const PORT = 4329;
const BASE = `http://127.0.0.1:${PORT}`;
/** 撮るページの種類（sitemap のパスに含まれるもの） */
const KINDS = ['/lines/', '/guides/', '/articles/', '/stations/'];
const CONCURRENCY = 4;

const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const only = arg('--only');
const missingOnly = process.argv.includes('--missing');

const unescape = (s: string) => s.replace(/&amp;|&#38;/g, '&').replace(/&quot;/g, '"');

/** sitemap のページのうち、冒頭に地図を埋め込んでいるもの（その地図の URL） */
function targets(): Array<{ path: string; src: string }> {
  const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(SITE_URL, '') || '/');
  return paths
    .filter(p => KINDS.some(k => p.includes(k)) && (!only || p.includes(only)))
    .flatMap(p => {
      const html = readFileSync(join(DIST, p, 'index.html'), 'utf8');
      const src = html.match(/<div class="map-embed-frame">[\s\S]*?<iframe src="([^"]+)"/)?.[1];
      return src ? [{ path: p, src: unescape(src) }] : [];
    })
    .filter(t => !missingOnly || !existsSync(join(ROOT, 'public', mapPreviewPath(t.path)!)));
}

async function capture(browser: Browser, t: { path: string; src: string }): Promise<void> {
  const ctx = await browser.newContext({
    viewport: { width: MAP_PREVIEW.width, height: MAP_PREVIEW.height },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    serviceWorkers: 'block',
  });
  try {
    const page = await ctx.newPage();
    await page.route('**/*', r => (new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : r.abort()));
    await page.goto(BASE + t.src);
    await page.waitForSelector('.app-loading', { state: 'hidden', timeout: 30_000 });
    await page.waitForSelector('.leaflet-container', { timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    const jpg = await page.screenshot({ type: 'jpeg', quality: 76 });
    const out = join(ROOT, 'public', mapPreviewPath(t.path)!);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, jpg);
  } finally {
    await ctx.close();
  }
}

async function main() {
  if (!existsSync(join(DIST, 'sitemap.xml'))) throw new Error('先に npm run build を実行する');
  const list = targets();
  console.log(`撮るページ: ${list.length}`);
  const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], { stdio: 'ignore' });
  try {
    for (let i = 0; i < 60; i++) {
      if (await fetch(BASE).then(r => r.ok, () => false)) break;
      await new Promise(r => setTimeout(r, 500));
    }
    const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
    const failed: string[] = [];
    let done = 0;
    const queue = [...list];
    await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
      for (let t = queue.shift(); t; t = queue.shift()) {
        try { await capture(browser, t); } catch (e) { failed.push(`${t.path}: ${(e as Error).message.split('\n')[0]}`); }
        if (++done % 20 === 0) console.log(`${done}/${list.length}`);
      }
    }));
    await browser.close();
    console.log(`撮った: ${list.length - failed.length} / 失敗: ${failed.length}`);
    for (const f of failed) console.log(`  ${f}`);
    if (failed.length) process.exitCode = 1;
  } finally {
    server.kill();
  }
}

main();
