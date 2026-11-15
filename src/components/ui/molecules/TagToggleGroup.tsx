/** 共通の色付きチップを折り返して並べる。 */
import React from 'react';
import type { ReactNode } from 'react';
import Chip from '../atoms/Chip';
import { L } from '../../legend/legendStyles';

export interface TagToggleItem {
  key: string;
  label: string;
  color: string;
  /** lucide-react のアイコン（例: <Users />） */
  icon: ReactNode;
  pressed: boolean;
  onToggle: () => void;
  /** ホバーで出す補足 */
  title?: string;
  disabled?: boolean;
}

export interface TagToggleGroupProps {
  theme: 'light' | 'dark';
  items: TagToggleItem[];
  /** 読み上げ用のグループ名 */
  ariaLabel: string;
}

const TagToggleGroup: React.FC<TagToggleGroupProps> = ({ theme, items, ariaLabel }) => (
  <div role="group" aria-label={ariaLabel} style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.xs }}>
    {items.map(item => (
      <Chip
        key={item.key}
        theme={theme}
        size="sm"
        selected={item.pressed}
        color={item.color}
        label={item.label}
        disabled={item.disabled}
        title={item.title}
        icon={item.icon}
        onClick={item.onToggle}
        dataAttr={{ 'data-tag': item.key }}
      />
    ))}
  </div>
);

export default TagToggleGroup;
