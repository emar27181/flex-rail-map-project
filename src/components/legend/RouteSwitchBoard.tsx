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
 * オン・オフを塗りと目のアイコンで示す。表示中と非表示は別のグループに並べ、
 * 各グループの中では経路上・選択駅を通る路線を優先する。
 * 見出しは読み上げ用の aria-label に置く。
 */
import React, { useMemo, useState } from 'react';
import type { RouteKey } from '../../data/routes';
import { getThemeColors } from '../../contexts/ThemeContext';
import { translateRoute, translateUI } from '../../utils/translation';
import type { Language } from '../../utils/translation';
import { FS } from '../../constants/ui';
import { L } from './legendStyles';
import Button from '../ui/atoms/Button';
import { CONTROL_BORDER_WIDTH } from '../ui/atoms/controlSize';
import RouteToggleChip from './RouteToggleChip';
import TextField from '../ui/atoms/TextField';
import ClampedWrap from '../ui/molecules/ClampedWrap';

/**
 * このパネルの操作部品の大きさ。
 * 出発駅・到着駅の入力欄と同じ sm（24px）に揃える。ここ1箇所だけで決め、
 * 検索欄・全表示/全非表示ボタン・路線チップすべてがこの定数を参照する。
 */
const BOARD_CONTROL_SIZE = 'sm' as const;

/** 検索のプレースホルダーを省略せず読める幅。狭いパネルでは並び順を次の行に送る。 */
const SEARCH_COMFORTABLE_WIDTH = '10em';

/**
 * 各グループ（経路上・駅を通る・表示中・非表示）はチップを3行まで見せて始め、「さらに表示」で5行ずつ広げる
 * （ui/molecules/ClampedWrap）。以前は「さらに48件」と件数で区切っていて画面の幅で行数がばらばらだった。
 * 2026-11 まで「他 479 路線を表示」で全部が一度に出て、スクロールがとても長くなっていた
 */
const GROUP_MAX_ROWS = 3;
const GROUP_STEP_ROWS = 5;

/**
 * グループとグループの間の余白。見出しを出さないので、チップ同士の間（ClampedWrap の 6px）より
 * はっきり広くして、余白だけで「ここから別のまとまり」と分かるようにする（近いものは同じ仲間に見える）
 */
const GROUP_GAP = L.sp['2xl'];

interface RouteSwitchBoardProps {
  /** 表示候補の路線キー（呼び出し側で絞り込んだもの） */
  routeKeys: RouteKey[];
  sortControl?: React.ReactNode;
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
  /**
   * チップの塗りが何を表すか。
   * - visibility（既定）: 地図に表示している路線。全表示・全非表示のボタンを出す
   * - rideLog: 乗った路線（乗車ログ）。同じチップ・同じ並びで、押すと乗った・乗っていないを切り替える。
   *   全部を一度に乗ったことにはしないので、全表示・全非表示のボタンは出さない
   */
  mode?: 'visibility' | 'rideLog';
}

type GroupKey = 'visible' | 'hidden';

const RouteSwitchBoard: React.FC<RouteSwitchBoardProps> = ({
  routeKeys,
  sortControl,
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
  mode = 'visibility',
}) => {
  const colors = getThemeColors(theme);
  const [query, setQuery] = useState('');
  /** グループごとの「さらに表示」を押した回数。 */
  const [steps, setSteps] = useState<Record<GroupKey, number>>({
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
    const priority = (key: RouteKey) => highlightedRouteKeys?.has(key) ? 0 : stationRouteKeys?.has(key) ? 1 : 2;
    const ordered = [...filtered].sort((a, b) => priority(a) - priority(b));
    return {
      visible: ordered.filter(key => visibleRoutes.has(key)),
      hidden: ordered.filter(key => !visibleRoutes.has(key)),
    };
  }, [routeKeys, matches, highlightedRouteKeys, stationRouteKeys, visibleRoutes]);

  const totalShown = groups.visible.length + groups.hidden.length;

  const chip = (routeKey: RouteKey) => (
    <RouteToggleChip
      key={routeKey}
      routeKey={routeKey}
      routeName={routeNames[routeKey] ?? routeKey}
      routeColor={routeColors[routeKey] ?? colors.textSecondary}
      isVisible={visibleRoutes.has(routeKey)}
      showVisibilityIcon={mode === 'visibility'}
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
      <div key={key} role="group" aria-label={`${title} ${items.length}`} data-route-group={key}
        style={key === 'hidden' && groups.visible.length > 0 ? {
          borderTop: `${CONTROL_BORDER_WIDTH}px solid ${colors.borderLight}`,
          paddingTop: L.sp.md,
        } : undefined}>
        <ClampedWrap
          theme={theme}
          size={BOARD_CONTROL_SIZE}
          maxRows={GROUP_MAX_ROWS}
          stepRows={GROUP_STEP_ROWS}
          steps={steps[key]}
          onStepsChange={n => setSteps(prev => ({ ...prev, [key]: n }))}
          moreLabel={hidden => translateUI('showMoreRoutesStep', language, { count: String(hidden) })}
          lessLabel={translateUI('collapseList', language)}
          chipColor={colors.textSecondary}
        >
          {items.map(chip)}
        </ClampedWrap>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: L.sp.xs, marginBottom: L.sp.sm }}>
        <TextField
          theme={theme}
          size={BOARD_CONTROL_SIZE}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label={translateUI('routeSearchPlaceholder', language)}
          placeholder={translateUI('routeSearchPlaceholder', language)}
          fullWidth={false}
          styleOverride={{ flex: `1 1 ${SEARCH_COMFORTABLE_WIDTH}`, minWidth: 0 }}
        />
        {sortControl}
      </div>

      {mode === 'visibility' && (
        <div style={{ display: 'flex', gap: L.sp.xs, marginBottom: L.sp.sm }}>
          <Button theme={theme} variant="positive" size={BOARD_CONTROL_SIZE} onClick={onSelectAllRoutes} styleOverride={{ flex: 1 }}>
            {translateUI('allShow', language)}
          </Button>
          <Button theme={theme} variant="danger" size={BOARD_CONTROL_SIZE} onClick={onDeselectAllRoutes} styleOverride={{ flex: 1 }}>
            {translateUI('allHide', language)}
          </Button>
        </div>
      )}

      <div data-route-board-mode={mode} style={{ fontSize: FS.caption, color: colors.textSecondary, marginBottom: L.sp.sm }}>
        {translateUI(mode === 'rideLog' ? 'rideLogRouteSummary' : 'routeVisibleSummary', language, {
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
          {group('visible', translateUI('routeGroupVisible', language), groups.visible)}
          {group('hidden', translateUI('routeGroupHidden', language), groups.hidden)}
        </div>
      )}
    </div>
  );
};

export default RouteSwitchBoard;
