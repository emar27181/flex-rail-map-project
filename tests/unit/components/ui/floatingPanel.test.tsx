/**
 * 地図の上に浮かぶ開閉パネル（CollapsiblePanel）の規則。
 *
 * 立体表示の説明の箱だけ見出しが大きく（パネル用の FS.title）、隣の「表示切替」ボタンとそろっていなかった（2026-10-14）。
 * 原因は CollapsiblePanel が見出しの大きさを選べて、既定がパネル用だったこと。
 * また幅（168px / 360px）や高さの上限（min(60vh, 420px)）を各ファイルに直書きしていた。
 *
 * - 見出しは常に FLOATING_CONTROL（「表示切替」・隅の丸いボタンと同じ高さ・文字）
 * - 幅・高さの上限・地図の端との間は FLOATING_PANEL から取る。パネルを使うファイルに px / vh を書かない
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import CollapsiblePanel from '../../../../src/components/ui/molecules/CollapsiblePanel';
import { FLOATING_BUTTON_HEIGHT } from '../../../../src/components/ui/atoms/FloatingButton';
import {
  CONTROL_BORDER_WIDTH, FLOATING_CONTROL, FLOATING_PANEL, floatingPanelWidth, aboveFloatingButtons, FLOATING_ICON_BUTTON_SIZE,
} from '../../../../src/components/ui/atoms/controlSize';

describe('浮かぶ開閉パネルの見出し', () => {
  it('見出しの高さ・文字は「表示切替」ボタンと同じ（枠線を含めた箱全体の高さがそろう）', () => {
    const { getByRole } = render(
      <CollapsiblePanel theme="dark" title="3 / 3 路線" expanded={false} onToggle={() => {}} width="wide">
        <div />
      </CollapsiblePanel>,
    );
    const header = getByRole('button');
    expect(parseFloat(header.style.height) + CONTROL_BORDER_WIDTH * 2).toBe(FLOATING_BUTTON_HEIGHT);
    expect((header.firstElementChild as HTMLElement).style.fontSize).toBe(FLOATING_CONTROL.fontSize);
  });

  it('幅は FLOATING_PANEL の段階で決まり、狭い画面では地図の端との間を残して縮む', () => {
    // jsdom は min() を style に入れられないので、値と使われ方を見る
    expect(floatingPanelWidth('narrow')).toBe(`min(${FLOATING_PANEL.width.narrow}px, calc(100% - 2 * ${FLOATING_PANEL.inset}))`);
    expect(floatingPanelWidth('wide')).toContain(`${FLOATING_PANEL.width.wide}px`);
    const src = readFileSync(join(__dirname, '../../../../src/components/ui/molecules/CollapsiblePanel.tsx'), 'utf8');
    expect(src).toContain('width: floatingPanelWidth(width)');
  });

  it('開いた中身の高さは既定で上限つき（中でスクロール）', () => {
    const { container } = render(
      <CollapsiblePanel theme="light" title="t" expanded onToggle={() => {}} width="wide"><p>x</p></CollapsiblePanel>,
    );
    const body = container.querySelector('p')!.parentElement as HTMLElement;
    expect(body.style.maxHeight).toBe(FLOATING_PANEL.maxHeight);
    expect(body.style.overflowY).toBe('auto');
  });

  it('隅の丸いボタンの上に置く位置は、ボタンの大きさと間から計算する', () => {
    expect(aboveFloatingButtons(1)).toContain(`${FLOATING_ICON_BUTTON_SIZE.md}px`);
    expect(aboveFloatingButtons(2)).toContain('2 *');
  });
});

const SRC = join(__dirname, '../../../../src');
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (name !== 'v2' && name !== 'design') walk(p, out); }
    else if (/\.tsx$/.test(name)) out.push(p);
  }
  return out;
}
/** CollapsiblePanel を使うファイル（地図の上に浮かぶパネルを持つ organism） */
const users = walk(join(SRC, 'components'))
  .filter(f => !f.endsWith(join('molecules', 'CollapsiblePanel.tsx')))
  .map(f => ({ rel: relative(SRC, f).split('\\').join('/'), text: readFileSync(f, 'utf8') }))
  .filter(f => f.text.includes('<CollapsiblePanel'));

/** 幅・高さを px / vh / vw の数値で書いている所 */
const RAW_DIMENSION = /(?:min|max)?(?:[Ww]idth|[Hh]eight)\s*:\s*['`][^'`\n]*\d(?:px|vh|vw)/;
/** 幅・高さの定数を数値で定義している所（例: const LEGEND_WIDTH = '168px'） */
const RAW_DIMENSION_CONST = /const [A-Z0-9_]*(?:WIDTH|HEIGHT)[A-Z0-9_]* = ['`]?\d/;

describe('浮かぶ開閉パネルを使うファイルの直書き', () => {
  it('CollapsiblePanel を使うファイルがある（検査が空振りしていない）', () => {
    expect(users.map(u => u.rel)).toEqual(expect.arrayContaining([
      'components/Terrain3DView.tsx', 'components/legend/VisibleRoutesLegend.tsx',
    ]));
  });

  it('見出しの大きさを渡さない・幅は width で段階を選ぶ（style に width を書かない）', () => {
    const offenders: string[] = [];
    for (const u of users) {
      for (const m of u.text.matchAll(/<CollapsiblePanel\b([\s\S]*?)\n\s*>/g)) {
        if (/\bsize=/.test(m[1])) offenders.push(`${u.rel}: size を渡している`);
        if (/style=\{\{[^}]*\bwidth\s*:/.test(m[1])) offenders.push(`${u.rel}: style に width`);
        if (!/\bwidth="(narrow|wide)"/.test(m[1])) offenders.push(`${u.rel}: width の段階が無い`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('幅・高さを px / vh で直書きしない（FLOATING_PANEL・CONTROL_SIZE から取る）', () => {
    const offenders = users.flatMap(u => [
      ...(RAW_DIMENSION.test(u.text) ? [`${u.rel}: ${u.text.match(RAW_DIMENSION)![0]}`] : []),
      ...(RAW_DIMENSION_CONST.test(u.text) ? [`${u.rel}: ${u.text.match(RAW_DIMENSION_CONST)![0]}`] : []),
    ]);
    expect(offenders).toEqual([]);
  });
});
