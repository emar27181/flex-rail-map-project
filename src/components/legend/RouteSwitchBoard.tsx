/**
 * 表示路線の切り替え（ボード表示）。
 *
 * 従来の一覧は1行に1路線・チェックボックス・細い色線という作りで、
 * 490路線に対して次の点が読みにくかった:
 * - 1画面に10路線しか入らず、目的の路線に届くまで延々スクロールする
 * - 路線名で探す手段が無い
 * - オフの行は文字が薄いだけで、路線色は幅30pxの線でしか出ておらず
 *   「どの路線か」も「今どちらの状態か」も一目で分からない
 *
 * ここでは1行に複数のチップを並べ、路線色そのものを背景に使って
 * オン・オフを塗りの有無で示す。並びは意味のある順（経路上→駅を通る→
 * 表示中→非表示）に固定し、絞り込みの入力欄を置く。
 *
 * 従来の一覧も残してあり、呼び出し側で切り替えられる。
 */
import React, { useMemo, useState } from 'react';
import type { RouteKey } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateRoute, translateUI } from '../../utils/translation';
import type { Language } from '../../utils/translation';
import { filledLabelColors } from '../../utils/contrast';
import { FS, TARGET, SEMANTIC } from '../../constants/ui';
import { L } from './legendStyles';
import Button from '../ui/atoms/Button';

/** 1グループで最初に見せる件数。全部描くと490個のチップになり操作が重くなる */
const GROUP_INITIAL_LIMIT = 24;

/** さらに表示を押すたびに増やす件数 */
const GROUP_STEP = 48;

interface RouteSwitchBoardProps {
  /** 表示候補の路線キー（呼び出し側で絞り込んだもの） */
  routeKeys: RouteKey[];
  visibleRoutes: Set<RouteKey>;
  /** 選択中の経路が通る路線 */
  highlightedRouteKeys?: Set<RouteKey> | null;
  /** 出発駅・到着駅を通る路線 */
  stationRouteKeys?: Set<RouteKey>;
  routeColors: Record<RouteKey, string>;
  routeNames: Record<RouteKey, string>;
  theme: 'light' | 'dark';
  language: Language;
  onToggleRoute: (routeKey: RouteKey) => void;
  onSelectAllRoutes: () => void;
  onDeselectAllRoutes: () => void;
  adjustRouteColorForTheme: (color: string, theme: 'light' | 'dark') => string;
}

type GroupKey = 'onRoute' | 'atStation' | 'visible' | 'hidden';

const RouteSwitchBoard: React.FC<RouteSwitchBoardProps> = ({
  routeKeys,
  visibleRoutes,
  highlightedRouteKeys,
  stationRouteKeys,
  routeColors,
  routeNames,
  theme,
  language,
  onToggleRoute,
  onSelectAllRoutes,
  onDeselectAllRoutes,
  adjustRouteColorForTheme,
}) => {
  const colors = getThemeColors(theme);
  const [query, setQuery] = useState('');
  const [limits, setLimits] = useState<Record<GroupKey, number>>({
    onRoute: GROUP_INITIAL_LIMIT,
    atStation: GROUP_INITIAL_LIMIT,
    visible: GROUP_INITIAL_LIMIT,
    hidden: GROUP_INITIAL_LIMIT,
  });

  const labelOf = (rk: RouteKey) => translateRoute(routeNames[rk], language);

  /**
   * 絞り込みは翻訳後の名前と元の日本語名の両方を見る。
   * 英語表示のまま「山手」と打っても引けるようにするため。
   */
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return (rk: RouteKey) =>
      labelOf(rk).toLowerCase().includes(q) ||
      (routeNames[rk] ?? '').toLowerCase().includes(q);
    // labelOf は language に依存する
  }, [query, language, routeNames]);

  const groups = useMemo(() => {
    const filtered = matches ? routeKeys.filter(matches) : routeKeys;
    const onRoute: RouteKey[] = [];
    const atStation: RouteKey[] = [];
    const visible: RouteKey[] = [];
    const hidden: RouteKey[] = [];

    filtered.forEach(rk => {
      if (highlightedRouteKeys?.has(rk)) onRoute.push(rk);
      else if (stationRouteKeys?.has(rk)) atStation.push(rk);
      else if (visibleRoutes.has(rk)) visible.push(rk);
      else hidden.push(rk);
    });

    // 並び順は呼び出し側から渡された routeKeys の順をそのまま使う。
    // 既定は画面中心から近い順で、全国490路線を名前順にすると
    // 「IGRいわて銀河鉄道」から始まって手元の路線に永遠に届かない
    return { onRoute, atStation, visible, hidden };
  }, [routeKeys, matches, highlightedRouteKeys, stationRouteKeys, visibleRoutes]);

  const totalShown = groups.onRoute.length + groups.atStation.length + groups.visible.length + groups.hidden.length;

  const chip = (routeKey: RouteKey) => {
    const isOn = visibleRoutes.has(routeKey);
    const baseColor = adjustRouteColorForTheme(routeColors[routeKey] ?? '#888888', theme);
    // オンは路線色で塗り、その上に載る文字色は共通の規則から取る
    const { background, text } = filledLabelColors(baseColor, theme);
    return (
      <button
        key={routeKey}
        // 表示切り替えのボタン類と区別できるようにしておく（E2Eの目印にもなる）
        data-route-chip={routeKey}
        onClick={() => onToggleRoute(routeKey)}
        aria-pressed={isOn}
        title={labelOf(routeKey)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: L.sp.sm,
          // 枠線の太さは状態で変えない。変えるとチップの外形がずれて並びが動く
          border: `1px solid ${isOn ? background : colors.border}`,
          boxSizing: 'border-box',
          borderRadius: L.r.pill,
          padding: `0 ${L.sp.lg}`,
          minHeight: `${TARGET.touch}px`,
          // オフでも路線が読めるよう、背景ではなく文字色は通常色を使う
          backgroundColor: isOn ? background : colors.surfaceElevated,
          color: isOn ? text : colors.text,
          // 路線名は従来の一覧と同じ扱い（FS.base = 路線名の標準サイズ）
          fontSize: FS.base,
          // 太さは状態で変えない。太字にするとチップの幅が変わって並びが動く
          fontWeight: 'normal',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {/*
          オフのときは路線色が背景に出ないので、この丸で色を示す。
          オンのときは背景がすでに路線色なので、丸は文字色で塗って
          「入っている」印として読ませる。大きさは状態で変えない。
        */}
        <span
          aria-hidden
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            flexShrink: 0,
            backgroundColor: isOn ? text : baseColor,
          }}
        />
        {labelOf(routeKey)}
      </button>
    );
  };

  const group = (key: GroupKey, title: string, items: RouteKey[], accent?: string) => {
    if (items.length === 0) return null;
    const limit = limits[key];
    const shown = items.slice(0, limit);
    const rest = items.length - shown.length;
    return (
      <div style={{ marginBottom: L.sp.xl }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: L.sp.sm,
          marginBottom: L.sp.sm,
          fontSize: FS.helper,
          color: colors.textSecondary,
        }}>
          {accent && (
            <span aria-hidden style={{
              width: '3px',
              alignSelf: 'stretch',
              borderRadius: '2px',
              backgroundColor: accent,
            }} />
          )}
          <span>{title}</span>
          <span style={{ opacity: 0.7 }}>{items.length}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.sm }}>
          {shown.map(chip)}
        </div>
        {rest > 0 && (
          <Button
            theme={theme}
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => setLimits(prev => ({ ...prev, [key]: prev[key] + GROUP_STEP }))}
            styleOverride={{ marginTop: L.sp.sm }}
          >
            {translateUI('routeShowMore', language, { count: String(rest) })}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={translateUI('routeSearchPlaceholder', language)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          minHeight: `${TARGET.touch}px`,
          padding: `0 ${L.sp.lg}`,
          marginBottom: L.sp.md,
          border: `1px solid ${colors.border}`,
          borderRadius: L.r.md,
          backgroundColor: colors.surfaceElevated,
          color: colors.text,
          // iOS Safari の自動ズームを防ぐため入力欄は16px下限
          fontSize: FS.input,
        }}
      />

      <div style={{ display: 'flex', gap: L.sp.xs, marginBottom: L.sp.md }}>
        <Button theme={theme} variant="positive" size="sm" onClick={onSelectAllRoutes} styleOverride={{ flex: 1 }}>
          {translateUI('allShow', language)}
        </Button>
        <Button theme={theme} variant="danger" size="sm" onClick={onDeselectAllRoutes} styleOverride={{ flex: 1 }}>
          {translateUI('allHide', language)}
        </Button>
      </div>

      <div style={{ fontSize: FS.helper, color: colors.textSecondary, marginBottom: L.sp.md }}>
        {translateUI('routeVisibleSummary', language, {
          shown: String(routeKeys.filter(rk => visibleRoutes.has(rk)).length),
          total: String(routeKeys.length),
        })}
      </div>

      {totalShown === 0 ? (
        <div style={{ fontSize: FS.label, color: colors.textSecondary, padding: L.sp.lg }}>
          {translateUI('routeNoMatch', language)}
        </div>
      ) : (
        <>
          {group('onRoute', translateUI('routeGroupOnRoute', language), groups.onRoute, SEMANTIC.primary)}
          {group('atStation', translateUI('routeGroupAtStation', language), groups.atStation, SEMANTIC.departure)}
          {group('visible', translateUI('routeGroupVisible', language), groups.visible)}
          {group('hidden', translateUI('routeGroupHidden', language), groups.hidden)}
        </>
      )}
    </div>
  );
};

export default RouteSwitchBoard;
