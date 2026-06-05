import React, { useState } from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { STAT_PARAMS, PARAM_DATA_SOURCES, DATA_DISCLAIMER, buildGradientCss } from '../../data/stationStats';
import type { StationStats, StatCategory } from '../../data/stationStats';
import { section, text, L } from './legendStyles';
import { translateUI } from '../../utils/translation';
import type { Language } from '../../utils/translation';

type Props = {
  enabled: boolean;
  paramKey: keyof StationStats;
  theme: 'light' | 'dark';
  language: Language;
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
  enabled, paramKey, theme, language,
  onEnabledChange, onParamKeyChange,
}: Props) {
  const colors = getThemeColors(theme);
  const [open, setOpen] = useState(false);

  const currentMeta = STAT_PARAMS.find(p => p.key === paramKey);

  const grouped = STAT_PARAMS.reduce<Partial<Record<StatCategory, typeof STAT_PARAMS>>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div style={section.wrap(colors)}>
      {/* ヘッダー */}
      <div style={section.header} onClick={() => setOpen(v => !v)}>
        <span style={section.arrow(colors)}>{open ? '▼' : '▶'}</span>
        <label
          style={{ display: 'flex', alignItems: 'center', gap: L.sp.sm, cursor: 'pointer', userSelect: 'none' }}
          onClick={e => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={enabled}
            onChange={e => { onEnabledChange(e.target.checked); if (e.target.checked) setOpen(true); }}
            style={{ cursor: 'pointer' }}
          />
          <span style={section.title(colors)}>{translateUI('stationHeatmap', language)}</span>
        </label>
        {enabled && (
          <span style={{
            fontSize: L.fs.xs,
            padding: `1px ${L.sp.sm}`,
            borderRadius: L.r.pill,
            background: '#a50026',
            color: '#fff',
          }}>
            {currentMeta?.label ?? paramKey as string}
          </span>
        )}
      </div>

      {open && (
        <div style={section.body}>

          {/* パラメータ選択 */}
          <div>
            <div style={text.desc(colors)}>{translateUI('heatmapDisplayParam', language)}</div>
            <select
              value={paramKey as string}
              onChange={e => onParamKeyChange(e.target.value as keyof StationStats)}
              style={{
                width:        '100%',
                fontSize:     L.fs.md,
                padding:      `${L.sp.xs} ${L.sp.sm}`,
                borderRadius: L.r.md,
                border:       `1px solid ${colors.border}`,
                background:   colors.surfaceElevated,
                color:        colors.text,
                cursor:       'pointer',
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
              fontSize:     L.fs.sm,
              color:        colors.textSecondary,
              background:   colors.surface,
              padding:      `${L.sp.xs} ${L.sp.md}`,
              borderRadius: L.r.md,
              borderLeft:   `3px solid ${(colors as any).primary ?? '#4a90d9'}`,
            }}>
              <div>{currentMeta.description}</div>
              {currentMeta.methodology && (
                <div style={{ marginTop: '2px' }}>
                  <span style={{ fontWeight: 'bold' }}>{translateUI('heatmapMethodology', language)}:</span> {currentMeta.methodology}
                </div>
              )}
              {currentMeta.period && (
                <div><span style={{ fontWeight: 'bold' }}>{translateUI('heatmapPeriod', language)}:</span> {currentMeta.period}</div>
              )}
              {currentMeta.radius && (
                <div><span style={{ fontWeight: 'bold' }}>{translateUI('heatmapRadius', language)}:</span> {currentMeta.radius}</div>
              )}
              <div style={{ marginTop: '3px', color: colors.textSecondary }}>
                {currentMeta.higherIsBetter
                  ? translateUI('heatmapHigherIsBetter', language)
                  : translateUI('heatmapLowerIsBetter', language)}
              </div>
            </div>
          )}

          {/* 凡例グラデーション */}
          <div>
            <div style={{ height: L.sp.md, borderRadius: L.r.md, background: GRADIENT_CSS }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
              <span style={text.muted(colors)}>{translateUI('heatmapGradientLow', language)}</span>
              <span style={text.muted(colors)}>{translateUI('heatmapGradientHigh', language)}</span>
            </div>
          </div>

          {/* 参照元情報 */}
          {PARAM_DATA_SOURCES[paramKey] && (() => {
            const src = PARAM_DATA_SOURCES[paramKey]!;
            return (
              <div style={{
                fontSize:     L.fs.xs,
                color:        colors.textSecondary,
                background:   colors.surface,
                padding:      `${L.sp.xs} ${L.sp.lg}`,
                borderRadius: L.r.md,
                borderLeft:   `2px solid ${colors.border}`,
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{translateUI('heatmapSource', language)}</div>
                <div>{src.title}</div>
                {src.url && (
                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#4a90d9', wordBreak: 'break-all' }}>
                    {src.url}
                  </a>
                )}
                <div style={{ marginTop: '2px' }}>
                  {translateUI('heatmapRetrievedAt', language)}: {src.retrievedAt}
                  {src.updatedAt && ` / ${translateUI('heatmapUpdatedAt', language)}: ${src.updatedAt}`}
                </div>
                {src.note && <div style={{ fontStyle: 'italic', marginTop: '2px' }}>{src.note}</div>}
              </div>
            );
          })()}

          {/* 免責 */}
          <div style={text.muted(colors)}>{DATA_DISCLAIMER}</div>
        </div>
      )}
    </div>
  );
}
