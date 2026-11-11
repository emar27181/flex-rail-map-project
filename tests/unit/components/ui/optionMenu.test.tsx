/**
 * 選択肢の一覧を開いて選ぶ部品（ui/molecules/OptionMenu）のテスト。
 */
// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import OptionMenu from '../../../../src/components/ui/molecules/OptionMenu';

const options = [
  { value: 'a', label: 'エー', lang: 'ja' },
  { value: 'b', label: 'Bee', lang: 'en' },
  { value: 'c', label: 'シー' },
];

const setup = (props: Partial<React.ComponentProps<typeof OptionMenu>> = {}) => {
  const onSelect = vi.fn();
  const r = render(
    <OptionMenu
      theme="light"
      triggerLabel="言語: エー"
      menuLabel="言語"
      triggerIcon={<svg />}
      options={options}
      value="a"
      onSelect={onSelect}
      {...props}
    />,
  );
  const trigger = () => r.getByRole('button', { name: '言語: エー' });
  return { ...r, onSelect, trigger };
};

describe('OptionMenu', () => {
  it('閉じているときはアイコンだけのボタン（文字を添えない）で、一覧は出さない', () => {
    const { trigger, queryByRole } = setup();
    expect(trigger().textContent).toBe('');
    expect(trigger().querySelector('svg')).not.toBeNull();
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(queryByRole('menu')).toBeNull();
  });

  it('押すとすべての選択肢を並べ、今の選択に印（aria-checked と ✓）を付ける', () => {
    const { trigger, getByRole, getAllByRole } = setup();
    fireEvent.click(trigger());
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(getByRole('menu', { name: '言語' })).toBeTruthy();
    // ボタンと一覧が aria-controls でつながる
    expect(trigger().getAttribute('aria-controls')).toBe(getByRole('menu').id);
    const items = getAllByRole('menuitemradio');
    expect(items.map(i => i.textContent)).toEqual(['エー', 'Bee', 'シー']);
    expect(items.map(i => i.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false']);
    expect(items[0].querySelector('svg')).not.toBeNull();
    expect(items[1].querySelector('svg')).toBeNull();
    // 各選択肢にその言語の lang
    expect(items[1].getAttribute('lang')).toBe('en');
  });

  it('選択肢を押すと、押したものへ直接切り替え、閉じてボタンへ焦点を戻す', () => {
    const { trigger, getAllByRole, queryByRole, onSelect } = setup();
    fireEvent.click(trigger());
    fireEvent.click(getAllByRole('menuitemradio')[2]);
    expect(onSelect).toHaveBeenCalledWith('c');
    expect(queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('開いたら今の選択に焦点が移り、↑↓ で動き、端で折り返す', () => {
    const { trigger, getAllByRole, getByRole } = setup({ value: 'b' });
    fireEvent.click(trigger());
    const items = getAllByRole('menuitemradio');
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(getByRole('menu'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[2]);
    fireEvent.keyDown(getByRole('menu'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[0]);
    fireEvent.keyDown(getByRole('menu'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(items[2]);
    fireEvent.keyDown(getByRole('menu'), { key: 'Home' });
    expect(document.activeElement).toBe(items[0]);
    fireEvent.keyDown(getByRole('menu'), { key: 'End' });
    expect(document.activeElement).toBe(items[2]);
  });

  it('Escape で閉じてボタンへ焦点を戻し、何も選ばない', () => {
    const { trigger, getByRole, queryByRole, onSelect } = setup();
    fireEvent.click(trigger());
    fireEvent.keyDown(getByRole('menu'), { key: 'Escape' });
    expect(queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger());
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('一覧の外を押すと閉じる（一覧の中を押しても閉じない）', () => {
    const { trigger, getByRole, queryByRole } = setup();
    fireEvent.click(trigger());
    fireEvent.pointerDown(getByRole('menu'));
    expect(queryByRole('menu')).not.toBeNull();
    fireEvent.pointerDown(document.body);
    expect(queryByRole('menu')).toBeNull();
  });

  it('ボタンで ↓ を押しても開く（キーボードだけで使える）', () => {
    const { trigger, queryByRole } = setup();
    fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
    expect(queryByRole('menu')).not.toBeNull();
  });

  it('選択肢の行は指で押せる 44px の段階（md）', () => {
    const { trigger, getAllByRole } = setup();
    fireEvent.click(trigger());
    for (const item of getAllByRole('menuitemradio')) {
      expect((item as HTMLElement).style.minHeight).toBe('44px');
    }
  });

  it('placement と align で、ボタンのどちら側・どちらの端に出すかを選べる', () => {
    const { trigger, getByRole } = setup({ placement: 'above', align: 'start' });
    fireEvent.click(trigger());
    const style = (getByRole('menu') as HTMLElement).style;
    expect(style.bottom).toContain('100%');
    expect(style.left).toBe('0px');
    expect(style.top).toBe('');
  });
});

describe('OptionMenu（地図の上に浮かぶ見た目）', () => {
  it('floating でも同じ属性・動きで、アイコンだけの丸いボタンになる', () => {
    const { getByRole, queryByRole } = render(
      <OptionMenu theme="dark" appearance="floating" triggerLabel="言語: エー" menuLabel="言語" triggerIcon={<svg />}
        options={options} value="a" onSelect={() => {}} />,
    );
    const trigger = getByRole('button', { name: '言語: エー' });
    expect(trigger.textContent).toBe('');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(getByRole('menu').id);
    fireEvent.keyDown(getByRole('menu'), { key: 'Escape' });
    expect(queryByRole('menu')).toBeNull();
  });
});
