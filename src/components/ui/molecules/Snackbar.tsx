/**
 * 操作の結果を画面の下に短く知らせ、必要なら取り消せる帯（スナックバー, モレキュール）。
 *
 * 2026-11: スマホで地図の線をタップすると路線の表示が切り替わるが、指の端末では路線名の吹き出し（ホバー）を
 * 出さない（hooks/useCanHover.ts）ため、どの路線を切り替えたのか分からなかった。押し間違えても戻せなかった。
 *
 * 決まり（Material Design のスナックバーと同じ考え方）:
 * - 一度に1つ。新しい知らせは前のものを置き換える（呼び出し側が key を変える）
 * - SNACKBAR_DURATION_MS で自動で消える。指やマウスが乗っている間・中にフォーカスがある間は消さない
 * - 操作（「元に戻す」など）は1つまで。押すと onAction を呼んで閉じる
 * - 地図の操作を止めない（全体を覆わない・確認を求めない）。読み上げでは role="status" で知らせる
 *
 * 何を知らせるか（路線など）は知らない。文言・先頭の印は呼び出し側が渡す。
 */
import React, { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from '../atoms/Button';
import IconButton from '../atoms/IconButton';
import { FLOATING_PANEL, floatingPanelWidth } from '../atoms/controlSize';
import { floatingSurfaceStyle } from '../atoms/floatingSurface';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';

/**
 * 自動で消えるまでの時間。読む時間と押す時間を合わせて、操作ありの知らせとして短すぎない長さ
 * （Material Design は 4〜10 秒。操作がある場合は短くしない）
 */
export const SNACKBAR_DURATION_MS = 5000;

/** 地図の上に浮かぶボタン（1003）・凡例（1002）より上に出す */
export const SNACKBAR_Z = 1004;

export interface SnackbarProps {
  theme: 'light' | 'dark';
  /** 知らせる文言 */
  message: ReactNode;
  /** 文言の前に置く印（路線の色の点など） */
  leading?: ReactNode;
  /** 操作の文言（「元に戻す」など）。無ければ操作のボタンを出さない */
  actionLabel?: string;
  onAction?: () => void;
  /** 閉じる（自動で消えるとき・×・操作のあと） */
  onClose: () => void;
  /** 閉じるボタンの読み上げ用の名前 */
  closeLabel: string;
  /** 自動で消えるまでの時間(ms) */
  duration?: number;
  /** 置く位置（地図の下端からの距離）。浮かぶボタンとの位置関係は呼び出し側が決める */
  bottom: string;
  /** 位置の上書き（テストや別の置き場所） */
  style?: CSSProperties;
}

const Snackbar: React.FC<SnackbarProps> = ({
  theme, message, leading, actionLabel, onAction, onClose, closeLabel, duration = SNACKBAR_DURATION_MS, bottom, style,
}) => {
  const colors = getThemeColors(theme);
  const [paused, setPaused] = useState(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => closeRef.current(), duration);
    return () => clearTimeout(timer);
  }, [paused, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      data-snackbar
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false); }}
      style={{
        ...floatingSurfaceStyle(theme, 'open'),
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom,
        zIndex: SNACKBAR_Z,
        width: floatingPanelWidth('wide'),
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: L.sp.sm,
        padding: `${L.sp.xs} ${L.sp.xs} ${L.sp.xs} ${FLOATING_PANEL.inset}`,
        color: colors.text,
        fontSize: FS.body,
        ...style,
      }}
    >
      {leading}
      <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>{message}</span>
      {actionLabel && onAction && (
        <Button
          theme={theme}
          variant="ghost"
          size="md"
          onClick={() => { onAction(); onClose(); }}
          styleOverride={{ flexShrink: 0, fontWeight: 'bold' }}
        >
          {actionLabel}
        </Button>
      )}
      <IconButton theme={theme} variant="ghost" size="md" label={closeLabel} icon={<X />} onClick={onClose} />
    </div>
  );
};

export default Snackbar;
