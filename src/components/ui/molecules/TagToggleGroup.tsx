/**
 * アイコンつきの切り替えタグ（ボタン）の並び（モレキュール）。
 *
 * 表示モード（集合駅・終電・乗車ログ）と、データ可視化（ヒートマップ・バブル地図など）を、同じ見た目の
 * 「押すと塗りに変わるタグ」で切り替えるために使う（2026-11-15 ユーザー指示）。チェックボックスの縦の列より
 * 一目で選べて、折り返して並ぶので長くならない。タグは `Button`（variant="primary"・pressed）、
 * アイコンは lucide-react。何のタグか（モード・可視化）は知らない。
 */
import React from 'react';
import type { ReactNode } from 'react';
import Button from '../atoms/Button';
import { L } from '../../legend/legendStyles';

export interface TagToggleItem {
  key: string;
  label: string;
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
      <Button
        key={item.key}
        theme={theme}
        variant="primary"
        size="sm"
        pressed={item.pressed}
        disabled={item.disabled}
        title={item.title}
        icon={item.icon}
        onClick={item.onToggle}
        data-tag={item.key}
      >
        {item.label}
      </Button>
    ))}
  </div>
);

export default TagToggleGroup;
