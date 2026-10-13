/**
 * 折り返して並ぶ部品（チップなど）を、閉じているときは決まった行数までに収め、
 * 開くと全部見せる箱（モレキュール）。
 *
 * 表示路線の切替の「表示中」「非表示」は数百路線あり、全部並べると縦に長くなりすぎる。
 * 以前は「さらに48件」のように件数で区切っていたため、画面の幅によって行数がばらばらだった。
 * ここでは行数（既定5行）で切り、下のボタンで全部・元の行数を切り替える。
 *
 * 何が並ぶか（路線など）は知らない。中身は children で受け取る。
 */
import React, { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Button from '../atoms/Button';
import DisclosureIndicator from '../atoms/DisclosureIndicator';
import { CONTROL_SIZE, type ControlSize } from '../atoms/controlSize';
import { L } from '../../legend/legendStyles';

/** 閉じているときに見せる行数の既定値 */
export const CLAMPED_WRAP_DEFAULT_ROWS = 5;

/**
 * 閉じているときに描く部品の上限。行に収まらない分は描かないことで、
 * 数百個の部品を毎回描かずに済む（5行に入るのはどの幅でもこれより少ない）
 */
export const CLAMPED_WRAP_COLLAPSED_RENDER_LIMIT = 60;

export interface ClampedWrapProps {
  theme: 'light' | 'dark';
  /** 開いているか（全部見せるか） */
  expanded: boolean;
  onToggle: () => void;
  /** 並べる部品。閉じているときは先頭の CLAMPED_WRAP_COLLAPSED_RENDER_LIMIT 個まで描く */
  children: ReactNode[];
  /** 部品の高さの段階（行の高さ＝この段階の高さ）。ボタンも同じ段階 */
  size?: ControlSize;
  /** 閉じているときの行数 */
  maxRows?: number;
  /** 「すべて表示」の文言（隠れている数を受け取る） */
  moreLabel: (hiddenCount: number) => string;
  /** 「折りたたむ」の文言 */
  lessLabel: string;
}

const GAP = L.sp.sm;

const ClampedWrap: React.FC<ClampedWrapProps> = ({
  theme, expanded, onToggle, children, size = 'sm', maxRows = CLAMPED_WRAP_DEFAULT_ROWS, moreLabel, lessLabel,
}) => {
  const rowHeight = CONTROL_SIZE[size].minHeight;
  const gapPx = parseFloat(GAP);
  const maxHeight = maxRows * rowHeight + (maxRows - 1) * gapPx;
  const total = children.length;
  const rendered = expanded ? children : children.slice(0, CLAMPED_WRAP_COLLAPSED_RENDER_LIMIT);

  const boxRef = useRef<HTMLDivElement>(null);
  /** 決まった行数の中に見えている部品の数（閉じているときに数える） */
  const [visibleCount, setVisibleCount] = useState(rendered.length);
  /** 全部並べると決まった行数を超えるか（開いているときに「折りたたむ」を出すか） */
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const items = Array.from(box.children) as HTMLElement[];
      // 箱は position: relative なので、中の部品の offsetTop は箱の上端からの距離
      const inside = items.filter(el => el.offsetTop < maxHeight).length;
      setVisibleCount(expanded ? items.length : inside);
      setOverflows(box.scrollHeight > maxHeight + 1);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [expanded, maxHeight, rendered.length]);

  const hidden = expanded ? 0 : Math.max(0, total - visibleCount);
  const showToggle = expanded ? overflows : hidden > 0;

  return (
    <div>
      <div
        ref={boxRef}
        data-clamped={expanded ? 'false' : 'true'}
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          gap: GAP,
          ...(expanded ? {} : { maxHeight, overflow: 'hidden' }),
        }}
      >
        {rendered}
      </div>
      {showToggle && (
        <Button
          theme={theme}
          variant="outline"
          size={size}
          fullWidth
          aria-expanded={expanded}
          onClick={onToggle}
          styleOverride={{ marginTop: GAP }}
        >
          {expanded ? lessLabel : moreLabel(hidden)}
          <DisclosureIndicator expanded={expanded} theme={theme} tone="inherit" />
        </Button>
      )}
    </div>
  );
};

export default ClampedWrap;
