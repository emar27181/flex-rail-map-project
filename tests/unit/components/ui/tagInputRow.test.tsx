import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { render, screen, fireEvent } from '@testing-library/react';
import TagInputRow from '../../../../src/components/ui/molecules/TagInputRow';
import { TAG_INPUT_MIN_WIDTH_EM } from '../../../../src/components/ui/atoms/controlSize';

const base = {
  theme: 'light' as const,
  removeLabel: '削除',
  inputValue: '',
  onInputChange: () => {},
  placeholder: '出発駅を追加',
};

describe('TagInputRow（タグを横に並べ、末尾に追加の入力欄）', () => {
  it('タグと入力欄が同じ1行に並び、入力欄はいつでも出ている', () => {
    const { container } = render(<TagInputRow {...base} tags={[{ id: 'a', label: '2. 東京' }, { id: 'b', label: '3. 横浜' }]} onRemove={() => {}} />);
    expect(container.querySelectorAll('[data-tag-item]').length).toBe(2);
    expect(screen.getByPlaceholderText('出発駅を追加')).toBeTruthy();
    const row = container.firstElementChild as HTMLElement;
    expect(row.style.flexDirection).toBe('row');
    expect(row.style.flexWrap).toBe('wrap');
  });

  it('タグが無くても入力欄は出る', () => {
    const { container } = render(<TagInputRow {...base} tags={[]} onRemove={() => {}} />);
    expect(container.querySelectorAll('[data-tag-item]').length).toBe(0);
    expect(screen.getByPlaceholderText('出発駅を追加')).toBeTruthy();
  });

  it('タグの削除ボタンで、そのタグの id を返す', () => {
    const onRemove = vi.fn();
    render(<TagInputRow {...base} tags={[{ id: 'a', label: '2. 東京' }, { id: 'b', label: '3. 横浜' }]} onRemove={onRemove} />);
    fireEvent.click(screen.getAllByLabelText('削除')[1]);
    expect(onRemove).toHaveBeenCalledWith('b');
  });

  it('入力・フォーカス・フォーカス外れを呼び出し側へ返す', () => {
    const onInputChange = vi.fn();
    const onInputFocus = vi.fn();
    const onInputBlur = vi.fn();
    render(<TagInputRow {...base} tags={[]} onRemove={() => {}} onInputChange={onInputChange} onInputFocus={onInputFocus} onInputBlur={onInputBlur} />);
    const input = screen.getByPlaceholderText('出発駅を追加');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '東' } });
    fireEvent.blur(input);
    expect(onInputFocus).toHaveBeenCalled();
    expect(onInputChange.mock.calls[0][0]).toBe('東');
    expect(onInputBlur).toHaveBeenCalled();
  });

  it('入力欄の最小の幅は定義元の値（em）で決め、案内の文字を読み上げの名前にも使う', () => {
    const { container } = render(<TagInputRow {...base} tags={[]} onRemove={() => {}} rowAttr={{ 'data-row': true }} inputAttr={{ 'data-add': true }} />);
    const add = container.querySelector('[data-add]') as HTMLElement;
    expect(add.style.flex).toContain(`${TAG_INPUT_MIN_WIDTH_EM}em`);
    expect(container.querySelector('[data-row]')).toBeTruthy();
    expect(screen.getByLabelText('出発駅を追加')).toBeTruthy();
  });
});

describe('TagInputRow は見た目を直書きしない（再発防止）', () => {
  const src = readFileSync('src/components/ui/molecules/TagInputRow.tsx', 'utf8');
  it('色・点線・px・生の入力欄を書かない（アトムとトークンだけ）', () => {
    expect(src).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(src).not.toMatch(/rgba?\(/);
    expect(src).not.toContain('dashed');
    expect(src).not.toMatch(/border\s*:/);
    expect(src).not.toMatch(/\d+px/);
    expect(src).not.toMatch(/<input\b/);
    expect(src).not.toMatch(/<button\b/);
    // 駅・路線の知識を持たない（molecule の判定: 「駅」「路線」を消せる）
    expect(src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')).not.toMatch(/駅|路線|Station|Route/);
  });
});
