/**
 * 集合駅を探すモード: 既存の駅選択パネルの中だけで完結する（別パネル・別の入力欄を増やさない）。
 * 出発駅 + 常に出ている「＋ 出発駅を追加」の入力欄で2駅以上そろうと候補が出て、選ぶと既存の到着駅に入る。
 */
import { test, expect, collectErrors } from './helpers';

test('集合駅モード: 出発駅を追加すると候補が出て、選ぶと既存の到着駅に入る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  const stationInputs = page.locator('input.station-input-filled');
  const inputsBefore = await stationInputs.count();

  const toggle = page.getByRole('button', { name: '集合駅を探す' });
  await expect(toggle).toBeEnabled();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  // 出発駅が1つのうちは案内だけ
  await expect(page.locator('[data-meeting-results]')).toContainText('2駅以上そろえると');

  // 「＋ 出発駅を追加」の入力欄は、ボタンを押さなくても最初から出ている
  await expect(page.getByRole('button', { name: '出発駅を追加' })).toHaveCount(0);
  await expect(page.locator('[data-meeting-add]')).toHaveCount(1);
  const add = page.getByPlaceholder('出発駅を追加');
  await expect(add).toBeVisible();
  await add.fill('東京');
  await page.locator('[data-station-option="東京"]').first().click();

  const results = page.locator('[data-meeting-results]');
  await expect(results.getByRole('button')).toHaveCount(5);
  await expect(results).toContainText('最大');
  await expect(results).toContainText('新宿');
  await expect(results).toContainText('東京');
  // 駅の入力欄が増えるのは、追加した出発駅の行（1つ）だけ。別のパネル・入力欄は作らない
  expect(await stationInputs.count()).toBe(inputsBefore + 1);
  await expect(page.locator('[data-meeting-origin-rows] input.station-input-filled')).toHaveCount(1);

  // 候補を押すと到着駅に入る
  const first = results.getByRole('button').first();
  const name = (await first.innerText()).replace(/^1\.\s*/, '').split(' · ')[0];
  await first.click();
  await expect(stationInputs.nth(1)).toHaveValue(name);
  // 集合駅が決まると、出発駅ごとに使う路線が出る（新宿・東京の2人分）
  const routesBlock = page.locator('[data-meeting-routes]');
  await expect(routesBlock).toBeVisible();
  await expect(routesBlock.locator('[data-meeting-route]')).toHaveCount(2);
  await expect(routesBlock.locator('[data-meeting-route="新宿"]')).toContainText('分');
  // 時刻欄は元からある1つだけ（集合駅用の時刻欄は作らない）
  await expect(page.locator('input[type="time"]')).toHaveCount(1);

  // OFFで通常表示に戻る（候補の欄が消える）
  await toggle.click();
  await expect(page.locator('[data-meeting-results]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('集合駅モード: 出発駅の行は「追加」を押すたびに増え、✕で減らせる', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await page.getByRole('button', { name: '集合駅を探す' }).click();

  const rows = page.locator('[data-meeting-origin-rows] input.station-input-filled');
  await expect(rows).toHaveCount(0);
  for (const name of ['東京', '横浜', '渋谷']) {
    await page.getByPlaceholder('出発駅を追加').fill(name);
    await page.locator(`[data-station-option="${name}"]`).first().click();
  }
  // 入力欄は消えず、次の出発駅（出発駅 5）の分としていつでも出ている
  await expect(page.locator('[data-meeting-add]')).toHaveCount(1);
  await expect(page.locator('[data-meeting-add] label')).toHaveText('出発駅 5');
  // 出発駅欄と同じ見た目の行が、追加した数だけ縦に並ぶ（出発駅2・3・4）
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toHaveValue('東京');
  await expect(rows.nth(2)).toHaveValue('渋谷');
  const widths = await rows.evaluateAll(els => els.map(e => Math.round(e.getBoundingClientRect().width)));
  const departureWidth = await page.locator('input.station-input-filled').first().evaluate(e => Math.round(e.getBoundingClientRect().width));
  for (const w of widths) expect(Math.abs(w - departureWidth)).toBeLessThanOrEqual(2);
  // 4人分の所要時間が候補に並ぶ
  await expect(page.locator('[data-meeting-results]')).toContainText('新宿');
  await expect(page.locator('[data-meeting-results]')).toContainText('渋谷');

  // 横が空いていれば詰める: 2つ目までは同じ行に並ぶ
  const tops = await rows.evaluateAll(els => els.map(e => Math.round(e.getBoundingClientRect().top)));
  expect(tops[0]).toBe(tops[1]);

  // 集合駅を決めると、4人それぞれのルートと使う路線が並ぶ
  await page.locator('[data-meeting-results]').getByRole('button').first().click();
  await expect(page.locator('[data-meeting-route]')).toHaveCount(4);
  await expect(page.locator('[data-meeting-routes]')).toContainText('横浜');

  // ✕で行が減る
  await page.locator('[data-meeting-origin-rows] button[aria-label]').first().click();
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toHaveValue('横浜');
  expect(errors).toEqual([]);
});


for (const lang of ['ja', 'en', 'zh', 'ko'] as const) {
  test(`集合駅モード: 「＋ 出発駅を追加」の案内の文字が切れない（${lang}）`, async ({ page }) => {
    // 出発駅の行が1つのとき、追加欄が行の横に並ぶ（幅が足りなければ次の行へ回る）。狭いスマホで確かめる
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto(`/?mode=meeting&from=shinjuku&with=tokyo&lang=${lang}`);
    const input = page.locator('[data-meeting-add] input');
    await expect(input).toBeVisible();
    // 案内（placeholder）の文字の幅が、入力欄の中の幅（左の＋アイコンの余白を除く）に収まる
    const fit = await input.evaluate((el: HTMLInputElement) => {
      const cs = getComputedStyle(el);
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const text = ctx.measureText(el.placeholder).width;
      const inner = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return { text: Math.round(text), inner: Math.round(inner), placeholder: el.placeholder };
    });
    expect(fit.placeholder.length).toBeGreaterThan(0);
    expect(fit.text, JSON.stringify(fit)).toBeLessThanOrEqual(fit.inner);
  });
}

test('集合駅モード: 狭いスマホ（360px）でも「＋ 出発駅を追加」は出発駅の行の下で残りの幅いっぱいに出る', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/?mode=meeting&from=shinjuku&with=tokyo,yokohama');
  const add = page.locator('[data-meeting-add]');
  await expect(add).toBeVisible();
  const boxes = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-meeting-origin-rows] input.station-input-filled')].map(e => e.getBoundingClientRect());
    const add = document.querySelector('[data-meeting-add]')!.getBoundingClientRect();
    return { rowBottom: Math.max(...rows.map(r => r.bottom)), addTop: add.top, addWidth: Math.round(add.width), panelRight: document.querySelector('[data-meeting-origin-rows]')!.getBoundingClientRect().right, addRight: add.right };
  });
  expect(boxes.addTop).toBeGreaterThanOrEqual(boxes.rowBottom - 1); // 行の下に回る
  expect(boxes.addWidth).toBeGreaterThanOrEqual(200);
  expect(boxes.addRight).toBeLessThanOrEqual(boxes.panelRight + 1);
});
