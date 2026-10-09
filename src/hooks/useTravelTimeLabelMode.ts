import { useEffect, useState } from 'react';

export type TravelTimeLabelMode = 'interval' | 'cumulative';

/** 出発駅の設定/解除で既定を切り替える。同じ設定中の手動選択は維持する。 */
export function useTravelTimeLabelMode(hasDeparture: boolean) {
  const [mode, setMode] = useState<TravelTimeLabelMode>(
    hasDeparture ? 'cumulative' : 'interval',
  );

  useEffect(() => {
    setMode(hasDeparture ? 'cumulative' : 'interval');
  }, [hasDeparture]);

  return [mode, setMode] as const;
}
