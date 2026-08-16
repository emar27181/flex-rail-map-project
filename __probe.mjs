import { chromium, devices } from '@playwright/test';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ ...devices['iPhone 13'], hasTouch: true });
const p = await ctx.newPage();
await p.goto('http://localhost:8081/', { waitUntil: 'load' });
await p.waitForTimeout(9000);
// Cookieバナーを閉じる
const agree = p.getByText('すべて同意', { exact: true });
if (await agree.count()) { await agree.first().click(); await p.waitForTimeout(500); }

const tipName = () => p.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '出発駅に設定');
  if (!btn) return null;
  return btn.closest('div').parentElement.previousElementSibling?.firstElementChild?.textContent?.trim()
      ?? btn.parentElement.parentElement.innerText.split('\n')[0].trim();
});
const closeTip = async () => {
  const x = p.locator('span', { hasText: /^✕$/ });
  if (await x.count()) { await x.first().click({ force: true }); await p.waitForTimeout(300); }
};
const labels = () => p.evaluate(() => [...document.querySelectorAll('.station-name-marker')].map(el => {
  const r = el.getBoundingClientRect();
  return { name: el.innerText.trim().split('\n').pop(), cx: r.x+r.width/2, cy: r.y+r.height/2 };
}).filter(r => r.cy > 100 && r.cy < 620));

for (const [off, tag] of [[0,'中心'], [10,'10px下'], [-10,'10px上']]) {
  let hit=0, wrong=0, miss=0; const bad=[];
  const list = await labels();
  for (const r of list) {
    const cur = (await labels()).find(x => x.name === r.name);
    if (!cur) { continue; }
    await p.touchscreen.tap(cur.cx, cur.cy + off);
    await p.waitForTimeout(400);
    const n = await tipName();
    if (!n) { miss++; bad.push(`${r.name}:無`); }
    else if (n === r.name) hit++;
    else { wrong++; bad.push(`${r.name}→${n}`); }
    await closeTip();
  }
  console.log(`${tag}: 対象${list.length} 正解${hit} 別駅${wrong} 無反応${miss} ${bad.slice(0,5).join(' ')}`);
}
await b.close();
