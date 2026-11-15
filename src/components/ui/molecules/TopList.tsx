/**
 * 並んだ項目を上位から決まった件数まで見せ、残りは折りたたむ縦の一覧（モレキュール）。
 *
 * 「集合駅を探す」の候補・出発駅ごとのルートは、上位3つだけ見ればほとんど足りる（2026-11-14 ユーザー指示:
 * 「上位3位以降は折りたたみでデフォルト」）。残りは「さらに表示」で開き、「折りたたむ」で戻す。step を指定すると段階的に開く。
 * 折り返して並ぶ小さな部品を行数で切る `ClampedWrap` と違い、こちらは1項目が1行以上の縦の並びを件数で切る。
 * 何が並ぶか（駅・ルート）は知らない。中身は children（1項目1要素）で受け取る。
 */
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Button from '../atoms/Button';
import DisclosureIndicator from '../atoms/DisclosureIndicator';
import { L } from '../../legend/legendStyles';

/** 最初に見せる件数の既定値 */
export const TOP_LIST_DEFAULT_COUNT = 3;
/** 段階的に開く一覧の追加件数 */
export const TOP_LIST_STEP_COUNT = 5;

export interface TopListProps {
  theme: 'light' | 'dark';
  /** 並べる項目（1項目1要素。key は呼び出し側で付ける） */
  children: ReactNode[];
  /** 最初に見せる件数 */
  visibleCount?: number;
  /** 1回で追加する件数。省略時は一度に開く */
  step?: number;
  /** 「さらに表示」の文言（隠れている件数を受け取る） */
  moreLabel: (hiddenCount: number) => string;
  /** 「折りたたむ」の文言 */
  lessLabel: string;
  /** 最初から全部開いておく */
  defaultExpanded?: boolean;
  /** 項目の間隔 */
  gap?: string;
}

const TopList: React.FC<TopListProps> = ({
  theme, children, visibleCount = TOP_LIST_DEFAULT_COUNT, step = Infinity, moreLabel, lessLabel, defaultExpanded = false, gap = L.sp.xs,
}) => {
  const [extraCount, setExtraCount] = useState(defaultExpanded ? Infinity : 0);
  const shownCount = Math.min(visibleCount + extraCount, children.length);
  const hidden = children.length - shownCount;
  const expanded = shownCount > visibleCount;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }} data-top-list={expanded ? 'expanded' : hidden > 0 ? 'collapsed' : 'all'}>
      {children.slice(0, shownCount)}
      {(hidden > 0 || expanded) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap }}>
          {hidden > 0 && (
            <Button theme={theme} variant="outline" size="sm" aria-expanded={false} onClick={() => setExtraCount(n => n + step)}>
              {moreLabel(hidden)}
              <DisclosureIndicator expanded={false} theme={theme} tone="inherit" />
            </Button>
          )}
          {expanded && (
            <Button theme={theme} variant="outline" size="sm" aria-expanded onClick={() => setExtraCount(0)}>
              {lessLabel}
              <DisclosureIndicator expanded theme={theme} tone="inherit" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TopList;
