import React, { useRef, useState } from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { section, text, btn, btnFull, textarea, L } from './legendStyles';
import { translateUI } from '../../utils/translation';
import type { Language } from '../../utils/translation';
import Button from '../ui/atoms/Button';
import TextArea from '../ui/atoms/TextArea';

export type MapConfig = {
  version: 1;
  heatmapEnabled: boolean;
  heatmapParam: string;
  heatmapCustomRange?: { min: number; max: number };
  visibleRoutes: string[];
  showTransferStationsOnly: boolean;
  showExpressStationsOnly: boolean;
  showTravelTimes: boolean;
  showStationNames: boolean;
  showFurigana: boolean;
  showStationNumbers: boolean;
  showOsmTiles: boolean;
  mapViewMode: string;
  timeFilterEnabled: boolean;
  timeFilterMaxMinutes: number;
  showStationTooltip: boolean;
  showFullRouteStations: boolean;
  showRouteLine: boolean;
  /** 主要駅の常時表示（旧バージョンの設定ファイルには無いため任意） */
  alwaysVisibleStationsEnabled?: boolean;
  /** 常時表示の対象とする最小路線数 */
  alwaysVisibleMinRoutes?: number;
  /** 降車駅アラーム（旧バージョンの設定ファイルには無いため任意） */
  arrivalAlertEnabled?: boolean;
  /** 降車駅アラームを鳴らす何分前か */
  arrivalAlertMinutes?: number;
};

type Props = {
  config: MapConfig;
  theme: 'light' | 'dark';
  language: Language;
  onImport: (config: MapConfig) => void;
};

export default function MapConfigPanel({ config, theme, language, onImport }: Props) {
  const colors = getThemeColors(theme);
  const [open, setOpen]           = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [error, setError]         = useState<string | null>(null);
  const [copied, setCopied]       = useState(false);
  const [importDone, setImportDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const jsonStr = JSON.stringify(config, null, 2);

  const handleExportDownload = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `flex-rail-map-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyConfig = (parsed: unknown) => {
    try {
      onImport(parsed as MapConfig);
      setError(null);
      setPasteText('');
      setImportDone(true);
      setTimeout(() => setImportDone(false), 2000);
    } catch {
      setError(translateUI('configImportErrorApply', language));
    }
  };

  const handleImportText = () => {
    try {
      applyConfig(JSON.parse(pasteText));
    } catch {
      setError(translateUI('configImportErrorJson', language));
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try { applyConfig(JSON.parse(ev.target?.result as string)); }
      catch { setError(translateUI('configImportErrorFile', language)); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={section.wrap(colors)}>
      {/* ヘッダー */}
      <div style={section.header} onClick={() => setOpen(v => !v)}>
        <span style={section.arrow(colors)}>{open ? '▼' : '▶'}</span>
        <span style={section.title(colors)}>{translateUI('configSaveLoad', language)}</span>
        {importDone && (
          <span style={{ fontSize: L.fs.xs, color: '#27ae60', marginLeft: L.sp.xs }}>
            {translateUI('configImportDone', language)}
          </span>
        )}
      </div>

      {open && (
        <div style={section.body}>

          {/* エクスポート */}
          <div>
            <div style={text.desc(colors)}>{translateUI('configExportDesc', language)}</div>
            <div style={{ display: 'flex', gap: L.sp.xs }}>
              <Button theme={theme} variant="outline" size="sm" onClick={handleExportDownload}>
                {translateUI('configExportSave', language)}
              </Button>
              <Button theme={theme} variant="outline" size="sm" onClick={handleCopy}>
                {copied ? translateUI('configExportCopied', language) : translateUI('configExportCopy', language)}
              </Button>
            </div>
          </div>

          {/* インポート */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: L.sp.xs }}>
            <div style={text.desc(colors)}>{translateUI('configImportDesc', language)}</div>
            {/*
              * 画面に出ないファイル選択欄。見た目を持たないのでアトムを通さない。
              * 実際に押されるのは下のボタンで、そちらは規格どおり。
              */}
            <input ref={fileInputRef} type="file" accept=".json"
              onChange={handleFileImport} style={{ display: 'none' }} />
            <Button theme={theme} variant="outline" size="sm" fullWidth onClick={() => fileInputRef.current?.click()}>
              {translateUI('configImportFile', language)}
            </Button>
            <TextArea
              theme={theme}
              size="sm"
              value={pasteText}
              onChange={e => { setPasteText(e.target.value); setError(null); }}
              placeholder={translateUI('configImportPaste', language)}
              rows={3}
            />
            <Button
              theme={theme}
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleImportText}
              disabled={!pasteText.trim()}
            >
              {translateUI('configImportApply', language)}
            </Button>
            {error && (
              <div style={{ fontSize: L.fs.xs, color: '#e74c3c' }}>{error}</div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
