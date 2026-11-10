/**
 * 折り返して並ぶ部品（チップなど）を、決まった行数までに収め、「さらに表示」で少しずつ広げる箱（モレキュール）。
 *
 * 表示路線の切替の「表示中」「非表示」は数百路線あり、全部並べると縦に長くなりすぎる。
 * - 以前は「さらに48件」のように件数で区切っていたため、画面の幅によって行数がばらばらだった → 行数で切る
 * - 2026-11 まで「他 479 路線を表示」を押すと全部が一度に出て、スクロールがとても長くなった
 *   → 最初は5行、「さらに表示」1回で10行ずつ広げる（「もっと見る」方式。無限スクロールにはしない）
 *
 * 1回で広げる量（10行）の理由: スマホの幅ではチップが1行に3つほどなので、1回で25〜30件ほど増える
 * （一覧の「もっと見る」1回分としてよく使われる量）。高さは約300px（画面の約3分の1）で、増えた分と
 * 次の「さらに表示」が同じ画面に収まり、押す場所を探してスクロールしなくてよい。
 * 数百件から探すときは、上の検索欄で絞り込むのが早い。
 *
 * 何が並ぶか（路線など）は知らない。中身は children で受け取る。
 */
import React, { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Button from '../atoms/Button';
import DisclosureIndicator from '../atoms/DisclosureIndicator';
import { CONTROL_SIZE, type ControlSize } from '../atoms/controlSize';
import { L } from '../../legend/legendStyles';

/** 最初に見せる行数の既定値 */
export const CLAMPED_WRAP_DEFAULT_ROWS = 5;

/** 「さらに表示」1回で広げる行数の既定値（理由は冒頭のコメント） */
export const CLAMPED_WRAP_STEP_ROWS = 10;

/**
 * 1行に並ぶ部品の数の上限の見込み。見せる行数 × これ だけ描き、行に収まらない分は描かない
 * （数百個の部品を毎回描かずに済む。どの幅でも1行にこれより多くは並ばない）
 */
export const CLAMPED_WRAP_RENDER_PER_ROW = 12;

/** 閉じているとき（最初の5行）に描く部品の上限 */
export const CLAMPED_WRAP_COLLAPSED_RENDER_LIMIT = CLAMPED_WRAP_DEFAULT_ROWS * CLAMPED_WRAP_RENDER_PER_ROW;

export interface ClampedWrapProps {
  theme: 'light' | 'dark';
  /** 「さらに表示」を押した回数（0 = 最初の行数だけ） */
  steps: number;
  onStepsChange: (steps: number) => void;
  /** 並べる部品。見せる行数に収まる見込みの数まで描く */
  children: ReactNode[];
  /** 部品の高さの段階（行の高さ＝この段階の高さ）。ボタンも同じ段階 */
  size?: ControlSize;
  /** 最初に見せる行数 */
  maxRows?: number;
  /** 「さらに表示」1回で広げる行数 */
  stepRows?: number;
  /** 「さらに表示」の文言（まだ隠れている数を受け取る） */
  moreLabel: (hiddenCount: number) => string;
  /** 「折りたたむ」の文言 */
  lessLabel: string;
}

const GAP = L.sp.sm;

const ClampedWrap: React.FC<ClampedWrapProps> = ({
  theme, steps, onStepsChange, children, size = 'sm',
  maxRows = CLAMPED_WRAP_DEFAULT_ROWS, stepRows = CLAMPED_WRAP_STEP_ROWS, moreLabel, lessLabel,
}) => {
  const rowHeight = CONTROL_SIZE[size].minHeight;
  const gapPx = parseFloat(GAP);
  const rows = maxRows + steps * stepRows;
  const maxHeight = rows * rowHeight + (rows - 1) * gapPx;
  const total = children.length;
  const rendered = children.slice(0, rows * CLAMPED_WRAP_RENDER_PER_ROW);

  const boxRef = useRef<HTMLDivElement>(null);
  /** 見せる行数の中に入っている部品の数 */
  const [visibleCount, setVisibleCount] = useState(rendered.length);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const items = Array.from(box.children) as HTMLElement[];
      // 箱は position: relative なので、中の部品の offsetTop は箱の上端からの距離
      setVisibleCount(items.filter(el => el.offsetTop < maxHeight).length);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [maxHeight, rendered.length]);

  const hidden = Math.max(0, total - visibleCount);

  const collapse = () => {
    onStepsChange(0);
    // 下の方まで広げてから折りたたむと、一覧が画面の上に消えて今どこにいるか分からなくなる。箱の先頭を画面に戻す
    requestAnimationFrame(() => boxRef.current?.scrollIntoView?.({ block: 'nearest' }));
  };

  return (
    <div>
      <div
        ref={boxRef}
        data-clamped={hidden > 0 ? 'true' : 'false'}
        data-rows={rows}
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          gap: GAP,
          maxHeight,
          overflow: 'hidden',
        }}
      >
        {rendered}
      </div>
      {(hidden > 0 || steps > 0) && (
        <div style={{ display: 'flex', gap: GAP, marginTop: GAP }}>
          {hidden > 0 && (
            <Button
              theme={theme}
              variant="outline"
              size={size}
              aria-expanded={false}
              onClick={() => onStepsChange(steps + 1)}
              styleOverride={{ flex: 1 }}
            >
              {moreLabel(hidden)}
              <DisclosureIndicator expanded={false} theme={theme} tone="inherit" />
            </Button>
          )}
          {steps > 0 && (
            <Button
              theme={theme}
              variant="outline"
              size={size}
              aria-expanded
              onClick={collapse}
              styleOverride={hidden > 0 ? undefined : { flex: 1 }}
            >
              {lessLabel}
              <DisclosureIndicator expanded theme={theme} tone="inherit" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClampedWrap;
