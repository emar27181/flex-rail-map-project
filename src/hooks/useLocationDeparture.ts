import { useEffect, useRef, useState } from 'react';

/** 再取得後の新しい位置だけを出発駅に適用する。閉じた後は自動変更しない。 */
export function useLocationDeparture(location: [number, number] | null, error: string | null,
  onApply?: () => void, onRetry?: () => void) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const previousLocation = useRef(location);
  useEffect(() => {
    if (pending && location && location !== previousLocation.current && !error) {
      setPending(false); setOpen(false); onApply?.();
    }
  }, [location, error, pending, onApply]);
  return {
    open,
    start: () => { if (location && !error) onApply?.(); else setOpen(true); },
    retry: () => { previousLocation.current = location; setPending(true); onRetry?.(); },
    close: () => { setOpen(false); setPending(false); },
  };
}
