/**
 * 開閉する見出しの右端に置く「▼」（アトム）。
 *
 * 閉じているときは ▼、開いているときは 180度回して ▲ に見せる。
 * 以前は駅選択・表示路線の切替・候補ルート・列車種別などで同じ印を
 * それぞれ書いていて、回す時間（0.2s / 0.3s）や色がばらばらだった。
 */
import React from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';

/** 開閉の印を回す時間。どの見出しでも同じにする */
export const DISCLOSURE_TRANSITION = 'transform 0.3s ease';

export interface DisclosureIndicatorProps {
  expanded: boolean;
  theme: 'light' | 'dark';
}

const DisclosureIndicator: React.FC<DisclosureIndicatorProps> = ({ expanded, theme }) => (
  <span
    aria-hidden
    style={{
      flexShrink: 0,
      fontSize: FS.caption,
      lineHeight: 1,
      color: getThemeColors(theme).textSecondary,
      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: DISCLOSURE_TRANSITION,
    }}
  >
    ▼
  </span>
);

export default DisclosureIndicator;
