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
  // 追加した出発駅はタグ（1つ）。駅の入力欄（出発・到着）は増えない
  expect(await stationInputs.count()).toBe(inputsBefore);
  await expect(page.locator('[data-meeting-origin-rows] [data-tag-item]')).toHaveCount(1);

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

test('集合駅モード: 追加した出発駅は横一列のタグで増え、×で減らせる（番号と名前は1つにまとまる）', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/?from=shinjuku');
  await expect(page.locator('.leaflet-container').first()).toBeVisible();
  await page.getByRole('button', { name: '集合駅を探す' }).click();

  const tags = page.locator('[data-meeting-origin-rows] [data-tag-item]');
  await expect(tags).toHaveCount(0);
  for (const name of ['東京', '横浜', '渋谷']) {
    await page.getByPlaceholder('出発駅を追加').fill(name);
    await page.locator(`[data-station-option="${name}"]`).first().click();
  }
  // 入力欄は消えず、同じ行の末尾にいつでも出ている。行ごとの見出し（出発駅 2 …）は立てない
  await expect(page.locator('[data-meeting-add]')).toHaveCount(1);
  await expect(page.locator('[data-meeting-origin-rows] label')).toHaveCount(0);
  // 番号と名前が1つのタグにまとまる
  await expect(tags).toHaveCount(3);
  await expect(tags.nth(0)).toHaveText(/2\. 東京/);
  await expect(tags.nth(2)).toHaveText(/4\. 渋谷/);
  // 4人分の所要時間が候補に並ぶ
  await expect(page.locator('[data-meeting-results]')).toContainText('新宿');
  await expect(page.locator('[data-meeting-results]')).toContainText('渋谷');

  // 横一列: タグは同じ行に並ぶ（折り返す前）。入力欄も同じ行か、収まらなければ次の行で広がる
  const tops = await tags.evaluateAll(els => els.map(e => Math.round(e.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);

  // 点線や色付きの枠にしない（普通の入力欄と同じ枠）
  const border = await page.locator('[data-meeting-add] input').evaluate(el => {
    const cs = getComputedStyle(el);
    const normal = getComputedStyle(document.querySelector('input[type="time"], input.station-input-filled') ?? el);
    return { style: cs.borderTopStyle, color: cs.borderTopColor, normalColor: normal.borderTopColor };
  });
  expect(border.style).toBe('solid');

  // 集合駅を決めると、4人それぞれのルートと使う路線が並ぶ
  await page.locator('[data-meeting-results]').getByRole('button').first().click();
  await expect(page.locator('[data-meeting-route]')).toHaveCount(4);
  await expect(page.locator('[data-meeting-routes]')).toContainText('横浜');

  // ×でタグが減る（番号は詰め直される）
  await page.locator('[data-meeting-origin-rows] [data-tag-item] button').first().click();
  await expect(tags).toHaveCount(2);
  await expect(tags.nth(0)).toHaveText(/2\. 横浜/);
  expect(errors).toEqual([]);
});

for (const lang of ['ja', 'en', 'zh', 'ko'] as const) {
  test(`集合駅モード: 「＋ 出発駅を追加」の案内の文字が切れない（${lang}）`, async ({ page }) => {
    // タグが1つのとき、入力欄はタグの横に並ぶ（幅が足りなければ次の行へ回る）。狭いスマホで確かめる
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

test('集合駅モード: 狭いスマホ（360px）でタグが増えても、入力欄は行からはみ出さず残りの幅に収まる', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/?mode=meeting&from=shinjuku&with=tokyo,yokohama,shibuya');
  await expect(page.locator('[data-meeting-add]')).toBeVisible();
  const boxes = await page.evaluate(() => {
    const row = document.querySelector('[data-meeting-origin-rows]')!.getBoundingClientRect();
    const add = document.querySelector('[data-meeting-add]')!.getBoundingClientRect();
    const tags = [...document.querySelectorAll('[data-meeting-origin-rows] [data-tag-item]')].map(e => e.getBoundingClientRect());
    return { rowRight: row.right, addRight: add.right, addWidth: Math.round(add.width), tagRights: tags.map(t => t.right) };
  });
  expect(boxes.addRight).toBeLessThanOrEqual(boxes.rowRight + 1);
  for (const r of boxes.tagRights) expect(r).toBeLessThanOrEqual(boxes.rowRight + 1);
  expect(boxes.addWidth).toBeGreaterThanOrEqual(150);
});
