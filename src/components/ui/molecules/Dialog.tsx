import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FS } from '../../../constants/ui';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { L } from '../../legend/legendStyles';
import { floatingSurfaceStyle } from '../atoms/floatingSurface';

/** 汎用モーダル。ネイティブのフォーカス管理・背景の操作抑止を使う。 */
export default function Dialog({ open, title, theme, onClose, children }: {
  open: boolean; title: string; theme: 'light' | 'dark'; onClose: () => void; children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, [open]);
  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <dialog ref={ref} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }}
      style={{ ...floatingSurfaceStyle(theme, 'open'), color: getThemeColors(theme).text,
        width: 'min(400px, 90vw)', maxHeight: '80dvh', overflowY: 'auto',
        padding: L.sp.xl, boxSizing: 'border-box', fontFamily: 'inherit' }}>
      <h2 id={titleId} style={{ fontSize: FS.title, margin: 0, marginBottom: L.sp.lg }}>{title}</h2>
      {children}
    </dialog>, document.fullscreenElement ?? document.body,
  );
}
