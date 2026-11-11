/**
 * スマホ幅（390x844）で地図アプリの画面を開き、UI の数字を数え直す（2026-11, docs/app/ui-review-2026-11.md）。
 *
 * 数えるもの:
 * - 押せるもの（button / a / input / role=button 等）の大きさ。44px 未満・24px 未満の数
 * - 文字と背景のコントラスト比（4.5:1 未満の数）
 * - 「表示切替」パネルの開閉が何段あるか、全部開いたときの縦の長さ（画面何枚分か）
 *
 * 使い方:
 *   npm run build && npx astro preview --port 4392 --host 127.0.0.1 &
 *   node scripts/audit-mobile-ui.mjs http://127.0.0.1:4392 <出力先フォルダ>
 * ブラウザは PW_CHROMIUM_PATH（無ければ Playwright の既定）を使う。外部への通信（地図タイル等）は止める。
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const [base = 'http://127.0.0.1:4392', outdir = 'ui-audit-out'] = process.argv.slice(2);
mkdirSync(outdir, { recursive: true });
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const host = new URL(base).hostname;
await page.route('**/*', r => (new URL(r.request().url()).hostname === host ? r.continue() : r.abort()));

/** 画面に見えている押せるものと文字を集める */
const measure = () => page.evaluate(() => {
  const parse = c => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if ((c[3] ?? 1) > 0.5) return c; } return [30, 30, 30, 1]; };
  const visible = el => {
    const r = el.getBoundingClientRect(); const st = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none'
      && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && parseFloat(st.opacity) > 0.05;
  };
  const outside = el => el.closest('.leaflet-control-attribution') || el.closest('footer');
  const sel = 'button, a[href], input, select, textarea, [role="button"], [role="switch"], [role="tab"]';
  const controls = [...document.querySelectorAll(sel)].filter(el => visible(el) && !outside(el)).map(el => {
    const r = el.getBoundingClientRect();
    return { label: (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ').slice(0, 28), w: Math.round(r.width), h: Math.round(r.height) };
  });
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const t = n.textContent.trim(); if (!t) continue;
    const el = n.parentElement;
    if (!el || !visible(el) || outside(el) || el.closest('.leaflet-marker-pane')) continue;
    const st = getComputedStyle(el);
    const L1 = lum(parse(st.color)), L2 = lum(bgOf(el));
    texts.push({ t: t.slice(0, 24), fs: parseFloat(st.fontSize), ratio: Math.round((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05) * 10) / 10 });
  }
  return { controls, texts };
});

const summarize = (name, m) => ({
  name,
  controls: m.controls.length,
  under44: m.controls.filter(c => Math.min(c.w, c.h) < 44).length,
  under24: m.controls.filter(c => Math.min(c.w, c.h) < 24).map(c => `${c.label}(${c.w}x${c.h})`),
  lowContrast: m.texts.filter(t => t.ratio < 4.5).map(t => `${t.t}[${t.ratio}]`),
  under12px: [...new Set(m.texts.filter(t => t.fs < 12).map(t => `${t.t}(${t.fs}px)`))],
});

const open = async query => { await page.goto(`${base}/${query}`, { waitUntil: 'load' }); await page.waitForTimeout(9000); };
const out = [];

await open('?lang=ja');
await page.screenshot({ path: `${outdir}/home.png` });
out.push(summarize('最初の画面', await measure()));

await page.getByText('表示切替', { exact: true }).first().click();
await page.waitForTimeout(600);
out.push(summarize('表示切替（開いた直後）', await measure()));
const levels = [];
for (let level = 2; level <= 6; level++) {
  const closed = page.locator('[aria-expanded="false"]:visible');
  const n = await closed.count();
  if (!n) break;
  const opened = [];
  for (let i = 0; i < n; i++) {
    const el = closed.nth(0);
    if (!(await el.count())) break;
    opened.push(((await el.getAttribute('aria-label')) || (await el.textContent()) || '').trim().replace(/\s+/g, ' ').slice(0, 30));
    await el.scrollIntoViewIfNeeded().catch(() => {});
    await el.click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(250);
  }
  levels.push({ level, opened });
}
const panelHeight = await page.evaluate(() => {
  const els = [...document.querySelectorAll('*')].filter(e => /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 20);
  return els.length ? Math.max(...els.map(e => e.scrollHeight)) : 0;
});
out.push({ name: '表示切替の開閉の段', levels, panelHeight, screens: Math.round(panelHeight / 844 * 10) / 10 });

await open('?from=shibuya&to=tokyo&lang=ja');
await page.screenshot({ path: `${outdir}/route.png` });
out.push(summarize('経路を出した画面', await measure()));

await page.locator('.leaflet-marker-icon.leaflet-interactive').first().click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(800);
await page.screenshot({ path: `${outdir}/station.png` });
out.push(summarize('駅を押した（時刻表）', await measure()));

writeFileSync(`${outdir}/audit.json`, JSON.stringify(out, null, 1));
for (const o of out) {
  console.log(o.levels
    ? `${o.name}: ${o.levels.map(l => `${l.level}段目 ${l.opened.length}個`).join(' / ')}、全部開くと ${o.panelHeight}px（画面 ${o.screens} 枚分）`
    : `${o.name}: 押せるもの ${o.controls} 個（44px 未満 ${o.under44}、24px 未満 ${o.under24.length}）、コントラスト 4.5 未満 ${o.lowContrast.length}、12px 未満の文字 ${o.under12px.length}`);
}
await browser.close();
