/**
 * ボタンを押すと選択肢の一覧（メニュー）が開き、1つ選ぶ部品（モレキュール）。
 *
 * 言語のように「選べるものが少数で、今どれかを見せたい」切り替えを、押すたびに次へ進む
 * 巡回ボタンにすると、押す前に行き先が分からず、狙った選択肢に行くまで何度も押すことになる。
 * ここでは一覧を開き、今の選択に印を付け、押したものへ直接切り替える（ユーザーが「巡回は直感的でない」と指摘, 2026-11）。
 *
 * - ボタンはアイコンだけ（言語なら地球儀。文字は添えない）。今の選択は読み上げ名（`triggerLabel`）で伝え、
 *   開いている間は塗る
 * - 一覧の外を押す・Escape・Tab で閉じる。閉じたらボタンへ焦点を戻す
 * - 開くと今の選択に焦点が移り、↑↓ Home End で動ける（WAI-ARIA の menu button）
 * - 選択肢の行は指で押せる大きさ（md = 44px）。今の選択は塗りと ✓ で示す（色だけにしない）
 *
 * 何を選ぶか（言語など）は知らない。名前と値は props で受け取る。
 */
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Check } from 'lucide-react';
import Button from '../atoms/Button';
import FloatingIconButton from '../atoms/FloatingIconButton';
import IconButton from '../atoms/IconButton';
import { L } from '../../legend/legendStyles';
import { floatingSurfaceStyle } from '../atoms/floatingSurface';
import { CONTROL_SIZE } from '../atoms/controlSize';

export interface OptionMenuOption {
  value: string;
  /** 選択肢に出す文字 */
  label: string;
  /** その文字の言語（lang 属性）。読み上げ・フォントの選択用 */
  lang?: string;
}

export interface OptionMenuProps {
  theme: 'light' | 'dark';
  /** ボタンの読み上げ名（今の選択を含める） */
  triggerLabel: string;
  /** 一覧の読み上げ名 */
  menuLabel: string;
  /** ボタンのアイコン（lucide-react） */
  triggerIcon: ReactNode;
  /**
   * ボタンの見た目。floating = 地図の上に浮かぶ丸いアイコンボタン（36px・すりガラス）。
   * plain = ヘッダーなど（補助操作の小さいアイコンボタン）
   */
  appearance?: 'floating' | 'plain';
  options: OptionMenuOption[];
  /** いま選んでいる値 */
  value: string;
  onSelect: (value: string) => void;
  /** 一覧をボタンの下に出すか上に出すか（画面の下端にあるボタンは上） */
  placement?: 'below' | 'above';
  /** 一覧の左右どちらの端をボタンに揃えるか（画面の右端にあるボタンは end） */
  align?: 'start' | 'end';
}

/** 一覧の最小幅。一番長い名前（简体中文・English）が収まる */
const MENU_MIN_WIDTH = '160px';
/** 同じ重なりの中で、隣のボタンより上に出す */
const MENU_LAYER_Z = 1;

const OptionMenu: React.FC<OptionMenuProps> = ({
  theme, triggerLabel, menuLabel, triggerIcon, appearance = 'plain',
  options, value, onSelect, placement = 'below', align = 'end',
}) => {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const items = useCallback(
    () => Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? []),
    [],
  );
  const focusTrigger = useCallback(() => {
    rootRef.current?.querySelector<HTMLButtonElement>('[aria-haspopup]')?.focus();
  }, []);
  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) focusTrigger();
  }, [focusTrigger]);

  // 一覧の外を押したら閉じる（指でも・マウスでも）
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // 開いたら、今の選択へ焦点を移す
  useEffect(() => {
    if (!open) return;
    const list = items();
    const current = Math.max(0, options.findIndex(o => o.value === value));
    list[current]?.focus();
  }, [open, items, options, value]);

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const list = items();
    const at = list.indexOf(document.activeElement as HTMLButtonElement);
    const go = (i: number) => { e.preventDefault(); list[(i + list.length) % list.length]?.focus(); };
    switch (e.key) {
      case 'ArrowDown': return go(at + 1);
      case 'ArrowUp': return go(at - 1);
      case 'Home': return go(0);
      case 'End': return go(list.length - 1);
      case 'Escape': e.preventDefault(); return close(true);
      case 'Tab': return close(false);
    }
  };

  const triggerProps = {
    label: triggerLabel,
    'aria-haspopup': 'menu' as const,
    icon: triggerIcon,
    onClick: () => setOpen(v => !v),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown' && !open) { e.preventDefault(); setOpen(true); }
    },
  };

  const menuStyle: CSSProperties = {
    position: 'absolute',
    zIndex: MENU_LAYER_Z,
    [placement === 'below' ? 'top' : 'bottom']: `calc(100% + ${L.sp.xs})`,
    [align === 'end' ? 'right' : 'left']: 0,
    minWidth: MENU_MIN_WIDTH,
    display: 'flex',
    flexDirection: 'column',
    gap: L.sp.xs,
    padding: L.sp.xs,
    boxSizing: 'border-box',
    ...floatingSurfaceStyle(theme, 'open'),
    borderRadius: L.r.card,
  };

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {appearance === 'floating'
        ? <FloatingIconButton {...triggerProps} theme={theme} pressed={open} controls={open ? menuId : undefined} />
        : <IconButton {...triggerProps} theme={theme} variant="ghost" size="sm" aria-expanded={open} aria-controls={open ? menuId : undefined} />}
      {open && (
        <div ref={menuRef} id={menuId} role="menu" aria-label={menuLabel} style={menuStyle} onKeyDown={onMenuKeyDown}>
          {options.map(o => {
            const selected = o.value === value;
            return (
              <Button
                key={o.value}
                theme={theme}
                role="menuitemradio"
                aria-checked={selected}
                lang={o.lang}
                // 今の選択は塗り（variant）と ✓ で示す。選ぶたびに外形は変えない
                variant={selected ? 'primary' : 'ghost'}
                size="md"
                fullWidth
                onClick={() => { onSelect(o.value); close(true); }}
                styleOverride={{ justifyContent: 'space-between' }}
              >
                <span>{o.label}</span>
                {selected && <Check size={CONTROL_SIZE.md.iconSize} aria-hidden />}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OptionMenu;
