import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleField, { ROLE_FIELD_COLOR, ROLE_FIELD_CLASS } from '../../../../src/components/ui/molecules/RoleField';
import { SEMANTIC } from '../../../../src/constants/ui';
import { ROLE_FIELD_MIN_WIDTH_EM } from '../../../../src/components/ui/atoms/controlSize';

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

describe('RoleField（役割の色で塗った入力欄）', () => {
  it('出発は緑・到着は赤で塗る（色は SEMANTIC から）', () => {
    expect(ROLE_FIELD_COLOR.departure).toBe(SEMANTIC.departure);
    expect(ROLE_FIELD_COLOR.arrival).toBe(SEMANTIC.arrival);
    const { rerender } = render(<RoleField theme="dark" role="departure" placeholder="出発" />);
    const dep = screen.getByPlaceholderText('出発') as HTMLInputElement;
    expect(dep.style.backgroundColor).toBe(hexToRgb(SEMANTIC.departure));
    expect(dep.className).toContain(ROLE_FIELD_CLASS);
    rerender(<RoleField theme="dark" role="arrival" placeholder="出発" />);
    expect((screen.getByPlaceholderText('出発') as HTMLInputElement).style.backgroundColor).toBe(hexToRgb(SEMANTIC.arrival));
  });

  it('枠も同じ色の実線。状態で太さを変えない（点線にしない）', () => {
    render(<RoleField theme="light" role="departure" placeholder="x" />);
    const input = screen.getByPlaceholderText('x') as HTMLInputElement;
    expect(input.style.border).toContain('2px solid');
    expect(input.style.border).not.toContain('dashed');
  });

  it('クリアのボタンは onClear を渡したときだけ出て、押すと呼ばれる', () => {
    const onClear = vi.fn();
    const { rerender } = render(<RoleField theme="dark" role="departure" placeholder="x" />);
    expect(screen.queryByLabelText('消す')).toBeNull();
    rerender(<RoleField theme="dark" role="departure" placeholder="x" onClear={onClear} clearLabel="消す" />);
    fireEvent.click(screen.getByLabelText('消す'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('先頭のアイコン（＋など）を置ける。文字と重ならないよう左の余白を取る', () => {
    render(<RoleField theme="dark" role="departure" placeholder="x" adornment={<svg data-testid="plus" />} />);
    expect(screen.getByTestId('plus')).toBeTruthy();
    expect((screen.getByPlaceholderText('x') as HTMLInputElement).style.paddingLeft).toContain('calc(');
  });

  it('入力欄の props（value・onChange など）をそのまま渡せ、data 属性を囲みに付けられる', () => {
    const onChange = vi.fn();
    const { container } = render(<RoleField theme="dark" role="departure" value="新宿" onChange={onChange} wrapperAttr={{ 'data-x': true }} />);
    fireEvent.change(screen.getByDisplayValue('新宿'), { target: { value: '東京' } });
    expect(onChange).toHaveBeenCalled();
    expect(container.querySelector('[data-x]')).toBeTruthy();
  });
});

describe('出発・到着・追加の出発駅は同じ部品（再発防止）', () => {
  const selector = readFileSync('src/components/StationSelector.tsx', 'utf8');
  const field = readFileSync('src/components/ui/molecules/RoleField.tsx', 'utf8');

  it('StationSelector は役割の色を直書きせず、RoleField で出発・到着・追加の出発駅を出す', () => {
    const code = selector.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toMatch(/backgroundColor:\s*SEMANTIC\.(departure|arrival)/);
    expect(code.match(/role="departure"/g)?.length).toBe(3); // 出発駅欄・追加した出発駅・追加の入力欄
    expect(code.match(/role="arrival"/g)?.length).toBe(1);
  });

  it('追加の出発駅の並びは最小の幅の定義元（em）から。px を直書きしない', () => {
    expect(selector).toContain('ROLE_FIELD_MIN_WIDTH_EM');
    expect(ROLE_FIELD_MIN_WIDTH_EM).toBeGreaterThan(0);
    expect(selector).not.toContain('MEETING_ADD_MIN_WIDTH_PX');
  });

  it('RoleField は色・生の入力欄・ボタンを直書きしない（アトムとトークンだけ。駅の知識も持たない）', () => {
    const code = field.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(code).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(code).not.toMatch(/rgba?\(/);
    expect(code).not.toContain('dashed');
    expect(code).not.toMatch(/<input\b/);
    expect(code).not.toMatch(/<button\b/);
    expect(code).not.toMatch(/駅|路線|Station|Route/);
  });
});
