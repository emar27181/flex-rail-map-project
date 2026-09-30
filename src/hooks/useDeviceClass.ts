/**
 * 今の画面幅がスマホ・タブレット・PCのどれか（src/constants/breakpoints.ts の区分）。
 * 画面幅で分けるコンポーネントは、window.innerWidth を自分で比べずにこれを使う。
 * サーバー描画・初回は desktop として扱い、描画後に実際の幅で決め直す。
 */
import { useEffect, useState } from 'react';
import { deviceClassOf, type DeviceClass } from '../constants/breakpoints';

export function useDeviceClass(): DeviceClass {
  const [device, setDevice] = useState<DeviceClass>(() =>
    typeof window === 'undefined' ? 'desktop' : deviceClassOf(window.innerWidth));
  useEffect(() => {
    const update = () => setDevice(deviceClassOf(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return device;
}
