/**
 * 開閉する見出しの右端に置く「▼」（アトム）。
 *
 * 閉じているときは ▼、開いているときは 180度回して ▲ に見せる。
 * 以前は駅選択・表示路線の切替・候補ルート・列車種別などで同じ印を
 * それぞれ書いていて、回す時間（0.2s / 0.3s）や色がばらばらだった。
 * ▼ ▲ ▶ を文字で書いてよいのはこの部品だけ（翻訳文言にも入れない）。
 * tests/unit/components/ui/disclosure.test.ts が手書きを検出する。
 */
import React from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';

/** 開閉の印を回す時間。どの見出しでも同じにする */
export const DISCLOSURE_TRANSITION = 'transform 0.3s ease';

export interface DisclosureIndicatorProps {
  expanded: boolean;
  theme: 'light' | 'dark';
  /**
   * 印の色。secondary（既定）は補助文字色。inherit は周りの文字色に合わせる
   * （塗ったボタンの中に置くとき。補助文字色だと塗りの上で読めない）
   */
  tone?: 'secondary' | 'inherit';
}

const DisclosureIndicator: React.FC<DisclosureIndicatorProps> = ({ expanded, theme, tone = 'secondary' }) => (
  <span
    aria-hidden
    style={{
      flexShrink: 0,
      fontSize: FS.caption,
      lineHeight: 1,
      color: tone === 'inherit' ? 'currentColor' : getThemeColors(theme).textSecondary,
      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: DISCLOSURE_TRANSITION,
    }}
  >
    ▼
  </span>
);

export default DisclosureIndicator;
