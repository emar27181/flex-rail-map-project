/**
 * 排他選択のボタン列（モレキュール）。
 *
 * 「並順: あいうえお／色／登録順／近い順」「ボード／一覧」のように、
 * 同じ作りの選択列が別々の場所で毎回手書きされていた。
 * 選択の表し方（枠線の色と塗り）も書くたびに違っていたため1箇所にまとめる。
 *
 * アトム（Button）を並べただけの部品なのでモレキュール。
 *
 * `variant="slide"` は、2択を1本の枠の中に収め、選択位置を背景の
 * スライドで示す形。「出発/到着」のようにボタン2個分の隙間・二重の
 * 枠線を持たせる必要が無い場合に使う（`buttons`より横幅を取らない）。
 * 実体は`ui/atoms/SlideSegmentedControl`に置き、ここは委譲するだけ
 * （生のbutton要素はアトム側でしか書けない規約のため）。既定は
 * 従来どおり`buttons`のままなので、他の呼び出し箇所の見た目は変わらない。
 */
import React from 'react';
import Button from '../atoms/Button';
import type { ButtonSize } from '../atoms/Button';
import SlideSegmentedControl from '../atoms/SlideSegmentedControl';
import { L } from '../../legend/legendStyles';

export interface SegmentedOption<T extends string> {
  value: T;
  /** 通常は文字列。色スウォッチ付きなど装飾が要る場合だけ ReactNode を渡す */
  label: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  theme: 'light' | 'dark';
  size?: ButtonSize;
  /** 各項目を等幅に広げる（`variant="buttons"`のときのみ有効） */
  stretch?: boolean;
  /** 読み上げ用の名前 */
  ariaLabel?: string;
  /**
   * 見た目の種類。
   * - buttons（既定）: ボタンを個別に並べる。項目数が多い一覧の並び替えなど向け
   * - slide: 1本の枠の中で選択位置をスライドで示す。2択をコンパクトに置きたい場合向け
   */
  variant?: 'buttons' | 'slide';
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  theme,
  size = 'sm',
  stretch = false,
  ariaLabel,
  variant = 'buttons',
}: SegmentedControlProps<T>) {
  if (variant === 'slide') {
    return (
      <SlideSegmentedControl
        options={options}
        value={value}
        onChange={onChange}
        theme={theme}
        size={size}
        ariaLabel={ariaLabel}
      />
    );
  }

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
