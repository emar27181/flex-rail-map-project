/**
 * 地図の方位を示す磁針ボタン。押すと北を上に戻す。
 *
 * 地図は leaflet-rotate で2本指回転できる（touchRotate）が、回した後に
 * 北向きへ戻す手段が無く、どちらが北かも画面から読み取れなかった。
 * 針は地図と同じだけ回り、常に画面上の実際の北を指す
 * （leaflet-rotate の bearing=90 では北が画面の右に来る。実測で確認）。
 *
 * 地図隅ボタン群は MapContainer の外にあるため useMap は使えない。
 * また回転中は毎フレーム rotate イベントが来るので、地図本体
 * （RailwayMap）の state を更新すると巨大なコンポーネントが毎フレーム
 * 再描画される。角度はこのボタンの中だけで持ち、再描画をここに閉じ込める。
 */
import { useEffect, useState, type CSSProperties, type MutableRefObject } from 'react';
import IconButton from '../ui/atoms/IconButton';
import CompassNeedle from '../ui/atoms/CompassNeedle';

interface RotatableMap {
  getBearing?: () => number;
  setBearing?: (deg: number) => void;
  on: (type: string, fn: () => void) => void;
  off: (type: string, fn: () => void) => void;
}

export interface MapCompassButtonProps {
  mapRef: MutableRefObject<RotatableMap | null>;
  theme: 'light' | 'dark';
  label: string;
  iconSize: number;
  styleOverride?: CSSProperties;
}

export default function MapCompassButton({ mapRef, theme, label, iconSize, styleOverride }: MapCompassButtonProps) {
  const [bearing, setBearingState] = useState(0);

  useEffect(() => {
    let attached: RotatableMap | null = null;
    const sync = () => setBearingState(attached?.getBearing?.() ?? 0);

    // 地図の生成はこのボタンより後になることがあるので、見つかるまで待って購読する
    const tryAttach = () => {
      const map = mapRef.current;
      if (!map || attached) return !!attached;
      attached = map;
      map.on('rotate', sync);
      sync();
      return true;
    };
    const timer = tryAttach() ? null : setInterval(() => { if (tryAttach() && timer) clearInterval(timer); }, 300);

    return () => {
      if (timer) clearInterval(timer);
      attached?.off('rotate', sync);
    };
  }, [mapRef]);

  return (
    <IconButton
      theme={theme}
      size="sm"
      variant="outline"
      label={label}
      onClick={() => mapRef.current?.setBearing?.(0)}
      // bearing=θ のとき画面上の北は真上から時計回りに θ の方向
      icon={<CompassNeedle rotationDeg={bearing} size={iconSize} theme={theme} />}
      styleOverride={styleOverride}
    />
  );
}
