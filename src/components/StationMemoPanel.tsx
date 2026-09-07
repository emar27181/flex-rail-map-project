/**
 * 「誰の最寄り駅がどこか」のメモ（オーガニズム）。
 *
 * 待ち合わせや幹事のとき、参加者の最寄り駅を控えておいて
 * 「全員が乗れる路線はどれか」を見るための一覧。
 *
 * 共通の路線を「全員が乗れるものだけ」に絞ると、住んでいる場所が
 * 離れているとほぼ必ず空になって何も分からない。そこで人数付きで並べ、
 * 全員ぶんに当たったものだけを別に強調する。
 *
 * 人の名前を扱うので保存はこの端末の localStorage だけ。外部に送らない。
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, X, Users, ChevronDown, ChevronRight } from 'lucide-react';
import type { RouteKey } from '../data/routes';
import { getThemeColors } from '../contexts/ThemeContext';
import { translateRoute, translateStation, translateUI } from '../utils/translation';
import type { Language } from '../utils/translation';
import { getAllStations } from '../utils/allStations';
import { FS, SEMANTIC } from '../constants/ui';
import { L } from './legend/legendStyles';
import Button from './ui/atoms/Button';
import IconButton from './ui/atoms/IconButton';
import Chip from './ui/atoms/Chip';
import TextField from './ui/atoms/TextField';
import {
  loadMemos,
  saveMemos,
  addMemo,
  removeMemo,
  filterMemos,
  routeKeysForStation,
  isKnownStation,
  summarizeSharedRoutes,
} from '../utils/stationMemo';
import type { StationMemo } from '../utils/stationMemo';

/**
 * このパネルの操作部品の大きさ。
 * 同じパネルに並ぶものは1つの段階に揃える。
 * 設定パネルの中に置く密な一覧なので sm。
 */
const PANEL_CONTROL_SIZE = 'sm' as const;

/** 駅名の候補として一度に出す件数。全6000駅を出すと選べない */
const STATION_SUGGESTION_LIMIT = 6;

/** 共通の路線を最初に見せる件数 */
const SHARED_ROUTE_LIMIT = 12;

export interface StationMemoPanelProps {
  theme: 'light' | 'dark';
  language: Language;
  routeColors: Record<string, string>;
  routeNames: Record<string, string>;
  /** 指定した路線を地図に出す */
  onShowRoutes: (routeKeys: RouteKey[]) => void;
  /** 一覧の駅を出発駅にする */
  onUseAsDeparture?: (stationName: string) => void;
  adjustRouteColorForTheme: (color: string, theme: 'light' | 'dark') => string;
}

/**
 * 折りたたみの箱ごとこの部品が持つ。設定パネルの他の節と見た目を揃えつつ、
 * 呼び出し側は1行で置けるようにするため。
 */
const StationMemoPanel: React.FC<StationMemoPanelProps> = ({
  theme,
  language,
  routeColors,
  routeNames,
  onShowRoutes,
  onUseAsDeparture,
  adjustRouteColorForTheme,
}) => {
  const colors = getThemeColors(theme);

  const [memos, setMemos] = useState<StationMemo[]>([]);
  const [query, setQuery] = useState('');
  const [draftName, setDraftName] = useState('');
  const [draftStation, setDraftStation] = useState('');
  const [showAllShared, setShowAllShared] = useState(false);
  // 使う人だけが開く機能なので既定は閉じる
  const [open, setOpen] = useState(false);

  // 初回だけ読み込む。以降は state を正とし、変わるたびに書き戻す
  useEffect(() => { setMemos(loadMemos()); }, []);

  const update = (next: StationMemo[]) => {
    setMemos(next);
    saveMemos(next);
  };

  const labelOfRoute = (rk: RouteKey) => translateRoute(routeNames[rk] ?? rk, language);

  /** 絞り込みは名前・駅・メモに加えて路線名も見る（「山手線の人」を引けるように） */
  const shown = useMemo(
    () => filterMemos(memos, query, m => routeKeysForStation(m.stationName).map(labelOfRoute)),
    [memos, query, language, routeNames],
  );

  /** 共通の路線は「今絞り込まれている人」に対して出す。検索がそのまま母集団になる */
  const shared = useMemo(() => summarizeSharedRoutes(shown), [shown]);

  /** 入力中の駅名から候補を出す。データにある駅名でないと路線を引けないため */
  const stationSuggestions = useMemo(() => {
    const q = draftStation.trim();
    if (!q || isKnownStation(q)) return [];
    return getAllStations()
      .filter(s => s.name.includes(q))
      .slice(0, STATION_SUGGESTION_LIMIT);
  }, [draftStation]);

  const canAdd = draftName.trim() !== '' && draftStation.trim() !== '';

  const handleAdd = () => {
    if (!canAdd) return;
    update(addMemo(memos, { name: draftName, stationName: draftStation }));
    setDraftName('');
    setDraftStation('');
  };

  const sharedToShow = showAllShared
    ? shared.routes
    : shared.routes.slice(0, SHARED_ROUTE_LIMIT);

  const labelStyle = {
    fontSize: FS.caption,
    color: colors.textSecondary,
    marginBottom: L.sp.sm,
  } as const;

  return (
    <div style={{
      marginBottom: L.sp['2xl'],
      padding: L.sp.lg,
      backgroundColor: colors.surface,
      borderRadius: L.r.control,
      border: `1px solid ${colors.borderLight}`,
    }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: L.sp.sm,
          cursor: 'pointer',
          fontSize: FS.title,
          fontWeight: 'bold',
          color: colors.text,
        }}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span style={{ flex: 1 }}>{translateUI('memoTitle', language)}</span>
        {memos.length > 0 && (
          <span style={{ fontSize: FS.caption, fontWeight: 'normal', color: colors.textSecondary }}>
            {translateUI('memoCount', language, { count: String(memos.length) })}
          </span>
        )}
      </div>

      {!open ? null : (
      <div style={{ marginTop: L.sp.md }}>
      <div style={{ ...labelStyle, lineHeight: 1.6 }}>
        {translateUI('memoDescription', language)}
      </div>

      {/* ── 追加 ── */}
      <div style={{ display: 'flex', gap: L.sp.xs, marginBottom: L.sp.sm }}>
        <TextField
          theme={theme}
          size={PANEL_CONTROL_SIZE}
          value={draftName}
          onChange={e => setDraftName(e.target.value)}
          placeholder={translateUI('memoPersonPlaceholder', language)}
          styleOverride={{ flex: 1, minWidth: 0 }}
        />
        <TextField
          theme={theme}
          size={PANEL_CONTROL_SIZE}
          value={draftStation}
          onChange={e => setDraftStation(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          placeholder={translateUI('memoStationPlaceholder', language)}
          styleOverride={{ flex: 1, minWidth: 0 }}
        />
        <IconButton
          theme={theme}
          size={PANEL_CONTROL_SIZE}
          variant="primary"
          onClick={handleAdd}
          disabled={!canAdd}
          label={translateUI('memoAdd', language)}
          icon={<Plus size={14} />}
        />
      </div>

      {/* 入力中の駅名がデータに無いときだけ候補を出す */}
      {stationSuggestions.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.xs, marginBottom: L.sp.sm }}>
          {stationSuggestions.map(s => (
            <Button
              key={s.name}
              theme={theme}
              variant="outline"
              size={PANEL_CONTROL_SIZE}
              onClick={() => setDraftStation(s.name)}
            >
              {translateStation(s.name, language)}
            </Button>
          ))}
        </div>
      )}
      {draftStation.trim() !== '' && !isKnownStation(draftStation.trim()) && stationSuggestions.length === 0 && (
        <div style={{ ...labelStyle, color: SEMANTIC.arrival }}>
          {translateUI('memoUnknownStation', language)}
        </div>
      )}

      {/* ── 絞り込み ── */}
      {memos.length > 0 && (
        <TextField
          theme={theme}
          size={PANEL_CONTROL_SIZE}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={translateUI('memoSearchPlaceholder', language)}
          styleOverride={{ marginBottom: L.sp.sm }}
        />
      )}

      {/* ── 一覧 ── */}
      {memos.length === 0 ? (
        <div style={labelStyle}>{translateUI('memoEmpty', language)}</div>
      ) : shown.length === 0 ? (
        <div style={labelStyle}>{translateUI('memoNoMatch', language)}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xs, marginBottom: L.sp.xl }}>
          {shown.map(m => {
            const keys = routeKeysForStation(m.stationName);
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: L.sp.sm,
                  padding: L.sp.sm,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.borderLight}`,
                  borderRadius: L.r.control,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: FS.caption, color: colors.text, fontWeight: 'bold' }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: FS.caption, color: colors.textSecondary }}>
                    {translateStation(m.stationName, language)}
                    {keys.length === 0 && ` · ${translateUI('memoUnknownStation', language)}`}
                  </div>
                  {keys.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.xxs, marginTop: L.sp.xxs }}>
                      {keys.map(rk => (
                        <span
                          key={rk}
                          style={{
                            width: L.sp.lg,
                            height: L.sp.sm,
                            borderRadius: L.r.control,
                            backgroundColor: adjustRouteColorForTheme(
                              routeColors[rk] ?? colors.textSecondary, theme,
                            ),
                          }}
                          title={labelOfRoute(rk)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {onUseAsDeparture && keys.length > 0 && (
                  <Button
                    theme={theme}
                    variant="outline"
                    size={PANEL_CONTROL_SIZE}
                    onClick={() => onUseAsDeparture(m.stationName)}
                  >
                    {translateUI('memoUseAsDeparture', language)}
                  </Button>
                )}
                <IconButton
                  theme={theme}
                  size={PANEL_CONTROL_SIZE}
                  variant="ghost"
                  onClick={() => update(removeMemo(memos, m.id))}
                  label={translateUI('memoRemove', language)}
                  icon={<X size={14} />}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ── 共通の路線 ── */}
      {shown.length > 0 && (
        <div>
          <div style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: L.sp.sm }}>
            <Users size={12} />
            <span>{translateUI('memoSharedRoutes', language)}</span>
            <span style={{ opacity: 0.7 }}>
              {translateUI('memoCount', language, { count: String(shared.total) })}
            </span>
          </div>

          {shared.everyone.length === 0 ? (
            <div style={labelStyle}>{translateUI('memoNoShared', language)}</div>
          ) : (
            <Button
              theme={theme}
              variant="primary"
              size={PANEL_CONTROL_SIZE}
              fullWidth
              onClick={() => onShowRoutes(shared.everyone)}
              styleOverride={{ marginBottom: L.sp.sm }}
            >
              {translateUI('memoShowEveryone', language)}
            </Button>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.sp.xs }}>
            {sharedToShow.map(r => (
              <Chip
                key={r.routeKey}
                color={adjustRouteColorForTheme(routeColors[r.routeKey] ?? colors.textSecondary, theme)}
                // 全員ぶんに当たった路線は「全員」と出す。数字だけだと母数が分からない
                label={`${labelOfRoute(r.routeKey)} ${
                  r.count === shared.total
                    ? translateUI('memoEveryone', language)
                    : translateUI('memoSharedCount', language, {
                      count: String(r.count), total: String(shared.total),
                    })
                }`}
                selected={r.count === shared.total}
                theme={theme}
                size={PANEL_CONTROL_SIZE}
                onClick={() => onShowRoutes([r.routeKey])}
              />
            ))}
          </div>

          {shared.routes.length > sharedToShow.length && (
            <Button
              theme={theme}
              variant="outline"
              size={PANEL_CONTROL_SIZE}
              fullWidth
              onClick={() => setShowAllShared(true)}
              styleOverride={{ marginTop: L.sp.sm }}
            >
              {translateUI('routeShowMore', language, {
                count: String(shared.routes.length - sharedToShow.length),
              })}
            </Button>
          )}

          <Button
            theme={theme}
            variant="outline"
            size={PANEL_CONTROL_SIZE}
            fullWidth
            onClick={() => onShowRoutes(shared.routes.map(r => r.routeKey))}
            styleOverride={{ marginTop: L.sp.sm }}
          >
            {translateUI('memoShowShared', language)}
          </Button>
        </div>
      )}
      </div>
      )}
    </div>
  );
};

export default StationMemoPanel;
