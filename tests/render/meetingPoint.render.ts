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
  // 追加した出発駅は出発駅欄と同じ部品の欄（1つ）。次の欄（＋ 出発駅を追加）が増えるだけで、別のパネル・入力欄は作らない
  await expect(page.locator('[data-meeting-extra]')).toHaveCount(1);
  expect(await stationInputs.count()).toBe(inputsBefore + 2);

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

test('集合駅モード: 追加した出発駅も出発駅欄と同じ緑の欄で、入れるたびに次の欄が隣（右）に出る', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await page.getByRole('button', { name: '集合駅を探す' }).click();

  const extras = page.locator('[data-meeting-extra]');
  const add = page.locator('[data-meeting-add]');
  await expect(extras).toHaveCount(0);
  await expect(add).toHaveCount(1);

  const addOne = async (name: string) => {
    await page.getByPlaceholder('出発駅を追加').fill(name);
    await page.locator(`[data-station-option="${name}"]`).first().click();
  };
  // 1つ入れると、次の欄は隣（右）に出る（出発駅を2つ入れたら、3つ目の欄は右）
  await addOne('東京');
  await expect(extras).toHaveCount(1);
  const pos1 = await page.evaluate(() => {
    const e = document.querySelector('[data-meeting-extra]')!.getBoundingClientRect();
    const a = document.querySelector('[data-meeting-add]')!.getBoundingClientRect();
    return { extraTop: Math.round(e.top), addTop: Math.round(a.top), extraRight: e.right, addLeft: a.left };
  });
  expect(pos1.addTop).toBe(pos1.extraTop);
  expect(pos1.addLeft).toBeGreaterThanOrEqual(pos1.extraRight);
  await addOne('横浜');
  await addOne('渋谷');
  await expect(extras).toHaveCount(3);
  await expect(add).toHaveCount(1);
  // 行ごとの見出し・番号は立てない
  await expect(page.locator('[data-meeting-origin-rows] label')).toHaveCount(0);
  await expect(extras.nth(0).locator('input')).toHaveValue('東京');
  await expect(extras.nth(2).locator('input')).toHaveValue('渋谷');

  // 色は出発駅欄と同じ緑（追加の欄も、入力待ちの欄も）。点線にしない
  const colors = await page.evaluate(() => {
    const bg = (el: Element) => getComputedStyle(el).backgroundColor;
    const main = document.querySelector('input.station-input-filled') as HTMLInputElement; // 出発駅欄
    const extra = document.querySelector('[data-meeting-extra] input') as HTMLInputElement;
    const addInput = document.querySelector('[data-meeting-add] input') as HTMLInputElement;
    return { main: bg(main), extra: bg(extra), add: bg(addInput), addStyle: getComputedStyle(addInput).borderTopStyle };
  });
  expect(colors.extra).toBe(colors.main);
  expect(colors.add).toBe(colors.main);
  expect(colors.addStyle).toBe('solid');

  // 4人分の所要時間が候補に並び、集合駅を決めると4人それぞれのルートと使う路線が並ぶ
  await expect(page.locator('[data-meeting-results]')).toContainText('渋谷');
  await page.locator('[data-meeting-results]').getByRole('button').first().click();
  await expect(page.locator('[data-meeting-route]')).toHaveCount(4);

  // ×で欄が減る
  await extras.nth(0).locator('button').click();
  await expect(extras).toHaveCount(2);
  await expect(extras.nth(0).locator('input')).toHaveValue('横浜');
  expect(errors).toEqual([]);
});

for (const lang of ['ja', 'en', 'zh', 'ko'] as const) {
  for (const width of [1280, 360]) {
    test(`集合駅モード: 「＋ 出発駅を追加」の案内の文字が切れない（${lang}・${width}px）`, async ({ page }) => {
      // 広い画面は2列（欄の幅が狭い）、狭いスマホは1列。どちらでも案内の文字が収まる
      await page.setViewportSize({ width, height: 780 });
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
}

test('集合駅モード: 狭いスマホ（360px）では1列で幅いっぱいになり、はみ出さない', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/?mode=meeting&from=shinjuku&with=tokyo,yokohama,shibuya');
  await expect(page.locator('[data-meeting-add]')).toBeVisible();
  const boxes = await page.evaluate(() => {
    const row = document.querySelector('[data-meeting-origin-rows]')!.getBoundingClientRect();
    const fields = [...document.querySelectorAll('[data-meeting-extra], [data-meeting-add]')].map(e => e.getBoundingClientRect());
    return { rowLeft: row.left, rowRight: row.right, rights: fields.map(f => f.right), lefts: fields.map(f => f.left), widths: fields.map(f => Math.round(f.width)) };
  });
  for (const r of boxes.rights) expect(r).toBeLessThanOrEqual(boxes.rowRight + 1);
  for (const l of boxes.lefts) expect(l).toBeGreaterThanOrEqual(boxes.rowLeft - 1);
  // 狭いときは1列（どの欄も行の幅いっぱい）
  for (const w of boxes.widths) expect(w).toBeGreaterThanOrEqual(Math.round(boxes.rowRight - boxes.rowLeft) - 2);
});
