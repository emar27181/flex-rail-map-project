/**
 * 集合駅を探すモード: 既存の駅選択パネルの中だけで完結する（別パネル・別の入力欄を増やさない）。
 * 出発駅 + 常に出ている出発駅の入力欄（出発駅欄と同じ緑・同じ幅・同じ文言）で2駅以上そろうと候補が出て、選ぶと既存の到着駅に入る。
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

  // 出発駅の入力欄は、ボタンを押さなくても最初から出ている（出発駅欄と同じ文言「駅名入力」）
  await expect(page.getByRole('button', { name: '出発駅を追加' })).toHaveCount(0);
  await expect(page.locator('[data-meeting-add]')).toHaveCount(1);
  const add = page.locator('[data-meeting-add] input');
  await expect(add).toBeVisible();
  await expect(add).toHaveAttribute('placeholder', '駅名入力');
  await expect(add).toHaveAccessibleName('出発駅を追加');
  await add.fill('東京');
  await page.locator('[data-station-option="東京"]').first().click();

  const results = page.locator('[data-meeting-results]');
  await expect(results.getByRole('button')).toHaveCount(5);
  await expect(results).toContainText('最大');
  await expect(results).toContainText('新宿');
  await expect(results).toContainText('東京');
  // 追加した出発駅は出発駅欄と同じ部品の欄（1つ）。次の欄が増えるだけで、別のパネル・入力欄は作らない
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
    await page.locator('[data-meeting-add] input').fill(name);
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

for (const width of [1280, 390, 360]) {
  test(`集合駅モード: 追加の出発駅は出発駅欄と同じ幅・同じ位置にそろう（${width}px）`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/?mode=meeting&from=shinjuku&with=tokyo,yokohama');
    await expect(page.locator('[data-meeting-add]')).toBeVisible();
    const m = await page.evaluate(() => {
      const box = (el: Element) => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, width: r.width, top: r.top }; };
      const inputs = [...document.querySelectorAll('input.station-input-filled')];
      const departure = box(inputs[0]);          // 出発駅欄
      const arrival = box(inputs[1]);            // 到着駅欄
      const extras = [...document.querySelectorAll('[data-meeting-extra] input')].map(box);
      const add = box(document.querySelector('[data-meeting-add] input')!);
      return { departure, arrival, extras, add };
    });
    // 左の欄: 出発駅欄と同じ左端・同じ幅。右の欄: 到着駅欄と同じ左端・同じ幅（行をそろえる）
    expect(Math.abs(m.extras[0].left - m.departure.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(m.extras[0].width - m.departure.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(m.extras[1].left - m.arrival.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(m.extras[1].width - m.arrival.width)).toBeLessThanOrEqual(1);
    // 3つ目の欄（追加の入力欄）は次の行の左（出発駅欄の真下）
    expect(Math.abs(m.add.left - m.departure.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(m.add.width - m.departure.width)).toBeLessThanOrEqual(1);
    expect(m.add.top).toBeGreaterThan(m.extras[0].top);
  });
}

test('集合駅モード: 出発駅（欄）を入れると次の欄が右隣に出る（出発駅欄と追加1つの次は右）', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/?mode=meeting&from=shinjuku&with=tokyo');
  await expect(page.locator('[data-meeting-add]')).toBeVisible();
  const pos = await page.evaluate(() => {
    const e = document.querySelector('[data-meeting-extra] input')!.getBoundingClientRect();
    const a = document.querySelector('[data-meeting-add] input')!.getBoundingClientRect();
    return { extraTop: Math.round(e.top), addTop: Math.round(a.top), extraRight: e.right, addLeft: a.left };
  });
  // 追加した1つ目の右隣に、次の欄が出る（同じ行）
  expect(pos.addTop).toBe(pos.extraTop);
  expect(pos.addLeft).toBeGreaterThanOrEqual(pos.extraRight);
});

for (const lang of ['ja', 'en', 'zh', 'ko'] as const) {
  test(`集合駅モード: 追加の出発駅の欄の案内は、出発駅欄（未入力）と同じ文言（${lang}）`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`/?mode=meeting&from=shinjuku&lang=${lang}`);
    const add = page.locator('[data-meeting-add] input');
    await expect(add).toBeVisible();
    // 到着駅欄（未入力）の案内と同じ文言
    const arrivalPlaceholder = await page.locator('input.station-input-filled').nth(1).getAttribute('placeholder');
    await expect(add).toHaveAttribute('placeholder', arrivalPlaceholder!);
    // 文字が欄の幅に収まる（出発駅欄と同じ幅なので、出発駅欄が収まっていれば収まる）
    const fit = await add.evaluate((el: HTMLInputElement) => {
      const cs = getComputedStyle(el);
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const text = ctx.measureText(el.placeholder).width;
      const inner = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return { text: Math.round(text), inner: Math.round(inner), placeholder: el.placeholder };
    });
    expect(fit.text, JSON.stringify(fit)).toBeLessThanOrEqual(fit.inner);
  });
}
