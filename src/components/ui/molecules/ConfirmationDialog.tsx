import { useEffect, useId, useRef } from 'react';
import { FS } from '../../../constants/ui';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { L } from '../../legend/legendStyles';
import Button from '../atoms/Button';

interface Props {
  theme: 'light' | 'dark';
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmationDialog({
  theme, title, description, cancelLabel, confirmLabel, onCancel, onConfirm,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const colors = getThemeColors(theme);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); };
  }, []);

  return (
    <dialog ref={ref} aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={event => { event.preventDefault(); onCancel(); }}
      style={{
        boxSizing: 'border-box', inlineSize: 'max-content', maxInlineSize: `calc(100% - 2 * ${L.sp['3xl']})`,
        padding: L.sp['4xl'], border: `1px solid ${colors.border}`, borderRadius: L.r.card,
        background: colors.surface, color: colors.text,
      }}>
      <h2 id={titleId} style={{ margin: 0, fontSize: FS.title }}>{title}</h2>
      <p id={descriptionId} style={{ margin: `${L.sp.sm} 0 ${L.sp['2xl']}`, fontSize: FS.caption, color: colors.textSecondary }}>
        {description}
      </p>
      <div style={{ display: 'flex', gap: L.sp.sm, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Button autoFocus theme={theme} variant="outline" onClick={onCancel}>{cancelLabel}</Button>
        <Button theme={theme} variant="primary" onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </dialog>
  );
}
