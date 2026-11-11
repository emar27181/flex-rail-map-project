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
 * グループの区切りは余白だけで示し、見出しは画面に出さない（2026-11）。
 * 「経路上の路線」「選択した駅を通る路線」の見出しは違いが分かりにくいと指摘された。
 * 表示中か非表示かはチップの塗りで分かり、経路に近い路線ほど上に来る並び順で足りる。
 * 見出しは読み上げ用（role="group" の aria-label）にだけ残す。
 *
 * 従来の一覧も残してあり、呼び出し側で切り替えられる。
 */
import React, { useMemo, useState } from 'react';
import type { RouteKey } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateRoute, translateUI } from '../../utils/translation';
import type { Language } from '../../utils/translation';
import { FS } from '../../constants/ui';
import { L } from './legendStyles';
import Button from '../ui/atoms/Button';
import RouteToggleChip from './RouteToggleChip';
import TextField from '../ui/atoms/TextField';
import ClampedWrap from '../ui/molecules/ClampedWrap';

/**
 * このパネルの操作部品の大きさ。
 * 出発駅・到着駅の入力欄と同じ sm（24px）に揃える。ここ1箇所だけで決め、
 * 検索欄・全表示/全非表示ボタン・路線チップすべてがこの定数を参照する。
 */
const BOARD_CONTROL_SIZE = 'sm' as const;

/**
 * 各グループ（経路上・駅を通る・表示中・非表示）はチップを5行まで見せて始め、「さらに表示」で10行ずつ広げる
 * （ui/molecules/ClampedWrap）。以前は「さらに48件」と件数で区切っていて画面の幅で行数がばらばらだった。
 * 2026-11 まで「他 479 路線を表示」で全部が一度に出て、スクロールがとても長くなっていた
 */
const GROUP_MAX_ROWS = 5;

/**
 * グループとグループの間の余白。見出しを出さないので、チップ同士の間（ClampedWrap の 6px）より
 * はっきり広くして、余白だけで「ここから別のまとまり」と分かるようにする（近いものは同じ仲間に見える）
 */
const GROUP_GAP = L.sp['2xl'];

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
  /** グループごとの「さらに表示」を押した回数。既定はすべて 0（5行まで） */
  const [steps, setSteps] = useState<Record<GroupKey, number>>({
    onRoute: 0,
    atStation: 0,
    visible: 0,
    hidden: 0,
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

  const chip = (routeKey: RouteKey) => (
    <RouteToggleChip
      key={routeKey}
      routeKey={routeKey}
      routeName={routeNames[routeKey] ?? routeKey}
      routeColor={routeColors[routeKey] ?? colors.textSecondary}
      isVisible={visibleRoutes.has(routeKey)}
      theme={theme}
      language={language}
      size={BOARD_CONTROL_SIZE}
      onToggle={onToggleRoute}
      adjustRouteColorForTheme={adjustRouteColorForTheme}
      // 表示方式の切り替えボタン等と区別する目印（E2Eでも使う）
      dataAttr={{ 'data-route-chip': routeKey }}
    />
  );

  const group = (key: GroupKey, title: string, items: RouteKey[]) => {
    if (items.length === 0) return null;
    return (
      <div key={key} role="group" aria-label={`${title} ${items.length}`} data-route-group={key}>
        <ClampedWrap
          theme={theme}
          size={BOARD_CONTROL_SIZE}
          maxRows={GROUP_MAX_ROWS}
          steps={steps[key]}
          onStepsChange={n => setSteps(prev => ({ ...prev, [key]: n }))}
          moreLabel={hidden => translateUI('showMoreRoutesStep', language, { count: String(hidden) })}
          lessLabel={translateUI('collapseList', language)}
        >
          {items.map(chip)}
        </ClampedWrap>
      </div>
    );
  };

  return (
    <div>
      <TextField
        theme={theme}
        size={BOARD_CONTROL_SIZE}
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={translateUI('routeSearchPlaceholder', language)}
        styleOverride={{ marginBottom: L.sp.md }}
      />

      <div style={{ display: 'flex', gap: L.sp.xs, marginBottom: L.sp.md }}>
        <Button theme={theme} variant="positive" size={BOARD_CONTROL_SIZE} onClick={onSelectAllRoutes} styleOverride={{ flex: 1 }}>
          {translateUI('allShow', language)}
        </Button>
        <Button theme={theme} variant="danger" size={BOARD_CONTROL_SIZE} onClick={onDeselectAllRoutes} styleOverride={{ flex: 1 }}>
          {translateUI('allHide', language)}
        </Button>
      </div>

      <div style={{ fontSize: FS.caption, color: colors.textSecondary, marginBottom: L.sp.md }}>
        {translateUI('routeVisibleSummary', language, {
          shown: String(routeKeys.filter(rk => visibleRoutes.has(rk)).length),
          total: String(routeKeys.length),
        })}
      </div>

      {totalShown === 0 ? (
        <div style={{ fontSize: FS.caption, color: colors.textSecondary, padding: L.sp.lg }}>
          {translateUI('routeNoMatch', language)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: GROUP_GAP, marginBottom: L.sp.xl }}>
          {group('onRoute', translateUI('routeGroupOnRoute', language), groups.onRoute)}
          {group('atStation', translateUI('routeGroupAtStation', language), groups.atStation)}
          {group('visible', translateUI('routeGroupVisible', language), groups.visible)}
          {group('hidden', translateUI('routeGroupHidden', language), groups.hidden)}
        </div>
      )}
    </div>
  );
};

export default RouteSwitchBoard;
