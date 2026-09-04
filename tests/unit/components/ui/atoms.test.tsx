/**
 * 操作部品（アトム）の規格テスト。
 *
 * 「同じパネルに並ぶのに高さが違う」「チップだけ角丸が大きい」といった
 * ズレを繰り返していたので、寸法が1つの規格から来ていることを固定する。
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../../../../src/components/ui/atoms/Button';
import Chip from '../../../../src/components/ui/atoms/Chip';
import TextField from '../../../../src/components/ui/atoms/TextField';
import { CONTROL_SIZE, CONTROL_BORDER_WIDTH } from '../../../../src/components/ui/atoms/controlSize';
import { FS, TARGET } from '../../../../src/constants/ui';

vi.mock('../../../../src/contexts/ThemeContext', () => ({
  getThemeColors: () => ({
    surface: '#f5f5f5', surfaceElevated: '#fff', border: '#ddd',
    text: '#333', textSecondary: '#666', onPrimary: '#ffffff',
  }),
}));

const px = (v: string) => parseFloat(v);

describe('CONTROL_SIZE（操作部品の寸法規格）', () => {
  it('sm は WCAG 2.2 AA の下限、md は Apple HIG の推奨値', () => {
    expect(CONTROL_SIZE.sm.minHeight).toBe(TARGET.min);
    expect(CONTROL_SIZE.md.minHeight).toBe(TARGET.touch);
  });

  it('md のほうが大きい', () => {
    expect(CONTROL_SIZE.md.minHeight).toBeGreaterThan(CONTROL_SIZE.sm.minHeight);
    expect(px(CONTROL_SIZE.md.fontSize)).toBeGreaterThan(px(CONTROL_SIZE.sm.fontSize));
  });

  it('段階は2つだけ（増やすと「どれを使うか」が決まらなくなる）', () => {
    expect(Object.keys(CONTROL_SIZE).sort()).toEqual(['md', 'sm']);
  });
});

describe('アトムの寸法が規格と一致する', () => {
  const styleOf = (el: Element) => (el as HTMLElement).style;

  it.each(['sm', 'md'] as const)('Button(%s)', (size) => {
    const { container } = render(<Button theme="light" size={size}>押す</Button>);
    const s = styleOf(container.querySelector('button')!);
    expect(s.minHeight).toBe(`${CONTROL_SIZE[size].minHeight}px`);
    expect(s.fontSize).toBe(CONTROL_SIZE[size].fontSize);
    expect(s.borderRadius).toBe(CONTROL_SIZE[size].radius);
  });

  it.each(['sm', 'md'] as const)('Chip(%s)', (size) => {
    const { container } = render(
      <Chip color="#9ACD32" label="山手線" selected={false} theme="light" size={size} onClick={() => {}} />,
    );
    const s = styleOf(container.querySelector('button')!);
    expect(s.minHeight).toBe(`${CONTROL_SIZE[size].minHeight}px`);
    expect(s.fontSize).toBe(CONTROL_SIZE[size].fontSize);
    expect(s.borderRadius).toBe(CONTROL_SIZE[size].radius);
  });

  it('同じ段階なら Button と Chip の高さ・角丸・枠線が一致する', () => {
    // 同じパネルに並ぶので、ここがずれると「揃っていない」に直結する
    const btn = render(<Button theme="light" size="md">押す</Button>);
    const chip = render(
      <Chip color="#9ACD32" label="山手線" selected={false} theme="light" size="md" onClick={() => {}} />,
    );
    const b = styleOf(btn.container.querySelector('button')!);
    const c = styleOf(chip.container.querySelector('button')!);
    expect(c.minHeight).toBe(b.minHeight);
    expect(c.borderRadius).toBe(b.borderRadius);
    expect(c.borderTopWidth).toBe(b.borderTopWidth);
    expect(c.fontSize).toBe(b.fontSize);
  });

  it('入力欄の高さは規格どおりだが、文字だけは16pxを下回らない', () => {
    // iOS Safari は16px未満の入力欄でページを自動拡大するため
    const { container } = render(<TextField theme="light" size="md" />);
    const s = styleOf(container.querySelector('input')!);
    expect(s.minHeight).toBe(`${CONTROL_SIZE.md.minHeight}px`);
    expect(s.fontSize).toBe(FS.input);
    expect(px(s.fontSize)).toBeGreaterThanOrEqual(16);
  });
});

describe('状態が変わっても外形が変わらない', () => {
  it('Chip は選択・非選択で枠線の太さと文字の太さが同じ', () => {
    const off = render(
      <Chip color="#9ACD32" label="山手線" selected={false} theme="light" onClick={() => {}} />,
    ).container.querySelector('button')! as HTMLElement;
    const on = render(
      <Chip color="#9ACD32" label="山手線" selected theme="light" onClick={() => {}} />,
    ).container.querySelector('button')! as HTMLElement;

    expect(on.style.borderTopWidth).toBe(`${CONTROL_BORDER_WIDTH}px`);
    expect(on.style.borderTopWidth).toBe(off.style.borderTopWidth);
    expect(on.style.fontWeight).toBe(off.style.fontWeight);
    expect(on.style.minHeight).toBe(off.style.minHeight);
    // 選択は塗りで示す
    expect(on.style.backgroundColor).not.toBe(off.style.backgroundColor);
  });

  it('Button のトグルも押した状態で外形が変わらない', () => {
    const off = render(
      <Button theme="light" variant="primary" pressed={false}>所要時間</Button>,
    ).container.querySelector('button')! as HTMLElement;
    const on = render(
      <Button theme="light" variant="primary" pressed>所要時間</Button>,
    ).container.querySelector('button')! as HTMLElement;

    expect(on.style.borderTopWidth).toBe(off.style.borderTopWidth);
    expect(on.style.minHeight).toBe(off.style.minHeight);
    expect(on.style.backgroundColor).not.toBe(off.style.backgroundColor);
  });
});
