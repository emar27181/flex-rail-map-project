import React, { useState } from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { STAT_PARAMS, PARAM_DATA_SOURCES, DATA_DISCLAIMER, buildGradientCss } from '../../data/stationStats';
import type { StationStats, StatCategory } from '../../data/stationStats';

type Props = {
  enabled: boolean;
  paramKey: keyof StationStats;
  theme: 'light' | 'dark';
  onEnabledChange: (v: boolean) => void;
  onParamKeyChange: (k: keyof StationStats) => void;
};

const CATEGORY_LABEL: Record<StatCategory, string> = {
  housing:     '住居・生活コスト',
  transport:   '交通',
  food:        '飲食・娯楽',
  convenience: '生活利便性',
  safety:      '治安',
  environment: '環境',
  work:        '仕事',
};

const GRADIENT_CSS = buildGradientCss('to right');

export default function HeatmapControl({
  enabled, paramKey, theme,
  onEnabledChange, onParamKeyChange,
}: Props) {
  const colors = getThemeColors(theme);
  const [open, setOpen] = useState(false);

  const currentMeta = STAT_PARAMS.find(p => p.key === paramKey);

  // カテゴリごとにグループ化
  const grouped = STAT_PARAMS.reduce<Partial<Record<StatCategory, typeof STAT_PARAMS>>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div style={{
      borderTop: `1px solid ${colors.border}`,
      paddingTop: '8px',
      marginTop: '4px',
    }}>
      {/* ヘッダー行: チェックボックス + 折りたたみ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}
      >
        <span style={{ fontSize: '11px', color: colors.textSecondary, userSelect: 'none' }}>
          {open ? '▼' : '▶'}
        </span>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none' }}
          onClick={e => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={enabled}
            onChange={e => { onEnabledChange(e.target.checked); if (e.target.checked) setOpen(true); }}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: colors.text }}>
            駅統計ヒートマップ
          </span>
        </label>
        {enabled && (
          <span style={{
            fontSize: '10px',
            padding: '1px 5px',
            borderRadius: '8px',
            background: '#a50026',
            color: '#fff',
          }}>
            {currentMeta?.label ?? paramKey as string}
          </span>
        )}
      </div>

      {open && (
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

          {/* パラメータ選択 */}
          <div>
            <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>
              表示パラメータ
            </div>
            <select
              value={paramKey as string}
              onChange={e => onParamKeyChange(e.target.value as keyof StationStats)}
              style={{
                width: '100%',
                fontSize: '12px',
                padding: '4px 6px',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                background: colors.surfaceElevated,
                color: colors.text,
                cursor: 'pointer',
              }}
            >
              {(Object.entries(grouped) as [StatCategory, typeof STAT_PARAMS][]).map(([cat, params]) => (
                <optgroup key={cat} label={CATEGORY_LABEL[cat]}>
                  {params.map(p => (
                    <option key={p.key as string} value={p.key as string}>
                      {p.label}（{p.unit}）
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* 選択中パラメータの説明 */}
          {currentMeta && (
            <div style={{
              fontSize: '11px',
              color: colors.textSecondary,
              background: colors.surface,
              padding: '4px 8px',
              borderRadius: '4px',
              borderLeft: `3px solid ${colors.primary ?? '#4a90d9'}`,
            }}>
              <div>{currentMeta.description}</div>
              {currentMeta.methodology && (
                <div style={{ marginTop: '2px' }}>
                  <span style={{ fontWeight: 'bold' }}>集計方法:</span> {currentMeta.methodology}
                </div>
              )}
              {currentMeta.period && (
                <div>
                  <span style={{ fontWeight: 'bold' }}>基準時点:</span> {currentMeta.period}
                </div>
              )}
              {currentMeta.radius && (
                <div>
                  <span style={{ fontWeight: 'bold' }}>範囲:</span> {currentMeta.radius}
                </div>
              )}
              <div style={{ marginTop: '3px', color: colors.textMuted ?? colors.textSecondary }}>
                {currentMeta.higherIsBetter ? '高いほど 赤' : '低いほど 赤（値が高いほど課題あり）'}
              </div>
            </div>
          )}

          {/* 凡例グラデーション */}
          <div>
            <div style={{ height: '8px', borderRadius: '4px', background: GRADIENT_CSS }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
              <span style={{ fontSize: '10px', color: colors.textSecondary }}>低</span>
              <span style={{ fontSize: '10px', color: colors.textSecondary }}>高</span>
            </div>
          </div>

          {/* データカバレッジ注意書き */}
          <div style={{
            fontSize: '10px',
            color: colors.textSecondary ?? colors.textSecondary,
            fontStyle: 'italic',
          }}>
            ※ データ入力済み駅のみ色付き表示（現在 42 駅）。未入力駅は灰色。
          </div>

          {/* 参照元情報 */}
          {PARAM_DATA_SOURCES[paramKey] && (() => {
            const src = PARAM_DATA_SOURCES[paramKey]!;
            return (
              <div style={{
                fontSize: '10px',
                color: colors.textSecondary,
                background: colors.surface,
                padding: '5px 7px',
                borderRadius: '4px',
                borderLeft: `2px solid ${colors.border}`,
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>参照元</div>
                <div>{src.title}</div>
                {src.url && (
                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#4a90d9', wordBreak: 'break-all' }}>
                    {src.url}
                  </a>
                )}
                <div style={{ marginTop: '2px' }}>
                  参照日: {src.retrievedAt}
                  {src.updatedAt && ` / データ更新: ${src.updatedAt}`}
                </div>
                {src.note && <div style={{ fontStyle: 'italic', marginTop: '2px' }}>{src.note}</div>}
              </div>
            );
          })()}

          {/* 免責 */}
          <div style={{ fontSize: '10px', color: colors.textSecondary, fontStyle: 'italic' }}>
            {DATA_DISCLAIMER}
          </div>
        </div>
      )}
    </div>
  );
}
