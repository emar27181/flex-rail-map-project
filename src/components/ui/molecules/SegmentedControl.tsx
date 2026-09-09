/**
 * 排他選択のボタン列（モレキュール）。
 *
 * 「並順: あいうえお／色／登録順／近い順」「ボード／一覧」のように、
 * 同じ作りの選択列が別々の場所で毎回手書きされていた。
 * 選択の表し方（枠線の色と塗り）も書くたびに違っていたため1箇所にまとめる。
 *
 * アトム（Button）を並べただけの部品なのでモレキュール。
 */
import React from 'react';
import Button from '../atoms/Button';
import type { ButtonSize } from '../atoms/Button';
import { L } from '../../legend/legendStyles';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  theme: 'light' | 'dark';
  size?: ButtonSize;
  /** 各項目を等幅に広げる */
  stretch?: boolean;
  /** 読み上げ用の名前 */
  ariaLabel?: string;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  theme,
  size = 'sm',
  stretch = false,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} style={{ display: 'flex', gap: L.sp.xs }}>
      {options.map(opt => (
        <Button
          key={opt.value}
          theme={theme}
          size={size}
          variant="primary"
          // 選ばれていない項目は塗らない。枠線の太さは変えないので外形は動かない
          pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          styleOverride={stretch ? { flex: 1 } : undefined}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

export default SegmentedControl;
